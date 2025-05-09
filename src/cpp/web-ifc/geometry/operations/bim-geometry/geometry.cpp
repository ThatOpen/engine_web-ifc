#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "geometry.h"
#include "epsilons.h"
#include "utils.h"
#include "face.h"

namespace bimGeometry
{
    void Geometry::AddPoint(glm::dvec4& pt, glm::dvec3& n)
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

    void Geometry::AddPoint(glm::dvec3& pt, glm::dvec3& n)
    {
        //vertexData.reserve((numPoints + 1) * VERTEX_FORMAT_SIZE_FLOATS);
        //vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 0] = pt.x;
        //vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 1] = pt.y;
        //vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 2] = pt.z;
        vertexData.push_back(pt.x);
        vertexData.push_back(pt.y);
        vertexData.push_back(pt.z);

        vertexData.push_back(n.x);
        vertexData.push_back(n.y);
        vertexData.push_back(n.z);

        //vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 3] = n.x;
        //vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 4] = n.y;
        //vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 5] = n.z;

        numPoints += 1;
    }

    glm::dvec3 Geometry::GetPoint(size_t index) const
    {
        return glm::dvec3(
            vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 0],
            vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 1],
            vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 2]
        );
    }

    Face Geometry::GetFace(size_t index) const
    {
        Face f;
        f.i0 = indexData[index * 3 + 0];
        f.i1 = indexData[index * 3 + 1];
        f.i2 = indexData[index * 3 + 2];
        return f;
    }

    void Geometry::AddFace(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
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

        AddFace(numPoints - 3, numPoints - 2, numPoints - 1);
    }

    void Geometry::AddFace(uint32_t a, uint32_t b, uint32_t c)
    {
        indexData.push_back(a);
        indexData.push_back(b);
        indexData.push_back(c);

        double area = areaOfTriangle(GetPoint(a), GetPoint(b), GetPoint(c));

        numFaces++;
    }
}