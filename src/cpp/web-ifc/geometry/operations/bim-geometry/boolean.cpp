#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "boolean.h"
#include "epsilons.h"
#include "geometry.h"
#include "utils.h"
#include "booleanUtils.h"

using Vec = glm::dvec3;

namespace bimGeometry {

    Buffers Boolean::GetBuffers()
    {
        Buffers buffers;

        Geometry geom = BoolProcess(geometry, seconds, op);

        for (int r = 0; r < geom.numFaces; r++)
        {
            bimGeometry::Face f = geom.GetFace(r);
            buffers.AddTri(geom.GetPoint(f.i0), geom.GetPoint(f.i1),  geom.GetPoint(f.i2));
        }

        return buffers;
    }

    void Boolean::SetValues(std::vector<double> triangles_, std::string op_) {
        op = op_;
        geometry = Geometry();
        for (size_t i = 0; i + 8 < triangles_.size(); i += 9) {
            geometry.AddFace(
                glm::dvec3(triangles_[i], triangles_[i + 1], triangles_[i + 2]),
                glm::dvec3(triangles_[i + 3], triangles_[i + 4], triangles_[i + 5]),
                glm::dvec3(triangles_[i + 6], triangles_[i + 7], triangles_[i + 8])
            );
        }
        geometry.buildPlanes();
    }

    void Boolean::SetSecond(std::vector<double> triangles_) {
        Geometry newGeometry = Geometry();
        for (size_t i = 0; i + 8 < triangles_.size(); i += 9) {
            newGeometry.AddFace(
                glm::dvec3(triangles_[i], triangles_[i + 1], triangles_[i + 2]),
                glm::dvec3(triangles_[i + 3], triangles_[i + 4], triangles_[i + 5]),
                glm::dvec3(triangles_[i + 6], triangles_[i + 7], triangles_[i + 8])
            );
        }
        newGeometry.buildPlanes();
        seconds.push_back(newGeometry);
    }

    void Boolean::clear()
    {
        geometry = Geometry();
        seconds.clear();
        op = "";
    }
}
