/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */


#pragma once

#include <iostream>
#include <strstream>
#include <fstream>
#include <sstream>

#include "../representation/geometry.h"
#include "../representation/IfcGeometry.h"
#include "../../utility/LoaderError.h"

#include <mapbox/earcut.hpp>

namespace webifc::geometry {

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
	inline	IfcGeometry Sweep(const bool closed, const IfcProfile &profile, const IfcCurve &directrix, const glm::dvec3 &initialDirectrixNormal = glm::dvec3(0))
	{
		IfcGeometry geom;

		std::vector<glm::vec<3, glm::f64>> dpts;

			// Remove repeated points
		for (size_t i = 0; i < directrix.points.size(); i++)
		{
			if (i < directrix.points.size() - 1)
			{
				if (glm::distance(directrix.points[i], directrix.points[i + 1]) > 10e-5)
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
					}
					else
					{
						left = glm::cross(directrixSegmentNormal, initialDirectrixNormal);
					}

					if (left == glm::dvec3(0, 0, 0))
					{
						printf("0 left vec in sweep!\n");
					}

					glm::dvec3 right = glm::normalize(glm::cross(directrixSegmentNormal, left));
					left = glm::normalize(glm::cross(directrixSegmentNormal, right));

					// project profile onto planeNormal, place on planeOrigin
					// TODO: look at holes
					auto &ppts = profile.curve.points;
					for (auto &pt2D : ppts)
					{
						glm::dvec3 pt = -pt2D.x * right + -pt2D.y * left + planeOrigin;
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

			// DumpSVGCurve(directrix.points, glm::dvec3(), L"directrix.html");
			// DumpIfcGeometry(geom, L"sweep.obj");

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

		inline void TriangulateBounds(IfcGeometry &geometry, std::vector<IfcBound3D> &bounds,utility::LoaderErrorHandler &_errorHandler)
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
						_errorHandler.ReportError(utility::LoaderErrorType::PARSING, "Expected outer bound!");
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
					_errorHandler.ReportError(utility::LoaderErrorType::PARSING, "Expected outer bound first!");
				}

				glm::dvec3 v1, v2, v3;
				if (!GetBasisFromCoplanarPoints(bounds[0].curve.points, v1, v2, v3))
				{
					// these points are on a line
					_errorHandler.ReportError(utility::LoaderErrorType::PARSING, "No basis found for brep!");
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
				_errorHandler.ReportError(utility::LoaderErrorType::PARSING, "bad bound");
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

		inline	std::vector<glm::dvec2> rescale(std::vector<glm::dvec2> input, glm::dvec2 size, glm::dvec2 offset)
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


		inline	bool MatrixFlipsTriangles(const glm::dmat4 &mat)
		{
			return glm::determinant(mat) < 0;
		}

		inline	void writeFile(std::wstring filename, std::string data)
		{
			std::string newFileName(filename.begin(), filename.end());
			std::ofstream out(newFileName);
			out << data;
			out.close();
		}


		inline	bool IsInsideCenterExtents(const glm::dvec3 &pt, const glm::dvec3 &center, const glm::dvec3 &extents)
		{
			glm::dvec3 delta = pt - center;
			delta = glm::abs(delta);
			glm::dvec3 offset = delta - extents;

			return offset.x < EPS_SMALL && offset.y < EPS_SMALL && offset.z < EPS_SMALL;
		}

		inline	bool equals2d(glm::dvec2 A, glm::dvec2 B, double eps = 0)
		{
			return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps;
		}

		inline	bool equals(glm::dvec3 A, glm::dvec3 B, double eps = 0)
		{
			return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps && std::fabs(A.z - B.z) <= eps;
		}

		inline	std::string ToObj(IfcGeometry &geom, size_t &offset, glm::dmat4 transform = glm::dmat4(1))
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

		inline	void DumpIfcGeometry(IfcGeometry &geom, std::wstring filename)
		{
			size_t offset = 0;
			writeFile(filename, ToObj(geom, offset));
		}




		inline		double areaOfTriangle(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
		{
			glm::dvec3 ab = b - a;
			glm::dvec3 ac = c - a;

			glm::dvec3 norm = glm::cross(ab, ac);
			return glm::length(norm) / 2;
		}

		inline		double cross2d(const glm::dvec2 &point1, const glm::dvec2 &point2)
		{
			return point1.x * point2.y - point1.y * point2.x;
		}

		inline		double areaOfTriangle(glm::dvec2 a, glm::dvec2 b, glm::dvec2 c)
		{
			glm::dvec2 ab = b - a;
			glm::dvec2 ac = c - a;

			double norm = cross2d(ab, ac) / 2;
			return std::fabs(norm);
		}

		// https://en.wikipedia.org/wiki/Barycentric_coordinate_system
		inline		glm::dvec3 ToBary(const glm::dvec3 &a, const glm::dvec3 &b, const glm::dvec3 &c, const glm::dvec3 &pt)
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

		inline		glm::dvec2 FromBary(const glm::dvec2 &a, const glm::dvec2 &b, const glm::dvec2 &c, const glm::dvec3 &pt)
		{
			return pt.x * a + pt.y * b + pt.z * c;
		}

		// assume 0,0 1,0 0,1 triangle
		inline		glm::dvec3 ToBary2(const glm::dvec2 &pt)
		{
			double v = pt.x;
			double w = pt.y;
			double u = 1 - v - w;

			return glm::dvec3(u, v, w);
		}

		inline		glm::dvec3 FromBary(const glm::dvec3 &a, const glm::dvec3 &b, const glm::dvec3 &c, const glm::dvec3 &pt)
		{
			return pt.x * a + pt.y * b + pt.z * c;
		}

		inline		void CheckTriangle(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
		{
			if (areaOfTriangle(a, b, c) == 0)
			{
				printf("0 triangle\n");
			}
		}

		inline		void CheckTriangle(Face &f, std::vector<glm::dvec3> &pts)
		{
			if (areaOfTriangle(pts[f.i0], pts[f.i1], pts[f.i2]) == 0)
			{
				printf("0 triangle\n");
			}
		}

		inline		double RandomDouble(double lo, double hi)
		{
			return lo + static_cast<double>(rand()) / (static_cast<double>(RAND_MAX / (hi - lo)));
		}


		inline		glm::dvec2 cmin(glm::dvec2 m, Point p)
		{
			return glm::dvec2(
				std::min(m.x, p.x),
				std::min(m.y, p.y));
		}

		inline		glm::dvec2 cmax(glm::dvec2 m, Point p)
		{
			return glm::dvec2(
				std::max(m.x, p.x),
				std::max(m.y, p.y));
		}

		inline		Bounds getBounds(std::vector<Triangle> input, glm::dvec2 size, glm::dvec2 offset)
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

			inline		Bounds getBounds(std::vector<std::vector<glm::dvec2>> input, glm::dvec2 size, glm::dvec2 offset)
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

				inline	glm::dvec2 rescale(Point p, Bounds b, glm::dvec2 size, glm::dvec2 offset)
				{
					return glm::dvec2(
						((p.x - b.min.x) / (b.max.x - b.min.x)) * size.x + offset.x,
						((p.y - b.min.y) / (b.max.y - b.min.y)) * size.y + offset.y);
				}

				inline		void svgMakeLine(glm::dvec2 a, glm::dvec2 b, std::stringstream &svg)
				{
					svg << "<line x1=\"" << a.x << "\" y1=\"" << a.y << "\" ";
					svg << "x2=\"" << b.x << "\" y2=\"" << b.y << "\" ";
					svg << "style = \"stroke:rgb(255,0,0);stroke-width:1\" />";
				}

				inline	std::string makeSVGTriangles(std::vector<Triangle> triangles, Point p, Point prev, std::vector<Point> pts = {})
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

				inline	glm::dvec2 rescale(glm::dvec2 p, Bounds b, glm::dvec2 size, glm::dvec2 offset)
				{
					return glm::dvec2(
						((p.x - b.min.x) / (b.max.x - b.min.x)) * size.x + offset.x,
						((p.y - b.min.y) / (b.max.y - b.min.y)) * size.y + offset.y);
				}

				inline		std::string makeSVGLines(std::vector<std::vector<glm::dvec2>> lines)
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
							for (size_t i = 1; i < line.size(); i++)
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

				inline		void DumpSVGTriangles(std::vector<Triangle> triangles, Point p, Point prev, std::wstring filename, std::vector<Point> pts = {})
				{
					writeFile(filename, makeSVGTriangles(triangles, p, prev, pts));
				}

				inline		void DumpSVGLines(std::vector<std::vector<glm::dvec2>> lines, std::wstring filename)
				{
					writeFile(filename, makeSVGLines(lines));
				}

				inline		std::string makeSVGLines(std::vector<glm::dvec2> input, std::vector<uint32_t> indices)
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

						for (size_t i = 2; i < rescaled.size() - 1; i++)
						{
							auto &start = rescaled[i - 1];
							auto &end = rescaled[i];
							svg << "<line x1=\"" << start.x << "\" y1=\"" << start.y << "\" ";
							svg << "x2=\"" << end.x << "\" y2=\"" << end.y << "\" ";
							svg << "style = \"stroke:rgb(0,0,0);stroke-width:2\" />";
						}

						for (size_t i = rescaled.size() - 1; i < rescaled.size(); i++)
						{
							auto &start = rescaled[i - 1];
							auto &end = rescaled[i];
							svg << "<line x1=\"" << start.x << "\" y1=\"" << start.y << "\" ";
							svg << "x2=\"" << end.x << "\" y2=\"" << end.y << "\" ";
							svg << "style = \"stroke:rgb(255,0,0);stroke-width:2\" />";
						}
					}

					for (size_t i = 0; i < indices.size(); i += 3)
					{
						glm::dvec2 a = rescaled[indices[i + 0]];
						glm::dvec2 b = rescaled[indices[i + 1]];
						glm::dvec2 c = rescaled[indices[i + 2]];

						svg << "<polygon points=\"" << a.x << "," << a.y << " " << b.x << "," << b.y << " " << c.x << "," << c.y << "\" style=\"fill:gray; stroke:none; stroke - width:0\" />`;";
					}

					svg << "</svg>";

					return svg.str();
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

				inline	IfcGeometry flattenGeometry(std::vector<IfcGeometry> &geoms)
				{
					IfcGeometry newGeom;

					for (auto meshGeom : geoms)
					{
						for (uint32_t i = 0; i < meshGeom.numFaces; i++)
						{
							Face f = meshGeom.GetFace(i);
							glm::dvec3 a = meshGeom.GetPoint(f.i0);
							glm::dvec3 b = meshGeom.GetPoint(f.i1);
							glm::dvec3 c = meshGeom.GetPoint(f.i2);
							newGeom.AddFace(a, b, c);
						}
						newGeom.AddComponent(meshGeom);
					}

					return newGeom;
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

					for (auto &c : mesh.children)
					{
						flattenRecursive(c, geometryMap, geoms, newMat);
					}
				}

				

				inline			std::vector<IfcGeometry> flatten(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap, glm::dmat4 mat = glm::dmat4(1))
				{
					std::vector<IfcGeometry> geoms;
					flattenRecursive(mesh, geometryMap, geoms, mat);
					return geoms;
				}



				inline		std::array<double, 16> FlattenTransformation(const glm::dmat4 &transformation)
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

				inline		bool TriangleIsCW(const glm::dvec2 &a, const glm::dvec2 &b, const glm::dvec2 &c)
				{
					auto norm = computeNormal(glm::dvec3(a, 0), glm::dvec3(b, 0), glm::dvec3(c, 0));
					return glm::dot(norm, glm::dvec3(0, 0, 1)) > 0.0;
				}

				

inline		double mirrorAngle(double angle) // in degrees
{
	if (angle < 180)
	{
		return 180 - angle;
	}
	else
	{
		return 180 + (360 - angle);
	}
}

inline		 bool notPresent(glm::dvec3 pt, std::vector<glm::dvec3> points)
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