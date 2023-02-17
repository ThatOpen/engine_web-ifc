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

#include "../util.h"

#include <glm/glm.hpp>

constexpr bool CSG_DEBUG_OUTPUT = false;

#define CONST_PI 3.141592653589793238462643383279502884L

namespace webifc
{
	static AABB GetAABB(const IfcGeometry &mesh)
	{
		AABB aabb;

		for (uint32_t i = 0; i < mesh.numPoints; i++)
		{
			aabb.min = glm::min(aabb.min, mesh.GetPoint(i));
			aabb.max = glm::max(aabb.max, mesh.GetPoint(i));
		}

		return aabb;
	}

	static bool equals(double A, double B, double eps = 0)
	{
		return std::fabs(A - B) <= eps;
	}

	static double sign2D(const glm::dvec2 &p, const glm::dvec2 &a, const glm::dvec2 &b)
	{
		return (p.x - b.x) * (a.y - b.y) - (a.x - b.x) * (p.y - b.y);
	}

	// https://stackoverflow.com/questions/1903954/is-there-a-standard-sign-function-signum-sgn-in-c-c
	static double signOneZero(double x)
	{
		return (x > 0) - (x < 0);
	}

	static double ComparableAngle(const glm::dvec2 &p, const glm::dvec2 &a, const glm::dvec2 &b)
	{
		double upDown = sign2D(p, a, b) >= 0 ? 1 : -1;
		double dot = (1 + glm::dot(glm::normalize(a - b), glm::normalize(p - b))) / 2.0;
		return upDown * dot;
	}

	// https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
	static double DistancePointToLineSegment2D(const glm::dvec2 &v, const glm::dvec2 &w, const glm::dvec2 &p)
	{
		// Return minimum distance between line segment vw and point p
		const double l2 = glm::length(v - w); // i.e. |w-v|^2 -  avoid a sqrt
		if (l2 == 0.0)
			return glm::distance(p, v); // v == w case
		// Consider the line extending the segment, parameterized as v + t (w - v).
		// We find projection of point p onto the line.
		// It falls where t = [(p-v) . (w-v)] / |w-v|^2
		// We clamp t from [0,1] to handle points outside the segment vw.
		const double t = std::max(0.0, std::min(1.0, dot(p - v, w - v) / (l2 * l2)));
		const glm::dvec2 projection = v + t * (w - v); // Projection falls on the segment
		return glm::distance(p, projection);
	}

	static bool PointOnLineSegment2D(const glm::dvec2 &v, const glm::dvec2 &w, const glm::dvec2 &p, double EPS)
	{
		double dist = DistancePointToLineSegment2D(v, w, p);
		return dist <= EPS;
	}

	static bool onEdge2D(const glm::dvec2 &p, const glm::dvec2 &a, const glm::dvec2 &b, double EPS)
	{
		double dist = std::fabs(sign2D(p, a, b));
		return dist <= EPS;
	}

	static bool IsVectorCCW(const std::vector<glm::dvec2> &points)
	{
		double sum = 0;

		for (int i = 0; i < points.size(); i++)
		{
			glm::dvec2 pt1 = points[i];
			glm::dvec2 pt2 = points[(i + 1) % points.size()];

			sum += (pt2.x - pt1.x) * (pt2.y + pt1.y);
		}

		return sum < 0;
	}

	static double DistanceToLine(const glm::dvec3 &pt, const glm::dvec3 &lpos, const glm::dvec3 &ldir)
	{
		glm::dvec3 x2 = lpos + ldir;
		double l = glm::length(glm::cross(pt - lpos, pt - x2));
		double s = glm::length(ldir);
		return l / s;
	}

	static std::optional<glm::dmat4> GetOrientationRec(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap, glm::dmat4 mat)
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
					// Face f = meshGeom.GetFace(i);
					// glm::dvec3 a = newMat * glm::dvec4(meshGeom.GetPoint(f.i0), 1);

					return newMat;
				}
			}
		}

		for (auto &c : mesh.children)
		{
			auto v = GetOrientationRec(c, geometryMap, newMat);
			if (v.has_value())
			{
				return v;
			}
		}

		return std::nullopt;
	}

	static glm::dmat4 GetOrientation(IfcComposedMesh &mesh, std::unordered_map<uint32_t, IfcGeometry> &geometryMap)
	{
		auto v = GetOrientationRec(mesh, geometryMap, glm::dmat4(1));

		if (v.has_value())
		{
			return *v;
		}
		else
		{
			return glm::dmat4(1);
		}
	}

	static void svgMakeLine(glm::dvec2 a, glm::dvec2 b, std::stringstream &svg, std::string col = "rgb(255,0,0)")
	{
		svg << "<line x1=\"" << a.x << "\" y1=\"" << a.y << "\" ";
		svg << "x2=\"" << b.x << "\" y2=\"" << b.y << "\" ";
		svg << "style = \"stroke:" + col + ";stroke-width:1\" />";
	}

	struct SVGLineSet
	{
		std::vector<std::vector<glm::dvec2>> lines;
		std::string color = "rgb(255,0,0)";

		Bounds GetBounds(glm::dvec2 size, glm::dvec2 offset)
		{
			return getBounds(lines, size, offset);
			;
		}
	};

	struct SVGDrawing
	{
		std::vector<SVGLineSet> sets;

		Bounds GetBounds(glm::dvec2 size, glm::dvec2 offset)
		{
			Bounds b;
			b.min = glm::dvec2(
				DBL_MAX,
				DBL_MAX);

			b.max = glm::dvec2(
				-DBL_MAX,
				-DBL_MAX);

			for (auto &set : sets)
			{
				b.Merge(set.GetBounds(size, offset));
			}

			return b;
		}
	};

	static void SVGLinesToString(Bounds bounds, glm::dvec2 size, glm::dvec2 offset, SVGLineSet lineSet, std::stringstream &svg)
	{
		for (auto &line : lineSet.lines)
		{
			if (line.size() > 1)
			{
				for (size_t i = 1; i < line.size(); i++)
				{
					glm::dvec2 a = rescale(line[i], bounds, size, offset);
					glm::dvec2 b = rescale(line[i - 1], bounds, size, offset);

					svgMakeLine(a, b, svg, lineSet.color);
				}
			}
			else
			{
				glm::dvec2 a = rescale(line[0], bounds, size, offset);
				svg << "<circle cx = \"" << a.x << "\" cy = \"" << a.y << "\" r = \"3\" style = \"stroke:rgb(0,0,255);stroke-width:2\" />";
			}
		}
	}

	static std::string makeSVGLines(SVGDrawing drawing)
	{
		glm::dvec2 size(2048, 2048);
		glm::dvec2 offset(5, 5);

		Bounds bounds = drawing.GetBounds(size, offset);

		std::stringstream svg;

		svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << " \" xmlns=\"http://www.w3.org/2000/svg\">";

		for (auto &set : drawing.sets)
		{
			SVGLinesToString(bounds, size, offset, set, svg);
		}

		svg << "</svg>";

		return svg.str();
	}

	static std::string ToObj(const IfcGeometry &geom, size_t &offset, glm::dmat4 transform = glm::dmat4(1), double inputScale = 1.0)
	{
		std::stringstream obj;

		double scale = inputScale;

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

	static void DumpIfcGeometryToPath(const IfcGeometry &geom, std::wstring path, double inputScale)
	{
#ifdef _MSC_VER
		size_t offset = 0;
		std::ofstream out(path);
		out << ToObj(geom, offset, glm::dmat4(1), inputScale);
#endif
	}
}