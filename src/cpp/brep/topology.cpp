// topology.cpp — port of topology.ts.
#include "topology.h"

#include <algorithm>
#include <bit>
#include <cmath>
#include <limits>
#include <stdexcept>
#include <unordered_map>

// No FMA contraction: results must match JS doubles bit for bit.
#ifdef __clang__
#pragma clang fp contract(off)
#endif

namespace brep {

namespace {

double sharedTolerance = 0;

// ECMAScript ToInt32 of a double, as uint32 bits.
inline uint32_t toUint32Bits(double v) {
  if (v > -2147483649.0 && v < 2147483648.0) return static_cast<uint32_t>(static_cast<int32_t>(v));
  if (!std::isfinite(v)) return 0;
  // JS ToUint32: trunc, then modulo 2^32 into [0, 2^32). Dividing and multiplying by a power of two,
  // floor, and the final subtraction are all exact on integer-valued doubles, so this equals the
  // fmod form bit for bit and is several times cheaper.
  const double t = std::trunc(v);
  const double m = t - std::floor(t / 4294967296.0) * 4294967296.0;
  return static_cast<uint32_t>(m);
}

// Math.imul(h ^ x, 0x01000193) on uint32 bits.
inline uint32_t fnvStep(uint32_t h, uint32_t x) { return (h ^ x) * 0x01000193u; }

}  // namespace

void setWeldTolerance(double t) {
  if (!(t >= 0) || !std::isfinite(t))
    throw std::runtime_error("weld tolerance must be finite and >= 0, got " + std::to_string(t));
  sharedTolerance = t;
}

double fuseDistance() { return sharedTolerance; }

LinkedShellGraph::LinkedShellGraph(double tol) : tolerance(tol > 0 ? tol : 0) {
  hasCells = tolerance > 0;
  coords.reserve(48);
  dartFrom.reserve(64);
  dartAhead.reserve(64);
  dartOpposite.reserve(64);
  dartLoop.reserve(64);
  loopDart.reserve(16);
  loopFacet.reserve(16);
  facetOuter.reserve(16);
}

int32_t LinkedShellGraph::placeCorner(double x, double y, double z) {
  // Collapse negative zero onto zero before hashing.
  x += 0.0;
  y += 0.0;
  z += 0.0;

  const uint32_t key = mix(x, y, z);
  const int32_t bucket = perPlace.head(key);
  for (int32_t e = bucket; e >= 0; e = perPlace.next(e)) {
    const int32_t candidate = perPlace.value(e);
    if (coords[candidate * 3] == x && coords[candidate * 3 + 1] == y &&
        coords[candidate * 3 + 2] == z)
      return candidate;
  }

  if (hasCells) {
    const int32_t near = nearestWithin(x, y, z);
    if (near != NONE) {
      perPlace.push(key, near);
      weldedByProximity++;
      return near;
    }
  }

  const int32_t at = cornerTotal++;
  coords.push_back(x);
  coords.push_back(y);
  coords.push_back(z);
  perPlace.push(key, at);
  if (hasCells) cellBuckets.push(homeCell(x, y, z, tolerance), at);
  return at;
}

int32_t LinkedShellGraph::nearestWithin(double x, double y, double z) const {
  const double tol = tolerance;
  const double limit = tol * tol;
  const double bx = std::floor(x / tol), by = std::floor(y / tol), bz = std::floor(z / tol);
  int32_t best = NONE;
  double tightestGap = std::numeric_limits<double>::infinity();
  // foldCell's six words, per axis and offset, computed once instead of 27 times.
  constexpr double TWO32 = 4294967296.0;
  uint32_t lo[3][3], hi[3][3];
  const double base[3] = {bx, by, bz};
  for (int a = 0; a < 3; a++)
    for (int d = 0; d < 3; d++) {
      const double c = base[a] + (d - 1);
      lo[a][d] = toUint32Bits(c);
      hi[a][d] = toUint32Bits(c / TWO32);
    }
  for (int dx = 0; dx < 3; dx++) {
    const uint32_t hx = fnvStep(0x811c9dc5u, lo[0][dx]);
    for (int dy = 0; dy < 3; dy++) {
      const uint32_t hxy = fnvStep(hx, lo[1][dy]);
      for (int dz = 0; dz < 3; dz++) {
        const uint32_t cell = fnvStep(fnvStep(fnvStep(fnvStep(hxy, lo[2][dz]), hi[0][dx]), hi[1][dy]), hi[2][dz]);
        for (int32_t e = cellBuckets.head(cell); e >= 0; e = cellBuckets.next(e)) {
          const int32_t candidate = cellBuckets.value(e);
          const double ex = coords[candidate * 3] - x;
          const double ey = coords[candidate * 3 + 1] - y;
          const double ez = coords[candidate * 3 + 2] - z;
          const double gap = ex * ex + ey * ey + ez * ez;
          if (gap <= limit && gap < tightestGap) {
            tightestGap = gap;
            best = candidate;
          }
        }
      }
    }
  }
  return best;
}

uint32_t LinkedShellGraph::homeCell(double x, double y, double z, double tol) {
  return foldCell(std::floor(x / tol), std::floor(y / tol), std::floor(z / tol));
}

uint32_t LinkedShellGraph::foldCell(double i, double j, double k) {
  constexpr double TWO32 = 4294967296.0;
  uint32_t h = 0x811c9dc5u;
  h = fnvStep(h, toUint32Bits(i));
  h = fnvStep(h, toUint32Bits(j));
  h = fnvStep(h, toUint32Bits(k));
  h = fnvStep(h, toUint32Bits(i / TWO32));
  h = fnvStep(h, toUint32Bits(j / TWO32));
  h = fnvStep(h, toUint32Bits(k / TWO32));
  return h;
}

uint32_t LinkedShellGraph::mix(double x, double y, double z) {
  // DataView is big-endian: word 0 is the high half of the double, word 4 the low half.
  uint32_t h = 0x811c9dc5u;
  uint64_t b = std::bit_cast<uint64_t>(x);
  h = fnvStep(h, static_cast<uint32_t>(b >> 32));
  h = fnvStep(h, static_cast<uint32_t>(b));
  b = std::bit_cast<uint64_t>(y);
  h = fnvStep(h, static_cast<uint32_t>(b >> 32));
  h = fnvStep(h, static_cast<uint32_t>(b));
  b = std::bit_cast<uint64_t>(z);
  h = fnvStep(h, static_cast<uint32_t>(b >> 32));
  h = fnvStep(h, static_cast<uint32_t>(b));
  return h;
}

int32_t LinkedShellGraph::appendPanel(std::span<const int32_t> incoming) {
  if (!tidy(incoming, tidyScratch)) return NONE;
  const int32_t facet = facetTotal++;
  facetOuter.push_back(NONE);
  const int32_t loop = attachLoop(tidyScratch, facet);
  facetOuter[facet] = loop;
  return facet;
}

int32_t LinkedShellGraph::appendVoid(int32_t facet, std::span<const int32_t> incoming) {
  if (facet < 0 || facet >= facetTotal) return NONE;
  if (!tidy(incoming, tidyScratch)) return NONE;
  return attachLoop(tidyScratch, facet);
}

bool LinkedShellGraph::tidy(std::span<const int32_t> incoming, std::vector<int32_t>& ring) {
  if (incoming.size() < 3) return false;
  ring.clear();
  for (int32_t v : incoming)
    if (ring.empty() || ring.back() != v) ring.push_back(v);
  while (ring.size() > 1 && ring.front() == ring.back()) ring.pop_back();
  if (ring.size() < 3) return false;
  const size_t n = ring.size();
  for (size_t a = 0; a < n; a++)
    for (size_t b = a + 1; b < n; b++)
      if (ring[a] == ring[b]) return false;
  return true;
}

int32_t LinkedShellGraph::attachLoop(std::span<const int32_t> ring, int32_t facet) {
  const int32_t loop = loopTotal++;
  loopDart.push_back(NONE);
  loopFacet.push_back(facet);

  const int32_t firstDart = dartTotal;
  const int32_t n = static_cast<int32_t>(ring.size());
  for (int32_t i = 0; i < n; i++) {
    const int32_t dart = dartTotal++;
    dartFrom.push_back(ring[i]);
    dartLoop.push_back(loop);
    dartOpposite.push_back(NONE);
    dartAhead.push_back(firstDart + ((i + 1) % n));
    remember(ring[i], ring[(i + 1) % n], dart);
  }
  loopDart[loop] = firstDart;
  return loop;
}

bool LinkedShellGraph::hasDart(int32_t from, int32_t to) const {
  return pairing.get(directedKey(from, to)) >= 0;
}

void LinkedShellGraph::remember(int32_t from, int32_t to, int32_t dart) {
  bool inserted = false;
  pairing.getOrInsert(directedKey(from, to), dart, inserted);
  // The same directed edge twice: two facets wind the same way along it.
  if (!inserted) excessEdges.push_back({from, to});
}

void LinkedShellGraph::seal() {
  for (int32_t dart = 0; dart < dartTotal; dart++) {
    if (dartOpposite[dart] != NONE) continue;
    const int32_t from = dartFrom[dart];
    const int32_t to = dartFrom[dartAhead[dart]];
    const int32_t facing = pairing.get(directedKey(to, from));
    if (facing < 0) continue;
    if (dartOpposite[facing] != NONE) continue;  // already spoken for
    dartOpposite[dart] = facing;
    dartOpposite[facing] = dart;
  }
}

int32_t LinkedShellGraph::boundaryDarts() const {
  int32_t open = 0;
  for (int32_t dart = 0; dart < dartTotal; dart++)
    if (dartOpposite[dart] == NONE) open++;
  return open;
}

bool LinkedShellGraph::isWatertight() const {
  return dartTotal > 0 && boundaryDarts() == 0 && excessEdges.empty();
}

std::vector<int32_t> LinkedShellGraph::boundaryVertices() const {
  // Set insertion order, kept by a seen-flag per vertex.
  std::vector<char> seen(static_cast<size_t>(cornerTotal), 0);
  std::vector<int32_t> out;
  auto add = [&](int32_t v) {
    if (v >= 0 && v < cornerTotal) {
      if (seen[v]) return;
      seen[v] = 1;
    } else if (std::find(out.begin(), out.end(), v) != out.end()) {
      return;
    }
    out.push_back(v);
  };
  for (int32_t dart = 0; dart < dartTotal; dart++) {
    if (dartOpposite[dart] != NONE) continue;
    add(dartFrom[dart]);
    add(dartFrom[dartAhead[dart]]);
  }
  return out;
}

double LinkedShellGraph::eulerNumber() const {
  const double open = boundaryDarts();
  const double edgeTotal = (dartTotal - open) / 2 + open;
  return cornerTotal - edgeTotal + facetTotal;
}

std::vector<std::vector<int32_t>> LinkedShellGraph::rimLoops() const {
  std::vector<int32_t> open;
  for (int32_t dart = 0; dart < dartTotal; dart++)
    if (dartOpposite[dart] == NONE) open.push_back(dart);
  lastBoundaryRefusal.clear();
  if (open.size() < 3) {
    lastBoundaryRefusal = "only " + std::to_string(open.size()) + " border dart(s)";
    return {};
  }

  // The border dart continuing `dart`, by rotating around the vertex it arrives at.
  auto forwardLinks = [this](int32_t dart) -> int32_t {
    int32_t at = dartAhead[dart];
    for (int32_t turn = 0; turn <= dartTotal; turn++) {
      if (dartOpposite[at] == NONE) return at;
      at = dartAhead[dartOpposite[at]];
    }
    return NONE;
  };

  std::vector<std::vector<int32_t>> loops;
  std::vector<char> spent(static_cast<size_t>(dartTotal), 0);
  const size_t openCount = open.size();
  for (int32_t first : open) {
    if (spent[first]) continue;
    std::vector<int32_t> ring;
    int32_t dart = first;
    for (size_t step = 0; step <= openCount; step++) {
      spent[dart] = 1;
      ring.push_back(dartFrom[dart]);
      const int32_t next = forwardLinks(dart);
      if (next == NONE) {
        lastBoundaryRefusal = "the fan around a vertex never reached a border dart";
        return {};
      }
      dart = next;
      if (dart == first) break;
    }
    if (dart != first || ring.size() < 3) {
      lastBoundaryRefusal =
          "a walk of " + std::to_string(ring.size()) + " did not return to its start";
      return {};
    }
    std::reverse(ring.begin(), ring.end());
    loops.push_back(std::move(ring));
  }
  return loops;
}

std::optional<std::vector<int32_t>> LinkedShellGraph::boundaryLoop() const {
  std::vector<int32_t> open;
  for (int32_t dart = 0; dart < dartTotal; dart++)
    if (dartOpposite[dart] == NONE) open.push_back(dart);
  if (open.size() < 3) return std::nullopt;

  // Vertex -> border dart leaving it; the last one written wins, as in the TS Map.
  int32_t span = cornerTotal;
  for (int32_t dart : open) span = std::max(span, dartFrom[dart] + 1);
  std::vector<int32_t> startsAt(static_cast<size_t>(span), NONE);
  for (int32_t dart : open) startsAt[dartFrom[dart]] = dart;

  const int32_t first = open[0];
  std::vector<int32_t> ring;
  int32_t dart = first;
  do {
    ring.push_back(dartFrom[dart]);
    const int32_t touchesDown = dartFrom[dartAhead[dart]];
    const int32_t forwardLinks = touchesDown < span ? startsAt[touchesDown] : NONE;
    if (forwardLinks == NONE) return std::nullopt;  // the border does not close
    dart = forwardLinks;
  } while (dart != first && ring.size() <= open.size());

  if (ring.size() != open.size()) return std::nullopt;  // more than one loop
  std::reverse(ring.begin(), ring.end());
  return ring;
}

std::vector<int32_t> LinkedShellGraph::ringOwnedBy(int32_t loop) const {
  std::vector<int32_t> ring;
  const int32_t first = loopDart[loop];
  int32_t dart = first;
  do {
    ring.push_back(dartFrom[dart]);
    dart = dartAhead[dart];
  } while (dart != first && static_cast<int64_t>(ring.size()) <= dartTotal);
  return ring;
}

std::vector<int32_t> LinkedShellGraph::outerRingOf(int32_t facet) const {
  return ringOwnedBy(facetOuter[facet]);
}

double LinkedShellGraph::enclosedSignedVolume() const {
  double six = 0;
  for (int32_t facet = 0; facet < facetTotal; facet++) {
    // Walk the outer loop in place rather than materialising the ring.
    const int32_t firstDart = loopDart[facetOuter[facet]];
    const int32_t a = dartFrom[firstDart];
    const double ax = pointXOf(a), ay = pointYOf(a), az = pointZOf(a);
    int32_t d = dartAhead[firstDart];
    if (d == firstDart) continue;
    int32_t visited = 2;  // ring entries read so far: a and b
    while (true) {
      const int32_t dn = dartAhead[d];
      if (dn == firstDart || visited > dartTotal) break;
      const int32_t b = dartFrom[d], c = dartFrom[dn];
      const double bx = pointXOf(b), by = pointYOf(b), bz = pointZOf(b);
      const double cx = pointXOf(c), cy = pointYOf(c), cz = pointZOf(c);
      six += ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx);
      d = dn;
      visited++;
    }
  }
  return six / 6;
}

