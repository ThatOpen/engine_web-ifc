/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <cmath>
#include <cstring>
#include <fstream>
#include <mutex>
#include <sstream>
#include <string>
#include <vector>

#include <glm/glm.hpp>
#include <spdlog/sinks/base_sink.h>
#include <spdlog/spdlog.h>

#include "../web-ifc/cache/IfcCache.h"
#include "../web-ifc/geometry/IfcGeometryProcessor.h"
#include "../web-ifc/parsing/IfcLoader.h"
#include "../web-ifc/schema/IfcSchemaManager.h"

#include "TinyCppTest.hpp"

#ifndef WEB_IFC_TEST_FIXTURES_DIR
#define WEB_IFC_TEST_FIXTURES_DIR ""
#endif

namespace {

// Reproduction for https://github.com/ThatOpen/engine_web-ifc/issues/533:
// an IFC4X3 model where 3D annotation geometry is stored as an
// IfcShapeRepresentation('Body', 'Curve3D') holding an IfcIndexedPolyCurve
// over an IfcCartesianPointList3D (the Bentley/infrastructure export style).
const char *const ISSUE533_FIXTURE = "/annotation-curve3d/ifc4x3-annotation-curve3d.ifc";

std::string ReadFixture(const char *relativePath)
{
    const std::string path = std::string(WEB_IFC_TEST_FIXTURES_DIR) + relativePath;
    std::ifstream file(path, std::ios::binary);
    std::stringstream buffer;
    buffer << file.rdbuf();
    return buffer.str();
}

void LoadIfcContent(webifc::parsing::IfcLoader &loader, const std::string &content)
{
    loader.LoadFile([&](char *dest, size_t sourceOffset, size_t destSize)
                    {
                        uint32_t length = (std::min)(content.size() - sourceOffset, destSize);
                        std::memcpy(dest, &content[sourceOffset], length);
                        return length; });
}

// Collects error-level log messages emitted through the default spdlog logger.
class ErrorCollectingSink : public spdlog::sinks::base_sink<std::mutex>
{
public:
    std::vector<std::string> errors;

protected:
    void sink_it_(const spdlog::details::log_msg &msg) override
    {
        if (msg.level >= spdlog::level::err)
        {
            errors.emplace_back(msg.payload.data(), msg.payload.size());
        }
    }

    void flush_() override {}
};

struct FlatResult
{
    // World-space (flat, Y-up) vertices: IFC (x, y, z) maps to (x, z, -y)
    // through NormalizeIFC, then the placement/coordination transform.
    std::vector<glm::dvec3> vertices;
    // geomType of every placed geometry (GEOM_TRIANGLES / GEOM_LINE_STRIP / GEOM_POINTS)
    std::vector<uint8_t> geomTypes;
};

FlatResult GetFlatGeometry(uint32_t expressID, std::vector<std::string> *errors = nullptr)
{
    webifc::schema::IfcSchemaManager schemaManager;
    webifc::parsing::IfcLoader loader(67108864, 2147483648, 10000, schemaManager);
    const std::string content = ReadFixture(ISSUE533_FIXTURE);
    LoadIfcContent(loader, content);

    webifc::geometry::IfcGeometryProcessor processor(loader, schemaManager, 12, false, 1.0E-01, 3.0E-04, 3.0E-04, 1.0E-10, 1.0E-04, 10, 150);

    FlatResult result;
    auto sink = std::make_shared<ErrorCollectingSink>();
    auto logger = spdlog::default_logger();
    logger->sinks().push_back(sink);
    auto flatMesh = processor.GetFlatMesh(expressID);
    logger->sinks().pop_back();
    if (errors)
    {
        *errors = sink->errors;
    }

    for (const auto &placed : flatMesh.geometries)
    {
        result.geomTypes.push_back(placed.geomType);

        glm::dmat4 matrix(1.0);
        for (int i = 0; i < 4; i++)
        {
            for (int j = 0; j < 4; j++)
            {
                matrix[i][j] = placed.flatTransformation[i * 4 + j];
            }
        }

        auto &geom = processor.GetGeometry(placed.geometryExpressID);
        const float *vertices = reinterpret_cast<const float *>(geom.GetVertexData());
        const uint32_t count = geom.GetVertexDataSize() / webifc::geometry::VERTEX_FORMAT_SIZE_FLOATS;
        for (uint32_t i = 0; i < count; i++)
        {
            const float *v = vertices + i * webifc::geometry::VERTEX_FORMAT_SIZE_FLOATS;
            const glm::dvec4 p = matrix * glm::dvec4(v[0], v[1], v[2], 1.0);
            result.vertices.emplace_back(p.x, p.y, p.z);
        }
    }
    return result;
}

bool Near(const glm::dvec3 &a, const glm::dvec3 &b, double eps = 1e-3)
{
    return glm::length(a - b) < eps;
}

// "unexpected mesh type" is logged whenever an IFC geometry item has no
// GetMesh case, i.e. when an entity is unsupported.
bool HasUnexpectedMeshTypeError(const std::vector<std::string> &errors)
{
    for (const auto &error : errors)
    {
        if (error.find("unexpected mesh type") != std::string::npos)
        {
            return true;
        }
    }
    return false;
}

} // namespace

