#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "buffers.h"

using Vec = glm::dvec3;

#pragma once

namespace bimGeometry {
    
    struct Revolve
    { 
        double numRots;
        glm::dmat4 transform;
        double startDegrees;
        double endDegrees;
        std::vector<glm::dvec3> profile;

        void SetValues(std::vector<double> profile_, std::vector<double> transform_, double startDegrees_, double endDegrees_, uint32_t numRots_);
        Buffers GetBuffers();
    };
}