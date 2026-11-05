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

// Reproduction for https://github.com/ThatOpen/engine_web-ifc/issues/65:
// a Simplebim-normalized IFC2X3 model that carries materials by name only and
// contains no surface styles at all, so consumers must be able to tell the
// unstyled (neutral default) colour apart from a real material.
const char *const ISSUE65_FIXTURE = "/issue65/test_energieausweis_abstractBIM.ifc";

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

// Three IfcBuildingElementProxy products sharing one geometric context:
// #23 red styled extruded solid, #34 unstyled extruded solid,
// #67 faceted brep whose green style sits on the IfcClosedShell (#60).
const char *const STYLED_BOXES_IFC = R"IFC(ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('Color propagation for styled sub-items'),'2;1');
FILE_NAME('styled_boxes.ifc','2026-11-05T00:00:00',(''),(''),'','','');
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
#12=IFCPROJECT('0YvctVUKr0kugbFTf53O9L',$,'Styled boxes',$,$,$,$,(#5),#11);
#13=IFCCARTESIANPOINT((0.,0.));
#14=IFCCARTESIANPOINT((1.,0.));
#15=IFCCARTESIANPOINT((1.,1.));
#16=IFCCARTESIANPOINT((0.,1.));
#17=IFCPOLYLINE((#13,#14,#15,#16,#13));
#18=IFCARBITRARYCLOSEDPROFILEDEF(.AREA.,$,#17);
#19=IFCEXTRUDEDAREASOLID(#18,#4,#2,3.);
#20=IFCSHAPEREPRESENTATION(#5,'Body','SweptSolid',(#19));
#21=IFCPRODUCTDEFINITIONSHAPE($,$,(#20));
#22=IFCLOCALPLACEMENT($,#4);
#23=IFCBUILDINGELEMENTPROXY('1kTvXnbbzCWw8lcMd1dR4o',$,'styled solid box',$,$,#22,#21,$,$);
#24=IFCCOLOURRGB($,1.,0.,0.);
#25=IFCSURFACESTYLESHADING(#24,$);
#26=IFCSURFACESTYLE('Red',.BOTH.,(#25));
#27=IFCSTYLEDITEM(#19,(#26),$);
#28=IFCCARTESIANPOINT((6.,0.,0.));
#29=IFCAXIS2PLACEMENT3D(#28,#2,#3);
#30=IFCEXTRUDEDAREASOLID(#18,#29,#2,3.);
#31=IFCSHAPEREPRESENTATION(#5,'Body','SweptSolid',(#30));
#32=IFCPRODUCTDEFINITIONSHAPE($,$,(#31));
#33=IFCLOCALPLACEMENT($,#4);
#34=IFCBUILDINGELEMENTPROXY('2kTvXnbbzCWw8lcMd1dR4o',$,'unstyled box',$,$,#33,#32,$,$);
#35=IFCCARTESIANPOINT((1.,0.,0.));
#36=IFCCARTESIANPOINT((1.,1.,0.));
#37=IFCCARTESIANPOINT((0.,1.,0.));
#38=IFCCARTESIANPOINT((0.,0.,1.));
#39=IFCCARTESIANPOINT((1.,0.,1.));
#40=IFCCARTESIANPOINT((1.,1.,1.));
#41=IFCCARTESIANPOINT((0.,1.,1.));
#42=IFCPOLYLOOP((#1,#37,#36,#35));
#43=IFCPOLYLOOP((#38,#39,#40,#41));
#44=IFCPOLYLOOP((#1,#35,#39,#38));
#45=IFCPOLYLOOP((#35,#36,#40,#39));
#46=IFCPOLYLOOP((#36,#37,#41,#40));
#47=IFCPOLYLOOP((#37,#1,#38,#41));
#48=IFCFACEOUTERBOUND(#42,.T.);
#49=IFCFACEOUTERBOUND(#43,.T.);
#50=IFCFACEOUTERBOUND(#44,.T.);
#51=IFCFACEOUTERBOUND(#45,.T.);
#52=IFCFACEOUTERBOUND(#46,.T.);
#53=IFCFACEOUTERBOUND(#47,.T.);
#54=IFCFACE((#48));
#55=IFCFACE((#49));
#56=IFCFACE((#50));
#57=IFCFACE((#51));
#58=IFCFACE((#52));
#59=IFCFACE((#53));
#60=IFCCLOSEDSHELL((#54,#55,#56,#57,#58,#59));
#61=IFCFACETEDBREP(#60);
#62=IFCSHAPEREPRESENTATION(#5,'Body','SweptSolid',(#61));
#63=IFCPRODUCTDEFINITIONSHAPE($,$,(#62));
#64=IFCCARTESIANPOINT((12.,0.,0.));
#65=IFCAXIS2PLACEMENT3D(#64,#2,#3);
#66=IFCLOCALPLACEMENT($,#65);
#67=IFCBUILDINGELEMENTPROXY('3kTvXnbbzCWw8lcMd1dR4o',$,'styled shell brep',$,$,#66,#63,$,$);
#68=IFCCOLOURRGB($,0.,1.,0.);
#69=IFCSURFACESTYLESHADING(#68,$);
#70=IFCSURFACESTYLE('Green',.BOTH.,(#69));
#71=IFCSTYLEDITEM(#60,(#70),$);
ENDSEC;
END-ISO-10303-21;
)IFC";

