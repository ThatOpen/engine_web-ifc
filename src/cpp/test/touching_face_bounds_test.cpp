/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <cmath>
#include <vector>
#include "../web-ifc/geometry/operations/geometryutils.h"
#include "TinyCppTest.hpp"

TEST(TouchingInnerFaceBound)
{
    using namespace webifc::geometry;
    // The first inner vertex may lie on an outer vertex or an outer edge.
    // Rotating the loop must not change whether the face is retained.
    const std::vector<std::vector<glm::dvec3>> holes = {
        {{0, 0, 0}, {1, 2, 0}, {2, 1, 0}},
        {{0, 2, 0}, {1, 3, 0}, {1, 1, 0}},
    };
    const double areas[] = {14.5, 15.0};
    for (size_t h = 0; h < holes.size(); h++)
    {
        for (size_t start = 0; start < holes[h].size(); start++)
        {
            IfcBound3D outer{};
            outer.type = IfcBoundType::OUTERBOUND;
            outer.orientation = true;
            outer.curve.points = {{0, 0, 0}, {4, 0, 0}, {4, 4, 0}, {0, 4, 0}};
            IfcBound3D inner{};
            inner.type = IfcBoundType::BOUND;
            inner.orientation = true;
            for (size_t i = 0; i < holes[h].size(); i++)
                inner.curve.points.push_back(holes[h][(start + i) % holes[h].size()]);
            std::vector<IfcBound3D> bounds{outer, inner};
            IfcGeometry geometry;
            TriangulateBounds(geometry, bounds, 1);
            double area = 0;
            for (uint32_t i = 0; i < geometry.numFaces; i++)
            {
                const auto face = geometry.GetFace(i);
                const auto a = geometry.GetPoint(face.i0);
                const auto b = geometry.GetPoint(face.i1);
                const auto c = geometry.GetPoint(face.i2);
                area += glm::length(glm::cross(b - a, c - a)) / 2;
            }
            ASSERT(std::abs(area - areas[h]) < 1e-9);
        }
    }
}
