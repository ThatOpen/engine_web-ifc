/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
 #pragma once

#include <map>
#include <set>
#include <glm/glm.hpp>
#include <mapbox/earcut.hpp>

#include "../util.h"
#include "line-segment-intersect.h"

namespace webifc
{
    struct TriangulateWithBoundaries
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

        // TODO: slow
        std::vector<int32_t> FindTrianglesWithEdge(int32_t a, int32_t b, std::vector<Triangle>& triangles)
        {
            std::vector<int32_t> result;
            std::vector<int32_t> deleted;
            glm::dvec2 apt;
            glm::dvec2 bpt;

            for (size_t i = 0; i < triangles.size(); i++)
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
            for (size_t i = 0; i < triangles.size(); i++)
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

        void triangulateBoundary(std::vector<Point>& boundary, std::vector<Triangle>& triangles)
        {
            if (boundary.size() < 3)
            {
                printf("bad monotone chain");
                return;
            }

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
                for (size_t i = 1; i < boundary.size() - 1;)
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
            for (size_t i = 1; i < pts.size(); i++)
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
            //auto t = triangles[id];
     
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

        bool WalkToPointPath(Triangle current, Edge prevEdge, Point& p, Point& prev, std::vector<Triangle>& triangles, std::vector<bool>& visited, std::vector<Edge>& path, std::vector<int>& trianglePath)
        {
            if (visited[current.id])
            {
                // we are walking around hitting the same triangles, bad news
                printf("Bad walk!");
                return true;
            }

            // mark current as visited
            visited[current.id] = true;
            trianglePath.push_back(current.id);

            if (current.a.id == p.id || current.b.id == p.id || current.c.id == p.id)
            {
                // triangle contains P, stop looking
                return true;
            }

            bool aUp = sign(current.a, p, prev) > 0;
            bool bUp = sign(current.b, p, prev) > 0;
            bool cUp = sign(current.c, p, prev) > 0;

            // all same sign means this triangle is unfit for further walking
            if (aUp == bUp && bUp == cUp)
            {
                return false;
            }

            // not all the same, figure out where the two boundary edges are
            std::vector<Edge> boundaries;
            if (aUp != bUp)
            {
                if (sign(p, current.a, current.b) > 0)
                {
                    boundaries.push_back({ current.a.id, current.b.id });
                }
            }
            if (bUp != cUp)
            {
                if (sign(p, current.b, current.c) > 0)
                {
                    boundaries.push_back({ current.b.id, current.c.id });
                }
            }
            if (cUp != aUp)
            {
                if (sign(p, current.c, current.a) > 0)
                {
                    boundaries.push_back({ current.c.id, current.a.id });
                }
            }

            if (boundaries.size() != 1)
            {
                printf("wrong number boundaries");
                return true;
            }

            Edge edge;
            for (auto& newEdge : boundaries)
            {
                if (prevEdge.a == newEdge.b && prevEdge.b == newEdge.a)
                {
                    // this is the edge we came from
                    printf("getting bad edge");
                }
                else
                {
                    // this could be the new edge!
                    edge = newEdge;
                }
            }

            int32_t adjacentTriangleID = FindTriangleWithEdge(edge.b, edge.a, triangles);
            if (adjacentTriangleID != -1)
            {
                path.push_back(edge);
                return WalkToPointPath(triangles[adjacentTriangleID], edge, p, prev, triangles, visited, path, trianglePath);
            }
            else
            {
                printf("couldnt find adjacent triangle, but still searching");
                return true;
            }

        }

        void WalkToPoint(Triangle current, Edge prevEdge, Point& p, std::vector<Triangle>& triangles, std::vector<bool>& visited, std::vector<Edge>& path, std::vector<int>& trianglePath)
        {
            if (visited[current.id])
            {
                // we are walking around hitting the same triangles, bad news
                printf("Bad walk!");
                return;
            }

            // mark current as visited
            visited[current.id] = true;
            trianglePath.push_back(current.id);

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

                    path.push_back(newEdge);
                
                    return WalkToPoint(adjacentTriangle, newEdge, p, triangles, visited, path, trianglePath);
                }
                else
                {
                    // no triangle at the other end of this edge, so if we want we can split this edge, let's check if we're on top
                    if (std::fabs(d[0].first) < EPS_TINY)
                    {
                        p.isBoundary = true;

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
            if (std::fabs(d[0].first) < EPS_BIG && adjacentTriangleID == -1)
            {
                p.isBoundary = true;

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

        void addPointWalk(Point& p, std::vector<Triangle>& triangles)
        {
            size_t numTriangles = triangles.size();
            std::vector<bool> visited(numTriangles);
            for (size_t i = 0; i < numTriangles; i++)
            {
                if (triangles[i].id != -1)
                {
                    Edge e;
                    std::vector<Edge> path;
                    std::vector<int> trianglePath;
                    WalkToPoint(triangles[i], e, p, triangles, visited, path, trianglePath);
                    break;
                }
            }
        }

        bool ListHasPoint(std::vector<Triangle>& triangles, int id)
        {
            for (size_t i = 0; i < triangles.size(); i++)
            {
                if (triangles[i].id != -1)
                {
                    if (HasPoint(triangles[i], id))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        void connectPointWalk(Point& a, Point& b, std::vector<Triangle>& triangles, std::vector<Point>& points)
        {
            if (!ListHasPoint(triangles, a.id) || !ListHasPoint(triangles, b.id))
            {
                printf("Missing points during connect");
                return;
            }

            size_t numTriangles = triangles.size();
            for (size_t i = 0; i < numTriangles; i++)
            {
                if (HasPoint(triangles[i], a.id) && HasPoint(triangles[i], b.id))
                {
                    // already done!
                    return;
                }
            }

            for (size_t i = 0; i < numTriangles; i++)
            {
                if (triangles[i].id != -1)
                {
                    if (HasPoint(triangles[i], a.id))
                    {
                        if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, b, a, L"before_connect.svg", points);

                        // triangle contains A, lets walk from this triangle to B
                        Edge e;
                        std::vector<Edge> path;
                        std::vector<int> trianglePath;
                        std::vector<bool> visited(numTriangles);
                        if (!WalkToPointPath(triangles[i], e, b, a, triangles, visited, path, trianglePath))
                        {
                            // a is in this tri, but we can't start walking from here
                            continue;
                        }

                        // get the boundary point list of the walk
                        std::vector<Point> boundary;
                        boundary.push_back(a);
                        for (Edge& e : path)
                        {
                            if (e.a != a.id && e.b != a.id)
                            {
                                boundary.push_back(points[e.a]);
                                boundary.push_back(points[e.b]);
                            }
                            else
                            {
                                // if we hit an edge with A, we reset the boundary to it
                                boundary.clear();
                                boundary.push_back(a);
                            }
                        }

                        boundary.push_back(b);

                        if (boundary.size() == 2)
                        {
                            // direct connection between a and b, no need to delete or triangulate anything!
                            return;
                        }

                        // delete triangles encountered during the walk
                        size_t deleteTriOffset = 0;
                        for (size_t i = 0; i < trianglePath.size(); i++)
                        {
                            bool hasA = HasPoint(triangles[trianglePath[i]], a.id);
                            if (hasA)
                            {
                                // we want to start deleting from the last triangle including A
                                deleteTriOffset = i+1;
                            }
                        }

                        if (deleteTriOffset-1 == trianglePath.size())
                        {
                            // nothing to delete, so also nothing to triangulate
                            return;
                        }

                        if (deleteTriOffset == 0)
                        {
                            printf("no A in triangle path!");
                            return;
                        }

                        for (size_t i = deleteTriOffset-1; i < trianglePath.size(); i++)
                        {
                            triangles[trianglePath[i]].id = -1;
                            if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, b, a, L"before_monotone.svg", points);
                        }

                        if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, b, a, L"before_monotone.svg", points);

                        TriangulateBoundary(a, b, triangles, boundary);

                        if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, b, a, L"after_monotone.svg", points);

                        return;
                    }
                }
            }
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

        Point& getPoint(const glm::dvec2& min, const glm::dvec2& dim, const glm::dvec2& pt, std::vector<Point>& points, bool& added)
        {
            added = false;
            for (size_t i = 0; i < points.size(); i++)
            {

                //if (equals2d(toGrid(min, dim, pt), toGrid(min, dim, points[i]()), EPS_SMALL))
                // we set this to EPS_BIG, or we get floating point errors where nearly-identical points cause a loop in the triangle walk
                if (equals2d(pt, points[i](), EPS_BIG))
                {
                    return points[i];
                }
            }
            added = true;
            Point newPt = makePoint(pt.x, pt.y);
            points.push_back(newPt);
            return points.back();
        }

        std::set<int> GetPrimaryEdges(Point p, const std::vector<Point>& points)
        {
            std::set<int> edges;
            if (onEdge(p, points[0], points[1]))
            {
                edges.insert(0);
            }

            if (onEdge(p, points[1], points[2]))
            {
                edges.insert(1);
            }

            if (onEdge(p, points[2], points[0]))
            {
                edges.insert(2);
            }

            return edges;
        }

        bool IsValidTriangulation(const std::vector<Triangle>& triangles, const std::vector<Point>& points)
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
                else if (e == 1)
                {
                    bool pt1Boundary = points[k.first].isBoundary;
                    bool pt2Boundary = points[k.second].isBoundary;

                    if (pt1Boundary && pt2Boundary)
                    {
                        // check if its the same boundary
                        if (k.first <= 2 && k.second <= 2)
                        {
                            // one of the initial 3 edges, ignore
                        }
                        else
                        {
                            auto e1 = GetPrimaryEdges(points[k.first], points);
                            auto e2 = GetPrimaryEdges(points[k.second], points);

                            std::set<int> overlap;

                            std::set_intersection(e1.begin(), e1.end(),
                                                  e2.begin(), e2.end(),
                                                  std::inserter(overlap, overlap.begin()));

                            if (overlap.empty())
                            {
                                printf("Single edge with mismatching primary edges!");
                            }
                            if (e1.empty() || e2.empty())
                            {
                                printf("Single edge outside primary edges!");
                            }
                        }
                    }
                    else
                    {
                        printf("Single edge without boundary point!");
                    }
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

            points[pa.id].isBoundary = true;
            points[pb.id].isBoundary = true;
            points[pc.id].isBoundary = true;

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
                Point& pt = getPoint(min, dim, p, points, added);
                if (added)
                {
                    //bool ptInside = PointInTriangle(triangles[0], pt);
                    //if (ptInside)
                    {
                        //addPoint(pt, prev, triangles);
                        if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, pt, prev, L"before_walk.svg");
                        addPointWalk(pt, triangles);
                        if (DUMP_SVG_TRIANGLES) DumpSVGTriangles(triangles, pt, prev, L"after_walk.svg");
                        if (DUMP_SVG_TRIANGLES) IsValidTriangulation(triangles, points);
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


                    //bool pt1Inside = PointInTriangle(triangles[0], pt1);
                    //bool pt2Inside = PointInTriangle(triangles[0], pt2);

                    //if (pt1Inside && pt2Inside)
                    {
                        connectPointWalk(pt1, pt2, triangles, points);
                        if (DUMP_SVG_TRIANGLES) IsValidTriangulation(triangles, points);
                        // connectPoints(pt1, pt2, triangles);


                        if (DUMP_SVG_TRIANGLES)
                        {
                            if (!ListHasPoint(triangles, 0) || !ListHasPoint(triangles, 1) || !ListHasPoint(triangles, 2))
                            {
                                printf("missing points!");
                            }
                        }
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
    };
}