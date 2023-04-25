
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

//Curve Implementation of a Curve

#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "IfcCurve.h"

namespace webifc::geometry {


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
		if (points.empty()) points.push_back(pt);
		else if (!equals(pt,points.back(),EPS_TINY)) points.push_back(pt);
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

		for (size_t i = 0; i < points.size(); i++)
		{
			glm::dvec3 pt1 = points.at((i - 1) % points.size());
			glm::dvec3 pt2 = points.at(i);

			sum += (pt2.x - pt1.x) * (pt2.y + pt1.y);
		}

		return sum < 0;
	}
}