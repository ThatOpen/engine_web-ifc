// shell.cpp — port of shell.ts. Same algorithm, decisions, tolerances and iteration order.
#include "shell.h"

#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <deque>
#include <limits>
#include <unordered_map>
#include <unordered_set>
#include <utility>

#include "overlay.h"
#include "sign.h"
#include "topology.h"

namespace brep {

ShellStats shellStats;

namespace {

using Ring = std::vector<P3>;
using Rings = std::vector<Ring>;
// C++ only: a list of rings by reference (TS passes arrays of shared ring objects).
using RingRefs = std::vector<const Ring*>;

bool cancelOppositeFaces = true;
bool dropFlatRings = false;
bool shellOverlay = false;
bool shellEvictSurplus = false;
bool flattenFaces = false;
bool healReveals = false;

// ── JS numeric semantics ────────────────────────────────────────────────────────────────────────

// Math.hypot exactly as V8 computes it (max scaling + Kahan-compensated sum of squares).
template <class... T>
double jsHypot(T... args) {
  const double vals[] = {static_cast<double>(args)...};
  constexpr size_t n = sizeof...(T);
  double absv[n];
  bool nan = false;
  double mx = 0;
  for (size_t i = 0; i < n; i++) {
    if (std::isnan(vals[i])) {
      nan = true;
      absv[i] = 0;
    } else {
      absv[i] = std::fabs(vals[i]);
      if (absv[i] > mx) mx = absv[i];
    }
  }
  if (mx == std::numeric_limits<double>::infinity()) return mx;
  if (nan) return std::numeric_limits<double>::quiet_NaN();
  if (mx == 0) return 0;
  double sum = 0, comp = 0;
  for (size_t i = 0; i < n; i++) {
    const double q = absv[i] / mx;
    const double summand = q * q - comp;
    const double prelim = sum + summand;
    comp = (prelim - sum) - summand;
    sum = prelim;
  }
  return std::sqrt(sum) * mx;
}

double jsSign(double x) {
  if (std::isnan(x)) return x;
  if (x > 0) return 1;
  if (x < 0) return -1;
  return x;  // keeps -0
}

double jsMax(double a, double b) {
  if (std::isnan(a) || std::isnan(b)) return std::numeric_limits<double>::quiet_NaN();
  if (a == b) return std::signbit(a) ? b : a;
  return a > b ? a : b;
}

double jsMin(double a, double b) {
  if (std::isnan(a) || std::isnan(b)) return std::numeric_limits<double>::quiet_NaN();
  if (a == b) return std::signbit(a) ? a : b;
  return a < b ? a : b;
}

// Math.round: nearest integer, ties toward +infinity.
double jsRound(double x) {
  if (!std::isfinite(x)) return x;
  const double r = std::floor(x);
  return (x - r >= 0.5) ? r + 1 : r;
}

// Canonical bits of a number as String(x) would distinguish it: -0 is 0, every NaN is one NaN.
uint64_t numKey(double x) {
  if (x == 0) x = 0;
  if (std::isnan(x)) return 0x7ff8000000000000ULL;
  uint64_t b;
  std::memcpy(&b, &x, 8);
  return b;
}

// x.toFixed(6) as an identity: (negative sign printed, scaled integer). Exact, ties away from zero.
struct Fixed6 {
  int32_t neg;
  int64_t n;
};
Fixed6 toFixed6(double x) {
  if (std::isnan(x)) return {2, 0};
  const int32_t neg = x < 0 ? 1 : 0;
  const double ax = std::fabs(x);
  if (!(ax < 1e21)) return {neg, static_cast<int64_t>(numKey(x))};
  // n = the integer nearest ax*1e6, larger on a tie, decided on the exact product via fma.
  double k = std::floor(ax * 1e6);
  while (k > 0 && std::fma(ax, 1e6, -k) < 0) k -= 1;
  while (std::fma(ax, 1e6, -(k + 1)) >= 0) k += 1;
  const double n = std::fma(ax, 1e6, -(k + 0.5)) >= 0 ? k + 1 : k;
  return {neg, static_cast<int64_t>(n)};
}

// A point as `p.join(",")` keys it.
struct PKey {
  uint64_t x, y, z;
  bool operator==(const PKey& o) const { return x == o.x && y == o.y && z == o.z; }
};
struct PKeyHash {
  size_t operator()(const PKey& k) const {
    uint64_t h = k.x * 0x9E3779B97F4A7C15ULL;
    h ^= (k.y + 0x632BE59BD9B4E019ULL + (h << 6) + (h >> 2));
    h ^= (k.z + 0x85EBCA77C2B2AE63ULL + (h << 6) + (h >> 2));
    h ^= h >> 31;
    h *= 0xff51afd7ed558ccdULL;
    h ^= h >> 33;
    return static_cast<size_t>(h);
  }
};
PKey pkey(const P3& p) { return {numKey(p[0]), numKey(p[1]), numKey(p[2])}; }

// ── 2D predicates in the projection that drops one axis ─────────────────────────────────────────

inline void axesOf(int drop, int& u, int& v) {
  u = drop == 0 ? 1 : 0;
  v = drop == 2 ? 1 : 2;
}

// Do segments a-b and c-d properly cross? Endpoints touching is not a crossing.
bool crossesProperly(const P3& a, const P3& b, const P3& c, const P3& d, int drop) {
  int u, v;
  axesOf(drop, u, v);
  // A proper crossing point lies inside both boxes, so boxes apart (exact comparisons) cannot cross.
  if (std::max(a[u], b[u]) < std::min(c[u], d[u]) || std::max(c[u], d[u]) < std::min(a[u], b[u]) ||
      std::max(a[v], b[v]) < std::min(c[v], d[v]) || std::max(c[v], d[v]) < std::min(a[v], b[v]))
    return false;
  auto side = [u, v](const P3& p, const P3& q, const P3& r) {
    return lineSide(p[u], p[v], q[u], q[v], r[u], r[v]);
  };
  const int s1 = side(a, b, c);
  if (s1 == 0) return false;
  const int s2 = side(a, b, d);
  if (s2 == 0 || s1 == s2) return false;
  const int s3 = side(c, d, a);
  if (s3 == 0) return false;
  const int s4 = side(c, d, b);
  return s4 != 0 && s3 != s4;
}

// Does the corner c lie strictly between a and b on the segment a-b?
bool onBridge(const P3& a, const P3& b, const P3& c, int drop) {
  int u, v;
  axesOf(drop, u, v);
  if (lineSide(a[u], a[v], b[u], b[v], c[u], c[v]) != 0) return false;
  const double du = b[u] - a[u], dv = b[v] - a[v];
  const double t = ((c[u] - a[u]) * (b[u] - a[u]) + (c[v] - a[v]) * (b[v] - a[v])) / (du * du + dv * dv);
  return t > 0 && t < 1;
}

// Is the point inside the ring, in the projection that drops `drop`? Crossing count, half-open.
bool insideRing(const Ring& ring, const P3& p, int drop) {
  int u, v;
  axesOf(drop, u, v);
  bool inside = false;
  const size_t n = ring.size();
  for (size_t i = 0, j = n - 1; i < n; j = i++) {
    const P3& a = ring[i];
    const P3& b = ring[j];
    if ((a[v] > p[v]) != (b[v] > p[v])) {
      const double at = a[u] + ((p[v] - a[v]) / (b[v] - a[v])) * (b[u] - a[u]);
      if (p[u] < at) inside = !inside;
    }
  }
  return inside;
}

inline P3 midOf(const P3& a, const P3& b) {
  return {(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2};
}

// Does the bridge a-b run into this ring: cross an edge, pass a corner, or lie inside it?
bool bridgeMeetsRing(const P3& a, const P3& b, const Ring& ring, int drop) {
  const size_t n = ring.size();
  for (size_t k = 0; k < n; k++) {
    const P3& c = ring[k];
    if (crossesProperly(a, b, c, ring[(k + 1) % n], drop)) return true;
    if (onBridge(a, b, c, drop)) return true;
  }
  return insideRing(ring, midOf(a, b), drop);
}

// Newell normal of a ring of points.
inline void newell(const Ring& r, double& nx, double& ny, double& nz) {
  nx = 0, ny = 0, nz = 0;
  const size_t n = r.size();
  for (size_t i = 0; i < n; i++) {
    const P3& a = r[i];
    const P3& b = r[(i + 1) % n];
    nx += (a[1] - b[1]) * (a[2] + b[2]);
    ny += (a[2] - b[2]) * (a[0] + b[0]);
    nz += (a[0] - b[0]) * (a[1] + b[1]);
  }
}

inline int dropOf(double nx, double ny, double nz) {
  const double ax = std::fabs(nx), ay = std::fabs(ny), az = std::fabs(nz);
  return ax >= ay && ax >= az ? 0 : ay >= az ? 1 : 2;
}

// Twice the signed area of a ring in the projection that drops `drop`.
double shoelaceIn(const Ring& ring, int drop) {
  int u, v;
  axesOf(drop, u, v);
  double twice = 0;
  const size_t n = ring.size();
  for (size_t i = 0; i < n; i++) {
    const P3& a = ring[i];
    const P3& b = ring[(i + 1) % n];
    twice += a[u] * b[v] - b[u] * a[v];
  }
  return twice;
}

// Split a face carrying one inner ring into two simple faces.
std::optional<std::pair<Ring, Ring>> splitAroundHole(const Ring& outer, const Ring& inner,
                                                     const RingRefs& others) {
  if (outer.size() < 3 || inner.size() < 3) return std::nullopt;
  double nx, ny, nz;
  newell(outer, nx, ny, nz);
  const int drop = dropOf(nx, ny, nz);
  int u, v;
  axesOf(drop, u, v);

  auto shoelaceTwice = [u, v](const Ring& ring) {
    double twice = 0;
    const size_t n = ring.size();
    for (size_t i = 0; i < n; i++) {
      const P3& a = ring[i];
      const P3& b = ring[(i + 1) % n];
      twice += a[u] * b[v] - b[u] * a[v];
    }
    return twice;
  };
  const bool innerRunsWithOuter = shoelaceTwice(outer) * shoelaceTwice(inner) > 0;

  const int32_t on = static_cast<int32_t>(outer.size());
  const int32_t in = static_cast<int32_t>(inner.size());

  // clear(o, i) depends only on the pair, and the search below asks for the same pairs over and
  // over (every first bridge retries up to 64x64 second bridges). Remembered per pair: same answers,
  // each computed once. 0 = unknown, 1 = clear, 2 = blocked.
  const bool memoOk = static_cast<int64_t>(on) * in <= (int64_t{1} << 24);
  std::vector<uint8_t> memo(memoOk ? static_cast<size_t>(on) * in : 0, 0);
  // Each other void's box in the projection. A bridge whose box is strictly apart from it can neither
  // cross it, nor pass one of its corners, nor have its midpoint inside it (a point outside a closed
  // ring's box is outside the ring), so bridgeMeetsRing would say false: skipped, same answer.
  std::vector<std::array<double, 4>> otherBox;
  otherBox.reserve(others.size());
  for (const Ring* r : others) {
    constexpr double inf = std::numeric_limits<double>::infinity();
    std::array<double, 4> b{inf, inf, -inf, -inf};
    for (const P3& p : *r) {
      b[0] = std::min(b[0], p[u]);
      b[1] = std::min(b[1], p[v]);
      b[2] = std::max(b[2], p[u]);
      b[3] = std::max(b[3], p[v]);
    }
    otherBox.push_back(b);
  }
  auto clearRaw = [&](int32_t o, int32_t i) -> bool {
    const P3& a = outer[o];
    const P3& b = inner[i];
    for (int32_t k = 0; k < on; k++) {
      if (k == o || (k + 1) % on == o) continue;
      if (crossesProperly(a, b, outer[k], outer[(k + 1) % on], drop)) return false;
    }
    for (int32_t k = 0; k < in; k++) {
      if (k == i || (k + 1) % in == i) continue;
      if (crossesProperly(a, b, inner[k], inner[(k + 1) % in], drop)) return false;
    }
    for (const P3& c : outer)
      if (onBridge(a, b, c, drop)) return false;
    for (const P3& c : inner)
      if (onBridge(a, b, c, drop)) return false;
    const P3 mid = midOf(a, b);
    if (!insideRing(outer, mid, drop) || insideRing(inner, mid, drop)) return false;
    const double su0 = std::min(a[u], b[u]), su1 = std::max(a[u], b[u]);
    const double sv0 = std::min(a[v], b[v]), sv1 = std::max(a[v], b[v]);
    for (size_t r = 0; r < others.size(); r++) {
      const auto& bx = otherBox[r];
      if (su1 < bx[0] || su0 > bx[2] || sv1 < bx[1] || sv0 > bx[3]) continue;
      if (bridgeMeetsRing(a, b, *others[r], drop)) return false;
    }
    return true;
  };
  auto clear = [&](int32_t o, int32_t i) -> bool {
    if (!memoOk) return clearRaw(o, i);
    uint8_t& m = memo[static_cast<size_t>(o) * in + i];
    if (m == 0) m = clearRaw(o, i) ? 1 : 2;
    return m == 1;
  };

  auto walkOut = [&](int32_t from, int32_t to, Ring& out) {
    for (int32_t k = from;; k = (k + 1) % on) {
      out.push_back(outer[k]);
      if (k == to) break;
    }
  };
  auto walkIn = [&](int32_t from, int32_t to, Ring& out) {
    const int32_t step = innerRunsWithOuter ? -1 : 1;
    for (int32_t k = from;; k = (((k + step) % in) + in) % in) {
      out.push_back(inner[k]);
      if (k == to) break;
    }
  };

  for (int32_t o1 = 0; o1 < on; o1++) {
    for (int32_t i1 = 0; i1 < in; i1++) {
      if (!clear(o1, i1)) continue;
      for (int32_t step = 1; step < std::min<int32_t>(on, 64); step++) {
        const int64_t o2 = (static_cast<int64_t>(o1) + on / 2 + (step % 2 ? step >> 1 : -(step >> 1)) +
                            static_cast<int64_t>(on) * 64) % on;
        if (o2 == o1) continue;
        for (int32_t jump = 1; jump < std::min<int32_t>(in, 64); jump++) {
          const int64_t i2 = (static_cast<int64_t>(i1) + in / 2 + (jump % 2 ? jump >> 1 : -(jump >> 1)) +
                              static_cast<int64_t>(in) * 64) % in;
          if (i2 == i1) continue;
          if (!clear(static_cast<int32_t>(o2), static_cast<int32_t>(i2))) continue;
          if (crossesProperly(outer[o1], inner[i1], outer[o2], inner[i2], drop)) continue;
          Ring first, second;
          walkOut(o1, static_cast<int32_t>(o2), first);
          walkIn(static_cast<int32_t>(i2), i1, first);
          walkOut(static_cast<int32_t>(o2), o1, second);
          walkIn(i1, static_cast<int32_t>(i2), second);
          if (first.size() < 3 || second.size() < 3) continue;
          return std::make_pair(std::move(first), std::move(second));
        }
      }
    }
  }
  return std::nullopt;
}

// Read a ring that passes through one of its corners twice as the face it describes.
std::optional<std::vector<std::vector<int32_t>>> keyholePieces(const LinkedShellGraph& graph,
                                                               const std::vector<int32_t>& ids,
                                                               int32_t depth = 0) {
  using Out = std::vector<std::vector<int32_t>>;
  if (depth > 16) return std::nullopt;
  const int32_t n = static_cast<int32_t>(ids.size());
  int32_t i = -1, j = -1;
  {
    std::unordered_map<int32_t, int32_t> firstAt;
    for (int32_t k = 0; k < n && j < 0; k++) {
      auto it = firstAt.find(ids[k]);
      if (it != firstAt.end()) {
        i = it->second;
        j = k;
      } else
        firstAt.emplace(ids[k], k);
    }
  }
  if (i < 0) return Out{ids};

  auto at = [&graph](int32_t v) -> P3 { return {graph.pointXOf(v), graph.pointYOf(v), graph.pointZOf(v)}; };
  auto normalOf = [&](const std::vector<int32_t>& ring) -> P3 {
    double nx = 0, ny = 0, nz = 0;
    const size_t m = ring.size();
    for (size_t k = 0; k < m; k++) {
      const P3 a = at(ring[k]), b = at(ring[(k + 1) % m]);
      nx += (a[1] - b[1]) * (a[2] + b[2]);
      ny += (a[2] - b[2]) * (a[0] + b[0]);
      nz += (a[0] - b[0]) * (a[1] + b[1]);
    }
    return {nx, ny, nz};
  };
  const std::vector<int32_t> loop(ids.begin() + i, ids.begin() + j);
  std::vector<int32_t> rest(ids.begin(), ids.begin() + i);
  rest.insert(rest.end(), ids.begin() + j, ids.end());
  const P3 whole = normalOf(rest);
  const P3 inner = normalOf(loop);
  const double along = inner[0] * whole[0] + inner[1] * whole[1] + inner[2] * whole[2];
  auto again = [&](const std::vector<int32_t>& ring) { return keyholePieces(graph, ring, depth + 1); };

  if (along >= 0) {
    auto a = again(loop);
    auto b = again(rest);
    if (!a || !b) return std::nullopt;
    a->insert(a->end(), std::make_move_iterator(b->begin()), std::make_move_iterator(b->end()));
    return a;
  }

  if (jsHypot(inner[0], inner[1], inner[2]) > jsHypot(whole[0], whole[1], whole[2])) {
    std::vector<int32_t> rot(ids.begin() + j, ids.end());
    rot.insert(rot.end(), ids.begin(), ids.begin() + j);
    return again(rot);
  }

  const int drop = dropOf(whole[0], whole[1], whole[2]);
  Ring ring;
  ring.reserve(n);
  for (int32_t v : ids) ring.push_back(at(v));
  Ring restPts, loopPts;
  restPts.reserve(rest.size());
  for (int32_t v : rest) restPts.push_back(at(v));
  loopPts.reserve(loop.size());
  for (int32_t v : loop) loopPts.push_back(at(v));

  auto clear = [&](int32_t m, int32_t q) -> bool {
    const P3& a = ring[m];
    const P3& b = ring[q];
    for (int32_t k = 0; k < n; k++) {
      const int32_t e = (k + 1) % n;
      if (k == m || e == m || k == q || e == q) continue;
      if (crossesProperly(a, b, ring[k], ring[e], drop)) return false;
    }
    for (int32_t k = 0; k < n; k++) {
      if (ids[k] != ids[m] && ids[k] != ids[q] && onBridge(a, b, ring[k], drop)) return false;
    }
    const P3 mid = midOf(a, b);
    return insideRing(restPts, mid, drop) && !insideRing(loopPts, mid, drop);
  };
  for (int32_t m = i + 1; m < j; m++) {
    for (int32_t step = 1; step < n - (j - i); step++) {
      const int32_t q = (j + step) % n;
      if (q >= i && q <= j) continue;
      if (ids[q] == ids[m]) continue;
      if (!clear(m, q)) continue;
      std::vector<int32_t> first, second;
      for (int32_t k = m;; k = (k + 1) % n) {
        first.push_back(ids[k]);
        if (k == q) break;
      }
      for (int32_t k = q;; k = (k + 1) % n) {
        second.push_back(ids[k]);
        if (k == m) break;
      }
      auto a = again(first);
      auto b = again(second);
      if (a && b) {
        a->insert(a->end(), std::make_move_iterator(b->begin()), std::make_move_iterator(b->end()));
        return a;
      }
    }
  }
  return std::nullopt;
}

// No corner written twice and no two edges crossing, in the projection that drops `drop`.
bool simpleRing(const Ring& ring, int drop) {
  const size_t n = ring.size();
  std::unordered_set<PKey, PKeyHash> seen;
  seen.reserve(n * 2);
  for (const P3& p : ring)
    if (!seen.insert(pkey(p)).second) return false;
  for (size_t i = 0; i < n; i++) {
    for (size_t j = i + 2; j < n; j++) {
      if (i == 0 && j == n - 1) continue;
      if (crossesProperly(ring[i], ring[i + 1], ring[j], ring[(j + 1) % n], drop)) return false;
    }
  }
  return true;
}

struct Fused {
  Ring piece;
  Ring merged;
};

std::optional<Fused> fuseTwoVoids(const Ring& outer, const Ring& a, const Ring& b, const RingRefs& others,
                                  int drop) {
  const double sense = jsSign(shoelaceIn(outer, drop));
  if (!(sense != 0) || std::isnan(sense)) return std::nullopt;
  auto against = [&](const Ring& r) -> Ring {
    if (jsSign(shoelaceIn(r, drop)) == sense) return Ring(r.rbegin(), r.rend());
    return r;
  };
  const Ring A = against(a), B = against(b);
  RingRefs rings{&outer, &A, &B};
  rings.insert(rings.end(), others.begin(), others.end());
  auto clear = [&](const P3& s, const P3& t) -> bool {
    for (const Ring* rp : rings) {
      const Ring& ring = *rp;
      const size_t n = ring.size();
      for (size_t k = 0; k < n; k++) {
        const P3& c = ring[k];
        if (crossesProperly(s, t, c, ring[(k + 1) % n], drop)) return false;
        if (onBridge(s, t, c, drop)) return false;
      }
    }
    const P3 mid = midOf(s, t);
    if (!insideRing(outer, mid, drop)) return false;
    for (size_t r = 1; r < rings.size(); r++)
      if (insideRing(*rings[r], mid, drop)) return false;
    return true;
  };
  struct Cand {
    int32_t i, j;
    double len;
  };
  std::vector<Cand> candidates;
  candidates.reserve(A.size() * B.size());
  for (size_t i = 0; i < A.size(); i++)
    for (size_t j = 0; j < B.size(); j++) {
      const P3& s = A[i];
      const P3& t = B[j];
      const double dx = s[0] - t[0], dy = s[1] - t[1], dz = s[2] - t[2];
      candidates.push_back({static_cast<int32_t>(i), static_cast<int32_t>(j), dx * dx + dy * dy + dz * dz});
    }
  std::stable_sort(candidates.begin(), candidates.end(), [](const Cand& x, const Cand& y) { return x.len < y.len; });
  std::vector<std::pair<int32_t, int32_t>> bridges;
  for (const Cand& c : candidates) {
    if (bridges.size() >= 24) break;
    if (clear(A[c.i], B[c.j])) bridges.emplace_back(c.i, c.j);
  }
  auto walk = [](const Ring& ring, int32_t from, int32_t to, Ring& out) {
    const int32_t n = static_cast<int32_t>(ring.size());
    for (int32_t k = from;; k = (k + 1) % n) {
      out.push_back(ring[k]);
      if (k == to) break;
    }
  };
  auto holds = [&](const Ring& piece) -> bool {
    for (const Ring* o : others)
      for (const P3& c : *o)
        if (insideRing(piece, c, drop)) return true;
    for (const P3& c : outer)
      if (insideRing(piece, c, drop)) return true;
    return false;
  };
  for (size_t x = 0; x < bridges.size(); x++) {
    for (size_t y = x + 1; y < bridges.size(); y++) {
      const auto [i1, j1] = bridges[x];
      const auto [i2, j2] = bridges[y];
      if (i1 == i2 || j1 == j2) continue;
      if (crossesProperly(A[i1], B[j1], A[i2], B[j2], drop)) continue;
      const int32_t orders[2][4] = {{i1, j1, i2, j2}, {i2, j2, i1, j1}};
      for (const auto& o : orders) {
        const int32_t s1 = o[0], t1 = o[1], s2 = o[2], t2 = o[3];
        Ring piece, merged;
        walk(B, t1, t2, piece);
        walk(A, s2, s1, piece);
        walk(A, s1, s2, merged);
        walk(B, t2, t1, merged);
        if (piece.size() < 3 || merged.size() < 3) continue;
        if (jsSign(shoelaceIn(piece, drop)) != sense) continue;
        if (jsSign(shoelaceIn(merged, drop)) != -sense) continue;
        if (holds(piece)) continue;
        return Fused{std::move(piece), std::move(merged)};
      }
    }
  }
  return std::nullopt;
}

std::optional<Rings> carve(const Ring& outer, const RingRefs& voids, int32_t depth);

// When no void can reach the outline, join two neighbouring voids into one.
std::optional<Rings> fuseNeighbourVoids(const Ring& outer, const RingRefs& voids, int drop, int32_t depth) {
  if (voids.size() < 2) return std::nullopt;
  std::vector<P3> centres;
  centres.reserve(voids.size());
  for (const Ring* r : voids) {
    P3 c{0, 0, 0};
    const double len = static_cast<double>(r->size());
    for (const P3& p : *r)
      for (int k = 0; k < 3; k++) c[k] += p[k] / len;
    centres.push_back(c);
  }
  struct Pair {
    int32_t p, q;
    double d;
  };
  std::vector<Pair> pairs;
  for (size_t p = 0; p < voids.size(); p++) {
    for (size_t q = p + 1; q < voids.size(); q++) {
      const P3& a = centres[p];
      const P3& b = centres[q];
      const double dx = a[0] - b[0], dy = a[1] - b[1], dz = a[2] - b[2];
      pairs.push_back({static_cast<int32_t>(p), static_cast<int32_t>(q), dx * dx + dy * dy + dz * dz});
    }
  }
  std::stable_sort(pairs.begin(), pairs.end(), [](const Pair& x, const Pair& y) { return x.d < y.d; });
  const size_t lim = std::min<size_t>(pairs.size(), 64);
  for (size_t pi = 0; pi < lim; pi++) {
    const int32_t p = pairs[pi].p, q = pairs[pi].q;
    RingRefs others;
    others.reserve(voids.size());
    for (size_t i = 0; i < voids.size(); i++)
      if (static_cast<int32_t>(i) != p && static_cast<int32_t>(i) != q) others.push_back(voids[i]);
    auto fused = fuseTwoVoids(outer, *voids[p], *voids[q], others, drop);
    if (!fused) continue;
    RingRefs next{&fused->merged};
    next.insert(next.end(), others.begin(), others.end());
    auto done = carve(outer, next, depth);
    if (!done) return std::nullopt;
    Rings out;
    out.reserve(done->size() + 1);
    out.push_back(std::move(fused->piece));
    for (Ring& r : *done) out.push_back(std::move(r));
    for (const Ring& piece : out)
      if (!simpleRing(piece, drop)) return std::nullopt;
    return out;
  }
  return std::nullopt;
}

std::optional<Rings> carve(const Ring& outer, const RingRefs& voids, int32_t depth) {
  if (voids.empty()) return Rings{outer};
  if (depth > 512) return std::nullopt;
  double nx, ny, nz;
  newell(outer, nx, ny, nz);
  const int drop = dropOf(nx, ny, nz);

  for (size_t pick = 0; pick < voids.size(); pick++) {
    RingRefs rest;
    rest.reserve(voids.size());
    for (size_t i = 0; i < voids.size(); i++)
      if (i != pick) rest.push_back(voids[i]);
    auto split = splitAroundHole(outer, *voids[pick], rest);
    if (!split) continue;
    const Ring* pieces[2] = {&split->first, &split->second};
    bool homeless = false;
    for (const Ring* h : rest) {
      int homes = 0;
      for (const Ring* piece : pieces) {
        bool all = true;
        for (const P3& q : *h)
          if (!insideRing(*piece, q, drop)) {
            all = false;
            break;
          }
        if (all) homes++;
      }
      if (homes != 1) {
        homeless = true;
        break;
      }
    }
    if (homeless) continue;
    Rings out;
    for (const Ring* piece : pieces) {
      RingRefs mine;
      for (const Ring* h : rest)
        if (!h->empty() && insideRing(*piece, (*h)[0], drop)) mine.push_back(h);
      auto done = carve(*piece, mine, depth + 1);
      if (!done) return std::nullopt;
      for (Ring& r : *done) out.push_back(std::move(r));
    }
    return out;
  }
  return fuseNeighbourVoids(outer, voids, drop, depth);
}

// ── open-edge chaining (revealRings / openLoops) ────────────────────────────────────────────────

// Points interned by key; edges counted in first-use order (TS Map insertion order).
struct EdgeUses {
  std::unordered_map<PKey, int32_t, PKeyHash> ids;
  std::vector<P3> at;  // last point written for each id as an edge start
  std::vector<std::pair<int64_t, int32_t>> uses;  // (edge, count) in insertion order
  std::unordered_map<int64_t, int32_t> useIndex;

  static int64_t edgeKey(int32_t a, int32_t b) { return (static_cast<int64_t>(a) << 32) | static_cast<uint32_t>(b); }

  int32_t intern(const P3& p) {
    auto [it, fresh] = ids.emplace(pkey(p), static_cast<int32_t>(at.size()));
    if (fresh) at.push_back(p);
    return it->second;
  }
  void walk(const Ring& ring) {
    const size_t n = ring.size();
    for (size_t i = 0; i < n; i++) {
      const int32_t a = intern(ring[i]);
      const int32_t b = intern(ring[(i + 1) % n]);
      at[a] = ring[i];
      const int64_t e = edgeKey(a, b);
      auto [it, fresh] = useIndex.emplace(e, static_cast<int32_t>(uses.size()));
      if (fresh)
        uses.emplace_back(e, 1);
      else
        uses[it->second].second++;
    }
  }
  bool has(int32_t a, int32_t b) const { return useIndex.count(edgeKey(a, b)) != 0; }

  // Open edges chained into loops of point ids; false on any ambiguity (TS returns []).
  bool chain(std::vector<std::vector<int32_t>>& loops) const {
    const int32_t nv = static_cast<int32_t>(at.size());
    std::vector<int32_t> next(nv, -1);
    std::vector<int32_t> order;  // keys of `next` in insertion order
    for (const auto& [e, n] : uses) {
      const int32_t a = static_cast<int32_t>(e >> 32);
      const int32_t b = static_cast<int32_t>(static_cast<uint32_t>(e & 0xffffffffLL));
      if (n != 1 || has(b, a)) continue;
      if (next[a] >= 0) return false;
      next[a] = b;
      order.push_back(a);
    }
    std::vector<char> seen(nv, 0);
    for (int32_t start : order) {
      if (seen[start]) continue;
      std::vector<int32_t> loop;
      int32_t v = start;
      while (v >= 0 && !seen[v]) {
        seen[v] = 1;
        loop.push_back(v);
        v = next[v];
      }
      if (v != start || loop.size() < 3) return false;
      loops.push_back(std::move(loop));
    }
    return true;
  }
};

const std::vector<Ring> kNoHoles;

inline const std::vector<Ring>& holesAt(const std::vector<Rings>& holesPerRing, size_t i) {
  return i < holesPerRing.size() ? holesPerRing[i] : kNoHoles;
}

// The faces that join two open outlines which are one outline translated and walked the other way.
Rings revealRings(const Rings& rings, const std::vector<Rings>& holesPerRing) {
  EdgeUses g;
  for (size_t i = 0; i < rings.size(); i++) {
    g.walk(rings[i]);
    for (const Ring& h : holesAt(holesPerRing, i)) g.walk(h);
  }
  // `joined` holds every edge unordered; membership is the TS `joined` set.
  std::vector<std::vector<int32_t>> loops;
  if (!g.chain(loops)) return {};
  auto isJoined = [&](int32_t p, int32_t q) { return g.has(p, q) || g.has(q, p); };
  Rings added;
  std::vector<char> used(loops.size(), 0);
  for (size_t i = 0; i < loops.size(); i++) {
    if (used[i]) continue;
    Ring a;
    for (int32_t k : loops[i]) a.push_back(g.at[k]);
    for (size_t j = i + 1; j < loops.size() && !used[i]; j++) {
      if (used[j] || loops[j].size() != a.size()) continue;
      Ring b;
      for (int32_t k : loops[j]) b.push_back(g.at[k]);
      const int32_t n = static_cast<int32_t>(a.size());
      for (int32_t k = 0; k < n; k++) {
        const P3 t{b[k][0] - a[0][0], b[k][1] - a[0][1], b[k][2] - a[0][2]};
        if (!(jsHypot(t[0], t[1], t[2]) > 0)) continue;
        auto partnerIdx = [&](int32_t s) { return ((k - s) % n + n) % n; };
        bool fits = true;
        for (int32_t s = 0; s < n && fits; s++) {
          const P3& q = b[partnerIdx(s)];
          fits = q[0] == a[s][0] + t[0] && q[1] == a[s][1] + t[1] && q[2] == a[s][2] + t[2];
        }
        if (!fits) continue;
        bool bridgedAlready = false;
        for (int32_t s = 0; s < n && !bridgedAlready; s++)
          bridgedAlready = isJoined(g.intern(a[s]), g.intern(b[partnerIdx(s)]));
        if (bridgedAlready) break;
        for (int32_t s = 0; s < n; s++) {
          const P3& p0 = a[s];
          const P3& p1 = a[(s + 1) % n];
          added.push_back({p1, p0, b[partnerIdx(s)], b[partnerIdx(s + 1)]});
        }
        used[i] = 1;
        used[j] = 1;
        break;
      }
    }
  }
  return added;
}

// The open edges of a set of rings and their holes, chained into loops; empty on any ambiguity.
Rings openLoops(const Rings& rings, const std::vector<Rings>& holesPerRing) {
  EdgeUses g;
  for (size_t i = 0; i < rings.size(); i++) {
    g.walk(rings[i]);
    for (const Ring& h : holesAt(holesPerRing, i)) g.walk(h);
  }
  std::vector<std::vector<int32_t>> loops;
  if (!g.chain(loops)) return {};
  Rings out;
  out.reserve(loops.size());
  for (const auto& loop : loops) {
    Ring r;
    r.reserve(loop.size());
    for (int32_t k : loop) r.push_back(g.at[k]);
    out.push_back(std::move(r));
  }
  return out;
}

// Voids a face declared and did not describe, recovered from the walls that frame them.
std::vector<Rings> restoredVoids(const Rings& rings, const std::vector<Rings>& holesPerRing) {
  const Rings loops = openLoops(rings, holesPerRing);
  if (loops.empty()) return holesPerRing;
  const double weld = fuseDistance();
  std::vector<Rings> out(rings.size());
  for (size_t i = 0; i < rings.size(); i++) out[i] = holesAt(holesPerRing, i);
  for (const Ring& loop : loops) {
    for (size_t i = 0; i < rings.size(); i++) {
      const Ring& ring = rings[i];
      if (ring.size() < 3) continue;
      double nx, ny, nz;
      newell(ring, nx, ny, nz);
      const double len = jsHypot(nx, ny, nz);
      if (!(len != 0) || std::isnan(len)) continue;
      const P3& o = ring[0];
      auto off = [&](const P3& p) { return ((p[0] - o[0]) * nx + (p[1] - o[1]) * ny + (p[2] - o[2]) * nz) / len; };
      bool far = false;
      for (const P3& p : loop)
        if (std::fabs(off(p)) > weld) {
          far = true;
          break;
        }
      if (far) continue;
      const int drop = dropOf(nx, ny, nz);
      std::unordered_set<PKey, PKeyHash> onOutline;
      for (const P3& p : ring) onOutline.insert(pkey(p));
      bool touches = false;
      for (const P3& p : loop)
        if (onOutline.count(pkey(p))) {
          touches = true;
          break;
        }
      if (touches) continue;
      bool all = true;
      for (const P3& p : loop)
        if (!insideRing(ring, p, drop)) {
          all = false;
          break;
        }
      if (!all) continue;
      out[i].push_back(loop);
      break;
    }
  }
  return out;
}

// Corners to move so that nearly flat faces become flat, keyed by their exact position.
std::unordered_map<PKey, P3, PKeyHash> flattenedCorners(const Rings& rings) {
  std::unordered_map<PKey, P3, PKeyHash> moved;
  const double weld = fuseDistance();
  struct Plane {
    P3 n;
    double d;
    double off(const P3& p) const { return p[0] * n[0] + p[1] * n[1] + p[2] * n[2] - d; }
  };
  auto planeOf = [](const Ring& pts) -> std::optional<Plane> {
    double nx = 0, ny = 0, nz = 0, cx = 0, cy = 0, cz = 0;
    const size_t m = pts.size();
    for (size_t i = 0; i < m; i++) {
      const P3& a = pts[i];
      const P3& b = pts[(i + 1) % m];
      nx += (a[1] - b[1]) * (a[2] + b[2]);
      ny += (a[2] - b[2]) * (a[0] + b[0]);
      nz += (a[0] - b[0]) * (a[1] + b[1]);
      cx += a[0];
      cy += a[1];
      cz += a[2];
    }
    const double len = jsHypot(nx, ny, nz);
    if (!(len != 0) || std::isnan(len)) return std::nullopt;
    const P3 n{nx / len, ny / len, nz / len};
    const double d = (n[0] * cx + n[1] * cy + n[2] * cz) / static_cast<double>(m);
    return Plane{n, d};
  };
  for (const Ring& ring : rings) {
    if (ring.size() < 4 || ring.size() > 64) continue;
    double extent = 0;
    for (const P3& p : ring)
      for (const P3& q : ring) extent = jsMax(extent, jsHypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]));
    double shortest = std::numeric_limits<double>::infinity();
    for (size_t i = 0; i < ring.size(); i++) {
      const P3& p = ring[i];
      const P3& q = ring[(i + 1) % ring.size()];
      shortest = jsMin(shortest, jsHypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]));
    }
    struct Cand {
      size_t k;
      Plane plane;
      bool exact;
    };
    std::vector<Cand> candidates;
    Ring rest;
    for (size_t k = 0; k < ring.size(); k++) {
      rest.clear();
      for (size_t i = 0; i < ring.size(); i++)
        if (i != k) rest.push_back(ring[i]);
      auto plane = planeOf(rest);
      if (!plane) continue;
      bool off = false;
      for (const P3& p : rest)
        if (std::fabs(plane->off(p)) > weld) {
          off = true;
          break;
        }
      if (off) continue;
      const double miss = std::fabs(plane->off(ring[k]));
      if (miss <= weld || miss > extent * 1e-4 || miss > shortest / 10) continue;
      bool exact = false;
      for (int c = 0; c < 3 && !exact; c++) {
        bool all = true;
        for (const P3& p : rest)
          if (!(p[c] == rest[0][c])) {
            all = false;
            break;
          }
        exact = all;
      }
      candidates.push_back({k, *plane, exact});
    }
    const Cand* pick = nullptr;
    if (candidates.size() == 1) {
      pick = &candidates[0];
    } else {
      int count = 0;
      for (const Cand& c : candidates)
        if (c.exact) {
          if (count == 0) pick = &c;
          count++;
        }
      if (count != 1) pick = nullptr;
    }
    if (!pick) continue;
    const P3& p = ring[pick->k];
    const double off = pick->plane.off(p);
    const P3& n = pick->plane.n;
    moved[pkey(p)] = P3{p[0] - off * n[0], p[1] - off * n[1], p[2] - off * n[2]};
  }
  return moved;
}

