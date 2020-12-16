#pragma once

#include <string>
#include <vector>
#include <array>
#include <deque>
#include <unordered_map>
#include <chrono>
#include <algorithm>
#include <sstream>
#include <fstream>
#include <iostream>

#include <glm/glm.hpp>
#include "deps/glm/glm/gtx/transform.hpp"
#include "deps/earcut.hpp"

#include "intersect-mesh-mesh.h"
#include "bool-mesh-mesh.h"

#include "ifc2x3.h"
#include "web-ifc.h"
#include "util.h"

#define CONST_PI 3.141592653589793238462643383279502884L

const bool DEBUG_DUMP_SVG = false;

namespace webifc
{
	class IfcGeometryLoader
	{
	public:
		IfcGeometryLoader(IfcLoader& l) :
			_loader(l)
		{

		}

		IfcGeometry& GetGeometry(uint64_t index)
		{
			return _geometry[index];
		}

		IfcComposedMesh GetMesh(uint64_t expressID)
		{
			return GetMeshByLine(_loader.ExpressIDToLineID(expressID));
		}

		IfcProfile GetProfile(uint64_t expressID)
		{
			return GetProfileByLine(_loader.ExpressIDToLineID(expressID));
		}

		void DumpMesh(IfcComposedMesh& mesh, std::wstring filename)
		{
			std::ofstream out(L"debug_output/" + filename);
			int offset = 0;
			out << ToObj(mesh, offset, NormalizeIFC);
		}

	private:
		int GetArgumentOffset(std::vector<IfcToken>& line, int argumentIndex)
		{
			// first tokens are ref, type, openset, start at 3
			int currentArgument = 0;
			bool insideSet = false; // assume no nested sets
			for (int i = 3; i < line.size(); i++)
			{
				if (currentArgument == argumentIndex)
				{
					return i;
				}

				if (line[i].type == IfcTokenType::SET_BEGIN)
				{
					insideSet = true;
				}
				if (line[i].type == IfcTokenType::SET_END)
				{
					insideSet = false;
				}

				if (!insideSet)
				{
					currentArgument++;
				}
			}
		}

		std::string GetStringArgument(std::vector<IfcToken>& line, int argumentIndex)
		{
			int offset = GetArgumentOffset(line, argumentIndex);
			IfcToken& str = line[offset];
			return _loader.GetString(str);
		}

		inline std::vector<uint32_t> GetSetArgument(std::vector<IfcToken>& line, int argumentIndex)
		{
			std::vector<uint32_t> tokenIds;
			int offset = GetArgumentOffset(line, argumentIndex) + 1;
			for (int i = offset; i < line.size(); i++)
			{
				if (line[i].type == IfcTokenType::SET_END)
				{
					break;
				}
				tokenIds.push_back(i);
			}

			return tokenIds;
		}

		void PopulateRelVoidsMap()
		{
			auto relVoids = _loader.GetExpressIDsWithType(ifc2x3::IFCRELVOIDSELEMENT);

			for (uint64_t relVoidID : relVoids)
			{
				uint32_t lineID = _loader.ExpressIDToLineID(relVoidID);
				auto& line = _loader.GetLine(lineID);
				auto& tokens = _loader.GetLineTokens(lineID);

				uint64_t relatingBuildingElement = tokens[GetArgumentOffset(tokens, 4)].num;
				uint64_t relatedOpeningElement = tokens[GetArgumentOffset(tokens, 5)].num;

				_relVoids[relatingBuildingElement].push_back(relatedOpeningElement);
			}
		
			_isRelVoidsMapPopulated = true;
		}

		void PopulateRelVoidsMapIfNeeded()
		{
			if (_isRelVoidsMapPopulated)
			{
				return;
			}

			PopulateRelVoidsMap();
		}

