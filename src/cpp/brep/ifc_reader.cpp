// ifc_reader.cpp — port of ifc.ts (the kernel's IFC reader) and of the bench helpers that drive it
// (repmap.mjs, units.mjs, the per-product body of bake-kernel-one.mjs without retries or tessellation).

#include "ifc_reader.h"

#include <algorithm>
#include <array>
#include <chrono>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <functional>
#include <limits>
#include <sstream>
#include <stdexcept>
#include <unordered_map>
#include <unordered_set>

#include "../web-ifc/geometry/IfcGeometryProcessor.h"
#include "../web-ifc/schema/ifc-schema.h"
#include <glm/gtc/matrix_transform.hpp>
#include "build.h"
#include "curves.h"
#include "shell.h"
#include "subtract.h"
#include "topology.h"
#include "sampler.h"
#include <CDT.h>
#include <mapbox/earcut.hpp>

namespace brep::ifc {

const Placement4x4 IDENTITY = {{{1, 0, 0, 0}, {0, 1, 0, 0}, {0, 0, 1, 0}, {0, 0, 0, 1}}};

namespace {

using G = LinkedShellGraph;
using GP = std::unique_ptr<G>;

constexpr double NaN = std::numeric_limits<double>::quiet_NaN();
constexpr double PI = 3.141592653589793;

// Facets per full turn, as web-ifc's default.
constexpr int32_t CIRCLE_FACETS = 12;

// ── kernel adapters: the only place that knows the C++ kernel's ownership conventions ───────────

// ── prism minus prisms, in the plane ─────────────────────────────────────────────────────────────
// A solid whose every corner lies on one of two parallel planes and whose other faces are square to
// them is a prism: its section is the same all the way along. When the subject and every tool are
// prisms along one axis and each tool runs through the subject's whole depth (a slab and its
// cut-outs, a wall and its windows), the difference is the subject's section minus the tools'
// sections, extruded: exact, with no shatter, and blind to the coincident caps that make the general
// cut slow. Anything that does not fit (a pocket, a slanted face, a pinched result) returns null and
// the general cut runs as before. BREP_PRISM2D=0 turns it off.
struct PrismCutStats { long tried = 0, done = 0, notPrism = 0, partial = 0, failed = 0, slivers = 0, layered = 0, stepped = 0, touching = 0; double ms = 0; };
PrismCutStats prismCutStats;
uint32_t prismTraceGeo = 0;  // the item being built, for BREP_PRISM2D_TRACE
// How far a wall's far edge may stand off its near edge and the wall still count as square to the
// cut: the importer's plane deviation (web-ifc's TOLERANCE_PLANE_DEVIATION), never less than the weld.
double prismLeanMetres = 0;
void prismFail(int at) {
  prismCutStats.failed++;
  static const long traceId = [] { const char* e = std::getenv("BREP_PRISM2D_TRACE"); return e ? std::atol(e) : -1L; }();
  if ((long)prismTraceGeo == traceId) std::fprintf(stderr, "PRISM2D failed at line %d\n", at);
}

namespace prism2d {

struct Frame { P3 o, u, v, d; };
inline double dot3(const P3& a, const P3& b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
inline P3 sub3(const P3& a, const P3& b) { return {a[0] - b[0], a[1] - b[1], a[2] - b[2]}; }
inline P3 cross3(const P3& a, const P3& b) { return {a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]}; }
inline P3 unit3(const P3& a) { const double l = std::sqrt(dot3(a, a)); return l > 0 ? P3{a[0] / l, a[1] / l, a[2] / l} : P3{0, 0, 0}; }
inline P3 at(const G& g, int32_t v) { return {g.pointXOf(v), g.pointYOf(v), g.pointZOf(v)}; }

P3 facetNormal(const G& g, const std::vector<int32_t>& r) {
  double nx = 0, ny = 0, nz = 0;
  for (size_t a = 0; a < r.size(); a++) {
    const P3 p = at(g, r[a]), q = at(g, r[(a + 1) % r.size()]);
    nx += (p[1] - q[1]) * (p[2] + q[2]);
    ny += (p[2] - q[2]) * (p[0] + q[0]);
    nz += (p[0] - q[0]) * (p[1] + q[1]);
  }
  return unit3({nx, ny, nz});
}

// The prism's two levels along d and the rings of its low cap; false if it is not a prism along d.
// rings: the low cap faces' rings; faceOf: the face each ring belongs to (outer ring and its holes
// share one), so overlapping cap facets are told apart from holes.
// segs: the low edge of every side wall. A closed prism's walls meet edge to edge, so these close into
// its outline (outer and holes) however its caps happen to be cut into facets; the cap facets of a
// stitched solid need not tile exactly, and a crack between two of them read as outside the solid.
// cuts: the outline as point pairs instead, for a band of a stepped solid (see steppedAlong).
struct Section { double lo = 0, hi = 0; std::vector<std::vector<int32_t>> rings; std::vector<int32_t> faceOf; std::vector<std::array<int32_t, 2>> segs; std::vector<std::array<P3, 2>> cuts; };
bool prismAlong(const G& g, const P3& d, double tol, Section& out) {
  const int32_t nv = g.cornerTally();
  if (nv < 6) return false;
  double lo = 1e300, hi = -1e300;
  for (int32_t v = 0; v < nv; v++) { const double h = dot3(at(g, v), d); lo = std::min(lo, h); hi = std::max(hi, h); }
  if (!(hi - lo > 10 * tol)) return false;
  for (int32_t v = 0; v < nv; v++) {
    const double h = dot3(at(g, v), d);
    if (std::fabs(h - lo) > tol && std::fabs(h - hi) > tol) return false;
  }
  // A wall may lean by as much as moves its far edge within the weld distance: its section is then
  // the same as far as the kernel can tell.
  const double fuse = fuseDistance();
  const double lean = std::min(1e-3, std::max(prismLeanMetres, fuse > 0 ? fuse : WELD_METRES) / (hi - lo));
  for (int32_t f = 0; f < g.panelTally(); f++) {
    const std::vector<int32_t> r = g.outerRingOf(f);
    if (r.size() < 3) return false;
    const double c = std::fabs(dot3(facetNormal(g, r), d));
    if (c > 1 - 1e-9) {
      if (std::fabs(dot3(at(g, r[0]), d) - lo) <= tol) { out.rings.push_back(r); out.faceOf.push_back(f); }
    } else if (c > std::max(1e-6, lean)) {
      return false;
    } else {
      for (size_t i = 0; i < r.size(); i++) {
        const int32_t a = r[i], b = r[(i + 1) % r.size()];
        if (std::fabs(dot3(at(g, a), d) - lo) <= tol && std::fabs(dot3(at(g, b), d) - lo) <= tol) out.segs.push_back({a, b});
      }
    }
  }
  for (int32_t l = 0; l < g.loopTally(); l++) {
    const int32_t f = g.loopFacetOf(l);
    if (f < 0 || g.facetOuterOf(f) == l) continue;
    std::vector<int32_t> r = g.ringOwnedBy(l);
    if (r.size() >= 3 && std::fabs(dot3(at(g, r[0]), d) - lo) <= tol &&
        std::fabs(dot3(facetNormal(g, g.outerRingOf(f)), d)) > 1 - 1e-9)
      { out.rings.push_back(std::move(r)); out.faceOf.push_back(f); }
  }
  out.lo = lo;
  out.hi = hi;
  return out.segs.size() >= 3;
}

// A stepped solid along d: every face a cap or a wall, caps at three or more levels. Out: one Section per
// band between consecutive levels, its outline where the walls cross the band's middle height (a wall
// crossed there gives a segment; the ray-parity tests downstream do not need the segments oriented).
bool steppedAlong(const G& g, const P3& d, double tol, std::vector<Section>& out) {
  const int32_t nv = g.cornerTally();
  if (nv < 8) return false;
  std::vector<double> hs;
  hs.reserve((size_t)nv);
  for (int32_t v = 0; v < nv; v++) hs.push_back(dot3(at(g, v), d));
  std::vector<double> sorted = hs;
  std::sort(sorted.begin(), sorted.end());
  std::vector<double> levels;
  for (double h : sorted) if (levels.empty() || h - levels.back() > tol) levels.push_back(h);
  if (levels.size() < 3) return false;
  for (size_t i = 0; i + 1 < levels.size(); i++) if (!(levels[i + 1] - levels[i] > 10 * tol)) return false;
  double thinnest = 1e300;
  for (size_t i = 0; i + 1 < levels.size(); i++) thinnest = std::min(thinnest, levels[i + 1] - levels[i]);
  const double fuse = fuseDistance();
  const double lean = std::min(1e-3, std::max(prismLeanMetres, fuse > 0 ? fuse : WELD_METRES) / thinnest);
  std::vector<int32_t> walls;
  for (int32_t f = 0; f < g.panelTally(); f++) {
    const std::vector<int32_t> r = g.outerRingOf(f);
    if (r.size() < 3) return false;
    const double c = std::fabs(dot3(facetNormal(g, r), d));
    if (c > 1 - 1e-9) continue;
    if (c > std::max(1e-6, lean)) return false;
    walls.push_back(f);
  }
  // a wall with holes: its crossings would need the holes too; left to the general cut
  for (int32_t l = 0; l < g.loopTally(); l++) {
    const int32_t f = g.loopFacetOf(l);
    if (f < 0 || g.facetOuterOf(f) == l) continue;
    if (std::fabs(dot3(facetNormal(g, g.outerRingOf(f)), d)) <= 1 - 1e-9) return false;
  }
  for (size_t i = 0; i + 1 < levels.size(); i++) {
    const double mid = (levels[i] + levels[i + 1]) / 2;
    Section band;
    band.lo = levels[i];
    band.hi = levels[i + 1];
    for (int32_t f : walls) {
      const std::vector<int32_t> r = g.outerRingOf(f);
      std::vector<P3> xs;
      for (size_t k = 0; k < r.size(); k++) {
        const int32_t a = r[k], b = r[(k + 1) % r.size()];
        const double ha = hs[(size_t)a] - mid, hb = hs[(size_t)b] - mid;
        if ((ha < 0) == (hb < 0)) continue;
        const double t = ha / (ha - hb);
        const P3 pa = at(g, a), pb = at(g, b);
        xs.push_back({pa[0] + t * (pb[0] - pa[0]), pa[1] + t * (pb[1] - pa[1]), pa[2] + t * (pb[2] - pa[2])});
      }
      if (xs.empty()) continue;
      if (xs.size() % 2) return false;
      // crossings of one planar wall lie on one line: paired in order along it
      P3 dir = sub3(xs.back(), xs.front());
      std::sort(xs.begin(), xs.end(), [&](const P3& x, const P3& y) { return dot3(x, dir) < dot3(y, dir); });
      for (size_t k = 0; k + 1 < xs.size(); k += 2) band.cuts.push_back({xs[k], xs[k + 1]});
    }
    if (band.cuts.size() >= 3) out.push_back(std::move(band));
  }
  return !out.empty();
}

using Ring2 = std::vector<std::array<double, 2>>;
// Inside a section: inside some face (odd crossings of that face's own rings: its outer ring and
// holes), not by the parity of every ring together, which two overlapping facets would cancel.
// Inside a closed outline given as segments: odd crossings of a ray.
bool insideSegs(const std::vector<Ring2>& segs, double x, double y) {
  bool in = false;
  for (const Ring2& sg : segs) {
    const double xi = sg[0][0], yi = sg[0][1], xj = sg[1][0], yj = sg[1][1];
    if ((yi > y) != (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) in = !in;
  }
  return in;
}
// Segments bucketed by horizontal bands, so a query only meets the segments whose height range
// covers it (an outline of 900 edges against 2,000 triangles was millions of tests).
struct Bands {
  double y0 = 0, h = 1;
  std::vector<std::vector<uint32_t>> band;
  const std::vector<Ring2>* segs = nullptr;
  void build(const std::vector<Ring2>& s, double pad) {
    segs = &s;
    double lo = 1e300, hi = -1e300;
    for (const Ring2& g : s) { lo = std::min({lo, g[0][1], g[1][1]}); hi = std::max({hi, g[0][1], g[1][1]}); }
    const size_t n = std::max<size_t>(1, std::min<size_t>(4096, (size_t)std::sqrt((double)s.size()) * 4));
    y0 = lo - pad;
    h = std::max((hi - lo + 2 * pad) / (double)n, 1e-12);
    band.assign(n, {});
    for (uint32_t i = 0; i < s.size(); i++) {
      const double a = std::min(s[i][0][1], s[i][1][1]) - pad, b = std::max(s[i][0][1], s[i][1][1]) + pad;
      for (size_t k = at(a); k <= at(b); k++) band[k].push_back(i);
    }
  }
  size_t at(double y) const {
    const double k = std::floor((y - y0) / h);
    return k < 0 ? 0 : k >= (double)band.size() ? band.size() - 1 : (size_t)k;
  }
  bool inside(double x, double y) const {
    bool in = false;
    for (uint32_t i : band[at(y)]) {
      const Ring2& sg = (*segs)[i];
      const double xi = sg[0][0], yi = sg[0][1], xj = sg[1][0], yj = sg[1][1];
      if ((yi > y) != (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) in = !in;
    }
    return in;
  }
};
bool insideFaces(const std::vector<Ring2>& rings, const std::vector<int32_t>& faceOf, double x, double y) {
  static thread_local std::unordered_map<int32_t, bool> parity;
  parity.clear();
  for (size_t k = 0; k < rings.size(); k++) {
    const Ring2& r = rings[k];
    bool in = false;
    for (size_t i = 0, j = r.size() - 1; i < r.size(); j = i++) {
      const double xi = r[i][0], yi = r[i][1], xj = r[j][0], yj = r[j][1];
      if ((yi > y) != (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) in = !in;
    }
    if (in) parity[faceOf[k]] = !parity[faceOf[k]];
  }
  for (const auto& [f, odd] : parity) if (odd) return true;
  return false;
}
bool evenOdd(const std::vector<Ring2>& rings, double x, double y) {
  bool in = false;
  for (const Ring2& r : rings)
    for (size_t i = 0, j = r.size() - 1; i < r.size(); j = i++) {
      const double xi = r[i][0], yi = r[i][1], xj = r[j][0], yj = r[j][1];
      if ((yi > y) != (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) in = !in;
    }
  return in;
}

// Some tool stops part way through (a pocket, a step): the subject is cut into layers at every tool
// level, a triangle of the overlay is kept in a layer when it is inside the subject and inside none of
// the tools that span that layer, and the faces come straight from that: a horizontal triangle where
// a triangle is kept on one side of a level and not the other, a wall on every triangle edge kept on
// one side and not the other within a layer. Closed by construction; the merge of coplanar facets
// downstream turns the triangles back into faces.
struct Layered { std::array<CDT::VertInd, 3> v; uint64_t mask; };
GP layeredCut(const std::vector<Layered>& tris, const std::vector<std::pair<const G*, Section>>& ts, const Section& s,
              const std::vector<CDT::V2d<double>>& cv, const Frame& fr, const P3& d, double tol) {
  if (tris.empty()) return nullptr;
  std::vector<double> lv{s.lo, s.hi};
  for (const auto& tq : ts) {
    const Section& q = tq.second;
    if (q.lo > s.lo + tol && q.lo < s.hi - tol) lv.push_back(q.lo);
    if (q.hi > s.lo + tol && q.hi < s.hi - tol) lv.push_back(q.hi);
  }
  std::sort(lv.begin(), lv.end());
  std::vector<double> levels;
  for (double h : lv) if (levels.empty() || h - levels.back() > 10 * tol) levels.push_back(h);
  levels.back() = s.hi;
  if (levels.size() < 2) return nullptr;
  const size_t slabs = levels.size() - 1;
  std::vector<uint64_t> active(slabs, 0);
  for (size_t i = 0; i < slabs; i++)
    for (size_t k = 0; k < ts.size(); k++)
      if (ts[k].second.lo <= levels[i] + 10 * tol && ts[k].second.hi >= levels[i + 1] - 10 * tol) active[i] |= 1ull << k;
  auto keptIn = [&](size_t t, size_t i) { return (tris[t].mask >> 63) && !(tris[t].mask & active[i]); };
  // Every triangle of the subject is in the list, so an edge with no neighbour is the subject's own border.
  auto key = [](CDT::VertInd a, CDT::VertInd b) { return ((uint64_t)a << 32) | (uint64_t)b; };
  std::unordered_map<uint64_t, uint32_t> across;
  across.reserve(tris.size() * 3);
  for (uint32_t t = 0; t < tris.size(); t++)
    for (int e = 0; e < 3; e++) across.emplace(key(tris[t].v[e], tris[t].v[(e + 1) % 3]), t);
  const double base = dot3(fr.o, d);
  auto lift = [&](CDT::VertInd v, double h) {
    const auto& p = cv[v];
    return P3{fr.o[0] + p.x * fr.u[0] + p.y * fr.v[0] + (h - base) * d[0],
              fr.o[1] + p.x * fr.u[1] + p.y * fr.v[1] + (h - base) * d[1],
              fr.o[2] + p.x * fr.u[2] + p.y * fr.v[2] + (h - base) * d[2]};
  };
  std::vector<std::vector<P3>> rings;
  bool anyKept = false;
  for (size_t t = 0; t < tris.size(); t++) {
    const auto& v = tris[t].v;
    for (size_t j = 0; j <= slabs; j++) {
      const bool below = j > 0 && keptIn(t, j - 1), above = j < slabs && keptIn(t, j);
      if (above && !below) rings.push_back({lift(v[0], levels[j]), lift(v[2], levels[j]), lift(v[1], levels[j])});
      if (below && !above) rings.push_back({lift(v[0], levels[j]), lift(v[1], levels[j]), lift(v[2], levels[j])});
    }
    for (size_t i = 0; i < slabs; i++) {
      if (!keptIn(t, i)) continue;
      anyKept = true;
      for (int e = 0; e < 3; e++) {
        const CDT::VertInd a = v[e], b = v[(e + 1) % 3];
        auto u = across.find(key(b, a));
        if (u != across.end() && keptIn(u->second, i)) continue;
        rings.push_back({lift(a, levels[i]), lift(b, levels[i]), lift(b, levels[i + 1]), lift(a, levels[i + 1])});
      }
    }
  }
  if (!anyKept) { prismFail(__LINE__); return nullptr; }
  AssembledShell built = stitchUpShell(rings);
  if (!built.graph || !built.graph->isWatertight() || built.dropped) { prismFail(__LINE__); return nullptr; }
  prismCutStats.done++;
  prismCutStats.layered++;
  return std::move(built.graph);
}

GP cut(const G& subject, const std::vector<const G*>& tools) {
  if (tools.empty() || !subject.isWatertight()) return nullptr;
  const int32_t nv = subject.cornerTally();
  if (nv < 6) return nullptr;
  double blo[3] = {1e300, 1e300, 1e300}, bhi[3] = {-1e300, -1e300, -1e300};
  for (int32_t v = 0; v < nv; v++) {
    const P3 p = at(subject, v);
    for (int k = 0; k < 3; k++) { blo[k] = std::min(blo[k], p[k]); bhi[k] = std::max(bhi[k], p[k]); }
  }
  const double size = std::max({bhi[0] - blo[0], bhi[1] - blo[1], bhi[2] - blo[2]});
  const double tol = 1e-7 * size + 1e-9;

  // The axis: one of the subject's face normals along which it is a prism (cap normals first come up
  // as any normal; a box has three candidates, and the first one every tool also fits is taken).
  std::vector<P3> candidates;
  for (int32_t f = 0; f < subject.panelTally() && candidates.size() < 8; f++) {
    P3 n = facetNormal(subject, subject.outerRingOf(f));
    if (n[0] < 0 || (n[0] == 0 && (n[1] < 0 || (n[1] == 0 && n[2] < 0)))) n = {-n[0], -n[1], -n[2]};
    bool seen = false;
    for (const P3& c : candidates) if (std::fabs(dot3(c, n)) > 1 - 1e-9) { seen = true; break; }
    if (!seen && dot3(n, n) > 0.5) candidates.push_back(n);
  }
  // Two passes over the axes: first one along which every tool runs all the way through (the plain
  // overlay), then one where some stop part way (layer by layer). A box cut at its top is both: the
  // first answer is the simpler one.
  for (int pass = 0; pass < 2; pass++)
  for (const P3& d : candidates) {
    Section s;
    static const long traceAxis = [] { const char* e = std::getenv("BREP_PRISM2D_TRACE"); return e ? std::atol(e) : -1L; }();
    const bool tr = (long)prismTraceGeo == traceAxis;
    if (!prismAlong(subject, d, tol, s)) { if (tr) std::fprintf(stderr, "TRACE axis (%.3f,%.3f,%.3f) pass %d: subject not a prism\n", d[0], d[1], d[2], pass); continue; }
    std::vector<std::pair<const G*, Section>> ts;
    bool fits = true;
    static const bool layersOn = [] { const char* e = std::getenv("BREP_PRISM2D_LAYERS"); return !e || e[0] != '0'; }();
    bool anyPartial = false;
    for (const G* t : tools) {
      // A tool wholly above or below the subject along the axis removes nothing, whatever its shape:
      // passed over before it is asked to be a prism (a stepped slab stacked on the subject).
      {
        double tlo = 1e300, thi = -1e300;
        for (int32_t v = 0; v < t->cornerTally(); v++) { const double h = dot3(at(*t, v), d); tlo = std::min(tlo, h); thi = std::max(thi, h); }
        if (thi <= s.lo + tol || tlo >= s.hi - tol) continue;
      }
      Section q;
      if (!prismAlong(*t, d, tol, q)) {
        // A stepped tool: each of its bands a tool of its own, cut layer by layer.
        std::vector<Section> bands;
        if (!layersOn || pass == 0 || !steppedAlong(*t, d, tol, bands)) {
          if (tr) std::fprintf(stderr, "TRACE axis (%.3f,%.3f,%.3f) pass %d: a tool (%d corners) not a prism\n", d[0], d[1], d[2], pass, t->cornerTally());
          fits = false;
          break;
        }
        for (Section& b : bands) {
          if (b.hi <= s.lo + tol || b.lo >= s.hi - tol) continue;
          anyPartial = true;
          ts.emplace_back(t, std::move(b));
        }
        prismCutStats.stepped++;
        continue;
      }
      if (q.hi <= s.lo + tol || q.lo >= s.hi - tol) continue;  // misses along the axis
      if (q.lo > s.lo + tol || q.hi < s.hi - tol) {
        if (!layersOn || pass == 0) { fits = false; break; }
        anyPartial = true;  // a pocket or a step: cut layer by layer below
      }
      ts.emplace_back(t, std::move(q));
    }
    if (anyPartial && ts.size() > 62) return nullptr;
    if (!fits) continue;
    if (ts.empty()) return nullptr;

    // Plane frame: origin at the subject's first corner, u and v square to d.
    Frame fr;
    fr.d = d;
    fr.o = at(subject, 0);
    const P3 helper = std::fabs(d[0]) < 0.9 ? P3{1, 0, 0} : P3{0, 1, 0};
    fr.u = unit3(cross3(helper, d));
    fr.v = cross3(d, fr.u);
    auto to2 = [&](const G& g, int32_t v) {
      const P3 p = sub3(at(g, v), fr.o);
      return std::array<double, 2>{dot3(p, fr.u), dot3(p, fr.v)};
    };

    // Vertices (merged within tol on a grid) and constraint edges of every ring.
    std::vector<CDT::V2d<double>> verts;
    std::unordered_map<uint64_t, CDT::VertInd> cell;
    auto vertexOf = [&](const std::array<double, 2>& p) -> CDT::VertInd {
      const int64_t qx = (int64_t)std::llround(p[0] / tol), qy = (int64_t)std::llround(p[1] / tol);
      const uint64_t k = ((uint64_t)qx * 0x9E3779B97F4A7C15ull) ^ (uint64_t)qy;
      auto it = cell.find(k);
      if (it != cell.end()) return it->second;
      const CDT::VertInd i = (CDT::VertInd)verts.size();
      verts.push_back(CDT::V2d<double>(p[0], p[1]));
      cell.emplace(k, i);
      return i;
    };
    std::vector<CDT::Edge> edges;
    // Tools are often drawn a few microns off the subject's edges; left so, the overlay keeps
    // sliver triangles between the two lines, and a notch's mouth closes into a hole (a double film).
    // A tool corner within the weld distance of a subject corner takes it, else of a subject edge
    // is moved onto it, so the two borders are one line where they meet.
    const double snapNow = fuseDistance();
    const double snap = std::max(tol, snapNow > 0 ? snapNow : WELD_METRES);
    std::vector<std::array<double, 4>> subjectSegs;
    auto snapped = [&](std::array<double, 2> p) {
      double best = snap;
      std::array<double, 2> to = p;
      for (const auto& sg : subjectSegs) {
        const double dc = std::hypot(p[0] - sg[0], p[1] - sg[1]);
        if (dc <= best) { best = dc; to = {sg[0], sg[1]}; }
      }
      if (to != p) return to;
      best = snap;
      for (const auto& sg : subjectSegs) {
        const double dx = sg[2] - sg[0], dy = sg[3] - sg[1], l2 = dx * dx + dy * dy;
        if (!(l2 > 0)) continue;
        const double t = ((p[0] - sg[0]) * dx + (p[1] - sg[1]) * dy) / l2;
        if (t < 0 || t > 1) continue;
        const double qx = sg[0] + t * dx, qy = sg[1] + t * dy, dq = std::hypot(p[0] - qx, p[1] - qy);
        if (dq <= best) { best = dq; to = {qx, qy}; }
      }
      return to;
    };
    bool snapping = false;
    auto addRings = [&](const G& g, const Section& sec, std::vector<Ring2>& into, std::array<double, 4>& box) {
      box = {1e300, 1e300, -1e300, -1e300};
      const size_t n = sec.cuts.empty() ? sec.segs.size() : sec.cuts.size();
      for (size_t si = 0; si < n; si++) {
        Ring2 ring;
        std::vector<CDT::VertInd> ids;
        for (int e = 0; e < 2; e++) {
          std::array<double, 2> q2;
          if (sec.cuts.empty()) q2 = to2(g, sec.segs[si][e]);
          else { const P3 pr = sub3(sec.cuts[si][e], fr.o); q2 = {dot3(pr, fr.u), dot3(pr, fr.v)}; }
          const auto p = snapping ? snapped(q2) : q2;
          ring.push_back(p);
          ids.push_back(vertexOf(p));
          box = {std::min(box[0], p[0]), std::min(box[1], p[1]), std::max(box[2], p[0]), std::max(box[3], p[1])};
        }
        if (ids[0] != ids[1]) edges.push_back(CDT::Edge(std::min(ids[0], ids[1]), std::max(ids[0], ids[1])));
        into.push_back(std::move(ring));
      }
    };
    std::vector<Ring2> subjectRings;
    std::array<double, 4> subjectBox;
    addRings(subject, s, subjectRings, subjectBox);
    for (const Ring2& r : subjectRings)
      for (size_t i = 0; i < r.size(); i++) subjectSegs.push_back({r[i][0], r[i][1], r[(i + 1) % r.size()][0], r[(i + 1) % r.size()][1]});
    snapping = true;
    std::vector<std::vector<Ring2>> toolRings(ts.size());
    std::vector<std::array<double, 4>> toolBox(ts.size());
    for (size_t k = 0; k < ts.size(); k++) addRings(*ts[k].first, ts[k].second, toolRings[k], toolBox[k]);
    Bands subjectBands;
    subjectBands.build(subjectRings, 0);
    std::vector<Bands> toolBands(ts.size());
    for (size_t k = 0; k < ts.size(); k++) toolBands[k].build(toolRings[k], 0);
    std::sort(edges.begin(), edges.end(), [](const CDT::Edge& a, const CDT::Edge& b) {
      return a.v1() != b.v1() ? a.v1() < b.v1() : a.v2() < b.v2();
    });
    edges.erase(std::unique(edges.begin(), edges.end()), edges.end());

    // Triangulate the overlay; keep the triangles inside the subject and outside every tool.
    const double weldNow = fuseDistance();
    const double weldWidth = std::max(tol, weldNow > 0 ? weldNow : WELD_METRES);
    std::vector<std::array<CDT::VertInd, 3>> kept;
    std::vector<Layered> layered;  // every triangle inside the subject, with the tools it is inside
    std::vector<CDT::V2d<double>> cv;
    try {
      CDT::Triangulation<double> cdt(CDT::VertexInsertionOrder::AsProvided, CDT::IntersectingConstraintEdges::TryResolve, tol);
      cdt.insertVertices(verts);
      cdt.insertEdges(edges);
      cdt.eraseSuperTriangle();
      cv = cdt.vertices;
      for (const auto& t : cdt.triangles) {
        const auto& a = cv[t.vertices[0]];
        const auto& b = cv[t.vertices[1]];
        const auto& c = cv[t.vertices[2]];
        const double area2 = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
        // Layer by layer, a sliver triangle along two coincident borders (its centre on both) is
        // classified either way and, kept in one layer, walls itself on both sides: a double film.
        // Those cuts go to the general path.
        if (anyPartial) {
          const double perim = std::hypot(b.x - a.x, b.y - a.y) + std::hypot(c.x - b.x, c.y - b.y) + std::hypot(a.x - c.x, a.y - c.y);
          if (!(area2 > 0) || area2 / perim <= weldWidth) {
            // A sliver plainly outside the subject (its middle outside, and farther than the weld
            // from the subject's border) is kept in no layer: it cannot film. Passed over.
            if (area2 > 0) {
              const double mx = (a.x + b.x + c.x) / 3, my = (a.y + b.y + c.y) / 3;
              if (!subjectBands.inside(mx, my)) {
                double nearest = 1e300;
                for (const auto& sg : subjectSegs) {
                  const double dx = sg[2] - sg[0], dy = sg[3] - sg[1], l2 = dx * dx + dy * dy;
                  double t = l2 > 0 ? ((mx - sg[0]) * dx + (my - sg[1]) * dy) / l2 : 0;
                  t = std::max(0.0, std::min(1.0, t));
                  nearest = std::min(nearest, std::hypot(mx - (sg[0] + t * dx), my - (sg[1] + t * dy)));
                }
                if (nearest > weldWidth) continue;
                if (tr) std::fprintf(stderr, "TRACE sliver outside, %.3g from the subject's border\n", nearest);
              } else if (tr) std::fprintf(stderr, "TRACE sliver inside the subject\n");
            }
            if (tr) std::fprintf(stderr, "TRACE sliver (%.6f,%.6f) (%.6f,%.6f) (%.6f,%.6f) area2 %.3g\n", a.x, a.y, b.x, b.y, c.x, c.y, area2);
            throw std::runtime_error("sliver");
          }
        }
        if (!(area2 > 0)) continue;
        // Where the point is: bit 63 inside the subject, bit k inside tool k (all tools when they all
        // run through, so only "kept or not" matters; one bit each when some stop part way).
        auto maskAt = [&](double x, double y) -> uint64_t {
          if (!subjectBands.inside(x, y)) return 0;
          uint64_t m = 1ull << 63;
          for (size_t k = 0; k < ts.size(); k++) {
            const auto& bx = toolBox[k];
            if (x < bx[0] || x > bx[2] || y < bx[1] || y > bx[3]) continue;
            if (toolBands[k].inside(x, y)) {
              if (!anyPartial) return 0;
              m |= 1ull << k;
            }
          }
          return m;
        };
        const double x = (a.x + b.x + c.x) / 3, y = (a.y + b.y + c.y) / 3;
        const uint64_t mask = maskAt(x, y);
        // A triangle crossing a border the triangulation failed to insert (nearly collinear overlaps)
        // answers differently at different points inside it: then the overlay is not to be trusted.
        for (const auto* v : {&a, &b, &c})
          if (maskAt((2 * x + v->x) / 3, (2 * y + v->y) / 3) != mask) throw std::runtime_error("crossed");
        if (anyPartial) { if (mask) layered.push_back({{t.vertices[0], t.vertices[1], t.vertices[2]}, mask}); }
        else if (mask) kept.push_back({t.vertices[0], t.vertices[1], t.vertices[2]});
      }
    } catch (const std::exception& e) {
      if (tr) std::fprintf(stderr, "TRACE overlay refused: %s\n", e.what());
      prismCutStats.failed++;
      if (anyPartial) continue;  // another axis may still do
      return nullptr;
    } catch (...) {
      prismCutStats.failed++;
      if (anyPartial) continue;  // another axis may still do
      return nullptr;
    }
    if (anyPartial) {
      if (GP r = layeredCut(layered, ts, s, cv, fr, d, tol)) return r;
      continue;
    }
    if (kept.empty()) { prismFail(__LINE__); return nullptr; }  // swallowed: left to the general cut

    // The kept region's border: directed edges whose reverse is not kept; one way out of every corner.
    auto key = [](CDT::VertInd a, CDT::VertInd b) { return ((uint64_t)a << 32) | (uint64_t)b; };
    std::unordered_set<uint64_t> dir;
    dir.reserve(kept.size() * 3);
    for (const auto& t : kept) for (int i = 0; i < 3; i++) dir.insert(key(t[i], t[(i + 1) % 3]));
    // A corner the border passes twice (two parts of the kept region touching at a point, e.g. a
    // sliver wedge where a tool edge runs a little off the subject's) has two ways out: each way in
    // takes the way out that keeps the region on its left, the smallest clockwise turn from the way
    // back, so each part closes into a loop of its own. Sliver loops are dropped below, and parts that
    // still touch are refused by the border-proximity check, as before.
    std::unordered_map<CDT::VertInd, CDT::VertInd> nextOf;
    std::unordered_map<CDT::VertInd, std::vector<CDT::VertInd>> pinchOuts;
    for (const auto& t : kept)
      for (int i = 0; i < 3; i++) {
        const CDT::VertInd a = t[i], b = t[(i + 1) % 3];
        if (dir.count(key(b, a))) continue;
        auto pinched = pinchOuts.find(a);
        if (pinched != pinchOuts.end()) { pinched->second.push_back(b); continue; }
        auto [it, fresh] = nextOf.emplace(a, b);
        if (fresh) continue;
        pinchOuts[a] = {it->second, b};
        nextOf.erase(it);
      }
    auto turnOut = [&](CDT::VertInd from, CDT::VertInd v) -> long {
      auto it = pinchOuts.find(v);
      if (it == pinchOuts.end() || it->second.empty()) return -1;
      const double rx = cv[from].x - cv[v].x, ry = cv[from].y - cv[v].y;
      long best = -1;
      double bestTurn = 1e300;
      for (size_t k = 0; k < it->second.size(); k++) {
        const auto& w = cv[it->second[k]];
        const double ox = w.x - cv[v].x, oy = w.y - cv[v].y;
        const double ccw = std::atan2(rx * oy - ry * ox, rx * ox + ry * oy);
        const double cw = ccw <= 0 ? -ccw : 2 * PI - ccw;
        if (cw > 0 && cw < bestTurn) { bestTurn = cw; best = (long)k; }
      }
      if (best < 0) return -1;
      const CDT::VertInd w = it->second[(size_t)best];
      it->second.erase(it->second.begin() + best);
      return (long)w;
    };
    std::vector<std::vector<CDT::VertInd>> loops;
    while (!nextOf.empty()) {
      const CDT::VertInd start = nextOf.begin()->first;
      std::vector<CDT::VertInd> loop;
      CDT::VertInd v = start, prev = start;
      do {
        CDT::VertInd w;
        if (pinchOuts.count(v)) {
          const long t = turnOut(prev, v);
          if (t < 0) { prismFail(__LINE__); return nullptr; }
          w = (CDT::VertInd)t;
        } else {
          auto it = nextOf.find(v);
          if (it == nextOf.end()) { prismFail(__LINE__); return nullptr; }
          w = it->second;
          nextOf.erase(it);
        }
        loop.push_back(v);
        prev = v;
        v = w;
      } while (v != start && loop.size() <= cv.size());
      if (v != start) { prismFail(__LINE__); return nullptr; }
      // Drop corners where the border runs straight on (Steiner points of the overlay) and the tips of
      // zero-width spikes (the border going out and back along one line, where a sliver triangle of
      // the overlay was dropped); a removal can make a new one, so until none is left. A spike left in
      // a cap ring triangulates differently with each winding: the low cap came out whole.
      // "On the line" is within the weld distance of the line through its neighbours: tools are often
      // drawn a few microns off the subject's edges, and a spike that leans by that much is still one.
      const double fuseNow = fuseDistance();
      const double onLine = std::max(tol, fuseNow > 0 ? fuseNow : WELD_METRES);
      std::vector<CDT::VertInd> clean = loop;
      for (bool changed = true; changed && clean.size() >= 3;) {
        changed = false;
        const size_t n = clean.size();
        for (size_t i = 0; i < n; i++) {
          const auto& p = cv[clean[(i + n - 1) % n]];
          const auto& q = cv[clean[i]];
          const auto& r = cv[clean[(i + 1) % n]];
          const double ex = q.x - p.x, ey = q.y - p.y, fx = r.x - q.x, fy = r.y - q.y;
          const double le = std::sqrt(ex * ex + ey * ey), lf = std::sqrt(fx * fx + fy * fy);
          const double gx = r.x - p.x, gy = r.y - p.y, lg = std::sqrt(gx * gx + gy * gy);
          const double off = lg > onLine ? std::fabs(gx * ey - gy * ex) / lg : 0;  // q from line p-r
          if (le <= tol || lf <= tol || off <= onLine) {
            clean.erase(clean.begin() + (long)i);
            changed = true;
            break;
          }
        }
      }
      if (clean.size() < 3) continue;  // a loop that was nothing but a spike
      loops.push_back(std::move(clean));
    }
    for (const auto& [pv, outs] : pinchOuts) if (!outs.empty()) { prismFail(__LINE__); return nullptr; }  // a way out never taken
    auto area = [&](const std::vector<CDT::VertInd>& l) {
      double a = 0;
      for (size_t i = 0, j = l.size() - 1; i < l.size(); j = i++) a += cv[l[j]].x * cv[l[i]].y - cv[l[i]].x * cv[l[j]].y;
      return a / 2;
    };
    // Where a tool's border runs within tol of the subject's, the overlay leaves sliver triangles
    // between the two lines, and those that test as kept form a region (or a crack) with no width:
    // extruded, a zero-thickness tab. A loop narrower than a few tol is dropped.
    auto perimeter = [&](const std::vector<CDT::VertInd>& l) {
      double p = 0;
      for (size_t i = 0, j = l.size() - 1; i < l.size(); j = i++) p += std::hypot(cv[l[i]].x - cv[l[j]].x, cv[l[i]].y - cv[l[j]].y);
      return p;
    };
    std::vector<size_t> outers, holes;
    long slivers = 0;
    for (size_t i = 0; i < loops.size(); i++) {
      const double a = area(loops[i]);
      if (std::fabs(a) <= 10 * tol * perimeter(loops[i])) { slivers++; continue; }
      (a > 0 ? outers : holes).push_back(i);
    }
    prismCutStats.slivers += slivers;
    if (outers.empty()) { prismFail(__LINE__); return nullptr; }
    std::vector<std::vector<size_t>> holesOf(loops.size());
    for (size_t h : holes) {
      const auto& p = cv[loops[h][0]];
      size_t best = SIZE_MAX;
      double bestArea = 1e300;
      for (size_t o : outers) {
        Ring2 r;
        for (CDT::VertInd v : loops[o]) r.push_back({cv[v].x, cv[v].y});
        // a hole corner sits on no other border (that would be a pinch), so its parity is clean
        const double ao = area(loops[o]);
        if (evenOdd({r}, p.x, p.y) && ao < bestArea) { best = o; bestArea = ao; }
      }
      if (best == SIZE_MAX) { prismFail(__LINE__); return nullptr; }
      holesOf[best].push_back(h);
    }
    // Every border edge must run along an edge of the subject or of a tool: the overlay's triangles
    // never cross a constraint, so an edge that lies on none means a constraint the triangulation
    // could not insert (nearly collinear overlaps) and a triangle classified across it. The general
    // cut takes those.
    {
      std::vector<Ring2> input = subjectRings;
      for (const auto& rs : toolRings) input.insert(input.end(), rs.begin(), rs.end());
      Bands inputBands;
      inputBands.build(input, weldWidth);
      auto onAnySegment = [&](double px, double py) {
        for (uint32_t i : inputBands.band[inputBands.at(py)]) {
          const Ring2& sg = input[i];
          const double dx = sg[1][0] - sg[0][0], dy = sg[1][1] - sg[0][1], l2 = dx * dx + dy * dy;
          double t = l2 > 0 ? ((px - sg[0][0]) * dx + (py - sg[0][1]) * dy) / l2 : 0;
          t = std::max(0.0, std::min(1.0, t));
          if (std::hypot(px - (sg[0][0] + t * dx), py - (sg[0][1] + t * dy)) <= weldWidth) return true;
        }
        return false;
      };
      // only the loops that make faces: a sliver loop dropped above adds nothing to check
      std::vector<char> making(loops.size(), 0);
      for (size_t o : outers) making[o] = 1;
      for (size_t h : holes) making[h] = 1;
      for (size_t li = 0; li < loops.size(); li++) {
        if (!making[li]) continue;
        const auto& l = loops[li];
        for (size_t k = 0; k < l.size(); k++) {
          const auto& p = cv[l[k]];
          const auto& q = cv[l[(k + 1) % l.size()]];
          // after the straight-on corners were dropped an edge may run along several input edges,
          // so each of a few points along it must lie on some input edge
          for (double f : {0.0, 0.25, 0.5, 0.75, 1.0}) {
            const double sx = p.x + f * (q.x - p.x), sy = p.y + f * (q.y - p.y);
            if (!onAnySegment(sx, sy)) {
              if (tr) {
                std::fprintf(stderr, "TRACE border edge (%.7f,%.7f)-(%.7f,%.7f) off every input edge at f=%.2f (loop of %zu corners)\n", p.x, p.y, q.x, q.y, f, l.size());
                for (const Ring2& sg : input) {
                  const double dx = sg[1][0] - sg[0][0], dy = sg[1][1] - sg[0][1], l2 = dx * dx + dy * dy;
                  double t = l2 > 0 ? ((sx - sg[0][0]) * dx + (sy - sg[0][1]) * dy) / l2 : 0;
                  t = std::max(0.0, std::min(1.0, t));
                  const double dd = std::hypot(sx - (sg[0][0] + t * dx), sy - (sg[0][1] + t * dy));
                  if (dd < 2e-4) std::fprintf(stderr, "TRACE   input (%.7f,%.7f)-(%.7f,%.7f) at %.3g\n", sg[0][0], sg[0][1], sg[1][0], sg[1][1], dd);
                }
              }
              prismFail(__LINE__);
              return nullptr;
            }
          }
        }
      }
    }
    // No border may come within the weld distance of another (a hole grazing its outer ring or
    // another hole, two regions kissing): extruded, that is a film with no thickness. The general
    // cut takes those. Two regions meeting at one shared corner are not a film (every border edge
    // near that corner ends at it): they are built as separate prisms below.
    bool touching = false;
    std::vector<size_t> regionOf(loops.size(), SIZE_MAX);  // the outer ring a loop belongs to
    for (size_t o : outers) {
      regionOf[o] = o;
      for (size_t h : holesOf[o]) regionOf[h] = o;
    }
    {
      std::vector<char> used(loops.size(), 0);
      for (size_t o : outers) used[o] = 1;
      for (size_t h : holes) used[h] = 1;
      std::vector<Ring2> segs;
      std::vector<size_t> segLoop;
      std::vector<std::array<CDT::VertInd, 2>> segEnds;
      for (size_t i = 0; i < loops.size(); i++) {
        if (!used[i]) continue;
        const auto& l = loops[i];
        for (size_t k = 0; k < l.size(); k++) {
          const auto& p = cv[l[k]];
          const auto& q = cv[l[(k + 1) % l.size()]];
          segs.push_back({{p.x, p.y}, {q.x, q.y}});
          segLoop.push_back(i);
          segEnds.push_back({l[k], l[(k + 1) % l.size()]});
        }
      }
      Bands near;
      near.build(segs, weldWidth);
      for (size_t i = 0; i < loops.size(); i++) {
        if (!used[i]) continue;
        for (CDT::VertInd v : loops[i]) {
          const double px = cv[v].x, py = cv[v].y;
          for (uint32_t j : near.band[near.at(py)]) {
            if (segLoop[j] == i) continue;
            const Ring2& sg = segs[j];
            const double dx = sg[1][0] - sg[0][0], dy = sg[1][1] - sg[0][1], l2 = dx * dx + dy * dy;
            double t = l2 > 0 ? ((px - sg[0][0]) * dx + (py - sg[0][1]) * dy) / l2 : 0;
            t = std::max(0.0, std::min(1.0, t));
            if (segEnds[j][0] == v || segEnds[j][1] == v || std::hypot(px - (sg[0][0] + t * dx), py - (sg[0][1] + t * dy)) <= weldWidth) {
              // Borders of two different regions meeting (at a shared corner, a corner on the other's
              // edge, a crack narrower than the weld; an island in another region's hole) are two
              // separate prisms: built apart below. Two borders of one region (a hole meeting its
              // outer ring or another of its holes) would film that face: left to the general cut.
              if (regionOf[i] != regionOf[segLoop[j]]) { touching = true; continue; }
              if (tr) std::fprintf(stderr, "TRACE loop %zu (%zu corners, area %.3g) corner (%.6f, %.6f) near loop %zu (%zu corners, area %.3g)\n", i, loops[i].size(), area(loops[i]), px, py, segLoop[j], loops[segLoop[j]].size(), area(loops[segLoop[j]]));
              prismFail(__LINE__);
              return nullptr;
            }
          }
        }
      }
    }

    // Faces: both caps of every region (with its holes) and a wall per border edge.
    const double base = dot3(fr.o, d);
    auto lift = [&](CDT::VertInd v, double h) {
      const auto& p = cv[v];
      return P3{fr.o[0] + p.x * fr.u[0] + p.y * fr.v[0] + (h - base) * d[0],
                fr.o[1] + p.x * fr.u[1] + p.y * fr.v[1] + (h - base) * d[1],
                fr.o[2] + p.x * fr.u[2] + p.y * fr.v[2] + (h - base) * d[2]};
    };
    std::vector<std::vector<P3>> rings;
    std::vector<std::vector<std::vector<P3>>> voids;
    auto region = [&](size_t o, std::vector<std::vector<P3>>& rings, std::vector<std::vector<std::vector<P3>>>& voids) {
      auto wall = [&](const std::vector<CDT::VertInd>& l) {
        for (size_t i = 0; i < l.size(); i++) {
          const CDT::VertInd a = l[i], b = l[(i + 1) % l.size()];
          rings.push_back({lift(a, s.lo), lift(b, s.lo), lift(b, s.hi), lift(a, s.hi)});
          voids.emplace_back();
        }
      };
      std::vector<P3> top, bottom;
      for (CDT::VertInd v : loops[o]) top.push_back(lift(v, s.hi));
      for (auto it = loops[o].rbegin(); it != loops[o].rend(); ++it) bottom.push_back(lift(*it, s.lo));
      std::vector<std::vector<P3>> topHoles, bottomHoles;
      for (size_t h : holesOf[o]) {
        std::vector<P3> th, bh;
        for (CDT::VertInd v : loops[h]) th.push_back(lift(v, s.hi));
        for (auto it = loops[h].rbegin(); it != loops[h].rend(); ++it) bh.push_back(lift(*it, s.lo));
        topHoles.push_back(std::move(th));
        bottomHoles.push_back(std::move(bh));
      }
      rings.push_back(std::move(top));
      voids.push_back(std::move(topHoles));
      rings.push_back(std::move(bottom));
      voids.push_back(std::move(bottomHoles));
      wall(loops[o]);
      for (size_t h : holesOf[o]) wall(loops[h]);
    };
    for (size_t o : outers) region(o, rings, voids);
    static const long traceId = [] { const char* e = std::getenv("BREP_PRISM2D_TRACE"); return e ? std::atol(e) : -1L; }();
    if ((long)prismTraceGeo == traceId) {
      double total = 0, absTotal = 0;
      for (const Ring2& r : subjectRings) {
        double a = 0;
        for (size_t i = 0, j = r.size() - 1; i < r.size(); j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1];
        total += a / 2;
        absTotal += std::fabs(a / 2);
        std::fprintf(stderr, "TRACE subject ring %zu corners, area %.6g\n", r.size(), a / 2);
      }
      std::fprintf(stderr, "TRACE subject rings %zu signed %.6g abs %.6g; tools %zu\n", subjectRings.size(), total, absTotal, toolRings.size());
      for (const auto& rs : toolRings) {
        std::fprintf(stderr, "TRACE tool:");
        for (const Ring2& r : rs) {
          double a = 0;
          for (size_t i = 0, j = r.size() - 1; i < r.size(); j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1];
          std::fprintf(stderr, " ring %zu corners area %.6g;", r.size(), a / 2);
        }
        std::fprintf(stderr, "\n");
      }
      double keptArea = 0;
      for (const auto& t : kept) {
        const auto& a = cv[t[0]];
        const auto& b = cv[t[1]];
        const auto& c = cv[t[2]];
        keptArea += ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / 2;
      }
      double loopArea = 0;
      for (size_t o : outers) loopArea += area(loops[o]);
      for (size_t h : holes) loopArea += area(loops[h]);
      std::fprintf(stderr, "TRACE kept triangles area %.6g, loops area %.6g\n", keptArea, loopArea);
      for (size_t i = 0; i < loops.size(); i++) {
        std::fprintf(stderr, "TRACE loop %zu area %.6g:", i, area(loops[i]));
        for (CDT::VertInd v : loops[i]) std::fprintf(stderr, " (%.4f,%.4f)", cv[v].x, cv[v].y);
        std::fprintf(stderr, "\n");
      }
    }
    AssembledShell built;
    if (!touching) {
      built = stitchUpShell(rings, voids);
    } else {
      // One closed prism per region, joined without welding: the corner two regions share is two
      // corners, one in each, so every edge keeps exactly two faces.
      GP joined;
      bool first = true;
      for (size_t o : outers) {
        std::vector<std::vector<P3>> r1;
        std::vector<std::vector<std::vector<P3>>> v1;
        region(o, r1, v1);
        AssembledShell one = stitchUpShell(r1, v1);
        if (!one.graph || !one.graph->isWatertight() || one.dropped || one.holed) { joined.reset(); break; }
        const G& g1 = *one.graph;
        if (!joined) joined = std::make_unique<G>(g1.tolerance);
        std::vector<int32_t> to(static_cast<size_t>(g1.cornerTally()));
        for (int32_t v = 0; v < g1.cornerTally(); v++)
          to[(size_t)v] = first ? joined->placeCorner(g1.pointXOf(v), g1.pointYOf(v), g1.pointZOf(v))
                                : joined->placeLoneCorner(g1.pointXOf(v), g1.pointYOf(v), g1.pointZOf(v));
        first = false;
        bool ok = true;
        std::vector<int32_t> facetOf(static_cast<size_t>(g1.panelTally()), -1);
        for (int32_t f = 0; f < g1.panelTally() && ok; f++) {
          std::vector<int32_t> r = g1.outerRingOf(f);
          for (int32_t& v : r) v = to[(size_t)v];
          facetOf[(size_t)f] = joined->appendPanel(r);
          if (facetOf[(size_t)f] < 0) ok = false;
        }
        for (int32_t l = 0; l < g1.loopTally() && ok; l++) {
          const int32_t f = g1.loopFacetOf(l);
          if (f < 0 || g1.facetOuterOf(f) == l) continue;
          std::vector<int32_t> r = g1.ringOwnedBy(l);
          for (int32_t& v : r) v = to[(size_t)v];
          if (joined->appendVoid(facetOf[(size_t)f], r) < 0) ok = false;
        }
        if (!ok) { joined.reset(); break; }
      }
      if (joined) {
        joined->seal();
        built.graph = std::move(joined);
        prismCutStats.touching++;
      }
    }
    if (!built.graph || !built.graph->isWatertight() || built.dropped || built.holed) {
      if ((long)prismTraceGeo == traceId) std::fprintf(stderr, "TRACE stitch: graph %d watertight %d dropped %d holed %d\n", built.graph ? 1 : 0, built.graph && built.graph->isWatertight() ? 1 : 0, built.dropped, built.holed);
      prismFail(__LINE__);
      return nullptr;
    }
    static const bool check = std::getenv("BREP_PRISM2D_CHECK") != nullptr;
    if (check) {
      // Both caps must cover the same area: the facets' Newell areas along +d and -d, holes subtracted.
      const G& g = *built.graph;
      double up = 0, down = 0;
      for (int32_t l = 0; l < g.loopTally(); l++) {
        const int32_t f = g.loopFacetOf(l);
        if (f < 0) continue;
        const std::vector<int32_t> r = g.ringOwnedBy(l);
        double nx = 0, ny = 0, nz = 0;
        for (size_t a = 0; a < r.size(); a++) {
          const P3 p = at(g, r[a]), q = at(g, r[(a + 1) % r.size()]);
          nx += (p[1] - q[1]) * (p[2] + q[2]);
          ny += (p[2] - q[2]) * (p[0] + q[0]);
          nz += (p[0] - q[0]) * (p[1] + q[1]);
        }
        const double a = (nx * d[0] + ny * d[1] + nz * d[2]) / 2;
        // a cap facet at the low level must face down, at the high level up; anything else is a flap
        const double h = dot3(at(g, r[0]), d);
        if (std::fabs(a) > 1e-12 && ((std::fabs(h - s.lo) <= tol && a > 0) || (std::fabs(h - s.hi) <= tol && a < 0)))
          std::fprintf(stderr, "PRISM2D flap: facet at %s facing %s, area %.6g\n", std::fabs(h - s.lo) <= tol ? "lo" : "hi", a > 0 ? "up" : "down", std::fabs(a));
        if (a > 0) up += a; else down -= a;
      }
      if (std::fabs(up - down) > 1e-6 * std::max(up, down)) std::fprintf(stderr, "PRISM2D caps differ: up %.6g down %.6g facets %d loops %d\n", up, down, g.panelTally(), g.loopTally());
    }
    prismCutStats.done++;
    return std::move(built.graph);
  }
  prismCutStats.notPrism++;
  return nullptr;
}

}  // namespace prism2d

// cutAway / subtract may hand back `keep` itself (TS identity); then the caller's graph is moved out.
bool prism2dOn() { static const bool on = [] { const char* e = std::getenv("BREP_PRISM2D"); return !e || e[0] != '0'; }(); return on; }
GP prismCut(const G& keep, const std::vector<const G*>& tools) {
  if (!prism2dOn()) return nullptr;
  const auto t0 = std::chrono::steady_clock::now();
  prismCutStats.tried++;
  GP out = prism2d::cut(keep, tools);
  prismCutStats.ms += std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - t0).count();
  return out;
}

// A cut repeated exactly (copies of one wall with its openings, one slab with its cut-outs: the same
// subject and tools, corner for corner) is done once and copied after. The key is the graphs'
// corners and facet rings, the weld distance and the skip knob; the whole input is compared on a hit.
struct CutMemo {
  struct Entry { std::vector<double> input; std::shared_ptr<const LinkedShellGraph> result; };
  std::unordered_map<uint64_t, Entry> map;
  long hits = 0, misses = 0;
  ~CutMemo() { if (std::getenv("BREP_CUT_MEMO_STATS")) std::fprintf(stderr, "CUTMEMO hits %ld misses %ld\n", hits, misses); }
};
CutMemo cutMemo;
bool cutMemoOn() { static const bool on = [] { const char* e = std::getenv("BREP_CUT_MEMO"); return !e || e[0] != '0'; }(); return on; }
uint64_t cutKey(const std::vector<const G*>& graphs, std::vector<double>& input) {
  uint64_t h = 0x9E3779B97F4A7C15ull;
  auto mix = [&](double v) {
    input.push_back(v);
    uint64_t b;
    std::memcpy(&b, &v, 8);
    b += 0x9E3779B97F4A7C15ull + (h << 6) + (h >> 2);
    b = (b ^ (b >> 30)) * 0xBF58476D1CE4E5B9ull;
    b = (b ^ (b >> 27)) * 0x94D049BB133111EBull;
    h ^= b ^ (b >> 31);
  };
  mix(fuseDistance());
  mix(skipUntouchingToolsOn() ? 1 : 0);
  for (const G* g : graphs) {
    mix(-7);
    mix((double)g->cornerTally());
    for (int32_t v = 0; v < g->cornerTally(); v++) { mix(g->pointXOf(v)); mix(g->pointYOf(v)); mix(g->pointZOf(v)); }
    for (int32_t l = 0; l < g->loopTally(); l++) {
      mix(-3);
      mix((double)g->loopFacetOf(l));
      for (int32_t c : g->ringOwnedBy(l)) mix((double)c);
    }
  }
  return h;
}
GP memoCut(const G& keep, const std::vector<const G*>& tools, bool& isKeep, const std::function<GP(bool&)>& run) {
  isKeep = false;
  if (!cutMemoOn()) return run(isKeep);
  std::vector<const G*> all{&keep};
  all.insert(all.end(), tools.begin(), tools.end());
  std::vector<double> input;
  const uint64_t key = cutKey(all, input);
  auto hit = cutMemo.map.find(key);
  if (hit != cutMemo.map.end() && hit->second.input == input) {
    cutMemo.hits++;
    return std::make_unique<LinkedShellGraph>(*hit->second.result);
  }
  cutMemo.misses++;
  GP out = run(isKeep);
  if (out && !isKeep) {
    if (cutMemo.map.size() > 5000) cutMemo.map.clear();
    cutMemo.map[key] = CutMemo::Entry{std::move(input), std::make_shared<const LinkedShellGraph>(*out)};
  }
  return out;
}

GP kCutAway(GP& keep, std::vector<GP>& tools) {
  std::vector<const G*> ptrs;
  ptrs.reserve(tools.size());
  for (const GP& t : tools) ptrs.push_back(t.get());
  bool isKeep = false;
  GP out = memoCut(*keep, ptrs, isKeep, [&](bool& kept) -> GP {
    if (GP fast = prismCut(*keep, ptrs)) return fast;
    return cutAway(*keep, ptrs, &kept);
  });
  return isKeep ? std::move(keep) : std::move(out);
}
GP kSubtract(GP& keep, const G& remove) {
  bool isKeep = false;
  GP out = memoCut(*keep, {&remove}, isKeep, [&](bool& kept) -> GP {
    if (GP fast = prismCut(*keep, {&remove})) return fast;
    return subtract(*keep, remove, &kept);
  });
  return isKeep ? std::move(keep) : std::move(out);
}
GP kClip(const G& solid, const P3& through, const P3& normal) { return clipToHalfSpace(solid, through, normal); }
GP kUnion(const G& a, const G& b) { return union_(a, b); }
GP kIntersect(const G& a, const G& b) { return intersect(a, b); }
std::string kWhy() { return whySubtractDeclined(); }

// ── JS arithmetic the TS relies on (V8-exact helpers from curves.h) ─────────────────────────────

double hypot2(double a, double b) { return jsHypot2(a, b); }
double hypot3(double a, double b, double c) { return jsHypot3(a, b, c); }

double jsSign(double v) { return std::isnan(v) ? NaN : v > 0 ? 1 : v < 0 ? -1 : v; }
bool truthy(double v) { return v != 0 && !std::isnan(v); }
bool isInteger(double v) { return std::isfinite(v) && std::floor(v) == v; }

std::string upper(std::string s) {
  for (char& c : s) if (c >= 'a' && c <= 'z') c = char(c - 'a' + 'A');
  return s;
}
std::string lower(std::string s) {
  for (char& c : s) if (c >= 'A' && c <= 'Z') c = char(c - 'A' + 'a');
  return s;
}

// ── entity access (TS `line`, `asPlainNumber`, `asHandle`, `ifcKindOf`) ─────────────────────────

double asPlainNumber(const Value& v) {
  if (v.kind == Value::Kind::Ref) return (double)v.ref;
  return v.number();
}

uint32_t asHandle(const Value& v) {
  if (v.kind == Value::Kind::Ref) return v.ref;
  const double n = v.number();
  if (n >= 1 && n <= 4294967295.0 && std::floor(n) == n) return (uint32_t)n;
  return 0;
}

std::optional<bool> asBool(const Value& v) {
  if (v.kind == Value::Kind::Bool) return v.flag;
  if (v.kind == Value::Kind::Typed && !v.list.empty() && v.list[0].kind == Value::Kind::Bool) return v.list[0].flag;
  return std::nullopt;
}

// The three IFC4 entities the TS rebuilds from raw arguments when the typed reader refuses them.
bool rawOnly(uint32_t type) {
  return type == webifc::schema::IFCINDEXEDPOLYCURVE || type == webifc::schema::IFCCARTESIANPOINTLIST2D ||
         type == webifc::schema::IFCCARTESIANPOINTLIST3D;
}

// web-ifc's typed GetLine throws on a class the file's schema does not have; the TS reads null then.
const Entity* line(Model& api, uint32_t id) {
  if (id == 0) return nullptr;
  const Entity* e = api.line(id);
  if (!e || !e->info) return nullptr;
  if (e->foreign && !rawOnly(e->type)) return nullptr;
  return e;
}
const Entity* line(Model& api, const Value& ref) { return line(api, asHandle(ref)); }

std::string_view ifcKindOf(const Entity* e) { return e ? e->kind() : std::string_view(); }
const Value& get(const Entity* e, std::string_view name) { return e ? e->get(name) : Value::null(); }
bool present(const Value& v) { return !v.isNull(); }
const std::vector<Value>& itemsOf(const Value& v) { return v.items(); }

std::string kindOr(std::string_view kind, const char* fallback) {
  return kind.empty() ? std::string(fallback) : std::string(kind);
}

// Entries of a trim select: a list, one value, or nothing.
std::vector<const Value*> entriesOf(const Value& trim) {
  std::vector<const Value*> out;
  if (trim.isList()) { for (const Value& v : trim.list) out.push_back(&v); }
  else if (!trim.isNull()) out.push_back(&trim);
  return out;
}

double ms(std::chrono::steady_clock::time_point t) {
  return std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - t).count();
}

// ── module knobs ─────────────────────────────────────────────────────────────────────────────────
bool directVoids = true;
int chainOrder = 0;  // 0 null, 1 forward, 2 reverse
double growSubtrahends = 0;
bool flattenBoundedHalfSpaces = false;
bool clearSides = false;

// SI prefixes as the schema spells them.
std::optional<double> prefixValue(const std::string& t) {
  static const std::pair<const char*, double> table[] = {
      {"EXA", 1e18}, {"PETA", 1e15}, {"TERA", 1e12}, {"GIGA", 1e9}, {"MEGA", 1e6}, {"KILO", 1e3},
      {"HECTO", 1e2}, {"DECA", 1e1}, {"DECI", 1e-1}, {"CENTI", 1e-2}, {"MILLI", 1e-3}, {"MICRO", 1e-6},
      {"NANO", 1e-9}, {"PICO", 1e-12}, {"FEMTO", 1e-15}, {"ATTO", 1e-18}};
  for (const auto& [name, v] : table) if (t == name) return v;
  return std::nullopt;
}

// Tokens and references of a unit, read by value as `Object.values(u)` does.
void unitTokens(const Entity* u, std::vector<std::string>& tokens, std::vector<uint32_t>& refs) {
  const size_t named = u->info ? std::min(u->info->attrs.size(), u->args.size()) : 0;
  for (size_t i = 0; i < named; i++) {
    const Value& v = u->args[i];
    switch (v.kind) {
      case Value::Kind::String:
      case Value::Kind::Enum: tokens.push_back(upper(v.str)); break;
      case Value::Kind::Typed:
        if (!v.list.empty() && (v.list[0].kind == Value::Kind::String || v.list[0].kind == Value::Kind::Enum))
          tokens.push_back(upper(v.list[0].str));
        break;
      case Value::Kind::Ref: refs.push_back(v.ref); break;
      default: break;
    }
  }
}

bool hasToken(const std::vector<std::string>& tokens, const char* t) {
  return std::find(tokens.begin(), tokens.end(), t) != tokens.end();
}

// The positive number of an IfcMeasureWithUnit's ValueComponent, or nullopt.
std::optional<double> conversionOf(Model& api, uint32_t rid) {
  const Entity* mwu = line(api, rid);
  const Value& vc = get(mwu, "ValueComponent");
  if (vc.isNull()) return std::nullopt;
  const double val = vc.number();
  if (!std::isnan(val) && val > 0) return val;
  return std::nullopt;
}

// ── coordinates ──────────────────────────────────────────────────────────────────────────────────

// A point's or direction's numbers (TS number[]); missing components read as JS undefined -> NaN.
struct Coords {
  size_t n = 0;
  double v[3] = {NaN, NaN, NaN};
  double at(size_t i) const { return i < n && i < 3 ? v[i] : NaN; }
  double or0(size_t i) const { return i < n && i < 3 ? v[i] : 0; }
};

std::optional<Coords> coordsOf(Model& api, const Value& ref) {
  static const bool slow = std::getenv("BREP_SLOW_COORDS") != nullptr;
  if (!slow && ref.kind == Value::Kind::Ref) {
    double v[3];
    int n = 0;
    if (api.coords(ref.ref, v, n)) {
      Coords c;
      c.n = (size_t)n;
      for (int i = 0; i < 3; i++) c.v[i] = v[i];
      return c;
    }
  }
  const Entity* entity = line(api, ref);
  if (!entity) return std::nullopt;
  const Value* raw = &entity->get("Coordinates");
  if (raw->isNull()) raw = &entity->get("DirectionRatios");
  if (!raw->isList()) return std::nullopt;
  Coords c;
  c.n = raw->list.size();
  for (size_t i = 0; i < raw->list.size(); i++) {
    const double n = asPlainNumber(raw->list[i]);
    if (!std::isfinite(n)) return std::nullopt;
    if (i < 3) c.v[i] = n;
  }
  return c;
}

std::optional<P3> cornerSpot(Model& api, const Value& ref) {
  const Entity* vertex = line(api, ref);
  if (!vertex) return std::nullopt;
  const Value& geometry = vertex->get("VertexGeometry");
  auto c = coordsOf(api, geometry.isNull() ? ref : geometry);
  if (!c || c->n < 3) return std::nullopt;
  return P3{c->v[0], c->v[1], c->v[2]};
}

Placement4x4 frame2dOf(Model& api, const Value& ref) {
  const Entity* p = line(api, ref);
  if (!p) return IDENTITY;
  auto originRead = coordsOf(api, p->get("Location"));
  Coords origin;
  if (originRead) origin = *originRead; else { origin.n = 2; origin.v[0] = 0; origin.v[1] = 0; }
  std::optional<Coords> dir;
  if (present(p->get("RefDirection"))) dir = coordsOf(api, p->get("RefDirection"));
  double cx = 1, cy = 0;
  if (dir && dir->n >= 2) {
    const double l = hypot2(dir->v[0], dir->v[1]);
    if (l > 0) { cx = dir->v[0] / l; cy = dir->v[1] / l; }
  }
  return {{{cx, -cy, 0, origin.or0(0)}, {cy, cx, 0, origin.or0(1)}, {0, 0, 1, 0}, {0, 0, 0, 1}}};
}

Placement4x4 anyFrameOf(Model& api, const Value& ref) {
  return ifcKindOf(line(api, ref)) == "IfcAxis2Placement2D" ? frame2dOf(api, ref) : axisFrame(api, ref);
}

std::vector<P3> circleRing(double radius, int facets) {
  std::vector<P3> out;
  out.reserve(facets);
  for (int i = 0; i < facets; i++) {
    const double a = ((double)i / facets) * PI * 2;
    out.push_back({jsCos(a) * radius, jsSin(a) * radius, 0});
  }
  return out;
}

// ── curves ───────────────────────────────────────────────────────────────────────────────────────

struct Filament {
  std::vector<P3> points;
  bool curved = false;
  bool closed = false;
};
using Traced = std::variant<Filament, Decline>;

struct ProfileRing {
  std::vector<P3> ring;
  bool curved = false;
  std::vector<std::vector<P3>> holes;
};
using Profiled = std::variant<ProfileRing, Decline>;

template <class T>
bool isDecline(const T& v) { return std::holds_alternative<Decline>(v); }
template <class T>
Decline takeDecline(T& v) { return std::move(std::get<Decline>(v)); }

std::optional<std::vector<P3>> pointListOf(Model& api, const Value& ref);

struct Segment { bool arc; std::vector<double> idx; };

// Segments of an IfcIndexedPolyCurve with their arc/line type, from the raw arguments.
std::optional<std::vector<Segment>> polyCurveSegments(Model& api, uint32_t id) {
  const Entity* raw = id ? api.line(id) : nullptr;
  if (!raw) return std::nullopt;
  const Value* found = nullptr;
  for (const Value& a : raw->args) {
    if (a.isList() && !a.list.empty() && a.list[0].kind == Value::Kind::Typed) { found = &a; break; }
  }
  if (!found) return std::nullopt;
  std::vector<Segment> out;
  for (const Value& seg : found->list) {
    std::vector<double> idx;
    const Value* inner = (seg.kind == Value::Kind::Typed && !seg.list.empty()) ? &seg.list[0] : nullptr;
    if (inner && inner->isList()) {
      for (const Value& entry : inner->list) {
        const double n = asPlainNumber(entry);
        if (!isInteger(n)) return std::nullopt;
        idx.push_back(n);
      }
    }
    if (idx.size() >= 2) out.push_back({seg.kind == Value::Kind::Typed && seg.typeCode == webifc::schema::IFCARCINDEX, std::move(idx)});
  }
  return out;
}

std::optional<double> trimAngleOf(Model& api, const Value& trim, const Placement4x4& inverse, const MakeSettings& ctx,
                                  bool perStation, std::array<double, 2> semiAxes = {1, 1}) {
  const auto entries = entriesOf(trim);
  auto byPointParam = [&]() -> std::optional<double> {
    for (const Value* t : entries) {
      if (!t->isRef()) continue;
      auto c = coordsOf(api, *t);
      if (!c || c->n < 2) continue;
      const P3 local = place(inverse, {c->v[0], c->v[1], c->or0(2)});
      return jsAtan2(local[1] / semiAxes[1], local[0] / semiAxes[0]);
    }
    return std::nullopt;
  };
  auto atStation = [&]() -> std::optional<double> {
    for (const Value* t : entries) {
      if (t->isRef()) continue;
      const double n = asPlainNumber(*t);
      if (!std::isfinite(n)) continue;
      if (!ctx.angleToRadians) return std::nullopt;
      return n * *ctx.angleToRadians;
    }
    return std::nullopt;
  };
  if (!perStation) {
    auto p = byPointParam();
    return p ? p : atStation();
  }
  const auto stated = atStation();
  const auto point = byPointParam();
  if (!stated || !point || !ctx.angleToRadians) return stated ? stated : point;
  auto lands = [&](double a) {
    const double d = std::fabs(jsAtan2(jsSin(a - *point), jsCos(a - *point)));
    return d < 1e-6;
  };
  if (lands(*stated)) return stated;
  const double raw = *stated / *ctx.angleToRadians;
  if (lands((raw * PI) / 180)) return (raw * PI) / 180;
  return stated;
}

std::vector<P3> ellipseStations(const Placement4x4& m, double a, double b, double from, double sweep) {
  const P3 centre = {m[0][3], m[1][3], m[2][3]};
  const P3 ex = {m[0][0], m[1][0], m[2][0]};
  const P3 ey = {m[0][1], m[1][1], m[2][1]};
  std::vector<P3> unit = arcStations({0, 0, 0}, {1, 0, 0}, {0, 1, 0}, 1, from, sweep);
  std::vector<P3> out;
  out.reserve(unit.size());
  for (const P3& cs : unit) {
    const double c = cs[0], s = cs[1];
    out.push_back({centre[0] + ex[0] * a * c + ey[0] * b * s, centre[1] + ex[1] * a * c + ey[1] * b * s,
                   centre[2] + ex[2] * a * c + ey[2] * b * s});
  }
  return out;
}

Filament filamentOf(std::vector<P3>&& points, bool curved) {
  std::vector<P3> opened = unclosedRing(points);
  const bool closed = opened.size() != points.size();
  return Filament{std::move(opened), curved, closed};
}

const Value* segmentValue(const Value& s) {
  if (s.kind == Value::Kind::Typed && !s.list.empty() && s.list[0].isList()) return &s.list[0];
  return nullptr;
}

Traced traceCurve(Model& api, const Value& ref, const MakeSettings& ctx, int depth = 0) {
  if (depth > 16) return Decline{"curve: nested too deeply"};
  const Entity* curve = line(api, ref);
  const std::string_view kind = ifcKindOf(curve);

  if (kind == "IfcPolyline") {
    std::vector<P3> points;
    for (const Value& handle : itemsOf(curve->get("Points"))) {
      auto c = coordsOf(api, handle);
      if (!c || c->n < 2) return Decline{"curve: unreadable polyline point"};
      points.push_back({c->v[0], c->v[1], c->or0(2)});
    }
    if (points.size() < 2) return Decline{"curve: polyline with fewer than two points"};
    return filamentOf(std::move(points), false);
  }

  if (kind == "IfcIndexedPolyCurve") {
    auto ptsRead = pointListOf(api, curve->get("Points"));
    if (!ptsRead || ptsRead->size() < 2) return Decline{"curve: unreadable point list"};
    const std::vector<P3>& pts = *ptsRead;
    auto at = [&](double i) -> const P3* {
      const double k = i - 1;
      if (!(k >= 0) || k >= (double)pts.size() || std::floor(k) != k) return nullptr;
      return &pts[(size_t)k];
    };

    auto stated = polyCurveSegments(api, asHandle(ref));
    if (!stated) {
      const auto& parsed = itemsOf(curve->get("Segments"));
      for (const Value& s : parsed) {
        const Value* v = segmentValue(s);
        if (v && v->list.size() == 3) return Decline{"curve: IfcIndexedPolyCurve arc needs raw line data"};
      }
      std::vector<P3> points;
      if (parsed.empty()) points.insert(points.end(), pts.begin(), pts.end());
      for (const Value& s : parsed) {
        std::vector<P3> run;
        if (const Value* v = segmentValue(s)) {
          for (const Value& raw : v->list) { const P3* p = at(asPlainNumber(raw)); if (p) run.push_back(*p); }
        }
        appendRun(points, run);
      }
      return filamentOf(std::move(points), false);
    }

    if (stated->empty()) return Filament{unclosedRing(pts), false, true};

    std::vector<P3> points;
    bool curved = false;
    for (const Segment& seg : *stated) {
      if (seg.arc && seg.idx.size() == 3) {
        const P3 *a = at(seg.idx[0]), *b = at(seg.idx[1]), *c = at(seg.idx[2]);
        if (!a || !b || !c) return Decline{"curve: arc index out of range"};
        auto arc = circleByThreePoints(*a, *b, *c);
        curved = true;
        appendRun(points, arc.points);
        continue;
      }
      std::vector<P3> run;
      for (double i : seg.idx) {
        const P3* p = at(i);
        if (!p) return Decline{"curve: line index out of range"};
        run.push_back(*p);
      }
      appendRun(points, run);
    }
    return filamentOf(std::move(points), curved);
  }

  if (kind == "IfcCompositeCurve" || kind == "IfcCompositeCurveSegment") {
    std::vector<const Value*> segments;
    if (kind == "IfcCompositeCurveSegment") segments.push_back(&ref);
    else for (const Value& v : itemsOf(curve->get("Segments"))) segments.push_back(&v);
    std::vector<P3> points;
    bool curved = false;
    for (const Value* handle : segments) {
      const Entity* seg = line(api, *handle);
      if (ifcKindOf(seg) != "IfcCompositeCurveSegment")
        return Decline{"curve: segment is " + kindOr(ifcKindOf(seg), "unreadable")};
      Traced part = traceCurve(api, seg->get("ParentCurve"), ctx, depth + 1);
      if (isDecline(part)) return part;
      Filament& f = std::get<Filament>(part);
      curved = curved || f.curved;
      const auto sense = asBool(seg->get("SameSense"));
      if (sense == false) {
        std::vector<P3> reversed(f.points.rbegin(), f.points.rend());
        appendRun(points, reversed);
      } else {
        appendRun(points, f.points);
      }
    }
    if (points.size() < 2) return Decline{"curve: composite curve is empty"};
    return filamentOf(std::move(points), curved);
  }

  if (kind == "IfcCircle") {
    const double r = asPlainNumber(curve->get("Radius"));
    if (!std::isfinite(r) || r <= 0) return Decline{"curve: circle with no radius"};
    const Placement4x4 m = anyFrameOf(api, curve->get("Position"));
    const P3 centre = {m[0][3], m[1][3], m[2][3]};
    const P3 ex = {m[0][0], m[1][0], m[2][0]};
    const P3 ey = {m[0][1], m[1][1], m[2][1]};
    std::vector<P3> whole = arcStations(centre, ex, ey, r, 0, PI * 2);
    if (!whole.empty()) whole.pop_back();
    return Filament{std::move(whole), true, true};
  }

  if (kind == "IfcEllipse") {
    const double a = asPlainNumber(curve->get("SemiAxis1")), b = asPlainNumber(curve->get("SemiAxis2"));
    if (!(a > 0) || !(b > 0)) return Decline{"curve: ellipse with no semi-axes"};
    const Placement4x4 m = anyFrameOf(api, curve->get("Position"));
    std::vector<P3> whole = ellipseStations(m, a, b, 0, PI * 2);
    if (!whole.empty()) whole.pop_back();
    return Filament{std::move(whole), true, true};
  }

  if (kind == "IfcBSplineCurveWithKnots" || kind == "IfcRationalBSplineCurveWithKnots") {
    const double degree = asPlainNumber(curve->get("Degree"));
    std::vector<P3> control;
    for (const Value& handle : itemsOf(curve->get("ControlPointsList"))) {
      auto c = coordsOf(api, handle);
      if (!c || c->n < 2) return Decline{"curve: unreadable control point"};
      control.push_back({c->v[0], c->v[1], c->or0(2)});
    }
    std::vector<double> knots, mult;
    for (const Value& v : itemsOf(curve->get("Knots"))) knots.push_back(asPlainNumber(v));
    for (const Value& v : itemsOf(curve->get("KnotMultiplicities"))) mult.push_back(asPlainNumber(v));
    std::optional<std::vector<double>> weights;
    if (kind == "IfcRationalBSplineCurveWithKnots") {
      weights.emplace();
      for (const Value& v : itemsOf(curve->get("WeightsData"))) weights->push_back(asPlainNumber(v));
    }
    if (weights) {
      bool bad = weights->size() != control.size();
      for (double n : *weights) if (!std::isfinite(n)) bad = true;
      if (bad) return Decline{"curve: B-spline weights do not match its control points"};
    }
    const double spans = jsMax(1.0, (double)knots.size() - 1);
    auto points = bSplineSamples(degree, control, knots, mult, weights ? &*weights : nullptr,
                                 jsMin((double)CIRCLE_FACETS * spans, 96.0));
    if (!points) return Decline{"curve: B-spline this reader cannot evaluate"};
    return Filament{std::move(*points), true, false};
  }

  if (kind == "IfcTrimmedCurve") {
    const Entity* basis = line(api, curve->get("BasisCurve"));
    const std::string_view basisKind = ifcKindOf(basis);
    const std::string master = upper(curve->get("MasterRepresentation").text());
    const bool perStation = master == "PARAMETER";
    const bool forward = asBool(curve->get("SenseAgreement")) != false;
    const double fullTurn = PI * 2;

    if (basisKind == "IfcCircle") {
      const double r = asPlainNumber(basis->get("Radius"));
      if (!std::isfinite(r) || r <= 0) return Decline{"curve: trimmed circle with no radius"};
      const Placement4x4 m = anyFrameOf(api, basis->get("Position"));
      const Placement4x4 inverse = undoRigid(m);
      const auto from = trimAngleOf(api, curve->get("Trim1"), inverse, ctx, perStation);
      const auto to = trimAngleOf(api, curve->get("Trim2"), inverse, ctx, perStation);
      if (!from || !to)
        return Decline{!ctx.angleToRadians ? "curve: trim needs the file's plane-angle unit" : "curve: unreadable trim"};
      double sweep = *to - *from;
      if (forward) { while (sweep <= 0) sweep += fullTurn; } else { while (sweep >= 0) sweep -= fullTurn; }
      const P3 centre = {m[0][3], m[1][3], m[2][3]};
      const P3 ex = {m[0][0], m[1][0], m[2][0]};
      const P3 ey = {m[0][1], m[1][1], m[2][1]};
      return Filament{arcStations(centre, ex, ey, r, *from, sweep), true, false};
    }

    if (basisKind == "IfcEllipse") {
      const double a = asPlainNumber(basis->get("SemiAxis1")), b = asPlainNumber(basis->get("SemiAxis2"));
      if (!(a > 0) || !(b > 0)) return Decline{"curve: trimmed ellipse with no semi-axes"};
      const Placement4x4 m = anyFrameOf(api, basis->get("Position"));
      const Placement4x4 inverse = undoRigid(m);
      const auto from = trimAngleOf(api, curve->get("Trim1"), inverse, ctx, perStation, {a, b});
      const auto to = trimAngleOf(api, curve->get("Trim2"), inverse, ctx, perStation, {a, b});
      if (!from || !to)
        return Decline{!ctx.angleToRadians ? "curve: trim needs the file's plane-angle unit" : "curve: unreadable trim"};
      double sweep = *to - *from;
      if (forward) { while (sweep <= 0) sweep += fullTurn; } else { while (sweep >= 0) sweep -= fullTurn; }
      return Filament{ellipseStations(m, a, b, *from, sweep), true, false};
    }

    if (basisKind == "IfcLine") {
      const auto origin = coordsOf(api, basis->get("Pnt"));
      const Entity* vector = line(api, basis->get("Dir"));
      const auto dir = coordsOf(api, get(vector, "Orientation"));
      if (!origin || !dir) return Decline{"curve: trimmed line with no direction"};
      const double magnitude = asPlainNumber(get(vector, "Magnitude"));
      const double step = std::isfinite(magnitude) ? magnitude : 1;
      const P3 base = {origin->at(0), origin->at(1), origin->or0(2)};
      const P3 along = {dir->at(0) * step, dir->at(1) * step, dir->or0(2) * step};

      auto endpoint = [&](const Value& trim) -> std::optional<P3> {
        const auto entries = entriesOf(trim);
        auto point = [&]() -> std::optional<P3> {
          for (const Value* t : entries) {
            if (!t->isRef()) continue;
            auto c = coordsOf(api, *t);
            if (c && c->n >= 2) return P3{c->v[0], c->v[1], c->or0(2)};
          }
          return std::nullopt;
        };
        auto param = [&]() -> std::optional<P3> {
          for (const Value* t : entries) {
            if (t->isRef()) continue;
            const double n = asPlainNumber(*t);
            if (std::isfinite(n)) return P3{base[0] + along[0] * n, base[1] + along[1] * n, base[2] + along[2] * n};
          }
          return std::nullopt;
        };
        if (perStation) { auto p = param(); return p ? p : point(); }
        auto p = point();
        return p ? p : param();
      };

      const auto a = endpoint(curve->get("Trim1")), b = endpoint(curve->get("Trim2"));
      if (!a || !b) return Decline{"curve: unreadable line trim"};
      return Filament{forward ? std::vector<P3>{*a, *b} : std::vector<P3>{*b, *a}, false, false};
    }

    return Decline{"curve: trimmed " + kindOr(basisKind, "unreadable")};
  }

  return Decline{"curve: " + kindOr(kind, "unreadable")};
}

// ── profiles ─────────────────────────────────────────────────────────────────────────────────────

std::vector<P3> applyProfileFrame(Model& api, const Value& position, const std::vector<P3>& local) {
  if (position.isNull()) return local;
  const Placement4x4 m = frame2dOf(api, position);
  std::vector<P3> out;
  out.reserve(local.size());
  for (const P3& p : local) out.push_back(place(m, p));
  return out;
}

bool allPositiveFinite(std::initializer_list<double> values) {
  for (double n : values) if (!(std::isfinite(n) && n > 0)) return false;
  return true;
}

Profiled boundaryOfProfile(Model& api, const Value& ref, const MakeSettings& ctx) {
  const Entity* profile = line(api, ref);
  if (!profile) return Decline{"profile: unreadable"};
  const std::string_view kind = ifcKindOf(profile);
  const Value& position = profile->get("Position");
  auto num = [&](const char* name) { return asPlainNumber(profile->get(name)); };

  if (kind == "IfcRectangleProfileDef") {
    const double w = num("XDim"), h = num("YDim");
    if (!std::isfinite(w) || !std::isfinite(h) || w == 0 || h == 0) return Decline{"profile: rectangle with no extent"};
    const double hw = w / 2, hh = h / 2;
    return ProfileRing{applyProfileFrame(api, position, {{-hw, -hh, 0}, {hw, -hh, 0}, {hw, hh, 0}, {-hw, hh, 0}}), false, {}};
  }

  if (kind == "IfcArbitraryClosedProfileDef") {
    Traced outline = traceCurve(api, profile->get("OuterCurve"), ctx);
    if (isDecline(outline)) return takeDecline(outline);
    Filament& f = std::get<Filament>(outline);
    if (f.points.size() < 3) return Decline{"profile: fewer than three distinct points"};
    return ProfileRing{applyProfileFrame(api, position, f.points), f.curved, {}};
  }

  if (kind == "IfcCircleHollowProfileDef") {
    const double r = num("Radius"), t = num("WallThickness");
    if (!std::isfinite(r) || r <= 0) return Decline{"profile: hollow circle with no radius"};
    if (!std::isfinite(t) || t <= 0 || t >= r) return Decline{"profile: hollow circle wall thicker than its radius"};
    return ProfileRing{applyProfileFrame(api, position, circleRing(r, CIRCLE_FACETS)), true,
                       {applyProfileFrame(api, position, circleRing(r - t, CIRCLE_FACETS))}};
  }

  if (kind == "IfcCircleProfileDef") {
    const double r = num("Radius");
    if (!std::isfinite(r) || r <= 0) return Decline{"profile: circle with no radius"};
    return ProfileRing{applyProfileFrame(api, position, circleRing(r, CIRCLE_FACETS)), true, {}};
  }

  if (kind == "IfcIShapeProfileDef") {
    const double w = num("OverallWidth"), h = num("OverallDepth"), tw = num("WebThickness"), tf = num("FlangeThickness");
    if (!allPositiveFinite({w, h, tw, tf})) return Decline{"profile: I-shape missing a dimension"};
    if (tw >= w || 2 * tf >= h) return Decline{"profile: I-shape thicker than it is wide"};
    const double hw = w / 2, hh = h / 2, ht = tw / 2;
    return ProfileRing{applyProfileFrame(api, position,
                                         {{-hw, -hh, 0}, {hw, -hh, 0}, {hw, -hh + tf, 0}, {ht, -hh + tf, 0},
                                          {ht, hh - tf, 0}, {hw, hh - tf, 0}, {hw, hh, 0}, {-hw, hh, 0},
                                          {-hw, hh - tf, 0}, {-ht, hh - tf, 0}, {-ht, -hh + tf, 0}, {-hw, -hh + tf, 0}}),
                       false, {}};
  }

  if (kind == "IfcUShapeProfileDef") {
    const double h = num("Depth"), w = num("FlangeWidth"), tw = num("WebThickness"), tf = num("FlangeThickness");
    if (!allPositiveFinite({h, w, tw, tf})) return Decline{"profile: U-shape missing a dimension"};
    if (tw >= w || 2 * tf >= h) return Decline{"profile: U-shape thicker than it is wide"};
    const double hw = w / 2, hh = h / 2;
    return ProfileRing{applyProfileFrame(api, position,
                                         {{-hw, -hh, 0}, {hw, -hh, 0}, {hw, -hh + tf, 0}, {-hw + tw, -hh + tf, 0},
                                          {-hw + tw, hh - tf, 0}, {hw, hh - tf, 0}, {hw, hh, 0}, {-hw, hh, 0}}),
                       false, {}};
  }

  if (kind == "IfcDerivedProfileDef") {
    Profiled parentRead = boundaryOfProfile(api, profile->get("ParentProfile"), ctx);
    if (isDecline(parentRead)) return parentRead;
    ProfileRing& parent = std::get<ProfileRing>(parentRead);
    const Entity* op = line(api, profile->get("Operator"));
    if (!op) return Decline{"profile: derived profile with no operator"};
    auto oRead = coordsOf(api, op->get("LocalOrigin"));
    Coords o;
    if (oRead) o = *oRead; else { o.n = 2; o.v[0] = 0; o.v[1] = 0; }
    std::optional<Coords> a1raw, a2raw;
    if (present(op->get("Axis1"))) a1raw = coordsOf(api, op->get("Axis1"));
    const double a1len = a1raw ? hypot2(a1raw->at(0), a1raw->at(1)) : 0;
    const std::array<double, 2> a1 = a1len > 0 ? std::array<double, 2>{a1raw->at(0) / a1len, a1raw->at(1) / a1len}
                                               : std::array<double, 2>{1, 0};
    if (present(op->get("Axis2"))) a2raw = coordsOf(api, op->get("Axis2"));
    const double a2len = a2raw ? hypot2(a2raw->at(0), a2raw->at(1)) : 0;
    const std::array<double, 2> a2 = a2len > 0 ? std::array<double, 2>{a2raw->at(0) / a2len, a2raw->at(1) / a2len}
                                               : std::array<double, 2>{-a1[1], a1[0]};
    const double scaleRaw = asPlainNumber(op->get("Scale"));
    const double k = std::isfinite(scaleRaw) && scaleRaw > 0 ? scaleRaw : 1;
    auto map = [&](const P3& p) -> P3 {
      const double x = p[0], y = p[1], z = p[2];
      return {o.or0(0) + k * (x * a1[0] + y * a2[0]), o.or0(1) + k * (x * a1[1] + y * a2[1]), z};
    };
    ProfileRing out;
    out.curved = parent.curved;
    for (const P3& p : parent.ring) out.ring.push_back(map(p));
    for (const auto& h : parent.holes) {
      std::vector<P3> mh;
      for (const P3& p : h) mh.push_back(map(p));
      out.holes.push_back(std::move(mh));
    }
    return out;
  }

  if (kind == "IfcCShapeProfileDef") {
    const double h = num("Depth"), w = num("Width"), t = num("WallThickness"), g = num("Girth");
    if (!allPositiveFinite({h, w, t, g})) return Decline{"profile: C-shape missing a dimension"};
    if (2 * t >= w || 2 * t >= h || g <= t || 2 * g >= h) return Decline{"profile: C-shape dimensions do not fit"};
    const double hw = w / 2, hh = h / 2;
    return ProfileRing{applyProfileFrame(api, position,
                                         {{-hw, -hh, 0}, {hw, -hh, 0}, {hw, -hh + g, 0}, {hw - t, -hh + g, 0},
                                          {hw - t, -hh + t, 0}, {-hw + t, -hh + t, 0}, {-hw + t, hh - t, 0}, {hw - t, hh - t, 0},
                                          {hw - t, hh - g, 0}, {hw, hh - g, 0}, {hw, hh, 0}, {-hw, hh, 0}}),
                       false, {}};
  }

  if (kind == "IfcRoundedRectangleProfileDef") {
    const double x = num("XDim"), y = num("YDim"), r = num("RoundingRadius");
    if (!allPositiveFinite({x, y})) return Decline{"profile: rounded rectangle missing a dimension"};
    const double hx = x / 2, hy = y / 2;
    const double rr = std::isfinite(r) && r > 0 ? jsMin(jsMin(r, hx), hy) : 0;
    std::vector<P3> ring;
    const double corners[4][3] = {{hx - rr, -hy + rr, -PI / 2}, {hx - rr, hy - rr, 0}, {-hx + rr, hy - rr, PI / 2}, {-hx + rr, -hy + rr, PI}};
    for (const auto& c : corners) {
      if (rr == 0) { ring.push_back({c[0], c[1], 0}); continue; }
      for (const P3& p : arcStations({c[0], c[1], 0}, {1, 0, 0}, {0, 1, 0}, rr, c[2], PI / 2)) ring.push_back(p);
    }
    return ProfileRing{applyProfileFrame(api, position, ring), rr > 0, {}};
  }

  if (kind == "IfcLShapeProfileDef") {
    const double d = num("Depth"), t = num("Thickness"), wRaw = num("Width");
    const double w = std::isfinite(wRaw) && wRaw > 0 ? wRaw : d;
    if (!allPositiveFinite({d, w, t})) return Decline{"profile: L-shape missing a dimension"};
    if (t >= w || t >= d) return Decline{"profile: L-shape thicker than its legs"};
    const double leverX = w * t, leverY = (d - t) * t;
    const double area = leverX + leverY;
    const double cx = (leverX * (w / 2) + leverY * (t / 2)) / area;
    const double cy = (leverX * (t / 2) + leverY * (t + (d - t) / 2)) / area;
    const P3 corner[6] = {{0, 0, 0}, {w, 0, 0}, {w, t, 0}, {t, t, 0}, {t, d, 0}, {0, d, 0}};
    std::vector<P3> local;
    for (const P3& p : corner) local.push_back({p[0] - cx, p[1] - cy, p[2]});
    return ProfileRing{applyProfileFrame(api, position, local), false, {}};
  }

  if (kind == "IfcTShapeProfileDef") {
    const double h = num("Depth"), w = num("FlangeWidth"), tw = num("WebThickness"), tf = num("FlangeThickness");
    if (!allPositiveFinite({h, w, tw, tf})) return Decline{"profile: T-shape missing a dimension"};
    if (tw >= w || tf >= h) return Decline{"profile: T-shape thicker than it is wide"};
    const double hw = w / 2, hh = h / 2, ht = tw / 2;
    return ProfileRing{applyProfileFrame(api, position,
                                         {{-ht, -hh, 0}, {ht, -hh, 0}, {ht, hh - tf, 0}, {hw, hh - tf, 0},
                                          {hw, hh, 0}, {-hw, hh, 0}, {-hw, hh - tf, 0}, {-ht, hh - tf, 0}}),
                       false, {}};
  }

  if (kind == "IfcRectangleHollowProfileDef") {
    const double w = num("XDim"), h = num("YDim"), t = num("WallThickness");
    if (!allPositiveFinite({w, h})) return Decline{"profile: hollow rectangle with no extent"};
    if (!std::isfinite(t) || t <= 0 || 2 * t >= jsMin(w, h))
      return Decline{"profile: hollow rectangle wall thicker than the section"};
    const double hw = w / 2, hh = h / 2, iw = hw - t, ih = hh - t;
    return ProfileRing{applyProfileFrame(api, position, {{-hw, -hh, 0}, {hw, -hh, 0}, {hw, hh, 0}, {-hw, hh, 0}}), false,
                       {applyProfileFrame(api, position, {{-iw, -ih, 0}, {iw, -ih, 0}, {iw, ih, 0}, {-iw, ih, 0}})}};
  }

  if (kind == "IfcArbitraryProfileDefWithVoids") {
    Traced outline = traceCurve(api, profile->get("OuterCurve"), ctx);
    if (isDecline(outline)) return takeDecline(outline);
    Filament& f = std::get<Filament>(outline);
    if (f.points.size() < 3) return Decline{"profile: fewer than three distinct points"};
    std::vector<std::vector<P3>> holes;
    bool curved = f.curved;
    for (const Value& r : itemsOf(profile->get("InnerCurves"))) {
      Traced inner = traceCurve(api, r, ctx);
      if (isDecline(inner)) return takeDecline(inner);
      Filament& fi = std::get<Filament>(inner);
      if (fi.points.size() < 3) return Decline{"profile: void with fewer than three points"};
      curved = curved || fi.curved;
      holes.push_back(applyProfileFrame(api, position, fi.points));
    }
    if (holes.empty()) return Decline{"profile: stated voids but listed none"};
    return ProfileRing{applyProfileFrame(api, position, f.points), curved, std::move(holes)};
  }
  return Decline{"profile: " + kindOr(kind, "unknown")};
}

std::optional<std::vector<P3>> pointListOf(Model& api, const Value& ref) {
  const Entity* list = line(api, ref);
  const Value& raw = get(list, "CoordList");
  if (!raw.isList()) return std::nullopt;
  std::vector<P3> out;
  out.reserve(raw.list.size());
  for (const Value& entry : raw.list) {
    if (!entry.isList()) return std::nullopt;
    double c[3] = {0, 0, 0};
    for (size_t i = 0; i < entry.list.size(); i++) {
      const double n = asPlainNumber(entry.list[i]);
      if (!std::isfinite(n)) return std::nullopt;
      if (i < 3) c[i] = n;
    }
    out.push_back({c[0], c[1], c[2]});
  }
  return out;
}

std::optional<std::vector<P3>> circuitOf(Model& api, const Value& ref) {
  const Entity* loop = line(api, ref);
  const Value& pts = get(loop, "Polygon");
  if (!pts.isList()) return std::nullopt;
  std::vector<P3> out;
  out.reserve(pts.list.size());
  for (const Value& h : pts.list) {
    auto c = coordsOf(api, h);
    if (!c || c->n < 3) return std::nullopt;
    out.push_back({c->v[0], c->v[1], c->v[2]});
  }
  return out;
}

struct IndexedFace {
  const Value* coordIndex = nullptr;            // may be a non-list
  std::vector<const Value*> innerCoordIndices;  // lists only
};

std::optional<IndexedFace> readIndexedFace(Model& api, const Value& ref) {
  const Entity* typed = line(api, ref);
  if (typed) {
    IndexedFace f;
    f.coordIndex = &typed->get("CoordIndex");
    for (const Value& v : itemsOf(typed->get("InnerCoordIndices"))) if (v.isList()) f.innerCoordIndices.push_back(&v);
    return f;
  }
  const uint32_t id = asHandle(ref);
  const Entity* raw = id ? api.line(id) : nullptr;
  if (!raw || raw->args.empty() || !raw->args[0].isList()) return std::nullopt;
  IndexedFace f;
  f.coordIndex = &raw->args[0];
  if (raw->args.size() > 1 && raw->args[1].isList()) {
    for (const Value& entry : raw->args[1].list) {
      if (!entry.isList()) continue;
      if (entry.list.size() < 3) continue;
      bool bad = false;
      for (const Value& v : entry.list) if (!(asPlainNumber(v) >= 1)) { bad = true; break; }
      if (bad) continue;
      f.innerCoordIndices.push_back(&entry);
    }
  }
  return f;
}

std::vector<P3> placedRing(const Placement4x4& m, const std::vector<P3>& ring) {
  std::vector<P3> out;
  out.reserve(ring.size());
  for (const P3& p : ring) out.push_back(place(m, p));
  return out;
}

const P3* pointAt(const std::vector<P3>& pts, double oneBased) {
  const double k = oneBased - 1;
  if (!(k >= 0) || k >= (double)pts.size() || std::floor(k) != k) return nullptr;
  return &pts[(size_t)k];
}

}  // namespace

// ── placements ───────────────────────────────────────────────────────────────────────────────────

P3 place(const Placement4x4& m, const P3& p) {
  return {m[0][0] * p[0] + m[0][1] * p[1] + m[0][2] * p[2] + m[0][3],
          m[1][0] * p[0] + m[1][1] * p[1] + m[1][2] * p[2] + m[1][3],
          m[2][0] * p[0] + m[2][1] * p[1] + m[2][2] * p[2] + m[2][3]};
}

P3 turn(const Placement4x4& m, const P3& d) {
  return {m[0][0] * d[0] + m[0][1] * d[1] + m[0][2] * d[2], m[1][0] * d[0] + m[1][1] * d[1] + m[1][2] * d[2],
          m[2][0] * d[0] + m[2][1] * d[1] + m[2][2] * d[2]};
}

Placement4x4 compose(const Placement4x4& outer, const Placement4x4& inner) {
  Placement4x4 out = {{{0, 0, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 1}}};
  for (int r = 0; r < 3; r++) {
    for (int c = 0; c < 4; c++) {
      out[r][c] = outer[r][0] * inner[0][c] + outer[r][1] * inner[1][c] + outer[r][2] * inner[2][c] + (c == 3 ? outer[r][3] : 0);
    }
  }
  return out;
}

Placement4x4 undoRigid(const Placement4x4& m) {
  Placement4x4 t = {{{m[0][0], m[1][0], m[2][0], 0}, {m[0][1], m[1][1], m[2][1], 0}, {m[0][2], m[1][2], m[2][2], 0}, {0, 0, 0, 1}}};
  const P3 p = {m[0][3], m[1][3], m[2][3]};
  t[0][3] = -(t[0][0] * p[0] + t[0][1] * p[1] + t[0][2] * p[2]);
  t[1][3] = -(t[1][0] * p[0] + t[1][1] * p[1] + t[1][2] * p[2]);
  t[2][3] = -(t[2][0] * p[0] + t[2][1] * p[1] + t[2][2] * p[2]);
  return t;
}

Placement4x4 axisFrame(Model& api, const Value& ref) {
  const Entity* p = line(api, ref);
  if (!p) return IDENTITY;
  auto originRead = coordsOf(api, p->get("Location"));
  Coords origin;
  if (originRead) origin = *originRead; else { origin.n = 3; origin.v[0] = origin.v[1] = origin.v[2] = 0; }
  P3 frameW = {0, 0, 1};
  P3 frameU = {1, 0, 0};
  std::optional<Coords> axis, headingRef;
  if (present(p->get("Axis"))) axis = coordsOf(api, p->get("Axis"));
  if (axis && axis->n >= 3) frameW = {axis->v[0], axis->v[1], axis->v[2]};
  if (present(p->get("RefDirection"))) headingRef = coordsOf(api, p->get("RefDirection"));
  if (headingRef && headingRef->n >= 3) frameU = {headingRef->v[0], headingRef->v[1], headingRef->v[2]};

  const double axisScaleZ = hypot3(frameW[0], frameW[1], frameW[2]);
  if (axisScaleZ == 0) return IDENTITY;
  frameW = {frameW[0] / axisScaleZ, frameW[1] / axisScaleZ, frameW[2] / axisScaleZ};

  const double along = frameU[0] * frameW[0] + frameU[1] * frameW[1] + frameU[2] * frameW[2];
  frameU = {frameU[0] - along * frameW[0], frameU[1] - along * frameW[1], frameU[2] - along * frameW[2]};
  const double axisScaleX = hypot3(frameU[0], frameU[1], frameU[2]);
  if (axisScaleX == 0) {
    const P3 pick = std::fabs(frameW[0]) < 0.9 ? P3{1, 0, 0} : P3{0, 1, 0};
    const double d = pick[0] * frameW[0] + pick[1] * frameW[1] + pick[2] * frameW[2];
    frameU = {pick[0] - d * frameW[0], pick[1] - d * frameW[1], pick[2] - d * frameW[2]};
    const double l = hypot3(frameU[0], frameU[1], frameU[2]);
    frameU = {frameU[0] / l, frameU[1] / l, frameU[2] / l};
  } else {
    frameU = {frameU[0] / axisScaleX, frameU[1] / axisScaleX, frameU[2] / axisScaleX};
  }

  const P3 frameV = {frameW[1] * frameU[2] - frameW[2] * frameU[1], frameW[2] * frameU[0] - frameW[0] * frameU[2],
                     frameW[0] * frameU[1] - frameW[1] * frameU[0]};

  return {{{frameU[0], frameV[0], frameW[0], origin.at(0)},
           {frameU[1], frameV[1], frameW[1], origin.at(1)},
           {frameU[2], frameV[2], frameW[2], origin.at(2)},
           {0, 0, 0, 1}}};
}

Placement4x4 placeOf(Model& api, const Value& ref, int depth) {
  if (depth > 32) return IDENTITY;
  const Entity* local = line(api, ref);
  if (!local) return IDENTITY;
  const Placement4x4 own = axisFrame(api, local->get("RelativePlacement"));
  const Value& relTo = local->get("PlacementRelTo");
  if (relTo.isNull()) return own;
  return compose(placeOf(api, relTo, depth + 1), own);
}

// ── units ────────────────────────────────────────────────────────────────────────────────────────

LengthScale unitLengthFactor(Model& api) {
  const auto ids = api.idsWithType(webifc::schema::IFCUNITASSIGNMENT);
  for (uint32_t uaID : ids) {
    const Entity* ua = line(api, uaID);
    for (const Value& handle : itemsOf(get(ua, "Units"))) {
      const Entity* u = line(api, handle);
      if (!u) continue;
      std::vector<std::string> tokens;
      std::vector<uint32_t> refs;
      unitTokens(u, tokens, refs);
      if (!hasToken(tokens, "LENGTHUNIT")) continue;
      for (uint32_t rid : refs) {
        if (auto val = conversionOf(api, rid)) {
          std::string named = "?";
          for (const auto& t : tokens) if (t != "LENGTHUNIT") { named = t; break; }
          return {*val, "conversion " + named};
        }
      }
      std::optional<std::string> prefix;
      for (const auto& t : tokens) if (prefixValue(t)) { prefix = t; break; }
      if (hasToken(tokens, "METRE") || prefix) {
        return {prefix ? *prefixValue(*prefix) : 1.0, "SI " + (prefix ? *prefix : std::string("METRE"))};
      }
    }
  }
  return {1, "default metre"};
}

AngleScale readPlaneAngleScale(Model& api) {
  const auto ids = api.idsWithType(webifc::schema::IFCUNITASSIGNMENT);
  bool declared = false;
  for (uint32_t uaID : ids) {
    const Entity* ua = line(api, uaID);
    for (const Value& handle : itemsOf(get(ua, "Units"))) {
      const Entity* u = line(api, handle);
      if (!u) continue;
      std::vector<std::string> tokens;
      std::vector<uint32_t> refs;
      unitTokens(u, tokens, refs);
      if (!hasToken(tokens, "PLANEANGLEUNIT")) continue;
      declared = true;
      for (uint32_t rid : refs) {
        if (auto val = conversionOf(api, rid)) {
          std::string named = "?";
          for (const auto& t : tokens) if (t != "PLANEANGLEUNIT") { named = t; break; }
          return {*val, "conversion " + named};
        }
      }
      std::optional<std::string> prefix;
      for (const auto& t : tokens) if (prefixValue(t)) { prefix = t; break; }
      if (hasToken(tokens, "RADIAN"))
        return {prefix ? *prefixValue(*prefix) : 1.0, "SI " + (prefix ? *prefix : std::string("RADIAN"))};
    }
  }
  if (declared) return {std::nullopt, "plane angle declared but unreadable"};
  return {1.0, "no plane angle unit (schema default radian)"};
}

// ── knobs ────────────────────────────────────────────────────────────────────────────────────────

void setDirectVoids(bool on) { directVoids = on; }
void setChainOrder(int order) { chainOrder = order; }
void setGrowSubtrahends(double fraction) { growSubtrahends = fraction; }
void setClearBoundedSides(bool on) { clearSides = on; }
void setFlattenBoundedHalfSpaces(bool on) { flattenBoundedHalfSpaces = on; }

// ── solids ───────────────────────────────────────────────────────────────────────────────────────

namespace {

bool isG(const Solid& s) { return std::holds_alternative<GP>(s); }
GP& graphOf(Solid& s) { return std::get<GP>(s); }
std::string whyOr() {
  std::string w = kWhy();
  return w.empty() ? std::string("no reason") : w;
}

// A boolean's output as the next boolean's input: rebuilt from its own triangles when not watertight.
GP rewelded(GP solid) {
  if (solid->isWatertight()) return solid;
  ToTrianglesResult t = toTriangles(*solid);
  const auto& mesh = t.mesh;
  auto at = [&](size_t i) -> P3 {
    const size_t v = (size_t)mesh.indices[i] * 3;
    return {mesh.positions[v], mesh.positions[v + 1], mesh.positions[v + 2]};
  };
  std::vector<std::vector<P3>> triangles;
  triangles.reserve(mesh.indices.size() / 3);
  for (size_t i = 0; i + 2 < mesh.indices.size(); i += 3) triangles.push_back({at(i), at(i + 1), at(i + 2)});
  AssembledShell s = shellFromTriangleSoup(triangles);
  return s.graph && s.graph->isWatertight() ? std::move(s.graph) : std::move(solid);
}

P3 rotateAbout(const P3& p, const P3& origin, const P3& axis, double angle) {
  if (!truthy(angle)) return p;
  const double len = hypot3(axis[0], axis[1], axis[2]);
  const P3 k = {axis[0] / len, axis[1] / len, axis[2] / len};
  const P3 v = {p[0] - origin[0], p[1] - origin[1], p[2] - origin[2]};
  const double c = jsCos(angle), s = jsSin(angle);
  const double dot = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
  const P3 cross = {k[1] * v[2] - k[2] * v[1], k[2] * v[0] - k[0] * v[2], k[0] * v[1] - k[1] * v[0]};
  return {origin[0] + v[0] * c + cross[0] * s + k[0] * dot * (1 - c),
          origin[1] + v[1] * c + cross[1] * s + k[1] * dot * (1 - c),
          origin[2] + v[2] * c + cross[2] * s + k[2] * dot * (1 - c)};
}

std::string reasonOr(const BuildReport& r, const char* fallback) { return r.reason ? *r.reason : std::string(fallback); }

Solid sweptFromItem(Model& api, const Entity& item, const Value& sweptArea, std::string_view kind,
                    const Placement4x4& into, const MakeSettings& ctx) {
  Profiled outlineRead = boundaryOfProfile(api, sweptArea, ctx);
  if (isDecline(outlineRead)) return takeDecline(outlineRead);
  ProfileRing& outline = std::get<ProfileRing>(outlineRead);

  if (kind == "IfcRevolvedAreaSolid") {
    const double stated = asPlainNumber(item.get("Angle"));
    if (!std::isfinite(stated) || stated == 0) return Decline{"solid: revolve through no angle"};
    if (!ctx.angleToRadians) return Decline{"solid: revolve needs the file's plane-angle unit"};
    const double angle = stated * *ctx.angleToRadians;

    const Placement4x4 frame = compose(into, axisFrame(api, item.get("Position")));
    const Entity* spindle = line(api, item.get("Axis"));
    if (!spindle) return Decline{"solid: revolve with no axis"};
    auto atRead = coordsOf(api, spindle->get("Location"));
    const P3 at = atRead ? P3{atRead->or0(0), atRead->or0(1), atRead->or0(2)} : P3{0, 0, 0};
    std::optional<Coords> along;
    if (present(spindle->get("Axis"))) along = coordsOf(api, spindle->get("Axis"));
    const P3 dirLocal = along && along->n >= 3 ? P3{along->v[0], along->v[1], along->v[2]} : P3{0, 0, 1};

    BuildReport revolveWhy;
    GP solid = revolveProfile(placedRing(frame, outline.ring), place(frame, at), turn(frame, dirLocal), angle,
                              facetsForSweep(angle), &revolveWhy);
    if (!solid) return Decline{"solid: " + reasonOr(revolveWhy, "revolve produced no body")};
    if (!outline.holes.empty()) {
      const P3 origin = place(frame, at);
      const P3 axis = turn(frame, dirLocal);
      const bool full = std::fabs(angle) >= 2 * PI - 1e-9;
      const double over = full ? 0 : jsSign(angle) * jsMin(0.01, std::fabs(angle) / 100);
      std::vector<GP> cutters;
      for (const auto& hole : outline.holes) {
        std::vector<P3> ring;
        for (const P3& p : hole) ring.push_back(rotateAbout(place(frame, p), origin, axis, -over));
        BuildReport holeWhy;
        GP cutter = revolveProfile(ring, origin, axis, angle + 2 * over, facetsForSweep(angle), &holeWhy);
        if (!cutter) return Decline{"solid: revolved void: " + reasonOr(holeWhy, "revolve produced no body")};
        cutters.push_back(std::move(cutter));
      }
      GP hollow = kCutAway(solid, cutters);
      if (!hollow) return Decline{"solid: revolved voids not subtracted (" + whyOr() + ")"};
      return hollow;
    }
    return solid;
  }

  const double depth = asPlainNumber(item.get("Depth"));
  if (!std::isfinite(depth) || depth == 0) return Decline{"solid: zero or unreadable depth"};

  std::optional<Coords> dirRaw;
  if (present(item.get("ExtrudedDirection"))) dirRaw = coordsOf(api, item.get("ExtrudedDirection"));
  const P3 dir = dirRaw && dirRaw->n >= 3 ? P3{dirRaw->v[0], dirRaw->v[1], dirRaw->v[2]} : P3{0, 0, 1};
  const double headingLength = hypot3(dir[0], dir[1], dir[2]);
  if (headingLength == 0) return Decline{"solid: zero extrusion direction"};

  const Placement4x4 frame = compose(into, axisFrame(api, item.get("Position")));
  const std::vector<P3> profile3d = placedRing(frame, outline.ring);
  const P3 sweepLocal = {dir[0] / headingLength * depth, dir[1] / headingLength * depth, dir[2] / headingLength * depth};
  const P3 sweep = turn(frame, sweepLocal);

  if (kind == "IfcExtrudedAreaSolidTapered") {
    Profiled farRead = boundaryOfProfile(api, item.get("EndSweptArea"), ctx);
    if (isDecline(farRead)) return takeDecline(farRead);
    ProfileRing& far = std::get<ProfileRing>(farRead);
    if (!far.holes.empty() || !outline.holes.empty()) return Decline{"solid: tapered profile has voids"};
    std::vector<P3> tailRing;
    for (const P3& q : far.ring) {
      const P3 p = place(frame, q);
      tailRing.push_back({p[0] + sweep[0], p[1] + sweep[1], p[2] + sweep[2]});
    }
    BuildReport loftWhy;
    GP lofted = loftProfiles(profile3d, tailRing, &loftWhy);
    if (!lofted) return Decline{"solid: " + reasonOr(loftWhy, "tapered profiles do not correspond")};
    return lofted;
  }

  BuildReport why;
  GP solid = pushProfile(profile3d, sweep, &why);
  if (!solid) return Decline{"solid: " + reasonOr(why, "profile does not bound a region")};

  GP direct;
  if (!outline.holes.empty() && directVoids) {
    std::vector<std::vector<P3>> voids;
    for (const auto& hole : outline.holes) voids.push_back(placedRing(frame, hole));
    direct = pushProfileWithVoids(profile3d, voids, sweep);
  }
  if (direct) return direct;
  if (!outline.holes.empty()) {
    std::vector<GP> cutters;
    for (const auto& hole : outline.holes) {
      std::vector<P3> ring;
      for (const P3& q : hole) {
        const P3 p = place(frame, q);
        ring.push_back({p[0] - sweep[0], p[1] - sweep[1], p[2] - sweep[2]});
      }
      GP cutter = pushProfile(ring, {sweep[0] * 3, sweep[1] * 3, sweep[2] * 3});
      if (!cutter) return Decline{"solid: profile void does not bound a region"};
      cutters.push_back(std::move(cutter));
    }
    GP next = kCutAway(solid, cutters);
    if (!next) return Decline{"solid: profile void not subtracted (" + whyOr() + ")"};
    return next;
  }
  return solid;
}

std::optional<double> firstStationOf(const Value& trim) {
  for (const Value* t : entriesOf(trim)) {
    if (t->isRef()) continue;
    const double n = asPlainNumber(*t);
    if (std::isfinite(n)) return n;
  }
  return std::nullopt;
}

std::optional<double> parameterSpanOf(Model& api, const Entity* directrix, const MakeSettings& ctx) {
  const std::string_view kind = ifcKindOf(directrix);
  if (kind == "IfcIndexedPolyCurve") {
    const size_t stated = itemsOf(directrix->get("Segments")).size();
    if (stated) return (double)stated;
    auto pts = pointListOf(api, directrix->get("Points"));
    if (pts && pts->size() > 1) return (double)(pts->size() - 1);
    return std::nullopt;
  }
  if (kind == "IfcTrimmedCurve") {
    double ends[2];
    for (int i = 0; i < 2; i++) {
      auto n = firstStationOf(directrix->get(i == 0 ? "Trim1" : "Trim2"));
      if (!n) return std::nullopt;
      ends[i] = *n;
    }
    const std::string_view basis = ifcKindOf(line(api, directrix->get("BasisCurve")));
    if (basis != "IfcCircle" && basis != "IfcEllipse") return std::fabs(ends[1] - ends[0]);
    if (!ctx.angleToRadians) return std::nullopt;
    const double fullTurn = (2 * PI) / *ctx.angleToRadians;
    const bool forward = asBool(directrix->get("SenseAgreement")) != false;
    double span = forward ? ends[1] - ends[0] : ends[0] - ends[1];
    span = std::fmod(std::fmod(span, fullTurn) + fullTurn, fullTurn);
    return span == 0 ? fullTurn : span;
  }
  if (kind != "IfcCompositeCurve") return std::nullopt;
  double total = 0;
  for (const Value& handle : itemsOf(directrix->get("Segments"))) {
    const Entity* seg = line(api, handle);
    const Entity* parent = line(api, get(seg, "ParentCurve"));
    const std::string_view pk = ifcKindOf(parent);
    if (pk == "IfcTrimmedCurve") {
      const std::string master = upper(parent->get("MasterRepresentation").text());
      if (master != "PARAMETER") return std::nullopt;
      double ends[2];
      for (int i = 0; i < 2; i++) {
        auto n = firstStationOf(parent->get(i == 0 ? "Trim1" : "Trim2"));
        if (!n) return std::nullopt;
        ends[i] = *n;
      }
      const std::string_view basis = ifcKindOf(line(api, parent->get("BasisCurve")));
      if (basis == "IfcCircle" || basis == "IfcEllipse") {
        if (!ctx.angleToRadians) return std::nullopt;
        total += std::fabs(ends[1] - ends[0]) * *ctx.angleToRadians;
      } else {
        total += std::fabs(ends[1] - ends[0]);
      }
      continue;
    }
    if (pk == "IfcPolyline") {
      const size_t n = itemsOf(parent->get("Points")).size();
      if (n < 2) return std::nullopt;
      total += (double)(n - 1);
      continue;
    }
    return std::nullopt;
  }
  return total;
}

double pathLength(const std::vector<P3>& points) {
  double length = 0;
  for (size_t i = 1; i < points.size(); i++) {
    const P3 &a = points[i - 1], &b = points[i];
    length += hypot3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  }
  return length;
}

Solid makeTubeSweep(Model& api, uint32_t itemIdent, const Placement4x4& into, const MakeSettings& ctx) {
  const Entity* item = line(api, itemIdent);
  const std::string_view kind = ifcKindOf(item);
  if (kind != "IfcSweptDiskSolid" && kind != "IfcSweptDiskSolidPolygonal") return Decline{"solid: " + kindOr(kind, "unreadable")};

  const double radius = asPlainNumber(item->get("Radius"));
  if (!std::isfinite(radius) || radius <= 0) return Decline{"solid: swept disk with no radius"};
  const double boreRaw = item->get("InnerRadius").isNull() ? NaN : asPlainNumber(item->get("InnerRadius"));
  const std::optional<double> bore = std::isfinite(boreRaw) && boreRaw > 0 ? std::optional<double>(boreRaw) : std::nullopt;
  if (bore && *bore >= radius) return Decline{"solid: swept disk bore wider than the pipe"};

  Traced pathRead = traceCurve(api, item->get("Directrix"), ctx);
  if (isDecline(pathRead)) return takeDecline(pathRead);
  Filament& path = std::get<Filament>(pathRead);
  if (path.points.size() < 2) return Decline{"solid: swept disk directrix has no length"};

  const double length = pathLength(path.points);
  const Entity* directrix = line(api, item->get("Directrix"));
  const double segmentTally = ifcKindOf(directrix) == "IfcCompositeCurve" ? (double)itemsOf(directrix->get("Segments")).size() : 0;
  const double start = item->get("StartParam").isNull() ? 0 : asPlainNumber(item->get("StartParam"));
  const std::optional<double> end = item->get("EndParam").isNull() ? std::nullopt : std::optional<double>(asPlainNumber(item->get("EndParam")));
  const auto span = parameterSpanOf(api, directrix, ctx);
  auto isWholeCurve = [&](double v) {
    return v == 1 || (segmentTally > 0 && v >= segmentTally - 1e-9) || v >= length - 1e-6 * jsMax(length, 1.0) ||
           (span && v >= *span - 1e-6 * jsMax(*span, 1.0));
  };
  if (start != 0) return Decline{"solid: swept disk starts partway along its directrix"};
  if (end && !isWholeCurve(*end)) return Decline{"solid: swept disk directrix trim not implemented"};

  const std::vector<P3> placed = &into == &IDENTITY ? path.points : placedRing(into, path.points);
  SweepResult solid = tubeSweep(placed, radius, bore, CIRCLE_FACETS);
  if (std::holds_alternative<Decline>(solid)) return std::move(std::get<Decline>(solid));
  return std::move(std::get<GP>(solid));
}

Solid buildSurfaceCurveSwept(Model& api, uint32_t itemIdent, const Placement4x4& into, const MakeSettings& ctx) {
  const Entity* item = line(api, itemIdent);
  if (ifcKindOf(item) != "IfcSurfaceCurveSweptAreaSolid") return Decline{"solid: " + kindOr(ifcKindOf(item), "unreadable")};

  const Entity* surfaceRef = line(api, item->get("ReferenceSurface"));
  const std::string_view surface = ifcKindOf(surfaceRef);
  SectionOrientation orient;
  if (surface == "IfcPlane") {
    const Entity* position = line(api, surfaceRef->get("Position"));
    std::optional<Coords> axis;
    if (present(get(position, "Axis"))) axis = coordsOf(api, position->get("Axis"));
    orient.kind = SectionOrientation::Kind::normal;
    orient.dir = axis && axis->n >= 3 ? P3{axis->v[0], axis->v[1], axis->v[2]} : P3{0, 0, 1};
  } else if (surface == "IfcSurfaceOfLinearExtrusion") {
    auto dir = coordsOf(api, surfaceRef->get("ExtrudedDirection"));
    if (!dir || dir->n < 3) return Decline{"solid: surface-curve sweep with no ruling direction"};
    orient.kind = SectionOrientation::Kind::ruling;
    orient.dir = {dir->v[0], dir->v[1], dir->v[2]};
  } else {
    return Decline{"solid: surface-curve sweep over " + kindOr(surface, "no surface")};
  }

  Profiled profileRead = boundaryOfProfile(api, item->get("SweptArea"), ctx);
  if (isDecline(profileRead)) return takeDecline(profileRead);
  ProfileRing& profile = std::get<ProfileRing>(profileRead);
  if (!profile.holes.empty()) return Decline{"solid: surface-curve sweep of a profile with voids"};
  if (profile.ring.size() < 3) return Decline{"solid: surface-curve sweep profile does not bound a region"};

  Traced pathRead = traceCurve(api, item->get("Directrix"), ctx);
  if (isDecline(pathRead)) return takeDecline(pathRead);
  Filament& path = std::get<Filament>(pathRead);
  if (path.points.size() < 2) return Decline{"solid: surface-curve sweep directrix has no length"};

  const Entity* directrix = line(api, item->get("Directrix"));
  const double start = item->get("StartParam").isNull() ? 0 : asPlainNumber(item->get("StartParam"));
  const std::optional<double> end = item->get("EndParam").isNull() ? std::nullopt : std::optional<double>(asPlainNumber(item->get("EndParam")));
  if (start != 0) return Decline{"solid: surface-curve sweep starts partway along its directrix"};
  if (end) {
    const double length = pathLength(path.points);
    const double segments = ifcKindOf(directrix) == "IfcCompositeCurve" ? (double)itemsOf(directrix->get("Segments")).size() : 0;
    const auto span = parameterSpanOf(api, directrix, ctx);
    const double e = *end;
    const bool whole = e == 1 || (segments > 0 && e >= segments - 1e-9) || e >= length - 1e-6 * jsMax(length, 1.0) ||
                       (span && e >= *span - 1e-6 * jsMax(*span, 1.0));
    if (!whole) return Decline{"solid: surface-curve sweep directrix trim not implemented"};
  }

  // placeOf on an Axis2Placement3D, as the TS does (it reads no RelativePlacement: the identity).
  const Placement4x4 frame = placeOf(api, item->get("Position"));
  const Placement4x4 world = compose(into, frame);
  const std::vector<P3> placed = placedRing(world, path.points);
  const P3 origin = place(world, {0, 0, 0});
  const P3 turned = place(world, orient.dir);
  const P3 rotated = {turned[0] - origin[0], turned[1] - origin[1], turned[2] - origin[2]};

  std::vector<std::array<double, 2>> section;
  for (const P3& p : profile.ring) section.push_back({p[0], p[1]});
  SweepResult solid = profileSweep(placed, section, SectionOrientation{orient.kind, rotated});
  if (std::holds_alternative<Decline>(solid)) return Decline{"solid: " + std::get<Decline>(solid).reason};
  return std::move(std::get<GP>(solid));
}

Solid buildAdvancedBrep(Model& api, uint32_t itemIdent, const Placement4x4& into, const MakeSettings& ctx) {
  const Entity* item = line(api, itemIdent);
  if (ifcKindOf(item) != "IfcAdvancedBrep") return Decline{"solid: " + kindOr(ifcKindOf(item), "unreadable")};
  const Entity* shell = line(api, item->get("Outer"));
  const auto& faces = itemsOf(get(shell, "CfsFaces"));
  if (faces.empty()) return Decline{"solid: IfcAdvancedBrep with no shell"};
  const bool identity = &into == &IDENTITY;

  std::vector<std::vector<P3>> rings;
  std::vector<std::vector<std::vector<P3>>> faceVoids;
  for (const Value& handle : faces) {
    const Entity* face = line(api, handle);

    auto loopOfBound = [&](const Entity* bound) -> std::variant<std::vector<P3>, Decline> {
      const Entity* loop = line(api, get(bound, "Bound"));
      if (ifcKindOf(loop) != "IfcEdgeLoop") return Decline{"solid: advanced face bounded by " + kindOr(ifcKindOf(loop), "nothing")};
      std::vector<P3> ring;
      for (const Value& eh : itemsOf(loop->get("EdgeList"))) {
        const Entity* oriented = line(api, eh);
        const Entity* edge = line(api, get(oriented, "EdgeElement"));
        const Value& geometry = get(edge, "EdgeGeometry");
        if (geometry.isNull()) return Decline{"solid: advanced edge with no geometry"};
        std::vector<P3> partPoints;
        if (ifcKindOf(line(api, geometry)) == "IfcLine") {
          auto from = cornerSpot(api, get(edge, "EdgeStart"));
          auto to = cornerSpot(api, get(edge, "EdgeEnd"));
          if (!from || !to) return Decline{"solid: advanced straight edge with no vertices"};
          partPoints = {*from, *to};
        } else {
          Traced part = traceCurve(api, geometry, ctx);
          if (isDecline(part)) {
            std::string r = std::get<Decline>(part).reason;
            if (r.rfind("curve: ", 0) == 0) r = r.substr(7);
            return Decline{"solid: advanced edge is " + r};
          }
          partPoints = std::move(std::get<Filament>(part).points);
        }
        const auto edgeSense = asBool(get(oriented, "Orientation"));
        if (edgeSense != false) appendRun(ring, partPoints);
        else { std::vector<P3> rev(partPoints.rbegin(), partPoints.rend()); appendRun(ring, rev); }
      }
      std::vector<P3> closed = unclosedRing(ring);
      if (closed.size() >= 3) return closed;
      return Decline{"solid: advanced face with fewer than three corners"};
    };

    const Entity* outer = nullptr;
    std::vector<const Entity*> inner;
    for (const Value& bh : itemsOf(get(face, "Bounds"))) {
      const Entity* bound = line(api, bh);
      if (ifcKindOf(bound) == "IfcFaceOuterBound" && !outer) { outer = bound; continue; }
      inner.push_back(bound);
    }
    if (!outer && !inner.empty()) { outer = inner.front(); inner.erase(inner.begin()); }

    auto ring = loopOfBound(outer);
    if (std::holds_alternative<Decline>(ring)) return std::move(std::get<Decline>(ring));
    std::vector<std::vector<P3>> voids;
    for (const Entity* bound : inner) {
      auto hole = loopOfBound(bound);
      if (std::holds_alternative<Decline>(hole)) return std::move(std::get<Decline>(hole));
      auto& h = std::get<std::vector<P3>>(hole);
      voids.push_back(identity ? std::move(h) : placedRing(into, h));
    }
    auto& r = std::get<std::vector<P3>>(ring);
    rings.push_back(identity ? std::move(r) : placedRing(into, r));
    faceVoids.resize(rings.size());
    if (!voids.empty()) faceVoids[rings.size() - 1] = std::move(voids);
  }

  AssembledShell report = stitchUpShell(rings, faceVoids);
  if (!report.graph || (!report.graph->panelTally() && !report.cancelled))
    return Decline{"solid: IfcAdvancedBrep with every face degenerate"};
  return std::move(report.graph);
}

struct HalfSpace { P3 through; P3 normal; };

std::optional<HalfSpace> halfSpaceOf(Model& api, const Value& ref, const Placement4x4& into) {
  const Entity* half = line(api, ref);
  if (!half) return std::nullopt;
  const Entity* surface = line(api, half->get("BaseSurface"));
  if (ifcKindOf(surface) != "IfcPlane") return std::nullopt;
  const Placement4x4 frame = compose(into, axisFrame(api, surface->get("Position")));
  const P3 through = place(frame, {0, 0, 0});
  const P3 up = turn(frame, {0, 0, 1});
  const auto agree = asBool(half->get("AgreementFlag"));
  const double sign = agree == true ? -1 : 1;
  return HalfSpace{through, {up[0] * sign, up[1] * sign, up[2] * sign}};
}

struct BoundedTool { GP graph; bool wholeSubject = false; };
using Bounded = std::variant<BoundedTool, Decline>;

Bounded boundedHalfSpaceTool(Model& api, const Value& ref, const Placement4x4& into, const MakeSettings& ctx,
                             const G& subject, bool wholeAllowed = true) {
  const Entity* half = line(api, ref);
  const auto plane = halfSpaceOf(api, ref, into);
  if (!half || !plane) return Decline{"boolean: bounded half space has no readable plane"};
  Traced outlineRead = traceCurve(api, half->get("PolygonalBoundary"), ctx);
  if (isDecline(outlineRead)) return takeDecline(outlineRead);
  std::vector<P3> pts = std::get<Filament>(outlineRead).points;
  while (pts.size() > 1) {
    const P3 &a = pts.front(), &b = pts.back();
    if (a[0] != b[0] || a[1] != b[1]) break;
    pts.pop_back();
  }
  if (pts.size() < 3) return Decline{"boolean: bounded half space boundary has fewer than three points"};
  const Placement4x4 frame = compose(into, axisFrame(api, half->get("Position")));
  const P3 origin = place(frame, {0, 0, 0});
  {
    const Placement4x4 inverse = undoRigid(frame);
    auto inside = [&](double x, double y) {
      bool odd = false;
      for (size_t i = 0, j = pts.size() - 1; i < pts.size(); j = i++) {
        const P3 &a = pts[i], &b = pts[j];
        if ((a[1] > y) != (b[1] > y) && x < a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0])) odd = !odd;
      }
      return odd;
    };
    const double tol = fuseDistance();
    auto nearEdge = [&](double x, double y) {
      for (size_t i = 0, j = pts.size() - 1; i < pts.size(); j = i++) {
        const P3 &a = pts[j], &b = pts[i];
        const double dx = b[0] - a[0], dy = b[1] - a[1];
        double den = dx * dx + dy * dy;
        if (!truthy(den)) den = 1;
        const double t = jsMax(0.0, jsMin(1.0, ((x - a[0]) * dx + (y - a[1]) * dy) / den));
        if (hypot2(a[0] + t * dx - x, a[1] + t * dy - y) <= tol) return true;
      }
      return false;
    };
    bool all = true;
    for (int32_t v = 0; v < subject.cornerTally() && all; v++) {
      const P3 local = place(inverse, {subject.pointXOf(v), subject.pointYOf(v), subject.pointZOf(v)});
      all = inside(local[0], local[1]) || nearEdge(local[0], local[1]);
    }
    if (all && wholeAllowed) return BoundedTool{nullptr, true};
    const size_t n = pts.size();
    double turnSign = 0;
    bool convex = clearSides;
    for (size_t i = 0; i < n && convex; i++) {
      const P3 &a = pts[i], &b = pts[(i + 1) % n], &c = pts[(i + 2) % n];
      const double cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
      if (std::fabs(cross) < 1e-12) continue;
      if (truthy(turnSign) && jsSign(cross) != turnSign) convex = false;
      turnSign = jsSign(cross);
    }
    if (convex && truthy(turnSign)) {
      std::vector<P3> local;
      for (int32_t v = 0; v < subject.cornerTally(); v++)
        local.push_back(place(inverse, {subject.pointXOf(v), subject.pointYOf(v), subject.pointZOf(v)}));
      double far = 1;
      for (const P3& p : local) far = jsMax(far, hypot2(p[0], p[1]));
      for (const P3& p : pts) far = jsMax(far, hypot2(p[0], p[1]));
      struct Side { double px, py, dx, dy; bool moved; };
      std::vector<Side> lines;
      for (size_t i = 0; i < n; i++) {
        const P3 &a = pts[i], &b = pts[(i + 1) % n];
        double len = hypot2(b[0] - a[0], b[1] - a[1]);
        if (!truthy(len)) len = 1;
        const double nx = (turnSign * (b[1] - a[1])) / len, ny = (-turnSign * (b[0] - a[0])) / len;
        double reachOut = -std::numeric_limits<double>::infinity();
        for (const P3& p : local) reachOut = jsMax(reachOut, (p[0] - a[0]) * nx + (p[1] - a[1]) * ny);
        const double push = reachOut <= tol ? jsMax(0.01 * far, 100 * tol) : 0;
        lines.push_back({a[0] + nx * push, a[1] + ny * push, b[0] - a[0], b[1] - a[1], push > 0});
      }
      bool anyMoved = false;
      for (const Side& l : lines) anyMoved = anyMoved || l.moved;
      if (anyMoved) {
        std::vector<P3> moved;
        for (size_t i = 0; i < n; i++) {
          const Side &p = lines[(i + n - 1) % n], &q = lines[i];
          const double det = p.dx * q.dy - p.dy * q.dx;
          if (std::fabs(det) < 1e-12) { moved.clear(); break; }
          const double t = ((q.px - p.px) * q.dy - (q.py - p.py) * q.dx) / det;
          moved.push_back({p.px + t * p.dx, p.py + t * p.dy, 0});
        }
        bool settled = moved.size() == n;
        for (const P3& p : moved) if (!(hypot2(p[0], p[1]) <= 3 * far)) settled = false;
        if (settled) pts = std::move(moved);
      }
    }
  }
  double reach = 1;
  for (int32_t v = 0; v < subject.cornerTally(); v++) {
    reach = jsMax(reach, hypot3(subject.pointXOf(v) - origin[0], subject.pointYOf(v) - origin[1], subject.pointZOf(v) - origin[2]));
  }
  const double length = 4 * reach;
  std::vector<P3> ring;
  for (const P3& p : pts) ring.push_back(place(frame, {p[0], p[1], -length / 2}));
  GP prism = pushProfile(ring, turn(frame, {0, 0, length}));
  if (!prism) return Decline{"boolean: bounded half space boundary does not bound a region"};
  const P3 flipped = {-plane->normal[0], -plane->normal[1], -plane->normal[2]};
  GP tool = kClip(*prism, plane->through, flipped);
  if (!tool) return Decline{"boolean: bounded half space misses its own boundary"};
  return BoundedTool{std::move(tool), false};
}

Solid buildSubtrahend(Model& api, uint32_t ref, const Placement4x4& into, const MakeSettings& ctx, int depth) {
  Solid exact = buildAnySolid(api, ref, into, ctx, depth);
  if (!(growSubtrahends > 0) || !isG(exact)) return exact;
  const G& g = *graphOf(exact);
  const int32_t n = g.cornerTally();
  if (!n) return exact;
  double cx = 0, cy = 0, cz = 0;
  for (int32_t v = 0; v < n; v++) { cx += g.pointXOf(v); cy += g.pointYOf(v); cz += g.pointZOf(v); }
  cx /= n; cy /= n; cz /= n;
  const double k = 1 + growSubtrahends;
  const Placement4x4 grow = {{{k, 0, 0, cx * (1 - k)}, {0, k, 0, cy * (1 - k)}, {0, 0, k, cz * (1 - k)}, {0, 0, 0, 1}}};
  Solid bigger = buildAnySolid(api, ref, compose(grow, into), ctx, depth);
  return isG(bigger) ? std::move(bigger) : std::move(exact);
}

}  // namespace

Solid buildFaceSet(Model& api, uint32_t itemIdent, const Placement4x4& into) {
  const Entity* item = line(api, itemIdent);
  const std::string_view kind = ifcKindOf(item);
  std::vector<std::vector<P3>> rings;
  std::vector<std::vector<std::vector<P3>>> holes;  // sized to rings; empty = no voids

  if (kind == "IfcFacetedBrep" || kind == "IfcFaceBasedSurfaceModel" || kind == "IfcShellBasedSurfaceModel") {
    std::vector<const Entity*> shells;
    if (present(item->get("Outer"))) shells.push_back(line(api, item->get("Outer")));
    for (const char* key : {"FbsmFaces", "SbsmBoundary"})
      for (const Value& h : itemsOf(item->get(key))) shells.push_back(line(api, h));
    bool anyShell = false;
    for (const Entity* s : shells) anyShell = anyShell || s;
    if (!anyShell) return Decline{"solid: " + std::string(kind) + " with no shell"};

    auto ringOfBound = [&](const Entity* bound) -> std::optional<std::vector<P3>> {
      auto ring = circuitOf(api, get(bound, "Bound"));
      if (!ring) return std::nullopt;
      if (asBool(get(bound, "Orientation")) == false) std::reverse(ring->begin(), ring->end());
      return ring;
    };

    // The same walk read straight from the tokens (faces, bounds, loops, points: no Entity for any of
    // them); false on anything unexpected, and that shell is read the general way instead.
    static const bool slowFaces = std::getenv("BREP_SLOW_FACES") != nullptr;
    std::vector<uint32_t> faceIds, boundIds, pointIds;
    auto fastShell = [&](uint32_t shellId) -> bool {
      uint32_t type = 0;
      if (!api.refList(shellId, faceIds, type)) return false;
      const std::vector<uint32_t> faces = faceIds;
      auto ringOf = [&](uint32_t loopId, bool orientation, std::vector<P3>& ring) -> int {  // -1 unexpected, 0 none, 1 ring
        uint32_t loopType = 0;
        if (!api.refList(loopId, pointIds, loopType) || loopType != webifc::schema::IFCPOLYLOOP) return 0;
        ring.clear();
        ring.reserve(pointIds.size());
        for (uint32_t p : pointIds) {
          double v[3];
          int n = 0;
          if (!api.coords(p, v, n)) return -1;
          if (n < 3) return 0;
          ring.push_back({v[0], v[1], v[2]});
        }
        if (!orientation) std::reverse(ring.begin(), ring.end());
        return 1;
      };
      for (uint32_t faceId : faces) {
        uint32_t faceType = 0;
        if (!api.refList(faceId, boundIds, faceType)) return false;
        struct B { uint32_t loop; bool orientation; };
        std::optional<B> outer;
        std::vector<B> inner;
        for (uint32_t b : boundIds) {
          uint32_t loop = 0;
          bool orientation = true, isOuter = false;
          if (!api.faceBound(b, loop, orientation, isOuter)) return false;
          if (isOuter && !outer) outer = B{loop, orientation};
          else inner.push_back(B{loop, orientation});
        }
        if (!outer && !inner.empty()) { outer = inner.front(); inner.erase(inner.begin()); }
        if (!outer) continue;
        std::vector<P3> ring;
        const int got = ringOf(outer->loop, outer->orientation, ring);
        if (got < 0) return false;
        if (got == 0) continue;
        std::vector<std::vector<P3>> voids;
        for (const B& b : inner) {
          std::vector<P3> hole;
          const int h = ringOf(b.loop, b.orientation, hole);
          if (h < 0) return false;
          if (h > 0) voids.push_back(std::move(hole));
        }
        rings.push_back(std::move(ring));
        holes.resize(rings.size());
        if (!voids.empty()) holes[rings.size() - 1] = std::move(voids);
      }
      return true;
    };

    for (const Entity* shell : shells) {
      if (!shell) continue;
      if (!slowFaces) {
        const size_t mark = rings.size();
        if (fastShell(shell->id)) continue;
        rings.resize(mark);
        holes.resize(std::min(holes.size(), mark));
      }
      for (const Value& panelHandle : itemsOf(shell->get("CfsFaces"))) {
        const Entity* face = line(api, panelHandle);
        const Entity* outer = nullptr;
        std::vector<const Entity*> inner;
        for (const Value& boundHandle : itemsOf(get(face, "Bounds"))) {
          const Entity* bound = line(api, boundHandle);
          if (!bound) continue;
          if (ifcKindOf(bound) == "IfcFaceOuterBound" && !outer) outer = bound;
          else inner.push_back(bound);
        }
        if (!outer && !inner.empty()) { outer = inner.front(); inner.erase(inner.begin()); }
        if (!outer) continue;
        auto ring = ringOfBound(outer);
        if (!ring) continue;
        std::vector<std::vector<P3>> voids;
        for (const Entity* bound : inner) {
          auto hole = ringOfBound(bound);
          if (hole) voids.push_back(std::move(*hole));
        }
        rings.push_back(std::move(*ring));
        holes.resize(rings.size());
        if (!voids.empty()) holes[rings.size() - 1] = std::move(voids);
      }
    }
  } else if (kind == "IfcPolygonalFaceSet") {
    auto ptsRead = pointListOf(api, item->get("Coordinates"));
    if (!ptsRead) return Decline{"faceset: unreadable point list"};
    const std::vector<P3>& pts = *ptsRead;
    auto walk = [&](const Value* idx) -> std::optional<std::vector<P3>> {
      if (!idx || !idx->isList() || idx->list.size() < 3) return std::nullopt;
      std::vector<P3> ring;
      for (const Value& i : idx->list) {
        const P3* p = pointAt(pts, asPlainNumber(i));
        if (!p) return std::nullopt;
        ring.push_back(*p);
      }
      if (ring.size() >= 3) return ring;
      return std::nullopt;
    };
    for (const Value& panelHandle : itemsOf(item->get("Faces"))) {
      auto face = readIndexedFace(api, panelHandle);
      auto ring = walk(face ? face->coordIndex : nullptr);
      if (!ring) continue;
      std::vector<std::vector<P3>> voids;
      for (const Value* list : face->innerCoordIndices) {
        auto hole = walk(list);
        if (hole) voids.push_back(std::move(*hole));
      }
      rings.push_back(std::move(*ring));
      holes.resize(rings.size());
      if (!voids.empty()) holes[rings.size() - 1] = std::move(voids);
    }
  } else if (kind == "IfcTriangulatedFaceSet") {
    auto ptsRead = pointListOf(api, item->get("Coordinates"));
    if (!ptsRead) return Decline{"faceset: unreadable point list"};
    const std::vector<P3>& pts = *ptsRead;
    std::optional<std::vector<double>> pn;
    const Value& pnValue = item->get("PnIndex");
    if (pnValue.isList() && !pnValue.list.empty()) {
      std::vector<double> pnRead;
      bool ok = true;
      for (const Value& v : pnValue.list) {
        const double n = asPlainNumber(v);
        pnRead.push_back(n);
        if (!(isInteger(n) && n >= 1)) ok = false;
      }
      if (ok) pn = std::move(pnRead);
    }
    const Value& coordIndex = item->get("CoordIndex");
    const std::vector<Value>* triangles = coordIndex.isList() ? &coordIndex.list : nullptr;
    if (!triangles || triangles->empty()) {
      const Entity* raw = api.line(itemIdent);
      const double limit = pn ? (double)pn->size() : (double)pts.size();
      for (const Value& arg : raw ? raw->args : std::vector<Value>{}) {
        if (!arg.isList() || arg.list.empty() || !arg.list[0].isList()) continue;
        bool ints = true;
        for (const Value& t : arg.list) {
          if (!t.isList() || t.list.size() < 3) { ints = false; break; }
          for (const Value& v : t.list) {
            const double n = asPlainNumber(v);
            if (!(isInteger(n) && n >= 1 && n <= limit)) { ints = false; break; }
          }
          if (!ints) break;
        }
        if (ints) { triangles = &arg.list; break; }
      }
    }
    if (triangles) {
      for (const Value& tri : *triangles) {
        if (!tri.isList() || tri.list.size() < 3) continue;
        std::vector<P3> ring;
        for (const Value& raw : tri.list) {
          double at = asPlainNumber(raw);
          if (pn) {
            const double k = at - 1;
            at = (k >= 0 && k < (double)pn->size() && std::floor(k) == k) ? (*pn)[(size_t)k] : NaN;
          }
          const P3* p = pointAt(pts, at);
          if (!p) { ring.clear(); break; }
          ring.push_back(*p);
        }
        if (ring.size() >= 3) rings.push_back(std::move(ring));
      }
    }
  } else {
    return Decline{"solid: " + kindOr(kind, "unreadable")};
  }

  if (rings.empty()) return Decline{std::string(kind) + ": no usable faces"};

  static const bool stitchStats = std::getenv("BREP_STITCH_STATS") != nullptr;
  if (stitchStats) {
    // How many face sets repeat exactly (same corners, same placement): a measure for a memo.
    struct Census { std::unordered_map<uint64_t, int> seen; long total = 0, repeats = 0, repeatFaces = 0, faces = 0;
      ~Census() { std::fprintf(stderr, "STITCH face sets %ld, exact repeats %ld; faces %ld, in repeats %ld\n", total, repeats, faces, repeatFaces); } };
    static Census census;
    uint64_t h = 1469598103934665603ull;
    auto mix = [&](double v) { uint64_t b; std::memcpy(&b, &v, 8); h ^= b; h *= 1099511628211ull; };
    for (int i = 0; i < 4; i++) for (int j = 0; j < 4; j++) mix(into[i][j]);
    for (size_t r = 0; r < rings.size(); r++) {
      for (const P3& p : rings[r]) { mix(p[0]); mix(p[1]); mix(p[2]); }
      mix(-1);
      if (r < holes.size()) for (const auto& hole : holes[r]) { for (const P3& p : hole) { mix(p[0]); mix(p[1]); mix(p[2]); } mix(-2); }
    }
    census.total++;
    census.faces += (long)rings.size();
    if (census.seen[h]++ > 0) { census.repeats++; census.repeatFaces += (long)rings.size(); }
  }

  // A face set repeated exactly (same corners, same placement: copies of one family) is stitched once
  // and copied after; the key is the corners' bits, the placement and the weld distance.
  static const bool memoOn = [] { const char* e = std::getenv("BREP_STITCH_MEMO"); return !e || e[0] != '0'; }();
  uint64_t memoKey = 0;
  struct MemoEntry { std::vector<double> input; std::shared_ptr<const LinkedShellGraph> graph; };
  struct Memo { std::unordered_map<uint64_t, MemoEntry> map; };
  std::vector<double> memoInput;
  static Memo memo;
  if (memoOn) {
    // the exact input, compared on a hit: the hash only finds the candidate
    uint64_t h = 0x9E3779B97F4A7C15ull;
    auto mix = [&](double v) {
      memoInput.push_back(v);
      uint64_t b;
      std::memcpy(&b, &v, 8);
      b += 0x9E3779B97F4A7C15ull + (h << 6) + (h >> 2);
      b = (b ^ (b >> 30)) * 0xBF58476D1CE4E5B9ull;
      b = (b ^ (b >> 27)) * 0x94D049BB133111EBull;
      h ^= b ^ (b >> 31);
    };
    mix(fuseDistance());
    for (int i = 0; i < 4; i++) for (int j = 0; j < 4; j++) mix(into[i][j]);
    mix((double)rings.size());
    for (size_t r = 0; r < rings.size(); r++) {
      for (const P3& p : rings[r]) { mix(p[0]); mix(p[1]); mix(p[2]); }
      mix(-1);
      if (r < holes.size()) for (const auto& hole : holes[r]) { for (const P3& p : hole) { mix(p[0]); mix(p[1]); mix(p[2]); } mix(-2); }
    }
    memoKey = h;
    auto hit = memo.map.find(memoKey);
    if (hit != memo.map.end() && hit->second.input == memoInput) return std::make_unique<LinkedShellGraph>(*hit->second.graph);
  }

  AssembledShell report;
  if (&into == &IDENTITY) {
    report = stitchUpShell(rings, holes);
  } else {
    std::vector<std::vector<P3>> placed;
    placed.reserve(rings.size());
    for (const auto& r : rings) placed.push_back(placedRing(into, r));
    std::vector<std::vector<std::vector<P3>>> placedHoles(holes.size());
    for (size_t i = 0; i < holes.size(); i++)
      for (const auto& h : holes[i]) placedHoles[i].push_back(placedRing(into, h));
    report = stitchUpShell(placed, placedHoles);
  }
  if (!report.graph || (!report.graph->panelTally() && !report.cancelled))
    return Decline{std::string(kind) + ": every face was degenerate"};
  if (memoOn) {
    if (memo.map.size() > 20000) memo.map.clear();  // bounded: a family repeats close together
    memo.map[memoKey] = MemoEntry{std::move(memoInput), std::make_shared<const LinkedShellGraph>(*report.graph)};
  }
  return std::move(report.graph);
}

Solid buildSweptSolid(Model& api, uint32_t itemIdent, const Placement4x4& into, const MakeSettings& ctx) {
  const Entity* item = line(api, itemIdent);
  const std::string_view kind = ifcKindOf(item);
  if (kind != "IfcExtrudedAreaSolid" && kind != "IfcRevolvedAreaSolid" && kind != "IfcExtrudedAreaSolidTapered")
    return Decline{"solid: " + kindOr(kind, "unreadable")};
  const Entity* area = line(api, item->get("SweptArea"));
  if (kind != "IfcExtrudedAreaSolidTapered" && ifcKindOf(area) == "IfcCompositeProfileDef") {
    std::vector<GP> parts;
    for (const Value& child : itemsOf(area->get("Profiles"))) {
      Solid part = sweptFromItem(api, *item, child, kind, into, ctx);
      if (!isG(part)) return part;
      parts.push_back(std::move(graphOf(part)));
    }
    if (parts.empty()) return Decline{"profile: composite profile with no parts"};
    GP whole = std::move(parts[0]);
    for (size_t i = 1; i < parts.size(); i++) {
      GP a = rewelded(std::move(whole));
      GP b = rewelded(std::move(parts[i]));
      whole = kUnion(*a, *b);
      if (!whole) return Decline{"profile: composite parts not joined (" + whyOr() + ")"};
    }
    return whole;
  }
  return sweptFromItem(api, *item, item->get("SweptArea"), kind, into, ctx);
}

Solid buildAnySolid(Model& api, uint32_t itemIdent, const Placement4x4& into, const MakeSettings& ctx, int depth) {
  if (depth > 512) return Decline{"solid: boolean nested too deeply"};

  const Entity* item = line(api, itemIdent);
  const std::string_view kind = ifcKindOf(item);

  if (kind == "IfcBooleanResult" || kind == "IfcBooleanClippingResult") {
    const std::string op = upper(item->get("Operator").text());
    const bool isUnion = op.find("UNION") != std::string::npos;
    if (isUnion || op.find("INTERSECTION") != std::string::npos) {
      Solid a = buildAnySolid(api, asHandle(item->get("FirstOperand")), into, ctx, depth + 1);
      if (!isG(a)) return a;
      Solid b = buildAnySolid(api, asHandle(item->get("SecondOperand")), into, ctx, depth + 1);
      if (!isG(b)) return b;
      GP ra = rewelded(std::move(graphOf(a)));
      GP rb = rewelded(std::move(graphOf(b)));
      GP joined = isUnion ? kUnion(*ra, *rb) : kIntersect(*ra, *rb);
      if (!joined) return Decline{"boolean: " + lower(op) + " refused (" + whyOr() + ")"};
      if (!joined->panelTally()) return Decline{"boolean: intersection is empty"};
      return joined;
    }
    if (op.find("DIFFERENCE") == std::string::npos) return Decline{"boolean: " + (op.empty() ? std::string("unknown") : op) + " not implemented"};

    // Flatten the chain of differences before cutting any of it.
    std::vector<uint32_t> tools;
    std::unordered_set<uint32_t> bounded;
    std::optional<uint32_t> seedHandle;
    const Entity* walk = item;
    for (int step = 0; step <= 512 && walk; step++) {
      const std::string wop = upper(walk->get("Operator").text());
      const uint32_t secondRef = asHandle(walk->get("SecondOperand"));
      const std::string_view otherKind = ifcKindOf(line(api, secondRef));
      const bool isBounded = flattenBoundedHalfSpaces && otherKind == "IfcPolygonalBoundedHalfSpace";
      const bool isHalfSpace = !isBounded && (otherKind == "IfcHalfSpaceSolid" || otherKind == "IfcPolygonalBoundedHalfSpace");
      // TS: `asHandle(walk)` of an entity object is null, so the seed is null here.
      if (wop.find("DIFFERENCE") == std::string::npos || isHalfSpace || secondRef == 0) { seedHandle.reset(); break; }
      tools.push_back(secondRef);
      if (isBounded) bounded.insert(secondRef);
      const uint32_t leadHandle = asHandle(walk->get("FirstOperand"));
      if (leadHandle == 0) { seedHandle.reset(); break; }
      const Entity* nested = line(api, leadHandle);
      const std::string_view nestedKind = ifcKindOf(nested);
      if (nestedKind != "IfcBooleanResult" && nestedKind != "IfcBooleanClippingResult") { seedHandle = leadHandle; break; }
      walk = nested;
    }

    if (!seedHandle || tools.empty()) {
      Solid first = buildAnySolid(api, asHandle(item->get("FirstOperand")), into, ctx, depth + 1);
      if (!isG(first)) return first;
      const Value& secondValue = item->get("SecondOperand");
      const uint32_t secondRef = asHandle(secondValue);
      const std::string_view otherKind = ifcKindOf(line(api, secondRef));
      if (otherKind == "IfcPolygonalBoundedHalfSpace") {
        Bounded tool = boundedHalfSpaceTool(api, secondValue, into, ctx, *graphOf(first));
        if (isDecline(tool)) return takeDecline(tool);
        BoundedTool& bt = std::get<BoundedTool>(tool);
        if (bt.wholeSubject) {
          const auto plane = halfSpaceOf(api, secondValue, into);
          GP clipped = kClip(*graphOf(first), plane->through, plane->normal);
          if (!clipped) return Decline{"boolean: clip produced nothing"};
          return clipped;
        }
        GP base = rewelded(std::move(graphOf(first)));
        GP cut = kSubtract(base, *bt.graph);
        if (!cut) return Decline{"boolean: bounded half space not subtracted (" + whyOr() + ")"};
        return cut;
      }
      if (otherKind == "IfcHalfSpaceSolid" || otherKind == "IfcPolygonalBoundedHalfSpace") {
        const auto plane = halfSpaceOf(api, secondValue, into);
        if (!plane) return Decline{"boolean: half space has no readable plane"};
        GP clipped = kClip(*graphOf(first), plane->through, plane->normal);
        if (!clipped) return Decline{"boolean: clip produced nothing"};
        return clipped;
      }
      Solid second = buildSubtrahend(api, secondRef, into, ctx, depth + 1);
      if (!isG(second)) return second;
      GP base = rewelded(std::move(graphOf(first)));
      GP cut = kSubtract(base, *graphOf(second));
      if (!cut) return Decline{"boolean: subtraction refused (" + whyOr() + ")"};
      return cut;
    }

    Solid built = buildAnySolid(api, *seedHandle, into, ctx, depth + 1);
    if (!isG(built)) return built;
    GP base = rewelded(std::move(graphOf(built)));
    const G* uncut = base.get();
    std::vector<GP> keepAlive;  // `uncut` must outlive every reassignment of `base`
    std::vector<GP> cutters;
    for (uint32_t ref : tools) {
      Value refValue;
      refValue.kind = Value::Kind::Ref;
      refValue.ref = ref;
      if (bounded.count(ref)) {
        Bounded tool = boundedHalfSpaceTool(api, refValue, into, ctx, *uncut);
        if (isDecline(tool)) return takeDecline(tool);
        BoundedTool& bt = std::get<BoundedTool>(tool);
        if (bt.wholeSubject) {
          const auto plane = halfSpaceOf(api, refValue, into);
          GP clipped = kClip(*base, plane->through, plane->normal);
          if (!clipped) return Decline{"boolean: clip produced nothing"};
          keepAlive.push_back(std::move(base));
          base = rewelded(std::move(clipped));
          continue;
        }
        cutters.push_back(std::move(bt.graph));
        continue;
      }
      Solid tool = buildSubtrahend(api, ref, into, ctx, depth + 1);
      if (!isG(tool)) return tool;
      cutters.push_back(std::move(graphOf(tool)));
    }
    if (cutters.empty()) return base;
    if (chainOrder != 0 && cutters.size() > 1) {
      if (chainOrder == 2) std::reverse(cutters.begin(), cutters.end());
      GP at = std::move(base);
      for (GP& tool : cutters) {
        std::vector<GP> one;
        one.push_back(std::move(tool));
        GP next = kCutAway(at, one);
        if (!next) return Decline{"boolean: subtraction refused (" + whyOr() + ")"};
        keepAlive.push_back(std::move(at));
        at = std::move(next);
      }
      return at;
    }
    GP cut = kCutAway(base, cutters);
    if (!cut) return Decline{"boolean: subtraction refused (" + whyOr() + ")"};
    return cut;
  }

  if (kind == "IfcSphere") {
    const double r = asPlainNumber(item->get("Radius"));
    if (!(r > 0)) return Decline{"solid: sphere with no radius"};
    const Placement4x4 frame = compose(into, axisFrame(api, item->get("Position")));
    const std::vector<P3> half = placedRing(frame, arcStations({0, 0, 0}, {0, 0, -1}, {1, 0, 0}, r, 0, PI));
    BuildReport why;
    GP ball = revolveProfile(half, place(frame, {0, 0, 0}), turn(frame, {0, 0, 1}), 2 * PI, facetsForSweep(2 * PI), &why);
    if (!ball) return Decline{"solid: sphere: " + reasonOr(why, "revolve produced no body")};
    return ball;
  }

  Solid swept = buildSweptSolid(api, itemIdent, into, ctx);
  if (isG(swept)) return swept;
  Solid pipe = makeTubeSweep(api, itemIdent, into, ctx);
  if (isG(pipe)) return pipe;
  if (kind == "IfcSurfaceCurveSweptAreaSolid") return buildSurfaceCurveSwept(api, itemIdent, into, ctx);
  Solid faces = buildFaceSet(api, itemIdent, into);
  if (isG(faces)) return faces;
  const bool faceKind = (kind.size() >= 7 && kind.substr(kind.size() - 7) == "FaceSet") ||
                        kind.find("FacetedBrep") != std::string_view::npos;
  if (faceKind) return faces;
  if (kind == "IfcAdvancedBrep") return buildAdvancedBrep(api, itemIdent, into, ctx);
  return kind == "IfcSweptDiskSolid" || kind == "IfcSweptDiskSolidPolygonal" ? std::move(pipe) : std::move(swept);
}

// ── bench helpers: repmap.mjs ────────────────────────────────────────────────────────────────────

namespace {

struct Leaf { uint32_t id; std::string type; };

void resolveItem(Model& api, uint32_t itemID, int depth, std::unordered_set<uint32_t>& seen, std::vector<Leaf>& out) {
  if (depth > 8 || seen.count(itemID)) return;
  seen.insert(itemID);
  const Entity* l = line(api, itemID);
  if (!l) return;
  const std::string type = std::string(l->kind());
  if (type != "IfcMappedItem") { out.push_back({itemID, type}); return; }
  std::vector<Leaf> sub;
  const Entity* src = present(l->get("MappingSource")) ? line(api, l->get("MappingSource")) : nullptr;
  const Entity* mapped = src && present(src->get("MappedRepresentation")) ? line(api, src->get("MappedRepresentation")) : nullptr;
  for (const Value& s : itemsOf(get(mapped, "Items"))) resolveItem(api, asHandle(s), depth + 1, seen, sub);
  if (sub.empty()) out.push_back({itemID, type});
  else out.insert(out.end(), sub.begin(), sub.end());
}

std::string repIdOf(const Entity* sr) {
  const Value& ident = sr->get("RepresentationIdentifier");
  if (!ident.isNull()) return ident.text();
  const Value& type = sr->get("RepresentationType");
  if (!type.isNull()) return type.text();
  return "?";
}

}  // namespace

std::vector<std::pair<uint32_t, RepInfo>> buildRepMap(Model& api, const std::vector<uint32_t>& productIDs) {
  std::vector<std::pair<uint32_t, RepInfo>> map;
  std::unordered_map<uint32_t, size_t> at;
  for (uint32_t pid : productIDs) {
    const Entity* product = line(api, pid);
    if (!product || product->get("Representation").isNull()) continue;
    const Entity* rep = line(api, product->get("Representation"));
    std::vector<const Entity*> reps;
    for (const Value& r : itemsOf(get(rep, "Representations"))) if (const Entity* e = line(api, r)) reps.push_back(e);
    for (const Entity* sr : reps) {
      const std::string repId = repIdOf(sr);
      const bool isBody = lower(repId) == "body";
      for (const Value& it : itemsOf(sr->get("Items"))) {
        std::unordered_set<uint32_t> seen;
        std::vector<Leaf> leaves;
        resolveItem(api, asHandle(it), 0, seen, leaves);
        for (Leaf& leaf : leaves) {
          auto found = at.find(leaf.id);
          if (found == at.end()) {
            at.emplace(leaf.id, map.size());
            map.push_back({leaf.id, RepInfo{repId, leaf.type}});
          } else if (isBody && lower(map[found->second].second.rep) != "body") {
            map[found->second].second = RepInfo{repId, leaf.type};
          }
        }
      }
    }
  }
  return map;
}

// ── bench driver: bake-kernel-one.mjs per product, then the web-ifc fallback ───────────────────

namespace {

struct Opening { uint32_t item; Placement4x4 into; };

// web-ifc ids an accepted kernel item stands for: itself, and a surface model's shells (web-ifc
// reports those one geometry per shell, or the model whole when it merges tiny shells). Returns
// how many geometries web-ifc would report for it (per shell for a surface model).
long coverIds(Model& api, uint32_t item, std::unordered_set<uint32_t>& covered) {
  covered.insert(item);
  const Entity* e = api.line(item);
  if (!e) return 1;
  const std::string_view kind = e->kind();
  const char* key = kind == "IfcFaceBasedSurfaceModel" ? "FbsmFaces" : kind == "IfcShellBasedSurfaceModel" ? "SbsmBoundary" : nullptr;
  if (!key) return 1;
  long n = 0;
  for (const Value& s : e->get(key).items()) if (s.isRef()) { covered.insert(s.ref); n++; }
  return n ? n : 1;
}

// True for an item web-ifc's mesher yields no triangles for (curves, points, edges, text, boxes,
// sets of those, types it does not know): such leaves never appear in path A.
bool emitsNoTriangles(Model& api, uint32_t id, int depth) {
  const Entity* e = api.line(id);
  if (!e || !e->info) return true;
  const std::string_view kind = e->kind();
  if (e->isA("IfcCurve") || e->isA("IfcPoint") || kind == "IfcEdge" || kind == "IfcEdgeCurve" ||
      kind == "IfcTextLiteral" || kind == "IfcTextLiteralWithExtent" || kind == "IfcBoundingBox")
    return true;
  if (kind == "IfcGeometricSet" || kind == "IfcGeometricCurveSet") {
    if (depth > 8) return false;
    for (const Value& el : e->get("Elements").items())
      if (!el.isRef() || !emitsNoTriangles(api, el.ref, depth + 1)) return false;
    return true;
  }
  return false;
}

struct Tally {
  std::vector<std::pair<std::string, long>> list;
  std::unordered_map<std::string, size_t> at;
  std::string last;  // the latest note, for the per-product fallback log
  void note(const std::string& k) {
    last = k;
    auto f = at.find(k);
    if (f == at.end()) { at.emplace(k, list.size()); list.push_back({k, 1}); }
    else list[f->second].second++;
  }
};

// Whether any facet's corners leave the facet's plane by more than 1e-6 of the body's size: a face on
// a curved surface the reader could only bound (an advanced brep's B-spline or cylindrical face)
// comes out as one polygon off its own plane, which drawn is flat where the surface curves.
// The largest facet-plane deviation relative to the body's size (diagnostics only).
double worstWarp(const G& g) {
  const int32_t nv = g.cornerTally();
  if (nv == 0) return 0;
  double lo[3] = {1e300, 1e300, 1e300}, hi[3] = {-1e300, -1e300, -1e300};
  for (int32_t v = 0; v < nv; v++) {
    const double p[3] = {g.pointXOf(v), g.pointYOf(v), g.pointZOf(v)};
    for (int a = 0; a < 3; a++) { lo[a] = std::min(lo[a], p[a]); hi[a] = std::max(hi[a], p[a]); }
  }
  const double size = std::max({hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]}) + 1e-300;
  double worst = 0;
  for (int32_t f = 0; f < g.panelTally(); f++) {
    const std::vector<int32_t> r = g.outerRingOf(f);
    if (r.size() <= 3) continue;
    double nx = 0, ny = 0, nz = 0;
    for (size_t a = 0; a < r.size(); a++) {
      const int32_t p = r[a], q = r[(a + 1) % r.size()];
      nx += (g.pointYOf(p) - g.pointYOf(q)) * (g.pointZOf(p) + g.pointZOf(q));
      ny += (g.pointZOf(p) - g.pointZOf(q)) * (g.pointXOf(p) + g.pointXOf(q));
      nz += (g.pointXOf(p) - g.pointXOf(q)) * (g.pointYOf(p) + g.pointYOf(q));
    }
    const double len = std::sqrt(nx * nx + ny * ny + nz * nz);
    if (len == 0) continue;
    nx /= len; ny /= len; nz /= len;
    const double d = nx * g.pointXOf(r[0]) + ny * g.pointYOf(r[0]) + nz * g.pointZOf(r[0]);
    for (int32_t v : r) worst = std::max(worst, std::fabs(nx * g.pointXOf(v) + ny * g.pointYOf(v) + nz * g.pointZOf(v) - d) / size);
  }
  return worst;
}

// A faceted solid whose authored faces are flat only to a modeller's precision (≤1e-2 of its size)
// comes out with facets slightly off their plane; drawn, they are the file's own faces, as web-ifc
// draws them. A surface the reader could only bound is caught before building (curvedAdvancedBrep);
// past that, only a bend this large means a curve drawn flat.
bool hasWarpedFacet(const G& g);
bool warpedBeyondFlat(const G& g) {
  static const double limit = [] { const char* e = std::getenv("BREP_WARP_LIMIT"); return e ? std::atof(e) : 1e-2; }();
  return limit <= 1e-6 ? hasWarpedFacet(g) : worstWarp(g) > limit;
}

bool hasWarpedFacet(const G& g) {
  const int32_t nv = g.cornerTally();
  if (nv == 0) return false;
  double lo[3] = {1e300, 1e300, 1e300}, hi[3] = {-1e300, -1e300, -1e300};
  for (int32_t v = 0; v < nv; v++) {
    const double p[3] = {g.pointXOf(v), g.pointYOf(v), g.pointZOf(v)};
    for (int a = 0; a < 3; a++) { lo[a] = std::min(lo[a], p[a]); hi[a] = std::max(hi[a], p[a]); }
  }
  const double size = std::max({hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]});
  const double tol = 1e-6 * size + 1e-12;
  for (int32_t f = 0; f < g.panelTally(); f++) {
    const std::vector<int32_t> r = g.outerRingOf(f);
    if (r.size() <= 3) continue;
    double nx = 0, ny = 0, nz = 0;
    for (size_t a = 0; a < r.size(); a++) {
      const int32_t p = r[a], q = r[(a + 1) % r.size()];
      nx += (g.pointYOf(p) - g.pointYOf(q)) * (g.pointZOf(p) + g.pointZOf(q));
      ny += (g.pointZOf(p) - g.pointZOf(q)) * (g.pointXOf(p) + g.pointXOf(q));
      nz += (g.pointXOf(p) - g.pointXOf(q)) * (g.pointYOf(p) + g.pointYOf(q));
    }
    const double len = std::sqrt(nx * nx + ny * ny + nz * nz);
    if (len == 0) continue;
    nx /= len; ny /= len; nz /= len;
    const double d = nx * g.pointXOf(r[0]) + ny * g.pointYOf(r[0]) + nz * g.pointZOf(r[0]);
    for (int32_t v : r)
      if (std::fabs(nx * g.pointXOf(v) + ny * g.pointYOf(v) + nz * g.pointZOf(v) - d) > tol) return true;
  }
  return false;
}

}  // namespace

