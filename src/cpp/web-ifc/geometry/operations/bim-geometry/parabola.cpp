#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "parabola.h"
#include "utils.h"
#include "epsilons.h"

namespace bimGeometry
{
    void Parabola::SetValues(uint16_t _segments,  double startPointX, double startPointY, double startPointZ, double _HorizontalLength, double _StartHeight, double _StartGradient, double _EndGradient) {
        segments = _segments;
        startPoint = glm::dvec3(startPointX, startPointY, startPointZ);
        HorizontalLength = _HorizontalLength;
        StartHeight = _StartHeight;
        StartGradient = _StartGradient;
        EndGradient = _EndGradient;
    }

    Buffers Parabola::GetBuffers()
    {
        Buffers buffers;

        points.clear();

        std::vector<glm::dvec2> points2D = bimGeometry::SolveParabola(segments, startPoint, HorizontalLength, StartHeight, StartGradient, EndGradient);
        for (size_t i = 0; i < points2D.size(); i++) {
            points.push_back(glm::dvec3(points2D[i].x, points2D[i].y, 0));
        }

        for (int r = 0; r < points.size(); r++)
        {
            buffers.AddPoint(points[r]);
        }

        return buffers;
    }
}