		IfcComposedMesh GetMeshByLine(uint64_t lineID)
		{
			PopulateRelVoidsMapIfNeeded();

			auto& line = _loader.GetLine(lineID);
			auto& tokens = _loader.GetLineTokens(lineID);
			switch (line.ifcType)
			{
			case ifc2x3::IFCCOLUMN:
			case ifc2x3::IFCSLAB:
			case ifc2x3::IFCBEAM:
			case ifc2x3::IFCFOOTING:
			case ifc2x3::IFCOPENINGELEMENT:
			case ifc2x3::IFCWALLSTANDARDCASE:
			{
				IfcComposedMesh mesh;

				uint32_t localPlacement = tokens[GetArgumentOffset(tokens, 5)].num;
				uint32_t ifcPresentation = tokens[GetArgumentOffset(tokens, 6)].num;

				mesh.transformation = GetLocalPlacement(localPlacement);
				mesh.children.push_back(GetMesh(ifcPresentation));

				auto relVoids = _relVoids[line.expressID];

				if (!relVoids.empty())
				{
					IfcComposedMesh resultMesh;
					resultMesh.transformation = glm::dmat4(1);

					auto flatElementMesh = flatten(mesh);

					for (auto relVoidExpressID : relVoids)
					{
						IfcComposedMesh voidMesh = GetMesh(relVoidExpressID);
						auto flatVoidMesh = flatten(voidMesh);

						IfcGeometry m1;
						IfcGeometry m2;

						intersectMeshMesh(flatElementMesh, flatVoidMesh, m1, m2);

						// TODO: this is inefficient, better make one-to-many subtraction in bool logic
						flatElementMesh = boolSubtract(m1, m2);
					}

					resultMesh.geom = flatElementMesh;

					return resultMesh;
				}
				else
				{
					return mesh;
				}
			}
			case ifc2x3::IFCMAPPEDITEM:
			{
				IfcComposedMesh mesh;

				uint32_t ifcPresentation = tokens[GetArgumentOffset(tokens, 0)].num;
				uint32_t localPlacement = tokens[GetArgumentOffset(tokens, 1)].num;

				mesh.transformation = GetLocalPlacement(localPlacement);
				mesh.children.push_back(GetMesh(ifcPresentation));

				return mesh;
			}
			case ifc2x3::IFCREPRESENTATIONMAP:
			{
				IfcComposedMesh mesh;

				uint32_t axis2Placement = tokens[GetArgumentOffset(tokens, 0)].num;
				uint32_t ifcPresentation = tokens[GetArgumentOffset(tokens, 1)].num;

				mesh.transformation = GetLocalPlacement(axis2Placement);
				mesh.children.push_back(GetMesh(ifcPresentation));

				return mesh;
			}
			case ifc2x3::IFCFACETEDBREP:
			{
				IfcComposedMesh mesh;

				uint32_t ifcPresentation = tokens[GetArgumentOffset(tokens, 0)].num;

				mesh.transformation = glm::dmat4(1);
				mesh.geom = GetBrep(ifcPresentation);

				return mesh;
			}
			case ifc2x3::IFCPRODUCTDEFINITIONSHAPE:
			{
				IfcComposedMesh mesh;

				auto representations = GetSetArgument(tokens, 2);

				mesh.transformation = glm::dmat4(1);
				for (auto& repToken : representations)
				{
					uint32_t repID = tokens[repToken].num;
					mesh.children.push_back(GetMesh(repID));
				}

				return mesh;
			}
			case ifc2x3::IFCSHAPEREPRESENTATION:
			{
				IfcComposedMesh mesh;

				auto repItems = GetSetArgument(tokens, 3);

				mesh.transformation = glm::dmat4(1);
				for (auto& repToken : repItems)
				{
					uint32_t repID = tokens[repToken].num;
					mesh.children.push_back(GetMesh(repID));
				}

				return mesh;
			}
			case ifc2x3::IFCEXTRUDEDAREASOLID:
			{
				IfcComposedMesh mesh;

				uint32_t profileID = tokens[GetArgumentOffset(tokens, 0)].num;
				uint32_t placementID = tokens[GetArgumentOffset(tokens, 1)].num;
				uint32_t directionID = tokens[GetArgumentOffset(tokens, 2)].num;
				double depth = tokens[GetArgumentOffset(tokens, 3)].real;

				IfcProfile profile = GetProfile(profileID);
				glm::dmat4 placement = GetLocalPlacement(placementID);
				glm::dvec3 dir = GetCartesianPoint3D(directionID);

				if (DEBUG_DUMP_SVG)
				{
					DumpSVGCurve(profile.curve.points, L"IFCEXTRUDEDAREASOLID_curve.html");
				}

				IfcGeometry geom = Extrude(profile, placement, dir, depth);

				if (DEBUG_DUMP_SVG)
				{
					DumpIfcGeometry(geom, L"IFCEXTRUDEDAREASOLID_geom.obj");
				}

				mesh.transformation = glm::dmat4(1);
				mesh.geom = geom;

				return mesh;
			}

			default:
				break;
			}

			return IfcComposedMesh();
		}

