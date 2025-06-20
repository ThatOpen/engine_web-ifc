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

        Geometry geom;
        if(!cap)
        {
            geom = Extrude(profile, dir, len);
        }
        else
        {   
            uint32_t profileNumber = 1 + holes.size();
            std::vector<std::vector<glm::dvec3>> profiles(profileNumber);

            for (size_t i = 0; i < profile.size(); i++) {
                profiles[0].emplace_back(profile[i].x, profile[i].y, profile[i].z);
            }
            
            for (size_t i = 0; i < holes.size(); i++) {
                for (size_t j = 0; j < holes[i].size(); j++) {
                    profiles[i + 1].emplace_back(holes[i][j].x, holes[i][j].y, holes[i][j].z);
                }
            }

            geom = Extrude(profiles, dir, len, cuttingPlaneNormal, cuttingPlanePos);
        }

        for (int r = 0; r < geom.numFaces; r++)
        {
            bimGeometry::Face f = geom.GetFace(r);
            buffers.AddTri(geom.GetPoint(f.i0), geom.GetPoint(f.i1),  geom.GetPoint(f.i2));
        }

        return buffers;
    }

    void Extrusion::SetValues(std::vector<double> profile_, std::vector<double> dir_, double len_, std::vector<double> cuttingPlaneNormal_, std::vector<double> cuttingPlanePos_, bool cap_) {
        profile.clear();
        for (size_t i = 0; i + 2 < profile_.size(); i += 3) {
            profile.emplace_back(profile_[i], profile_[i + 1], profile_[i + 2]);
        }
        if (dir_.size() == 3) {
            dir = glm::dvec3(dir_[0], dir_[1], dir_[2]);
        }
        len = len_;
        cap = cap_;
        cuttingPlanePos = glm::dvec3(cuttingPlanePos_[0], cuttingPlanePos_[1], cuttingPlanePos_[2]);
        cuttingPlaneNormal = glm::dvec3(cuttingPlaneNormal_[0], cuttingPlaneNormal_[1], cuttingPlaneNormal_[2]);
    }

    void Extrusion::SetHoles(std::vector<double> hole_) {
        std::vector<glm::dvec3> hole;
        for (size_t i = 0; i + 2 < hole_.size(); i += 3) {
            hole.emplace_back(hole_[i], hole_[i + 1], hole_[i + 2]);
        }
        holes.push_back(hole);
    }

    void Extrusion::ClearHoles() {
        holes.clear();
    }
}
