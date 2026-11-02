/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Regression tests for #2332: malformed STEP input must fail or return,
// never loop forever in the argument walkers (IfcLoader::GetSetArgument and friends).
// Run these with a process-level timeout, because a regression shows up as a hang.

#include <cmath>
#include <cstring>
#include <stdexcept>
#include <string>

#include "../web-ifc/parsing/IfcLoader.h"
#include "../web-ifc/cache/IfcCache.h"
#include "../web-ifc/modelmanager/ModelManager.h"
#include "../web-ifc/schema/IfcSchemaManager.h"
#include "../web-ifc/schema/ifc-schema.h"

#include "TinyCppTest.hpp"

namespace {

// Valid IFC4 model with a unit assignment, a project, an aggregation and one
// extruded element. Lines 19 and 44 are replaced by the caller to inject faults.
std::string BuildModel(const std::string &line19, const std::string &line44)
{
    return std::string(R"IFC(ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [ReferenceView_V1.2]'),'2;1');
FILE_NAME('t.ifc','2026-10-25T00:00:00',('x'),('x'),'hand-written STEP','x','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#1=IFCPERSON($,'x',$,$,$,$,$,$);
#2=IFCORGANIZATION($,'x',$,$,$);
#3=IFCPERSONANDORGANIZATION(#1,#2,$);
#4=IFCAPPLICATION(#2,'0.1','x','x');
#5=IFCOWNERHISTORY(#3,#4,$,.ADDED.,$,$,$,0);
#6=IFCSIUNIT(*,.LENGTHUNIT.,.MILLI.,.METRE.);
#7=IFCUNITASSIGNMENT((#6));
#8=IFCCARTESIANPOINT((0.,0.,0.));
#9=IFCDIRECTION((0.,0.,1.));
#10=IFCDIRECTION((1.,0.,0.));
#11=IFCAXIS2PLACEMENT3D(#8,#9,#10);
#12=IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-05,#11,$);
#13=IFCPROJECT('0xxxxxxxxxxxxxxxxxxxx1',#5,'P',$,$,$,$,(#12),#7);
#14=IFCLOCALPLACEMENT($,#11);
#15=IFCSITE('0xxxxxxxxxxxxxxxxxxxx2',#5,'Site',$,$,#14,$,$,.ELEMENT.,$,$,$,$,$);
#16=IFCBUILDING('0xxxxxxxxxxxxxxxxxxxx3',#5,'B',$,$,#14,$,$,.ELEMENT.,$,$,$);
#17=IFCBUILDINGSTOREY('0xxxxxxxxxxxxxxxxxxxx4',#5,'S0',$,$,#14,$,$,.ELEMENT.,0.);
#18=IFCBUILDINGSTOREY('0xxxxxxxxxxxxxxxxxxxx5',#5,'S1',$,$,#14,$,$,.ELEMENT.,3000.);
)IFC") + line19 + "\n" +
           R"IFC(#40=IFCCARTESIANPOINT((0.,0.));
#41=IFCCARTESIANPOINT((1000.,0.));
#42=IFCCARTESIANPOINT((1000.,1000.));
#43=IFCCARTESIANPOINT((0.,1000.));
)IFC" + line44 + "\n" +
           R"IFC(#45=IFCARBITRARYCLOSEDPROFILEDEF(.AREA.,$,#44);
#46=IFCEXTRUDEDAREASOLID(#45,#11,#9,1000.);
#47=IFCSHAPEREPRESENTATION(#12,'Body','SweptSolid',(#46));
#48=IFCPRODUCTDEFINITIONSHAPE($,$,(#47));
#30=IFCBUILDINGELEMENTPROXY('0xxxxxxxxxxxxxxxxxxxx7',#5,'Block',$,$,#14,#48,$,$);
ENDSEC;
END-ISO-10303-21;
)IFC";
}

