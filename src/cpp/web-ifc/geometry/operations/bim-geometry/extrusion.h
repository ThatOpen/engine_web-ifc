#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "buffers.h"

using Vec = glm::dvec3;

#pragma once

namespace bimGeometry {
    
    struct Extrusion
    { 
        double len;
        glm::dvec3 dir;
        std::vector<glm::dvec3> profile;

        void SetValues(std::vector<double> profile_, std::vector<double> dir_, double len_);
        Buffers GetBuffers();
    };
}