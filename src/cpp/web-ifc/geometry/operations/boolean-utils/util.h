/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include <sstream>
#include <fstream>
#include <vector>
#include <array>
#include <unordered_map>
#include <optional>

#include <glm/glm.hpp>

#include "eps.h"
#include "aabb.h"

#define CONST_PI 3.141592653589793238462643383279502884L

namespace fuzzybools
{
	static void writeFile(std::wstring filename, std::string data)
	{
#ifdef _MSC_VER
        std::wstring fullPath = L"debug_output/" + filename;
        std::wofstream out(fullPath.c_str());
        out << data.c_str();
#endif
	}
}