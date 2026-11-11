// shell.h — assemble a solid from faces the file states outright (stitchUpShell and friends:
// voids carved into simple faces, opposite-face cancellation, per-plane winding overlay, outward
// orientation). Port of shell.ts.
#pragma once

#include <cstdint>
#include <memory>
#include <optional>
#include <vector>

#include "curves.h"    // P3
#include "topology.h"  // LinkedShellGraph

namespace brep {

// LinkedShellGraph comes from topology.h.

// What the caller needs to know beyond the solid itself.
struct AssembledShell {
  std::unique_ptr<LinkedShellGraph> graph;
  int32_t dropped = 0;    // declared faces that produced no facet
  int32_t holed = 0;      // faces whose inner bounds could not be carved (left unsplit)
  bool flipped = false;   // closed but inward: every facet was reversed
  int32_t cancelled = 0;  // opposite-wound coincident faces removed
};

// Split a face with any number of voids into simple faces; nullopt = TS null (cannot bridge).
std::optional<std::vector<std::vector<P3>>> carvePanelVoids(const std::vector<P3>& outer,
                                                            const std::vector<std::vector<P3>>& voids,
                                                            int32_t depth = 0);

// Assemble facets (rings of positions, optional voids per ring) into a sealed graph.
// holesPerRing may be shorter than rings (missing entries = no voids).
AssembledShell stitchUpShell(const std::vector<std::vector<P3>>& rings,
                             const std::vector<std::vector<std::vector<P3>>>& holesPerRing = {});

// Knobs (module-level state in TS).
void setCancelOppositeFaces(bool on);  // default true
void setDropFlatRings(bool on);        // default false
void setShellOverlay(bool on);         // default false
void setShellEvictSurplus(bool on);    // default false
void setFlattenFaces(bool on);         // default false
void setHealReveals(bool on);          // default false

// Counters (TS `shellStats`, mutable module object).
struct ShellStats {
  int64_t oppositeFacesCancelled = 0;
  int64_t flatRingsDropped = 0;
  int64_t overlayGroups = 0;
  int64_t overlayDeclined = 0;
  int64_t overlayFacesIn = 0;
  int64_t overlayFacesOut = 0;
  int64_t surplusFacesEvicted = 0;
};
extern ShellStats shellStats;

}  // namespace brep