const std::string kValidRelAggregates = "#19=IFCRELAGGREGATES('0xxxxxxxxxxxxxxxxxxxx6',#5,$,$,#16,(#17,#18));";
const std::string kValidPolyline = "#44=IFCPOLYLINE((#40,#41,#42,#43,#40));";

// Issue #2332 reproducer, verbatim: #61 references #62, which does not exist.
const std::string kDanglingUnitReference = R"IFC(ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [ReferenceView_V1.2]'),'2;1');
FILE_NAME('t.ifc','2026-10-25T00:00:00',('x'),('x'),'hand-written STEP','x','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#1=IFCPERSON($,'x',$,$,$,$,$,$);
#2=IFCORGANIZATION($,'x',$,$,$);
#3=IFCPERSONANDORGANIZATION(#1,#2,$);
#4=IFCAPPLICATION(#2,'0.1','x','x');
#5=IFCOWNERHISTORY(#3,#4,$,.ADDED.,$,$,$,0);
#6=IFCSIUNIT(*,.LENGTHUNIT.,.MILLI.,.METRE.);
#7=IFCUNITASSIGNMENT((#6,#61));
#60=IFCDIMENSIONALEXPONENTS(0,0,0,0,0,0,0);
#61=IFCCONVERSIONBASEDUNIT(#60,.PLANEANGLEUNIT.,'DEGREE',#62);
#63=IFCSIUNIT(*,.PLANEANGLEUNIT.,$,.RADIAN.);
#8=IFCCARTESIANPOINT((0.,0.,0.));
#9=IFCDIRECTION((0.,0.,1.));
#10=IFCDIRECTION((1.,0.,0.));
#11=IFCAXIS2PLACEMENT3D(#8,#9,#10);
#12=IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-05,#11,$);
#13=IFCPROJECT('0xxxxxxxxxxxxxxxxxxxxx',#5,'P',$,$,$,$,(#12),#7);
ENDSEC;
END-ISO-10303-21;
)IFC";

webifc::parsing::IfcLoader MakeLoader(const std::string &content, webifc::schema::IfcSchemaManager &schemaManager, bool *loaded = nullptr)
{
    webifc::parsing::IfcLoader loader(67108864, 2147483648, 10000, schemaManager);
    // Capture by value: the token stream reads the source lazily, after this function returned.
    const bool ok = loader.LoadFile([content](char *dest, size_t sourceOffset, size_t destSize)
                    {
                        if (sourceOffset >= content.size()) return uint32_t(0);
                        uint32_t length = (std::min)(content.size() - sourceOffset, destSize);
                        std::memcpy(dest, &content[sourceOffset], length);
                        return length;
                    });
    if (loaded != nullptr) *loaded = ok;
    return loader;
}

} // namespace

// Reproducer from #2332: the first geometry-independent step (IfcCache construction,
// which walks the unit assignment) spun forever on the dangling #62 reference.
TEST(MalformedDanglingUnitReferenceDoesNotHang)
{
    webifc::schema::IfcSchemaManager schemaManager;
    auto loader = MakeLoader(kDanglingUnitReference, schemaManager);
    webifc::cache::IfcCache cache(loader);
    // MILLI METRE is still applied; the conversion unit with the missing reference is skipped.
    ASSERT_EQ(std::abs(cache.GetLinearScalingFactor() - 0.001) < 1e-12, true);
}

// #2332 table: "#19=IFCRELAGGREGATES('x',#5,$,$,#16);" (too few attributes).
TEST(MalformedRelAggregatesTooFewArgumentsDoesNotHang)
{
    webifc::schema::IfcSchemaManager schemaManager;
    auto loader = MakeLoader(BuildModel("#19=IFCRELAGGREGATES('x',#5,$,$,#16);", kValidPolyline), schemaManager);
    webifc::cache::IfcCache cache(loader);
    ASSERT_EQ(std::abs(cache.GetLinearScalingFactor() - 0.001) < 1e-12, true);
}

