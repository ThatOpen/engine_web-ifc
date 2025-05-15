/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

#pragma once

#if defined(DEBUG_DUMP_SVG) || defined(DUMP_CSG_MESHES)
#include "boolean-utils/svg.h"
#endif

#include <cstdint>
#include <spdlog/spdlog.h>
#include "../representation/geometry.h"
#include "../representation/IfcGeometry.h"
#include <mapbox/earcut.hpp>
#include "bim-geometry/utils.h"

namespace webifc::geometry
{

	inline double angleConversion(double angle, std::string angleUnits)
	{
		if(angleUnits == "RADIAN")
		{
			return angle;
		}
		else
		{
			angle = (angle / 360) * 2 * CONST_PI;
		}
		return angle;
	}

	inline IfcGeometry ToIfcGeometry(bimGeometry::Geometry geom)
	{
		IfcGeometry ifcGeom;
        ifcGeom.fvertexData = geom.fvertexData;
        ifcGeom.vertexData = geom.vertexData;
        ifcGeom.indexData = geom.indexData;
        ifcGeom.numPoints = geom.numPoints;
		ifcGeom.numFaces = geom.numFaces;
		if(ifcGeom.planeData.size() != ifcGeom.numFaces)
		{
			for (size_t i = 0; i < ifcGeom.numFaces; i++)
			{
				if(i >= ifcGeom.planeData.size())
				{
					ifcGeom.planeData.push_back(-1);
				}
			}
		}
		return ifcGeom;
	}

	inline	IfcGeometry Sweep(const double scaling, const bool closed, const IfcProfile &profile, const IfcCurve &directrix, const glm::dvec3 &initialDirectrixNormal = glm::dvec3(0), const bool rotate90 = false, const bool optimize = true)
	{
		IfcGeometry geom = ToIfcGeometry(bimGeometry::SweepFunction(scaling, closed, profile.curve.points, directrix.points, initialDirectrixNormal, rotate90, optimize));
		return geom;
	}

	inline	IfcGeometry SweepCircular(const double scaling, const bool closed, const IfcProfile &profile, const double radius, const IfcCurve &directrix, const glm::dvec3 &initialDirectrixNormal = glm::dvec3(0), const bool rotate90 = false)
	{
		spdlog::debug("[SweepCircular({})]");

		std::vector<glm::dvec3> profile_vector;
		std::vector<glm::dvec3> directrix_vector;
		// Remove repeated points
		for (size_t i = 0; i < directrix.points.size(); i++)
		{
			if (i < directrix.points.size() - 1)
			{
				if (glm::distance(directrix.points[i], directrix.points[i + 1]) > EPS_BIG2 * scaling)
				{
					directrix_vector.push_back(directrix.points[i]);
				}
			}
			else
			{
				directrix_vector.push_back(directrix.points[i]);
			}
		}

		auto &ppts = profile.curve.points;
		for (auto &pt2D : ppts)
		{				
			profile_vector.push_back(pt2D);
		}

		return ToIfcGeometry(bimGeometry::SweepCircular(scaling, closed, profile_vector, radius, directrix_vector, initialDirectrixNormal, rotate90));
	}

	inline bool computeSafeNormal(const glm::dvec3 v1, const glm::dvec3 v2, const glm::dvec3 v3, glm::dvec3 &normal, double eps = 0)
	{
		return bimGeometry::computeSafeNormal(v1, v2, v3, normal, eps);
	}

	inline bool GetBasisFromCoplanarPoints(std::vector<glm::dvec3> &points, glm::dvec3 &v1, glm::dvec3 &v2, glm::dvec3 &v3)
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
			if (i == 3)
			{
				EPS = 1e-03;
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

		double d1 = 0;

		for (auto &p : points)
		{
			double d2 = glm::distance(v1, p);
			if (d1 < d2)
			{
				d1 = d2;
				v2 = p;
			}
		}

		d1 = 0;
		for (auto &p : points)
		{
			double d2 = glm::distance(v1, p);
			double d3 = glm::distance(v2, p);
			if (d1 < d2 + d3)
			{
				d1 = d2 + d3;
				v3 = p;
			}
		}

		// multiple tries to find the best match
		return computeSafeNormal(v1, v2, v3, normal, 1e-08);
	}

