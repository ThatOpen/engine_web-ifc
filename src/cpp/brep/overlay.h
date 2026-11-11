// overlay.h — the per-plane winding overlay: split darts at mutual crossings, propagate the winding
// number combinatorially, emit each covered cell as one facet ring. Port of overlay.ts.
#pragma once

#include <cstdint>
#include <optional>
#include <vector>

#include "curves.h"  // P3

namespace brep {

// What the overlay needs from the topology: coordinates, the weld, and its resolution.
// C++: the TS object literal becomes a small subclass (e.g. wrapping a LinkedShellGraph).
struct OverlayGeometry {
  virtual ~OverlayGeometry() = default;
  virtual double pointXOf(int32_t v) const = 0;
  virtual double pointYOf(int32_t v) const = 0;
  virtual double pointZOf(int32_t v) const = 0;
  virtual int32_t placeCorner(double x, double y, double z) = 0;
  double tolerance = 0;
};

inline constexpr int32_t OVERLAY_MAX_RINGS = 64;
inline constexpr int32_t OVERLAY_MAX_DARTS = 600;

// Is this group worth arranging at all? (mixed senses, a dart claimed twice, a collinear overlap,
// or a proper crossing). An exact reverse pair is not suspicious.
bool overlaySuspicious(const std::vector<std::vector<int32_t>>& rings, const P3& normal,
                       const OverlayGeometry& g);

// The overlay itself: covered cells as rings, or nullopt to decline (TS null).
std::optional<std::vector<std::vector<int32_t>>> overlayRings(
    const std::vector<std::vector<int32_t>>& rings, const P3& normal, OverlayGeometry& g);

}  // namespace brep
