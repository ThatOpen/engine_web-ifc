// sign.cpp — exact-sign orientation predicates. Port of sign.ts.
// Bit-faithful to the TS: operation order matters and no FMA contraction may happen (JS never fuses).
#pragma STDC FP_CONTRACT OFF
#if defined(__clang__)
#pragma clang fp contract(off)
#endif

#include "sign.h"

#include <cmath>

namespace brep {

namespace {

struct Pair {
  double a, b;
};

// Rounding-error residue of a sum.
inline Pair sumResidue(double a, double b) {
  const double s = a + b;
  const double bVirtual = s - a;
  const double aVirtual = s - bVirtual;
  return {s, a - aVirtual + (b - bVirtual)};
}

// Same for a difference.
inline Pair diffResidue(double a, double b) {
  const double s = a - b;
  const double bVirtual = a - s;
  const double aVirtual = s + bVirtual;
  return {s, a - aVirtual + (bVirtual - b)};
}

constexpr double DEKKER_SCALE = 134217729.0;  // 2^27 + 1
constexpr double ROUNDING_UNIT = 1.1102230246251565e-16;  // 2^-53
constexpr double ORIENT_BOUND = (3 + 16 * ROUNDING_UNIT) * ROUNDING_UNIT;
constexpr double PLANE_BOUND = (7 + 56 * ROUNDING_UNIT) * ROUNDING_UNIT;

inline Pair halves(double a) {
  const double c = DEKKER_SCALE * a;
  const double big = c - a;
  const double hi = c - big;
  return {hi, a - hi};
}

// Rounding-error residue of a product, via the split above.
inline Pair prodResidue(double a, double b) {
  const double p = a * b;
  const Pair ah = halves(a);
  const Pair bh = halves(b);
  const double err = ah.a * bh.a - p + ah.a * bh.b + ah.b * bh.a + ah.b * bh.b;
  return {p, err};
}

// Leading value plus accumulated residue (double-double).
struct Wide {
  double hi, lo;
};

inline Wide renormalize(double hi, double lo) {
  const Pair r = sumResidue(hi, lo);
  return {r.a, r.b};
}

inline Wide wideAdd(const Wide& a, const Wide& b) {
  const Pair r = sumResidue(a.hi, b.hi);
  return renormalize(r.a, r.b + a.lo + b.lo);
}

inline Wide wideSub(const Wide& a, const Wide& b) {
  const Pair r = diffResidue(a.hi, b.hi);
  return renormalize(r.a, r.b + a.lo - b.lo);
}

inline Wide wideMul(const Wide& a, const Wide& b) {
  const Pair r = prodResidue(a.hi, b.hi);
  return renormalize(r.a, r.b + (a.hi * b.lo + a.lo * b.hi));
}

// An exact difference of two plain doubles.
inline Wide exactDiff(double a, double b) {
  const Pair r = diffResidue(a, b);
  return {r.a, r.b};
}

// The slow path: compensated 3x3 determinant.
int compensatedSide(const Wide& aDeltaX, const Wide& aDeltaY, const Wide& aDeltaZ,
                    const Wide& bDeltaX, const Wide& bDeltaY, const Wide& bDeltaZ,
                    const Wide& cDeltaX, const Wide& cDeltaY, const Wide& cDeltaZ) {
  const Wide m1 = wideSub(wideMul(bDeltaX, cDeltaY), wideMul(cDeltaX, bDeltaY));
  const Wide m2 = wideSub(wideMul(cDeltaX, aDeltaY), wideMul(aDeltaX, cDeltaY));
  const Wide m3 = wideSub(wideMul(aDeltaX, bDeltaY), wideMul(bDeltaX, aDeltaY));

  const Wide total =
      wideAdd(wideAdd(wideMul(aDeltaZ, m1), wideMul(bDeltaZ, m2)), wideMul(cDeltaZ, m3));

  const double v = total.hi != 0 ? total.hi : total.lo;
  return v > 0 ? 1 : v < 0 ? -1 : 0;
}

}  // namespace

int sideOfPlane(double ax, double ay, double az, double bx, double by, double bz, double cx,
                double cy, double cz, double dx, double dy, double dz) {
  const double aDeltaX = ax - dx, aDeltaY = ay - dy, aDeltaZ = az - dz;
  const double bDeltaX = bx - dx, bDeltaY = by - dy, bDeltaZ = bz - dz;
  const double cDeltaX = cx - dx, cDeltaY = cy - dy, cDeltaZ = cz - dz;

  const double bxcyProd = bDeltaX * cDeltaY, cxbyProd = cDeltaX * bDeltaY;
  const double cxayProd = cDeltaX * aDeltaY, axcyProd = aDeltaX * cDeltaY;
  const double axbyProd = aDeltaX * bDeltaY, bxayProd = bDeltaX * aDeltaY;

  const double estimate = aDeltaZ * (bxcyProd - cxbyProd) + bDeltaZ * (cxayProd - axcyProd) +
                          cDeltaZ * (axbyProd - bxayProd);

  const double permanent = std::fabs(aDeltaZ) * (std::fabs(bxcyProd) + std::fabs(cxbyProd)) +
                           std::fabs(bDeltaZ) * (std::fabs(cxayProd) + std::fabs(axcyProd)) +
                           std::fabs(cDeltaZ) * (std::fabs(axbyProd) + std::fabs(bxayProd));
  const double bound = PLANE_BOUND * permanent;

  if (estimate > bound) return 1;
  if (-estimate > bound) return -1;
  if (permanent == 0) return 0;

  return compensatedSide(exactDiff(ax, dx), exactDiff(ay, dy), exactDiff(az, dz), exactDiff(bx, dx),
                         exactDiff(by, dy), exactDiff(bz, dz), exactDiff(cx, dx), exactDiff(cy, dy),
                         exactDiff(cz, dz));
}

int lineSideExact(double ax, double ay, double bx, double by, double cx, double cy) {
  const double left = (ax - cx) * (by - cy);
  const double right = (ay - cy) * (bx - cx);
  const double estimate = left - right;

  const double permanent = std::fabs(left) + std::fabs(right);
  const double bound = ORIENT_BOUND * permanent;
  if (estimate > bound) return 1;
  if (-estimate > bound) return -1;
  if (permanent == 0) return 0;

  const Wide p = wideMul(exactDiff(ax, cx), exactDiff(by, cy));
  const Wide q = wideMul(exactDiff(ay, cy), exactDiff(bx, cx));
  const Wide total = wideSub(p, q);
  const double v = total.hi != 0 ? total.hi : total.lo;
  return v > 0 ? 1 : v < 0 ? -1 : 0;
}

}  // namespace brep