	inline void TriangulateBounds(IfcGeometry &geometry, std::vector<IfcBound3D> &bounds, uint32_t expressID)
	{
		spdlog::debug("[TriangulateBounds({})]");
		if (bounds.size() == 1 && bounds[0].curve.points.size() == 3)
		{
			auto c = bounds[0].curve;

			// size_t offset = geometry.numPoints;

			geometry.AddFace(c.points[0], c.points[1], c.points[2]);
		}
		else if (bounds.size() > 0 && bounds[0].curve.points.size() >= 3)
		{
			// bound greater than 4 vertices or with holes, triangulate
			// TODO: modify to use glm::dvec2 with custom accessors
			using Point = std::array<double, 2>;
			uint32_t offset = geometry.numPoints;

			// if more than one bound
			if (bounds.size() > 1)
			{
				// locate the outer bound index
				int outerIndex = -1;
				for (size_t i = 0; i < bounds.size(); i++)
				{
					if (bounds[i].type == IfcBoundType::OUTERBOUND)
					{
						outerIndex = i;
						break;
					}
				}

				if (outerIndex == -1)
				{
					spdlog::error("[TriangulateBounds()] Expected outer bound! {}", expressID);
				}
				else
				{
					// swap the outer bound to the first position
					std::swap(bounds[0], bounds[outerIndex]);
				}
			}

			// if the first bound is not an outer bound now, this is unexpected
			if (bounds[0].type != IfcBoundType::OUTERBOUND)
			{
				spdlog::error("[TriangulateBounds() Expected outer bound first! {}", expressID);
			}

			glm::dvec3 v1, v2, v3;
			if (!GetBasisFromCoplanarPoints(bounds[0].curve.points, v1, v2, v3))
			{
				// these points are on a line
				spdlog::error("[TriangulateBounds()] No basis found for brep! {}", expressID);
				return;
			}

			glm::dvec3 v12(glm::normalize(v3 - v2));
			glm::dvec3 v13(glm::normalize(v1 - v2));
			glm::dvec3 n = glm::normalize(glm::cross(v12, v13));
			v12 = glm::cross(v13, n);

			// check winding of outer bound
			IfcCurve test;
			test.points.reserve(bounds[0].curve.points.size());

			for (size_t i = 0; i < bounds[0].curve.points.size(); i++)
			{
				glm::dvec3 pt = bounds[0].curve.points[i];
				glm::dvec3 pt2 = pt - v1;

				glm::dvec2 proj(
					glm::dot(pt2, v12),
					glm::dot(pt2, v13));

				test.Add(proj);
			}

			// if the outer bound is clockwise under the current projection (v12,v13,n), we invert the projection
			if (!test.IsCCW())
			{
				n *= -1;
				std::swap(v12, v13);
			}

			std::vector<std::vector<Point>> polygon;
			polygon.reserve(bounds.size());

			for (auto &bound : bounds)
			{
				std::vector<Point> points;
				points.reserve(bound.curve.points.size());
				for (size_t i = 0; i < bound.curve.points.size(); i++)
				{
					glm::dvec3 pt = bound.curve.points[i];
					geometry.AddPoint(pt, n);

					// project pt onto plane of curve to obtain 2d coords
					glm::dvec3 pt2 = pt - v1;

					glm::dvec2 proj(
						glm::dot(pt2, v12),
						glm::dot(pt2, v13));

					points.push_back({proj.x, proj.y});
				}

				polygon.push_back(points);
			}

			#ifdef CSG_DEBUG_OUTPUT
				// std::vector<std::vector<glm::dvec2>> polygonEdgesPrinted;
				// std::vector<std::vector<glm::dvec2>> edgesPrinted;

				// for (size_t i = 0; i < polygon[0].size() - 1; i++)
				// {	
				// 	auto& a = polygon[0][i];       // Access the current point
				// 	auto& b = polygon[0][i + 1];   // Access the next point
				// 	polygonEdgesPrinted.push_back({glm::dvec2(a[0], a[1]), glm::dvec2(b[0], b[1])});
				// }
				// auto& a = polygon[0][polygon[0].size() - 1];       // Access the current point
				// auto& b = polygon[0][0];   // Access the next point
				// polygonEdgesPrinted.push_back({glm::dvec2(a[0], a[1]), glm::dvec2(b[0], b[1])});

				// fuzzybools::DumpSVGLines(polygonEdgesPrinted, L"Polygon.html");
			#endif

			std::vector<uint32_t> indices = mapbox::earcut<uint32_t>(polygon);

			for (size_t i = 0; i < indices.size(); i += 3)
			{
				#ifdef CSG_DEBUG_OUTPUT
					// auto a = geometry.GetPoint(offset + indices[i + 0]);
					// auto b = geometry.GetPoint(offset + indices[i + 1]);
					// auto c = geometry.GetPoint(offset + indices[i + 2]);
					// edgesPrinted.push_back({glm::dvec2(a.z + a.x / 2, a.y + a.x / 2), glm::dvec2(b.z + b.x / 2, b.y + b.x / 2)});
					// edgesPrinted.push_back({glm::dvec2(a.z + a.x / 2, a.y + a.x / 2), glm::dvec2(c.z + c.x / 2, c.y + c.x / 2)});
					// edgesPrinted.push_back({glm::dvec2(b.z + b.x / 2, b.y + b.x / 2), glm::dvec2(c.z + c.x / 2, c.y + c.x / 2)});
					// fuzzybools::DumpSVGLines(edgesPrinted, L"triangulateBounds_tri.html");
				#endif
				geometry.AddFace(offset + indices[i + 0], offset + indices[i + 1], offset + indices[i + 2]);
			}

			#ifdef CSG_DEBUG_OUTPUT
				// fuzzybools::DumpSVGLines(edgesPrinted, L"triangulateBounds_tri.html");
			#endif
		}
		else
		{
			spdlog::error("[TriangulateBounds()] bad bound {}", expressID);
		}
	}

