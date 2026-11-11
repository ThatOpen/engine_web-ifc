// build.h — construct solids (prism, carved prism, loft, revolve, sweeps) and hand them back as
// triangles. Port of build.ts.
#pragma once

#include <array>
#include <cstdint>
#include <memory>
#include <optional>
#include <string>
#include <utility>
#include <variant>
#include <vector>

#include "curves.h"  // P3
#include "shell.h"   // AssembledShell

namespace brep {

class LinkedShellGraph;  // topology.h

// Shared decline type (`{ reason: string }` in TS). Guarded: any module may declare the same struct.
#ifndef BREP_DECLINE_DEFINED
#define BREP_DECLINE_DEFINED
struct Decline {
  std::string reason;
};
#endif

// A triangle mesh: interleaved xyz positions and triangle indices into them.
struct TriangleBatch {
  std::vector<double> positions;
  std::vector<uint32_t> indices;
};

// The optional `report?: { reason?: string }` the constructors fill when they refuse.
struct BuildReport {
  std::optional<std::string> reason;
};

// Newell normal of a closed ring, corners taken relative to the first. [0,0,0] below three.
template <class FX, class FY, class FZ>
inline P3 ringNormal(int32_t count, FX&& pointXOf, FY&& pointYOf, FZ&& pointZOf) {
  if (count < 3) return {0, 0, 0};
  const double ox = pointXOf(0), oy = pointYOf(0), oz = pointZOf(0);
  double nx = 0, ny = 0, nz = 0;
  for (int32_t i = 0; i < count; i++) {
    const int32_t j = (i + 1) % count;
    const double ax = pointXOf(i) - ox, ay = pointYOf(i) - oy, az = pointZOf(i) - oz;
    const double bx = pointXOf(j) - ox, by = pointYOf(j) - oy, bz = pointZOf(j) - oz;
    nx += ay * bz - az * by;
    ny += az * bx - ax * bz;
    nz += ax * by - ay * bx;
  }
  return {nx, ny, nz};
}

// Indices of the ring's corners kept once zero-width spikes (X, Y, X) are peeled; never below three.
std::vector<int32_t> spikeFreeCorners(const std::vector<P3>& ring);

// Sweep a closed, positioned profile along a vector and cap both ends; nullptr (+reason) on refusal.
std::unique_ptr<LinkedShellGraph> pushProfile(const std::vector<P3>& profile, const P3& sweep,
                                              BuildReport* report = nullptr);

// Prism with voids built directly: caps carved round the voids, a wall round every ring.
std::unique_ptr<LinkedShellGraph> pushProfileWithVoids(const std::vector<P3>& profile,
                                                       const std::vector<std::vector<P3>>& voids,
                                                       const P3& sweep,
                                                       BuildReport* report = nullptr);

// Loft between two closed profiles with the same corner count (tapered extrusion).
std::unique_ptr<LinkedShellGraph> loftProfiles(const std::vector<P3>& start,
                                               const std::vector<P3>& end,
                                               BuildReport* report = nullptr);

// Swing a closed profile about an axis through a signed angle in `steps` stations.
std::unique_ptr<LinkedShellGraph> revolveProfile(const std::vector<P3>& profile,
                                                 const P3& spindleOrigin, const P3& spindleDir,
                                                 double angle, double steps,
                                                 BuildReport* report = nullptr);

// How the section is turned about the directrix (TS SectionOrientation union).
struct SectionOrientation {
  enum class Kind { normal, ruling };
  Kind kind = Kind::normal;
  P3 dir{0, 0, 0};
};

// A graph, or the reason it was declined (TS `LinkedShellGraph | { reason: string }`).
using SweepResult = std::variant<std::unique_ptr<LinkedShellGraph>, Decline>;

// Sweep a closed section ([u, v] pairs) along a polyline, mitred at every joint.
SweepResult profileSweep(const std::vector<P3>& directrix,
                         const std::vector<std::array<double, 2>>& section,
                         const std::optional<SectionOrientation>& orient = std::nullopt);

// Sweep a disk (or annulus, with a bore) along a polyline: the pipe.
SweepResult tubeSweep(const std::vector<P3>& directrix, double radius,
                      std::optional<double> tubeHollowRadius, int32_t facets);

// toTriangles result. `why` keeps TS Map insertion order.
struct ToTrianglesResult {
  TriangleBatch mesh;
  int32_t dropped = 0;
  int32_t exhausted = 0;
  std::vector<std::pair<std::string, int32_t>> why;
};

// Triangulate every facet into one mesh. Mutates the graph only by minting repair corners.
ToTrianglesResult toTriangles(LinkedShellGraph& graph);

// A closed solid from a triangle soup: weld, rejoin coplanar neighbours, assemble the shell.
AssembledShell shellFromTriangleSoup(const std::vector<std::vector<P3>>& triangles);

// Knobs (module-level state in TS), all default true.
void setRejoinCoplanar(bool on);
void setCancelOppositeSlivers(bool on);
void setCullSubWeldLumps(bool on);

}  // namespace brep
