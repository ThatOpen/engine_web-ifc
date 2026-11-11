// subtract.h — remove one solid from another (and union / intersection / half-space clip) by
// shattering faces against each other's planes and classifying the fragments. Port of subtract.ts.
#pragma once

#include <array>
#include <cstdint>
#include <limits>
#include <memory>
#include <optional>
#include <string>
#include <vector>

#include "curves.h"    // P3
#include "topology.h"  // LinkedShellGraph

namespace brep {

// ── plane-bucket audit (diagnostic) ──────────────────────────────────────────────────────────────
struct PlaneAudit {
  int64_t added = 0;
  int64_t missed = 0;
  int64_t corners = 0;
  int64_t declinedCorners = 0;
  int64_t degenerateCorners = 0;  // |det| exactly 0
  int64_t thresholdCorners = 0;   // |det| under scale * 1e-10
  int64_t crossings = 0;
  int64_t routeCrossings = 0;  // crossings that fell back to `meet`
  int64_t jointEdges = 0;
  int64_t methodDisagreed = 0;
  int64_t crossingsUntagged = 0;
  int64_t crossingsNoTriple = 0;
};
extern PlaneAudit planeAudit;
void resetPlaneAudit();
// Switch the audit on. Diagnostic only: it makes plane registration quadratic.
void setPlaneAudit(bool on);

// ── knobs (module-level state in TS; defaults noted) ─────────────────────────────────────────────
void setParallelEnough(double x);  // 2e-4
double getParallelEnough();
void setCoplanarUncoveredIsOut(bool on);  // true
void setUncoveredOffPlaneProbe(bool on);  // true
void setUncoveredIsWall(bool on);         // false
void setSkipThinTools(bool on);           // false
void setSkipUntouchingTools(bool on);     // false
bool skipUntouchingToolsOn();
void setGateCutsByToolBox(bool on);       // true: a plane cuts only pieces reaching its solid's box
void setUncoveredInnerProbe(bool on);     // true
void setInnerFirst(bool on);              // false
void setDropSecondOnlyWhole(bool on);     // false
void setPeelWeldedSpikes(bool on);        // true
void forcePeelPass(bool on);              // probe only
void forceDoubleBuild(bool on);           // probe only
void setDropSecondClaimant(bool on);      // true
void setRetryWithoutDropSecond(bool on);  // true
void setReverseSecondClaimant(bool on);   // false
void setDropZeroFins(bool on);            // true
void setPlaneOverlay(bool on);            // false
void setSnapQuasiFlush(bool on);          // false
void setEvictSurplusRings(bool on);       // true
void setOnPlaneTolerance(double x);       // 1.25e-7 (fraction of the weld)
void setPullSidesAtCut(bool on);          // true
void setBoundaryBySides(bool on);         // true
void setLargestFirst(bool on);            // false
void setDedupeSubjectFaces(bool on);      // false
void setRefuseDegenerateSeam(bool on);    // false
void setIdentityShortCircuit(bool on);    // true
void setFlushNoOp(bool on);               // true
void setCrossSnap(double rel);            // 0
double getCrossSnap();
void setChainDropReversed(bool on);  // false
void setChainAngularNext(bool on);   // false
void setChainTurnFlip(bool on);      // false
void setArrangementSplit(bool on);   // true
void setMinimumFacetArea(double area);  // 0
// nullopt = TS null: "whatever the weld is".
void setPlaneIdentityDistance(std::optional<double> metres);
void setPlanePrune(bool on);   // true
void setPlaneCap(int32_t n);   // 256
void setFragmentCap(int32_t n);  // 20000

// Which side of a plane a corner is on: -1, 0 or 1.
using CornerSide = int;

// How far outside the nearest coplanar face the last unanswered point fell. Instrumentation only.
double coplanarMiss();
// The exit `classifyAt` took on its last call: "noCoplanar" | "coplanarNotCovered" | "coveredSense".
std::string classifyPath();

// ── counters (TS `stats`, a mutable module object) ───────────────────────────────────────────────
struct SubtractStats {
  double outerShatter = 0, outerClassify = 0;
  int64_t outerFragments = 0;
  double innerShatter = 0, innerClassify = 0;
  int64_t innerFragments = 0;
  double booleanMs = 0;
  int64_t booleanCalls = 0;

  int64_t outerDropped = 0;
  double outerDroppedArea = 0;
  double outerTotalArea = 0;
  int64_t innerRefusedNotIn = 0;
  double innerRefusedNotInArea = 0;
  int64_t innerRefusedTouchesTool = 0;
  int64_t innerKept = 0;
  double innerKeptArea = 0;

  int64_t innerKeptViaCovered = 0;
  int64_t innerKeptViaEnclosesNoCoplanar = 0;
  int64_t innerKeptViaEnclosesNotCovered = 0;
  double innerKeptViaEnclosesNotCoveredArea = 0;
  double innerKeptViaEnclosesNoCoplanarArea = 0;
  struct FlushMiss {
    double miss, area;
  };
  std::vector<FlushMiss> flushMisses;