PassB runB(Model& model, webifc::geometry::IfcGeometryProcessor& gp, const std::vector<uint32_t>& products,
           const brep::shells::GeometryProcessSettings& settings) {
  using Clock = std::chrono::steady_clock;
  PassB pass;
  Tally tally;
  const bool wantDigest = std::getenv("BREP_DIGEST") != nullptr;
  if (const char* g = std::getenv("BREP_GATE")) setGateCutsByToolBox(g[0] == '1');
  if (const char* c = std::getenv("BREP_SKIP_UNTOUCHING")) setSkipUntouchingTools(c[0] == '1');
  if (const char* c = std::getenv("BREP_PLANE_CAP")) setPlaneCap(std::atoi(c));
  if (const char* c = std::getenv("BREP_FRAGMENT_CAP")) setFragmentCap(std::atoi(c));
  // One line per Body item: id, accepted, signed volume (file units), facets -- to compare variants
  // that may change the facet partition but must not change the solid.
  std::FILE* itemLog = nullptr;
  if (const char* p = std::getenv("BREP_ITEMLOG")) itemLog = std::fopen(p, "w");
  const auto t0 = Clock::now();

  // Units: the weld tolerance in this file's units, set before anything is built; angles for the reader.
  const LengthScale unit = unitLengthFactor(model);
  const double scale = unit.scale;
  setWeldTolerance(WELD_METRES / scale);
  const AngleScale angle = readPlaneAngleScale(model);
  const MakeSettings ctx{angle.scale};
  pass.lengthScale = scale;
  pass.angleScale = angle.scale;

  // Openings: host -> opening elements.
  std::unordered_map<uint32_t, std::vector<uint32_t>> voidsOf;
  for (uint32_t rid : model.idsWithType(webifc::schema::IFCRELVOIDSELEMENT)) {
    const Entity* rel = line(model, rid);
    const uint32_t host = asHandle(get(rel, "RelatingBuildingElement"));
    const uint32_t hole = asHandle(get(rel, "RelatedOpeningElement"));
    if (!host || !hole) continue;
    voidsOf[host].push_back(hole);
  }
  pass.setupMs = ms(t0);

  auto openingsFor = [&](uint32_t hostID) {
    std::vector<Opening> list;
    auto holes = voidsOf.find(hostID);
    if (holes == voidsOf.end()) return list;
    const Placement4x4 hostInverse = undoRigid(placeOf(model, get(line(model, hostID), "ObjectPlacement")));
    for (uint32_t holeID : holes->second) {
      const Entity* hole = line(model, holeID);
      if (!hole || hole->get("Representation").isNull()) continue;
      const Entity* rep = line(model, hole->get("Representation"));
      std::vector<const Entity*> reps;
      for (const Value& r : itemsOf(get(rep, "Representations"))) if (const Entity* e = line(model, r)) reps.push_back(e);
      const Entity* body = nullptr;
      for (const Entity* sr : reps) {
        const Value& ident = sr->get("RepresentationIdentifier");
        if (lower(ident.isNull() ? std::string() : ident.text()) == "body") { body = sr; break; }
      }
      if (!body && !reps.empty()) body = reps[0];
      const Placement4x4 into = compose(hostInverse, placeOf(model, hole->get("ObjectPlacement")));
      for (const Value& it : itemsOf(get(body, "Items"))) list.push_back({asHandle(it), into});
    }
    return list;
  };

  // Path A's unit is web-ifc's geometry id, so B must serve every id A serves. `covered`: ids an
  // accepted kernel item stands for (a surface model is reported by web-ifc per shell, or whole);
  // `served`: ids already taken from a web-ifc mesh; `leafDone`: leaves already accounted for.
  std::unordered_set<uint32_t> seen, covered, served, leafDone;
  for (uint32_t pid : products) {
    auto tm = Clock::now();
    const auto repMap = buildRepMap(model, {pid});
    pass.mapMs += ms(tm);
    tally.last.clear();

    for (const auto& [geoID, info] : repMap) {
      if (lower(info.rep) != "body") continue;
      if (!seen.insert(geoID).second) continue;
      pass.attempted++;

      auto tk = Clock::now();
      const unsigned long long ck = brep::prof::threadCycles();
      const double os0 = ::brep::stats.outerShatter, oc0 = ::brep::stats.outerClassify, is0 = ::brep::stats.innerShatter,
                   ic0 = ::brep::stats.innerClassify;
      // One build of the body with its openings cut. `growTools` scales each opening about its centre
      // (the ladder's last rung); `first` books timings and notes, a retry stays silent.
      struct Attempt { GP solid; long openingsLeft = 0; };
      auto attempt = [&](double growTools, bool first) -> Attempt {
        Attempt out;
        try {
          auto tb = Clock::now();
          Solid built = buildAnySolid(model, geoID, IDENTITY, ctx);
          if (first) { const double dt = ms(tb); pass.buildMs += dt;
            const Entity* ie = model.line(geoID); std::string k = ie ? std::string(ie->kind()) : "?";
            bool f = false; for (auto& [n, t, c] : pass.buildByKind) if (n == k) { t += dt; c++; f = true; break; }
            if (!f) pass.buildByKind.emplace_back(k, dt, 1); }
          if (!isG(built)) {
            if (first) tally.note(std::get<Decline>(built).reason);
            return out;
          }
          out.solid = std::move(graphOf(built));
          long holeTrouble = 0;
          std::vector<GP> tools;
          auto tt = Clock::now();
          for (const Opening& opening : openingsFor(pid)) {
            try {
              Solid tool = buildAnySolid(model, opening.item, opening.into, ctx);
              if (isG(tool) && growTools > 0) {
                const G& t = *graphOf(tool);
                const int32_t n = t.cornerTally();
                double cx = 0, cy = 0, cz = 0;
                for (int32_t v = 0; v < n; v++) { cx += t.pointXOf(v); cy += t.pointYOf(v); cz += t.pointZOf(v); }
                cx /= n; cy /= n; cz /= n;
                const double k = 1 + growTools;
                const Placement4x4 grow{{{k, 0, 0, cx * (1 - k)}, {0, k, 0, cy * (1 - k)}, {0, 0, k, cz * (1 - k)}, {0, 0, 0, 1}}};
                Solid bigger = buildAnySolid(model, opening.item, compose(grow, opening.into), ctx);
                if (isG(bigger)) tool = std::move(bigger);
              }
              if (!isG(tool)) { if (first) tally.note("opening tool: " + std::get<Decline>(tool).reason); holeTrouble++; continue; }
              tools.push_back(std::move(graphOf(tool)));
            } catch (...) { holeTrouble++; }
          }
          if (first) pass.toolMs += ms(tt);
          if (!tools.empty()) {
            const long n = (long)tools.size();
            auto tc = Clock::now();
            GP trimmed = kCutAway(out.solid, tools);
            if (first) pass.cutMs += ms(tc);
            if (trimmed) out.solid = std::move(trimmed);
            else { if (first) tally.note("opening cut: " + kWhy()); holeTrouble += n; }
          }
          if (holeTrouble && first) tally.note("opening not subtracted (" + std::to_string(holeTrouble) + ")");
          out.openingsLeft = holeTrouble;
        } catch (const std::exception& e) {
          if (first) tally.note("threw: " + std::string(e.what()).substr(0, 60));
          out.solid.reset();
        } catch (...) {
          if (first) tally.note("threw: unknown");
          out.solid.reset();
        }
        return out;
      };
      // What path B may hand over in place of web-ifc's mesh.
      struct Verdict { bool accepted = false, watertight = false, excess = false, declaredSurface = false; };
      auto judge = [&](const Attempt& at) -> Verdict {
        Verdict v;
        if (!at.solid) return v;
        v.watertight = at.solid->isWatertight();
        v.excess = !at.solid->excessEdges.empty();
        // A surface the file itself declares open (a terrain, a sheet) is right to stay open: web-ifc
        // hands over the same open surface, so refusing it only pays twice for one answer.
        static const bool acceptSurfaces = [] { const char* e = std::getenv("BREP_ACCEPT_SURFACES"); return !e || e[0] != '0'; }();
        if (acceptSurfaces && !v.watertight && !v.excess) {
          if (const Entity* ie = model.line(geoID)) {
            const std::string_view k = ie->kind();
            if (k == "IfcShellBasedSurfaceModel" || k == "IfcFaceBasedSurfaceModel") v.declaredSurface = true;
            else if (k == "IfcTriangulatedFaceSet" || k == "IfcPolygonalFaceSet") {
              const Value& closed = ie->get("Closed");
              v.declaredSurface = closed.kind == Value::Kind::Bool && !closed.flag;
            }
          }
        }
        // A body missing one of its openings is not what path A delivers (web-ifc cuts them), so it
        // goes to web-ifc too. BREP_KEEP_UNCUT=1 restores the old acceptance, for comparison only.
        static const bool keepUncut = [] { const char* e = std::getenv("BREP_KEEP_UNCUT"); return e && e[0] == '1'; }();
        v.accepted = (v.watertight || v.declaredSurface) && !v.excess && (keepUncut || at.openingsLeft == 0) &&
                     !warpedBeyondFlat(*at.solid);
        return v;
      };

      Attempt got = attempt(0, true);
      Verdict verdict = judge(got);
      if (got.solid) {
        if (verdict.declaredSurface) tally.note("open surface accepted");
        if (!verdict.accepted) {
          if (!verdict.excess && (verdict.watertight || verdict.declaredSurface) && got.openingsLeft == 0) {
            const Entity* ie = model.line(geoID);
            const double w = worstWarp(*got.solid);
            tally.note("warped " + std::string(ie ? ie->kind() : "?") + " 1e" + std::to_string((int)std::floor(std::log10(w + 1e-300))));
          } else
            tally.note(verdict.excess ? "excess edges" : !(verdict.watertight || verdict.declaredSurface) ? "not watertight" : "openings left uncut");
        }
      }
      // THE RETRY LADDER (the bake's, as-baked.mjs): each rung rebuilds with one knob turned and is kept
      // only if the result passes the same judge, so an accepted body never meets it. Every rung is
      // kernel time spent to spare web-ifc the product; BREP_LADDER=1 turns it on.
      // 1 = the whole ladder; 2 = the short one: heal reveals and shell overlay, the two rungs that
      // rescued 318 of 340 bodies on the 40-file sample at a fraction of the rebuilds.
      static const int ladder = [] { const char* e = std::getenv("BREP_LADDER"); return e ? std::atoi(e) : 0; }();
      if (ladder > 0 && !verdict.accepted) {
        double weldWas = 0;
        const std::vector<std::pair<std::string, std::function<void(bool)>>> rungs = {
            {"shell overlay", [](bool on) { setShellOverlay(on); }},
            {"boolean voids", [](bool on) { setDirectVoids(!on); }},
            {"flatten faces", [](bool on) { setFlattenFaces(on); }},
            {"flatten + skip thin tools", [](bool on) { setFlattenFaces(on); setSkipThinTools(on); }},
            {"heal reveals", [](bool on) { setHealReveals(on); }},
            {"skip untouching tools", [](bool on) { setSkipUntouchingTools(on); }},
            {"chain reverse", [](bool on) { setChainOrder(on ? 2 : 0); }},
            {"chain forward", [](bool on) { setChainOrder(on ? 1 : 0); }},
            {"clear bounded sides", [](bool on) { setClearBoundedSides(on); }},
            {"clear + flatten bounded", [](bool on) { setClearBoundedSides(on); setFlattenBoundedHalfSpaces(on); }},
            {"weld /10", [&](bool on) { if (on) { weldWas = fuseDistance(); setWeldTolerance(weldWas / 10); } else setWeldTolerance(weldWas); }},
            {"weld /100", [&](bool on) { if (on) { weldWas = fuseDistance(); setWeldTolerance(weldWas / 100); } else setWeldTolerance(weldWas); }},
            {"weld /1000", [&](bool on) { if (on) { weldWas = fuseDistance(); setWeldTolerance(weldWas / 1000); } else setWeldTolerance(weldWas); }},
            {"plane overlay", [](bool on) { setPlaneOverlay(on); }},
            {"reverse second", [](bool on) { setReverseSecondClaimant(on); }},
            {"no drop second", [](bool on) { setDropSecondClaimant(!on); }},
            {"snap quasi-flush", [](bool on) { setSnapQuasiFlush(on); }},
            {"grow openings", [](bool) {}},
            {"grow subtrahends", [](bool on) { setGrowSubtrahends(on ? 1e-4 : 0); }},
        };
        for (const auto& [name, knob] : rungs) {
          if (ladder == 2 && name != "heal reveals" && name != "shell overlay") continue;
          const double grow = name == "grow openings" ? 1e-4 : 0;
          knob(true);
          Attempt redo;
          try { redo = attempt(grow, false); } catch (...) {}
          knob(false);
          const Verdict rv = judge(redo);
          pass.ladderTries++;
          if (rv.accepted) {
            got = std::move(redo);
            verdict = rv;
            pass.ladderRescued++;
            tally.note("ladder: " + name);
            break;
          }
        }
      }
      GP solid = std::move(got.solid);
      const bool accepted = verdict.accepted;
      pass.kernelMs += ms(tk);
      pass.kernelGcycles += (brep::prof::threadCycles() - ck) / 1e9;
      if (itemLog)
        std::fprintf(itemLog, "%u %d %.12g %d %u %.1f %zu %.1f %.1f %.1f %.1f\n", geoID, accepted ? 1 : 0, solid ? solid->enclosedSignedVolume() : 0.0,
                     solid ? solid->panelTally() : 0, pid, ms(tk), solid ? (size_t)solid->boundaryDarts() : (size_t)0,
                     ::brep::stats.outerShatter - os0, ::brep::stats.outerClassify - oc0, ::brep::stats.innerShatter - is0,
                     ::brep::stats.innerClassify - ic0);

      if (!accepted) continue;
      leafDone.insert(geoID);
      pass.coveredGeoms += coverIds(model, geoID, covered);

      // Graph -> shell: points in metres, one profile per facet (its outer ring), the other loops as holes.
      auto ts = Clock::now();
      const G& g = *solid;
      brep::shells::ShellData shell;
      const int32_t nv = g.cornerTally();
      shell.points.resize(nv);
      for (int32_t v = 0; v < nv; v++) shell.points[v] = {g.pointXOf(v) * scale, g.pointYOf(v) * scale, g.pointZOf(v) * scale};
      const int32_t nf = g.panelTally();
      std::vector<std::vector<std::vector<int32_t>>> holesOf(nf);
      for (int32_t l = 0; l < g.loopTally(); l++) {
        const int32_t f = g.loopFacetOf(l);
        if (f < 0 || f >= nf || g.facetOuterOf(f) == l) continue;
        holesOf[f].push_back(g.ringOwnedBy(l));
      }
      shell.profiles.reserve(nf);
      for (int32_t f = 0; f < nf; f++) {
        shell.profiles.emplace_back(f, g.outerRingOf(f));
        if (!holesOf[f].empty()) shell.holes.emplace_back(f, std::move(holesOf[f]));
      }
      pass.kernelProfiles += (long)shell.profiles.size();
      pass.profiles += (long)shell.profiles.size();
      pass.items++;
      pass.shellMs += ms(ts);
      if (wantDigest) {
        auto mix = [&](uint64_t x) { for (int b = 0; b < 8; b++) { pass.digest ^= (x >> (8 * b)) & 0xff; pass.digest *= 1099511628211ull; } };
        mix(geoID);
        for (const auto& p : shell.points) for (double d : p) { uint64_t bits; std::memcpy(&bits, &d, 8); mix(bits); }
        for (const auto& [f, ring] : shell.profiles) { mix((uint64_t)f); for (int32_t i : ring) mix((uint64_t)(uint32_t)i); mix(~0ull); }
        for (const auto& [f, hs] : shell.holes) { mix((uint64_t)f); for (const auto& r : hs) { for (int32_t i : r) mix((uint64_t)(uint32_t)i); mix(~1ull); } }
      }
    }

    // Fallback: any leaf (of any representation) web-ifc would triangulate that is neither built by
    // the kernel nor already served -> web-ifc meshes the product once; every geometry not covered
    // by an accepted kernel item goes through getShellData, exactly as in path A.
    auto tf = Clock::now();
    bool need = false;
    for (const auto& [leaf, info] : repMap) {
      if (leafDone.count(leaf)) continue;
      if (emitsNoTriangles(model, leaf, 0)) { leafDone.insert(leaf); continue; }
      need = true;
    }
    if (!need) { pass.fallbackMs += ms(tf); continue; }
    pass.fallbackProducts++;
    for (const auto& [leaf, info] : repMap) leafDone.insert(leaf);
    try {
      webifc::geometry::IfcFlatMesh mesh = gp.GetFlatMesh(pid);
      for (auto& placed : mesh.geometries) {
        if (covered.count(placed.geometryExpressID)) continue;
        if (!served.insert(placed.geometryExpressID).second) continue;
        auto& geom = gp.GetGeometry(placed.geometryExpressID);
        const float* vd = reinterpret_cast<const float*>(geom.GetVertexData());
        const uint32_t vn = geom.GetVertexDataSize();
        const uint32_t* id = reinterpret_cast<const uint32_t*>(geom.GetIndexData());
        const uint32_t in = geom.GetIndexDataSize();
        if (vn == 0 || in == 0) { pass.fallbackFailed++; continue; }
        const auto& m = placed.flatTransformation;
        const double sx = std::sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
        const double sy = std::sqrt(m[4] * m[4] + m[5] * m[5] + m[6] * m[6]);
        const double sz = std::sqrt(m[8] * m[8] + m[9] * m[9] + m[10] * m[10]);
        std::vector<float> pos(vn / 2), nor(vn / 2);
        for (uint32_t i = 0; i < vn; i += 6) {
          pos[i / 2] = (float)(vd[i] * sx); pos[i / 2 + 1] = (float)(vd[i + 1] * sy); pos[i / 2 + 2] = (float)(vd[i + 2] * sz);
          nor[i / 2] = vd[i + 3]; nor[i / 2 + 1] = vd[i + 4]; nor[i / 2 + 2] = vd[i + 5];
        }
        try {
          auto shell = brep::shells::getShellData(pos.data(), nor.data(), pos.size(), id, in, false, settings);
          pass.profiles += (long)shell.profilesFaceIds.size();
          pass.fallback++;
        } catch (...) {
          pass.fallbackFailed++;
        }
      }
    } catch (...) {
      pass.fallbackThrew++;
    }
    gp.Clear();
    pass.fallbackMs += ms(tf);
    static const bool logFallback = std::getenv("BENCH_FALLBACK_LOG") != nullptr;
    if (logFallback) std::fprintf(stderr, "FALLBACK %u %.1f ms | %s\n", pid, ms(tf), tally.last.c_str());
  }

  if (std::getenv("BENCH_PHASES")) {
    std::fprintf(stderr, "PRISM2D tried %ld done %ld (layered %ld, stepped tools %ld) notPrism %ld partial %ld failed %ld (%.0f ms)\n", prismCutStats.tried, prismCutStats.done, prismCutStats.layered, prismCutStats.stepped, prismCutStats.notPrism, prismCutStats.partial, prismCutStats.failed, prismCutStats.ms);
    const auto& s = ::brep::stats;
    std::fprintf(stderr, "PHASES boolean %.0f ms (%lld calls) | outer shatter %.0f classify %.0f (%lld frags) | inner shatter %.0f classify %.0f (%lld frags)\n",
                 s.booleanMs, (long long)s.booleanCalls, s.outerShatter, s.outerClassify, (long long)s.outerFragments, s.innerShatter,
                 s.innerClassify, (long long)s.innerFragments);
  }
  pass.declines = std::move(tally.list);
  pass.totalMs = ms(t0);
  if (itemLog) std::fclose(itemLog);
  return pass;
}