	inline IfcGeometry SectionedSurface(IfcCrossSections profiles_)
	{
		spdlog::debug("[SectionedSurface({})]");

		std::vector<std::vector<glm::dvec3>> profiles;

		for (size_t i = 0; i < profiles_.curves.size(); i++)
		{
			std::vector<glm::dvec3> profile;
			for (size_t j = 0; j < profiles_.curves[i].points.size(); j++)
			{
				profile.push_back({profiles_.curves[i].points[j].x, profiles_.curves[i].points[j].y, profiles_.curves[i].points[j].z});
			}
			profiles.push_back(profile);
		}

		return ToIfcGeometry(bimGeometry::SectionedSurface(profiles));
	}

	inline IfcGeometry Extrude(IfcProfile profile, glm::dvec3 dir, double distance, glm::dvec3 cuttingPlaneNormal = glm::dvec3(0), glm::dvec3 cuttingPlanePos = glm::dvec3(0))
	{
		spdlog::debug("[Extrude({})]");

		std::vector<bool> holesIndicesHash;

		// check if first point is equal to last point, otherwise the outer loop of the shape is not closed
		glm::dvec3 lastToFirstPoint = profile.curve.points.front() - profile.curve.points.back();
		if (glm::length(lastToFirstPoint) > 1e-8) {
			profile.curve.points.push_back(profile.curve.points.front());
		}

		std::vector<std::vector<glm::dvec3>> profile_vector;
		std::vector<glm::dvec3> profile_contour;
		for (size_t i = 0; i < profile.curve.points.size(); i++)
		{
			profile_contour.push_back(profile.curve.points[i]);
		}
		profile_vector.push_back(profile_contour);
		for (size_t i = 0; i < profile.holes.size(); i++)
		{
			std::vector<glm::dvec3> hole_contour;
			IfcCurve hole = profile.holes[i];
			int pointCount = hole.points.size();
			for (int j = 0; j < pointCount; j++)
			{
				hole_contour.push_back(hole.points[j]);
			}
			profile_vector.push_back(hole_contour);
		}

		return ToIfcGeometry(bimGeometry::Extrude(profile_vector, dir, distance, cuttingPlaneNormal, cuttingPlanePos));
	}

