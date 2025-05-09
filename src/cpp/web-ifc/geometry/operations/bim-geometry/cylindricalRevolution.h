#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "buffers.h"

using Vec = glm::dvec3;

#pragma once

namespace bimGeometry {
    
    struct CylindricalRevolution
    { 
        double numRots;
        glm::dmat4 transform;
        double startDegrees;
        double endDegrees;
        double minZ;
        double maxZ;
        double radius;
        std::vector<glm::dvec3> profile;

        void SetValues(std::vector<double> transform_, double startDegrees_, double endDegrees_, double minZ_, double maxZ_, double numRots_, double radius);
        Buffers GetBuffers();
    };
}