/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

// A difference with an unbounded half-space is a cut by one plane: keep the triangles on one side,
// split the ones that straddle it, and close the cut with a cap. No general boolean is needed.
// Returns false, and leaves `out` untouched, whenever the shortcut cannot be exact: an input that is
// not closed, a triangle lying in the plane, or cut loops that do not chain or nest cleanly. The caller
// then runs the general boolean exactly as before.

#pragma once

#include <cmath>
#include <cstdio>
#include <cstdint>
#include <cstdlib>
#include <map>
#include <unordered_map>
#include <vector>
#include <array>
#include <glm/glm.hpp>
#include <mapbox/earcut.hpp>
#include "../representation/IfcGeometry.h"

namespace webifc::geometry {

inline bool PlaneClipEnabled() {
  static const bool on = std::getenv("WEBIFC_PLANE_CLIP") != nullptr;  // opt-in until measured element by element
  return on;
}

namespace planeclip {

// Why the shortcut fell back, counted and printed at exit when WEBIFC_PLANE_CLIP_STATS is set.
struct Stats {
  long tries = 0, done = 0, notClosed = 0, inPlane = 0, chain = 0, nest = 0, earcut = 0, empty = 0;
  ~Stats() { if (std::getenv("WEBIFC_PLANE_CLIP_STATS")) std::fprintf(stderr, "PLANECLIP tries=%ld done=%ld notClosed=%ld inPlane=%ld chain=%ld nest=%ld earcut=%ld empty=%ld\n", tries, done, notClosed, inPlane, chain, nest, earcut, empty); }
};
inline Stats& stats() { static Stats s; return s; }

struct Key {
  int64_t x, y, z;
  bool operator<(const Key& o) const { return x != o.x ? x < o.x : y != o.y ? y < o.y : z < o.z; }
  bool operator==(const Key& o) const { return x == o.x && y == o.y && z == o.z; }
};

inline Key keyOf(const glm::dvec3& p, double q) {
  return {(int64_t)std::llround(p.x / q), (int64_t)std::llround(p.y / q), (int64_t)std::llround(p.z / q)};
}

// Every edge used exactly twice, once in each direction, after welding at the tolerance.
inline bool isClosed(const std::vector<IfcGeometry>& geoms, double q) {
  std::map<Key, uint32_t> ids;
  auto id = [&](const glm::dvec3& p) {
    auto k = keyOf(p, q);
    auto it = ids.find(k);
    if (it != ids.end()) return it->second;
    uint32_t n = (uint32_t)ids.size();
    ids.emplace(k, n);
    return n;
  };
  std::unordered_map<uint64_t, int> darts;
  for (const auto& g : geoms)
    for (uint32_t f = 0; f < g.numFaces; f++) {
      uint32_t v[3];
      for (int k = 0; k < 3; k++) v[k] = id(g.GetPoint(g.indexData[f * 3 + k]));
      if (v[0] == v[1] || v[1] == v[2] || v[2] == v[0]) continue;
      for (int k = 0; k < 3; k++) {
        const uint64_t a = v[k], b = v[(k + 1) % 3];
        darts[(a << 32) | b]++;
      }
    }
  for (const auto& [k, n] : darts) {
    const uint64_t a = k >> 32, b = k & 0xffffffffull;
    auto it = darts.find((b << 32) | a);
    if (n != 1 || it == darts.end() || it->second != 1) return false;
  }
  return !darts.empty();
}

}  // namespace planeclip

// Keep the part of `geoms` where dot(keepNormal, p - point) >= 0.
inline bool ClipByPlane(const std::vector<IfcGeometry>& geoms, const glm::dvec3& point, glm::dvec3 keepNormal,
                        IfcGeometry& out) {
  using namespace planeclip;
  const double nl = glm::length(keepNormal);
  stats().tries++;
  if (!(nl > 0)) return false;
  keepNormal /= nl;

  glm::dvec3 lo(1e300), hi(-1e300);
  size_t faces = 0;
  for (const auto& g : geoms) {
    faces += g.numFaces;
    for (uint32_t i = 0; i < g.numPoints; i++) {
      const glm::dvec3 p = g.GetPoint(i);
      lo = glm::min(lo, p);
      hi = glm::max(hi, p);
    }
  }
  if (faces == 0) return false;
  const double size = glm::length(hi - lo);
  const double tol = 1e-9 * size + 1e-12;  // "on the plane"
  const double weld = 1e-7 * size + 1e-10;  // same point
  if (!isClosed(geoms, weld)) { stats().notClosed++; return false; }

  IfcGeometry result;
  // Cut segments, directed for the cap: the reverse of the kept face's edge that lies in the plane.
  std::vector<std::pair<glm::dvec3, glm::dvec3>> segments;

  for (const auto& g : geoms)
    for (uint32_t f = 0; f < g.numFaces; f++) {
      glm::dvec3 p[3];
      double d[3];
      int s[3];
      for (int k = 0; k < 3; k++) {
        p[k] = g.GetPoint(g.indexData[f * 3 + k]);
        d[k] = glm::dot(keepNormal, p[k] - point);
        s[k] = d[k] > tol ? 1 : d[k] < -tol ? -1 : 0;
      }
      if (s[0] == 0 && s[1] == 0 && s[2] == 0) { stats().inPlane++; return false; }  // a face in the plane: not this shortcut
      if (s[0] <= 0 && s[1] <= 0 && s[2] <= 0) continue;     // wholly removed (may touch the plane)
      // The kept polygon of this triangle, in order, with on-plane flags.
      std::vector<glm::dvec3> poly;
      std::vector<bool> on;
      for (int k = 0; k < 3; k++) {
        const int j = (k + 1) % 3;
        if (s[k] >= 0) {
          poly.push_back(p[k]);
          on.push_back(s[k] == 0);
        }
        if ((s[k] > 0 && s[j] < 0) || (s[k] < 0 && s[j] > 0)) {
          const double t = d[k] / (d[k] - d[j]);
          poly.push_back(p[k] + (p[j] - p[k]) * t);
          on.push_back(true);
        }
      }
      if (poly.size() < 3) continue;
      for (size_t k = 1; k + 1 < poly.size(); k++) result.AddFace(poly[0], poly[k], poly[k + 1]);
      for (size_t k = 0; k < poly.size(); k++) {
        const size_t j = (k + 1) % poly.size();
        if (on[k] && on[j]) segments.push_back({poly[j], poly[k]});
      }
    }

  if (!segments.empty()) {
    // Chain the segments into loops through welded endpoints: each point leaves exactly once.
    std::map<Key, size_t> outgoing;
    for (size_t i = 0; i < segments.size(); i++) {
      auto k = keyOf(segments[i].first, weld);
      if (outgoing.count(k)) { stats().chain++; return false; }
      outgoing.emplace(k, i);
    }
    std::vector<bool> used(segments.size(), false);
    std::vector<std::vector<glm::dvec3>> loops;
    for (size_t i = 0; i < segments.size(); i++) {
      if (used[i]) continue;
      std::vector<glm::dvec3> loop;
      size_t at = i;
      while (!used[at]) {
        used[at] = true;
        loop.push_back(segments[at].first);
        auto it = outgoing.find(keyOf(segments[at].second, weld));
        if (it == outgoing.end()) { stats().chain++; return false; }
        at = it->second;
      }
      if (at != i) { stats().chain++; return false; }  // ran into another loop's middle
      if (loop.size() >= 3) loops.push_back(std::move(loop));
    }

    // Project onto the plane, with (u, v) such that u x v is the cap's normal (out of the kept part).
    const glm::dvec3 capN = -keepNormal;
    glm::dvec3 u = std::fabs(capN.x) < 0.9 ? glm::dvec3(1, 0, 0) : glm::dvec3(0, 1, 0);
    u = glm::normalize(u - capN * glm::dot(u, capN));
    const glm::dvec3 v = glm::cross(capN, u);
    std::vector<std::vector<std::array<double, 2>>> flat(loops.size());
    std::vector<double> area(loops.size(), 0);
    for (size_t l = 0; l < loops.size(); l++) {
      for (const auto& q : loops[l]) flat[l].push_back({glm::dot(q - point, u), glm::dot(q - point, v)});
      const auto& c = flat[l];
      for (size_t k = 0; k < c.size(); k++) {
        const auto& a = c[k];
        const auto& b = c[(k + 1) % c.size()];
        area[l] += a[0] * b[1] - b[0] * a[1];
      }
    }
    auto inside = [](const std::array<double, 2>& pt, const std::vector<std::array<double, 2>>& poly) {
      bool in = false;
      for (size_t i = 0, j = poly.size() - 1; i < poly.size(); j = i++) {
        const auto& a = poly[i];
        const auto& b = poly[j];
        if ((a[1] > pt[1]) != (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) in = !in;
      }
      return in;
    };
    // Outer loops run counter-clockwise about the cap normal, holes clockwise; each hole goes to the
    // smallest outer loop around it.
    std::vector<int> owner(loops.size(), -1);
    for (size_t h = 0; h < loops.size(); h++) {
      if (area[h] >= 0) continue;
      double best = 1e300;
      for (size_t o = 0; o < loops.size(); o++)
        if (area[o] > 0 && area[o] < best && inside(flat[h][0], flat[o])) {
          best = area[o];
          owner[h] = (int)o;
        }
      if (owner[h] < 0) { stats().nest++; return false; }
    }
    for (size_t o = 0; o < loops.size(); o++) {
      if (area[o] <= 0) continue;
      std::vector<std::vector<std::array<double, 2>>> polygon{flat[o]};
      std::vector<glm::dvec3> pts(loops[o]);
      for (size_t h = 0; h < loops.size(); h++)
        if (owner[h] == (int)o) {
          polygon.push_back(flat[h]);
          pts.insert(pts.end(), loops[h].begin(), loops[h].end());
        }
      const std::vector<uint32_t> tri = mapbox::earcut<uint32_t>(polygon);
      if (tri.empty()) { stats().earcut++; return false; }
      for (size_t k = 0; k + 2 < tri.size(); k += 3) result.AddFace(pts[tri[k]], pts[tri[k + 1]], pts[tri[k + 2]]);
    }
  }

  if (result.numFaces == 0) { stats().empty++; return false; }
  stats().done++;
  out = std::move(result);
  return true;
}

}  // namespace webifc::geometry
