/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// validate.cpp — intrinsic geometry validators for web-ifc.
//
// fingerprint.cpp is *referential*: it says "B differs from A". It cannot say which
// one is right, so when a fix legitimately changes 40 elements it just shrugs.
//
// This tool is *intrinsic*: it judges a mesh on its own terms, with no golden file
// and no reference build. That is what lets it answer the question that matters —
// is B better or worse than A?
//
// THE GOVERNING RULE
// -----------------
// Metrics are not one scalar. They are a dominance order:
//
//   tier 1  coverage           did geometry get produced at all, where it was due?
//   tier 2  hard invalidity    NaN/Inf, inverted volume
//   tier 3  topology           naked edges, non-manifold, winding, shattering
//   tier 4  metric fidelity    does the mesh agree with what the file asserts?
//
// B beats A only if it does not regress a HIGHER tier. Silence is not success: a
// build that dies on a hard boolean and emits nothing scores a perfect zero on "bad
// triangles", and that is a regression, not a win. Tier 1 exists to stop exactly that
// from reading as an improvement.
//
// WHY expectedGeometry IS THE HARD PART
// ------------------------------------
// "Has a Representation, so it must produce triangles" is FALSE, and building the
// coverage check on it floods the report with false positives:
//   - IfcOpeningElement is consumed by the boolean; a standalone mesh is not required
//   - IfcSpace / IfcAnnotation / IfcGrid are routinely and correctly empty
//   - a representation carrying only Axis / FootPrint / Box has nothing to mesh
// So the predicate is "has a Body-ish shape representation with items, and is not an
// intentionally-empty type". Get this wrong and the per-type coverage table — the
// headline number of the whole report — is noise.
//
// Two source facts this depends on, verified against v0.0.78 rather than assumed:
//
//  1. VERTICES ARE UNSHARED. Geometry::AddFace(dvec3,dvec3,dvec3) calls AddPoint()
//     three times (bim-geometry/geometry.cpp:80-82), so every triangle owns three
//     fresh vertices and indexData is effectively 0,1,2,3,4,5... Computing edge
//     adjacency on raw indices would report EVERY edge as naked. We weld by position
//     first. This is the single most important detail in the file.
//
//  2. POSITIONS ARE DOUBLE natively. bimGeometry::Geometry keeps fvertexData (float32,
//     what GetVertexData() hands to WASM) *and* vertexData (float64, what GetPoint()
//     returns). Linking natively we read the doubles, so the float32 epsilon floor
//     that constrains the WASM path does not apply here.

#include <cstdio>
#include <cstdint>
#include <cstring>
#include <cmath>
#include <string>
#include <vector>
#include <array>
#include <map>
#include <set>
#include <unordered_map>
#include <unordered_set>
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
// Tolerances here are RELATIVE to the element's own size, never absolute. An absolute
// epsilon is precisely the bug behind #751 / #1014 / #1665 — a 5mm sphere collapses
// while a 10mm one survives; a half-space distance hardcoded to "1" means one metre in
// a millimetre model. A validator that repeated that mistake would invent naked edges
// in small elements and quietly slander them.
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
    return WeldKey{(int64_t)std::llround(p.x / eps),
                   (int64_t)std::llround(p.y / eps),
                   (int64_t)std::llround(p.z / eps)};
}

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
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }
    void Union(uint32_t a, uint32_t b)
    {
        uint32_t ra = Find(a), rb = Find(b);
        if (ra != rb) parent[ra] = rb;
    }
};

// ---------------------------------------------------------------------------
// Per-part topology (one IfcPlacedGeometry). Kept per-part, not merged, because
// merging N legitimately separate shells and then counting components tells you
// nothing: a door IS a frame plus a panel plus a handle.
// ---------------------------------------------------------------------------
struct PartTopology
{
    uint64_t triangles = 0;
    uint64_t weldedVerts = 0;
    uint64_t nakedEdges = 0;
    uint64_t nonManifoldEdges = 0;
    uint64_t degenerate = 0;
    uint64_t duplicates = 0;
    uint64_t slivers = 0;        // triangles with >1 naked edge
    uint64_t components = 0;
    bool     windingConsistent = true;
    bool     nakedBoundaryClean = true; // naked edges form proper closed loops
    double   area = 0.0;
    double   signedVolume = 0.0;
    uint64_t nanInf = 0;
    glm::dvec3 bboxMin{0}, bboxMax{0};
    bool     hasBox = false;
};

