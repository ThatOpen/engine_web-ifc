// topology.h — the boundary structure (half-edge complex) as parallel arrays. Port of topology.ts.
#pragma once

#include <array>
#include <cstdint>
#include <initializer_list>
#include <optional>
#include <span>
#include <string>
#include <vector>

#include "curves.h"

namespace brep {

// Nothing points here.
inline constexpr int32_t NONE = -1;

// Default weld distance in metres (ten and a half microns).
inline constexpr double WELD_METRES = 1.05e-5;

// Set the tolerance new graphs capture at construction; throws on negative or non-finite.
void setWeldTolerance(double t);
// The tolerance new graphs capture at construction.
double fuseDistance();

namespace detail {

// Open-addressing map from a key to a non-negative int32 (-1 marks an empty slot). Lookups only;
// nothing in the kernel iterates these, so order is not a concern.
template <class K>
class ProbeMap {
 public:
  struct Slot {
    K key;
    int32_t val;
  };

  int32_t get(K key) const {
    if (slots_.empty()) return -1;
    size_t i = spread(key) & mask_;
    for (;;) {
      const Slot& s = slots_[i];
      if (s.val < 0) return -1;
      if (s.key == key) return s.val;
      i = (i + 1) & mask_;
    }
  }

  // Slot value for `key`, inserted as `fresh` when absent; `inserted` reports which.
  int32_t& getOrInsert(K key, int32_t fresh, bool& inserted) {
    if ((count_ + 1) * 2 > slots_.size()) grow();
    size_t i = spread(key) & mask_;
    for (;;) {
      Slot& s = slots_[i];
      if (s.val < 0) {
        s.key = key;
        s.val = fresh;
        ++count_;
        inserted = true;
        return s.val;
      }
      if (s.key == key) {
        inserted = false;
        return s.val;
      }
      i = (i + 1) & mask_;
    }
  }

  size_t size() const { return count_; }
  void swap(ProbeMap& o) {
    slots_.swap(o.slots_);
    std::swap(mask_, o.mask_);
    std::swap(count_, o.count_);
  }

  // Room for `n` keys without growing (lookups only, so the slot layout changes no answer).
  void reserve(size_t n) {
    size_t cap = 64;
    while (cap < n * 2) cap *= 2;
    if (cap > slots_.size()) rehash(cap);
  }

 private:
  static size_t spread(K key) {
    uint64_t h = static_cast<uint64_t>(key);
    h ^= h >> 33;
    h *= 0xff51afd7ed558ccdULL;
    h ^= h >> 33;
    return static_cast<size_t>(h);
  }
  void grow() { rehash(slots_.empty() ? 64 : slots_.size() * 2); }
  void rehash(size_t cap) {
    std::vector<Slot> old;
    old.swap(slots_);
    slots_.assign(cap, Slot{K{}, -1});
    mask_ = cap - 1;
    for (const Slot& s : old) {
      if (s.val < 0) continue;
      size_t i = spread(s.key) & mask_;
      while (slots_[i].val >= 0) i = (i + 1) & mask_;
      slots_[i] = s;
    }
  }

  std::vector<Slot> slots_;
  size_t mask_ = 0;
  size_t count_ = 0;
};

// Map<key, number[]> as key -> chain of entries in a shared pool, append order preserved.
template <class K>
class ChainMap {
 public:
  // First entry of the chain for `key`, or -1.
  int32_t head(K key) const {
    int32_t c = index_.get(key);
    return c < 0 ? -1 : chains_[c].head;
  }
  int32_t value(int32_t entry) const { return entries_[entry].value; }
  int32_t next(int32_t entry) const { return entries_[entry].next; }

  void reserve(size_t n) {
    index_.reserve(n);
    chains_.reserve(n);
    entries_.reserve(n);
  }

  void push(K key, int32_t v) {
    if (entries_.empty()) {
      entries_.reserve(32);
      chains_.reserve(32);
    }
    bool inserted = false;
    const int32_t chain =
        index_.getOrInsert(key, static_cast<int32_t>(chains_.size()), inserted);
    const int32_t e = static_cast<int32_t>(entries_.size());
    entries_.push_back({v, -1});
    if (inserted) {
      chains_.push_back({e, e});
    } else {
      entries_[chains_[chain].tail].next = e;
      chains_[chain].tail = e;
    }
  }

 private:
  struct Entry {
    int32_t value, next;
  };
  struct Chain {
    int32_t head, tail;
  };
  ProbeMap<K> index_;
  std::vector<Chain> chains_;
  std::vector<Entry> entries_;
};

}  // namespace detail

class LinkedShellGraph {
 public:
  explicit LinkedShellGraph(double tolerance = fuseDistance());

  // Why the last rimLoops came back empty; empty string means it genuinely found none.
  static inline std::string lastBoundaryRefusal;

  // Distance at which two points count as one. Captured at construction (TS readonly).
  double tolerance;
  // How many times a new point joined an existing vertex by proximity rather than exact bits.
  int32_t weldedByProximity = 0;
  // Directed edges emitted twice (TS readonly array of [from, to]).
  std::vector<std::array<int32_t, 2>> excessEdges;

  int32_t cornerTally() const { return cornerTotal; }
  int32_t dartCount() const { return dartTotal; }
  int32_t panelTally() const { return facetTotal; }

