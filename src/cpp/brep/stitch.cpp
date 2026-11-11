// stitch.cpp — resolve T junctions in a triangle soup. Port of stitch.ts.
#pragma STDC FP_CONTRACT OFF
#if defined(__clang__)
#pragma clang fp contract(off)
#endif

#include "stitch.h"

#include <algorithm>
#include <cmath>
#include <cstring>
#include <limits>
#include <unordered_map>
#include <unordered_set>

namespace brep {

namespace {

// Directed edge a->b as one key (the TS `${a}|${b}` string).
inline uint64_t edgeKey(int32_t a, int32_t b) {
  return (static_cast<uint64_t>(static_cast<uint32_t>(a)) << 32) | static_cast<uint32_t>(b);
}
inline int32_t edgeFrom(uint64_t k) { return static_cast<int32_t>(static_cast<uint32_t>(k >> 32)); }
inline int32_t edgeTo(uint64_t k) { return static_cast<int32_t>(static_cast<uint32_t>(k)); }

struct U64Hash {
  size_t operator()(uint64_t x) const noexcept {
    x ^= x >> 33;
    x *= 0xff51afd7ed558ccdULL;
    x ^= x >> 33;
    x *= 0xc4ceb3f99c75ae53ULL;
    x ^= x >> 33;
    return static_cast<size_t>(x);
  }
};

// Directed-edge tally in first-insertion order (TS Map iteration order).
struct EdgeTally {
  std::vector<std::pair<uint64_t, int32_t>> entries;
  std::unordered_map<uint64_t, size_t, U64Hash> index;

