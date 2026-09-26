/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/*
    This function was revised on 2024-03-17.  Further review is needed once we have an overview
    of the entire package.

    Parameter normal is assumed to be normalised.
    Function computeNormal returns a normalised vector.

    The constants TOLERANCE_PLANE_DEVIATION and toleranceParallel are defined in eps.h.
*/
#pragma once

#include <glm/glm.hpp>
#include <iostream>
#include <stack>
#include "intersect-ray-tri.h"
#include "geometry.h"
#include "bvh.h"

using Vec = glm::dvec3;

namespace fuzzybools
{
    enum class MeshLocation
    {
        INSIDE,
        OUTSIDE,
        BOUNDARY
    };

    struct InsideResult
    {
        MeshLocation loc;
        Vec normal;
    };

    // True when pt lies on triangle abc up to rounding. Both the plane and the edge distances are
    // relative to the triangle size, so it behaves the same for millimetre and metre models and
    // does not widen the plane deviation tolerance of the ray test.
    inline bool isPointOnTriangle(const Vec &pt, const Vec &a, const Vec &b, const Vec &c)
    {
        Vec n = glm::cross(b - a, c - a);
        double nLength = glm::length(n);
        if (nLength < EPS_MINISCULE)
        {
            return false;
        }
        n /= nLength;
        double size = std::max(glm::length(b - a), std::max(glm::length(c - b), glm::length(a - c)));
        double distance = glm::dot(pt - a, n);
        if (std::fabs(distance) > EDGE_ON_TOLERANCE * size)
        {
            return false;
        }
        Vec p = pt - n * distance;
        const Vec vertices[3] = {a, b, c};
        for (int i = 0; i < 3; i++)
        {
            Vec edge = vertices[(i + 1) % 3] - vertices[i];
            double edgeLength = glm::length(edge);
            double side = glm::dot(glm::cross(edge, p - vertices[i]), n) / edgeLength;
            if (side < -EDGE_ON_TOLERANCE * edgeLength)
            {
                return false;
            }
        }
        return true;
    }

    inline InsideResult isInsideMesh(
        const Vec &pt,
        Vec normal,
        const Geometry &g,
        BVH &bvh,
        Vec dir = Vec(1.0, 1.1, 1.4),
        bool UNION = false)
    {
        int winding = 0;
        dir = dir + Vec(0.02, 0.01, 0.04); // Randomly changing the normal to create a truly random direction for raytrace
        InsideResult result;
        result.loc = MeshLocation::BOUNDARY;
        result.normal = glm::dvec3(0);

        double dirLength = dir.length();

        bool hasResult = bvh.IntersectRay(pt, dir, [&](uint32_t i) -> bool
                                          {
                Face f = g.GetFace(i);
                const Vec a = g.GetPoint(f.i0);
                const Vec b = g.GetPoint(f.i1);
                const Vec c = g.GetPoint(f.i2);

                Vec intersection;
                double distance;
                double d_plane;
                bool hasIntersection = intersect_ray_triangle(pt, pt + dir, a, b, c, intersection, distance, d_plane, true);
                if (!hasIntersection && isPointOnTriangle(pt, a, b, c))
                {
                    // A point on an edge shared by two coplanar triangles can miss both of them
                    // in the ray test through rounding; it still lies on the surface.
                    hasIntersection = true;
                    d_plane = 0;
                }
                if (hasIntersection)
                {
                    Vec otherNormal = computeNormal(a, b, c);  // normalised
                    double d = glm::dot(otherNormal, dir);
                    double dn = glm::dot(otherNormal, normal);
                    if (std::fabs(d_plane) < _TOLERANCE_PLANE_DEVIATION)
                    {
                        if (dn > 1.0 - toleranceParallel)
                        {
/*
                            The normals point in the same direction, which means that the boundary is
                            an inside boundary.
*/
                            result.loc = MeshLocation::BOUNDARY;
                            result.normal = normal;
                            return true;
                        }
                        else if (dn < -1.0 + toleranceParallel)
                        {
/*
                            The normals point in opposite directions, which means that the boundary is
                            an outside boundary.
*/
                            if(!UNION)
                            {
                                result.loc = MeshLocation::OUTSIDE;
                                result.normal = normal;
                                return true;
                            }
                            else
                            {
                                result.loc = MeshLocation::BOUNDARY;
                                result.normal = normal;
                                return true;
                            }
                        }
                        else
                        {
                            result.loc = MeshLocation::BOUNDARY;
                            result.normal = otherNormal;
                            return true;
                        }    
                    }

                    // It will never reach the --else-- code
//                  if (true || d >= 0)
                    // if (true || d > toleranceParallelTight)
                    // {
                    winding++;
                    // }
                    // else
                    // {
                    //     winding--;
                    // }
                }

                // Continue to search.
                return false; });

        if (hasResult)
        {
            return result;
        }

        result.loc = winding % 2 == 1 ? MeshLocation::INSIDE : MeshLocation::OUTSIDE;

        return result;
    }
}