  // Index of the vertex at exactly this position (or welded within tolerance), creating it if new.
  int32_t placeCorner(double x, double y, double z);
  // C++ only: a vertex at this position that no lookup finds and nothing welds to, for joining a
  // separate solid that touches this one at a point or along an edge (each keeps its own corners).
  int32_t placeLoneCorner(double x, double y, double z) {
    const int32_t at = cornerTotal++;
    coords.push_back(x + 0.0);
    coords.push_back(y + 0.0);
    coords.push_back(z + 0.0);
    return at;
  }
  // Capacity hint for a graph about to receive this many vertices and darts; changes no result.
  void reserve(size_t corners, size_t darts) {
    coords.reserve(corners * 3);
    perPlace.reserve(corners);
    if (hasCells) cellBuckets.reserve(corners);
    dartFrom.reserve(darts);
    dartAhead.reserve(darts);
    dartOpposite.reserve(darts);
    dartLoop.reserve(darts);
    pairing.reserve(darts);
  }

  P3 pointFrom(int32_t v) const { return {coords[v * 3], coords[v * 3 + 1], coords[v * 3 + 2]}; }
  void pointFrom(int32_t v, double* into) const {
    into[0] = coords[v * 3];
    into[1] = coords[v * 3 + 1];
    into[2] = coords[v * 3 + 2];
  }
  double pointXOf(int32_t v) const { return coords[v * 3]; }
  double pointYOf(int32_t v) const { return coords[v * 3 + 1]; }
  double pointZOf(int32_t v) const { return coords[v * 3 + 2]; }

  // Add a facet bounded by a ring of vertices; NONE when degenerate.
  int32_t appendPanel(std::span<const int32_t> incoming);
  int32_t appendPanel(std::initializer_list<int32_t> incoming) {
    return appendPanel(std::span<const int32_t>(incoming.begin(), incoming.size()));
  }
  // Add a hole to an existing facet; NONE when degenerate or the facet does not exist.
  int32_t appendVoid(int32_t facet, std::span<const int32_t> incoming);
  int32_t appendVoid(int32_t facet, std::initializer_list<int32_t> incoming) {
    return appendVoid(facet, std::span<const int32_t>(incoming.begin(), incoming.size()));
  }

  // Is a dart already running from `from` to `to`?
  bool hasDart(int32_t from, int32_t to) const;

  // Pair every dart with the one facing it. Call once, after all facets are added.
  void seal();

  int32_t boundaryDarts() const;
  bool isWatertight() const;
  // Every vertex touched by a dart with no opposite, in first-touch order.
  std::vector<int32_t> boundaryVertices() const;
  // V - E + F (may be fractional when the dart count is odd, exactly as TS).
  double eulerNumber() const;
  // Every closed boundary loop, each wound to face outward; empty plus lastBoundaryRefusal on refusal.
  std::vector<std::vector<int32_t>> rimLoops() const;
  // The single boundary loop, or nullopt when none or more than one.
  std::optional<std::vector<int32_t>> boundaryLoop() const;

  std::vector<int32_t> ringOwnedBy(int32_t loop) const;
  std::vector<int32_t> outerRingOf(int32_t facet) const;

  double enclosedSignedVolume() const;

  // C++ only: read-only access to the raw arrays (TS reaches them only from inside the class).
  int32_t loopTally() const { return loopTotal; }
  int32_t dartFromOf(int32_t d) const { return dartFrom[d]; }
  int32_t dartAheadOf(int32_t d) const { return dartAhead[d]; }
  int32_t dartOppositeOf(int32_t d) const { return dartOpposite[d]; }
  int32_t dartLoopOf(int32_t d) const { return dartLoop[d]; }
  int32_t loopDartOf(int32_t l) const { return loopDart[l]; }
  int32_t loopFacetOf(int32_t l) const { return loopFacet[l]; }
  int32_t facetOuterOf(int32_t f) const { return facetOuter[f]; }
  const double* coordData() const { return coords.data(); }

 private:
  int32_t nearestWithin(double x, double y, double z) const;
  static uint32_t homeCell(double x, double y, double z, double tol);
  static uint32_t foldCell(double i, double j, double k);
  static uint32_t mix(double x, double y, double z);
  static bool tidy(std::span<const int32_t> incoming, std::vector<int32_t>& ring);
  int32_t attachLoop(std::span<const int32_t> ring, int32_t facet);
  static int64_t directedKey(int32_t from, int32_t to) {
    return static_cast<int64_t>(from) * 94906265 + to;
  }
  void remember(int32_t from, int32_t to, int32_t dart);

  // vertices: interleaved xyz
  std::vector<double> coords;
  int32_t cornerTotal = 0;
  // exact-coordinate lookup: numeric hash -> candidate vertices, confirmed bit-for-bit
  detail::ChainMap<uint32_t> perPlace;
  // proximity index, used only when a tolerance is in force
  bool hasCells = false;
  detail::ChainMap<uint32_t> cellBuckets;

  // darts
  std::vector<int32_t> dartFrom;      // vertex the dart leaves
  std::vector<int32_t> dartAhead;     // next dart around the same loop
  std::vector<int32_t> dartOpposite;  // dart facing it across the edge, or NONE
  std::vector<int32_t> dartLoop;      // loop the dart belongs to
  int32_t dartTotal = 0;

  // loops and facets
  std::vector<int32_t> loopDart;  // any dart on the loop
  std::vector<int32_t> loopFacet;
  int32_t loopTotal = 0;
  std::vector<int32_t> facetOuter;  // the bounding loop
  int32_t facetTotal = 0;

  // directed vertex pair -> dart
  detail::ProbeMap<int64_t> pairing;

  // C++ only: scratch for tidy, so appending a facet allocates nothing once warm
  std::vector<int32_t> tidyScratch;
};

// Cut a ring that touches itself into the simple rings it is made of.
std::vector<std::vector<int32_t>> splitPinchedRing(std::span<const int32_t> incoming);

}  // namespace brep
