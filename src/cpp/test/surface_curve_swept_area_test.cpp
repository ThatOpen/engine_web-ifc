/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <algorithm>
#include <cmath>
#include <cstring>
#include <limits>
#include <memory>
#include <mutex>
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

namespace {

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

bool HasGeometry(const webifc::geometry::IfcComposedMesh &mesh)
{
    if (mesh.hasGeometry)
    {
        return true;
    }
    return std::any_of(mesh.children.begin(), mesh.children.end(), [](const webifc::geometry::IfcComposedMesh &child)
                       { return HasGeometry(child); });
}

// Element #32 of the Revit slab-edge pattern: IfcSurfaceCurveSweptAreaSolid
// with an omitted (OPTIONAL) Position attribute, i.e. "$" in the second slot.
const char *const SURFACE_CURVE_OMITTED_POSITION_IFC = R"IFC(ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('surface curve swept area solid without Position'),'2;1');
FILE_NAME('surface_curve_omitted_position.ifc','2026-11-02T00:00:00',(''),(''),'','','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#1=IFCCARTESIANPOINT((0.,0.,0.));
#2=IFCDIRECTION((0.,0.,1.));
#3=IFCDIRECTION((1.,0.,0.));
#4=IFCAXIS2PLACEMENT3D(#1,#2,#3);
#5=IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-05,#4,$);
#6=IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.);
#7=IFCSIUNIT(*,.PLANEANGLEUNIT.,$,.RADIAN.);
#8=IFCMEASUREWITHUNIT(IFCPLANEANGLEMEASURE(0.0174532925199433),#7);
#9=IFCDIMENSIONALEXPONENTS(0,0,0,0,0,0,0);
#10=IFCCONVERSIONBASEDUNIT(#9,.PLANEANGLEUNIT.,'DEGREE',#8);
#11=IFCUNITASSIGNMENT((#6,#10));
#12=IFCPROJECT('0YvctVUKr0kugbFTf53O9L',$,'Omitted position',$,$,$,$,(#5),#11);
#13=IFCCARTESIANPOINT((0.,0.));
#14=IFCDIRECTION((1.,0.));
#15=IFCAXIS2PLACEMENT2D(#13,#14);
#16=IFCCIRCLE(#15,10.);
#17=IFCTRIMMEDCURVE(#16,(IFCPARAMETERVALUE(0.)),(IFCPARAMETERVALUE(30.)),.T.,.PARAMETER.);
#18=IFCARBITRARYOPENPROFILEDEF(.CURVE.,$,#17);
#19=IFCCARTESIANPOINT((0.,0.,5.));
#20=IFCAXIS2PLACEMENT3D(#19,$,$);
#21=IFCDIRECTION((0.,0.,-1.));
#22=IFCSURFACEOFLINEAREXTRUSION(#18,#20,#21,1.);
#23=IFCCARTESIANPOINT((0.2,0.));
#24=IFCCARTESIANPOINT((0.2,-1.));
#25=IFCCARTESIANPOINT((0.,-1.));
#26=IFCPOLYLINE((#13,#23,#24,#25,#13));
#27=IFCARBITRARYCLOSEDPROFILEDEF(.AREA.,'L 0.2 x 1.0',#26);
#28=IFCSURFACECURVESWEPTAREASOLID(#27,$,#17,$,$,#22);
#29=IFCSHAPEREPRESENTATION(#5,'Body','AdvancedSweptSolid',(#28));
#30=IFCPRODUCTDEFINITIONSHAPE($,$,(#29));
#31=IFCLOCALPLACEMENT($,#4);
#32=IFCBUILDINGELEMENTPROXY('1kTvXnbbzCWw8lcMd1dR4o',$,'Slab edge',$,$,#31,#30,$,$);
ENDSEC;
END-ISO-10303-21;
)IFC";

} // namespace

