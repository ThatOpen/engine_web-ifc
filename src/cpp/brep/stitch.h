// stitch.h — resolve T junctions in a triangle soup. Port of stitch.ts.
#pragma once

#include <cstdint>
#include <vector>

#include "curves.h"  // PointOf

namespace brep {

// Insert straddling corners into the triangles whose edges they lie on (within `tol`), editing
// `tris` in place; up to 8 rounds while the unpaired-edge count strictly drops. Returns the number
// of insertions, 0 when nothing changed.
int32_t stitchTriangleTJunctions(std::vector<int32_t>& tris, const PointOf& pointXOf,
                                 const PointOf& pointYOf, const PointOf& pointZOf, double tol);

}  // namespace brep
