
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
		glm::dvec2 ret;
		ret.x = points.at(i).x;
		ret.y = points.at(i).y;
		return ret;
	}

	glm::dvec3 IfcCurve::Get3d(size_t i) const
	{
		return points.at(i);
	}

	void IfcCurve::Add(glm::dvec3 pt)
	{
		if (points.empty())
			points.push_back(pt);
		else if (!equals(pt, points.back(), EPS_TINY))
			points.push_back(pt);
	}

	void IfcCurve::Add(glm::dvec2 pt)
	{
		glm::dvec3 point;
		point.x = pt.x;
		point.y = pt.y;
		point.z = 0;
		Add(point);
	}

	void IfcCurve::Invert()
	{
		std::reverse(points.begin(), points.end());
	}

	bool IfcCurve::IsCCW() const
	{
		double sum = 0;
		auto n = points.size();

		for (size_t i = 0; i < n; i++)
		{
			glm::dvec3 pt1 = points.at((i + n - 1) % n);
			glm::dvec3 pt2 = points.at(i);

			sum += (pt2.x - pt1.x) * (pt2.y + pt1.y);
		}

		return sum < 0;
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