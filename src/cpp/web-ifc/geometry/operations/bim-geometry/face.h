#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
using Vec = glm::dvec3;

#pragma once

namespace bimGeometry {
    struct Face
    {
        int i0;
        int i1;
        int i2;
        int pId;
    };
}