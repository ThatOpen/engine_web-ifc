/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */


#pragma once

#include "../representation/geometry.h"
#include "../representation/IfcGeometry.h"
#include "../../utility/LoaderError.h"

#include <mapbox/earcut.hpp>

namespace webifc::geometry {

	inline double angleConversion(double angle)
	{
		if(abs(angle > 2) - EPS_SMALL * CONST_PI)
		{
			angle = (angle / 360) * 2 * CONST_PI;
		}
		return angle;
	}

	inline 	glm::dvec3 projectOntoPlane(const glm::dvec3 &origin, const glm::dvec3 &normal, const glm::dvec3 &point, const glm::dvec3 &dir)
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

	inline glm::dvec3 computeNormal(const glm::dvec3 v1, const glm::dvec3 v2, const glm::dvec3 v3)
	{
		glm::dvec3 v12(v2 - v1);
		glm::dvec3 v13(v3 - v1);

		glm::dvec3 norm = glm::cross(v12, v13);

		return glm::normalize(norm);
	}

	inline bool GetWindingOfTriangle(const glm::dvec3 &a, const glm::dvec3 &b, const glm::dvec3 &c)
	{
		auto norm = computeNormal(a, b, c);
		return glm::dot(norm, glm::dvec3(0, 0, 1)) > 0.0;
	}


