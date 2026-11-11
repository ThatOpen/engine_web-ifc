// overlay.cpp — port of overlay.ts. No sampled point decides anything: the winding field is fixed
// by declaring the unbounded face zero and BFS-ing across pieces by their net dart count.
#include "overlay.h"
#include "curves.h"

#include <algorithm>
#include <cmath>
#include <deque>
#include <unordered_map>
#include <unordered_set>

namespace brep {

namespace {

inline int64_t pairKey(int32_t a, int32_t b) {
  return (static_cast<int64_t>(a) << 32) ^ static_cast<int64_t>(static_cast<uint32_t>(b));
}

// The plane's 2D frame, flipped so the group's total signed area is positive.
struct PlaneMap {
  std::unordered_map<int32_t, std::pair<double, double>> P;  // id -> (PX, PY)
  double ux = 0, uy = 0, uz = 0, wx = 0, wy = 0, wz = 0;
  double flip = 1;
  const OverlayGeometry* g = nullptr;

  double X(int32_t id) const { return P.find(id)->second.first; }
  double Y(int32_t id) const { return flip * P.find(id)->second.second; }
  void proj(int32_t id) {
    if (P.count(id)) return;
    const double x = g->pointXOf(id), y = g->pointYOf(id), z = g->pointZOf(id);
    P.emplace(id, std::make_pair(x * ux + y * uy + z * uz, x * wx + y * wy + z * wz));
  }
};

template <class Rings>
std::optional<PlaneMap> frameFrom(const Rings& rings, const P3& normal, const OverlayGeometry& g) {
  const double nl = jsHypot3(normal[0], normal[1], normal[2]);
  if (!(nl > 0)) return std::nullopt;
  const double nx = normal[0] / nl, ny = normal[1] / nl, nz = normal[2] / nl;
  const double a0[3] = {std::fabs(nx) < 0.9 ? 1.0 : 0.0, std::fabs(nx) < 0.9 ? 0.0 : 1.0, 0.0};
  double ux = a0[1] * nz - a0[2] * ny, uy = a0[2] * nx - a0[0] * nz, uz = a0[0] * ny - a0[1] * nx;
  const double ul = jsHypot3(ux, uy, uz);
  if (!(ul > 0)) return std::nullopt;
  ux /= ul;
  uy /= ul;
  uz /= ul;
  PlaneMap m;
  m.g = &g;
  m.ux = ux;
  m.uy = uy;
  m.uz = uz;
  m.wx = ny * uz - nz * uy;
  m.wy = nz * ux - nx * uz;
  m.wz = nx * uy - ny * ux;
  for (const auto* rp : rings)
    for (int32_t v : *rp) m.proj(v);

  double total = 0;
  for (const auto* rp : rings) {
    const auto& r = *rp;
    const size_t n = r.size();
    for (size_t k = 0; k < n; k++) {
      const int32_t a = r[k], b = r[(k + 1) % n];
      const auto& pa = m.P.find(a)->second;
      const auto& pb = m.P.find(b)->second;
      total += pa.first * pb.second - pb.first * pa.second;
    }
  }
  if (total == 0) return std::nullopt;
  m.flip = total < 0 ? -1 : 1;
  return m;
}

struct Dart {
  int32_t a, b;
};

}  // namespace

bool overlaySuspicious(const std::vector<std::vector<int32_t>>& rings, const P3& normal,
                       const OverlayGeometry& g) {
  std::vector<const std::vector<int32_t>*> all;
  all.reserve(rings.size());
  for (const auto& r : rings) all.push_back(&r);
  auto frame = frameFrom(all, normal, g);
  if (!frame) return false;
  const PlaneMap& F = *frame;

  bool metPositive = false, metNegative = false;
  std::unordered_set<int64_t> directed;
  std::vector<Dart> halfLinks;
  for (const auto& r : rings) {
    double twice = 0;
    const size_t n = r.size();
    for (size_t k = 0; k < n; k++) {
      const int32_t a = r[k], b = r[(k + 1) % n];
      if (a == b) continue;
      twice += F.X(a) * F.Y(b) - F.X(b) * F.Y(a);
      if (!directed.insert(pairKey(a, b)).second) return true;  // same dart claimed twice
      halfLinks.push_back({a, b});
    }
    if (twice > 0)
      metPositive = true;
    else if (twice < 0)
      metNegative = true;
    if (metPositive && metNegative) return true;  // mixed senses inside one plane
  }

  const double tol = g.tolerance;
  for (size_t i = 0; i < halfLinks.size(); i++) {
    const Dart p = halfLinks[i];
    const double x1 = F.X(p.a), y1 = F.Y(p.a), dx = F.X(p.b) - x1, dy = F.Y(p.b) - y1;
    const double len = jsHypot2(dx, dy);
    if (!(len > 0)) continue;
    for (size_t j = i + 1; j < halfLinks.size(); j++) {
      const Dart q = halfLinks[j];
      if (q.a == p.b && q.b == p.a) continue;  // exact reverse: a shared partition edge
      const double x3 = F.X(q.a), y3 = F.Y(q.a), x4 = F.X(q.b), y4 = F.Y(q.b);
      const double o3 = std::fabs((x3 - x1) * dy - (y3 - y1) * dx) / len;
      const double o4 = std::fabs((x4 - x1) * dy - (y4 - y1) * dx) / len;
      if (o3 <= tol && o4 <= tol) {
        // Collinear: overlapping interiors are a retrace or an in-plane T-junction.
        const double t3 = ((x3 - x1) * dx + (y3 - y1) * dy) / (len * len);
        const double t4 = ((x4 - x1) * dx + (y4 - y1) * dy) / (len * len);
        const double lo = jsMin(t3, t4), hi = jsMax(t3, t4);
        const double m = tol / len;
        if (hi > m && lo < 1 - m && hi - jsMax(lo, 0.0) > m && jsMin(hi, 1.0) - lo > m)
          return true;
        continue;
      }
      if (q.a == p.a || q.a == p.b || q.b == p.a || q.b == p.b) continue;
      const double runBX = x4 - x3, runBY = y4 - y3;
      const double den = dx * runBY - dy * runBX;
      if (den == 0) continue;
      const double t = ((x3 - x1) * runBY - (y3 - y1) * runBX) / den;
      const double s = ((x3 - x1) * dy - (y3 - y1) * dx) / den;
      const double l2 = jsHypot2(runBX, runBY);
      if (!(l2 > 0)) continue;
      const double m1 = tol / len, m2 = tol / l2;
      if (t > m1 && t < 1 - m1 && s > m2 && s < 1 - m2) return true;  // proper crossing
    }
  }
  return false;
}

std::optional<std::vector<std::vector<int32_t>>> overlayRings(
    const std::vector<std::vector<int32_t>>& rings, const P3& normal, OverlayGeometry& g) {
  std::vector<const std::vector<int32_t>*> live;
  for (const auto& r : rings)
    if (r.size() >= 3) live.push_back(&r);
  if (live.size() < 1) return std::nullopt;
  size_t dartCount = 0;
  for (const auto* r : live) dartCount += r->size();
  if (live.size() > static_cast<size_t>(OVERLAY_MAX_RINGS) ||
      dartCount > static_cast<size_t>(OVERLAY_MAX_DARTS))
    return std::nullopt;

  auto frame = frameFrom(live, normal, g);
  if (!frame) return std::nullopt;
  PlaneMap& F = *frame;

  std::vector<Dart> halfLinks;
  for (const auto* rp : live) {
    const auto& r = *rp;
    const size_t n = r.size();
    for (size_t k = 0; k < n; k++) {
      const int32_t a = r[k], b = r[(k + 1) % n];
      if (a == b) continue;
      halfLinks.push_back({a, b});
    }
  }

  const double tol = g.tolerance;
  // Every vertex the arrangement knows, in insertion order (TS Set).
  std::vector<int32_t> verts;
  std::unordered_set<int32_t> vertSeen;
  auto addVert = [&](int32_t v) {
    if (vertSeen.insert(v).second) verts.push_back(v);
  };
  for (const Dart& d : halfLinks) {
    addVert(d.a);
    addVert(d.b);
  }

  // Proper crossings between darts that share no endpoint, minted through the graph's weld.
  for (size_t i = 0; i < halfLinks.size(); i++) {
    const Dart p = halfLinks[i];
    const double x1 = F.X(p.a), y1 = F.Y(p.a), x2 = F.X(p.b), y2 = F.Y(p.b);
    for (size_t j = i + 1; j < halfLinks.size(); j++) {
      const Dart q = halfLinks[j];
      if (q.a == p.a || q.a == p.b || q.b == p.a || q.b == p.b) continue;
      const double x3 = F.X(q.a), y3 = F.Y(q.a), x4 = F.X(q.b), y4 = F.Y(q.b);
      const double runAX = x2 - x1, runAY = y2 - y1, runBX = x4 - x3, runBY = y4 - y3;
      const double den = runAX * runBY - runAY * runBX;
      if (den == 0) continue;  // parallel or collinear: handled by the on-segment split
      const double t = ((x3 - x1) * runBY - (y3 - y1) * runBX) / den;
      const double s = ((x3 - x1) * runAY - (y3 - y1) * runAX) / den;
      const double l1 = jsHypot2(runAX, runAY), l2 = jsHypot2(runBX, runBY);
      if (!(l1 > 0) || !(l2 > 0)) continue;
      const double m1 = tol / l1, m2 = tol / l2;
      if (t <= m1 || t >= 1 - m1 || s <= m2 || s >= 1 - m2) continue;
      const double ax = g.pointXOf(p.a), ay = g.pointYOf(p.a), az = g.pointZOf(p.a);
      const double bx = g.pointXOf(p.b), by = g.pointYOf(p.b), bz = g.pointZOf(p.b);
      const int32_t v =
          g.placeCorner(ax + t * (bx - ax), ay + t * (by - ay), az + t * (bz - az));
      F.proj(v);
      addVert(v);
    }
  }

  // Split every dart at every arrangement vertex on it; net direction count per undirected piece.
  std::unordered_map<int64_t, int32_t> net;    // canonical piece -> (with - against)
  std::unordered_map<int64_t, int32_t> pieceAt;  // canonical piece -> index into pieces
  struct Piece {
    int64_t key;
    int32_t a, b;
  };
  std::vector<Piece> pieces;  // insertion order of TS pieceEnds
  struct Cut {
    double t;
    int32_t v;
  };
  std::vector<Cut> cuts;
  for (const Dart& d : halfLinks) {
    const double x1 = F.X(d.a), y1 = F.Y(d.a), dx = F.X(d.b) - x1, dy = F.Y(d.b) - y1;
    const double len = jsHypot2(dx, dy);
    if (!(len > 0)) continue;
    cuts.clear();
    cuts.push_back({0, d.a});
    cuts.push_back({1, d.b});
    for (int32_t v : verts) {
      if (v == d.a || v == d.b) continue;
      const double rx = F.X(v) - x1, ry = F.Y(v) - y1;
      const double t = (rx * dx + ry * dy) / (len * len);
      if (t <= 0 || t >= 1) continue;
      const double off = std::fabs(rx * dy - ry * dx) / len;
      if (off > tol) continue;
      cuts.push_back({t, v});
    }
    std::stable_sort(cuts.begin(), cuts.end(),
                     [](const Cut& u, const Cut& w) { return u.t - w.t < 0; });
    for (size_t k = 0; k + 1 < cuts.size(); k++) {
      const int32_t a = cuts[k].v, b = cuts[k + 1].v;
      if (a == b) continue;
      const int64_t key = a < b ? pairKey(a, b) : pairKey(b, a);
      const int32_t sgn = a < b ? 1 : -1;  // canonical direction: small id -> large id
      net[key] += sgn;
      if (pieceAt.emplace(key, static_cast<int32_t>(pieces.size())).second)
        pieces.push_back({key, a < b ? a : b, a < b ? b : a});
    }
  }
  if (pieces.size() < 3) return std::nullopt;

  // One connected component, or decline.
  std::unordered_map<int32_t, int32_t> parent;
  auto find = [&](int32_t v) -> int32_t {
    int32_t r = v;
    while (parent.find(r)->second != r) r = parent.find(r)->second;
    int32_t c = v;
    while (true) {
      auto it = parent.find(c);
      if (it->second == c) break;
      const int32_t followingAbove = it->second;
      it->second = r;
      c = followingAbove;
    }
    return r;
  };
  for (const Piece& pc : pieces) {
    parent.emplace(pc.a, pc.a);
    parent.emplace(pc.b, pc.b);
    const int32_t ra = find(pc.a);
    parent[ra] = find(pc.b);
  }
  {
    int32_t root = -1;
    bool first = true;
    std::vector<int32_t> keys;
    keys.reserve(parent.size());
    for (const auto& kv : parent) keys.push_back(kv.first);
    for (int32_t v : keys) {
      const int32_t r = find(v);
      if (first) {
        root = r;
        first = false;
      } else if (r != root)
        return std::nullopt;
    }
  }

  // Half-edges: 2i = a->b, 2i+1 = b->a for piece i, so the twin of h is h ^ 1.
  struct Half {
    int32_t from, to, piece, face, next;
  };
  std::vector<Half> halves;
  halves.reserve(pieces.size() * 2);
  for (int32_t i = 0; i < static_cast<int32_t>(pieces.size()); i++) {
    halves.push_back({pieces[i].a, pieces[i].b, i, -1, -1});
    halves.push_back({pieces[i].b, pieces[i].a, i, -1, -1});
  }
  std::unordered_map<int32_t, std::vector<int32_t>> outAt;
  for (int32_t h = 0; h < static_cast<int32_t>(halves.size()); h++)
    outAt[halves[h].from].push_back(h);
  {
    std::vector<std::pair<double, int32_t>> keyed;
    for (auto& [v, list] : outAt) {
      const double xv = F.X(v), yv = F.Y(v);
      keyed.clear();
      for (int32_t h : list) {
        const Half& e = halves[h];
        keyed.push_back({std::atan2(F.Y(e.to) - yv, F.X(e.to) - xv), h});
      }
      std::stable_sort(keyed.begin(), keyed.end(),
                       [](const auto& u, const auto& w) { return u.first - w.first < 0; });
      for (size_t k = 0; k < keyed.size(); k++) list[k] = keyed[k].second;
    }
  }
  for (int32_t h = 0; h < static_cast<int32_t>(halves.size()); h++) {
    const int32_t tw = h ^ 1;
    const auto& list = outAt.find(halves[h].to)->second;
    const int32_t at =
        static_cast<int32_t>(std::find(list.begin(), list.end(), tw) - list.begin());
    // clockwise successor of the reverse edge = previous entry in the CCW-sorted list
    const int32_t n = static_cast<int32_t>(list.size());
    halves[h].next = list[(at - 1 + n) % n];
  }

  std::vector<std::vector<int32_t>> faceCycle;
  for (int32_t h = 0; h < static_cast<int32_t>(halves.size()); h++) {
    if (halves[h].face != -1) continue;
    const int32_t id = static_cast<int32_t>(faceCycle.size());
    std::vector<int32_t> cyc;
    int32_t c = h;
    size_t guard = 0;
    do {
      halves[c].face = id;
      cyc.push_back(c);
      c = halves[c].next;
      if (++guard > halves.size()) return std::nullopt;  // traversal broke; decline
    } while (c != h);
    faceCycle.push_back(std::move(cyc));
  }

  int32_t outer = -1;
  for (int32_t f = 0; f < static_cast<int32_t>(faceCycle.size()); f++) {
    double s = 0;
    for (int32_t h : faceCycle[f]) {
      const Half& e = halves[h];
      s += F.X(e.from) * F.Y(e.to) - F.X(e.to) * F.Y(e.from);
    }
    if (s / 2 < 0) {
      if (outer != -1) return std::nullopt;  // two negative cycles: nested structure, decline
      outer = f;
    }
  }
  if (outer == -1) return std::nullopt;

  // BFS: crossing a piece from its canonical right to its canonical left adds its net count.
  constexpr int32_t UNSET = INT32_MIN;
  std::vector<int32_t> winding(faceCycle.size(), UNSET);
  winding[outer] = 0;
  std::deque<int32_t> queue{outer};
  while (!queue.empty()) {
    const int32_t f = queue.front();
    queue.pop_front();
    for (int32_t h : faceCycle[f]) {
      const Half& e = halves[h];
      const int32_t other = halves[h ^ 1].face;
      if (winding[other] != UNSET) continue;
      const bool canonical = e.from < e.to;
      auto it = net.find(pieces[e.piece].key);
      const int32_t step = it == net.end() ? 0 : it->second;
      winding[other] = winding[f] + (canonical ? -step : step);
      queue.push_back(other);
    }
  }

  // Winding -1 is a face, emitted reversed; only winding 0 vanishes.
  std::vector<std::vector<int32_t>> out;
  for (int32_t f = 0; f < static_cast<int32_t>(faceCycle.size()); f++) {
    if (f == outer || winding[f] == UNSET || winding[f] == 0) continue;
    std::vector<int32_t> ring;
    ring.reserve(faceCycle[f].size());
    for (int32_t h : faceCycle[f]) ring.push_back(halves[h].from);
    if (ring.size() < 3) continue;
    if (winding[f] < 0) std::reverse(ring.begin(), ring.end());
    out.push_back(std::move(ring));
  }

  // The output must be a valid oriented complex or nothing.
  std::unordered_set<int64_t> directed;
  for (const auto& ring : out) {
    const size_t n = ring.size();
    for (size_t i = 0; i < n; i++)
      if (!directed.insert(pairKey(ring[i], ring[(i + 1) % n])).second) return std::nullopt;
  }
  return out;
}

}  // namespace brep
