/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <cstdint>

namespace webifc::utility
{
	
	struct LoaderSettings
	{
		bool OPTIMIZE_PROFILES = false;
		bool COORDINATE_TO_ORIGIN = false;
		uint16_t CIRCLE_SEGMENTS = 12;
		uint32_t TAPE_SIZE = 67108864 ; // probably no need for anyone other than web-ifc devs to change this
		uint32_t MEMORY_LIMIT = 2147483648;
	};
}