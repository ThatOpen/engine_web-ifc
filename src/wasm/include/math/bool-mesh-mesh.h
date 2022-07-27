/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#pragma once

#include "../../deps/glm/glm/glm.hpp"

#include "../util.h"
#include "./is-inside-mesh.h"

#ifdef __EMSCRIPTEN__
#include "../../deps/manifold/manifold/include/manifold.h"

//#define DEBUG_BOOLEAN_INPUT
#endif

namespace webifc
{
    void clipMesh(IfcGeometry& source, IfcGeometry& target, IfcGeometry& result, bool invert, bool flip, bool keepBoundary)
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
                isInsideTarget = isInsideMesh(triCenter, n, target);
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

    IfcGeometry boolSubtract(IfcGeometry& mesh1, IfcGeometry& mesh2)
    {

        IfcGeometry resultingMesh;

        clipMesh(mesh1, mesh2, resultingMesh, true, false, false);
        clipMesh(mesh2, mesh1, resultingMesh, false, true, false);

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

    #ifdef __EMSCRIPTEN__
    manifold::Mesh geom2mesh(const IfcGeometry& geometry) {
        manifold::Mesh mesh;

        #ifdef DEBUG_BOOLEAN_INPUT
        puts("# geometry.obj\n");
        #endif

        // unfortunately we cannot just copy geometry indices
        // since duplicate vertices make manifold lib unhappy
        // for now let's just brute-force de-duplication here
        std::vector<int> index;
        glm::dvec3 e = geometry.GetExtent() * 1e-6;
        for (int i = 0, j = 0; i < geometry.numPoints; i++)
        {
            double x = geometry.vertexData[i * VERTEX_FORMAT_SIZE_FLOATS + 0];
            double y = geometry.vertexData[i * VERTEX_FORMAT_SIZE_FLOATS + 1];
            double z = geometry.vertexData[i * VERTEX_FORMAT_SIZE_FLOATS + 2];

            // find i-th geometry point in first j mesh points
            int at = -1;
            for (int k = 0; k < j; k++)
            {
                const glm::vec3& kth = mesh.vertPos[k];
                if (
                    (abs(x - kth.x) < e.x) &&
                    (abs(y - kth.y) < e.y) &&
                    (abs(z - kth.z) < e.z)
                    )
                {
                    at = k; break;
                }
            }

            if (at < 0)
            {
                mesh.vertPos.emplace_back(x, y, z);
                index.emplace_back(j); j++;

                #ifdef DEBUG_BOOLEAN_INPUT
                printf("v %f %f %f\n", x, y, z);
                #endif
            }
            else
            {
                index.emplace_back(at);
            }
        }

        for (int i = 0; i < geometry.numFaces; i++)
        {
            int a = index[geometry.indexData[i * 3 + 0]];
            int b = index[geometry.indexData[i * 3 + 1]];
            int c = index[geometry.indexData[i * 3 + 2]];

            // due to a de-duplication some very thin triangles
            // has now collapsed into a single line - lose them
            if((a == b) || (b == c) || (c == a)) continue;

            mesh.triVerts.emplace_back(a, b, c);

            #ifdef DEBUG_BOOLEAN_INPUT
            printf("f %d %d %d\n", a + 1, b + 1, c + 1);
            #endif
        }

        return mesh;
    }

    IfcGeometry boolMultiOp_Manifold(const IfcGeometry& firstGeom, const std::vector<IfcGeometry>& secondGeoms)
    {
        #ifdef DEBUG_BOOLEAN_INPUT
        printf("\nboolMultiOp_Manifold, %d holes\n", (int)secondGeoms.size());
        #endif

        IfcGeometry resultGeom;

        manifold::Mesh firstMesh = geom2mesh(firstGeom);

        // manifold throws exceptions if unhappy - however
        // exceptions do not work in emscripten by default
        // due to the overhead and/or poor browser support
        // https://emscripten.org/docs/porting/exceptions.html
        // we have to either build with exceptions or hope
        // that there will be no errors triggered here :')

        try
        {
            manifold::Manifold first(firstMesh);

            // collect holes
            std::vector<manifold::Manifold> holes;

            for (auto& holeGeom : secondGeoms)
            {
                manifold::Mesh holeMesh = geom2mesh(holeGeom);

                manifold::Manifold holeManifold(holeMesh);

                holes.push_back(holeManifold);
            }

            manifold::Manifold combinedHole = manifold::Manifold::Compose(holes);

            // subtract the combined hole
            if (combinedHole.IsManifold()) {
                first -= combinedHole;
            }

            // convert back to IfcGeometry
            manifold::Mesh resultMesh = first.GetMesh();

            for (int i = 0, n = resultMesh.triVerts.size(); i < n; i++) {
                resultGeom.AddFace(
                    resultMesh.vertPos[resultMesh.triVerts[i][0]],
                    resultMesh.vertPos[resultMesh.triVerts[i][1]],
                    resultMesh.vertPos[resultMesh.triVerts[i][2]]
                );
            }
        }
        catch (const std::runtime_error& e)
        {
            printf("%s\n", e.what());
        }

        return resultGeom;
    }
    #endif

}