		//! This implementation generates much more vertices than needed, and does not have smoothed normals
		// TODO: Review rotate90 value, as it should be inferred from IFC but the source data had not been identified yet
		// An arbitrary value has been added in IFCSURFACECURVESWEPTAREASOLID but this is a bad solution
	inline	IfcGeometry Sweep(const bool closed, const IfcProfile &profile, const IfcCurve &directrix, const glm::dvec3 &initialDirectrixNormal = glm::dvec3(0), const bool rotate90 = false)
	{
		IfcGeometry geom;

		std::vector<glm::vec<3, glm::f64>> dpts;

			// Remove repeated points
		for (size_t i = 0; i < directrix.points.size(); i++)
		{
			if (i < directrix.points.size() - 1)
			{
				if (glm::distance(directrix.points[i], directrix.points[i + 1]) > EPS_SMALL)
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
		std::vector<IfcCurve> curves;

		for (size_t i = 0; i < dpts.size(); i++)
		{
			IfcCurve segmentForCurve;

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
						printf("NaN perp!\n");
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

					if (left == glm::dvec3(0, 0, 0))
					{
						printf("0 left vec in sweep!\n");
					}

					// project profile onto planeNormal, place on planeOrigin
					// TODO: look at holes
					auto &ppts = profile.curve.points;
					for (auto &pt2D : ppts)
					{				
						glm::dvec3 pt = -pt2D.x * left + -pt2D.y * right + planeOrigin;
						if(rotate90)
						{
							pt = -pt2D.x * right - pt2D.y * left + planeOrigin;
						}
						glm::dvec3 proj = projectOntoPlane(planeOrigin, planeNormal, pt, directrixSegmentNormal);

						segmentForCurve.Add(proj);
					}
				}
				else
				{
					// project previous curve onto the normal
					const IfcCurve &prevCurve = curves.back();

					auto &ppts = prevCurve.points;
					for (auto &pt : ppts)
					{
						glm::dvec3 proj = projectOntoPlane(planeOrigin, planeNormal, pt, directrixSegmentNormal);

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

			// DumpSVGCurve(directrix.points, glm::dvec3(), "directrix.html");
			// DumpIfcGeometry(geom, "sweep.obj");

			return geom;
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

		inline void TriangulateBounds(IfcGeometry &geometry, std::vector<IfcBound3D> &bounds,utility::LoaderErrorHandler &_errorHandler,uint32_t expressID)
		{
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
				std::vector<std::vector<Point>> polygon;

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
						_errorHandler.ReportError(utility::LoaderErrorType::PARSING, "Expected outer bound!",expressID);
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
					_errorHandler.ReportError(utility::LoaderErrorType::PARSING, "Expected outer bound first!",expressID);
				}

				glm::dvec3 v1, v2, v3;
				if (!GetBasisFromCoplanarPoints(bounds[0].curve.points, v1, v2, v3))
				{
					// these points are on a line
					_errorHandler.ReportError(utility::LoaderErrorType::PARSING, "No basis found for brep!",expressID);
					return;
				}

				glm::dvec3 v12(glm::normalize(v3 - v2));
				glm::dvec3 v13(glm::normalize(v1 - v2));
				glm::dvec3 n = glm::normalize(glm::cross(v12, v13));
				v12 = glm::cross(v13, n);

				// check winding of outer bound
				IfcCurve test;
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

				for (auto &bound : bounds)
				{
					std::vector<Point> points;
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

				std::vector<uint32_t> indices = mapbox::earcut<uint32_t>(polygon);

				for (size_t i = 0; i < indices.size(); i += 3)
				{
					geometry.AddFace(offset + indices[i + 0], offset + indices[i + 1], offset + indices[i + 2]);
				}
			}
			else
			{
				_errorHandler.ReportError(utility::LoaderErrorType::PARSING, "bad bound",expressID);
			}
		}


		inline IfcGeometry Extrude(IfcProfile profile, glm::dvec3 dir, double distance,webifc::utility::LoaderErrorHandler _errorHandler, glm::dvec3 cuttingPlaneNormal = glm::dvec3(0), glm::dvec3 cuttingPlanePos = glm::dvec3(0))
		{
			IfcGeometry geom;
			std::vector<bool> holesIndicesHash;

			// build the caps
			{
				using Point = std::array<double, 2>;
				int polygonCount = 1 + profile.holes.size(); // Main profile + holes
				std::vector<std::vector<Point>> polygon(polygonCount);

				glm::dvec3 normal = dir;

				for (size_t i = 0; i < profile.curve.points.size(); i++)
				{
					glm::dvec2 pt = profile.curve.points[i];
					glm::dvec4 et = glm::dvec4(glm::dvec3(pt, 0) + dir * distance, 1);

					geom.AddPoint(et, normal);
					polygon[0].push_back({pt.x, pt.y});
				}

				for (size_t i = 0; i < profile.curve.points.size(); i++)
				{
					holesIndicesHash.push_back(false);
				}

				for (size_t i = 0; i < profile.holes.size(); i++)
				{
					IfcCurve hole = profile.holes[i];
					int pointCount = hole.points.size();

					for (int j = 0; j < pointCount; j++)
					{
						holesIndicesHash.push_back(j == 0);

						glm::dvec2 pt = hole.points[j];
						glm::dvec4 et = glm::dvec4(glm::dvec3(pt, 0) + dir * distance, 1);

						profile.curve.Add(pt);
						geom.AddPoint(et, normal);
						polygon[i + 1].push_back({pt.x, pt.y}); // Index 0 is main profile; see earcut reference
					}
				}

				std::vector<uint32_t> indices = mapbox::earcut<uint32_t>(polygon);

				if (indices.size() < 3)
				{
					// probably a degenerate polygon
					_errorHandler.ReportError(utility::LoaderErrorType::UNSPECIFIED, "degenerate polygon in extrude");
					return geom;
				}

				uint32_t offset = 0;
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

				offset += geom.numPoints;

				normal = -dir;

				for (size_t i = 0; i < profile.curve.points.size(); i++)
				{
					glm::dvec2 pt = profile.curve.points[i];
					glm::dvec4 et = glm::dvec4(glm::dvec3(pt, 0), 1);

					if (cuttingPlaneNormal != glm::dvec3(0))
					{
						et = glm::dvec4(glm::dvec3(pt, 0), 1);
						glm::dvec3 transDir = glm::dvec4(dir, 0);

						// project {et} onto the plane, following the extrusion normal
						double ldotn = glm::dot(transDir, cuttingPlaneNormal);
						if (ldotn == 0)
						{
							printf("0 direction in extrude\n");
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

			uint32_t capSize = profile.curve.points.size();
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

		inline double VectorToAngle(double x, double y)
		{
			double dd = sqrt(x * x + y * y);
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

		inline	bool MatrixFlipsTriangles(const glm::dmat4 &mat)
		{
			return glm::determinant(mat) < 0;
		}

		inline	std::optional<glm::dvec3> GetOriginRec(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap, glm::dmat4 mat)
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
						fuzzybools::Face f = meshGeom.GetFace(i);
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

		inline	glm::dvec3 GetOrigin(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap)
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

				if (meshGeom.numFaces)
				{
					IfcGeometry newGeom;

					for (uint32_t i = 0; i < meshGeom.numFaces; i++)
					{
						fuzzybools::Face f = meshGeom.GetFace(i);
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

			for (auto &c : mesh.children)
			{
				flattenRecursive(c, geometryMap, geoms, newMat);
			}
		}

		inline	std::vector<IfcGeometry> flatten(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap, glm::dmat4 mat = glm::dmat4(1))
		{
			std::vector<IfcGeometry> geoms;
			flattenRecursive(mesh, geometryMap, geoms, mat);
			return geoms;
		}

		inline	std::array<double, 16> FlattenTransformation(const glm::dmat4 &transformation)
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

		inline	bool notPresent(glm::dvec3 pt, std::vector<glm::dvec3> points)
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
