/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
 #pragma once

#include <glm/glm.hpp>

#include "../util.h"

namespace webifc
{

	bool allEqual(bool b1, bool b2, bool b3, bool b4)
	{
		return b1 == b2 && b1 == b3 && b1 == b4;
	}

	bool doLineSegmentsIntersect(const glm::dvec2& p, const glm::dvec2& p2, const glm::dvec2& q, const glm::dvec2& q2, bool extendQ = false) {
		glm::dvec2 r = p2 - p;
		glm::dvec2 s = q2 - q;

		double uNumerator = cross2d(q - p, r);
		double denominator = cross2d(r, s);

		if (uNumerator == 0 && denominator == 0) {
			// They are coLlinear

			// Do they touch? (Are any of the points equal?)
			if (equals2d(p, q) || equals2d(p, q2) || equals2d(p2, q) || equals2d(p2, q2))
			{
				return true;
			}

			// Do they overlap? (Are all the point differences in either direction the same sign)
			return !allEqual(
				(q.x - p.x < 0),
				(q.x - p2.x < 0),
				(q2.x - p.x < 0),
				(q2.x - p2.x < 0)) ||
				!allEqual(
					(q.y - p.y < 0),
					(q.y - p2.y < 0),
					(q2.y - p.y < 0),
					(q2.y - p2.y < 0));
		}

		if (denominator == 0) {
			// lines are paralell
			return false;
		}

		double u = uNumerator / denominator;
		double t = cross2d(q - p, s) / denominator;

		return (t >= 0) && (t <= 1) && (u >= 0) && (extendQ || (u <= 1));
	}
}