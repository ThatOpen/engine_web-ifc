#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "curve.h"
#include "buffers.h"

#pragma once

namespace bimGeometry {
	struct Clothoid : Curve
	{
        uint16_t segments;
        glm::dvec2 startPoint;
        double ifcStartDirection;
        double StartRadiusOfCurvature;
        double EndRadiusOfCurvature;
        double SegmentLength;

        void SetValues(uint16_t segments, double startPointX, double startPointY, double startPointZ, double ifcStartDirection, double StartRadiusOfCurvature, double EndRadiusOfCurvature, double SegmentLength);
        Buffers GetBuffers();
    };
}