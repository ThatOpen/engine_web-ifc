/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

#pragma once

#include <cstdint>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include "../representation/IfcCurve.h"

namespace webifc::geometry {

inline bool isConvexOrColinear(glm::dvec2 a, glm::dvec2 b, glm::dvec2 c)
{
	return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) >= 0;
}

inline IfcCurve Build3DArc3Pt(const glm::dvec3 &p1, const glm::dvec3 &p2, const glm::dvec3 &p3, uint16_t circleSegments, double EPS_MINSIZE)
{
    spdlog::debug("[Build3DArc3Pt({})]");
    // Calculate the center of the circle
    glm::dvec3 v1 = p2 - p1;
    glm::dvec3 v2 = p3 - p1;
    glm::dvec3 normal = glm::normalize(glm::cross(v1, v2));
    glm::dvec3 mid1 = 0.5 * (p1 + p2);
    glm::dvec3 mid2 = 0.5 * (p1 + p3);
    glm::dvec3 center;

    if (glm::length(glm::cross(v1, v2)) < EPS_MINSIZE)
    {
        // Points are collinear, so there's no unique circle.
        // You can handle this case differently or return an error.
        // For simplicity, let's return an empty curve.
        return IfcCurve();
    }
    else
    {
        // Calculate the center of the circle
        double Cx = p2.x-p1.x;
        double Cy = p2.y-p1.y;
        double Cz = p2.z-p1.z;
        double Bx = p3.x-p1.x;
        double By = p3.y-p1.y;
        double Bz = p3.z-p1.z;
        double B2 = p1.x*p1.x-p3.x*p3.x+p1.y*p1.y-p3.y*p3.y+p1.z*p1.z-p3.z*p3.z;
        double C2 = p1.x*p1.x-p2.x*p2.x+p1.y*p1.y-p2.y*p2.y+p1.z*p1.z-p2.z*p2.z;

        double CByz = Cy*Bz-Cz*By;
        double CBxz = Cx*Bz-Cz*Bx;
        double CBxy = Cx*By-Cy*Bx;
        double ZZ1 = -(Bz-Cz*Bx/Cx)/(By-Cy*Bx/Cx);
        double Z01 = -(B2-Bx/Cx*C2)/(2*(By-Cy*Bx/Cx));
        double ZZ2 = -(ZZ1*Cy+Cz)/Cx;
        double Z02 = -(2*Z01*Cy+C2)/(2*Cx);

        double dz = -((Z02-p1.x)*CByz-(Z01-p1.y)*CBxz-p1.z*CBxy)/(ZZ2*CByz-ZZ1*CBxz+CBxy);
        double dx = ZZ2*dz + Z02;
        double dy = ZZ1*dz + Z01;

		center = glm::dvec3(dx, dy, dz);
    }

    // Calculate the radius
    double radius = glm::distance(center, p1);

    // Using geometrical subdivision to create points on the arc
    std::vector<glm::dvec3> pointList;
    pointList.push_back(p1);
    pointList.push_back(p2);
    pointList.push_back(p3);

    while (pointList.size() < (size_t)circleSegments)
    {
        std::vector<glm::dvec3> tempPointList;
        for (size_t j = 0; j < pointList.size() - 1; j++)
        {
            glm::dvec3 pt = (pointList[j] + pointList[j + 1]) / 2.0;
            glm::dvec3 vc = glm::normalize(pt - center);
            pt = center + vc * radius;
            tempPointList.push_back(pointList[j]);
            tempPointList.push_back(pt);
        }
        tempPointList.push_back(pointList.back());
        pointList = tempPointList;
    }

    IfcCurve curve;
    for (size_t j = 0; j < pointList.size(); j++)
    {
        curve.Add(pointList.at(j));
    }

    return curve;
}

	inline IfcCurve BuildArc3Pt(const glm::dvec2 &p1, const glm::dvec2 &p2, const glm::dvec2 &p3,uint16_t circleSegments)
	{
		spdlog::debug("[BuildArc3Pt({})]");
		double f1 = (p1.x * p1.x - p2.x * p2.x + p1.y * p1.y - p2.y * p2.y);
		double f2 = (p1.x * p1.x - p3.x * p3.x + p1.y * p1.y - p3.y * p3.y);
		double v = 2 * (p1.x - p2.x) * (p1.y - p3.y) - 2 * (p1.x - p3.x) * (p1.y - p2.y);

		double cenX = ((p1.y - p3.y) * f1 - (p1.y - p2.y) * f2) / v;
		double den1 = (2 * (p1.y - p3.y));
		double den2 = (2 * (p1.y - p2.y));
		double cenYa = (f2 - 2 * cenX * (p1.x - p3.x)) / den1;
		double cenYb = (f1 - 2 * cenX * (p1.x - p2.x)) / den2;
		double cenY = cenYa;
		if(glm::abs(den1) > glm::abs(den2))
		{
			cenY = cenYa;
		}
		else
		{
			cenY = cenYb;
		}
		if (std::isnan(cenY) || std::isinf(cenY))
		{
			if (!std::isnan(cenYa) && !std::isinf(cenYa))
			{
				cenY = cenYa;
			}
			else if (!std::isnan(cenYb) && !std::isinf(cenYb))
			{
				cenY = cenYb;
			}
			else
			{
				spdlog::error("3 Point Arc - Error: wrong points");
			}
		}

		glm::dvec2 pCen;
		pCen.x = cenX;
		pCen.y = cenY;

		double radius = sqrt(pow(cenX - p1.x, 2) + pow(cenY - p1.y, 2));

			// Using geometrical subdivision to avoid complex calculus with angles

		std::vector<glm::dvec2> pointList;
		pointList.push_back(p1);
		pointList.push_back(p2);
		pointList.push_back(p3);

		while (pointList.size() < (size_t)circleSegments)
		{
			std::vector<glm::dvec2> tempPointList;
			for (uint32_t j = 0; j < pointList.size() - 1; j++)
			{
				glm::dvec2 pt = (pointList[j] + pointList[j + 1]);
				pt.x /= 2;
				pt.y /= 2;
				glm::dvec2 vc = glm::normalize(pt - pCen);
				pt = pCen + vc * radius;
				tempPointList.push_back(pointList[j]);
				tempPointList.push_back(pt);
			}
			tempPointList.push_back(pointList[pointList.size() - 1]);
			pointList = tempPointList;
		}
		IfcCurve curve;
		for (uint32_t j = 0; j < pointList.size(); j++) curve.Add(pointList.at(j));
			return curve;
	}


	
	inline	glm::dvec3 InterpolateRationalBSplineCurveWithKnots(double t, int degree, std::vector<glm::dvec3> points, std::vector<double> knots, std::vector<double> weights)
	{
		spdlog::debug("[InterpolateRationalBSplineCurveWithKnots({})]");
		glm::dvec3 point;

		int domainLow = degree;
		int domainHigh = knots.size() - 1 - degree;

		double low = knots[domainLow];
		double high = knots[domainHigh];

		double tPrime = t * (high - low) + low;
		if (tPrime < low || tPrime > high)
		{
			printf("BSpline tPrime out of bounds\n");
			return glm::dvec3(0, 0, 0);
		}

		// find s (the spline segment) for the [t] value provided
		int s = 0;
		for (int i = domainLow; i < domainHigh; i++)
		{
			if (knots[i] <= tPrime && tPrime < knots[i + 1])
			{
				s = i;
				break;
			}
		}
		if(s == 0)
		{
			s = domainHigh - 1;
		}
		// TODO: this should be done before calling the function, instead of calling it for each t
		// convert points to homogeneous coordinates
		std::vector<glm::dvec4> homogeneousPoints;
		for (size_t i = 0; i < points.size(); i++)
		{
			glm::dvec3 p = points[i];
			glm::dvec4 h = glm::dvec4(p.x * weights[i], p.y * weights[i], p.z * weights[i], weights[i]);
			homogeneousPoints.push_back(h);
		}

		// l (level) goes from 1 to the curve degree + 1
		double alpha;
		for (int l = 1; l <= degree + 1; l++)
		{
			// build level l of the pyramid
			for (int i = s; i > s - degree - 1 + l; i--)
			{
				alpha = (tPrime - knots[i]) / (knots[i + degree + 1 - l] - knots[i]);
				if (std::isnan(alpha) || std::isinf(alpha)) {
					alpha = 1.0;
				}
				// interpolate each component

				double x = (1 - alpha) * homogeneousPoints[i - 1].x + alpha * homogeneousPoints[i].x;
				double y = (1 - alpha) * homogeneousPoints[i - 1].y + alpha * homogeneousPoints[i].y;
				double z = (1 - alpha) * homogeneousPoints[i - 1].z + alpha * homogeneousPoints[i].z;
				double w = (1 - alpha) * homogeneousPoints[i - 1].w + alpha * homogeneousPoints[i].w;

				homogeneousPoints[i] = glm::dvec4(x, y, z, w);
			}
		}

		// convert back to cartesian and return
		point = glm::dvec3(homogeneousPoints[s].x / homogeneousPoints[s].w, homogeneousPoints[s].y / homogeneousPoints[s].w, homogeneousPoints[s].z / homogeneousPoints[s].w);
		return point;
	}

	inline	glm::dvec2 InterpolateRationalBSplineCurveWithKnots(double t, int degree, std::vector<glm::dvec2> points, std::vector<double> knots, std::vector<double> weights)
	{

		spdlog::debug("[InterpolateRationalBSplineCurveWithKnots({})]");
		glm::dvec2 point;

		int domainLow = degree;
		int domainHigh = knots.size() - 1 - degree;

		double low = knots[domainLow];
		double high = knots[domainHigh];

		double tPrime = t * (high - low) + low;
		if (tPrime < low || tPrime > high)
		{
			printf("BSpline tPrime out of bounds\n");
			return glm::dvec2(0, 0);
		}

		// find s (the spline segment) for the [t] value provided
		int s = 0;
		for (int i = domainLow; i < domainHigh; i++)
		{
			if (knots[i] <= tPrime && tPrime < knots[i + 1])
			{
				s = i;
				break;
			}
		}

		// TODO: this should be done before calling the function, instead of calling it for each t
		// convert points to homogeneous coordinates
		std::vector<glm::dvec3> homogeneousPoints;
		for (size_t i = 0; i < points.size(); i++)
		{
			glm::dvec2 p = points[i];
			glm::dvec3 h = glm::dvec3(p.x * weights[i], p.y * weights[i], weights[i]);
			homogeneousPoints.push_back(h);
		}

		// l (level) goes from 1 to the curve degree + 1
		double alpha;
		for (int l = 1; l <= degree + 1; l++)
		{
			// build level l of the pyramid
			for (int i = s; i > s - degree - 1 + l; i--)
			{
				alpha = (tPrime - knots[i]) / (knots[i + degree + 1 - l] - knots[i]);

				// interpolate each component

				double x = (1 - alpha) * homogeneousPoints[i - 1].x + alpha * homogeneousPoints[i].x;
				double y = (1 - alpha) * homogeneousPoints[i - 1].y + alpha * homogeneousPoints[i].y;
				double w = (1 - alpha) * homogeneousPoints[i - 1].z + alpha * homogeneousPoints[i].z;
				glm::dvec3 p = glm::dvec3(x, y, w);

				homogeneousPoints[i] = p;
			}
		}

		// convert back to cartesian and return
		point = glm::dvec2(homogeneousPoints[s].x / homogeneousPoints[s].z, homogeneousPoints[s].y / homogeneousPoints[s].z);
		return point;
	}



	inline	std::vector<glm::dvec3> GetRationalBSplineCurveWithKnots(int degree, std::vector<glm::dvec3> points, std::vector<double> knots, std::vector<double> weights, double numCurvePoints)
	{
		spdlog::debug("[GetRationalBSplineCurveWithKnots({})]");
		std::vector<glm::dvec3> c;
		double step = 1.0/numCurvePoints;
		for (double i = 0; i < 1; i += step)
		{
			glm::dvec3 point = InterpolateRationalBSplineCurveWithKnots(i, degree, points, knots, weights);
			c.push_back(point);
		}

		// TODO: flip triangles?
		/*
				if (MatrixFlipsTriangles(placement))
				{
					c.Invert();
				}
		*/

		return c;
	}

	inline	std::vector<glm::dvec2> GetRationalBSplineCurveWithKnots(int degree, std::vector<glm::dvec2> points, std::vector<double> knots, std::vector<double> weights)
	{
		spdlog::debug("[GetRationalBSplineCurveWithKnots({})]");
		std::vector<glm::dvec2> c;

		for (double i = 0; i < 1; i += 0.05)
		{
			glm::dvec2 point = InterpolateRationalBSplineCurveWithKnots(i, degree, points, knots, weights);
			c.push_back(point);
		}
		// TODO: flip triangles?
		/*
				if (MatrixFlipsTriangles(placement))
				{
					c.Invert();
				}
		*/
		return c;
	}

	inline bool IsCurveConvex(IfcCurve &curve)
	{
		for (size_t i = 2; i < curve.points.size(); i++)
		{
			glm::dvec2 a = curve.points[i - 2];
			glm::dvec2 b = curve.points[i - 1];
			glm::dvec2 c = curve.points[i - 0];

			if (!isConvexOrColinear(a, b, c))
			{
				return false;
			}
		}

		return true;
	}

	inline bool MatrixFlipsTriangles(const glm::dmat3 &mat)
	{
		return glm::determinant(mat) < 0;
	}

	inline IfcCurve GetEllipseCurve(float radiusX, float radiusY, int numSegments, glm::dmat3 placement = glm::dmat3(1), double startRad = 0, double endRad = CONST_PI * 2, bool swap = true, bool normalToCenterEnding = false)
	{
		spdlog::debug("[GetEllipseCurve({})]");
		IfcCurve c;
		
		c.points = (bimGeometry::GetEllipseCurve(radiusX, radiusY, numSegments, placement, startRad, endRad, swap, normalToCenterEnding)).points;

		return c;
	}

	inline IfcCurve GetCircleCurve(float radius, int numSegments, glm::dmat3 placement = glm::dmat3(1))
	{
		return GetEllipseCurve(radius, radius, numSegments, placement);
	}

	inline IfcCurve GetRectangleCurve(double xdim, double ydim, glm::dmat3 placement = glm::dmat3(1), int numSegments = 12, double radius = 0)
	{
		glm::dmat4 placement4 = glm::dmat4(
			glm::dvec4(placement[0], 0.0),  // First column + w=0
			glm::dvec4(placement[1], 0.0),  // Second column + w=0  
			glm::dvec4(0.0, 0.0, 1.0, 0.0),  // Third column + w=0
			glm::dvec4(placement[2][0], placement[2][1], 0.0, 1.0)  // Translation + w=1
		);
		bimGeometry::Curve temp = bimGeometry::GetRectangleCurve(xdim, ydim, placement4, numSegments, radius);
		IfcCurve c;
		c.points = temp.points;
		return c;
	}

	inline IfcCurve GetIShapedCurve(double width, double depth, double webThickness, double flangeThickness, bool hasFillet, double filletRadius, glm::dmat3 placement = glm::dmat3(1))
	{
		glm::dmat4 placement4 = glm::dmat4(
			glm::dvec4(placement[0], 0.0),  // First column + w=0
			glm::dvec4(placement[1], 0.0),  // Second column + w=0  
			glm::dvec4(0.0, 0.0, 1.0, 0.0),  // Third column + w=0
			glm::dvec4(placement[2][0], placement[2][1], 0.0, 1.0)  // Translation + w=1
		);
		bimGeometry::Curve temp = bimGeometry::GetIShapedCurve(width, depth, webThickness, flangeThickness, hasFillet, filletRadius, placement4);
		IfcCurve c;
		c.points = temp.points;
		return c;
	}

	inline IfcCurve GetUShapedCurve(double depth, double flangeWidth, double webThickness, double flangeThickness, double filletRadius, double edgeRadius, double flangeSlope, glm::dmat3 placement = glm::dmat3(1))
	{
		glm::dmat4 placement4 = glm::dmat4(
			glm::dvec4(placement[0], 0.0),  // First column + w=0
			glm::dvec4(placement[1], 0.0),  // Second column + w=0  
			glm::dvec4(0.0, 0.0, 1.0, 0.0),  // Third column + w=0
			glm::dvec4(placement[2][0], placement[2][1], 0.0, 1.0)  // Translation + w=1
		);
		bimGeometry::Curve temp = bimGeometry::GetUShapedCurve(depth, flangeWidth, webThickness, flangeThickness, filletRadius, edgeRadius, flangeSlope, placement4);
		IfcCurve c;
		c.points = temp.points;
		return c;
	}

	inline IfcCurve GetLShapedCurve(double width, double depth, double thickness, bool hasFillet, double filletRadius, double edgeRadius, double legSlope, int numSegments, glm::dmat3 placement = glm::dmat3(1))
	{
		glm::dmat4 placement4 = glm::dmat4(
			glm::dvec4(placement[0], 0.0),  // First column + w=0
			glm::dvec4(placement[1], 0.0),  // Second column + w=0  
			glm::dvec4(0.0, 0.0, 1.0, 0.0),  // Third column + w=0
			glm::dvec4(placement[2][0], placement[2][1], 0.0, 1.0)  // Translation + w=1
		);
		bimGeometry::Curve temp = bimGeometry::GetLShapedCurve(width, depth, thickness, hasFillet, filletRadius, edgeRadius, legSlope, numSegments, placement4);
		IfcCurve c;
		c.points = temp.points;
		return c;
	}

	inline IfcCurve GetTShapedCurve(double width, double depth, double thickness, bool hasFillet, double filletRadius, double edgeRadius, double legSlope, glm::dmat3 placement = glm::dmat3(1))
	{
		glm::dmat4 placement4 = glm::dmat4(
			glm::dvec4(placement[0], 0.0),  // First column + w=0
			glm::dvec4(placement[1], 0.0),  // Second column + w=0  
			glm::dvec4(0.0, 0.0, 1.0, 0.0),  // Third column + w=0
			glm::dvec4(placement[2][0], placement[2][1], 0.0, 1.0)  // Translation + w=1
		);
		bimGeometry::Curve temp = bimGeometry::GetTShapedCurve(width, depth, thickness, hasFillet, filletRadius, edgeRadius, legSlope, placement4);
		IfcCurve c;
		c.points = temp.points;
		return c;
	}

	inline IfcCurve GetCShapedCurve(double width, double depth, double girth, double thickness, bool hasFillet, double filletRadius, glm::dmat3 placement = glm::dmat3(1))
	{
		glm::dmat4 placement4 = glm::dmat4(
			glm::dvec4(placement[0], 0.0),  // First column + w=0
			glm::dvec4(placement[1], 0.0),  // Second column + w=0  
			glm::dvec4(0.0, 0.0, 1.0, 0.0),  // Third column + w=0
			glm::dvec4(placement[2][0], placement[2][1], 0.0, 1.0)  // Translation + w=1
		);
		bimGeometry::Curve temp = bimGeometry::GetCShapedCurve(width, depth, girth, thickness, hasFillet, filletRadius, placement4);
		IfcCurve c;
		c.points = temp.points;
		return c;
	}

	inline IfcCurve GetZShapedCurve(double depth, double flangeWidth, double webThickness, double flangeThickness, double filletRadius, double edgeRadius, glm::dmat3 placement = glm::dmat3(1))
	{
		glm::dmat4 placement4 = glm::dmat4(
			glm::dvec4(placement[0], 0.0),  // First column + w=0
			glm::dvec4(placement[1], 0.0),  // Second column + w=0  
			glm::dvec4(0.0, 0.0, 1.0, 0.0),  // Third column + w=0
			glm::dvec4(placement[2][0], placement[2][1], 0.0, 1.0)  // Translation + w=1
		);
		bimGeometry::Curve temp = bimGeometry::GetZShapedCurve(depth, flangeWidth, webThickness, flangeThickness, filletRadius, edgeRadius, placement4);
		IfcCurve c;
		c.points = temp.points;
		return c;
	}

	inline IfcCurve GetTrapeziumCurve(double bottomXDim, double topXDim, double yDim, double topXOffset, glm::dmat3 placement = glm::dmat3(1))
	{
		glm::dmat4 placement4 = glm::dmat4(
			glm::dvec4(placement[0], 0.0),  // First column + w=0
			glm::dvec4(placement[1], 0.0),  // Second column + w=0  
			glm::dvec4(0.0, 0.0, 1.0, 0.0),  // Third column + w=0
			glm::dvec4(placement[2][0], placement[2][1], 0.0, 1.0)  // Translation + w=1
		);
		bimGeometry::Curve temp = bimGeometry::GetTrapeziumCurve(bottomXDim, topXDim, yDim, topXOffset, placement4);
		IfcCurve c;
		c.points = temp.points;
		return c;
	}

	inline IfcCurve BuildArc(double scale, const glm::dvec3 &pos, const glm::dvec3 &axis, double angleRad,uint16_t _circleSegments)
	{
		
		spdlog::debug("[BuildArc({})]");
		IfcCurve curve;

		// project pos onto axis

		double pdota = glm::dot(axis, pos);
		glm::dvec3 pproja = pdota * axis;

		glm::dvec3 right = -(pos - pproja);

		if(glm::length(right) == 0)
		{
			right = glm::dvec3(EPS_BIG2, 0, 0);
			glm::dvec3 up = glm::cross(axis, right);

			auto curve2D = GetEllipseCurve(1, 1, _circleSegments, glm::dmat3(1), 0, angleRad, true, true);

			for (auto &pt2D : curve2D.points)
			{
				glm::dvec3 pt3D = pos + pt2D.x * right + pt2D.y * up;
				curve.Add(pt3D);
			}	
		}
		else
		{
			glm::dvec3 up = glm::cross(axis, right);

			auto curve2D = GetEllipseCurve(1, 1, _circleSegments, glm::dmat3(1), 0, angleRad, true);

			for (auto &pt2D : curve2D.points)
			{
				glm::dvec3 pt3D = pos + pt2D.x * right + pt2D.y * up;
				curve.Add(pt3D);
			}
		}

		return curve;
	}
}