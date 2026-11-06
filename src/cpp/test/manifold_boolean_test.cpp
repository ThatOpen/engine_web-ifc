/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <array>
#include <glm/gtc/matrix_transform.hpp>
#include "../web-ifc/geometry/operations/manifold-booleans.h"
#include "TinyCppTest.hpp"

namespace
{
    using namespace webifc::geometry;
    using Point = glm::dvec3;

    IfcGeometry Box(Point lo, Point hi, double slope = 0, const glm::dmat4 &transform = glm::dmat4(1), bool splitEdge = false)
    {
        const auto point = [&](double x, double y, double z)
        { return Point(transform * glm::dvec4(x, y, z+slope*x, 1)); };
        const std::array<Point, 8> p = {point(lo.x,lo.y,lo.z),point(hi.x,lo.y,lo.z),
            point(hi.x,hi.y,lo.z),point(lo.x,hi.y,lo.z),point(lo.x,lo.y,hi.z),
            point(hi.x,lo.y,hi.z),point(hi.x,hi.y,hi.z),point(lo.x,hi.y,hi.z)};
        IfcGeometry g;
        for (auto f : {std::array{0,3,2,1},std::array{4,5,6,7},std::array{0,1,5,4},
                       std::array{1,2,6,5},std::array{2,3,7,6},std::array{3,0,4,7}})
        {
            if (splitEdge && f[0] == 0 && f[1] == 3)
            {
                const auto mid = (p[f[0]]+p[f[1]])/2.0;
                g.AddFace(p[f[0]],mid,p[f[2]]);
                g.AddFace(mid,p[f[1]],p[f[2]]);
            }
            else g.AddFace(p[f[0]],p[f[1]],p[f[2]]);
            g.AddFace(p[f[0]],p[f[2]],p[f[3]]);
        }
        return g;
    }

    bool HasClosedVolume(const IfcGeometry &g, double expected, const glm::dmat4 &inverse = glm::dmat4(1))
    {
        Point sum(0);
        glm::dmat3 moments(0);
        for (uint32_t i = 0; i < g.numFaces; ++i)
        {
            const auto f = g.GetFace(i);
            const auto point = [&](uint32_t id) { return Point(inverse * glm::dvec4(g.GetPoint(id),1)); };
            const auto a = point(f.i0), b = point(f.i1), c = point(f.i2);
            const auto area = glm::cross(b-a,c-a)/2.0;
            sum += area;
            moments += glm::outerProduct(area,(a+b+c)/3.0);
        }
        const auto tolerance = 1e-8*std::max(1.0,expected);
        if (!(glm::length(sum) < tolerance)) return false;
        for (int row = 0; row < 3; ++row)
            for (int col = 0; col < 3; ++col)
                if (!(std::abs(moments[col][row]-(row==col ? expected : 0.0)) < tolerance)) return false;
        return true;
    }
}

TEST(SolidBooleanPreservesNarrowPrismWithoutSpecialCases)
{
    for (double scale : {0.001,1.0,1000.0})
    for (bool reversed : {false,true})
    {
        auto transform = glm::translate(glm::dmat4(1),Point(1250,-2000,13.75));
        transform = glm::rotate(transform,0.731,glm::normalize(Point(1,2,3)));
        transform = glm::scale(transform,Point(scale));
        std::array<Point,6> p = {Point(0,0,0),Point(8000,0,0),Point(8000,0.1,0),
            Point(0,0,100),Point(8000,0,100),Point(8000,0.1,100)};
        for (auto &v : p) v = Point(transform*glm::dvec4(v,1));
        IfcGeometry prism;
        for (auto f : {std::array{0,2,1},std::array{3,4,5},std::array{0,1,4},std::array{0,4,3},
                       std::array{1,2,5},std::array{1,5,4},std::array{2,0,3},std::array{2,3,5}})
            prism.AddFace(p[f[0]],p[f[1]],p[f[2]]);
        if (reversed) prism.ReverseFaces();
        const auto sourceVertices = prism.vertexData;
        // Bounding boxes overlap, but the cutter is wholly outside the prism.
        const auto cutter = Box(Point(100,0.04,-10),Point(200,0.06,110),0,transform);
        IfcGeometry result;
        ASSERT(TryManifoldBoolean(prism,{cutter},"DIFFERENCE",result));
        ASSERT(prism.vertexData == sourceVertices);
        ASSERT(HasClosedVolume(result,40000,glm::inverse(transform)));
    }
}

TEST(SolidBooleanResolvesDifferentEdgeSubdivisions)
{
    const auto box = Box(Point(-1),Point(1),0,glm::dmat4(1),true);
    IfcGeometry result;
    ASSERT(TryManifoldBoolean(box,{Box(Point(-2,-2,0),Point(2))},"DIFFERENCE",result));
    ASSERT(HasClosedVolume(result,4));
}

