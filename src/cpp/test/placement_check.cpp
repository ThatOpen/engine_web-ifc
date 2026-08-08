/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Placement-consistency harness for IfcOpeningElement / IfcSpace geometry
// (upstream issue #1462). Loads one IFC file and emits flat meshes for
// openings under three call orders, then reports placement drift:
//   S1  openings on a fresh model
//   S2  all regular elements first (LoadAllGeometry order), then openings
//   S3  openings again on the S2 model (repeat call, no Clear)
// A correct engine produces identical world-space AABBs in all three, the
// float shadow buffers must agree with the double master data, and every
// opening must overlap its IfcRelVoidsElement host.
//
// Usage: web-ifc-placement-check <model.ifc> [--assert]

#include <cmath>
#include <cstring>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <map>
#include <memory>
#include <string>
#include <vector>

#include "../web-ifc/modelmanager/ModelManager.h"

using namespace webifc;

namespace
{

struct Box
{
    glm::dvec3 min{1e30, 1e30, 1e30};
    glm::dvec3 max{-1e30, -1e30, -1e30};
    bool valid() const { return min.x <= max.x; }
    void add(const glm::dvec3 &p)
    {
        min = glm::min(min, p);
        max = glm::max(max, p);
    }
    bool overlaps(const Box &o, double tol) const
    {
        return valid() && o.valid() &&
               min.x <= o.max.x + tol && max.x >= o.min.x - tol &&
               min.y <= o.max.y + tol && max.y >= o.min.y - tol &&
               min.z <= o.max.z + tol && max.z >= o.min.z - tol;
    }
};

double BoxDrift(const Box &a, const Box &b)
{
    if (!a.valid() && !b.valid())
        return 0.0; // both empty: consistent
    if (!a.valid() || !b.valid())
        return 1e30; // one side lost its geometry: order-dependence signal
    double d = 0;
    for (int i = 0; i < 3; i++)
    {
        d = std::max(d, std::abs(a.min[i] - b.min[i]));
        d = std::max(d, std::abs(a.max[i] - b.max[i]));
    }
    return d;
}

Box BoxFromDoubles(geometry::IfcGeometryProcessor *proc, const geometry::IfcFlatMesh &mesh)
{
    Box box;
    for (const auto &placed : mesh.geometries)
    {
        auto &geom = proc->GetGeometry(placed.geometryExpressID);
        for (size_t i = 0; i + 5 < geom.vertexData.size(); i += 6)
        {
            glm::dvec4 p(geom.vertexData[i], geom.vertexData[i + 1], geom.vertexData[i + 2], 1.0);
            box.add(glm::dvec3(placed.transformation * p));
        }
    }
    return box;
}

// What a wasm/JS client reconstructs: float shadow buffer x flatTransformation.
Box BoxFromFloatShadow(geometry::IfcGeometryProcessor *proc, const geometry::IfcFlatMesh &mesh)
{
    Box box;
    for (const auto &placed : mesh.geometries)
    {
        auto &geom = proc->GetGeometry(placed.geometryExpressID);
        const float *fv = reinterpret_cast<const float *>(geom.GetVertexData());
        uint32_t n = geom.GetVertexDataSize();
        const auto &m = placed.flatTransformation;
        for (uint32_t i = 0; i + 5 < n; i += 6)
        {
            double x = fv[i], y = fv[i + 1], z = fv[i + 2];
            box.add(glm::dvec3(m[0] * x + m[4] * y + m[8] * z + m[12],
                               m[1] * x + m[5] * y + m[9] * z + m[13],
                               m[2] * x + m[6] * y + m[10] * z + m[14]));
        }
    }
    return box;
}

uint32_t OpenModel(manager::ModelManager &mgr, const std::string &path)
{
    manager::LoaderSettings settings;
    uint32_t modelID = mgr.CreateModel(settings);
    // must outlive the model: chunk eviction re-reads the byte source
    static std::vector<std::unique_ptr<std::ifstream>> streams;
    streams.push_back(std::make_unique<std::ifstream>(path, std::ios::binary));
    if (!*streams.back())
    {
        std::cerr << "cannot open " << path << std::endl;
        std::exit(2);
    }
    mgr.GetIfcLoader(modelID)->LoadFile(*streams.back());
    return modelID;
}

std::map<uint32_t, uint32_t> OpeningToHost(parsing::IfcLoader *loader)
{
    std::map<uint32_t, uint32_t> result;
    for (auto id : loader->GetExpressIDsWithType(schema::IFCRELVOIDSELEMENT))
    {
        loader->MoveToArgumentOffset(id, 4);
        if (loader->GetTokenType() != parsing::IfcTokenType::REF)
            continue;
        loader->StepBack();
        uint32_t host = loader->GetRefArgument();
        if (loader->GetTokenType() != parsing::IfcTokenType::REF)
            continue;
        loader->StepBack();
        uint32_t opening = loader->GetRefArgument();
        result[opening] = host;
    }
    return result;
}

const std::vector<uint32_t> kExcluded = {schema::IFCOPENINGELEMENT, schema::IFCSPACE, schema::IFCOPENINGSTANDARDCASE};

bool IsExcludedType(uint32_t type)
{
    for (auto t : kExcluded)
        if (t == type)
            return true;
    return false;
}

// Mimics LoadAllGeometry: flat-mesh every regular element, prime float shadows.
std::map<uint32_t, Box> EmitRegularElements(manager::ModelManager &mgr, uint32_t modelID)
{
    std::map<uint32_t, Box> boxes;
    auto *loader = mgr.GetIfcLoader(modelID);
    auto *proc = mgr.GetGeometryProcessor(modelID);
    for (auto type : mgr.GetSchemaManager().GetIfcElementList())
    {
        if (IsExcludedType(type))
            continue;
        for (auto id : loader->GetExpressIDsWithType(type))
        {
            auto mesh = proc->GetFlatMesh(id);
            for (auto &placed : mesh.geometries)
                proc->GetGeometry(placed.geometryExpressID).GetVertexData();
            boxes[id] = BoxFromDoubles(proc, mesh);
        }
    }
    return boxes;
}

struct OpeningPass
{
    std::map<uint32_t, Box> dbl;
    std::map<uint32_t, Box> flt;
};

OpeningPass EmitOpenings(manager::ModelManager &mgr, uint32_t modelID, const std::vector<uint32_t> &openings)
{
    OpeningPass pass;
    auto *proc = mgr.GetGeometryProcessor(modelID);
    for (auto id : openings)
    {
        auto mesh = proc->GetFlatMesh(id);
        for (auto &placed : mesh.geometries)
            proc->GetGeometry(placed.geometryExpressID).GetVertexData();
        pass.dbl[id] = BoxFromDoubles(proc, mesh);
        pass.flt[id] = BoxFromFloatShadow(proc, mesh);
    }
    return pass;
}

} // namespace

