#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "geometry.h"
#include "epsilons.h"
#include "curve.h"

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

	inline bool MatrixFlipsTriangles(const glm::dmat3 &mat)
	{
		return glm::determinant(mat) < 0;
	}

	inline std::vector<glm::dvec3> Convert2DAlignmentsTo3D(
		const std::vector<glm::dvec3>& horizontal,
		const std::vector<glm::dvec3>& vertical) {
		
		std::vector<glm::dvec3> curve3D;
		
		if (horizontal.empty() || vertical.empty()) {
			return curve3D; // Return empty if no valid alignment
		}
		
		double length = 0.0;
		double lastX = horizontal[0].x;
		double lastY = horizontal[0].y;
		
		for (const auto& ptH : horizontal) {
			double dx = ptH.x - lastX;
			double dy = ptH.y - lastY;
			length += std::sqrt(dx * dx + dy * dy);
			lastX = ptH.x;
			lastY = ptH.y;
			
			double altitude = 0.0;
			double lastAlt = vertical[0].y;
			double lastVx = vertical[0].x;
			bool found = false;
			
			for (size_t i = 1; i < vertical.size(); ++i) {
				const auto& ptV = vertical[i];
				if (ptV.x >= length) {
					double ratio = (length - lastVx) / (ptV.x - lastVx);
					altitude = lastAlt * (1.0 - ratio) + ptV.y * ratio;
					found = true;
					break;
				}
				lastAlt = ptV.y;
				lastVx = ptV.x;
			}
			
			if (!found) {
				altitude = vertical.back().y; // If length exceeds vertical range, use last known altitude
			}
			
			curve3D.emplace_back(ptH.x, altitude, -ptH.y);
		}
		
		return curve3D;
	}

	inline Curve GetEllipseCurve(float radiusX, float radiusY, int numSegments, glm::dmat3 placement = glm::dmat3(1), double startRad = 0, double endRad = CONST_PI * 2, bool swap = true, bool normalToCenterEnding = false)
	{
		Curve c;
		if(normalToCenterEnding)
		{
			double sweep_angle = (endRad - startRad);

			double step = sweep_angle / (numSegments - 1);

			if(endRad > startRad)
			{
				startRad -= step /2;
				endRad += step /2;
			}
			if(endRad <= startRad)
			{
				startRad += step /2;
				endRad -= step /2;
			}

			for (int i = 0; i < numSegments; i++)
			{
				double ratio = static_cast<double>(i) / (numSegments - 1);
				double angle = startRad + ratio * (endRad - startRad);

				glm::dvec2 circleCoordinate;
				if (swap)
				{
					circleCoordinate = glm::dvec2(
						radiusX * std::cos(angle),
						radiusY * std::sin(angle));
				}
				else
				{
					circleCoordinate = glm::dvec2(
						radiusX * std::sin(angle),
						radiusY * std::cos(angle));
				}
				glm::dvec2 pos = placement * glm::dvec3(circleCoordinate, 1);
				c.points.push_back(glm::dvec3(pos,0));
			}

			c.points[0] = (c.points[0] + c.points[1]) * 0.5;

			c.points[c.points.size() - 1] = (c.points[c.points.size() - 1] + c.points[c.points.size() - 2]) * 0.5;

			// check for a closed curve
			if (endRad == CONST_PI * 2 && startRad == 0)
			{
				c.points.push_back(c.points[0]);

				if (MatrixFlipsTriangles(placement))
				{
					c.Invert();
				}
			}
		}
		else
		{
			for (int i = 0; i < numSegments; i++)
			{
				double ratio = static_cast<double>(i) / (numSegments - 1);
				double angle = startRad + ratio * (endRad - startRad);

				glm::dvec2 circleCoordinate;
				if (swap)
				{
					circleCoordinate = glm::dvec2(
						radiusX * std::cos(angle),
						radiusY * std::sin(angle));
				}
				else
				{
					circleCoordinate = glm::dvec2(
						radiusX * std::sin(angle),
						radiusY * std::cos(angle));
				}
				glm::dvec2 pos = placement * glm::dvec3(circleCoordinate, 1);
				c.points.push_back(glm::dvec3(pos,0));
			}

			// check for a closed curve
			if (endRad == CONST_PI * 2 && startRad == 0)
			{
				c.points.push_back(c.points[0]);

				if (MatrixFlipsTriangles(placement))
				{
					c.Invert();
				}
			}
		}
		return c;
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

	inline glm::dvec3 projectOntoPlane(const glm::dvec3 &origin, const glm::dvec3 &normal, const glm::dvec3 &point, const glm::dvec3 &dir)
	{
		// project {et} onto the plane, following the extrusion normal
		double ldotn = glm::dot(dir, normal);
		if (ldotn == 0)
		{
			return glm::dvec3(0);
		}
		else
		{
			glm::dvec3 dpos = origin - glm::dvec3(point);
			double dist = glm::dot(dpos, normal) / ldotn;
			return point + dist * dir;
		}
	}

	inline bool GetWindingOfTriangle(const glm::dvec3 &a, const glm::dvec3 &b, const glm::dvec3 &c)
	{
		glm::dvec3 v12(b - a);
		glm::dvec3 v13(c - a);

		glm::dvec3 norm = glm::normalize(glm::cross(v12, v13));
		return glm::dot(norm, glm::dvec3(0, 0, 1)) > 0.0;
	}

	//! This implementation generates much more vertices than needed, and does not have smoothed normals
	// TODO: Review rotate90 value, as it should be inferred from IFC but the source data had not been identified yet
	// An arbitrary value has been added in IFCSURFACECURVESWEPTAREASOLID but this is a bad solution
	inline	Geometry Sweep(const double scaling, const bool closed, const std::vector<glm::dvec3> &profilePoints, const Curve &directrix, const glm::dvec3 &initialDirectrixNormal = glm::dvec3(0), const bool rotate90 = false, const bool optimize = true)
	{
		Geometry geom;

		std::vector<glm::vec<3, glm::f64>> dpts;

		// Remove repeated points
		for (size_t i = 0; i < directrix.points.size(); i++)
		{
			if (i < directrix.points.size() - 1)
			{
				if (glm::distance(directrix.points[i], directrix.points[i + 1]) > EPS_BIG2 * scaling || !optimize)
				{
					dpts.push_back(directrix.points[i]);
				}
			}
			else
			{
				dpts.push_back(directrix.points[i]);
			}
		}

		if (closed)
		{
			glm::vec<3, glm::f64> dirStart = dpts[dpts.size() - 2] - dpts[dpts.size() - 1];
			glm::vec<3, glm::f64> dirEnd = dpts[1] - dpts[0];
			std::vector<glm::vec<3, glm::f64>> newDpts;
			newDpts.push_back(dpts[0] + dirStart);
			for (size_t i = 0; i < dpts.size(); i++)
			{
				newDpts.push_back(dpts[i]);
			}
			newDpts.push_back(dpts[dpts.size() - 1] + dirEnd);
			dpts = newDpts;
		}

		if (dpts.size() <= 1)
		{
				// nothing to sweep
			return geom;
		}

			// compute curve for each part of the directrix
		std::vector<Curve> curves;
		std::vector<glm::dmat4> transforms;

		for (size_t i = 0; i < dpts.size(); i++)
		{
			Curve segmentForCurve;

			glm::dvec3 planeNormal;
			glm::dvec3 directrixSegmentNormal;
			glm::dvec3 planeOrigin;

			if (i == 0) // start
			{
				planeNormal = glm::normalize(dpts[1] - dpts[0]);
				directrixSegmentNormal = planeNormal;
				planeOrigin = dpts[0];
			}
			else if (i == dpts.size() - 1) // end
			{
				planeNormal = glm::normalize(dpts[i] - dpts[i - 1]);
				directrixSegmentNormal = planeNormal;
				planeOrigin = dpts[i];
			}
			else // middle
			{
				// possibly the directrix is bad
				glm::dvec3 n1 = glm::normalize(dpts[i] - dpts[i - 1]);
				glm::dvec3 n2 = glm::normalize(dpts[i + 1] - dpts[i]);
				glm::dvec3 p = glm::normalize(glm::cross(n1, n2));

				// double prod = glm::dot(n1, n2);

				if (std::isnan(p.x))
				{
					// TODO: sometimes outliers cause the perp to become NaN!
					// this is bad news, as it nans the points added to the final mesh
					// also, it's hard to bail out now :/
					// see curve.add() for more info on how this is currently "solved"
				}

				glm::dvec3 u1 = glm::normalize(glm::cross(n1, p));
				glm::dvec3 u2 = glm::normalize(glm::cross(n2, p));

				// TODO: When n1 and n2 have similar direction but opposite side...
				// ... projection tend to infinity. -> glm::dot(n1, n2)
				// I implemented a bad solution to prevent projection to infinity
				if (glm::dot(n1, n2) < -0.9)
				{
					n2 = -n2;
					u2 = -u2;
				}

				glm::dvec3 au = glm::normalize(u1 + u2);
				planeNormal = glm::normalize(glm::cross(au, p));
				directrixSegmentNormal = n1; // n1 or n2 doesn't matter

				planeOrigin = dpts[i];
			}

			if (curves.empty())
			{
				// construct initial curve
				glm::dvec3 left;
				glm::dvec3 right;
				if (initialDirectrixNormal == glm::dvec3(0))
				{
					left = glm::cross(directrixSegmentNormal, glm::dvec3(directrixSegmentNormal.y, directrixSegmentNormal.x, directrixSegmentNormal.z));
					if (left == glm::dvec3(0, 0, 0))
					{
						left = glm::cross(directrixSegmentNormal, glm::dvec3(directrixSegmentNormal.x, directrixSegmentNormal.z, directrixSegmentNormal.y));
					}
					if (left == glm::dvec3(0, 0, 0))
					{
						left = glm::cross(directrixSegmentNormal, glm::dvec3(directrixSegmentNormal.z, directrixSegmentNormal.y, directrixSegmentNormal.x));
					}
					right = glm::normalize(glm::cross(directrixSegmentNormal, left));
					left = glm::normalize(glm::cross(directrixSegmentNormal, right));
				}
				else
				{
					left = glm::cross(directrixSegmentNormal, initialDirectrixNormal);
					glm::dvec3 side = glm::normalize(initialDirectrixNormal);
					right = glm::normalize(glm::cross(directrixSegmentNormal, left));
					left = glm::normalize(glm::cross(directrixSegmentNormal, right));
					right *= side;
				}

				// project profile onto planeNormal, place on planeOrigin
				// TODO: look at holes
				auto &ppts = profilePoints;
				for (auto &pt2D : ppts)
				{				
					glm::dvec3 pt = -pt2D.x * left + -pt2D.y * right + planeOrigin;
					if(rotate90)
					{
						pt = -pt2D.x * right - pt2D.y * left + planeOrigin;
					}
					glm::dvec3 proj = bimGeometry::projectOntoPlane(planeOrigin, planeNormal, pt, directrixSegmentNormal);
					
					segmentForCurve.Add(proj);
				}
			}
			else
			{
				// project previous curve onto the normal
				const Curve &prevCurve = curves.back();

				auto &ppts = prevCurve.points;
				for (auto &pt : ppts)
				{
					glm::dvec3 proj = bimGeometry::projectOntoPlane(planeOrigin, planeNormal, pt, directrixSegmentNormal);

					segmentForCurve.Add(proj);
				}
			}

			if (!closed || (i != 0 && i != dpts.size() - 1))
			{
				curves.push_back(segmentForCurve);
			}
		}

		if (closed)
		{
			dpts.pop_back();
			dpts.erase(dpts.begin());
		}

		// connect the curves
		for (size_t i = 1; i < dpts.size(); i++)
		{
			glm::dvec3 p1 = dpts[i - 1];
			glm::dvec3 p2 = dpts[i];

			const auto &c1 = curves[i - 1].points;
			const auto &c2 = curves[i].points;

			uint32_t capSize = c1.size();
			for (size_t j = 1; j < capSize; j++)
			{
				glm::dvec3 bl = c1[j - 1];
				glm::dvec3 br = c1[j - 0];

				glm::dvec3 tl = c2[j - 1];
				glm::dvec3 tr = c2[j - 0];

				geom.AddFace(tl, br, bl);
				geom.AddFace(tl, tr, br);
			}	
		}

		return geom;
	}
}