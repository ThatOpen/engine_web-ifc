#pragma once

#include <vector>
#include <glm/glm.hpp>

#include "aabb.h"
#include "geometry.h"

namespace fuzzybools
{
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
        AABB box;
        std::vector<AABB> boxes;
        std::vector<BVHNode> nodes;
        Geometry const* ptr;

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

    static BVH MakeBVH(const Geometry& mesh)
    {
        BVH bvh;
        bvh.ptr = &mesh;
        bvh.boxes = std::vector<AABB>(mesh.numFaces);
        for (uint32_t i = 0; i < mesh.numFaces; i++)
        {
            bvh.boxes[i] = mesh.GetFaceBox(i);
            bvh.box.merge(bvh.boxes[i]);
        }

        int offset = 0;
        // start BVH at Y axis
        MakeBVH(bvh.boxes, bvh.nodes, 0, static_cast<int>(bvh.boxes.size()), 1, 0, offset);

        return bvh;
    }
}
