#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "utils.h"
#include "curve.h"
#include "buffers.h"

#pragma once

namespace bimGeometry {
	struct Arc : Curve
	{
        float radiusX;
        float radiusY;
        int numSegments;
        glm::dmat3 placement = glm::dmat3(1);
        double startRad = 0;
        double endRad = CONST_PI * 2;
        bool swap = true;
        bool normalToCenterEnding = false;

        void SetValues(float radiusX, float radiusY, int numSegments, std::vector<double> placement, double startRad = 0, double endRad = CONST_PI * 2, bool swap = true, bool normalToCenterEnding = false);
        Buffers GetBuffers();
    };
}