namespace {
std::string jsonString(const std::string& s) {
  std::string out = "\"";
  for (char c : s) {
    switch (c) {
      case '"': out += "\\\""; break;
      case '\\': out += "\\\\"; break;
      case '\n': out += "\\n"; break;
      case '\r': out += "\\r"; break;
      case '\t': out += "\\t"; break;
      default:
        if ((unsigned char)c < 0x20) { char buf[8]; std::snprintf(buf, sizeof buf, "\\u%04x", c); out += buf; }
        else out += c;
    }
  }
  return out + "\"";
}
}  // namespace

std::string toJson(const PassB& p, double firstTotalMs) {
  std::ostringstream o;
  o << "{\"totalMs\":" << p.totalMs << ",\"setupMs\":" << p.setupMs << ",\"mapMs\":" << p.mapMs
    << ",\"kernelMs\":" << p.kernelMs << ",\"kernelGcycles\":" << p.kernelGcycles << ",\"buildMs\":" << p.buildMs << ",\"toolMs\":" << p.toolMs
    << ",\"cutMs\":" << p.cutMs << ",\"shellMs\":" << p.shellMs << ",\"fallbackMs\":" << p.fallbackMs
    << ",\"attempted\":" << p.attempted << ",\"items\":" << p.items << ",\"coveredGeoms\":" << p.coveredGeoms
    << ",\"profiles\":" << p.profiles << ",\"kernelProfiles\":" << p.kernelProfiles << ",\"fallback\":" << p.fallback
    << ",\"fallbackFailed\":" << p.fallbackFailed << ",\"fallbackProducts\":" << p.fallbackProducts
    << ",\"fallbackThrew\":" << p.fallbackThrew << ",\"ladderTries\":" << p.ladderTries << ",\"ladderRescued\":" << p.ladderRescued
    << ",\"lengthScale\":" << p.lengthScale << ",\"angleScale\":";
  if (p.angleScale) o << *p.angleScale; else o << "null";
  { char buf[32]; std::snprintf(buf, sizeof buf, "%016llx", (unsigned long long)p.digest); o << ",\"digest\":\"" << buf << "\""; }
  o << ",\"buildByKind\":{";
  for (size_t i = 0; i < p.buildByKind.size(); i++) {
    const auto& [n, t, c] = p.buildByKind[i];
    o << (i ? "," : "") << jsonString(n) << ":[" << t << "," << c << "]";
  }
  o << "}";
  o << ",\"firstMs\":" << firstTotalMs << ",\"declines\":{";
  for (size_t i = 0; i < p.declines.size(); i++) {
    if (i) o << ',';
    o << jsonString(p.declines[i].first) << ':' << p.declines[i].second;
  }
  o << "}}";
  return o.str();
}

}  // namespace brep::ifc

