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

TEST(TouchingOuterContourPreservesAreaAndLobes)
{
    using namespace webifc::geometry;
    // The first vertex also lies inside the edge from (0,0) to (2,0).
    // The face consists of a triangle of area 0.5 and a rectangle of area 2.
    const std::vector<glm::dvec3> contour = {{1,0,0},{0,1,0},{0,0,0},{2,0,0},{2,2,0},{1,2,0}};
    for (double scale : {0.001, 1.0, 1000.0})
    for (bool reversed : {false,true})
    for (size_t start = 0; start < contour.size(); ++start)
    {
        auto transform = glm::translate(glm::dmat4(1),glm::dvec3(1250,-2000,13.75));
        transform = glm::rotate(transform,0.731,glm::normalize(glm::dvec3(1,2,3)));
        transform = glm::scale(transform,glm::dvec3(scale));
        const auto inverse = glm::inverse(transform);
        IfcBound3D bound{};
        bound.type = IfcBoundType::OUTERBOUND;
        bound.orientation = true;
        for (size_t i = 0; i < contour.size(); ++i)
        {
            const auto index = reversed ? (start+contour.size()-i)%contour.size() : (start+i)%contour.size();
            bound.curve.points.push_back(glm::dvec3(transform*glm::dvec4(contour[index],1)));
        }
        std::vector<IfcBound3D> bounds{bound};
        IfcGeometry geometry;
        TriangulateBounds(geometry,bounds,1);
        double area = 0;
        for (uint32_t i=0;i<geometry.numFaces;++i)
        {
            const auto f = geometry.GetFace(i);
            const auto a = glm::dvec3(inverse*glm::dvec4(geometry.GetPoint(f.i0),1));
            const auto b = glm::dvec3(inverse*glm::dvec4(geometry.GetPoint(f.i1),1));
            const auto c = glm::dvec3(inverse*glm::dvec4(geometry.GetPoint(f.i2),1));
            area += glm::length(glm::cross(b-a,c-a))/2;
            const auto centre = (a+b+c)/3.0;
            ASSERT((centre.x >= 1-1e-8 && centre.x <= 2+1e-8 && centre.y >= -1e-8 && centre.y <= 2+1e-8) ||
                (centre.x >= -1e-8 && centre.y >= -1e-8 && centre.x+centre.y <= 1+1e-8));
        }
        ASSERT(std::abs(area-2.5)<1e-8);
    }
}
