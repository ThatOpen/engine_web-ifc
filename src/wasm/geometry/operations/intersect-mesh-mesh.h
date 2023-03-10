/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
 #pragma once

#include <map>
#include <algorithm>
#include <stack>

#include <glm/glm.hpp>
#include "mesh_utils.h"
#include "intersect-ray-tri.h"
#include "triangulate-with-boundaries.h"
#include "geometryutils.h"
#include <CDT.h>

namespace webifc::geometry
{

    static glm::dvec2 projectOnTriangle(const glm::dvec3& pt, const glm::dvec3& a, const glm::dvec3& b, const glm::dvec3& c)
    {
        glm::dvec3 v1 = glm::normalize(b - a);
        glm::dvec3 v2 = glm::normalize(c - a);

        glm::dvec3 norm = glm::normalize(glm::cross(v1, v2));
        v2 = glm::normalize(glm::cross(norm, v1));

        double scale = std::max(glm::length(b - a), glm::length(c - a));

        glm::dvec3 rel = pt - a;
        double d1 = glm::dot(v1, rel);
        double d2 = glm::dot(v2, rel);

        d1 = d1 / scale;
        d2 = d2 / scale;

        return {
            d1,
            d2
        };
    }

    static glm::dvec3 unProjectFromTriangle(glm::dvec2& pt, const glm::dvec3& a, const glm::dvec3& b, const glm::dvec3& c)
    {
        glm::dvec3 v1 = glm::normalize(b - a);
        glm::dvec3 v2 = glm::normalize(c - a);

        glm::dvec3 norm = glm::normalize(glm::cross(v1, v2));
        v2 = glm::normalize(glm::cross(norm, v1));

        double scale = std::max(glm::length(b - a), glm::length(c - a));

        double d1 = pt.x * scale;
        double d2 = pt.y * scale;

        glm::dvec3 p = v1 * d1 + v2 * d2;

        return p + a;
    }

    struct MeshIntersection
    {
        TriTriResult result;
        uint32_t otherTriangleIndex;
    };

    typedef std::map<uint32_t, std::vector<MeshIntersection>> MeshIntersections;

    static std::vector<Loop> makeLoops(const glm::dvec3& a, const glm::dvec3& b, const glm::dvec3& c, const std::vector<MeshIntersection>& intersections)
    {
        std::vector<Loop> loops;

        for (auto& i : intersections)
        {
            glm::dvec2 ps = projectOnTriangle(i.result.start, a, b, c);
            glm::dvec2 pe = projectOnTriangle(i.result.end, a, b, c);

            // single point
            if (equals2d(ps, pe, EPS_SMALL))
            {
                loops.push_back({ true, ps, ps });
            }
            else
            {
                // TODO: stupid implementation, too many triangle checks needed
                // TODO: flipped this because of the triangle winding, but is probably not a general solution!
                loops.push_back({ false, pe, ps });
            }
        }

        return loops;
    }

    static std::vector<Loop> makeLoops2(const glm::dvec3& A, const glm::dvec3& B, const glm::dvec3& C, const glm::dvec2& a, const glm::dvec2& b, const glm::dvec2& c, const std::vector<MeshIntersection>& intersections)
    {
        std::vector<Loop> loops;

        for (auto& i : intersections)
        {
            glm::dvec3 psb = ToBary(A, B, C, i.result.start);
            glm::dvec3 peb = ToBary(A, B, C, i.result.end);
            glm::dvec2 ps = FromBary(a, b, c, psb);
            glm::dvec2 pe = FromBary(a, b, c, peb);

            // single point
            if (equals2d(ps, pe, EPS_SMALL))
            {
                loops.push_back({ true, ps, ps });
            }
            else
            {
                // TODO: stupid implementation, too many triangle checks needed
                // TODO: flipped this because of the triangle winding, but is probably not a general solution!
                loops.push_back({ false, pe, ps });
            }
        }

        return loops;
    }

    static IfcGeometry retriangulateMesh(const IfcGeometry& mesh, MeshIntersections& intersections)
    {
        IfcGeometry outputMesh;

        for (uint32_t i = 0; i < mesh.numFaces; i++)
        {
            Face f = mesh.GetFace(i);

            if (i == 4)
            {
                // printf("asdf");
            }

            const glm::dvec3& a = mesh.GetPoint(f.i0);
            const glm::dvec3& b = mesh.GetPoint(f.i1);
            const glm::dvec3& c = mesh.GetPoint(f.i2);

            // warning: ints may have line segments where end === start
            std::vector<MeshIntersection> ints = intersections[i];
            if (!ints.empty())
            {
                glm::dvec2 pa = glm::dvec2(0, 0);//  projectOnTriangle(a, a, b, c);
                glm::dvec2 pb = glm::dvec2(1, 0);//projectOnTriangle(b, a, b, c);
                glm::dvec2 pc = glm::dvec2(0, 1);//projectOnTriangle(c, a, b, c);

                //glm::dvec3 uupa = FromBary(a, b, c, ToBary2(pa));//unProjectFromTriangle(pa, a, b, c);
                //glm::dvec3 uupb = FromBary(a, b, c, ToBary2(pb));//unProjectFromTriangle(pb, a, b, c);
                //glm::dvec3 uupc = FromBary(a, b, c, ToBary2(pc));//unProjectFromTriangle(pc, a, b, c);

                auto loops = makeLoops2(a, b, c, pa, pb, pc, ints);

                if (!(loops.size() == 1 && loops[0].hasOne))
                {
                    std::vector<std::vector<glm::dvec2>> vecs;
                    std::transform(loops.begin(), loops.end(), std::back_inserter(vecs), [](const Loop& l) -> std::vector<glm::dvec2>
                                   {
                                       return { l.v1, l.v2 };
                                   });

                    vecs.push_back({ { pa.x, pa.y } });
                    vecs.push_back({ { pb.x, pb.y } });
                    vecs.push_back({ { pc.x, pc.y } });

                    if (CSG_DEBUG_OUTPUT)
                    {
                        DumpSVGLines(vecs, L"loops.html");
                    }
                }


                std::vector<std::vector<glm::dvec2>> lines;

                for (auto& loop : loops)
                {
                    std::vector<glm::dvec2> vec;

                    if (loop.hasOne)
                    {
                        vec.push_back(loop.v1);
                    }
                    else
                    {
                        vec.push_back(loop.v1);
                        vec.push_back(loop.v2);
                    }

                    lines.push_back(vec);
                }

                lines.push_back({ pa, pb });
                lines.push_back({ pb, pc });
                lines.push_back({ pc, pa });

                if (CSG_DEBUG_OUTPUT)
                {
                    DumpSVGLines(lines, L"lines.html");
                }

                // drawInSVG(loops, pa, pb, pc);

                // eartcut.hpp seems to have issues with colinear points in holes, so for now use custom slow algo
                bool swapped = false;
                TriangulateWithBoundaries twb;
                std::vector<Triangle> tesselation = twb.triangulate(pa, pb, pc, loops, swapped);

                for (auto& triangle : tesselation)
                {
                    if (triangle.id != -1)
                    {
                        glm::dvec2 ta = triangle.a();
                        glm::dvec2 tb = triangle.b();
                        glm::dvec2 tc = triangle.c();

                        glm::dvec3 upa = FromBary(a, b, c, ToBary2(ta));// unProjectFromTriangle(ta, a, b, c);
                        glm::dvec3 upb = FromBary(a, b, c, ToBary2(tb));//unProjectFromTriangle(tb, a, b, c);
                        glm::dvec3 upc = FromBary(a, b, c, ToBary2(tc));//unProjectFromTriangle(tc, a, b, c);

                        if (swapped)
                        {
                            outputMesh.AddFace(upb, upa, upc);
                        }
                        else
                        {
                            outputMesh.AddFace(upa, upb, upc);
                        }
                    }
                }
            }
            else
            {
                outputMesh.AddFace(a, b, c);
            }
        }

        return outputMesh;
    }

    struct BVHNode
    {
        uint32_t start;
        uint32_t end;
        uint32_t left = 0;
        uint32_t right = 0;
        AABB box;

        bool IsLeaf() const
        {
            return left == 0 && right == 0;
        }

        bool Overlaps(const BVHNode& other) const
        {
            return box.intersects(other.box);
        }
    };

    struct BVH
    {
        std::vector<AABB> boxes;
        std::vector<BVHNode> nodes;
        IfcGeometry const* ptr;

