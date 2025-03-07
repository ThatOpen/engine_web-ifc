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
    void Buffers::AddTri(glm::dvec3  p1, glm::dvec3  p2, glm::dvec3  p3)
    {
        AddPoint(p1);
        AddPoint(p2);
        AddPoint(p3);
        int id = fvertexData.size() / 3;
        AddTri(id - 3, id - 2, id - 1);
    }
}