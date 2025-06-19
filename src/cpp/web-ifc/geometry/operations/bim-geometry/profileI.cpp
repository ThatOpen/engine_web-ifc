#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "profileI.h"
#include "utils.h"
#include "epsilons.h"

namespace bimGeometry
{
    void ProfileI::SetValues(double _width, double _depth, double _webThickness, double _flangeThickness, bool _hasFillet, double _filletRadius, std::vector<double> _placement) {
        width = _width;
        depth = _depth;
        webThickness = _webThickness;
        flangeThickness = _flangeThickness;
        hasFillet = _hasFillet;
        filletRadius = _filletRadius;
        placement = _placement;
    }

    Buffers ProfileI::GetBuffers()
    {
        Buffers buffers;
        glm::dmat4 _placement = glm::dmat4(glm::dvec4(placement[0],placement[1],placement[2], 1),
                                            glm::dvec4(placement[3],placement[4],placement[5], 1),
                                            glm::dvec4(placement[6],placement[7],placement[8], 1),
                                            glm::dvec4(placement[9],placement[10],placement[11], 1));
        profile = bimGeometry::GetIShapedCurve(width, depth, webThickness, flangeThickness, hasFillet, filletRadius, _placement);

        for (int r = 0; r <  profile.points.size(); r++)
        {
            buffers.AddPoint( profile.points[r]);
        }

        return buffers;
    }
}