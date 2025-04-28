#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "buffers.h"

using Vec = glm::dvec3;

#pragma once

namespace bimGeometry {
    
    struct Sweep
    { 
        double scaling;
        bool closed;
        std::vector<glm::dvec3> profilePoints;
        std::vector<glm::dvec3> directrix;
        glm::dvec3 initialDirectrixNormal;
        bool rotate90;
        bool optimize;

        void SetValues(double scaling_, bool closed_, std::vector<double> profilePoints_, std::vector<double> directrix_, std::vector<double> initialDirectrixNormal_, bool rotate90_, bool optimize_);
        Buffers GetBuffers();
    };
}