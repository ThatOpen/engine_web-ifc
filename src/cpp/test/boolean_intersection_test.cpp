/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <array>
#include <glm/gtc/matrix_transform.hpp>
#include "../web-ifc/geometry/operations/boolean-utils/fuzzy-bools.h"
#include "TinyCppTest.hpp"

namespace {
using namespace fuzzybools;

Geometry ShearedBox(Vec lo, Vec hi, double slope, const glm::dmat4 &transform)
{
    Geometry g;
    auto point = [&](double x, double y, double z)
    { return Vec(transform * glm::dvec4(x, y, z + slope * x, 1)); };
    const std::array<Vec, 8> vertices = {
        point(lo.x, lo.y, lo.z), point(hi.x, lo.y, lo.z),
        point(hi.x, hi.y, lo.z), point(lo.x, hi.y, lo.z),
        point(lo.x, lo.y, hi.z), point(hi.x, lo.y, hi.z),
        point(hi.x, hi.y, hi.z), point(lo.x, hi.y, hi.z),
    };
    for (auto face : {std::array{0,3,2,1}, std::array{4,5,6,7},
                     std::array{0,1,5,4}, std::array{1,2,6,5},
                     std::array{2,3,7,6}, std::array{3,0,4,7}})
    {
        const auto a = vertices[face[0]], b = vertices[face[1]];
        const auto c = vertices[face[2]], d = vertices[face[3]];
        const auto normal = computeNormal(a, b, c);
        const auto id = static_cast<uint32_t>(g.planes.size());
        g.planes.push_back({glm::dot(normal, a), normal});
        g.AddFace(a, b, c, id);
        g.AddFace(a, c, d, id);
    }
    g.hasPlanes = true;
    return g;
}

}

TEST(ShallowPlaneIntersectionsPreserveClosedDifference)
{
    using namespace fuzzybools;
    // Other processor tests set these globals to their model-specific settings.
    const std::array previous = {_TOLERANCE_PLANE_INTERSECTION, _TOLERANCE_PLANE_DEVIATION,
        _TOLERANCE_BACK_DEVIATION_DISTANCE, _TOLERANCE_INSIDE_OUTSIDE_PERIMETER,
        _TOLERANCE_BOUNDING_BOX, _BOOLSTATUS};
    SetEpsilons(1e-4, 1e-4, 1e-4, 1e-10, 1e-2, 0);
    // The cutter removes a triangular prism from the top of a cube. Its bottom
    // is z = 1 + slope * (x - 0.3), so the removed volume is 1.3^2 * slope.
    // An off-centre crossing prevents a pre-existing triangle diagonal from
    // accidentally supplying the missing intersection constraint.
    for (double scale : {1.0, 1000.0})
    for (bool transformed : {false, true})
    for (double degrees : {0.0, 0.1, 0.5, 0.8, 1.0, 2.0})
    {
        auto transform = glm::dmat4(1);
        if (transformed)
        {
            transform = glm::translate(transform, Vec(1250, -2000, 13.75));
            transform = glm::rotate(transform, 0.731, glm::normalize(Vec(1, 2, 3)));
        }
        transform = glm::scale(transform, Vec(scale));
        const auto inverse = glm::inverse(transform);
        const double slope = std::tan(degrees * std::acos(-1.0) / 180.0);
        const auto a = ShearedBox(Vec(-1), Vec(1), 0, transform);
        const auto b = ShearedBox(Vec(-2, -2, 1 - 0.3 * slope), Vec(2, 2, 3), slope, transform);
        const auto result = Subtract(a, b);
        ASSERT(result.numFaces > 0);
        Vec areaVector(0);
        double volume = 0, shiftedVolume = 0;
        const Vec shift(10, -20, 5);
        for (uint32_t i = 0; i < result.numFaces; i++)
        {
            const auto face = result.GetFace(i);
            const auto point = [&](uint32_t index)
            { return Vec(inverse * glm::dvec4(result.GetPoint(index), 1)); };
            const auto x = point(face.i0), y = point(face.i1), z = point(face.i2);
            for (const auto p : {x, y, z})
            {
                ASSERT(glm::all(glm::lessThanEqual(glm::abs(p), Vec(1 + 1e-6))));
                ASSERT(p.z <= 1 + slope * (p.x - 0.3) + 1e-6);
            }
            areaVector += glm::cross(y - x, z - x) / 2.0;
            volume += glm::dot(x, glm::cross(y, z)) / 6.0;
            shiftedVolume += glm::dot(x - shift, glm::cross(y - shift, z - shift)) / 6.0;
        }
        ASSERT(glm::length(areaVector) < 1e-7);
        ASSERT(std::abs(volume - (8 - 1.69 * slope)) < 1e-7);
        ASSERT(std::abs(shiftedVolume - volume) < 1e-7);
    }
    SetEpsilons(previous[0], previous[1], previous[2], previous[3], previous[4], previous[5]);
}
