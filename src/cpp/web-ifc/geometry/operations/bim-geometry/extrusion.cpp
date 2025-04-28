#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "extrusion.h"
#include "epsilons.h"
#include "geometry.h"
#include "utils.h"

using Vec = glm::dvec3;

namespace bimGeometry {

    Buffers Extrusion::GetBuffers()
    {
        Buffers buffers;

        Geometry geom = Extrude(profile, dir, len);

        for (int r = 0; r < geom.numFaces; r++)
        {
            bimGeometry::Face f = geom.GetFace(r);
            buffers.AddTri(geom.GetPoint(f.i0), geom.GetPoint(f.i1),  geom.GetPoint(f.i2));
        }

        return buffers;
    }

    void Extrusion::SetValues(std::vector<double> profile_, std::vector<double> dir_, double len_) {
        profile.clear();
        for (size_t i = 0; i + 2 < profile_.size(); i += 3) {
            profile.emplace_back(profile_[i], profile_[i + 1], profile_[i + 2]);
        }
        if (dir_.size() == 3) {
            dir = glm::dvec3(dir_[0], dir_[1], dir_[2]);
        }
        len = len_;
    }
}
