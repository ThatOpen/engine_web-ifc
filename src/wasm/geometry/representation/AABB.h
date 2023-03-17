/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Representation of an area bounding ox

#pragma once

#include <glm/glm.hpp>

constexpr double EPS_BIG = 1e-4;

namespace webifc::geometry {

	struct AABB
	{
		uint32_t index;
		glm::dvec3 min = glm::dvec3(DBL_MAX, DBL_MAX, DBL_MAX);
		glm::dvec3 max = glm::dvec3(-DBL_MAX, -DBL_MAX, -DBL_MAX);
		glm::dvec3 center = glm::dvec3();
		bool intersects(const AABB &other) const;
		void merge(const AABB &other);
		// https://gamedev.stackexchange.com/questions/18436/most-efficient-aabb-vs-ray-collision-algorithms
		bool Intersect(const glm::dvec3 &origin, const glm::dvec3 &dir) const;
	};
}