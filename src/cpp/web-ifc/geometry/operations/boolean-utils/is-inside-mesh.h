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
#include <cmath>
#include <iostream>
#include <stack>
#include "intersect-ray-tri.h"
#include "geometry.h"
#include "bvh.h"

using Vec = glm::dvec3;

namespace fuzzybools
{
    inline const Vec RAY_DIRECTION_PERTURBATION(0.02, 0.01, 0.04);
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
        bool onBoundary = false;
        bool ambiguous = false;
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
        dir += RAY_DIRECTION_PERTURBATION;
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
                bool onPerimeter = false;
                bool hasIntersection = intersect_ray_triangle(pt, pt + dir, a, b, c, intersection, distance, d_plane, true, &onPerimeter);
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
                        result.onBoundary = true;
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
                    result.ambiguous = result.ambiguous || onPerimeter;
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

    // Generalized winding numbers remain meaningful for a consistently oriented surface
    // with small gaps, where an odd/even ray count can label exterior points as interior.
    // Jacobson et al. (2013): https://igl.ethz.ch/projects/winding-number/
    inline MeshLocation windingLocation(const Vec &pt, const Geometry &g)
    {
        double angle = 0;
        for (uint32_t i = 0; i < g.numFaces; i++)
        {
            const auto f = g.GetFace(i);
            Vec a = g.GetPoint(f.i0) - pt;
            Vec b = g.GetPoint(f.i1) - pt;
            Vec c = g.GetPoint(f.i2) - pt;
            const double la = glm::length(a), lb = glm::length(b), lc = glm::length(c);
            if (la == 0 || lb == 0 || lc == 0) continue;
            a /= la; b /= lb; c /= lc;
            angle += 2 * std::atan2(glm::dot(a, glm::cross(b, c)),
                1 + glm::dot(a, b) + glm::dot(b, c) + glm::dot(c, a));
        }
        return std::abs(angle) > 2 * std::acos(-1.0) ? MeshLocation::INSIDE : MeshLocation::OUTSIDE;
    }

    // Use the complete operands here, not the open subsets used while normalizing planes.
    // A closed solid gives the same parity in both ray directions. If a gap or duplicated
    // surface makes them disagree, resolve the query using the oriented surface as a whole.
    inline InsideResult classifyPointInSolid(const Vec &pt, Vec normal, const Geometry &g,
        BVH &bvh, Vec dir, bool UNION = false)
    {
        auto forward = isInsideMesh(pt, normal, g, bvh, dir, UNION);
        if (forward.onBoundary) return forward;
        // isInsideMesh adds this offset internally; compensate to reverse the actual ray.
        auto reverse = isInsideMesh(pt, normal, g, bvh, -dir - 2.0 * RAY_DIRECTION_PERTURBATION, UNION);
        if (reverse.onBoundary) return reverse;
        if (forward.ambiguous || reverse.ambiguous || forward.loc != reverse.loc)
            forward.loc = windingLocation(pt, g);
        return forward;
    }
}
