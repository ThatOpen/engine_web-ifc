/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include <sstream>
#include <fstream>
#include <vector>
#include <array>
#include <unordered_map>
#include <optional>
#include <functional>

#include "../deps/glm/glm/glm.hpp"

#include "tinynurbs/tinynurbs.h"

#define CONST_PI 3.141592653589793238462643383279502884L

namespace webifc
{
	const double EPS_MINISCULE = 1e-12; // what?
	const double EPS_TINY = 1e-9;
	const double EPS_SMALL = 1e-6;
	const double EPS_BIG = 1e-4;

	bool MatrixFlipsTriangles(const glm::dmat4 &mat)
	{
		return glm::determinant(mat) < 0;
	}

	bool MatrixFlipsTriangles(const glm::dmat3 &mat)
	{
		return glm::determinant(mat) < 0;
	}

	void writeFile(std::wstring filename, std::string data)
	{
#ifdef _MSC_VER
		std::ofstream out(filename);
		out << data;
		out.close();
#endif
	}

	// for some reason std::string_view is not compiling...
	struct StringView
	{
		StringView(char *d, uint32_t l) : data(d),
										  len(l)
		{
		}

		char *data;
		uint32_t len;
	};

	struct Face
	{
		int i0;
		int i1;
		int i2;
	};

	struct Loop
	{
		bool hasOne;
		glm::dvec2 v1;
		glm::dvec2 v2;
	};

	constexpr int VERTEX_FORMAT_SIZE_FLOATS = 6;

	glm::dvec3 computeNormal(const glm::dvec3 v1, const glm::dvec3 v2, const glm::dvec3 v3)
	{
		glm::dvec3 v12(v2 - v1);
		glm::dvec3 v13(v3 - v1);

		glm::dvec3 norm = glm::cross(v12, v13);

		return glm::normalize(norm);
	}

	// just follow the ifc spec, damn
	bool computeSafeNormal(const glm::dvec3 v1, const glm::dvec3 v2, const glm::dvec3 v3, glm::dvec3 &normal, double eps = 0)
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

	bool IsInsideCenterExtents(const glm::dvec3 &pt, const glm::dvec3 &center, const glm::dvec3 &extents)
	{
		glm::dvec3 delta = pt - center;
		delta = glm::abs(delta);
		glm::dvec3 offset = delta - extents;

		return offset.x < EPS_SMALL && offset.y < EPS_SMALL && offset.z < EPS_SMALL;
	}

	struct IfcGeometry
	{
		std::vector<float> fvertexData;
		std::vector<double> vertexData;
		std::vector<uint32_t> indexData;
		glm::dvec3 min = glm::dvec3(DBL_MAX, DBL_MAX, DBL_MAX);
		glm::dvec3 max = glm::dvec3(-DBL_MAX, -DBL_MAX, -DBL_MAX);
		bool normalized = false;

		uint32_t numPoints = 0;
		uint32_t numFaces = 0;

		glm::dvec3 GetExtent() const
		{
			return max - min;
		}

		// set all vertices relative to min
		void Normalize()
		{
			for (size_t i = 0; i < vertexData.size(); i += 6)
			{
				vertexData[i + 0] = vertexData[i + 0] - min.x;
				vertexData[i + 1] = vertexData[i + 1] - min.y;
				vertexData[i + 2] = vertexData[i + 2] - min.z;
			}

			normalized = true;
		}

		inline void AddPoint(glm::dvec4 &pt, glm::dvec3 &n)
		{
			glm::dvec3 p = pt;
			AddPoint(p, n);
		}

		inline void AddPoint(glm::dvec3 &pt, glm::dvec3 &n)
		{
			// vertexData.reserve((numPoints + 1) * VERTEX_FORMAT_SIZE_FLOATS);
			// vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 0] = pt.x;
			// vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 1] = pt.y;
			// vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 2] = pt.z;
			vertexData.push_back(pt.x);
			vertexData.push_back(pt.y);
			vertexData.push_back(pt.z);

			min = glm::min(min, pt);
			max = glm::max(max, pt);

			vertexData.push_back(n.x);
			vertexData.push_back(n.y);
			vertexData.push_back(n.z);

			if (std::isnan(pt.x) || std::isnan(pt.y) || std::isnan(pt.z))
			{
				printf("NaN in geom!\n");
			}

			if (std::isnan(n.x) || std::isnan(n.y) || std::isnan(n.z))
			{
				printf("NaN in geom!\n");
			}

			// vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 3] = n.x;
			// vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 4] = n.y;
			// vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 5] = n.z;

			numPoints += 1;
		}

