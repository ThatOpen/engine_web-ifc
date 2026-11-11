// build.cpp — construct solids, and hand them back as triangles. Port of build.ts.
#include "build.h"

#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <limits>
#include <span>
#include <unordered_map>

#include "shell.h"
#include "sign.h"
#include "stitch.h"
#include "tessellate.h"
#include "topology.h"

namespace brep {

namespace {

using Graph = LinkedShellGraph;
using GraphPtr = std::unique_ptr<LinkedShellGraph>;
using Ring = std::vector<int32_t>;

inline double jsSign(double x) {
  if (std::isnan(x)) return x;
  return x > 0 ? 1.0 : x < 0 ? -1.0 : x;
}

// Directed vertex pair as one key (TS `${a}|${b}` / `${a}>${b}`).
inline int64_t pairKey(int32_t a, int32_t b) {
  return static_cast<int64_t>((static_cast<uint64_t>(static_cast<uint32_t>(a)) << 32) |
                              static_cast<uint32_t>(b));
}
inline int32_t keyFirst(int64_t k) { return static_cast<int32_t>(static_cast<uint64_t>(k) >> 32); }
inline int32_t keySecond(int64_t k) { return static_cast<int32_t>(static_cast<uint64_t>(k) & 0xffffffffu); }
// Undirected pair, lower id first.
inline int64_t cornerPairId(int32_t a, int32_t b) { return a < b ? pairKey(a, b) : pairKey(b, a); }

// `new Set(v).size !== v.length`
bool hasRepeat(const Ring& v) {
  if (v.size() < 2) return false;
  Ring s = v;
  std::sort(s.begin(), s.end());
  return std::adjacent_find(s.begin(), s.end()) != s.end();
}

// Set of int64 keys, lookups only.
struct KeySet {
  detail::ProbeMap<int64_t> m;
  bool has(int64_t k) const { return m.get(k) >= 0; }
  void add(int64_t k) {
    bool inserted = false;
    m.getOrInsert(k, 0, inserted);
  }
  size_t size() const { return m.size(); }
};

// Map<key, count> iterated in insertion order.
struct OrderedCount {
  detail::ProbeMap<int64_t> index;
  std::vector<int64_t> keys;
  std::vector<int32_t> counts;
  void add(int64_t k) {
    bool inserted = false;
    const int32_t at = index.getOrInsert(k, static_cast<int32_t>(keys.size()), inserted);
    if (inserted) {
      keys.push_back(k);
      counts.push_back(1);
    } else {
      counts[at]++;
    }
  }
  int32_t get(int64_t k) const {
    const int32_t i = index.get(k);
    return i < 0 ? 0 : counts[i];
  }
};

// TS Map<string, number> tally, insertion order.
void tallyInto(std::vector<std::pair<std::string, int32_t>>& why, const std::string& reason) {
  for (auto& e : why)
    if (e.first == reason) {
      e.second++;
      return;
    }
  why.emplace_back(reason, 1);
}

// JS Number.prototype.toFixed(4) for a non-negative finite value below 1e21 (ties round up).
std::string jsToFixed4(double x) {
  char exact[400];
  std::snprintf(exact, sizeof exact, "%.60f", x);
  char buf[400];
  std::snprintf(buf, sizeof buf, "%.4f", x);
  // printf rounds an exact tie to even; JS picks the larger. Detect an exact tie and redo it.
  const char* dot = std::strchr(exact, '.');
  if (dot && x >= 0) {
    const char* tail = dot + 5;  // the fifth decimal
    if (*tail == '5') {
      bool zeros = true;
      for (const char* p = tail + 1; *p; ++p)
        if (*p != '0') {
          zeros = false;
          break;
        }
      if (zeros) {
        // Exact tie: truncate to four decimals and add one unit in the fourth place.
        std::string digits(static_cast<const char*>(exact), tail);  // "<int>.<4 decimals>"
        int i = static_cast<int>(digits.size()) - 1;
        while (i >= 0) {
          if (digits[i] == '.') {
            --i;
            continue;
          }
          if (digits[i] == '9') {
            digits[i] = '0';
            --i;
          } else {
            digits[i]++;
            break;
          }
        }
        if (i < 0) digits.insert(digits.begin(), '1');
        return digits;
      }
    }
  }
  return buf;
}

// Ring of positions, with its zero-width spikes peeled (TS `withoutSpikes`).
const std::vector<P3>& withoutSpikes(const std::vector<P3>& ring, std::vector<P3>& storage) {
  const std::vector<int32_t> kept = spikeFreeCorners(ring);
  if (kept.size() == ring.size()) return ring;
  storage.clear();
  storage.reserve(kept.size());
  for (int32_t i : kept) storage.push_back(ring[i]);
  return storage;
}

std::optional<P3> unit(const P3& v) {
  const double l = jsHypot3(v[0], v[1], v[2]);
  if (l == 0) return std::nullopt;
  return P3{v[0] / l, v[1] / l, v[2] / l};
}
inline P3 minus(const P3& a, const P3& b) { return {a[0] - b[0], a[1] - b[1], a[2] - b[2]}; }
inline P3 outerProduct3(const P3& a, const P3& b) {
  return {a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]};
}
inline double innerProduct3(const P3& a, const P3& b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

// Carry a reference direction from one tangent to the next by the smallest rotation.
P3 carry(const P3& from, const P3& to, const P3& reference) {
  const P3 axis = outerProduct3(from, to);
  const double s = jsHypot3(axis[0], axis[1], axis[2]);
  if (s == 0) return reference;
  const P3 k = *unit(axis);
  const double c = innerProduct3(from, to);
  const P3 kv = outerProduct3(k, reference);
  const double along = innerProduct3(k, reference) * (1 - c);
  return {reference[0] * c + kv[0] * s + k[0] * along,
          reference[1] * c + kv[1] * s + k[1] * along,
          reference[2] * c + kv[2] * s + k[2] * along};
}

struct SweptFrames {
  std::vector<P3> path;
  bool closed = false;
  int32_t stations = 0;
  int32_t legs = 0;
  std::vector<P3> heading;
  std::vector<P3> reference;
};

// Reduce a directrix to stations and carry a frame along it.
std::variant<SweptFrames, Decline> sweptFrames(const std::vector<P3>& directrix,
                                               double smallestStep, const std::string& what) {
  SweptFrames f;
  std::vector<P3>& path = f.path;
  for (const P3& p : directrix) {
    if (!path.empty()) {
      const P3& last = path.back();
      if (last[0] == p[0] && last[1] == p[1] && last[2] == p[2]) continue;
      if (path.size() > 1) {
        const double step = jsHypot3(p[0] - last[0], p[1] - last[1], p[2] - last[2]);
        if (step < smallestStep) {
          path.back() = p;
          continue;
        }
      }
    }
    path.push_back(p);
  }
  if (path.size() > 2) {
    const P3& a = path[0];
    const P3& z = path.back();
    if (a[0] == z[0] && a[1] == z[1] && a[2] == z[2]) {
      path.pop_back();
      f.closed = true;
    }
  }
  if (path.size() < 2) return Decline{what + ": directrix has no length"};

  f.stations = static_cast<int32_t>(path.size());
  f.legs = f.closed ? f.stations : f.stations - 1;
  for (int32_t i = 0; i < f.legs; i++) {
    const auto d = unit(minus(path[(i + 1) % f.stations], path[i]));
    if (!d) return Decline{what + ": directrix leg has no direction"};
    f.heading.push_back(*d);
  }

  const P3 first = f.heading[0];
  const P3 seed = std::fabs(first[0]) < 0.9 ? P3{1, 0, 0} : P3{0, 1, 0};
  const auto projected = unit(minus(seed, {first[0] * innerProduct3(seed, first),
                                           first[1] * innerProduct3(seed, first),
                                           first[2] * innerProduct3(seed, first)}));
  if (!projected) return Decline{what + ": no perpendicular to the first leg"};
  f.reference.push_back(*projected);
  for (int32_t i = 1; i < f.legs; i++) {
    const P3 carried = carry(f.heading[i - 1], f.heading[i], f.reference[i - 1]);
    const P3& d = f.heading[i];
    const double off = innerProduct3(carried, d);
    const auto fixed =
        unit({carried[0] - off * d[0], carried[1] - off * d[1], carried[2] - off * d[2]});
    if (!fixed) return Decline{what + ": reference direction collapsed along the run"};
    f.reference.push_back(*fixed);
  }
  return f;
}

// Collapse consecutive repeats of a quad and drop a closing repeat (cone tip / axis corner).
inline void collapseFacet(std::initializer_list<int32_t> quad, Ring& facet) {
  facet.clear();
  for (int32_t v : quad)
    if (facet.empty() || facet.back() != v) facet.push_back(v);
  while (facet.size() > 1 && facet[0] == facet.back()) facet.pop_back();
}

// ── toTriangles helpers ─────────────────────────────────────────────────────────────────────────

// Put back the ring corners a facet's triangulation left out, as zero-area slivers.
void stitchDroppedCorners(const Ring& ring, Ring& pieces) {
  Ring used = pieces;
  std::sort(used.begin(), used.end());
  auto inUsed = [&](int32_t v) { return std::binary_search(used.begin(), used.end(), v); };
  bool anyMissing = false;
  for (int32_t v : ring)
    if (!inUsed(v)) {
      anyMissing = true;
      break;
    }
  if (!anyMissing) return;
  const size_t n = ring.size();
  for (size_t i = 0; i < n; i++) {
    const int32_t v = ring[i];
    if (inUsed(v)) continue;
    const int32_t before = ring[(i + n - 1) % n];
    const int32_t after = ring[(i + 1) % n];
    if (before == v || after == v || before == after) continue;
    pieces.push_back(before);
    pieces.push_back(v);
    pieces.push_back(after);
  }
}

struct BornCorner {
  int32_t v;
  double t;
};
using BornOnEdge = std::unordered_map<int64_t, std::vector<BornCorner>>;

// Split this facet's triangles at any corner a neighbour minted on an edge they share.
void splitAtMintedCorners(const Ring& ring, Ring& pieces, const BornOnEdge& bornOnEdge) {
  if (bornOnEdge.empty()) return;
  Ring have = pieces;
  std::sort(have.begin(), have.end());

  int32_t budget = 480;
  std::vector<BornCorner> along;
  for (size_t i = 0; i < ring.size() && budget > 0; i++) {
    const int32_t a = ring[i], b = ring[(i + 1) % ring.size()];
    const bool flip = b < a;
    const auto found = bornOnEdge.find(flip ? pairKey(b, a) : pairKey(a, b));
    if (found == bornOnEdge.end()) continue;

    along.clear();
    for (const BornCorner& c : found->second) {
      if (std::binary_search(have.begin(), have.end(), c.v)) continue;
      along.push_back({c.v, flip ? 1 - c.t : c.t});
    }
    std::stable_sort(along.begin(), along.end(),
                     [](const BornCorner& p, const BornCorner& q) { return p.t - q.t < 0; });
    int32_t from = a;
    for (const BornCorner& c : along) {
      const int32_t v = c.v;
      if (budget <= 0) break;
      for (size_t t = 0; t + 2 < pieces.size(); t += 3) {
        const int32_t tri[3] = {pieces[t], pieces[t + 1], pieces[t + 2]};
        if (tri[0] == v || tri[1] == v || tri[2] == v) break;
        int edge = -1;
        for (int e = 0; e < 3; e++) {
          const int32_t p = tri[e], q = tri[(e + 1) % 3];
          if ((p == from && q == b) || (p == b && q == from)) {
            edge = e;
            break;
          }
        }
        if (edge < 0) continue;
        const int32_t p = tri[edge], q = tri[(edge + 1) % 3], r = tri[(edge + 2) % 3];
        pieces[t] = p;
        pieces[t + 1] = v;
        pieces[t + 2] = r;
        pieces.push_back(v);
        pieces.push_back(q);
        pieces.push_back(r);
        budget--;
        break;
      }
      from = v;
    }
  }
}

struct Capped {
  int32_t count = 0;
  double area = 0;
};

// Cap the holes an unpaired edge loop leaves in a tessellation; returns how much area that took.
Capped capOpenLoops(const Graph& graph, Ring& tris) {
  OrderedCount used;
  for (size_t t = 0; t + 2 < tris.size(); t += 3) {
    used.add(pairKey(tris[t], tris[t + 1]));
    used.add(pairKey(tris[t + 1], tris[t + 2]));
    used.add(pairKey(tris[t + 2], tris[t]));
  }

  // forwardLinks, insertion ordered.
  std::vector<int32_t> linkFrom;
  std::vector<std::vector<int32_t>> linkTo;
  std::unordered_map<int32_t, int32_t> linkIndex;
  for (size_t u = 0; u < used.keys.size(); u++) {
    const int64_t key = used.keys[u];
    const int32_t n = used.counts[u];
    const int32_t a = keyFirst(key), b = keySecond(key);
    const int32_t back = used.get(pairKey(b, a));
    if (n <= back) continue;
    if (n + back != 1) continue;
    auto [it, inserted] = linkIndex.try_emplace(a, static_cast<int32_t>(linkFrom.size()));
    if (inserted) {
      linkFrom.push_back(a);
      linkTo.push_back({b});
    } else {
      linkTo[it->second].push_back(b);
    }
  }
  Capped out;
  if (linkFrom.empty()) return out;

  std::unordered_map<int32_t, char> spent;
  Ring loop;
  for (int32_t start : linkFrom) {
    if (spent.count(start)) continue;
    loop.clear();
    int32_t at = start;
    for (int step = 0; step < 64; step++) {
      const auto nx = linkIndex.find(at);
      if (nx == linkIndex.end() || linkTo[nx->second].size() != 1 || spent.count(at)) {
        loop.clear();
        break;
      }
      loop.push_back(at);
      at = linkTo[nx->second][0];
      if (at == start) break;
    }
    if (loop.size() < 3 || at != start) continue;
    for (int32_t v : loop) spent[v] = 1;
    for (size_t i = 1; i + 1 < loop.size(); i++) {
      tris.push_back(loop[0]);
      tris.push_back(loop[i + 1]);
      tris.push_back(loop[i]);
      const int32_t a = loop[0], b = loop[i], c = loop[i + 1];
      const double ux = graph.pointXOf(b) - graph.pointXOf(a),
                   uy = graph.pointYOf(b) - graph.pointYOf(a),
                   uz = graph.pointZOf(b) - graph.pointZOf(a);
      const double wx = graph.pointXOf(c) - graph.pointXOf(a),
                   wy = graph.pointYOf(c) - graph.pointYOf(a),
                   wz = graph.pointZOf(c) - graph.pointZOf(a);
      out.area += jsHypot3(uy * wz - uz * wy, uz * wx - ux * wz, ux * wy - uy * wx) / 2;
      out.count++;
    }
  }
  return out;
}

bool rejoinCoplanar = true;
bool cancelOppositeSlivers = true;
bool cullSubWeldLumps = true;

// Rejoin facets that lie in one plane and share exactly one edge, in place.
int32_t joinCoplanarFacets(const Graph& graph, std::vector<Ring>& rings) {
  if (!rejoinCoplanar) return 0;
  const double fd = fuseDistance();
  const double tol = fd != 0 ? fd : WELD_METRES;
  auto panelHeading = [&](const Ring& r) -> P3 {
    double nx = 0, ny = 0, nz = 0;
    const size_t n = r.size();
    for (size_t i = 0; i < n; i++) {
      const int32_t a = r[i], b = r[(i + 1) % n];
      nx += (graph.pointYOf(a) - graph.pointYOf(b)) * (graph.pointZOf(a) + graph.pointZOf(b));
      ny += (graph.pointZOf(a) - graph.pointZOf(b)) * (graph.pointXOf(a) + graph.pointXOf(b));
      nz += (graph.pointXOf(a) - graph.pointXOf(b)) * (graph.pointYOf(a) + graph.pointYOf(b));
    }
    return {nx / 2, ny / 2, nz / 2};
  };

  std::unordered_map<int64_t, int32_t> owner;
  owner.reserve(rings.size() * 4);
  for (size_t i = 0; i < rings.size(); i++) {
    const Ring& r = rings[i];
    if (r.size() < 3) continue;
    for (size_t k = 0; k < r.size(); k++)
      owner[pairKey(r[k], r[(k + 1) % r.size()])] = static_cast<int32_t>(i);
  }
  std::vector<std::optional<P3>> normal(rings.size());
  for (size_t i = 0; i < rings.size(); i++)
    if (rings[i].size() >= 3) normal[i] = panelHeading(rings[i]);

  int32_t joined = 0;
  Ring queue;
  for (size_t i = 0; i < rings.size(); i++)
    if (rings[i].size() >= 3) queue.push_back(static_cast<int32_t>(i));
  const int64_t budget = static_cast<int64_t>(rings.size()) * 4 + 16;
  int64_t spent = 0;
  WorkBudget work{60000, 20000};
  const size_t CORNER_CEILING = 256;
  std::vector<int64_t> enterB;
  Ring out;

  while (!queue.empty() && spent++ < budget) {
    const int32_t i = queue.back();
    queue.pop_back();
    const Ring& A = rings[i];
    if (A.size() < 3) continue;
    if (!normal[i]) continue;
    const P3 na = *normal[i];
    const double la = jsHypot3(na[0], na[1], na[2]);
    if (la == 0) continue;

    for (size_t k = 0; k < A.size(); k++) {
      const int32_t a = A[k], b = A[(k + 1) % A.size()];
      const auto found = owner.find(pairKey(b, a));
      if (found == owner.end()) continue;
      const int32_t j = found->second;
      if (j == i) continue;
      const Ring& B = rings[j];
      if (B.size() < 3) continue;
      if (!normal[j]) continue;
      const P3 nb = *normal[j];
      const double lb = jsHypot3(nb[0], nb[1], nb[2]);
      if (lb == 0) continue;
      const double cx = na[1] * nb[2] - na[2] * nb[1], cy = na[2] * nb[0] - na[0] * nb[2],
                   cz = na[0] * nb[1] - na[1] * nb[0];
      if (jsHypot3(cx, cy, cz) / (la * lb) > 1e-6) continue;
      bool apart = false;
      for (int32_t v : B) {
        const double d = (na[0] * (graph.pointXOf(v) - graph.pointXOf(a)) +
                          na[1] * (graph.pointYOf(v) - graph.pointYOf(a)) +
                          na[2] * (graph.pointZOf(v) - graph.pointZOf(a))) /
                         la;
        if (std::fabs(d) > tol) {
          apart = true;
          break;
        }
      }
      if (apart) continue;
      enterB.clear();
      for (size_t m = 0; m < B.size(); m++) enterB.push_back(pairKey(B[m], B[(m + 1) % B.size()]));
      std::sort(enterB.begin(), enterB.end());
      int32_t shared = 0;
      for (size_t m = 0; m < A.size(); m++)
        if (std::binary_search(enterB.begin(), enterB.end(), pairKey(A[(m + 1) % A.size()], A[m])))
          shared++;
      if (shared != 1) continue;
      int64_t bj = -1;
      for (size_t m = 0; m < B.size(); m++)
        if (B[m] == b && B[(m + 1) % B.size()] == a) {
          bj = static_cast<int64_t>(m);
          break;
        }
      if (bj < 0) continue;

      out.clear();
      for (size_t m = 1; m <= A.size(); m++) out.push_back(A[(k + m) % A.size()]);
      for (size_t m = 2; m < B.size(); m++) out.push_back(B[(bj + m) % B.size()]);
      if (out.size() < 3 || hasRepeat(out)) continue;
      if (out.size() > CORNER_CEILING) continue;
      if (work.clip <= 0) break;
      if (triangleRing(projectRing(out, graph), nullptr, &work).empty()) continue;

      for (size_t m = 0; m < A.size(); m++) owner.erase(pairKey(A[m], A[(m + 1) % A.size()]));
      for (size_t m = 0; m < B.size(); m++) owner.erase(pairKey(B[m], B[(m + 1) % B.size()]));
      rings[i] = out;
      rings[j].clear();
      normal[i] = panelHeading(rings[i]);
      normal[j] = std::nullopt;
      const Ring& merged = rings[i];
      for (size_t m = 0; m < merged.size(); m++)
        owner[pairKey(merged[m], merged[(m + 1) % merged.size()])] = i;
      joined++;
      queue.push_back(i);
      break;
    }
  }
  return joined;
}

// Key of a position as TS `p.join(",")` sees it: -0 is 0, every NaN is one NaN.
struct PosKey {
  uint64_t x, y, z;
  bool operator==(const PosKey& o) const { return x == o.x && y == o.y && z == o.z; }
};
struct PosKeyHash {
  size_t operator()(const PosKey& k) const {
    uint64_t h = k.x * 0x9E3779B97F4A7C15ULL;
    h ^= k.y + 0x7F4A7C159E3779B9ULL + (h << 6) + (h >> 2);
    h ^= k.z + 0x94D049BB133111EBULL + (h << 6) + (h >> 2);
    return static_cast<size_t>(h);
  }
};
inline uint64_t numberKey(double v) {
  if (v == 0) v = 0;
  if (std::isnan(v)) v = std::numeric_limits<double>::quiet_NaN();
  uint64_t b;
  std::memcpy(&b, &v, 8);
  return b;
}
inline PosKey posKey(const P3& p) { return {numberKey(p[0]), numberKey(p[1]), numberKey(p[2])}; }

}  // namespace

void setRejoinCoplanar(bool on) { rejoinCoplanar = on; }
void setCancelOppositeSlivers(bool on) { cancelOppositeSlivers = on; }
void setCullSubWeldLumps(bool on) { cullSubWeldLumps = on; }

// ── spikes ──────────────────────────────────────────────────────────────────────────────────────

std::vector<int32_t> spikeFreeCorners(const std::vector<P3>& ring) {
  const double tol = fuseDistance();
  auto same = [&](int32_t a, int32_t b) {
    return std::fabs(ring[a][0] - ring[b][0]) <= tol && std::fabs(ring[a][1] - ring[b][1]) <= tol &&
           std::fabs(ring[a][2] - ring[b][2]) <= tol;
  };
  std::vector<int32_t> kept;
  kept.reserve(ring.size());
  for (int32_t i = 0; i < static_cast<int32_t>(ring.size()); i++) {
    if (!kept.empty() && same(kept.back(), i)) continue;
    kept.push_back(i);
  }
  while (kept.size() > 1 && same(kept[0], kept.back())) kept.pop_back();
  bool changed = true;
  std::vector<int32_t> next;
  while (changed && kept.size() > 3) {
    changed = false;
    const size_t n = kept.size();
    for (size_t i = 0; i < n; i++) {
      const int32_t before = kept[(i + n - 1) % n], after = kept[(i + 1) % n];
      if (!same(before, after)) continue;
      const size_t d1 = i, d2 = (i + 1) % n;
      next.clear();
      for (size_t k = 0; k < n; k++)
        if (k != d1 && k != d2) next.push_back(kept[k]);
      if (next.size() < 3) break;
      kept.swap(next);
      changed = true;
      break;
    }
  }
  return kept;
}

// ── prism ───────────────────────────────────────────────────────────────────────────────────────

std::unique_ptr<LinkedShellGraph> pushProfile(const std::vector<P3>& profileIn, const P3& sweep,
                                              BuildReport* report) {
  auto refuse = [&](const char* reason) -> GraphPtr {
    if (report) report->reason = reason;
    return nullptr;
  };
  std::vector<P3> peeled;
  const std::vector<P3>& profile = withoutSpikes(profileIn, peeled);
  if (profile.size() < 3) return refuse("profile has fewer than three corners");
  const double sx = sweep[0], sy = sweep[1], sz = sweep[2];
  if (sx == 0 && sy == 0 && sz == 0) return refuse("the sweep has no length");

  auto graph = std::make_unique<Graph>();
  Graph& g = *graph;

  Ring bottom, top;
  bottom.reserve(profile.size());
  top.reserve(profile.size());
  for (const P3& p : profile) {
    const int32_t at = g.placeCorner(p[0], p[1], p[2]);
    if (!bottom.empty() && bottom.back() == at) continue;
    bottom.push_back(at);
    top.push_back(g.placeCorner(p[0] + sx, p[1] + sy, p[2] + sz));
  }
  while (bottom.size() > 1 && bottom[0] == bottom.back()) {
    bottom.pop_back();
    top.pop_back();
  }
  if (bottom.size() < 3) return refuse("fewer than three DISTINCT corners");

  if (hasRepeat(bottom)) return refuse("the profile ring touches itself");
  if (hasRepeat(top)) return refuse("the swept ring touches itself");

  const P3 normal = ringNormal(
      static_cast<int32_t>(bottom.size()), [&](int32_t i) { return g.pointXOf(bottom[i]); },
      [&](int32_t i) { return g.pointYOf(bottom[i]); },
      [&](int32_t i) { return g.pointZOf(bottom[i]); });
  const double facing = normal[0] * sx + normal[1] * sy + normal[2] * sz;
  if (facing == 0) return refuse("the profile encloses no area, or lies along its own sweep");
  const int sense = facing > 0 ? -1 : 1;

  Ring distantRing = top;
  if (!(sense < 0)) std::reverse(distantRing.begin(), distantRing.end());
  Ring sealRing = bottom;
  if (sense < 0) std::reverse(sealRing.begin(), sealRing.end());

  if (g.appendPanel(distantRing) < 0) return refuse("the far cap was refused by the topology");
  if (g.appendPanel(sealRing) < 0) return refuse("the near cap was refused by the topology");

  const size_t n = bottom.size();
  for (size_t i = 0; i < n; i++) {
    const size_t j = (i + 1) % n;
    const int32_t r = sense < 0 ? g.appendPanel({bottom[i], bottom[j], top[j], top[i]})
                                : g.appendPanel({bottom[j], bottom[i], top[i], top[j]});
    if (r < 0) return refuse("a side wall was refused by the topology");
  }

  g.seal();
  return graph;
}

// ── prism with voids ────────────────────────────────────────────────────────────────────────────

std::unique_ptr<LinkedShellGraph> pushProfileWithVoids(const std::vector<P3>& profile,
                                                       const std::vector<std::vector<P3>>& voids,
                                                       const P3& sweep, BuildReport* report) {
  auto refuse = [&](const char* reason) -> GraphPtr {
    if (report) report->reason = reason;
    return nullptr;
  };
  const double sx = sweep[0], sy = sweep[1], sz = sweep[2];
  if (sx == 0 && sy == 0 && sz == 0) return refuse("the sweep has no length");

  auto graph = std::make_unique<Graph>();
  Graph& g = *graph;
  auto cornersOf = [&](const std::vector<P3>& ring) {
    Ring out;
    out.reserve(ring.size());
    for (const P3& p : ring) {
      const int32_t at = g.placeCorner(p[0], p[1], p[2]);
      if (!out.empty() && out.back() == at) continue;
      out.push_back(at);
    }
    while (out.size() > 1 && out[0] == out.back()) out.pop_back();
    return out;
  };
  std::vector<Ring> rings;
  rings.reserve(voids.size() + 1);
  {
    std::vector<P3> storage;
    rings.push_back(cornersOf(withoutSpikes(profile, storage)));
    for (const auto& v : voids) rings.push_back(cornersOf(withoutSpikes(v, storage)));
  }
  for (const Ring& r : rings)
    if (r.size() < 3) return refuse("a ring has fewer than three distinct corners");
  Ring seen;  // insertion order
  {
    std::vector<char> isSeen(static_cast<size_t>(g.cornerTally()), 0);
    for (const Ring& r : rings) {
      for (int32_t c : r) {
        if (isSeen[c]) return refuse("a void touches the outline or another void");
        isSeen[c] = 1;
        seen.push_back(c);
      }
    }
  }
  auto facingOf = [&](const Ring& r) {
    const P3 n = ringNormal(
        static_cast<int32_t>(r.size()), [&](int32_t i) { return g.pointXOf(r[i]); },
        [&](int32_t i) { return g.pointYOf(r[i]); }, [&](int32_t i) { return g.pointZOf(r[i]); });
    return n[0] * sx + n[1] * sy + n[2] * sz;
  };
  for (const Ring& r : rings)
    if (facingOf(r) == 0) return refuse("a ring encloses no area, or lies along its own sweep");

  auto pointOf = [&](int32_t c) -> P3 { return g.pointFrom(c); };
  const Ring& outline = rings[0];
  const P3 outlineNormal = ringNormal(
      static_cast<int32_t>(outline.size()), [&](int32_t i) { return g.pointXOf(outline[i]); },
      [&](int32_t i) { return g.pointYOf(outline[i]); },
      [&](int32_t i) { return g.pointZOf(outline[i]); });
  const double ax = std::fabs(outlineNormal[0]), ay = std::fabs(outlineNormal[1]),
               az = std::fabs(outlineNormal[2]);
  const int drop = ax >= ay && ax >= az ? 0 : ay >= az ? 1 : 2;
  const int u = drop == 0 ? 1 : 0, v = drop == 2 ? 1 : 2;
  using F2 = std::array<double, 2>;
  std::vector<std::vector<F2>> flat(rings.size());
  for (size_t k = 0; k < rings.size(); k++) {
    flat[k].reserve(rings[k].size());
    for (int32_t c : rings[k]) {
      const P3 p = pointOf(c);
      flat[k].push_back({p[u], p[v]});
    }
  }
  struct FlatEdge {
    int32_t ring;
    F2 a, b;
  };
  std::vector<FlatEdge> edges;
  for (size_t ring = 0; ring < flat.size(); ring++) {
    const auto& r = flat[ring];
    for (size_t i = 0; i < r.size(); i++)
      edges.push_back({static_cast<int32_t>(ring), r[i], r[(i + 1) % r.size()]});
  }
  std::stable_sort(edges.begin(), edges.end(), [](const FlatEdge& p, const FlatEdge& q) {
    return jsMin(p.a[0], p.b[0]) - jsMin(q.a[0], q.b[0]) < 0;
  });
  auto meets = [](const F2& a, const F2& b, const F2& c, const F2& d) {
    const int s1 = lineSide(a[0], a[1], b[0], b[1], c[0], c[1]),
              s2 = lineSide(a[0], a[1], b[0], b[1], d[0], d[1]),
              s3 = lineSide(c[0], c[1], d[0], d[1], a[0], a[1]),
              s4 = lineSide(c[0], c[1], d[0], d[1], b[0], b[1]);
    if (s1 * s2 > 0 || s3 * s4 > 0) return false;
    if (s1 != 0 || s2 != 0 || s3 != 0 || s4 != 0) return true;
    const int k = std::fabs(b[0] - a[0]) >= std::fabs(b[1] - a[1]) ? 0 : 1;
    return jsMax(jsMin(a[k], b[k]), jsMin(c[k], d[k])) <=
           jsMin(jsMax(a[k], b[k]), jsMax(c[k], d[k]));
  };
  for (size_t i = 0; i < edges.size(); i++) {
    const FlatEdge& e = edges[i];
    const double reach = jsMax(e.a[0], e.b[0]);
    for (size_t j = i + 1; j < edges.size(); j++) {
      const FlatEdge& f = edges[j];
      if (jsMin(f.a[0], f.b[0]) > reach) break;
      if (f.ring != e.ring && meets(e.a, e.b, f.a, f.b))
        return refuse("a void touches the outline or another void");
    }
  }
  auto inside = [](const std::vector<F2>& ring, const F2& p) {
    bool odd = false;
    for (size_t i = 0, j = ring.size() - 1; i < ring.size(); j = i++) {
      const F2& a = ring[i];
      const F2& b = ring[j];
      if ((a[1] > p[1]) != (b[1] > p[1])) {
        const double at = a[0] + ((p[1] - a[1]) / (b[1] - a[1])) * (b[0] - a[0]);
        if (p[0] < at) odd = !odd;
      }
    }
    return odd;
  };
  for (size_t k = 1; k < flat.size(); k++) {
    if (!inside(flat[0], flat[k][0])) return refuse("a void lies outside the outline");
    for (size_t m = 1; m < flat.size(); m++)
      if (m != k && inside(flat[m], flat[k][0])) return refuse("a void lies inside another void");
  }
  // The far end of every corner, placed now so both caps and the walls share them.
  std::vector<int32_t> far(static_cast<size_t>(g.cornerTally()), -1);
  Ring farValues;
  for (const Ring& r : rings) {
    for (int32_t c : r) {
      const P3 p = pointOf(c);
      far[c] = g.placeCorner(p[0] + sx, p[1] + sy, p[2] + sz);
      farValues.push_back(far[c]);
    }
  }
  if (hasRepeat(farValues)) return refuse("two corners meet at the far end");

  std::vector<P3> outerPts;
  outerPts.reserve(rings[0].size());
  for (int32_t c : rings[0]) outerPts.push_back(pointOf(c));
  std::vector<std::vector<P3>> voidPts;
  voidPts.reserve(rings.size() - 1);
  for (size_t k = 1; k < rings.size(); k++) {
    std::vector<P3> pts;
    pts.reserve(rings[k].size());
    for (int32_t c : rings[k]) pts.push_back(pointOf(c));
    voidPts.push_back(std::move(pts));
  }
  const auto pieces = carvePanelVoids(outerPts, voidPts);
  if (!pieces) return refuse("the carver could not bridge the voids");
  std::unordered_map<PosKey, int32_t, PosKeyHash> byPosition;
  byPosition.reserve(seen.size() * 2);
  for (int32_t c : seen) byPosition[posKey(pointOf(c))] = c;

  std::vector<Ring> panels;
  for (const auto& piece : *pieces) {
    Ring ids;
    ids.reserve(piece.size());
    for (const P3& p : piece) {
      const auto found = byPosition.find(posKey(p));
      if (found == byPosition.end())
        return refuse("the carver returned a corner the profile does not have");
      ids.push_back(found->second);
    }
    const bool along = facingOf(ids) > 0;
    Ring topRing;
    topRing.reserve(ids.size());
    for (int32_t c : ids) topRing.push_back(far[c]);
    if (!along) std::reverse(topRing.begin(), topRing.end());
    panels.push_back(std::move(topRing));
    if (along) std::reverse(ids.begin(), ids.end());
    panels.push_back(std::move(ids));
  }
  for (size_t k = 0; k < rings.size(); k++) {
    const Ring& r = rings[k];
    const bool along = (facingOf(r) > 0) != (k > 0);
    const size_t n = r.size();
    for (size_t i = 0; i < n; i++) {
      const int32_t a = r[i], b = r[(i + 1) % n];
      panels.push_back(along ? Ring{a, b, far[b], far[a]} : Ring{b, a, far[a], far[b]});
    }
  }
  for (const Ring& panel : panels)
    if (g.appendPanel(panel) < 0) return refuse("a panel was refused by the topology");
  g.seal();
  if (!g.isWatertight()) return refuse("the carved prism does not close");
  return graph;
}

// ── loft ────────────────────────────────────────────────────────────────────────────────────────

std::unique_ptr<LinkedShellGraph> loftProfiles(const std::vector<P3>& startIn,
                                               const std::vector<P3>& endIn,
                                               BuildReport* report) {
  auto refuse = [&](const char* reason) -> GraphPtr {
    if (report) report->reason = reason;
    return nullptr;
  };
  if (startIn.size() < 3) return refuse("a lofted profile has fewer than three corners");
  if (startIn.size() != endIn.size())
    return refuse("the two lofted profiles have different corner counts");
  const std::vector<P3>* startP = &startIn;
  const std::vector<P3>* endP = &endIn;
  std::vector<P3> startPeeled, endPeeled;
  {
    const auto a = spikeFreeCorners(startIn), b = spikeFreeCorners(endIn);
    if (a.size() != startIn.size() && a == b) {
      for (int32_t i : a) {
        startPeeled.push_back(startIn[i]);
        endPeeled.push_back(endIn[i]);
      }
      startP = &startPeeled;
      endP = &endPeeled;
    }
  }
  const std::vector<P3>& start = *startP;
  const std::vector<P3>& end = *endP;

  auto graph = std::make_unique<Graph>();
  Graph& g = *graph;
  Ring bottom, top;
  for (size_t i = 0; i < start.size(); i++) {
    const int32_t a = g.placeCorner(start[i][0], start[i][1], start[i][2]);
    if (!bottom.empty() && bottom.back() == a) continue;
    bottom.push_back(a);
    top.push_back(g.placeCorner(end[i][0], end[i][1], end[i][2]));
  }
  while (bottom.size() > 1 && bottom[0] == bottom.back()) {
    bottom.pop_back();
    top.pop_back();
  }
  if (bottom.size() < 3) return refuse("a lofted profile has fewer than three DISTINCT corners");
  if (hasRepeat(bottom)) return refuse("a lofted profile ring touches itself");

  double bx = 0, by = 0, bz = 0, tx = 0, ty = 0, tz = 0;
  for (int32_t v : bottom) {
    bx += g.pointXOf(v);
    by += g.pointYOf(v);
    bz += g.pointZOf(v);
  }
  for (int32_t v : top) {
    tx += g.pointXOf(v);
    ty += g.pointYOf(v);
    tz += g.pointZOf(v);
  }
  const size_t n = bottom.size();
  const double tn = static_cast<double>(top.size()), bn = static_cast<double>(n);
  const double dx = tx / tn - bx / bn, dy = ty / tn - by / bn, dz = tz / tn - bz / bn;

  const P3 normal = ringNormal(
      static_cast<int32_t>(n), [&](int32_t i) { return g.pointXOf(bottom[i]); },
      [&](int32_t i) { return g.pointYOf(bottom[i]); },
      [&](int32_t i) { return g.pointZOf(bottom[i]); });
  const double facing = normal[0] * dx + normal[1] * dy + normal[2] * dz;
  if (facing == 0) return refuse("the two lofted rings are coincident, or bound nothing");
  const int sense = facing > 0 ? -1 : 1;

  Ring far;
  for (int32_t v : top)
    if (std::find(far.begin(), far.end(), v) == far.end()) far.push_back(v);
  if (far.size() >= 3) {
    if (!(sense < 0)) std::reverse(far.begin(), far.end());
    if (g.appendPanel(far) < 0) return refuse("the loft's far cap was refused by the topology");
  }
  {
    Ring near = bottom;
    if (sense < 0) std::reverse(near.begin(), near.end());
    if (g.appendPanel(near) < 0) return refuse("the loft's near cap was refused by the topology");
  }

  Ring facet;
  for (size_t i = 0; i < n; i++) {
    const size_t j = (i + 1) % n;
    if (sense < 0)
      collapseFacet({bottom[i], bottom[j], top[j], top[i]}, facet);
    else
      collapseFacet({bottom[j], bottom[i], top[i], top[j]}, facet);
    if (facet.size() < 3) continue;
    if (g.appendPanel(facet) < 0) return refuse("a loft side wall was refused by the topology");
  }

  g.seal();
  return graph;
}

// ── revolve ─────────────────────────────────────────────────────────────────────────────────────

namespace {
constexpr double ONE_REVOLUTION = 3.141592653589793 * 2;
}

std::unique_ptr<LinkedShellGraph> revolveProfile(const std::vector<P3>& profileIn,
                                                 const P3& spindleOrigin, const P3& spindleDir,
                                                 double angle, double steps,
                                                 BuildReport* report) {
  auto refuse = [&](const char* reason) -> GraphPtr {
    if (report) report->reason = reason;
    return nullptr;
  };
  std::vector<P3> peeled;
  const std::vector<P3>& profile = withoutSpikes(profileIn, peeled);
  if (profile.size() < 3) return refuse("a revolved profile has fewer than three corners");
  if (!std::isfinite(angle) || angle == 0) return refuse("the revolve turns through no angle");
  if (!(steps >= 1)) return refuse("the revolve has no steps");

  const double spindleLength = jsHypot3(spindleDir[0], spindleDir[1], spindleDir[2]);
  if (spindleLength == 0) return refuse("the revolve axis has no direction");
  const double kx = spindleDir[0] / spindleLength, ky = spindleDir[1] / spindleLength,
               kz = spindleDir[2] / spindleLength;

  const double swing = jsMin(std::fabs(angle), ONE_REVOLUTION);
  const bool whole = swing >= ONE_REVOLUTION * (1 - 1e-9);
  const double turn = whole ? ONE_REVOLUTION * jsSign(angle) : angle;

  auto graph = std::make_unique<Graph>();
  Graph& g = *graph;

  auto ringIndexed = [&](double t) -> Ring {
    const double c = jsCos(t), s = jsSin(t), oneLess = 1 - c;
    Ring out;
    out.reserve(profile.size());
    for (const P3& p : profile) {
      const double vx = p[0] - spindleOrigin[0], vy = p[1] - spindleOrigin[1],
                   vz = p[2] - spindleOrigin[2];
      const double along = kx * vx + ky * vy + kz * vz;
      const double cx = ky * vz - kz * vy, cy = kz * vx - kx * vz, cz = kx * vy - ky * vx;
      const bool alongSpindle = cx == 0 && cy == 0 && cz == 0;
      const int32_t at =
          alongSpindle ? g.placeCorner(p[0], p[1], p[2])
                       : g.placeCorner(spindleOrigin[0] + vx * c + cx * s + kx * along * oneLess,
                                       spindleOrigin[1] + vy * c + cy * s + ky * along * oneLess,
                                       spindleOrigin[2] + vz * c + cz * s + kz * along * oneLess);
      if (!out.empty() && out.back() == at) continue;
      out.push_back(at);
    }
    while (out.size() > 1 && out[0] == out.back()) out.pop_back();
    return out;
  };

  const Ring start = ringIndexed(0);
  if (start.size() < 3) return refuse("a revolved profile has fewer than three DISTINCT corners");
  if (hasRepeat(start)) return refuse("the revolved profile ring touches itself");

  std::vector<Ring> rings;
  rings.push_back(start);
  for (double i = 1; i < steps; i++) rings.push_back(ringIndexed((turn * i) / steps));
  rings.push_back(whole ? start : ringIndexed(turn));
  for (const Ring& ring : rings)
    if (ring.size() != start.size()) return refuse("a revolved station lost corners to the axis");

  double gx = 0, gy = 0, gz = 0;
  for (int32_t v : start) {
    gx += g.pointXOf(v);
    gy += g.pointYOf(v);
    gz += g.pointZOf(v);
  }
  const double sn = static_cast<double>(start.size());
  gx /= sn;
  gy /= sn;
  gz /= sn;
  const double rx = gx - spindleOrigin[0], ry = gy - spindleOrigin[1], rz = gz - spindleOrigin[2];
  const double dir = jsSign(turn);
  const double tx = (ky * rz - kz * ry) * dir, ty = (kz * rx - kx * rz) * dir,
               tz = (kx * ry - ky * rx) * dir;
  if (tx == 0 && ty == 0 && tz == 0) return refuse("the profile is centred on its own revolve axis");

  const P3 normal = ringNormal(
      static_cast<int32_t>(start.size()), [&](int32_t i) { return g.pointXOf(start[i]); },
      [&](int32_t i) { return g.pointYOf(start[i]); },
      [&](int32_t i) { return g.pointZOf(start[i]); });
  const double facing = normal[0] * tx + normal[1] * ty + normal[2] * tz;
  if (facing == 0)
    return refuse("the revolved profile encloses nothing, or lies in the plane it sweeps");
  const int sense = facing > 0 ? -1 : 1;

  if (!whole) {
    Ring last = rings.back();
    if (!(sense < 0)) std::reverse(last.begin(), last.end());
    if (g.appendPanel(last) < 0) return refuse("the revolve far cap was refused by the topology");
    Ring first = start;
    if (sense < 0) std::reverse(first.begin(), first.end());
    if (g.appendPanel(first) < 0) return refuse("the revolve near cap was refused by the topology");
  }

  const size_t n = start.size();
  Ring facet;
  for (double s = 0; s < steps; s++) {
    const Ring& here = rings[static_cast<size_t>(s)];
    const Ring& next = rings[static_cast<size_t>(s) + 1];
    for (size_t i = 0; i < n; i++) {
      const size_t j = (i + 1) % n;
      if (sense < 0)
        collapseFacet({here[i], here[j], next[j], next[i]}, facet);
      else
        collapseFacet({here[j], here[i], next[i], next[j]}, facet);
      if (facet.size() < 3) continue;
      if (g.appendPanel(facet) < 0) return refuse("a revolve wall facet was refused by the topology");
    }
  }

  g.seal();
  return graph;
}

// ── profile sweep ───────────────────────────────────────────────────────────────────────────────

SweepResult profileSweep(const std::vector<P3>& directrix,
                         const std::vector<std::array<double, 2>>& section,
                         const std::optional<SectionOrientation>& orient) {
  if (section.size() < 3) return Decline{"sweep: profile has fewer than three corners"};

  double reach = 0;
  for (const auto& s : section) reach = jsMax(reach, jsHypot2(s[0], s[1]));
  if (!(reach > 0)) return Decline{"sweep: profile has no size"};

  double doubleArea = 0;
  for (size_t i = 0; i < section.size(); i++) {
    const auto& a = section[i];
    const auto& b = section[(i + 1) % section.size()];
    doubleArea += a[0] * b[1] - b[0] * a[1];
  }
  if (doubleArea == 0) return Decline{"sweep: profile encloses no area"};
  std::vector<std::array<double, 2>> wound = section;
  if (!(doubleArea > 0)) std::reverse(wound.begin(), wound.end());

  auto framesOr = sweptFrames(directrix, reach / 8, "sweep");
  if (auto* d = std::get_if<Decline>(&framesOr)) return std::move(*d);
  SweptFrames& frames = std::get<SweptFrames>(framesOr);
  const auto& path = frames.path;
  const bool closed = frames.closed;
  const int32_t stations = frames.stations, legs = frames.legs;
  const auto& heading = frames.heading;

  std::vector<P3> reference = frames.reference;
  if (orient) {
    std::vector<P3> fixed;
    for (int32_t i = 0; i < legs; i++) {
      const P3& t = heading[i];
      const auto normal = orient->kind == SectionOrientation::Kind::normal
                              ? unit(orient->dir)
                              : unit(outerProduct3(t, orient->dir));
      if (!normal) return Decline{"sweep: the reference surface has no normal along this leg"};
      const auto u = unit(outerProduct3(*normal, t));
      if (!u) return Decline{"sweep: the directrix runs along the surface normal"};
      fixed.push_back(*u);
    }
    reference = std::move(fixed);
  }

  auto graph = std::make_unique<Graph>();
  Graph& g = *graph;
  const char* sharp = nullptr;

  auto sectionAt = [&](int32_t station, Ring& ring) -> bool {
    const int32_t inLeg = closed ? (station + legs - 1) % legs : std::max(0, station - 1);
    const int32_t outLeg = closed ? station % legs : std::min(legs - 1, station);
    const P3& din = heading[inLeg];
    const P3& dout = heading[outLeg];
    const P3& u = reference[inLeg];
    const P3 w = outerProduct3(din, u);
    const auto bisector = unit({din[0] + dout[0], din[1] + dout[1], din[2] + dout[2]});
    if (!bisector) {
      sharp = "sweep: directrix reverses on itself";
      return false;
    }
    const double facing = innerProduct3(din, *bisector);
    if (facing < 0.5) {
      sharp = "sweep: directrix bends too sharply to mitre";
      return false;
    }
    const P3& centre = path[station % stations];
    ring.clear();
    for (const auto& s : wound) {
      const double su = s[0], sv = s[1];
      const double px = centre[0] + u[0] * su + w[0] * sv;
      const double py = centre[1] + u[1] * su + w[1] * sv;
      const double pz = centre[2] + u[2] * su + w[2] * sv;
      const double t = -((px - centre[0]) * (*bisector)[0] + (py - centre[1]) * (*bisector)[1] +
                         (pz - centre[2]) * (*bisector)[2]) /
                       facing;
      const int32_t at = g.placeCorner(px + din[0] * t, py + din[1] * t, pz + din[2] * t);
      if (!ring.empty() && ring.back() == at) {
        sharp = "sweep: two section corners meet at one point";
        return false;
      }
      ring.push_back(at);
    }
    if (hasRepeat(ring)) {
      sharp = "sweep: the section folds onto itself at a joint";
      return false;
    }
    return true;
  };

  std::vector<Ring> rings(static_cast<size_t>(stations));
  for (int32_t i = 0; i < stations; i++) {
    if (!sectionAt(i, rings[i]))
      return Decline{sharp ? sharp : "sweep: section could not be placed"};
  }

  const size_t n = wound.size();
  const int32_t spans = closed ? stations : stations - 1;
  for (int32_t s = 0; s < spans; s++) {
    const Ring& here = rings[s];
    const Ring& next = rings[(s + 1) % stations];
    for (size_t i = 0; i < n; i++) {
      const size_t j = (i + 1) % n;
      if (g.appendPanel({here[i], here[j], next[j], next[i]}) < 0)
        return Decline{"sweep: the wall does not close"};
    }
  }

  if (!closed) {
    if (g.appendPanel(rings[stations - 1]) < 0) return Decline{"sweep: far cap refused"};
    Ring near = rings[0];
    std::reverse(near.begin(), near.end());
    if (g.appendPanel(near) < 0) return Decline{"sweep: near cap refused"};
  }

  g.seal();
  return graph;
}

// ── tube ────────────────────────────────────────────────────────────────────────────────────────

SweepResult tubeSweep(const std::vector<P3>& directrix, double radius,
                      std::optional<double> tubeHollowRadius, int32_t facets) {
  if (!(radius > 0)) return Decline{"pipe: no radius"};
  if (!(facets >= 3)) return Decline{"pipe: fewer than three facets"};
  if (tubeHollowRadius && !(*tubeHollowRadius > 0 && *tubeHollowRadius < radius))
    return Decline{"pipe: bore not inside the wall"};

  auto framesOr = sweptFrames(directrix, radius / 8, "pipe");
  if (auto* d = std::get_if<Decline>(&framesOr)) return std::move(*d);
  SweptFrames& frames = std::get<SweptFrames>(framesOr);
  const auto& path = frames.path;
  const bool closed = frames.closed;
  const int32_t stations = frames.stations, legs = frames.legs;
  const auto& heading = frames.heading;
  const auto& reference = frames.reference;

  auto graph = std::make_unique<Graph>();
  Graph& g = *graph;
  const char* sharp = nullptr;

  auto sectionAt = [&](int32_t station, double r, Ring& ring) -> bool {
    const int32_t inLeg = closed ? (station + legs - 1) % legs : std::max(0, station - 1);
    const int32_t outLeg = closed ? station % legs : std::min(legs - 1, station);
    const P3& din = heading[inLeg];
    const P3& dout = heading[outLeg];
    const P3& u = reference[inLeg];
    const P3 w = outerProduct3(din, u);
    const auto bisector = unit({din[0] + dout[0], din[1] + dout[1], din[2] + dout[2]});
    if (!bisector) {
      sharp = "pipe: directrix reverses on itself";
      return false;
    }
    const double facing = innerProduct3(din, *bisector);
    if (facing < 0.5) {
      sharp = "pipe: directrix bends too sharply to mitre";
      return false;
    }
    const P3& centre = path[station % stations];
    ring.clear();
    for (int32_t i = 0; i < facets; i++) {
      const double a = (static_cast<double>(i) / facets) * 3.141592653589793 * 2;
      const double c = jsCos(a) * r, s = jsSin(a) * r;
      const double px = centre[0] + u[0] * c + w[0] * s;
      const double py = centre[1] + u[1] * c + w[1] * s;
      const double pz = centre[2] + u[2] * c + w[2] * s;
      const double t = -((px - centre[0]) * (*bisector)[0] + (py - centre[1]) * (*bisector)[1] +
                         (pz - centre[2]) * (*bisector)[2]) /
                       facing;
      const int32_t at = g.placeCorner(px + din[0] * t, py + din[1] * t, pz + din[2] * t);
      if (!ring.empty() && ring.back() == at) {
        sharp = "pipe: two section corners meet at one point";
        return false;
      }
      ring.push_back(at);
    }
    if (hasRepeat(ring)) {
      sharp = "pipe: the section folds onto itself at a joint";
      return false;
    }
    return true;
  };

  struct Station {
    Ring outer;
    std::optional<Ring> inner;
  };
  std::vector<Station> rings(static_cast<size_t>(stations));
  for (int32_t i = 0; i < stations; i++) {
    if (!sectionAt(i, radius, rings[i].outer))
      return Decline{sharp ? sharp : "pipe: section could not be placed"};
    if (tubeHollowRadius) {
      rings[i].inner.emplace();
      if (!sectionAt(i, *tubeHollowRadius, *rings[i].inner))
        return Decline{sharp ? sharp : "pipe: bore section could not be placed"};
    }
  }

  auto wall = [&](bool inner, bool outward) -> bool {
    const int32_t spans = closed ? stations : stations - 1;
    for (int32_t s = 0; s < spans; s++) {
      const Station& sh = rings[s];
      const Station& sn = rings[(s + 1) % stations];
      const Ring* here = inner ? (sh.inner ? &*sh.inner : nullptr) : &sh.outer;
      const Ring* next = inner ? (sn.inner ? &*sn.inner : nullptr) : &sn.outer;
      if (!here || !next) return false;
      for (int32_t i = 0; i < facets; i++) {
        const int32_t j = (i + 1) % facets;
        const int32_t r = outward
                              ? g.appendPanel({(*here)[i], (*here)[j], (*next)[j], (*next)[i]})
                              : g.appendPanel({(*here)[j], (*here)[i], (*next)[i], (*next)[j]});
        if (r < 0) return false;
      }
    }
    return true;
  };
  if (!wall(false, true)) return Decline{"pipe: the wall does not close"};
  if (tubeHollowRadius && !wall(true, false)) return Decline{"pipe: the bore does not close"};

  if (!closed) {
    const Station& far = rings[stations - 1];
    const Station& near = rings[0];
    if (!tubeHollowRadius) {
      if (g.appendPanel(far.outer) < 0) return Decline{"pipe: far cap refused"};
      Ring nearRev = near.outer;
      std::reverse(nearRev.begin(), nearRev.end());
      if (g.appendPanel(nearRev) < 0) return Decline{"pipe: near cap refused"};
    } else {
      const std::pair<const Station*, bool> caps[2] = {{&far, true}, {&near, false}};
      for (const auto& [ring, forward] : caps) {
        const Ring& o = ring->outer;
        const Ring& in = *ring->inner;
        for (int32_t i = 0; i < facets; i++) {
          const int32_t j = (i + 1) % facets;
          const int32_t r = forward ? g.appendPanel({o[i], o[j], in[j], in[i]})
                                    : g.appendPanel({o[j], o[i], in[i], in[j]});
          if (r < 0) return Decline{"pipe: annular cap refused"};
        }
      }
    }
  }

  g.seal();
  return graph;
}

// ── triangle soup → shell ───────────────────────────────────────────────────────────────────────

AssembledShell shellFromTriangleSoup(const std::vector<std::vector<P3>>& triangles) {
  Graph graph;
  std::vector<Ring> rings;
  rings.reserve(triangles.size());
  for (const auto& t : triangles) {
    Ring r;
    r.reserve(t.size());
    for (const P3& p : t) r.push_back(graph.placeCorner(p[0], p[1], p[2]));
    rings.push_back(std::move(r));
  }
  joinCoplanarFacets(graph, rings);
  std::vector<std::vector<P3>> faces;
  faces.reserve(rings.size());
  for (const Ring& r : rings) {
    if (r.size() < 3) continue;
    std::vector<P3> f;
    f.reserve(r.size());
    for (int32_t v : r) f.push_back(graph.pointFrom(v));
    faces.push_back(std::move(f));
  }
  return stitchUpShell(faces);
}

// ── toTriangles ─────────────────────────────────────────────────────────────────────────────────

ToTrianglesResult toTriangles(LinkedShellGraph& graph) {
  ToTrianglesResult result;
  Ring tris;
  int32_t dropped = 0, exhausted = 0;
  auto& why = result.why;
  auto tally = [&](const std::string& reason) { tallyInto(why, reason); };
  BornOnEdge bornOnEdge;
  struct Done {
    int32_t ring;  // index into rings
    Ring pieces;
  };
  std::vector<Done> done;

  KeySet spoken;

  std::vector<Ring> rings;
  const int32_t panels = graph.panelTally();
  rings.reserve(static_cast<size_t>(panels));
  for (int32_t f = 0; f < panels; f++) rings.push_back(graph.outerRingOf(f));
  const int32_t absorbed = joinCoplanarFacets(graph, rings);
  if (absorbed) {
    std::vector<Ring> kept;
    kept.reserve(rings.size());
    for (auto& r : rings)
      if (!r.empty()) kept.push_back(std::move(r));
    rings.swap(kept);
  }

  for (const Ring& r : rings)
    for (size_t k = 0; k < r.size(); k++) spoken.add(cornerPairId(r[k], r[(k + 1) % r.size()]));
  const PairTaken taken = [&spoken](int32_t a, int32_t b) {
    return spoken.has(cornerPairId(a, b));
  };

  const MintVertex mint = [&graph, &bornOnEdge](std::span<const MintEdge> on) -> int32_t {
    const MintEdge& first = on[0];
    const int32_t before = graph.cornerTally();
    const int32_t born = graph.placeCorner(
        graph.pointXOf(first.a) + first.t * (graph.pointXOf(first.b) - graph.pointXOf(first.a)),
        graph.pointYOf(first.a) + first.t * (graph.pointYOf(first.b) - graph.pointYOf(first.a)),
        graph.pointZOf(first.a) + first.t * (graph.pointZOf(first.b) - graph.pointZOf(first.a)));
    if (graph.cornerTally() == before) return born;
    for (const MintEdge& e : on) {
      const bool flip = e.b < e.a;
      const int64_t key = flip ? pairKey(e.b, e.a) : pairKey(e.a, e.b);
      const double t = flip ? 1 - e.t : e.t;
      auto found = bornOnEdge.find(key);
      if (found != bornOnEdge.end()) {
        bool has = false;
        for (const BornCorner& c : found->second)
          if (c.v == born) {
            has = true;
            break;
          }
        if (!has) found->second.push_back({born, t});
      } else {
        bornOnEdge.emplace(key, std::vector<BornCorner>{{born, t}});
      }
    }
    return born;
  };

  for (size_t facet = 0; facet < rings.size(); facet++) {
    const Ring& ring = rings[facet];
    if (ring.size() < 3) {
      dropped++;
      tally("facet with fewer than three corners");
      continue;
    }
    const FlatRing flat = projectRing(ring, graph);
    TriangulationReport report;
    Ring pieces = triangleRing(flat, &report, nullptr, mint, taken);
    if (pieces.empty() && !report.exhausted) {
      for (int axis = 0; axis < 3; axis++) {
        Ring retry = triangleRing(projectRing(ring, graph, axis), &report, nullptr, mint, taken);
        if (!retry.empty()) {
          pieces = std::move(retry);
          break;
        }
      }
    }
    if (pieces.empty()) {
      if (report.exhausted)
        exhausted++;
      else {
        dropped++;
        tally(report.reason ? report.reason : "refused without a reason");
      }
      continue;
    }
    stitchDroppedCorners(ring, pieces);
    for (size_t t = 0; t + 2 < pieces.size(); t += 3) {
      spoken.add(cornerPairId(pieces[t], pieces[t + 1]));
      spoken.add(cornerPairId(pieces[t + 1], pieces[t + 2]));
      spoken.add(cornerPairId(pieces[t + 2], pieces[t]));
    }
    done.push_back({static_cast<int32_t>(facet), std::move(pieces)});
  }

  // Retry the facets that lost the diagonal preference, then split surviving clashing diagonals.
  {
    detail::ProbeMap<int64_t> used;  // pair -> count (order irrelevant here)
    std::vector<int64_t> usedKeys;
    std::vector<int32_t> usedCounts;
    auto countPair = [&](int64_t k) {
      bool inserted = false;
      const int32_t at = used.getOrInsert(k, static_cast<int32_t>(usedKeys.size()), inserted);
      if (inserted) {
        usedKeys.push_back(k);
        usedCounts.push_back(1);
      } else {
        usedCounts[at]++;
      }
    };
    for (const Done& d : done) {
      const Ring& p = d.pieces;
      for (size_t t = 0; t + 2 < p.size(); t += 3) {
        countPair(cornerPairId(p[t], p[t + 1]));
        countPair(cornerPairId(p[t + 1], p[t + 2]));
        countPair(cornerPairId(p[t + 2], p[t]));
      }
    }
    KeySet clash;
    for (size_t u = 0; u < usedKeys.size(); u++)
      if (usedCounts[u] > 2) clash.add(usedKeys[u]);
    if (clash.size()) {
      KeySet isGenuine;
      for (const Ring& r : rings)
        for (size_t k = 0; k < r.size(); k++)
          isGenuine.add(cornerPairId(r[k], r[(k + 1) % r.size()]));
      const PairTaken forbidden = [&clash](int32_t a, int32_t b) {
        return clash.has(cornerPairId(a, b));
      };
      for (Done& entry : done) {
        const Ring& p = entry.pieces;
        bool owns = false;
        for (size_t t = 0; t + 2 < p.size() && !owns; t += 3) {
          const int64_t ks[3] = {cornerPairId(p[t], p[t + 1]), cornerPairId(p[t + 1], p[t + 2]),
                                 cornerPairId(p[t + 2], p[t])};
          for (int64_t k : ks)
            if (clash.has(k) && !isGenuine.has(k)) {
              owns = true;
              break;
            }
        }
        const Ring& ering = rings[entry.ring];
        if (!owns || ering.size() < 4) continue;
        Ring again = triangleRing(projectRing(ering, graph), nullptr, nullptr, {}, forbidden);
        if (again.empty()) continue;
        int32_t still = 0;
        for (size_t t = 0; t + 2 < again.size(); t += 3) {
          const int64_t ks[3] = {cornerPairId(again[t], again[t + 1]),
                                 cornerPairId(again[t + 1], again[t + 2]),
                                 cornerPairId(again[t + 2], again[t])};
          for (int64_t k : ks)
            if (clash.has(k) && !isGenuine.has(k)) still++;
        }
        if (still == 0) entry.pieces = std::move(again);
      }

      {
        OrderedCount seenPerCornerKey;
        for (const Done& d : done) {
          const Ring& p = d.pieces;
          for (size_t t = 0; t + 2 < p.size(); t += 3) {
            seenPerCornerKey.add(cornerPairId(p[t], p[t + 1]));
            seenPerCornerKey.add(cornerPairId(p[t + 1], p[t + 2]));
            seenPerCornerKey.add(cornerPairId(p[t + 2], p[t]));
          }
        }
        int32_t splits = 0;
        for (size_t u = 0; u < seenPerCornerKey.keys.size(); u++) {
          const int64_t k = seenPerCornerKey.keys[u];
          const int32_t n0 = seenPerCornerKey.counts[u];
          if (n0 <= 2 || isGenuine.has(k)) continue;
          int32_t n = n0;
          const int32_t pa = keyFirst(k), pb = keySecond(k);
          for (Done& entry : done) {
            if (n <= 2) break;
            int64_t at[3];
            int atCount = 0;
            const Ring& p = entry.pieces;
            for (size_t t = 0; t + 2 < p.size() && atCount < 3; t += 3) {
              const int32_t x = p[t], y = p[t + 1], z = p[t + 2];
              if ((x == pa || y == pa || z == pa) && (x == pb || y == pb || z == pb))
                at[atCount++] = static_cast<int64_t>(t);
            }
            if (atCount != 2) continue;
            const int32_t before = graph.cornerTally();
            const int32_t mid = graph.placeCorner((graph.pointXOf(pa) + graph.pointXOf(pb)) / 2,
                                                  (graph.pointYOf(pa) + graph.pointYOf(pb)) / 2,
                                                  (graph.pointZOf(pa) + graph.pointZOf(pb)) / 2);
            if (graph.cornerTally() == before) continue;
            Ring fresh;
            fresh.reserve(p.size() + 6);
            for (size_t t = 0; t + 2 < p.size(); t += 3) {
              const int32_t tri[3] = {p[t], p[t + 1], p[t + 2]};
              if (static_cast<int64_t>(t) == at[0] || static_cast<int64_t>(t) == at[1]) {
                for (int e = 0; e < 3; e++) {
                  const int32_t uu = tri[e], vv = tri[(e + 1) % 3], ww = tri[(e + 2) % 3];
                  if ((uu == pa && vv == pb) || (uu == pb && vv == pa)) {
                    fresh.insert(fresh.end(), {uu, mid, ww, mid, vv, ww});
                    break;
                  }
                }
              } else {
                fresh.insert(fresh.end(), {tri[0], tri[1], tri[2]});
              }
            }
            entry.pieces = std::move(fresh);
            n -= 2;
            splits++;
          }
        }
        if (splits) tally("clashing diagonals split at a minted midpoint (" + std::to_string(splits) + ")");
      }
    }
  }

  // Second pass: corners minted on one facet are corners of the one across the edge.
  for (Done& d : done) {
    splitAtMintedCorners(rings[d.ring], d.pieces, bornOnEdge);
    tris.insert(tris.end(), d.pieces.begin(), d.pieces.end());
  }

  const double weld = graph.tolerance != 0 ? graph.tolerance : WELD_METRES;
  const PointOf xOf = [&graph](int32_t v) { return graph.pointXOf(v); };
  const PointOf yOf = [&graph](int32_t v) { return graph.pointYOf(v); };
  const PointOf zOf = [&graph](int32_t v) { return graph.pointZOf(v); };
  const int32_t sewn = stitchTriangleTJunctions(tris, xOf, yOf, zOf, weld);
  if (sewn) tally("T junctions stitched (" + std::to_string(sewn) + ")");

  const Capped capped = graph.isWatertight() ? capOpenLoops(graph, tris) : Capped{};
  if (capped.count)
    tally("tessellation holes capped (" + std::to_string(capped.count) + " triangles, " +
          jsToFixed4(capped.area) + " of area)");

  if (cancelOppositeSlivers) {
    const double tol = weld;
    struct Triple {
      int32_t a, b, c;
      bool operator==(const Triple& o) const { return a == o.a && b == o.b && c == o.c; }
    };
    struct TripleHash {
      size_t operator()(const Triple& t) const {
        uint64_t h = static_cast<uint32_t>(t.a) * 0x9E3779B97F4A7C15ULL;
        h ^= static_cast<uint32_t>(t.b) + 0x7F4A7C159E3779B9ULL + (h << 6) + (h >> 2);
        h ^= static_cast<uint32_t>(t.c) + 0x94D049BB133111EBULL + (h << 6) + (h >> 2);
        return static_cast<size_t>(h);
      }
    };
    std::unordered_map<Triple, std::vector<int32_t>, TripleHash> byTriple;
    for (size_t t = 0; t + 2 < tris.size(); t += 3) {
      const int32_t a = tris[t], b = tris[t + 1], c = tris[t + 2];
      if (a == b || b == c || c == a) continue;
      const double ux = graph.pointXOf(b) - graph.pointXOf(a),
                   uy = graph.pointYOf(b) - graph.pointYOf(a),
                   uz = graph.pointZOf(b) - graph.pointZOf(a);
      const double vx = graph.pointXOf(c) - graph.pointXOf(a),
                   vy = graph.pointYOf(c) - graph.pointYOf(a),
                   vz = graph.pointZOf(c) - graph.pointZOf(a);
      const double wx = graph.pointXOf(c) - graph.pointXOf(b),
                   wy = graph.pointYOf(c) - graph.pointYOf(b),
                   wz = graph.pointZOf(c) - graph.pointZOf(b);
      const double doubleArea = jsHypot3(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx);
      const double longest =
          jsMax(jsMax(jsHypot3(ux, uy, uz), jsHypot3(vx, vy, vz)), jsHypot3(wx, wy, wz));
      if (longest <= 0 || doubleArea / longest >= tol) continue;
      int32_t s[3] = {a, b, c};
      std::sort(s, s + 3);
      byTriple[Triple{s[0], s[1], s[2]}].push_back(static_cast<int32_t>(t));
    }
    auto parityOf = [&](int32_t t) -> int {
      const int32_t a = tris[t], b = tris[t + 1], c = tris[t + 2];
      if (a < b && a < c) return b < c ? 0 : 1;
      if (b < a && b < c) return c < a ? 0 : 1;
      return a < b ? 0 : 1;
    };
    std::vector<char> doomed;
    bool anyDoomed = false;
    int32_t pairs = 0;
    std::vector<int32_t> even, odd;
    for (const auto& [key, list] : byTriple) {
      if (list.size() < 2) continue;
      even.clear();
      odd.clear();
      for (int32_t t : list) (parityOf(t) == 0 ? even : odd).push_back(t);
      const size_t n = std::min(even.size(), odd.size());
      for (size_t i = 0; i < n; i++) {
        if (doomed.empty()) doomed.assign(tris.size() / 3 + 1, 0);
        doomed[even[i] / 3] = 1;
        doomed[odd[i] / 3] = 1;
        anyDoomed = true;
        pairs++;
      }
    }
    if (anyDoomed) {
      Ring kept;
      kept.reserve(tris.size());
      for (size_t t = 0; t + 2 < tris.size(); t += 3) {
        if (doomed[t / 3]) continue;
        kept.insert(kept.end(), {tris[t], tris[t + 1], tris[t + 2]});
      }
      tris.swap(kept);
      tally("opposite stitch slivers cancelled (" + std::to_string(pairs) + " pairs)");
    }
  }

  if (cullSubWeldLumps) {
    const double tol = weld;
    const int32_t nTris = static_cast<int32_t>(tris.size() / 3);
    if (nTris > 3) {
      std::vector<int32_t> parent(static_cast<size_t>(nTris));
      for (int32_t i = 0; i < nTris; i++) parent[i] = i;
      auto find = [&](int32_t i) {
        while (parent[i] != i) {
          parent[i] = parent[parent[i]];
          i = parent[i];
        }
        return i;
      };
      // Edge -> first two triangles and a use count; only "exactly two" matters.
      struct EdgeUse {
        int32_t t0, t1, n;
      };
      std::unordered_map<int64_t, EdgeUse> edgeTris;
      edgeTris.reserve(tris.size());
      for (int32_t t = 0; t < nTris; t++) {
        const int32_t v3[3] = {tris[t * 3], tris[t * 3 + 1], tris[t * 3 + 2]};
        for (int e = 0; e < 3; e++) {
          const int32_t uu = v3[e], vv = v3[(e + 1) % 3];
          const int64_t k = cornerPairId(uu, vv);
          auto [it, inserted] = edgeTris.try_emplace(k, EdgeUse{t, -1, 1});
          if (!inserted) {
            if (it->second.n == 1) it->second.t1 = t;
            it->second.n++;
          }
        }
      }
      for (const auto& [k, use] : edgeTris) {
        if (use.n != 2) continue;
        const int32_t ra = find(use.t0), rb = find(use.t1);
        if (ra != rb) parent[ra] = rb;
      }
      struct Comp {
        Ring tris;
        double area = 0;
        double vol = 0;
      };
      std::vector<Comp> comps;  // insertion order
      std::unordered_map<int32_t, int32_t> compOf;
      for (int32_t t = 0; t < nTris; t++) {
        const int32_t r = find(t);
        auto [it, inserted] = compOf.try_emplace(r, static_cast<int32_t>(comps.size()));
        if (inserted) comps.emplace_back();
        Comp& c = comps[it->second];
        c.tris.push_back(t);
        const int32_t i0 = tris[t * 3], i1 = tris[t * 3 + 1], i2 = tris[t * 3 + 2];
        const double ax = graph.pointXOf(i0), ay = graph.pointYOf(i0), az = graph.pointZOf(i0);
        const double bx = graph.pointXOf(i1), by = graph.pointYOf(i1), bz = graph.pointZOf(i1);
        const double cx = graph.pointXOf(i2), cy = graph.pointYOf(i2), cz = graph.pointZOf(i2);
        const double nx = (by - ay) * (cz - az) - (bz - az) * (cy - ay);
        const double ny = (bz - az) * (cx - ax) - (bx - ax) * (cz - az);
        const double nz = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
        c.area += jsHypot3(nx, ny, nz) / 2;
        c.vol += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6;
      }
      if (comps.size() > 1) {
        double total = 0;
        for (const Comp& c : comps) total += c.area;
        std::vector<char> doomed;
        int32_t lumps = 0;
        std::unordered_map<int64_t, int32_t> local;
        for (const Comp& c : comps) {
          if (c.area <= 0 || c.area > 0.3 * total) continue;
          local.clear();
          for (int32_t t : c.tris) {
            const int32_t v3[3] = {tris[t * 3], tris[t * 3 + 1], tris[t * 3 + 2]};
            for (int e = 0; e < 3; e++) local[cornerPairId(v3[e], v3[(e + 1) % 3])]++;
          }
          bool closed = true;
          for (const auto& [k, n] : local)
            if (n != 2) {
              closed = false;
              break;
            }
          if (!closed) continue;
          const double thickness = (4 * std::fabs(c.vol)) / c.area;
          if (thickness >= 2 * tol) continue;
          if (doomed.empty()) doomed.assign(static_cast<size_t>(nTris), 0);
          for (int32_t t : c.tris) doomed[t] = 1;
          lumps++;
        }
        if (lumps) {
          bool any = false;
          for (char d : doomed)
            if (d) {
              any = true;
              break;
            }
          if (any) {
            Ring kept;
            kept.reserve(tris.size());
            for (int32_t t = 0; t < nTris; t++) {
              if (doomed[t]) continue;
              kept.insert(kept.end(), {tris[t * 3], tris[t * 3 + 1], tris[t * 3 + 2]});
            }
            tris.swap(kept);
            tally("sub-weld pinched lumps culled (" + std::to_string(lumps) + ")");
          }
        }
      }
    }
  }

  // Only the referenced vertices, renumbered densely.
  std::vector<int32_t> renumber(static_cast<size_t>(graph.cornerTally()), -1);
  auto& positions = result.mesh.positions;
  auto& indices = result.mesh.indices;
  indices.resize(tris.size());
  int32_t next = 0;
  for (size_t i = 0; i < tris.size(); i++) {
    const int32_t v = tris[i];
    int32_t at = renumber[v];
    if (at < 0) {
      at = next++;
      renumber[v] = at;
      positions.push_back(graph.pointXOf(v));
      positions.push_back(graph.pointYOf(v));
      positions.push_back(graph.pointZOf(v));
    }
    indices[i] = static_cast<uint32_t>(at);
  }

  result.dropped = dropped;
  result.exhausted = exhausted;
  return result;
}

}  // namespace brep