static PartTopology AnalysePart(const geometry::IfcGeometry &geom)
{
    PartTopology t;
    const uint32_t numFaces = geom.numFaces;
    const uint32_t numPoints = geom.numPoints;
    if (numFaces == 0) return t;

    // --- bbox + NaN/Inf sweep (V7) ----------------------------------------
    // Before welding: llround(NaN) is garbage and would corrupt the weld grid.
    glm::dvec3 lo(std::numeric_limits<double>::max());
    glm::dvec3 hi(std::numeric_limits<double>::lowest());
    bool anyFinite = false;

    for (uint32_t i = 0; i < numPoints; ++i)
    {
        glm::dvec3 p = geom.GetPoint(i);
        if (!std::isfinite(p.x) || !std::isfinite(p.y) || !std::isfinite(p.z)) { t.nanInf++; continue; }
        lo = glm::min(lo, p); hi = glm::max(hi, p);
        anyFinite = true;
    }
    if (!anyFinite) return t; // everything is NaN; V7 has already said so

    t.bboxMin = lo; t.bboxMax = hi; t.hasBox = true;

    const double diag = glm::length(hi - lo);
    const double eps = std::max(1e-12, diag * 1e-7);

    // --- weld by position -------------------------------------------------
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
        else remap[i] = it->second;
    }
    t.weldedVerts = welded.size();

    // --- triangles + edges ------------------------------------------------
    std::map<EdgeKey, uint32_t> edgeUse;
    std::map<std::pair<uint32_t, uint32_t>, uint32_t> directedUse;
    std::map<std::array<uint32_t, 3>, uint32_t> triSeen;

    DisjointSet ds; ds.Init(welded.size());
    struct TriRef { uint32_t a, b, c; };
    std::vector<TriRef> tris; tris.reserve(numFaces);

    const double areaTol = std::max(1e-24, diag * diag * 1e-14);

    for (uint32_t f = 0; f < numFaces; ++f)
    {
        bimGeometry::Face face = geom.GetFace(f);

        // Face indices are signed int. A negative index would sail through an
        // unsigned-only bounds check by wrapping to a huge value.
        if (face.i0 < 0 || face.i1 < 0 || face.i2 < 0) continue;
        if ((uint32_t)face.i0 >= numPoints || (uint32_t)face.i1 >= numPoints ||
            (uint32_t)face.i2 >= numPoints) continue;

        uint32_t a = remap[face.i0], b = remap[face.i1], c = remap[face.i2];
        if (a == UINT32_MAX || b == UINT32_MAX || c == UINT32_MAX) continue;

        const glm::dvec3 &pa = welded[a], &pb = welded[b], &pc = welded[c];
        glm::dvec3 cr = glm::cross(pb - pa, pc - pa);
        double area2 = glm::length(cr);

        if (a == b || b == c || a == c || area2 < areaTol) { t.degenerate++; continue; }

        t.triangles++;
        t.area += 0.5 * area2;
        // divergence theorem; sign flips if the winding is inverted (#63, #340, #443)
        t.signedVolume += glm::dot(pa, glm::cross(pb, pc)) / 6.0;

        std::array<uint32_t, 3> key{a, b, c};
        std::sort(key.begin(), key.end());
        if (++triSeen[key] > 1) t.duplicates++;

        tris.push_back({a, b, c});
        edgeUse[MakeEdgeKey(a, b)]++;
        edgeUse[MakeEdgeKey(b, c)]++;
        edgeUse[MakeEdgeKey(c, a)]++;
        directedUse[{a, b}]++;
        directedUse[{b, c}]++;
        directedUse[{c, a}]++;
        ds.Union(a, b); ds.Union(b, c);
    }

    // naked = used once; non-manifold = used more than twice
    std::map<uint32_t, uint32_t> nakedDegree; // welded vertex -> incident naked edges
    for (const auto &[edge, count] : edgeUse)
    {
        if (count == 1)
        {
            t.nakedEdges++;
            nakedDegree[edge.a]++;
            nakedDegree[edge.b]++;
        }
        else if (count > 2) t.nonManifoldEdges++;
    }

    // A directed half-edge used twice means two neighbouring faces traverse the shared
    // edge the same way — one of them is wound backwards.
    for (const auto &[dir, count] : directedUse)
        if (count > 1) { t.windingConsistent = false; break; }

    // Is the naked boundary a CLEAN one? This is the open-sheet-vs-torn-solid test.
    //
    // A surface that is *meant* to be open (a glass pane, a terrain patch) has naked
    // edges forming closed boundary loops: every vertex on the boundary has exactly two
    // naked edges. A solid with a TEAR in it has boundary vertices of odd or higher
    // degree, and slivers hanging off. Counting naked edges alone cannot tell these
    // apart, and on a real house it flags nine perfectly good windows.
    for (const auto &[v, deg] : nakedDegree)
        if (deg != 2) { t.nakedBoundaryClean = false; break; }

    // Triangles with >1 naked edge: barely attached to anything. A strong and specific
    // wrongness signal, and much quieter than a raw naked-edge count.
    for (const auto &tr : tris)
    {
        int naked = 0;
        if (edgeUse[MakeEdgeKey(tr.a, tr.b)] == 1) naked++;
        if (edgeUse[MakeEdgeKey(tr.b, tr.c)] == 1) naked++;
        if (edgeUse[MakeEdgeKey(tr.c, tr.a)] == 1) naked++;
        if (naked > 1) t.slivers++;
    }

    std::set<uint32_t> roots;
    for (const auto &tr : tris) roots.insert(ds.Find(tr.a));
    t.components = roots.size();

    return t;
}