		IfcGeometry GetBrep(uint64_t expressID)
		{
			auto lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);
			auto& tokens = _loader.GetLineTokens(lineID);
			switch (line.ifcType)
			{
			case ifc2x3::IFCCLOSEDSHELL:
			{
				auto faces = GetSetArgument(tokens, 0);

				IfcGeometry geometry;
				for (auto& faceToken : faces)
				{
					uint32_t faceID = tokens[faceToken].num;
					AddFaceToGeometry(faceID, geometry);
				}

				return geometry;
			}

			default:
				break;
			}

			return IfcGeometry();
		}

		void AddFaceToGeometry(uint64_t expressID, IfcGeometry& geometry)
		{
			auto lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);
			auto& tokens = _loader.GetLineTokens(lineID);

			switch (line.ifcType)
			{
			case ifc2x3::IFCFACE:
			{
				auto bounds = GetSetArgument(tokens, 0);

				std::vector<IfcBound3D> bounds3D;

				for (auto& boundToken : bounds)
				{
					uint32_t boundID = tokens[boundToken].num;
					bounds3D.push_back(GetBound(boundID));
				}

				TriangulateBounds(geometry, bounds3D);
			}

			default:
				break;
			}
		}

		IfcBound3D GetBound(uint64_t expressID)
		{
			auto lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);
			auto& tokens = _loader.GetLineTokens(lineID);

			switch (line.ifcType)
			{
			case ifc2x3::IFCFACEOUTERBOUND:
			{
				uint32_t loop = tokens[GetArgumentOffset(tokens, 0)].num;
				IfcToken orientation = tokens[GetArgumentOffset(tokens, 1)];

				IfcBound3D bound;
				bound.curve = GetLoop(loop);
				bound.orientation = true;
				bound.type = IfcBoundType::OUTERBOUND;

				return bound;
			}
			case ifc2x3::IFCFACEBOUND:
			{
				uint32_t loop = tokens[GetArgumentOffset(tokens, 0)].num;
				IfcToken orientation = tokens[GetArgumentOffset(tokens, 1)];

				IfcBound3D bound;
				bound.curve = GetLoop(loop);
				bound.orientation = true;
				bound.type = IfcBoundType::BOUND;

				return bound;
			}

			default:
				break;
			}

			return IfcBound3D();
		}

		IfcCurve3D GetLoop(uint64_t expressID)
		{
			auto lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);
			auto& tokens = _loader.GetLineTokens(lineID);

			switch (line.ifcType)
			{
			case ifc2x3::IFCPOLYLOOP:
			{
				IfcCurve3D curve;

				auto points = GetSetArgument(tokens, 0);

				for (auto& token : points)
				{
					uint32_t pointId = tokens[token].num;
					curve.points.push_back(GetCartesianPoint3D(pointId));
				}

				return curve;
			}

			default:
				break;
			}
		}

		void TriangulateBounds(IfcGeometry& geometry, std::vector<IfcBound3D>& bounds)
		{
			if (bounds.size() == 1 && bounds[0].curve.points.size() == 3)
			{
				auto c = bounds[0].curve;

				int offset = geometry.points.size();

				// triangle
				geometry.points.push_back(c.points[0]);
				geometry.points.push_back(c.points[1]);
				geometry.points.push_back(c.points[2]);

				Face f1;
				f1.i0 = offset + 0;
				f1.i1 = offset + 1;
				f1.i2 = offset + 2;

				geometry.faces.push_back(f1);
			}
			else if (bounds.size() == 1 && bounds[0].curve.points.size() == 4)
			{
				auto c = bounds[0].curve;
				
				int offset = geometry.points.size();

				// quad, since the loop is genus 1 we can always triangulate this
				geometry.points.push_back(c.points[0]);
				geometry.points.push_back(c.points[1]);
				geometry.points.push_back(c.points[2]);
				geometry.points.push_back(c.points[3]);

				Face f1;
				f1.i0 = offset + 0;
				f1.i1 = offset + 1;
				f1.i2 = offset + 2;

				Face f2;
				f2.i0 = offset + 0;
				f2.i1 = offset + 2;
				f2.i2 = offset + 3;

				geometry.faces.push_back(f1);
				geometry.faces.push_back(f2);

				// TODO: assuming 0,1,2 NOT colinear!
				glm::dvec3 v1 = bounds[0].curve.points[0];
				glm::dvec3 v2 = bounds[0].curve.points[1];
				glm::dvec3 v3 = bounds[0].curve.points[2];

				glm::dvec3 v12(glm::normalize(v2 - v1));
				glm::dvec3 v13(glm::normalize(v3 - v1));
				glm::dvec3 n = glm::normalize(glm::cross(v12, v13));
				v12 = glm::cross(v13, n);


				glm::dvec3 pt0 = c.points[0] - v1;
				glm::dvec2 p0(
					glm::dot(pt0, v12),
					glm::dot(pt0, v13)
				);

				glm::dvec3 pt1 = c.points[1] - v1;
				glm::dvec2 p1(
					glm::dot(pt1, v12),
					glm::dot(pt1, v13)
				);
				glm::dvec3 pt2 = c.points[2] - v1;
				glm::dvec2 p2(
					glm::dot(pt2, v12),
					glm::dot(pt2, v13)
				);
				glm::dvec3 pt3 = c.points[3] - v1;
				glm::dvec2 p3(
					glm::dot(pt3, v12),
					glm::dot(pt3, v13)
				);

				std::vector<glm::dvec2> temp;
				temp.push_back(p0);
				temp.push_back(p1);
				temp.push_back(p2);
				temp.push_back(p3);

				std::vector<uint32_t> indices;
				indices.push_back(0);
				indices.push_back(1);
				indices.push_back(2);

				indices.push_back(0);
				indices.push_back(2);
				indices.push_back(3);
			}
			else
			{
				// bound greater than 4 vertices or with holes, triangulate
				// TODO: modify to use glm::dvec2 with custom accessors
				using Point = std::array<double, 2>;
				std::vector<std::vector<Point>> polygon;

				int offset = geometry.points.size();
				
				// TODO: assuming that outer bound is first!
				// TODO: assuming 0,1,2 NOT colinear!
				glm::dvec3 v1 = bounds[0].curve.points[0];
				glm::dvec3 v2 = bounds[0].curve.points[1];
				glm::dvec3 v3 = bounds[0].curve.points[2];

				glm::dvec3 v12(glm::normalize(v2 - v1));
				glm::dvec3 v13(glm::normalize(v3 - v1));
				glm::dvec3 n = glm::normalize(glm::cross(v12, v13));
				v12 = glm::cross(v13, n);

				std::vector<glm::dvec2> temp;

				for (auto& bound : bounds)
				{
					std::vector<Point> points;
					for (int i = 0; i < bound.curve.points.size(); i++)
					{
						glm::dvec3 pt = bound.curve.points[i];
						geometry.points.push_back(pt);

						// project pt onto plane of curve to obtain 2d coords
						glm::dvec3 pt2 = pt - v1;

						glm::dvec2 proj(
							glm::dot(pt2, v12),
							glm::dot(pt2, v13)
						);

						temp.push_back(proj);
						points.push_back({ proj.x, proj.y });
					}

					polygon.push_back(points);
				}


				std::vector<uint32_t> indices = mapbox::earcut<uint32_t>(polygon);

				for (int i = 0; i < indices.size(); i += 3)
				{
					Face f2;
					f2.i0 = offset + indices[i + 0];
					f2.i1 = offset + indices[i + 1];
					f2.i2 = offset + indices[i + 2];

					geometry.faces.push_back(f2);
				}
			}
		}

		IfcGeometry Extrude(IfcProfile profile, glm::dmat4 placement, glm::dvec3 dir, double distance)
		{
			// TODO: This code generates much more vertices than needed!
			IfcGeometry geom;

			if (false && profile.isConvex)
			{
				int profileSize = profile.curve.points.size();
				if (equals2d(profile.curve.points[0], profile.curve.points[profileSize - 1]))
				{
					profileSize--;
				}
				// simplified convex fan triangulation
				int offset = 0;
				for (int i = 0; i < profileSize; i++)
				{
					glm::dvec2 pt = profile.curve.points[i];
					glm::dvec4 sb = placement * glm::dvec4(glm::dvec3(pt, 0), 1);
					geom.points.push_back(sb);

					if (i > 1)
					{
						Face f1;
						f1.i0 = offset + 0;
						f1.i1 = offset + i;
						f1.i2 = offset + i - 1;

						geom.faces.push_back(f1);

						CheckTriangle(f1, geom.points);
					}
				}

				offset = geom.points.size();
				for (int i = 0; i < profileSize; i++)
				{
					glm::dvec2 pt = profile.curve.points[i];
					glm::dvec4 et = placement * glm::dvec4(glm::dvec3(pt, 0) + dir * distance, 1);
					geom.points.push_back(et);

					if (i > 1)
					{
						Face f2;
						f2.i0 = offset + 0;
						f2.i1 = offset + i - 1;
						f2.i2 = offset + i;

						geom.faces.push_back(f2);
						CheckTriangle(f2, geom.points);
					}
				}
			}
			else
			{
				// TODO: triangulate concave profile and append to geom
				using Point = std::array<double, 2>;
				std::vector<std::vector<Point>> polygon;
				polygon.resize(1);

				for (int i = 0; i < profile.curve.points.size(); i++)
				{
					glm::dvec2 pt = profile.curve.points[i];
					glm::dvec4 et = placement * glm::dvec4(glm::dvec3(pt, 0) + dir * distance, 1);

					geom.points.push_back(et);
					polygon[0].push_back({ pt.x, pt.y });
				}

				std::vector<uint32_t> indices = mapbox::earcut<uint32_t>(polygon);

				int offset = 0;
				for (int i = 0; i < indices.size(); i += 3)
				{
					Face f2;
					f2.i0 = offset + indices[i + 0];
					f2.i1 = offset + indices[i + 1];
					f2.i2 = offset + indices[i + 2];

					geom.faces.push_back(f2);
					CheckTriangle(f2, geom.points);
				}

				offset += geom.points.size();

				for (int i = 0; i < profile.curve.points.size(); i++)
				{
					glm::dvec2 pt = profile.curve.points[i];
					glm::dvec4 et = placement * glm::dvec4(glm::dvec3(pt, 0), 1);

					geom.points.push_back(et);
				}

				for (int i = 0; i < indices.size(); i += 3)
				{
					Face f2;
					f2.i0 = offset + indices[i + 0];
					f2.i1 = offset + indices[i + 2];
					f2.i2 = offset + indices[i + 1];

					geom.faces.push_back(f2);
					CheckTriangle(f2, geom.points);
				}
			}

			// for each line
			for (int i = 1; i < profile.curve.points.size(); i++)
			{
				auto& start = profile.curve.points[i - 1];
				auto& end = profile.curve.points[i];

				glm::dvec4 sb = placement * glm::dvec4(start, 0, 1);
				glm::dvec4 eb = placement * glm::dvec4(end, 0, 1);

				glm::dvec4 st = placement * glm::dvec4(glm::dvec3(start, 0) + dir * distance, 1);
				glm::dvec4 et = placement * glm::dvec4(glm::dvec3(end, 0) + dir * distance, 1);

				int offset = geom.points.size();
				geom.points.push_back(sb);
				geom.points.push_back(eb);

				geom.points.push_back(st);
				geom.points.push_back(et);

				// sb st eb
				Face f1;
				f1.i0 = offset + 0;
				f1.i1 = offset + 1;
				f1.i2 = offset + 2;

				// st et eb
				Face f2;
				f2.i0 = offset + 2;
				f2.i1 = offset + 1;
				f2.i2 = offset + 3;

				geom.faces.push_back(f1);
				geom.faces.push_back(f2);
				CheckTriangle(f1, geom.points);
				CheckTriangle(f2, geom.points);
			}

			return geom;
		}

		bool IsCurveConvex(IfcCurve& curve)
		{
			for (int i = 2; i < curve.points.size(); i++)
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


		IfcProfile GetProfileByLine(uint64_t lineID)
		{
			auto& line = _loader.GetLine(lineID);
			auto& tokens = _loader.GetLineTokens(lineID);
			switch (line.ifcType)
			{
			case ifc2x3::IFCARBITRARYCLOSEDPROFILEDEF:
			{
				IfcProfile profile;

				profile.type = GetStringArgument(tokens, 0);
				profile.curve = GetCurve(tokens[GetArgumentOffset(tokens, 2)].num);
				profile.isConvex = IsCurveConvex(profile.curve);

				return profile;
			}
			case ifc2x3::IFCRECTANGLEPROFILEDEF:
			{
				IfcProfile profile;

				profile.type = GetStringArgument(tokens, 0);
				profile.isConvex = true;
				double xdim = tokens[GetArgumentOffset(tokens, 3)].real;
				double ydim = tokens[GetArgumentOffset(tokens, 4)].real;

				uint32_t placementID = tokens[GetArgumentOffset(tokens, 2)].num;
				glm::dmat3 placement = GetAxis2Placement2D(placementID);

				double halfX = xdim / 2;
				double halfY = ydim / 2;

				glm::dvec2 bl = placement * glm::dvec3(-halfX, -halfY, 1);
				glm::dvec2 br = placement * glm::dvec3(halfX, -halfY, 1);
				
				glm::dvec2 tl = placement * glm::dvec3(-halfX, halfY, 1);
				glm::dvec2 tr = placement * glm::dvec3(halfX, halfY, 1);

				IfcCurve c;
				c.points.push_back(bl);
				c.points.push_back(tl);
				c.points.push_back(tr);
				c.points.push_back(br);
				c.points.push_back(bl);

				profile.curve = c;

				return profile;
			}
			case ifc2x3::IFCCIRCLEPROFILEDEF:
			{
				IfcProfile profile;

				profile.type = GetStringArgument(tokens, 0);
				profile.isConvex = true;

				uint32_t placementID = tokens[GetArgumentOffset(tokens, 2)].num;
				double radius = tokens[GetArgumentOffset(tokens, 3)].real;
				
				glm::dmat3 placement = GetAxis2Placement2D(placementID);

				const int CIRCLE_SEGMENTS = 5;

				IfcCurve c;

				for (int i = 0; i < CIRCLE_SEGMENTS; i++)
				{
					double ratio = static_cast<double>(i) / CIRCLE_SEGMENTS;
					double angle = ratio * CONST_PI * 2;
					glm::dvec2 circleCoordinate (
						radius * std::sinf(angle),
						radius * std::cosf(angle)
					);
					glm::dvec2 pos = placement * glm::dvec3(circleCoordinate, 1);
					c.points.push_back(pos);
				}
				c.points.push_back(c.points[0]);

				profile.curve = c;

				return profile;
			}

			default:
				break;
			}

			return IfcProfile();
		}

		glm::dmat3 GetAxis2Placement2D(uint64_t expressID)
		{
			uint32_t lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);
			auto& tokens = _loader.GetLineTokens(lineID);

			uint32_t locationID = tokens[GetArgumentOffset(tokens, 0)].num;
			IfcToken dirToken = tokens[GetArgumentOffset(tokens, 1)];

			glm::dvec2 pos = GetCartesianPoint2D(locationID);
			glm::dvec2 xAxis = glm::dvec2(1, 0);

			if (dirToken.type == IfcTokenType::REF)
			{
				xAxis = GetCartesianPoint2D(dirToken.num);
			}

			glm::dvec2 yAxis = glm::dvec2(xAxis.y, -xAxis.x);

			return glm::dmat3(
				glm::dvec3(xAxis, 0),
				glm::dvec3(yAxis, 0),
				glm::dvec3(pos, 1)
			);
		}

		glm::dmat4 GetLocalPlacement(uint64_t expressID)
		{
			uint32_t lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);
			auto& tokens = _loader.GetLineTokens(lineID);
			switch (line.ifcType)
			{
			case ifc2x3::IFCAXIS2PLACEMENT3D:
			{
				uint32_t posID = tokens[GetArgumentOffset(tokens, 0)].num;
				IfcToken zID = tokens[GetArgumentOffset(tokens, 1)];
				IfcToken xID = tokens[GetArgumentOffset(tokens, 2)];

				glm::dvec3 pos = GetCartesianPoint3D(posID);

				glm::dvec3 zAxis(0, 0, 1);
				glm::dvec3 xAxis(1, 0, 0);
				
				if (zID.type == IfcTokenType::REF)
				{
					zAxis = GetCartesianPoint3D(zID.num);
				}

				if (xID.type == IfcTokenType::REF)
				{
					xAxis = GetCartesianPoint3D(xID.num);
				}
					
				glm::dvec3 yAxis = glm::cross(zAxis, xAxis);

				return glm::dmat4(
					glm::dvec4(xAxis, 0),
					glm::dvec4(yAxis, 0),
					glm::dvec4(zAxis, 0),
					glm::dvec4(pos, 1)
				);
			}
			case ifc2x3::IFCLOCALPLACEMENT:
			{
				IfcToken relPlacementToken = tokens[GetArgumentOffset(tokens, 0)];
				uint32_t axis2PlacementID = tokens[GetArgumentOffset(tokens, 1)].num;

				glm::dmat4 relPlacement(1);
				glm::dmat4 axis2Placement = GetLocalPlacement(axis2PlacementID);

				if (relPlacementToken.type == IfcTokenType::REF)
				{
					relPlacement = GetLocalPlacement(relPlacementToken.num);
				}

				auto result = relPlacement * axis2Placement;
				return result;;
			}
			case ifc2x3::IFCCARTESIANTRANSFORMATIONOPERATOR3D:
			case ifc2x3::IFCCARTESIANTRANSFORMATIONOPERATOR3DNONUNIFORM:
			{
				IfcToken a1Token = tokens[GetArgumentOffset(tokens, 0)];
				IfcToken a2Token = tokens[GetArgumentOffset(tokens, 1)];
				uint32_t posID = tokens[GetArgumentOffset(tokens, 2)].num;
				IfcToken s1Token = tokens[GetArgumentOffset(tokens, 3)];
				IfcToken a3Token = tokens[GetArgumentOffset(tokens, 4)];

				IfcToken s2Token;
				IfcToken s3Token;

				if (line.ifcType == ifc2x3::IFCCARTESIANTRANSFORMATIONOPERATOR3DNONUNIFORM)
				{
					s2Token = tokens[GetArgumentOffset(tokens, 5)];
					s3Token = tokens[GetArgumentOffset(tokens, 6)];
				}

				double scale1 = 1.0;
				double scale2 = 1.0;
				double scale3 = 1.0;

				if (s1Token.type == IfcTokenType::REF) scale1 = s1Token.real;
				if (s2Token.type == IfcTokenType::REF) scale2 = s2Token.real;
				if (s3Token.type == IfcTokenType::REF) scale3 = s3Token.real;

				
				glm::dvec3 pos = GetCartesianPoint3D(posID);

				glm::dvec3 Axis1(1, 0, 0);
				glm::dvec3 Axis2(0, 1, 0);
				glm::dvec3 Axis3(0, 0, 1);

				if (a1Token.type == IfcTokenType::REF) Axis1 = GetCartesianPoint3D(a1Token.num);
				if (a2Token.type == IfcTokenType::REF) Axis2 = GetCartesianPoint3D(a2Token.num);
				if (a3Token.type == IfcTokenType::REF) Axis3 = GetCartesianPoint3D(a3Token.num);

				return glm::dmat4(
					glm::dvec4(Axis1 * scale1, 0),
					glm::dvec4(Axis2 * scale2, 0),
					glm::dvec4(Axis3 * scale3, 0),
					glm::dvec4(pos, 1)
				);
			}

			default:
				break;
			}

			return glm::dmat4();
		}

		IfcCurve GetCurve(uint64_t expressID)
		{
			uint32_t lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);
			auto& tokens = _loader.GetLineTokens(lineID);
			switch (line.ifcType)
			{
			case ifc2x3::IFCPOLYLINE:
			{
				IfcCurve curve;

				auto points = GetSetArgument(tokens, 0);

				for (auto& token : points)
				{
					uint32_t pointId = tokens[token].num;
					curve.points.push_back(GetCartesianPoint2D(pointId));
				}

				return curve;
			}

			default:
				break;
			}

			return IfcCurve();
		}

		glm::dvec2 GetCartesianPoint2D(uint64_t expressID)
		{
			uint32_t lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);
			auto& tokens = _loader.GetLineTokens(lineID);

			auto coords = GetSetArgument(tokens, 0);

			glm::dvec2 point(
				tokens[coords[0]].real,
				tokens[coords[1]].real
			);

			return point;
		}

		glm::dvec3 GetCartesianPoint3D(uint64_t expressID)
		{
			uint32_t lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);
			auto& tokens = _loader.GetLineTokens(lineID);

			auto coords = GetSetArgument(tokens, 0);

			glm::dvec3 point(
				tokens[coords[0]].real,
				tokens[coords[1]].real,
				tokens[coords[2]].real
			);

			return point;
		}

		IfcLoader& _loader;
		std::vector<IfcGeometry> _geometry;
		std::unordered_map<uint64_t, std::vector<uint64_t>> _relVoids;
		bool _isRelVoidsMapPopulated = false;
	};
}