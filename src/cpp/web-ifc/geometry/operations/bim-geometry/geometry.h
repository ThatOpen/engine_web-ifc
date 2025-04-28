#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "aabb.h"
#include "face.h"

#pragma once

namespace bimGeometry {
    
    struct Geometry
    {
        std::vector<float> fvertexData;
        std::vector<double> vertexData;
        std::vector<uint32_t> indexData;
        uint32_t numPoints = 0;
		uint32_t numFaces = 0;

        AABB GetAABB() const;
        Vec GetPoint(size_t index) const;
        Face GetFace(size_t index) const;
        void AddFace(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c);
        void AddFace(uint32_t a, uint32_t b, uint32_t c);
        void AddPoint(glm::dvec4& pt, glm::dvec3& n);
		void AddPoint(glm::dvec3& pt, glm::dvec3& n);
    };
}