// #2332 table: the closing "));" of IFCRELAGGREGATES is missing.
TEST(MalformedRelAggregatesUnclosedDoesNotHang)
{
    webifc::schema::IfcSchemaManager schemaManager;
    auto loader = MakeLoader(BuildModel("#19=IFCRELAGGREGATES('x',#5,$,$,#16,(#17,#18;", kValidPolyline), schemaManager);
    webifc::cache::IfcCache cache(loader);
    ASSERT_EQ(std::abs(cache.GetLinearScalingFactor() - 0.001) < 1e-12, true);
}

// #2332 table: "#44=IFCPOLYLINE();" hangs in ComputeCurve while meshing.
TEST(MalformedEmptyPolylineDoesNotHang)
{
    webifc::manager::LoaderSettings settings;
    webifc::manager::ModelManager manager(false);
    uint32_t modelID = manager.CreateModel(settings);
    const std::string content = BuildModel(kValidRelAggregates, "#44=IFCPOLYLINE();");
    manager.GetIfcLoader(modelID)->LoadFile([&](char *dest, size_t sourceOffset, size_t destSize)
                                            {
                                                if (sourceOffset >= content.size()) return uint32_t(0);
                                                uint32_t length = (std::min)(content.size() - sourceOffset, destSize);
                                                std::memcpy(dest, &content[sourceOffset], length);
                                                return length;
                                            });
    // The element's profile is an empty polyline, so it has no geometry. Reporting an error
    // is also acceptable; returning geometry built from an empty profile is not.
    bool threw = false;
    size_t geometryCount = 0;
    try
    {
        geometryCount = manager.GetGeometryProcessor(modelID)->GetFlatMesh(30).geometries.size();
    }
    catch (const std::exception &)
    {
        threw = true;
    }
    ASSERT_EQ(threw || geometryCount == 0, true);
}

// #2332: "FILE_SCHEMA();" hung in GetSchema(). Falls back to IFC2X3 like a missing FILE_SCHEMA.
TEST(MalformedEmptyFileSchemaDoesNotHang)
{
    const std::string content = R"IFC(ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('Default'),'1');
FILE_NAME('test.ifc','2026-10-25T00:00:00',('('),(''),'hand-written STEP','');
FILE_SCHEMA();
ENDSEC;
DATA;
ENDSEC;
END-ISO-10303-21;
)IFC";
    webifc::schema::IfcSchemaManager schemaManager;
    auto loader = MakeLoader(content, schemaManager);
    ASSERT_EQ(loader.GetSchema() == IFC2X3, true);
}

// Every truncation of a valid model must load, build the cache and read the schema
// without hanging or crashing (the #2332 truncation sweep, reduced to a unit test).
TEST(TruncatedModelsDoNotHang)
{
    const auto content = BuildModel(kValidRelAggregates, kValidPolyline);
    // The schema comes from FILE_SCHEMA. A prefix reports IFC4 only if it loads and contains the
    // complete FILE_SCHEMA statement (up to its ';'). Otherwise GetSchema falls back to IFC2X3:
    // either the header is missing, or the prefix ends inside a string literal and fails to parse.
    const auto fileSchema = std::string("FILE_SCHEMA(('IFC4'));");
    const size_t fileSchemaEnd = content.find(fileSchema) + fileSchema.size();
    webifc::schema::IfcSchemaManager schemaManager;
    for (size_t cut = 0; cut <= content.size(); cut++)
    {
        const auto truncated = content.substr(0, cut);
        auto loaded = false;
        auto loader = MakeLoader(truncated, schemaManager, &loaded);
        webifc::cache::IfcCache cache(loader);
        const auto headerComplete = loaded && cut >= fileSchemaEnd;
        const IFC_SCHEMA expected = headerComplete ? IFC4 : IFC2X3;
        const IFC_SCHEMA actual = loader.GetSchema();
        ASSERT_EQ(actual == expected, true);
    }
}