        template <typename T>
        void Intersect(const BVH& other, T callback)
        {
            std::stack<std::pair<uint32_t, uint32_t>> bvhStack;
            bvhStack.emplace(0, 0);

            while (!bvhStack.empty())
            {
                const auto [i1, i2] = bvhStack.top();
                bvhStack.pop();

                auto& n1 = nodes[i1];
                auto& n2 = other.nodes[i2];

                if (n1.Overlaps(n2))
                {
                    if (n1.IsLeaf() && n2.IsLeaf())
                    {
                        // both leaves, compare contents
                        for (uint32_t i = n1.start; i < n1.end; i++)
                        {
                            for (uint32_t j = n2.start; j < n2.end; j++)
                            {
                                if (boxes[i].intersects(other.boxes[j]))
                                {
                                    callback(boxes[i].index, other.boxes[j].index);
                                }
                            }
                        }
                    }
                    else if (n1.IsLeaf())
                    {
                        bvhStack.emplace(i1, n2.left);
                        bvhStack.emplace(i1, n2.right);
                    }
                    else if (n2.IsLeaf())
                    {
                        bvhStack.emplace(n1.left, i2);
                        bvhStack.emplace(n1.right, i2);
                    }
                    else
                    {
                        // neither are leaves, split n1
                        bvhStack.emplace(n1.left, i2);
                        bvhStack.emplace(n1.right, i2);
                    }
                }
                else
                {
                    // don't care
                }
            }
        }

        template <typename T>
        bool IntersectRay(const glm::dvec3& origin, const glm::dvec3& dir, T callback)
        {
            std::stack<uint32_t> stack;

            if (nodes.empty())
            {
                return false;
            }

            stack.push(0);
            while (!stack.empty())
            {
                const auto& node = nodes[stack.top()];
                stack.pop();

                if (node.box.Intersect(origin, dir))
                {
                    // hit!
                    if (node.IsLeaf())
                    {
                        // check boxes
                        for (uint32_t i = node.start; i < node.end; i++)
                        {
                            const auto& box = boxes[i];
                            if (box.Intersect(origin, dir))
                            {
                                if (callback(box.index))
                                {
                                    return true;
                                }
                            }
                            else
                            {
                                // don't care
                            }
                        }
                    }
                    else
                    {
                        // visit children
                        stack.push(node.left);
                        stack.push(node.right);
                    }
                }
                else
                {
                    // ignore
                }
            }

            return false;
        }

    };

    static int MakeBVH(std::vector<AABB>& boxes, std::vector<BVHNode>& nodes, int start, int end, int axis, int depth, int& offset)
    {
        int nodeID = offset++;

        nodes.resize(nodeID + 1);
        BVHNode& node = nodes[nodeID];

        node.start = start;
        node.end = end;

        for (int i = start; i < end; i++)
        {
            node.box.merge(boxes[i]);
        }

        nodes.reserve(nodeID + 1);

        if (depth == 6)
        {
            return nodeID;
        }


        int size = end - start;

        // ignore cubes
        if (size <= 12)
        {
            return nodeID;
        }

        int middle = (end + start) / 2;

        std::nth_element(boxes.begin() + start, boxes.begin() + middle, boxes.begin() + end, [&](const AABB& first, const AABB& second)
                         {
                             return first.center[axis] > second.center[axis];
                         });

        nodes[nodeID].left = MakeBVH(boxes, nodes, start, middle, (axis + 1) % 3, depth + 1, offset);
        nodes[nodeID].right = MakeBVH(boxes, nodes, middle, end, (axis + 1) % 3, depth + 1, offset);

        return nodeID;
    }

    static BVH MakeBVH(const IfcGeometry& mesh)
    {
        BVH bvh;
        bvh.ptr = &mesh;
        bvh.boxes = std::vector<AABB>(mesh.numFaces);
        for (uint32_t i = 0; i < mesh.numFaces; i++)
        {
            bvh.boxes[i] = mesh.GetFaceBox(i);
        }

        int offset = 0;
        // start BVH at Y axis
        MakeBVH(bvh.boxes, bvh.nodes, 0, bvh.boxes.size(), 1, 0, offset);

        return bvh;
    }

    struct Plane
    {
        glm::dvec3 norm;
        double d;

        bool Equals(const Plane& other, double eps) const
        {
            return (equals(d, other.d, eps) && equals(norm, other.norm, eps));
        }

        bool IsCoplanarWith(const Plane& other, double eps) const
        {
            return (equals(d, other.d, eps) && equals(norm, other.norm, eps)) ||
                (equals(d, -other.d, eps) && equals(norm, -other.norm, eps));
        }
    };

    static std::vector<size_t> findContour(const std::pair<size_t, size_t>& initial,
                                    const size_t initialIndex,
                                    const std::vector<std::pair<size_t, size_t>>& contourEdges,
                                    const std::unordered_map<size_t, size_t>& edgeMap)
    {
        std::vector<size_t> contourIndices;
        std::unordered_map<size_t, bool> visited;

        contourIndices.push_back(initialIndex);

        size_t currentVertex = initial.second;

        // TODO: SCARY WHILE
        while (currentVertex != initial.first)
        {
            if (visited[currentVertex])
            {
                printf("Looping while finding contour!\n");

                contourIndices.clear();

                return contourIndices;
            }
            visited[currentVertex] = true;

            auto it = edgeMap.find(currentVertex);

            if (it == edgeMap.end())
            {
                // bad news
                printf("No new edge while finding contour!\n");
            }
            else
            {
                auto edgeIndex = it->second;
                contourIndices.push_back(edgeIndex);
                auto edge = contourEdges[edgeIndex];
                currentVertex = edge.second;
            }
        }

        return contourIndices;
    }


    enum class ClipSegmentType
    {
        POINT,
        LINE_BEGIN,
        LINE_END
    };

    struct ClipSegment
    {
        ClipSegmentType type;
        double pos;
    };

    enum class ClipSegment2DType
    {
        POINT,
        LINE
    };

    struct ClipSegment2D
    {
        ClipSegment2DType type;
        glm::dvec2 pos;
        glm::dvec2 pos2;
    };


    enum class ClipType
    {
        BELOW,
        ON,
        LINE,
        CROSS,
        ABOVE
    };

    struct ClipLine
    {
        size_t originMesh;
        size_t originPolygon;
        ClipType type;
        glm::dvec3 pos;
        glm::dvec3 pos2;
        double startLineDist;
        double endLineDist;
        bool cross = false;

        // TODO: start > end here

        bool Overlaps2D(const ClipLine& other) const
        {
            return startLineDist >= other.startLineDist && endLineDist <= other.startLineDist && endLineDist <= other.endLineDist;
        }

        bool HasCornerWithValue(const ClipLine& other) const
        {
            if (other.startLineDist != other.endLineDist)
            {
                return false;
            }

            return startLineDist == other.startLineDist || endLineDist == other.endLineDist;
        }
    };

    struct ClipLineData
    {
        std::vector<ClipLine> lines;
    };

