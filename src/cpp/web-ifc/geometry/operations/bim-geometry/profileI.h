#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "curve.h"
#include "buffers.h"

#pragma once

namespace bimGeometry {
	struct ProfileI
	{
        double width;
        double depth; 
        double webThickness; 
        double flangeThickness; 
        bool hasFillet;
        double filletRadius; 
        std::vector<double> placement;
        Curve profile;

        void SetValues(double width, double depth, double webThickness, double flangeThickness, bool hasFillet, double filletRadius, std::vector<double> placement);
        Buffers GetBuffers();
    };
}