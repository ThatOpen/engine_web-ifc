/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "manifold-booleans.h"

#include <array>
#include <limits>
#include <map>
#include <numeric>
#include <unordered_map>
#include <manifold/manifold.h>
#include <spdlog/spdlog.h>

namespace webifc::geometry
{
namespace
{
    using Index = uint64_t;
    using Edge = std::pair<Index, Index>;
    using Cell = std::array<int64_t, 3>;

    struct CellHash
    {
        size_t operator()(const Cell &cell) const
        {
            size_t h = 0;
            for (auto c : cell) h ^= std::hash<int64_t>{}(c) + 0x9e3779b9 + (h << 6) + (h >> 2);
            return h;
        }
    };

    Edge Undirected(Index a, Index b) { return std::minmax(a, b); }

    // A position can belong to several shells that touch along an edge. Welding
    // coordinates must not choose how their four (or more) incident faces pair.
    // Recover the shells through their unambiguous edges, then give each shell
    // its own vertices. Reject inputs whose topology is still ambiguous.
    bool SeparateTouchingShells(std::vector<glm::dvec3> &vertices, std::vector<Index> &triangles)
    {
        struct Incidence { size_t first = 0, second = 0, count = 0; int balance = 0; };
        std::map<Edge, Incidence> edges;
        for (size_t i = 0; i < triangles.size(); i += 3)
            for (int k = 0; k < 3; ++k)
            {
                const auto a = triangles[i+k], b = triangles[i+(k+1)%3];
                if (a == b) return false;
                auto &edge = edges[Undirected(a,b)];
                if (edge.count == 0) edge.first = i/3;
                else if (edge.count == 1) edge.second = i/3;
                ++edge.count;
                edge.balance += a < b ? 1 : -1;
            }
        bool touching = false;
        for (const auto &[key, edge] : edges)
        {
            if (edge.balance != 0 || edge.count < 2) return false;
            touching = touching || edge.count > 2;
        }
        if (!touching) return true;

        std::vector<size_t> parent(triangles.size()/3);
        std::iota(parent.begin(), parent.end(), 0);
        const auto root = [&](size_t face)
        {
            while (parent[face] != face)
            {
                parent[face] = parent[parent[face]];
                face = parent[face];
            }
            return face;
        };
        for (const auto &[key, edge] : edges)
            if (edge.count == 2) parent[root(edge.second)] = root(edge.first);

        std::map<std::pair<size_t, Index>, Index> copies;
        std::vector<glm::dvec3> separated;
        for (size_t i = 0; i < triangles.size(); ++i)
        {
            const auto key = std::make_pair(root(i/3), triangles[i]);
            auto [it, added] = copies.emplace(key, separated.size());
            if (added) separated.push_back(vertices[triangles[i]]);
            triangles[i] = it->second;
        }
        vertices = std::move(separated);
        edges.clear();
        for (size_t i = 0; i < triangles.size(); i += 3)
            for (int k = 0; k < 3; ++k)
            {
                const auto a = triangles[i+k], b = triangles[i+(k+1)%3];
                auto &edge = edges[Undirected(a,b)];
                ++edge.count;
                edge.balance += a < b ? 1 : -1;
            }
        return std::all_of(edges.begin(), edges.end(), [](const auto &item)
        { return item.second.count == 2 && item.second.balance == 0; });
    }

