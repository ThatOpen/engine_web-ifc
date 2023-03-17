/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
namespace webifc::utility
{
	
	struct LoaderSettings
	{
		bool COORDINATE_TO_ORIGIN = false;
		bool USE_FAST_BOOLS = true; //TODO: This needs to be fixed in the future to rely on elalish/manifold
		int CIRCLE_SEGMENTS_LOW = 5;
		int CIRCLE_SEGMENTS_MEDIUM = 8;
		int CIRCLE_SEGMENTS_HIGH = 12;
		int BOOL_ABORT_THRESHOLD = 10000; // 10k verts
    	uint32_t TAPE_SIZE = 67108864 ; // probably no need for anyone other than web-ifc devs to change this
    	uint32_t MEMORY_LIMIT =  3221225472;
	};
}