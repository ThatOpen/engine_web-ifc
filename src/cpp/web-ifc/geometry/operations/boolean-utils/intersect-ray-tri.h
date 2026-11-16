/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/*
    2024-03-17
    ==========

    This function was rewritten on 2024-03-17 using the following reference as a guide.
    https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-rendering-a-triangle/ray-triangle-intersection-geometric-solution.html
    Also useful is the site
    https://iquilezles.org/articles/intersectors/

    The constants TOLERANCE_INSIDE_OUTSIDE_PERIMETER and toleranceParallelTight are set in eps.h.

    The parameter infiniteLength is retained but not used.  It probably could be purged along with references elsewhere.
*/

#pragma once
#include <glm/glm.hpp>
#include "eps.h"
#include "math.h"
using Vec = glm::dvec3;
namespace fuzzybools
{
        static bool intersect_ray_triangle(
            const Vec &origin,
            const Vec &end,
            const Vec &v0,
            const Vec &v1,
            const Vec &v2,
            Vec &hitPosition,
            double &t,
            double &d_plane,
            bool infiniteLength = false,
            bool *onPerimeter = nullptr)
        {
                /*
                        Compute the direction of the ray from origin to end.
                */
                Vec dir = end - origin;
                if (onPerimeter) *onPerimeter = false;

                /*
                        Compute the normal to the plane defined by v0, v1 and v2.
                        This normal vector is not normalised.
                */
                Vec v0v1 = v1 - v0;
                Vec v0v2 = v2 - v0;
                Vec n = glm::cross(v0v1, v0v2);

                double nLength = glm::length(n);
                double dirLength = glm::length(dir);
                if (nLength == 0 || dirLength == 0) return false;

                /*
                        Step 0
                        ------

                        Check if the ray is parallel to the plane.  If so, return false because there is no point
                        of intersection.
                */
                double NdotRayDirection = glm::dot(n, dir);

                if (std::fabs(NdotRayDirection) < toleranceParallelTight * nLength * dirLength)
                        return false;

                /*
                        Step 1
                        ------

                        Find the point of intersection p of the ray with the plane defined by v0, v1 and v2.

                        (a) Compute the unnormalised signed plane offset relative to v0.
                        Subtract positions before taking the dot product to avoid cancellation
                        when the same triangle is translated far from the coordinate origin.
                */
                double d = glm::dot(n, origin - v0);
                /*
                        (b) Compute t.  The distance from the origin to the point of intersection is t |dir|, where
                            |dir| is the length of dir.
                */
                t = -d / NdotRayDirection;
                /*
                        (c) Check if the triangle is behind the ray.  If so, return false.
                */
                if (t * dirLength < -_TOLERANCE_BACK_DEVIATION_DISTANCE)
                        return false;
                /*
                        (d) Compute p, the point of intersection.
                */
                Vec p = origin + t * dir;

                d_plane = -d / nLength;
                /*
                        Step 2
                        ------

                        Apply the inside-outside test to decide whether the point of intersection p lies inside
                        the triangle defined by v0, v1 and v2.

                        The edges of the triangle are considered in turn.  For the vertex v0 and the edge defined by
                        the vector from v0 to v1, the vectors
                            edge0 = (v1 - v0)
                        and
                            v0p = (p - v0)
                        both lie in the plane, so vector
                            c = edge0 x v0p
                        is perpendicular to the plane.  If c and n point in opposite directions, then point p lies to the
                        right of edge0, and so will lie outside the triangle.  In that case, return false.

                        Check the other vertices and edges similarly.
                */

                // Compare edge distances, not quantities with fourth-power length units.
                // A fixed threshold on dot(n, cross(edge, p-v)) changes the effective
                // triangle boundary drastically when the same model changes units.
                const Vec vertices[3] = {v0, v1, v2};
                for (int i = 0; i < 3; i++)
                {
                        Vec edge = vertices[(i + 1) % 3] - vertices[i];
                        double edgeLength = glm::length(edge);
                        double side = glm::dot(n / nLength, glm::cross(edge, p - vertices[i])) / edgeLength;
                        if (side < -_TOLERANCE_INSIDE_OUTSIDE_PERIMETER * edgeLength) return false;
                        if (onPerimeter && std::abs(side) <= EDGE_ON_TOLERANCE * edgeLength) *onPerimeter = true;
                }

                hitPosition = p;

                return true; // The ray hits the inside of the triangle.
        }
}
