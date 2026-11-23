// curves.h — arcs and splines as the polylines the topology can hold. Port of curves.ts.
#pragma once

#include <array>
#include <cstdint>
#include <functional>
#include <optional>
#include <vector>

namespace brep {

// A point in space, [x, y, z].
using P3 = std::array<double, 3>;

// C++ only: a per-vertex coordinate reader, the TS `(v: number) => number` callbacks.
using PointOf = std::function<double(int32_t)>;

// C++ only: JS `Math` with V8's exact results (node 22: fdlibm trig, scaled Kahan hypot), so ports
// that call Math.* stay bit-identical to the TS. The C runtime's sin/cos/atan2/hypot differ by ulps.
double jsSin(double x);
double jsCos(double x);
double jsAtan(double x);
double jsAtan2(double y, double x);
double jsHypot3(double x, double y, double z);  // Math.hypot(x, y, z)
double jsHypot2(double x, double y);            // Math.hypot(x, y)
double jsRound(double x);                       // Math.round: halves towards +infinity
double jsMax(double a, double b);               // Math.max: NaN wins, +0 beats -0
double jsMin(double a, double b);               // Math.min: NaN wins, -0 beats +0

// Facets per full turn; shared by every curve so one shape has one granularity.
inline constexpr int32_t SIDES_PER_REVOLUTION = 12;

// And more where that leaves the facets farther than this from the curve (metres): an arc of 85 degrees and 9 m of radius
// was three straight sides, 27 cm off it. A radius under 0.29 m keeps the twelve. At most ARC_MOST_SIDES per full turn.
inline constexpr double ARC_SAGITTA_METRES = 0.01;
inline constexpr int32_t ARC_MOST_SIDES = 96;

// The sagitta in the file's unit, set per model; 0 (until set) keeps SIDES_PER_REVOLUTION at every radius.
void setArcSagitta(double t);

// How many segments an arc of this sweep, and of this radius in the file's unit, gets; always at least one.
int32_t facetsForSweep(double sweep, double radius = 0);

// Samples of a planar arc from `from` to `from + sweep`, endpoints included. `sized`, the radius its facets are counted for, when it
// is not `radius` (an ellipse sampled on the unit circle).
std::vector<P3> arcStations(const P3& centre, const P3& ex, const P3& ey, double radius,
                            double from, double sweep, double sized = 0);

// Return shape of circleByThreePoints.
struct CircleByThreePointsResult {
  std::vector<P3> points;  // samples a..c inclusive, or the chord
  bool arcBow = false;     // true when the bulge was absurd and the chord was returned
};

// The arc through a, b, c sampled from a to c; the chord when not recoverable.
CircleByThreePointsResult circleByThreePoints(const P3& a, const P3& b, const P3& c);

// Sample a (rational when weights != nullptr) B-spline by de Boor; nullopt = TS null.
// `degree` is a double as in TS (the reader passes the file's number unchecked; NaN/fractional -> null).
std::optional<std::vector<P3>> bSplineSamples(double degree, const std::vector<P3>& control,
                                              const std::vector<double>& knots,
                                              const std::vector<double>& multiplicities,
                                              const std::vector<double>* weights,
                                              double samples);

// Append a run to a chain, dropping a leading point equal to the chain's last.
void appendRun(std::vector<P3>& chain, const std::vector<P3>& run);

// The chain without a trailing point that repeats the first (a copy; TS may return the input).
std::vector<P3> unclosedRing(const std::vector<P3>& chain);

}  // namespace brep
