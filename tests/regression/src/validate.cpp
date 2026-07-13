/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// validate.cpp — intrinsic geometry validators for web-ifc.
//
// Unlike fingerprint.cpp (which is *referential*: it only says "this differs from
// the snapshot"), this tool is *intrinsic*: it judges whether a mesh is valid on its
// own terms, with no golden file and no reference build. That lets it answer the
// question a fingerprint diff cannot — which of two builds is BETTER.
//
// Phase-1 validators implemented here (all operate on the triangle/index buffers):
//   V7  hard invalidity  — NaN/Inf sweep over positions
//   V13 topology         — naked (boundary) edges, watertightness
//   V15 topology         — non-manifold edges, duplicate & degenerate triangles
//   V14 topology         — winding consistency + signed volume sign
//   +   connected-component count (boolean-shattering signal)
//
// Emits one JSON record per element (see tests/regression/README.md for the schema).
// Tiers are ordered: a tier-1 (coverage) loss is never offset by a tier-3 gain.
//
// Two facts about web-ifc geometry that this code depends on, both verified against
// the v0.0.78 source rather than assumed:
//
//  1. Vertices are UNSHARED. Geometry::AddFace(dvec3,dvec3,dvec3) calls AddPoint()
//     three times (bim-geometry/geometry.cpp:80-82), so every triangle owns three
//     fresh vertices and indexData is effectively 0,1,2,3,4,5... Computing edge
//     adjacency on raw indices would therefore report EVERY edge as naked. We must
//     weld by position first. This is the single most important detail in the file.
//
//  2. Positions are DOUBLE natively. bimGeometry::Geometry stores both fvertexData
//     (float32, what GetVertexData() hands to WASM) and vertexData (float64, what
//     GetPoint() returns). Linking natively we read the doubles, so we are not stuck
//     with the float32 epsilon floor the WASM-facing path imposes.

#include <cstdio>
#include <cstdint>
#include <cstring>
#include <cmath>
#include <string>
#include <vector>
#include <array>
#include <map>
#include <unordered_map>
#include <algorithm>
#include <fstream>
#include <chrono>
#include <limits>

#include <glm/glm.hpp>

#include "../../../src/cpp/web-ifc/parsing/IfcLoader.h"
#include "../../../src/cpp/web-ifc/cache/IfcCache.h"
#include "../../../src/cpp/web-ifc/schema/IfcSchemaManager.h"
#include "../../../src/cpp/web-ifc/schema/ifc-schema.h"
#include "../../../src/cpp/web-ifc/geometry/IfcGeometryProcessor.h"

using namespace webifc;

// ---------------------------------------------------------------------------
// Vertex welding
// ---------------------------------------------------------------------------
// Tolerance is relative to the geometry's own size, not absolute. An absolute
// epsilon is exactly the bug behind issues #751 / #1014 / #1665 (a 5mm sphere
// collapses while a 10mm one survives; a half-space distance hardcoded to "1"
// means 1m in a millimetre model). A validator that repeated that mistake would
// silently mis-weld small elements and invent naked edges in them.
struct WeldKey
{
    int64_t x, y, z;
    bool operator<(const WeldKey &o) const
    {
        if (x != o.x) return x < o.x;
        if (y != o.y) return y < o.y;
        return z < o.z;
    }
};

static inline WeldKey MakeWeldKey(const glm::dvec3 &p, double eps)
{
    return WeldKey{
        (int64_t)std::llround(p.x / eps),
        (int64_t)std::llround(p.y / eps),
        (int64_t)std::llround(p.z / eps)};
}

// An undirected edge between two welded vertex ids.
struct EdgeKey
{
    uint32_t a, b;
    bool operator<(const EdgeKey &o) const
    {
        if (a != o.a) return a < o.a;
        return b < o.b;
    }
};

static inline EdgeKey MakeEdgeKey(uint32_t a, uint32_t b)
{
    return (a < b) ? EdgeKey{a, b} : EdgeKey{b, a};
}