// ── BrepEngine ──────────────────────────────────────────────────────────────────────────────────

namespace brep::ifc {

struct BrepEngine::Impl {
  Model model;
  webifc::geometry::IfcGeometryProcessor& gp;
  MakeSettings ctx;
  std::unordered_map<uint32_t, std::vector<uint32_t>> voidsOf;
  // The shell per Body item of a product without openings (null: refused), shared by every product
  // that maps the same item.
  std::unordered_map<uint32_t, std::shared_ptr<EngineShell>> shellCache;
  int64_t warped = 0;  // bodies refused for a facet off its own plane
  bool skipUntouching = true;  // BREP_SKIP_UNTOUCHING=0 cuts with every tool

  Impl(webifc::parsing::IfcLoader& l, const webifc::schema::IfcSchemaManager& s, webifc::geometry::IfcGeometryProcessor& p)
      : model(l, s), gp(p) {
    const LengthScale unit = unitLengthFactor(model);
    setWeldTolerance(WELD_METRES / unit.scale);
    ctx = MakeSettings{readPlaneAngleScale(model).scale};
    for (uint32_t rid : model.idsWithType(webifc::schema::IFCRELVOIDSELEMENT)) {
      const Entity* rel = line(model, rid);
      const uint32_t host = asHandle(get(rel, "RelatingBuildingElement"));
      const uint32_t hole = asHandle(get(rel, "RelatedOpeningElement"));
      if (host && hole) voidsOf[host].push_back(hole);
    }
  }

