/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once 

#include <iomanip>
#include <iostream>
#include <string>
#include <locale>
#include <codecvt>

std::string p21encode(std::string_view input) 
{   
    std::stringstream stream;
    std::string stringInput(input);
    std::string tmp;
    bool inEncode=false;
    for (char c : stringInput) {
        if (c > 126 || c < 32) { 
            if (!inEncode) 
            {
                inEncode = true;
                tmp=c;
                continue;
            } else {
                tmp+=c;
                continue;
            }
        } else {
            if (inEncode) {
                std::u16string utf16 = std::wstring_convert<std::codecvt_utf8_utf16<char16_t>, char16_t>{}.from_bytes(tmp.data());
                stream << "\\X2\\" << std::hex <<std::setw(4)<<std::setfill('0') << std::uppercase;
                for (char16_t uC : utf16) stream << uC;
                stream << std::dec<< std::setw(1) << "\\X0\\";
                inEncode=false;
                tmp="";
                continue;
            }
        }
        stream << c;
    }
    return stream.str();
}

std::string getAsStringWithBigE(double theNumber)
{
    std::stringstream stream;
    stream << theNumber;
    if (floor(theNumber) == theNumber) stream <<".";
    std::string s = stream.str();

    for (unsigned int j = 0; j < s.length(); j++)
    {
        if (s[j] == 'e')
        {
            s[j] = 'E';
            break;
        }
    }
    return s;
}


double ConvertPrefix(const std::string &prefix)
{
 if (prefix == "")
 {
	 return 1;
 }
 else if (prefix == "EXA")
 {
	 return 1e18;
 }
 else if (prefix == "PETA")
 {
	 return 1e15;
 }
 else if (prefix == "TERA")
 {
	 return 1e12;
 }
 else if (prefix == "GIGA")
 {
	 return 1e9;
 }
 else if (prefix == "MEGA")
 {
	 return 1e6;
 }
 else if (prefix == "KILO")
 {
	 return 1e3;
 }
 else if (prefix == "HECTO")
 {
	 return 1e2;
 }
 else if (prefix == "DECA")
 {
	 return 10;
 }
 else if (prefix == "DECI")
 {
	 return 1e-1;
 }
 else if (prefix == "CENTI")
 {
	 return 1e-2;
 }
 else if (prefix == "MILLI")
 {
	 return 1e-3;
 }
 else if (prefix == "MICRO")
 {
	 return 1e-6;
 }
 else if (prefix == "NANO")
 {
	 return 1e-9;
 }
 else if (prefix == "PICO")
 {
	 return 1e-12;
 }
 else if (prefix == "FEMTO")
 {
	 return 1e-15;
 }
 else if (prefix == "ATTO")
 {
	 return 1e-18;
 }
 else
 {
	 return 1;
 }
}