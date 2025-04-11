#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "arc.h"
#include "utils.h"
#include "epsilons.h"

namespace bimGeometry
{
    void Arc::SetValues(float _radiusX, float _radiusY, int _numSegments, std::vector<double> _placement, double _startRad, double _endRad, bool _swap, bool _normalToCenterEnding) {
        radiusX = _radiusX;
        radiusY = _radiusY;
        numSegments = _numSegments;
        startRad = _startRad;
        endRad = _endRad;
        swap = _swap;
        normalToCenterEnding = _normalToCenterEnding;

        if (_placement.size() != 9) {
            placement = glm::dmat3(1);
        }
    
        placement = glm::dmat3(
            _placement[0], _placement[1], _placement[2],
            _placement[3], _placement[4], _placement[5],
            _placement[6], _placement[7], _placement[8]
        );
    }

    Buffers Arc::GetBuffers()
    {
        Buffers buffers;

        points.clear();

        std::vector<glm::dvec3> points = (bimGeometry::GetEllipseCurve(radiusX, radiusY, numSegments, placement, startRad, endRad, swap, normalToCenterEnding)).points;
        for (int r = 0; r < points.size(); r++)
        {
            buffers.AddPoint(points[r]);
        }

        return buffers;
    }
}