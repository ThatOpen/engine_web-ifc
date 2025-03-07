#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "aabb.h"
#include "epsilons.h"

using Vec = glm::dvec3;

namespace bimGeometry {

    bool AABB::intersects(const AABB& other) const
    {
    double eps = EPS_BIG;
    return (max.x + eps >= other.min.x && other.max.x + eps >= min.x &&
                max.y + eps >= other.min.y && other.max.y + eps >= min.y &&
                max.z + eps >= other.min.z && other.max.z + eps >= min.z);
    }

    bool AABB::contains(const Vec& pos) const
    {
        double eps = EPS_BIG;
        return  pos.x + eps >= min.x && pos.x - eps <= max.x &&
                pos.y + eps >= min.y && pos.y - eps <= max.y &&
                pos.z + eps >= min.z && pos.z - eps <= max.z;
    }

    void AABB::merge(const AABB& other)
    {
        min = glm::min(min, other.min);
        max = glm::max(max, other.max);
    }

    void AABB::merge(const glm::dvec3& other)
    {
        min = glm::min(min, other);
        max = glm::max(max, other);
    }

    bool AABB::Intersect(const Vec& origin, const Vec& dir) const
    {
        // r.dir is unit direction vector of ray
        Vec dirfrac;
        dirfrac.x = 1.0 / dir.x;
        dirfrac.y = 1.0 / dir.y;
        dirfrac.z = 1.0 / dir.z;
        // lb is the corner of AABB with minimal coordinates - left bottom, rt is maximal corner
        // r.org is origin of ray
        double t1 = (min.x - origin.x) * dirfrac.x;
        double t2 = (max.x - origin.x) * dirfrac.x;
        double t3 = (min.y - origin.y) * dirfrac.y;
        double t4 = (max.y - origin.y) * dirfrac.y;
        double t5 = (min.z - origin.z) * dirfrac.z;
        double t6 = (max.z - origin.z) * dirfrac.z;

        double tmin = std::max(std::max(std::min(t1, t2), std::min(t3, t4)), std::min(t5, t6));
        double tmax = std::min(std::min(std::max(t1, t2), std::max(t3, t4)), std::max(t5, t6));

        // if tmax < 0, ray (line) is intersecting AABB, but the whole AABB is behind us
        if (tmax < -EPS_BIG)
        {
            //t = tmax;
            return false;
        }

        // if tmin > tmax, ray doesn't intersect AABB
        if (tmin > tmax + EPS_BIG)
        {
            //t = tmax;
            return false;
        }

        //t = tmin;
        return true;
    }

    Buffers AABB::GetBuffers()
    {
        Buffers buffers;

        buffers.AddPoint(Vec(max.x,max.y,min.z));
        buffers.AddPoint(Vec(max.x,min.y,min.z));
        buffers.AddPoint(Vec(max.x,min.y,max.z));
        buffers.AddPoint(Vec(max.x,max.y,max.z));
        buffers.AddPoint(Vec(min.x,max.y,min.z));
        buffers.AddPoint(Vec(min.x,min.y,min.z));
        buffers.AddPoint(Vec(min.x,min.y,max.z));
        buffers.AddPoint(Vec(min.x,max.y,max.z));

        buffers.AddTri(0, 1, 3);
        buffers.AddTri(3, 1, 2);
        buffers.AddTri(5, 2, 1);
        buffers.AddTri(2, 5, 6);
        buffers.AddTri(7, 0, 4);
        buffers.AddTri(3, 0, 7);
        buffers.AddTri(7, 4, 5);
        buffers.AddTri(5, 6, 7);
        buffers.AddTri(6, 7, 3);
        buffers.AddTri(6, 2, 3);
        buffers.AddTri(5, 1, 4);
        buffers.AddTri(1, 0, 4);

        return buffers;
    }

    void AABB::SetValues(double minX, double minY, double minZ, double maxX, double maxY, double maxZ) {
        min = Vec(minX, minY, minZ);
        max = Vec(maxX, maxY, maxZ);
        center = Vec((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
    }
}
