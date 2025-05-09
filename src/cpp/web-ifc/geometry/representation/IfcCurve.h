
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

//Curve Implementation of a Curve

#pragma once
#include <vector>
#include <string>
#include <glm/glm.hpp>
#include "../operations/bim-geometry/curve.h"

namespace webifc::geometry {

	struct IfcCurve : bimGeometry::Curve
	{
		std::vector<uint32_t> arcSegments;
		std::vector<std::string> userData;
		std::vector<uint16_t> indices;
		glm::dvec2 Get2d(size_t i) const;
		glm::dvec3 Get3d(size_t i) const;
		glm::dmat4 getPlacementAtDistance(double length);
		
		private:
			static constexpr double EPS_TINY = 1e-9;
	};

}