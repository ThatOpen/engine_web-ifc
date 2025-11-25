#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "geometry.h"
#include "epsilons.h"
#include "utils.h"
#include "face.h"

#pragma once
namespace bimGeometry
{
    void Geometry::AddPoint(glm::dvec4 &pt, glm::dvec3 &n)
    {
        glm::dvec3 p = pt;
        AddPoint(p, n);
    }

    AABB Geometry::GetAABB() const
    {
        AABB aabb;

        for (uint32_t i = 0; i < numPoints; i++)
        {
            aabb.min = glm::min(aabb.min, GetPoint(i));
            aabb.max = glm::max(aabb.max, GetPoint(i));
        }

        return aabb;
    }

    void Geometry::AddPoint(const glm::dvec3 &pt, const glm::dvec3 &n)
    {
        vertexData.push_back(pt.x);
        vertexData.push_back(pt.y);
        vertexData.push_back(pt.z);

        vertexData.push_back(n.x);
        vertexData.push_back(n.y);
        vertexData.push_back(n.z);

        numPoints += 1;
    }

    glm::dvec3 Geometry::GetPoint(size_t index) const
    {
        return glm::dvec3(
            vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 0],
            vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 1],
            vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 2]);
    }

    void Geometry::SetPoint(double x, double y, double z, size_t index)
    {
        vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 0] = x;
        vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 1] = y;
        vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 2] = z;
    }

    Face Geometry::GetFace(size_t index) const
    {
        Face f;
        f.i0 = indexData[index * 3 + 0];
        f.i1 = indexData[index * 3 + 1];
        f.i2 = indexData[index * 3 + 2];
        f.pId = planeData[index];
        return f;
    }

    void Geometry::AddFace(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c, uint32_t pId)
    {
        glm::dvec3 normal;

        double area = areaOfTriangle(a, b, c);

        if (!computeSafeNormal(a, b, c, normal, toleranceAddFace))
        {
            return;
        }

        AddPoint(a, normal);
        AddPoint(b, normal);
        AddPoint(c, normal);

        AddFace(numPoints - 3, numPoints - 2, numPoints - 1, pId);
    }

    void Geometry::AddFace(uint32_t a, uint32_t b, uint32_t c, uint32_t pId)
    {
        indexData.push_back(a);
        indexData.push_back(b);
        indexData.push_back(c);

        double area = areaOfTriangle(GetPoint(a), GetPoint(b), GetPoint(c));

        numFaces++;

        planeData.push_back(pId);
    }

    size_t Geometry::AddPlane(const glm::dvec3 &normal, double d)
    {
        for (auto &plane : planes)
        {
            if (plane.IsEqualTo(normal, d))
            {
                return plane.id;
            }
        }

        Plane p;
        p.id = planes.size();
        p.normal = glm::normalize(normal);
        p.distance = d;

        planes.push_back(p);

        return p.id;
    }

    void Geometry::buildPlanes()
    {
        if (!hasPlanes)
        {
            std::vector<double> storedVertexData = vertexData;
            auto GetStoredPoint = [&](size_t index) -> glm::dvec3
            {
                return glm::dvec3(
                    storedVertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 0],
                    storedVertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 1],
                    storedVertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 2]);
            };

            for (uint32_t r = 0; r < _PLANE_REFIT_ITERATIONS; r++)
            {
                planes.clear();
                planeData.clear();

                for (size_t i = 0; i < numFaces; i++)
                {
                    planeData.push_back(UINT32_MAX);
                }

                Vec centroid = Vec(0, 0, 0);

                for (size_t i = 0; i < numFaces; i++)
                {
                    Face f = GetFace(i);

                    auto a = GetPoint(f.i0);
                    auto b = GetPoint(f.i1);
                    auto c = GetPoint(f.i2);

                    centroid = centroid + (a + b + c) / 3.0;
                }

                centroid /= numFaces;

                for (size_t i = 0; i < numFaces; i++)
                {
                    Face f = GetFace(i);

                    auto a = GetPoint(f.i0);
                    auto b = GetPoint(f.i1);
                    auto c = GetPoint(f.i2);

                    glm::dvec3 norm;

                    if (computeSafeNormal(a, b, c, norm, EPS_SMALL))
                    {
                        double da = glm::dot(norm, a - centroid);
                        double db = glm::dot(norm, b - centroid);
                        double dc = glm::dot(norm, c - centroid);

                        size_t id = AddPlane(norm, (da + db + dc) / 3.0);
                        planeData[i] = id;
                        hasPlanes = true;
                    }
                }

                for (size_t i = 0; i < numFaces; i++)
                {
                    Face f = GetFace(i);

                    auto a = GetPoint(f.i0);
                    auto b = GetPoint(f.i1);
                    auto c = GetPoint(f.i2);

                    if (f.pId != -1)
                    {
                        Plane p = planes[f.pId];

                        double da = glm::dot(p.normal, a - centroid);
                        double db = glm::dot(p.normal, b - centroid);
                        double dc = glm::dot(p.normal, c - centroid);

                        da = p.distance - da;
                        db = p.distance - db;
                        dc = p.distance - dc;

                        glm::dvec3 va = a + p.normal * da;
                        glm::dvec3 vb = b + p.normal * db;
                        glm::dvec3 vc = c + p.normal * dc;

                        glm::dvec3 dsa = GetStoredPoint(f.i0) - va;
                        glm::dvec3 dsb = GetStoredPoint(f.i1) - vb;
                        glm::dvec3 dsc = GetStoredPoint(f.i2) - vc;

                        double fa = glm::length(dsa) / reconstructTolerance;
                        double fb = glm::length(dsb) / reconstructTolerance;
                        double fc = glm::length(dsc) / reconstructTolerance;

                        if (fa > 1)
                        {
                            fa = glm::length(dsa) / fa;
                            dsa = glm::normalize(dsa) * fa;
                            va = va + dsa;
                        }
                        if (fb > 1)
                        {
                            fb = glm::length(dsb) / fb;
                            dsb = glm::normalize(dsb) * fb;
                            vb = vb + dsb;
                        }
                        if (fc > 1)
                        {
                            fc = glm::length(dsc) / fc;
                            dsc = glm::normalize(dsc) * fc;
                            vc = vc + dsc;
                        }
                        SetPoint(va.x, va.y, va.z, f.i0);
                        SetPoint(vb.x, vb.y, vb.z, f.i1);
                        SetPoint(vc.x, vc.y, vc.z, f.i2);
                    }
                }
            }

            for (size_t i = 0; i < numFaces; i++)
            {
                Face f = GetFace(i);

                if (f.pId > -1)
                {
                    auto a = GetPoint(f.i0);
                    auto b = GetPoint(f.i1);
                    auto c = GetPoint(f.i2);

                    double da = glm::dot(planes[f.pId].normal, a);

                    planes[f.pId].distance = da;
                }
            }
        }
        // TODO: Remove unused planes
    }

    void Geometry::AddGeometry(Geometry geom)
    {
        for (uint32_t i = 0; i < geom.numFaces; i++)
        {
            Face f = geom.GetFace(i);
            glm::dvec3 a = geom.GetPoint(f.i0);
            glm::dvec3 b = geom.GetPoint(f.i1);
            glm::dvec3 c = geom.GetPoint(f.i2);
            AddFace(a, b, c);
        }
        uint32_t planeDataOffset = geom.planes.size();
        for (uint32_t i = 0; i < geom.planeData.size(); i++)
        {
            planeData.push_back(planeDataOffset + geom.planeData[i]);
        }

        for (uint32_t i = 0; i < geom.planes.size(); i++)
        {
            planes.push_back(geom.planes[i]);
        }
    }
}