  void build(const std::vector<int32_t>& tris) {
    entries.clear();
    index.clear();
    index.reserve(tris.size());
    entries.reserve(tris.size());
    for (size_t i = 0; i + 2 < tris.size(); i += 3) {
      const int32_t t[3] = {tris[i], tris[i + 1], tris[i + 2]};
      for (int e = 0; e < 3; e++) {
        const uint64_t k = edgeKey(t[e], t[(e + 1) % 3]);
        auto it = index.find(k);
        if (it == index.end()) {
          index.emplace(k, entries.size());
          entries.emplace_back(k, 1);
        } else {
          entries[it->second].second++;
        }
      }
    }
  }
  int32_t get(uint64_t k) const {
    auto it = index.find(k);
    return it == index.end() ? 0 : entries[it->second].second;
  }
};

// Unpaired directed edges of a triangle soup.
int32_t countUnpaired(const std::vector<int32_t>& tris) {
  EdgeTally dir;
  dir.build(tris);
  int32_t n = 0;
  for (const auto& [k, c] : dir.entries)
    if (c != dir.get(edgeKey(edgeTo(k), edgeFrom(k)))) n++;
  return n;
}

// Grid cell key; doubles as in TS (`${i}|${j}|${k}`), with -0 folded into +0 as the string does.
struct Cell {
  double i, j, k;
  bool operator==(const Cell& o) const { return i == o.i && j == o.j && k == o.k; }
};
struct CellHash {
  size_t operator()(const Cell& c) const noexcept {
    U64Hash h;
    auto bits = [](double d) {
      d += 0.0;
      uint64_t u;
      std::memcpy(&u, &d, sizeof u);
      return u;
    };
    return h(bits(c.i) ^ (h(bits(c.j)) + 0x9e3779b97f4a7c15ULL) ^ (h(bits(c.k)) << 1));
  }
};

struct Straddle {
  double off, along;
};

// Where a point sits relative to a segment; false when not strictly between the ends.
inline bool straddle(double ax, double ay, double az, double bx, double by, double bz, double cx,
                     double cy, double cz, Straddle& out) {
  const double ux = bx - ax, uy = by - ay, uz = bz - az;
  const double vx = cx - ax, vy = cy - ay, vz = cz - az;
  const double squaredLen = ux * ux + uy * uy + uz * uz;
  if (squaredLen == 0) return false;
  const double along = (ux * vx + uy * vy + uz * vz) / squaredLen;
  if (!(along > 0 && along < 1)) return false;
  const double nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
  out = {jsHypot3(nx, ny, nz) / std::sqrt(squaredLen), along};
  return true;
}

int32_t stitchOnce(std::vector<int32_t>& tris, const PointOf& pointXOf, const PointOf& pointYOf,
                   const PointOf& pointZOf, double tol) {
  EdgeTally dir;
  dir.build(tris);
  std::vector<std::pair<int32_t, int32_t>> open;
  std::vector<int32_t> atBorder;  // insertion-ordered set
  std::unordered_set<int32_t> atBorderSet;
  for (const auto& [k, n] : dir.entries) {
    const int32_t a = edgeFrom(k), b = edgeTo(k);
    if (n == dir.get(edgeKey(b, a))) continue;
    open.emplace_back(a, b);
    if (atBorderSet.insert(a).second) atBorder.push_back(a);
    if (atBorderSet.insert(b).second) atBorder.push_back(b);
  }
  if (open.size() < 3 || atBorder.size() < 3) return 0;

  // Border corners hashed into cells sized to the open edges.
  std::unordered_map<uint64_t, std::vector<int32_t>, U64Hash> inserts;
  double lengthSum = 0;
  for (const auto& [a, b] : open) {
    lengthSum += jsHypot3(pointXOf(b) - pointXOf(a), pointYOf(b) - pointYOf(a),
                          pointZOf(b) - pointZOf(a));
  }
  double side = jsMax(lengthSum / static_cast<double>(open.size()), tol * 4);
  if (side == 0 || std::isnan(side)) side = 1;
  auto cellOf = [side](double v) { return std::floor(v / side); };
  std::unordered_map<Cell, std::vector<int32_t>, CellHash> cornersIn;
  for (int32_t c : atBorder) {
    cornersIn[Cell{cellOf(pointXOf(c)), cellOf(pointYOf(c)), cellOf(pointZOf(c))}].push_back(c);
  }

  struct Hit {
    int32_t v;
    double t;
  };
  std::unordered_set<int32_t> visited;
  std::vector<Hit> hits;
  Straddle s;
  for (const auto& [a, b] : open) {
    hits.clear();
    const double ax = pointXOf(a), ay = pointYOf(a), az = pointZOf(a);
    const double bx = pointXOf(b), by = pointYOf(b), bz = pointZOf(b);
    visited.clear();
    const double i1 = cellOf(jsMax(ax, bx) + tol);
    const double j0 = cellOf(jsMin(ay, by) - tol), j1 = cellOf(jsMax(ay, by) + tol);
    const double k0 = cellOf(jsMin(az, bz) - tol), k1 = cellOf(jsMax(az, bz) + tol);
    for (double i = cellOf(jsMin(ax, bx) - tol); i <= i1; i++) {
      for (double j = j0; j <= j1; j++) {
        for (double k = k0; k <= k1; k++) {
          auto found = cornersIn.find(Cell{i, j, k});
          if (found == cornersIn.end()) continue;
          for (int32_t c : found->second) {
            if (c != a && c != b && !visited.count(c)) {
              visited.insert(c);
              if (straddle(ax, ay, az, bx, by, bz, pointXOf(c), pointYOf(c), pointZOf(c), s) &&
                  s.off <= tol)
                hits.push_back({c, s.along});
            }
          }
        }
      }
    }
    if (!hits.empty()) {
      std::stable_sort(hits.begin(), hits.end(),
                       [](const Hit& p, const Hit& q) { return p.t < q.t; });
      std::vector<int32_t> vs;
      vs.reserve(hits.size());
      for (const Hit& h : hits) vs.push_back(h.v);
      inserts[edgeKey(a, b)] = std::move(vs);
    }
  }
  if (inserts.empty()) return 0;

  // Rebuild each triangle as a fan over its expanded ring, from an apex that makes no sliver.
  std::vector<int32_t> out;
  out.reserve(tris.size() + 3 * inserts.size());
  int32_t split = 0;
  std::vector<int32_t> ring;
  for (size_t i = 0; i + 2 < tris.size(); i += 3) {
    const int32_t t[3] = {tris[i], tris[i + 1], tris[i + 2]};
    ring.clear();
    for (int e = 0; e < 3; e++) {
      const int32_t a = t[e], b = t[(e + 1) % 3];
      ring.push_back(a);
      auto extra = inserts.find(edgeKey(a, b));
      if (extra != inserts.end()) {
        for (int32_t v : extra->second)
          if (ring.back() != v) {
            ring.push_back(v);
            split++;
          }
      }
    }
    if (ring.size() == 3) {
      out.push_back(ring[0]);
      out.push_back(ring[1]);
      out.push_back(ring[2]);
      continue;
    }
    const size_t n = ring.size();
    int64_t apex = -1;
    for (size_t a = 0; a < n && apex < 0; a++) {
      bool clean = true;
      for (size_t k = 1; k + 1 < n && clean; k++) {
        const int32_t p = ring[a], q = ring[(a + k) % n], r = ring[(a + k + 1) % n];
        const double ux = pointXOf(q) - pointXOf(p), uy = pointYOf(q) - pointYOf(p),
                     uz = pointZOf(q) - pointZOf(p);
        const double vx = pointXOf(r) - pointXOf(p), vy = pointYOf(r) - pointYOf(p),
                     vz = pointZOf(r) - pointZOf(p);
        if (uy * vz - uz * vy == 0 && uz * vx - ux * vz == 0 && ux * vy - uy * vx == 0)
          clean = false;
      }
      if (clean) apex = static_cast<int64_t>(a);
    }
    if (apex < 0) apex = 0;
    const size_t ap = static_cast<size_t>(apex);
    for (size_t k = 1; k + 1 < n; k++) {
      out.push_back(ring[ap]);
      out.push_back(ring[(ap + k) % n]);
      out.push_back(ring[(ap + k + 1) % n]);
    }
  }
  if (!split) return 0;
  tris = std::move(out);
  return split;
}

}  // namespace

int32_t stitchTriangleTJunctions(std::vector<int32_t>& tris, const PointOf& pointXOf,
                                 const PointOf& pointYOf, const PointOf& pointZOf, double tol) {
  int32_t total = 0;
  for (int round = 0; round < 8; round++) {
    const int32_t before = countUnpaired(tris);
    if (!before) break;
    const int32_t made = stitchOnce(tris, pointXOf, pointYOf, pointZOf, tol);
    if (!made) break;
    total += made;
    if (countUnpaired(tris) >= before) break;
  }
  return total;
}

}  // namespace brep