  std::vector<Opening> openingsFor(uint32_t hostID) {
    std::vector<Opening> list;
    auto holes = voidsOf.find(hostID);
    if (holes == voidsOf.end()) return list;
    const Placement4x4 hostInverse = undoRigid(placeOf(model, get(line(model, hostID), "ObjectPlacement")));
    for (uint32_t holeID : holes->second) {
      const Entity* hole = line(model, holeID);
      if (!hole || hole->get("Representation").isNull()) continue;
      const Entity* rep = line(model, hole->get("Representation"));
      std::vector<const Entity*> reps;
      for (const Value& r : itemsOf(get(rep, "Representations"))) if (const Entity* e = line(model, r)) reps.push_back(e);
      const Entity* body = nullptr;
      for (const Entity* sr : reps) {
        const Value& ident = sr->get("RepresentationIdentifier");
        if (lower(ident.isNull() ? std::string() : ident.text()) == "body") { body = sr; break; }
      }
      if (!body && !reps.empty()) body = reps[0];
      const Placement4x4 into = compose(hostInverse, placeOf(model, hole->get("ObjectPlacement")));
      for (const Value& it : itemsOf(get(body, "Items"))) list.push_back({asHandle(it), into});
    }
    return list;
  }

  // The item built and its openings cut; null when the kernel refuses or leaves an opening uncut.
  // An advanced brep with a face on anything but a plane comes out warped (see hasWarpedFacet): known
  // from the file before building it, so web-ifc gets it without the kernel paying for it first.
  bool curvedAdvancedBrep(uint32_t geoID) {
    const Entity* ie = model.line(geoID);
    if (!ie) return false;
    const std::string_view k = ie->kind();
    if (k != "IfcAdvancedBrep" && k != "IfcAdvancedBrepWithVoids") return false;
    std::vector<const Entity*> shells;
    if (const Entity* outer = line(model, ie->get("Outer"))) shells.push_back(outer);
    if (k == "IfcAdvancedBrepWithVoids")
      for (const Value& v : itemsOf(ie->get("Voids"))) if (const Entity* s = line(model, v)) shells.push_back(s);
    for (const Entity* shell : shells)
      for (const Value& f : itemsOf(shell->get("CfsFaces"))) {
        const Entity* face = line(model, f);
        const Entity* surface = face ? line(model, face->get("FaceSurface")) : nullptr;
        if (surface && surface->kind() != "IfcPlane") return true;
      }
    return false;
  }

