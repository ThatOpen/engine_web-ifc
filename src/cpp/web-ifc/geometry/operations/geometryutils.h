/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

#pragma once

#if defined(DEBUG_DUMP_SVG) || defined(DUMP_CSG_MESHES)
#include "boolean-utils/svg.h"
#endif

#ifndef GLM_ENABLE_EXPERIMENTAL
#define GLM_ENABLE_EXPERIMENTAL
#endif

#include <array>
#include <cstdint>
#include <spdlog/spdlog.h>
#include <glm/gtc/matrix_transform.hpp>
#include "../representation/geometry.h"
#include "../representation/IfcGeometry.h"
#include <mapbox/earcut.hpp>
#include "bim-geometry/utils.h"

namespace mapbox::util {
	template <>
	struct nth<0, glm::dvec2> {
		inline static auto get(const glm::dvec2& t) { return t.x; };
	};

	template <>
	struct nth<1, glm::dvec2> {
		inline static auto get(const glm::dvec2& t) { return t.y; };
	};
}

namespace webifc::geometry
{

	inline void SetEpsilons(double TOLERANCE_SCALAR_EQUALITY, double PLANE_REFIT_ITERATIONS, double BOOLEAN_UNION_THRESHOLD)
	{
		bimGeometry::SetEpsilons(TOLERANCE_SCALAR_EQUALITY, PLANE_REFIT_ITERATIONS, BOOLEAN_UNION_THRESHOLD);
	}

	inline double angleConversion(double angle, std::string angleUnits)
	{
		if (angleUnits == "RADIAN")
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
		if (ifcGeom.planeData.size() != ifcGeom.numFaces)
		{
			for (size_t i = 0; i < ifcGeom.numFaces; i++)
			{
				if (i >= ifcGeom.planeData.size())
				{
					ifcGeom.planeData.push_back(UINT32_MAX);
				}
			}
		}
		return ifcGeom;
	}

	inline IfcGeometry Sweep(const double scaling, const bool closed, const IfcProfile &profile, const IfcCurve &directrix, const glm::dvec3 &initialDirectrixNormal = glm::dvec3(0), const bool rotate90 = false, const bool optimize = true)
	{
		IfcGeometry geom = ToIfcGeometry(bimGeometry::SweepFunction(scaling, closed, profile.curve.points, directrix.points, initialDirectrixNormal, rotate90, optimize));
		return geom;
	}

	inline IfcGeometry SweepCircular(const double scaling, const bool closed, const IfcProfile &profile, const double radius, const IfcCurve &directrix, const glm::dvec3 &initialDirectrixNormal = glm::dvec3(0), const bool rotate90 = false)
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

	inline void TriangulateBounds(IfcGeometry& geometry, std::vector<IfcBound3D>& bounds, uint32_t expressID)
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
			std::vector<std::vector<glm::dvec2>> polygon(bounds.size());
			for (size_t i = 0; i < bounds.size(); i++)
			{
				const auto& curvePoints = bounds[i].curve.points;
				auto& points = polygon[i];
				points.reserve(curvePoints.size());
				for (const glm::dvec3& pt : curvePoints)
				{
					// Do not add to geometry yet
					const glm::dvec3 pt2 = pt - v1;
					const glm::dvec2 proj(glm::dot(pt2, v12), glm::dot(pt2, v13));
					points.push_back(proj);
				}
			}

			// Function to check if a point is inside a polygon (ray casting algorithm)
			auto PointInPolygon = [](const std::vector<glm::dvec2>& poly, const glm::dvec2& p) -> bool {
				bool inside = false;
				size_t n = poly.size();
				for (size_t i = 0, j = n - 1; i < n; j = i++) {
					if ((poly[i].y > p.y) != (poly[j].y > p.y) &&
						(p.x < poly[i].x + (poly[j].x - poly[i].x) * (p.y - poly[i].y) / (poly[j].y - poly[i].y + 1e-10))) {
						inside = !inside;
					}
				}
				return inside;
				};

			// Check if the supposed outer (polygon[0]) contains all others
			bool isValidOuter = true;
			for (size_t i = 1; i < polygon.size(); i++) {
				if (!polygon[i].empty()) {
					glm::dvec2 pt = polygon[i][0];
					if (!PointInPolygon(polygon[0], pt)) {
						isValidOuter = false;
						break;
					}
				}
			}