    manifold::Manifold ImportSolid(const IfcGeometry &geometry, double precision)
    {
        std::vector<glm::dvec3> vertices;
        std::vector<std::array<Index, 3>> triangles;
        std::vector<Index> indices(geometry.numPoints);
        double magnitude = 1;
        for (uint32_t i = 0; i < geometry.numPoints; ++i)
        {
            auto p = glm::abs(geometry.GetPoint(i));
            magnitude = std::max({magnitude, p.x, p.y, p.z});
        }
        // Recover copies of a vertex without fitting or displacing entire faces.
        const double tolerance = std::max({precision, bimGeometry::SNAP_WELD_DISTANCE,
            128 * std::numeric_limits<double>::epsilon() * magnitude});
        std::unordered_map<Cell, std::vector<Index>, CellHash> grid;
        for (uint32_t i = 0; i < geometry.numPoints; ++i)
        {
            const auto p = geometry.GetPoint(i);
            if (!std::isfinite(p.x) || !std::isfinite(p.y) || !std::isfinite(p.z))
                return manifold::Manifold(manifold::MeshGL64{});
            const Cell cell = {static_cast<int64_t>(std::floor(p.x / tolerance)),
                static_cast<int64_t>(std::floor(p.y / tolerance)), static_cast<int64_t>(std::floor(p.z / tolerance))};
            Index id = vertices.size();
            for (int x = -1; x <= 1 && id == vertices.size(); ++x)
            for (int y = -1; y <= 1 && id == vertices.size(); ++y)
            for (int z = -1; z <= 1 && id == vertices.size(); ++z)
            {
                const auto found = grid.find({cell[0]+x, cell[1]+y, cell[2]+z});
                if (found == grid.end()) continue;
                for (auto candidate : found->second)
                    if (glm::distance(vertices[candidate], p) <= tolerance) { id = candidate; break; }
            }
            if (id == vertices.size())
            {
                vertices.push_back(p);
                grid[cell].push_back(id);
            }
            indices[i] = id;
        }
        std::map<Edge, uint32_t> edgeCounts;
        for (uint32_t i = 0; i < geometry.numFaces; ++i)
        {
            const auto f = geometry.GetFace(i);
            const std::array<Index, 3> tri = {indices[f.i0], indices[f.i1], indices[f.i2]};
            if (tri[0] == tri[1] || tri[1] == tri[2] || tri[2] == tri[0]) continue;
            triangles.push_back(tri);
            for (int k = 0; k < 3; ++k) ++edgeCounts[Undirected(tri[k],tri[(k+1)%3])];
        }

        // IFC faces can share an edge with different subdivisions. Split only the
        // unpaired edges at existing vertices, so both sides use the same topology.
        std::array<std::vector<Index>, 3> sorted;
        for (int axis = 0; axis < 3; ++axis)
        {
            sorted[axis].resize(vertices.size());
            std::iota(sorted[axis].begin(), sorted[axis].end(), 0);
            std::sort(sorted[axis].begin(), sorted[axis].end(), [&](Index a, Index b)
            { return vertices[a][axis] < vertices[b][axis]; });
        }
        std::map<Edge, std::vector<Index>> subdivisions;
        for (const auto &[edge, count] : edgeCounts)
        {
            if (count != 1) continue;
            const auto a = vertices[edge.first], b = vertices[edge.second], delta = b-a;
            const double length = glm::length(delta);
            if (length <= tolerance) continue;
            const auto direction = delta/length;
            int axis = 0;
            for (int k = 1; k < 3; ++k) if (std::abs(delta[k]) > std::abs(delta[axis])) axis = k;
            const auto &order = sorted[axis];
            const double lo = std::min(a[axis], b[axis])-tolerance, hi = std::max(a[axis], b[axis])+tolerance;
            auto it = std::lower_bound(order.begin(), order.end(), lo,
                [&](Index id, double value) { return vertices[id][axis] < value; });
            std::vector<std::pair<double, Index>> points;
            for (; it != order.end() && vertices[*it][axis] <= hi; ++it)
            {
                if (*it == edge.first || *it == edge.second) continue;
                const auto relative = vertices[*it]-a;
                const double along = glm::dot(relative, direction);
                if (along > tolerance && along < length-tolerance &&
                    glm::length(relative-along*direction) <= tolerance)
                    points.emplace_back(along, *it);
            }
            if (points.empty()) continue;
            std::sort(points.begin(), points.end());
            for (auto [along, id] : points) subdivisions[edge].push_back(id);
        }
        manifold::MeshGL64 mesh;
        mesh.tolerance = precision;
        for (auto tri : triangles)
        {
            std::vector<Index> polygon;
            for (int k = 0; k < 3; ++k)
            {
                const auto a = tri[k], b = tri[(k+1)%3];
                polygon.push_back(a);
                const auto found = subdivisions.find(Undirected(a,b));
                if (found == subdivisions.end()) continue;
                if (a < b) polygon.insert(polygon.end(), found->second.begin(), found->second.end());
                else polygon.insert(polygon.end(), found->second.rbegin(), found->second.rend());
            }
            if (polygon.size() == 3) mesh.triVerts.insert(mesh.triVerts.end(), tri.begin(), tri.end());
            else
            {
                const auto centre = (vertices[tri[0]]+vertices[tri[1]]+vertices[tri[2]])/3.0;
                const Index id = vertices.size();
                vertices.push_back(centre);
                for (size_t k = 0; k < polygon.size(); ++k)
                    mesh.triVerts.insert(mesh.triVerts.end(), {polygon[k], polygon[(k+1)%polygon.size()], id});
            }
        }
        if (!SeparateTouchingShells(vertices, mesh.triVerts))
            return manifold::Manifold(manifold::MeshGL64{});
        double volume6 = 0;
        if (!vertices.empty())
            for (size_t i = 0; i < mesh.triVerts.size(); i += 3)
                volume6 += glm::dot(vertices[mesh.triVerts[i]]-vertices[0],
                    glm::cross(vertices[mesh.triVerts[i+1]]-vertices[0], vertices[mesh.triVerts[i+2]]-vertices[0]));
        if (volume6 < 0)
            for (size_t i = 0; i < mesh.triVerts.size(); i += 3) std::swap(mesh.triVerts[i], mesh.triVerts[i+1]);
        for (auto p : vertices) mesh.vertProperties.insert(mesh.vertProperties.end(), {p.x,p.y,p.z});
        auto solid = manifold::Manifold(mesh);
        if (solid.Status() != manifold::Manifold::Error::NoError) return solid;
        double area = 0;
        for (size_t i = 0; i < mesh.triVerts.size(); i += 3)
            area += glm::length(glm::cross(vertices[mesh.triVerts[i+1]]-vertices[mesh.triVerts[i]],
                vertices[mesh.triVerts[i+2]]-vertices[mesh.triVerts[i]]))/2;
        // Import may repair topology internally. It must not change the solid's
        // volume beyond displacement of its boundary within the input precision.
        if (std::abs(solid.Volume()-std::abs(volume6)/6) > tolerance*(area+solid.SurfaceArea()))
            return manifold::Manifold(manifold::MeshGL64{});
        return solid;
    }
}

