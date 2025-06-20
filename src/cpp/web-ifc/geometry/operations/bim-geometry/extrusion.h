#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "buffers.h"

using Vec = glm::dvec3;

#pragma once

namespace bimGeometry {
    
    struct Extrusion
    { 
        bool cap;
        double len;
        glm::dvec3 dir; 
        glm::dvec3 cuttingPlanePos;
        glm::dvec3 cuttingPlaneNormal;
        std::vector<glm::dvec3> profile;
        std::vector<std::vector<glm::dvec3>> holes;

        void SetValues(std::vector<double> profile_, std::vector<double> dir_, double len_, std::vector<double> cuttingPlaneNormal_, std::vector<double> cuttingPlanePos_, bool cap_);
        void SetHoles(std::vector<double> hole_);
        void ClearHoles();
        Buffers GetBuffers();
    };
}