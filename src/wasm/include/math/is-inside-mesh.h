/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
 #pragma once

#include <glm/glm.hpp>
#include <iostream>

#include "intersect-ray-tri.h"
#include "../util.h"

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
        glm::dvec3 dir(1, 1.1, 1.4);
        glm::dvec3 dir2(1.4, 1.1, 1);

        int winding = 0;
        for (uint32_t i = 0; i < g.numFaces; i++)
        {
            Face f = g.GetFace(i);
            const glm::dvec3 a = g.GetPoint(f.i0);
            const glm::dvec3 b = g.GetPoint(f.i1);
            const glm::dvec3 c = g.GetPoint(f.i2);

            glm::dvec3 intersection;
            double distance;
            bool hasIntersection = intersect_ray_triangle(pt, pt + dir, a, b, c, intersection, distance, true);
            if (hasIntersection)
            {
                glm::dvec3 otherNormal = computeNormal(a, b, c);
                double d = glm::dot(otherNormal, dir);
                double dn = glm::dot(otherNormal, normal);
                if (std::fabs(distance) < EPS_BIG)
                {
                    if (dn >= 1 - EPS_SMALL)
                    {
                        // normals facing same direction, means an inside boundary
                        return MeshLocation::BOUNDARY;
                    }
                    else if (dn <= -1 + EPS_SMALL)
                    {
                        // normals facing away, means that these touch
                        return MeshLocation::OUTSIDE;
                    }
                }

                if (true || d >= 0)
                {
                    winding++;
                }
                else
                {
                    winding--;
                }
            }
        }

        return winding % 2 == 1 ? MeshLocation::INSIDE : MeshLocation::OUTSIDE;
    }
}