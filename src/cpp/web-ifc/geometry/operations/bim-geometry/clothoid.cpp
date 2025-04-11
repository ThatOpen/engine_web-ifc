#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "clothoid.h"
#include "utils.h"
#include "epsilons.h"

namespace bimGeometry
{
    void Clothoid::SetValues(uint16_t _segments, double startPointX, double startPointY, double startPointZ, double _ifcStartDirection, double _StartRadiusOfCurvature, double _EndRadiusOfCurvature, double _SegmentLength) {
        segments = _segments;
        startPoint = glm::dvec3(startPointX, startPointY, startPointZ);
        ifcStartDirection = _ifcStartDirection;
        StartRadiusOfCurvature = _StartRadiusOfCurvature;
        EndRadiusOfCurvature = _EndRadiusOfCurvature;
        SegmentLength = _SegmentLength;
    }

    Buffers Clothoid::GetBuffers()
    {
        Buffers buffers;

        points.clear();

        std::vector<glm::dvec2> points2D = bimGeometry::SolveClothoid(segments, startPoint, ifcStartDirection, StartRadiusOfCurvature, EndRadiusOfCurvature, SegmentLength);
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