// Canonical form of an id cycle, orientation preserved (equality is all the TS string is used for).
// Up to kInline ids live inside the key, so the common triangle and quad allocate nothing.
struct RingTag {
  static constexpr size_t kInline = 6;
  uint32_t n = 0;
  std::array<int32_t, kInline> small{};
  std::vector<int32_t> big;
  const int32_t* data() const { return n <= kInline ? small.data() : big.data(); }
  bool operator==(const RingTag& o) const {
    return n == o.n && std::equal(data(), data() + n, o.data());
  }
};
struct RingTagHash {
  size_t operator()(const RingTag& t) const {
    uint64_t h = 0xcbf29ce484222325ULL ^ t.n;
    const int32_t* d = t.data();
    for (uint32_t i = 0; i < t.n; i++) {
      h ^= static_cast<uint32_t>(d[i]);
      h *= 0x100000001b3ULL;
      h ^= h >> 29;
    }
    return static_cast<size_t>(h);
  }
};
// The lexicographically least rotation that starts at a smallest id (the TS canonical form).
template <class It>
RingTag ringTag(It first, size_t n) {
  RingTag key;
  if (n == 0) return key;
  size_t best = 0;
  for (size_t i = 1; i < n; i++)
    if (first[i] < first[best]) best = i;
  size_t chosen = n;  // rotation start of the current key
  auto less = [&](size_t s, size_t t) {  // rotation s < rotation t ?
    for (size_t i = 0; i < n; i++) {
      const int32_t a = first[(s + i) % n], b = first[(t + i) % n];
      if (a != b) return a < b;
    }
    return false;
  };
  for (size_t s = 0; s < n; s++) {
    if (first[s] != first[best]) continue;
    if (chosen == n || less(s, chosen)) chosen = s;
  }
  key.n = static_cast<uint32_t>(n);
  int32_t* out;
  if (n <= RingTag::kInline) out = key.small.data();
  else { key.big.resize(n); out = key.big.data(); }
  for (size_t i = 0; i < n; i++) out[i] = first[(chosen + i) % n];
  return key;
}

