/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
 #pragma once

#include <map>
#include <algorithm>

#include <glm/glm.hpp>
#include "../util.h"
#include "intersect-ray-tri.h"
#include "triangulate-with-boundaries.h"

namespace webifc
{

    glm::dvec2 projectOnTriangle(const glm::dvec3& pt, const glm::dvec3& a, const glm::dvec3& b, const glm::dvec3& c)
    {
        glm::dvec3 v1 = glm::normalize(b - a);
        glm::dvec3 v2 = glm::normalize(c - a);

        glm::dvec3 norm = glm::normalize(glm::cross(v1, v2));
        v2 = glm::normalize(glm::cross(norm, v1));

        double scale = std::max(glm::length(b - a), glm::length(c - a));

        glm::dvec3 rel = pt - a;
        double d1 = glm::dot(v1, rel);
        double d2 = glm::dot(v2, rel);

        d1 = d1 / scale;
        d2 = d2 / scale;

        return {
            d1,
            d2
        };
    }

    glm::dvec3 unProjectFromTriangle(glm::dvec2& pt, const glm::dvec3& a, const glm::dvec3& b, const glm::dvec3& c)
    {
        glm::dvec3 v1 = glm::normalize(b - a);
        glm::dvec3 v2 = glm::normalize(c - a);

        glm::dvec3 norm = glm::normalize(glm::cross(v1, v2));
        v2 = glm::normalize(glm::cross(norm, v1));

        double scale = std::max(glm::length(b - a), glm::length(c - a));

        double d1 = pt.x * scale;
        double d2 = pt.y * scale;

        glm::dvec3 p = v1 * d1 + v2 * d2;

        return p + a;
    }

    struct MeshIntersection
    {
        TriTriResult result;
        uint32_t otherTriangleIndex;
    };

    typedef std::map<uint32_t, std::vector<MeshIntersection>> MeshIntersections;

    std::vector<Loop> makeLoops(const glm::dvec3& a, const glm::dvec3& b, const glm::dvec3& c, const std::vector<MeshIntersection>& intersections)
    {
        std::vector<Loop> loops;

        for (auto& i : intersections)
        {
            glm::dvec2 ps = projectOnTriangle(i.result.start, a, b, c);
            glm::dvec2 pe = projectOnTriangle(i.result.end, a, b, c);

            // single point
            if (equals2d(ps, pe, EPS_SMALL))
            {
                loops.push_back({ true, ps, ps });
            }
            else
            {
                // TODO: stupid implementation, too many triangle checks needed
                // TODO: flipped this because of the triangle winding, but is probably not a general solution!
                loops.push_back({ false, pe, ps });
            }
        }

        return loops;
    }

    std::vector<Loop> makeLoops2(const glm::dvec3& A, const glm::dvec3& B, const glm::dvec3& C, const glm::dvec2& a, const glm::dvec2& b, const glm::dvec2& c, const std::vector<MeshIntersection>& intersections)
    {
        std::vector<Loop> loops;

        for (auto& i : intersections)
        {
            glm::dvec3 psb = ToBary(A, B, C, i.result.start);
            glm::dvec3 peb = ToBary(A, B, C, i.result.end);
            glm::dvec2 ps = FromBary(a, b, c, psb);
            glm::dvec2 pe = FromBary(a, b, c, peb);

            // single point
            if (equals2d(ps, pe, EPS_SMALL))
            {
                loops.push_back({ true, ps, ps });
            }
            else
            {
                // TODO: stupid implementation, too many triangle checks needed
                // TODO: flipped this because of the triangle winding, but is probably not a general solution!
                loops.push_back({ false, pe, ps });
            }
        }

        return loops;
    }

    IfcGeometry retriangulateMesh(const IfcGeometry& mesh, MeshIntersections& intersections)
    {
        IfcGeometry outputMesh;

        for (uint32_t i = 0; i < mesh.numFaces; i++)
        {
            Face f = mesh.GetFace(i);

            if (i == 4)
            {
                // printf("asdf");
            }

            const glm::dvec3& a = mesh.GetPoint(f.i0);
            const glm::dvec3& b = mesh.GetPoint(f.i1);
            const glm::dvec3& c = mesh.GetPoint(f.i2);

            // warning: ints may have line segments where end === start
            std::vector<MeshIntersection> ints = intersections[i];
            if (!ints.empty())
            {
                glm::dvec2 pa = glm::dvec2(0, 0);//  projectOnTriangle(a, a, b, c);
                glm::dvec2 pb = glm::dvec2(1, 0);//projectOnTriangle(b, a, b, c);
                glm::dvec2 pc = glm::dvec2(0, 1);//projectOnTriangle(c, a, b, c);

                glm::dvec3 uupa = FromBary(a, b, c, ToBary2(pa));//unProjectFromTriangle(pa, a, b, c);
                glm::dvec3 uupb = FromBary(a, b, c, ToBary2(pb));//unProjectFromTriangle(pb, a, b, c);
                glm::dvec3 uupc = FromBary(a, b, c, ToBary2(pc));//unProjectFromTriangle(pc, a, b, c);

                auto loops = makeLoops2(a, b, c, pa, pb, pc, ints);

                if (!(loops.size() == 1 && loops[0].hasOne))
                {
                    std::vector<std::vector<glm::dvec2>> vecs;
                    std::transform(loops.begin(), loops.end(), std::back_inserter(vecs), [](const Loop& l) -> std::vector<glm::dvec2> {
                        return { l.v1, l.v2 };
                    });

                    vecs.push_back({ { pa.x, pa.y } });
                    vecs.push_back({ { pb.x, pb.y } });
                    vecs.push_back({ { pc.x, pc.y } });

                    // DumpSVGLines(vecs, L"loops.html");
                }


                std::vector<std::vector<glm::dvec2>> lines;

                for (auto& loop : loops)
                {
                    std::vector<glm::dvec2> vec;

                    if (loop.hasOne)
                    {
                        vec.push_back(loop.v1);
                    }
                    else
                    {
                        vec.push_back(loop.v1);
                        vec.push_back(loop.v2);
                    }

                    lines.push_back(vec);
                }

                lines.push_back({ pa, pb });
                lines.push_back({ pb, pc });
                lines.push_back({ pc, pa });

                // DumpSVGLines(lines, L"lines.html");

                // drawInSVG(loops, pa, pb, pc);

                // eartcut.hpp seems to have issues with colinear points in holes, so for now use custom slow algo
                bool swapped = false;
                std::vector<Triangle> tesselation = triangulate(pa, pb, pc, loops, swapped);

                for (auto& triangle : tesselation)
                {
                    if (triangle.id != -1)
                    {
                        glm::dvec2 ta = triangle.a();
                        glm::dvec2 tb = triangle.b();
                        glm::dvec2 tc = triangle.c();

                        glm::dvec3 upa = FromBary(a, b, c, ToBary2(ta));// unProjectFromTriangle(ta, a, b, c);
                        glm::dvec3 upb = FromBary(a, b, c, ToBary2(tb));//unProjectFromTriangle(tb, a, b, c);
                        glm::dvec3 upc = FromBary(a, b, c, ToBary2(tc));//unProjectFromTriangle(tc, a, b, c);

                        if (swapped)
                        {
                            outputMesh.AddFace(upb, upa, upc);
                        }
                        else
                        {
                            outputMesh.AddFace(upa, upb, upc);
                        }
                    }
                }
            }
            else
            {
                outputMesh.AddFace(a, b, c);
            }
        }

        return outputMesh;
    }