TEST(SurfaceCurveSweptAreaSolidOmittedPositionHasNoTokenErrors)
{
    webifc::schema::IfcSchemaManager schemaManager;
    webifc::parsing::IfcLoader loader(67108864, 2147483648, 10000, schemaManager);
    const std::string content = SURFACE_CURVE_OMITTED_POSITION_IFC;
    loader.LoadFile([&](char *dest, size_t sourceOffset, size_t destSize)
                    {
                        uint32_t length = (std::min)(content.size() - sourceOffset, destSize);
                        std::memcpy(dest, &content[sourceOffset], length);
                        return length; });

    webifc::cache::IfcCache cache(loader);
    webifc::geometry::IfcGeometryProcessor geometryLoader(loader, schemaManager, 12, true, 1.0E-01, 3.0E-04, 3.0E-04, 1.0E-10, 1.0E-04, 10, 150);

    auto sink = std::make_shared<ErrorCollectingSink>();
    auto logger = spdlog::default_logger();
    logger->sinks().push_back(sink);
    auto mesh = geometryLoader.GetMesh(32);
    logger->sinks().pop_back();

    for (const auto &error : sink->errors)
    {
        ASSERT_EQ(error.find("unexpected token type") == std::string::npos, true);
    }
    ASSERT_EQ(HasGeometry(mesh), true);
}

// Revit slab-edge reproduction from https://github.com/ThatOpen/engine_web-ifc/issues/2338.
// Three IfcBuildingElementProxy products, all sweeping a 0.2 x 1.0 section along a 30 degree
// arc of radius 10 on an IfcSurfaceOfLinearExtrusion extruded along -Z:
//   #32 counter-clockwise directrix and SweptCurve,
//   #46 reversed SweptCurve (SenseAgreement .F.),
//   #53 reversed directrix (clockwise arc).
const char *const SURFACE_CURVE_REFERENCE_ROLL_IFC = R"IFC(ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('Neutral reproduction: IfcSurfaceCurveSweptAreaSolid with an IfcSurfaceOfLinearExtrusion reference surface'),'2;1');
FILE_NAME('surface_curve_reference_roll.ifc','2026-10-30T00:00:00',(''),(''),'','','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#1=IFCCARTESIANPOINT((0.,0.,0.));
#2=IFCDIRECTION((0.,0.,1.));
#3=IFCDIRECTION((1.,0.,0.));
#4=IFCAXIS2PLACEMENT3D(#1,#2,#3);
#5=IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-05,#4,$);
#6=IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.);
#7=IFCSIUNIT(*,.PLANEANGLEUNIT.,$,.RADIAN.);
#8=IFCMEASUREWITHUNIT(IFCPLANEANGLEMEASURE(0.0174532925199433),#7);
#9=IFCDIMENSIONALEXPONENTS(0,0,0,0,0,0,0);
#10=IFCCONVERSIONBASEDUNIT(#9,.PLANEANGLEUNIT.,'DEGREE',#8);
#11=IFCUNITASSIGNMENT((#6,#10));
#12=IFCPROJECT('0YvctVUKr0kugbFTf53O9L',$,'Reference roll',$,$,$,$,(#5),#11);
#13=IFCCARTESIANPOINT((0.,0.));
#14=IFCDIRECTION((1.,0.));
#15=IFCAXIS2PLACEMENT2D(#13,#14);
#16=IFCCIRCLE(#15,10.);
#17=IFCTRIMMEDCURVE(#16,(IFCPARAMETERVALUE(0.)),(IFCPARAMETERVALUE(30.)),.T.,.PARAMETER.);
#18=IFCARBITRARYOPENPROFILEDEF(.CURVE.,$,#17);
#19=IFCCARTESIANPOINT((0.,0.,5.));
#20=IFCAXIS2PLACEMENT3D(#19,$,$);
#21=IFCDIRECTION((0.,0.,-1.));
#22=IFCSURFACEOFLINEAREXTRUSION(#18,#20,#21,1.);
#23=IFCCARTESIANPOINT((0.2,0.));
#24=IFCCARTESIANPOINT((0.2,-1.));
#25=IFCCARTESIANPOINT((0.,-1.));
#26=IFCPOLYLINE((#13,#23,#24,#25,#13));
#27=IFCARBITRARYCLOSEDPROFILEDEF(.AREA.,'L 0.2 x 1.0',#26);
#28=IFCSURFACECURVESWEPTAREASOLID(#27,$,#17,$,$,#22);
#29=IFCSHAPEREPRESENTATION(#5,'Body','AdvancedSweptSolid',(#28));
#30=IFCPRODUCTDEFINITIONSHAPE($,$,(#29));
#31=IFCLOCALPLACEMENT($,#4);
#32=IFCBUILDINGELEMENTPROXY('1kTvXnbbzCWw8lcMd1dR4o',$,'Slab edge',$,$,#31,#30,$,$);
#40=IFCTRIMMEDCURVE(#16,(IFCPARAMETERVALUE(30.)),(IFCPARAMETERVALUE(0.)),.F.,.PARAMETER.);
#41=IFCARBITRARYOPENPROFILEDEF(.CURVE.,$,#40);
#42=IFCSURFACEOFLINEAREXTRUSION(#41,#20,#21,1.);
#43=IFCSURFACECURVESWEPTAREASOLID(#27,$,#17,$,$,#42);
#44=IFCSHAPEREPRESENTATION(#5,'Body','AdvancedSweptSolid',(#43));
#45=IFCPRODUCTDEFINITIONSHAPE($,$,(#44));
#46=IFCBUILDINGELEMENTPROXY('2kTvXnbbzCWw8lcMd1dR4o',$,'Reversed swept curve',$,$,#31,#45,$,$);
#47=IFCAXIS2PLACEMENT3D(#1,#21,#3);
#48=IFCCIRCLE(#47,10.);
#49=IFCTRIMMEDCURVE(#48,(IFCPARAMETERVALUE(-30.)),(IFCPARAMETERVALUE(0.)),.T.,.PARAMETER.);
#50=IFCSURFACECURVESWEPTAREASOLID(#27,$,#49,$,$,#22);
#51=IFCSHAPEREPRESENTATION(#5,'Body','AdvancedSweptSolid',(#50));
#52=IFCPRODUCTDEFINITIONSHAPE($,$,(#51));
#53=IFCBUILDINGELEMENTPROXY('3kTvXnbbzCWw8lcMd1dR4o',$,'Reversed directrix',$,$,#31,#52,$,$);
ENDSEC;
END-ISO-10303-21;
)IFC";

