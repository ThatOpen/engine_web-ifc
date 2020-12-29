#pragma once

#include <glm/glm.hpp>
#include <iostream>

#include "intersect-ray-tri.h"
#include "util.h"

namespace webifc
{
    enum class MeshLocation
    {
        INSIDE,
        OUTSIDE,
        BOUNDARY
    };

    MeshLocation isInsideMesh(const glm::dvec3& pt, glm::dvec3 normal, IfcGeometry& g)
    {
        glm::dvec3 dir(1, 1.1, 1.3);

        int winding = 0;
        for (int i = 0; i < g.faces.size(); i++)
        {
            Face& f = g.faces[i];
            const glm::dvec3& a = g.points[f.i0];
            const glm::dvec3& b = g.points[f.i1];
            const glm::dvec3& c = g.points[f.i2];

            glm::dvec3 intersection;
            double distance;
            bool hasIntersection = intersect_ray_triangle(pt, pt + dir, a, b, c, intersection, distance, true);
            if (hasIntersection)
            {
                glm::dvec3 otherNormal = computeNormal(a, b, c);
                double d = glm::dot(otherNormal, dir);
                double dn = glm::dot(otherNormal, normal);
                if (std::fabs(distance) < EPS_SMALL)
                {
                    if (dn >= 1 - EPS_SMALL)
                    {
                        // normals facing same direction, means an inside boundary
                        return MeshLocation::BOUNDARY;
                    }
                    else
                    {
                        // normals facing away, means that these touch
                        return MeshLocation::OUTSIDE;
                    }
                }
                if (d >= 0)
                {
                    winding++;
                }
                else
                {
                    winding--;
                }
            }
        }

        return winding > 0 ? MeshLocation::INSIDE : MeshLocation::OUTSIDE;
    }
}