// ---------------------------------------------------------------------------
// Element record
// ---------------------------------------------------------------------------
struct ElementResult
{
    uint32_t expressID = 0;
    std::string ifcTypeName;

    // expectedGeometry classifier
    bool expected = false;
    std::string expectedReason;
    std::vector<std::string> subcontexts;

    bool hasGeometry = false;
    uint32_t partCount = 0;   // IfcPlacedGeometry count = how many pieces it SHOULD be

    uint64_t triangles = 0, weldedVerts = 0;
    uint64_t nanInf = 0;
    uint64_t nakedEdges = 0, nonManifoldEdges = 0, degenerate = 0, duplicates = 0, slivers = 0;
    uint64_t components = 0;
    bool windingConsistent = true;
    bool nakedBoundaryClean = true;
    double area = 0.0, signedVolume = 0.0;
    long long durationMs = 0;

    // V4 — void-cut evidence
    uint32_t declaredVoids = 0;
    uint32_t voidsWithCutEvidence = 0;

    // verdicts
    bool coverageMiss() const { return expected && !hasGeometry; }
    // Shattered means MORE pieces than the element actually has parts — a part that
    // broke apart. Not "more than one piece": a door legitimately has 32.
    bool shattered() const { return hasGeometry && partCount > 0 && components > partCount; }
    // Torn: has naked edges AND they don't form a clean boundary, or slivers hang off.
    bool torn() const { return hasGeometry && nakedEdges > 0 && (!nakedBoundaryClean || slivers > 0); }
    bool suspectNoOp() const { return declaredVoids > 0 && voidsWithCutEvidence < declaredVoids; }
};

// ---------------------------------------------------------------------------
// Model-level index built by scanning the STEP data directly
// ---------------------------------------------------------------------------
struct ModelIndex
{
    // host element -> its IfcOpeningElement voids (via IfcRelVoidsElement)
    std::map<uint32_t, std::vector<uint32_t>> voids;
};

static ModelIndex BuildIndex(const parsing::IfcLoader &loader)
{
    ModelIndex idx;
    for (uint32_t relID : loader.GetExpressIDsWithType(schema::IFCRELVOIDSELEMENT))
    {
        // IfcRelVoidsElement(GlobalId, OwnerHistory, Name, Description,
        //                    RelatingBuildingElement=4, RelatedOpeningElement=5)
        loader.MoveToArgumentOffset(relID, 4);
        uint32_t host = loader.GetRefArgument();
        loader.MoveToArgumentOffset(relID, 5);
        uint32_t opening = loader.GetRefArgument();
        if (host && opening) idx.voids[host].push_back(opening);
    }
    return idx;
}

// Types that are legitimately empty, or whose geometry is consumed rather than drawn.
// Flagging these as coverage misses is the fastest way to make the headline number
// meaningless.
static bool IsIntentionallyEmptyType(uint32_t type)
{
    switch (type)
    {
    case schema::IFCOPENINGELEMENT:   // consumed by the boolean as a void
    case schema::IFCSPACE:            // excluded from default geometry generation
    case schema::IFCANNOTATION:
    case schema::IFCGRID:
    case schema::IFCVIRTUALELEMENT:
        return true;
    default:
        return false;
    }
}

