/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
 #pragma once

#include <map>
#include "../../deps/glm/glm/glm.hpp"
#include "../../deps/earcut/include/mapbox/earcut.hpp"

#include "../util.h"
#include "line-segment-intersect.h"

namespace webifc
{
    bool DUMP_SVG_TRIANGLES = false;

    uint32_t pointID = 0;
    uint32_t triangleID = 0;

    double sign(const Point& p1, const Point& p2, const Point& p3)
    {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }

    bool onEdge(const Point& p, const Point& a, const Point& b)
    {
        double dist = std::fabs(sign(p, a, b));
        return dist <= EPS_SMALL;
    }

    bool onEdge2(const Point& p, const Point& a, const Point& b)
    {
        double dist = std::fabs(sign(p, a, b));
        return dist < EPS_BIG;
    }

    double dot2d(const Point& p1, const Point& p2)
    {
        return p1.x * p2.x + p1.y * p2.y;
    }

    bool isAboveLine(const Point& lineStart, const Point& lineDir, const Point& p)
    {
        Point ps = {
            p.x - lineStart.x,
            p.y - lineStart.y
        };

        Point perp = {
            -lineDir.y,
            lineDir.x
        };

        double psperp = dot2d(ps, perp);

        return psperp >= 0;
    }

    bool isConvex(const Point& a, const Point& b, const Point& c)
    {
        double sign = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
        return sign < -EPS_MINISCULE;
    }

    Point makePoint(double x, double y)
    {
        Point p;
        p.id = pointID++;
        p.x = x;
        p.y = y;

        return p;
    }

    // ccw
    bool makeTriangle(std::vector<Triangle>& triangles, const Point& a, const Point& b, const Point& c)
    {
        Triangle t;
        t.a = a;
        t.b = b;
        t.c = c;
        t.id = triangleID++;

        if (t.a.id == t.b.id || t.b.id == t.c.id || t.a.id == t.c.id)
        {
            printf("bad triangle ID");
        }

        double area = areaOfTriangle(t.a(), t.b(), t.c());

        if (area == 0)
        {
            // Should we be making this triangle at all?
            //triangles.resize(t.id + 1);
            //triangles[t.id].id = -1;
            printf("0 triangle\n");
        }

        if (TriangleIsCW(t.a(), t.b(), t.c()))
        {
            std::swap(t.a, t.b);
        }

        if (TriangleIsCW(t.a(), t.b(), t.c()))
        {
            printf("bad triangle winding");
        }

        triangles.resize(t.id + 1);
        triangles[t.id] = t;

        return true;
    }

    bool PointInTriangle(const Triangle& t, const Point& p)
    {
        double d1, d2, d3;
        bool has_neg, has_pos;

        d1 = sign(p, t.a, t.b);
        d2 = sign(p, t.b, t.c);
        d3 = sign(p, t.c, t.a);

        has_neg = (d1 < -EPS_TINY) || (d2 < -EPS_TINY) || (d3 < -EPS_TINY);
        has_pos = (d1 > EPS_TINY) || (d2 > EPS_TINY) || (d3 > EPS_TINY);

        return !(has_neg && has_pos);
    }

    // TODO: slow
    int32_t FindTriangleWithEdge(int32_t a, int32_t b, std::vector<Triangle>& triangles)
    {
        for (int i = 0; i < triangles.size(); i++)
        {
            Triangle& t = triangles[i];

            if (t.id == -1) continue;

            if (t.a.id == a && t.b.id == b)
            {
                return i;
            }
            else if (t.b.id == a && t.c.id == b)
            {
                return i;
            }
            else if (t.c.id == a && t.a.id == b)
            {
                return i;
            }
        }

        return -1;
    }

