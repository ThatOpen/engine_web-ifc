#pragma once

namespace bimGeometry
{
    struct Plane
    {
        double distance;
        Vec normal;
        size_t id;

		bool IsEqualTo(const Vec &n, double d);
	};
}