static std::string ToUpper(std::string_view s)
{
    std::string r(s);
    std::transform(r.begin(), r.end(), r.begin(), [](unsigned char c) { return (char)std::toupper(c); });
    return r;
}

// The classifier. Answers: SHOULD this element have produced a mesh?
static void ClassifyExpectedGeometry(const parsing::IfcLoader &loader, uint32_t expressID,
                                     uint32_t type, ElementResult &r)
{
    if (IsIntentionallyEmptyType(type))
    {
        r.expected = false;
        r.expectedReason = "type is intentionally empty or consumed as a boolean operand";
        return;
    }

    // IfcProduct(..., ObjectPlacement=5, Representation=6)
    loader.MoveToArgumentOffset(expressID, 6);
    if (loader.GetTokenType() != parsing::IfcTokenType::REF)
    {
        r.expected = false;
        r.expectedReason = "no Representation";
        return;
    }
    loader.StepBack();
    uint32_t pdsID = loader.GetRefArgument();
    if (!pdsID || !loader.IsValidExpressID(pdsID))
    {
        r.expected = false;
        r.expectedReason = "Representation reference does not resolve";
        return;
    }

    // IfcProductDefinitionShape(Name, Description, Representations=2)
    loader.MoveToArgumentOffset(pdsID, 2);
    std::vector<uint32_t> reps = loader.GetSetArgument();

    bool bodyWithItems = false;
    for (uint32_t repID : reps)
    {
        if (!loader.IsValidExpressID(repID)) continue;
        // IfcShapeRepresentation(ContextOfItems, RepresentationIdentifier=1,
        //                        RepresentationType=2, Items=3)
        loader.MoveToArgumentOffset(repID, 1);
        std::string ident;
        if (loader.GetTokenType() == parsing::IfcTokenType::STRING)
        {
            loader.StepBack();
            ident = ToUpper(loader.GetStringArgument());
        }
        loader.MoveToArgumentOffset(repID, 3);
        std::vector<uint32_t> items = loader.GetSetArgument();

        if (!ident.empty()) r.subcontexts.push_back(ident);

        // "Body" is the meshable one. "Facetation" is what some exporters use instead
        // (#117 — gating on Body alone silently drops whole categories of geometry).
        // Axis / FootPrint / Box / Profile have nothing to mesh, by design.
        if ((ident == "BODY" || ident == "FACETATION") && !items.empty())
            bodyWithItems = true;
    }

    if (bodyWithItems)
    {
        r.expected = true;
        r.expectedReason = "Body/Facetation representation with items";
    }
    else if (reps.empty())
    {
        r.expected = false;
        r.expectedReason = "ProductDefinitionShape has no representations";
    }
    else
    {
        r.expected = false;
        r.expectedReason = "no Body/Facetation representation with items (only non-meshable subcontexts)";
    }
}

