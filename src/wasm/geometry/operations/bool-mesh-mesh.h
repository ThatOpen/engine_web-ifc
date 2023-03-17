/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <glm/glm.hpp>

#include "./is-inside-mesh.h"

namespace webifc::geometry
{

    static void clipMesh(IfcGeometry& source, IfcGeometry& target, BVH& targetBVH, IfcGeometry& result, bool invert, bool flip, bool keepBoundary)
    {
        glm::dvec3 targetCenter;
        glm::dvec3 targetExtents;
        target.GetCenterExtents(targetCenter, targetExtents);

        for (uint32_t i = 0; i < source.numFaces; i++)
        {
            Face tri = source.GetFace(i);
            glm::dvec3 a = source.GetPoint(tri.i0);
            glm::dvec3 b = source.GetPoint(tri.i1);
            glm::dvec3 c = source.GetPoint(tri.i2);

            glm::dvec3 n = computeNormal(a, b, c);

            glm::dvec3 triCenter = (a + b + c) * 1.0 / 3.0;

            auto isInsideTarget = MeshLocation::INSIDE;

            if (IsInsideCenterExtents(triCenter, targetCenter, targetExtents))
            {
                isInsideTarget = isInsideMesh(triCenter, n, *targetBVH.ptr, targetBVH);
            }
            else
            {
                isInsideTarget = MeshLocation::OUTSIDE;
            }

            if ((isInsideTarget == MeshLocation::INSIDE && !invert) || (isInsideTarget == MeshLocation::OUTSIDE && invert) || (isInsideTarget == MeshLocation::BOUNDARY && keepBoundary))
            {
                // emit triangle
                if (flip)
                {
                    result.AddFace(a, c, b);
                }
                else
                {
                    result.AddFace(a, b, c);
                }
            }
        }
    }

    static IfcGeometry boolSubtract(IfcGeometry& mesh1, IfcGeometry& mesh2, BVH bvh1, BVH bvh2)
    {

        IfcGeometry resultingMesh;

        clipMesh(mesh1, mesh2, bvh2, resultingMesh, true, false, false);
        clipMesh(mesh2, mesh1, bvh1, resultingMesh, false, true, false);

        return resultingMesh;
    }

}