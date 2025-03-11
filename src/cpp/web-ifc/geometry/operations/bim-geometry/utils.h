#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "geometry.h"
#include "epsilons.h"

#pragma once

#define CONST_PI 3.141592653589793238462643383279502884L

namespace bimGeometry
{
	constexpr int VERTEX_FORMAT_SIZE_FLOATS = 6;

    inline double cross2d(const glm::dvec2 &point1, const glm::dvec2 &point2)
	{
		return point1.x * point2.y - point1.y * point2.x;
	}

    inline	bool equals(glm::dvec3 A, glm::dvec3 B, double eps = 0)
    {
        return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps && std::fabs(A.z - B.z) <= eps;
    }

    inline double areaOfTriangle(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
	{
		glm::dvec3 ab = b - a;
		glm::dvec3 ac = c - a;

		glm::dvec3 norm = glm::cross(ab, ac);
		return glm::length(norm) / 2;
	}

    inline double areaOfTriangle2D(glm::dvec2 a, glm::dvec2 b, glm::dvec2 c)
	{
		glm::dvec2 ab = b - a;
		glm::dvec2 ac = c - a;

		double norm = cross2d(ab, ac) / 2;
		return std::fabs(norm);
	}

	inline bool computeSafeNormal(const glm::dvec3 v1, const glm::dvec3 v2, const glm::dvec3 v3, glm::dvec3 &normal, double eps = 0)
	{
		glm::dvec3 v12(v2 - v1);
		glm::dvec3 v13(v3 - v1);

		glm::dvec3 norm = glm::cross(v12, v13);

		double len = glm::length(norm);

		if (len <= eps)
		{
			return false;
		}

		normal = norm / len;

		return true;
	}

	inline double VectorToAngle(double x, double y)
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

	inline Geometry Revolve(glm::dmat4 transform, std::vector<std::vector<glm::dvec3>> boundingGroups, int numRots, int radius)
	{
		Geometry geometry;

		glm::dvec3 cent = transform[3];
		glm::dvec3 vecX = glm::normalize(transform[0]);
		glm::dvec3 vecY = glm::normalize(transform[1]);
		glm::dvec3 vecZ = glm::normalize(transform[2]);

		std::vector<std::vector<glm::dvec3>> newPoints;
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

		for (int r = 0; r < numRots; r++)
		{
			std::vector<glm::dvec3> newList;
			newPoints.push_back(newList);
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

		// Then we find the angular difference
		if (angleVec.size() == 0) return geometry;
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
		double startRad = startDegrees / 180 * CONST_PI;
		double endRad = endDegrees / 180 * CONST_PI;
		double radSpan = endRad - startRad;
		double radStep = radSpan / (numRots - 1);

		for (int r = 0; r < numRots; r++)
		{
			double angle = startRad + r * radStep;
			double dtempX = sin(angle) * radius;
			double dtempY = cos(angle) * radius;
			double newPx = dtempX * vecX.x + dtempY * vecY.x + minZ * vecZ.x + cent.x;
			double newPy = dtempX * vecX.y + dtempY * vecY.y + minZ * vecZ.y + cent.y;
			double newPz = dtempX * vecX.z + dtempY * vecY.z + minZ * vecZ.z + cent.z;
			glm::dvec3 newPt = glm::dvec3(
				newPx,
				newPy,
				newPz);
			newPoints[r].push_back(newPt);
		}
		for (int r = 0; r < numRots; r++)
		{
			double angle = startRad + r * radStep;
			double dtempX = sin(angle) * radius;
			double dtempY = cos(angle) * radius;
			double newPx = dtempX * vecX.x + dtempY * vecY.x + maxZ * vecZ.x + cent.x;
			double newPy = dtempX * vecX.y + dtempY * vecY.y + maxZ * vecZ.y + cent.y;
			double newPz = dtempX * vecX.z + dtempY * vecY.z + maxZ * vecZ.z + cent.z;
			glm::dvec3 newPt = glm::dvec3(
				newPx,
				newPy,
				newPz);
			newPoints[r].push_back(newPt);
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

		return geometry;
	}

	inline std::vector<glm::dvec2> SolveParabola(uint16_t segments,glm::dvec2 startPoint, double HorizontalLength, double StartHeight, double StartGradient, double EndGradient)
	{
		std::vector<glm::dvec2> points;

		double R = HorizontalLength / (EndGradient - StartGradient);

        for (double i = 0; i <= segments; i++)
        {
          double pr = i / segments;
          double grad = ((HorizontalLength * pr) / R) + StartGradient;
          double alt = (HorizontalLength * pr * (grad + StartGradient) * 0.5) + StartHeight;
          points.push_back(glm::dvec2(HorizontalLength * pr, alt));
        }

		return points;
	}

	inline std::vector<glm::dvec2> SolveClothoid(uint16_t segments, glm::dvec2 startPoint, double ifcStartDirection, double StartRadiusOfCurvature, double EndRadiusOfCurvature, double SegmentLength)
	{
		std::vector<glm::dvec2> points;

		bool inverse = false;
        if (abs(StartRadiusOfCurvature) > abs(EndRadiusOfCurvature))
        {
          inverse = true;
        }

        double A = sqrt(abs(EndRadiusOfCurvature - StartRadiusOfCurvature) * SegmentLength);
        double Api = A * sqrt(CONST_PI);
        double uMax = SegmentLength / Api;

        double s = A * uMax * sqrt(CONST_PI);
        double radFin = (A * A * A) / (A * s);

        double vSin = 0;
        double vCos = 0;

        glm::dvec2 DirectionX(
            glm::cos(ifcStartDirection),
            glm::sin(ifcStartDirection));
        glm::dvec2 DirectionY(
            -glm::sin(ifcStartDirection),
            glm::cos(ifcStartDirection));

        if (EndRadiusOfCurvature < 0 || StartRadiusOfCurvature < 0)
        {
          DirectionY.x = -DirectionY.x;
          DirectionY.y = -DirectionY.y;
        }

        if (inverse)
        {
          DirectionX.x = -DirectionX.x;
          DirectionX.y = -DirectionX.y;
        }

        double def = segments;
        double dif = def / 10;
        double count = 0;
        double tram = uMax / def;
        glm::dvec2 end(0, 0);
        glm::dvec2 prev(0, 0);
        glm::dvec2 endDir;
        for (double c = 1; c < def + 1; c++)
        {
          prev = end;
          end = startPoint + Api * (DirectionX * vCos + DirectionY * vSin);
          if (c == def || c == 1 || count >= dif)
          {
            points.push_back(end);
            count = 0;
          }
          if (c == def)
          {
            endDir = prev - end;
          }
          double val = c * tram;
          vSin += sin(CONST_PI * ((A * val * val) / (2 * abs(A)))) * tram;
          vCos += cos(CONST_PI * ((A * val * val) / (2 * abs(A)))) * tram;
          count++;
        }

        if (inverse)
        {
          DirectionX.x = -DirectionX.x;
          DirectionX.y = -DirectionX.y;

          glm::dvec2 newDirectionX(
              endDir.x,
              endDir.y);
          glm::dvec2 newDirectionY(
              -endDir.y,
              endDir.x);

          if (EndRadiusOfCurvature < 0 || StartRadiusOfCurvature < 0)
          {
            newDirectionY.x = -newDirectionY.x;
            newDirectionY.y = -newDirectionY.y;
          }

          newDirectionX = glm::normalize(newDirectionX);
          newDirectionY = glm::normalize(newDirectionY);

          for (uint32_t i = 0; i < points.size(); i++)
          {
            double xx = points[i].x - end.x;
            double yy = points[i].y - end.y;
            double dx = xx * newDirectionX.x + yy * newDirectionX.y;
            double dy = xx * newDirectionY.x + yy * newDirectionY.y;
            double newDx = startPoint.x + DirectionX.x * dx + DirectionY.x * dy;
            double newDy = startPoint.y + DirectionX.y * dx + DirectionY.y * dy;
            points[i].x = newDx;
            points[i].y = newDy;
          }
        }

		return points;
	}

	inline bimGeometry::Geometry Extrude(std::vector<glm::dvec3> &points, glm::dvec3 &dir, double len)
    {
		bimGeometry::Geometry geom;

        for (size_t j = 0; j < points.size() - 1; j++)
        {
            int j2 = j + 1;

            double npx = points[j].x + dir.x * len;
            double npy = points[j].y + dir.y * len;
            double npz = dir.z * len;
            glm::dvec3 nptj1 = glm::dvec3(
                npx,
                npy,
                npz);
            npx = points[j2].x + dir.x * len;
            npy = points[j2].y + dir.y * len;
            npz = dir.z * len;
            glm::dvec3 nptj2 = glm::dvec3(
                npx,
                npy,
                npz);
            geom.AddFace(
                glm::dvec3(points[j].x, points[j].y, 0),
                glm::dvec3(points[j2].x, points[j2].y, 0),
                nptj1);
			geom.AddFace(
                glm::dvec3(points[j2].x, points[j2].y, 0),
                nptj2,
                nptj1);
        }
		return geom;
    }
}