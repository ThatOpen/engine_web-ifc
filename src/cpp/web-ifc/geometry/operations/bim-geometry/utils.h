#include <array>
#include <vector>
#include <algorithm>
#include <glm/glm.hpp>
#include "geometry.h"
#include "epsilons.h"
#include "curve.h"
#include <mapbox/earcut.hpp>

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

	inline bool GetWindingOfTriangle(const glm::dvec3 &a, const glm::dvec3 &b, const glm::dvec3 &c)
	{
		glm::dvec3 v12(b - a);
		glm::dvec3 v13(c - a);

		glm::dvec3 norm = glm::normalize(glm::cross(v12, v13));
		return glm::dot(norm, glm::dvec3(0, 0, 1)) > 0.0;
	}

	inline Geometry Revolution(glm::dmat4 transform, double startDegrees, double endDegrees, std::vector<glm::dvec3> Profile, double numRots)
	{
		Geometry geometry;	

		glm::dvec3 cent = transform[3];
		glm::dvec3 vecX = glm::normalize(transform[0]);
		glm::dvec3 vecY = glm::normalize(transform[1]);
		glm::dvec3 vecZ = glm::normalize(transform[2]);
		std::vector<std::vector<glm::dvec3>> newPoints;

		for (int r = 0; r < numRots; r++)
		{
			std::vector<glm::dvec3> newList;
			newPoints.push_back(newList);
		}

			// Then we use the start and end angles as bounding boxes of the boundary ...
			//  ... we will represent this bounding box.

		double startRad = startDegrees / 180 * CONST_PI;
		double endRad = endDegrees / 180 * CONST_PI;
		double radSpan = endRad - startRad;
		double radStep = radSpan / (numRots - 1);

		for (size_t i = 0; i < Profile.size(); i++)
		{
			double xx = Profile[i].x - cent.x;
			double yy = Profile[i].y - cent.y;
			double zz = Profile[i].z - cent.z;

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
			if (r1 >= newPoints.size()) {
				break;
			}
			const std::vector<glm::dvec3>& newPointsR = newPoints[r];
			const std::vector<glm::dvec3>& newPointsR1 = newPoints[r1];
			if (newPointsR.size() > 0) {
				for (size_t s = 0; s < newPointsR.size() - 1; s++)
				{
					if (s + 1 >= newPointsR.size()) {
						break;
					}
					if (s + 1 >= newPointsR1.size()) {
						break;
					}
					geometry.AddFace(newPointsR[s], newPointsR[s + 1], newPointsR1[s]);
					geometry.AddFace(newPointsR1[s], newPointsR[s + 1], newPointsR1[s + 1]);
				}
			}
		}

		return geometry;
	}


	inline Geometry RevolveCylinder(glm::dmat4 transform, double startDegrees, double endDegrees, double minZ, double maxZ, int numRots, double radius)
	{
		Geometry geometry;

		glm::dvec3 cent = transform[3];
		glm::dvec3 vecX = glm::normalize(transform[0]);
		glm::dvec3 vecY = glm::normalize(transform[1]);
		glm::dvec3 vecZ = glm::normalize(transform[2]);

		std::vector<std::vector<glm::dvec3>> newPoints;
		for (int r = 0; r < numRots; r++)
		{
			std::vector<glm::dvec3> newList;
			newPoints.push_back(newList);
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
            double npz = points[j].z + dir.z * len;
            glm::dvec3 nptj1 = glm::dvec3(
                npx,
                npy,
                npz);
            npx = points[j2].x + dir.x * len;
            npy = points[j2].y + dir.y * len;
            npz = points[j2].z + dir.z * len;
            glm::dvec3 nptj2 = glm::dvec3(
                npx,
                npy,
                npz);
            geom.AddFace(
                glm::dvec3(points[j].x, points[j].y, points[j].z),
                glm::dvec3(points[j2].x, points[j2].y, points[j2].z),
                nptj1);
			geom.AddFace(
                glm::dvec3(points[j2].x, points[j2].y, points[j2].z),
                nptj2,
                nptj1);
        }
		return geom;
    }

	enum class Projection { XY, XZ, YZ };
	using Point = std::array<double, 3>;

	// Projecta el polígon a 2D segons la millor vista
	inline Projection bestProjection(const std::vector<Point>& poly) {
		auto area2D = [](const std::vector<Point>& p, int i1, int i2) {
			double area = 0.0;
			for (size_t i = 0; i < p.size(); ++i) {
				const auto& a = p[i];
				const auto& b = p[(i + 1) % p.size()];
				area += (a[i1] * b[i2]) - (b[i1] * a[i2]);
			}
			return std::abs(area * 0.5);
		};

		double areaXY = area2D(poly, 0, 1); // x, y
		double areaXZ = area2D(poly, 0, 2); // x, z
		double areaYZ = area2D(poly, 1, 2); // y, z

		if (areaXY >= areaXZ && areaXY >= areaYZ) return Projection::XY;
		if (areaXZ >= areaYZ) return Projection::XZ;
		return Projection::YZ;
	}

	// Funció per projectar punts 3D a 2D segons la projecció triada
	inline std::vector<std::vector<Point>> projectTo2D(
		const std::vector<std::vector<Point>>& poly3D,
		Projection proj) {

		std::vector<std::vector<Point>> poly2D(poly3D.size());

		for (size_t i = 0; i < poly3D.size(); ++i) {
			for (const auto& pt : poly3D[i]) {
				switch (proj) {
					case Projection::XY:
						poly2D[i].push_back({pt[0], pt[1], pt[2]});
						break;
					case Projection::XZ:
						poly2D[i].push_back({pt[0], pt[2], pt[1]});
						break;
					case Projection::YZ:
						poly2D[i].push_back({pt[1], pt[2], pt[0]});
						break;
				}
			}
		}

		return poly2D;
	}

	inline bimGeometry::Geometry Extrude(std::vector<std::vector<glm::dvec3>> profile, glm::dvec3 dir, double distance, glm::dvec3 cuttingPlaneNormal = glm::dvec3(0), glm::dvec3 cuttingPlanePos = glm::dvec3(0))
	{
		bimGeometry::Geometry geom;
		std::vector<bool> holesIndicesHash;

		// check if first point is equal to last point, otherwise the outer loop of the shape is not closed
		glm::dvec3 lastToFirstPoint = profile[0].front() - profile[0].back();
		if (glm::length(lastToFirstPoint) > 1e-8) {
			profile[0].push_back(profile[0].front());
		}

		// build the caps
		{
			int polygonCount = profile.size(); // Main profile + holes
			std::vector<std::vector<Point>> polygon(polygonCount);

			glm::dvec3 normal = dir;

			for (size_t i = 0; i < profile[0].size(); i++)
			{
				glm::dvec3 pt = profile[0][i];
				glm::dvec4 et = glm::dvec4(glm::dvec3(pt) + dir * distance, 1);

				geom.AddPoint(et, normal);
				polygon[0].push_back(Point{pt.x, pt.y, pt.z});
			}

			for (size_t i = 0; i < profile[0].size(); i++)
			{
				holesIndicesHash.push_back(false);
			}

			for (size_t i = 1; i < profile.size(); i++)
			{
				std::vector<glm::dvec3> hole = profile[i];
				int pointCount = hole.size();

				for (int j = 0; j < pointCount; j++)
				{
					holesIndicesHash.push_back(j == 0);

					glm::dvec3 pt = hole[j];
					glm::dvec4 et = glm::dvec4(pt + dir * distance, 1);

					profile[0].push_back(pt);
					geom.AddPoint(et, normal);
					polygon[i].push_back({pt.x, pt.y, pt.z}); // Index 0 is main profile; see earcut reference
				}
			}

			Projection proj = bestProjection(polygon[0]);
			auto polygon2D = projectTo2D(polygon, proj);
			std::vector<uint32_t> indices = mapbox::earcut<uint32_t>(polygon2D);

			uint32_t offset = 0;
			bool winding = true;
			bool flipWinding = false;

			if (indices.size() >= 3)
			{
				bool winding = GetWindingOfTriangle(geom.GetPoint(offset + indices[0]), geom.GetPoint(offset + indices[1]), geom.GetPoint(offset + indices[2]));
				bool flipWinding = !winding;

				for (size_t i = 0; i < indices.size(); i += 3)
				{
					if (flipWinding)
					{
						geom.AddFace(offset + indices[i + 0], offset + indices[i + 2], offset + indices[i + 1]);
					}
					else
					{
						geom.AddFace(offset + indices[i + 0], offset + indices[i + 1], offset + indices[i + 2]);
					}
				}
			}

			offset += geom.numPoints;

			normal = -dir;

			for (size_t i = 0; i < profile[0].size(); i++)
			{
				glm::dvec3 pt = profile[0][i];
				glm::dvec4 et = glm::dvec4(glm::dvec3(pt), 1);

				if (cuttingPlaneNormal != glm::dvec3(0))
				{
					et = glm::dvec4(glm::dvec3(pt), 1);
					glm::dvec3 transDir = glm::dvec4(dir, 0);

					// project {et} onto the plane, following the extrusion normal
					double ldotn = glm::dot(transDir, cuttingPlaneNormal);
					if (ldotn == 0)
					{

					}
					else
					{
						glm::dvec3 dpos = cuttingPlanePos - glm::dvec3(et);
						double dist = glm::dot(dpos, cuttingPlaneNormal) / ldotn;
						// we want to apply dist, even when negative
						et = et + glm::dvec4(dist * transDir, 1);
					}
				}

				geom.AddPoint(et, normal);
			}

			for (size_t i = 0; i < indices.size(); i += 3)
			{
				if (flipWinding)
				{
					geom.AddFace(offset + indices[i + 0], offset + indices[i + 1], offset + indices[i + 2]);
				}
				else
				{
					geom.AddFace(offset + indices[i + 0], offset + indices[i + 2], offset + indices[i + 1]);
				}
			}
		}

		uint32_t capSize = profile[0].size();
		for (size_t i = 1; i < capSize; i++)
		{
			// https://github.com/tomvandig/web-ifc/issues/5
			if (holesIndicesHash[i])
			{
				continue;
			}

			uint32_t bl = i - 1;
			uint32_t br = i - 0;

			uint32_t tl = capSize + i - 1;
			uint32_t tr = capSize + i - 0;

			// this winding should be correct
			geom.AddFace(geom.GetPoint(tl),
						geom.GetPoint(br),
						geom.GetPoint(bl));

			geom.AddFace(geom.GetPoint(tl),
						geom.GetPoint(tr),
						geom.GetPoint(br));
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

	//! This implementation generates much more vertices than needed, and does not have smoothed normals
	// TODO: Review rotate90 value, as it should be inferred from IFC but the source data had not been identified yet
	// An arbitrary value has been added in IFCSURFACECURVESWEPTAREASOLID but this is a bad solution
	inline	Geometry SweepFunction(const double scaling, const bool closed, const std::vector<glm::dvec3> &profilePoints, const std::vector<glm::dvec3> &directrix, const glm::dvec3 &initialDirectrixNormal = glm::dvec3(0), const bool rotate90 = false, const bool optimize = true)
	{
		Geometry geom;

		std::vector<glm::vec<3, glm::f64>> dpts;

		// Remove repeated points
		for (size_t i = 0; i < directrix.size(); i++)
		{
			if (i < directrix.size() - 1)
			{
				if (glm::distance(directrix[i], directrix[i + 1]) > EPS_BIG2 * scaling || !optimize)
				{
					dpts.push_back(directrix[i]);
				}
			}
			else
			{
				dpts.push_back(directrix[i]);
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

	inline	Geometry SweepCircular(const double scaling, const bool closed, const std::vector<glm::dvec3> &profile, const double radius, const std::vector<glm::dvec3> &directrix, const glm::dvec3 &initialDirectrixNormal = glm::dvec3(0), const bool rotate90 = false)
	{
		Geometry geom;

		std::vector<glm::vec<3, glm::f64>> dpts;

		// Remove repeated points
		for (size_t i = 0; i < directrix.size(); i++)
		{
			if (i < directrix.size() - 1)
			{
				if (glm::distance(directrix[i], directrix[i + 1]) > EPS_BIG2 * scaling)
				{
					dpts.push_back(directrix[i]);
				}
			}
			else
			{
				dpts.push_back(directrix[i]);
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
		std::vector<std::vector<glm::dvec3>> curves;
		std::vector<glm::dmat4> transforms;

		for (size_t i = 0; i < dpts.size(); i++)
		{
			std::vector<glm::dvec3> segmentForCurve;

			glm::dvec3 directrix2;
			glm::dvec3 planeNormal;
			glm::dvec3 directrixSegmentNormal;
			glm::dvec3 planeOrigin;

			if (i == 0) // start
			{
				planeNormal = glm::normalize(dpts[1] - dpts[0]);
				directrixSegmentNormal = planeNormal;
				planeOrigin = dpts[0];
				directrix2 = planeNormal;
			}
			else if (i == dpts.size() - 1) // end
			{
				planeNormal = glm::normalize(dpts[i] - dpts[i - 1]);
				directrixSegmentNormal = planeNormal;
				planeOrigin = dpts[i];
				directrix2 = planeNormal;
			}
			else // middle
			{
				// possibly the directrix is bad
				glm::dvec3 n1 = glm::normalize(dpts[i] - dpts[i - 1]);
				glm::dvec3 n2 = glm::normalize(dpts[i + 1] - dpts[i]);
				glm::dvec3 p = glm::normalize(glm::cross(n1, n2));
				directrix2 = -n1;

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

			glm::dvec3 dz = glm::normalize(directrix2);
			glm::dvec3 dx = glm::dvec3(1, 0, 0);
			glm::dvec3 dy = glm::dvec3(0, 1, 0);

			double parallelZ = glm::abs(glm::dot(dz, glm::dvec3(0, 0, 1)));

			if(parallelZ > 1 - EPS_BIG2)
			{
				dx = glm::normalize(glm::cross(dz, glm::dvec3(0, 1, 0)));
			} else {
				dx = glm::normalize(glm::cross(dz, glm::dvec3(0, 0, 1)));
			}

			dy = glm::normalize(glm::cross(dz, dx));

			glm::dmat4 profileScale = glm::dmat4(
				glm::dvec4(dx * radius, 0),
				glm::dvec4(dy * radius, 0),
				glm::dvec4(dz, 0),
				glm::dvec4(planeOrigin, 1));

			transforms.push_back(profileScale);	

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

				if (left == glm::dvec3(0, 0, 0))
				{
				}

				// project profile onto planeNormal, place on planeOrigin
				// TODO: look at holes
				auto &ppts = profile;
				for (auto &pt2D : ppts)
				{				
					glm::dvec3 pt = -pt2D.x * left + -pt2D.y * right + planeOrigin;
					if(rotate90)
					{
						pt = -pt2D.x * right - pt2D.y * left + planeOrigin;
					}
					glm::dvec3 proj = bimGeometry::projectOntoPlane(planeOrigin, planeNormal, pt, directrixSegmentNormal);
					
					segmentForCurve.push_back(proj);
				}
			}
			else
			{
				// project previous curve onto the normal
				const std::vector<glm::dvec3> &prevCurve = curves.back();

				auto &ppts = prevCurve;
				for (auto &pt : ppts)
				{
					glm::dvec3 proj = bimGeometry::projectOntoPlane(planeOrigin, planeNormal, pt, directrixSegmentNormal);

					segmentForCurve.push_back(proj);
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
			glm::dvec3 dir = p1 - p2;
			glm::dvec4 ddir = glm::dvec4(dir, 0);
			const double di = glm::distance(p1, p2);

			//Only segments smaller than 10 cm will be represented, those that are bigger will be standardized

			const auto &c1 = curves[i - 1];
			const auto &c2 = curves[i];

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

	inline Geometry SectionedSurface(std::vector<std::vector<glm::dvec3>> profiles)
	{
		Geometry geom;

		// Iterate over each profile, and create a surface by connecting the corresponding points with faces.
		for (size_t i = 0; i < profiles.size() - 1; i++)
		{
			std::vector<glm::dvec3> &profile1 = profiles[i];
			std::vector<glm::dvec3> &profile2 = profiles[i + 1];

			// Check that the profiles have the same number of points
			if (profile1.size() != profile2.size())
			{
			}

			std::vector<uint32_t> indices;

			// Create faces by connecting corresponding points from the two profiles
			for (size_t j = 0; j < profile1.size(); j++)
			{
				glm::dvec3 &p1 = profile1[j];
				int j2 = 0;
				if (profile1.size() > 1)
				{
					double pr = (double)j / (double)(profile1.size() - 1);
					j2 = pr * (profile2.size() - 1);
				}
				glm::dvec3 &p2 = profile2[j2];

				glm::dvec3 normal = glm::dvec3(0.0, 0.0, 1.0);

				if (glm::distance(p1, p2) > 1E-5)
				{
					normal = glm::normalize(glm::cross(p2 - p1, glm::cross(p2 - p1, glm::dvec3(0.0, 0.0, 1.0))));
				}

				geom.AddPoint(p1, normal);
				geom.AddPoint(p2, normal);

				indices.push_back(geom.numPoints - 2);
				indices.push_back(geom.numPoints - 1);
			}

			// Create the faces
			if (indices.size() > 0)
			{
				for (size_t j = 0; j < indices.size() - 2; j += 4)
				{
					geom.AddFace(indices[j], indices[j + 1], indices[j + 2]);
					geom.AddFace(indices[j + 2], indices[j + 1], indices[j + 3]);
				}
			}
		}

		return geom;
	}
}