    static std::vector<ClipSegment> LineDistancesToClipSegments(size_t meshIndex,
                                                         size_t polygonIndex,
                                                         const std::vector<double>& distances,
                                                         const std::vector<size_t>& contour,
                                                         const std::vector<glm::dvec3>& sourcePoints,
                                                         const glm::dvec3& linePos,
                                                         const glm::dvec3& lineDir)
    {
        std::vector<ClipLine> clipLines;

        // init to cross because we don't care
        ClipType prevSide = ClipType::CROSS;

        // don't start ON the line
        size_t startIndex = 0;
        for (; startIndex < distances.size(); startIndex++)
        {
            bool startOnLine = std::fabs(distances[startIndex]) < EPS_BIG;
            if (!startOnLine)
            {
                break;
            }
        }

        int numCrosses = 0;
        // find transfers and process
        for (size_t d = startIndex; d < (startIndex + distances.size()); d++)
        {
            size_t s = (d) % distances.size();
            size_t e = (d + 1) % distances.size();

            const auto& s3D = sourcePoints[contour[s]];
            const auto& e3D = sourcePoints[contour[e]];

            double ds = distances[s];
            double de = distances[e];

            bool startOnLine = std::fabs(ds) < EPS_BIG;
            bool endOnLine   = std::fabs(de) < EPS_BIG;

            bool startSide = ds >= 0;
            bool endSide   = de >= 0;

            bool addedThisLoop = false;

            if (startOnLine && endOnLine)
            {
                ClipLine ci;
                ci.originMesh = meshIndex;
                ci.originPolygon = polygonIndex;
                ci.type = ClipType::LINE;
                ci.pos = s3D;
                ci.pos2 = e3D;
                clipLines.push_back(ci);
                addedThisLoop = true;
            }
            else if (startOnLine)
            {
                bool addOnPoint = true;
                // check if we're not already on prev line
                if (!clipLines.empty())
                {
                    if (clipLines.back().type == ClipType::LINE)
                    {
                        if (clipLines.back().pos2 == s3D)
                        {
                            addOnPoint = false;
                        }
                    }
                }

                if (addOnPoint)
                {
                    ClipLine ci;
                    ci.originMesh = meshIndex;
                    ci.originPolygon = polygonIndex;
                    ci.type = ClipType::ON;
                    ci.pos = s3D;
                    ci.pos2 = s3D;
                    clipLines.push_back(ci);
                    addedThisLoop = true;
                }
            }
            else if (endOnLine)
            {
                // ignore
            }
            else // neither on line
            {
                if (startSide == endSide)
                {
                    // same side, ignore
                }
                else
                {
                    // aha! crossing from one side to another
                    // figure out intersection point with line
                    double segmentDist = std::fabs(ds) + std::fabs(de);
                    double ratio = std::fabs(ds) / segmentDist;

                    glm::dvec3 dir = e3D - s3D;
                    glm::dvec3 offsetFromS = dir * ratio;
                    glm::dvec3 pointOnLine = s3D + offsetFromS;

                    {
                        ClipLine ci;
                        ci.originMesh = meshIndex;
                        ci.originPolygon = polygonIndex;
                        ci.type = ClipType::CROSS;
                        ci.pos = pointOnLine;
                        ci.pos2 = pointOnLine;
                        clipLines.push_back(ci);
                        addedThisLoop = true;
                    }
                }
            }

            if (!startOnLine)
            {
                ClipType newSide = startSide ? ClipType::ABOVE : ClipType::BELOW;

                // prevSide == CROSS if we don't have a prev
                if (prevSide != ClipType::CROSS && prevSide != newSide)
                {
                    if (addedThisLoop)
                    {
                        // if we've added a point this loop (likely cross?) we dont' want to mark the cross, but the one before cross
                        clipLines[clipLines.size() - 2].cross = true;
                        numCrosses++;
                        if (clipLines[clipLines.size() - 2].type == ClipType::ON)
                        {
                            clipLines[clipLines.size() - 2].type = ClipType::CROSS;
                        }
                    }
                    else
                    {
                        // mark the previous side as cross
                        clipLines.back().cross = true;
                        numCrosses++;
                        if (clipLines.back().type == ClipType::ON)
                        {
                            clipLines.back().type = ClipType::CROSS;
                        }
                    }
                }

                prevSide = newSide;
            }
        }

        // uneven crosses is impossible, must repair!
        if (numCrosses % 2 != 0)
        {
            clipLines.back().cross = true;
            if (clipLines.back().type == ClipType::ON)
            {
                clipLines.back().type = ClipType::CROSS;
            }
        }

        if (clipLines.empty())
        {
            return {};
        }

        for (auto& cl : clipLines)
        {
            cl.startLineDist = glm::dot(cl.pos - linePos, lineDir);
            cl.endLineDist = glm::dot(cl.pos2 - linePos, lineDir);

            if (cl.endLineDist > cl.startLineDist)
            {
                std::swap(cl.pos, cl.pos2);
                std::swap(cl.startLineDist, cl.endLineDist);
            }
        }

        std::sort(clipLines.begin(), clipLines.end(), [&](const ClipLine& a, const ClipLine& b)
                  {
                      return a.startLineDist > b.startLineDist;
                  });

        std::vector<ClipSegment> segments;

        std::optional<double> prevPoint;
        bool onLine = false;
        for (auto& cl : clipLines)
        {
            bool addLine = false;

            if (cl.type == ClipType::CROSS)
            {
                if (onLine)
                {
                    addLine = true;
                }
            }
            else if (cl.type == ClipType::LINE)
            {
                if (onLine)
                {
                    addLine = true;
                }
            }
            else if (cl.type == ClipType::ON)
            {
                if (onLine)
                {
                    addLine = true;
                }
                else
                {
                    // add point
                    {
                        ClipSegment s;
                        s.type = ClipSegmentType::POINT;
                        s.pos = cl.startLineDist;
                        segments.push_back(s);
                    }
                }
            }

            if (addLine)
            {
                {
                    ClipSegment s;
                    s.type = ClipSegmentType::LINE_BEGIN;
                    s.pos = *prevPoint;
                    segments.push_back(s);
                }
                {
                    ClipSegment s;
                    s.type = ClipSegmentType::LINE_END;
                    s.pos = cl.startLineDist;
                    segments.push_back(s);
                }
            }

            if (cl.type == ClipType::LINE)
            {
                {
                    ClipSegment s;
                    s.type = ClipSegmentType::LINE_BEGIN;
                    s.pos = cl.startLineDist;
                    segments.push_back(s);
                }
                {
                    ClipSegment s;
                    s.type = ClipSegmentType::LINE_END;
                    s.pos = cl.endLineDist;
                    segments.push_back(s);
                }
            }

            if (cl.cross)
            {
                onLine = !onLine;
            }

            prevPoint = cl.endLineDist;
        }

        if (onLine)
        {
            printf("mistake!");
        }

        return segments;
    }

    static std::vector<ClipSegment> LineDistancesToClipSegments2D(const std::vector<glm::dvec2>& points, const std::vector<size_t>& pointIndices, glm::dvec2 linePos2D, glm::dvec2 lineDir2D)
    {
        glm::dvec3 linePos(linePos2D, 0);
        glm::dvec3 lineDir(lineDir2D, 0);

        std::vector<double> distances(pointIndices.size());

        for (size_t i = 0; i < pointIndices.size(); i++)
        {
            bool side = sign2D(points[pointIndices[i]], linePos2D, linePos2D + lineDir2D) >= 0;
            distances[i] = DistanceToLine(glm::dvec3(points[pointIndices[i]], 0), linePos, lineDir) * (side ? 1 : -1);
        }

        std::vector<glm::dvec3> sourcePoints;
        for (auto& pt : points)
        {
            sourcePoints.push_back(glm::dvec3(pt, 0));
        }


        return LineDistancesToClipSegments(0,
                                           0,
                                           distances,
                                           pointIndices,
                                           sourcePoints,
                                           linePos,
                                           lineDir);
    }

    static std::vector<ClipSegment> LineDistancesToClipSegments2D(const std::vector<glm::dvec2>& points, glm::dvec2 linePos2D = glm::dvec2(0, 0), glm::dvec2 lineDir2D = glm::dvec2(1, 0))
    {
        std::vector<size_t> contour(points.size());

        for (size_t i = 0; i < points.size(); i++)
        {
            contour[i] = i;
        }

        return LineDistancesToClipSegments2D(points, contour, linePos2D, lineDir2D);
    }


    struct Polygon3D
    {
        size_t meshIndex;
        size_t index;
        Plane plane;
        glm::dvec3 a;
        glm::dvec3 b;
        glm::dvec3 c;
        std::vector<size_t> faceIndices;
        std::vector<Face> faces;
        std::vector<glm::dvec2> points;
        std::vector<glm::dvec3> sourcePoints;
        std::vector<std::pair<size_t, size_t>> edges;
        std::vector<std::vector<size_t>> contours;

        IfcGeometry ToGeom() const
        {
            IfcGeometry geom;

            for (auto& face : faces)
            {
                geom.AddFace(sourcePoints[face.i0],
                             sourcePoints[face.i1],
                             sourcePoints[face.i2]);
            }

            return geom;
        }

        void GetExportableEdges(std::vector<std::vector<glm::dvec2>>& vecs) const
        {
            for (auto& contour : contours)
            {
                for (size_t i = 0; i < contour.size(); i++)
                {
                    vecs.push_back({ points[contour[i]], points[contour[(i + 1) % contour.size()]] });
                }
            }
        }

        void Print(const std::wstring& filename) const
        {
            std::vector<std::vector<glm::dvec2>> vecs;

            GetExportableEdges(vecs);

            DumpSVGLines(vecs, filename);
        }

        void PrintEdges(const std::wstring& filename) const
        {
            std::vector<std::vector<glm::dvec2>> vecs;

            for (auto& e : edges)
            {
                vecs.push_back({ points[e.first], points[e.second] });           
            }

            DumpSVGLines(vecs, filename);
        }

        void PrintEdgesAndLoop(const std::wstring& filename, const std::vector<size_t>& loop) const
        {
            std::vector<std::vector<glm::dvec2>> vecs;

            for (auto& e : edges)
            {
                vecs.push_back({ points[e.first], points[e.second] });
            }

            std::vector<std::vector<glm::dvec2>> loops;

            for (size_t i = 1; i < loop.size(); i++)
            {
                loops.push_back({ points[loop[i-1]], points[loop[i]] });
            }

            SVGLineSet set;
            set.lines = vecs;
            set.color = "rgb(255, 0, 0)";

            SVGLineSet set2;
            set2.lines = loops;
            set2.color = "rgb(0, 0, 255)";

            SVGDrawing drawing;
            drawing.sets.push_back(set);
            drawing.sets.push_back(set2);
            writeFile(filename + L".html", makeSVGLines(drawing));
        }