    // TODO: slow
    std::vector<int32_t> FindTrianglesWithEdge(int32_t a, int32_t b, std::vector<Triangle>& triangles)
    {
        std::vector<int32_t> result;
        std::vector<int32_t> deleted;
        glm::dvec2 apt;
        glm::dvec2 bpt;

        for (int i = 0; i < triangles.size(); i++)
        {
            Triangle& t = triangles[i];

            bool found = false;
            if (t.a.id == a && t.b.id == b)
            {
                found = true;
                apt = t.a();
                bpt = t.b();
            }
            else if (t.b.id == a && t.c.id == b)
            {
                found = true;
                apt = t.b();
                bpt = t.c();
            }
            else if (t.c.id == a && t.a.id == b)
            {
                found = true;
                apt = t.c();
                bpt = t.a();
            }
            else if (t.a.id == b && t.b.id == a)
            {
                found = true;
                apt = t.b();
                bpt = t.a();
            }
            else if (t.b.id == b && t.c.id == a)
            {
                found = true;
                apt = t.c();
                bpt = t.b();
            }
            else if (t.c.id == b && t.a.id == a)
            {
                found = true;
                apt = t.a();
                bpt = t.c();
            }

            if (found)
            {
                if (t.id == -1)
                {
                    deleted.push_back(i);
                }
                else
                {
                    result.push_back(i);
                }
            }
        }

        Triangle& t = triangles[0];
        Point pta;
        pta.x = apt.x;
        pta.y = apt.y;
        Point ptb;
        ptb.x = bpt.x;
        ptb.y = bpt.y;

        bool bothOnEdge = (onEdge2(pta, t.a, t.b) && onEdge2(ptb, t.a, t.b)) || (onEdge2(pta, t.b, t.c) && onEdge2(ptb, t.b, t.c)) || (onEdge2(pta, t.c, t.a) && onEdge2(ptb, t.c, t.a));

        // every edge must be replaced by a new edge, whether it has 1 or 2 adjacent triangles
        // a mismatch here means we made a mistake
        if (result.size() > 2)
        {
            printf("Triangle with this edge already deleted!");
        }

        return result;
    }

    void CheckTriangleEdges(Triangle& t, std::vector<Triangle>& triangles)
    {
        FindTrianglesWithEdge(t.a.id, t.b.id, triangles);
        FindTrianglesWithEdge(t.b.id, t.c.id, triangles);
        FindTrianglesWithEdge(t.c.id, t.a.id, triangles);
    }

    void triangulateBoundary(std::vector<Point>& boundary, std::vector<Triangle>& triangles)
    {
        // special case triangle
        if (boundary.size() == 3)
        {
            // can just create a triangle for the boundary, no triangulation needed
            makeTriangle(triangles, boundary[2], boundary[1], boundary[0]);
        }
        else
        {
            // here we actually do a monotone mountain triangulation!
            // see: http://www.ams.sunysb.edu/~jsbm/courses/345/13/triangulating-monotone-mountains.pdf
            // for an incomplete description
            int iteration = 0;
            for (int i = 1; i < boundary.size() - 1;)
            {
                iteration++;
                if (iteration > 1000)
                {
                    printf("asdfasdf");
                }

                bool notConvex = false;
                if (isConvex(boundary[i - 1], boundary[i], boundary[i + 1]))
                {
                    makeTriangle(triangles, boundary[i + 1], boundary[i], boundary[i - 1]);
                    boundary.erase(boundary.begin() + i);
                }
                else
                {
                    notConvex = true;
                }

                if (i != 1 && isConvex(boundary[i - 2], boundary[i - 1], boundary[i]))
                {
                    i = i - 1;
                }
                else if (notConvex)
                {
                    // prevent infinite loop
                    i = i + 1;
                }
            }
        }
    }

    std::vector<Point> deduplicateConcecutivePoints(std::vector<Point>& pts)
    {
        std::vector<Point> result;

        if (!pts.empty())
        {
            result.push_back(pts[0]);
        }
        for (int i = 1; i < pts.size(); i++)
        {
            Point& p = pts[i];
            Point& prev = pts[i - 1];
            if (p.id != prev.id)
            {
                result.push_back(p);
            }
        }

        return result;
    }

    Point GetOtherPoint(Triangle& t, int32_t id1, int32_t id2)
    {
        if (t.a.id != id1 && t.a.id != id2)
        {
            return t.a;
        }
        if (t.b.id != id1 && t.b.id != id2)
        {
            return t.b;
        }
        if (t.c.id != id1 && t.c.id != id2)
        {
            return t.c;
        }

        return Point();
    }