// The overlay's view of the graph.
struct GraphGeometry final : OverlayGeometry {
  explicit GraphGeometry(LinkedShellGraph& g) : graph(g) { tolerance = g.tolerance; }
  double pointXOf(int32_t v) const override { return graph.pointXOf(v); }
  double pointYOf(int32_t v) const override { return graph.pointYOf(v); }
  double pointZOf(int32_t v) const override { return graph.pointZOf(v); }
  int32_t placeCorner(double x, double y, double z) override { return graph.placeCorner(x, y, z); }
  LinkedShellGraph& graph;
};

// Bucket of the plane grouping: `${nk}|${dq}`.
struct BinKey {
  Fixed6 x, y, z;
  uint64_t dq;
  bool operator==(const BinKey& o) const {
    return x.neg == o.x.neg && x.n == o.x.n && y.neg == o.y.neg && y.n == o.y.n && z.neg == o.z.neg &&
           z.n == o.z.n && dq == o.dq;
  }
};
struct BinKeyHash {
  size_t operator()(const BinKey& k) const {
    uint64_t h = static_cast<uint64_t>(k.x.n) * 0x9E3779B97F4A7C15ULL;
    h ^= static_cast<uint64_t>(k.y.n) + 0x632BE59BD9B4E019ULL + (h << 6) + (h >> 2);
    h ^= static_cast<uint64_t>(k.z.n) + 0x85EBCA77C2B2AE63ULL + (h << 6) + (h >> 2);
    h ^= (static_cast<uint64_t>(k.x.neg) | (static_cast<uint64_t>(k.y.neg) << 2) |
          (static_cast<uint64_t>(k.z.neg) << 4)) + (h << 6) + (h >> 2);
    h ^= k.dq + (h << 6) + (h >> 2);
    h ^= h >> 31;
    h *= 0xff51afd7ed558ccdULL;
    h ^= h >> 33;
    return static_cast<size_t>(h);
  }
};

