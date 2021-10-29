/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#pragma once

#include "../../deps/glm/glm/glm.hpp"

#include "../util.h"
#include "./is-inside-mesh.h"
#define CSGJSCPP_REAL double
#define CSGJSCPP_IMPLEMENTATION
#include "../../deps/csgjs-cpp/csgjs.h"
#include "../../deps/godot-csg/csg.h"

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

    csgjscpp::Model IfcGeometryToCSGModel(const IfcGeometry& mesh1)
    {
        std::vector<csgjscpp::Polygon> polygons1;

        for (uint32_t i = 0; i < mesh1.numFaces; i++)
        {
            Face f = mesh1.GetFace(i);
            std::vector<csgjscpp::Vertex> verts;

            glm::dvec3 a = mesh1.GetPoint(f.i0);
            glm::dvec3 b = mesh1.GetPoint(f.i1);
            glm::dvec3 c = mesh1.GetPoint(f.i2);

            glm::dvec3 n = computeNormal(a, b, c);


            verts.push_back(csgjscpp::Vertex{ csgjscpp::Vector(a.x, a.y, a.z), csgjscpp::Vector(n.x, n.y, n.z), 0 });
            verts.push_back(csgjscpp::Vertex{ csgjscpp::Vector(b.x, b.y, b.z), csgjscpp::Vector(n.x, n.y, n.z), 0 });
            verts.push_back(csgjscpp::Vertex{ csgjscpp::Vector(c.x, c.y, c.z), csgjscpp::Vector(n.x, n.y, n.z), 0 });

            polygons1.push_back(csgjscpp::Polygon(verts));
        }

        return csgjscpp::modelfrompolygons(polygons1);
    }

    IfcGeometry boolSubtract_CSGJSCPP(const IfcGeometry& mesh1, const IfcGeometry& mesh2)
    {
        auto model1 = IfcGeometryToCSGModel(mesh1);
        auto model2 = IfcGeometryToCSGModel(mesh2);

        auto m = csgjscpp::csgsubtract(model1, model2);

        IfcGeometry result;

        for (uint32_t i = 0; i < m.indices.size(); i += 3)
        {
            uint32_t i0 = m.indices[i + 0];
            uint32_t i1 = m.indices[i + 1];
            uint32_t i2 = m.indices[i + 2];

            csgjscpp::Vertex va = m.vertices[i0];
            csgjscpp::Vertex vb = m.vertices[i1];
            csgjscpp::Vertex vc = m.vertices[i2];

            glm::dvec3 a(va.pos.x, va.pos.y, va.pos.z);
            glm::dvec3 b(vb.pos.x, vb.pos.y, vb.pos.z);
            glm::dvec3 c(vc.pos.x, vc.pos.y, vc.pos.z);

            result.AddFace(a, b, c);
        }

        return result;
    }

    glm::dvec3 GetOffset(glm::dvec3 pt, glm::dvec3 center, glm::dvec3 extents)
    {
        auto dpt = pt - center;

        double max = std::max(extents.x, std::max(extents.y, extents.z));

        double scaleMM = 1 / (max);

        return dpt * scaleMM;
    }

    CSGBrush* IfcGeometryToCSGBrush(const IfcGeometry& mesh, bool scale = false)
    {
        CSGBrush* brush = memnew(CSGBrush);

        Vector<Vector3> p_vertices;
        Vector<Vector2> p_uvs;

        glm::dvec3 center;
        glm::dvec3 extents;

        if (scale)
        {
            mesh.GetCenterExtents(center, extents);
        }

        for (uint32_t i = 0; i < mesh.numFaces; i++) {
            Face f = mesh.GetFace(i);

            glm::dvec3 a = mesh.GetPoint(f.i0);
            glm::dvec3 b = mesh.GetPoint(f.i1);
            glm::dvec3 c = mesh.GetPoint(f.i2);

            if (scale)
            {
                a += GetOffset(a, center, extents);
                b += GetOffset(b, center, extents);
                c += GetOffset(c, center, extents);
            }

            glm::dvec3 norm;
            if (!computeSafeNormal(a, b, c, norm))
            {
                continue;
            }

            p_vertices.push_back(Vector3(a.x, a.y, a.z));
            p_vertices.push_back(Vector3(c.x, c.y, c.z));
            p_vertices.push_back(Vector3(b.x, b.y, b.z));

            p_uvs.push_back(Vector2());
            p_uvs.push_back(Vector2());
            p_uvs.push_back(Vector2());
        }


        brush->build_from_faces(p_vertices, p_uvs, {}, {}, {});

        return brush;
    }

    IfcGeometry boolSubtract_GODOT(const IfcGeometry& mesh1, const IfcGeometry& mesh2)
    {

        auto model1 = IfcGeometryToCSGBrush(mesh1);
        auto model2 = IfcGeometryToCSGBrush(mesh2, false);

        CSGBrush* resultBrush = memnew(CSGBrush);

        CSGBrushOperation op;
        op.merge_brushes(CSGBrushOperation::OPERATION_SUBSTRACTION, *model1, *model2, *resultBrush, 0.001);

        IfcGeometry result;

        for (uint32_t i = 0; i < resultBrush->faces.size(); i ++) {
            auto face = resultBrush->faces.get(i);

            auto va = face.vertices[0];
            auto vb = face.vertices[1];
            auto vc = face.vertices[2];

            glm::dvec3 a(va.x, va.y, va.z);
            glm::dvec3 b(vb.x, vb.y, vb.z);
            glm::dvec3 c(vc.x, vc.y, vc.z);

            result.AddFace(a, c, b);
        }

        return result;
    }
    }