TEST(SolidBooleanHandlesShallowIntersectionsAtDifferentScales)
{
    for (double scale : {1.0,1000.0})
    for (bool moved : {false,true})
    for (double degrees : {0.0,0.1,0.5,0.8,1.0,2.0})
    {
        auto transform = glm::dmat4(1);
        if (moved)
        {
            transform = glm::translate(transform,Point(1250,-2000,13.75));
            transform = glm::rotate(transform,0.731,glm::normalize(Point(1,2,3)));
        }
        transform = glm::scale(transform,Point(scale));
        const auto inverse = glm::inverse(transform);
        const double slope = std::tan(degrees*std::acos(-1.0)/180.0);
        const auto a = Box(Point(-1),Point(1),0,transform);
        const auto b = Box(Point(-2,-2,1-0.3*slope),Point(2,2,3),slope,transform);
        IfcGeometry result;
        ASSERT(TryManifoldBoolean(a,{b},"DIFFERENCE",result));
        ASSERT(HasClosedVolume(result,8-1.69*slope,inverse));
        for (uint32_t i = 0; i < result.numPoints; ++i)
        {
            const auto p = Point(inverse*glm::dvec4(result.GetPoint(i),1));
            ASSERT(glm::all(glm::lessThanEqual(glm::abs(p),Point(1+1e-7))));
            ASSERT(p.z <= 1+slope*(p.x-0.3)+1e-7);
        }
    }
}

TEST(SolidBooleanRejectsOpenInputWithoutChangingTheResult)
{
    auto open = Box(Point(-1),Point(1));
    open.numFaces -= 1;
    open.indexData.resize(open.numFaces*3);
    open.planeData.resize(open.numFaces);
    auto result = Box(Point(-2),Point(2));
    const auto vertices = result.vertexData;
    ASSERT(!TryManifoldBoolean(open,{Box(Point(0),Point(3))},"DIFFERENCE",result));
    ASSERT(result.vertexData == vertices);
    ASSERT(HasClosedVolume(result,64));
}

TEST(SolidBooleanPreservesSeparateShellsTouchingAlongAnEdge)
{
    // Two planar regions meet at one point; their extrusions share a geometric
    // edge, but each shell must keep its own pair of incident faces. Interleave
    // the faces so importing them cannot rely on their input order for pairing.
    std::vector<std::array<Point, 3>> triangles;
    const auto prism = [&](const std::vector<glm::dvec2> &polygon)
    {
        const auto point = [&](size_t i, double z) { return Point(polygon[i], z); };
        for (size_t i = 1; i+1 < polygon.size(); ++i)
        {
            triangles.push_back({point(0,0),point(i+1,0),point(i,0)});
            triangles.push_back({point(0,0.2),point(i,0.2),point(i+1,0.2)});
        }
        for (size_t i = 0; i < polygon.size(); ++i)
        {
            const auto j = (i+1)%polygon.size();
            triangles.push_back({point(i,0),point(j,0),point(j,0.2)});
            triangles.push_back({point(i,0),point(j,0.2),point(i,0.2)});
        }
    };
    // Fan from the reflex corner so the concave polygon has no overlapping
    // triangles; a fan from (0,0) would introduce self-intersecting surfaces.
    prism({{4.9,0.5},{0,0.5},{0,0},{5,0},{5,3.5}});
    prism({{0,3.5},{5,3.5},{5,4.5},{0,4.5}});
    const std::array order = {3,1,24,26,21,20,7,11,27,17,23,15,25,2,
                             16,12,10,4,5,8,0,9,14,18,22,13,6,19};
    for (double scale : {0.001,1.0,1000.0})
    for (bool reversed : {false,true})
    {
        auto transform = glm::translate(glm::dmat4(1),Point(1250,-2000,13.75));
        transform = glm::rotate(transform,0.731,glm::normalize(Point(1,2,3)));
        transform = glm::scale(transform,Point(scale));
        IfcGeometry input;
        for (auto i : order)
        {
            std::array<Point,3> p;
            for (int k=0;k<3;++k) p[k] = Point(transform*glm::dvec4(triangles[i][k],1));
            input.AddFace(p[0],p[1],p[2]);
        }
        if (reversed) input.ReverseFaces();
        IfcGeometry result;
        ASSERT(TryManifoldBoolean(input,{Box(Point(10),Point(11),0,transform)},"DIFFERENCE",result));
        ASSERT(HasClosedVolume(result,1.53,glm::inverse(transform)));
        // An actual cut removes 0.1*5*1 from the upper rectangular prism.
        ASSERT(TryManifoldBoolean(input,{Box(Point(-1,3.5,0.1),Point(6,5,1),0,transform)},"DIFFERENCE",result));
        ASSERT(HasClosedVolume(result,1.03,glm::inverse(transform)));
    }
}
