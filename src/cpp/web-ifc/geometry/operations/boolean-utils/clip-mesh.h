/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include <glm/glm.hpp>

#include "util.h"
#include "is-inside-mesh.h"
#include "geometry.h"
#include "bvh.h"

namespace fuzzybools
{
    static void doubleClipSingleMesh(Geometry& mesh, BVH& bvh1, BVH& bvh2, Geometry& result)
    {  
        #ifdef CSG_DEBUG_OUTPUT
            std::vector<std::vector<glm::dvec2>> edgesPrinted;
        #endif

        std::vector<std::pair<int, AABB>> boundingList;

        for(auto &plane: mesh.planes)
        {
            result.hasPlanes = true;
            result.planes.push_back(plane);
        }

        for (uint32_t i = 0; i < mesh.data; i++)
        {
            bool doit = false;
            Face tri = mesh.GetFace(i);
            glm::dvec3 a = mesh.GetPoint(tri.i0);
            glm::dvec3 b = mesh.GetPoint(tri.i1);
            glm::dvec3 c = mesh.GetPoint(tri.i2);

            auto aabb = mesh.GetFaceBox(i);

            if (!aabb.intersects(bvh2.box))
            {
                // Why is this commented?

                // when subtracting, if box is outside the second operand, its guaranteed to remain
                // result.AddFace(a, b, c);
                //continue;
            }
            else if (!aabb.intersects(bvh1.box))
            {
                // when subtracting, if box is outside the first operand, it won't remain ever
                //continue;
            }

            bool doNext = true;

            for(auto pair: boundingList)
            {
                if (aabb.intersects(pair.second))
                {
                    Face tri_temp = mesh.GetFace(pair.first);

                    glm::dvec3 at = mesh.GetPoint(tri_temp.i0);
                    glm::dvec3 bt = mesh.GetPoint(tri_temp.i1);
                    glm::dvec3 ct = mesh.GetPoint(tri_temp.i2);

                    if((equals(at,a, EPS_MINISCULE) &&  equals(bt,b, EPS_MINISCULE) && equals(ct,c, EPS_MINISCULE))
                    || (equals(at,b, EPS_MINISCULE) &&  equals(bt,c, EPS_MINISCULE) && equals(ct,a, EPS_MINISCULE))
                    || (equals(at,c, EPS_MINISCULE) &&  equals(bt,a, EPS_MINISCULE) && equals(ct,b, EPS_MINISCULE)))
                    {
                        doNext = false;
                        break;
                    }
                }
            }

            if(!doNext)
            {
                continue;
            }

            boundingList.push_back(std::make_pair(i, aabb));

            glm::dvec3 n = computeNormal(a, b, c);

            glm::dvec3 triCenter = (a + b * 1.02 + c * 1.03) * 1.0 / 3.05; // Using true centroid could cause issues (#540)

            auto isInsideTarget = MeshLocation::INSIDE;

            Vec raydir = computeNormal(a, b, c);

            auto isInside1Loc = isInsideMesh(triCenter, n, *bvh1.ptr, bvh1, raydir);
            auto isInside2Loc = isInsideMesh(triCenter, n, *bvh2.ptr, bvh2, raydir);

            Vec extraDir1 = glm::normalize(Vec(1.1, 1.4, 1.2));
            Vec extraDir2 = glm::normalize(Vec(-2.1, 1.4, -3.2));

            auto isInside1Loc_B = isInsideMesh(triCenter, n, *bvh1.ptr, bvh1, extraDir1);
            auto isInside2Loc_B = isInsideMesh(triCenter, n, *bvh2.ptr, bvh2, extraDir1);

            if(isInside1Loc.loc != isInside1Loc_B.loc)
            {
                auto isInside1Loc_C = isInsideMesh(triCenter, n, *bvh1.ptr, bvh1, extraDir2);
                if(isInside1Loc_C.loc == isInside1Loc_B.loc){isInside1Loc = isInside1Loc_B;}
                else if(isInside1Loc_B.loc != isInside1Loc_C.loc && isInside1Loc.loc != isInside1Loc_C.loc)
                {
                    isInside1Loc = isInside1Loc_B;
                }
            }

            if(isInside2Loc.loc != isInside2Loc_B.loc)
            {
                auto isInside2Loc_C = isInsideMesh(triCenter, n, *bvh2.ptr, bvh2, extraDir2);
                if(isInside2Loc_C.loc == isInside2Loc_B.loc){isInside2Loc = isInside2Loc_B;}
                else if(isInside2Loc_B.loc != isInside2Loc_C.loc && isInside2Loc.loc != isInside2Loc_C.loc)
                {
                    isInside2Loc = isInside2Loc_B;
                }
            }

            auto isInside1 = isInside1Loc.loc;
            auto isInside2 = isInside2Loc.loc;

            if (isInside1 == MeshLocation::OUTSIDE && isInside2 == MeshLocation::OUTSIDE)
            {
                // both outside, no dice
            }
            if (isInside1 != MeshLocation::BOUNDARY && isInside2 != MeshLocation::BOUNDARY)
            {
                // neither boundary, no dice
            }
            else if (isInside1 == MeshLocation::BOUNDARY && isInside2 == MeshLocation::BOUNDARY)
            {
                // both boundary, no dice if normals are same direction
                auto dot = glm::dot(isInside1Loc.normal, isInside2Loc.normal);

                // since both are on the boundary, and we're sampling the center of the tri, these two faces are coplanar
                // hence we can test dot > 0 to see if normals point the same way
                if (dot < 0)
                {
                    // normals face away from eachother, we can keep this face
                    // furthermore, since the first operand is the first added, we don't flip
                    result.AddFace(a, b, c, tri.pId);
                    doit = true;
                }
            }
            else
            {
                if (isInside2 == MeshLocation::INSIDE || isInside1 == MeshLocation::OUTSIDE)
                {
                    // inside 2, with subtract, means don't include
                    // outside 1, with subtract, means don't include
                }
                else
                {
                    // boundary or outside 2, and boundary or inside 1, means keep 
                    if (isInside2 == MeshLocation::BOUNDARY && isInside1 == MeshLocation::INSIDE)
                    {
                        // we're taking the face of the second operand, but we must match the winding
                        if (glm::dot(n, isInside2Loc.normal) < 0)
                        {
                            result.AddFace(a, b, c, tri.pId);
                            doit = true;
                        }
                        else
                        {
                            result.AddFace(b, a, c, tri.pId);
                            doit = true;
                        }
                    }
                    else if (isInside1 == MeshLocation::BOUNDARY)
                    {
                        // we're taking the face of the second operand, but we must match the winding
                        if (glm::dot(n, isInside1Loc.normal) < 0)
                        {
                            result.AddFace(b, a, c, tri.pId);
                            doit = true;
                        }
                        else
                        {
                            result.AddFace(a, b, c, tri.pId);
                            doit = true;
                        }
                    }
                    else
                    {
                        result.AddFace(a, b, c, tri.pId);
                        doit = true;
                    }
                }
            }

            #ifdef CSG_DEBUG_OUTPUT
                if (doit)
                {
                    edgesPrinted.push_back({ glm::dvec2(a.z + a.x/2, a.y+ a.x/2), glm::dvec2(b.z+ b.x/2, b.y+ b.x/2)});
                    edgesPrinted.push_back({ glm::dvec2(a.z+ a.x/2, a.y+ a.x/2), glm::dvec2(c.z+ c.x/2, c.y+ c.x/2) });
                    edgesPrinted.push_back({ glm::dvec2(b.z+ b.x/2, b.y+ b.x/2), glm::dvec2(c.z+ c.x/2, c.y+ c.x/2) });
                    DumpSVGLines(edgesPrinted, L"final_tri.html");
                    doit = true;
                }
            #endif
        }

        #ifdef CSG_DEBUG_OUTPUT
            // DumpSVGLines(edgesPrinted, L"final_tri.html");
        #endif

        for (uint32_t i = mesh.data; i < mesh.numFaces; i++)
        {
            Face tri = mesh.GetFace(i);
            glm::dvec3 a = mesh.GetPoint(tri.i0);
            glm::dvec3 b = mesh.GetPoint(tri.i1);
            glm::dvec3 c = mesh.GetPoint(tri.i2);
            result.AddFace(a, b, c, tri.pId);
        }
    }

