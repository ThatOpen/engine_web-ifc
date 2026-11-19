/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Regression tests: STEP binary literals longer than 65535 characters (e.g. an
// embedded PNG texture in IFCBLOBTEXTURE) must load, not fail the whole file.

#include <algorithm>
#include <cstring>
#include <string>

#include "../web-ifc/parsing/IfcLoader.h"
#include "../web-ifc/schema/IfcSchemaManager.h"

#include "TinyCppTest.hpp"

namespace {

std::string BuildModelWithBinaryLiteral(const std::string &literal)
{
    return std::string(R"IFC(ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [ReferenceView_V1.2]'),'2;1');
FILE_NAME('t.ifc','2026-10-25T00:00:00',('x'),('x'),'hand-written STEP','x','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
)IFC") + "#20=IFCBLOBTEXTURE(.T.,.T.,$,$,$,'PNG'," + literal + ");\n" +
           "#21=IFCLABEL('after');\n" +
           R"IFC(ENDSEC;
END-ISO-10303-21;
)IFC";
}

webifc::parsing::IfcLoader MakeLoader(const std::string &content, webifc::schema::IfcSchemaManager &schemaManager, bool *loaded)
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
    *loaded = ok;
    return loader;
}

} // namespace

// A 70001-character literal exceeds the former 16-bit token length. It must load,
// round-trip byte-for-byte, and leave the token stream aligned for the next line.
TEST(LargeBinaryLiteralLoadsAndKeepsTokenStreamAligned)
{
    std::string blob = "0";
    for (int i = 0; i < 35000; ++i) blob += "AB";
    webifc::schema::IfcSchemaManager schemaManager;
    bool loaded = false;
    auto loader = MakeLoader(BuildModelWithBinaryLiteral("\"" + blob + "\""), schemaManager, &loaded);
    ASSERT_EQ(loaded, true);

    loader.MoveToLineArgument(20, 6);
    const std::string value(loader.GetBinaryArgument());
    ASSERT_EQ(value.size() == blob.size(), true);
    ASSERT_EQ(value == blob, true);

    loader.MoveToLineArgument(21, 0);
    ASSERT_EQ(std::string(loader.GetStringArgument()) == "after", true);
}

// Invalid hex inside a binary literal must still reject the file.
TEST(MalformedBinaryLiteralStillRejected)
{
    webifc::schema::IfcSchemaManager schemaManager;
    bool loaded = true;
    MakeLoader(BuildModelWithBinaryLiteral("\"0G\""), schemaManager, &loaded);
    ASSERT_EQ(loaded, false);
}
