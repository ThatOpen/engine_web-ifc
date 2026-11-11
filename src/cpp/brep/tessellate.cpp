// tessellate.cpp — port of tessellate.ts.
#include "tessellate.h"

#include <cmath>
#include <optional>
#include <unordered_map>

#include "sign.h"

#ifdef __clang__
#pragma clang fp contract(off)
#endif

namespace brep {

namespace {

bool scanForCrossings = true;
bool avoidSliverEars = false;

// V8's Math.hypot for two arguments, bit for bit (max-scaled, Kahan-summed).
double jsHypot(double a, double b) {
  const bool nan = std::isnan(a) || std::isnan(b);
  const double absA = std::isnan(a) ? 0 : std::fabs(a);
  const double absB = std::isnan(b) ? 0 : std::fabs(b);
  double max = 0;
  if (absA > max) max = absA;
  if (absB > max) max = absB;
  if (max == INFINITY) return INFINITY;
  if (nan) return NAN;
  if (max == 0) return 0;
  double sum = 0, compensation = 0;
  const double vals[2] = {absA, absB};
  for (double v : vals) {
    const double n = v / max;
    const double summand = n * n - compensation;
    const double preliminary = sum + summand;
    compensation = (preliminary - sum) - summand;
    sum = preliminary;
  }
  return std::sqrt(sum) * max;
}

// Math.min / Math.max of three: NaN if any is NaN (zero sign is irrelevant to every use here).
inline double minOf3(double a, double b, double c) {
  if (a != a || b != b || c != c) return NAN;
  double m = a < b ? a : b;
  return c < m ? c : m;
}
inline double maxOf3(double a, double b, double c) {
  if (a != a || b != b || c != c) return NAN;
  double m = a > b ? a : b;
  return c > m ? c : m;
}

struct MeetingPoint {
  int32_t i, j;
  double alongI, alongJ;
};

struct Touch {
  int32_t edge, corner;
};

inline bool spend(WorkBudget& work, int64_t k) {
  work.scan -= k;
  return work.scan >= 0;
}

std::optional<Touch> touchesItself(const FlatRing& ring, WorkBudget& work) {
  const int32_t n = static_cast<int32_t>(ring.ids.size());
  const double* xy = ring.xy.data();
  for (int32_t i = 0; i < n; i++) {
    const int32_t i2 = (i + 1) % n;
    const double xi = xy[i * 2], yi = xy[i * 2 + 1], xi2 = xy[i2 * 2], yi2 = xy[i2 * 2 + 1];
    for (int32_t k = 0; k < n; k++) {
      if (k == i || k == i2) continue;
      if (!spend(work, 2)) return std::nullopt;
      const double xk = xy[k * 2], yk = xy[k * 2 + 1];
      if (lineSide(xi, yi, xi2, yi2, xk, yk) != 0) continue;
      const double dx = xi2 - xi, dy = yi2 - yi;
      const double along = (xk - xi) * dx + (yk - yi) * dy;
      if (!(along > 0 && along < dx * dx + dy * dy)) continue;
      return Touch{i, k};
    }
  }
  return std::nullopt;
}

std::optional<MeetingPoint> crossesItself(const FlatRing& ring, WorkBudget& work) {
  if (!scanForCrossings) return std::nullopt;
  const int32_t n = static_cast<int32_t>(ring.ids.size());
  const double* xy = ring.xy.data();
  auto px = [xy](int32_t i) { return xy[i * 2]; };
  auto py = [xy](int32_t i) { return xy[i * 2 + 1]; };
  for (int32_t i = 0; i < n; i++) {
    const int32_t i2 = (i + 1) % n;
    for (int32_t j = i + 2; j < n; j++) {
      const int32_t j2 = (j + 1) % n;
      if (j2 == i) continue;
      if (!spend(work, 4)) return std::nullopt;
      const int a = lineSide(px(i), py(i), px(i2), py(i2), px(j), py(j));
      const int b = lineSide(px(i), py(i), px(i2), py(i2), px(j2), py(j2));
      if (a == b || a == 0 || b == 0) continue;
      const int c = lineSide(px(j), py(j), px(j2), py(j2), px(i), py(i));
      const int d = lineSide(px(j), py(j), px(j2), py(j2), px(i2), py(i2));
      if (c == d || c == 0 || d == 0) continue;

      const double ux = px(i2) - px(i), uy = py(i2) - py(i);
      const double vx = px(j2) - px(j), vy = py(j2) - py(j);
      const double den = ux * vy - uy * vx;
      const double wx = px(j) - px(i), wy = py(j) - py(i);
      const double alongI = (wx * vy - wy * vx) / den;
      const double alongJ = (wx * uy - wy * ux) / den;
      if (!(alongI > 0 && alongI < 1 && alongJ > 0 && alongJ < 1)) continue;
      return MeetingPoint{i, j, alongI, alongJ};
    }
  }
  return std::nullopt;
}

FlatRing withCrossingCorner(const FlatRing& ring, const MeetingPoint& cut, int32_t id) {
  const int32_t n = static_cast<int32_t>(ring.ids.size());
  const double* xy = ring.xy.data();
  auto at = [&](int32_t k, double t, double& ox, double& oy) {
    const int32_t k2 = (k + 1) % n;
    ox = xy[k * 2] + t * (xy[k2 * 2] - xy[k * 2]);
    oy = xy[k * 2 + 1] + t * (xy[k2 * 2 + 1] - xy[k * 2 + 1]);
  };
  double mix, miy, mjx, mjy;
  at(cut.i, cut.alongI, mix, miy);
  at(cut.j, cut.alongJ, mjx, mjy);

  FlatRing out;
  out.ids.reserve(n + 2);
  out.xy.reserve((n + 2) * 2);
  for (int32_t k = 0; k < n; k++) {
    out.ids.push_back(ring.ids[k]);
    out.xy.push_back(xy[k * 2]);
    out.xy.push_back(xy[k * 2 + 1]);
    if (k == cut.i) {
      out.ids.push_back(id);
      out.xy.push_back(mix);
      out.xy.push_back(miy);
    }
    if (k == cut.j) {
      out.ids.push_back(id);
      out.xy.push_back(mjx);
      out.xy.push_back(mjy);
    }
  }
  return out;
}

// The run of a ring from `from` up to but not including `to`, wrapping round the end.
FlatRing sliceRing(const FlatRing& ring, int32_t from, int32_t to) {
  const int32_t n = static_cast<int32_t>(ring.ids.size());
  const int32_t count = to - from;
  FlatRing out;
  if (count <= 0) return out;
  out.ids.resize(count);
  out.xy.resize(static_cast<size_t>(count) * 2);
  for (int32_t k = 0; k < count; k++) {
    const int32_t i = (from + k) % n;
    out.ids[k] = ring.ids[i];
    out.xy[k * 2] = ring.xy[i * 2];
    out.xy[k * 2 + 1] = ring.xy[i * 2 + 1];
  }
  return out;
}

// Overall sense of rotation of the live corners, decided at the extreme vertex.
int ringSense(const FlatRing& ring, const std::vector<int32_t>& alive) {
  const int32_t n = static_cast<int32_t>(alive.size());
  if (n < 3) return 0;
  const double* xy = ring.xy.data();
  int32_t pickedSlot = 0;
  for (int32_t i = 1; i < n; i++) {
    const int32_t a = alive[i], b = alive[pickedSlot];
    const double yi = xy[a * 2 + 1], yp = xy[b * 2 + 1];
    if (yi < yp || (yi == yp && xy[a * 2] < xy[b * 2])) pickedSlot = i;
  }
  const int32_t pick = alive[pickedSlot];

  constexpr int32_t REACH = 16;
  for (int32_t back = 1; back < n && back <= REACH; back++) {
    const int32_t prev = alive[(((pickedSlot - back) % n) + n) % n];
    for (int32_t ahead = 1; ahead < n && ahead <= REACH; ahead++) {
      const int32_t next = alive[(pickedSlot + ahead) % n];
      if (prev == next) break;
      const int turn = lineSide(xy[prev * 2], xy[prev * 2 + 1], xy[pick * 2], xy[pick * 2 + 1],
                                xy[next * 2], xy[next * 2 + 1]);
      if (turn != 0) return turn;
    }
  }
  return 0;
}

// Is p strictly inside, or on the boundary of, the triangle?
inline bool withinTriangle(double px, double py, double ax, double ay, double bx, double by,
                           double cx, double cy, int turn) {
  const int s1 = lineSide(ax, ay, bx, by, px, py);
  const int s2 = lineSide(bx, by, cx, cy, px, py);
  const int s3 = lineSide(cx, cy, ax, ay, px, py);
  return (s1 == turn || s1 == 0) && (s2 == turn || s2 == 0) && (s3 == turn || s3 == 0);
}

inline void append(std::vector<int32_t>& to, const std::vector<int32_t>& from) {
  to.insert(to.end(), from.begin(), from.end());
}

}  // namespace

void setCrossingScan(bool on) { scanForCrossings = on; }
void setAvoidSliverEars(bool on) { avoidSliverEars = on; }

FlatRing projectRing(std::span<const int32_t> ring, const PointOf& pointXOf,
                     const PointOf& pointYOf, const PointOf& pointZOf, int forceDrop) {
  return projectRingWith(ring, pointXOf, pointYOf, pointZOf, forceDrop);
}

FlatRing projectRing(std::span<const int32_t> ring, const LinkedShellGraph& graph, int forceDrop) {
  const double* c = graph.coordData();
  return projectRingWith(
      ring, [c](int32_t v) { return c[v * 3]; }, [c](int32_t v) { return c[v * 3 + 1]; },
      [c](int32_t v) { return c[v * 3 + 2]; }, forceDrop);
}

std::vector<int32_t> triangleRing(const FlatRing& ring, TriangulationReport* report,
                                  WorkBudget* shared, const MintVertex& mint,
                                  const PairTaken& taken) {
  const int64_t n = static_cast<int64_t>(ring.ids.size());
  // One pot for the whole call, including every split beneath it; it grows with the ring.
  WorkBudget own;
  WorkBudget* workPtr = shared;
  if (!workPtr) {
    const int64_t side = n < 1200 ? n : 1200;
    const int64_t grown = side * side;
    own.clip = 246784 > 4 * grown ? 246784 : 4 * grown;
    own.scan = 20000 > grown ? 20000 : grown;
    workPtr = &own;
  }
  WorkBudget& work = *workPtr;
  if (n < 3) {
    if (report) report->reason = "fewer than three corners";
    return {};
  }
  if (n == 3) return {ring.ids[0], ring.ids[1], ring.ids[2]};

  const double* xy = ring.xy.data();
  auto px = [xy](int32_t i) { return xy[i * 2]; };
  auto py = [xy](int32_t i) { return xy[i * 2 + 1]; };
  const int32_t ni = static_cast<int32_t>(n);

  // `alive` starts as every corner; it doubles as the TS `whole` for the spike peel.
  std::vector<int32_t> alive(static_cast<size_t>(n));
  for (int32_t i = 0; i < ni; i++) alive[i] = i;

  // Peel a zero-width spike first: the tip becomes the zero-area triangle (prev, tip, next).
  {
    int32_t tip = ringSense(ring, alive) == 0 ? -2 : -1;
    const double tol = fuseDistance();
    for (int32_t k = 0; tip == -1 && k < ni; k++) {
      const int32_t prev = (k - 1 + ni) % ni, next = (k + 1) % ni;
      const double ux = px(k) - px(prev), uy = py(k) - py(prev);
      const double vx = px(next) - px(k), vy = py(next) - py(k);
      if (ux * vx + uy * vy >= 0) continue;  // collinear but going on, not turning back
      if (lineSide(px(prev), py(prev), px(k), py(k), px(next), py(next)) != 0) {
        if (!(tol > 0)) continue;
        const double wx = px(next) - px(prev), wy = py(next) - py(prev);
        const double span = jsHypot(wx, wy);
        if (span == 0) continue;
        if (std::fabs(wx * (py(k) - py(prev)) - wy * (px(k) - px(prev))) / span > tol) continue;
      }
      tip = k;
    }
    if (tip >= 0) {
      const int32_t prev = (tip - 1 + ni) % ni, next = (tip + 1) % ni;
      FlatRing kept;
      kept.ids.reserve(n - 1);
      kept.xy.resize(static_cast<size_t>(n - 1) * 2);
      int32_t at = 0;
      for (int32_t k = 0; k < ni; k++) {
        if (k == tip) continue;
        kept.ids.push_back(ring.ids[k]);
        kept.xy[at * 2] = xy[k * 2];
        kept.xy[at * 2 + 1] = xy[k * 2 + 1];
        at++;
      }
      std::vector<int32_t> rest = triangleRing(kept, report, &work, mint, taken);
      if (rest.empty() && kept.ids.size() >= 3) return {};
      if (report) report->reason = nullptr;
      rest.push_back(ring.ids[prev]);
      rest.push_back(ring.ids[tip]);
      rest.push_back(ring.ids[next]);
      return rest;
    }
  }

  // A ring that returns to a vertex it already visited is two rings: split at the first repeat.
  {
    int32_t seen = -1, repeatAt = -1;
    if (n <= 32) {
      for (int32_t i = 1; i < ni && seen < 0; i++)
        for (int32_t j = 0; j < i; j++)
          if (ring.ids[j] == ring.ids[i]) {
            seen = j;
            repeatAt = i;
            break;
          }
    } else {
      std::unordered_map<int32_t, int32_t> first;
      first.reserve(static_cast<size_t>(n));
      for (int32_t i = 0; i < ni; i++) {
        auto [it, fresh] = first.emplace(ring.ids[i], i);
        if (!fresh) {
          seen = it->second;
          repeatAt = i;
          break;
        }
      }
    }
    if (seen >= 0) {
      const int32_t i = repeatAt;
      FlatRing inner = sliceRing(ring, seen, i);
      FlatRing outer = sliceRing(ring, i, seen + ni);
      // Both halves under three corners: TS breaks out and carries on below.
      if (!(inner.ids.size() < 3 && outer.ids.size() < 3)) {
        std::vector<int32_t> a, b;
        if (inner.ids.size() >= 3) a = triangleRing(inner, report, &work, mint, taken);
        if (outer.ids.size() >= 3) b = triangleRing(outer, report, &work, mint, taken);
        if ((inner.ids.size() >= 3 && a.empty()) || (outer.ids.size() >= 3 && b.empty())) {
          if (report && !report->reason)
            report->reason = "ring revisits a vertex and neither half clips";
          return {};
        }
        if (report) report->reason = nullptr;
        append(a, b);
        return a;
      }
    }
  }

  // Touch before crossing: a touch is repaired exactly by visiting the existing corner twice.
  if (auto touch = touchesItself(ring, work)) {
    FlatRing rebuilt;
    rebuilt.ids.reserve(n + 1);
    rebuilt.xy.reserve((n + 1) * 2);
    for (int32_t k = 0; k < ni; k++) {
      rebuilt.ids.push_back(ring.ids[k]);
      rebuilt.xy.push_back(xy[k * 2]);
      rebuilt.xy.push_back(xy[k * 2 + 1]);
      if (k == touch->edge) {
        rebuilt.ids.push_back(ring.ids[touch->corner]);
        rebuilt.xy.push_back(xy[touch->corner * 2]);
        rebuilt.xy.push_back(xy[touch->corner * 2 + 1]);
      }
    }
    std::vector<int32_t> out = triangleRing(rebuilt, report, &work, mint, taken);
    if (!out.empty()) {
      if (report) report->reason = nullptr;
      return out;
    }
  }

  if (auto cut = crossesItself(ring, work)) {
    if (mint) {
      const int32_t a = ring.ids[cut->i], a2 = ring.ids[(cut->i + 1) % ni];
      const int32_t b = ring.ids[cut->j], b2 = ring.ids[(cut->j + 1) % ni];
      const int32_t loA = a < a2 ? a : a2, hiA = a < a2 ? a2 : a;
      const int32_t loB = b < b2 ? b : b2, hiB = b < b2 ? b2 : b;
      const bool leadsFirst = loA < loB || (loA == loB && hiA <= hiB);
      const MintEdge one{a, a2, cut->alongI};
      const MintEdge two{b, b2, cut->alongJ};
      const MintEdge order[2] = {leadsFirst ? one : two, leadsFirst ? two : one};
      const int32_t born = mint(std::span<const MintEdge>(order, 2));
      if (born >= 0) {
        FlatRing repaired = withCrossingCorner(ring, *cut, born);
        std::vector<int32_t> out = triangleRing(repaired, report, &work, mint, taken);
        if (!out.empty()) {
          if (report) report->reason = nullptr;
          return out;
        }
      }
    }
    if (report) report->reason = "ring crosses itself";
    return {};
  }

  // Remove spikes before clipping; each tip is kept as its zero-area triangle, appended last.
  std::vector<int32_t> spikes;
  for (int64_t guard = static_cast<int64_t>(alive.size()); guard-- > 0 && alive.size() > 3;) {
    bool cut = false;
    const int32_t len = static_cast<int32_t>(alive.size());
    for (int32_t k = 0; k < len; k++) {
      const int32_t prev = alive[(k - 1 + len) % len];
      const int32_t here = alive[k];
      const int32_t next = alive[(k + 1) % len];
      if (lineSide(px(prev), py(prev), px(here), py(here), px(next), py(next)) != 0) continue;
      const double ux = px(here) - px(prev), uy = py(here) - py(prev);
      const double vx = px(next) - px(here), vy = py(next) - py(here);
      if (ux * vx + uy * vy >= 0) continue;
      spikes.push_back(prev);
      spikes.push_back(here);
      spikes.push_back(next);
      alive.erase(alive.begin() + k);
      cut = true;
      break;
    }
    if (!cut) break;
  }
  if (alive.size() < 3) {
    if (report) report->reason = "fewer than three distinct corners";
    return {};
  }

  const int turn = ringSense(ring, alive);
  if (turn == 0) {
    if (report) report->reason = "zero area";
    return {};
  }

  std::vector<int32_t> out;
  out.reserve(static_cast<size_t>(n - 2) * 3 + spikes.size());
  int64_t guard = static_cast<int64_t>(alive.size()) * static_cast<int64_t>(alive.size()) + 8;

  bool relaxed = false;
  while (alive.size() > 3 && guard-- > 0) {
    bool clipped = false;
    bool dodgeTally = false;
    const int32_t len = static_cast<int32_t>(alive.size());
    for (int32_t k = 0; k < len; k++) {
      if (--work.clip < 0) {
        if (report) {
          report->exhausted = true;
          report->reason = "work budget exhausted";
        }
        return {};
      }
      const int32_t prev = alive[(k - 1 + len) % len];
      const int32_t here = alive[k];
      const int32_t next = alive[(k + 1) % len];

      if (lineSide(px(prev), py(prev), px(here), py(here), px(next), py(next)) != turn) continue;

      const double ax = px(prev), ay = py(prev), bx = px(here), by = py(here), cx = px(next),
                   cy = py(next);
      const double lowEdgeX = minOf3(ax, bx, cx), highEdgeX = maxOf3(ax, bx, cx);
      const double lowEdgeY = minOf3(ay, by, cy), highEdgeY = maxOf3(ay, by, cy);
      bool blocked = false;
      for (int32_t m = 0; m < len && !blocked; m++) {
        const int32_t probe = alive[m];
        if (probe == prev || probe == here || probe == next) continue;
        const double qx = px(probe), qy = py(probe);
        // A probe exactly on a corner of the ear is that corner, not an obstruction.
        if ((qx == ax && qy == ay) || (qx == bx && qy == by) || (qx == cx && qy == cy)) continue;
        if (qx < lowEdgeX || qx > highEdgeX || qy < lowEdgeY || qy > highEdgeY) continue;
        if (--work.clip < 0) {
          if (report) {
            report->exhausted = true;
            report->reason = "work budget exhausted";
          }
          return {};
        }
        if (withinTriangle(qx, qy, ax, ay, bx, by, cx, cy, turn)) blocked = true;
      }
      if (blocked) continue;

      // A taken diagonal is a preference: skipped once round the ring, accepted on the second pass.
      if (taken && !relaxed && taken(ring.ids[prev], ring.ids[next])) {
        dodgeTally = true;
        continue;
      }
      if (avoidSliverEars && !relaxed) {
        const double twice = std::fabs((bx - ax) * (cy - ay) - (by - ay) * (cx - ax));
        const double l1 = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
        const double l2 = (cx - bx) * (cx - bx) + (cy - by) * (cy - by);
        const double l3 = (ax - cx) * (ax - cx) + (ay - cy) * (ay - cy);
        const double longest = maxOf3(l1, l2, l3);
        if (twice < 2e-4 * longest) {
          dodgeTally = true;
          continue;
        }
      }

      out.push_back(ring.ids[prev]);
      out.push_back(ring.ids[here]);
      out.push_back(ring.ids[next]);
      alive.erase(alive.begin() + k);
      clipped = true;
      break;
    }
    if (!clipped && dodgeTally) {
      relaxed = true;
      guard++;
      continue;
    }
    relaxed = false;
    if (!clipped) {
      if (report) report->reason = "ring crosses itself";
      return {};
    }
  }

  if (alive.size() > 3) {
    if (report) report->reason = "ear clipping made no progress";
    return {};
  }
  if (alive.size() == 3) {
    out.push_back(ring.ids[alive[0]]);
    out.push_back(ring.ids[alive[1]]);
    out.push_back(ring.ids[alive[2]]);
  }
  for (size_t s = 0; s + 2 < spikes.size(); s += 3) {
    out.push_back(ring.ids[spikes[s]]);
    out.push_back(ring.ids[spikes[s + 1]]);
    out.push_back(ring.ids[spikes[s + 2]]);
  }
  return out;
}

}  // namespace brep