  bool coplanarPairTrace = false;
  int64_t subjectFacets = 0;
  int64_t subjectCoplanarOverlaps = 0;
  double subjectCoplanarOverlapArea = 0;
  int64_t subjectCoplanarIdentical = 0;
  int64_t subjectCoplanarPartial = 0;
  int64_t subjectCoplanarSameSense = 0;
  int64_t subjectCoplanarOppSense = 0;
  struct CoplanarPair {
    double angle, gap, area;
  };
  std::vector<CoplanarPair> subjectCoplanarPairs;

  bool ringAuditTrace = false;
  int64_t ringsAudited = 0;
  int64_t ringsRepeatedVertex = 0;
  int64_t ringsSelfCrossing = 0;
  double ringsSelfCrossingArea = 0;

  struct Detail {
    std::string where;
    P3 normal;
    double area;
    std::string verdict;
    int32_t tool;
    int64_t call;
    int32_t plane;
  };
  std::vector<Detail> detail;
  bool detailOn = false;
  int64_t detailCap = 4000;
  bool classifyTrace = false;
  struct Sense {
    int32_t plane;
    P3 mine, theirs;
    std::string verdict;
    int32_t mineCorners, theirCorners;
  };
  std::vector<Sense> senseTrace;
  struct Branch {
    int32_t plane, coplanar, covered;
  };
  std::vector<Branch> classifyBranch;
  std::vector<std::vector<double>> toolBoxes;

  int64_t assemblyRefused = 0;
  double assemblyRefusedArea = 0;
  int64_t assemblySliver = 0;
  int64_t assemblyCollapsed = 0;
  double assemblyCollapsedArea = 0;
  double assemblyCollapsedAreaMax = 0;
  int64_t assemblyOffered = 0;
  int64_t assemblyPlaced = 0;
  double assemblyOfferedArea = 0;
  int64_t assemblyOuterCount = 0;
  int64_t cutCalls = 0, cutManyCrossings = 0, cutSplitIntoParts = 0;
  int64_t chainBranchPoints = 0, chainAngularDiffered = 0, chainReversedPairsDropped = 0;
  int64_t fallbackManyCrossings = 0, fallbackFewCrossings = 0, fallbackFewWithOnPlane = 0;
  int64_t chainLoopsDropped = 0, chainLoopDroppedCorners = 0;
  int64_t cutSplitAttempted = 0, cutSplitRefused = 0, cutSplitOneSided = 0;
  int64_t cutRefusedThin = 0;
  int64_t cutRunOnPlane = 0, cutRunTangent = 0, cutRunCrossing = 0;
  int64_t cutCrossingsHiddenByRuns = 0;
  int64_t seamSpikesPeeled = 0, weldedSpikesPeeled = 0;
  int64_t peelRetries = 0, peelRetryFixed = 0;
  int64_t tangentRunCornersKeptOnce = 0;
  int64_t cutRefusedFewCorners = 0, cutRefusedNoArea = 0;
  int64_t arrangementSplits = 0;
  struct ArrangementWhy {
    int64_t tooFewPoints = 0, onLineEdgeUndecided = 0, tooFewOnLine = 0, degenerateLine = 0,
            seamUndecided = 0, chainOpen = 0, emptySide = 0, emptyNoEdges = 0,
            emptyLoopsDropped = 0, unevenSplit = 0;
  } arrangementWhy;
  bool arrangementTrace = false;
  struct Drift {
    std::string at;
    int32_t degree;
  };
  struct ArrangementOpen {
    std::string side;
    int64_t edges;
    std::vector<Drift> driftBy;
  };
  std::optional<ArrangementOpen> arrangementOpen;
  std::optional<std::vector<std::string>> arrangementEdges;
  std::optional<std::vector<std::string>> arrangementSeam;
  int64_t arrangementRefused = 0;
  int64_t assemblyBelowFloor = 0;
  int64_t subtractFlushNoOp = 0;
  int64_t tJunctionsHealed = 0;  // corners put into a neighbour's edge after box-gated cuts
  int64_t crossingsOffEdge = 0;  // three-plane crossings refused for landing off the edge they cut
  int64_t planesRegistered = 0, planesMatchedByTolerance = 0;
  int64_t planeCandidates = 0, planeRejectedByAngle = 0, planeRejectedBySlab = 0;
  double planeNarrowestMiss = std::numeric_limits<double>::infinity();
  int64_t rebuiltPieceReversed = 0, walkedPieceReversed = 0;
  int64_t subtractIdentity = 0;
  int64_t toolsOutOfReach = 0, thinToolsSkipped = 0;
  struct WalkedReversed {
    int32_t crossings, onPlaneCount, ringCornerCount;
    bool splitTried;
    std::string whichSide;  // "below" | "above" | "both"
  };
  std::vector<WalkedReversed> walkedReversedDetail;
  bool wprTrace = false;
  struct WprRing {
    std::vector<P3> ring;
    std::vector<int32_t> sides;
    std::vector<P3> below, above;
  };
  std::vector<WprRing> wprRings;
  int64_t assemblyDuplicateDart = 0, duplicateWithinFace = 0, duplicateAcrossFaces = 0;
  int64_t subjectAlreadyOverused = 0;
  bool clashTrace = false;
  struct Clash {
    std::string dart;
    int32_t mineFrom, theirsFrom, plane, planeOfOther;
    double area;
    P3 normal;
    bool mineOuter;
    int8_t theirsOuter;  // -1 = TS null, else 0 / 1
    std::vector<int32_t> mineRing, theirsRing;
    std::optional<std::string> mineVia, theirsVia;
    int32_t mineCorners, mineIds;
  };
  std::vector<Clash> clashes;
  int64_t wallKeptSuspect = 0, wallKeptOther = 0, wallClashedSuspect = 0, wallClashedOther = 0;
  int64_t uncoveredProbeIn = 0;
  int64_t dropSecondRetries = 0, dropSecondRetryFixed = 0;
  int64_t reverseSecondPlaced = 0, reverseSecondBlocked = 0;
  int64_t surplusRingsEvicted = 0;
  int64_t uncoveredProbeOut = 0;
  int64_t placedWalkOnPlane = 0, placedWalkClean = 0, dartWalkOnPlane = 0, dartWalkClean = 0;
  bool overlapTest = false;
  int64_t cutExitWalk = 0, cutExitSplit = 0, cutExitArrangement = 0, cutExitThin = 0;
  int64_t placedRings = 0, placedWeldBit = 0;
  // TS `touched: Set<string>` as a bit mask; names via touchedNames().
  uint32_t touched = 0;
  int64_t crossSnapped = 0;
  int64_t cornersPulledOnPlane = 0;
  std::vector<double> weldGaps;
  int64_t subjectFacesCovered = 0;
  int64_t finPairsDropped = 0, finFacetsDropped = 0;
  int64_t assemblyDroppedSecond = 0, assemblyDroppedSecondWhole = 0;
  int64_t arrangementPieceReversed = 0, arrangementOverlapChecked = 0, arrangementOverlapFound = 0;
  double arrangementOverlapArea = 0;
  int64_t capLeftOpen = 0, capRan = 0;
  bool capTrace = false;
  struct CapLoopCount {
    int32_t loops, openDarts;
    std::string why;
    int32_t overused, facets;
  };
  std::vector<CapLoopCount> capLoopCounts;
  struct CapGroupEntry {
    int32_t corners;
    double area;
    P3 unit;
    double offset;
  };
  std::vector<std::vector<CapGroupEntry>> capGroups;
  int64_t assemblyPinched = 0;
  int64_t overlayPlanes = 0, overlayBailed = 0, overlayRingsIn = 0, overlayRingsOut = 0;

