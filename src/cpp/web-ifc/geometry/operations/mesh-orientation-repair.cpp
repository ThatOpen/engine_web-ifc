/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

// Implementation of the two-layer voting-based mesh orientation repair.
// See mesh-orientation-repair.h for the public contract.

#include "mesh-orientation-repair.h"

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <deque>
#include <limits>
#include <unordered_map>
#include <vector>

namespace webifc::geometry {

namespace {

    // ------------------------------------------------------------------
    // Constants
    // ------------------------------------------------------------------

    // Interleaved layout: 6 doubles per vertex (x,y,z, nx,ny,nz).
    constexpr uint32_t STRIDE = 6;

    // Safety threshold: triangles with area below this are considered
    // degenerate and skipped for normal accumulation.
    constexpr double DEGENERATE_AREA_EPS = 1e-18;

    // Near-zero detection thresholds for Layer 2 decisiveness.
    constexpr double NEAR_ZERO_VOLUME_RATIO   = 1e-6;
    constexpr double NEAR_ZERO_AABB_DOT_RATIO = 1e-6;

    // ------------------------------------------------------------------
    // Tiny 3D vector helpers (avoid pulling in glm for this TU)
    // ------------------------------------------------------------------

    struct V3 { double x, y, z; };

    inline V3 vsub(const V3& a, const V3& b) { return {a.x-b.x, a.y-b.y, a.z-b.z}; }
    inline V3 vmul(const V3& a, double s)    { return {a.x*s,   a.y*s,   a.z*s};   }
    inline double vdot(const V3& a, const V3& b) {
        return a.x*b.x + a.y*b.y + a.z*b.z;
    }
    inline V3 vcross(const V3& a, const V3& b) {
        return { a.y*b.z - a.z*b.y,
                 a.z*b.x - a.x*b.z,
                 a.x*b.y - a.y*b.x };
    }
    inline double vlen(const V3& a) {
        return std::sqrt(a.x*a.x + a.y*a.y + a.z*a.z);
    }

    inline V3 getPos(const std::vector<double>& v, uint32_t i) {
        return { v[i*STRIDE+0], v[i*STRIDE+1], v[i*STRIDE+2] };
    }

    // ------------------------------------------------------------------
    // Union-Find (for connected components)
    // ------------------------------------------------------------------

    struct UnionFind {
        std::vector<uint32_t> parent;
        std::vector<uint32_t> rank_;

        explicit UnionFind(uint32_t n) : parent(n), rank_(n, 0) {
            for (uint32_t i = 0; i < n; ++i) parent[i] = i;
        }

        uint32_t find(uint32_t x) {
            while (parent[x] != x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        }

        void unite(uint32_t a, uint32_t b) {
            a = find(a);
            b = find(b);
            if (a == b) return;
            if (rank_[a] < rank_[b]) std::swap(a, b);
            parent[b] = a;
            if (rank_[a] == rank_[b]) ++rank_[a];
        }
    };

    // ------------------------------------------------------------------
    // Weld: map near-coincident vertices to a canonical index
    // ------------------------------------------------------------------

    struct I64Triple {
        int64_t x, y, z;
        bool operator==(const I64Triple& o) const {
            return x == o.x && y == o.y && z == o.z;
        }
    };

    struct I64TripleHash {
        size_t operator()(const I64Triple& k) const noexcept {
            size_t h = std::hash<int64_t>{}(k.x);
            h ^= std::hash<int64_t>{}(k.y) + 0x9e3779b97f4a7c15ULL + (h<<6) + (h>>2);
            h ^= std::hash<int64_t>{}(k.z) + 0x9e3779b97f4a7c15ULL + (h<<6) + (h>>2);
            return h;
        }
    };

    std::vector<uint32_t> buildWeldMap(
        const std::vector<double>& vertexData,
        double                     epsilon)
    {
        const uint32_t vcount = static_cast<uint32_t>(vertexData.size() / STRIDE);
        std::vector<uint32_t> welded(vcount, 0);
        if (vcount == 0) return welded;

        const double eps  = (epsilon > 0.0) ? epsilon : 1e-6;
        const double invE = 1.0 / eps;

        std::unordered_map<I64Triple, uint32_t, I64TripleHash> table;
        table.reserve(vcount);

        uint32_t nextCanon = 0;
        for (uint32_t i = 0; i < vcount; ++i) {
            const V3 p = getPos(vertexData, i);
            I64Triple key{
                static_cast<int64_t>(std::llround(p.x * invE)),
                static_cast<int64_t>(std::llround(p.y * invE)),
                static_cast<int64_t>(std::llround(p.z * invE))
            };
            auto it = table.find(key);
            if (it == table.end()) {
                welded[i] = nextCanon;
                table.emplace(key, nextCanon);
                ++nextCanon;
            } else {
                welded[i] = it->second;
            }
        }
        return welded;
    }