        void PrintLoops(const std::wstring& filename, const std::vector<size_t>& loop, const std::vector<size_t>& loopb, glm::dvec2 horLinePos) const
        {
            std::vector<std::vector<glm::dvec2>> loop1;

            for (size_t i = 0; i < loop.size(); i++)
            {
                loop1.push_back({ points[loop[i]], points[loop[(i + 1) % loop.size()]] });
            }

            for (size_t i = 0; i < loopb.size(); i++)
            {
                loop1.push_back({ points[loopb[i]], points[loopb[(i + 1) % loopb.size()]] });
            }

            loop1.push_back({ horLinePos + glm::dvec2(1, 0), horLinePos - glm::dvec2(1, 0) });

            DumpSVGLines(loop1, filename + L"1.html");
        }

        glm::dvec2 Project2D(const glm::dvec3& pt) const
        {
            glm::dvec2 pa = glm::dvec2(0, 0);
            glm::dvec2 pb = glm::dvec2(1, 0);
            glm::dvec2 pc = glm::dvec2(0, 1);

            glm::dvec3 bpt = ToBary(a, b, c, pt);
            return FromBary(pa, pb, pc, bpt);
        }

        glm::dvec3 Unproject2D(const glm::dvec2& pt) const
        {
            //glm::dvec2 pa = glm::dvec2(0, 0);
            //glm::dvec2 pb = glm::dvec2(1, 0);
            //glm::dvec2 pc = glm::dvec2(0, 1);

            glm::dvec3 bpt = ToBary2(pt);
            return FromBary(a, b, c, bpt);
        }

        std::vector<size_t> GetNeighbours(size_t vertIndex, size_t exclude)
        {
            std::vector<size_t> neighbours;

            for (auto& e : edges)
            {
                if (e.first == vertIndex && e.second != exclude)
                {
                    neighbours.push_back(e.second);
                }
                else if (e.second == vertIndex && e.first != exclude)
                {
                    neighbours.push_back(e.first);
                }
            }

            return neighbours;
        }

        std::vector<size_t> FindLoop(size_t currentVertex, size_t prevVertex)
        {
            std::vector<size_t> loop;
            std::vector<bool> visited(points.size());

            // keep walking right, if we find a ccw loop, we're good. If its not ccw, we invert current/prev
            size_t cur = currentVertex;
            size_t prev = prevVertex;

            while (true)
            {
                if (visited[cur])
                {
                    printf("Loop in findLoop ... how ironic \n");
                    return {};
                }

                visited[cur] = true;
                loop.push_back(cur);
                if (cur == prevVertex)
                {
                    // end of loop
                    break;
                }
                

                auto nbs = GetNeighbours(cur, prev);

                if (nbs.empty())
                {
                    // broken poly
                    printf("Found vert without neighbours\n");
                    loop.clear();
                    return loop;
                }

                // find right-hand neighbour with narrowest "turn"
                double maxSign = -DBL_MAX;
                size_t maxNB = 0;

                auto& a = points[prev];
                auto& b = points[cur];

                for (auto& nb : nbs)
                {
                    auto& p = points[nb];

                    double sign = ComparableAngle(p, a, b);

                    if (sign > maxSign)
                    {
                        maxSign = sign;
                        maxNB = nb;
                    }
                }

                // assign maxNB to cur
                prev = cur;
                cur = maxNB;
            }

            return loop;
        }

        bool IsLoopCCW(const std::vector<size_t>& pts)
        {
            std::vector<glm::dvec2> loop;

            for (auto& pi : pts)
            {
                loop.push_back(points[pi]);
            }

            return IsVectorCCW(loop);
        }

        std::vector<std::vector<size_t>> ComputeEdgeLoops()
        {
            // pick free edge, loop around taking right-most edge, when circle is made emit loop
            std::vector<bool> visited(edges.size());

            std::vector<std::vector<size_t>> loops;

            while (true)
            {
                int newIndex = -1;

                for (size_t i = 0; i < edges.size(); i++)
                {
                    if (!visited[i])
                    {
                        newIndex = i;
                        break;
                    }
                }

                if (newIndex == -1)
                {
                    // done
                    break;
                }

                auto& edge = edges[newIndex];

                // find new loop by going clockwise narrowest
                auto loop = FindLoop(edge.second, edge.first);
                if (loop.empty())
                {
                    // bad news, each edge should be part of a loop
                    return {};
                }

                if (CSG_DEBUG_OUTPUT)
                {
                    PrintEdgesAndLoop(L"loop", loop);
                }

                if (!IsLoopCCW(loop)) // if we end up finding a counterclockwise loop, try again with edge direction inverted
                {
                    loop = FindLoop(edge.first, edge.second);
                    if (CSG_DEBUG_OUTPUT)
                    {
                        PrintEdgesAndLoop(L"loop", loop);
                    }
                }

                if (!IsLoopCCW(loop))
                {
                    printf("BAD LOOP");
                    return {};
                }

                // mark loop as visited
                for (size_t j = 0; j < loop.size(); j++)
                {
                    size_t a = loop[j];
                    size_t b = loop[(j + 1) % loop.size()];

                    for (size_t i = 0; i < edges.size(); i++)
                    {
                        auto& e = edges[i];
                        if ((e.first == a && e.second == b) || (e.first == b && e.second == a))
                        {
                            visited[i] = true;
                        }
                    }
                }

                // emit loop
                loops.push_back(std::move(loop));
            }

            return loops;
        }

        bool CountIntersectionsWithXLine(const std::vector<size_t>& pointIndices, double xoffset, double y, double eps)
        {

            std::vector<double> distances(pointIndices.size());

            glm::dvec2 linePos2D(xoffset, y);
            glm::dvec2 lineDir2D(1, 0);

            auto segs = LineDistancesToClipSegments2D(points, pointIndices, linePos2D, lineDir2D);

            if (segs.empty())
            {
                // no intersection with the line, not inside of poly
                return false;
            }

            // figure out if 0 is inside segs
            bool insideLine = false;
            for (auto& s : segs)
            {
                // first event > 0, check if we're inside
                if (s.pos < 0)
                {
                    return insideLine;
                }

                // update inside-ness
                if (s.type == ClipSegmentType::LINE_BEGIN)
                {
                    insideLine = true;
                }
                else if (s.type == ClipSegmentType::LINE_END)
                {
                    insideLine = false;
                }
            }

            return false;
        }

        bool AIsInsideB(const std::vector<size_t>& A, const std::vector<size_t>& B)
        {
            // find point of A not in B
            int pt = -1;
            //bool anyPointOnB = false;
            for (auto& ptA : A)
            {
                bool found = false;
                for (auto& ptB : B)
                {
                    if (ptB == ptA)
                    {
                        found = true;
                        //anyPointOnB = true;
                        break;
                    }
                }

                if (!found)
                {
                    pt = ptA;
                    break;
                }
            }

            if (pt == -1)
            {
                // all points of A are on B, since these must be half edges, A is outside B
                return false;
            }

            auto pt2D = points[pt];

            if (CSG_DEBUG_OUTPUT)
            {
                PrintLoops(L"pair", A, B, pt2D);
            }

            // pt is not on B, see if its inside B
            bool ptInsideB = CountIntersectionsWithXLine(B, pt2D.x, pt2D.y, EPS_SMALL);

            // A does not touch B, hence it depends on ptInsideB
            return ptInsideB;
        }