  // C++ only: the members of the TS `touched` set, in a fixed order.
  std::vector<std::string> touchedNames() const;
};
extern SubtractStats stats;
void clearCounters();

// ── the operations ───────────────────────────────────────────────────────────────────────────────

// Keep the part of a solid on one side of a plane; `normal` points into the half space REMOVED.
std::unique_ptr<LinkedShellGraph> clipToHalfSpace(const LinkedShellGraph& solid, const P3& through,
                                                  const P3& normal);

// Why the last cutAway / subtract / union / intersect declined.
std::string whySubtractDeclined();

// Remove several solids at once. nullptr = TS null (declined; see whySubtractDeclined()).
// TS may return `keep` ITSELF: here that is a copy, unless `isKeep` is given, in which case it is
// set and nullptr is returned instead of the copy (C++ only, so a caller can skip the copy).
std::unique_ptr<LinkedShellGraph> cutAway(const LinkedShellGraph& keep,
                                          const std::vector<const LinkedShellGraph*>& tools,
                                          bool* isKeep = nullptr);

// Which of the three regular booleans. `union` is a C++ keyword, hence the underscore.
enum class SolidCombine { difference, union_, intersection };

// Everything in `keep` that is not in `remove`. Same `isKeep` contract as cutAway.
std::unique_ptr<LinkedShellGraph> subtract(const LinkedShellGraph& keep,
                                           const LinkedShellGraph& remove, bool* isKeep = nullptr);

// Everything in either solid (TS `union`). Both must be watertight.
std::unique_ptr<LinkedShellGraph> union_(const LinkedShellGraph& a, const LinkedShellGraph& b);

// Everything in both solids. A graph with zero facets is the empty set, not a refusal.
std::unique_ptr<LinkedShellGraph> intersect(const LinkedShellGraph& a, const LinkedShellGraph& b);

}  // namespace brep