    bool TryManifoldBoolean(const IfcGeometry &first, const std::vector<IfcGeometry> &cutters,
        const std::string &operation, IfcGeometry &result, double tolerance)
    {
        try
        {
            if (first.halfSpace || first.numFaces == 0 || cutters.empty()) return false;
            if (!std::isfinite(tolerance) || tolerance < 0) return false;
            if (operation != "DIFFERENCE" && operation != "UNION") return false;
            for (const auto &cutter : cutters) if (cutter.halfSpace || cutter.numFaces == 0) return false;
            auto solid = ImportSolid(first, tolerance);
            if (solid.Status() != manifold::Manifold::Error::NoError || solid.IsEmpty()) return false;
            for (const auto &cutter : cutters)
            {
                auto operand = ImportSolid(cutter, tolerance);
                if (operand.Status() != manifold::Manifold::Error::NoError || operand.IsEmpty())
                {
                    spdlog::debug("[Manifold] Operand cannot represent a closed oriented solid (status={})", static_cast<int>(operand.Status()));
                    return false;
                }
                solid = operation == "DIFFERENCE" ? solid-operand : solid+operand;
                if (solid.Status() != manifold::Manifold::Error::NoError) return false;
            }
            // Regularize the result at the model's geometric precision. In particular,
            // coincident IFC faces can otherwise leave closed, zero-volume sheets.
            // This preserves manifold topology and uses a distance tolerance, without
            // rejecting faces according to their aspect ratio or tessellation density.
            solid = solid.AsOriginal().Simplify(tolerance);
            if (solid.Status() != manifold::Manifold::Error::NoError) return false;
            const auto mesh = solid.GetMeshGL64();
            if (mesh.NumTri() > std::numeric_limits<uint32_t>::max()/3) return false;
            IfcGeometry output;
            for (size_t i = 0; i < mesh.triVerts.size(); i += 3)
            {
                const auto point = [&](Index index)
                { const auto p = mesh.numProp*index; return glm::dvec3(mesh.vertProperties[p], mesh.vertProperties[p+1], mesh.vertProperties[p+2]); };
                const auto a = point(mesh.triVerts[i]), b = point(mesh.triVerts[i+1]), c = point(mesh.triVerts[i+2]);
                auto normal = glm::cross(b-a,c-a);
                const auto length = glm::length(normal);
                if (length > 0) normal /= length;
                // Keep the topology produced by the solid kernel, including small
                // faces. The point overload of AddFace applies an absolute area filter.
                output.AddPoint(a,normal); output.AddPoint(b,normal); output.AddPoint(c,normal);
                output.AddFace(output.numPoints-3, output.numPoints-2, output.numPoints-1);
            }
            result = std::move(output);
            return true;
        }
        catch (const std::exception &error)
        {
            spdlog::debug("[Manifold] Cannot process solid: {}", error.what());
            return false;
        }
    }
}
