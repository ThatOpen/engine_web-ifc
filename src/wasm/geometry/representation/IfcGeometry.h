/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

// Represents a single piece of IFC Geometry

#pragma once

#include <vector>
#include <string>
#include <glm/glm.hpp>
#include <fuzzy/geometry.h>

#include "geometry.h"

namespace webifc::geometry {

	struct IfcGeometry : fuzzybools::Geometry
	{
		void ReverseFaces();
		uint32_t GetVertexData();
		void AddGeometry(fuzzybools::Geometry geom);
		uint32_t GetVertexDataSize();
		uint32_t GetIndexData();
		uint32_t GetIndexDataSize();
		private:
			void ReverseFace(uint32_t index);

	};

}