// ---------------------------------------------------------------------------
static void EmitJson(FILE *out, const std::vector<ElementResult> &rows,
                     const std::string &modelPath, const std::string &commit)
{
    // --- per-type coverage table. The KB console's instruction was explicit: this is
    // the headline number, so it leads the report.
    struct TypeCov { uint32_t expectedN = 0, meshed = 0; std::vector<uint32_t> missing; };
    std::map<std::string, TypeCov> cov;

    uint64_t tTri = 0, tNaked = 0, tNonMan = 0, tDup = 0, tDegen = 0, tNaN = 0, tSliver = 0;
    uint64_t nMiss = 0, nTorn = 0, nShattered = 0, nInverted = 0, nBadWinding = 0, nNoOp = 0;
    uint64_t expectedTotal = 0, meshedTotal = 0;

    for (const auto &r : rows)
    {
        if (r.expected)
        {
            auto &c = cov[r.ifcTypeName];
            c.expectedN++;
            expectedTotal++;
            if (r.hasGeometry) { c.meshed++; meshedTotal++; }
            else { c.missing.push_back(r.expressID); nMiss++; }
        }
        tTri += r.triangles;   tNaked += r.nakedEdges; tNonMan += r.nonManifoldEdges;
        tDup += r.duplicates;  tDegen += r.degenerate; tNaN += r.nanInf; tSliver += r.slivers;
        if (r.torn()) nTorn++;
        if (r.shattered()) nShattered++;
        if (r.hasGeometry && r.nakedEdges == 0 && r.nonManifoldEdges == 0 && r.signedVolume < 0) nInverted++;
        if (!r.windingConsistent) nBadWinding++;
        if (r.suspectNoOp()) nNoOp++;
    }

    fprintf(out, "{\n");
    fprintf(out, "  \"meta\": { \"model\": \"%s\", \"commit\": \"%s\", \"tool\": \"validate\" },\n",
            modelPath.c_str(), commit.c_str());

    fprintf(out, "  \"summary\": {\n");
    fprintf(out, "    \"tier1_coverage\": {\n");
    fprintf(out, "      \"expected\": %llu, \"meshed\": %llu, \"missing\": %llu,\n",
            (unsigned long long)expectedTotal, (unsigned long long)meshedTotal,
            (unsigned long long)nMiss);
    fprintf(out, "      \"perType\": [\n");
    bool first = true;
    for (const auto &[type, c] : cov)
    {
        fprintf(out, "%s        {\"ifcType\": \"%s\", \"expected\": %u, \"meshed\": %u, \"pct\": %.3f, \"missingIds\": [",
                first ? "" : ",\n", type.c_str(), c.expectedN, c.meshed,
                c.expectedN ? (double)c.meshed / c.expectedN : 1.0);
        for (size_t i = 0; i < c.missing.size(); ++i)
            fprintf(out, "%s%u", i ? "," : "", c.missing[i]);
        fprintf(out, "]}");
        first = false;
    }
    fprintf(out, "\n      ]\n    },\n");

    fprintf(out, "    \"tier2_hardInvalidity\": { \"nanInfVertices\": %llu, \"elementsInvertedVolume\": %llu },\n",
            (unsigned long long)tNaN, (unsigned long long)nInverted);

    fprintf(out, "    \"tier3_topology\": {\n");
    fprintf(out, "      \"elementsTorn\": %llu, \"elementsShattered\": %llu,\n",
            (unsigned long long)nTorn, (unsigned long long)nShattered);
    fprintf(out, "      \"elementsInconsistentWinding\": %llu,\n", (unsigned long long)nBadWinding);
    fprintf(out, "      \"nakedEdges\": %llu, \"nonManifoldEdges\": %llu,\n",
            (unsigned long long)tNaked, (unsigned long long)tNonMan);
    fprintf(out, "      \"duplicateTriangles\": %llu, \"degenerateTriangles\": %llu, \"slivers\": %llu\n",
            (unsigned long long)tDup, (unsigned long long)tDegen, (unsigned long long)tSliver);
    fprintf(out, "    },\n");

    fprintf(out, "    \"tier4_fidelity\": { \"elementsSuspectBooleanNoOp\": %llu },\n",
            (unsigned long long)nNoOp);
    fprintf(out, "    \"totalTriangles\": %llu\n", (unsigned long long)tTri);
    fprintf(out, "  },\n");

    fprintf(out, "  \"elements\": [\n");
    for (size_t i = 0; i < rows.size(); ++i)
    {
        const auto &r = rows[i];
        fprintf(out, "    {\"expressID\": %u, \"ifcType\": \"%s\", ", r.expressID, r.ifcTypeName.c_str());
        fprintf(out, "\"expected\": %s, \"expectedReason\": \"%s\", ",
                r.expected ? "true" : "false", r.expectedReason.c_str());
        fprintf(out, "\"hasGeometry\": %s, \"partCount\": %u, ",
                r.hasGeometry ? "true" : "false", r.partCount);
        fprintf(out, "\"triangles\": %llu, \"components\": %llu, ",
                (unsigned long long)r.triangles, (unsigned long long)r.components);
        fprintf(out, "\"nanInf\": %llu, \"nakedEdges\": %llu, \"nonManifoldEdges\": %llu, ",
                (unsigned long long)r.nanInf, (unsigned long long)r.nakedEdges,
                (unsigned long long)r.nonManifoldEdges);
        fprintf(out, "\"duplicates\": %llu, \"degenerate\": %llu, \"slivers\": %llu, ",
                (unsigned long long)r.duplicates, (unsigned long long)r.degenerate,
                (unsigned long long)r.slivers);
        fprintf(out, "\"windingConsistent\": %s, \"nakedBoundaryClean\": %s, ",
                r.windingConsistent ? "true" : "false", r.nakedBoundaryClean ? "true" : "false");
        fprintf(out, "\"signedVolume\": %.6f, \"area\": %.6f, ", r.signedVolume, r.area);
        fprintf(out, "\"declaredVoids\": %u, \"voidsWithCutEvidence\": %u, ",
                r.declaredVoids, r.voidsWithCutEvidence);
        fprintf(out, "\"coverageMiss\": %s, \"torn\": %s, \"shattered\": %s, \"suspectNoOp\": %s, ",
                r.coverageMiss() ? "true" : "false", r.torn() ? "true" : "false",
                r.shattered() ? "true" : "false", r.suspectNoOp() ? "true" : "false");
        fprintf(out, "\"durationMs\": %lld}%s\n", r.durationMs, (i + 1 < rows.size()) ? "," : "");
    }
    fprintf(out, "  ]\n}\n");
}