        void Retriangulate(IfcGeometry& outputGeom, bool eraseHoles)
        {
            auto loops = ComputeEdgeLoops();
            if (loops.empty())
            {
                // bad news, polygon broken
                return;
            }

            std::map<size_t, std::vector<size_t>> parents;
            std::map<size_t, std::vector<size_t>> children;

            // figure out the nesting order, which determines holes
            // for each two loops, they either touch on shared points, or points lie completely within eachother
            for (size_t i = 0; i < loops.size(); i++)
            {
                for (size_t j = 0; j < loops.size(); j++)
                {
                    if (i != j)
                    {
                        if (AIsInsideB(loops[i], loops[j]))
                        {
                            parents[i].push_back(j);
                            children[j].push_back(i);
                        }
                    }
                }
            }

            // assign depth to each loop
            std::vector<size_t> depth(loops.size());

            bool change = false;
            do
            {
                change = false;

                for (size_t i = 0; i < loops.size(); i++)
                {
                    if (parents.count(i) == 0)
                    {
                        // if no parents, depth is 0
                        depth[i] = 0;
                    }
                    else
                    {
                        // otherwise, depth is max of all parent depths + 1
                        size_t maxDepth = 0;
                        for (auto& p : parents[i])
                        {
                            maxDepth = std::max(maxDepth, depth[p]);
                        }

                        size_t newDepth = maxDepth + 1;
                        change = newDepth != depth[i];
                        depth[i] = newDepth;
                    }
                }
            }
            while (change);

            std::vector<std::vector<std::vector<size_t>>> parentLoops;

            // combine children + depth info to create lists
            for (size_t i = 0; i < loops.size(); i++)
            {
                // we consider all even depths parents, all odd depths children
                if (depth[i] % 2 == 0)
                {
                    std::vector<std::vector<size_t>> childLoops;

                    // push parent
                    childLoops.push_back(loops[i]);

                    for (auto& c : children[i])
                    {
                        // check if its a "real" child
                        if (depth[c] == depth[i] + 1)
                        {
                            childLoops.push_back(loops[c]);
                        }
                    }

                    parentLoops.push_back(std::move(childLoops));
                }
            }

            TriangulateCDT(parentLoops, outputGeom, eraseHoles);
        }

        void TriangulateCDT(const std::vector<std::vector<std::vector<size_t>>>& parentLoops, IfcGeometry& outputGeom, bool eraseHoles = false)
        {
            for (auto& parentLoop : parentLoops)
            {
                std::set<size_t> ids;

                CDT::Triangulation<double> cdt(CDT::VertexInsertionOrder::AsProvided);
                std::vector<CDT::Edge> edges;
                for (auto& loop : parentLoop)
                {
                    for (size_t i = 0; i < loop.size(); i++)
                    {
                        size_t si = i;
                        size_t ei = (i + 1) % loop.size();

                        edges.push_back(CDT::Edge(loop[si], loop[ei]));
                    }

                }

                std::vector<CDT::V2d<double>> verts;

                for (auto& pt : points)
                {
                    verts.push_back(CDT::V2d<double>::make(pt.x, pt.y));
                }

                cdt.insertVertices(verts);
                cdt.insertEdges(edges);

                if (eraseHoles)
                {
                    cdt.eraseOuterTrianglesAndHoles();
                }
                else
                {
                    cdt.eraseOuterTriangles();
                }

                auto outVerts = cdt.vertices;
                auto triangles = cdt.triangles;

                for (auto& t : triangles)
                {
                    auto ca2d = outVerts[t.vertices[0]];
                    auto cb2d = outVerts[t.vertices[1]];
                    auto cc2d = outVerts[t.vertices[2]];

                    auto a2d = glm::dvec2(ca2d.x, ca2d.y);
                    auto b2d = glm::dvec2(cb2d.x, cb2d.y);
                    auto c2d = glm::dvec2(cc2d.x, cc2d.y);

                    double area = areaOfTriangle(a2d, b2d, c2d);
                    if (area < EPS_SMALL)
                    {
                        printf("small area");
                    }

                    auto a = Unproject2D(a2d);
                    auto b = Unproject2D(b2d);
                    auto c = Unproject2D(c2d);

                    outputGeom.AddFace(a, b, c);
                }

//                DumpIfcGeometry(outputGeom, L"output.obj");
            }
        }

        void TriangulateEarcut(const std::vector<std::vector<std::vector<size_t>>>& parentLoops, IfcGeometry& outputGeom)
        {
            using Point = std::array<double, 2>;

            // for each parent loop, submit it and all children to earcut
            for (auto& polygons : parentLoops)
            {
                std::vector<std::vector<Point>> cutPolygons;

                std::vector<size_t> cutPolygonIndices;

                for (auto& polygon : polygons)
                {
                    std::vector<Point> cutPolygon;

                    for (auto& pti : polygon)
                    {
                        cutPolygonIndices.push_back(pti);
                        cutPolygon.push_back({ points[pti].x, points[pti].y });
                    }

                    cutPolygons.push_back(cutPolygon);
                }

                std::vector<uint32_t> indices = mapbox::earcut<uint32_t>(cutPolygons);

                for (size_t i = 0; i < indices.size(); i += 3)
                {
                    auto a2d = points[cutPolygonIndices[indices[i + 0]]];
                    auto b2d = points[cutPolygonIndices[indices[i + 1]]];
                    auto c2d = points[cutPolygonIndices[indices[i + 2]]];

                    double area = areaOfTriangle(a2d, b2d, c2d);
                    if (area < EPS_SMALL)
                    {
                        printf("small area");
                    }

                    auto a = Unproject2D(a2d);
                    auto b = Unproject2D(b2d);
                    auto c = Unproject2D(c2d);

                    outputGeom.AddFace(a, b, c);
                }
            }
        }

        size_t AddPoint(const glm::dvec2& pt, const glm::dvec3& pt3, bool checkIntersect = false)
        {
            int index = -1;
            for (size_t i = 0; i < points.size(); i++)
            {
                if (equals2d(pt, points[i], EPS_BIG))
                {
                    if (index != -1)
                    {
                        printf("Double point match!");
                    }
                    index = i;
                }
            }

            if (index != -1)
            {
                return index;
            }

            sourcePoints.push_back(pt3);
            points.push_back(pt);

            size_t newPointIndex = points.size() - 1;

            if (checkIntersect)
            {
                // point is added to the list, but we need to potentially break up some edges to add the point
                
                int edgeToSplit = -1;
                for (size_t i = 0; i < edges.size(); i++)
                {
                    auto& e = edges[i];
                    auto& ea = points[e.first];
                    auto& eb = points[e.second];

                    // TODO: HANDLE THIS WITH PREDICATES
                    if (PointOnLineSegment2D(ea, eb, pt, EPS_SMALL))
                    {
                        edgeToSplit = i;
                        break;
                    }
                }

                if (edgeToSplit != -1)
                {
                    // remember edge
                    auto e = edges[edgeToSplit];

                    // remove edge with index edgeToSplit
                    edges.erase(edges.begin() + edgeToSplit);

                    // add 2 new edges to break up e
                    edges.emplace_back(e.first, newPointIndex);
                    edges.emplace_back(newPointIndex, e.second);
                }
                else
                {
                    // no edge to split, can just add a new point and connect
                }
            }

            return newPointIndex;
        }

        void AddEdge(const glm::dvec2& a, const glm::dvec2& b, bool checkIntersect = false)
        {
            size_t size = points.size();
            size_t ia = AddPoint(a, glm::dvec3(0), checkIntersect);
            //bool addedA = points.size() != size;
            size = points.size();
            size_t ib = AddPoint(b, glm::dvec3(0), checkIntersect);
            //bool addedB = points.size() != size;

            if (ia == ib)
            {
                return;
            }

            // deduplicate
            for (auto& e : edges)
            {
                if ((e.first == ia && e.second == ib) || (e.first == ib && e.second == ia))
                {
                    return;
                }
            }

            bool alreadyExists = false;
            if (checkIntersect)
            {
                // check if ia and ib are already connected indirectly through existing edges
                glm::dvec2 dir = glm::normalize(b - a);
                auto nbs = GetNeighbours(ia, -1);
                for (auto& nb : nbs)
                {
                    glm::dvec2 dirNB = glm::normalize(points[nb] - a);
                    double dot = glm::dot(dir, dirNB);
                    if (dot > 1 - EPS_SMALL)
                    {
                        printf("incident line!");
                    }
                }

                // check if ia and ib are already connected indirectly through existing edges
                alreadyExists = false;
                nbs = GetNeighbours(ib, -1);
                for (auto& nb : nbs)
                {
                    glm::dvec2 dirNB = glm::normalize(b - points[nb]);
                    double dot = glm::dot(dir, dirNB);
                    if (dot > 1 - EPS_SMALL)
                    {
                        printf("incident line!");
                    }
                }
            }

            if (!alreadyExists)
            {
                edges.emplace_back(ia, ib);
            }
        }

        void AddPoint(const glm::dvec2& a, bool checkIntersect = false)
        {
            AddPoint(a, glm::dvec3(0), checkIntersect);
        }

        void AddFace(const glm::dvec3& a, const glm::dvec3& b, const glm::dvec3& c)
        {
            glm::dvec2 pa = Project2D(a);
            glm::dvec2 pb = Project2D(b);
            glm::dvec2 pc = Project2D(c);

            size_t ia = AddPoint(pa, a);
            size_t ib = AddPoint(pb, b);
            size_t ic = AddPoint(pc, c);

            Face f;
            f.i0 = ia;
            f.i1 = ib;
            f.i2 = ic;

            edges.emplace_back(ia, ib);
            edges.emplace_back(ib, ic);
            edges.emplace_back(ic, ia);

            faces.push_back(f);
        }