    // ------------------------------------------------------------------
    // Edge map built on welded vertex ids
    // ------------------------------------------------------------------

    struct HalfEdge {
        uint32_t tri;
        bool     forward;
    };

    inline uint64_t edgeKey(uint32_t a, uint32_t b) {
        if (a < b) return (static_cast<uint64_t>(a) << 32) | b;
        else       return (static_cast<uint64_t>(b) << 32) | a;
    }

    // ------------------------------------------------------------------
    // Flip a triangle's winding in the index buffer.
    // Matches IfcGeometry::ReverseFace: swap indices 0 and 2 of the tri.
    // ------------------------------------------------------------------
    inline void flipTri(std::vector<uint32_t>& indexData, uint32_t ti) {
        std::swap(indexData[ti*3 + 0], indexData[ti*3 + 2]);
    }

    // ------------------------------------------------------------------
    // Regenerate per-vertex normals by area-weighted averaging.
    // Must run AFTER all flips have been applied.
    // ------------------------------------------------------------------
    void regenerateNormals(
        std::vector<double>&         vertexData,
        const std::vector<uint32_t>& indexData)
    {
        const uint32_t vcount = static_cast<uint32_t>(vertexData.size() / STRIDE);
        const uint32_t tcount = static_cast<uint32_t>(indexData.size() / 3);

        for (uint32_t i = 0; i < vcount; ++i) {
            vertexData[i*STRIDE + 3] = 0.0;
            vertexData[i*STRIDE + 4] = 0.0;
            vertexData[i*STRIDE + 5] = 0.0;
        }

        for (uint32_t t = 0; t < tcount; ++t) {
            const uint32_t i0 = indexData[t*3 + 0];
            const uint32_t i1 = indexData[t*3 + 1];
            const uint32_t i2 = indexData[t*3 + 2];
            if (i0 >= vcount || i1 >= vcount || i2 >= vcount) continue;

            const V3 a = getPos(vertexData, i0);
            const V3 b = getPos(vertexData, i1);
            const V3 c = getPos(vertexData, i2);
            const V3 n = vcross(vsub(b, a), vsub(c, a));
            const double len = vlen(n);
            if (len <= DEGENERATE_AREA_EPS) continue;

            // |n| already encodes 2*area -> area weighting for free.
            vertexData[i0*STRIDE + 3] += n.x;
            vertexData[i0*STRIDE + 4] += n.y;
            vertexData[i0*STRIDE + 5] += n.z;
            vertexData[i1*STRIDE + 3] += n.x;
            vertexData[i1*STRIDE + 4] += n.y;
            vertexData[i1*STRIDE + 5] += n.z;
            vertexData[i2*STRIDE + 3] += n.x;
            vertexData[i2*STRIDE + 4] += n.y;
            vertexData[i2*STRIDE + 5] += n.z;
        }

        for (uint32_t i = 0; i < vcount; ++i) {
            const V3 n{ vertexData[i*STRIDE + 3],
                        vertexData[i*STRIDE + 4],
                        vertexData[i*STRIDE + 5] };
            const double len = vlen(n);
            if (len > 0.0) {
                const double inv = 1.0 / len;
                vertexData[i*STRIDE + 3] = n.x * inv;
                vertexData[i*STRIDE + 4] = n.y * inv;
                vertexData[i*STRIDE + 5] = n.z * inv;
            }
        }
    }

} // anonymous namespace


// ----------------------------------------------------------------------
// Public entry point
// ----------------------------------------------------------------------
OrientationRepairResult RepairMeshOrientation(
    std::vector<double>&            vertexData,
    std::vector<uint32_t>&          indexData,
    const OrientationRepairOptions& options)
{
    OrientationRepairResult result;

    const uint32_t tcount = static_cast<uint32_t>(indexData.size() / 3);
    const uint32_t vcount = static_cast<uint32_t>(vertexData.size() / STRIDE);
    if (tcount == 0 || vcount == 0) {
        return result;
    }

    // --- Step 1: weld spatial duplicates ------------------------------
    const std::vector<uint32_t> welded = buildWeldMap(vertexData, options.weldEpsilon);

    // --- Step 2: build the edge map on welded ids ---------------------
    std::unordered_map<uint64_t, std::vector<HalfEdge>> edgeMap;
    edgeMap.reserve(tcount * 3);

    for (uint32_t t = 0; t < tcount; ++t) {
        const uint32_t raw[3] = {
            indexData[t*3 + 0],
            indexData[t*3 + 1],
            indexData[t*3 + 2]
        };
        if (raw[0] >= vcount || raw[1] >= vcount || raw[2] >= vcount) continue;

        const uint32_t w[3] = { welded[raw[0]], welded[raw[1]], welded[raw[2]] };

        // Skip triangles that collapse under welding.
        if (w[0] == w[1] || w[1] == w[2] || w[0] == w[2]) continue;

        for (int e = 0; e < 3; ++e) {
            const uint32_t u = w[e];
            const uint32_t v = w[(e + 1) % 3];
            const uint64_t key = edgeKey(u, v);
            const bool forward = (u < v);
            edgeMap[key].push_back(HalfEdge{ t, forward });
        }
    }

    // --- Step 3: adjacency (manifold edges only) + Union-Find ---------
    struct Adj { uint32_t nb; bool agree; };
    std::vector<std::vector<Adj>> adjacency(tcount);
    UnionFind uf(tcount);

    for (const auto& kv : edgeMap) {
        const auto& halves = kv.second;
        if (halves.size() != 2) continue; // boundary (1) or non-manifold (>=3)
        const uint32_t t0 = halves[0].tri;
        const uint32_t t1 = halves[1].tri;
        const bool     f0 = halves[0].forward;
        const bool     f1 = halves[1].forward;
        const bool agree = (f0 != f1); // opposite directions -> coherent
        uf.unite(t0, t1);
        adjacency[t0].push_back(Adj{ t1, agree });
        adjacency[t1].push_back(Adj{ t0, agree });
    }

    // --- Step 4: Layer 1 -- 2-color each component via BFS, flip minority.
    constexpr int8_t UNSET = -1;
    std::vector<int8_t> team(tcount, UNSET);

    std::unordered_map<uint32_t, std::vector<uint32_t>> components;
    components.reserve(tcount / 8 + 1);
    for (uint32_t t = 0; t < tcount; ++t) {
        components[uf.find(t)].push_back(t);
    }
    result.componentsProcessed = static_cast<uint32_t>(components.size());

    uint32_t totalFlipped     = 0;
    uint32_t totalUnsatisfied = 0;
    double   worstMargin      = 0.0;

    for (auto& kv : components) {
        const std::vector<uint32_t>& compTris = kv.second;
        if (compTris.empty()) continue;

        // BFS 2-coloring seeded from the first triangle of the component.
        std::deque<uint32_t> queue;
        const uint32_t seed = compTris.front();
        team[seed] = 0;
        queue.push_back(seed);

        while (!queue.empty()) {
            const uint32_t cur = queue.front();
            queue.pop_front();
            const int8_t curTeam = team[cur];
            for (const Adj& a : adjacency[cur]) {
                const int8_t expected = a.agree ? curTeam : (1 - curTeam);
                if (team[a.nb] == UNSET) {
                    team[a.nb] = expected;
                    queue.push_back(a.nb);
                } else if (team[a.nb] != expected) {
                    ++totalUnsatisfied; // Moebius-like contradiction
                }
            }
        }

        // Tally votes. Any triangle still UNSET (lone island in the UF
        // component without manifold adjacency) is assigned to team 0.
        uint32_t count0 = 0;
        uint32_t count1 = 0;
        for (uint32_t ti : compTris) {
            if (team[ti] == UNSET) team[ti] = 0;
            if (team[ti] == 0) ++count0; else ++count1;
        }
        const uint32_t total    = count0 + count1;
        const uint32_t minority = (count0 <= count1) ? 0 : 1;
        const uint32_t minCount = std::min(count0, count1);
        const double   margin   = (total > 0)
                                    ? (static_cast<double>(minCount) / total)
                                    : 0.0;
        if (margin > worstMargin) worstMargin = margin;

        if (minCount > 0) {
            for (uint32_t ti : compTris) {
                if (team[ti] == static_cast<int8_t>(minority)) {
                    flipTri(indexData, ti);
                    ++totalFlipped;
                }
            }
        }
    }

    result.maxVoteMargin    = worstMargin;
    result.unsatisfiedEdges = totalUnsatisfied;

    // --- Step 5: Layer 2 -- decide outward/inward per component. ------
    bool everyLayer2Decisive = true;

    for (auto& kv : components) {
        const std::vector<uint32_t>& compTris = kv.second;
        if (compTris.empty()) continue;

        // Count boundary edges for THIS component.
        uint32_t boundaryCount = 0;
        uint32_t totalHalf     = 0;
        for (uint32_t ti : compTris) {
            const uint32_t raw[3] = {
                indexData[ti*3 + 0],
                indexData[ti*3 + 1],
                indexData[ti*3 + 2]
            };
            if (raw[0] >= vcount || raw[1] >= vcount || raw[2] >= vcount) continue;
            const uint32_t w[3] = { welded[raw[0]], welded[raw[1]], welded[raw[2]] };
            if (w[0] == w[1] || w[1] == w[2] || w[0] == w[2]) continue;

            for (int e = 0; e < 3; ++e) {
                const uint32_t u = w[e];
                const uint32_t v = w[(e + 1) % 3];
                ++totalHalf;
                auto it = edgeMap.find(edgeKey(u, v));
                if (it == edgeMap.end() || it->second.size() != 2) {
                    ++boundaryCount;
                }
            }
        }

        const bool nearlyClosed =
            (totalHalf > 0) &&
            (static_cast<double>(boundaryCount) <=
             options.nearlyClosedBoundaryRatio * static_cast<double>(totalHalf));

        // Component AABB.
        V3 bbMin{  std::numeric_limits<double>::infinity(),
                   std::numeric_limits<double>::infinity(),
                   std::numeric_limits<double>::infinity() };
        V3 bbMax{ -std::numeric_limits<double>::infinity(),
                  -std::numeric_limits<double>::infinity(),
                  -std::numeric_limits<double>::infinity() };
        for (uint32_t ti : compTris) {
            for (int e = 0; e < 3; ++e) {
                const uint32_t vi = indexData[ti*3 + e];
                if (vi >= vcount) continue;
                const V3 p = getPos(vertexData, vi);
                if (p.x < bbMin.x) bbMin.x = p.x;
                if (p.y < bbMin.y) bbMin.y = p.y;
                if (p.z < bbMin.z) bbMin.z = p.z;
                if (p.x > bbMax.x) bbMax.x = p.x;
                if (p.y > bbMax.y) bbMax.y = p.y;
                if (p.z > bbMax.z) bbMax.z = p.z;
            }
        }
        const V3 bbCenter{ 0.5 * (bbMin.x + bbMax.x),
                           0.5 * (bbMin.y + bbMax.y),
                           0.5 * (bbMin.z + bbMax.z) };
        const V3 bbExtent{ bbMax.x - bbMin.x,
                           bbMax.y - bbMin.y,
                           bbMax.z - bbMin.z };

        bool shouldFlipAll = false;

        if (nearlyClosed) {
            // --- Strategy A: signed volume around the AABB center.
            double signedVol = 0.0;
            for (uint32_t ti : compTris) {
                const uint32_t i0 = indexData[ti*3 + 0];
                const uint32_t i1 = indexData[ti*3 + 1];
                const uint32_t i2 = indexData[ti*3 + 2];
                if (i0 >= vcount || i1 >= vcount || i2 >= vcount) continue;
                const V3 a = vsub(getPos(vertexData, i0), bbCenter);
                const V3 b = vsub(getPos(vertexData, i1), bbCenter);
                const V3 c = vsub(getPos(vertexData, i2), bbCenter);
                signedVol += vdot(a, vcross(b, c));
            }

            const double bboxVol = bbExtent.x * bbExtent.y * bbExtent.z;
            const double nearZero = NEAR_ZERO_VOLUME_RATIO * std::max(bboxVol, 1.0);

            if (std::fabs(signedVol) <= nearZero) {
                everyLayer2Decisive = false; // flat/degenerate shell
            } else if (signedVol < 0.0) {
                shouldFlipAll = true;
            }
        } else {
            // --- Strategy B: AABB-center heuristic for open surfaces.
            uint32_t bestTri  = compTris.front();
            double   bestDist = -1.0;
            for (uint32_t ti : compTris) {
                const uint32_t i0 = indexData[ti*3 + 0];
                const uint32_t i1 = indexData[ti*3 + 1];
                const uint32_t i2 = indexData[ti*3 + 2];
                if (i0 >= vcount || i1 >= vcount || i2 >= vcount) continue;
                const V3 a = getPos(vertexData, i0);
                const V3 b = getPos(vertexData, i1);
                const V3 c = getPos(vertexData, i2);
                const V3 cn{ (a.x + b.x + c.x) / 3.0,
                             (a.y + b.y + c.y) / 3.0,
                             (a.z + b.z + c.z) / 3.0 };
                const V3 d = vsub(cn, bbCenter);
                const double d2 = d.x*d.x + d.y*d.y + d.z*d.z;
                if (d2 > bestDist) {
                    bestDist = d2;
                    bestTri  = ti;
                }
            }

            const uint32_t i0 = indexData[bestTri*3 + 0];
            const uint32_t i1 = indexData[bestTri*3 + 1];
            const uint32_t i2 = indexData[bestTri*3 + 2];
            const V3 a  = getPos(vertexData, i0);
            const V3 b  = getPos(vertexData, i1);
            const V3 c  = getPos(vertexData, i2);
            const V3 n  = vcross(vsub(b, a), vsub(c, a));
            const V3 cn{ (a.x + b.x + c.x) / 3.0,
                         (a.y + b.y + c.y) / 3.0,
                         (a.z + b.z + c.z) / 3.0 };
            const V3 outward = vsub(cn, bbCenter);
            const double dotVal = vdot(n, outward);

            const double nLen       = vlen(n);
            const double outwardLen = vlen(outward);
            const double scale      = std::max(nLen * outwardLen, 1.0);
            const double nearZeroDot = NEAR_ZERO_AABB_DOT_RATIO * scale;

            if (std::fabs(dotVal) <= nearZeroDot) {
                // Ambiguous -> Y-up fallback.
                double bestY   = -std::numeric_limits<double>::infinity();
                uint32_t topTri = compTris.front();
                for (uint32_t ti : compTris) {
                    for (int e = 0; e < 3; ++e) {
                        const uint32_t vi = indexData[ti*3 + e];
                        if (vi >= vcount) continue;
                        const double y = vertexData[vi*STRIDE + 1];
                        if (y > bestY) {
                            bestY  = y;
                            topTri = ti;
                        }
                    }
                }
                const uint32_t j0 = indexData[topTri*3 + 0];
                const uint32_t j1 = indexData[topTri*3 + 1];
                const uint32_t j2 = indexData[topTri*3 + 2];
                const V3 ta = getPos(vertexData, j0);
                const V3 tb = getPos(vertexData, j1);
                const V3 tc = getPos(vertexData, j2);
                const V3 tn = vcross(vsub(tb, ta), vsub(tc, ta));

                const double tnLen = vlen(tn);
                const double yEps  = 1e-9 * std::max(tnLen, 1.0);
                if (tn.y < -yEps) {
                    shouldFlipAll = true;
                } else if (std::fabs(tn.y) <= yEps) {
                    if (tn.x < -yEps) {
                        shouldFlipAll = true;
                    } else if (std::fabs(tn.x) <= yEps) {
                        everyLayer2Decisive = false; // truly ambiguous
                    }
                }
            } else if (dotVal < 0.0) {
                shouldFlipAll = true;
            }
        }

        if (shouldFlipAll) {
            for (uint32_t ti : compTris) {
                flipTri(indexData, ti);
                ++totalFlipped;
            }
        }
    }

    result.trianglesFlipped = totalFlipped;
    result.layer2Decisive   = everyLayer2Decisive;
    result.confident =
        (worstMargin < options.confidenceMarginThreshold) &&
        (totalUnsatisfied == 0) &&
        everyLayer2Decisive;

    // --- Step 6: regenerate vertex normals from the final winding. ----
    if (options.regenerateNormals) {
        regenerateNormals(vertexData, indexData);
    }

    return result;
}

} // namespace webifc::geometry
