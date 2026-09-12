#include <sstream>
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


namespace webifc::parsing {
    void p21encode(std::string_view input, std::ostringstream& output);
}

TEST(UnicodeRoundTrip)
{
    for (const std::string input : {"Õ'", "C:\\Models\\a.ifc", "😀", "Õ😀ä"})
    {
        std::ostringstream output;
        webifc::parsing::p21encode(input, output);
        const std::string encoded = output.str();
        std::string_view view = encoded;
        ASSERT_EQ(webifc::parsing::p21decode(view), input);
    }
}

TEST(UnicodeBounds)
{
    std::string_view nbsp = "\\S\\ ";
    ASSERT_EQ(webifc::parsing::p21decode(nbsp), "\xC2\xA0");
    for (std::string_view encoded : {"\\X2\\00\\X0\\", "\\X2\\D800\\X0\\", "\\X4\\00110000\\X0\\"})
        ASSERT_EQ(webifc::parsing::p21decode(encoded), "");
}