        size_t CountEdge(size_t a, size_t b)
        {
            size_t total = 0;

            for (auto& edge : edges)
            {
                if ((edge.first == a && edge.second == b) || (edge.first == b && edge.second == a))
                {
                    total++;
                }
            }

            return total;
        }

        void FindContoursInFaces()
        {
            std::vector<std::pair<size_t, size_t>> contourEdges;

            // find contour edges
            for (auto& edge : edges)
            {
                if (CountEdge(edge.first, edge.second) == 1)
                {
                    contourEdges.push_back(edge);
                }
            }

            if (contourEdges.empty())
            {
                printf("Empty contour edges!\n");
                return;
            }

            // group contour edges into strips
            std::vector<bool> processed(contourEdges.size());

            std::unordered_map<size_t, size_t> edgeMap;

            for (size_t i = 0; i < contourEdges.size(); i++)
            {
                if (edgeMap.count(contourEdges[i].first) != 0)
                {
                    {
                        std::vector<std::vector<glm::dvec2>> vecs;

                        for (auto& e : edges)
                        {
                            vecs.push_back({ points[e.first], points[e.second] });
                        }

                        vecs.push_back({ points[contourEdges[i].first] });

                        std::vector<std::vector<glm::dvec2>> edge;

                        auto edgeID = edgeMap[contourEdges[i].first];

                        edge.push_back({ points[contourEdges[i].first], points[contourEdges[i].second] });
                        edge.push_back({ points[contourEdges[i].first], points[contourEdges[edgeID].second] });

                        SVGLineSet set;
                        set.lines = vecs;
                        SVGLineSet set2;
                        set2.lines = edge;
                        set2.color = "rgb(0, 0, 255)";
                        SVGDrawing drawing;
                        drawing.sets ={ set, set2 };
                        writeFile(L"edges.html", makeSVGLines(drawing));
                    }

                    printf("Double contour edges!\n");
                    return;
                }

                edgeMap[contourEdges[i].first] = i;
            }

            while (true)
            {
                bool newProcessed = false;
                for (size_t i = 0; i < contourEdges.size(); i++)
                {
                    if (!processed[i])
                    {
                        newProcessed = true;

                        auto contourEdgeIndices = findContour(contourEdges[i], i, contourEdges, edgeMap);

                        std::vector<size_t> contour;

                        for (auto& c : contourEdgeIndices)
                        {
                            processed[c] =  true;
                            contour.push_back(contourEdges[c].first);
                        }

                        contours.push_back(std::move(contour));
                    }
                }

                if (newProcessed)
                {
                    // done
                    break;
                }
            }
        }
    };

    static Plane FaceToPlane(const glm::dvec3& a, const glm::dvec3& b, const glm::dvec3& c)
    {
        Plane p;
        p.norm = computeNormal(a, b, c);
        p.d = glm::dot(a, p.norm);
        return p;
    }

    struct BrepMesh
    {
        std::vector<Polygon3D> polygons;
    };

    static void normalizeTriangle(glm::dvec3 &aa, glm::dvec3 &bb, glm::dvec3 &cc)
    {
        glm::dvec3 v1 = aa - bb;
        glm::dvec3 v2 = aa - cc;
        glm::dvec3 v3 = bb - cc;

        double d1 = glm::length(v1);
        double d2 = glm::length(v2);
        double d3 = glm::length(v3);

        double lim = std::max(d1, std::max(d2, d3));

        if (glm::length(v1) < lim)
        {
            v1 = glm::normalize(v1) * lim;
            bb = aa - v1;
            v1 = aa - bb;
            v2 = aa - cc;
            v3 = bb - cc;
        }

        if (glm::length(v2) < lim)
        {
            v2 = glm::normalize(v2) * lim;
            cc = aa - v2;
            v1 = aa - bb;
            v2 = aa - cc;
            v3 = bb - cc;
        }

        if (glm::length(v3) < lim)
        {
            v3 = glm::normalize(v3) * lim;
            cc = bb - v3;
            v1 = aa - bb;
            v2 = aa - cc;
            v3 = bb - cc;
        }
    }

    static BrepMesh MeshToBReps(const IfcGeometry& mesh, size_t meshIndex)
    {
        BrepMesh brep;

        for (size_t fi = 0; fi < mesh.numFaces; fi++)
        {
            const Face& f = mesh.GetFace(fi);

            const glm::dvec3& a = mesh.GetPoint(f.i0);
            const glm::dvec3& b = mesh.GetPoint(f.i1);
            const glm::dvec3& c = mesh.GetPoint(f.i2);

            //double area = areaOfTriangle(a, b, c);

            Plane p = FaceToPlane(a, b, c);

            int polygonIndex = -1;
            for (size_t pi = 0; pi < brep.polygons.size(); pi++)
            {
                if (brep.polygons[pi].plane.Equals(p, EPS_SMALL))
                {
                    polygonIndex = pi;
                    break;
                }
            }

            if (polygonIndex == -1)
            {
                polygonIndex = brep.polygons.size();
                Polygon3D poly;
                poly.index = polygonIndex;
                poly.meshIndex = meshIndex;
                glm::dvec3 aa = glm::dvec3(a.x, a.y, a.z);
                glm::dvec3 bb = glm::dvec3(b.x, b.y, b.z);
                glm::dvec3 cc = glm::dvec3(c.x, c.y, c.z);

                // Correct the initial vertices to prevent undesirable situations
                normalizeTriangle(aa, bb, cc);

                poly.a = aa;
                poly.b = bb;
                poly.c = cc;
                poly.plane = p;
                brep.polygons.push_back(poly);
            }

            brep.polygons[polygonIndex].faceIndices.push_back(fi);
            brep.polygons[polygonIndex].AddFace(a, b, c);
        }

        for (auto& poly3D : brep.polygons)
        {
            if (CSG_DEBUG_OUTPUT)
            {
                auto geom = poly3D.ToGeom();
                DumpIfcGeometry(geom, L"poly3D.obj");
            }
            poly3D.FindContoursInFaces();
        }

        return brep;
    }

    static void CoplanarPolygonIntersect(const Polygon3D& poly1, const Polygon3D& poly2)
    {
        // TODO: project the poly with least points
        // project 2 onto 1, resolve collisions
        std::vector<glm::dvec2> projPoly2(poly2.points.size());

        for (size_t i = 0; i < poly2.points.size(); i++)
        {
            projPoly2[i] = poly1.Project2D(poly2.sourcePoints[i]);
        }

        // we reason from the perspective of poly vs contours 
        /*
        for (auto& c1 : poly1.contours)
        {
            for (int i = 0; i < c1.size(); i++)
            {
                size_t previ = c1[i];
                size_t curi = c1[(i + 1) % c1.size()];

                const auto& prev = poly1.points[previ];
                const auto& cur = poly1.points[curi];

                for (auto& c2 : poly2.contours)
                {

                }
            }
        }*/
    }

    static std::vector<ClipSegment> IntersectClipSegments(const std::vector<ClipSegment>& segA, const std::vector<ClipSegment>& segB)
    {
        std::vector<std::pair<ClipSegment, bool>> combined;

        for (auto& seg : segA)
        {
            combined.emplace_back(seg, true);
        }

        for (auto& seg : segB)
        {
            combined.emplace_back(seg, false);
        }

        std::sort(combined.begin(), combined.end(), [&](const std::pair<ClipSegment, bool>& a, const std::pair<ClipSegment, bool>& b)
                  {
                      return a.first.pos > b.first.pos;
                  });

        std::vector<ClipSegment> output;

        bool insideA = false;
        bool insideB = false;
        std::optional<double> startPoint;
        for (auto& isegPair : combined)
        {
            auto iseg = isegPair.first;
            bool fromA = isegPair.second;

            if (iseg.type == ClipSegmentType::POINT)
            {
                if (fromA)
                {
                    if (insideB)
                    {
                        ClipSegment seg;
                        seg.type = ClipSegmentType::POINT;
                        seg.pos = iseg.pos;
                        output.push_back(seg);
                    }
                    else if (insideA)
                    {
                        printf("Point inside segment A!\n");
                    }
                    else
                    {
                        // ignore
                    }
                }
                else // from B
                {
                    if (insideA)
                    {
                        ClipSegment seg;
                        seg.type = ClipSegmentType::POINT;
                        seg.pos = iseg.pos;
                        output.push_back(seg);
                    }
                    else if (insideB)
                    {
                        printf("Point inside segment B!\n");
                    }
                    else
                    {
                        // ignore
                    }
                }

            }
            else if (iseg.type == ClipSegmentType::LINE_BEGIN)
            {
                if (fromA)
                {
                    insideA = true;
                }
                else // from B
                {
                    insideB = true;
                }

                if (insideA && insideB)
                {
                    startPoint = iseg.pos;

                    ClipSegment seg;
                    seg.type = ClipSegmentType::LINE_BEGIN;
                    seg.pos = iseg.pos;
                    output.push_back(seg);
                }
            }
            else if (iseg.type == ClipSegmentType::LINE_END)
            {
                if (insideA && insideB)
                {
                    ClipSegment seg;
                    seg.pos = iseg.pos;
                    seg.type = ClipSegmentType::LINE_END;
                    output.push_back(seg);

                    startPoint = std::nullopt;
                }

                if (fromA)
                {
                    insideA = false;
                }
                else // from B
                {
                    insideB = false;
                }
            }
        }

        return output;
    }