    bool HasPoint(Triangle& t, int32_t id)
    {
        if (t.a.id == id || t.b.id == id || t.c.id == id)
        {
            return true;
        }
        return false;
    }

    bool EdgeEqual(Edge& e, Point& a, Point& b)
    {
        return (e.a == a.id && e.b == b.id) || (e.b == a.id && e.a == b.id);
    }

    void DumpPrevTriangles(size_t num, Point& p, Point& prev, std::vector<Triangle>& triangles)
    {
        std::vector<Triangle> temp;
        for (size_t i = 0; i < num; i++)
        {
            Triangle t = triangles[triangles.size() - 1 - i];
            CheckTriangleEdges(t, triangles);

            t.id = 0;
            temp.push_back(t);
        }
        DumpSVGTriangles(temp, p, prev, L"triangles.svg");
    }

    void DumpTriangleID(int num, Point& p, Point& prev, std::vector<Triangle>& triangles)
    {
        std::vector<Triangle> temp;
        Triangle t = triangles[num];
        t.id = 0;
        temp.push_back(t);
        DumpSVGTriangles(temp, p, prev, L"triangle.svg");
    }

    void DeleteTriangle(int id, std::vector<Triangle>& triangles)
    {
        auto t = triangles[id];
     
        /*
        int a = 17;
        int b = 18;
        if ((t.a.id == a && t.b.id == b) || (t.b.id == a && t.c.id == b) || (t.c.id == a && t.a.id == b))
        {
            printf("asdf");
        }
        
        int check = 18;
        if (t.a.id == 18 || t.b.id == 18 || t.c.id == 18)
        {
            printf("asdf");
        }
        if (t.id == 43)
        {
            printf("asdf");
        }
        */

        triangles[id].id = -1;
    }

