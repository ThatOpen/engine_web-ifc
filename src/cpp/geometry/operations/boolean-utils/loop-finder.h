#pragma once

#include <vector>
#include <set>
#include <unordered_map>
#include <optional>

#include "math.h"
#include "aabb.h"

namespace fuzzybools
{
    struct Loop
    {
        std::vector<size_t> loop;

        bool HasPoint(size_t p)
        {
            for (size_t i = 0; i < loop.size(); i++)
            {
                if (loop[i] == p)
                {
                    return true;
                }
            }

            return false;
        }
    };

    // assume points vector is non overlapping, assume id is not in loop
    inline bool IsPointInsideLoop(const std::vector<glm::dvec2>& points, Loop& loop, glm::dvec2 pt)
    {
        glm::dvec2 line(10000, 0);

        std::vector<double> distances;

        for (size_t i = 0; i < loop.loop.size(); i++)
        {
            size_t prev = loop.loop[i];
            size_t cur = loop.loop[(i + 1) % loop.loop.size()];

            glm::dvec2 a = points[prev];
            glm::dvec2 b = points[cur];

            glm::dvec2 dir = glm::normalize(a - b);

            bool colinear = std::fabs(glm::dot(dir, line)) > (1 - EPS_BIG);

            if (colinear) continue;

            auto result = doLineSegmentsIntersect(pt, pt + line, a, b, EPS_BIG);

            if (result.isect)
            {
                distances.push_back(result.dist);
            }
        }

        std::sort(distances.begin(), distances.end(), [&](double a, double b) {
            return a > b;
            });

        size_t count = 0;
        double cur = -1;
        for (size_t i = 0; i < distances.size(); i++)
        {
            if (std::fabs(distances[i] - cur) > EPS_BIG)
            {
                count++;
            }
            cur = distances[i];
        }

        return count % 2 == 1;
    }


    inline bool AInsideB(const std::vector<glm::dvec2>& points, Loop& A, Loop& B)
    {
        std::optional<size_t> nonSharedPoint; // point of A not in B

        for (size_t i = 0; i < A.loop.size(); i++)
        {
            if (!B.HasPoint(A.loop[i]))
            {
                nonSharedPoint = A.loop[i];
            }
        }

        // all points of A are on B, A is inside of B, if B has some # points, they are equal
        if (!nonSharedPoint.has_value())
        {
            return true;
        }
        auto pt = points[*nonSharedPoint];

        // found point index that is in A but not in B
        return IsPointInsideLoop(points, B, pt);
    }


    inline Loop FindOuterLoop(const std::vector<glm::dvec2>& points, const std::set<std::pair<size_t, size_t>>& edges, bool forward)
    {
        Loop result;

        std::unordered_map<size_t, std::set<size_t>> connections;

        for (auto& edge : edges)
        {
            connections[edge.first].insert(edge.second);
            connections[edge.second].insert(edge.first);
        }

        // keep walking right, if we find a ccw loop, we're good. If its not ccw, we invert current/prev
        size_t cur = edges.begin()->first;
        size_t prev = edges.begin()->second;
        if (forward)
        {
            std::swap(cur, prev);
        }
        size_t start = prev;

        std::vector<size_t> loop;
        std::vector<bool> visited(points.size());

        while (true)
        {
            if (visited[cur])
            {
                if (messages) { printf("Loop in findLoop ... how ironic \n"); }
                return {};
            }

            visited[cur] = true;
            loop.push_back(cur);
            if (cur == start)
            {
                // end of loop
                break;
            }

            // TODO: copy
            std::set<size_t> nbs = connections[cur];

            nbs.erase(prev);
            nbs.erase(cur);

            if (nbs.empty())
            {
                // broken poly
                if (messages) {  printf("Found vert without neighbours other than the origin of this search!\n"); }
                loop.clear();
                return result;
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

        result.loop = loop;

        return result;
    }

    inline Loop FindLargestEdgeLoop(const std::vector<glm::dvec2>& points, const std::set<std::pair<size_t, size_t>>& edges)
    {
        auto l1 = FindOuterLoop(points, edges, false);
        auto l2 = FindOuterLoop(points, edges, true);

        if (AInsideB(points, l1, l2))
        {
            return l2;
        }
        else
        {
            return l1;
        }
    }
}
