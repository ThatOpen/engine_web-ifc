/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <cstring>
#include <cmath>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>

#include "../web-ifc/parsing/IfcLoader.h"
#include "../web-ifc/cache/IfcCache.h"
#include "../web-ifc/schema/IfcSchemaManager.h"
#include "../web-ifc/schema/ifc-schema.h"

#include "TinyCppTest.hpp"

namespace {

webifc::parsing::IfcLoader CreateLoaderFromContent(const std::string &content)
{
    static webifc::schema::IfcSchemaManager schemaManager;
    webifc::parsing::IfcLoader loader(67108864, 2147483648, 10000, schemaManager);
    loader.LoadFile([&](char *dest, size_t sourceOffset, size_t destSize)
                    {
                        uint32_t length = (std::min)(content.size() - sourceOffset, destSize);
                        std::memcpy(dest, &content[sourceOffset], length);
                        return length;
                    });
    return loader;
}

IFC_SCHEMA GetSchemaEnumFromLoader(webifc::parsing::IfcLoader &loader)
{
    return loader.GetSchema();
}

TEST(GetSchemaTestIFC4)
{
    const std::string ifc4Content = "ISO-10303-21;\n"
                                    "HEADER;\n"
                                    "FILE_DESCRIPTION((\'ViewDefinition [ReferenceView_V1.2]\',\'one building, two storeys, no geometry\'),\'2;1\');\n"
                                    "FILE_NAME(\'two-storeys.ifc\',\'2026-10-25T00:00:00\',(\'(\'),(\'\'),\'hand-written STEP\',\'\');\n"
                                    "FILE_SCHEMA((\'IFC4\'));\n"
                                    "ENDSEC;\n"
                                    "DATA;\n"
                                    "#1=IFCPERSON($,\'Forge\',$,$,$,$,$,$);\n"
                                    "#2=IFCORGANIZATION($,\'Eron World\',$,$,$);\n"
                                    "#3=IFCPERSONANDORGANIZATION(#1,#2,$);\n"
                                    "#4=IFCAPPLICATION(#2,\'0.1\',\'fixtures\',\'plan-forge\');\n"
                                    "#5=IFCOWNERHISTORY(#3,#4,$,.ADDED.,$,$,$,0);\n"
                                    "#6=IFCSIUNIT(*,.LENGTHUNIT.,.MILLI.,.METRE.);\n"
                                    "#7=IFCUNITASSIGNMENT((#6));\n"
                                    "#8=IFCCARTESIANPOINT((0.,0.,0.));\n"
                                    "#9=IFCDIRECTION((0.,0.,1.));\n"
                                    "#10=IFCDIRECTION((1.,0.,0.));\n"
                                    "#11=IFCAXIS2PLACEMENT3D(#8,#9,#10);\n"
                                    "#12=IFCGEOMETRICREPRESENTATIONCONTEXT($,\'Model\',3,1.E-05,#11,$);\n"
                                    "#13=IFCPROJECT(\'0forgeFixtureProject00\',#5,\'Two storeys (IFC4)\',$,$,$,$,(#12),#7);\n"
                                    "#14=IFCLOCALPLACEMENT($,#11);\n"
                                    "#15=IFCSITE(\'0forgeFixtureSite00000\',#5,\'Site\',$,$,#14,$,$,.ELEMENT.,$,$,$,$,$);\n"
                                    "#16=IFCBUILDING(\'0forgeFixtureBuilding0\',#5,\'Fixture building\',$,$,#14,$,$,.ELEMENT.,$,$,$);\n"
                                    "#17=IFCBUILDINGSTOREY(\'0forgeFixtureStorey000\',#5,\'Planta 0\',$,$,#14,$,$,.ELEMENT.,0.);\n"
                                    "#18=IFCBUILDINGSTOREY(\'0forgeFixtureStorey001\',#5,\'Planta 1\',$,$,#14,$,$,.ELEMENT.,3000.);\n"
                                    "#19=IFCRELAGGREGATES(\'0forgeFixtureRelAggr00\',#5,$,$,#13,(#15));\n"
                                    "#20=IFCRELAGGREGATES(\'0forgeFixtureRelAggr01\',#5,$,$,#15,(#16));\n"
                                    "#21=IFCRELAGGREGATES(\'0forgeFixtureRelAggr02\',#5,$,$,#16,(#17,#18));\n"
                                    "ENDSEC;\n"
                                    "END-ISO-10303-21;";

    auto loader = CreateLoaderFromContent(ifc4Content);
    auto schema = GetSchemaEnumFromLoader(loader);
    ASSERT_EQ(schema == IFC4, true);
}

TEST(GetSchemaTestIFC2X3)
{
    const std::string ifc2x3Content = "ISO-10303-21;\n"
                                      "HEADER;\n"
                                      "FILE_DESCRIPTION((\'Default\'),\'1\');\n"
                                      "FILE_NAME(\'test.ifc\',\'2026-10-25T00:00:00\',(\'(\'),(\'\'),\'hand-written STEP\',\'\');\n"
                                      "FILE_SCHEMA((\'IFC2X3\'));\n"
                                      "ENDSEC;\n"
                                      "DATA;\n"
                                      "ENDSEC;\n"
                                      "END-ISO-10303-21;";

    auto loader = CreateLoaderFromContent(ifc2x3Content);
    auto schema = GetSchemaEnumFromLoader(loader);
    ASSERT_EQ(schema == IFC2X3, true);
}

TEST(GetSchemaTestIFC4X3)
{
    const std::string ifc4x3Content = "ISO-10303-21;\n"
                                      "HEADER;\n"
                                      "FILE_DESCRIPTION((\'Default\'),\'1\');\n"
                                      "FILE_NAME(\'test.ifc\',\'2026-10-25T00:00:00\',(\'(\'),(\'\'),\'hand-written STEP\',\'\');\n"
                                      "FILE_SCHEMA((\'IFC4X3\'));\n"
                                      "ENDSEC;\n"
                                      "DATA;\n"
                                      "ENDSEC;\n"
                                      "END-ISO-10303-21;";

    auto loader = CreateLoaderFromContent(ifc4x3Content);
    auto schema = GetSchemaEnumFromLoader(loader);
    ASSERT_EQ(schema == IFC4X3, true);
}

TEST(GetSchemaTestNoFileSchema)
{
    const std::string noFileSchemaContent = "ISO-10303-21;\n"
                                              "HEADER;\n"
                                              "FILE_DESCRIPTION((\'Default\'),\'1\');\n"
                                              "FILE_NAME(\'test.ifc\',\'2026-10-25T00:00:00\',(\'(\'),(\'\'),\'hand-written STEP\',\'\');\n"
                                              "ENDSEC;\n"
                                              "DATA;\n"
                                              "ENDSEC;\n"
                                              "END-ISO-10303-21;";

    auto loader = CreateLoaderFromContent(noFileSchemaContent);
    auto schema = GetSchemaEnumFromLoader(loader);
    ASSERT_EQ(schema == IFC2X3, true);
}

} // namespace