			if (!isValidOuter) {
				spdlog::warn("[TriangulateBounds()] Labeled outer bound does not contain all inners! {}", expressID);
				// Find the true outer bound that contains all others
				int trueOuterIndex = -1;
				for (size_t j = 0; j < polygon.size(); j++) {
					bool containsAll = true;
					for (size_t k = 0; k < polygon.size(); k++) {
						if (k == j) continue;
						if (!polygon[k].empty() && !PointInPolygon(polygon[j], polygon[k][0])) {
							containsAll = false;
							break;
						}
					}
					if (containsAll) {
						trueOuterIndex = static_cast<int>(j);
						break;
					}
				}
				if (trueOuterIndex == -1) {
					spdlog::error("[TriangulateBounds()] No bound found that contains all others! {}", expressID);
					return;
				}
				else if (trueOuterIndex != 0) {
					// Swap to make it the outer
					std::swap(bounds[0], bounds[trueOuterIndex]);
					std::swap(polygon[0], polygon[trueOuterIndex]);
					// Re-compute basis from the true outer
					if (!GetBasisFromCoplanarPoints(bounds[0].curve.points, v1, v2, v3)) {
						spdlog::error("[TriangulateBounds()] No basis found for true outer bound! {}", expressID);
						return;
					}
					v12 = glm::normalize(v3 - v2);
					v13 = glm::normalize(v1 - v2);
					n = glm::normalize(glm::cross(v12, v13));
					v12 = glm::cross(v13, n);
					// Re-check winding for the true outer
					IfcCurve test;
					test.points.reserve(bounds[0].curve.points.size());
					for (size_t i = 0; i < bounds[0].curve.points.size(); i++) {
						glm::dvec3 pt = bounds[0].curve.points[i];
						glm::dvec3 pt2 = pt - v1;
						glm::dvec2 proj(glm::dot(pt2, v12), glm::dot(pt2, v13));
						test.Add(proj);
					}
					if (!test.IsCCW()) {
						n *= -1;
						std::swap(v12, v13);
					}
					// Re-project all polygons with the updated basis/projection
					for (size_t i = 0; i < bounds.size(); i++) {
						const auto& curvePoints = bounds[i].curve.points;
						auto& points = polygon[i];
						points.clear();
						points.reserve(curvePoints.size());
						for (const glm::dvec3& pt : curvePoints) {
							const glm::dvec3 pt2 = pt - v1;
							const glm::dvec2 proj(glm::dot(pt2, v12), glm::dot(pt2, v13));
							points.push_back(proj);
						}
					}
				}
			}

