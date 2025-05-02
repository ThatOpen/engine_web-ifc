#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "buffers.h"

using Vec = glm::dvec3;

#pragma once

namespace bimGeometry {
    
    struct CircularSweep
    { 
        double scaling;
        bool closed;
        std::vector<glm::dvec3> profilePoints; 
        double radius;
        std::vector<glm::dvec3> directrix;
        glm::dvec3 initialDirectrixNormal;
        bool rotate90;


        void SetValues(double scaling_, bool closed_, std::vector<double> profilePoints_, double radius_, std::vector<double> directrix_, std::vector<double> initialDirectrixNormal_, bool rotate90_);
        Buffers GetBuffers();
    };
}