    void WalkToPoint(Triangle current, Edge prevEdge, Point& p, std::vector<Triangle>& triangles, std::vector<bool>& visited)
    {
        if (visited[current.id])
        {
            // we are walking around hitting the same triangles, bad news
            printf("Bad walk!");
            return;
        }

        // mark current as visited
        visited[current.id] = true;

        if (current.a.id == p.id || current.b.id == p.id || current.c.id == p.id)
        {
            // triangle contains P, stop looking
            return;
        }

        std::pair<int, int> edges[3];
        edges[0] = { current.b.id, current.a.id };
        edges[1] = { current.c.id, current.b.id };
        edges[2] = { current.a.id, current.c.id };

        std::pair<double, int> d[3];
        d[0] = { sign(p, current.a, current.b), 0 };
        d[1] = { sign(p, current.b, current.c), 1 };
        d[2] = { sign(p, current.c, current.a), 2 };

        if (d[0].first < -EPS_TINY && d[1].first < -EPS_TINY && d[2].first < -EPS_TINY)
        {
            // all signs negative, point is inside triangle
            makeTriangle(triangles, current.a, current.b, p);
            makeTriangle(triangles, current.a, p, current.c);
            makeTriangle(triangles, p, current.b, current.c);

            DeleteTriangle(current.id, triangles);
            return;
        }

        if (d[0].first < d[1].first) std::swap(d[0], d[1]);
        if (d[1].first < d[2].first) std::swap(d[1], d[2]);
        if (d[0].first < d[1].first) std::swap(d[0], d[1]);

        for (auto& pair : d)
        {
            auto edge = edges[pair.second];
            int32_t adjacentTriangleID = FindTriangleWithEdge(edge.first, edge.second, triangles);
            if (adjacentTriangleID != -1)
            {
                Triangle adjacentTriangle = triangles[adjacentTriangleID];
                Edge newEdge;
                newEdge.a = edge.first;
                newEdge.b = edge.second;

                if (prevEdge.a == newEdge.b && prevEdge.b == newEdge.a)
                {
                    // we're going to the same edge we're coming from, p is on the edge, split triangles
                    if (std::fabs(pair.first) > EPS_TINY)
                    {
                        printf("bad adjacent edge");
                    }

                    // make tri 1, 2
                    Point tri1p = GetOtherPoint(triangles[current.id], prevEdge.a, prevEdge.b);
                    Point first1 = GetOtherPoint(triangles[current.id], tri1p.id, prevEdge.a);
                    Point second1 = GetOtherPoint(triangles[current.id], prevEdge.b, tri1p.id);
                    makeTriangle(triangles, p, first1, tri1p);
                    makeTriangle(triangles, second1, p, tri1p);
                    
                    // make tri 3, 4
                    Point tri2p = GetOtherPoint(triangles[adjacentTriangle.id], prevEdge.a, prevEdge.b);
                    Point first2 = GetOtherPoint(triangles[adjacentTriangle.id], tri2p.id, prevEdge.a);
                    Point second2 = GetOtherPoint(triangles[adjacentTriangle.id], prevEdge.b, tri2p.id);
                    makeTriangle(triangles, first2, tri2p, p);
                    makeTriangle(triangles, p, tri2p, second2);

                    // delete old ones
                    DeleteTriangle(current.id, triangles);
                    DeleteTriangle(adjacentTriangle.id, triangles);

                    return;
                }
                
                return WalkToPoint(adjacentTriangle, newEdge, p, triangles, visited);
            }
            else
            {
                // no triangle at the other end of this edge, so if we want we can split this edge, let's check if we're on top
                if (std::fabs(d[0].first) < EPS_TINY)
                {
                    // yes we are on top, let's split this edge
                    Point tri1p = GetOtherPoint(triangles[current.id], edge.first, edge.second);
                    Point first = GetOtherPoint(triangles[current.id], tri1p.id, edge.second);
                    Point second = GetOtherPoint(triangles[current.id], edge.first, tri1p.id);
                    makeTriangle(triangles, p, first, tri1p);
                    makeTriangle(triangles, second, p, tri1p);

                    DeleteTriangle(current.id, triangles);
                    return;
                }
            }
        }

        // looks like we have nowhere to walk, p is on an edge of current but which one?
        // since we've sorted 'd', it should be d[0], but let's do a sanity check
        auto edge = edges[d[0].second];
        int32_t adjacentTriangleID = FindTriangleWithEdge(edge.first, edge.second, triangles);
        if (std::fabs(d[0].first) < EPS_TINY && adjacentTriangleID == -1)
        {
            Point tri1p = GetOtherPoint(triangles[current.id], edge.first, edge.second);
            Point first = GetOtherPoint(triangles[current.id], tri1p.id, edge.second);
            Point second = GetOtherPoint(triangles[current.id], edge.first, tri1p.id);
            makeTriangle(triangles, p, first, tri1p);
            makeTriangle(triangles, second, p, tri1p);
            
            DeleteTriangle(current.id, triangles);
        }
        else
        {
            // insanity
            printf("BAD WALK!");
        }
    }

