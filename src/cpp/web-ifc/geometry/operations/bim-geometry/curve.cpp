#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "curve.h"
#include "utils.h"
#include "epsilons.h"

namespace bimGeometry
{
    // Fragments -> Issue #89 -> requires "removeCoincident" switch
	void Curve::Add(glm::dvec3 pt, bool removeCoincident)
	{

		if (points.empty() || !removeCoincident)
			points.push_back(pt);
		else if (!equals(pt, points.back(), EPS_TINY_CURVE))
			points.push_back(pt);
	}

    void Curve::Add(glm::dvec2 pt)
    {
        glm::dvec3 point;
        point.x = pt.x;
        point.y = pt.y;
        point.z = 0;
        Add(point);
    }

    void Curve::Invert()
    {
        std::reverse(points.begin(), points.end());
    }

    bool Curve::IsCCW() const
    {
        double sum = 0;
        auto n = points.size();

        for (size_t i = 0; i < n; i++)
        {
            glm::dvec3 pt1 = points.at((i + n - 1) % n);
            glm::dvec3 pt2 = points.at(i);

            sum += (pt2.x - pt1.x) * (pt2.y + pt1.y);
        }

        return sum < 0;
    }
}