	// TODO: Send to bimGeometry
    inline double VectorToAngle2D(double x, double y)
	{
		double dd = sqrt(x * x + y * y);
		double xx = x / dd;
		double yy = y / dd;

		double angle = acos(xx);
		double cosv = cos(angle);
		double sinv = sin(angle);
		if (glm::abs(xx - cosv) > 1e-5 || glm::abs(yy - sinv) > 1e-5)
		{
			angle = asin(yy);
			sinv = sin(angle);
			cosv = cos(angle);
			if (glm::abs(xx - cosv) > 1e-5 || glm::abs(yy - sinv) > 1e-5)
			{
				angle = angle + (CONST_PI - angle) * 2;
				sinv = sin(angle);
				cosv = cos(angle);
				if (glm::abs(xx - cosv) > 1e-5 || glm::abs(yy - sinv) > 1e-5)
				{
					angle = angle + CONST_PI;
				}
			}
		}

		return (angle / (2 * CONST_PI)) * 360;
	}

	inline double VectorToAngle(double x, double y)
	{
		return bimGeometry::VectorToAngle(x, y);
	}

	inline bool MatrixFlipsTriangles(const glm::dmat4 &mat)
	{
		return glm::determinant(mat) < 0;
	}

	inline bool equals(glm::dvec3 A, glm::dvec3 B, double eps = 0)
	{
		return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps && std::fabs(A.z - B.z) <= eps;
	}

	inline bool equals(double A, double B, double eps = 0)
	{
		return std::fabs(A - B) <= eps;
	}