struct Expanded {
  const Ring* ring;
  bool holed;
};

struct Built {
  std::unique_ptr<LinkedShellGraph> graph;
  int32_t dropped = 0;
  int32_t holed = 0;
  int32_t cancelled = 0;
};

Built buildShell(const std::vector<Expanded>& expanded, bool reversed) {
  Built res;
  res.graph = std::make_unique<LinkedShellGraph>();
  LinkedShellGraph& graph = *res.graph;
  int32_t dropped = 0, holed = 0;

  struct Prepared {
    bool present = false;
    bool hasHole = false;
    std::vector<int32_t> ids;
  };
  const size_t total = expanded.size();
  std::vector<Prepared> prepared(total);
  if (total > 64) {
    size_t corners = 0;
    for (const Expanded& e : expanded) corners += e.ring->size();
    graph.reserve(corners / 2, corners);  // a closed mesh shares each vertex among several rings
  }
  for (size_t at = 0; at < total; at++) {
    const Ring& ring = *expanded[at].ring;
    const bool hasHole = expanded[at].holed;
    if (dropFlatRings && ring.size() >= 3) {
      double nx = 0, ny = 0, nz = 0, perim = 0;
      const size_t n = ring.size();
      for (size_t i = 0; i < n; i++) {
        const P3& a = ring[i];
        const P3& b = ring[(i + 1) % n];
        nx += (a[1] - b[1]) * (a[2] + b[2]);
        ny += (a[2] - b[2]) * (a[0] + b[0]);
        nz += (a[0] - b[0]) * (a[1] + b[1]);
        perim += jsHypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      }
      if (jsHypot(nx, ny, nz) <= 2 * perim * fuseDistance()) {
        shellStats.flatRingsDropped++;
        continue;  // stays absent (TS null)
      }
    }
    Prepared& f = prepared[at];
    f.present = true;
    f.hasHole = hasHole;
    std::vector<int32_t>& ids = f.ids;
    ids.reserve(ring.size());
    auto place = [&](const P3& p) {
      const int32_t v = graph.placeCorner(p[0], p[1], p[2]);
      if (ids.empty() || ids.back() != v) ids.push_back(v);
    };
    if (reversed)
      for (auto it = ring.rbegin(); it != ring.rend(); ++it) place(*it);
    else
      for (const P3& p : ring) place(p);
    while (ids.size() > 1 && ids.front() == ids.back()) ids.pop_back();
  }

  std::vector<char> cancelled(total, 0);
  int32_t cancelledCount = 0;
  if (cancelOppositeFaces) {
    // Per key a LIFO stack of face indices, threaded through `below` (the TS array's push/pop).
    std::unordered_map<RingTag, int32_t, RingTagHash> pending;  // key -> top of its stack, -1 empty
    pending.reserve(total);
    std::vector<int32_t> below(total, -1);
    for (size_t at = 0; at < total; at++) {
      const Prepared& face = prepared[at];
      if (!face.present || face.ids.size() < 3) continue;
      RingTag key = ringTag(face.ids.begin(), face.ids.size());
      RingTag mirrorKey = ringTag(face.ids.rbegin(), face.ids.size());
      auto pit = pending.find(mirrorKey);
      if (pit != pending.end() && pit->second >= 0 && !(key == mirrorKey)) {
        const int32_t partner = pit->second;
        pit->second = below[partner];
        if (!cancelled[at]) cancelled[at] = 1, cancelledCount++;
        if (!cancelled[partner]) cancelled[partner] = 1, cancelledCount++;
        shellStats.oppositeFacesCancelled += 2;
        continue;
      }
      auto [it, inserted] = pending.try_emplace(std::move(key), -1);
      below[at] = it->second;
      it->second = static_cast<int32_t>(at);
    }
  }

  // 0 = not replaced, 1 = absorbed (TS null), 2 = carries its group's emission.
  std::vector<char> overlayState;
  std::unordered_map<int32_t, std::vector<std::vector<int32_t>>> overlayEmitted;
  if (shellOverlay) {
    overlayState.assign(total, 0);
    const double tol = graph.tolerance;
    struct Group {
      double nx, ny, nz, d;
      std::vector<int32_t> members;
    };
    std::vector<Group> groups;
    std::unordered_map<BinKey, int32_t, BinKeyHash> binLoad;  // first group per bucket
    for (size_t at = 0; at < total; at++) {
      const Prepared& face = prepared[at];
      if (!face.present || face.ids.size() < 3 || cancelled[at]) continue;
      const std::vector<int32_t>& ids = face.ids;
      double nx = 0, ny = 0, nz = 0, cx = 0, cy = 0, cz = 0;
      const size_t n = ids.size();
      for (size_t i = 0; i < n; i++) {
        const int32_t a = ids[i], b = ids[(i + 1) % n];
        const double ax = graph.pointXOf(a), ay = graph.pointYOf(a), az = graph.pointZOf(a);
        const double bx = graph.pointXOf(b), by = graph.pointYOf(b), bz = graph.pointZOf(b);
        nx += (ay - by) * (az + bz);
        ny += (az - bz) * (ax + bx);
        nz += (ax - bx) * (ay + by);
        cx += ax;
        cy += ay;
        cz += az;
      }
      const double nl = jsHypot(nx, ny, nz);
      if (!(nl > 0)) continue;
      double ux = nx / nl, uy = ny / nl, uz = nz / nl;
      const double m = jsMax(jsMax(std::fabs(ux), std::fabs(uy)), std::fabs(uz));
      const double lead = std::fabs(ux) == m ? ux : std::fabs(uy) == m ? uy : uz;
      if (lead < 0) {
        ux = -ux;
        uy = -uy;
        uz = -uz;
      }
      const double d = (cx * ux + cy * uy + cz * uz) / static_cast<double>(n);
      const double dq = tol > 0 ? jsRound(d / tol) : d;
      const Fixed6 kx = toFixed6(ux), ky = toFixed6(uy), kz = toFixed6(uz);
      int32_t joined = -1;
      static const double kSteps3[3] = {-1, 0, 1};
      static const double kSteps1[1] = {0};
      const double* steps = tol > 0 ? kSteps3 : kSteps1;
      const int nsteps = tol > 0 ? 3 : 1;
      for (int s = 0; s < nsteps; s++) {
        auto it = binLoad.find(BinKey{kx, ky, kz, numKey(dq + steps[s])});
        if (it == binLoad.end()) continue;
        const int32_t gi = it->second;
        const Group& grp = groups[gi];
        bool fits = true;
        for (int32_t v : ids) {
          const double off =
              graph.pointXOf(v) * grp.nx + graph.pointYOf(v) * grp.ny + graph.pointZOf(v) * grp.nz - grp.d;
          if (std::fabs(off) > tol) {
            fits = false;
            break;
          }
        }
        if (fits) {
          joined = gi;
          break;
        }
      }
      if (joined >= 0)
        groups[joined].members.push_back(static_cast<int32_t>(at));
      else {
        binLoad.emplace(BinKey{kx, ky, kz, numKey(dq)}, static_cast<int32_t>(groups.size()));
        groups.push_back({ux, uy, uz, d, {static_cast<int32_t>(at)}});
      }
    }
    GraphGeometry geo(graph);
    const char* debugEnv = std::getenv("OVERLAY_DEBUG");
    const bool debug = debugEnv && *debugEnv;
    for (const Group& grp : groups) {
      std::vector<std::vector<int32_t>> rings;
      rings.reserve(grp.members.size());
      for (int32_t at : grp.members) rings.push_back(prepared[at].ids);
      const P3 normal{grp.nx, grp.ny, grp.nz};
      if (!overlaySuspicious(rings, normal, geo)) continue;
      shellStats.overlayGroups++;
      auto emitted = overlayRings(rings, normal, geo);
      if (debug) {
        auto pv = [&](int32_t v) {
          std::printf(" %d(%.3f,%.3f,%.3f)", v, graph.pointXOf(v), graph.pointYOf(v), graph.pointZOf(v));
        };
        std::printf("  [overlay] group n=(%.3f,%.3f,%.3f) d=%.3f members=%zu\n", grp.nx, grp.ny, grp.nz, grp.d,
                    grp.members.size());
        for (const auto& r : rings) {
          std::printf("    in :");
          for (int32_t v : r) pv(v);
          std::printf("\n");
        }
        if (emitted)
          for (const auto& r : *emitted) {
            std::printf("    out:");
            for (int32_t v : r) pv(v);
            std::printf("\n");
          }
        else
          std::printf("    out: DECLINED\n");
      }
      if (!emitted) {
        shellStats.overlayDeclined++;
        continue;
      }
      shellStats.overlayFacesIn += static_cast<int64_t>(rings.size());
      shellStats.overlayFacesOut += static_cast<int64_t>(emitted->size());
      overlayState[grp.members[0]] = 2;
      overlayEmitted[grp.members[0]] = std::move(*emitted);
      for (size_t i = 1; i < grp.members.size(); i++) overlayState[grp.members[i]] = 1;
    }
  }

  std::vector<char> surplusEvict(total, 0);
  if (shellEvictSurplus) {
    std::unordered_map<int64_t, int32_t> counts;
    std::vector<std::pair<int32_t, std::vector<int64_t>>> dartsAt;
    for (size_t at = 0; at < total; at++) {
      const Prepared& face = prepared[at];
      if (!face.present || face.ids.size() < 3 || cancelled[at]) continue;
      if (!overlayState.empty() && overlayState[at] != 0) continue;
      const std::vector<int32_t>& ids = face.ids;
      std::vector<int64_t> halfLinks;
      halfLinks.reserve(ids.size());
      for (size_t i = 0; i < ids.size(); i++)
        halfLinks.push_back((static_cast<int64_t>(ids[i]) << 32) |
                            static_cast<uint32_t>(ids[(i + 1) % ids.size()]));
      for (int64_t d : halfLinks) counts[d]++;
      dartsAt.emplace_back(static_cast<int32_t>(at), std::move(halfLinks));
    }
    bool moved = true;
    while (moved) {
      moved = false;
      for (const auto& [at, halfLinks] : dartsAt) {
        if (surplusEvict[at]) continue;
        bool pure = !halfLinks.empty();
        for (int64_t d : halfLinks) {
          auto it = counts.find(d);
          if (it == counts.end() || it->second < 2) {
            pure = false;
            break;
          }
        }
        if (!pure) continue;
        surplusEvict[at] = 1;
        for (int64_t d : halfLinks) counts[d]--;
        shellStats.surplusFacesEvicted++;
        moved = true;
      }
    }
  }

  for (size_t at = 0; at < total; at++) {
    const Prepared& face = prepared[at];
    if (!face.present) {
      dropped++;
      continue;
    }
    if (face.hasHole) holed++;
    if (cancelled[at]) continue;
    if (surplusEvict[at]) continue;
    if (face.ids.size() < 3) {
      dropped++;
      continue;
    }
    const char rep = overlayState.empty() ? 0 : overlayState[at];
    if (rep == 1) continue;
    if (rep == 2) {
      for (const auto& cell : overlayEmitted[static_cast<int32_t>(at)]) {
        for (const auto& piece : splitPinchedRing(cell)) {
          if (piece.size() < 3) continue;
          if (graph.appendPanel(piece) < 0) dropped++;
        }
      }
      continue;
    }
    if (graph.appendPanel(face.ids) < 0) {
      auto pieces = keyholePieces(graph, face.ids);
      if (!pieces) {
        dropped++;
        continue;
      }
      for (const auto& piece : *pieces)
        if (graph.appendPanel(piece) < 0) dropped++;
    }
  }
  graph.seal();
  res.dropped = dropped;
  res.holed = holed;
  res.cancelled = cancelledCount;
  return res;
}

}  // namespace