			// Now add points to geometry
			for (size_t i = 0; i < bounds.size(); i++)
			{
				const auto& curvePoints = bounds[i].curve.points;
				for (const glm::dvec3& pt : curvePoints)
				{
					geometry.AddPoint(pt, n);
				}
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
				geometry.AddFace(offset + indices[i + 0], offset + indices[i + 1], offset + indices[i + 2], -1);
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

	using Point = std::array<double, 3>;

	inline IfcGeometry SectionedSurface(IfcCrossSections profiles_, bool buildCaps)
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

		IfcGeometry geom = ToIfcGeometry(bimGeometry::SectionedSurface(profiles,buildCaps,EPS_SMALL));

		if (buildCaps && profiles.size() > 1)
		{
			bimGeometry::Geometry geom;
			std::vector<bool> holesIndicesHash;

			// check if first point is equal to last point, otherwise the outer loop of the shape is not closed
			glm::dvec3 lastToFirstPoint = profiles[0].front() - profiles[0].back();
			if (glm::length(lastToFirstPoint) > 1e-8)
			{
				profiles[0].push_back(profiles[0].front());
			}
			
			glm::dvec3 pointInSection0 = profiles[0][0];
			glm::dvec3 pointInSection1 = profiles[1][0];
			glm::dvec3 normal = pointInSection1 - pointInSection0;
			double distance = normal.length();
			normal = glm::normalize(normal);
			glm::dvec3 dir = normal;
			glm::dvec3 cuttingPlaneNormal = glm::dvec3(0);
			glm::dvec3 cuttingPlanePos = glm::dvec3(0);

			// build the caps
			{
				int polygonCount = profiles.size(); // Main profile + holes
				std::vector<std::vector<Point>> polygon(polygonCount);
							

				for (size_t i = 0; i < profiles[0].size(); i++)
				{
					glm::dvec3 pt = profiles[0][i];
					glm::dvec4 et = glm::dvec4(glm::dvec3(pt) + dir * distance, 1);

					geom.AddPoint(et, normal);
					polygon[0].push_back(Point{ pt.x, pt.y, pt.z });
				}

				for (size_t i = 0; i < profiles[0].size(); i++)
				{
					holesIndicesHash.push_back(false);
				}

				for (size_t i = 1; i < profiles.size(); i++)
				{
					std::vector<glm::dvec3> hole = profiles[i];
					int pointCount = hole.size();

					for (int j = 0; j < pointCount; j++)
					{
						holesIndicesHash.push_back(j == 0);

						glm::dvec3 pt = hole[j];
						glm::dvec4 et = glm::dvec4(pt + dir * distance, 1);

						profiles[0].push_back(pt);
						geom.AddPoint(et, normal);
						polygon[i].push_back({ pt.x, pt.y, pt.z }); // Index 0 is main profile; see earcut reference
					}
				}

				bimGeometry::Projection proj = bimGeometry::bestProjection(polygon[0]);
				auto polygon2D = projectTo2D(polygon, proj);
				std::vector<uint32_t> indices = mapbox::earcut<uint32_t>(polygon2D);

				uint32_t offset = 0;
				bool winding = true;
				bool flipWinding = false;

				if (indices.size() >= 3)
				{
					bool winding = bimGeometry::GetWindingOfTriangle(geom.GetPoint(offset + indices[0]), geom.GetPoint(offset + indices[1]), geom.GetPoint(offset + indices[2]));
					bool flipWinding = !winding;

					for (size_t i = 0; i < indices.size(); i += 3)
					{
						if (flipWinding)
						{
							geom.AddFace(offset + indices[i + 0], offset + indices[i + 2], offset + indices[i + 1], -1);
						}
						else
						{
							geom.AddFace(offset + indices[i + 0], offset + indices[i + 1], offset + indices[i + 2], -1);
						}
					}
				}

				offset += geom.numPoints;

				normal = -dir;

				for (size_t i = 0; i < profiles[0].size(); i++)
				{
					glm::dvec3 pt = profiles[0][i];
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
						geom.AddFace(offset + indices[i + 0], offset + indices[i + 1], offset + indices[i + 2], -1);
					}
					else
					{
						geom.AddFace(offset + indices[i + 0], offset + indices[i + 2], offset + indices[i + 1], -1);
					}
				}
			}

			uint32_t capSize = profiles[0].size();
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
				geom.AddFace(geom.GetPoint(tl), geom.GetPoint(br), geom.GetPoint(bl));
				geom.AddFace(geom.GetPoint(tl), geom.GetPoint(tr), geom.GetPoint(br));
			}

		}

		return geom;
	}

	inline IfcGeometry Extrude(IfcProfile profile, glm::dvec3 dir, double distance, glm::dvec3 cuttingPlaneNormal = glm::dvec3(0), glm::dvec3 cuttingPlanePos = glm::dvec3(0))
	{
		spdlog::debug("[Extrude({})]");

		std::vector<bool> holesIndicesHash;

		// check if first point is equal to last point, otherwise the outer loop of the shape is not closed
		glm::dvec3 lastToFirstPoint = profile.curve.points.front() - profile.curve.points.back();
		if (glm::length(lastToFirstPoint) > 1e-8)
		{
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

	inline IfcGeometry SweepFixedReference(double linearScalingFactor, bool closed, const IfcProfile& profile, const IfcCurve& directrix, const glm::dvec3& fixedReference)
	{
		IfcGeometry geom;

		// Normalize the fixed reference direction
		glm::dvec3 refDir = glm::normalize(fixedReference);

		// Create a transformation matrix to align the profile with the fixed reference
		glm::dvec3 zAxis(0, 0, 1); // Default profile z-axis
		glm::dvec3 rotationAxis = glm::cross(zAxis, refDir);
		double angle = glm::acos(glm::dot(zAxis, refDir));
		glm::dmat4 orientation = (glm::length(rotationAxis) > EPS_SMALL) ?
			glm::rotate(glm::dmat4(1.0), angle, rotationAxis) : glm::dmat4(1.0);

		// Sweep the profile along the directrix
		std::vector<glm::dvec3> profilePoints = profile.curve.points;
		std::vector<glm::dvec3> pathPoints = directrix.points;
		uint32_t segments = closed ? pathPoints.size() : pathPoints.size() - 1;

		// Store profiles for start and end caps
		std::vector<glm::dvec3> startProfile;
		std::vector<glm::dvec3> endProfile;

		// Compute start profile (at first directrix point)
		glm::dvec3 startPos = pathPoints[0];
		for (const auto& pt : profilePoints) {
			glm::dvec4 transformedPt = orientation * glm::dvec4(pt, 1.0);
			startProfile.push_back(startPos + glm::dvec3(transformedPt));
		}

		for (uint32_t i = 0; i < segments; i++) {
			glm::dvec3 pos = pathPoints[i];
			glm::dvec3 nextPos = pathPoints[(i + 1) % pathPoints.size()];

			// Transform profile points at the current position
			std::vector<glm::dvec3> currentProfile;
			for (const auto& pt : profilePoints) {
				glm::dvec4 transformedPt = orientation * glm::dvec4(pt, 1.0);
				currentProfile.push_back(pos + glm::dvec3(transformedPt));
			}

			// Transform profile points at the next position
			std::vector<glm::dvec3> nextProfile;
			if (!closed || i < segments - 1) {
				for (const auto& pt : profilePoints) {
					glm::dvec4 transformedPt = orientation * glm::dvec4(pt, 1.0);
					nextProfile.push_back(nextPos + glm::dvec3(transformedPt));
				}
			}
			else {
				nextProfile = startProfile; // For closed curves, connect to the start
			}

			// Store end profile (at last directrix point)
			if (i == segments - 1) {
				endProfile = nextProfile;
			}

			// Add two triangles for each segment of the profile
			for (size_t j = 0; j < profilePoints.size(); j++) {
				size_t jNext = (j + 1) % profilePoints.size();

				// First triangle: (current[j], next[j], next[jNext])
				geom.AddFace(
					currentProfile[j],
					nextProfile[j],
					nextProfile[jNext]
				);

				// Second triangle: (current[j], next[jNext], current[jNext])
				geom.AddFace(
					currentProfile[j],
					nextProfile[jNext],
					currentProfile[jNext]
				);
			}
		}

		// Handle caps for non-closed sweeps
		if (!closed) {
			// Add start cap
			IfcProfile startCap = profile;
			startCap.curve.points = startProfile;
			geom.AddGeometry(Extrude(startCap, glm::dvec3(0, 0, -1), 0)); // Zero-depth extrusion for cap

			// Add end cap
			IfcProfile endCap = profile;
			endCap.curve.points = endProfile;
			geom.AddGeometry(Extrude(endCap, glm::dvec3(0, 0, 1), 0));
		}

		return geom;
	}

	// TODO: Send to bimGeometry
	inline double VectorToAngle2D(double x, double y)
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
					bimGeometry::Face f = meshGeom.GetFace(i);
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
	/**
	 * Transforms an IfcGeometry by applying a transformation matrix to faces points.
	 *
	 * @param sourceGeom            The source IfcGeometry to transform
	 * @param matrix                The transformation matrix to apply
	 * @param transformationBreaksWinding  Whether the transformation breaks winding order
	 *
	 * @return A vector of transformed IfcGeometry objects
	 */
	inline std::vector<IfcGeometry> transformIfcGeometry(const IfcGeometry &sourceGeom, glm::dmat4 matrix, bool transformationBreaksWinding)
	{
		std::vector<IfcGeometry> geomsTransformed;
		if (sourceGeom.part.size() > 0)
		{
			for (uint32_t i = 0; i < sourceGeom.part.size(); i++)
			{

				IfcGeometry newMeshGeom = sourceGeom.part[i];
				if (newMeshGeom.numFaces)
				{
					IfcGeometry newGeom;
					newGeom.halfSpace = newMeshGeom.halfSpace;
					if (newGeom.halfSpace)
					{
						newGeom.halfSpaceOrigin = matrix * glm::dvec4(newMeshGeom.halfSpaceOrigin, 1);
						newGeom.halfSpaceX = matrix * glm::dvec4(newMeshGeom.halfSpaceX, 1);
						newGeom.halfSpaceY = matrix * glm::dvec4(newMeshGeom.halfSpaceY, 1);
						newGeom.halfSpaceZ = matrix * glm::dvec4(newMeshGeom.halfSpaceZ, 1);
					}

					for (uint32_t i = 0; i < newMeshGeom.numFaces; i++)
					{
						bimGeometry::Face f = newMeshGeom.GetFace(i);
						glm::dvec3 a = matrix * glm::dvec4(newMeshGeom.GetPoint(f.i0), 1);
						glm::dvec3 b = matrix * glm::dvec4(newMeshGeom.GetPoint(f.i1), 1);
						glm::dvec3 c = matrix * glm::dvec4(newMeshGeom.GetPoint(f.i2), 1);

						if (transformationBreaksWinding)
						{
							newGeom.AddFace(b, a, c);
						}
						else
						{
							newGeom.AddFace(a, b, c);
						}
					}

					geomsTransformed.push_back(newGeom);
				}
			}
		}
		else
		{
			if (sourceGeom.numFaces)
			{
				IfcGeometry newGeom;
				newGeom.halfSpace = sourceGeom.halfSpace;
				if (newGeom.halfSpace)
				{
					newGeom.halfSpaceOrigin = matrix * glm::dvec4(sourceGeom.halfSpaceOrigin, 1);
					newGeom.halfSpaceX = matrix * glm::dvec4(sourceGeom.halfSpaceX, 1);
					newGeom.halfSpaceY = matrix * glm::dvec4(sourceGeom.halfSpaceY, 1);
					newGeom.halfSpaceZ = matrix * glm::dvec4(sourceGeom.halfSpaceZ, 1);
				}

				for (uint32_t i = 0; i < sourceGeom.numFaces; i++)
				{
					bimGeometry::Face f = sourceGeom.GetFace(i);
					glm::dvec3 a = matrix * glm::dvec4(sourceGeom.GetPoint(f.i0), 1);
					glm::dvec3 b = matrix * glm::dvec4(sourceGeom.GetPoint(f.i1), 1);
					glm::dvec3 c = matrix * glm::dvec4(sourceGeom.GetPoint(f.i2), 1);

					if (transformationBreaksWinding)
					{
						newGeom.AddFace(b, a, c);
					}
					else
					{
						newGeom.AddFace(a, b, c);
					}
				}

				geomsTransformed.push_back(newGeom);
			}
		}

		return geomsTransformed;
	}

	inline void flattenRecursive(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap, std::vector<IfcGeometry> &geoms, glm::dmat4 mat)
	{
		glm::dmat4 newMat = mat * mesh.transformation;

		bool transformationBreaksWinding = MatrixFlipsTriangles(newMat);

		auto geomIt = geometryMap.find(mesh.expressID);

		if (geomIt != geometryMap.end())
		{
			auto meshGeom = geomIt->second;

			std::vector<IfcGeometry> transformedGeoms = transformIfcGeometry(meshGeom, newMat, transformationBreaksWinding);
			geoms.insert(geoms.end(), transformedGeoms.begin(), transformedGeoms.end());
		}

		for (auto &c : mesh.children)
		{
			flattenRecursive(c, geometryMap, geoms, newMat);
		}
	}

	/**
	 * Recursively flattens an IfcComposedMesh hierarchy into a list of geometries
	 * expressed in world coordinates.
	 *
	 * @param mesh         Root IfcComposedMesh to flatten
	 * @param geometryMap  Map of expressID -> local-space IfcGeometry
	 * @param geoms        Output vector collecting world-space geometries
	 * @param mat          Accumulated parent transform (world matrix)
	 *
	 * @note This function intentionally converts geometry from local space to
	 *       world space. The returned geometries must NOT be re-transformed.
	 */
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
			if (!geoms[g].halfSpace)
			{
				if (geoms[g].numFaces)
				{
					for (uint32_t i = 0; i < geoms[g].numFaces; i++)
					{
						bimGeometry::Face f = geoms[g].GetFace(i);
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
			if (geoms[g].halfSpace)
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
