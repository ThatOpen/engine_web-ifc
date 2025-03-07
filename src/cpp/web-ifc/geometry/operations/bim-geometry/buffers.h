#include <vector>
#include <algorithm>
#include <glm/glm.hpp>

#pragma once

namespace bimGeometry {
    struct Buffers
    {
        std::vector<float> fvertexData;
        std::vector<uint32_t> indexData;
        void AddPoint(glm::dvec3 pt);
        void AddTri(uint32_t p1, uint32_t p2, uint32_t p3);
        void AddTri(glm::dvec3 p1, glm::dvec3 p2, glm::dvec3 p3);
    };
}