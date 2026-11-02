/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <algorithm>
#include <cstring>
#include <memory>
#include <mutex>
#include <string>
#include <vector>

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
