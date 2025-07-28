#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "curve.h"
#include "buffers.h"

#pragma once

namespace bimGeometry {
	struct Profile
	{
        uint16_t pType;
        double width;
        double depth; 
        double thickness; 
        double flangeThickness; 
        bool hasFillet;
        double filletRadius; 
        double radius;
        double slope;
        uint16_t numSegments;
        std::vector<double> placement;
        Curve profile;

        void SetValues(uint16_t _pType, double _width, double _depth, double _webThickness, double _flangeThickness, bool _hasFillet, double _filletRadius, double _radius, double _slope, uint16_t _numSegments, std::vector<double> _placement);
        Buffers GetBuffers();
    };
}