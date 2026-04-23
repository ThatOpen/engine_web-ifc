/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

// Mesh orientation repair: fixes inside-out triangles on a finished mesh.
//
// The algorithm is intentionally decoupled from IfcGeometry so it can operate
// on raw vertex/index arrays as well. It is meant to be called AFTER the
// geometry pipeline has finished (including booleans), never inside it.
//
// Two layers (see geometry-orientation-repair.md):
//   Layer 1 - Vote-based local coherence (per connected component)
//             * Internal "weld" by coordinate quantization so that triangles
//               which happen to share a spatial vertex are treated as edge
//               neighbours even if their index-level vertices are distinct
//               (which is the common case in web-ifc: every AddFace() pushes
//               3 brand new vertices).
//             * 2-colouring of the signed adjacency graph via BFS.
//             * Minority team (one triangle, one vote) is flipped.
//
//   Layer 2 - Global orientation decision per component.
//             * Signed volume (around the component centroid) when the
//               component is closed or nearly-closed (<= 5% boundary edges).
//             * AABB-center heuristic with Y-up fallback for open components.
//
// After the repair, vertex normals are regenerated from the (possibly new)
// triangle winding by area-weighted averaging over incident faces.

#pragma once

#include <vector>
#include <cstdint>

namespace webifc::geometry {

    /**
     * Quantitative signals returned by the orientation repair pass.
     *
     * - trianglesFlipped      Total triangles whose winding was reversed
     *                         (Layer 1 minority flips + Layer 2 global flips).
     * - componentsProcessed   Number of connected components detected by the
     *                         edge-based Union-Find (after internal weld).
     * - maxVoteMargin         Worst Layer-1 margin across all components.
     *                         0.0  = clean verdict (one team only)
     *                         0.5  = tied (ambiguous)
     *                         Values >= 0.05 are typically suspicious.
     * - unsatisfiedEdges      Count of manifold edges whose BFS propagation
     *                         contradicted an already-assigned team. Non-zero
     *                         means non-orientable topology (Moebius-like).
     * - layer2Decisive        True if every component's Layer-2 probe was
     *                         clearly above the near-zero threshold.
     * - confident             Convenience: maxVoteMargin < 0.05
     *                                  && unsatisfiedEdges == 0
     *                                  && layer2Decisive.
     *                         Intended for the caller to decide single-sided
     *                         vs double-sided rendering.
     */
    struct OrientationRepairResult
    {
        uint32_t trianglesFlipped     = 0;
        uint32_t componentsProcessed  = 0;
        double   maxVoteMargin        = 0.0;
        uint32_t unsatisfiedEdges     = 0;
        bool     layer2Decisive       = true;
        bool     confident            = true;
    };

    /**
     * Tunable parameters. Defaults are sensible for IFC BIM geometry.
     */
    struct OrientationRepairOptions
    {
        // Welding epsilon in model units. Vertices closer than this (per axis)
        // are considered the same topological vertex for adjacency purposes.
        // Only affects the edge map; original vertex data is preserved.
        double weldEpsilon = 1e-6;

        // Fraction of boundary edges under which the component is treated as
        // "closed" and evaluated via signed volume. 0.05 = up to 5% boundary.
        double nearlyClosedBoundaryRatio = 0.05;

        // Margin threshold above which a component is no longer "confident".
        double confidenceMarginThreshold = 0.05;

        // If true, regenerate per-vertex normals from the final winding.
        // Uses area-weighted averaging over incident faces.
        bool regenerateNormals = true;
    };

    // --- Public API --------------------------------------------------------

    /**
     * Repair orientation of a mesh stored in web-ifc's interleaved format.
     *
     * Input layout:
     *   vertexData   packed doubles, 6 per vertex: [x,y,z,nx,ny,nz, ...]
     *   indexData    flat triples, 3 per triangle: [i0,i1,i2, i0,i1,i2, ...]
     *
     * Both buffers are modified in place:
     *   - indexData: winding reversals (swap index 0 and 2 of flipped tris).
     *   - vertexData: normals regenerated if options.regenerateNormals.
     *
     * Vertex positions are NEVER modified.
     *
     * Returns quantitative confidence signals (see OrientationRepairResult).
     */
    OrientationRepairResult RepairMeshOrientation(
        std::vector<double>&   vertexData,
        std::vector<uint32_t>& indexData,
        const OrientationRepairOptions& options = OrientationRepairOptions{});

} // namespace webifc::geometry
