#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "sweep.h"
#include "epsilons.h"
#include "geometry.h"
#include "utils.h"

using Vec = glm::dvec3;

namespace bimGeometry {

    Buffers Sweep::GetBuffers()
    {
        Buffers buffers;

        Geometry geom = SweepFunction(scaling, closed, profilePoints, directrix, initialDirectrixNormal, rotate90, optimize);

        for (int r = 0; r < geom.numFaces; r++)
        {
            bimGeometry::Face f = geom.GetFace(r);
            buffers.AddTri(geom.GetPoint(f.i0), geom.GetPoint(f.i1),  geom.GetPoint(f.i2));
        }

        return buffers;
    }

    void Sweep::SetValues(double scaling_, bool closed_, std::vector<double> profilePoints_, std::vector<double> directrix_, 
        std::vector<double> initialDirectrixNormal_, bool rotate90_, bool optimize_) {
        profilePoints.clear();
        for (size_t i = 0; i + 2 < profilePoints_.size(); i += 3) {
            profilePoints.emplace_back(profilePoints_[i], profilePoints_[i + 1], profilePoints_[i + 2]);
        }
        directrix.clear();
        for (size_t i = 0; i + 2 < directrix_.size(); i += 3) {
            directrix.emplace_back(directrix_[i], directrix_[i + 1], directrix_[i + 2]);
        }
        closed = closed_;
        scaling = scaling_;
        if (initialDirectrixNormal_.size() == 3) {
            initialDirectrixNormal = glm::dvec3(initialDirectrixNormal_[0], initialDirectrixNormal_[1], initialDirectrixNormal_[2]);
        }
        rotate90 = rotate90_;
        optimize = optimize_;
    }
}