#pragma once

#include <map>
#include <glm/glm.hpp>

#include "util.h"
#include "line-segment-intersect.h"

namespace webifc
{
    uint32_t pointID = 0;
    uint32_t triangleID = 0;

    struct Point
    {
        double x;
        double y;
        int32_t id = -1;

        glm::dvec2 operator()()
        {
            return glm::dvec2(
                x, y
            );
        }
    };

    struct Triangle
    {
        Point a;
        Point b;
        Point c;

        int32_t id = -1;
    };

    struct Edge
    {
        int32_t a = -1;
        int32_t b = -1;
    };

    double sign(const Point& p1, const Point& p2, const Point& p3)
    {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }

    bool onEdge(const Point& p, const Point& a, const Point& b)
    {
        return std::fabs(sign(p, a, b) < EPS_SMALL);
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
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) < 0;
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
    Triangle& makeTriangle(std::vector<Triangle>& triangles, const Point& a, const Point& b, const Point& c)
    {
        Triangle t;
        t.a = a;
        t.b = b;
        t.c = c;
        t.id = triangleID++;

        triangles.resize(t.id + 1);
        triangles[t.id] = t;

        return triangles[t.id];
    }

    bool PointInTriangle(const Triangle& t, const Point& p)
    {
        double d1, d2, d3;
        bool has_neg, has_pos;

        d1 = sign(p, t.a, t.b);
        d2 = sign(p, t.b, t.c);
        d3 = sign(p, t.c, t.a);

        has_neg = (d1 < -EPS_SMALL) || (d2 < -EPS_SMALL) || (d3 < -EPS_SMALL);
        has_pos = (d1 > EPS_SMALL) || (d2 > EPS_SMALL) || (d3 > EPS_SMALL);

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
        for (int i = 0; i < triangles.size(); i++)
        {
            Triangle&  t = triangles[i];

            if (t.id == -1) continue;

            if (t.a.id == a && t.b.id == b)
            {
                result.push_back(i);
            }
            else if (t.b.id == a && t.c.id == b)
            {
                result.push_back(i);
            }
            else if (t.c.id == a && t.a.id == b)
            {
                result.push_back(i);
            }
            else if (t.a.id == b && t.b.id == a)
            {
                result.push_back(i);
            }
            else if (t.b.id == b && t.c.id == a)
            {
                result.push_back(i);
            }
            else if (t.c.id == b && t.a.id == a)
            {
                result.push_back(i);
            }
        }

        return result;
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
                    printf("not convex");
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

    std::vector<Point> deduplicatePoints(std::vector<Point>& pts)
    {
        std::map<int32_t, bool> indicesmap = {};
        std::vector<Point> result;

        for (int i = 0; i < pts.size(); i++)
        {
            Point& p = pts[i];
            if (!indicesmap[p.id])
            {
                indicesmap[p.id] = true;
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


    bool addPointToTriangle(Triangle& t, Point& p, Point& prev, bool split, std::vector<Triangle>& triangles)
    {
        if (t.id != -1)
        {
            return false;
        }
        if (!PointInTriangle(t, p))
        {
            return false;
        }
        else
        {
            bool didSplit = false;
            int32_t e1;
            int32_t e2;
            if (split)
            {
                if (p.id == t.a.id || p.id == t.b.id || p.id == t.c.id)
                {
                    // this point is already in the triangle
                    // we can skip to the connecton phase (if that phase is needed)
                }
                else
                {
                    didSplit = true;
                    // inside the triangle but unequal to any existing point, lets check the edges
                    bool isOnEdge = false;
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
                        e1 = pA.id;
                        e2 = pB.id;

                        // yep, its on an edge
                        int32_t tri1 = FindTriangleWithEdge(pA.id, pB.id, triangles);
                        int32_t tri2 = FindTriangleWithEdge(pB.id, pA.id, triangles);

                        if (tri1 != -1)
                        {
                            triangles[tri1].id = -1;

                            Point tri1p = GetOtherPoint(triangles[tri1], pA.id, pB.id);
                            makeTriangle(triangles, pA, p, tri1p);
                            makeTriangle(triangles, p, pB, tri1p);

                        }
                        if (tri2 != -1)
                        {
                            triangles[tri2].id = -1;

                            Point tri1p = GetOtherPoint(triangles[tri2], pA.id, pB.id);
                            makeTriangle(triangles, pA, tri1p, p);
                            makeTriangle(triangles, p, tri1p, pB);
                        }
                    }
                    else
                    {
                        // nope, its in the interior, lets split the triangle in 3 subtriangles.
                        makeTriangle(triangles, t.a, t.b, p);
                        makeTriangle(triangles, t.a, p, t.c);
                        makeTriangle(triangles, p, t.b, t.c);

                        t.id = -1;
                    }
                }
            }
            else
            {
                //debugger;
            }

            if (prev.id != -1)
            {
                if (prev.id == t.a.id || prev.id == t.b.id || prev.id == t.c.id)
                {
                    // we already have an edge to previous, because its part of the subdivided triangle t
                }
                else
                {
                    // no edge to previous
                    Point dirToPrev = {
                        prev.x - p.x,
                        prev.y - p.y
                    };

                    // below p.id != t.a.id && p.id != t.b.id is needed for the connection phase, where the containing triangle is not split
                    // below e1 != t.a.id && e2 != t.b.id is needed for the connection phase, where the matching edge was split and t.a -> t.b no longer exists
                    // TODO: simplify this based on previous split phase
                    // TODO: skip conversion to glm
                    bool i1 = (e1 != t.a.id && e2 != t.b.id) && (p.id != t.a.id && p.id != t.b.id) && doLineSegmentsIntersect(t.a(), t.b(), p(), prev());
                    bool i2 = (e1 != t.b.id && e2 != t.c.id) && (p.id != t.b.id && p.id != t.c.id) && doLineSegmentsIntersect(t.b(), t.c(), p(), prev());
                    bool i3 = (e1 != t.c.id && e2 != t.a.id) && (p.id != t.c.id && p.id != t.a.id) && doLineSegmentsIntersect(t.c(), t.a(), p(), prev());

                    int32_t startTriangle = -1;
                    int32_t curTriangle = -1;
                    std::vector<Point> boundary;
                    std::vector<int32_t> tris;
                    Edge prevEdge;
                    if (i1)
                    {
                        tris = FindTrianglesWithEdge(t.a.id, t.b.id, triangles);
                        startTriangle = tris[0];
                        curTriangle = tris[1];
                        if (!HasPoint(triangles[tris[0]], p.id))
                        {
                            std::swap(startTriangle, curTriangle);
                        }
                        prevEdge.a = t.b.id;
                        prevEdge.b = t.a.id;
                        boundary.push_back(t.a);
                        boundary.push_back(t.b);
                    }
                    else if (i2)
                    {
                        tris = FindTrianglesWithEdge(t.b.id, t.c.id, triangles);
                        startTriangle = tris[0];
                        curTriangle = tris[1];
                        if (!HasPoint(triangles[tris[0]], p.id))
                        {
                            std::swap(startTriangle, curTriangle);
                        }
                        prevEdge.a = t.c.id;
                        prevEdge.b = t.b.id;
                        boundary.push_back(t.b);
                        boundary.push_back(t.c);
                    }
                    else if (i3)
                    {

                        tris = FindTrianglesWithEdge(t.c.id, t.a.id, triangles);
                        startTriangle = tris[0];
                        curTriangle = tris[1];
                        if (!HasPoint(triangles[tris[0]], p.id))
                        {
                            std::swap(startTriangle, curTriangle);
                        }
                        prevEdge.a = t.a.id;
                        prevEdge.b = t.c.id;
                        boundary.push_back(t.c);
                        boundary.push_back(t.a);
                    }
                    else
                    {
                        if (split && didSplit)
                        {
                            printf("Something went wrong!");
                            return false;
                        }
                        else
                        {
                            return false;
                        }
                    }

                    if (!startTriangle || !curTriangle)
                    {
                        printf("Something went wrong!");
                        return false;
                    }

                    uint32_t drawnTriangle = curTriangle;

                    triangles[startTriangle].id = -1;

                    while (true)
                    {
                        if (curTriangle == -1)
                        {
                            printf("Failed to find cur triangle!");
                            return true;
                        }

                        // proces this triangle
                        triangles[curTriangle].id = -1;

                        Triangle& cur = triangles[curTriangle];

                        if (cur.a.id == prev.id || cur.b.id == prev.id || cur.c.id == prev.id)
                        {
                            // reached prev
                            break;
                        }
                        else
                        {
                            // select new triangle
                            bool i1 = prevEdge.a != cur.a.id && prevEdge.b != cur.b.id
                                && doLineSegmentsIntersect(cur.a(), cur.b(), p(), prev());
                            bool i2 = prevEdge.a != cur.b.id && prevEdge.b != cur.c.id
                                && doLineSegmentsIntersect(cur.b(), cur.c(), p(), prev());
                            bool i3 = prevEdge.a != cur.c.id && prevEdge.b != cur.a.id
                                && doLineSegmentsIntersect(cur.c(), cur.a(), p(), prev());
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
                            curTriangle = nextTriangle;
                        }
                    }

                    // remove duplicates
                    std::vector<Point> boundaryDedupe = deduplicatePoints(boundary);
                    
                    // figure out what the mountains are
                    std::vector<Point> boundaryUp;
                    std::vector<Point> boundaryDown;

                    for (auto& pt : boundaryDedupe)
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


                    // now we have two boundaries and a line segment, we can create two monotone mountains and triangulate them
                    boundaryUp.insert(boundaryUp.begin(), p);
                    boundaryUp.push_back(prev);

                    boundaryDown.insert(boundaryDown.begin(), p);
                    boundaryDown.push_back(prev);
                    std::reverse(boundaryDown.begin(), boundaryDown.end());

                    triangulateBoundary(boundaryUp, triangles);
                    triangulateBoundary(boundaryDown, triangles);

                } 
                
            } 
        }
        return true;
    }

    void addPoint(Point& p, Point& prev, std::vector<Triangle>& triangles)
    {
        for (int i = 0; i < triangles.size(); i++)
        {
            if (addPointToTriangle(triangles[i], p, prev, true, triangles))
            {
                return;
            }
        }
    }

    void closeLoop(Point& p, Point& prev, std::vector<Triangle>& triangles)
    {
        for (int i = 0; i < triangles.size(); i++)
        {
            if (addPointToTriangle(triangles[i], p, prev, false, triangles))
            {
                return;
            }
        }
    }

    Point& getPoint(const glm::dvec2& pt, std::vector<Point>& points)
    {
        for (int i = 0; i < points.size(); i++)
        {
            if (equals2d(pt, points[i](), EPS_SMALL))
            {
                return points[i];
            }
        }
        Point newPt = makePoint(pt.x, pt.y);
        points.push_back(newPt);
        return newPt;
    }

    std::vector<Triangle> triangulate(const glm::dvec2& a, const glm::dvec2& b, const glm::dvec2& c, std::vector<Loop>& loops)
    {
        triangleID = 0;
        pointID = 0;

        std::vector<Triangle> triangles;
        std::vector<Point> points;
        makeTriangle(triangles, getPoint(a, points), getPoint(b, points), getPoint(c, points));

        for (auto& loop : loops)
        {
            Point prev;
            if (loop.hasOne)
            {
                Point& pt = getPoint(loop.v1, points);
                addPoint(pt, prev, triangles);
                prev = pt;
            }
            else
            {
                Point& pt1 = getPoint(loop.v1, points);

                addPoint(pt1, prev, triangles);

                Point& pt2 = getPoint(loop.v2, points);

                addPoint(pt2, pt1, triangles);
            }
        }

        // drawTriangles(triangles);

        return triangles;
    }
}