    bool addPointToTriangle(Triangle t, Point& p, Point& prev, std::vector<Triangle>& triangles)
    {
        bool isInTriangle = PointInTriangle(t, p);
        if (!isInTriangle)
        {
            return false;
        }
        if (DUMP_SVG_TRIANGLES) DumpTriangleID(t.id, p, prev, triangles);

        bool isOnEdge = false;
        Edge edge;

        Point pA;
        Point pB;
        if (onEdge(p, t.a, t.b))
        {
            isOnEdge = true;
            pA = t.a;
            pB = t.b;
        }
        else if (onEdge(p, t.b, t.c))
        {
            isOnEdge = true;
            pA = t.b;
            pB = t.c;
        }
        else if (onEdge(p, t.c, t.a))
        {
            isOnEdge = true;
            pA = t.c;
            pB = t.a;
        }

        if (isOnEdge)
        {
            edge.a = pA.id;
            edge.b = pB.id;

            // yep, its on an edge
            int32_t tri1 = FindTriangleWithEdge(pA.id, pB.id, triangles);
            int32_t tri2 = FindTriangleWithEdge(pB.id, pA.id, triangles);

            if (tri1 != -1)
            {
                DeleteTriangle(tri1, triangles);

                Point tri1p = GetOtherPoint(triangles[tri1], pA.id, pB.id);
                makeTriangle(triangles, pA, p, tri1p);
                makeTriangle(triangles, p, pB, tri1p);

            }

            if (tri1 != -1 && tri2 == -1)
            {
                if (DUMP_SVG_TRIANGLES) DumpPrevTriangles(2, p, prev, triangles);
            }


            if (tri2 != -1)
            {
                DeleteTriangle(tri2, triangles);

                Point tri2p = GetOtherPoint(triangles[tri2], pA.id, pB.id);
                makeTriangle(triangles, pA, tri2p, p);
                makeTriangle(triangles, p, tri2p, pB);

                if (DUMP_SVG_TRIANGLES) DumpPrevTriangles(2, p, prev, triangles);
            }

            // also check tri1
            if (tri1 != -1 && tri2 != -1)
            {
                if (DUMP_SVG_TRIANGLES) DumpPrevTriangles(4, p, prev, triangles);
            }
         
            return true;
        }
        else // not on an edge, but is inside triangle
        {
            // nope, its in the interior, lets split the triangle in 3 subtriangles.
            makeTriangle(triangles, t.a, t.b, p);
            makeTriangle(triangles, t.a, p, t.c);
            makeTriangle(triangles, p, t.b, t.c);


            DeleteTriangle(t.id, triangles);

            if (DUMP_SVG_TRIANGLES) DumpPrevTriangles(3, p, prev, triangles);

            return true;
        }
    }