		inline void AddFace(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
		{
			glm::dvec3 normal;
			if (!computeSafeNormal(a, b, c, normal))
			{
				// bail out, zero area triangle
				printf("zero tri");
				return;
			}

			AddFace(numPoints + 0, numPoints + 1, numPoints + 2);

			AddPoint(a, normal);
			AddPoint(b, normal);
			AddPoint(c, normal);
		}

		inline void AddFace(uint32_t a, uint32_t b, uint32_t c)
		{
			// indexData.reserve((numFaces + 1) * 3);
			// indexData[numFaces * 3 + 0] = a;
			// indexData[numFaces * 3 + 1] = b;
			// indexData[numFaces * 3 + 2] = c;
			indexData.push_back(a);
			indexData.push_back(b);
			indexData.push_back(c);

			numFaces++;
		}

		inline Face GetFace(uint32_t index) const
		{
			Face f;
			f.i0 = indexData[index * 3 + 0];
			f.i1 = indexData[index * 3 + 1];
			f.i2 = indexData[index * 3 + 2];
			return f;
		}

		inline glm::dvec3 GetPoint(uint32_t index) const
		{
			return glm::dvec3(
				vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 0],
				vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 1],
				vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 2]);
		}

		void GetCenterExtents(glm::dvec3 &center, glm::dvec3 &extents) const
		{
			glm::dvec3 min(DBL_MAX, DBL_MAX, DBL_MAX);
			glm::dvec3 max(DBL_MIN, DBL_MIN, DBL_MIN);

			for (size_t i = 0; i < numPoints; i++)
			{
				auto pt = GetPoint(i);
				min = glm::min(min, pt);
				max = glm::max(max, pt);
			}

			extents = (max - min);
			center = min + extents / 2.0;
		}

		IfcGeometry Normalize(glm::dvec3 center, glm::dvec3 extents) const
		{
			IfcGeometry newGeom;

			double scale = std::max(extents.x, std::max(extents.y, extents.z));

			for (size_t i = 0; i < numFaces; i++)
			{
				auto face = GetFace(i);
				auto a = (GetPoint(face.i0) - center) / scale;
				auto b = (GetPoint(face.i1) - center) / scale;
				auto c = (GetPoint(face.i2) - center) / scale;

				newGeom.AddFace(a, b, c);
			}

			return newGeom;
		}

		IfcGeometry DeNormalize(glm::dvec3 center, glm::dvec3 extents) const
		{
			IfcGeometry newGeom;

			double scale = std::max(extents.x, std::max(extents.y, extents.z));

			for (size_t i = 0; i < numFaces; i++)
			{
				auto face = GetFace(i);
				auto a = GetPoint(face.i0) * scale + center;
				auto b = GetPoint(face.i1) * scale + center;
				auto c = GetPoint(face.i2) * scale + center;

				newGeom.AddFace(a, b, c);
			}

			return newGeom;
		}

		uint32_t GetVertexData()
		{
			// unfortunately webgl can't do doubles
			if (fvertexData.size() != vertexData.size())
			{
				fvertexData.resize(vertexData.size());
				for (size_t i = 0; i < vertexData.size(); i += 6)
				{
					fvertexData[i + 0] = vertexData[i + 0];
					fvertexData[i + 1] = vertexData[i + 1];
					fvertexData[i + 2] = vertexData[i + 2];

					fvertexData[i + 3] = vertexData[i + 3];
					fvertexData[i + 4] = vertexData[i + 4];
					fvertexData[i + 5] = vertexData[i + 5];
				}

				// cleanup
				// vertexData = {};
			}

			if (fvertexData.empty())
			{
				return 0;
			}

			return (uint32_t)&fvertexData[0];
		}

		void AddGeometry(IfcGeometry geom)
		{
			uint32_t maxIndex = numPoints;
			numPoints += geom.numPoints;
			min = glm::min(min, geom.min);
			max = glm::max(max, geom.max);
			vertexData.insert(vertexData.end(), geom.vertexData.begin(), geom.vertexData.end());
			for (uint32_t k = 0; k < geom.numFaces; k++)
			{
				AddFace(
					maxIndex + geom.indexData[k * 3 + 0],
					maxIndex + geom.indexData[k * 3 + 1],
					maxIndex + geom.indexData[k * 3 + 2]);
			}
		}

		uint32_t GetVertexDataSize()
		{
			return (uint32_t)fvertexData.size();
		}

		uint32_t GetIndexData()
		{
			return (uint32_t)&indexData[0];
		}

		uint32_t GetIndexDataSize()
		{
			return (uint32_t)indexData.size();
		}

		bool IsEmpty()
		{
			return vertexData.empty();
		}
	};

	bool equals2d(glm::dvec2 A, glm::dvec2 B, double eps = 0)
	{
		return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps;
	}

	bool equals(glm::dvec3 A, glm::dvec3 B, double eps = 0)
	{
		return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps && std::fabs(A.z - B.z) <= eps;
	}

	template <uint32_t DIM>
	struct IfcCurve
	{
		std::vector<glm::vec<DIM, glm::f64>> points;
		inline void Add(const glm::vec<DIM, glm::f64> &pt)
		{
			if (points.empty())
			{
				points.push_back(pt);
			}
			else
			{
				bool add = false;
				if constexpr (DIM == 2)
				{
					add = !equals2d(pt, points.back(), EPS_TINY);
				}
				else
				{
					add = !equals(pt, points.back(), EPS_TINY);
				}

				if (add)
				{
					points.push_back(pt);
				}
				else
				{
					// TODO: we are now discarding these points, but they probably should not even be generated
				}
			}
		}

		void Invert()
		{
			std::reverse(points.begin(), points.end());
		}

		bool IsCCW()
		{
			double sum = 0;

			for (int i = 0; i < points.size(); i++)
			{
				glm::dvec2 pt1 = points[(i - 1) % points.size()];
				glm::dvec2 pt2 = points[i];

				sum += (pt2.x - pt1.x) * (pt2.y + pt1.y);
			}

			return sum < 0;
		}
	};

	struct IfcProfile
	{
		std::string type;
		IfcCurve<2> curve;
		std::vector<IfcCurve<2>> holes;
		bool isConvex;
		bool isComposite = false;
		std::vector<IfcProfile> profiles;
	};

	struct IfcProfile3D
	{
		std::string type;
		IfcCurve<3> curve;
		bool isConvex;
	};

	struct Cylinder
	{
		bool Active = false;
		double Radius;
	};

	struct BSpline
	{
		bool Active = false;
		double UDegree;
		double VDegree;
		std::string ClosedU;
		std::string ClosedV;
		std::string CurveType;
		std::vector<std::vector<double>> Weights;
		std::vector<std::vector<glm::dvec3>> ControlPoints;
		std::vector<glm::f64> UMultiplicity;
		std::vector<glm::f64> VMultiplicity;
		std::vector<glm::f64> UKnots;
		std::vector<glm::f64> VKnots;
		std::vector<std::vector<glm::f64>> WeightPoints;
	};

	struct Revolution
	{
		bool Active = false;
		glm::dmat4 Direction;
		IfcProfile3D Profile;
	};

	struct Extrusion
	{
		bool Active = false;
		glm::dvec3 Direction;
		IfcProfile Profile;
		double Length;
	};

	struct IfcSurface
	{
		glm::dmat4 transformation;
		BSpline BSplineSurface;
		Cylinder CylinderSurface;
		Revolution RevolutionSurface;
		Extrusion ExtrusionSurface;

		glm::dvec3 normal()
		{
			if(!CylinderSurface.Active && !BSplineSurface.Active && !RevolutionSurface.Active)
			{
				return transformation[2];
			}
			else
			{
				if(BSplineSurface.Active) {printf("Normal to bspline still not implemented\n");}
				if(CylinderSurface.Active) {printf("Normal to cylinder still not implemented\n");}
				if(RevolutionSurface.Active) {printf("Normal to revolution still not implemented\n");}
				return glm::dvec3(0);
			}
		}
	};

	struct IfcTrimmingSelect
	{
		bool hasParam = false;
		bool hasPos = false;
		double param;
		glm::dvec2 pos;
		glm::dvec3 pos3D;
	};

	struct IfcTrimmingArguments
	{
		bool exist = false;
		IfcTrimmingSelect start;
		IfcTrimmingSelect end;
	};

	struct IfcCurve3D
	{
		std::vector<glm::dvec3> points;
		std::vector<int> indices;
	};

	IfcCurve<2> GetEllipseCurve(float radiusX, float radiusY, int numSegments, glm::dmat3 placement = glm::dmat3(1), double startRad = 0, double endRad = CONST_PI * 2, bool swap = true)
	{
		IfcCurve<2> c;

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
			c.points.push_back(pos);
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

		return c;
	}

	IfcCurve<2> GetCircleCurve(float radius, int numSegments, glm::dmat3 placement = glm::dmat3(1))
	{
		return GetEllipseCurve(radius, radius, numSegments, placement);
	}

	bool GetWindingOfTriangle(const glm::dvec3 &a, const glm::dvec3 &b, const glm::dvec3 &c)
	{
		auto norm = computeNormal(a, b, c);
		return glm::dot(norm, glm::dvec3(0, 0, 1)) > 0.0;
	}

	bool TriangleIsCW(const glm::dvec2 &a, const glm::dvec2 &b, const glm::dvec2 &c)
	{
		auto norm = computeNormal(glm::dvec3(a, 0), glm::dvec3(b, 0), glm::dvec3(c, 0));
		return glm::dot(norm, glm::dvec3(0, 0, 1)) > 0.0;
	}

	IfcCurve<2> GetRectangleCurve(double xdim, double ydim, glm::dmat3 placement = glm::dmat3(1))
	{
		double halfX = xdim / 2;
		double halfY = ydim / 2;

		glm::dvec2 bl = placement * glm::dvec3(-halfX, -halfY, 1);
		glm::dvec2 br = placement * glm::dvec3(halfX, -halfY, 1);

		glm::dvec2 tl = placement * glm::dvec3(-halfX, halfY, 1);
		glm::dvec2 tr = placement * glm::dvec3(halfX, halfY, 1);

		IfcCurve<2> c;
		c.points.push_back(bl);
		c.points.push_back(br);
		c.points.push_back(tr);
		c.points.push_back(tl);
		c.points.push_back(bl);

		if (MatrixFlipsTriangles(placement))
		{
			c.Invert();
		}

		return c;
	}

	IfcCurve<2> GetIShapedCurve(double width, double depth, double webThickness, double flangeThickness, bool hasFillet, double filletRadius, glm::dmat3 placement = glm::dmat3(1))
	{
		IfcCurve<2> c;

		double hw = width / 2;
		double hd = depth / 2;
		double hweb = webThickness / 2;

		c.points.push_back(placement * glm::dvec3(-hw, +hd, 1));				   // TL
		c.points.push_back(placement * glm::dvec3(+hw, +hd, 1));				   // TR
		c.points.push_back(placement * glm::dvec3(+hw, +hd - flangeThickness, 1)); // TR knee

		if (hasFillet)
		{
			// TODO: interpolate
			c.points.push_back(placement * glm::dvec3(+hweb + filletRadius, +hd - flangeThickness, 1)); // TR elbow start
			c.points.push_back(placement * glm::dvec3(+hweb, +hd - flangeThickness - filletRadius, 1)); // TR elbow end

			c.points.push_back(placement * glm::dvec3(+hweb, -hd + flangeThickness + filletRadius, 1)); // BR elbow start
			c.points.push_back(placement * glm::dvec3(+hweb + filletRadius, -hd + flangeThickness, 1)); // BR elbow end
		}
		else
		{
			c.points.push_back(placement * glm::dvec3(+hweb, +hd - flangeThickness, 1)); // TR elbow
			c.points.push_back(placement * glm::dvec3(+hweb, -hd + flangeThickness, 1)); // BR elbow
		}

		c.points.push_back(placement * glm::dvec3(+hw, -hd + flangeThickness, 1)); // BR knee
		c.points.push_back(placement * glm::dvec3(+hw, -hd, 1));				   // BR

		c.points.push_back(placement * glm::dvec3(-hw, -hd, 1));				   // BL
		c.points.push_back(placement * glm::dvec3(-hw, -hd + flangeThickness, 1)); // BL knee

		if (hasFillet)
		{
			// TODO: interpolate
			c.points.push_back(placement * glm::dvec3(-hweb - filletRadius, -hd + flangeThickness, 1)); // BL elbow start
			c.points.push_back(placement * glm::dvec3(-hweb, -hd + flangeThickness + filletRadius, 1)); // BL elbow end

			c.points.push_back(placement * glm::dvec3(-hweb, +hd - flangeThickness - filletRadius, 1)); // TL elbow start
			c.points.push_back(placement * glm::dvec3(-hweb - filletRadius, +hd - flangeThickness, 1)); // TL elbow end
		}
		else
		{
			c.points.push_back(placement * glm::dvec3(-hweb, -hd + flangeThickness, 1)); // BL elbow
			c.points.push_back(placement * glm::dvec3(-hweb, +hd - flangeThickness, 1)); // TL elbow
		}

		c.points.push_back(placement * glm::dvec3(-hw, +hd - flangeThickness, 1)); // TL knee
		c.points.push_back(placement * glm::dvec3(-hw, +hd, 1));				   // TL

		if (MatrixFlipsTriangles(placement))
		{
			c.Invert();
		}

		return c;
	}

	IfcCurve<2> GetUShapedCurve(double depth, double flangeWidth, double webThickness, double flangeThickness, double filletRadius, double edgeRadius, double flangeSlope, glm::dmat3 placement = glm::dmat3(1))
	{
		IfcCurve<2> c;

		double hd = depth / 2;
		double hw = flangeWidth / 2;
		double hweb = webThickness / 2;
		double slopeOffsetRight = flangeSlope * hw;
		double slopeOffsetLeft = flangeSlope * (hw - webThickness);
		double flangeReferencePointY = hd - flangeThickness;

		// TODO: implement the radius

		c.points.push_back(placement * glm::dvec3(-hw, +hd, 1));
		c.points.push_back(placement * glm::dvec3(+hw, +hd, 1));

		c.points.push_back(placement * glm::dvec3(+hw, +hd - flangeThickness + slopeOffsetRight, 1));

		c.points.push_back(placement * glm::dvec3(-hw + webThickness, +hd - flangeThickness, 1 - slopeOffsetLeft));
		c.points.push_back(placement * glm::dvec3(-hw + webThickness, -hd + flangeThickness, 1 + slopeOffsetLeft));

		c.points.push_back(placement * glm::dvec3(+hw, -hd + flangeThickness - slopeOffsetRight, 1));

		c.points.push_back(placement * glm::dvec3(+hw, -hd, 1));
		c.points.push_back(placement * glm::dvec3(-hw, -hd, 1));

		c.points.push_back(placement * glm::dvec3(-hw, +hd, 1));

		if (MatrixFlipsTriangles(placement))
		{
			c.Invert();
		}

		return c;
	}

	IfcCurve<2> GetLShapedCurve(double width, double depth, double thickness, bool hasFillet, double filletRadius, double edgeRadius, double legSlope, glm::dmat3 placement = glm::dmat3(1))
	{
		IfcCurve<2> c;

		double hw = width / 2;
		double hd = depth / 2;
		double hweb = thickness / 2;

		c.points.push_back(placement * glm::dvec3(+hw, +hd, 1));
		c.points.push_back(placement * glm::dvec3(+hw, -hd, 1));
		c.points.push_back(placement * glm::dvec3(-hw, -hd, 1));

		if (hasFillet)
		{
			// TODO: Create interpolation and sloped lines
		}
		else
		{
			c.points.push_back(placement * glm::dvec3(-hw, -hd + thickness, 1));
			c.points.push_back(placement * glm::dvec3(+hw - thickness, -hd + thickness, 1));
			c.points.push_back(placement * glm::dvec3(+hw - thickness, +hd, 1));
		}

		c.points.push_back(placement * glm::dvec3(+hw, +hd, 1));

		if (MatrixFlipsTriangles(placement))
		{
			c.Invert();
		}

		return c;
	}

	glm::dvec2 BSplineInverseEvaluation(glm::dvec3 pt, tinynurbs::RationalSurface3d srf)
	{
		// Dades inicials

		glm::highp_dvec3 ptc = tinynurbs::surfacePoint(srf, 0.0, 0.0);
		glm::highp_dvec3 pth = tinynurbs::surfacePoint(srf, 1.0, 0.0);
		glm::highp_dvec3 ptv = tinynurbs::surfacePoint(srf, 0.0, 1.0);

		double dh = glm::distance(ptc, pth);
		double dv = glm::distance(ptc, ptv);
		double pr = (dh + 1) / (dv + 1);

		double step1 = 0.01;
		double minError = 0.0001;
		double maxError = 0.01;
		double rotacions = 6;
		double stepOld = step1;

		// Primera ronda

		double fU = 0.5;
		double fV = 0.5;
		double divisor = 100;
		double maxdi = 1e+100;
		double extension = 0;

		while (maxdi > maxError && divisor < 10000)
		{
			for (double r = 1; r < 5; r++)
			{
				int round = 0;
				while (maxdi > minError && round < 3)
				{
					for (double i = 0; i < rotacions; i++)
					{
						double rads = (i / rotacions) * CONST_PI * 2;
						double incU = glm::sin(rads) / (r * r * divisor);
						double incV = glm::cos(rads) / (r * r * divisor);
						if (pr > 1)
						{
							incV *= pr;
						}
						else
						{
							incU /= pr;
						}
						bool repeat = true;
						while (repeat)
						{
							double ffU = fU + incU;
							double ffV = fV + incV;
							glm::highp_dvec3 pt00 = tinynurbs::surfacePoint(srf, ffU, ffV);
							double di = glm::distance(pt00, pt);
							if (di < maxdi)
							{
								maxdi = di;
								fU = ffU;
								fV = ffV;
							}
							else
							{
								repeat = false;
							}
						}
					}
					round++;
				}
			}
			divisor *= 3;
		}

		// If first method fails to provide a precise solution we use second slow but reliable method
		double repetition = 0;
		double maxdis = maxdi;
		double fUs = fU;
		double fVs = fV;
		while (maxdi > maxError && repetition < 8)
		{
			double extension = 1;
			double repetitionTemp = repetition;
			while (repetitionTemp > 4)
			{
				repetitionTemp -= 3;
				extension++;
			}
			if (repetitionTemp == 0)
			{
				fU = extension;
				fV = 0;
			}
			if (repetitionTemp == 1)
			{
				fU = 0;
				fV = extension;
			}
			if (repetitionTemp == 2)
			{
				fU = -extension;
				fV = 0;
			}
			if (repetitionTemp == 3)
			{
				fU = 0;
				fV = -extension;
			}

			maxdi = 1e+100;
			divisor = 100;
			rotacions = 6;
			while (maxdi > maxError && divisor < 10000)
			{
				for (double r = 1; r < 5; r++)
				{
					int round = 0;
					while (maxdi > minError && round < 3)
					{
						for (double i = 0; i < rotacions; i++)
						{
							double rads = (i / rotacions) * CONST_PI * 2;
							double incU = glm::sin(rads) / (r * r * divisor);
							double incV = glm::cos(rads) / (r * r * divisor);
							if (pr > 1)
							{
								incV *= pr;
							}
							else
							{
								incU /= pr;
							}
							bool repeat = true;
							while (repeat)
							{
								double ffU = fU + incU;
								double ffV = fV + incV;
								glm::highp_dvec3 pt00 = tinynurbs::surfacePoint(srf, ffU, ffV);
								double di = glm::distance(pt00, pt);
								if (di < maxdi)
								{
									maxdi = di;
									fU = ffU;
									fV = ffV;
									if (di < maxdis)
									{
										maxdis = di;
										fUs = ffU;
										fVs = ffV;
									}
								}
								else
								{
									repeat = false;
								}
							}
						}
						round++;
					}
				}
				divisor *= 3;
			}
			repetition++;
		}

		// If the second method fails then we go to the third method
		while (maxdi > maxError * 3 && repetition < 32)
		{
			double extension = 1;
			double repetitionTemp = repetition;
			while (repetitionTemp > 7)
			{
				repetitionTemp -= 8;
				extension++;
			}
			if (repetitionTemp == 0)
			{
				fU = extension;
				fV = 0;
			}
			if (repetitionTemp == 1)
			{
				fU = 0;
				fV = extension;
			}
			if (repetitionTemp == 2)
			{
				fU = -extension;
				fV = 0;
			}
			if (repetitionTemp == 3)
			{
				fU = 0;
				fV = -extension;
			}

			if (repetitionTemp == 4)
			{
				fU = extension * 0.707;
				fV = extension * 0.707;
			}
			if (repetitionTemp == 5)
			{
				fU = -extension * 0.707;
				fV = extension * 0.707;
			}
			if (repetitionTemp == 6)
			{
				fU = extension * 0.707;
				fV = -extension * 0.707;
			}
			if (repetitionTemp == 7)
			{
				fU = -extension * 0.707;
				fV = -extension * 0.707;
			}

			maxdi = 1e+100;
			divisor = 100;
			rotacions = 6;
			while (maxdi > maxError && divisor < 10000)
			{
				for (double r = 1; r < 5; r++)
				{
					int round = 0;
					while (maxdi > minError && round < 3)
					{
						for (double i = 0; i < rotacions; i++)
						{
							double rads = (i / rotacions) * CONST_PI * 2;
							double incU = glm::sin(rads) / (r * r * divisor);
							double incV = glm::cos(rads) / (r * r * divisor);
							if (pr > 1)
							{
								incV *= pr;
							}
							else
							{
								incU /= pr;
							}
							bool repeat = true;
							while (repeat)
							{
								double ffU = fU + incU;
								double ffV = fV + incV;
								glm::highp_dvec3 pt00 = tinynurbs::surfacePoint(srf, ffU, ffV);
								double di = glm::distance(pt00, pt);
								if (di < maxdi)
								{
									maxdi = di;
									fU = ffU;
									fV = ffV;
									if (di < maxdis)
									{
										maxdis = di;
										fUs = ffU;
										fVs = ffV;
									}
								}
								else
								{
									repeat = false;
								}
							}
						}
						round++;
					}
				}
				divisor *= 3;
			}
			repetition++;
		}

		return glm::dvec2(fUs, fVs);
	}

	glm::dvec2 InterpolateRationalBSplineCurveWithKnots(double t, int degree, std::vector<glm::dvec2> points, std::vector<double> knots, std::vector<double> weights)
	{

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
		for (int i = 0; i < points.size(); i++)
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

	std::vector<glm::dvec2> GetRationalBSplineCurveWithKnots(int degree, std::vector<glm::dvec2> points, std::vector<double> knots, std::vector<double> weights)
	{
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

	glm::dvec3 InterpolateRationalBSplineCurveWithKnots(double t, int degree, std::vector<glm::dvec3> points, std::vector<double> knots, std::vector<double> weights)
	{
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

		// TODO: this should be done before calling the function, instead of calling it for each t
		// convert points to homogeneous coordinates
		std::vector<glm::dvec4> homogeneousPoints;
		for (int i = 0; i < points.size(); i++)
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

	std::vector<glm::dvec3> GetRationalBSplineCurveWithKnots(int degree, std::vector<glm::dvec3> points, std::vector<double> knots, std::vector<double> weights)
	{

		std::vector<glm::dvec3> c;

		for (double i = 0; i < 1; i += 0.05)
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

	glm::dvec3 projectOntoPlane(const glm::dvec3 &origin, const glm::dvec3 &normal, const glm::dvec3 &point, const glm::dvec3 &dir)
	{
		// project {et} onto the plane, following the extrusion normal
		double ldotn = glm::dot(dir, normal);
		if (ldotn == 0)
		{
			printf("0 direction in extrude\n");
			return glm::dvec3(0);
		}
		else
		{
			glm::dvec3 dpos = origin - glm::dvec3(point);
			double dist = glm::dot(dpos, normal) / ldotn;
			return point + dist * dir;
		}
	}

	bool GetBasisFromCoplanarPoints(std::vector<glm::dvec3> &points, glm::dvec3 &v1, glm::dvec3 &v2, glm::dvec3 &v3)
	{
		v1 = points[0];

		for (auto &p : points)
		{
			if (v1 != p)
			{
				v2 = p;
				break;
			}
		}

		glm::dvec3 normal;
		// multiple tries to find the best match
		for (double i = 0; i < 4; i++)
		{
			double EPS = EPS_SMALL;
			if (i == 0)
			{
				EPS = 100;
			}
			if (i == 1)
			{
				EPS = 1;
			}
			if (i == 2)
			{
				EPS = 0.01;
			}
			for (auto &p : points)
			{
				if (computeSafeNormal(v1, v2, p, normal, EPS))
				{
					v3 = p;
					return true;
				}
			}
		}

		return false;
	}

	enum class IfcBoundType
	{
		OUTERBOUND,
		BOUND
	};

	// TODO: IfcBound3D can probably be merged with IfcProfile
	struct IfcBound3D
	{
		IfcBoundType type;
		bool orientation;
		IfcCurve3D curve;
	};

	std::array<double, 16> FlattenTransformation(const glm::dmat4 &transformation)
	{
		std::array<double, 16> flatTransformation;

		for (int i = 0; i < 4; i++)
		{
			for (int j = 0; j < 4; j++)
			{
				flatTransformation[i * 4 + j] = transformation[i][j];
			}
		}

		return flatTransformation;
	}

	struct IfcPlacedGeometry
	{
		glm::dvec4 color;
		glm::dmat4 transformation;
		std::array<double, 16> flatTransformation;
		uint32_t geometryExpressID;

		void SetFlatTransformation()
		{
			flatTransformation = FlattenTransformation(transformation);
		}
	};

	struct IfcFlatMesh
	{
		std::vector<IfcPlacedGeometry> geometries;
		uint32_t expressID;
	};

	struct IfcComposedMesh
	{
		glm::dvec4 color;
		glm::dmat4 transformation;
		uint32_t expressID;
		bool hasGeometry = false;
		bool hasColor = false;
		std::vector<IfcComposedMesh> children;

		std::optional<glm::dvec4> GetColor()
		{
			if (hasColor)
			{
				return color;
			}
			else
			{
				for (auto &c : children)
				{
					auto col = c.GetColor();
					if (col.has_value())
					{
						return col;
					}
				}
			}

			return std::nullopt;
		}
	};

	std::optional<glm::dvec3> GetOriginRec(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap, glm::dmat4 mat)
	{
		glm::dmat4 newMat = mat * mesh.transformation;

		bool transformationBreaksWinding = MatrixFlipsTriangles(newMat);

		auto geomIt = geometryMap.find(mesh.expressID);

		if (geomIt != geometryMap.end())
		{
			auto meshGeom = geomIt->second;

			if (meshGeom.numFaces)
			{
				for (uint32_t i = 0; i < meshGeom.numFaces; i++)
				{
					Face f = meshGeom.GetFace(i);
					glm::dvec3 a = newMat * glm::dvec4(meshGeom.GetPoint(f.i0), 1);

					return a;
				}
			}
		}

		for (auto &c : mesh.children)
		{
			auto v = GetOriginRec(c, geometryMap, newMat);
			if (v.has_value())
			{
				return v;
			}
		}

		return std::nullopt;
	}

	glm::dvec3 GetOrigin(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap)
	{
		auto v = GetOriginRec(mesh, geometryMap, glm::dmat4(1));

		if (v.has_value())
		{
			return *v;
		}
		else
		{
			return glm::dvec3(0);
		}
	}

	void flattenRecursive(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap, IfcGeometry &geom, glm::dmat4 mat)
	{
		glm::dmat4 newMat = mat * mesh.transformation;

		bool transformationBreaksWinding = MatrixFlipsTriangles(newMat);

		auto geomIt = geometryMap.find(mesh.expressID);

		if (geomIt != geometryMap.end())
		{
			auto meshGeom = geomIt->second;

			if (meshGeom.numFaces)
			{
				for (uint32_t i = 0; i < meshGeom.numFaces; i++)
				{
					Face f = meshGeom.GetFace(i);
					glm::dvec3 a = newMat * glm::dvec4(meshGeom.GetPoint(f.i0), 1);
					glm::dvec3 b = newMat * glm::dvec4(meshGeom.GetPoint(f.i1), 1);
					glm::dvec3 c = newMat * glm::dvec4(meshGeom.GetPoint(f.i2), 1);

					if (transformationBreaksWinding)
					{
						geom.AddFace(b, a, c);
					}
					else
					{
						geom.AddFace(a, b, c);
					}
				}
			}
		}

		for (auto &c : mesh.children)
		{
			flattenRecursive(c, geometryMap, geom, newMat);
		}
	}

	IfcGeometry flatten(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap, glm::dmat4 mat = glm::dmat4(1))
	{
		IfcGeometry geom;
		flattenRecursive(mesh, geometryMap, geom, mat);
		return geom;
	}

	std::vector<glm::dvec2> rescale(std::vector<glm::dvec2> input, glm::dvec2 size, glm::dvec2 offset)
	{
		std::vector<glm::dvec2> retval;

		glm::dvec2 min(
			DBL_MAX,
			DBL_MAX);

		glm::dvec2 max(
			-DBL_MAX,
			-DBL_MAX);

		for (auto &pt : input)
		{
			min = glm::min(min, pt);
			max = glm::max(max, pt);
		}

		double width = max.x - min.x;
		double height = max.y - min.y;

		double maxSize = std::max(width, height);

		if (width == 0 && height == 0)
		{
			printf("asdf\n");
		}

		for (auto &pt : input)
		{
			// here we invert Y, since the canvas +y is down, but makes more sense to think about +y as up
			retval.emplace_back(
				((pt.x - min.x) / (maxSize)) * size.x + offset.x,
				(size.y - ((pt.y - min.y) / (maxSize)) * size.y) + offset.y);
		}

		return retval;
	}

	std::string makeSVGLines(std::vector<glm::dvec2> input, std::vector<uint32_t> indices)
	{
		glm::dvec2 size(512, 512);
		glm::dvec2 offset(5, 5);

		auto rescaled = rescale(input, size, offset);

		std::stringstream svg;

		svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << "\" xmlns=\"http://www.w3.org/2000/svg\" >";

		if (!rescaled.empty())
		{
			for (int i = 1; i < 2; i++)
			{
				auto &start = rescaled[i - 1];
				auto &end = rescaled[i];
				svg << "<line x1=\"" << start.x << "\" y1=\"" << start.y << "\" ";
				svg << "x2=\"" << end.x << "\" y2=\"" << end.y << "\" ";
				svg << "style = \"stroke:rgb(0,255,0);stroke-width:2\" />";
			}

			for (int i = 2; i < rescaled.size() - 1; i++)
			{
				auto &start = rescaled[i - 1];
				auto &end = rescaled[i];
				svg << "<line x1=\"" << start.x << "\" y1=\"" << start.y << "\" ";
				svg << "x2=\"" << end.x << "\" y2=\"" << end.y << "\" ";
				svg << "style = \"stroke:rgb(0,0,0);stroke-width:2\" />";
			}

			for (int i = rescaled.size() - 1; i < rescaled.size(); i++)
			{
				auto &start = rescaled[i - 1];
				auto &end = rescaled[i];
				svg << "<line x1=\"" << start.x << "\" y1=\"" << start.y << "\" ";
				svg << "x2=\"" << end.x << "\" y2=\"" << end.y << "\" ";
				svg << "style = \"stroke:rgb(255,0,0);stroke-width:2\" />";
			}
		}

		for (int i = 0; i < indices.size(); i += 3)
		{
			glm::dvec2 a = rescaled[indices[i + 0]];
			glm::dvec2 b = rescaled[indices[i + 1]];
			glm::dvec2 c = rescaled[indices[i + 2]];

			svg << "<polygon points=\"" << a.x << "," << a.y << " " << b.x << "," << b.y << " " << c.x << "," << c.y << "\" style=\"fill:gray; stroke:none; stroke - width:0\" />`;";
		}

		svg << "</svg>";

		return svg.str();
	}

	void DumpSVGCurve(std::vector<glm::dvec2> points, std::wstring filename, std::vector<uint32_t> indices = {})
	{
		writeFile(filename, makeSVGLines(points, indices));
	}

	void DumpSVGCurve(std::vector<glm::dvec3> points, glm::vec3 dir, std::wstring filename, std::vector<uint32_t> indices = {})
	{
		std::vector<glm::dvec2> points2D;
		for (auto &pt : points)
		{
			points2D.emplace_back(pt.x, pt.z);
		}
		DumpSVGCurve(points2D, filename, indices);
	}

	struct Point
	{
		double x;
		double y;
		int32_t id = -1;
		bool isBoundary = false;

		Point()
		{
		}

		Point(double xx, double yy)
		{
			x = xx;
			y = yy;
		}

		Point(glm::dvec2 p)
		{
			x = p.x;
			y = p.y;
		}

		glm::dvec2 operator()() const
		{
			return glm::dvec2(
				x, y);
		}
	};

	struct Triangle
	{
		Point a;
		Point b;
		Point c;

		int32_t id = -1;
	};

	struct Edge
	{
		int32_t a = -1;
		int32_t b = -1;
	};

	struct Bounds
	{
		glm::dvec2 min;
		glm::dvec2 max;
	};

	glm::dvec2 cmin(glm::dvec2 m, Point p)
	{
		return glm::dvec2(
			std::min(m.x, p.x),
			std::min(m.y, p.y));
	}

	glm::dvec2 cmax(glm::dvec2 m, Point p)
	{
		return glm::dvec2(
			std::max(m.x, p.x),
			std::max(m.y, p.y));
	}

	Bounds getBounds(std::vector<Triangle> input, glm::dvec2 size, glm::dvec2 offset)
	{
		std::vector<glm::dvec2> retval;

		glm::dvec2 min(
			DBL_MAX,
			DBL_MAX);

		glm::dvec2 max(
			-DBL_MAX,
			-DBL_MAX);

		for (auto &tri : input)
		{
			min = cmin(min, tri.a);
			max = cmax(max, tri.a);

			min = cmin(min, tri.b);
			max = cmax(max, tri.b);

			min = cmin(min, tri.c);
			max = cmax(max, tri.c);
		}

		double width = max.x - min.x;
		double height = max.y - min.y;

		if (width == 0 && height == 0)
		{
			printf("asdf");
		}

		return {
			min,
			max};
	}

	Bounds getBounds(std::vector<std::vector<glm::dvec2>> input, glm::dvec2 size, glm::dvec2 offset)
	{
		std::vector<glm::dvec2> retval;

		glm::dvec2 min(
			DBL_MAX,
			DBL_MAX);

		glm::dvec2 max(
			-DBL_MAX,
			-DBL_MAX);

		for (auto &loop : input)
		{
			for (auto &point : loop)
			{
				min = glm::min(min, point);
				max = glm::max(max, point);
			}
		}

		double width = max.x - min.x;
		double height = max.y - min.y;

		if (width == 0 && height == 0)
		{
			printf("asdf");
		}

		return {
			min,
			max};
	}

	glm::dvec2 rescale(Point p, Bounds b, glm::dvec2 size, glm::dvec2 offset)
	{
		return glm::dvec2(
			((p.x - b.min.x) / (b.max.x - b.min.x)) * size.x + offset.x,
			((p.y - b.min.y) / (b.max.y - b.min.y)) * size.y + offset.y);
	}

	void svgMakeLine(glm::dvec2 a, glm::dvec2 b, std::stringstream &svg)
	{
		svg << "<line x1=\"" << a.x << "\" y1=\"" << a.y << "\" ";
		svg << "x2=\"" << b.x << "\" y2=\"" << b.y << "\" ";
		svg << "style = \"stroke:rgb(255,0,0);stroke-width:1\" />";
	}

	std::string makeSVGTriangles(std::vector<Triangle> triangles, Point p, Point prev, std::vector<Point> pts = {})
	{
		glm::dvec2 size(512, 512);
		glm::dvec2 offset(5, 5);

		Bounds bounds = getBounds(triangles, size, offset);

		std::stringstream svg;

		svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << "  \" xmlns=\"http://www.w3.org/2000/svg\" >";

		for (auto &t : triangles)
		{
			if (t.id != -1)
			{
				glm::dvec2 a = rescale(t.a, bounds, size, offset);
				glm::dvec2 b = rescale(t.b, bounds, size, offset);
				glm::dvec2 c = rescale(t.c, bounds, size, offset);

				svgMakeLine(a, b, svg);
				svgMakeLine(b, c, svg);
				svgMakeLine(c, a, svg);
			}
		}

		glm::dvec2 rp = rescale(p, bounds, size, offset);
		glm::dvec2 rprev = rescale(prev, bounds, size, offset);

		if (p.id != -1)
		{
			svg << "<circle cx = \"" << rp.x << "\" cy = \"" << rp.y << "\" r = \"3\" style = \"stroke:rgb(0,0,255);stroke-width:2\" />";
		}

		if (prev.id != -1)
		{
			svg << "<circle cx = \"" << rprev.x << "\" cy = \"" << rprev.y << "\" r = \"3\" style = \"stroke:rgb(0,0,100);stroke-width:2\" />";
		}

		for (auto &pt : pts)
		{
			glm::dvec2 p = rescale(pt, bounds, size, offset);
			svg << "<circle cx = \"" << p.x << "\" cy = \"" << p.y << "\" r = \"1\" style = \"stroke:rgb(0,0,100);stroke-width:2\" />";
		}

		svg << "</svg>";

		return svg.str();
	}

	glm::dvec2 rescale(glm::dvec2 p, Bounds b, glm::dvec2 size, glm::dvec2 offset)
	{
		return glm::dvec2(
			((p.x - b.min.x) / (b.max.x - b.min.x)) * size.x + offset.x,
			((p.y - b.min.y) / (b.max.y - b.min.y)) * size.y + offset.y);
	}

	std::string makeSVGLines(std::vector<std::vector<glm::dvec2>> lines)
	{
		glm::dvec2 size(2048, 2048);
		glm::dvec2 offset(5, 5);

		Bounds bounds = getBounds(lines, size, offset);

		std::stringstream svg;

		svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << " \" xmlns=\"http://www.w3.org/2000/svg\">";

		for (auto &line : lines)
		{
			if (line.size() > 1)
			{
				for (int i = 1; i < line.size(); i++)
				{
					glm::dvec2 a = rescale(line[i], bounds, size, offset);
					glm::dvec2 b = rescale(line[i - 1], bounds, size, offset);

					svgMakeLine(a, b, svg);
				}
			}
			else
			{
				glm::dvec2 a = rescale(line[0], bounds, size, offset);
				svg << "<circle cx = \"" << a.x << "\" cy = \"" << a.y << "\" r = \"3\" style = \"stroke:rgb(0,0,255);stroke-width:2\" />";
			}
		}

		svg << "</svg>";

		return svg.str();
	}

	void DumpSVGTriangles(std::vector<Triangle> triangles, Point p, Point prev, std::wstring filename, std::vector<Point> pts = {})
	{
		writeFile(filename, makeSVGTriangles(triangles, p, prev, pts));
	}

	void DumpSVGLines(std::vector<std::vector<glm::dvec2>> lines, std::wstring filename)
	{
		writeFile(filename, makeSVGLines(lines));
	}

	bool isConvexOrColinear(glm::dvec2 a, glm::dvec2 b, glm::dvec2 c)
	{
		return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) >= 0;
	}

	glm::dmat4 NormalizeIFC(
		glm::dvec4(1, 0, 0, 0),
		glm::dvec4(0, 0, -1, 0),
		glm::dvec4(0, 1, 0, 0),
		glm::dvec4(0, 0, 0, 1));

	double areaOfTriangle(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
	{
		glm::dvec3 ab = b - a;
		glm::dvec3 ac = c - a;

		glm::dvec3 norm = glm::cross(ab, ac);
		return glm::length(norm) / 2;
	}

	double cross2d(const glm::dvec2 &point1, const glm::dvec2 &point2)
	{
		return point1.x * point2.y - point1.y * point2.x;
	}

	double areaOfTriangle(glm::dvec2 a, glm::dvec2 b, glm::dvec2 c)
	{
		glm::dvec2 ab = b - a;
		glm::dvec2 ac = c - a;

		double norm = cross2d(ab, ac) / 2;
		return std::fabs(norm);
	}

	// https://en.wikipedia.org/wiki/Barycentric_coordinate_system
	glm::dvec3 ToBary(const glm::dvec3 &a, const glm::dvec3 &b, const glm::dvec3 &c, const glm::dvec3 &pt)
	{
		glm::dvec3 E1 = b - a;
		glm::dvec3 E2 = c - a;
		glm::dvec3 ROV0 = pt - a;
		glm::dvec3 N = glm::cross(E1, E2);
		glm::dvec3 dir = -N;
		glm::dvec3 Q = glm::cross(ROV0, dir);
		double d = dot(dir, N);

		if (d == 0)
		{
			printf("bary conversion perp");
		}

		double det = 1.0 / d;
		double u = det * glm::dot(E2, (Q * -1.0));
		double v = det * glm::dot(E1, Q);
		double w = 1 - u - v;

		return glm::dvec3(w, u, v);
	}

	glm::dvec2 FromBary(const glm::dvec2 &a, const glm::dvec2 &b, const glm::dvec2 &c, const glm::dvec3 &pt)
	{
		return pt.x * a + pt.y * b + pt.z * c;
	}

	// assume 0,0 1,0 0,1 triangle
	glm::dvec3 ToBary2(const glm::dvec2 &pt)
	{
		double v = pt.x;
		double w = pt.y;
		double u = 1 - v - w;

		return glm::dvec3(u, v, w);
	}

	glm::dvec3 FromBary(const glm::dvec3 &a, const glm::dvec3 &b, const glm::dvec3 &c, const glm::dvec3 &pt)
	{
		return pt.x * a + pt.y * b + pt.z * c;
	}

	void CheckTriangle(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
	{
		if (areaOfTriangle(a, b, c) == 0)
		{
			printf("0 triangle\n");
		}
	}

	void CheckTriangle(Face &f, std::vector<glm::dvec3> &pts)
	{
		if (areaOfTriangle(pts[f.i0], pts[f.i1], pts[f.i2]) == 0)
		{
			printf("0 triangle\n");
		}
	}

	double RandomDouble(double lo, double hi)
	{
		return lo + static_cast<double>(rand()) / (static_cast<double>(RAND_MAX / (hi - lo)));
	}

	std::string ToObj(const IfcGeometry &geom, size_t &offset, glm::dmat4 transform = glm::dmat4(1))
	{
		std::stringstream obj;

		double scale = 1.0;

		for (uint32_t i = 0; i < geom.numPoints; i++)
		{
			glm::dvec4 t = transform * glm::dvec4(geom.GetPoint(i), 1);
			obj << "v " << t.x * scale << " " << t.y * scale << " " << t.z * scale << "\n";
		}

		for (uint32_t i = 0; i < geom.numFaces; i++)
		{
			Face f = geom.GetFace(i);
			obj << "f " << (f.i0 + 1 + offset) << "// " << (f.i1 + 1 + offset) << "// " << (f.i2 + 1 + offset) << "//\n";
		}

		offset += geom.numPoints;

		return obj.str();
	}

	std::string ToObj(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap, size_t &offset, glm::dmat4 mat = glm::dmat4(1))
	{
		std::string complete;

		glm::dmat4 trans = mat * mesh.transformation;

		auto &geom = geometryMap[mesh.expressID];

		complete += ToObj(geom, offset, trans);

		for (auto c : mesh.children)
		{
			complete += ToObj(c, geometryMap, offset, trans);
		}

		return complete;
	}

	void DumpIfcGeometry(const IfcGeometry &geom, std::wstring filename)
	{
		size_t offset = 0;
		writeFile(filename, ToObj(geom, offset));
	}

	// This class defines a datachunk that can be loaded and unloaded from an external source file
	template <uint32_t N>
	class chunkUnit
	{
	public:
		void clear()
		{
			std::vector<uint8_t>().swap(chunk);
			loaded = false;
		}

		void initialize()
		{
			chunk.resize(N);
		}

		size_t size;
		bool loaded = false;
		uint32_t timesLoaded = 0;
		std::vector<uint8_t> chunk;

	private:
	};

	//! This is essentially a chunked tightly packed dynamic array
	template <uint32_t N>
	class DynamicTape
	{
	public:
		DynamicTape()
		{
			AddChunk();
		}

		inline void unLoadChunk(uint32_t ChunkIndex)
		{
			std::cout << "Unloading chunk " + std::to_string(ChunkIndex) << std::endl;
			chunks[ChunkIndex].clear();
			loadedMemory -= chunks[ChunkIndex].size;
		}

		inline void loadChunk(uint32_t ChunkIndex)
		{
			std::cout << "Loading chunk " + std::to_string(ChunkIndex) << std::endl;
			chunks[ChunkIndex].initialize();
			LoadFromDisk(ChunkIndex);
			chunks[ChunkIndex].timesLoaded++;
			loadedMemory += chunks[ChunkIndex].size;
		}

		inline void updateMemory()
		{
			loadedMemory = 0;
			for (int i = 0; i < chunks.size(); i++)
			{
				if (chunks[i].loaded)
				{
					loadedMemory += chunks[i].size;
				}
			}
		}

		inline void updateChunks()
		{
			if (serialize)
			{
				if (readChunkIndex < chunks.size())
				{
					if (!chunks[readChunkIndex].loaded)
					{
						loadChunk(readChunkIndex);
					}
				}
				if (loadedMemory > ramLimit)
				{
					uint32_t times = 1;
					bool cont = true;
					while (cont)
					{
						for (int i = 0; i < chunks.size(); i++)
						{

							if (loadedMemory > ramLimit)
							{
								if (chunks[i].timesLoaded == times)
								{
									if (i != readChunkIndex && chunks[i].loaded)
									{
										unLoadChunk(i);
									}
								}
							}
							else
							{
								cont = false;
								break;
							}
						}
						times++;
					}
				}
			}
		}

		inline void AddChunk()
		{
			chunks.emplace_back();
			chunks.back().initialize();
			writePtr++;
			chunks[writePtr].loaded = true;
			chunks[writePtr].timesLoaded = 1;
		}

		inline void storeChunk()
		{
			if (serialize)
			{
				DumpToDisk(writePtr);
				updateChunks();
			}
		}

		inline void CheckChunk(unsigned long long size)
		{
			if (chunks[writePtr].size + size >= N)
			{
				loadedMemory += chunks[writePtr].size;
				if (serialize)
				{
					storeChunk();
				}
				AddChunk();
			}
		}

		inline void push(char v)
		{
			CheckChunk(1);
			chunks.back().chunk.data()[chunks[writePtr].size] = v;
			chunks[writePtr].size += 1;
		}

		inline void push2(uint16_t v)
		{
			push(&v, 2);
		}

		inline void push(void *v, unsigned long long size)
		{
			CheckChunk(size);
			memcpy(chunks.back().chunk.data() + chunks[writePtr].size, v, size);
			chunks[writePtr].size += size;
		}

		inline void SetWriteAtEnd()
		{
			writePtr = chunks.size() - 1;
		}

		uint64_t GetTotalSize()
		{
			return (chunks.size() - 1) * N + chunks.back().size;
		}

		uint64_t GetCapacity()
		{
			return chunks.size() * N;
		}

		void Reset()
		{
			readChunkIndex = 0;
			readPtr = 0;
			updateChunks();
		}

		inline bool Expect(char expectedType)
		{
			auto receivedType = Read<char>();
			return (receivedType == expectedType);
		}

		template <typename T>
		inline T Read()
		{
			updateChunks();
			std::vector<uint8_t> &chunk = chunks[readChunkIndex].chunk;
			uint8_t *valuePtr = &chunk[readPtr];

			// T v = *(T*)(valuePtr);
			//  make this memory access aligned for emscripten

			T v;

			memcpy(&v, valuePtr, sizeof(T));

			AdvanceRead(sizeof(T));
			return v;
		}

		void *GetReadPtr()
		{
			updateChunks();
			std::vector<uint8_t> &chunk = chunks[readChunkIndex].chunk;
			uint8_t *valuePtr = &chunk[readPtr];

			return (void *)valuePtr;
		}

		StringView ReadStringView()
		{
			uint16_t length = Read<uint16_t>();
			char *charPtr = (char *)GetReadPtr();
			AdvanceRead(length);

			return StringView{charPtr, length};
		}

		inline void Reverse()
		{
			if (readPtr > 0)
			{
				readPtr--;
			}
			else
			{
				decreaseChunkIndex();
				readPtr = static_cast<uint32_t>(chunks[readChunkIndex].size - 1);
			}
		}

		inline bool AtEnd()
		{
			return readChunkIndex == chunks.size();
		}

		inline uint32_t GetReadOffset()
		{
			return readChunkIndex * N + readPtr;
		}

		inline void MoveTo(uint32_t pos)
		{
			readChunkIndex = pos / N;
			updateChunks();
			readPtr = pos % N;
		}

		void DumpToDisk(uint32_t num)
		{
			std::stringstream ss;
			ss << num;
			std::string str;
			ss >> str;
			std::ofstream file(serializedFileName + "_" + str + ".bin", std::ios::binary | std::ios::out);
			std::vector<uint8_t> &ch = chunks[num].chunk;
			file.write((char *)ch.data(), chunks[num].size);
			file.close();
			if (callbackActive)
			{
				std::string filename = serializedFileName + "_" + str + ".bin";
				_storeData(filename, chunks[num].size);
			}
		}

		void LoadFromDisk(uint32_t num)
		{
			uint64_t contador = 0;
			std::cout << "Loading " + BinPaths[num] << std::endl;
			std::ifstream bin_file(BinPaths[num], std::ios::binary | std::ios::out);
			if (bin_file.good())
			{
				/*Read Binary data using streambuffer iterators.*/
				std::vector<uint8_t> v_buf((std::istreambuf_iterator<char>(bin_file)), (std::istreambuf_iterator<char>()));
				for (int i = 0; i < v_buf.size(); i++)
				{
					chunks[num].chunk.data()[contador] = v_buf[i];
					contador++;
				}
				bin_file.close();
			}
			else
			{
				throw std::exception();
			}
			chunks[num].loaded = true;
		}

		void storeMetadata(uint32_t numLines)
		{
			std::stringstream ss;
			ss << chunks.size();
			std::string str;
			ss >> str;
			std::ofstream fout;
			fout.open(serializedFileName + "_" + str + ".bin");
			fout << chunks.size() << std::endl;
			for (int i = 0; i < chunks.size(); i++)
			{
				fout << chunks[i].size << std::endl;
			}
			fout << numLines << std::endl;
			fout.close();
			if (callbackActive)
			{
				std::string filename = serializedFileName + "_" + str + ".bin";
				_storeData(filename, 0);
			}
		}

		uint32_t loadMetadata()
		{
			chunks.clear();
			size_t _size;
			uint32_t idx = 0;
			std::ifstream meta(BinPaths[BinPaths.size() - 1]);
			uint32_t numChnks = 0;
			meta >> numChnks;
			while (meta >> _size)
			{
				chunks.emplace_back();
				chunks.back().initialize();
				chunks[idx].loaded = false;
				chunks[idx].size = _size;
				chunks[idx].timesLoaded = 1;
				idx++;
				if (idx == numChnks)
				{
					break;
				}
			}
			uint32_t numLns = 0;
			meta >> numLns;
			meta.close();
			return numLns;
		}

		uint32_t Copy(uint32_t offset, uint32_t endOffset, uint8_t *dest)
		{
			uint32_t chunkStart = offset / N;
			uint32_t chunkStartPos = offset % N;

			uint32_t chunkEnd = endOffset / N;
			uint32_t chunkEndPos = endOffset % N;

			if (serialize)
			{
				loadChunk(chunkStart);
				loadChunk(chunkEnd);
			}
			if (chunkStart == chunkEnd)
			{
				memcpy(dest, &chunks[chunkStart].chunk[chunkStartPos], chunkEndPos - chunkStartPos);
				updateChunks();

				return chunkEndPos - chunkStartPos;
			}
			else
			{
				uint32_t startChunkSize = chunks[chunkStart].size;
				uint32_t partOfStartchunk = startChunkSize - chunkStartPos;
				memcpy(dest, &chunks[chunkStart].chunk[chunkStartPos], partOfStartchunk);
				memcpy(dest + partOfStartchunk, &chunks[chunkEnd].chunk[0], chunkEndPos);
				updateChunks();

				return partOfStartchunk + chunkEndPos;
			}
		}

		inline void AdvanceRead(unsigned long long size)
		{
			updateChunks();
			readPtr += static_cast<uint32_t>(size);
			if (readPtr >= chunks[readChunkIndex].size)
			{
				increaseChunkIndex();
				readPtr = 0;
			}
		}

		inline void increaseChunkIndex()
		{
			readChunkIndex++;
			updateChunks();
		}

		inline void decreaseChunkIndex()
		{
			readChunkIndex--;
			updateChunks();
		}

		std::function<std::string(std::string, size_t)> _storeData;
		bool serialize = false;
		uint64_t ramLimit = 100000000;
		std::vector<std::string> BinPaths;
		std::string serializedFileName;
		bool callbackActive = false;

	private:
		uint32_t readPtr = 0;
		uint32_t readChunkIndex = 0;
		uint32_t writePtr = -1;
		uint64_t loadedMemory = 0;
		std::vector<chunkUnit<N>> chunks;
	};

}