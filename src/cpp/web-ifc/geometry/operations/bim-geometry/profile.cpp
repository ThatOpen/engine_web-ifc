#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "profile.h"
#include "utils.h"
#include "epsilons.h"

namespace bimGeometry
{
    void Profile::SetValues(uint16_t _pType, double _width, double _depth, double _webThickness, double _flangeThickness, bool _hasFillet, double _filletRadius, double _radius, double _slope, uint16_t _numSegments, std::vector<double> _placement) {
        pType = _pType;
        width = _width;
        depth = _depth;
        thickness = _webThickness;
        flangeThickness = _flangeThickness;
        hasFillet = _hasFillet;
        filletRadius = _filletRadius;
        radius = _radius;
        slope = _slope;
        numSegments = _numSegments;
        placement = _placement;
    }

    Buffers Profile::GetBuffers()
    {
        Buffers buffers;
        glm::dmat4 _placement = glm::dmat4(glm::dvec4(placement[0],placement[1],placement[2], placement[3]),
                                            glm::dvec4(placement[4],placement[5],placement[6], placement[7]),
                                            glm::dvec4(placement[8],placement[9],placement[10], placement[11]),
                                            glm::dvec4(placement[12],placement[13],placement[14], placement[15]));

        if(pType == 0)
        {
            profile = bimGeometry::GetIShapedCurve(width, depth, thickness, flangeThickness, hasFillet, filletRadius, _placement);
        }
        if(pType == 1)
        {
            profile = bimGeometry::GetCShapedCurve(width, depth, thickness, flangeThickness, hasFillet, filletRadius, _placement);
        }
        if(pType == 2)
        {
            profile = bimGeometry::GetZShapedCurve(width, depth, thickness, flangeThickness, hasFillet, filletRadius, _placement);
        }
        if(pType == 3)
        {
            profile = bimGeometry::GetTShapedCurve(width, depth, thickness, hasFillet, filletRadius, radius, slope, _placement);
        }
        if(pType == 4)
        {
            profile = bimGeometry::GetLShapedCurve(width, depth, thickness, hasFillet, filletRadius, radius, slope, numSegments, _placement);
        }
        if(pType == 5)
        {
            profile = bimGeometry::GetUShapedCurve(width, depth, thickness, flangeThickness, filletRadius, radius, slope, _placement);
        }


        for (int r = 0; r <  profile.points.size(); r++)
        {
            buffers.AddPoint( profile.points[r]);
        }

        return buffers;
    }
}