// #17 in the fixture mirrors the exact pattern from the issue:
// #3654 IFCCARTESIANPOINTLIST3D(((...),(..)),$) + #3655 IFCINDEXEDPOLYCURVE(#3654,$,$)
// inside a Curve3D ShapeRepresentation of an IfcAnnotation.
TEST(Issue533AnnotationIndexedPolyCurve3DProducesFlatGeometry)
{
    std::vector<std::string> errors;
    const auto result = GetFlatGeometry(17, &errors);
    ASSERT(!HasUnexpectedMeshTypeError(errors));
    ASSERT(result.geomTypes.size() == 1u && result.geomTypes[0] == webifc::geometry::GEOM_LINE_STRIP);
    ASSERT(result.vertices.size() == 2u &&
           Near(result.vertices[0], glm::dvec3(1779.61148, 11.75251, -150.0405)) &&
           Near(result.vertices[1], glm::dvec3(1779.61148, 10.3929, -150.0405)));
}

// #25: the same 3D point list referenced through an explicit IfcLineIndex segment.
TEST(Issue533AnnotationIndexedPolyCurve3DLineIndexProducesFlatGeometry)
{
    const auto result = GetFlatGeometry(25);
    ASSERT(result.geomTypes.size() == 1u && result.geomTypes[0] == webifc::geometry::GEOM_LINE_STRIP);
    ASSERT(result.vertices.size() == 3u &&
           Near(result.vertices[0], glm::dvec3(10.0, 0.0, 0.0)) &&
           Near(result.vertices[1], glm::dvec3(15.0, 2.0, 0.0)) &&
           Near(result.vertices[2], glm::dvec3(15.0, 4.0, -5.0)));
}

// #33: a 3D arc segment tessellated from an IfcArcIndex.
TEST(Issue533AnnotationIndexedPolyCurve3DArcIndexProducesFlatGeometry)
{
    const auto result = GetFlatGeometry(33);
    ASSERT(result.geomTypes.size() == 1u && result.geomTypes[0] == webifc::geometry::GEOM_LINE_STRIP);
    ASSERT(result.vertices.size() >= 3u &&
           Near(result.vertices.front(), glm::dvec3(20.0, 0.0, 0.0)) &&
           Near(result.vertices.back(), glm::dvec3(28.0, 0.0, 0.0)));
}

// #43: control case, a plain 3D IfcPolyline used as a Curve3D representation item.
TEST(Issue533AnnotationPolyline3DProducesFlatGeometry)
{
    const auto result = GetFlatGeometry(43);
    ASSERT(result.geomTypes.size() == 1u && result.geomTypes[0] == webifc::geometry::GEOM_LINE_STRIP);
    ASSERT(result.vertices.size() == 3u &&
           Near(result.vertices[0], glm::dvec3(30.0, 0.0, 0.0)) &&
           Near(result.vertices[1], glm::dvec3(33.0, 1.0, 0.0)) &&
           Near(result.vertices[2], glm::dvec3(33.0, 2.0, -3.0)));
}

// #50: a single 3D IfcCartesianPoint used directly as a representation item.
TEST(Issue533AnnotationCartesianPoint3DProducesFlatGeometry)
{
    const auto result = GetFlatGeometry(50);
    ASSERT(result.geomTypes.size() == 1u && result.geomTypes[0] == webifc::geometry::GEOM_POINTS);
    ASSERT(result.vertices.size() == 1u && Near(result.vertices[0], glm::dvec3(41.0, 3.0, -2.0)));
}

// #57: a raw IfcCartesianPointList3D used directly as a representation item.
TEST(Issue533AnnotationCartesianPointList3DProducesFlatGeometry)
{
    std::vector<std::string> errors;
    const auto result = GetFlatGeometry(57, &errors);
    ASSERT(!HasUnexpectedMeshTypeError(errors));
    ASSERT(result.geomTypes.size() == 1u && result.geomTypes[0] == webifc::geometry::GEOM_POINTS);
    ASSERT(result.vertices.size() == 2u &&
           Near(result.vertices[0], glm::dvec3(50.0, 0.0, 0.0)) &&
           Near(result.vertices[1], glm::dvec3(52.0, 0.0, 0.0)));
}

// #77: a product carrying both a solid Body representation and a wireframe Axis
// representation must keep exporting triangles only - enabling wireframe
// geometry must not add axis lines next to the solid geometry of regular
// building elements.
TEST(Issue533SolidProductDoesNotExportItsAxisCurve)
{
    const auto result = GetFlatGeometry(77);
    ASSERT(result.geomTypes.size() == 1u &&
           result.geomTypes[0] == webifc::geometry::GEOM_TRIANGLES &&
           result.vertices.size() >= 8u);
}