// Union-find, for connected-component counting. A wall that arrives as 47 pieces
// is a boolean that shattered (§4 pattern: component explosion).
struct DisjointSet
{
    std::vector<uint32_t> parent;
    void Init(size_t n)
    {
        parent.resize(n);
        for (size_t i = 0; i < n; ++i) parent[i] = (uint32_t)i;
    }
    uint32_t Find(uint32_t x)
    {
        while (parent[x] != x)
        {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
    void Union(uint32_t a, uint32_t b)
    {
        uint32_t ra = Find(a), rb = Find(b);
        if (ra != rb) parent[ra] = rb;
    }
};

// ---------------------------------------------------------------------------
// Per-element validation result
// ---------------------------------------------------------------------------
struct ElementResult
{
    uint32_t expressID = 0;
    uint32_t ifcType = 0;
    std::string ifcTypeName;

    uint64_t triangleCount = 0;
    uint64_t vertexCount = 0;      // raw, pre-weld
    uint64_t weldedVertexCount = 0;

    // V7 — hard invalidity
    uint64_t nanInfVertices = 0;

    // V13 / V15 — topology
    uint64_t nakedEdges = 0;          // edge used by exactly 1 face
    uint64_t nonManifoldEdges = 0;    // edge used by >2 faces
    uint64_t degenerateTriangles = 0; // zero area / collinear
    uint64_t duplicateTriangles = 0;  // same welded vertex triple
    uint64_t trisWithMultipleNakedEdges = 0; // dangling slivers (the user's heuristic)

    // V14 — winding / orientation
    bool     windingConsistent = true;  // no edge traversed the same direction twice
    double   signedVolume = 0.0;
    int      signedVolumeSign = 0;

    // shape metrics
    double   surfaceArea = 0.0;
    glm::dvec3 bboxMin{0, 0, 0};
    glm::dvec3 bboxMax{0, 0, 0};

    uint32_t componentCount = 0;

    long long durationMs = 0;

    bool watertight() const { return nakedEdges == 0 && nonManifoldEdges == 0; }
};

// ---------------------------------------------------------------------------
// The core: validate one element's geometry
// ---------------------------------------------------------------------------
static void ValidateGeometry(const geometry::IfcGeometry &geom, ElementResult &r)
{
    const uint32_t numFaces = geom.numFaces;
    const uint32_t numPoints = geom.numPoints;
    if (numFaces == 0) return;

    r.triangleCount += numFaces;
    r.vertexCount += numPoints;

    // --- pass 1: bbox + NaN/Inf sweep (V7) --------------------------------
    // Do this before welding: a NaN coordinate must not be allowed to poison the
    // weld grid (llround(NaN) is UB-adjacent garbage and would corrupt topology).
    glm::dvec3 lo(std::numeric_limits<double>::max());
    glm::dvec3 hi(std::numeric_limits<double>::lowest());
    bool anyFinite = false;

    for (uint32_t i = 0; i < numPoints; ++i)
    {
        glm::dvec3 p = geom.GetPoint(i);
        if (!std::isfinite(p.x) || !std::isfinite(p.y) || !std::isfinite(p.z))
        {
            r.nanInfVertices++;
            continue;
        }
        lo = glm::min(lo, p);
        hi = glm::max(hi, p);
        anyFinite = true;
    }

    if (!anyFinite)
    {
        // Every vertex is NaN/Inf. Topology is meaningless; V7 already flagged it.
        return;
    }

    r.bboxMin = glm::min(r.bboxMin, lo);
    r.bboxMax = glm::max(r.bboxMax, hi);

    // Scale-relative weld tolerance (see WeldKey comment).
    const double diag = glm::length(hi - lo);
    const double eps = std::max(1e-12, diag * 1e-7);

    // --- pass 2: weld vertices by position --------------------------------
    std::map<WeldKey, uint32_t> weldMap;
    std::vector<uint32_t> remap(numPoints, UINT32_MAX);
    std::vector<glm::dvec3> welded;
    welded.reserve(numPoints);

    for (uint32_t i = 0; i < numPoints; ++i)
    {
        glm::dvec3 p = geom.GetPoint(i);
        if (!std::isfinite(p.x) || !std::isfinite(p.y) || !std::isfinite(p.z)) continue;

        WeldKey k = MakeWeldKey(p, eps);
        auto it = weldMap.find(k);
        if (it == weldMap.end())
        {
            uint32_t id = (uint32_t)welded.size();
            weldMap.emplace(k, id);
            welded.push_back(p);
            remap[i] = id;
        }
        else
        {
            remap[i] = it->second;
        }
    }
    r.weldedVertexCount += welded.size();

    // --- pass 3: per-triangle checks + edge adjacency ----------------------
    // Half-edge counting: for a closed, consistently-wound manifold, every
    // undirected edge is used exactly twice, once in each direction.
    std::map<EdgeKey, uint32_t> edgeUse;        // undirected use count -> naked / non-manifold
    std::map<std::pair<uint32_t, uint32_t>, uint32_t> directedUse; // winding consistency
    std::map<std::array<uint32_t, 3>, uint32_t> triSeen;           // duplicate detection

    DisjointSet ds;
    ds.Init(welded.size());

    struct TriRef { uint32_t a, b, c; };
    std::vector<TriRef> tris;
    tris.reserve(numFaces);

    for (uint32_t f = 0; f < numFaces; ++f)
    {
        bimGeometry::Face face = geom.GetFace(f);

        // Face stores indices as signed int. Guard both ends: a negative index would
        // sail through an unsigned-only bounds check by wrapping to a huge value.
        if (face.i0 < 0 || face.i1 < 0 || face.i2 < 0) continue;
        if ((uint32_t)face.i0 >= numPoints ||
            (uint32_t)face.i1 >= numPoints ||
            (uint32_t)face.i2 >= numPoints) continue;

        uint32_t a = remap[face.i0], b = remap[face.i1], c = remap[face.i2];
        if (a == UINT32_MAX || b == UINT32_MAX || c == UINT32_MAX) continue;

        const glm::dvec3 &pa = welded[a], &pb = welded[b], &pc = welded[c];

        // degenerate: a triangle whose two edges are collinear has zero cross product.
        // Threshold is relative to the element's own size — same reasoning as the
        // weld epsilon; an absolute area cutoff would misjudge small-but-valid parts.
        glm::dvec3 cross = glm::cross(pb - pa, pc - pa);
        double area2 = glm::length(cross);
        double areaTol = std::max(1e-24, diag * diag * 1e-14);

        if (a == b || b == c || a == c || area2 < areaTol)
        {
            r.degenerateTriangles++;
            continue; // a degenerate triangle contributes no meaningful topology
        }

        r.surfaceArea += 0.5 * area2;

        // Signed volume via the divergence theorem (tetrahedron to origin).
        // For a closed, outward-wound solid this sums to the enclosed volume; a
        // negative total means the winding is inverted. Catches §3-P3 / §6-P9.
        r.signedVolume += glm::dot(pa, glm::cross(pb, pc)) / 6.0;

        // duplicate triangle: same three welded vertices, in any rotation/reflection
        std::array<uint32_t, 3> key{a, b, c};
        std::sort(key.begin(), key.end());
        if (++triSeen[key] > 1) r.duplicateTriangles++;

        tris.push_back({a, b, c});

        edgeUse[MakeEdgeKey(a, b)]++;
        edgeUse[MakeEdgeKey(b, c)]++;
        edgeUse[MakeEdgeKey(c, a)]++;

        directedUse[{a, b}]++;
        directedUse[{b, c}]++;
        directedUse[{c, a}]++;

        ds.Union(a, b);
        ds.Union(b, c);
    }

    // --- pass 4: edge classification (V13 / V15) --------------------------
    for (const auto &[edge, count] : edgeUse)
    {
        if (count == 1) r.nakedEdges++;
        else if (count > 2) r.nonManifoldEdges++;
    }

    // Winding consistency: if a directed half-edge (a->b) appears more than once,
    // two adjacent faces traverse the shared edge the same way, i.e. one of them is
    // wound backwards relative to its neighbour.
    for (const auto &[dir, count] : directedUse)
    {
        if (count > 1) { r.windingConsistent = false; break; }
    }

    // --- pass 5: dangling slivers (the naked-edge heuristic) --------------
    // A triangle with >1 naked edge is barely attached to the mesh — a strong
    // wrongness signal, and cheaper/more specific than a raw naked-edge count.
    for (const auto &t : tris)
    {
        int naked = 0;
        if (edgeUse[MakeEdgeKey(t.a, t.b)] == 1) naked++;
        if (edgeUse[MakeEdgeKey(t.b, t.c)] == 1) naked++;
        if (edgeUse[MakeEdgeKey(t.c, t.a)] == 1) naked++;
        if (naked > 1) r.trisWithMultipleNakedEdges++;
    }

    // --- pass 6: connected components -------------------------------------
    std::map<uint32_t, uint32_t> roots;
    for (const auto &t : tris) roots[ds.Find(t.a)]++;
    r.componentCount += (uint32_t)roots.size();
}

// ---------------------------------------------------------------------------
// JSON emission
// ---------------------------------------------------------------------------
static void EmitJson(FILE *out, const std::vector<ElementResult> &rows,
                     const std::string &modelPath, const std::string &schemaName)
{
    uint64_t tTri = 0, tNaked = 0, tNonMan = 0, tDup = 0, tDegen = 0, tNaN = 0, tSliver = 0;
    uint64_t nInverted = 0, nBadWinding = 0, nNotWatertight = 0, nShattered = 0;

    for (const auto &r : rows)
    {
        tTri += r.triangleCount;
        tNaked += r.nakedEdges;
        tNonMan += r.nonManifoldEdges;
        tDup += r.duplicateTriangles;
        tDegen += r.degenerateTriangles;
        tNaN += r.nanInfVertices;
        tSliver += r.trisWithMultipleNakedEdges;
        if (r.signedVolumeSign < 0) nInverted++;
        if (!r.windingConsistent) nBadWinding++;
        if (!r.watertight()) nNotWatertight++;
        if (r.componentCount > 1) nShattered++;
    }

    fprintf(out, "{\n");
    fprintf(out, "  \"meta\": {\n");
    fprintf(out, "    \"model\": \"%s\",\n", modelPath.c_str());
    fprintf(out, "    \"schema\": \"%s\",\n", schemaName.c_str());
    fprintf(out, "    \"tool\": \"validate\",\n");
    fprintf(out, "    \"validators\": [\"V7_nanInf\",\"V13_watertight\",\"V14_winding\",\"V15_duplicateNonManifold\"]\n");
    fprintf(out, "  },\n");

    fprintf(out, "  \"summary\": {\n");
    fprintf(out, "    \"elementsWithGeometry\": %zu,\n", rows.size());
    fprintf(out, "    \"totalTriangles\": %llu,\n", (unsigned long long)tTri);
    fprintf(out, "    \"tier2_hardInvalidity\": { \"nanInfVertices\": %llu },\n",
            (unsigned long long)tNaN);
    fprintf(out, "    \"tier3_topology\": {\n");
    fprintf(out, "      \"nakedEdges\": %llu,\n", (unsigned long long)tNaked);
    fprintf(out, "      \"nonManifoldEdges\": %llu,\n", (unsigned long long)tNonMan);
    fprintf(out, "      \"duplicateTriangles\": %llu,\n", (unsigned long long)tDup);
    fprintf(out, "      \"degenerateTriangles\": %llu,\n", (unsigned long long)tDegen);
    fprintf(out, "      \"trianglesWithMultipleNakedEdges\": %llu,\n", (unsigned long long)tSliver);
    fprintf(out, "      \"elementsNotWatertight\": %llu,\n", (unsigned long long)nNotWatertight);
    fprintf(out, "      \"elementsInvertedVolume\": %llu,\n", (unsigned long long)nInverted);
    fprintf(out, "      \"elementsInconsistentWinding\": %llu,\n", (unsigned long long)nBadWinding);
    fprintf(out, "      \"elementsShattered\": %llu\n", (unsigned long long)nShattered);
    fprintf(out, "    }\n");
    fprintf(out, "  },\n");

    fprintf(out, "  \"elements\": [\n");
    for (size_t i = 0; i < rows.size(); ++i)
    {
        const auto &r = rows[i];
        fprintf(out, "    {");
        fprintf(out, "\"expressID\": %u, ", r.expressID);
        fprintf(out, "\"ifcType\": \"%s\", ", r.ifcTypeName.c_str());
        fprintf(out, "\"triangleCount\": %llu, ", (unsigned long long)r.triangleCount);
        fprintf(out, "\"vertexCount\": %llu, ", (unsigned long long)r.vertexCount);
        fprintf(out, "\"weldedVertexCount\": %llu, ", (unsigned long long)r.weldedVertexCount);
        fprintf(out, "\"nanInfVertices\": %llu, ", (unsigned long long)r.nanInfVertices);
        fprintf(out, "\"nakedEdges\": %llu, ", (unsigned long long)r.nakedEdges);
        fprintf(out, "\"nonManifoldEdges\": %llu, ", (unsigned long long)r.nonManifoldEdges);
        fprintf(out, "\"degenerateTriangles\": %llu, ", (unsigned long long)r.degenerateTriangles);
        fprintf(out, "\"duplicateTriangles\": %llu, ", (unsigned long long)r.duplicateTriangles);
        fprintf(out, "\"trisWithMultipleNakedEdges\": %llu, ", (unsigned long long)r.trisWithMultipleNakedEdges);
        fprintf(out, "\"watertight\": %s, ", r.watertight() ? "true" : "false");
        fprintf(out, "\"windingConsistent\": %s, ", r.windingConsistent ? "true" : "false");
        fprintf(out, "\"signedVolume\": %.6f, ", r.signedVolume);
        fprintf(out, "\"signedVolumeSign\": %d, ", r.signedVolumeSign);
        fprintf(out, "\"surfaceArea\": %.6f, ", r.surfaceArea);
        fprintf(out, "\"componentCount\": %u, ", r.componentCount);
        fprintf(out, "\"durationMs\": %lld", r.durationMs);
        fprintf(out, "}%s\n", (i + 1 < rows.size()) ? "," : "");
    }
    fprintf(out, "  ]\n");
    fprintf(out, "}\n");
}

// ---------------------------------------------------------------------------
int main(int argc, char **argv)
{
    if (argc < 2)
    {
        fprintf(stderr, "usage: webifc_validate <model.ifc> [out.json]\n");
        return 2;
    }

    std::ifstream in(argv[1], std::ios::binary);
    if (!in)
    {
        fprintf(stderr, "cannot open %s\n", argv[1]);
        return 2;
    }
    std::string content((std::istreambuf_iterator<char>(in)),
                        std::istreambuf_iterator<char>());

    // Settings pinned to the repo's own native-test defaults (src/cpp/test/web-ifc-test.cpp).
    // These change geometry output, so a result is only comparable against another run
    // with the same settings.
    const uint32_t TAPE_SIZE = 67108864u;
    const uint32_t MEMORY_LIMIT = 2147483648u;
    const uint16_t LINEWRITER_BUFFER = 10000;
    const uint16_t CIRCLE_SEGMENTS = 12;
    const bool COORDINATE_TO_ORIGIN = false;
    const double TOLERANCE_PLANE_INTERSECTION = 1.0E-01;
    const double TOLERANCE_PLANE_DEVIATION = 3.0E-04;
    const double TOLERANCE_BACK_DEVIATION_DISTANCE = 3.0E-04;
    const double TOLERANCE_INSIDE_OUTSIDE_PERIMETER = 1.0E-10;
    const double TOLERANCE_SCALAR_EQUALITY = 1.0E-04;
    const uint16_t PLANE_REFIT_ITERATIONS = 10;
    const uint16_t BOOLEAN_UNION_THRESHOLD = 150;

    schema::IfcSchemaManager schemaManager;
    parsing::IfcLoader loader(TAPE_SIZE, MEMORY_LIMIT, LINEWRITER_BUFFER, schemaManager);

    loader.LoadFile([&](char *dest, size_t sourceOffset, size_t destSize) -> uint32_t {
        if (sourceOffset >= content.size()) return 0;
        uint32_t length = (uint32_t)std::min(content.size() - sourceOffset, destSize);
        memcpy(dest, &content[sourceOffset], length);
        return length;
    });

    cache::IfcCache cache(loader);
    geometry::IfcGeometryProcessor processor(
        loader, schemaManager, CIRCLE_SEGMENTS, COORDINATE_TO_ORIGIN,
        TOLERANCE_PLANE_INTERSECTION, TOLERANCE_PLANE_DEVIATION,
        TOLERANCE_BACK_DEVIATION_DISTANCE, TOLERANCE_INSIDE_OUTSIDE_PERIMETER,
        TOLERANCE_SCALAR_EQUALITY, PLANE_REFIT_ITERATIONS, BOOLEAN_UNION_THRESHOLD);

    std::vector<ElementResult> rows;

    for (uint32_t type : schemaManager.GetIfcElementList())
    {
        const auto &ids = loader.GetExpressIDsWithType(type);
        for (uint32_t expressID : ids)
        {
            auto t0 = std::chrono::steady_clock::now();

            geometry::IfcFlatMesh mesh = processor.GetFlatMesh(expressID);
            if (mesh.geometries.empty()) continue; // V1 (coverage) needs the
                                                   // expectedGeometry classifier
                                                   // before it can judge this — not
                                                   // yet implemented, so we do NOT
                                                   // claim a miss here.

            ElementResult r;
            r.expressID = expressID;
            r.ifcType = type;
            r.ifcTypeName = schemaManager.IfcTypeCodeToType(type);
            r.bboxMin = glm::dvec3(std::numeric_limits<double>::max());
            r.bboxMax = glm::dvec3(std::numeric_limits<double>::lowest());

            for (auto &placed : mesh.geometries)
            {
                geometry::IfcGeometry &g = processor.GetGeometry(placed.geometryExpressID);
                ValidateGeometry(g, r);
            }

            // Sign of the enclosed volume. Only meaningful for a closed shell —
            // on an open mesh the divergence-theorem sum is not a volume at all,
            // so we deliberately leave the sign at 0 rather than report a number
            // that looks authoritative and isn't.
            if (r.watertight() && r.triangleCount > 0)
                r.signedVolumeSign = (r.signedVolume > 0) ? 1 : ((r.signedVolume < 0) ? -1 : 0);

            auto t1 = std::chrono::steady_clock::now();
            r.durationMs = std::chrono::duration_cast<std::chrono::milliseconds>(t1 - t0).count();

            rows.push_back(r);
        }
    }

    std::sort(rows.begin(), rows.end(),
              [](const ElementResult &a, const ElementResult &b) { return a.expressID < b.expressID; });

    FILE *out = stdout;
    if (argc >= 3)
    {
        out = fopen(argv[2], "w");
        if (!out)
        {
            fprintf(stderr, "cannot write %s\n", argv[2]);
            return 2;
        }
    }

    EmitJson(out, rows, argv[1], "");

    if (out != stdout) fclose(out);
    return 0;
}
