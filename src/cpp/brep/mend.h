// mend.h — last-chance repair of a nearly closed triangle mesh. Port of mend.ts.
#pragma once

#include <optional>
#include <string>

#include "build.h"  // TriangleBatch

namespace brep {

struct MendResult {
  // The mended mesh; nullopt = the input handed back as it came (TS returns the same object).
  std::optional<TriangleBatch> mesh;
  // What was done, or nullopt when the mesh was left as it came.
  std::optional<std::string> mended;
  // Why an open mesh was left as it came, when it was.
  std::optional<std::string> refused;
};

// Merge corners within `tolerance`, drop degenerate and doubled triangles, fill each planar ring of
// unpaired edges; all-or-nothing, and fills limited to `maxFilledShare` of the area.
MendResult mendMesh(const TriangleBatch& input, double tolerance, double maxFilledShare = 0.01);

}  // namespace brep
