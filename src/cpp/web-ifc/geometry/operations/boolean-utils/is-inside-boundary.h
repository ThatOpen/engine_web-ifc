    #pragma once

#include <glm/glm.hpp>
#include <iostream>
#include <stack>
#include "intersect-ray-tri.h"
#include "geometry.h"
#include "bvh.h"
#include <set>

namespace fuzzybools
{

    inline bool isInsideBoundary(
        glm::dvec2 t1, 
        glm::dvec2 t2, 
        glm::dvec2 t3, 
        const std::set<std::pair<size_t, size_t>>& edges, 
        const std::vector<glm::dvec2>& projectedPoints)
    {
        // Compute the centroid of the triangle
        glm::dvec2 centroid = (t1 + t2 + t3) / 3.0;

        // Use the ray casting algorithm to determine if the centroid is inside the polygon
        int crossings = 0;

        for (const auto& edge : edges) {
            glm::dvec2 p1 = projectedPoints[edge.first];
            glm::dvec2 p2 = projectedPoints[edge.second];

            // Check if the edge crosses the horizontal line at centroid.y
            if ((p1.y > centroid.y) != (p2.y > centroid.y)) {
                // Compute the x-coordinate of the intersection point
                double xIntersection = p1.x + (p2.x - p1.x) * (centroid.y - p1.y) / (p2.y - p1.y);
                if (xIntersection > centroid.x) {
                    crossings++;
                }
            }
        }

        // If crossings are odd, the point is inside the polygon
        return (crossings % 2) == 1;
    }
}