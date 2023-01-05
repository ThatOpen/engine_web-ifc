#include "TinyCppTest.hpp"
#include "../include/parsing/p21decode.h"

using namespace std;

TEST(EscapeSymbols)
{
    auto str = p21decode("\\\\ ''");
    ASSERT_EQ(str, "\\ '");
}

TEST(EscapeXTest)
{
    auto str = p21decode("see \\X\\A7 4.1");
    ASSERT_EQ(str, "see § 4.1");
}

TEST(EscapeX2Test)
{
    auto str = p21decode("\\X2\\03C0\\X0\\");
    ASSERT_EQ(str, "π");
    
    str = p21decode("\\X2\\03B103B203B3\\X0\\");
    ASSERT_EQ(str, "αβγ");
}

TEST(EscapeX4Test)
{
    auto str = p21decode("\\X4\\0000041F0000044000000438000004320000043500000442000000200000041C0000043800000440\\X0\\");
    ASSERT_EQ(str, "Привет Мир");
}

TEST(EscapeSTest)
{
    auto str = p21decode("\\S\\Drger");
    ASSERT_EQ(str, "Ärger");

    str = p21decode("h\\S\\ttel");
    ASSERT_EQ(str, "hôtel");
}

TEST(EscapePTest)
{
    auto str = p21decode("\\PE\\\\S\\*\\S\\U\\S\\b");
    ASSERT_EQ(str, "Њет");
}
