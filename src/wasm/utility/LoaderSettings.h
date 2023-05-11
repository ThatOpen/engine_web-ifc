/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
namespace webifc::utility
{
	
	struct LoaderSettings
	{
		bool COORDINATE_TO_ORIGIN = false;
		int CIRCLE_SEGMENTS = 12;
    	uint32_t TAPE_SIZE = 67108864 ; // probably no need for anyone other than web-ifc devs to change this
    	uint32_t MEMORY_LIMIT =  3221225472;
	};
}