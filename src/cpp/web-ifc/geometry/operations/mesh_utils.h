/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

#pragma once

#include "../nurbs.h"
#include <vector>
#include <array>
#include <unordered_map>
#include <optional>
#include <cstdint>
#include <tinynurbs/tinynurbs.h>
#include <spdlog/spdlog.h>
#include "geometryutils.h"
#include <glm/glm.hpp>

#define CONST_PI 3.141592653589793238462643383279502884L

namespace webifc::geometry
{

	// TODO: review and simplify
	inline void TriangulateRevolution(IfcGeometry& geometry, std::vector<IfcBound3D> const& bounds, IfcSurface const& surface, double numRots)
	{
		spdlog::debug("[TriangulateRevolution({})]");
			// First we get the revolution data

		glm::dvec3 cent = surface.RevolutionSurface.Direction[3];
		glm::dvec3 vecX = glm::normalize(surface.RevolutionSurface.Direction[0]);
		glm::dvec3 vecY = glm::normalize(surface.RevolutionSurface.Direction[1]);
		glm::dvec3 vecZ = glm::normalize(surface.RevolutionSurface.Direction[2]);

		std::vector<std::vector<glm::dvec3>> newPoints;

		for (int r = 0; r < numRots; r++)
		{
			std::vector<glm::dvec3> newList;
			newPoints.push_back(newList);
		}

		std::vector<glm::dvec3> bounding;
		std::vector<double> angleVec;
		std::vector<double> angleDsp;

			// Now we construct the bounding box of the boundary ...
			// ... by adding the middle point of all curves

		for (size_t i = 0; i < bounds.size(); i++)
		{
			double xx = 0;
			double yy = 0;
			double zz = 0;
			double cc = 0;
			int lastTeam = bounds[i].curve.indices[0];
			for (size_t j = 0; j < bounds[i].curve.points.size(); j++)
			{
					// If it is the first point of the group we close the previous group ...
					//  ... and create a new one. Else, the point is of the current group
				if (lastTeam != bounds[i].curve.indices[j] || j == (bounds[i].curve.points.size() - 1))
				{
					if (cc > 0)
					{
						xx /= cc;
						yy /= cc;
						zz /= cc;
						bounding.push_back(glm::dvec3(xx, yy, zz));
					}
					xx = bounds[i].curve.points[j].x;
					yy = bounds[i].curve.points[j].y;
					zz = bounds[i].curve.points[j].z;
					cc = 1;

					lastTeam = bounds[i].curve.indices[j];
				}
				else
				{
					xx += bounds[i].curve.points[j].x;
					yy += bounds[i].curve.points[j].y;
					zz += bounds[i].curve.points[j].z;
					cc++;
				}
			}
		}

			// There is a problem when points in the revolution are around 0 degrees
			// Numerical instabilities can make these points to jump from 0 to 360
			// It causes lots of trouble when drawing the boundaries in the revolution

			// The method presented here finds the angle of each point, measures the ...
			//  ... angular difference and then, if the difference is bigger than 180 ...
			//  ... corrects it to a lesser value. Finally it gets the first angle and ...
			//  ... adds the angular differences again, reconstructing a corrected boundary.

			// Now we find the angle of each point in the reference plane of the cylinder
		for (size_t j = 0; j < bounding.size(); j++)
		{
			double xx = bounding[j].x - cent.x;
			double yy = bounding[j].y - cent.y;
			double zz = bounding[j].z - cent.z;
			double dx = vecX.x * xx + vecX.y * yy + vecX.z * zz;
			double dy = vecY.x * xx + vecY.y * yy + vecY.z * zz;
				//				double dz = vecZ.x * xx + vecZ.y * yy + vecZ.z * zz;
			double temp = VectorToAngle(dx, dy);
			while (temp < 0)
			{
				temp += 360;
			}
			while (temp > 360)
			{
				temp -= 360;
			}
			angleVec.push_back(temp);
		}

		for (size_t i = 0; i < angleVec.size() - 1; i++)
		{
			if (angleVec[i] - angleVec[i + 1] > 180)
			{
				angleDsp.push_back(360 - (angleVec[i] - angleVec[i + 1]));
			}
			else if (angleVec[i] - angleVec[i + 1] < -180)
			{
				angleDsp.push_back(-(angleVec[i] - angleVec[i + 1] + 360));
			}
			else
			{
				angleDsp.push_back(angleVec[i + 1] - angleVec[i]);
			}
		}

		double startDegrees = angleVec[0];
		double endDegrees = angleVec[0];

			// Add angular differences starting from the first angle. We also correct the start and end angles

		double temp = angleVec[0];
		for (size_t i = 0; i < angleDsp.size(); i++)
		{
			temp += angleDsp[i];
			if (endDegrees < temp)
			{
				endDegrees = temp;
			}
			if (startDegrees > temp)
			{
				startDegrees = temp;
			}
		}

			// Then we use the start and end angles as bounding boxes of the boundary ...
			//  ... we will represent this bounding box.

		double startRad = startDegrees / 180 * CONST_PI;
		double endRad = endDegrees / 180 * CONST_PI;
		double radSpan = endRad - startRad;
		double radStep = radSpan / (numRots - 1);

		for (size_t i = 0; i < surface.RevolutionSurface.Profile.curve.points.size(); i++)
		{
			double xx = surface.RevolutionSurface.Profile.curve.points[i].x - cent.x;
			double yy = surface.RevolutionSurface.Profile.curve.points[i].y - cent.y;
			double zz = surface.RevolutionSurface.Profile.curve.points[i].z - cent.z;

			double dx = vecX.x * xx + vecX.y * yy + vecX.z * zz;
			double dy = vecY.x * xx + vecY.y * yy + vecY.z * zz;
			double dz = vecZ.x * xx + vecZ.y * yy + vecZ.z * zz;
			double dd = sqrt(dx * dx + dy * dy);
			for (int r = 0; r < numRots; r++)
			{
				double angle = startRad + r * radStep;
				double dtempX = sin(angle) * dd;
				double dtempY = cos(angle) * dd;
				double newPx = dtempX * vecX.x + dtempY * vecY.x + dz * vecZ.x + cent.x;
				double newPy = dtempX * vecX.y + dtempY * vecY.y + dz * vecZ.y + cent.y;
				double newPz = dtempX * vecX.z + dtempY * vecY.z + dz * vecZ.z + cent.z;
				glm::dvec3 newPt = glm::dvec3(
					newPx,
					newPy,
					newPz);
				newPoints[r].push_back(newPt);
			}
		}
		for (int r = 0; r < numRots - 1; r++)
		{
			int r1 = r + 1;
			for (size_t s = 0; s < newPoints[r].size() - 1; s++)
			{
				geometry.AddFace(newPoints[r][s], newPoints[r][s + 1], newPoints[r1][s]);
				geometry.AddFace(newPoints[r1][s], newPoints[r][s + 1], newPoints[r1][s + 1]);
			}
		}
	}

