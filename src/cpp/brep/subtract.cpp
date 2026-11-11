// subtract.cpp — port of subtract.ts. Same algorithm, decisions, tolerances and iteration order.
//
// C++ notes:
//  - A TS `RingCorner` is a mutable P3 object shared by reference (rings, anchors, the corner cache
//    all alias it, and `tagPlanes` rewrites `.on` in place), so corners live in a per-operation pool
//    and rings hold pointers: identity (`a === b`) is pointer equality.
//  - String keys built from numbers are replaced by keys with the same equality: JS number-to-string
//    equality is double equality with +0 == -0 and NaN == NaN; `toFixed(9)` is reproduced exactly.
//  - Math.hypot and Math.atan2 are reimplemented as V8 computes them, so results are bit-identical.

#include "subtract.h"

#include <algorithm>
#include <bit>
#include <charconv>
#include <chrono>
#include <cmath>
#include <cstring>
#include <deque>
#include <map>
#include <set>
#include <unordered_map>
#include <unordered_set>

#include "overlay.h"
#include "shell.h"
#include "sign.h"
#include "tessellate.h"

#ifdef __clang__
#pragma clang fp contract(off)
#endif

namespace brep {

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// JS number semantics
// ═════════════════════════════════════════════════════════════════════════════════════════════════
namespace {

constexpr double kInf = std::numeric_limits<double>::infinity();
constexpr double kNaN = std::numeric_limits<double>::quiet_NaN();
constexpr double kPI = 3.141592653589793;

// V8's Math.hypot: normalise by the largest magnitude, Kahan-sum the squares.
inline double jsHypot(double x, double y, double z) {
  const double v[3] = {x, y, z};
  double a[3] = {0, 0, 0};
  bool nan = false;
  double max = 0;
  for (int i = 0; i < 3; i++) {
    if (v[i] != v[i]) {
      nan = true;
    } else {
      a[i] = std::fabs(v[i]);
      if (a[i] > max) max = a[i];
    }
  }
  if (max == kInf) return kInf;
  if (nan) return kNaN;
  if (max == 0) return 0;
  double sum = 0, compensation = 0;
  for (int i = 0; i < 3; i++) {
    const double n = a[i] / max;
    const double summand = n * n - compensation;
    const double preliminary = sum + summand;
    compensation = (preliminary - sum) - summand;
    sum = preliminary;
  }
  return std::sqrt(sum) * max;
}

// fdlibm atan / atan2 (V8's base::ieee754), so Math.atan2 is bit-identical.
inline int32_t highWord(double d) {
  return static_cast<int32_t>(std::bit_cast<uint64_t>(d) >> 32);
}
inline uint32_t lowWord(double d) { return static_cast<uint32_t>(std::bit_cast<uint64_t>(d)); }

double fdAtan(double x) {
  static const double atanhi[] = {4.63647609000806093515e-01, 7.85398163397448278999e-01,
                                  9.82793723247329054082e-01, 1.57079632679489655800e+00};
  static const double atanlo[] = {2.26987774529616870924e-17, 3.06161699786838301793e-17,
                                  1.39033110312309984516e-17, 6.12323399573676603587e-17};
  static const double aT[] = {
      3.33333333333329318027e-01,  -1.99999999998764832476e-01, 1.42857142725034663711e-01,
      -1.11111104054623557880e-01, 9.09088713343650656196e-02,  -7.69187620504482999495e-02,
      6.66107313738753120669e-02,  -5.83357013379057348645e-02, 4.97687799461593236017e-02,
      -3.65315727442169155270e-02, 1.62858201153657823623e-02};
  const double one = 1.0, huge = 1.0e300;
  double w, s1, s2, z;
  int32_t ix, hx, id;
  hx = highWord(x);
  ix = hx & 0x7fffffff;
  if (ix >= 0x44100000) {
    const uint32_t low = lowWord(x);
    if (ix > 0x7ff00000 || (ix == 0x7ff00000 && (low != 0))) return x + x;
    if (hx > 0) return atanhi[3] + atanlo[3];
    return -atanhi[3] - atanlo[3];
  }
  if (ix < 0x3fdc0000) {
    if (ix < 0x3e400000) {
      if (huge + x > one) return x;
    }
    id = -1;
  } else {
    x = std::fabs(x);
    if (ix < 0x3ff30000) {
      if (ix < 0x3fe60000) {
        id = 0;
        x = (2.0 * x - one) / (2.0 + x);
      } else {
        id = 1;
        x = (x - one) / (x + one);
      }
    } else {
      if (ix < 0x40038000) {
        id = 2;
        x = (x - 1.5) / (one + 1.5 * x);
      } else {
        id = 3;
        x = -1.0 / x;
      }
    }
  }
  z = x * x;
  w = z * z;
  s1 = z * (aT[0] + w * (aT[2] + w * (aT[4] + w * (aT[6] + w * (aT[8] + w * aT[10])))));
  s2 = w * (aT[1] + w * (aT[3] + w * (aT[5] + w * (aT[7] + w * aT[9]))));
  if (id < 0) return x - x * (s1 + s2);
  z = atanhi[id] - ((x * (s1 + s2) - atanlo[id]) - x);
  return (hx < 0) ? -z : z;
}

double jsAtan2(double y, double x) {
  const double tiny = 1.0e-300;
  const double pi_o_4 = 7.8539816339744827900E-01, pi_o_2 = 1.5707963267948965580E+00,
               pi = 3.1415926535897931160E+00, pi_lo = 1.2246467991473531772E-16;
  double z;
  int32_t k, m, hx, hy, ix, iy;
  uint32_t lx, ly;
  hx = highWord(x);
  lx = lowWord(x);
  ix = hx & 0x7fffffff;
  hy = highWord(y);
  ly = lowWord(y);
  iy = hy & 0x7fffffff;
  if (((static_cast<uint32_t>(ix) | ((lx | (0u - lx)) >> 31)) > 0x7ff00000u) ||
      ((static_cast<uint32_t>(iy) | ((ly | (0u - ly)) >> 31)) > 0x7ff00000u))
    return x + y;
  if (((hx - 0x3ff00000) | static_cast<int32_t>(lx)) == 0) return fdAtan(y);
  m = ((hy >> 31) & 1) | ((hx >> 30) & 2);
  if ((iy | static_cast<int32_t>(ly)) == 0) {
    switch (m) {
      case 0:
      case 1:
        return y;
      case 2:
        return pi + tiny;
      case 3:
        return -pi - tiny;
    }
  }
  if ((ix | static_cast<int32_t>(lx)) == 0) return (hy < 0) ? -pi_o_2 - tiny : pi_o_2 + tiny;
  if (ix == 0x7ff00000) {
    if (iy == 0x7ff00000) {
      switch (m) {
        case 0:
          return pi_o_4 + tiny;
        case 1:
          return -pi_o_4 - tiny;
        case 2:
          return 3.0 * pi_o_4 + tiny;
        case 3:
          return -3.0 * pi_o_4 - tiny;
      }
    } else {
      switch (m) {
        case 0:
          return 0.0;
        case 1:
          return -0.0;
        case 2:
          return pi + tiny;
        case 3:
          return -pi - tiny;
      }
    }
  }
  if (iy == 0x7ff00000) return (hy < 0) ? -pi_o_2 - tiny : pi_o_2 + tiny;
  k = (iy - ix) >> 20;
  if (k > 60) {
    z = pi_o_2 + 0.5 * pi_lo;
    m &= 1;
  } else if (hx < 0 && k < -60) {
    z = 0.0;
  } else {
    z = fdAtan(std::fabs(y / x));
  }
  switch (m) {
    case 0:
      return z;
    case 1:
      return -z;
    case 2:
      return pi - (z - pi_lo);
    default:
      return (z - pi_lo) - pi;
  }
}

// JS truthiness of a number: false for 0, -0 and NaN.
inline bool truthy(double v) { return v == v && v != 0; }
// `a || b` on numbers.
inline double orElse(double a, double b) { return truthy(a) ? a : b; }

inline double jsMin(double a, double b) {
  if (a != a || b != b) return kNaN;
  if (a == b) return std::signbit(a) ? a : b;
  return a < b ? a : b;
}
inline double jsMax(double a, double b) {
  if (a != a || b != b) return kNaN;
  if (a == b) return std::signbit(a) ? b : a;
  return a > b ? a : b;
}

// ToInt32 (`x | 0`).
inline int32_t toInt32(double d) {
  if (!std::isfinite(d)) return 0;
  double t = std::trunc(d);
  double m = std::fmod(t, 4294967296.0);
  if (m < 0) m += 4294967296.0;
  return static_cast<int32_t>(static_cast<uint32_t>(static_cast<uint64_t>(m)));
}

// Equality key of `String(x)`: +0 and -0 print alike, every NaN prints "NaN".
inline uint64_t numKey(double d) {
  if (d == 0) return 0;
  if (d != d) return 0x7ff8000000000000ULL;
  return std::bit_cast<uint64_t>(d);
}

// JS Number.prototype.toString(), for trace strings only.
std::string jsNum(double d) {
  if (d != d) return "NaN";
  if (d == 0) return "0";
  if (std::isinf(d)) return d > 0 ? "Infinity" : "-Infinity";
  char buf[64];
  auto res = std::to_chars(buf, buf + sizeof buf, d, std::chars_format::scientific);
  std::string s(buf, res.ptr);
  std::string out;
  size_t at = 0;
  if (s[0] == '-') {
    out = "-";
    at = 1;
  }
  const size_t e = s.find('e');
  std::string digits;
  for (size_t i = at; i < e; i++)
    if (s[i] != '.') digits += s[i];
  const int exp10 = std::stoi(s.substr(e + 1));
  const int k = static_cast<int>(digits.size());
  const int n = exp10 + 1;
  if (k <= n && n <= 21) {
    out += digits + std::string(n - k, '0');
  } else if (0 < n && n <= 21) {
    out += digits.substr(0, n) + "." + digits.substr(n);
  } else if (-6 < n && n <= 0) {
    out += "0." + std::string(-n, '0') + digits;
  } else {
    out += digits.substr(0, 1);
    if (k > 1) out += "." + digits.substr(1);
    out += "e";
    out += (n - 1 >= 0) ? "+" : "-";
    out += std::to_string(std::abs(n - 1));
  }
  return out;
}

inline double nowMs() {
  using namespace std::chrono;
  return duration<double, std::milli>(steady_clock::now().time_since_epoch()).count();
}

template <size_t N>
struct ArrayHash {
  size_t operator()(const std::array<uint64_t, N>& a) const {
    uint64_t h = 1469598103934665603ULL;
    for (uint64_t w : a) {
      h ^= w + 0x9e3779b97f4a7c15ULL + (h << 6) + (h >> 2);
      h *= 1099511628211ULL;
    }
    return static_cast<size_t>(h ^ (h >> 29));
  }
};

struct VecHash {
  size_t operator()(const std::vector<int64_t>& v) const {
    uint64_t h = 1469598103934665603ULL ^ v.size();
    for (int64_t w : v) {
      h ^= static_cast<uint64_t>(w) + 0x9e3779b97f4a7c15ULL + (h << 6) + (h >> 2);
      h *= 1099511628211ULL;
    }
    return static_cast<size_t>(h ^ (h >> 29));
  }
};

// `${a}>${b}` for two vertex ids.
inline int64_t dartKey(int32_t a, int32_t b) {
  return (static_cast<int64_t>(a) << 32) | static_cast<uint32_t>(b);
}

}  // namespace

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// Corners, splinters
// ═════════════════════════════════════════════════════════════════════════════════════════════════
namespace {

// A point of a patch ring, carrying which planes it lies on (TS `P3 & { on?: number[] }`).
struct RingCorner {
  double c[3];
  // `on`, sorted and unique, as a slice of the owning PlaneSet's tag pool.
  int32_t onAt = 0;
  int32_t onCount = 0;
  bool tagged = false;  // false = TS `on === undefined`
};
using Ring = std::vector<RingCorner*>;
using Anchor = std::array<RingCorner*, 3>;

enum : int8_t { VIA_NONE = 0, VIA_SUSPECT = 1, VIA_NOCOPLANAR = 2 };
enum : int8_t { BORN_WALK = 0, BORN_SPLIT = 1, BORN_ARRANGEMENT = 2 };

struct BornAt {
  int8_t path;
  int32_t crossings;
  int32_t onPlaneCount;
};

// A planar region carried as a ring of points, with the three points that define its plane.
struct Splinter {
  Ring ring;
  int32_t from = -1;  // -1 = TS undefined
  int8_t via = VIA_NONE;
  bool hasBorn = false;
  BornAt bornAt{};
  Anchor anchor{};
  int32_t plane = 0;
};

struct TwoSides {
  std::vector<Ring> below, above;
};

}  // namespace

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// Module state
// ═════════════════════════════════════════════════════════════════════════════════════════════════
PlaneAudit planeAudit;
SubtractStats stats;

namespace {

enum : uint32_t { TOUCHED_CROSSING = 1u, TOUCHED_COPLANAR_UNCOVERED = 2u };

std::map<std::array<uint64_t, 7>, bool> crossingMethod;
bool auditPlaneBuckets = false;
constexpr int32_t NO_PLANE = -1;
double PARALLEL_ENOUGH = 2e-4;
std::optional<double> planeIdentityDistance;
bool coplanarUncoveredIsOut = true;
bool uncoveredOffPlaneProbe = true;
bool uncoveredIsWall = false;
bool skipUntouchingTools = false;
bool skipThinTools = false;
bool gateCutsByToolBox = true;
bool uncoveredInnerProbe = true;
bool innerFirst = false;
bool dropSecondOnlyWhole = false;
bool peelWeldedSpikes = true;
bool peelPass = false;
bool debugDoubleBuild = false;
bool dropSecondClaimant = true;
bool retryWithoutDropSecond = true;
bool reverseSecondClaimant = false;
bool dropZeroFins = true;
bool planeOverlay = false;
bool snapQuasiFlush = false;
bool evictSurplusRings = true;
double onPlaneTolerance = 1.25e-7;
bool pullSidesAtCut = true;
bool boundaryBySides = true;
bool largestFirst = false;
bool dedupeSubjectFaces = false;
bool refuseDegenerateSeam = false;
bool arrangementSplit = true;
bool identityShortCircuit = true;
bool flushNoOp = true;
double crossSnapRelative = 0;
bool chainAngularNext = false;
bool chainTurnFlip = false;
bool chainDropReversed = false;
double minimumFacetArea = 0;
bool prunePlanes = true;
int32_t planeCap = 256;
int32_t fragmentCap = 20000;
bool shatterCapped = false;
int64_t currentCall = 0;
std::string latestDecline;

enum ClassifyPath : int8_t { NO_COPLANAR = 0, COPLANAR_NOT_COVERED = 1, COVERED_SENSE = 2 };
ClassifyPath lastClassifyPath = NO_COPLANAR;
double lastCoplanarMiss = 0;

const char* pathName(ClassifyPath p) {
  return p == NO_COPLANAR ? "noCoplanar" : p == COPLANAR_NOT_COVERED ? "coplanarNotCovered"
                                                                     : "coveredSense";
}

double planeIdentity() { return planeIdentityDistance ? *planeIdentityDistance : fuseDistance(); }

}  // namespace

void resetPlaneAudit() {
  planeAudit = PlaneAudit{};
  crossingMethod.clear();
}
void setPlaneAudit(bool on) { auditPlaneBuckets = on; }
void setParallelEnough(double x) { PARALLEL_ENOUGH = x; }
double getParallelEnough() { return PARALLEL_ENOUGH; }
void setCoplanarUncoveredIsOut(bool on) { coplanarUncoveredIsOut = on; }
void setUncoveredOffPlaneProbe(bool on) { uncoveredOffPlaneProbe = on; }
void setUncoveredIsWall(bool on) { uncoveredIsWall = on; }
void setSkipThinTools(bool on) { skipThinTools = on; }
void setSkipUntouchingTools(bool on) { skipUntouchingTools = on; }
bool skipUntouchingToolsOn() { return skipUntouchingTools; }
void setGateCutsByToolBox(bool on) { gateCutsByToolBox = on; }
void setUncoveredInnerProbe(bool on) { uncoveredInnerProbe = on; }
void setInnerFirst(bool on) { innerFirst = on; }
void setDropSecondOnlyWhole(bool on) { dropSecondOnlyWhole = on; }
void setPeelWeldedSpikes(bool on) { peelWeldedSpikes = on; }
void forcePeelPass(bool on) { peelPass = on; }
void forceDoubleBuild(bool on) { debugDoubleBuild = on; }
void setDropSecondClaimant(bool on) { dropSecondClaimant = on; }
void setRetryWithoutDropSecond(bool on) { retryWithoutDropSecond = on; }
void setReverseSecondClaimant(bool on) { reverseSecondClaimant = on; }
void setDropZeroFins(bool on) { dropZeroFins = on; }
void setPlaneOverlay(bool on) { planeOverlay = on; }
void setSnapQuasiFlush(bool on) { snapQuasiFlush = on; }
void setEvictSurplusRings(bool on) { evictSurplusRings = on; }
void setOnPlaneTolerance(double x) { onPlaneTolerance = x; }
void setPullSidesAtCut(bool on) { pullSidesAtCut = on; }
void setBoundaryBySides(bool on) { boundaryBySides = on; }
void setLargestFirst(bool on) { largestFirst = on; }
void setDedupeSubjectFaces(bool on) { dedupeSubjectFaces = on; }
void setRefuseDegenerateSeam(bool on) { refuseDegenerateSeam = on; }
void setIdentityShortCircuit(bool on) { identityShortCircuit = on; }
void setFlushNoOp(bool on) { flushNoOp = on; }
void setCrossSnap(double rel) { crossSnapRelative = rel; }
double getCrossSnap() { return crossSnapRelative; }
void setChainDropReversed(bool on) { chainDropReversed = on; }
void setChainAngularNext(bool on) { chainAngularNext = on; }
void setChainTurnFlip(bool on) { chainTurnFlip = on; }
void setArrangementSplit(bool on) { arrangementSplit = on; }
void setMinimumFacetArea(double area) { minimumFacetArea = area; }
void setPlaneIdentityDistance(std::optional<double> metres) { planeIdentityDistance = metres; }
void setPlanePrune(bool on) { prunePlanes = on; }
void setPlaneCap(int32_t n) { planeCap = n; }
void setFragmentCap(int32_t n) { fragmentCap = n; }
double coplanarMiss() { return lastCoplanarMiss; }
std::string classifyPath() { return pathName(lastClassifyPath); }
std::string whySubtractDeclined() { return latestDecline; }

std::vector<std::string> SubtractStats::touchedNames() const {
  std::vector<std::string> out;
  if (touched & TOUCHED_CROSSING) out.emplace_back("crossing");
  if (touched & TOUCHED_COPLANAR_UNCOVERED) out.emplace_back("coplanarUncovered");
  return out;
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// PlaneSet
// ═════════════════════════════════════════════════════════════════════════════════════════════════
namespace {

inline int whichSideOfPlane(const Anchor& plane, const double* p) {
  return sideOfPlane(plane[0]->c[0], plane[0]->c[1], plane[0]->c[2], plane[1]->c[0],
                     plane[1]->c[1], plane[1]->c[2], plane[2]->c[0], plane[2]->c[1],
                     plane[2]->c[2], p[0], p[1], p[2]);
}

// Exact `x.toFixed(9)` equality key: [class | sign << 8, high, low].
void fixed9(double x, uint64_t* out) {
  if (x != x) {
    out[0] = 1;
    out[1] = out[2] = 0;
    return;
  }
  const bool neg = x < 0;
  const double a = std::fabs(x);
  if (a >= 1e21) {
    out[0] = 2 | (static_cast<uint64_t>(neg) << 8);
    out[1] = std::bit_cast<uint64_t>(a);
    out[2] = 0;
    return;
  }
  const uint64_t bits = std::bit_cast<uint64_t>(a);
  const int E = static_cast<int>((bits >> 52) & 0x7ff);
  const uint64_t frac = bits & ((1ULL << 52) - 1);
  uint64_t mant;
  int e;
  if (E == 0) {
    mant = frac;
    e = -1074;
  } else {
    mant = frac | (1ULL << 52);
    e = E - 1075;
  }
  const unsigned __int128 P = static_cast<unsigned __int128>(mant) * 1000000000ULL;
  unsigned __int128 N;
  if (e >= 0) {
    N = P << e;
  } else {
    const int s = -e;
    if (s >= 100) {
      N = 0;
    } else {
      N = P >> s;
      const unsigned __int128 r = P - (N << s);
      const unsigned __int128 half = static_cast<unsigned __int128>(1) << (s - 1);
      if (r >= half) N += 1;  // ties go to the larger n, as toFixed specifies
    }
  }
  out[0] = static_cast<uint64_t>(neg) << 8;
  out[1] = static_cast<uint64_t>(N >> 64);
  out[2] = static_cast<uint64_t>(N);
}

using BinKey = std::array<uint64_t, 13>;

inline uint32_t cellHash(double i, double j, double k) {
  uint32_t h = 0x811c9dc5u;
  h = (h ^ static_cast<uint32_t>(toInt32(i))) * 0x01000193u;
  h = (h ^ static_cast<uint32_t>(toInt32(j))) * 0x01000193u;
  h = (h ^ static_cast<uint32_t>(toInt32(k))) * 0x01000193u;
  return h;
}

struct TripleHash {
  size_t operator()(const std::array<int32_t, 3>& t) const {
    uint64_t h = static_cast<uint32_t>(t[0]);
    h = h * 0x9E3779B97F4A7C15ULL + static_cast<uint32_t>(t[1]);
    h = h * 0x9E3779B97F4A7C15ULL + static_cast<uint32_t>(t[2]);
    return static_cast<size_t>(h ^ (h >> 31));
  }
};

class PlaneSet {
 public:
  std::vector<Anchor> anchors;
  // Storage for every corner's plane tags (RingCorner::onAt / onCount index into it).
  std::vector<int32_t> tagPool;
  int64_t matchedByTolerance = 0;
  int64_t cacheClears = 0;

  explicit PlaneSet(double tol) : tol_(tol) {}

  RingCorner* mint(double x, double y, double z) {
    pool_.emplace_back();
    RingCorner* r = &pool_.back();
    r->c[0] = x;
    r->c[1] = y;
    r->c[2] = z;
    return r;
  }

  int32_t add(const Anchor& anchor, const Ring* ring) {
    const BinKey key = binOf(anchor);
    auto nearIt = buckets_.find(key);
    if (nearIt != buckets_.end()) {
      for (int32_t id : nearIt->second)
        if (coplanar(anchors[id], anchor)) return widenReach(id, anchor, ring);
    }

    const std::optional<Face> face = panelOf(anchor, ring);
    if (tol_ > 0 && face) {
      const int32_t found = sharesPlaneWithin(*face, anchor);
      if (found != NO_PLANE) {
        matchedByTolerance++;
        stats.planesMatchedByTolerance++;
        if (snapQuasiFlush) projectOnto(found, anchor, ring);
        return widenReach(found, anchor, ring);
      }
    }

    if (auditPlaneBuckets) {
      for (size_t id = 0; id < anchors.size(); id++) {
        if (coplanar(anchors[id], anchor)) {
          planeAudit.missed++;
          break;
        }
      }
      planeAudit.added++;
    }

    anchors.push_back(anchor);
    stats.planesRegistered++;
    const int32_t id = static_cast<int32_t>(anchors.size()) - 1;
    spread_.resize(anchors.size());
    spread_[id] = spreadAround(anchor);
    if (nearIt != buckets_.end())
      nearIt->second.push_back(id);
    else
      buckets_.emplace(key, std::vector<int32_t>{id});

    if (tol_ > 0) {
      faces_.resize(anchors.size());
      faces_[id] = face ? *face : Face{{anchor[0]->c[0], anchor[0]->c[1], anchor[0]->c[2]}, {0, 0, 0}};
      if (face) perHeading_[cellOf(face->n)].push_back(id);
    }
    return id;
  }

  // Where three planes meet, solved once and returned identically (the same object) to every caller.
  RingCorner* corner(int32_t i, int32_t j, int32_t k) {
    const std::array<int32_t, 3> key{i, j, k};
    auto it = corners_.find(key);
    if (it != corners_.end()) return it->second;
    RingCorner* solved = solve(i, j, k);
    planeAudit.corners++;
    if (!solved) planeAudit.declinedCorners++;
    corners_.emplace(key, solved);
    return solved;
  }

 private:
  struct Face {
    P3 p;
    P3 n;
  };

  int32_t widenReach(int32_t id, const Anchor& anchor, const Ring* ring) {
    const double spread = spreadAround(anchor);
    if (spread <= spread_[id]) return id;
    spread_[id] = spread;
    anchors[id] = anchor;
    if (tol_ > 0) {
      const std::optional<Face> face = panelOf(anchor, ring);
      if (face) {
        faces_[id] = *face;
        std::vector<int32_t>& at = perHeading_[cellOf(face->n)];
        if (std::find(at.begin(), at.end(), id) == at.end()) at.push_back(id);
      }
    }
    if (!corners_.empty()) {
      corners_.clear();
      cacheClears++;
    }
    return id;
  }

  static double spreadAround(const Anchor& anchor) {
    const double* a = anchor[0]->c;
    const double* b = anchor[1]->c;
    const double* c = anchor[2]->c;
    const double ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const double wx = c[0] - a[0], wy = c[1] - a[1], wz = c[2] - a[2];
    const double nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
    return nx * nx + ny * ny + nz * nz;
  }

  static std::optional<Face> panelOf(const Anchor& anchor, const Ring* ring) {
    const double* a = anchor[0]->c;
    const double* b = anchor[1]->c;
    const double* c = anchor[2]->c;
    const double ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const double wx = c[0] - a[0], wy = c[1] - a[1], wz = c[2] - a[2];
    double nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
    const double l = jsHypot(nx, ny, nz);
    if (l == 0 || !std::isfinite(l)) return std::nullopt;
    nx /= l;
    ny /= l;
    nz /= l;
    const double ax = std::fabs(nx), ay = std::fabs(ny), az = std::fabs(nz);
    const double lead = ax >= ay && ax >= az ? nx : ay >= az ? ny : nz;
    if (lead < 0) {
      nx = -nx;
      ny = -ny;
      nz = -nz;
    }
    if (ring && ring->size() >= 3) {
      double cx = 0, cy = 0, cz = 0;
      for (const RingCorner* q : *ring) {
        cx += q->c[0];
        cy += q->c[1];
        cz += q->c[2];
      }
      const double k = static_cast<double>(ring->size());
      return Face{{cx / k, cy / k, cz / k}, {nx, ny, nz}};
    }
    return Face{{a[0], a[1], a[2]}, {nx, ny, nz}};
  }

  void projectOnto(int32_t id, const Anchor& anchor, const Ring* ring) {
    const Face onto = faces_[id];
    const double length = jsHypot(onto.n[0], onto.n[1], onto.n[2]);
    if (!(length > 0)) return;
    const double ux = onto.n[0] / length, uy = onto.n[1] / length, uz = onto.n[2] / length;
    auto drop = [&](RingCorner* q) {
      const double d =
          ux * (q->c[0] - onto.p[0]) + uy * (q->c[1] - onto.p[1]) + uz * (q->c[2] - onto.p[2]);
      q->c[0] -= d * ux;
      q->c[1] -= d * uy;
      q->c[2] -= d * uz;
    };
    for (RingCorner* q : anchor) drop(q);
    if (ring)
      for (RingCorner* q : *ring) drop(q);
  }

  int32_t sharesPlaneWithin(const Face& face, const Anchor& anchorsIn) {
    double tol = tol_;
    double tiltAllowed = PARALLEL_ENOUGH;
    int32_t cellReach = 1;
    if (snapQuasiFlush) {
      tol *= 2.5;
      double extent = 0;
      for (int a = 0; a < 3; a++) {
        for (int b = a + 1; b < 3; b++) {
          const double d = jsHypot(anchorsIn[a]->c[0] - anchorsIn[b]->c[0],
                                   anchorsIn[a]->c[1] - anchorsIn[b]->c[1],
                                   anchorsIn[a]->c[2] - anchorsIn[b]->c[2]);
          if (d > extent) extent = d;
        }
      }
      const double altitude = extent > 0 ? std::sqrt(spreadAround(anchorsIn)) / extent : 0;
      const double noise = altitude > 0 ? tol / altitude : PARALLEL_ENOUGH;
      tiltAllowed = jsMax(PARALLEL_ENOUGH, jsMin(noise, 1e-3));
      cellReach = static_cast<int32_t>(jsMin(1 + std::ceil(tiltAllowed / 1e-4), 12));
    }
    int32_t best = NO_PLANE;
    double tightestGap = kInf;
    const double G = 1e-4;
    const double ci = std::floor(face.n[0] / G), cj = std::floor(face.n[1] / G),
                 ck = std::floor(face.n[2] / G);
    for (int32_t di = -cellReach; di <= cellReach; di++)
      for (int32_t dj = -cellReach; dj <= cellReach; dj++)
        for (int32_t dk = -cellReach; dk <= cellReach; dk++) {
          auto found = perHeading_.find(cellHash(ci + di, cj + dj, ck + dk));
          if (found == perHeading_.end()) continue;
          for (int32_t id : found->second) {
            const Face& other = faces_[id];
            const double cx = face.n[1] * other.n[2] - face.n[2] * other.n[1];
            const double cy = face.n[2] * other.n[0] - face.n[0] * other.n[2];
            const double cz = face.n[0] * other.n[1] - face.n[1] * other.n[0];
            stats.planeCandidates++;
            if (cx * cx + cy * cy + cz * cz > tiltAllowed * tiltAllowed) {
              stats.planeRejectedByAngle++;
              continue;
            }
            double worst = std::fabs(other.n[0] * (face.p[0] - other.p[0]) +
                                     other.n[1] * (face.p[1] - other.p[1]) +
                                     other.n[2] * (face.p[2] - other.p[2]));
            bool outside = worst > tol;
            if (!outside) {
              for (const RingCorner* q : anchorsIn) {
                const double gap = std::fabs(other.n[0] * (q->c[0] - other.p[0]) +
                                             other.n[1] * (q->c[1] - other.p[1]) +
                                             other.n[2] * (q->c[2] - other.p[2]));
                if (gap > tol) {
                  outside = true;
                  break;
                }
                if (gap > worst) worst = gap;
              }
            }
            if (outside) {
              stats.planeRejectedBySlab++;
              if (worst < stats.planeNarrowestMiss) stats.planeNarrowestMiss = worst;
              continue;
            }
            if (worst < tightestGap) {
              tightestGap = worst;
              best = id;
            }
          }
        }
    return best;
  }

  static uint32_t cellOf(const P3& n) {
    const double G = 1e-4;
    return cellHash(std::floor(n[0] / G), std::floor(n[1] / G), std::floor(n[2] / G));
  }

  static BinKey binOf(const Anchor& anchor) {
    BinKey key{};
    const double* a = anchor[0]->c;
    const double* b = anchor[1]->c;
    const double* c = anchor[2]->c;
    const double ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const double wx = c[0] - a[0], wy = c[1] - a[1], wz = c[2] - a[2];
    double nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
    const double l = jsHypot(nx, ny, nz);
    if (l == 0) {
      key[0] = 1;  // "degenerate"
      return key;
    }
    nx /= l;
    ny /= l;
    nz /= l;
    const double lead = std::fabs(nx) > 1e-12 ? nx : std::fabs(ny) > 1e-12 ? ny : nz;
    if (lead < 0) {
      nx = -nx;
      ny = -ny;
      nz = -nz;
    }
    const double d = nx * a[0] + ny * a[1] + nz * a[2];
    fixed9(nx, &key[1]);
    fixed9(ny, &key[4]);
    fixed9(nz, &key[7]);
    fixed9(d, &key[10]);
    return key;
  }

  static bool coplanar(const Anchor& one, const Anchor& other) {
    for (const RingCorner* q : other)
      if (whichSideOfPlane(one, q->c) != 0) return false;
    return true;
  }

  std::array<double, 4> normal(int32_t id) const {
    const double* a = anchors[id][0]->c;
    const double* b = anchors[id][1]->c;
    const double* c = anchors[id][2]->c;
    const double ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const double wx = c[0] - a[0], wy = c[1] - a[1], wz = c[2] - a[2];
    const double nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
    return {nx, ny, nz, nx * a[0] + ny * a[1] + nz * a[2]};
  }

  RingCorner* solve(int32_t i, int32_t j, int32_t k) {
    const auto [ax, ay, az, ad] = normal(i);
    const auto [bx, by, bz, bd] = normal(j);
    const auto [cx, cy, cz, cd] = normal(k);
    const double det = ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx);
    if (det == 0 || !std::isfinite(det)) {
      planeAudit.degenerateCorners++;
      return nullptr;
    }
    const double scale = jsHypot(ax, ay, az) * jsHypot(bx, by, bz) * jsHypot(cx, cy, cz);
    if (scale == 0 || std::fabs(det) < scale * 1e-10) {
      planeAudit.thresholdCorners++;
      return nullptr;
    }
    const double x = (ad * (by * cz - bz * cy) - ay * (bd * cz - bz * cd) + az * (bd * cy - by * cd)) / det;
    const double y = (ax * (bd * cz - bz * cd) - ad * (bx * cz - bz * cx) + az * (bx * cd - bd * cx)) / det;
    const double z = (ax * (by * cd - bd * cy) - ay * (bx * cd - bd * cx) + ad * (bx * cy - by * cx)) / det;
    return std::isfinite(x) && std::isfinite(y) && std::isfinite(z) ? mint(x, y, z) : nullptr;
  }

  double tol_;
  std::deque<RingCorner> pool_;
  std::unordered_map<std::array<int32_t, 3>, RingCorner*, TripleHash> corners_;
  std::unordered_map<BinKey, std::vector<int32_t>, ArrayHash<13>> buckets_;
  std::vector<Face> faces_;
  std::unordered_map<uint32_t, std::vector<int32_t>> perHeading_;
  std::vector<double> spread_;
};

// Plane ids common to two points, kept sorted (appended to `out`).
void sharedPlanes(const PlaneSet& planes, const RingCorner* a, const RingCorner* b,
                  std::vector<int32_t>& out) {
  if (!a->tagged || !b->tagged) return;
  const int32_t* bOn = planes.tagPool.data() + b->onAt;
  const int32_t* bEnd = bOn + b->onCount;
  for (int32_t k = 0; k < a->onCount; k++) {
    const int32_t id = planes.tagPool[a->onAt + k];
    if (std::find(bOn, bEnd, id) != bEnd) out.push_back(id);
  }
}

// Sort and dedupe `on` (in place) and give it to `v` as its plane tags.
RingCorner* tagPlanes(PlaneSet& planes, RingCorner* v, std::vector<int32_t>& on) {
  std::sort(on.begin(), on.end());
  on.erase(std::unique(on.begin(), on.end()), on.end());
  v->onAt = static_cast<int32_t>(planes.tagPool.size());
  v->onCount = static_cast<int32_t>(on.size());
  planes.tagPool.insert(planes.tagPool.end(), on.begin(), on.end());
  v->tagged = true;
  return v;
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// Facets as patches
// ═════════════════════════════════════════════════════════════════════════════════════════════════

bool everyCornerCovered(const Ring& inner, const Ring& outer, const P3& n, double len) {
  const P3 u0 = std::fabs(n[0] / len) < 0.9 ? P3{1, 0, 0} : P3{0, 1, 0};
  const double nx = n[0] / len, ny = n[1] / len, nz = n[2] / len;
  double ux = u0[1] * nz - u0[2] * ny, uy = u0[2] * nx - u0[0] * nz, uz = u0[0] * ny - u0[1] * nx;
  const double ul = orElse(jsHypot(ux, uy, uz), 1);
  ux /= ul;
  uy /= ul;
  uz /= ul;
  const double wx = ny * uz - nz * uy, wy = nz * ux - nx * uz, wz = nx * uy - ny * ux;
  const double* o = outer[0]->c;
  auto onto2d = [&](const double* p) -> std::array<double, 2> {
    const double dx = p[0] - o[0], dy = p[1] - o[1], dz = p[2] - o[2];
    return {dx * ux + dy * uy + dz * uz, dx * wx + dy * wy + dz * wz};
  };
  std::vector<std::array<double, 2>> P;
  P.reserve(outer.size());
  for (const RingCorner* q : outer) P.push_back(onto2d(q->c));
  double span = 0;
  for (const auto& xy : P) {
    double m = span;
    m = jsMax(m, std::fabs(xy[0]));
    m = jsMax(m, std::fabs(xy[1]));
    span = m;
  }
  const double eps = orElse(span, 1) * 1e-9;
  auto insideOrOn = [&](const std::array<double, 2>& q) -> bool {
    const size_t N = P.size();
    for (size_t i = 0, j = N - 1; i < N; j = i++) {
      const double xi = P[i][0], yi = P[i][1], xj = P[j][0], yj = P[j][1];
      const double cross = (xj - xi) * (q[1] - yi) - (yj - yi) * (q[0] - xi);
      const double along = (q[0] - xi) * (xj - xi) + (q[1] - yi) * (yj - yi);
      const double squaredLen = (xj - xi) * (xj - xi) + (yj - yi) * (yj - yi);
      if (std::fabs(cross) <= eps * std::sqrt(orElse(squaredLen, 1)) && along >= -eps &&
          along <= squaredLen + eps)
        return true;
    }
    bool c = false;
    for (size_t i = 0, j = N - 1; i < N; j = i++) {
      const double xi = P[i][0], yi = P[i][1], xj = P[j][0], yj = P[j][1];
      if ((yi > q[1]) != (yj > q[1]) && q[0] < ((xj - xi) * (q[1] - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  for (const RingCorner* p : inner)
    if (!insideOrOn(onto2d(p->c))) return false;
  return true;
}

std::vector<Splinter> withoutCoveredFaces(std::vector<Splinter> patches) {
  struct Info {
    P3 v;
    double len;
  };
  std::vector<Info> info;
  info.reserve(patches.size());
  for (const Splinter& p : patches) {
    const Ring& r = p.ring;
    double nx = 0, ny = 0, nz = 0;
    for (size_t i = 0; i < r.size(); i++) {
      const double* a = r[i]->c;
      const double* b = r[(i + 1) % r.size()]->c;
      nx += a[1] * b[2] - a[2] * b[1];
      ny += a[2] * b[0] - a[0] * b[2];
      nz += a[0] * b[1] - a[1] * b[0];
    }
    const P3 v{nx / 2, ny / 2, nz / 2};
    info.push_back({v, jsHypot(v[0], v[1], v[2])});
  }
  std::unordered_map<int32_t, std::vector<int32_t>> perPlane;
  for (size_t i = 0; i < patches.size(); i++) {
    if (!(info[i].len > 0)) continue;
    perPlane[patches[i].plane].push_back(static_cast<int32_t>(i));
  }
  std::vector<char> drop(patches.size(), 0);
  bool any = false;
  for (auto& [plane, group] : perPlane) {
    if (group.size() < 2) continue;
    for (int32_t i : group)
      for (int32_t j : group) {
        if (i == j || drop[i] || drop[j]) continue;
        const Info &A = info[i], &B = info[j];
        const double dot = (A.v[0] * B.v[0] + A.v[1] * B.v[1] + A.v[2] * B.v[2]) / (A.len * B.len);
        if (dot < 0.999) continue;
        if (A.len >= B.len) continue;
        if (everyCornerCovered(patches[i].ring, patches[j].ring, B.v, B.len)) {
          drop[i] = 1;
          any = true;
          stats.subjectFacesCovered++;
        }
      }
  }
  if (!any) return patches;
  std::vector<Splinter> out;
  for (size_t i = 0; i < patches.size(); i++)
    if (!drop[i]) out.push_back(std::move(patches[i]));
  return out;
}

// Three corners of the ring that are not collinear, the widest among the first sixteen pairs.
std::optional<Anchor> anchorsFor(const Ring& ring) {
  std::optional<Anchor> best;
  double widestTriArea = 0;
  int looked = 0;
  RingCorner* a = ring[0];
  const double* A = a->c;
  for (size_t i = 1; i < ring.size() && looked < 16; i++) {
    for (size_t j = i + 1; j < ring.size() && looked < 16; j++) {
      looked++;
      const double* b = ring[i]->c;
      const double* c = ring[j]->c;
      const double ux = b[0] - A[0], uy = b[1] - A[1], uz = b[2] - A[2];
      const double wx = c[0] - A[0], wy = c[1] - A[1], wz = c[2] - A[2];
      const double nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
      if (nx == 0 && ny == 0 && nz == 0) continue;
      if (sideOfPlane(A[0], A[1], A[2], b[0], b[1], b[2], c[0], c[1], c[2], A[0] + nx, A[1] + ny,
                      A[2] + nz) != 0) {
        const double area = nx * nx + ny * ny + nz * nz;
        if (area > widestTriArea) {
          widestTriArea = area;
          best = Anchor{a, ring[i], ring[j]};
        }
      }
    }
  }
  return best;
}

std::vector<Splinter> patchesOf(const LinkedShellGraph& graph, PlaneSet& planes) {
  struct Pending {
    std::vector<int32_t> ids;
    Ring ring;
    Anchor anchor;
    int32_t plane;
  };
  std::vector<Pending> rings;
  std::vector<std::vector<int32_t>> meeting(static_cast<size_t>(graph.cornerTally()));
  const int32_t facets = graph.panelTally();
  for (int32_t facet = 0; facet < facets; facet++) {
    std::vector<int32_t> ids = graph.outerRingOf(facet);
    if (ids.size() < 3) continue;
    Ring ring;
    ring.reserve(ids.size());
    for (int32_t v : ids) ring.push_back(planes.mint(graph.pointXOf(v), graph.pointYOf(v), graph.pointZOf(v)));
    const std::optional<Anchor> anchor = anchorsFor(ring);
    if (!anchor) continue;
    const int32_t plane = planes.add(*anchor, &ring);
    for (int32_t v : ids) meeting[v].push_back(plane);
    rings.push_back({std::move(ids), std::move(ring), *anchor, plane});
  }
  std::vector<Splinter> out;
  out.reserve(rings.size());
  std::vector<int32_t> tags;
  for (size_t at = 0; at < rings.size(); at++) {
    Pending& r = rings[at];
    for (size_t i = 0; i < r.ring.size(); i++) {
      tags = meeting[r.ids[i]];
      tagPlanes(planes, r.ring[i], tags);
    }
    Splinter s;
    s.ring = std::move(r.ring);
    s.anchor = r.anchor;
    s.plane = r.plane;
    s.from = static_cast<int32_t>(at);
    out.push_back(std::move(s));
  }
  return out;
}

// Is this fragment a line the arithmetic could not tell from one?
bool isNeedle(const Ring& ring) {
  if (ring.size() < 3) return true;
  const double* o = ring[0]->c;
  double nx = 0, ny = 0, nz = 0, extent = 0;
  const size_t n = ring.size();
  for (size_t i = 0; i < n; i++) {
    const double* a = ring[i]->c;
    const double* b = ring[(i + 1) % n]->c;
    const double ax = a[0] - o[0], ay = a[1] - o[1], az = a[2] - o[2];
    const double bx = b[0] - o[0], by = b[1] - o[1], bz = b[2] - o[2];
    nx += ay * bz - az * by;
    ny += az * bx - ax * bz;
    nz += ax * by - ay * bx;
    const double d = ax * ax + ay * ay + az * az;
    if (d > extent) extent = d;
  }
  if (extent == 0) return true;
  return jsHypot(nx, ny, nz) / 2 <= extent * 1e-12;
}

// Is `p` inside the ring, projected onto the two axes the normal is weakest along?
template <class At>
bool pointInsideRingAt(size_t count, const At& at, const double* unit, const double* p) {
  const int drop = std::fabs(unit[0]) >= std::fabs(unit[1]) && std::fabs(unit[0]) >= std::fabs(unit[2])
                       ? 0
                       : std::fabs(unit[1]) >= std::fabs(unit[2]) ? 1 : 2;
  const int i = drop == 0 ? 1 : 0;
  const int j = drop == 2 ? 1 : 2;
  bool inside = false;
  for (size_t k = 0, m = count - 1; k < count; m = k++) {
    const double* a = at(k);
    const double* b = at(m);
    if ((a[j] > p[j]) == (b[j] > p[j])) continue;
    const double cross = a[i] + ((p[j] - a[j]) / (b[j] - a[j])) * (b[i] - a[i]);
    if (p[i] < cross) inside = !inside;
  }
  return inside;
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// Cutting
// ═════════════════════════════════════════════════════════════════════════════════════════════════

// Split a ring crossing its plane more than twice into its real components; nullopt to decline.
std::optional<TwoSides> splitAcrossPlane(const Ring& ring, const std::vector<int>& sides,
                                         const std::vector<RingCorner*>& meetsAt,
                                         int32_t meetCount) {
  const int n = static_cast<int>(ring.size());
  std::vector<int> effective;
  std::vector<char> asCross;
  effective.reserve(n);
  asCross.reserve(n);
  for (int i = 0; i < n; i++) {
    const int si = sides[i];
    if (si != 0) {
      effective.push_back(si);
      asCross.push_back(0);
      continue;
    }
    if (sides[(i - 1 + n) % n] == 0 || sides[(i + 1) % n] == 0) return std::nullopt;
    const int back = sides[(i - 1 + n) % n], fwd = sides[(i + 1) % n];
    if (back == fwd) {
      effective.push_back(back);
      asCross.push_back(0);
    } else {
      effective.push_back(0);
      asCross.push_back(1);
    }
  }
  int onPlaneCrossings = 0;
  for (char c : asCross)
    if (c) onPlaneCrossings++;
  const int total = meetCount + onPlaneCrossings;
  if (total < 4 || total % 2 != 0) return std::nullopt;

  Ring pts;
  std::vector<int> side;
  std::vector<char> crossesOver;
  for (int i = 0; i < n; i++) {
    pts.push_back(ring[i]);
    side.push_back(effective[i]);
    crossesOver.push_back(asCross[i]);
    if (RingCorner* c = meetsAt[i]) {
      pts.push_back(c);
      side.push_back(0);
      crossesOver.push_back(1);
    }
  }
  const int m = static_cast<int>(pts.size());
  std::vector<int> cross;
  for (int k = 0; k < m; k++)
    if (crossesOver[k]) cross.push_back(k);
  if (static_cast<int>(cross.size()) != total) return std::nullopt;

  const double* a = pts[cross[0]]->c;
  double dx = 0, dy = 0, dz = 0, best = 0;
  for (int k : cross) {
    const double* q = pts[k]->c;
    const double ux = q[0] - a[0], uy = q[1] - a[1], uz = q[2] - a[2];
    const double l = ux * ux + uy * uy + uz * uz;
    if (l > best) {
      best = l;
      dx = ux;
      dy = uy;
      dz = uz;
    }
  }
  if (best == 0) return std::nullopt;
  std::vector<double> alongOf(m, 0);
  for (int k : cross) {
    const double* q = pts[k]->c;
    alongOf[k] = (q[0] - a[0]) * dx + (q[1] - a[1]) * dy + (q[2] - a[2]) * dz;
  }
  std::vector<int> order = cross;
  std::stable_sort(order.begin(), order.end(), [&](int p, int q) { return alongOf[p] < alongOf[q]; });
  std::vector<int> partner(m, -1);
  for (size_t k = 0; k + 1 < order.size(); k += 2) {
    partner[order[k]] = order[k + 1];
    partner[order[k + 1]] = order[k];
  }

  auto walk = [&](int want) -> std::optional<std::vector<Ring>> {
    std::vector<Ring> out;
    std::vector<char> spent(m, 0);
    for (int start : cross) {
      if (spent[start]) continue;
      int step = (start + 1) % m;
      while (!crossesOver[step] && side[step] == 0) step = (step + 1) % m;
      if (!crossesOver[step] && side[step] != want) continue;
      Ring piece;
      int at = start;
      for (int guard = 0; guard <= m * 2 + 4; guard++) {
        spent[at] = 1;
        piece.push_back(pts[at]);
        int k = (at + 1) % m;
        while (!crossesOver[k]) {
          piece.push_back(pts[k]);
          k = (k + 1) % m;
        }
        piece.push_back(pts[k]);
        spent[k] = 1;
        const int jump = partner[k];
        if (jump < 0) return std::nullopt;
        if (jump == start) break;
        at = jump;
        if (guard == m * 2 + 4) return std::nullopt;
      }
      if (piece.size() >= 3) out.push_back(std::move(piece));
    }
    if (out.empty()) return std::nullopt;
    return out;
  };

  auto below = walk(-1);
  auto above = walk(1);
  if (!below || !above) return std::nullopt;
  return TwoSides{std::move(*below), std::move(*above)};
}

// Peel the zero-area tail a cut leaves along its own seam.
Ring peelSeamReversals(Ring corners, const Anchor& plane) {
  // C++: the exact side of each corner, computed once (the predicate is pure).
  thread_local std::vector<int> sideOf;
  sideOf.resize(corners.size());
  if (corners.size() >= 3)
    for (size_t i = 0; i < corners.size(); i++) sideOf[i] = whichSideOfPlane(plane, corners[i]->c);
  for (size_t pass = 0; pass < corners.size(); pass++) {
    const size_t n = corners.size();
    if (n < 3) return corners;
    long cutPlaneAt = -1;
    for (size_t i = 0; i < n && cutPlaneAt < 0; i++) {
      const double* c = corners[i]->c;
      if (sideOf[i] != 0) continue;
      const double* back = corners[(i + n - 1) % n]->c;
      const double* fwd = corners[(i + 1) % n]->c;
      if (sideOf[(i + n - 1) % n] != 0 || sideOf[(i + 1) % n] != 0) continue;
      const double ax = c[0] - back[0], ay = c[1] - back[1], az = c[2] - back[2];
      const double bx = fwd[0] - c[0], by = fwd[1] - c[1], bz = fwd[2] - c[2];
      if (ax * bx + ay * by + az * bz < 0) cutPlaneAt = static_cast<long>(i);
    }
    if (cutPlaneAt < 0) return corners;
    stats.seamSpikesPeeled++;
    corners.erase(corners.begin() + cutPlaneAt);
    sideOf.erase(sideOf.begin() + cutPlaneAt);
  }
  return corners;
}

inline P3 newellOf(const Ring& r) {
  double nx = 0, ny = 0, nz = 0;
  const size_t n = r.size();
  for (size_t i = 0; i < n; i++) {
    const double* a = r[i]->c;
    const double* b = r[(i + 1) % n]->c;
    nx += (a[1] - b[1]) * (a[2] + b[2]);
    ny += (a[2] - b[2]) * (a[0] + b[0]);
    nz += (a[0] - b[0]) * (a[1] + b[1]);
  }
  return {nx, ny, nz};
}

// Does this piece wind the same way as the patch it came from?
bool windsWithParent(const Ring& piece, const Ring& parent) {
  const P3 a = newellOf(piece);
  const P3 b = newellOf(parent);
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] >= 0;
}

// A corner within onPlaneTolerance of the weld of the plane is ON it; false (TS null) when nothing
// moved, else the pulled sides are in `pulled`.
bool pullSidesOnPlane(const Ring& ring, const std::vector<int>& sides, const Anchor& plane,
                      std::vector<int>& pulled) {
  const double onPlaneAbs =
      onPlaneTolerance > 0 ? onPlaneTolerance * orElse(fuseDistance(), WELD_METRES) : 0;
  if (onPlaneAbs <= 0) return false;
  const double* p0 = plane[0]->c;
  const double* p1 = plane[1]->c;
  const double* p2 = plane[2]->c;
  const double ux = p1[0] - p0[0], uy = p1[1] - p0[1], uz = p1[2] - p0[2];
  const double vx = p2[0] - p0[0], vy = p2[1] - p0[1], vz = p2[2] - p0[2];
  const double nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
  const double nl = jsHypot(nx, ny, nz);
  if (nl <= 0) return false;
  pulled.clear();
  bool any = false;
  for (size_t i = 0; i < ring.size(); i++) {
    const double* q = ring[i]->c;
    const double off = std::fabs(((q[0] - p0[0]) * nx + (q[1] - p0[1]) * ny + (q[2] - p0[2]) * nz) / nl);
    const bool touching = off <= onPlaneAbs;
    if (touching && sides[i] != 0) {
      stats.cornersPulledOnPlane++;
      any = true;
    }
    pulled.push_back(touching ? 0 : sides[i]);
  }
  return any;
}

// Equality ids for corners by coordinate (TS `${p[0]},${p[1]},${p[2]}` string keys).
class CoordKeyer {
 public:
  int32_t id(const RingCorner* p) {
    const std::array<uint64_t, 3> k{numKey(p->c[0]), numKey(p->c[1]), numKey(p->c[2])};
    if (!useMap_) {
      for (size_t i = 0; i < keys_.size(); i++)
        if (keys_[i] == k) return static_cast<int32_t>(i);
      keys_.push_back(k);
      first_.push_back(p);
      if (keys_.size() > 24) {
        useMap_ = true;
        for (size_t i = 0; i < keys_.size(); i++) map_.emplace(keys_[i], static_cast<int32_t>(i));
      }
      return static_cast<int32_t>(keys_.size()) - 1;
    }
    auto [it, inserted] = map_.emplace(k, static_cast<int32_t>(keys_.size()));
    if (inserted) {
      keys_.push_back(k);
      first_.push_back(p);
    }
    return it->second;
  }
  size_t size() const { return keys_.size(); }
  const RingCorner* first(int32_t id) const { return first_[id]; }
  void clear() {
    keys_.clear();
    first_.clear();
    if (useMap_) map_.clear();
    useMap_ = false;
  }

 private:
  std::vector<std::array<uint64_t, 3>> keys_;
  std::vector<const RingCorner*> first_;
  bool useMap_ = false;
  std::unordered_map<std::array<uint64_t, 3>, int32_t, ArrayHash<3>> map_;
};

inline bool sameCoords(const RingCorner* a, const RingCorner* b) {
  return numKey(a->c[0]) == numKey(b->c[0]) && numKey(a->c[1]) == numKey(b->c[1]) &&
         numKey(a->c[2]) == numKey(b->c[2]);
}

inline std::string coordString(const double* p) {
  return jsNum(p[0]) + "," + jsNum(p[1]) + "," + jsNum(p[2]);
}

using Edge = std::pair<RingCorner*, RingCorner*>;

// Split a ring by a plane as an arrangement; nullopt when it cannot close what it builds.
std::optional<TwoSides> splitRingByArrangement(const Ring& ring, const std::vector<int>& sidesIn,
                                               const Anchor& plane, const P3& panelNormal,
                                               const std::vector<RingCorner*>& meetsAtIn) {
  const int n = static_cast<int>(ring.size());
  struct Scratch {
    std::vector<int> pulledStore, side;
    std::vector<RingCorner*> keptStore;
    Ring pts, onTheLine;
    std::vector<Edge> belowEdges, aboveEdges, onLineRing, dropped;
    std::vector<std::pair<double, RingCorner*>> keyed;
    std::vector<std::pair<uint64_t, uint64_t>> isRim;
    CoordKeyer keyer;
    std::vector<int32_t> k0, k1, deg;
    std::vector<std::vector<int32_t>> from;
  };
  thread_local Scratch sc;
  const std::vector<int>* sidesP = &sidesIn;
  const std::vector<RingCorner*>* meetsP = &meetsAtIn;
  std::vector<int>& pulledStore = sc.pulledStore;
  std::vector<RingCorner*>& keptStore = sc.keptStore;
  if (pullSidesOnPlane(ring, sidesIn, plane, pulledStore)) {
    sidesP = &pulledStore;
    keptStore.assign(n, nullptr);
    for (int i = 0; i < n; i++)
      if (meetsAtIn[i] && pulledStore[i] != 0 && pulledStore[(i + 1) % n] != 0)
        keptStore[i] = meetsAtIn[i];
    meetsP = &keptStore;
  }
  const std::vector<int>& sides = *sidesP;
  const std::vector<RingCorner*>& meetsAt = *meetsP;

  Ring& pts = sc.pts;
  std::vector<int>& side = sc.side;
  pts.clear();
  side.clear();
  for (int i = 0; i < n; i++) {
    pts.push_back(ring[i]);
    side.push_back(sides[i]);
    if (RingCorner* c = meetsAt[i]) {
      pts.push_back(c);
      side.push_back(0);
    }
  }
  const int m = static_cast<int>(pts.size());
  if (m < 3) {
    stats.arrangementWhy.tooFewPoints++;
    return std::nullopt;
  }

  const double normalSpan = orElse(jsHypot(panelNormal[0], panelNormal[1], panelNormal[2]), 1);
  const double normalUnit[3] = {panelNormal[0] / normalSpan, panelNormal[1] / normalSpan,
                                panelNormal[2] / normalSpan};
  auto interiorSideOf = [&](const double* a, const double* b) -> int {
    const double dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
    const double lx = normalUnit[1] * dz - normalUnit[2] * dy;
    const double ly = normalUnit[2] * dx - normalUnit[0] * dz;
    const double lz = normalUnit[0] * dy - normalUnit[1] * dx;
    const double q[3] = {a[0] + lx, a[1] + ly, a[2] + lz};
    return whichSideOfPlane(plane, q);
  };

  std::vector<Edge>& belowEdges = sc.belowEdges;
  std::vector<Edge>& aboveEdges = sc.aboveEdges;
  belowEdges.clear();
  aboveEdges.clear();
  std::optional<std::vector<std::string>> trace;
  std::optional<std::vector<std::string>> seamTrace;
  if (stats.arrangementTrace) {
    trace.emplace();
    seamTrace.emplace();
  }
  auto push = [&](int s, RingCorner* a, RingCorner* b, const char* why) {
    if (a == b) return;
    (s < 0 ? belowEdges : aboveEdges).emplace_back(a, b);
    if (trace)
      trace->push_back(std::string(s < 0 ? "below" : "above") + "\t" + why + "\t" + coordString(a->c) +
                       "\t" + coordString(b->c));
  };

  std::vector<Edge>& onLineRing = sc.onLineRing;
  onLineRing.clear();
  for (int i = 0; i < m; i++) {
    const int j = (i + 1) % m;
    RingCorner* a = pts[i];
    RingCorner* b = pts[j];
    const int sa = side[i], sb = side[j];
    if (sa != 0) {
      push(sa, a, b, sb == 0 ? "ringA" : sa == sb ? "ringA" : "ringSTRADDLE");
      continue;
    }
    if (sb != 0) {
      push(sb, a, b, "ringB");
      continue;
    }
    const int s = interiorSideOf(a->c, b->c);
    if (s == 0) {
      stats.arrangementWhy.onLineEdgeUndecided++;
      return std::nullopt;
    }
    push(s, a, b, "onTheLine");
    onLineRing.emplace_back(a, b);
  }

  Ring& onTheLine = sc.onTheLine;
  onTheLine.clear();
  for (int i = 0; i < m; i++)
    if (side[i] == 0) onTheLine.push_back(pts[i]);
  if (onTheLine.size() < 2) {
    stats.arrangementWhy.tooFewOnLine++;
    return std::nullopt;
  }
  const double* a0 = onTheLine[0]->c;
  double dx = 0, dy = 0, dz = 0, best = 0;
  for (const RingCorner* qq : onTheLine) {
    const double* q = qq->c;
    const double ux = q[0] - a0[0], uy = q[1] - a0[1], uz = q[2] - a0[2];
    const double l = ux * ux + uy * uy + uz * uz;
    if (l > best) {
      best = l;
      dx = ux;
      dy = uy;
      dz = uz;
    }
  }
  if (best == 0) {
    stats.arrangementWhy.degenerateLine++;
    if (refuseDegenerateSeam) return std::nullopt;
  }
  auto along = [&](const double* q) {
    return (q[0] - a0[0]) * dx + (q[1] - a0[1]) * dy + (q[2] - a0[2]) * dz;
  };
  // Sort by `along`, stable (TimSort), with the keys computed as the comparator would.
  std::vector<std::pair<double, RingCorner*>>& keyed = sc.keyed;
  keyed.clear();
  for (RingCorner* q : onTheLine) keyed.emplace_back(along(q->c), q);
  std::stable_sort(keyed.begin(), keyed.end(),
                   [](const auto& p, const auto& q) { return p.first < q.first; });

  const double* unit = normalUnit;  // identical arithmetic to the TS `unit`
  std::vector<std::pair<uint64_t, uint64_t>>& isRim = sc.isRim;
  isRim.clear();
  if (boundaryBySides) {
    for (const auto& [a, b] : onLineRing) {
      const double lo = jsMin(along(a->c), along(b->c)), hi = jsMax(along(a->c), along(b->c));
      isRim.emplace_back(numKey(lo), numKey(hi));
    }
  } else {
    auto scan = [&](const std::vector<Edge>& edges) {
      for (const auto& [a, b] : edges) {
        if (whichSideOfPlane(plane, a->c) != 0) continue;
        if (whichSideOfPlane(plane, b->c) != 0) continue;
        const double lo = jsMin(along(a->c), along(b->c)), hi = jsMax(along(a->c), along(b->c));
        isRim.emplace_back(numKey(lo), numKey(hi));
      }
    };
    scan(belowEdges);
    scan(aboveEdges);
  }
  std::sort(isRim.begin(), isRim.end());

  for (size_t k = 0; k + 1 < keyed.size(); k++) {
    RingCorner* a = keyed[k].second;
    RingCorner* b = keyed[k + 1].second;
    const double ta = along(a->c), tb = along(b->c);
    if (ta == tb) {
      if (seamTrace) seamTrace->push_back("[" + jsNum(ta) + ", " + jsNum(tb) + "] zero-length");
      continue;
    }
    if (std::binary_search(isRim.begin(), isRim.end(),
                           std::make_pair(numKey(jsMin(ta, tb)), numKey(jsMax(ta, tb))))) {
      if (seamTrace)
        seamTrace->push_back("[" + jsNum(ta) + ", " + jsNum(tb) + "] skipped: carried as boundary");
      continue;
    }
    const double mid[3] = {(a->c[0] + b->c[0]) / 2, (a->c[1] + b->c[1]) / 2, (a->c[2] + b->c[2]) / 2};
    if (!pointInsideRingAt(
            ring.size(), [&](size_t k2) { return static_cast<const double*>(ring[k2]->c); }, unit,
            mid)) {
      if (seamTrace)
        seamTrace->push_back("[" + jsNum(ta) + ", " + jsNum(tb) +
                             "] skipped: midpoint outside the ring");
      continue;
    }
    const int s = interiorSideOf(a->c, b->c);
    if (s == 0) {
      stats.arrangementWhy.seamUndecided++;
      return std::nullopt;
    }
    if (seamTrace)
      seamTrace->push_back("[" + jsNum(ta) + ", " + jsNum(tb) + "] added to both, " +
                           (s < 0 ? "below" : "above") + " runs a -> b");
    push(s, a, b, "seam");
    push(-s, b, a, "seam");
  }

  auto turnFrom = [&](const double* enterA, const double* enterB, const double* exitA,
                      const double* exitB) -> double {
    const double ux = enterA[0] - enterB[0], uy = enterA[1] - enterB[1], uz = enterA[2] - enterB[2];
    const double vx = exitB[0] - exitA[0], vy = exitB[1] - exitA[1], vz = exitB[2] - exitA[2];
    const double cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    const double sin = cx * normalUnit[0] + cy * normalUnit[1] + cz * normalUnit[2];
    const double cos = ux * vx + uy * vy + uz * vz;
    double ang = jsAtan2(chainTurnFlip ? -sin : sin, cos);
    if (ang <= 0) ang += 2 * kPI;
    return ang;
  };

  auto dropReversedPairs = [&](const std::vector<Edge>& edges) -> std::vector<Edge> {
    std::vector<char> dead(edges.size(), 0);
    bool any = false;
    for (size_t i = 0; i < edges.size(); i++) {
      if (dead[i]) continue;
      for (size_t j = i + 1; j < edges.size(); j++) {
        if (dead[j]) continue;
        if (sameCoords(edges[i].first, edges[j].second) &&
            sameCoords(edges[i].second, edges[j].first)) {
          dead[i] = dead[j] = 1;
          any = true;
          stats.chainReversedPairsDropped++;
          break;
        }
      }
    }
    if (!any) return edges;
    std::vector<Edge> out;
    for (size_t i = 0; i < edges.size(); i++)
      if (!dead[i]) out.push_back(edges[i]);
    return out;
  };

  auto chain = [&](const std::vector<Edge>& edgesIn) -> std::optional<std::vector<Ring>> {
    std::vector<Edge>& dropped = sc.dropped;
    const std::vector<Edge>* ep = &edgesIn;
    if (chainDropReversed) {
      dropped = dropReversedPairs(edgesIn);
      ep = &dropped;
    }
    const std::vector<Edge>& edges = *ep;
    std::vector<Ring> out;
    if (edges.empty()) return out;
    const int E = static_cast<int>(edges.size());
    CoordKeyer& keyer = sc.keyer;
    keyer.clear();
    std::vector<int32_t>& k0 = sc.k0;
    std::vector<int32_t>& k1 = sc.k1;
    k0.resize(E);
    k1.resize(E);
    for (int e = 0; e < E; e++) k0[e] = keyer.id(edges[e].first);
    for (int e = 0; e < E; e++) k1[e] = keyer.id(edges[e].second);
    std::vector<std::vector<int32_t>>& from = sc.from;
    if (from.size() < keyer.size()) from.resize(keyer.size());
    for (size_t k = 0; k < keyer.size(); k++) from[k].clear();
    for (int e = 0; e < E; e++) from[k0[e]].push_back(e);
    int left = E;
    for (int e = 0; e < E; e++) {
      {
        const auto& bucket = from[k0[e]];
        if (std::find(bucket.begin(), bucket.end(), e) == bucket.end()) continue;
      }
      Ring loop;
      int cur = e;
      const int32_t leadTag = k0[e];
      for (int guard = 0; guard <= E + 1; guard++) {
        auto& b = from[k0[cur]];
        auto at = std::find(b.begin(), b.end(), cur);
        if (at == b.end()) return std::nullopt;
        b.erase(at);
        left--;
        loop.push_back(edges[cur].first);
        if (k1[cur] == leadTag) break;
        const auto& next = from[k1[cur]];
        if (next.empty()) return std::nullopt;
        if (next.size() > 1) stats.chainBranchPoints++;
        if (next.size() > 1 && chainAngularNext) {
          int bestE = next[0];
          double bestAng = kInf;
          for (int cand : next) {
            const double ang = turnFrom(edges[cur].first->c, edges[cur].second->c,
                                        edges[cand].first->c, edges[cand].second->c);
            if (ang < bestAng) {
              bestAng = ang;
              bestE = cand;
            }
          }
          if (bestE != next[0]) stats.chainAngularDiffered++;
          cur = bestE;
        } else {
          cur = next[0];
        }
        if (guard == E + 1) return std::nullopt;
      }
      if (loop.size() >= 3) {
        out.push_back(std::move(loop));
      } else if (!loop.empty()) {
        stats.chainLoopsDropped++;
        stats.chainLoopDroppedCorners += static_cast<int64_t>(loop.size());
      }
    }
    if (left == 0) return out;
    return std::nullopt;
  };

  bool anyUnbalanced = false;
  for (int which = 0; which < 2; which++) {
    const std::vector<Edge>& edges = which == 0 ? belowEdges : aboveEdges;
    CoordKeyer& keyer = sc.keyer;
    keyer.clear();
    std::vector<int32_t>& deg = sc.deg;
    deg.clear();
    for (const auto& [a, b] : edges) {
      const int32_t ka = keyer.id(a);
      if (deg.size() < keyer.size()) deg.resize(keyer.size(), 0);
      deg[ka] += 1;
      const int32_t kb = keyer.id(b);
      if (deg.size() < keyer.size()) deg.resize(keyer.size(), 0);
      deg[kb] -= 1;
    }
    bool drift = false;
    for (int32_t d : deg)
      if (d != 0) {
        drift = true;
        break;
      }
    if (drift) anyUnbalanced = true;
    if (drift && stats.arrangementTrace &&
        (!stats.arrangementOpen || static_cast<int64_t>(edges.size()) > stats.arrangementOpen->edges)) {
      SubtractStats::ArrangementOpen open;
      open.side = which == 0 ? "below" : "above";
      open.edges = static_cast<int64_t>(edges.size());
      for (size_t id = 0; id < deg.size() && open.driftBy.size() < 12; id++)
        if (deg[id] != 0)
          open.driftBy.push_back({coordString(keyer.first(static_cast<int32_t>(id))->c), deg[id]});
      stats.arrangementOpen = std::move(open);
      if (trace) {
        stats.arrangementEdges = *trace;
        stats.arrangementSeam = seamTrace;
      }
    }
  }
  if (anyUnbalanced) stats.arrangementWhy.unevenSplit++;
  auto below = chain(belowEdges);
  auto above = chain(aboveEdges);
  if (!below || !above) {
    stats.arrangementWhy.chainOpen++;
  } else if (below->empty() || above->empty()) {
    stats.arrangementWhy.emptySide++;
    const size_t emptyEdges = below->empty() ? belowEdges.size() : aboveEdges.size();
    if (emptyEdges == 0)
      stats.arrangementWhy.emptyNoEdges++;
    else
      stats.arrangementWhy.emptyLoopsDropped++;
  }
  if (!below || !above || below->empty() || above->empty()) return std::nullopt;
  return TwoSides{std::move(*below), std::move(*above)};
}

// Where the segment crosses the plane, ordered so the answer is a function of the edge.
std::optional<P3> meet(const double* a, const double* b, const Anchor& plane) {
  if (a[0] > b[0] || (a[0] == b[0] && (a[1] > b[1] || (a[1] == b[1] && a[2] > b[2])))) std::swap(a, b);
  const double* q0 = plane[0]->c;
  const double* q1 = plane[1]->c;
  const double* q2 = plane[2]->c;
  const double ux = q1[0] - q0[0], uy = q1[1] - q0[1], uz = q1[2] - q0[2];
  const double wx = q2[0] - q0[0], wy = q2[1] - q0[1], wz = q2[2] - q0[2];
  const double nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
  const double da = (a[0] - q0[0]) * nx + (a[1] - q0[1]) * ny + (a[2] - q0[2]) * nz;
  const double db = (b[0] - q0[0]) * nx + (b[1] - q0[1]) * ny + (b[2] - q0[2]) * nz;
  const double spread = da - db;
  if (spread == 0) return std::nullopt;
  const double t = da / spread;
  return P3{a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t};
}

// Outward normal of a patch, by Newell over its whole ring (anchor cross when the ring has no area).
P3 patchNormal(const Splinter& patch) {
  const P3 n = newellOf(patch.ring);
  if (n[0] != 0 || n[1] != 0 || n[2] != 0) return {n[0] / 2, n[1] / 2, n[2] / 2};
  const double* a = patch.anchor[0]->c;
  const double* b = patch.anchor[1]->c;
  const double* c = patch.anchor[2]->c;
  return {(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
          (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
          (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])};
}

double shardArea(const Splinter& shard) {
  const P3 n = newellOf(shard.ring);
  return jsHypot(n[0], n[1], n[2]) / 2;
}

int dropAxis(const P3& n) {
  const double ax = std::fabs(n[0]), ay = std::fabs(n[1]), az = std::fabs(n[2]);
  return ax >= ay && ax >= az ? 0 : ay >= az ? 1 : 2;
}

// Does `p`, in the patch's plane, fall within the patch's ring? Winding by exact orientation.
bool patchCovers(const Splinter& patch, const P3& p, int drop) {
  const int u = drop == 0 ? 1 : 0, v = drop == 2 ? 1 : 2;
  const double px = p[u], py = p[v];
  const Ring& ring = patch.ring;
  int winding = 0;
  const size_t n = ring.size();
  for (size_t i = 0; i < n; i++) {
    const double* a = ring[i]->c;
    const double* b = ring[(i + 1) % n]->c;
    const double ay = a[v], by = b[v];
    // The side matters only for an edge that straddles the point's line: asked for nothing else.
    if (ay <= py) {
      if (by > py && lineSide(a[u], ay, b[u], by, px, py) > 0) winding++;
    } else if (by <= py && lineSide(a[u], ay, b[u], by, px, py) < 0) {
      winding--;
    }
  }
  return winding != 0;
}

// Does the ring turn the same way at every corner?
bool turnsOneWay(const Ring& ring) {
  const size_t n = ring.size();
  // projectRing over the ring's own corners, written into scratch: the same arithmetic as
  // projectRingWith (tessellate.h), without its three allocations.
  thread_local std::vector<double> scratchXy;
  std::vector<double>& xy = scratchXy;
  {
    double nx = 0, ny = 0, nz = 0;
    for (size_t i = 0; i < n; i++) {
      const double* a = ring[i]->c;
      const double* b = ring[(i + 1) % n]->c;
      nx += (a[1] - b[1]) * (a[2] + b[2]);
      ny += (a[2] - b[2]) * (a[0] + b[0]);
      nz += (a[0] - b[0]) * (a[1] + b[1]);
    }
    const double ax = std::fabs(nx), ay = std::fabs(ny), az = std::fabs(nz);
    const int drop = ax >= ay && ax >= az ? 0 : ay >= az ? 1 : 2;
    xy.resize(n * 2);
    for (size_t i = 0; i < n; i++) {
      const double* v = ring[i]->c;
      if (drop == 0) {
        xy[i * 2] = v[1];
        xy[i * 2 + 1] = v[2];
      } else if (drop == 1) {
        xy[i * 2] = v[2];
        xy[i * 2 + 1] = v[0];
      } else {
        xy[i * 2] = v[0];
        xy[i * 2 + 1] = v[1];
      }
    }
    if ((drop == 0 ? nx : drop == 1 ? ny : nz) < 0)
      for (size_t i = 0; i < n; i++) xy[i * 2 + 1] = -xy[i * 2 + 1];
  }
  int sense = 0;
  for (size_t i = 0; i < n; i++) {
    const size_t a = i, b = (i + 1) % n, c = (i + 2) % n;
    const int turn = lineSide(xy[a * 2], xy[a * 2 + 1], xy[b * 2], xy[b * 2 + 1], xy[c * 2], xy[c * 2 + 1]);
    if (turn == 0) continue;
    if (sense == 0)
      sense = turn;
    else if (turn != sense)
      return false;
  }
  return sense != 0;
}

// A point strictly inside a patch: the average when convex, else the middle of the largest triangle.
P3 somewhereInside(const Splinter& patch) {
  const Ring& ring = patch.ring;
  const size_t n = ring.size();
  if (n > 3 && turnsOneWay(ring)) {
    double cx = 0, cy = 0, cz = 0;
    for (const RingCorner* p : ring) {
      cx += p->c[0];
      cy += p->c[1];
      cz += p->c[2];
    }
    const double k = static_cast<double>(n);
    return {cx / k, cy / k, cz / k};
  }
  if (n == 3) {
    return {(ring[0]->c[0] + ring[1]->c[0] + ring[2]->c[0]) / 3,
            (ring[0]->c[1] + ring[1]->c[1] + ring[2]->c[1]) / 3,
            (ring[0]->c[2] + ring[1]->c[2] + ring[2]->c[2]) / 3};
  }
  std::vector<int32_t> ids(n);
  for (size_t i = 0; i < n; i++) ids[i] = static_cast<int32_t>(i);
  const FlatRing flat = projectRingWith(
      std::span<const int32_t>(ids), [&](int32_t i) { return ring[i]->c[0]; },
      [&](int32_t i) { return ring[i]->c[1]; }, [&](int32_t i) { return ring[i]->c[2]; });
  const std::vector<int32_t> tris = triangleRing(flat);
  double best = -1, bx = 0, by = 0, bz = 0;
  for (size_t t = 0; t + 2 < tris.size(); t += 3) {
    const double* a = ring[tris[t]]->c;
    const double* b = ring[tris[t + 1]]->c;
    const double* c = ring[tris[t + 2]]->c;
    const double ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const double wx = c[0] - a[0], wy = c[1] - a[1], wz = c[2] - a[2];
    const double nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
    const double area = nx * nx + ny * ny + nz * nz;
    if (area > best) {
      best = area;
      bx = (a[0] + b[0] + c[0]) / 3;
      by = (a[1] + b[1] + c[1]) / 3;
      bz = (a[2] + b[2] + c[2]) / 3;
    }
  }
  if (best > 0) return {bx, by, bz};
  double x = 0, y = 0, z = 0;
  for (const RingCorner* p : ring) {
    x += p->c[0];
    y += p->c[1];
    z += p->c[2];
  }
  const double k = static_cast<double>(n);
  return {x / k, y / k, z / k};
}

// ── stats helpers ────────────────────────────────────────────────────────────────────────────────

inline bool noting() {
  return stats.detailOn && static_cast<int64_t>(stats.detail.size()) < stats.detailCap;
}

void note(const char* where, const Splinter& shard, const std::string& verdict, int32_t tool) {
  if (!noting()) return;
  const P3 n = patchNormal(shard);
  const double len = orElse(jsHypot(n[0], n[1], n[2]), 1);
  stats.detail.push_back({where, {n[0] / len, n[1] / len, n[2] / len}, shardArea(shard), verdict,
                          tool, currentCall, shard.plane});
}

std::vector<P3> ringCoords(const Ring& r) {
  std::vector<P3> out;
  out.reserve(r.size());
  for (const RingCorner* p : r) out.push_back({p->c[0], p->c[1], p->c[2]});
  return out;
}

// ── cut ──────────────────────────────────────────────────────────────────────────────────────────

struct CutResult {
  // 0: negative = [patch], positive = []; 1: negative = [], positive = [patch]; 2: the pieces.
  int kind = 0;
  std::vector<Splinter> negative, positive;
};

Splinter pieceOf(const Splinter& patch, Ring ring, int8_t path, int32_t crossings, int32_t onPlane) {
  Splinter s;
  s.ring = std::move(ring);
  s.anchor = patch.anchor;
  s.plane = patch.plane;
  s.from = patch.from;
  s.hasBorn = true;
  s.bornAt = {path, crossings, onPlane};
  return s;
}

// Whether q lies on the segment a-b within the weld (ends included).
bool nearEdge(const double* q, const double* a, const double* b) {
  const double f = fuseDistance();
  const double tol = f != 0 ? f : WELD_METRES;
  const double dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
  const double len2 = dx * dx + dy * dy + dz * dz;
  const double px = q[0] - a[0], py = q[1] - a[1], pz = q[2] - a[2];
  if (len2 <= 0) return px * px + py * py + pz * pz <= tol * tol;
  const double t = jsMin(1.0, jsMax(0.0, (px * dx + py * dy + pz * dz) / len2));
  const double ex = px - t * dx, ey = py - t * dy, ez = pz - t * dz;
  return ex * ex + ey * ey + ez * ez <= tol * tol;
}

CutResult cut(const Splinter& patch, int32_t planeSlot, PlaneSet& planes) {
  const Anchor plane = planes.anchors[planeSlot];
  const Ring& ring = patch.ring;
  const int n = static_cast<int>(ring.size());
  struct Scratch {
    std::vector<int> sides, pulled;
    std::vector<int8_t> tangentRunSide;
    std::vector<RingCorner*> meetsAt;
    std::vector<int32_t> on, tags;
  };
  thread_local Scratch sc;
  std::vector<int>& sides = sc.sides;
  sides.resize(n);
  for (int i = 0; i < n; i++) sides[i] = whichSideOfPlane(plane, ring[i]->c);
  if (pullSidesAtCut) {
    if (pullSidesOnPlane(ring, sides, plane, sc.pulled)) sides.swap(sc.pulled);
  }

  bool anyAbove = false, anyBelow = false;
  for (int s : sides) {
    if (s > 0) anyAbove = true;
    if (s < 0) anyBelow = true;
  }
  if (!anyAbove) return CutResult{0, {}, {}};
  if (!anyBelow) return CutResult{1, {}, {}};

  int32_t crossingsAtCut = 0, onPlaneCorners = 0;
  {
    int32_t crossings = 0;
    for (int i = 0; i < n; i++) {
      if (sides[i] == 0) onPlaneCorners++;
      const int si = sides[i], sj = sides[(i + 1) % n];
      if (si != 0 && sj != 0 && si != sj) crossings++;
    }
    stats.cutCalls++;
    crossingsAtCut = crossings;
    if (crossings > 2) stats.cutManyCrossings++;
    int32_t runs = 0, tangent = 0, effective = crossings;
    for (int i = 0; i < n; i++) {
      if (sides[i] != 0 || sides[(i - 1 + n) % n] == 0) continue;
      int end = i;
      while (sides[(end + 1) % n] == 0) end++;
      if (end == i) continue;
      runs++;
      const int back = sides[(i - 1 + n) % n];
      const int fwd = sides[(end + 1) % n];
      if (back == fwd)
        tangent++;
      else
        effective++;
    }
    if (runs) {
      stats.cutRunOnPlane++;
      stats.cutRunTangent += tangent;
      stats.cutRunCrossing += runs - tangent;
      if (effective > 2 && crossings <= 2) stats.cutCrossingsHiddenByRuns++;
    }
  }
  Ring belowRaw, aboveRaw;
  belowRaw.reserve(n + 2);
  aboveRaw.reserve(n + 2);

  std::vector<int8_t>& tangentRunSide = sc.tangentRunSide;  // 0 = undefined
  tangentRunSide.assign(n, 0);
  for (int i = 0; i < n; i++) {
    if (sides[i] != 0 || sides[(i - 1 + n) % n] == 0) continue;
    int end = i;
    while (sides[(end + 1) % n] == 0) end++;
    if (end == i) continue;
    const int back = sides[(i - 1 + n) % n];
    if (back != sides[(end + 1) % n]) continue;
    for (int k = i; k <= end; k++) tangentRunSide[k % n] = static_cast<int8_t>(back);
  }

  std::vector<RingCorner*>& meetsAt = sc.meetsAt;
  meetsAt.assign(n, nullptr);
  int32_t meetCount = 0;
  std::vector<int32_t>& on = sc.on;
  for (int i = 0; i < n; i++) {
    const int j = (i + 1) % n;
    RingCorner* pi = ring[i];
    RingCorner* pj = ring[j];
    const int si = sides[i], sj = sides[j];

    RingCorner* kept = pi;
    if (si == 0) {
      std::vector<int32_t>& tags = sc.tags;
      tags.clear();
      if (pi->tagged)
        tags.insert(tags.end(), planes.tagPool.begin() + pi->onAt,
                    planes.tagPool.begin() + pi->onAt + pi->onCount);
      tags.push_back(planeSlot);
      kept = tagPlanes(planes, planes.mint(pi->c[0], pi->c[1], pi->c[2]), tags);
    }
    const int owner = tangentRunSide[i];
    if (owner != 0) stats.tangentRunCornersKeptOnce++;
    if (si <= 0 && owner != 1) belowRaw.push_back(kept);
    if (si >= 0 && owner != -1) aboveRaw.push_back(kept);

    if (si != 0 && sj != 0 && si != sj) {
      on.clear();
      sharedPlanes(planes, pi, pj, on);
      on.push_back(planeSlot);
      std::sort(on.begin(), on.end());
      on.erase(std::unique(on.begin(), on.end()), on.end());
      RingCorner* point = nullptr;
      const int L = static_cast<int>(on.size());
      for (int a = 0; a < L - 2 && !point; a++)
        for (int b = a + 1; b < L - 1 && !point; b++)
          for (int c = b + 1; c < L && !point; c++) {
            // A solve between faces a few microns out of plane can pass its determinant test and land
            // millimetres off the edge; neighbours left uncut by the gate cannot follow it there, so
            // only a crossing within a weld of the edge is taken, else the edge is cut directly.
            RingCorner* solved = planes.corner(on[a], on[b], on[c]);
            if (solved && nearEdge(solved->c, pi->c, pj->c)) point = solved;
            else if (solved) stats.crossingsOffEdge++;
          }
      planeAudit.crossings++;
      if (!point) {
        planeAudit.routeCrossings++;
        if (L < 3)
          planeAudit.crossingsUntagged++;
        else
          planeAudit.crossingsNoTriple++;
      }
      if (auditPlaneBuckets) {
        const double* P = pi->c;
        const double* Q = pj->c;
        const bool piLow = P[0] < Q[0] || (P[0] == Q[0] && (P[1] < Q[1] || (P[1] == Q[1] && P[2] <= Q[2])));
        const double* lo = piLow ? P : Q;
        const double* hi = piLow ? Q : P;
        const std::array<uint64_t, 7> key{numKey(lo[0]), numKey(lo[1]), numKey(lo[2]), numKey(hi[0]),
                                          numKey(hi[1]), numKey(hi[2]),
                                          static_cast<uint64_t>(static_cast<int64_t>(planeSlot))};
        auto seen = crossingMethod.find(key);
        if (seen == crossingMethod.end()) {
          crossingMethod.emplace(key, point != nullptr);
        } else {
          planeAudit.jointEdges++;
          if (seen->second != (point != nullptr)) planeAudit.methodDisagreed++;
        }
      }
      std::optional<P3> computed;
      const double* crossing = nullptr;
      if (point) {
        crossing = point->c;
      } else {
        computed = meet(pi->c, pj->c, plane);
        if (computed) crossing = computed->data();
      }
      if (crossing) {
        RingCorner* landed = point;
        int snapped = 0;  // 1 = onto pi, 2 = onto pj
        stats.touched |= TOUCHED_CROSSING;
        if (crossSnapRelative > 0) {
          const double len = jsHypot(pj->c[0] - pi->c[0], pj->c[1] - pi->c[1], pj->c[2] - pi->c[2]);
          const double di = jsHypot(crossing[0] - pi->c[0], crossing[1] - pi->c[1], crossing[2] - pi->c[2]);
          const double dj = jsHypot(crossing[0] - pj->c[0], crossing[1] - pj->c[1], crossing[2] - pj->c[2]);
          const double tol = len * crossSnapRelative;
          if (di <= tol && di <= dj) {
            snapped = 1;
            stats.crossSnapped++;
          } else if (dj <= tol) {
            snapped = 2;
            stats.crossSnapped++;
          }
        }
        if (snapped == 1)
          landed = planes.mint(pi->c[0], pi->c[1], pi->c[2]);
        else if (snapped == 2)
          landed = planes.mint(pj->c[0], pj->c[1], pj->c[2]);
        else if (!landed)
          landed = planes.mint(crossing[0], crossing[1], crossing[2]);
        RingCorner* v = tagPlanes(planes, landed, on);
        belowRaw.push_back(v);
        aboveRaw.push_back(v);
        meetsAt[i] = v;
        meetCount++;
      }
    }
  }

  Ring below = peelSeamReversals(std::move(belowRaw), plane);
  Ring above = peelSeamReversals(std::move(aboveRaw), plane);

  if (arrangementSplit) {
    auto parts = splitRingByArrangement(ring, sides, plane, patchNormal(patch), meetsAt);
    if (parts) {
      auto wrap = [&](std::vector<Ring>& rings) {
        std::vector<Splinter> out;
        for (Ring& r : rings)
          if (r.size() >= 3 && !isNeedle(r))
            out.push_back(pieceOf(patch, std::move(r), BORN_ARRANGEMENT, crossingsAtCut, onPlaneCorners));
        return out;
      };
      std::vector<Splinter> neg = wrap(parts->below), pos = wrap(parts->above);
      if (!neg.empty() && !pos.empty()) {
        stats.arrangementSplits++;
        stats.cutExitArrangement++;
        for (const Splinter& q : neg)
          if (!windsWithParent(q.ring, ring)) stats.arrangementPieceReversed++;
        for (const Splinter& q : pos)
          if (!windsWithParent(q.ring, ring)) stats.arrangementPieceReversed++;
        if (stats.overlapTest) {
          for (const std::vector<Splinter>* sidePieces : {&neg, &pos}) {
            const auto& side = *sidePieces;
            for (size_t x = 0; x < side.size(); x++) {
              for (size_t y = x + 1; y < side.size(); y++) {
                stats.arrangementOverlapChecked++;
                const Splinter& px = side[x];
                const Splinter& py = side[y];
                const int drop = dropAxis(patchNormal(px));
                if (!patchCovers(py, somewhereInside(px), drop) &&
                    !patchCovers(px, somewhereInside(py), drop))
                  continue;
                stats.arrangementOverlapFound++;
                stats.arrangementOverlapArea += jsMin(shardArea(px), shardArea(py));
              }
            }
          }
        }
        return CutResult{2, std::move(neg), std::move(pos)};
      }
    }
    stats.arrangementRefused++;
    if (crossingsAtCut > 2) {
      stats.fallbackManyCrossings++;
    } else {
      stats.fallbackFewCrossings++;
      if (onPlaneCorners) stats.fallbackFewWithOnPlane++;
    }
  }

  const bool fewBelow = below.size() < 3, fewAbove = above.size() < 3;
  const bool thinBelow = fewBelow || isNeedle(below);
  const bool thinAbove = fewAbove || isNeedle(above);
  if (thinBelow || thinAbove) {
    stats.cutRefusedThin++;
    if (fewBelow || fewAbove)
      stats.cutRefusedFewCorners++;
    else
      stats.cutRefusedNoArea++;
  }
  if (thinBelow || thinAbove) stats.cutExitThin++;
  if (thinBelow && thinAbove) return CutResult{0, {}, {}};
  if (thinBelow) return CutResult{1, {}, {}};
  if (thinAbove) return CutResult{0, {}, {}};

  if (meetCount > 2) {
    stats.cutSplitAttempted++;
    auto parts = splitAcrossPlane(ring, sides, meetsAt, meetCount);
    if (!parts)
      stats.cutSplitRefused++;
    else if (parts->below.empty() || parts->above.empty())
      stats.cutSplitOneSided++;
    if (parts) {
      stats.cutSplitIntoParts++;
      auto wrap = [&](std::vector<Ring>& rings) {
        std::vector<Splinter> out;
        for (Ring& r0 : rings) {
          Ring r = peelSeamReversals(std::move(r0), plane);
          if (r.size() >= 3 && !isNeedle(r))
            out.push_back(pieceOf(patch, std::move(r), BORN_SPLIT, crossingsAtCut, onPlaneCorners));
        }
        return out;
      };
      std::vector<Splinter> neg = wrap(parts->below), pos = wrap(parts->above);
      for (const Splinter& q : neg)
        if (!windsWithParent(q.ring, ring)) stats.rebuiltPieceReversed++;
      for (const Splinter& q : pos)
        if (!windsWithParent(q.ring, ring)) stats.rebuiltPieceReversed++;
      if (!neg.empty() && !pos.empty()) {
        stats.cutExitSplit++;
        return CutResult{2, std::move(neg), std::move(pos)};
      }
    }
  }

  const bool belowRev = !windsWithParent(below, ring), aboveRev = !windsWithParent(above, ring);
  if (belowRev || aboveRev) {
    stats.walkedPieceReversed++;
    stats.walkedReversedDetail.push_back({crossingsAtCut, onPlaneCorners, n, meetCount > 2,
                                          belowRev && aboveRev ? "both" : belowRev ? "below" : "above"});
    if (stats.wprTrace)
      stats.wprRings.push_back({ringCoords(ring), std::vector<int32_t>(sides.begin(), sides.end()),
                                ringCoords(below), ringCoords(above)});
  }
  stats.cutExitWalk++;
  CutResult out{2, {}, {}};
  out.negative.push_back(pieceOf(patch, std::move(below), BORN_WALK, crossingsAtCut, onPlaneCorners));
  out.positive.push_back(pieceOf(patch, std::move(above), BORN_WALK, crossingsAtCut, onPlaneCorners));
  return out;
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// Classification
// ═════════════════════════════════════════════════════════════════════════════════════════════════

enum class Standing : int8_t { in = 0, out = 1, onSame = 2, onOpp = 3 };
const char* standingName(Standing s) {
  switch (s) {
    case Standing::in:
      return "in";
    case Standing::out:
      return "out";
    case Standing::onSame:
      return "onSame";
    default:
      return "onOpp";
  }
}

// Signed solid angle of a triangle seen from p.
double solidAngle(const double* p, const double* a, const double* b, const double* c) {
  const double ax = a[0] - p[0], ay = a[1] - p[1], az = a[2] - p[2];
  const double bx = b[0] - p[0], by = b[1] - p[1], bz = b[2] - p[2];
  const double cx = c[0] - p[0], cy = c[1] - p[1], cz = c[2] - p[2];
  const double la = jsHypot(ax, ay, az), lb = jsHypot(bx, by, bz), lc = jsHypot(cx, cy, cz);
  if (la == 0 || lb == 0 || lc == 0) return 0;
  const double determinant = ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx);
  if (determinant == 0) return 0;
  const double denominator = la * lb * lc + (ax * bx + ay * by + az * bz) * lc +
                             (ax * cx + ay * cy + az * cz) * lb + (bx * cx + by * cy + bz * cz) * la;
  return 2 * jsAtan2(determinant, denominator);
}

// Is the point inside the closed solid, by winding number?
// The box of a solid's corners, [lo xyz, hi xyz].
std::array<double, 6> boxOfPatches(const std::vector<Splinter>& solid) {
  std::array<double, 6> b{kInf, kInf, kInf, -kInf, -kInf, -kInf};
  for (const Splinter& patch : solid)
    for (const auto* corner : patch.ring)
      for (int k = 0; k < 3; k++) {
        const double c = corner->c[k];
        if (c < b[k]) b[k] = c;
        if (c > b[k + 3]) b[k + 3] = c;
      }
  return b;
}

// The winding number of a solid around a point, counted along the ray from the point towards +X: each
// fan triangle the ray crosses adds +1 or -1 by which way it faces. The same integer the solid angle
// sum divides into 4π, with no atan2 per triangle: almost every triangle is dropped by its YZ box with
// four comparisons. Whenever the ray is not clean -- within a tolerance of a triangle's edge, or the
// point on a triangle's plane where the ray meets it -- it answers "unknown" and the caller sums solid
// angles as before, so a graze is never nudged. Same rule as the TS kernel's rayWinding.
static bool enclosesByRay = std::getenv("BREP_NO_RAY") == nullptr;
static bool rayWinding(const std::vector<Splinter>& solid, const P3& p, const std::array<double, 6>& box, int& winding) {
  const double size = std::max({box[3] - box[0], box[4] - box[1], box[5] - box[2], 0.0});
  const double tol = 1e-9 * size + 1e-12;
  const double px = p[0], py = p[1], pz = p[2];
  winding = 0;
  for (const Splinter& patch : solid) {
    const Ring& ring = patch.ring;
    if (ring.size() < 3) continue;
    const double* A = ring[0]->c;
    for (size_t i = 1; i + 1 < ring.size(); i++) {
      const double* B = ring[i]->c;
      const double* C = ring[i + 1]->c;
      const double ay = A[1], az = A[2], by = B[1], bz = B[2], cy = C[1], cz = C[2];
      if (py < std::min({ay, by, cy}) - tol || py > std::max({ay, by, cy}) + tol || pz < std::min({az, bz, cz}) - tol ||
          pz > std::max({az, bz, cz}) + tol)
        continue;
      const double area2 = (by - ay) * (cz - az) - (bz - az) * (cy - ay);
      // Signed doubled areas of (a,b,p), (b,c,p), (c,a,p) in YZ: the weights of c, a and b.
      const double dc = (by - ay) * (pz - az) - (bz - az) * (py - ay);
      const double da = (cy - by) * (pz - bz) - (cz - bz) * (py - by);
      const double db = (ay - cy) * (pz - cz) - (az - cz) * (py - cy);
      const double lab = std::hypot(by - ay, bz - az), lbc = std::hypot(cy - by, cz - bz), lca = std::hypot(ay - cy, az - cz);
      const bool nearAB = std::fabs(dc) <= tol * lab, nearBC = std::fabs(da) <= tol * lbc, nearCA = std::fabs(db) <= tol * lca;
      const double longest = std::max({lab, lbc, lca});
      // Edge-on to the ray: crossed only through its edges, which the neighbours own.
      if (std::fabs(area2) <= tol * longest) continue;
      const int s = area2 > 0 ? 1 : -1;
      if (dc * s < 0 && !nearAB) continue;
      if (da * s < 0 && !nearBC) continue;
      if (db * s < 0 && !nearCA) continue;
      if (nearAB || nearBC || nearCA) return false;
      const double x = (da * A[0] + db * B[0] + dc * C[0]) / area2;
      if (std::fabs(x - px) <= tol) return false;
      if (x > px) winding += s;
    }
  }
  return true;
}

bool encloses(const std::vector<Splinter>& solid, const P3& p, const std::array<double, 6>* knownBox = nullptr) {
  // A point outside the solid's box sees the whole surface inside one open half-space, so the
  // winding sum is ~0 and can never pass 2π: answer without the per-triangle atan2. The box comes
  // with the solid's plane index when there is one (computed once, not per question).
  const std::array<double, 6> own = knownBox ? std::array<double, 6>{} : boxOfPatches(solid);
  const std::array<double, 6>& box = knownBox ? *knownBox : own;
  for (int k = 0; k < 3; k++)
    if (p[k] < box[k] || p[k] > box[k + 3]) return false;
  if (enclosesByRay) {
    int winding = 0;
    if (rayWinding(solid, p, box, winding)) return winding != 0;
  }
  // Fast pass with the platform's sqrt/atan2. Inside sums to ~±4π, outside to ~0: the decision has
  // a margin of 2π and the fast sum is off by a few ulps per triangle, so it decides on its own
  // unless it lands near the threshold (a point on the surface) -- then the exact JS-faithful sum.
  {
    double fast = 0;
    const double* q = p.data();
    for (const Splinter& patch : solid) {
      const Ring& ring = patch.ring;
      for (size_t i = 1; i + 1 < ring.size(); i++) {
        const double* a = ring[0]->c;
        const double* b = ring[i]->c;
        const double* c = ring[i + 1]->c;
        const double ax = a[0] - q[0], ay = a[1] - q[1], az = a[2] - q[2];
        const double bx = b[0] - q[0], by = b[1] - q[1], bz = b[2] - q[2];
        const double cx = c[0] - q[0], cy = c[1] - q[1], cz = c[2] - q[2];
        const double la = std::sqrt(ax * ax + ay * ay + az * az), lb = std::sqrt(bx * bx + by * by + bz * bz),
                     lc = std::sqrt(cx * cx + cy * cy + cz * cz);
        if (la == 0 || lb == 0 || lc == 0) continue;
        const double det = ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx);
        if (det == 0) continue;
        const double den = la * lb * lc + (ax * bx + ay * by + az * bz) * lc + (ax * cx + ay * cy + az * cz) * lb +
                           (bx * cx + by * cy + bz * cz) * la;
        fast += 2 * std::atan2(det, den);
      }
    }
    const double margin = std::fabs(std::fabs(fast) - 2 * kPI);
    if (margin > 1e-3) return std::fabs(fast) > 2 * kPI;
  }
  double total = 0;
  for (const Splinter& patch : solid) {
    const Ring& ring = patch.ring;
    for (size_t i = 1; i + 1 < ring.size(); i++)
      total += solidAngle(p.data(), ring[0]->c, ring[i]->c, ring[i + 1]->c);
  }
  return std::fabs(total) > 2 * kPI;
}

// Patches grouped by plane id (TS Map<number, Splinter[]>, insertion order kept for iteration).
struct PlaneIndex {
  std::array<double, 6> box;  // the indexed solid's corners, for encloses
  std::vector<int32_t> slot;
  std::vector<std::vector<const Splinter*>> groups;
  const std::vector<const Splinter*>* get(int32_t plane) const {
    if (plane < 0 || plane >= static_cast<int32_t>(slot.size()) || slot[plane] < 0) return nullptr;
    return &groups[slot[plane]];
  }
};

PlaneIndex perPlane(const std::vector<Splinter>& patches) {
  PlaneIndex out;
  out.box = boxOfPatches(patches);
  int32_t top = -1;
  for (const Splinter& p : patches) top = std::max(top, p.plane);
  out.slot.assign(static_cast<size_t>(top + 1), -1);
  for (const Splinter& p : patches) {
    int32_t& s = out.slot[p.plane];
    if (s < 0) {
      s = static_cast<int32_t>(out.groups.size());
      out.groups.emplace_back();
    }
    out.groups[s].push_back(&p);
  }
  return out;
}

Standing classifyAt(const Splinter& patch, const P3& at, const std::vector<Splinter>& other,
                    const PlaneIndex& otherByPlane, bool uncoveredIsOut = false) {
  const std::vector<const Splinter*>* coplanar = otherByPlane.get(patch.plane);
  lastClassifyPath = coplanar ? COPLANAR_NOT_COVERED : NO_COPLANAR;
  if (stats.classifyTrace)
    stats.classifyBranch.push_back(
        {patch.plane, coplanar ? static_cast<int32_t>(coplanar->size()) : 0, -1});
  if (coplanar) {
    const P3 mine = patchNormal(patch);
    const int drop = dropAxis(mine);
    int32_t tried = 0;
    for (const Splinter* face : *coplanar) {
      tried++;
      if (!patchCovers(*face, at, drop)) continue;
      if (stats.classifyTrace) stats.classifyBranch.back().covered = tried;
      const P3 theirs = patchNormal(*face);
      const double dot = mine[0] * theirs[0] + mine[1] * theirs[1] + mine[2] * theirs[2];
      if (stats.classifyTrace) {
        auto len = [](const P3& v) { return orElse(jsHypot(v[0], v[1], v[2]), 1); };
        stats.senseTrace.push_back({patch.plane,
                                    {mine[0] / len(mine), mine[1] / len(mine), mine[2] / len(mine)},
                                    {theirs[0] / len(theirs), theirs[1] / len(theirs), theirs[2] / len(theirs)},
                                    dot > 0 ? "onSame" : "onOpp",
                                    static_cast<int32_t>(patch.ring.size()),
                                    static_cast<int32_t>(face->ring.size())});
      }
      lastClassifyPath = COVERED_SENSE;
      lastCoplanarMiss = 0;
      return dot > 0 ? Standing::onSame : Standing::onOpp;
    }
  }
  if (coplanar && lastClassifyPath == COPLANAR_NOT_COVERED) {
    double best = kInf;
    for (const Splinter* face : *coplanar) {
      const Ring& r = face->ring;
      const size_t n = r.size();
      for (size_t i = 0; i < n; i++) {
        const double* a = r[i]->c;
        const double* b = r[(i + 1) % n]->c;
        const double ex = b[0] - a[0], ey = b[1] - a[1], ez = b[2] - a[2];
        const double squaredLen = ex * ex + ey * ey + ez * ez;
        double t = squaredLen == 0
                       ? 0
                       : ((at[0] - a[0]) * ex + (at[1] - a[1]) * ey + (at[2] - a[2]) * ez) / squaredLen;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const double d = jsHypot(at[0] - (a[0] + t * ex), at[1] - (a[1] + t * ey), at[2] - (a[2] + t * ez));
        if (d < best) best = d;
      }
    }
    lastCoplanarMiss = best == kInf ? -1 : best;
    stats.touched |= TOUCHED_COPLANAR_UNCOVERED;
    if (uncoveredIsOut) {
      if (uncoveredOffPlaneProbe) {
        const P3 n = patchNormal(patch);
        const double l = jsHypot(n[0], n[1], n[2]);
        if (l > 0) {
          const double eps = (8 * planeIdentity()) / l;
          const P3 up{at[0] + n[0] * eps, at[1] + n[1] * eps, at[2] + n[2] * eps};
          const P3 dn{at[0] - n[0] * eps, at[1] - n[1] * eps, at[2] - n[2] * eps};
          if (encloses(other, up, &otherByPlane.box) && encloses(other, dn, &otherByPlane.box)) {
            stats.uncoveredProbeIn++;
            return Standing::in;
          }
          stats.uncoveredProbeOut++;
        }
      }
      return Standing::out;
    }
  }
  return encloses(other, at, &otherByPlane.box) ? Standing::in : Standing::out;
}

Standing classify(const Splinter& patch, const std::vector<Splinter>& other, const PlaneIndex& otherByPlane) {
  return classifyAt(patch, somewhereInside(patch), other, otherByPlane);
}

Standing classifyAtUncoveredIn(const Splinter& patch, const P3& at, const std::vector<Splinter>& other,
                               const PlaneIndex& otherByPlane) {
  if (!otherByPlane.get(patch.plane)) return classifyAt(patch, at, other, otherByPlane);
  const Standing said = classifyAt(patch, at, other, otherByPlane);
  return lastClassifyPath == COPLANAR_NOT_COVERED ? Standing::in : said;
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// Shatter
// ═════════════════════════════════════════════════════════════════════════════════════════════════

using Box = std::array<double, 6>;

Box ringExtent(const Ring& ring) {
  double lx = kInf, ly = kInf, lz = kInf, hx = -kInf, hy = -kInf, hz = -kInf;
  for (const RingCorner* q : ring) {
    const double* p = q->c;
    if (p[0] < lx) lx = p[0];
    if (p[0] > hx) hx = p[0];
    if (p[1] < ly) ly = p[1];
    if (p[1] > hy) hy = p[1];
    if (p[2] < lz) lz = p[2];
    if (p[2] > hz) hz = p[2];
  }
  return {lx, ly, lz, hx, hy, hz};
}

// Can this plane possibly split a patch with this box? true = definitely not.
bool boxClearsPlane(const Box& box, const Anchor& plane) {
  const double* a = plane[0]->c;
  const double* b = plane[1]->c;
  const double* c = plane[2]->c;
  const double ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
  const double vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
  const double nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
  if (!(truthy(nx) || truthy(ny) || truthy(nz))) return false;
  auto lo = [](double n, double l, double h) { return n >= 0 ? l : h; };
  auto hi = [](double n, double l, double h) { return n >= 0 ? h : l; };
  const double dLo = nx * (lo(nx, box[0], box[3]) - a[0]) + ny * (lo(ny, box[1], box[4]) - a[1]) +
                     nz * (lo(nz, box[2], box[5]) - a[2]);
  const double dHi = nx * (hi(nx, box[0], box[3]) - a[0]) + ny * (hi(ny, box[1], box[4]) - a[1]) +
                     nz * (hi(nz, box[2], box[5]) - a[2]);
  const double reach = (std::fabs(nx) + std::fabs(ny) + std::fabs(nz)) *
                       (std::fabs(box[0]) + std::fabs(box[1]) + std::fabs(box[2]) + std::fabs(box[3]) +
                        std::fabs(box[4]) + std::fabs(box[5]) + std::fabs(a[0]) + std::fabs(a[1]) +
                        std::fabs(a[2]));
  const double margin = reach * 1e-12;
  return dLo > margin || dHi < -margin;
}

Box groupExtent(const std::vector<Splinter>& patches) {
  Box out{kInf, kInf, kInf, -kInf, -kInf, -kInf};
  for (const Splinter& p : patches) {
    const Box b = ringExtent(p.ring);
    for (int i = 0; i < 3; i++)
      if (b[i] < out[i]) out[i] = b[i];
    for (int i = 3; i < 6; i++)
      if (b[i] > out[i]) out[i] = b[i];
  }
  return out;
}

// Cut every patch of `subject` by every plane in `toolPlanes` (the tool patches' planes, in order).
// planeBox (optional, parallel to toolPlanes): the box of the solid each plane belongs to. With the
// gate on, a plane only cuts a piece whose box reaches that solid's box: a piece clear of a solid's
// box is outside that solid whatever its planes do, so cutting it there only adds fragments.
std::vector<Splinter> shatter(const std::vector<Splinter>& subject, const std::vector<int32_t>& toolPlanes,
                              PlaneSet& planes, const std::vector<Box>* planeBox = nullptr) {
  std::vector<Splinter> pieces = subject;
  std::vector<Box> boxes;
  boxes.reserve(pieces.size());
  for (const Splinter& p : pieces) boxes.push_back(ringExtent(p.ring));
  std::vector<char> used(planes.anchors.size(), 0);
  const bool gate = gateCutsByToolBox && planeBox && planeBox->size() == toolPlanes.size();
  // Union of the owning solids' boxes per plane slot (a plane shared by two solids reaches both).
  std::unordered_map<int32_t, Box> reachOf;
  if (gate) {
    const double pad = 2 * orElse(fuseDistance(), WELD_METRES);
    for (size_t k = 0; k < toolPlanes.size(); k++) {
      Box b = (*planeBox)[k];
      for (int a = 0; a < 3; a++) {
        b[a] -= pad;
        b[a + 3] += pad;
      }
      auto [it, fresh] = reachOf.try_emplace(toolPlanes[k], b);
      if (!fresh)
        for (int a = 0; a < 3; a++) {
          it->second[a] = std::min(it->second[a], b[a]);
          it->second[a + 3] = std::max(it->second[a + 3], b[a + 3]);
        }
    }
  }
  for (int32_t t : toolPlanes) {
    if (used[t]) continue;
    used[t] = 1;
    const Anchor anchor = planes.anchors[t];
    const Box* reach = gate ? &reachOf[t] : nullptr;
    std::vector<Splinter> next;
    std::vector<Box> nextBoxes;
    next.reserve(pieces.size() + 8);
    nextBoxes.reserve(pieces.size() + 8);
    for (size_t i = 0; i < pieces.size(); i++) {
      Splinter& piece = pieces[i];
      if (piece.plane == t) {
        next.push_back(std::move(piece));
        nextBoxes.push_back(boxes[i]);
        continue;
      }
      if (reach) {
        const Box& p = boxes[i];
        const Box& r = *reach;
        if (p[3] < r[0] || p[0] > r[3] || p[4] < r[1] || p[1] > r[4] || p[5] < r[2] || p[2] > r[5]) {
          next.push_back(std::move(piece));
          nextBoxes.push_back(boxes[i]);
          continue;
        }
      }
      if (prunePlanes && boxClearsPlane(boxes[i], anchor)) {
        next.push_back(std::move(piece));
        nextBoxes.push_back(boxes[i]);
        continue;
      }
      CutResult r = cut(piece, t, planes);
      if (r.kind != 2) {
        next.push_back(std::move(piece));
        nextBoxes.push_back(boxes[i]);
        continue;
      }
      for (Splinter& part : r.negative) {
        nextBoxes.push_back(ringExtent(part.ring));
        next.push_back(std::move(part));
      }
      for (Splinter& part : r.positive) {
        nextBoxes.push_back(ringExtent(part.ring));
        next.push_back(std::move(part));
      }
    }
    pieces = std::move(next);
    boxes = std::move(nextBoxes);
    if (static_cast<int64_t>(pieces.size()) > fragmentCap) {
      shatterCapped = true;
      return {};
    }
  }
  return pieces;
}

std::vector<int32_t> planesOf(const std::vector<Splinter>& patches) {
  std::vector<int32_t> out;
  out.reserve(patches.size());
  for (const Splinter& p : patches) out.push_back(p.plane);
  return out;
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// Capping a clip
// ═════════════════════════════════════════════════════════════════════════════════════════════════

void capOpening(LinkedShellGraph& graph) {
  const std::vector<std::vector<int32_t>> loops = graph.rimLoops();
  stats.capRan++;
  if (stats.capTrace)
    stats.capLoopCounts.push_back({static_cast<int32_t>(loops.size()), graph.boundaryDarts(),
                                   LinkedShellGraph::lastBoundaryRefusal,
                                   static_cast<int32_t>(graph.excessEdges.size()), graph.panelTally()});
  if (loops.empty()) {
    graph.seal();
    return;
  }
  if (loops.size() == 1) {
    if (loops[0].size() >= 3) graph.appendPanel(loops[0]);
    graph.seal();
    return;
  }

  struct Info {
    const std::vector<int32_t>* loop;
    std::vector<P3> ring;
    double area;
    P3 unit;
    double offset;
  };
  std::vector<Info> info;
  info.reserve(loops.size());
  for (const auto& loop : loops) {
    Info one;
    one.loop = &loop;
    for (int32_t v : loop) one.ring.push_back({graph.pointXOf(v), graph.pointYOf(v), graph.pointZOf(v)});
    double nx = 0, ny = 0, nz = 0;
    for (size_t i = 0; i < one.ring.size(); i++) {
      const P3& a = one.ring[i];
      const P3& b = one.ring[(i + 1) % one.ring.size()];
      nx += (a[1] - b[1]) * (a[2] + b[2]);
      ny += (a[2] - b[2]) * (a[0] + b[0]);
      nz += (a[0] - b[0]) * (a[1] + b[1]);
    }
    const P3 v{nx / 2, ny / 2, nz / 2};
    one.area = jsHypot(v[0], v[1], v[2]);
    one.unit = one.area > 0 ? P3{v[0] / one.area, v[1] / one.area, v[2] / one.area} : P3{0, 0, 0};
    one.offset = one.area > 0 ? one.unit[0] * one.ring[0][0] + one.unit[1] * one.ring[0][1] +
                                    one.unit[2] * one.ring[0][2]
                              : 0;
    info.push_back(std::move(one));
  }

  const double tol = orElse(graph.tolerance, WELD_METRES);
  std::vector<std::vector<int32_t>> groups;
  for (size_t idx = 0; idx < info.size(); idx++) {
    const Info& one = info[idx];
    std::vector<int32_t>* found = nullptr;
    for (auto& g : groups) {
      const Info& other = info[g[0]];
      const double dot = one.unit[0] * other.unit[0] + one.unit[1] * other.unit[1] + one.unit[2] * other.unit[2];
      if (std::fabs(std::fabs(dot) - 1) > 1e-9) continue;
      const double off = dot > 0 ? one.offset : -one.offset;
      if (std::fabs(off - other.offset) <= jsMax(tol, 1e-9)) {
        found = &g;
        break;
      }
    }
    if (found)
      found->push_back(static_cast<int32_t>(idx));
    else
      groups.push_back({static_cast<int32_t>(idx)});
  }

  if (stats.capTrace) {
    for (const auto& group : groups) {
      std::vector<SubtractStats::CapGroupEntry> entry;
      for (int32_t g : group)
        entry.push_back({static_cast<int32_t>(info[g].loop->size()), info[g].area, info[g].unit, info[g].offset});
      stats.capGroups.push_back(std::move(entry));
    }
  }

  for (const auto& group : groups) {
    if (group.size() == 1) {
      if (info[group[0]].loop->size() >= 3) graph.appendPanel(*info[group[0]].loop);
      continue;
    }
    int32_t refIdx = group[0];
    for (int32_t g : group)
      if (info[g].area > info[refIdx].area) refIdx = g;
    const P3 ref = info[refIdx].unit;
    auto along = [&](const Info& g) { return g.unit[0] * ref[0] + g.unit[1] * ref[1] + g.unit[2] * ref[2]; };
    std::vector<int32_t> rimEdges, throughCuts;
    for (int32_t g : group)
      if (along(info[g]) > 0) rimEdges.push_back(g);
    for (int32_t g : group)
      if (along(info[g]) <= 0) throughCuts.push_back(g);
    if (rimEdges.size() != 1 || throughCuts.empty()) {
      for (int32_t g : group)
        if (info[g].loop->size() >= 3) graph.appendPanel(*info[g].loop);
      continue;
    }
    const Info& outer = info[rimEdges[0]];
    std::vector<int32_t> mine;
    for (int32_t b : throughCuts)
      if (pointInsideRingAt(
              outer.ring.size(), [&](size_t k) { return outer.ring[k].data(); }, outer.unit.data(),
              info[b].ring[0].data()))
        mine.push_back(b);
    for (int32_t stray : throughCuts)
      if (std::find(mine.begin(), mine.end(), stray) == mine.end() && info[stray].loop->size() >= 3)
        graph.appendPanel(*info[stray].loop);
    if (mine.empty()) {
      if (outer.loop->size() >= 3) graph.appendPanel(*outer.loop);
      continue;
    }
    std::vector<std::vector<P3>> voids;
    for (int32_t b : mine) voids.push_back(info[b].ring);
    const auto pieces = carvePanelVoids(outer.ring, voids);
    if (!pieces) continue;
    for (const auto& piece : *pieces) {
      std::vector<int32_t> ids;
      for (const P3& p : piece) {
        const int32_t v = graph.placeCorner(p[0], p[1], p[2]);
        if (ids.empty() || ids.back() != v) ids.push_back(v);
      }
      while (ids.size() > 1 && ids.front() == ids.back()) ids.pop_back();
      if (ids.size() >= 3) graph.appendPanel(ids);
    }
  }
  graph.seal();
  if (graph.boundaryDarts() > 0) stats.capLeftOpen++;
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// The operations
// ═════════════════════════════════════════════════════════════════════════════════════════════════

// A graph, TS null, or `keep` itself.
struct Built {
  std::unique_ptr<LinkedShellGraph> g;
  bool isKeep = false;
};

struct BooleanTimer {
  double at;
  BooleanTimer() : at(nowMs()) { stats.booleanCalls++; }
  ~BooleanTimer() { stats.booleanMs += nowMs() - at; }
};

std::unique_ptr<LinkedShellGraph> deliver(Built built, const LinkedShellGraph& keep, bool* isKeep) {
  if (isKeep) *isKeep = false;
  if (!built.isKeep) return std::move(built.g);
  if (isKeep) {
    *isKeep = true;
    return nullptr;
  }
  return std::make_unique<LinkedShellGraph>(keep);
}

// Graph adapter for the overlay (TS passes the graph itself).
struct GraphOverlay final : OverlayGeometry {
  LinkedShellGraph& g;
  explicit GraphOverlay(LinkedShellGraph& graph) : g(graph) { tolerance = graph.tolerance; }
  double pointXOf(int32_t v) const override { return g.pointXOf(v); }
  double pointYOf(int32_t v) const override { return g.pointYOf(v); }
  double pointZOf(int32_t v) const override { return g.pointZOf(v); }
  int32_t placeCorner(double x, double y, double z) override { return g.placeCorner(x, y, z); }
};

Built subtractAllInner(const LinkedShellGraph& keep, std::vector<const LinkedShellGraph*> tools) {
  currentCall++;
  latestDecline.clear();
  shatterCapped = false;
  const int64_t outerDroppedAtEntry = stats.outerDropped;
  if (tools.empty()) return Built{nullptr, true};
  if (skipThinTools) {
    const double thin = 10 * orElse(fuseDistance(), WELD_METRES);
    std::vector<const LinkedShellGraph*> kept;
    for (const LinkedShellGraph* t : tools) {
      double lo[3] = {kInf, kInf, kInf}, hi[3] = {-kInf, -kInf, -kInf};
      for (int32_t v = 0; v < t->cornerTally(); v++) {
        const double p[3] = {t->pointXOf(v), t->pointYOf(v), t->pointZOf(v)};
        for (int k = 0; k < 3; k++) {
          if (p[k] < lo[k]) lo[k] = p[k];
          if (p[k] > hi[k]) hi[k] = p[k];
        }
      }
      bool every = true;
      for (int k = 0; k < 3 && every; k++)
        if (!(hi[k] - lo[k] > thin)) every = false;
      if (every) kept.push_back(t);
    }
    if (kept.size() < tools.size()) {
      stats.thinToolsSkipped += static_cast<int64_t>(tools.size() - kept.size());
      if (kept.empty()) return Built{nullptr, true};
      tools = std::move(kept);
    }
  }
  if (skipUntouchingTools) {
    const double pad = orElse(fuseDistance(), WELD_METRES);
    auto boxOf = [](const LinkedShellGraph& g) {
      Box b{kInf, kInf, kInf, -kInf, -kInf, -kInf};
      for (int32_t v = 0; v < g.cornerTally(); v++) {
        const double p[3] = {g.pointXOf(v), g.pointYOf(v), g.pointZOf(v)};
        for (int k = 0; k < 3; k++) {
          if (p[k] < b[k]) b[k] = p[k];
          if (p[k] > b[k + 3]) b[k + 3] = p[k];
        }
      }
      return b;
    };
    const Box s = boxOf(keep);
    std::vector<const LinkedShellGraph*> reaching;
    for (const LinkedShellGraph* t : tools) {
      const Box b = boxOf(*t);
      bool reach = true;
      for (int k = 0; k < 3; k++)
        if (jsMin(s[k + 3], b[k + 3]) - jsMax(s[k], b[k]) <= pad) {
          reach = false;
          break;
        }
      if (reach) reaching.push_back(t);
    }
    if (reaching.size() < tools.size()) {
      stats.toolsOutOfReach += static_cast<int64_t>(tools.size() - reaching.size());
      if (reaching.empty()) return Built{nullptr, true};
      tools = std::move(reaching);
    }
  }
  if (!keep.excessEdges.empty()) stats.subjectAlreadyOverused++;
  if (!keep.isWatertight()) {
    latestDecline = "the subject is not watertight";
    return Built{};
  }

  PlaneSet planes(planeIdentity());
  std::vector<Splinter> keepPatches =
      dedupeSubjectFaces ? withoutCoveredFaces(patchesOf(keep, planes)) : patchesOf(keep, planes);
  std::vector<std::vector<Splinter>> toolPatches;
  toolPatches.reserve(tools.size());
  for (const LinkedShellGraph* t : tools) toolPatches.push_back(patchesOf(*t, planes));
  bool anyEmptyTool = false;
  for (const auto& t : toolPatches)
    if (t.empty()) anyEmptyTool = true;
  if (keepPatches.empty() || anyEmptyTool) {
    latestDecline = "a solid with no usable faces";
    return Built{};
  }

  {
    std::vector<char> seen(planes.anchors.size(), 0);
    size_t distinct = 0;
    for (const auto& t : toolPatches)
      for (const Splinter& p : t)
        if (!seen[p.plane]) {
          seen[p.plane] = 1;
          distinct++;
        }
    if (static_cast<int64_t>(distinct) > planeCap) {
      latestDecline = "too many distinct tool planes (" + std::to_string(distinct) + ")";
      return Built{};
    }
  }

  std::vector<Box> toolBoxes;
  toolBoxes.reserve(toolPatches.size());
  for (const auto& t : toolPatches) toolBoxes.push_back(groupExtent(t));
  if (stats.classifyTrace) {
    stats.toolBoxes.clear();
    for (const Box& b : toolBoxes) stats.toolBoxes.emplace_back(b.begin(), b.end());
  }
  const double pad = orElse(fuseDistance(), WELD_METRES);
  auto outside = [&](const P3& at, size_t k) -> bool {
    if (!prunePlanes) return false;
    const Box& b = toolBoxes[k];
    return at[0] < b[0] - pad || at[0] > b[3] + pad || at[1] < b[1] - pad || at[1] > b[4] + pad ||
           at[2] < b[2] - pad || at[2] > b[5] + pad;
  };

  const PlaneIndex keepByPlane = perPlane(keepPatches);

  if (stats.ringAuditTrace) {
    for (const Splinter& f : keepPatches) {
      stats.ringsAudited++;
      const Ring& r = f.ring;
      const int drop = dropAxis(patchNormal(f));
      const int u = drop == 0 ? 1 : 0, v = drop == 2 ? 1 : 2;
      std::set<std::array<uint64_t, 3>> seen;
      bool repeated = false;
      for (const RingCorner* p : r) {
        const std::array<uint64_t, 3> k{numKey(p->c[0]), numKey(p->c[1]), numKey(p->c[2])};
        if (!seen.insert(k).second) {
          repeated = true;
          break;
        }
      }
      if (repeated) stats.ringsRepeatedVertex++;
      if (r.size() > 3 && r.size() <= 200) {
        bool crossed = false;
        const size_t n = r.size();
        for (size_t i = 0; i < n && !crossed; i++) {
          const double* a = r[i]->c;
          const double* b = r[(i + 1) % n]->c;
          for (size_t j = i + 2; j < n; j++) {
            if (i == 0 && j == n - 1) continue;
            const double* c = r[j]->c;
            const double* d = r[(j + 1) % n]->c;
            const int d1 = lineSide(a[u], a[v], b[u], b[v], c[u], c[v]);
            const int d2 = lineSide(a[u], a[v], b[u], b[v], d[u], d[v]);
            const int d3 = lineSide(c[u], c[v], d[u], d[v], a[u], a[v]);
            const int d4 = lineSide(c[u], c[v], d[u], d[v], b[u], b[v]);
            if (d1 * d2 < 0 && d3 * d4 < 0) {
              crossed = true;
              break;
            }
          }
        }
        if (crossed) {
          stats.ringsSelfCrossing++;
          stats.ringsSelfCrossingArea += shardArea(f);
        }
      }
    }
  }

  if (stats.coplanarPairTrace) {
    stats.subjectFacets += static_cast<int64_t>(keepPatches.size());
    for (const auto& faces : keepByPlane.groups) {
      if (faces.size() < 2 || faces.size() > 200) continue;
      std::vector<P3> at, norm;
      for (const Splinter* f : faces) at.push_back(somewhereInside(*f));
      for (const Splinter* f : faces) norm.push_back(patchNormal(*f));
      for (size_t i = 0; i < faces.size(); i++) {
        for (size_t j = i + 1; j < faces.size(); j++) {
          const int drop = dropAxis(norm[i]);
          if (!patchCovers(*faces[j], at[i], drop) && !patchCovers(*faces[i], at[j], drop)) continue;
          stats.subjectCoplanarOverlaps++;
          stats.subjectCoplanarOverlapArea += jsMin(shardArea(*faces[i]), shardArea(*faces[j]));
          const P3 &u = norm[i], &v = norm[j];
          // sameRing: equal corner multisets
          bool same = faces[i]->ring.size() == faces[j]->ring.size();
          if (same) {
            std::vector<std::array<uint64_t, 3>> A, B;
            for (const RingCorner* p : faces[i]->ring) A.push_back({numKey(p->c[0]), numKey(p->c[1]), numKey(p->c[2])});
            for (const RingCorner* p : faces[j]->ring) B.push_back({numKey(p->c[0]), numKey(p->c[1]), numKey(p->c[2])});
            std::sort(A.begin(), A.end());
            std::sort(B.begin(), B.end());
            same = A == B;
          }
          if (same)
            stats.subjectCoplanarIdentical++;
          else
            stats.subjectCoplanarPartial++;
          if (u[0] * v[0] + u[1] * v[1] + u[2] * v[2] > 0)
            stats.subjectCoplanarSameSense++;
          else
            stats.subjectCoplanarOppSense++;
          const double lu = orElse(jsHypot(u[0], u[1], u[2]), 1), lv = orElse(jsHypot(v[0], v[1], v[2]), 1);
          double c = (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / (lu * lv);
          c = c < -1 ? -1 : c > 1 ? 1 : c;
          const double angle = std::acos(std::fabs(c));
          const double* p0 = faces[i]->ring[0]->c;
          const double gap =
              std::fabs(((at[j][0] - p0[0]) * u[0] + (at[j][1] - p0[1]) * u[1] + (at[j][2] - p0[2]) * u[2]) / lu);
          if (stats.subjectCoplanarPairs.size() < 2000)
            stats.subjectCoplanarPairs.push_back(
                {angle, gap, jsMin(shardArea(*faces[i]), shardArea(*faces[j]))});
        }
      }
    }
  }
  std::vector<PlaneIndex> toolByPlane;
  toolByPlane.reserve(toolPatches.size());
  for (const auto& t : toolPatches) toolByPlane.push_back(perPlane(t));
  auto againstTool = [&](const Splinter& p, const P3& at, size_t k) -> Standing {
    return outside(at, k) ? Standing::out
                          : classifyAt(p, at, toolPatches[k], toolByPlane[k], coplanarUncoveredIsOut);
  };

  double mark = nowMs();
  auto extentOf = [](const std::vector<Splinter>& patches) {
    Box b{kInf, kInf, kInf, -kInf, -kInf, -kInf};
    for (const Splinter& p : patches) {
      const Box e = ringExtent(p.ring);
      for (int a = 0; a < 3; a++) {
        b[a] = std::min(b[a], e[a]);
        b[a + 3] = std::max(b[a + 3], e[a + 3]);
      }
    }
    return b;
  };
  std::vector<Box> toolBox;
  for (const auto& t : toolPatches) toolBox.push_back(extentOf(t));
  const Box keepBox = extentOf(keepPatches);
  std::vector<int32_t> allToolPlanes;
  std::vector<Box> allToolPlaneBox;
  for (size_t k = 0; k < toolPatches.size(); k++)
    for (const Splinter& p : toolPatches[k]) {
      allToolPlanes.push_back(p.plane);
      allToolPlaneBox.push_back(toolBox[k]);
    }
  const std::vector<Splinter> outerShards = shatter(keepPatches, allToolPlanes, planes, &allToolPlaneBox);
  stats.outerShatter += nowMs() - mark;
  stats.outerFragments += static_cast<int64_t>(outerShards.size());

  if (stats.detailOn) {
    for (const Splinter& s : keepPatches) note("beforeShatter", s, "subject facet", -1);
    for (const Splinter& s : outerShards) note("afterShatter", s, "fragment", -1);
  }

  mark = nowMs();
  for (const Splinter& p : outerShards) stats.outerTotalArea += shardArea(p);
  std::vector<const Splinter*> outerParts;
  for (const Splinter& p : outerShards) {
    const P3 at = somewhereInside(p);
    int32_t killedBy = -1;
    std::string verdict;
    bool survives = true;
    for (size_t k = 0; k < toolPatches.size(); k++) {
      const bool pruned = outside(at, k);
      const Standing s = againstTool(p, at, k);
      if (s == Standing::out || s == Standing::onOpp) continue;
      killedBy = static_cast<int32_t>(k);
      if (noting())
        verdict = std::string(standingName(s)) + " via " + (pruned ? "box prune" : pathName(lastClassifyPath));
      survives = false;
      break;
    }
    if (!survives) {
      stats.outerDropped++;
      stats.outerDroppedArea += shardArea(p);
      note("outer", p, verdict, killedBy);
    } else {
      // The TS builds this note's text eagerly, re-asking every tool; the asking has side effects.
      // A survivor was already asked every tool in the loop above, with the same arguments, and the
      // last call left the same classify-path state; repeating it only double-counts statistics.
      // So it is repeated only when the note's text is wanted.
      const bool build = noting();
      std::string text;
      for (size_t k = 0; build && k < toolPatches.size(); k++) {
        const bool pr = outside(at, k);
        const Standing st = againstTool(p, at, k);
        if (build) {
          if (k) text += "+";
          text += std::string(pr ? "pruned" : "asked") + ":" + standingName(st);
        }
      }
      note("outerKept", p, text, -1);
      outerParts.push_back(&p);
    }
  }
  stats.outerClassify += nowMs() - mark;
  if (outerParts.empty()) {
    latestDecline = shatterCapped ? "the shatter hit its fragment cap (" + std::to_string(fragmentCap) + ")"
                                  : "the tools swallowed the subject";
    return Built{};
  }

  std::vector<Splinter> innerParts;
  double maxInnerKeptArea = 0;
  for (size_t i = 0; i < toolPatches.size(); i++) {
    std::vector<int32_t> against = planesOf(keepPatches);
    std::vector<Box> againstBox(against.size(), keepBox);
    for (size_t j = 0; j < toolPatches.size(); j++)
      if (j != i)
        for (const Splinter& p : toolPatches[j]) {
          against.push_back(p.plane);
          againstBox.push_back(toolBox[j]);
        }
    mark = nowMs();
    const std::vector<Splinter> shards = shatter(toolPatches[i], against, planes, &againstBox);
    stats.innerShatter += nowMs() - mark;
    stats.innerFragments += static_cast<int64_t>(shards.size());

    mark = nowMs();
    for (const Splinter& p : shards) {
      const P3 at = somewhereInside(p);
      const Standing standing =
          uncoveredIsWall ? classifyAtUncoveredIn(p, at, keepPatches, keepByPlane)
                          : classifyAt(p, at, keepPatches, keepByPlane, uncoveredInnerProbe && uncoveredOffPlaneProbe);
      const ClassifyPath howSaid = lastClassifyPath;
      const double missMargin = lastCoplanarMiss;
      if (stats.detailOn && noting())
        note("toolFrag", p, std::string("subject says ") + standingName(standing), static_cast<int32_t>(i));
      if (standing != Standing::in) {
        stats.innerRefusedNotIn++;
        stats.innerRefusedNotInArea += shardArea(p);
        if (noting()) note("inner", p, std::string("subject says ") + standingName(standing), static_cast<int32_t>(i));
        continue;
      }
      int32_t blocker = -1;
      Standing blockerSays = Standing::out;
      for (size_t j = 0; j < toolPatches.size(); j++) {
        if (j == i) continue;
        const Standing s = againstTool(p, at, j);
        if (s == Standing::out) continue;
        if (s == Standing::onSame && i < j) continue;
        blocker = static_cast<int32_t>(j);
        blockerSays = s;
        break;
      }
      if (blocker >= 0) {
        stats.innerRefusedTouchesTool++;
        if (noting())
          note("inner", p, "tool " + std::to_string(blocker) + " says " + standingName(blockerSays),
               static_cast<int32_t>(i));
        continue;
      }
      stats.innerKept++;
      const double area = shardArea(p);
      stats.innerKeptArea += area;
      if (area > maxInnerKeptArea) maxInnerKeptArea = area;
      if (howSaid == COVERED_SENSE) {
        stats.innerKeptViaCovered++;
      } else if (howSaid == COPLANAR_NOT_COVERED) {
        stats.innerKeptViaEnclosesNotCovered++;
        stats.innerKeptViaEnclosesNotCoveredArea += area;
        if (stats.flushMisses.size() < 4000) stats.flushMisses.push_back({missMargin, area});
      } else {
        stats.innerKeptViaEnclosesNoCoplanar++;
        stats.innerKeptViaEnclosesNoCoplanarArea += area;
      }
      Splinter wall;
      wall.ring.assign(p.ring.rbegin(), p.ring.rend());
      wall.anchor = p.anchor;
      wall.plane = p.plane;
      wall.from = p.from;
      wall.via = howSaid == COPLANAR_NOT_COVERED ? VIA_SUSPECT : VIA_NOCOPLANAR;
      innerParts.push_back(std::move(wall));
    }
    stats.innerClassify += nowMs() - mark;
  }

  if (identityShortCircuit && stats.outerDropped == outerDroppedAtEntry && innerParts.empty()) {
    stats.subtractIdentity++;
    return Built{nullptr, true};
  }
  if (flushNoOp && !shatterCapped && maxInnerKeptArea < keep.tolerance * keep.tolerance) {
    stats.subtractFlushNoOp++;
    return Built{nullptr, true};
  }

  // ── assembly ──
  auto result = std::make_unique<LinkedShellGraph>(keep.tolerance);
  struct PlacedBy {
    int32_t from;
    int32_t plane;
    bool outer;
    int8_t via;
  };
  std::unordered_map<int64_t, PlacedBy> placedBy;
  std::unordered_map<int64_t, std::vector<int32_t>> placedRing;
  const size_t outerCount = outerParts.size(), innerCount = innerParts.size();
  stats.assemblyOffered += static_cast<int64_t>(outerCount + innerCount);
  for (const Splinter* patch : outerParts) stats.assemblyOfferedArea += shardArea(*patch);
  for (const Splinter& patch : innerParts) stats.assemblyOfferedArea += shardArea(patch);
  const int32_t facetsBefore = result->panelTally();
  stats.assemblyOuterCount = 0;

  std::vector<const Splinter*> offered;
  std::vector<char> isOuter;
  offered.reserve(outerCount + innerCount);
  if (innerFirst) {
    for (const Splinter& p : innerParts) offered.push_back(&p), isOuter.push_back(0);
    for (const Splinter* p : outerParts) offered.push_back(p), isOuter.push_back(1);
  } else {
    for (const Splinter* p : outerParts) offered.push_back(p), isOuter.push_back(1);
    for (const Splinter& p : innerParts) offered.push_back(&p), isOuter.push_back(0);
  }
  if (largestFirst) {
    std::vector<size_t> order(offered.size());
    std::vector<double> areas(offered.size());
    for (size_t k = 0; k < offered.size(); k++) {
      order[k] = k;
      areas[k] = shardArea(*offered[k]);
    }
    std::stable_sort(order.begin(), order.end(), [&](size_t p, size_t q) { return areas[q] - areas[p] < 0; });
    std::vector<const Splinter*> o2;
    std::vector<char> f2;
    for (size_t k : order) o2.push_back(offered[k]), f2.push_back(isOuter[k]);
    offered = std::move(o2);
    isOuter = std::move(f2);
  }
  const size_t N = offered.size();

  std::vector<std::vector<int32_t>> welded(N);
  std::vector<char> weldedDone(N, 0);
  auto weldOf = [&](size_t idx) -> const std::vector<int32_t>& {
    if (weldedDone[idx]) return welded[idx];
    std::vector<int32_t>& ids = welded[idx];
    const RingCorner* prevKept = nullptr;
    for (const RingCorner* p : offered[idx]->ring) {
      const int32_t v = result->placeCorner(p->c[0], p->c[1], p->c[2]);
      if (!ids.empty() && ids.back() == v && prevKept && stats.weldGaps.size() < 4000)
        stats.weldGaps.push_back(
            jsHypot(p->c[0] - prevKept->c[0], p->c[1] - prevKept->c[1], p->c[2] - prevKept->c[2]));
      if (ids.empty() || ids.back() != v) {
        ids.push_back(v);
        prevKept = p;
      }
    }
    while (ids.size() > 1 && ids.front() == ids.back()) ids.pop_back();
    weldedDone[idx] = 1;
    return ids;
  };
  auto peelWeldedRing = [&](const std::vector<int32_t>& ring) {
    const double tol = result->tolerance;
    std::vector<int32_t> r = ring;
    for (bool changed = true; changed && r.size() >= 3;) {
      changed = false;
      const size_t L = r.size();
      for (size_t k = 0; k < L; k++) {
        const int32_t a = r[(k + L - 1) % L], w = r[k], b = r[(k + 1) % L];
        if (a == b) {
          const size_t next = (k + 1) % L;
          std::vector<int32_t> t;
          for (size_t i = 0; i < L; i++)
            if (i != k && i != next) t.push_back(r[i]);
          r = std::move(t);
          changed = true;
          break;
        }
        const double arriveX = result->pointXOf(w) - result->pointXOf(a),
                     arriveY = result->pointYOf(w) - result->pointYOf(a),
                     arriveZ = result->pointZOf(w) - result->pointZOf(a);
        const double departX = result->pointXOf(b) - result->pointXOf(w),
                     departY = result->pointYOf(b) - result->pointYOf(w),
                     departZ = result->pointZOf(b) - result->pointZOf(w);
        if (arriveX * departX + arriveY * departY + arriveZ * departZ >= 0) continue;
        const double cx = arriveY * departZ - arriveZ * departY, cy = arriveZ * departX - arriveX * departZ,
                     cz = arriveX * departY - arriveY * departX;
        const double longer = jsMax(jsHypot(arriveX, arriveY, arriveZ), jsHypot(departX, departY, departZ));
        if (jsHypot(cx, cy, cz) <= tol * longer) {
          r.erase(r.begin() + static_cast<long>(k));
          changed = true;
          break;
        }
      }
    }
    return r;
  };

  // With box-gated cuts a face may be split by a plane its neighbour was not, leaving a corner on the
  // neighbour's edge that the neighbour does not list (a T). Every corner lying on an edge, strictly
  // between its ends and within the weld, is put into that edge, so both sides share the corner.
  if (gateCutsByToolBox && N > 0) {
    for (size_t idx = 0; idx < N; idx++) weldOf(idx);
    const int32_t nv = result->cornerTally();
    double lo[3] = {kInf, kInf, kInf}, hi[3] = {-kInf, -kInf, -kInf};
    for (int32_t v = 0; v < nv; v++) {
      const double p[3] = {result->pointXOf(v), result->pointYOf(v), result->pointZOf(v)};
      for (int k = 0; k < 3; k++) lo[k] = std::min(lo[k], p[k]), hi[k] = std::max(hi[k], p[k]);
    }
    const double tol = std::max(result->tolerance, 1e-12);
    double span = 0;
    for (int k = 0; k < 3; k++) span = std::max(span, hi[k] - lo[k]);
    const double cell = std::max(span / 48, 8 * tol);
    auto cellOf = [&](double x, int k) { return static_cast<int32_t>(std::floor((x - lo[k]) / cell)); };
    std::unordered_map<int64_t, std::vector<int32_t>> grid;
    auto key = [](int32_t i, int32_t j, int32_t k) {
      return (static_cast<int64_t>(i) << 42) ^ (static_cast<int64_t>(j) << 21) ^ static_cast<int64_t>(k);
    };
    for (int32_t v = 0; v < nv; v++)
      grid[key(cellOf(result->pointXOf(v), 0), cellOf(result->pointYOf(v), 1), cellOf(result->pointZOf(v), 2))]
          .push_back(v);
    std::unordered_map<int64_t, int32_t> dartCount;
    for (size_t idx = 0; idx < N; idx++) {
      const std::vector<int32_t>& ring = welded[idx];
      for (size_t e = 0; e < ring.size(); e++) dartCount[static_cast<int64_t>(ring[e]) * nv + ring[(e + 1) % ring.size()]]++;
    }
    std::vector<std::pair<double, int32_t>> hits;
    for (size_t idx = 0; idx < N; idx++) {
      std::vector<int32_t>& ring = welded[idx];
      if (ring.size() < 3) continue;
      std::vector<int32_t> out;
      out.reserve(ring.size() + 4);
      const size_t L = ring.size();
      for (size_t e = 0; e < L; e++) {
        const int32_t a = ring[e], b = ring[(e + 1) % L];
        out.push_back(a);
        // An edge the rings carry as often one way as the other is already matched: splitting it
        // pushes a third ring's corners into both partners and leaves it carried four times.
        {
          auto f = dartCount.find(static_cast<int64_t>(a) * nv + b), r = dartCount.find(static_cast<int64_t>(b) * nv + a);
          if ((f == dartCount.end() ? 0 : f->second) == (r == dartCount.end() ? 0 : r->second)) continue;
        }
        const double ax = result->pointXOf(a), ay = result->pointYOf(a), az = result->pointZOf(a);
        const double dx = result->pointXOf(b) - ax, dy = result->pointYOf(b) - ay, dz = result->pointZOf(b) - az;
        const double len2 = dx * dx + dy * dy + dz * dz;
        if (len2 <= 0) continue;
        const double bx0 = std::min(ax, ax + dx) - tol, bx1 = std::max(ax, ax + dx) + tol;
        const double by0 = std::min(ay, ay + dy) - tol, by1 = std::max(ay, ay + dy) + tol;
        const double bz0 = std::min(az, az + dz) - tol, bz1 = std::max(az, az + dz) + tol;
        hits.clear();
        for (int32_t i = cellOf(bx0, 0); i <= cellOf(bx1, 0); i++)
          for (int32_t j = cellOf(by0, 1); j <= cellOf(by1, 1); j++)
            for (int32_t k = cellOf(bz0, 2); k <= cellOf(bz1, 2); k++) {
              auto it = grid.find(key(i, j, k));
              if (it == grid.end()) continue;
              for (int32_t c : it->second) {
                if (c == a || c == b) continue;
                const double px = result->pointXOf(c) - ax, py = result->pointYOf(c) - ay,
                             pz = result->pointZOf(c) - az;
                const double t = (px * dx + py * dy + pz * dz) / len2;
                if (!(t > 0 && t < 1)) continue;
                const double ex = px - t * dx, ey = py - t * dy, ez = pz - t * dz;
                if (ex * ex + ey * ey + ez * ez > tol * tol) continue;
                hits.emplace_back(t, c);
              }
            }
        std::sort(hits.begin(), hits.end());
        for (const auto& [t, c] : hits)
          if (out.back() != c) out.push_back(c);
      }
      if (out.size() != ring.size()) {
        stats.tJunctionsHealed += static_cast<int64_t>(out.size() - ring.size());
        ring = std::move(out);
      }
    }
  }

  std::vector<char> finDrop(N, 0);
  if (dropZeroFins) {
    auto signature = [&](size_t idx, bool reverse, std::vector<int64_t>& out) -> bool {
      const std::vector<int32_t>& ids = weldOf(idx);
      if (ids.size() < 3) return false;
      out.clear();
      for (size_t k = 0; k < ids.size(); k++) {
        const int32_t a = ids[k], b = ids[(k + 1) % ids.size()];
        out.push_back(reverse ? dartKey(b, a) : dartKey(a, b));
      }
      std::sort(out.begin(), out.end());
      return true;
    };
    std::unordered_map<std::vector<int64_t>, std::vector<size_t>, VecHash> perSignature;
    std::vector<int64_t> rev, fwd;
    for (size_t idx = 0; idx < N; idx++) {
      if (!signature(idx, true, rev)) continue;
      auto it = perSignature.find(rev);
      if (it != perSignature.end() && !it->second.empty()) {
        const size_t partner = it->second.back();
        it->second.pop_back();
        finDrop[idx] = 1;
        finDrop[partner] = 1;
        stats.finPairsDropped++;
        continue;
      }
      signature(idx, false, fwd);
      perSignature[fwd].push_back(idx);
    }
  }

  // 0 = untouched (TS undefined), 1 = consumed (null), 2 = carries replacement rings
  std::vector<int8_t> overlayState(N, 0);
  std::vector<std::vector<std::vector<int32_t>>> overlayRingsOf(N);
  if (planeOverlay) {
    std::unordered_map<int32_t, size_t> groupOf;
    std::vector<std::vector<size_t>> groups;
    for (size_t idx = 0; idx < N; idx++) {
      if (finDrop[idx]) continue;
      if (weldOf(idx).size() < 3) continue;
      auto [it, inserted] = groupOf.emplace(offered[idx]->plane, groups.size());
      if (inserted) groups.emplace_back();
      groups[it->second].push_back(idx);
    }
    GraphOverlay adapter(*result);
    for (const auto& group : groups) {
      if (group.size() < 2) continue;
      std::unordered_set<int64_t> seen;
      bool clash = false;
      for (size_t idx : group) {
        const std::vector<int32_t>& ids = weldOf(idx);
        for (size_t k = 0; k < ids.size(); k++) {
          if (!seen.insert(dartKey(ids[k], ids[(k + 1) % ids.size()])).second) {
            clash = true;
            break;
          }
        }
        if (clash) break;
      }
      if (!clash) continue;
      // overlayPlaneGroup
      std::optional<std::vector<std::vector<int32_t>>> emitted;
      {
        std::vector<std::vector<int32_t>> rings;
        for (size_t idx : group) {
          const std::vector<int32_t>& r = weldOf(idx);
          if (r.size() >= 3) rings.push_back(r);
        }
        if (rings.size() >= 2) {
          adapter.tolerance = result->tolerance;
          emitted = overlayRings(rings, patchNormal(*offered[group[0]]), adapter);
        }
      }
      if (!emitted) {
        stats.overlayBailed++;
        continue;
      }
      stats.overlayPlanes++;
      stats.overlayRingsIn += static_cast<int64_t>(group.size());
      stats.overlayRingsOut += static_cast<int64_t>(emitted->size());
      overlayState[group[0]] = 2;
      overlayRingsOf[group[0]] = std::move(*emitted);
      for (size_t k = 1; k < group.size(); k++) overlayState[group[k]] = 1;
    }
  }

  std::vector<char> surplusEvict(N, 0);
  if (evictSurplusRings) {
    std::unordered_map<int64_t, int32_t> counts;
    std::vector<std::pair<size_t, std::vector<int64_t>>> dartsOf;
    for (size_t idx = 0; idx < N; idx++) {
      if (finDrop[idx] || overlayState[idx] != 0) continue;
      const Splinter& patch = *offered[idx];
      if (isNeedle(patch.ring)) continue;
      std::vector<int32_t> ids = weldOf(idx);
      if (peelPass && ids.size() > 3) {
        std::vector<int32_t> p = peelWeldedRing(ids);
        if (p.size() != ids.size()) ids = std::move(p);
      }
      if (ids.size() < 3) continue;
      if (minimumFacetArea > 0 && shardArea(patch) < minimumFacetArea) continue;
      std::vector<int64_t> halfLinks;
      halfLinks.reserve(ids.size());
      for (size_t k = 0; k < ids.size(); k++) halfLinks.push_back(dartKey(ids[k], ids[(k + 1) % ids.size()]));
      for (int64_t d : halfLinks) counts[d]++;
      dartsOf.emplace_back(idx, std::move(halfLinks));
    }
    bool moved = true;
    while (moved) {
      moved = false;
      for (const auto& [idx, halfLinks] : dartsOf) {
        if (surplusEvict[idx]) continue;
        bool pure = true;
        for (int64_t d : halfLinks) {
          auto it = counts.find(d);
          if (it == counts.end() || it->second < 2) {
            pure = false;
            break;
          }
        }
        if (!pure) continue;
        surplusEvict[idx] = 1;
        for (int64_t d : halfLinks) counts[d]--;
        stats.surplusRingsEvicted++;
        moved = true;
      }
    }
  }

  auto dartText = [](int32_t a, int32_t b) { return std::to_string(a) + ">" + std::to_string(b); };
  for (size_t seat = 0; seat < N; seat++) {
    const Splinter& patch = *offered[seat];
    const bool fromOuter = isOuter[seat] != 0;
    if (finDrop[seat]) {
      stats.finFacetsDropped++;
      note("assembly", patch, "half of a zero-thickness fin", -1);
      continue;
    }
    if (surplusEvict[seat]) {
      note("assembly", patch, "pure surplus -- every dart claimed by another ring", -1);
      continue;
    }
    if (overlayState[seat] == 1) {
      note("assembly", patch, "consumed by the plane overlay", -1);
      continue;
    }
    if (overlayState[seat] == 0 && isNeedle(patch.ring)) {
      stats.assemblySliver++;
      note("assembly", patch, "sliver", -1);
      continue;
    }
    if (minimumFacetArea > 0 && shardArea(patch) < minimumFacetArea) {
      stats.assemblyBelowFloor++;
      note("assembly", patch, "below the area floor", -1);
      continue;
    }
    std::vector<std::vector<int32_t>> rings;
    if (overlayState[seat] == 2) {
      for (const auto& r : overlayRingsOf[seat])
        for (auto& rr : splitPinchedRing(r)) rings.push_back(std::move(rr));
    } else {
      std::vector<int32_t> ids = weldOf(seat);
      if (peelPass && ids.size() > 3) {
        std::vector<int32_t> peeled = peelWeldedRing(ids);
        if (peeled.size() != ids.size()) {
          stats.weldedSpikesPeeled += static_cast<int64_t>(ids.size() - peeled.size());
          ids = std::move(peeled);
        }
      }
      if (ids.size() < 3) {
        const double lost = shardArea(patch);
        stats.assemblyCollapsed++;
        stats.assemblyCollapsedArea += lost;
        if (lost > stats.assemblyCollapsedAreaMax) stats.assemblyCollapsedAreaMax = lost;
        if (noting())
          note("assembly", patch,
               "welded " + std::to_string(patch.ring.size()) + " corners down to " + std::to_string(ids.size()), -1);
        continue;
      }
      rings = splitPinchedRing(ids);
      if (rings.size() > 1) stats.assemblyPinched++;
    }
    int32_t placed = 0;
    for (auto& r : rings) {
      bool already = false;
      int64_t dartOwner = 0;
      int32_t claimed = 0;
      const size_t L = r.size();
      for (size_t k = 0; k < L; k++) {
        if (result->hasDart(r[k], r[(k + 1) % L])) {
          claimed++;
          if (!already) {
            already = true;
            dartOwner = dartKey(r[k], r[(k + 1) % L]);
          }
        }
      }
      const bool fullyClaimed = claimed == static_cast<int32_t>(L);
      if (already) {
        stats.assemblyDuplicateDart++;
        auto owner = placedBy.find(dartOwner);
        if (owner != placedBy.end()) {
          if (owner->second.from == patch.from)
            stats.duplicateWithinFace++;
          else
            stats.duplicateAcrossFaces++;
        }
        if (patch.via == VIA_SUSPECT)
          stats.wallClashedSuspect++;
        else if (patch.via == VIA_NOCOPLANAR)
          stats.wallClashedOther++;
        if (patch.hasBorn && patch.bornAt.path == BORN_WALK) {
          if (patch.bornAt.onPlaneCount > 0)
            stats.dartWalkOnPlane++;
          else
            stats.dartWalkClean++;
        }
        if (stats.clashTrace && stats.clashes.size() < 40) {
          const P3 n = patchNormal(patch);
          const double len = orElse(jsHypot(n[0], n[1], n[2]), 1);
          auto viaName = [](int8_t via) -> std::optional<std::string> {
            if (via == VIA_SUSPECT) return std::string("suspect");
            if (via == VIA_NOCOPLANAR) return std::string("noCoplanar");
            return std::nullopt;
          };
          SubtractStats::Clash c;
          c.dart = dartText(static_cast<int32_t>(dartOwner >> 32), static_cast<int32_t>(dartOwner & 0xffffffff));
          c.mineFrom = patch.from;
          c.theirsFrom = owner != placedBy.end() ? owner->second.from : -1;
          c.plane = patch.plane;
          c.planeOfOther = owner != placedBy.end() ? owner->second.plane : -1;
          c.mineOuter = fromOuter;
          c.mineRing = r;
          auto pr = placedRing.find(dartOwner);
          c.theirsRing = pr != placedRing.end() ? pr->second : std::vector<int32_t>{};
          c.theirsOuter = owner != placedBy.end() ? static_cast<int8_t>(owner->second.outer) : -1;
          c.mineVia = viaName(patch.via);
          c.mineCorners = static_cast<int32_t>(patch.ring.size());
          c.mineIds = static_cast<int32_t>(L);
          c.theirsVia = owner != placedBy.end() ? viaName(owner->second.via) : std::nullopt;
          c.area = shardArea(patch);
          c.normal = {n[0] / len, n[1] / len, n[2] / len};
          stats.clashes.push_back(std::move(c));
        }
        if (reverseSecondClaimant) {
          bool reversedFree = true;
          for (size_t k = 0; k < L; k++) {
            if (result->hasDart(r[(k + 1) % L], r[k])) {
              reversedFree = false;
              break;
            }
          }
          if (reversedFree) {
            std::reverse(r.begin(), r.end());
            stats.reverseSecondPlaced++;
            already = false;
          } else {
            stats.reverseSecondBlocked++;
          }
        }
        if (already && dropSecondClaimant && (!dropSecondOnlyWhole || fullyClaimed)) {
          stats.assemblyDroppedSecond++;
          if (fullyClaimed) stats.assemblyDroppedSecondWhole++;
          continue;
        }
      }
      stats.placedRings++;
      if (patch.ring.size() > L) stats.placedWeldBit++;
      if (patch.via == VIA_SUSPECT)
        stats.wallKeptSuspect++;
      else if (patch.via == VIA_NOCOPLANAR)
        stats.wallKeptOther++;
      if (patch.hasBorn && patch.bornAt.path == BORN_WALK) {
        if (patch.bornAt.onPlaneCount > 0)
          stats.placedWalkOnPlane++;
        else
          stats.placedWalkClean++;
      }
      if (result->appendPanel(r) >= 0) {
        placed++;
        if (fromOuter) stats.assemblyOuterCount++;
        for (size_t k = 0; k < L; k++) {
          const int64_t key = dartKey(r[k], r[(k + 1) % L]);
          auto [it, inserted] = placedBy.emplace(key, PlacedBy{patch.from, patch.plane, fromOuter, patch.via});
          if (inserted && stats.clashTrace) placedRing.emplace(key, r);
        }
      }
    }
    if (!placed) {
      stats.assemblyRefused++;
      stats.assemblyRefusedArea += shardArea(patch);
      note("assembly", patch, "the topology refused the ring", -1);
    }
  }
  stats.assemblyPlaced += result->panelTally() - facetsBefore;
  result->seal();
  return Built{std::move(result), false};
}

std::unique_ptr<LinkedShellGraph> combine(const LinkedShellGraph& a, const LinkedShellGraph& b, SolidCombine op) {
  latestDecline.clear();
  shatterCapped = false;
  if (!a.isWatertight()) {
    latestDecline = "the subject is not watertight";
    return nullptr;
  }
  if (op != SolidCombine::difference && !b.isWatertight()) {
    latestDecline = "the second solid is not watertight";
    return nullptr;
  }
  PlaneSet planes(planeIdentity());
  const std::vector<Splinter> aPatches = patchesOf(a, planes);
  const std::vector<Splinter> bPatches = patchesOf(b, planes);
  if (aPatches.empty() || bPatches.empty()) {
    latestDecline = "a solid with no usable faces";
    return nullptr;
  }
  // index: in, out, onSame, onOpp
  using Table = std::array<bool, 4>;
  const Table retainFirst = op == SolidCombine::difference ? Table{false, true, false, true}
                            : op == SolidCombine::union_   ? Table{false, true, true, false}
                                                           : Table{true, false, true, false};
  const Table retainSecond =
      op == SolidCombine::union_ ? Table{false, true, false, false} : Table{true, false, false, false};
  const bool invertOther = op == SolidCombine::difference;
  const PlaneIndex aByPlane = perPlane(aPatches), bByPlane = perPlane(bPatches);

  std::vector<Splinter> parts;
  {
    std::vector<Splinter> shards = shatter(aPatches, planesOf(bPatches), planes);
    for (Splinter& p : shards)
      if (retainFirst[static_cast<int>(classify(p, bPatches, bByPlane))]) parts.push_back(std::move(p));
  }
  const size_t aCount = parts.size();
  {
    std::vector<Splinter> shards = shatter(bPatches, planesOf(aPatches), planes);
    for (Splinter& p : shards) {
      if (!retainSecond[static_cast<int>(classify(p, aPatches, aByPlane))]) continue;
      if (invertOther) {
        Splinter s;
        s.ring.assign(p.ring.rbegin(), p.ring.rend());
        s.anchor = p.anchor;
        s.plane = p.plane;
        s.from = p.from;
        parts.push_back(std::move(s));
      } else {
        parts.push_back(std::move(p));
      }
    }
  }
  if (op == SolidCombine::difference && aCount == 0) {
    latestDecline = "the tool swallowed the subject, or the shatter hit its cap";
    return nullptr;
  }
  auto result = std::make_unique<LinkedShellGraph>(a.tolerance);
  std::vector<int32_t> ids;
  for (const Splinter& patch : parts) {
    stats.assemblyOfferedArea += shardArea(patch);
    if (isNeedle(patch.ring)) {
      stats.assemblySliver++;
      continue;
    }
    ids.clear();
    for (const RingCorner* p : patch.ring) {
      const int32_t v = result->placeCorner(p->c[0], p->c[1], p->c[2]);
      if (ids.empty() || ids.back() != v) ids.push_back(v);
    }
    while (ids.size() > 1 && ids.front() == ids.back()) ids.pop_back();
    if (ids.size() < 3) {
      const double lost = shardArea(patch);
      stats.assemblyCollapsed++;
      stats.assemblyCollapsedArea += lost;
      if (lost > stats.assemblyCollapsedAreaMax) stats.assemblyCollapsedAreaMax = lost;
      continue;
    }
    const auto rings = splitPinchedRing(ids);
    if (rings.size() > 1) stats.assemblyPinched++;
    int32_t placed = 0;
    for (const auto& r : rings)
      if (result->appendPanel(r) >= 0) placed++;
    if (!placed) {
      stats.assemblyRefused++;
      stats.assemblyRefusedArea += shardArea(patch);
    }
  }
  result->seal();
  return result;
}

}  // namespace

void clearCounters() {
  const std::vector<std::vector<double>> toolBoxes = std::move(stats.toolBoxes);
  const int64_t assemblyOuterCount = stats.assemblyOuterCount;
  const int64_t subjectFacesCovered = stats.subjectFacesCovered;
  const bool coplanarPairTrace = stats.coplanarPairTrace, ringAuditTrace = stats.ringAuditTrace,
             detailOn = stats.detailOn, classifyTrace = stats.classifyTrace,
             arrangementTrace = stats.arrangementTrace, wprTrace = stats.wprTrace,
             clashTrace = stats.clashTrace, overlapTest = stats.overlapTest, capTrace = stats.capTrace;
  const int64_t detailCap = stats.detailCap;
  stats = SubtractStats{};
  // Fields the TS reset leaves alone.
  stats.toolBoxes = toolBoxes;
  stats.assemblyOuterCount = assemblyOuterCount;
  stats.subjectFacesCovered = subjectFacesCovered;
  stats.coplanarPairTrace = coplanarPairTrace;
  stats.ringAuditTrace = ringAuditTrace;
  stats.detailOn = detailOn;
  stats.detailCap = detailCap;
  stats.classifyTrace = classifyTrace;
  stats.arrangementTrace = arrangementTrace;
  stats.wprTrace = wprTrace;
  stats.clashTrace = clashTrace;
  stats.overlapTest = overlapTest;
  stats.capTrace = capTrace;
  currentCall = 0;
}

std::unique_ptr<LinkedShellGraph> clipToHalfSpace(const LinkedShellGraph& solid, const P3& through,
                                                  const P3& normal) {
  const double nx = normal[0], ny = normal[1], nz = normal[2];
  if (nx == 0 && ny == 0 && nz == 0) return nullptr;
  const P3 helper = std::fabs(nx) < 0.9 ? P3{1, 0, 0} : P3{0, 1, 0};
  const double ux = helper[1] * nz - helper[2] * ny;
  const double uy = helper[2] * nx - helper[0] * nz;
  const double uz = helper[0] * ny - helper[1] * nx;
  const double vx = ny * uz - nz * uy, vy = nz * ux - nx * uz, vz = nx * uy - ny * ux;

  PlaneSet planes(planeIdentity());
  const Anchor plane{planes.mint(through[0], through[1], through[2]),
                     planes.mint(through[0] + ux, through[1] + uy, through[2] + uz),
                     planes.mint(through[0] + vx, through[1] + vy, through[2] + vz)};
  const int32_t cutPlaneKey = planes.add(plane, nullptr);
  std::vector<Splinter> patches = patchesOf(solid, planes);
  const Anchor stored = planes.anchors[cutPlaneKey];
  const double probe[3] = {through[0] + nx, through[1] + ny, through[2] + nz};
  std::vector<Splinter> kept;
  for (Splinter& patch : patches) {
    CutResult r = cut(patch, cutPlaneKey, planes);
    const bool keepNegative = whichSideOfPlane(stored, probe) > 0;
    if (r.kind == 0) {
      if (keepNegative) kept.push_back(std::move(patch));
    } else if (r.kind == 1) {
      if (!keepNegative) kept.push_back(std::move(patch));
    } else {
      for (Splinter& part : keepNegative ? r.negative : r.positive) kept.push_back(std::move(part));
    }
  }
  if (kept.empty()) return nullptr;
  bool sheet = true;
  for (const Splinter& part : kept) {
    for (const RingCorner* p : part.ring)
      if (whichSideOfPlane(stored, p->c) != 0) {
        sheet = false;
        break;
      }
    if (!sheet) break;
  }
  if (sheet) return nullptr;

  auto result = std::make_unique<LinkedShellGraph>(solid.tolerance);
  std::vector<int32_t> ids;
  for (const Splinter& patch : kept) {
    if (isNeedle(patch.ring)) continue;
    ids.clear();
    for (const RingCorner* p : patch.ring) {
      const int32_t v = result->placeCorner(p->c[0], p->c[1], p->c[2]);
      if (ids.empty() || ids.back() != v) ids.push_back(v);
    }
    while (ids.size() > 1 && ids.front() == ids.back()) ids.pop_back();
    if (ids.size() >= 3) result->appendPanel(ids);
  }
  result->seal();
  capOpening(*result);
  return result;
}

std::unique_ptr<LinkedShellGraph> cutAway(const LinkedShellGraph& keep,
                                          const std::vector<const LinkedShellGraph*>& tools, bool* isKeep) {
  BooleanTimer timer;
  auto run = [&]() -> Built {
    const int64_t droppedSecondAtEntry = stats.assemblyDroppedSecond;
    Built first = subtractAllInner(keep, tools);
    if (debugDoubleBuild) return subtractAllInner(keep, tools);
    if (retryWithoutDropSecond && dropSecondClaimant && first.g && first.g->boundaryDarts() > 0 &&
        stats.assemblyDroppedSecond > droppedSecondAtEntry) {
      stats.dropSecondRetries++;
      dropSecondClaimant = false;
      Built redo;
      try {
        redo = subtractAllInner(keep, tools);
      } catch (...) {
        dropSecondClaimant = true;
        throw;
      }
      dropSecondClaimant = true;
      if (redo.g && redo.g->boundaryDarts() < first.g->boundaryDarts()) {
        stats.dropSecondRetryFixed++;
        return redo;
      }
    }
    if (!peelWeldedSpikes || peelPass || !first.g || first.g->isWatertight()) return first;
    stats.peelRetries++;
    peelPass = true;
    Built second;
    try {
      second = subtractAllInner(keep, tools);
    } catch (...) {
      peelPass = false;
      throw;
    }
    peelPass = false;
    if (second.g || second.isKeep) {
      // TS reads boundaryDarts / excessEdges off `second`, which may be `keep` itself.
      const LinkedShellGraph& s = second.g ? *second.g : keep;
      const int32_t fb = first.g->boundaryDarts();
      const size_t fo = first.g->excessEdges.size();
      const int32_t sb = s.boundaryDarts();
      const size_t so = s.excessEdges.size();
      if (s.isWatertight() || (sb <= fb && so <= fo)) {
        stats.peelRetryFixed++;
        return second;
      }
    }
    return first;
  };
  return deliver(run(), keep, isKeep);
}

std::unique_ptr<LinkedShellGraph> subtract(const LinkedShellGraph& keep, const LinkedShellGraph& remove,
                                           bool* isKeep) {
  BooleanTimer timer;
  return deliver(subtractAllInner(keep, {&remove}), keep, isKeep);
}

std::unique_ptr<LinkedShellGraph> union_(const LinkedShellGraph& a, const LinkedShellGraph& b) {
  BooleanTimer timer;
  return combine(a, b, SolidCombine::union_);
}

std::unique_ptr<LinkedShellGraph> intersect(const LinkedShellGraph& a, const LinkedShellGraph& b) {
  BooleanTimer timer;
  return combine(a, b, SolidCombine::intersection);
}

}  // namespace brep