  // Tools that do not reach the subject are skipped (the shatter never meets them); a body that comes
  // out unsound that way is rebuilt once with every tool, as before the skip.
  GP build(uint32_t pid, uint32_t geoID) {
    bool unsound = false;
    GP got = buildOnce(pid, geoID, unsound);
    if (got || !unsound || !skipUntouching) return got;
    setSkipUntouchingTools(false);
    bool again = false;
    got = buildOnce(pid, geoID, again);
    setSkipUntouchingTools(true);
    return got;
  }

  GP buildOnce(uint32_t pid, uint32_t geoID, bool& unsound) {
    try {
      if (curvedAdvancedBrep(geoID)) { warped++; return nullptr; }
      Solid built = buildAnySolid(model, geoID, IDENTITY, ctx);
      if (!isG(built)) return nullptr;
      GP solid = std::move(graphOf(built));
      std::vector<GP> tools;
      for (const Opening& opening : openingsFor(pid)) {
        Solid tool = buildAnySolid(model, opening.item, opening.into, ctx);
        if (!isG(tool)) return nullptr;
        tools.push_back(std::move(graphOf(tool)));
      }
      if (!tools.empty()) {
        GP trimmed = kCutAway(solid, tools);
        if (!trimmed) return nullptr;
        solid = std::move(trimmed);
      }
      const bool watertight = solid->isWatertight();
      if (!solid->excessEdges.empty()) { unsound = true; return nullptr; }
      // Left to web-ifc, which samples the surface.
      if (warpedBeyondFlat(*solid)) { warped++; return nullptr; }
      if (!watertight) {
        // A surface the file itself declares open is right to stay open.
        const Entity* ie = model.line(geoID);
        const std::string_view k = ie ? ie->kind() : std::string_view();
        bool declaredOpen = false;
        if (k == "IfcTriangulatedFaceSet" || k == "IfcPolygonalFaceSet") {
          const Value& closed = ie->get("Closed");
          declaredOpen = closed.kind == Value::Kind::Bool && !closed.flag;
        }
        if (!declaredOpen) { unsound = true; return nullptr; }
      }
      return solid;
    } catch (...) {
      return nullptr;
    }
  }
};

BrepEngine::BrepEngine(webifc::parsing::IfcLoader& loader, const webifc::schema::IfcSchemaManager& schemas,
                       webifc::geometry::IfcGeometryProcessor& processor)
    : impl(std::make_unique<Impl>(loader, schemas, processor)) {
  prismLeanMetres = processor.PlaneDeviation();
  const char* c = std::getenv("BREP_SKIP_UNTOUCHING");
  impl->skipUntouching = !c || c[0] != '0';
  setSkipUntouchingTools(impl->skipUntouching);
}
BrepEngine::~BrepEngine() = default;

namespace {

struct FacetRings {
  std::vector<std::vector<int32_t>> rings;  // outer first
};

std::vector<FacetRings> decodeRings(const std::vector<int32_t>& enc) {
  std::vector<FacetRings> out;
  size_t k = 0;
  while (k < enc.size()) {
    FacetRings f;
    const int32_t rc = enc[k++];
    for (int32_t j = 0; j < rc; j++) {
      const int32_t len = enc[k++];
      f.rings.emplace_back(enc.begin() + k, enc.begin() + k + len);
      k += len;
    }
    out.push_back(std::move(f));
  }
  return out;
}

}  // namespace

// The kernel's cuts leave a face as many coplanar facets (the pieces around each opening); a mesh's
// shell merges its coplanar triangles into one face with holes, so this does the same with facets:
// facets sharing an edge, traversed opposite ways and on one plane, become one face whose outer ring
// and holes are the group's unshared edges. A group whose border does not chain into exactly one
// outer ring is left as it was.
void mergeCoplanarFacets(EngineShell& s) {
  const std::vector<double>& P = s.points;
  std::vector<FacetRings> facets = decodeRings(s.rings);
  const int32_t nf = (int32_t)facets.size();
  if (nf < 2) return;
  double lo[3] = {1e300, 1e300, 1e300}, hi[3] = {-1e300, -1e300, -1e300};
  for (size_t i = 0; i < P.size(); i++) { lo[i % 3] = std::min(lo[i % 3], P[i]); hi[i % 3] = std::max(hi[i % 3], P[i]); }
  const double diag = std::sqrt((hi[0] - lo[0]) * (hi[0] - lo[0]) + (hi[1] - lo[1]) * (hi[1] - lo[1]) + (hi[2] - lo[2]) * (hi[2] - lo[2]));
  const double tol = 1e-7 * diag + 1e-12;

  // Newell normal (length = 2 * area) of each outer ring.
  std::vector<std::array<double, 4>> plane(nf);
  std::vector<double> area(nf);
  for (int32_t f = 0; f < nf; f++) {
    const auto& r = facets[f].rings[0];
    double nx = 0, ny = 0, nz = 0;
    for (size_t a = 0; a < r.size(); a++) {
      const double* p = &P[3 * r[a]];
      const double* q = &P[3 * r[(a + 1) % r.size()]];
      nx += (p[1] - q[1]) * (p[2] + q[2]);
      ny += (p[2] - q[2]) * (p[0] + q[0]);
      nz += (p[0] - q[0]) * (p[1] + q[1]);
    }
    const double len = std::sqrt(nx * nx + ny * ny + nz * nz);
    area[f] = len;
    if (len > 0) { nx /= len; ny /= len; nz /= len; }
    const double* p0 = &P[3 * r[0]];
    plane[f] = {nx, ny, nz, nx * p0[0] + ny * p0[1] + nz * p0[2]};
  }
  auto onPlane = [&](int32_t of, int32_t f) {
    const auto& pl = plane[of];
    for (const auto& r : facets[f].rings)
      for (int32_t v : r)
        if (std::fabs(pl[0] * P[3 * v] + pl[1] * P[3 * v + 1] + pl[2] * P[3 * v + 2] - pl[3]) > tol) return false;
    return true;
  };

  // Directed edge -> facet; an edge and its reverse in two coplanar facets joins them.
  std::unordered_map<uint64_t, int32_t> owner;
  owner.reserve(nf * 6);
  auto key = [](int32_t a, int32_t b) { return ((uint64_t)(uint32_t)a << 32) | (uint32_t)b; };
  bool clash = false;
  for (int32_t f = 0; f < nf; f++)
    for (const auto& r : facets[f].rings)
      for (size_t a = 0; a < r.size(); a++) {
        auto [it, fresh] = owner.emplace(key(r[a], r[(a + 1) % r.size()]), f);
        if (!fresh) clash = true;
      }
  if (clash) return;  // non-manifold directed edges: leave the facets alone
  std::vector<int32_t> parent(nf);
  for (int32_t f = 0; f < nf; f++) parent[f] = f;
  std::function<int32_t(int32_t)> root = [&](int32_t f) { while (parent[f] != f) f = parent[f] = parent[parent[f]]; return f; };
  for (const auto& [k, f] : owner) {
    const int32_t a = (int32_t)(k >> 32), b = (int32_t)(uint32_t)k;
    auto it = owner.find(key(b, a));
    if (it == owner.end()) continue;
    const int32_t g = it->second;
    if (g == f || root(g) == root(f)) continue;
    const auto& pf = plane[f];
    const auto& pg = plane[g];
    if (pf[0] * pg[0] + pf[1] * pg[1] + pf[2] * pg[2] < 0.99) continue;
    const int32_t big = area[f] >= area[g] ? f : g, small = big == f ? g : f;
    if (!onPlane(big, small)) continue;
    parent[root(f)] = root(g);
  }
  std::unordered_map<int32_t, std::vector<int32_t>> groups;
  for (int32_t f = 0; f < nf; f++) groups[root(f)].push_back(f);
  if ((int32_t)groups.size() == nf) return;

  std::vector<int32_t> out;
  out.reserve(s.rings.size());
  auto emit = [&](const std::vector<std::vector<int32_t>>& rings) {
    out.push_back((int32_t)rings.size());
    for (const auto& r : rings) { out.push_back((int32_t)r.size()); out.insert(out.end(), r.begin(), r.end()); }
  };
  for (int32_t f = 0; f < nf; f++) {
    if (root(f) != f) continue;
    const std::vector<int32_t>& members = groups[f];
    if (members.size() == 1) { emit(facets[f].rings); continue; }
    // The group's border: its directed edges whose reverse is not in the group.
    std::unordered_multimap<int32_t, int32_t> next;
    size_t edges = 0;
    for (int32_t m : members)
      for (const auto& r : facets[m].rings)
        for (size_t a = 0; a < r.size(); a++) {
          const int32_t u = r[a], v = r[(a + 1) % r.size()];
          auto it = owner.find(key(v, u));
          if (it != owner.end() && root(it->second) == f) continue;
          next.emplace(u, v);
          edges++;
        }
    std::vector<std::vector<int32_t>> loops;
    bool ok = edges >= 3;
    while (ok && !next.empty()) {
      auto it = next.begin();
      const int32_t start = it->first;
      std::vector<int32_t> loop{start};
      int32_t at = it->second;
      next.erase(it);
      while (at != start) {
        auto nx = next.find(at);
        if (nx == next.end()) { ok = false; break; }
        loop.push_back(at);
        at = nx->second;
        next.erase(nx);
      }
      if (ok) loops.push_back(std::move(loop));
    }
    // One loop wound like the faces (the outer ring), the rest the other way (holes).
    const auto& pl = plane[members[0]];
    int32_t outerAt = -1, outers = 0;
    for (size_t i = 0; ok && i < loops.size(); i++) {
      const auto& r = loops[i];
      double nx = 0, ny = 0, nz = 0;
      for (size_t a = 0; a < r.size(); a++) {
        const double* p = &P[3 * r[a]];
        const double* q = &P[3 * r[(a + 1) % r.size()]];
        nx += (p[1] - q[1]) * (p[2] + q[2]);
        ny += (p[2] - q[2]) * (p[0] + q[0]);
        nz += (p[0] - q[0]) * (p[1] + q[1]);
      }
      if (nx * pl[0] + ny * pl[1] + nz * pl[2] > 0) { outers++; outerAt = (int32_t)i; }
    }
    if (!ok || outers != 1) {
      for (int32_t m : members) emit(facets[m].rings);
      continue;
    }
    std::vector<std::vector<int32_t>> rings;
    rings.push_back(std::move(loops[outerAt]));
    for (size_t i = 0; i < loops.size(); i++) if ((int32_t)i != outerAt) rings.push_back(std::move(loops[i]));
    emit(rings);
  }
  // Corners inside a merged face are no longer on any ring: keep only the points the rings use.
  std::vector<int32_t> remap(P.size() / 3, -1);
  std::vector<double> kept;
  kept.reserve(P.size());
  for (size_t k = 0; k < out.size();) {
    const int32_t rc = out[k++];
    for (int32_t j = 0; j < rc; j++) {
      const int32_t len = out[k++];
      for (int32_t a = 0; a < len; a++, k++) {
        int32_t& v = out[k];
        if (remap[v] < 0) {
          remap[v] = (int32_t)(kept.size() / 3);
          kept.insert(kept.end(), {P[3 * v], P[3 * v + 1], P[3 * v + 2]});
        }
        v = remap[v];
      }
    }
  }
  s.rings = std::move(out);
  s.points = std::move(kept);
}

void BrepEngine::flatMesh(uint32_t pid, void* flatMeshOut, std::vector<EngineShell>& shells) {
  using Clock = std::chrono::steady_clock;
  Impl& m = *impl;
  stats.products++;
  shells.clear();
  auto tk = Clock::now();
  bool refusedOne = false;
  std::unordered_map<uint32_t, glm::dvec3> skip;
  const bool hasVoids = m.voidsOf.count(pid) > 0;
  auto tmap = Clock::now();
  const auto repMap = buildRepMap(m.model, {pid});
  stats.mapMs += std::chrono::duration<double, std::milli>(Clock::now() - tmap).count();
  auto lap = [](Clock::time_point& t) { const auto n = Clock::now(); const double d = std::chrono::duration<double, std::milli>(n - t).count(); t = n; return d; };
  for (const auto& [geoID, info] : repMap) {
    if (lower(info.rep) != "body") continue;
    auto tp = Clock::now();
    // An item shared by several products (a mapped type) is the same shell for each of them, unless
    // the product's openings cut it: built once, like web-ifc keeps a geometry per item.
    if (!hasVoids) {
      auto hit = m.shellCache.find(geoID);
      if (hit != m.shellCache.end()) {
        if (!hit->second) { refusedOne = true; stats.refusedItems++; continue; }
        if (hit->second->points.empty()) continue;
        const EngineShell& c = *hit->second;
        skip[geoID] = glm::dvec3(c.firstPoint[0], c.firstPoint[1], c.firstPoint[2]);
        shells.push_back(c);
        stats.kernelItems++;
        stats.cacheMs += lap(tp);
        continue;
      }
    }
    const Entity* ie = m.model.line(geoID);
    const std::string_view kind = ie ? ie->kind() : std::string_view();
    // Not a boolean and no openings: left to web-ifc, as if the kernel had never been asked.
    if (booleansOnly && !hasVoids && kind != "IfcBooleanResult" && kind != "IfcBooleanClippingResult") continue;
    // Surface models: web-ifc reports them per shell, not per item.
    if (kind == "IfcShellBasedSurfaceModel" || kind == "IfcFaceBasedSurfaceModel") {
      refusedOne = true;
      if (!hasVoids) m.shellCache.emplace(geoID, nullptr);
      continue;
    }
    if (emitsNoTriangles(m.model, geoID, 0)) {
      if (!hasVoids) m.shellCache.emplace(geoID, std::make_shared<EngineShell>());
      continue;
    }
    lap(tp);
    prismTraceGeo = geoID;
    GP solid = m.build(pid, geoID);
    stats.buildMs += lap(tp);
    if (!solid) {
      refusedOne = true;
      stats.refusedItems++;
      if (!hasVoids) m.shellCache.emplace(geoID, nullptr);
      continue;
    }
    // A closed result with no thickness (the tools took the whole body and left a sliver along a
    // tool face a fraction of a millimetre off) is nothing: web-ifc's answer for it is no mesh.
    if (solid->isWatertight()) {
      const G& sg = *solid;
      double lo[3] = {1e300, 1e300, 1e300}, hi[3] = {-1e300, -1e300, -1e300};
      for (int32_t v = 0; v < sg.cornerTally(); v++) {
        const double p[3] = {sg.pointXOf(v), sg.pointYOf(v), sg.pointZOf(v)};
        for (int k = 0; k < 3; k++) { lo[k] = std::min(lo[k], p[k]); hi[k] = std::max(hi[k], p[k]); }
      }
      const double size = std::max({hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]});
      double area = 0;
      for (int32_t l = 0; l < sg.loopTally(); l++) {
        if (sg.loopFacetOf(l) < 0) continue;
        const std::vector<int32_t> r = sg.ringOwnedBy(l);
        double nx = 0, ny = 0, nz = 0;
        for (size_t a = 0; a < r.size(); a++) {
          const int32_t p = r[a], q = r[(a + 1) % r.size()];
          nx += (sg.pointYOf(p) - sg.pointYOf(q)) * (sg.pointZOf(p) + sg.pointZOf(q));
          ny += (sg.pointZOf(p) - sg.pointZOf(q)) * (sg.pointXOf(p) + sg.pointXOf(q));
          nz += (sg.pointXOf(p) - sg.pointXOf(q)) * (sg.pointYOf(p) + sg.pointYOf(q));
        }
        const double a2 = std::sqrt(nx * nx + ny * ny + nz * nz) / 2;
        area += sg.facetOuterOf(sg.loopFacetOf(l)) == l ? a2 : -a2;
      }
      const double thickness = area > 0 ? 2 * std::fabs(sg.enclosedSignedVolume()) / area : 0;
      static const bool keepSlivers = std::getenv("BREP_KEEP_SLIVERS") != nullptr;
      const double fuseNow = fuseDistance();
      const double thin = std::max(1e-6 * size, fuseNow > 0 ? fuseNow : WELD_METRES);
      if (!keepSlivers && size > 0 && thickness <= thin) {
        stats.slivers++;
        if (!hasVoids) m.shellCache.emplace(geoID, std::make_shared<EngineShell>());
        continue;
      }
    }
    const G& g = *solid;
    EngineShell s;
    s.geometryExpressID = geoID;
    const int32_t nv = g.cornerTally();
    s.points.reserve(3 * nv);
    for (int32_t v = 0; v < nv; v++) { s.points.push_back(g.pointXOf(v)); s.points.push_back(g.pointYOf(v)); s.points.push_back(g.pointZOf(v)); }
    const int32_t nf = g.panelTally();
    std::vector<std::vector<int32_t>> holesOf(nf);
    std::vector<std::vector<std::vector<int32_t>>> inner(nf);
    for (int32_t l = 0; l < g.loopTally(); l++) {
      const int32_t f = g.loopFacetOf(l);
      if (f < 0 || f >= nf || g.facetOuterOf(f) == l) continue;
      inner[f].push_back(g.ringOwnedBy(l));
    }
    for (int32_t f = 0; f < nf; f++) {
      const std::vector<int32_t> outer = g.outerRingOf(f);
      s.rings.push_back(1 + (int32_t)inner[f].size());
      s.rings.push_back((int32_t)outer.size());
      s.rings.insert(s.rings.end(), outer.begin(), outer.end());
      for (const auto& h : inner[f]) {
        s.rings.push_back((int32_t)h.size());
        s.rings.insert(s.rings.end(), h.begin(), h.end());
      }
    }
    if (nv > 0) {
      s.firstPoint[0] = g.pointXOf(0);
      s.firstPoint[1] = g.pointYOf(0);
      s.firstPoint[2] = g.pointZOf(0);
      skip[geoID] = glm::dvec3(s.firstPoint[0], s.firstPoint[1], s.firstPoint[2]);
    }
    static const bool noMerge = std::getenv("BREP_NOMERGE") != nullptr;
    lap(tp);
    static const bool shellCheck = std::getenv("BREP_SHELL_CHECK") != nullptr;
    auto areaVector = [&](const EngineShell& e) {
      double v[3] = {0, 0, 0}, total = 0;
      for (size_t k = 0; k < e.rings.size();) {
        const int32_t rc = e.rings[k++];
        for (int32_t j = 0; j < rc; j++) {
          const int32_t len = e.rings[k++];
          double nx = 0, ny = 0, nz = 0;
          for (int32_t a = 0; a < len; a++) {
            const double* p = &e.points[3 * e.rings[k + a]];
            const double* q = &e.points[3 * e.rings[k + (a + 1) % len]];
            nx += (p[1] - q[1]) * (p[2] + q[2]);
            ny += (p[2] - q[2]) * (p[0] + q[0]);
            nz += (p[0] - q[0]) * (p[1] + q[1]);
          }
          v[0] += nx; v[1] += ny; v[2] += nz;
          total += std::sqrt(nx * nx + ny * ny + nz * nz);
          k += len;
        }
      }
      return std::sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) / std::max(total, 1e-300);
    };
    const double before = shellCheck ? areaVector(s) : 0;
    if (!noMerge) mergeCoplanarFacets(s);
    if (shellCheck) {
      const double after = areaVector(s);
      if (before > 1e-6 || after > 1e-6) std::fprintf(stderr, "SHELLCHECK %u before %.3g after %.3g\n", geoID, before, after);
      // Each face as the viewer will see it: earcut on the face projected along its dominant axis,
      // triangles' area against the face's own (outer minus holes).
      double worst = 0;
      for (size_t k = 0; k < s.rings.size();) {
        const int32_t rc = s.rings[k++];
        std::vector<std::vector<int32_t>> fr;
        for (int32_t j = 0; j < rc; j++) { const int32_t len = s.rings[k++]; fr.emplace_back(s.rings.begin() + k, s.rings.begin() + k + len); k += len; }
        if (fr.size() < 2) continue;
        double n[3] = {0, 0, 0};
        auto P = [&](int32_t v) { return &s.points[3 * v]; };
        for (size_t a = 0; a < fr[0].size(); a++) {
          const double* p = P(fr[0][a]); const double* q = P(fr[0][(a + 1) % fr[0].size()]);
          n[0] += (p[1] - q[1]) * (p[2] + q[2]); n[1] += (p[2] - q[2]) * (p[0] + q[0]); n[2] += (p[0] - q[0]) * (p[1] + q[1]);
        }
        const int drop = std::fabs(n[0]) > std::fabs(n[1]) ? (std::fabs(n[0]) > std::fabs(n[2]) ? 0 : 2) : (std::fabs(n[1]) > std::fabs(n[2]) ? 1 : 2);
        const int u = drop == 0 ? 1 : 0, w = drop == 2 ? 1 : 2;
        using Pt = std::array<double, 2>;
        std::vector<std::vector<Pt>> poly;
        std::vector<int32_t> flat;
        double expected = 0;
        for (size_t r = 0; r < fr.size(); r++) {
          std::vector<Pt> ring;
          double a2 = 0;
          for (size_t a = 0; a < fr[r].size(); a++) {
            const double* p = P(fr[r][a]); const double* q = P(fr[r][(a + 1) % fr[r].size()]);
            ring.push_back({p[u], p[w]});
            a2 += p[u] * q[w] - q[u] * p[w];
            flat.push_back(fr[r][a]);
          }
          expected += r == 0 ? std::fabs(a2) / 2 : -std::fabs(a2) / 2;
          poly.push_back(std::move(ring));
        }
        const std::vector<uint32_t> tri = mapbox::earcut<uint32_t>(poly);
        double got = 0;
        for (size_t t = 0; t + 2 < tri.size(); t += 3) {
          const double* a = P(flat[tri[t]]); const double* b = P(flat[tri[t + 1]]); const double* c = P(flat[tri[t + 2]]);
          got += std::fabs((b[u] - a[u]) * (c[w] - a[w]) - (b[w] - a[w]) * (c[u] - a[u])) / 2;
        }
        const double e = std::fabs(got - expected) / std::max(expected, 1e-12);
        if (e > worst) worst = e;
      }
      if (worst > 1e-6) std::fprintf(stderr, "EARCUT %u off by %.3g\n", geoID, worst);
      // A hole that shares a corner with its face's outer ring or with another hole.
      long touching = 0, holed = 0;
      for (size_t k = 0; k < s.rings.size();) {
        const int32_t rc = s.rings[k++];
        std::unordered_map<int32_t, int32_t> owner;
        bool touch = false;
        for (int32_t j = 0; j < rc; j++) {
          const int32_t len = s.rings[k++];
          for (int32_t a = 0; a < len; a++) {
            auto [it, fresh] = owner.emplace(s.rings[k + a], j);
            if (!fresh && it->second != j) touch = true;
          }
          k += len;
        }
        if (rc > 1) holed++;
        if (touch) touching++;
      }
      if (touching) std::fprintf(stderr, "TOUCHHOLE %u faces %ld of %ld holed\n", geoID, touching, holed);
      (void)holed;
    }
    stats.mergeMs += lap(tp);
    static const bool noCenter = std::getenv("BREP_NO_CENTER") != nullptr;
    if (!noCenter && !s.points.empty()) {
      double lo[3] = {1e300, 1e300, 1e300}, hi[3] = {-1e300, -1e300, -1e300};
      for (size_t i = 0; i < s.points.size(); i += 3)
        for (int k = 0; k < 3; k++) {
          lo[k] = std::min(lo[k], s.points[i + k]);
          hi[k] = std::max(hi[k], s.points[i + k]);
        }
      for (int k = 0; k < 3; k++) s.center[k] = (lo[k] + hi[k]) / 2;
      for (size_t i = 0; i < s.points.size(); i += 3)
        for (int k = 0; k < 3; k++) s.points[i + k] -= s.center[k];
    }
    if (shellCheck) {
      double lo[3] = {1e300, 1e300, 1e300}, hi[3] = {-1e300, -1e300, -1e300};
      for (size_t i = 0; i < s.points.size(); i++) { lo[i % 3] = std::min(lo[i % 3], s.points[i]); hi[i % 3] = std::max(hi[i % 3], s.points[i]); }
      std::fprintf(stderr, "SHELLDIMS %u %.3f %.3f %.3f faces %zu pid %u voids %d\n", geoID, hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2], s.rings.size(), pid, (int)hasVoids);
      static const long dumpId = [] { const char* e = std::getenv("BREP_DUMP_SHELL"); return e ? std::atol(e) : -1L; }();
      if ((long)geoID == dumpId) {
        std::fprintf(stderr, "DUMP points (centre %.4f %.4f %.4f):", s.center[0], s.center[1], s.center[2]);
        for (size_t i = 0; i < s.points.size(); i += 3) std::fprintf(stderr, " [%zu](%.4f,%.4f,%.4f)", i / 3, s.points[i], s.points[i + 1], s.points[i + 2]);
        std::fprintf(stderr, "\nDUMP rings:");
        for (int32_t v : s.rings) std::fprintf(stderr, " %d", v);
        std::fprintf(stderr, "\n");
      }
    }
    if (shellCheck) {
      // The importer's order-free dedupe key (sorted points to 0.1 mm, face ring sizes) against the
      // exact content (points in order and rings): two shells with one key and different content
      // would be served as one.
      static std::unordered_map<std::string, std::pair<std::string, uint32_t>> seenKeys;
      std::vector<std::array<long long, 3>> q(s.points.size() / 3);
      for (size_t i = 0; i < q.size(); i++) for (int k = 0; k < 3; k++) q[i][k] = std::llround(s.points[3 * i + k] * 10000);
      // Exact content, independent of point order and ring start: each ring as its corners' quantized
      // coordinates rotated to the smallest, holes sorted after the outer ring, faces sorted.
      std::vector<std::string> faces;
      for (size_t k = 0; k < s.rings.size();) {
        const int32_t rc = s.rings[k++];
        std::vector<std::string> rs;
        for (int32_t j = 0; j < rc; j++) {
          const int32_t len = s.rings[k++];
          std::vector<std::array<long long, 3>> r;
          for (int32_t a = 0; a < len; a++) r.push_back(q[s.rings[k + a]]);
          k += len;
          std::rotate(r.begin(), std::min_element(r.begin(), r.end()), r.end());
          std::string t;
          for (const auto& p : r) t += std::to_string(p[0]) + "," + std::to_string(p[1]) + "," + std::to_string(p[2]) + ";";
          rs.push_back(t);
        }
        if (rs.size() > 2) std::sort(rs.begin() + 1, rs.end());
        std::string f;
        for (const auto& t : rs) f += t + "/";
        faces.push_back(f);
      }
      std::sort(faces.begin(), faces.end());
      std::string exact;
      for (const auto& f : faces) exact += f + "|";
      std::sort(q.begin(), q.end());
      std::vector<long long> sizes;
      for (size_t k = 0; k < s.rings.size();) {
        const int32_t rc = s.rings[k++];
        long long face = 0;
        for (int32_t j = 0; j < rc; j++) { const int32_t len = s.rings[k++]; face = face * 31 + len; k += len; }
        sizes.push_back(face);
      }
      std::sort(sizes.begin(), sizes.end());
      std::string key;
      for (const auto& p : q) key += std::to_string(p[0]) + "," + std::to_string(p[1]) + "," + std::to_string(p[2]) + ";";
      key += "|";
      for (long long z : sizes) key += std::to_string(z) + ",";
      auto [it, fresh] = seenKeys.emplace(key, std::make_pair(exact, geoID));
      if (!fresh && it->second.first != exact) std::fprintf(stderr, "HASHCLASH %u with %u\n", geoID, it->second.second);
    }
    static const bool noShellCache = std::getenv("BREP_NO_SHELLCACHE") != nullptr;
    if (!hasVoids && !noShellCache) m.shellCache.emplace(geoID, std::make_shared<EngineShell>(s));
    shells.push_back(std::move(s));
    stats.kernelItems++;
    stats.cacheMs += lap(tp);
  }
  // Until COORDINATE_TO_ORIGIN has its offset, web-ifc used to mesh the first product so the offset
  // came from the same vertex as with the mesh engine. That hands web-ifc the very geometry the
  // kernel was asked to build, and a boolean web-ifc cannot finish then hangs the whole model on its
  // first element (a 26-face clipped sill: web-ifc > 120 s, the kernel 7 ms). The skipped item's own
  // first point gives the offset instead (`SetSkippedItems`); the model only moves by another
  // constant vector, recorded in the coordination matrix like before. BREP_MESH_FIRST restores it.
  static const bool meshFirst = std::getenv("BREP_MESH_FIRST") != nullptr;
  if ((hasVoids && refusedOne) || (meshFirst && !skip.empty() && !m.gp.HasCoordination())) {
    // Openings are one boolean over all of a product's items: web-ifc does the whole product.
    shells.clear();
    skip.clear();
    stats.productsToWebIfc++;
  }
  stats.kernelMs += std::chrono::duration<double, std::milli>(Clock::now() - tk).count();
  auto tm = Clock::now();
  m.gp.SetSkippedItems(skip.empty() ? nullptr : &skip, hasVoids && !skip.empty());
  auto& flat = *static_cast<webifc::geometry::IfcFlatMesh*>(flatMeshOut);
  flat = m.gp.GetFlatMesh(pid);
  m.gp.SetSkippedItems(nullptr, false);
  // BREP_WEBIFC_LOG: each product web-ifc meshed something for, its time and the items' kinds.
  static const bool webifcLog = std::getenv("BREP_WEBIFC_LOG") != nullptr;
  if (webifcLog) {
    const double wms = std::chrono::duration<double, std::milli>(Clock::now() - tm).count();
    std::string kinds;
    for (const auto& g : flat.geometries) {
      if (skip.count(g.geometryExpressID)) continue;
      const Entity* ge = m.model.line(g.geometryExpressID);
      kinds += " " + std::to_string(g.geometryExpressID) + ":" + std::string(ge ? ge->kind() : "?");
    }
    if (!kinds.empty()) std::fprintf(stderr, "WEBIFC %u %.2f ms voids=%d whole=%d |%s\n", pid, wms, hasVoids ? 1 : 0, (hasVoids && refusedOne) ? 1 : 0, kinds.c_str());
  }
  // Each kernel shell is stored about its centre: its placement takes the centre back.
  for (auto& placed : flat.geometries)
    for (const auto& s : shells)
      if (s.geometryExpressID == placed.geometryExpressID && (s.center[0] || s.center[1] || s.center[2])) {
        placed.transformation = placed.transformation * glm::translate(glm::dmat4(1.0), glm::dvec3(s.center[0], s.center[1], s.center[2]));
        placed.SetFlatTransformation();
        break;
      }
  stats.meshMs += std::chrono::duration<double, std::milli>(Clock::now() - tm).count();
  // Between products nothing holds a parsed line: keep the line cache bounded (BREP_LINE_CACHE lines).
  static const size_t lineCache = [] { const char* v = std::getenv("BREP_LINE_CACHE"); return v ? (size_t)std::atoll(v) : (size_t)200000; }();
  m.model.trim(lineCache);
}

}  // namespace brep::ifc