    static std::vector<ClipSegment> MergeClipSegments(std::vector<ClipSegment>& inputSegments)
    {
        std::sort(inputSegments.begin(), inputSegments.end(), [&](const ClipSegment& a, const ClipSegment& b)
                  {
                      return a.pos > b.pos;
                  });

        std::vector<ClipSegment> outputSegments;

        bool inside = false;
        std::optional<double> prevLinePos;
        for (auto& iseg : inputSegments)
        {
            if (iseg.type == ClipSegmentType::POINT)
            {
                if (prevLinePos.has_value())
                {
                    {
                        ClipSegment s;
                        s.type = ClipSegmentType::LINE_END;
                        s.pos = iseg.pos;
                        outputSegments.push_back(s);
                    }

                    {
                        ClipSegment s;
                        s.type = ClipSegmentType::LINE_BEGIN;
                        s.pos = iseg.pos;
                        outputSegments.push_back(s);
                    }

                    prevLinePos = iseg.pos;
                }
                else
                {
                    ClipSegment s;
                    s.type = ClipSegmentType::POINT;
                    s.pos = iseg.pos;
                    outputSegments.push_back(s);
                }
            }
            else if (iseg.type == ClipSegmentType::LINE_BEGIN)
            {
                inside = !inside;

                if (prevLinePos.has_value())
                {
                    if (inside)
                    {
                        {
                            ClipSegment s;
                            s.type = ClipSegmentType::LINE_END;
                            s.pos = iseg.pos;
                            outputSegments.push_back(s);
                        }

                        {
                            ClipSegment s;
                            s.type = ClipSegmentType::LINE_BEGIN;
                            s.pos = iseg.pos;
                            outputSegments.push_back(s);
                        }

                        prevLinePos = iseg.pos;
                    }
                    else
                    {
                        ClipSegment s;
                        s.type = ClipSegmentType::LINE_END;
                        s.pos = iseg.pos;
                        outputSegments.push_back(s);

                        prevLinePos = std::nullopt;
                    }
                }
                else
                {
                    if (inside)
                    {
                        ClipSegment s;
                        s.type = ClipSegmentType::LINE_BEGIN;
                        s.pos = iseg.pos;
                        outputSegments.push_back(s);

                        prevLinePos = iseg.pos;
                    }
                    else
                    {
                        printf("bad line begin!\n");
                    }
                }
            }
            else if (iseg.type == ClipSegmentType::LINE_END)
            {
                if (inside)
                {
                    ClipSegment s;
                    s.type = ClipSegmentType::LINE_END;
                    s.pos = iseg.pos;
                    outputSegments.push_back(s);

                    prevLinePos = std::nullopt;
                }
                else
                {
                    ClipSegment s;
                    s.type = ClipSegmentType::LINE_BEGIN;
                    s.pos = iseg.pos;
                    outputSegments.push_back(s);

                    prevLinePos = iseg.pos;
                }
                inside = !inside;
            }
        }

        return outputSegments;
    }

    static std::vector<ClipSegment> ClipToLine(const Polygon3D& source, const Polygon3D& target, const glm::dvec3& linePos, const glm::dvec3& lineDir)
    {
        std::vector<ClipSegment> contourClipSegments;

        for (auto& contour : source.contours)
        {
            if (CSG_DEBUG_OUTPUT)
            {
                source.Print(L"poly.html");
            }

            std::vector<double> distances(contour.size());

            for (size_t cpi = 0; cpi < contour.size(); cpi++)
            {
                const auto& pt3D = source.sourcePoints[contour[cpi]];

                bool side = glm::dot(pt3D - linePos, target.plane.norm) >= 0;

                distances[cpi] = DistanceToLine(pt3D, linePos, lineDir) * (side ? 1 : -1);
            }

            auto segs = LineDistancesToClipSegments(source.meshIndex, 
                                                    source.index, 
                                                    distances, 
                                                    contour, 
                                                    source.sourcePoints,
                                                    linePos,
                                                    lineDir);

            for (auto& s : segs)
            {
                contourClipSegments.push_back(s);
            }
        }

        return MergeClipSegments(contourClipSegments);
    }

    static void ClipToClip2D(const glm::dvec2& projStart, const glm::dvec2& projDir, const std::vector<ClipSegment>& intersect, std::vector<ClipSegment2D>& segs)
    {
        glm::dvec2 prevLineBegin;
        for (auto& clip1D : intersect)
        {
            auto pos2D = projStart + projDir * clip1D.pos;
            
            if (clip1D.type == ClipSegmentType::LINE_BEGIN)
            {
                prevLineBegin = pos2D;
            }
            else if (clip1D.type == ClipSegmentType::LINE_END)
            {
                ClipSegment2D clip2d;
                clip2d.type = ClipSegment2DType::LINE;
                clip2d.pos = prevLineBegin;
                clip2d.pos2 = pos2D;
                segs.push_back(clip2d);
            }
            else if (clip1D.type == ClipSegmentType::POINT)
            {
                ClipSegment2D clip2d;
                clip2d.type = ClipSegment2DType::POINT;
                clip2d.pos = pos2D;
                segs.push_back(clip2d);
            }
        }
    }

    static void NonCoplanarPolygonIntersect(const Polygon3D& poly1, const Polygon3D& poly2, std::vector<ClipSegment2D>& segmentsA, std::vector<ClipSegment2D>& segmentsB)
    {
        // calculate shared line
        // https://stackoverflow.com/questions/6408670/line-of-intersection-between-two-planes
        glm::dvec3 lineDir = glm::cross(poly1.plane.norm, poly2.plane.norm);
        double det = glm::length(lineDir);

       // double det2 = glm::determinant(glm::dmat3(poly1.plane.norm, poly2.plane.norm, lineDir));
        det *= det;
        glm::dvec3 linePos((glm::cross(lineDir, poly2.plane.norm) * -poly1.plane.d +
                           glm::cross(poly1.plane.norm, lineDir) * -poly2.plane.d) / det);

        lineDir = glm::normalize(lineDir);

        // shared line L at: [linePos + t * lineDir]
        auto clipLine1 = ClipToLine(poly1, poly2, linePos, lineDir);
        auto clipLine2 = ClipToLine(poly2, poly1, linePos, lineDir);

        // intersect the clipLines
        auto intersect = IntersectClipSegments(clipLine1, clipLine2);

        // figure out line pos + dir in respective polygon space
        auto lineStart = linePos;
        auto lineEnd = linePos + lineDir;

        auto projAStart = poly1.Project2D(lineStart);
        auto projAEnd = poly1.Project2D(lineEnd);
        auto projADir = (projAEnd - projAStart);

        auto projBStart = poly2.Project2D(lineStart);
        auto projBEnd = poly2.Project2D(lineEnd);
        auto projBDir = (projBEnd - projBStart);

        // reproject and add to original polys
        ClipToClip2D(projAStart, projADir, intersect, segmentsA);
        ClipToClip2D(projBStart, projBDir, intersect, segmentsB);
    }

    static void DumpPolygonWithClipsegments(const Polygon3D& poly, const std::vector<ClipSegment2D>& segments, const std::wstring& filename)
    {
        std::vector<std::vector<glm::dvec2>> vecs;

        poly.GetExportableEdges(vecs);

        for (auto& clip : segments)
        {
            if (clip.type == ClipSegment2DType::LINE)
            {
                vecs.push_back({ clip.pos, clip.pos2 });
            }
            else if (clip.type == ClipSegment2DType::POINT)
            {
                //vecs.push_back({ clip.pos });
            }
        }

        DumpSVGLines(vecs, filename);
    }

