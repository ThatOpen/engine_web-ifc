#include <vector>
#include <algorithm>
#include <glm/glm.hpp>

#pragma once

namespace bimGeometry {
	struct Curve
	{
		std::vector<glm::dvec3> points;
		
        void Invert();
		bool IsCCW() const;
        void Add(glm::dvec3 pt, bool removeCoincident = true);
		void Add(glm::dvec2 pt);
    };
}