    struct AABB
    {
        glm::dvec3 min = glm::dvec3(DBL_MAX, DBL_MAX, DBL_MAX);
        glm::dvec3 max = glm::dvec3(-DBL_MAX, -DBL_MAX, -DBL_MAX);
    };

    AABB GetAABB(const IfcGeometry& mesh)
    {
        AABB aabb;

        for (uint32_t i = 0; i < mesh.numPoints; i++)
        {
            aabb.min = glm::min(aabb.min, mesh.GetPoint(i));
            aabb.max = glm::max(aabb.max, mesh.GetPoint(i));
        }

        return aabb;
    }

    struct Partition
    {
        glm::dvec3 cellsize;
    };

    const uint32_t GRID_CELLS_AXIS = 100;

    Partition MakePartition(const IfcGeometry& m, const AABB& aabb)
    {
        Partition p;

        // compute cellsize of partition
        glm::dvec3 size = aabb.max - aabb.min;
        p.cellsize = size / static_cast<double>(GRID_CELLS_AXIS);

        std::vector<int> parts(m.numFaces);

        // add all faces to partition
        for (uint32_t i = 0; i < m.numFaces; i++)
        {
            Face t1 = m.GetFace(i);

            // add face index for all cells
        }

        return p;
    }

    void intersectMeshMesh(const IfcGeometry& mesh1, const IfcGeometry& mesh2, IfcGeometry& result1, IfcGeometry& result2)
    {
        MeshIntersections meshIntersections1;
        MeshIntersections meshIntersections2;

        for (uint32_t i = 0; i < mesh1.numFaces; i++)
        {
            for (uint32_t j = 0; j < mesh2.numFaces; j++)
            {
                Face t1 = mesh1.GetFace(i);
                Face t2 = mesh2.GetFace(j);

                const glm::dvec3& a = mesh1.GetPoint(t1.i0);
                const glm::dvec3& b = mesh1.GetPoint(t1.i1);
                const glm::dvec3& c = mesh1.GetPoint(t1.i2);

                const glm::dvec3& d = mesh2.GetPoint(t2.i0);
                const glm::dvec3& e = mesh2.GetPoint(t2.i1);
                const glm::dvec3& f = mesh2.GetPoint(t2.i2);

                glm::dvec3 n = computeNormal(a, b, c);

                TriTriResult intersectionLine = intersect_triangle_triangle(a, b, c, d, e, f);

                if (intersectionLine.hasIntersection)
                {
                    meshIntersections1[i].push_back(MeshIntersection{
                        intersectionLine,
                        j
                    });

                    meshIntersections2[j].push_back(MeshIntersection{
                        intersectionLine,
                        i
                    });
                }
            }
        }

        /*
        IfcGeometry m1;
        IfcGeometry m2;

        for (auto& i : meshIntersections1)
        {
            if (!i.second.empty())
            {
                Face f = mesh1.GetFace(i.first);
                m1.AddFace(mesh1.GetPoint(f.i0), mesh1.GetPoint(f.i1), mesh1.GetPoint(f.i2));
            }
        }

        for (auto& i : meshIntersections2)
        {
            if (!i.second.empty())
            {
                Face f = mesh2.GetFace(i.first);
                m2.AddFace(mesh2.GetPoint(f.i0), mesh2.GetPoint(f.i1), mesh2.GetPoint(f.i2));
            }
        }
        */

        //DumpIfcGeometry(m1, L"mesh1ints.obj");
        //DumpIfcGeometry(m2, L"mesh2ints.obj");

        result1 = std::move(retriangulateMesh(mesh1, meshIntersections1));
        result2 = std::move(retriangulateMesh(mesh2, meshIntersections2));
    }
}