std::vector<std::vector<int32_t>> splitPinchedRing(std::span<const int32_t> incoming) {
  std::vector<std::vector<int32_t>> out;
  std::vector<std::vector<int32_t>> pending;
  pending.emplace_back(incoming.begin(), incoming.end());
  int64_t guard = static_cast<int64_t>(incoming.size()) * 4 + 8;
  std::unordered_map<int32_t, size_t> earliestSeen;
  while (!pending.empty() && guard-- > 0) {
    std::vector<int32_t> ring = std::move(pending.back());
    pending.pop_back();
    std::vector<int32_t> tight;
    tight.reserve(ring.size());
    for (int32_t v : ring)
      if (tight.empty() || tight.back() != v) tight.push_back(v);
    while (tight.size() > 1 && tight.front() == tight.back()) tight.pop_back();
    if (tight.size() < 3) continue;

    // First index that repeats an earlier one, and that earlier one.
    long cutPlaneAt = -1, sliceTo = -1;
    const size_t n = tight.size();
    if (n <= 32) {
      for (size_t i = 1; i < n && cutPlaneAt < 0; i++)
        for (size_t j = 0; j < i; j++)
          if (tight[j] == tight[i]) {
            cutPlaneAt = static_cast<long>(j);
            sliceTo = static_cast<long>(i);
            break;
          }
    } else {
      earliestSeen.clear();
      for (size_t i = 0; i < n; i++) {
        auto [it, fresh] = earliestSeen.emplace(tight[i], i);
        if (!fresh) {
          cutPlaneAt = static_cast<long>(it->second);
          sliceTo = static_cast<long>(i);
          break;
        }
      }
    }
    if (cutPlaneAt < 0) {
      out.push_back(std::move(tight));
      continue;
    }
    pending.emplace_back(tight.begin() + cutPlaneAt, tight.begin() + sliceTo);
    std::vector<int32_t> rest(tight.begin(), tight.begin() + cutPlaneAt);
    rest.insert(rest.end(), tight.begin() + sliceTo, tight.end());
    pending.push_back(std::move(rest));
  }
  return out;
}

}  // namespace brep