struct SectionExtents
{
    double zMin = std::numeric_limits<double>::infinity();
    double zMax = -std::numeric_limits<double>::infinity();
    double rMin = std::numeric_limits<double>::infinity();
    double rMax = -std::numeric_limits<double>::infinity();
};

// Measures a product in IFC coordinates (Z up): its Z range and its distance from the Z axis.
// The flat mesh is Y-up, so IFC (x, y, z) = (X, -Z, Y) and the radial distance is hypot(X, Z).
SectionExtents MeasureReferenceRollProduct(uint32_t expressID)
{
    webifc::schema::IfcSchemaManager schemaManager;
    webifc::parsing::IfcLoader loader(67108864, 2147483648, 10000, schemaManager);
    const std::string content = SURFACE_CURVE_REFERENCE_ROLL_IFC;
    loader.LoadFile([&](char *dest, size_t sourceOffset, size_t destSize)
                    {
                        uint32_t length = (std::min)(content.size() - sourceOffset, destSize);
                        std::memcpy(dest, &content[sourceOffset], length);
                        return length; });

    webifc::geometry::IfcGeometryProcessor processor(loader, schemaManager, 12, false, 1.0E-01, 3.0E-04, 3.0E-04, 1.0E-10, 1.0E-04, 10, 150);

    SectionExtents extents;
    auto flatMesh = processor.GetFlatMesh(expressID);
    for (const auto &placed : flatMesh.geometries)
    {
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
            extents.zMin = (std::min)(extents.zMin, p.y);
            extents.zMax = (std::max)(extents.zMax, p.y);
            const double r = std::hypot(p.x, p.z);
            extents.rMin = (std::min)(extents.rMin, r);
            extents.rMax = (std::max)(extents.rMax, r);
        }
    }
    return extents;
}

const double SECTION_EPS = 1e-2;

