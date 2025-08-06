#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "geometry.h"
#include "epsilons.h"
#include "utils.h"
#include "plane.h"

#pragma once

namespace bimGeometry
{
    bool Plane::IsEqualTo(const Vec &n, double d)
    {
        return (equals(normal, n, toleranceVectorEquality) && equals(distance, d, _TOLERANCE_SCALAR_EQUALITY));
    }
}