	inline double areaOfTriangle(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
	{
		return bimGeometry::areaOfTriangle(a, b, c);
	}

	inline double areaOfTriangle(glm::dvec2 a, glm::dvec2 b, glm::dvec2 c)
	{
		return bimGeometry::areaOfTriangle2D(a, b, c);
	}

	inline double RandomDouble(double lo, double hi)
	{
		return lo + static_cast<double>(rand()) / (static_cast<double>(RAND_MAX / (hi - lo)));
	}

	inline std::optional<glm::dvec3> GetOriginRec(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap, glm::dmat4 mat)
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

	inline glm::dvec3 GetOrigin(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap)
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

	inline	void flattenRecursive(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap, std::vector<IfcGeometry> &geoms, glm::dmat4 mat)
	{
		glm::dmat4 newMat = mat * mesh.transformation;

		bool transformationBreaksWinding = MatrixFlipsTriangles(newMat);

		auto geomIt = geometryMap.find(mesh.expressID);

		if (geomIt != geometryMap.end())
		{
			auto meshGeom = geomIt->second;

			if (meshGeom.part.size() > 0)
			{
				for (uint32_t i = 0; i < meshGeom.part.size(); i++)
				{

					IfcGeometry newMeshGeom = meshGeom.part[i];
					if (newMeshGeom.numFaces)
					{
						IfcGeometry newGeom;
						newGeom.halfSpace = newMeshGeom.halfSpace;
						if (newGeom.halfSpace)
						{
							newGeom.halfSpaceOrigin = newMat * glm::dvec4(newMeshGeom.halfSpaceOrigin, 1);
							newGeom.halfSpaceX = newMat * glm::dvec4(newMeshGeom.halfSpaceX, 1);
							newGeom.halfSpaceY = newMat * glm::dvec4(newMeshGeom.halfSpaceY, 1);
							newGeom.halfSpaceZ = newMat * glm::dvec4(newMeshGeom.halfSpaceZ, 1);
						}
						
						for (uint32_t i = 0; i < newMeshGeom.numFaces; i++)
						{
							Face f = newMeshGeom.GetFace(i);
							glm::dvec3 a = newMat * glm::dvec4(newMeshGeom.GetPoint(f.i0), 1);
							glm::dvec3 b = newMat * glm::dvec4(newMeshGeom.GetPoint(f.i1), 1);
							glm::dvec3 c = newMat * glm::dvec4(newMeshGeom.GetPoint(f.i2), 1);

							if (transformationBreaksWinding)
							{
								newGeom.AddFace(b, a, c);
							}
							else
							{
								newGeom.AddFace(a, b, c);
							}
						}

						geoms.push_back(newGeom);
					}
				}
			}
			else
			{
				if (meshGeom.numFaces)
				{
					IfcGeometry newGeom;
					newGeom.halfSpace = meshGeom.halfSpace;
					if (newGeom.halfSpace)
					{
						newGeom.halfSpaceOrigin = newMat * glm::dvec4(meshGeom.halfSpaceOrigin, 1);
						newGeom.halfSpaceX = newMat * glm::dvec4(meshGeom.halfSpaceX, 1);
						newGeom.halfSpaceY = newMat * glm::dvec4(meshGeom.halfSpaceY, 1);
						newGeom.halfSpaceZ = newMat * glm::dvec4(meshGeom.halfSpaceZ, 1);
					}
					
					for (uint32_t i = 0; i < meshGeom.numFaces; i++)
					{
						Face f = meshGeom.GetFace(i);
						glm::dvec3 a = newMat * glm::dvec4(meshGeom.GetPoint(f.i0), 1);
						glm::dvec3 b = newMat * glm::dvec4(meshGeom.GetPoint(f.i1), 1);
						glm::dvec3 c = newMat * glm::dvec4(meshGeom.GetPoint(f.i2), 1);

						if (transformationBreaksWinding)
						{
							newGeom.AddFace(b, a, c);
						}
						else
						{
							newGeom.AddFace(a, b, c);
						}
					}

					geoms.push_back(newGeom);
				}
			}
		}

		for (auto &c : mesh.children)
		{
			flattenRecursive(c, geometryMap, geoms, newMat);
		}
	}

	inline std::vector<IfcGeometry> flatten(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap, glm::dmat4 mat = glm::dmat4(1))
	{
		std::vector<IfcGeometry> geoms;
		flattenRecursive(mesh, geometryMap, geoms, mat);
		return geoms;
	}

	inline std::vector<IfcGeometry> flattenSolids(std::vector<IfcGeometry> geoms)
	{
		std::vector<IfcGeometry> newGeoms;
		IfcGeometry newGeom;
		for (uint32_t g = 0; g < geoms.size(); g++)
		{
			if(!geoms[g].halfSpace)
			{
					if (geoms[g].numFaces)
					{
						for (uint32_t i = 0; i < geoms[g].numFaces; i++)
						{
							Face f = geoms[g].GetFace(i);
							glm::dvec3 a = geoms[g].GetPoint(f.i0);
							glm::dvec3 b = geoms[g].GetPoint(f.i1);
							glm::dvec3 c = geoms[g].GetPoint(f.i2);
							newGeom.AddFace(a, b, c);
						}
					}
			}
		}
		newGeoms.push_back(newGeom);
		for (uint32_t g = 0; g < geoms.size(); g++)
		{
			if(geoms[g].halfSpace)
			{
				newGeoms.push_back(geoms[g]);
			}
		}
		return newGeoms;
	}

	inline std::array<double, 16> FlattenTransformation(const glm::dmat4 &transformation)
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

	inline bool notPresent(glm::dvec3 pt, std::vector<glm::dvec3> points)
	{
		for (auto &pt2 : points)
		{
			if (pt.x == pt2.x && pt.y == pt2.y && pt.z == pt2.z)
			{
				return false;
			}
		}
		return true;
	}
}