    static void doubleClipSingleMesh2(Geometry& mesh, BVH& bvh1, BVH& bvh2, Geometry& result)
    {
        for(auto &plane: mesh.planes)
        {
            result.hasPlanes = true;
            result.planes.push_back(plane);
        }

        for (uint32_t i = 0; i < mesh.data; i++)
        {
            Face tri = mesh.GetFace(i);
            glm::dvec3 a = mesh.GetPoint(tri.i0);
            glm::dvec3 b = mesh.GetPoint(tri.i1);
            glm::dvec3 c = mesh.GetPoint(tri.i2);

            glm::dvec3 n = computeNormal(a, b, c);

            auto area = areaOfTriangle(a, b, c);

            glm::dvec3 triCenter = (a + b * 2.0 + c * 3.0) * 1.0 / 6.0; // Using true centroid could cause issues (#540)

            auto isInsideTarget = MeshLocation::INSIDE;

            Vec raydir = computeNormal(a, b, c);

            auto isInside1Loc = isInsideMesh(triCenter, n, *bvh1.ptr, bvh1, raydir, true);
            auto isInside2Loc = isInsideMesh(triCenter, n, *bvh2.ptr, bvh2, raydir, true);

            Vec extraDir1 = glm::normalize(Vec(1.1, 1.4, 1.2));
            Vec extraDir2 = glm::normalize(Vec(-2.1, 1.4, -3.2));

            auto isInside1Loc_B = isInsideMesh(triCenter, n, *bvh1.ptr, bvh1, extraDir1, true);
            auto isInside2Loc_B = isInsideMesh(triCenter, n, *bvh2.ptr, bvh2, extraDir1, true);

            if(isInside1Loc.loc != isInside1Loc_B.loc)
            {
                auto isInside1Loc_C = isInsideMesh(triCenter, n, *bvh1.ptr, bvh1, extraDir2, true);
                if(isInside1Loc_C.loc == isInside1Loc_B.loc){isInside1Loc = isInside1Loc_B;}
                else if(isInside1Loc_B.loc != isInside1Loc_C.loc && isInside1Loc.loc != isInside1Loc_C.loc)
                {
                    isInside1Loc = isInside1Loc_B;
                }
            }

            if(isInside2Loc.loc != isInside2Loc_B.loc)
            {
                auto isInside2Loc_C = isInsideMesh(triCenter, n, *bvh2.ptr, bvh2, extraDir2, true);
                if(isInside2Loc_C.loc == isInside2Loc_B.loc){isInside2Loc = isInside2Loc_B;}
                else if(isInside2Loc_B.loc != isInside2Loc_C.loc && isInside2Loc.loc != isInside2Loc_C.loc)
                {
                    isInside2Loc = isInside2Loc_B;
                }
            }

            auto isInside1 = isInside1Loc.loc;
            auto isInside2 = isInside2Loc.loc;

            if (isInside1 == MeshLocation::OUTSIDE && isInside2 == MeshLocation::OUTSIDE)
            {
                // both outside, no dice, should be impossible though
            }
            else if (isInside1 == MeshLocation::INSIDE || isInside2 == MeshLocation::INSIDE)
            {
                // we only keep boundaries, no dice
            }
            else if (isInside1 == MeshLocation::BOUNDARY && isInside2 == MeshLocation::BOUNDARY)
            {
                /*
                // both boundary, no dice if normals are opposite direction
                auto dot = glm::dot(isInside1Loc.normal, isInside2Loc.normal);

                // since both are on the boundary, and we're sampling the center of the tri, these two faces are coplanar
                // hence we can test dot < 0 to see if normals point the opposite way
                if (dot > 0)
                {
                    // normals face away from eachother, we can keep this face
                    // furthermore, since the first operand is the first added, we don't flip
                    result.AddFace(a, b, c);
                }
                */
            }
            else if (isInside1 == MeshLocation::BOUNDARY && isInside2 == MeshLocation::OUTSIDE)
            {
                // either is a boundary, keep
                if (glm::dot(n, isInside1Loc.normal) < 0)
                {
                    result.AddFace(b, a, c, tri.pId);
                }
                else
                {
                    result.AddFace(a, b, c, tri.pId);
                }
            }
            else if (isInside2 == MeshLocation::BOUNDARY && isInside1 == MeshLocation::OUTSIDE)
            {
                // either is a boundary, keep
                if (glm::dot(n, isInside2Loc.normal) < 0)
                {
                    result.AddFace(b, a, c, tri.pId);
                }
                else
                {
                    result.AddFace(a, b, c, tri.pId);
                }
            }
            else
            {
                // neither a boundary, neither inside, neither outside, nothing left
            }
        }

        for (uint32_t i = mesh.data; i < mesh.numFaces; i++)
        {
            Face tri = mesh.GetFace(i);
            glm::dvec3 a = mesh.GetPoint(tri.i0);
            glm::dvec3 b = mesh.GetPoint(tri.i1);
            glm::dvec3 c = mesh.GetPoint(tri.i2);
            result.AddFace(a, b, c, tri.pId);
        }
    }

    static Geometry clipJoin(Geometry& mesh, BVH bvh1, BVH bvh2)
    {
        Geometry resultingMesh;

        doubleClipSingleMesh2(mesh, bvh1, bvh2, resultingMesh);

        return resultingMesh;
    }

    static Geometry clipSubtract(Geometry& mesh, BVH bvh1, BVH bvh2)
    {

        Geometry resultingMesh;

        doubleClipSingleMesh(mesh, bvh1, bvh2, resultingMesh);

        return resultingMesh;
    }
}