	// TODO: review and simplify
	inline void TriangulateCylindricalSurface(IfcGeometry &geometry, std::vector<IfcBound3D> const& bounds, IfcSurface const& surface, double numRots)
	{
		spdlog::debug("[TriangulateCylindricalSurface({})]");

		// Find the max. curve index in the boundary
		int maxTeam = 0;
		for (size_t i = 0; i < bounds.size(); i++)
		{
			for (size_t j = 0; j < bounds[i].curve.indices.size(); j++)
			{
				if (bounds[i].curve.indices[j] > maxTeam)
				{
					maxTeam = bounds[i].curve.indices[j];
				}
			}
		}

		// We group each point with their boundary
		std::vector<std::vector<glm::dvec3>> boundingGroups;

		for (int r = 0; r < maxTeam; r++)
		{
			std::vector<glm::dvec3> boundingTemp = std::vector<glm::dvec3>();
			for (size_t i = 0; i < bounds.size(); i++)
			{
				for (size_t j = 0; j < bounds[i].curve.points.size(); j++)
				{
					if (bounds[i].curve.indices[j] == r)
					{
						boundingTemp.push_back(bounds[i].curve.points[j]);
					}
				}
			}
			boundingGroups.push_back(boundingTemp);
		}

		bimGeometry::Geometry geom = bimGeometry::Revolve(
			surface.transformation, 
			boundingGroups,
			numRots, 
			surface.CylinderSurface.Radius);
		
		for (int r = 0; r < geom.numFaces; r++)
		{
		 	bimGeometry::Face f = geom.GetFace(r);
			geometry.AddFace(geom.GetPoint(f.i0), geom.GetPoint(f.i1),  geom.GetPoint(f.i2));
		}
	}

    // TODO: review and simplify
    inline void TriangulateExtrusion(IfcGeometry &geometry, std::vector<IfcBound3D> const& bounds, IfcSurface const& surface)
	{
		spdlog::debug("[TriangulateExtrusion({})]");

		double len = surface.ExtrusionSurface.Length;
		glm::dvec3 dir = surface.ExtrusionSurface.Direction;

		if (!surface.ExtrusionSurface.Profile.isComposite)
		{
			std::vector<glm::dvec3> points = surface.ExtrusionSurface.Profile.curve.points;
			bimGeometry::Geometry geom = bimGeometry::Extrude(points, dir, len);
			for (int r = 0; r < geom.numFaces; r++)
			{
				bimGeometry::Face f = geom.GetFace(r);
				geometry.AddFace(geom.GetPoint(f.i0), geom.GetPoint(f.i1),  geom.GetPoint(f.i2));
			}
		}
		else
		{
			for (size_t i = 0; i < surface.ExtrusionSurface.Profile.profiles.size(); i++)
			{
				std::vector<glm::dvec3> points = surface.ExtrusionSurface.Profile.profiles[i].curve.points;
                bimGeometry::Geometry geom = bimGeometry::Extrude(points, dir, len);
				for (int r = 0; r < geom.numFaces; r++)
				{
					bimGeometry::Face f = geom.GetFace(r);
					geometry.AddFace(geom.GetPoint(f.i0), geom.GetPoint(f.i1),  geom.GetPoint(f.i2));
				}
            }
		}
    }

    inline void TriangulateBspline(IfcGeometry &geometry, std::vector<IfcBound3D> const& bounds, IfcSurface const& surface, double const scaling)
	{
		spdlog::debug("[TriangulateBspline({})]");
		Nurbs nurbs{geometry, bounds, surface, scaling};
		nurbs.fill_geometry();
	}
}