int main(int argc, char *argv[])
{
    if (argc < 2)
    {
        std::cerr << "usage: web-ifc-placement-check <model.ifc> [--assert]" << std::endl;
        return 2;
    }
    std::string path = argv[1];
    bool assertMode = argc > 2 && std::string(argv[2]) == "--assert";
    spdlog::set_level(spdlog::level::err);

    manager::ModelManager mgr(false);

    // Collect openings / spaces / host relations once.
    uint32_t scoutModel = OpenModel(mgr, path);
    auto *scoutLoader = mgr.GetIfcLoader(scoutModel);
    std::vector<uint32_t> openings;
    for (auto t : {schema::IFCOPENINGELEMENT, schema::IFCOPENINGSTANDARDCASE})
        for (auto id : scoutLoader->GetExpressIDsWithType(t))
            openings.push_back(id);
    auto spaces = scoutLoader->GetExpressIDsWithType(schema::IFCSPACE);
    auto openingHost = OpeningToHost(scoutLoader);
    mgr.CloseModel(scoutModel);

    std::cout << path << "\n  openings: " << openings.size() << "  spaces: " << spaces.size()
              << "  relVoids pairs: " << openingHost.size() << std::endl;
    if (openings.empty())
    {
        std::cout << "  nothing to check (no openings)" << std::endl;
        // in assert mode an unexpected absence of openings must not pass silently
        return assertMode ? 1 : 0;
    }

    // S1: openings only, fresh model.
    uint32_t m1 = OpenModel(mgr, path);
    auto s1 = EmitOpenings(mgr, m1, openings);
    mgr.CloseModel(m1);

    // S2: regular elements first (viewer/LoadAllGeometry order), then openings.
    uint32_t m2 = OpenModel(mgr, path);
    auto hostBoxes = EmitRegularElements(mgr, m2);
    auto s2 = EmitOpenings(mgr, m2, openings);
    // S3: repeat openings on the same session, no Clear in between.
    auto s3 = EmitOpenings(mgr, m2, openings);
    // Spaces should emit real geometry when explicitly requested.
    size_t spacesWithGeometry = 0;
    {
        auto *proc = mgr.GetGeometryProcessor(m2);
        for (auto id : spaces)
        {
            auto mesh = proc->GetFlatMesh(id);
            if (!mesh.geometries.empty())
                spacesWithGeometry++;
        }
    }
    mgr.CloseModel(m2);

    double maxOrderDrift = 0, maxRepeatDrift = 0, maxShadowDrift = 0;
    uint32_t worstOrder = 0, worstRepeat = 0, worstShadow = 0;
    size_t hostMisses = 0;
    for (auto id : openings)
    {
        double orderDrift = BoxDrift(s1.dbl[id], s2.dbl[id]);
        double repeatDrift = BoxDrift(s2.dbl[id], s3.dbl[id]);
        double shadowDrift = std::max(BoxDrift(s2.dbl[id], s2.flt[id]), BoxDrift(s3.dbl[id], s3.flt[id]));
        if (orderDrift > maxOrderDrift) { maxOrderDrift = orderDrift; worstOrder = id; }
        if (repeatDrift > maxRepeatDrift) { maxRepeatDrift = repeatDrift; worstRepeat = id; }
        if (shadowDrift > maxShadowDrift) { maxShadowDrift = shadowDrift; worstShadow = id; }

        auto hostIt = openingHost.find(id);
        if (hostIt != openingHost.end())
        {
            auto hb = hostBoxes.find(hostIt->second);
            if (hb != hostBoxes.end() && hb->second.valid() && s2.dbl[id].valid() &&
                !s2.dbl[id].overlaps(hb->second, 0.5))
            {
                hostMisses++;
                auto oc = (s2.dbl[id].min + s2.dbl[id].max) * 0.5;
                auto hc = (hb->second.min + hb->second.max) * 0.5;
                std::cout << std::fixed << std::setprecision(2)
                          << "    MISS opening #" << id << " center (" << oc.x << "," << oc.y << "," << oc.z
                          << ") host #" << hostIt->second << " center (" << hc.x << "," << hc.y << "," << hc.z
                          << ") delta " << glm::distance(oc, hc) << std::endl;
            }
        }
    }

    std::cout << std::scientific << std::setprecision(3)
              << "  order drift   (S1 vs S2): " << maxOrderDrift << "  (worst #" << worstOrder << ")\n"
              << "  repeat drift  (S2 vs S3): " << maxRepeatDrift << "  (worst #" << worstRepeat << ")\n"
              << "  shadow drift  (dbl vs f32): " << maxShadowDrift << "  (worst #" << worstShadow << ")\n"
              << "  openings not overlapping their host: " << hostMisses << " / " << openingHost.size() << "\n"
              << "  spaces with geometry on request: " << spacesWithGeometry << " / " << spaces.size() << std::endl;

    // f32 rounding across large coordinates justifies a small tolerance; real
    // misplacement shows up meters off, orders of magnitude past this.
    const double tol = 1e-2;
    bool spacesOk = spaces.empty() || spacesWithGeometry > 0;
    bool ok = maxOrderDrift < tol && maxRepeatDrift < tol && maxShadowDrift < tol && hostMisses == 0 && spacesOk;
    std::cout << (ok ? "  RESULT: CONSISTENT" : "  RESULT: INCONSISTENT") << std::endl;
    return (assertMode && !ok) ? 1 : 0;
}
