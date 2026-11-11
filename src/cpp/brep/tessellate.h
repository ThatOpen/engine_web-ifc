// tessellate.h — triangulate a bounded region, every decision by an exact sign. Port of tessellate.ts.
#pragma once

#include <cmath>
#include <cstdint>
#include <functional>
#include <span>
#include <vector>

#include "curves.h"
#include "topology.h"

namespace brep {

// One edge a minted corner lies on: t runs 0 at a to 1 at b.
struct MintEdge {
  int32_t a;
  int32_t b;
  double t;
};

// Create a vertex between existing ones (first entry canonical); negative declines.
using MintVertex = std::function<int32_t(std::span<const MintEdge>)>;

// Vertex pairs the mesh already carries, so the clipper prefers not to choose them as a diagonal.
using PairTaken = std::function<bool(int32_t, int32_t)>;

// A ring in the plane, as flat xy pairs, plus the vertex ids the caller wants back.
struct FlatRing {
  std::vector<double> xy;
  std::vector<int32_t> ids;
};

// The work one triangulation may spend, shared across every split it makes.
struct WorkBudget {
  int64_t clip;  // candidate corners the ear clipper may examine
  int64_t scan;  // orientation predicates the self-crossing scan may spend
};

// Why a facet was refused. reason == nullptr is TS `undefined`; reasons are static literals.
struct TriangulationReport {
  bool exhausted = false;
  const char* reason = nullptr;
};

// Switchable only so the crossing scan's cost can be isolated.
void setCrossingScan(bool on);
// Put sliver ears off to the second pass (off by default).
void setAvoidSliverEars(bool on);

// Project a 3D ring onto the coordinate plane where it is largest. forceDrop: -1 = TS undefined,
// else 0 | 1 | 2. Generic over the coordinate readers so a hot caller pays no std::function call.
template <class FX, class FY, class FZ>
FlatRing projectRingWith(std::span<const int32_t> ring, const FX& pointXOf, const FY& pointYOf,
                         const FZ& pointZOf, int forceDrop = -1) {
#ifdef __clang__
#pragma clang fp contract(off)
#endif
  const size_t n = ring.size();
  double nx = 0, ny = 0, nz = 0;
  for (size_t i = 0; i < n; i++) {
    const int32_t a = ring[i], b = ring[(i + 1) % n];
    const double aCoordX = pointXOf(a), aCoordY = pointYOf(a), aCoordZ = pointZOf(a);
    const double bCoordX = pointXOf(b), bCoordY = pointYOf(b), bCoordZ = pointZOf(b);
    nx += (aCoordY - bCoordY) * (aCoordZ + bCoordZ);
    ny += (aCoordZ - bCoordZ) * (aCoordX + bCoordX);
    nz += (aCoordX - bCoordX) * (aCoordY + bCoordY);
  }
  const double ax = std::fabs(nx), ay = std::fabs(ny), az = std::fabs(nz);
  const int drop = forceDrop >= 0 ? forceDrop : (ax >= ay && ax >= az ? 0 : ay >= az ? 1 : 2);

  FlatRing out;
  out.xy.resize(n * 2);
  double* xy = out.xy.data();
  for (size_t i = 0; i < n; i++) {
    const int32_t v = ring[i];
    if (drop == 0) {
      xy[i * 2] = pointYOf(v);
      xy[i * 2 + 1] = pointZOf(v);
    } else if (drop == 1) {
      xy[i * 2] = pointZOf(v);
      xy[i * 2 + 1] = pointXOf(v);
    } else {
      xy[i * 2] = pointXOf(v);
      xy[i * 2 + 1] = pointYOf(v);
    }
  }
  const bool flip = (drop == 0 ? nx : drop == 1 ? ny : nz) < 0;
  if (flip)
    for (size_t i = 0; i < n; i++) xy[i * 2 + 1] = -xy[i * 2 + 1];
  out.ids.assign(ring.begin(), ring.end());
  return out;
}

// The TS signature: coordinate readers as callbacks.
FlatRing projectRing(std::span<const int32_t> ring, const PointOf& pointXOf,
                     const PointOf& pointYOf, const PointOf& pointZOf, int forceDrop = -1);
// C++ only: the overwhelmingly common call, reading a graph's coordinates directly.
FlatRing projectRing(std::span<const int32_t> ring, const LinkedShellGraph& graph,
                     int forceDrop = -1);

// Triangulate a ring by clipping ears. Returns vertex-id triples, or empty on refusal.
// Null / empty arguments are TS `undefined`.
std::vector<int32_t> triangleRing(const FlatRing& ring, TriangulationReport* report = nullptr,
                                  WorkBudget* shared = nullptr, const MintVertex& mint = {},
                                  const PairTaken& taken = {});

}  // namespace brep