// ---------------------------------------------------------------------------
int main(int argc, char **argv)
{
    if (argc < 2)
    {
        fprintf(stderr, "usage: webifc_validate <model.ifc> [out.json] [commit-label]\n");
        return 2;
    }

    std::ifstream in(argv[1], std::ios::binary);
    if (!in) { fprintf(stderr, "cannot open %s\n", argv[1]); return 2; }
    std::string content((std::istreambuf_iterator<char>(in)), std::istreambuf_iterator<char>());

    // Pinned to the repo's own native-test defaults. These change output, so a report
    // is only comparable against another run with the same settings.
    const uint32_t TAPE_SIZE = 67108864u, MEMORY_LIMIT = 2147483648u;
    const uint16_t LINEWRITER_BUFFER = 10000, CIRCLE_SEGMENTS = 12;
    const bool COORDINATE_TO_ORIGIN = false;
    const double TOL_PLANE_INTERSECTION = 1.0E-01, TOL_PLANE_DEVIATION = 3.0E-04,
                 TOL_BACK_DEVIATION = 3.0E-04, TOL_INSIDE_OUTSIDE = 1.0E-10,
                 TOL_SCALAR = 1.0E-04;
    const uint16_t PLANE_REFIT_ITERATIONS = 10, BOOLEAN_UNION_THRESHOLD = 150;

    schema::IfcSchemaManager schemaManager;
    parsing::IfcLoader loader(TAPE_SIZE, MEMORY_LIMIT, LINEWRITER_BUFFER, schemaManager);
    loader.LoadFile([&](char *dest, size_t off, size_t destSize) -> uint32_t {
        if (off >= content.size()) return 0;
        uint32_t len = (uint32_t)std::min(content.size() - off, destSize);
        memcpy(dest, &content[off], len);
        return len;
    });

    cache::IfcCache cache(loader);
    geometry::IfcGeometryProcessor processor(
        loader, schemaManager, CIRCLE_SEGMENTS, COORDINATE_TO_ORIGIN,
        TOL_PLANE_INTERSECTION, TOL_PLANE_DEVIATION, TOL_BACK_DEVIATION,
        TOL_INSIDE_OUTSIDE, TOL_SCALAR, PLANE_REFIT_ITERATIONS, BOOLEAN_UNION_THRESHOLD);

    ModelIndex index = BuildIndex(loader);

    // Opening bounding boxes, for the V4 cut-evidence probe.
    std::map<uint32_t, std::pair<glm::dvec3, glm::dvec3>> openingBox;

    std::vector<ElementResult> rows;

    for (uint32_t type : schemaManager.GetIfcElementList())
    {
        for (uint32_t expressID : loader.GetExpressIDsWithType(type))
        {
            auto t0 = std::chrono::steady_clock::now();

            ElementResult r;
            r.expressID = expressID;
            r.ifcTypeName = schemaManager.IfcTypeCodeToType(type);
            ClassifyExpectedGeometry(loader, expressID, type, r);

            geometry::IfcFlatMesh mesh = processor.GetFlatMesh(expressID);
            r.partCount = (uint32_t)mesh.geometries.size();

            glm::dvec3 lo(std::numeric_limits<double>::max());
            glm::dvec3 hi(std::numeric_limits<double>::lowest());
            bool anyBox = false;

            for (auto &placed : mesh.geometries)
            {
                geometry::IfcGeometry &g = processor.GetGeometry(placed.geometryExpressID);
                PartTopology t = AnalysePart(g);

                r.triangles += t.triangles;   r.weldedVerts += t.weldedVerts;
                r.nanInf += t.nanInf;         r.nakedEdges += t.nakedEdges;
                r.nonManifoldEdges += t.nonManifoldEdges;
                r.degenerate += t.degenerate; r.duplicates += t.duplicates;
                r.slivers += t.slivers;       r.components += t.components;
                r.area += t.area;             r.signedVolume += t.signedVolume;
                if (!t.windingConsistent) r.windingConsistent = false;
                if (!t.nakedBoundaryClean) r.nakedBoundaryClean = false;

                if (t.hasBox)
                {
                    // place the part's local box into element space
                    glm::dvec4 c0 = placed.transformation * glm::dvec4(t.bboxMin, 1.0);
                    glm::dvec4 c1 = placed.transformation * glm::dvec4(t.bboxMax, 1.0);
                    lo = glm::min(lo, glm::min(glm::dvec3(c0), glm::dvec3(c1)));
                    hi = glm::max(hi, glm::max(glm::dvec3(c0), glm::dvec3(c1)));
                    anyBox = true;
                }
            }

            r.hasGeometry = r.triangles > 0;

            if (type == schema::IFCOPENINGELEMENT && anyBox)
                openingBox[expressID] = {lo, hi};

            auto t1 = std::chrono::steady_clock::now();
            r.durationMs = std::chrono::duration_cast<std::chrono::milliseconds>(t1 - t0).count();

            rows.push_back(r);
        }
    }

    // --- V4: did the void actually cut? -----------------------------------
    // A silent no-op returns the host operand unchanged and LOOKS like success — it is
    // ~10% of all boolean issues (#19, #53, #300, #371, #398, #1057).
    //
    // Cheap evidence: an uncut box wall has vertices only at its own corners. Once an
    // opening is genuinely subtracted, the host gains new vertices around the hole,
    // i.e. INSIDE the opening's bounding box. Zero host vertices inside a declared
    // void's box is therefore a strong hint the cut never happened.
    //
    // This is a heuristic proxy, not a proof — a true no-op detector needs to compare
    // the boolean's output against its first operand inside the engine. Reported as
    // "suspect", never as "confirmed".
    std::map<uint32_t, ElementResult *> byId;
    for (auto &r : rows) byId[r.expressID] = &r;

    for (auto &[hostID, openings] : index.voids)
    {
        auto hit = byId.find(hostID);
        if (hit == byId.end() || !hit->second->hasGeometry) continue;
        ElementResult &host = *hit->second;

        geometry::IfcFlatMesh hostMesh = processor.GetFlatMesh(hostID);

        for (uint32_t openID : openings)
        {
            auto bit = openingBox.find(openID);
            if (bit == openingBox.end()) continue;
            host.declaredVoids++;

            const glm::dvec3 &olo = bit->second.first;
            const glm::dvec3 &ohi = bit->second.second;
            glm::dvec3 pad = (ohi - olo) * 0.02 + glm::dvec3(1e-6);

            bool evidence = false;
            for (auto &placed : hostMesh.geometries)
            {
                if (evidence) break;
                geometry::IfcGeometry &g = processor.GetGeometry(placed.geometryExpressID);
                for (uint32_t i = 0; i < g.numPoints && !evidence; ++i)
                {
                    glm::dvec3 p = g.GetPoint(i);
                    if (!std::isfinite(p.x) || !std::isfinite(p.y) || !std::isfinite(p.z)) continue;
                    glm::dvec3 w = glm::dvec3(placed.transformation * glm::dvec4(p, 1.0));
                    if (glm::all(glm::greaterThanEqual(w, olo - pad)) &&
                        glm::all(glm::lessThanEqual(w, ohi + pad)))
                        evidence = true;
                }
            }
            if (evidence) host.voidsWithCutEvidence++;
        }
    }

    std::sort(rows.begin(), rows.end(),
              [](const ElementResult &a, const ElementResult &b) { return a.expressID < b.expressID; });

    FILE *out = stdout;
    if (argc >= 3)
    {
        out = fopen(argv[2], "w");
        if (!out) { fprintf(stderr, "cannot write %s\n", argv[2]); return 2; }
    }
    EmitJson(out, rows, argv[1], (argc >= 4) ? argv[3] : "");
    if (out != stdout) fclose(out);
    return 0;
}
