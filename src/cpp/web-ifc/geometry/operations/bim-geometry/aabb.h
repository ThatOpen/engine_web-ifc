#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "buffers.h"

using Vec = glm::dvec3;

#pragma once

namespace bimGeometry {
    
    struct AABB
    {
        uint32_t index;
        Vec min = Vec(DBL_MAX, DBL_MAX, DBL_MAX);
        Vec max = Vec(-DBL_MAX, -DBL_MAX, -DBL_MAX);
        Vec center = Vec();

        bool intersects(const AABB& other) const;
        bool contains(const Vec& pos) const;
        void merge(const AABB& other);
        void merge(const glm::dvec3& other);
        bool Intersect(const Vec& origin, const Vec& dir) const;
        void SetValues(double minX, double minY, double minZ, double maxX, double maxY, double maxZ);
        Buffers GetBuffers();
    };
}