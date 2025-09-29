
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

// Curve Implementation of a Curve

#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "IfcCurve.h"
namespace webifc::geometry
{


	inline	bool equals(glm::dvec3 A, glm::dvec3 B, double eps = 0)
	{
		return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps && std::fabs(A.z - B.z) <= eps;
	}

	
	glm::dvec2 IfcCurve::Get2d(size_t i) const 
	{
		const glm::dvec3 &ret = points.at(i);
		return { ret.x, ret.y };
	}

	glm::dvec3 IfcCurve::Get3d(size_t i) const
	{
		return points.at(i);
	}

    glm::dmat4 IfcCurve::getPlacementAtDistance(double distance, IfcCurve::CurvePlacementMode mode)
    {
        // Mode-specific constants
        const glm::dvec3 GLOBAL_Z(0.0, 0.0, 1.0);
        const double EPS = 1e-6;

        if (points.empty())
        {
            return glm::dmat4(1.0); // Identity matrix (default orientation at 0,0,0)
        }

        glm::dvec3 pos = (points.size() == 1) ? points[0] : glm::dvec3(0.0);
        glm::dvec3 tan(1.0, 0.0, 0.0); // Initialize tangent to a default value

        // --- Locate Position and Tangent ---
        double totalDistance = 0.0;
        bool found = false;
        for (uint32_t i = 0; i < points.size() - 1; i++)
        {
            double segLength = glm::distance(points[i], points[i + 1]);
            if (segLength < EPS)
                continue;

            totalDistance += segLength;
            if (totalDistance >= distance - EPS)
            {
                // Position interpolation
                double segStartLength = totalDistance - segLength;
                double factor = glm::clamp((distance - segStartLength) / segLength, 0.0, 1.0);
                pos = points[i] * (1.0 - factor) + points[i + 1] * factor;

                // Tangent calculation
                tan = points[i + 1] - points[i];

                found = true;
                break;
            }
        }

        // --- Clamping to End Point ---
        if (!found && points.size() > 1)
        {
            pos = points.back();
            tan = points.back() - points[points.size() - 2];
        }

        // Normalize tangent or use default if zero length
        if (glm::length(tan) > EPS)
        {
            tan = glm::normalize(tan);
        }
        else
        {
            // Use default X-axis tangent if still zero-length
            tan = glm::dvec3(1.0, 0.0, 0.0);
        }

        // --- Compute Local Coordinate System (vx, vy, vz) ---
        glm::dvec3 vx, vy, vz;

        if (mode == CurvePlacementMode::GlobalZAxis)
        {
            // Mode 2: Tangent is Local X, Local Z is Global Z (often for profiles)
            vx = tan;
            vz = GLOBAL_Z;

            // Calculate vy as cross product of local Z and local X
            vy = glm::cross(vz, vx);

            // Handle collinearity (tangent parallel to global Z)
            if (glm::length(vy) < EPS)
            {
                // Use Global Y as fallback for vy
                vy = glm::dvec3(0.0, 1.0, 0.0);
            }

            vy = glm::normalize(vy);

            // Recompute vx to ensure orthonormality (vx = vy x vz)
            vx = glm::normalize(glm::cross(vy, vz));
        }
        else // Default Mode: Frenet-style (Tangent is Local Z), for positioning cross sections along path
        {
            vz = tan;

            // Calculate local X as cross product of local Z and Global Z
            vx = glm::cross( GLOBAL_Z, vz);

            // Handle collinearity (tangent parallel to global Z)
            if (glm::length(vx) < EPS)
            {
                // Use Global X as fallback for vx
                vx = glm::dvec3(1.0, 0.0, 0.0);
            }

            vx = glm::normalize(vx);

            // Calculate vy as cross product of local Z and local X (vy = vz x vx)
            vy = glm::cross(vz, vx);
            vy = glm::normalize(vy);

            // Recompute vx to ensure orthonormality (vx = vy x vz)
            vx = glm::cross(vy, vz);
            vx = glm::normalize(vx);
        }

        return glm::dmat4(
            glm::dvec4(vx, 0),
            glm::dvec4(vy, 0),
            glm::dvec4(vz, 0),
            glm::dvec4(pos, 1));
    }
}