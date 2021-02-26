/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#pragma once

#include "../deps/glm/glm/glm.hpp"

#include "util.h"
#include "is-inside-mesh.h"

namespace webifc
{
    void clipMesh(IfcGeometry& source, IfcGeometry& target, IfcGeometry& result, bool invert, bool flip, bool keepBoundary)
    {
        for (uint32_t i = 0; i < source.numFaces; i++)
        {
            Face tri = source.GetFace(i);
            glm::dvec3 a = source.GetPoint(tri.i0);
            glm::dvec3 b = source.GetPoint(tri.i1);
            glm::dvec3 c = source.GetPoint(tri.i2);

            glm::dvec3 n = computeNormal(a, b, c);

            glm::dvec3 triCenter = (a + b + c) * 1.0 / 3.0;

            auto isInsideTarget = isInsideMesh(triCenter, n, target);

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

    IfcGeometry boolIntersect(IfcGeometry& mesh1, IfcGeometry& mesh2)
    {
        IfcGeometry resultingMesh;

        clipMesh(mesh1, mesh2, resultingMesh, false, false, true);
        clipMesh(mesh2, mesh1, resultingMesh, false, false, false);

        return resultingMesh;
    }

    IfcGeometry boolJoin(IfcGeometry& mesh1, IfcGeometry& mesh2)
    {
        IfcGeometry resultingMesh;

        clipMesh(mesh1, mesh2, resultingMesh, true, false, true);
        clipMesh(mesh2, mesh1, resultingMesh, true, false, false);

        return resultingMesh;
    }

    // TODO: I don't think XOR works right now...
    IfcGeometry boolXOR(IfcGeometry& mesh1, IfcGeometry& mesh2)
    {
        IfcGeometry resultingMesh;

        clipMesh(mesh1, mesh2, resultingMesh, true, false, false);
        clipMesh(mesh2, mesh1, resultingMesh, true, false, false);

        return resultingMesh;
    }

    IfcGeometry boolSubtract(IfcGeometry& mesh1, IfcGeometry& mesh2)
    {
        IfcGeometry resultingMesh;

        clipMesh(mesh1, mesh2, resultingMesh, true, false, false);
        clipMesh(mesh2, mesh1, resultingMesh, false, true, false);

        return resultingMesh;
    }
}