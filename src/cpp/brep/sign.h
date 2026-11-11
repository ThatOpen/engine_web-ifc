// sign.h — exact-sign orientation predicates. Port of sign.ts.
#pragma once

#include <cmath>

namespace brep {

// Side of plane (a, b, c) on which d lies: +1, -1, or 0 for exactly coplanar.
int sideOfPlane(double ax, double ay, double az, double bx, double by, double bz, double cx,
                double cy, double cz, double dx, double dy, double dz);

// Side of directed line a->b on which c lies: +1 left, -1 right, 0 on it.
int lineSideExact(double ax, double ay, double bx, double by, double cx, double cy);

// lineSide is called in the hottest loops: its floating-point filter is inline, and only the near-zero
// cases (the filter cannot tell) go to lineSideExact, which repeats the filter and then works exactly.
inline int lineSide(double ax, double ay, double bx, double by, double cx, double cy) {
  constexpr double ROUNDING_UNIT = 1.1102230246251565e-16;  // 2^-53, as in sign.cpp
  constexpr double ORIENT_BOUND = (3 + 16 * ROUNDING_UNIT) * ROUNDING_UNIT;
  const double left = (ax - cx) * (by - cy);
  const double right = (ay - cy) * (bx - cx);
  const double estimate = left - right;
  const double bound = ORIENT_BOUND * (std::fabs(left) + std::fabs(right));
  if (estimate > bound) return 1;
  if (-estimate > bound) return -1;
  return lineSideExact(ax, ay, bx, by, cx, cy);
}

}  // namespace brep
