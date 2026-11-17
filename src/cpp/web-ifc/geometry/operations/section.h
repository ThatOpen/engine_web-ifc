/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

// Section of a triangle mesh by a plane, for drawing sections and floor plans: the cut LINES (every
// segment where the plane crosses a triangle) and the CAP (the cut area, triangulated), without touching
// the mesh itself. Hiding the part in front of the plane is the viewer's job (a clipping plane).
//
// Unlike plane-clip.h (an exact shortcut for half-space booleans, which gives up on anything doubtful),
// this one is tolerant, because real models are not always closed:
//   - segments are chained into loops through welded end points, ignoring their direction, so flipped
//     triangles do not matter;
//   - chains that do not close (open meshes) are closed when their two ends are nearer than `closeGap`,
//     or joined to another open chain whose end is that near; whatever stays open is returned as lines
//     only (no cap) and counted in `openChains`;
//   - loops are nested by containment (even depth = solid, odd depth = hole of the smallest solid loop
//     around it), so their orientation is not needed either;
//   - triangles lying in the plane are skipped (their neighbours give the outline); an edge lying in the
//     plane is taken once, from the triangle on the positive side.

#pragma once

#include <cmath>
#include <cstdint>
#include <unordered_map>
#include <vector>
#include <array>
#include <algorithm>
#include <glm/glm.hpp>
#include <mapbox/earcut.hpp>

namespace webifc::geometry {

struct SectionResult {
  std::vector<double> capPositions;   // x, y, z per cap vertex
  std::vector<uint32_t> capIndices;   // 3 per cap triangle
  std::vector<double> lines;          // x1, y1, z1, x2, y2, z2 per cut segment
  uint32_t closedLoops = 0;           // loops that closed (with or without gap closing)
  uint32_t closedByGap = 0;           // of them, closed by joining ends nearer than closeGap
  uint32_t openChains = 0;            // chains left open: lines only, no cap
  uint32_t earcutFailures = 0;        // solid loops whose triangulation came out empty
};

namespace section {

struct Key {
  int64_t x, y, z;
  bool operator==(const Key& o) const { return x == o.x && y == o.y && z == o.z; }
};
struct KeyHash {
  size_t operator()(const Key& k) const {
    uint64_t h = (uint64_t)k.x * 0x9E3779B97F4A7C15ull;
    h ^= (uint64_t)k.y + 0x9E3779B97F4A7C15ull + (h << 6) + (h >> 2);
    h ^= (uint64_t)k.z + 0x9E3779B97F4A7C15ull + (h << 6) + (h >> 2);
    return (size_t)h;
  }
};

inline bool inside(const std::array<double, 2>& pt, const std::vector<std::array<double, 2>>& poly) {
  bool in = false;
  for (size_t i = 0, j = poly.size() - 1; i < poly.size(); j = i++) {
    const auto& a = poly[i];
    const auto& b = poly[j];
    if ((a[1] > pt[1]) != (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) in = !in;
  }
  return in;
}

inline double area2(const std::vector<std::array<double, 2>>& c) {
  double a = 0;
  for (size_t k = 0; k < c.size(); k++) {
    const auto& p = c[k];
    const auto& q = c[(k + 1) % c.size()];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a;
}

}  // namespace section

// positions: x, y, z per vertex (any frame, any units); indices: 3 per triangle.
// The plane is { p : dot(normal, p - point) = 0 }. weld: distance under which two cut points are the same
// point; closeGap: largest gap closed between the ends of open chains (0 = never).
inline SectionResult SectionMesh(const std::vector<double>& positions, const std::vector<uint32_t>& indices,
                                 glm::dvec3 point, glm::dvec3 normal, double weld, double closeGap) {
  using namespace section;
  SectionResult out;
  const double nl = glm::length(normal);
  const size_t nv = positions.size() / 3;
  if (!(nl > 0) || nv == 0 || indices.size() < 3) return out;
  normal /= nl;
  if (!(weld > 0)) weld = 1e-6;

  auto P = [&](uint32_t i) { return glm::dvec3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]); };
  std::vector<double> dist(nv);
  for (size_t i = 0; i < nv; i++) dist[i] = glm::dot(normal, P((uint32_t)i) - point);
  const double tol = weld * 0.5;  // "on the plane"
  auto sideOf = [&](double d) { return d > tol ? 1 : d < -tol ? -1 : 0; };

