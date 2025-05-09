#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "revolution.h"
#include "epsilons.h"
#include "geometry.h"
#include "utils.h"

using Vec = glm::dvec3;

namespace bimGeometry {

    Buffers Revolve::GetBuffers()
    {
        Buffers buffers;

        // Canviar la funcio revolution
        Geometry geom = Revolution(transform, startDegrees, endDegrees, profile, numRots);

        for (int r = 0; r < geom.numFaces; r++)
        {
            bimGeometry::Face f = geom.GetFace(r);
            buffers.AddTri(geom.GetPoint(f.i0), geom.GetPoint(f.i1),  geom.GetPoint(f.i2));
        }

        return buffers;
    }

    void Revolve::SetValues(std::vector<double> profile_, std::vector<double> transform_, double startDegrees_, double endDegrees_, uint32_t numRots_) {
        numRots = numRots_;
        profile.clear();
        for (size_t i = 0; i + 2 < profile_.size(); i += 3) {
            profile.emplace_back(profile_[i], profile_[i + 1], profile_[i + 2]);
        }
        if (transform_.size() == 16) {
            transform = glm::dmat4(transform_[0], transform_[1], transform_[2], transform_[3], 
                transform_[4], transform_[5], transform_[6], transform_[7], 
                transform_[8], transform_[9], transform_[10], transform_[11],
                transform_[12], transform_[13], transform_[14], transform_[15]);
        }
        startDegrees = startDegrees_;
        endDegrees = endDegrees_;
    }
}
