/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <array>
#include <glm/gtc/matrix_transform.hpp>
#include "../web-ifc/geometry/operations/boolean-utils/is-inside-mesh.h"
#include "TinyCppTest.hpp"

namespace {
using namespace fuzzybools;

Geometry Box(bool gap, bool duplicate, const glm::dmat4 &transform, bool reverse)
{
    Geometry g;
    auto quad = [&](Vec a, Vec b, Vec c, Vec d)
    {
        a = Vec(transform * glm::dvec4(a, 1));
        b = Vec(transform * glm::dvec4(b, 1));
        c = Vec(transform * glm::dvec4(c, 1));
        d = Vec(transform * glm::dvec4(d, 1));
        if (reverse) std::swap(b, d);
        g.AddFace(a, b, c, 0); g.AddFace(a, c, d, 0);
    };
    quad({0,0,1},{1,0,1},{1,1,1},{0,1,1});
    quad({0,0,0},{1,0,0},{1,0,1},{0,0,1});
    quad({1,0,0},{1,1,0},{1,1,1},{1,0,1});
    quad({1,1,0},{0,1,0},{0,1,1},{1,1,1});
    quad({0,1,0},{0,0,0},{0,0,1},{0,1,1});
    auto bottom = [&](double x0, double y0, double x1, double y1)
    { quad({x0,y0,0},{x0,y1,0},{x1,y1,0},{x1,y0,0}); };
    if (gap)
    {
        // A 1% opening in a flat face, with no curves or model-specific coordinates.
        bottom(0,0,0.45,1); bottom(0.55,0,1,1);
        bottom(0.45,0,0.55,0.45); bottom(0.45,0.55,0.55,1);
    }
    else bottom(0,0,1,1);
    if (duplicate) bottom(0,0,1,1);
    return g;
}
}

TEST(SolidClassificationHandlesGapsAndDuplicateFacesAcrossTransforms)
{
    using namespace fuzzybools;
    const double oldPlane = _TOLERANCE_PLANE_DEVIATION;
    const double oldBack = _TOLERANCE_BACK_DEVIATION_DISTANCE;
    for (double scale : {0.01, 1.0, 1000.0})
    for (bool translated : {false, true})
    for (bool reverse : {false, true})
    {
        auto transform = glm::rotate(glm::dmat4(1), 0.731, glm::normalize(Vec(1,2,3)));
        if (translated) transform = glm::translate(glm::dmat4(1), Vec(1250,-2000,13.75)) * transform;
        transform = glm::scale(transform, Vec(scale));
        _TOLERANCE_PLANE_DEVIATION = 1e-7 * scale;
        _TOLERANCE_BACK_DEVIATION_DISTANCE = 1e-7 * scale;
        const auto point = [&](Vec p) { return Vec(transform * glm::dvec4(p, 1)); };
        const Vec direction = glm::normalize(Vec(transform * glm::dvec4(0,0,1,0)));
        for (auto defects : {std::array{false,false}, std::array{true,false}, std::array{false,true}})
        {
            auto g = Box(defects[0], defects[1], transform, reverse);
            auto bvh = MakeBVH(g);
            for (double sign : {-1.0, 1.0})
            {
                ASSERT(classifyPointInSolid(point({0.5,0.5,-0.2}), Vec(0), g, bvh, sign*direction).loc == MeshLocation::OUTSIDE);
                ASSERT(classifyPointInSolid(point({0.5,0.5,0.2}), Vec(0), g, bvh, sign*direction).loc == MeshLocation::INSIDE);
            }
            // Boundary handling must still return the original operand normal, including
            // the subtraction convention for a query normal facing the other way.
            if (!reverse)
            {
                const Vec normal = glm::normalize(Vec(transform * glm::dvec4(1,0,0,0)));
                auto surface = classifyPointInSolid(point({1,0.5,0.5}), normal, g, bvh, direction);
                ASSERT(surface.loc == MeshLocation::BOUNDARY && surface.onBoundary);
                auto opposite = classifyPointInSolid(point({1,0.5,0.5}), -normal, g, bvh, direction);
                ASSERT(opposite.loc == MeshLocation::OUTSIDE && opposite.onBoundary);
            }
        }
    }
    _TOLERANCE_PLANE_DEVIATION = oldPlane;
    _TOLERANCE_BACK_DEVIATION_DISTANCE = oldBack;
}

TEST(SolidClassificationResolvesSharedEdgeRayHits)
{
    using namespace fuzzybools;
    auto g = Box(false, false, glm::dmat4(1), false);
    auto bvh = MakeBVH(g);
    for (double sign : {-1.0, 1.0})
    {
        // Compensate for the legacy ray perturbation so the ray goes exactly
        // through the diagonal shared by both triangles of the top/bottom faces.
        const Vec dir = Vec(0,0,sign) - RAY_DIRECTION_PERTURBATION;
        const auto ray = isInsideMesh(Vec(0.5,0.5,0.2), Vec(0), g, bvh, dir);
        ASSERT(ray.ambiguous);
        ASSERT(classifyPointInSolid(Vec(0.5,0.5,0.2), Vec(0), g, bvh, dir).loc == MeshLocation::INSIDE);
        ASSERT(classifyPointInSolid(Vec(0.5,0.5,-0.2), Vec(0), g, bvh, dir).loc == MeshLocation::OUTSIDE);
    }
}

TEST(SolidClassificationPreservesInternalVoids)
{
    using namespace fuzzybools;
    for (bool gap : {false, true})
    {
        auto g = Box(gap, false, glm::dmat4(1), false);
        const auto transform = glm::scale(glm::translate(glm::dmat4(1), Vec(0.25)), Vec(0.5));
        const auto cavity = Box(false, false, transform, true);
        for (uint32_t i = 0; i < cavity.numFaces; i++)
        {
            const auto f = cavity.GetFace(i);
            g.AddFace(cavity.GetPoint(f.i0), cavity.GetPoint(f.i1), cavity.GetPoint(f.i2), 0);
        }
        auto bvh = MakeBVH(g);
        for (double sign : {-1.0, 1.0})
        {
            const Vec dir = sign * Vec(0,0,1);
            ASSERT(classifyPointInSolid(Vec(0.5), Vec(0), g, bvh, dir).loc == MeshLocation::OUTSIDE);
            ASSERT(classifyPointInSolid(Vec(0.5,0.5,0.1), Vec(0), g, bvh, dir).loc == MeshLocation::INSIDE);
        }
    }
}
