#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "curve.h"
#include "buffers.h"

#pragma once

namespace bimGeometry {
	struct Parabola : Curve
	{
        uint16_t segments;
        glm::dvec2 startPoint;
        double HorizontalLength;
        double StartHeight;
        double StartGradient;
        double EndGradient;

        void SetValues(uint16_t segments, double startPointX, double startPointY, double startPointZ, double HorizontalLength, double StartHeight, double StartGradient, double EndGradient);
        Buffers GetBuffers();
    };
}