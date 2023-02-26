#include "TinyCppTest.hpp"

namespace webifc::parsing {
    std::string p21decode(const char * str);
}

using namespace std;

TEST(EscapeSymbols)
{
    auto str = webifc::parsing::p21decode("\\\\ ''");
    ASSERT_EQ(str, "\\ '");
}

TEST(EscapeXTest)
{
    auto str = webifc::parsing::p21decode("see \\X\\A7 4.1");
    ASSERT_EQ(str, "see § 4.1");
}

TEST(EscapeX2Test)
{
    auto str = webifc::parsing::p21decode("\\X2\\03C0\\X0\\");
    ASSERT_EQ(str, "π");
    
    str = webifc::parsing::p21decode("\\X2\\03B103B203B3\\X0\\");
    ASSERT_EQ(str, "αβγ");
}

TEST(EscapeX4Test)
{
    auto str = webifc::parsing::p21decode("\\X4\\0000041F0000044000000438000004320000043500000442000000200000041C0000043800000440\\X0\\");
    ASSERT_EQ(str, "Привет Мир");
}

TEST(EscapeSTest)
{
    auto str = webifc::parsing::p21decode("\\S\\Drger");
    ASSERT_EQ(str, "Ärger");

    str = webifc::parsing::p21decode("h\\S\\ttel");
    ASSERT_EQ(str, "hôtel");
}

TEST(EscapePTest)
{
    auto str = webifc::parsing::p21decode("\\PE\\\\S\\*\\S\\U\\S\\b");
    ASSERT_EQ(str, "Њет");
}
