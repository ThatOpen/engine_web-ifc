
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

// Curve Implementation of a Curve

#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "IfcCurve.h"
namespace webifc::geometry
{


	inline	bool equals(glm::dvec3 A, glm::dvec3 B, double eps = 0)
	{
		return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps && std::fabs(A.z - B.z) <= eps;
	}

	
	glm::dvec2 IfcCurve::Get2d(size_t i) const 
	{
		const glm::dvec3 &ret = points.at(i);
		return { ret.x, ret.y };
	}

	glm::dvec3 IfcCurve::Get3d(size_t i) const
	{
		return points.at(i);
	}

	glm::dmat4 IfcCurve::getPlacementAtDistance(double length)
	{
		double totalDistance = 0;
		glm::dvec3 pos;
		glm::dvec3 vx = glm::dvec3(1, 0, 0);
		glm::dvec3 vy = glm::dvec3(0, 1, 0);
		glm::dvec3 vz = glm::dvec3(0, 0, 1);
		if (points.size() > 1)
		{
			for (uint32_t i = 0; i < points.size() - 1; i++)
			{
				double distance = glm::distance(points[i], points[i + 1]);
				totalDistance += distance;
				if (totalDistance >= length)
				{
					double factor = (totalDistance - length) / distance;
					pos = points[i] * factor + points[i + 1] * (1 - factor);
					glm::dvec3 tan = points[i + 1] - points[i];
					vx = glm::cross(tan, vz);
					vy = glm::cross(vx, tan);
					vz = tan;
					vx = glm::normalize(vx);
					vy = glm::normalize(vy);
					vz = glm::normalize(vz);

					break;
				}
			}
		}
		return glm::dmat4(
			glm::dvec4(vx, 0),
			glm::dvec4(vy, 0),
			glm::dvec4(vz, 0),
			glm::dvec4(pos, 1));
	}
}