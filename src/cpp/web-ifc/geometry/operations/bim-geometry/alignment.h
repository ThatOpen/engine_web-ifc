#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "curve.h"
#include "buffers.h"

#pragma once

namespace bimGeometry {
	struct Alignment : Curve
	{
        uint16_t segments;
        std::vector<glm::dvec3> horizontal;
        std::vector<glm::dvec3> vertical;

        void SetValues(std::vector<double> horizontal, std::vector<double> vertical);
        Buffers GetBuffers();
    };
}