    void TriangulateBoundary(Point& p, Point& prev, std::vector<Triangle>& triangles, std::vector<Point>& boundary)
    {
        Point dirToPrev = {
            prev.x - p.x,
            prev.y - p.y
        };

        // figure out what the mountains are
        std::vector<Point> boundaryUp;
        std::vector<Point> boundaryDown;

        for (auto& pt : boundary)
        {
            if (isAboveLine(p, dirToPrev, pt))
            {
                boundaryUp.push_back(pt);
            }
            else
            {
                boundaryDown.push_back(pt);
            }
        }

        // remove consecutive duplicates
        boundaryUp = deduplicateConcecutivePoints(boundaryUp);
        boundaryDown = deduplicateConcecutivePoints(boundaryDown);


        // now we have two boundaries and a line segment, we can create two monotone mountains and triangulate them
        boundaryUp.insert(boundaryUp.begin(), p);
        boundaryUp.push_back(prev);

        boundaryDown.insert(boundaryDown.begin(), p);
        boundaryDown.push_back(prev);
        std::reverse(boundaryDown.begin(), boundaryDown.end());


        size_t start = triangles.size();

        if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, p, prev, L"triangles1.svg");
        triangulateBoundary(boundaryUp, triangles);
        if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, p, prev, L"triangles2.svg");
        triangulateBoundary(boundaryDown, triangles);
        if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, p, prev, L"triangles3.svg");

        size_t size = triangles.size() - start;

        if (DUMP_SVG_TRIANGLES) DumpPrevTriangles(size, p, prev, triangles);
    }

    bool connectPointsFromTriangle(Triangle t, Point& p, Point& prev, std::vector<Triangle>& triangles)
    {
        if (prev.id == t.a.id || prev.id == t.b.id || prev.id == t.c.id)
        {
            // we already have an edge from p to prev, because it's part of triangle t
            return true;
        }
        else
        {
            bool isInTriangle = PointInTriangle(t, prev);
            if (isInTriangle)
            {
                // prev is geometrically inside this triangle, which should not be the case
                // it should either be part of the triangle or outside it
                // inside implies we did a bad job adding points!
                printf("already in tri!\n");
            }


            // no edge to previous
            Point dirToPrev = {
                prev.x - p.x,
                prev.y - p.y
            };

            // because P is on the triangle, there's only one possible intersection line, the line not containing p
            Point p1;
            Point p2;

            if (t.a.id == p.id)
            {
                p1 = t.b;
                p2 = t.c;
            }
            else if (t.b.id == p.id)
            {
                p1 = t.c;
                p2 = t.a;
            }
            else if (t.c.id == p.id)
            {
                p1 = t.a;
                p2 = t.b;
            }


            // TODO: check if p1 or p2 lies exactly on p -> prev, if so recursive call on that point
            // this is unlikely to happen, really only when a void has an internal touch OR when we start processing multiple voids in one pass.
            // checking for this situation would also have to happen below

            // p1 or p2 don't lie on p -> prev, so either internal segment p1 -> p2 intersects, or we don't have any intersection
            bool linesIntersect = doLineSegmentsIntersect(p1(), p2(), p(), prev(), false);

            if (!linesIntersect)
            {
                if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, p, prev, L"triangles.svg");
                Triangle tempCopy = t;
                tempCopy.id = 0;
                if (DUMP_SVG_TRIANGLES) DumpSVGTriangles({ tempCopy }, p, prev, L"triangle.svg");
                // no intersection at p1, p2, or p1 -> p2, so this triangle is facing the wrong way
                return false;
            }

            // we search in direction of p1 -> p2, so find other triangle on that edge
            int32_t curTriangle = FindTriangleWithEdge(p2.id, p1.id, triangles);

            if (curTriangle == -1)
            {
                if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, p, prev, L"triangles.svg");
                Triangle tempCopy = t;
                tempCopy.id = 0;
                if (DUMP_SVG_TRIANGLES) DumpSVGTriangles({ tempCopy }, p, prev, L"triangle.svg");
                printf("Something went wrong 2!");
                return false;
            }

            uint32_t drawnTriangle = curTriangle;

            if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, p, prev, L"trianglesx.svg");
            DeleteTriangle(t.id, triangles);
            DeleteTriangle(curTriangle, triangles);
            if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, p, prev, L"triangles0.svg");

            std::vector<Point> boundary;
            boundary.push_back(p1);
            boundary.push_back(p2);

            Edge prevEdge;
            prevEdge.a = p2.id;
            prevEdge.b = p1.id;

            while (true)
            {
                if (curTriangle == -1)
                {
                    if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, p, prev, L"triangles.svg");
                    printf("Failed to find cur triangle!");
                    return true;
                }

                // proces this triangle
                DeleteTriangle(curTriangle, triangles);

                Triangle& cur = triangles[curTriangle];

                if (cur.a.id == prev.id || cur.b.id == prev.id || cur.c.id == prev.id)
                {
                    // reached prev
                    break;
                }
                else
                {
                    // select new triangle
                    bool i1 = !EdgeEqual(prevEdge, cur.a, cur.b)
                        && doLineSegmentsIntersect(cur.a(), cur.b(), p(), prev(), true);
                    bool i2 = !EdgeEqual(prevEdge, cur.b, cur.c)
                        && doLineSegmentsIntersect(cur.b(), cur.c(), p(), prev(), true);
                    bool i3 = !EdgeEqual(prevEdge, cur.c, cur.a)
                        && doLineSegmentsIntersect(cur.c(), cur.a(), p(), prev(), true);
                    int32_t nextTriangle = -1;
                    if (i1)
                    {
                        nextTriangle = FindTriangleWithEdge(cur.b.id, cur.a.id, triangles);
                        prevEdge.a = cur.b.id;
                        prevEdge.b = cur.a.id;
                        boundary.push_back(cur.a);
                        boundary.push_back(cur.b);
                    }
                    else if (i2)
                    {
                        nextTriangle = FindTriangleWithEdge(cur.c.id, cur.b.id, triangles);
                        prevEdge.a = cur.c.id;
                        prevEdge.b = cur.b.id;
                        boundary.push_back(cur.b);
                        boundary.push_back(cur.c);
                    }
                    else if (i3)
                    {
                        nextTriangle = FindTriangleWithEdge(cur.a.id, cur.c.id, triangles);
                        prevEdge.a = cur.a.id;
                        prevEdge.b = cur.c.id;
                        boundary.push_back(cur.c);
                        boundary.push_back(cur.a);
                    }

                    if (nextTriangle == -1)
                    {
                        Triangle tempCopyT = t;
                        tempCopyT.id = 0;
                        Triangle tempCopyCur = triangles[curTriangle];
                        tempCopyCur.id = 0;
                        DumpSVGTriangles({ tempCopyT, tempCopyCur }, p, prev, L"triangle.svg");

                        DumpSVGTriangles(triangles, p, prev, L"triangles.svg");
                        printf("Failed to find cur triangle!");
                        return true;
                    }

                    curTriangle = nextTriangle;
                }
            }

            TriangulateBoundary(p, prev, triangles, boundary);
            return true;
        } 
    }

    void addPoint(Point& p, Point& prev, std::vector<Triangle>& triangles)
    {
        // prevent infinite loops
        size_t numTriangles = triangles.size();
        for (size_t i = 0; i < numTriangles; i++)
        {
            if (triangles[i].id != -1)
            {
                if (addPointToTriangle(triangles[i], p, prev, triangles))
                {
                    return;
                }
            }
        }
        printf("no bueno");
    }

    void addPointWalk(Point& p, std::vector<Triangle>& triangles)
    {
        size_t numTriangles = triangles.size();
        std::vector<bool> visited(numTriangles);
        for (size_t i = 0; i < numTriangles; i++)
        {
            if (triangles[i].id != -1)
            {
                Edge e;
                WalkToPoint(triangles[i], e, p, triangles, visited);
                break;
            }
        }
    }

    void connectPoints(Point& p, Point& prev, std::vector<Triangle>& triangles)
    {
        // check if points are already connected
        size_t numTriangles = triangles.size();
        for (size_t i = 0; i < numTriangles; i++)
        {
            Triangle& t = triangles[i];
            if (t.id != -1)
            {
                // t contains p
                if (t.a.id == p.id || t.b.id == p.id || t.c.id == p.id)
                {
                    // t contains prev
                    if (t.a.id == prev.id || t.b.id == prev.id || t.c.id == prev.id)
                    {
                        // t contains p and prev, no need to search further: p->prev is already connected
                        return;
                    }
                }
            }
        }


        // prevent infinite loops
        numTriangles = triangles.size();
        for (size_t i = 0; i < numTriangles; i++)
        {
            Triangle& t = triangles[i];
            if (t.id != -1)
            {
                if (t.a.id == p.id || t.b.id == p.id || t.c.id == p.id)
                {
                    if (connectPointsFromTriangle(t, p, prev, triangles))
                    {
                        return;
                    }
                }
            }
        }
        printf("no bueno");
    }

    const int32_t steps = 100000;

    glm::dvec2 toGrid(const glm::dvec2& min, const glm::dvec2& dim, const glm::dvec2& pt)
    {
        double multiplierX = 1 / dim.x * steps;
        double multiplierY = 1 / dim.y * steps;

        return {
            (pt.x - min.x) * multiplierX,
            (pt.y - min.y) * multiplierY
        };
    }

    Point getPoint(const glm::dvec2& min, const glm::dvec2& dim, const glm::dvec2& pt, std::vector<Point>& points, bool& added)
    {
        added = false;
        for (int i = 0; i < points.size(); i++)
        {
            // TODO: looks like EPS_SMALL may not be enough here
            //if (equals2d(toGrid(min, dim, pt), toGrid(min, dim, points[i]()), EPS_SMALL))
            if (equals2d(pt, points[i](), EPS_SMALL))
            {
                return points[i];
            }
        }
        added = true;
        Point newPt = makePoint(pt.x, pt.y);
        points.push_back(newPt);
        return newPt;
    }

    bool IsValidTriangulation(const std::vector<Triangle>& triangles)
    {
        std::map<std::pair<int, int>, int> counts;
        std::map<std::pair<int, int>, int> counts2;
        std::map<int, int> pointOccurrences;

        for (const Triangle& t : triangles)
        {
            if (t.id != -1)
            {
                counts[std::make_pair(t.a.id, t.b.id)]++;
                counts[std::make_pair(t.b.id, t.c.id)]++;
                counts[std::make_pair(t.c.id, t.a.id)]++;

                counts2[std::make_pair(t.a.id, t.b.id)]++;
                counts2[std::make_pair(t.b.id, t.c.id)]++;
                counts2[std::make_pair(t.c.id, t.a.id)]++;

                counts2[std::make_pair(t.b.id, t.a.id)]++;
                counts2[std::make_pair(t.c.id, t.b.id)]++;
                counts2[std::make_pair(t.a.id, t.c.id)]++;

                pointOccurrences[t.a.id]++;
                pointOccurrences[t.b.id]++;
                pointOccurrences[t.c.id]++;
            }
        }

        bool valid = true;

        for (auto [k, e] : counts)
        {
            if (e > 1)
            {
                printf("Invalid triangulation: one way edge with more than one occurrence!\n");
                valid = false;
            }
        }

        for (auto [k, e] : counts2)
        {
            if (e > 2)
            {
                printf("Invalid triangulation: two way edge with more than two occurrences!\n");
                valid = false;
            }
        }

        return valid;
    }

    int instance = 0;

    void ResetTriangles()
    {
        triangleID = 0;
        pointID = 0;
    }

    std::vector<Triangle> triangulate(const glm::dvec2& a, const glm::dvec2& b, const glm::dvec2& c, std::vector<Loop>& loops, bool& swapped)
    {
        instance++;

        ResetTriangles();

        glm::dvec2 min = glm::min(a, glm::min(b, c));
        glm::dvec2 max = glm::max(a, glm::max(b, c));

        glm::dvec2 dim = max - min;

        std::vector<Triangle> triangles;
        std::vector<Point> points;
        bool added;
        Point pa = getPoint(min, dim, a, points, added);
        Point pb = getPoint(min, dim, b, points, added);
        Point pc = getPoint(min, dim, c, points, added);

        makeTriangle(triangles, pa, pb, pc);

        swapped = false;
        if (triangles[0].a.id != pa.id || triangles[0].b.id != pb.id || triangles[0].c.id != pc.id)
        {
            // some swap happened
            swapped = true;
        }

        std::vector<glm::dvec2> sortedPoints;
        std::vector<std::pair<int, int>> connectPairs;
        for (auto& loop : loops)
        {
            if (loop.hasOne)
            {
                sortedPoints.push_back(loop.v1);
            }
            else
            {
                sortedPoints.push_back(loop.v1);
                sortedPoints.push_back(loop.v2);
            }
        }

        std::sort(sortedPoints.begin(), sortedPoints.end(), [&](glm::dvec2 v1, glm::dvec2 v2) {
            double dist1 = std::min(glm::distance(v1, a), std::min(glm::distance(v1, b), glm::distance(v1, c)));
            double dist2 = std::min(glm::distance(v2, a), std::min(glm::distance(v2, b), glm::distance(v2, c)));
            return dist1 < dist2;
        });

        // add all the points to triangle a,b,c
        for (auto& p : sortedPoints)
        {
            Point prev;
            Point pt = getPoint(min, dim, p, points, added);
            if (added)
            {
                bool ptInside = PointInTriangle(triangles[0], pt);
                if (ptInside)
                {
                    addPoint(pt, prev, triangles);
                    if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, pt, prev, L"triangles2.svg");
                }
            }
        }

        // connect any loops that need connecting
        for (auto& loop : loops)
        {
            if (!loop.hasOne)
            {
                Point pt1 = getPoint(min, dim, loop.v1, points, added);
                Point pt2 = getPoint(min, dim, loop.v2, points, added);


                bool pt1Inside = PointInTriangle(triangles[0], pt1);
                bool pt2Inside = PointInTriangle(triangles[0], pt2);

                if (pt1Inside && pt2Inside)
                {
                    connectPoints(pt1, pt2, triangles);
                }

            }
        }

        std::vector<Triangle> filterTriangles;

        for (auto& t : triangles)
        {
            if (t.id != -1)
            {
                filterTriangles.push_back(t);
            }
        }

        return filterTriangles;
    }

    std::vector<Triangle> triangulate(const glm::dvec2& a, const glm::dvec2& b, const glm::dvec2& c, std::vector<glm::dvec2>& points)
    {
        std::vector<Loop> loops;

        for (auto& p : points)
        {
            Loop l;
            l.hasOne = true;
            l.v1 = p;
            loops.push_back(l);
        }

        bool swapped;

        return triangulate(a, b, c, loops, swapped);
    }
}