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

	// TODO: This function is wrong, but changing it breaks many models #172 -> 15.ifc, should be reviewed
	inline double VectorToAngle3D(double x, double y)
	{
		double dd = sqrt(x * x + y * y);
		if (std::abs(dd) < EPS_MINISCULE) {
			return 0;
		}
		double xx = x / dd;
		double yy = y / dd;

		double angle = asin(xx);
		double cosv = cos(angle);

		if (glm::abs(yy - cosv) > 1e-5)
		{
			angle = acos(yy);
			double sinv = sin(angle);
			cosv = cos(angle);
			if (glm::abs(yy - cosv) > 1e-5 || glm::abs(xx - sinv) > 1e-5)
			{
				angle = angle + (CONST_PI - angle) * 2;
				sinv = sin(angle);
				cosv = cos(angle);
				if (glm::abs(yy - cosv) > 1e-5 || glm::abs(xx - sinv) > 1e-5)
				{
					angle = angle + CONST_PI;
				}
			}
		}

		return (angle / (2 * CONST_PI)) * 360;
	}

	// TODO: review and simplify
	inline void TriangulateRevolution(IfcGeometry& geometry, std::vector<IfcBound3D> const& bounds, IfcSurface const& surface, double numRots)
	{
		spdlog::debug("[TriangulateRevolution({})]");
			// First we get the revolution data

		glm::dmat4 transform;
		transform[3] = surface.RevolutionSurface.Direction[3];
		transform[0] = glm::normalize(surface.RevolutionSurface.Direction[0]);
		transform[1] = glm::normalize(surface.RevolutionSurface.Direction[1]);
		transform[2] = glm::normalize(surface.RevolutionSurface.Direction[2]);

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

		for (int r = 0; r <= maxTeam; r++)
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

		std::vector<glm::dvec3> bounding;
		std::vector<double> angleVec;
		std::vector<double> angleDsp;

		// Now we construct the bounding box of the boundary ...
		// ... by adding the middle point of all curves

		for (size_t i = 0; i < boundingGroups.size(); i++)
		{
			double xx = 0;
			double yy = 0;
			double zz = 0;
			double cc = 0;
			for (size_t j = 0; j < boundingGroups[i].size(); j++)
			{
				// If it is the first point of the group we close the previous group ...
				//  ... and create a new one. Else, the point is of the current group
				if (j == boundingGroups[i].size() - 1)
				{
					if (cc > 0)
					{
						xx /= cc;
						yy /= cc;
						zz /= cc;
						bounding.push_back(glm::dvec3(xx, yy, zz));
					}
					xx = boundingGroups[i][j].x;
					yy = boundingGroups[i][j].y;
					zz = boundingGroups[i][j].z;
					cc = 1;
				}
				else
				{
					xx += boundingGroups[i][j].x;
					yy += boundingGroups[i][j].y;
					zz += boundingGroups[i][j].z;
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
			double xx = bounding[j].x - transform[3].x;
			double yy = bounding[j].y - transform[3].y;
			double zz = bounding[j].z - transform[3].z;
			double dx = transform[0].x * xx + transform[0].y * yy + transform[0].z * zz;
			double dy = transform[1].x * xx + transform[1].y * yy + transform[1].z * zz;
				//				double dz = vecZ.x * xx + vecZ.y * yy + vecZ.z * zz;
			double temp = VectorToAngle3D(dx, dy);
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

		// Canviar i passar la funció de calcular els angles inicial i final aqui de manera que sigui més simple.

		bimGeometry::Geometry geom = bimGeometry::Revolution(
			transform, 
			startDegrees,
			endDegrees,
			surface.RevolutionSurface.Profile.curve.points,
			numRots
			);
		
		for (int r = 0; r < geom.numFaces; r++)
		{
		 	bimGeometry::Face f = geom.GetFace(r);
			geometry.AddFace(geom.GetPoint(f.i0), geom.GetPoint(f.i1),  geom.GetPoint(f.i2));
		}
	}

	// TODO: review and simplify
	inline void TriangulateCylindricalSurface(IfcGeometry &geometry, std::vector<IfcBound3D> const& bounds, IfcSurface const& surface, double numRots)
	{
		spdlog::debug("[TriangulateCylindricalSurface({})]");

		glm::dvec3 cent = surface.transformation[3];
		glm::dvec3 vecX = glm::normalize(surface.transformation[0]);
		glm::dvec3 vecY = glm::normalize(surface.transformation[1]);
		glm::dvec3 vecZ = glm::normalize(surface.transformation[2]);

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

		for (int r = 0; r <= maxTeam; r++)
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

		std::vector<double> angleVec;
		std::vector<double> angleDsp;

		double minZ = 1e+10;
		double maxZ = -1e+10;

		// Find the relative coordinates of each curve point in the cylinder reference plane
		// Only retain the max and min relative Z

		for (size_t i = 0; i < boundingGroups.size(); i++)
		{
			for (size_t j = 0; j < boundingGroups[i].size(); j++)
			{
				glm::dvec3 vv = boundingGroups[i][j] - cent;
				double dz = glm::dot(vecZ, vv);
				if (maxZ < dz)
				{
					maxZ = dz;
				}
				if (minZ > dz)
				{
					minZ = dz;
				}
			}
		}

		// First we get the cylinder data
		std::vector<glm::dvec3> bounding;
		int repeats = 0;
		bool start = false;
		size_t id = 0;

		// In the case of boundary lines having only 2 endings...
		//... we omit these lines and add solely curves having > 2 points...
		//... starting from a 2 point line, by doing it this way we don't have repeated points

		while (repeats < boundingGroups.size() * 3)
		{
			if (id >= boundingGroups.size())
			{
				id = 0;
			}
			if (boundingGroups[id].size() < 3)
			{
				if (!start)
				{
					start = true;
				}
				else
				{
					break;
				}
			}
			if (boundingGroups[id].size() > 2 && start)
			{
				for (size_t i = 0; i < boundingGroups[id].size(); i++)
				{
					bounding.push_back(boundingGroups[id][i]);
				}
			}
			id++;
			repeats++;
		}

		// If the previous method finds nothing, then we don't have straight lines ...
		//... then we add all boundary points directly
		if (bounding.size() == 0)
		{
			for (size_t j = 0; j < boundingGroups.size(); j++)
			{
				for (size_t i = 0; i < boundingGroups[j].size(); i++)
				{
					bounding.push_back(boundingGroups[j][i]);
				}
			}
		}

		double startDegrees = 0;
		double endDegrees = 360;

		// Now we project the points in the cylinder surface
		// There is a problem when points in the cylinder are around 0 degrees
		// Numerical instabilities can make these points to jump from 0 to 360
		// It causes lots of trouble when drawing the boundaries in the cylinder

		// The method presented here finds the angle of each point, measures the ...
		//  ... angular difference and then, if the difference is bigger than 180 ...
		//  ... corrects it to a lesser value. Finally it gets the first angle and ...
		//  ... adds the angular differences again, reconstructing a corrected boundary.

		// Now we find the angle of each point in the reference plane of the cylinder

		for (size_t j = 0; j < bounding.size(); j++)
		{
			glm::dvec3 vv = bounding[j] - cent;
			double dx = glm::dot(vecX, vv);
			double dy = glm::dot(vecY, vv);
				// double dz = glm::dot(vecZ, vv);
			double temp = VectorToAngle3D(dx, dy);
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

		// Then we find the angular difference
		if (angleVec.size() == 0) return;

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

		startDegrees = angleVec[0];
		endDegrees = angleVec[0];

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

		while (startDegrees < -360)
		{
			startDegrees += 360;
		}

		bimGeometry::Geometry geom = bimGeometry::RevolveCylinder(
			surface.transformation, 
			startDegrees,
			endDegrees,
			minZ,
			maxZ,
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

	// TODO: sent to bimGeometry
    inline void TriangulateBspline(IfcGeometry &geometry, std::vector<IfcBound3D> const& bounds, IfcSurface const& surface, double const scaling)
	{
		spdlog::debug("[TriangulateBspline({})]");
		Nurbs nurbs{geometry, bounds, surface, scaling};
		nurbs.fill_geometry();
	}
}