bool Nearly(double a, double b)
{
    return std::fabs(a - b) < 1e-9;
}

size_t TotalVertexDataSize(webifc::geometry::IfcGeometryProcessor &processor, const webifc::geometry::IfcFlatMesh &flatMesh)
{
    size_t total = 0;
    for (const auto &placed : flatMesh.geometries)
    {
        auto &geometry = processor.GetGeometry(placed.geometryExpressID);
        // GetVertexDataSize() reports the float cache, which GetVertexData() fills lazily
        geometry.GetVertexData();
        total += geometry.GetVertexDataSize();
    }
    return total;
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

} // namespace

// The issue-65 file has no IfcSurfaceStyle/IfcStyledItem anywhere, so every
// placed geometry must report hasColor == false with the neutral default
// colour, while the roof slabs, windows, doors and walls still produce
// geometry (the original geometry aspect of the issue).
TEST(Issue65UnstyledModelReportsHasColorFalseAndProducesGeometry)
{
    const std::string content = ReadFixture(ISSUE65_FIXTURE);
    ASSERT_EQ(content.empty(), false);

    webifc::schema::IfcSchemaManager schemaManager;
    webifc::parsing::IfcLoader loader(67108864, 2147483648, 10000, schemaManager);
    LoadIfcContent(loader, content);

    webifc::geometry::IfcGeometryProcessor processor(loader, schemaManager, 12, false, 1.0E-01, 3.0E-04, 3.0E-04, 1.0E-10, 1.0E-04, 10, 150);

    uint32_t walls = 0;
    uint32_t slabs = 0;
    uint32_t doors = 0;
    uint32_t windows = 0;

    // The fixture has fewer entities than bytes, so the file size is a safe scan bound.
    const uint32_t scanBound = static_cast<uint32_t>(content.size());
    for (uint32_t id = 1; id <= scanBound; id++)
    {
        if (!loader.IsValidExpressID(id))
        {
            continue;
        }

        const uint32_t lineType = loader.GetLineType(id);
        if (lineType != webifc::schema::IFCWALLSTANDARDCASE &&
            lineType != webifc::schema::IFCSLAB &&
            lineType != webifc::schema::IFCDOOR &&
            lineType != webifc::schema::IFCWINDOW)
        {
            continue;
        }

        if (lineType == webifc::schema::IFCWALLSTANDARDCASE) walls++;
        if (lineType == webifc::schema::IFCSLAB) slabs++;
        if (lineType == webifc::schema::IFCDOOR) doors++;
        if (lineType == webifc::schema::IFCWINDOW) windows++;

        const auto flatMesh = processor.GetFlatMesh(id);
        ASSERT_EQ(flatMesh.geometries.size() > 0, true);
        ASSERT_EQ(TotalVertexDataSize(processor, flatMesh) > 0, true);
        for (const auto &placed : flatMesh.geometries)
        {
            ASSERT_EQ(placed.hasColor, false);
            ASSERT_EQ(placed.color.x, 1.0);
            ASSERT_EQ(placed.color.y, 1.0);
            ASSERT_EQ(placed.color.z, 1.0);
            ASSERT_EQ(placed.color.w, 1.0);
        }
    }

    ASSERT_EQ(walls, 9);
    ASSERT_EQ(slabs, 7);
    ASSERT_EQ(doors, 9);
    ASSERT_EQ(windows, 7);
}