void setCancelOppositeFaces(bool on) { cancelOppositeFaces = on; }
void setDropFlatRings(bool on) { dropFlatRings = on; }
void setShellOverlay(bool on) { shellOverlay = on; }
void setShellEvictSurplus(bool on) { shellEvictSurplus = on; }
void setFlattenFaces(bool on) { flattenFaces = on; }
void setHealReveals(bool on) { healReveals = on; }

std::optional<std::vector<std::vector<P3>>> carvePanelVoids(const std::vector<P3>& outer,
                                                            const std::vector<std::vector<P3>>& voids,
                                                            int32_t depth) {
  RingRefs refs;
  refs.reserve(voids.size());
  for (const Ring& v : voids) refs.push_back(&v);
  return carve(outer, refs, depth);
}

AssembledShell stitchUpShell(const std::vector<std::vector<P3>>& ringsIn,
                             const std::vector<std::vector<std::vector<P3>>>& holesIn) {
  // Copies only when a retry knob rewrites the input.
  const Rings* rings = &ringsIn;
  const std::vector<Rings>* holesPerRing = &holesIn;
  Rings ringsOwn;
  std::vector<Rings> holesOwn;
  if (healReveals) {
    holesOwn = restoredVoids(*rings, *holesPerRing);
    holesPerRing = &holesOwn;
    Rings reveals = revealRings(*rings, *holesPerRing);
    if (!reveals.empty()) {
      ringsOwn = *rings;
      // TS spreads holesPerRing (possibly shorter than rings) then appends one [] per reveal.
      std::vector<Rings> h = *holesPerRing;
      for (Ring& r : reveals) {
        ringsOwn.push_back(std::move(r));
        h.emplace_back();
      }
      holesOwn = std::move(h);
      rings = &ringsOwn;
      holesPerRing = &holesOwn;
    }
  }
  if (flattenFaces) {
    const auto moved = flattenedCorners(*rings);
    if (!moved.empty()) {
      auto at = [&moved](const P3& p) -> P3 {
        auto it = moved.find(pkey(p));
        return it == moved.end() ? p : it->second;
      };
      Rings r2;
      r2.reserve(rings->size());
      for (const Ring& r : *rings) {
        Ring o;
        o.reserve(r.size());
        for (const P3& p : r) o.push_back(at(p));
        r2.push_back(std::move(o));
      }
      std::vector<Rings> h2;
      h2.reserve(holesPerRing->size());
      for (const Rings& hs : *holesPerRing) {
        Rings oh;
        oh.reserve(hs.size());
        for (const Ring& h : hs) {
          Ring o;
          o.reserve(h.size());
          for (const P3& p : h) o.push_back(at(p));
          oh.push_back(std::move(o));
        }
        h2.push_back(std::move(oh));
      }
      ringsOwn = std::move(r2);
      holesOwn = std::move(h2);
      rings = &ringsOwn;
      holesPerRing = &holesOwn;
    }
  }

  // Carving reads only the rings, so both passes share it (TS recomputes it per pass).
  std::deque<Ring> carved;
  std::vector<Expanded> expanded;
  expanded.reserve(rings->size());
  for (size_t at = 0; at < rings->size(); at++) {
    const Ring& ring = (*rings)[at];
    const Rings& holes = holesAt(*holesPerRing, at);
    if (!holes.empty()) {
      auto pieces = carvePanelVoids(ring, holes);
      if (pieces) {
        for (Ring& piece : *pieces) {
          carved.push_back(std::move(piece));
          expanded.push_back({&carved.back(), false});
        }
        continue;
      }
    }
    expanded.push_back({&ring, !holes.empty()});
  }

  Built first = buildShell(expanded, false);
  if (first.graph->isWatertight() && first.graph->enclosedSignedVolume() < 0) {
    Built second = buildShell(expanded, true);
    if (second.dropped == first.dropped && second.graph->isWatertight() &&
        second.graph->enclosedSignedVolume() > 0) {
      return AssembledShell{std::move(second.graph), second.dropped, second.holed, true, second.cancelled};
    }
  }
  return AssembledShell{std::move(first.graph), first.dropped, first.holed, false, first.cancelled};
}

}  // namespace brep
