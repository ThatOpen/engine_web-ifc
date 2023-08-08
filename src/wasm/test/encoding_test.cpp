#include "TinyCppTest.hpp"

namespace webifc::parsing {
    std::string p21decode(std::string_view & str);
}

using namespace std;

TEST(EscapeSymbols)
{
    string_view strIn = "\\\\ ''"sv;
    auto str = webifc::parsing::p21decode(strIn);
    ASSERT_EQ(str, "\\ '");
}

TEST(EscapeXTest)
{
    string_view strIn ="see \\X\\A7 4.1"sv;
    auto str = webifc::parsing::p21decode(strIn);
    ASSERT_EQ(str, "see § 4.1");
}

TEST(EscapeX2Test)
{
    string_view strIn ="\\X2\\03C0\\X0\\"sv;
    auto str = webifc::parsing::p21decode(strIn);
    ASSERT_EQ(str, "π");
    
    strIn ="\\X2\\03B103B203B3\\X0\\"sv;
    str = webifc::parsing::p21decode(strIn);
    ASSERT_EQ(str, "αβγ");
}

TEST(EscapeX4Test)
{
    string_view strIn ="\\X4\\0000041F0000044000000438000004320000043500000442000000200000041C0000043800000440\\X0\\"sv;
    auto str = webifc::parsing::p21decode(strIn);
    ASSERT_EQ(str, "Привет Мир");
}

TEST(EscapeSTest)
{
    string_view strIn ="\\S\\Drger"sv;
    auto str = webifc::parsing::p21decode(strIn);
    ASSERT_EQ(str, "Ärger");

    strIn = "h\\S\\ttel"sv;
    str = webifc::parsing::p21decode(strIn);
    ASSERT_EQ(str, "hôtel");
}

TEST(EscapePTest)
{
    string_view strIn = "\\PE\\\\S\\*\\S\\U\\S\\b"sv;
    auto str = webifc::parsing::p21decode(strIn);
    ASSERT_EQ(str, "Њет");
}