  // 1. Cut segments.
  std::vector<std::pair<glm::dvec3, glm::dvec3>> segs;
  for (size_t f = 0; f + 2 < indices.size(); f += 3) {
    const uint32_t ix[3] = {indices[f], indices[f + 1], indices[f + 2]};
    if (ix[0] >= nv || ix[1] >= nv || ix[2] >= nv) continue;
    double d[3];
    int s[3];
    for (int k = 0; k < 3; k++) { d[k] = dist[ix[k]]; s[k] = sideOf(d[k]); }
    const int pos = (s[0] > 0) + (s[1] > 0) + (s[2] > 0), neg = (s[0] < 0) + (s[1] < 0) + (s[2] < 0);
    const int on = 3 - pos - neg;
    if (on == 3) continue;                                   // a face in the plane
    if (on == 2) {                                           // an edge in the plane: taken from the positive side only
      if (pos == 1) {
        glm::dvec3 a, b; int n = 0;
        for (int k = 0; k < 3; k++) if (s[k] == 0) { (n++ == 0 ? a : b) = P(ix[k]); }
        segs.push_back({a, b});
      }
      continue;
    }
    if (pos == 0 || neg == 0) continue;                      // wholly on one side (maybe touching at a vertex)
    std::vector<glm::dvec3> cut;
    for (int k = 0; k < 3; k++) {
      const int j = (k + 1) % 3;
      if (s[k] == 0) cut.push_back(P(ix[k]));
      if ((s[k] > 0 && s[j] < 0) || (s[k] < 0 && s[j] > 0)) {
        const double t = d[k] / (d[k] - d[j]);
        cut.push_back(P(ix[k]) + (P(ix[j]) - P(ix[k])) * t);
      }
    }
    if (cut.size() == 2) segs.push_back({cut[0], cut[1]});
  }
  if (segs.empty()) return out;

  // 2. Weld the end points and build an undirected multigraph (degenerate segments dropped).
  std::unordered_map<Key, uint32_t, KeyHash> ids;
  std::vector<glm::dvec3> pts;
  auto vid = [&](const glm::dvec3& p) {
    const Key k{(int64_t)std::llround(p.x / weld), (int64_t)std::llround(p.y / weld), (int64_t)std::llround(p.z / weld)};
    auto it = ids.find(k);
    if (it != ids.end()) return it->second;
    const uint32_t n = (uint32_t)pts.size();
    ids.emplace(k, n);
    pts.push_back(p);
    return n;
  };
  std::vector<std::array<uint32_t, 2>> edges;
  {
    std::unordered_map<uint64_t, bool> seen;  // the same segment twice (two coincident faces) counts once
    for (const auto& sg : segs) {
      uint32_t a = vid(sg.first), b = vid(sg.second);
      if (a == b) continue;
      const uint64_t key = a < b ? ((uint64_t)a << 32) | b : ((uint64_t)b << 32) | a;
      if (seen.count(key)) continue;
      seen.emplace(key, true);
      edges.push_back({a, b});
      out.lines.insert(out.lines.end(), {pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z});
    }
  }
  std::vector<std::vector<uint32_t>> adj(pts.size());
  for (uint32_t e = 0; e < edges.size(); e++) { adj[edges[e][0]].push_back(e); adj[edges[e][1]].push_back(e); }

  // 3. Walk the edges into chains: from an odd-degree vertex first (an open end), then from anywhere.
  std::vector<bool> used(edges.size(), false);
  std::vector<std::vector<uint32_t>> loops, chains;
  auto walk = [&](uint32_t start, uint32_t firstEdge) {
    std::vector<uint32_t> c{start};
    uint32_t at = start, e = firstEdge;
    for (;;) {
      used[e] = true;
      at = edges[e][0] == at ? edges[e][1] : edges[e][0];
      if (at == start) { loops.push_back(c); return; }
      c.push_back(at);
      uint32_t next = UINT32_MAX;
      for (uint32_t x : adj[at]) if (!used[x]) { next = x; break; }
      if (next == UINT32_MAX) { chains.push_back(c); return; }
      e = next;
    }
  };
  for (uint32_t v = 0; v < pts.size(); v++)
    if (adj[v].size() % 2 == 1)
      for (uint32_t e : adj[v]) if (!used[e]) { walk(v, e); break; }
  for (uint32_t e = 0; e < edges.size(); e++) if (!used[e]) walk(edges[e][0], e);

