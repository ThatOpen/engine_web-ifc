#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "buffers.h"

#pragma once

namespace bimGeometry {
    void Buffers::AddPoint(glm::dvec3 pt)
    {
        fvertexData.push_back(pt.x);
        fvertexData.push_back(pt.y);
        fvertexData.push_back(pt.z);
    }
    void Buffers::AddTri(uint32_t p1, uint32_t p2, uint32_t p3)
    {
        indexData.push_back(p1);
        indexData.push_back(p2);
        indexData.push_back(p3);
    }
}