// A style attached directly to a representation item must reach the placed
// geometry with hasColor set; an unstyled sibling keeps the default.
TEST(StyledRepresentationItemReportsHasColorTrue)
{
    webifc::schema::IfcSchemaManager schemaManager;
    webifc::parsing::IfcLoader loader(67108864, 2147483648, 10000, schemaManager);
    LoadIfcContent(loader, STYLED_BOXES_IFC);

    webifc::geometry::IfcGeometryProcessor processor(loader, schemaManager, 12, false, 1.0E-01, 3.0E-04, 3.0E-04, 1.0E-10, 1.0E-04, 10, 150);

    const auto styled = processor.GetFlatMesh(23);
    ASSERT_EQ(styled.geometries.size() > 0, true);
    ASSERT_EQ(TotalVertexDataSize(processor, styled) > 0, true);
    for (const auto &placed : styled.geometries)
    {
        ASSERT_EQ(placed.hasColor, true);
        ASSERT_EQ(Nearly(placed.color.x, 1.0), true);
        ASSERT_EQ(Nearly(placed.color.y, 0.0), true);
        ASSERT_EQ(Nearly(placed.color.z, 0.0), true);
    }

    const auto unstyled = processor.GetFlatMesh(34);
    ASSERT_EQ(unstyled.geometries.size() > 0, true);
    ASSERT_EQ(TotalVertexDataSize(processor, unstyled) > 0, true);
    for (const auto &placed : unstyled.geometries)
    {
        ASSERT_EQ(placed.hasColor, false);
        ASSERT_EQ(placed.color.x, 1.0);
        ASSERT_EQ(placed.color.w, 1.0);
    }
}

// A style on the outer shell of a faceted brep used to be copied into the mesh
// without the hasColor flag and was therefore dropped when the flat mesh was
// assembled; it must now be reported and rendered.
TEST(StyledBrepShellReportsHasColorTrue)
{
    webifc::schema::IfcSchemaManager schemaManager;
    webifc::parsing::IfcLoader loader(67108864, 2147483648, 10000, schemaManager);
    LoadIfcContent(loader, STYLED_BOXES_IFC);

    webifc::geometry::IfcGeometryProcessor processor(loader, schemaManager, 12, false, 1.0E-01, 3.0E-04, 3.0E-04, 1.0E-10, 1.0E-04, 10, 150);

    auto sink = std::make_shared<ErrorCollectingSink>();
    auto logger = spdlog::default_logger();
    logger->sinks().push_back(sink);
    const auto brep = processor.GetFlatMesh(67);
    logger->sinks().pop_back();

    for (const auto &error : sink->errors)
    {
        ASSERT_EQ(error.find("unexpected face type") == std::string::npos, true);
    }

    ASSERT_EQ(brep.geometries.size() > 0, true);
    ASSERT_EQ(TotalVertexDataSize(processor, brep) > 0, true);
    for (const auto &placed : brep.geometries)
    {
        ASSERT_EQ(placed.hasColor, true);
        ASSERT_EQ(Nearly(placed.color.x, 0.0), true);
        ASSERT_EQ(Nearly(placed.color.y, 1.0), true);
        ASSERT_EQ(Nearly(placed.color.z, 0.0), true);
    }
}
