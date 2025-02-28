#include <vector>
#include <algorithm>
#include <glm/glm.hpp>

namespace bimGeometry
{
    inline	bool equals(glm::dvec3 A, glm::dvec3 B, double eps = 0)
    {
        return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps && std::fabs(A.z - B.z) <= eps;
    }
}