#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "alignment.h"
#include "utils.h"
#include "epsilons.h"

namespace bimGeometry
{
    void Alignment::SetValues(std::vector<double> _horizontal, std::vector<double> _vertical) {
        horizontal.clear();
        for (size_t i = 0; i + 2 < _horizontal.size(); i += 3) {
            horizontal.emplace_back(_horizontal[i], _horizontal[i + 1], _horizontal[i + 2]);
        }
        vertical.clear();
        for (size_t i = 0; i + 2 < _vertical.size(); i += 3) {
            vertical.emplace_back(_vertical[i], _vertical[i + 1], _vertical[i + 2]);
        }
    }

    Buffers Alignment::GetBuffers()
    {
        Buffers buffers;

        points.clear();

        std::vector<glm::dvec3> points3D = bimGeometry::Convert2DAlignmentsTo3D(horizontal, vertical);
        for (size_t i = 0; i < points3D.size(); i++) {
            points.push_back(glm::dvec3(points3D[i].x, points3D[i].y, points3D[i].z));
        }

        for (int r = 0; r < points.size(); r++)
        {
            buffers.AddPoint(points[r]);
        }

        return buffers;
    }
}