  // 4. Close open chains: a chain whose ends are near, then the nearest pairs of ends of different chains.
  if (closeGap > 0 && !chains.empty()) {
    bool merged = true;
    while (merged) {
      merged = false;
      for (size_t i = 0; i < chains.size() && !merged; i++) {
        auto& c = chains[i];
        if (c.size() >= 3 && glm::length(pts[c.front()] - pts[c.back()]) <= closeGap) {
          loops.push_back(c); out.closedByGap++;
          chains.erase(chains.begin() + i); merged = true; break;
        }
        double best = closeGap; size_t bj = SIZE_MAX; int how = 0;
        for (size_t j = 0; j < chains.size(); j++) {
          if (j == i) continue;
          const auto& o = chains[j];
          const double dd[4] = {glm::length(pts[c.back()] - pts[o.front()]), glm::length(pts[c.back()] - pts[o.back()]),
                                glm::length(pts[c.front()] - pts[o.front()]), glm::length(pts[c.front()] - pts[o.back()])};
          for (int h = 0; h < 4; h++) if (dd[h] <= best) { best = dd[h]; bj = j; how = h; }
        }
        if (bj != SIZE_MAX) {
          std::vector<uint32_t> o = chains[bj];
          if (how == 1 || how == 2) std::reverse(o.begin(), o.end());
          std::vector<uint32_t> joined;
          if (how <= 1) { joined = c; joined.insert(joined.end(), o.begin(), o.end()); }
          else { joined = o; joined.insert(joined.end(), c.begin(), c.end()); }
          chains.erase(chains.begin() + std::max(i, bj));
          chains.erase(chains.begin() + std::min(i, bj));
          chains.push_back(joined);
          merged = true;
        }
      }
    }
  }
  out.openChains = (uint32_t)chains.size();
  if (loops.empty()) return out;

  // 5. Project onto the plane, nest by containment and triangulate each solid loop with its holes.
  glm::dvec3 u = std::fabs(normal.x) < 0.9 ? glm::dvec3(1, 0, 0) : glm::dvec3(0, 1, 0);
  u = glm::normalize(u - normal * glm::dot(u, normal));
  const glm::dvec3 v = glm::cross(normal, u);
  std::vector<std::vector<std::array<double, 2>>> flat;
  std::vector<std::vector<uint32_t>> kept;
  std::vector<double> area;
  for (auto& l : loops) {
    if (l.size() < 3) continue;
    std::vector<std::array<double, 2>> f;
    for (uint32_t i : l) f.push_back({glm::dot(pts[i] - point, u), glm::dot(pts[i] - point, v)});
    const double a = std::fabs(area2(f)) * 0.5;
    if (!(a > weld * weld)) continue;                        // a sliver: no area to fill
    flat.push_back(std::move(f)); kept.push_back(l); area.push_back(a);
  }
  out.closedLoops = (uint32_t)flat.size();
  const size_t n = flat.size();
  std::vector<int> depth(n, 0), owner(n, -1);
  for (size_t i = 0; i < n; i++) {
    double best = 1e300;
    for (size_t j = 0; j < n; j++) {
      if (j == i || area[j] <= area[i] || !inside(flat[i][0], flat[j])) continue;
      depth[i]++;
      if (area[j] < best) { best = area[j]; owner[i] = (int)j; }
    }
  }
  for (size_t o = 0; o < n; o++) {
    if (depth[o] % 2 == 1) continue;                         // a hole
    std::vector<std::vector<std::array<double, 2>>> polygon{flat[o]};
    std::vector<uint32_t> ring(kept[o]);
    for (size_t h = 0; h < n; h++)
      if (depth[h] % 2 == 1 && owner[h] == (int)o) {
        polygon.push_back(flat[h]);
        ring.insert(ring.end(), kept[h].begin(), kept[h].end());
      }
    const std::vector<uint32_t> tri = mapbox::earcut<uint32_t>(polygon);
    if (tri.empty()) { out.earcutFailures++; continue; }
    const uint32_t base = (uint32_t)(out.capPositions.size() / 3);
    for (uint32_t i : ring) out.capPositions.insert(out.capPositions.end(), {pts[i].x, pts[i].y, pts[i].z});
    for (uint32_t t : tri) out.capIndices.push_back(base + t);
  }
  return out;
}

}  // namespace webifc::geometry