    static BrepMesh ComputeNewBrepMesh(const BrepMesh& mesh, const std::vector<std::vector<ClipSegment2D>>& clipSegments)
    {
        BrepMesh newMesh;

        for (auto& poly : mesh.polygons)
        {
            Polygon3D newPolygon;

            newPolygon.meshIndex = poly.meshIndex;
            newPolygon.index = poly.index;

            // copy the basis, we need it to convert back to 3D during tesselation
            newPolygon.a = poly.a;
            newPolygon.b = poly.b;
            newPolygon.c = poly.c;

            // add original contours
            for (auto& contour : poly.contours)
            {
                for (size_t i = 0; i < contour.size(); i++)
                {
                    size_t cs = contour[i];
                    size_t ce = contour[(i + 1) % contour.size()];

                    auto& ps = poly.points[cs];
                    auto& pe = poly.points[ce];

                    newPolygon.AddEdge(ps, pe);
                }
            }

            auto& segs = clipSegments[poly.index];

            // add new lines
            for (auto& seg : segs)
            {
                if (CSG_DEBUG_OUTPUT)
                {
                    newPolygon.PrintEdges(L"polies2.html");
                }

                if (seg.type == ClipSegment2DType::LINE)
                {
                    newPolygon.AddEdge(seg.pos, seg.pos2, true);
                }
                else if (seg.type == ClipSegment2DType::POINT)
                {
                    newPolygon.AddPoint(seg.pos, true);
                }
            }

            newMesh.polygons.push_back(std::move(newPolygon));
        }

        return newMesh;
    }

    static void IntersectBRepMeshes(const BrepMesh& mesh1, const BrepMesh& mesh2, IfcGeometry& outputMesh1, IfcGeometry& outputMesh2)
    {
        std::vector<std::vector<ClipSegment2D>> segments1(mesh1.polygons.size());
        std::vector<std::vector<ClipSegment2D>> segments2(mesh2.polygons.size());

        // compute the intersections
        for (auto& poly1 : mesh1.polygons)
        {
            for (auto& poly2 : mesh2.polygons)
            {
                if (CSG_DEBUG_OUTPUT)
                {
                    auto geom = poly1.ToGeom();
                    DumpIfcGeometry(geom, L"poly1.obj");
                    geom = poly2.ToGeom();
                    DumpIfcGeometry(geom, L"poly2.obj");
                }

                if (poly1.plane.IsCoplanarWith(poly2.plane, EPS_SMALL))
                {
                    // coplanar! figure out all coplanar intersections
                    CoplanarPolygonIntersect(poly1, poly2);
                }
                else if (equals(poly1.plane.norm, poly2.plane.norm, EPS_SMALL) || equals(poly1.plane.norm, -poly2.plane.norm, EPS_SMALL))
                {
                    // parallel, non intersecting, ignore
                }
                else
                {
                    // intersecting planes!
                    NonCoplanarPolygonIntersect(poly1, poly2, segments1[poly1.index], segments2[poly2.index]);
                }
            }
        }

        if (CSG_DEBUG_OUTPUT)
        {
            // print polies
            for (auto& poly1 : mesh1.polygons)
            {
                auto& segs = segments1[poly1.index];
                if (!segs.empty())
                {
                    DumpPolygonWithClipsegments(poly1, segs, L"polies.html");
                }
            }
        }

        // resolve polygon intersections
        BrepMesh newMesh1 = ComputeNewBrepMesh(mesh1, segments1);
        BrepMesh newMesh2 = ComputeNewBrepMesh(mesh2, segments2);

        // compute new contours
        for (auto& poly1 : newMesh1.polygons)
        {
            if (CSG_DEBUG_OUTPUT)
            {
                poly1.PrintEdges(L"polies.html");
            }
            // TODO: true based on SUBTRACT, does not apply to any bool op!
            poly1.Retriangulate(outputMesh1, true);
        }

        for (auto& poly2 : newMesh2.polygons)
        {
            if (CSG_DEBUG_OUTPUT)
            {
                poly2.PrintEdges(L"polies.html");
            }
            // TODO: false based on SUBTRACT, does not apply to any bool op!
            poly2.Retriangulate(outputMesh2, false);
        }
    }

    static void intersectMeshMesh(const IfcGeometry& mesh1, const IfcGeometry& mesh2, IfcGeometry& result1, IfcGeometry& result2, BVH& bvh1, BVH& bvh2)
    {
        auto brep1 = MeshToBReps(mesh1, 0);
        auto brep2 = MeshToBReps(mesh2, 1);

        IntersectBRepMeshes(brep1, brep2, result1, result2);

        bvh1 = MakeBVH(mesh1);
        bvh2 = MakeBVH(mesh2);

        return;

        //static int NUM_CHECKS = 0;
        MeshIntersections meshIntersections1;
        MeshIntersections meshIntersections2;

        bvh1 = MakeBVH(mesh1);
        bvh2 = MakeBVH(mesh2);

        bvh1.Intersect(bvh2, [&](uint32_t i, uint32_t j)
                       {
                           Face t1 = mesh1.GetFace(i);
                           Face t2 = mesh2.GetFace(j);

                           const glm::dvec3& a = mesh1.GetPoint(t1.i0);
                           const glm::dvec3& b = mesh1.GetPoint(t1.i1);
                           const glm::dvec3& c = mesh1.GetPoint(t1.i2);

                           const glm::dvec3& d = mesh2.GetPoint(t2.i0);
                           const glm::dvec3& e = mesh2.GetPoint(t2.i1);
                           const glm::dvec3& f = mesh2.GetPoint(t2.i2);

                           glm::dvec3 nabc = computeNormal(a, b, c);
                           glm::dvec3 ndef = computeNormal(d, e, f);

                           std::vector<TriTriResult> intersectionLines;

                           double dot = glm::dot(nabc, ndef);
                           if (glm::abs(dot) - 1 < EPS_SMALL && glm::abs(dot) - 1 > -EPS_SMALL)
                           {
                               /*
                               // project abc and def to 2D, taking abc as unit triangle
                               glm::dvec2 pabc[3];
                               pabc[0] = ToBary(a, b, c, a);
                               pabc[1] = ToBary(a, b, c, b);
                               pabc[2] = ToBary(a, b, c, c);

                               glm::dvec2 pdef[3];
                               pdef[0] = ToBary(a, b, c, d);
                               pdef[1] = ToBary(a, b, c, e);
                               pdef[2] = ToBary(a, b, c, f);

                               // figure out intersections in 2D
                               std::vector<glm::dvec2> intersections;

                               for (int i = 0; i < 3; i++)
                               {
                                   for (int j = 0; j < 3; j++)
                                   {
                                       glm::dvec2 pabc1 = pabc[i];
                                       glm::dvec2 pabc2 = pabc[(i + 1) % 2];

                                       glm::dvec2 pdef1 = pdef[j];
                                       glm::dvec2 pdef2 = pdef[(j + 1) % 2];

                                       double t = 0;
                                       doLineSegmentsIntersect(pabc1, pabc2, pdef1, pdef2, EPS_SMALL, t);
                                   }
                               }
                               */
                           }
                           else
                           {
                               //NUM_CHECKS++;

                               // 2, 3
                               //if (j == 2 && ndef == glm::dvec3(0, -1, 0) && nabc == glm::dvec3(0, 0, -1))
                               {
                                   intersectionLines.push_back(intersect_triangle_triangle(a, b, c, d, e, f));
                               }

                           }

                           for (const auto& intersectionLine : intersectionLines)
                           {
                               if (intersectionLine.hasIntersection)
                               {
                                   meshIntersections1[i].push_back(MeshIntersection{
                                       intersectionLine,
                                       j
                                                                   });

                                   meshIntersections2[j].push_back(MeshIntersection{
                                       intersectionLine,
                                       i
                                                                   });
                               }
                           }
                       });

        IfcGeometry m1;
        IfcGeometry m2;

        for (auto& i : meshIntersections1)
        {
            if (!i.second.empty())
            {
                Face f = mesh1.GetFace(i.first);
                m1.AddFace(mesh1.GetPoint(f.i0), mesh1.GetPoint(f.i1), mesh1.GetPoint(f.i2));
            }
        }

        for (auto& i : meshIntersections2)
        {
            if (!i.second.empty())
            {
                Face f = mesh2.GetFace(i.first);
                m2.AddFace(mesh2.GetPoint(f.i0), mesh2.GetPoint(f.i1), mesh2.GetPoint(f.i2));
            }
        }

        DumpIfcGeometry(m1, L"mesh1ints.obj");
        DumpIfcGeometry(m2, L"mesh2ints.obj");

        result1 = retriangulateMesh(mesh1, meshIntersections1);
        result2 = retriangulateMesh(mesh2, meshIntersections2);
    }
}