// Slab edge (#32): the section's 1.0 dimension lies along Z (Axis2 = tangent x surface normal),
// its 0.2 dimension along the reference surface normal (radial). Expected values from ifcopenshell.
TEST(SurfaceCurveReferenceRollSlabEdgeSectionFollowsReferenceSurface)
{
    const SectionExtents e = MeasureReferenceRollProduct(32);
    ASSERT_EQ_EPS(e.zMin, -1.0, SECTION_EPS);
    ASSERT_EQ_EPS(e.zMax, 0.0, SECTION_EPS);
    ASSERT_EQ_EPS(e.rMin, 9.8, SECTION_EPS);
    ASSERT_EQ_EPS(e.rMax, 10.0, SECTION_EPS);
}

// Reversed SweptCurve (#46): the surface normal flips, so the section moves outward of the arc.
TEST(SurfaceCurveReferenceRollReversedSweptCurveSectionFollowsReferenceSurface)
{
    const SectionExtents e = MeasureReferenceRollProduct(46);
    ASSERT_EQ_EPS(e.zMin, 0.0, SECTION_EPS);
    ASSERT_EQ_EPS(e.zMax, 1.0, SECTION_EPS);
    ASSERT_EQ_EPS(e.rMin, 10.0, SECTION_EPS);
    ASSERT_EQ_EPS(e.rMax, 10.2, SECTION_EPS);
}

// Reversed directrix (#53): the tangent flips, so Axis2 flips; the section stays inside the arc.
TEST(SurfaceCurveReferenceRollReversedDirectrixSectionFollowsReferenceSurface)
{
    const SectionExtents e = MeasureReferenceRollProduct(53);
    ASSERT_EQ_EPS(e.zMin, 0.0, SECTION_EPS);
    ASSERT_EQ_EPS(e.zMax, 1.0, SECTION_EPS);
    ASSERT_EQ_EPS(e.rMin, 9.8, SECTION_EPS);
    ASSERT_EQ_EPS(e.rMax, 10.0, SECTION_EPS);
}

namespace {
bool NearlyEqual(const glm::dvec3 &a, const glm::dvec3 &b)
{
    return glm::length(a - b) < 1e-9;
}
} // namespace

// Axis1 is the initial normal projected onto the section plane, Axis2 = tangent x Axis1.
// Profile x maps to Axis1 and profile y to Axis2 when rotate90 is used.
TEST(InitialSectionFrameNonAxisNormalMapsXToNormalAndYToTangentCrossNormal)
{
    const glm::dvec3 tangent(0, 1, 0);
    const glm::dvec3 normal = glm::normalize(glm::dvec3(1, 0.5, 1)); // not axis-aligned, not orthogonal to tangent
    glm::dvec3 left, right;
    bimGeometry::InitialSectionFrame(tangent, normal, left, right);

    const glm::dvec3 axis1 = glm::normalize(glm::dvec3(1, 0, 1));
    ASSERT(NearlyEqual(-right, axis1));
    ASSERT(NearlyEqual(-left, glm::cross(tangent, axis1)));
}

// Negative-axis normals must keep profile x along the normal (the old component-wise product mirrored them).
TEST(InitialSectionFrameNegativeAxisNormalKeepsXAlongNormal)
{
    const glm::dvec3 tangent(0, 1, 0);
    const glm::dvec3 normal(0, 0, -1);
    glm::dvec3 left, right;
    bimGeometry::InitialSectionFrame(tangent, normal, left, right);

    ASSERT(NearlyEqual(-right, normal));
    ASSERT(NearlyEqual(-left, glm::cross(tangent, normal)));
}

// A normal parallel to the tangent gives no usable frame; the fallback must stay orthonormal and perpendicular to the tangent.
TEST(InitialSectionFrameNormalParallelToTangentFallsBackToOrthonormalFrame)
{
    const glm::dvec3 tangent(0, 1, 0);
    glm::dvec3 left, right;
    bimGeometry::InitialSectionFrame(tangent, glm::dvec3(0, 2, 0), left, right);

    ASSERT_EQ_EPS(glm::length(left), 1.0, 1e-9);
    ASSERT_EQ_EPS(glm::length(right), 1.0, 1e-9);
    ASSERT_EQ_EPS(glm::dot(left, right), 0.0, 1e-9);
    ASSERT_EQ_EPS(glm::dot(left, tangent), 0.0, 1e-9);
    ASSERT_EQ_EPS(glm::dot(right, tangent), 0.0, 1e-9);
}
