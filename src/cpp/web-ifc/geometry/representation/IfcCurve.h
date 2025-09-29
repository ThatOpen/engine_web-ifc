
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
		glm::dvec3 endTangent = glm::dvec3(0,0,0);
		// Stores the precise analytic tangent for the start of each segment, in case of IfcCurveSegment
		std::vector<glm::dvec3> segmentStartTangents;

		glm::dvec2 Get2d(size_t i) const;
		glm::dvec3 Get3d(size_t i) const;
		
		enum CurvePlacementMode { TangentAsZAxis, GlobalZAxis };
		/// \brief Get a transformation matrix at a specified distance along the curve. Z axis is aligned with the curve tangent, or with global z axis, depending on mode
		glm::dmat4 getPlacementAtDistance(double distance, CurvePlacementMode mode);

	protected:
		static constexpr double EPS_TINY = 1e-9;
	};

}