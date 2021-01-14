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

#include "../deps/glm/glm/glm.hpp"
#include "../deps/glm/glm/gtx/transform.hpp"
#include "../deps/earcut.hpp"

#include "intersect-mesh-mesh.h"
#include "bool-mesh-mesh.h"


#include "../web-ifc-schema/ifc2x4.h"
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

		IfcGeometry GetFlattenedGeometry(uint64_t expressID)
		{
			auto mesh = GetMeshByLine(_loader.ExpressIDToLineID(expressID));
            return flatten(mesh, NormalizeIFC);
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
			int offset = 0;
            writeFile(filename, ToObj(mesh, offset, NormalizeIFC));
		}

	private:

		void PopulateRelVoidsMap()
		{
			auto relVoids = _loader.GetExpressIDsWithType(ifc2x4::IFCRELVOIDSELEMENT);

			for (uint64_t relVoidID : relVoids)
			{
				uint32_t lineID = _loader.ExpressIDToLineID(relVoidID);
				auto& line = _loader.GetLine(lineID);

				_loader.MoveToArgumentOffset(line, 4);

				uint64_t relatingBuildingElement = _loader.GetRefArgument();
				uint64_t relatedOpeningElement = _loader.GetRefArgument();

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
			bool isIfcElement = ifc2x4::IsIfcElement(line.ifcType);
			if (isIfcElement)
			{
				IfcComposedMesh mesh;

				_loader.MoveToArgumentOffset(line, 5);
				uint32_t localPlacement = 0;
				if (_loader.GetTokenType() == IfcTokenType::REF)
				{
					_loader.Reverse();
					localPlacement = _loader.GetRefArgument();
				}
				uint32_t ifcPresentation = 0;
				if (_loader.GetTokenType() == IfcTokenType::REF)
				{
					_loader.Reverse();
					ifcPresentation = _loader.GetRefArgument();
				}

				if (localPlacement != 0)
				{
					mesh.transformation = GetLocalPlacement(localPlacement);
				}
				else
				{
					mesh.transformation = glm::dmat4(1);
				}

				if (ifcPresentation != 0)
				{
					mesh.children.push_back(GetMesh(ifcPresentation));
				}

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

						// DumpIfcGeometry(flatVoidMesh, L"void.obj");
						// DumpIfcGeometry(flatElementMesh, L"mesh.obj");

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
			else
			{
				switch (line.ifcType)
				{
				case ifc2x4::IFCMAPPEDITEM:
				{
					IfcComposedMesh mesh;

					_loader.MoveToArgumentOffset(line, 0);
					uint32_t ifcPresentation = _loader.GetRefArgument();
					uint32_t localPlacement = _loader.GetRefArgument();

					mesh.transformation = GetLocalPlacement(localPlacement);
					mesh.children.push_back(GetMesh(ifcPresentation));

					return mesh;
				}
				case ifc2x4::IFCREPRESENTATIONMAP:
				{
					IfcComposedMesh mesh;

					_loader.MoveToArgumentOffset(line, 0);
					uint32_t axis2Placement = _loader.GetRefArgument();
					uint32_t ifcPresentation = _loader.GetRefArgument();

					mesh.transformation = GetLocalPlacement(axis2Placement);
					mesh.children.push_back(GetMesh(ifcPresentation));

					return mesh;
				}
				case ifc2x4::IFCSHELLBASEDSURFACEMODEL:
				{
					IfcComposedMesh mesh;

					mesh.transformation = glm::dmat4(1);

					_loader.MoveToArgumentOffset(line, 0);
					auto shells = _loader.GetSetArgument();

					for (auto& shell : shells)
					{
						uint32_t shellRef = _loader.GetRefArgument(shell);
						IfcComposedMesh temp;
						temp.geom = GetBrep(shellRef);
						temp.transformation = glm::dmat4(1);
						mesh.children.push_back(temp);
					}

					return mesh;
				}
				case ifc2x4::IFCFACETEDBREP:
				{
					IfcComposedMesh mesh;

					_loader.MoveToArgumentOffset(line, 0);
					uint32_t ifcPresentation = _loader.GetRefArgument();

					mesh.transformation = glm::dmat4(1);
					mesh.geom = GetBrep(ifcPresentation);

					return mesh;
				}
				case ifc2x4::IFCPRODUCTDEFINITIONSHAPE:
				{
					IfcComposedMesh mesh;

					_loader.MoveToArgumentOffset(line, 2);
					auto representations = _loader.GetSetArgument();

					mesh.transformation = glm::dmat4(1);
					for (auto& repToken : representations)
					{
						uint32_t repID = _loader.GetRefArgument(repToken);
						mesh.children.push_back(GetMesh(repID));
					}

					return mesh;
				}
				case ifc2x4::IFCSHAPEREPRESENTATION:
				{
					IfcComposedMesh mesh;

					_loader.MoveToArgumentOffset(line, 1);
					auto type = _loader.GetStringArgument();

					if (type != "Body")
					{
						return mesh;
					}

					_loader.MoveToArgumentOffset(line, 3);
					auto repItems = _loader.GetSetArgument();

					mesh.transformation = glm::dmat4(1);
					for (auto& repToken : repItems)
					{
						uint32_t repID = _loader.GetRefArgument(repToken);
						mesh.children.push_back(GetMesh(repID));
					}

					return mesh;
				}
				case ifc2x4::IFCEXTRUDEDAREASOLID:
				{
					IfcComposedMesh mesh;

					_loader.MoveToArgumentOffset(line, 0);
					uint32_t profileID = _loader.GetRefArgument();
					uint32_t placementID = _loader.GetRefArgument();
					uint32_t directionID = _loader.GetRefArgument();
					double depth = _loader.GetDoubleArgument();

					IfcProfile profile = GetProfile(profileID);
					glm::dmat4 placement = GetLocalPlacement(placementID);
					glm::dvec3 dir = GetCartesianPoint3D(directionID);

					double dirDot = glm::dot(dir, glm::dvec3(0, 0, 1));
					bool flipWinding = dirDot < 0; // can't be perp according to spec

					if (DEBUG_DUMP_SVG)
					{
						DumpSVGCurve(profile.curve.points, L"IFCEXTRUDEDAREASOLID_curve.html");
					}

					IfcGeometry geom = Extrude(profile, placement, dir, depth);

					if (flipWinding)
					{
						for (auto& face : geom.faces)
						{
							std::swap(face.i1, face.i2);
						}
					}

					if (DEBUG_DUMP_SVG)
					{
						DumpIfcGeometry(geom, L"IFCEXTRUDEDAREASOLID_geom.obj");
					}

					mesh.transformation = glm::dmat4(1);
					mesh.geom = geom;

					return mesh;
				}

				default:
					std::cout << "Unexpected mesh type: " << line.ifcType << " at " << line.expressID << std::endl;
					break;
				}
			}

			return IfcComposedMesh();
		}

		IfcGeometry GetBrep(uint64_t expressID)
		{
			auto lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);
			switch (line.ifcType)
			{
			case ifc2x4::IFCCLOSEDSHELL:
			{
				_loader.MoveToArgumentOffset(line, 0);
				auto faces = _loader.GetSetArgument();

				IfcGeometry geometry;
				for (auto& faceToken : faces)
				{
					uint32_t faceID = _loader.GetRefArgument(faceToken);
					AddFaceToGeometry(faceID, geometry);
				}

				return geometry;
			}
			case ifc2x4::IFCOPENSHELL:
			{
				_loader.MoveToArgumentOffset(line, 0);
				auto faces = _loader.GetSetArgument();

				IfcGeometry geometry;
				for (auto& faceToken : faces)
				{
					uint32_t faceID = _loader.GetRefArgument(faceToken);
					AddFaceToGeometry(faceID, geometry);
				}

				return geometry;
			}
			default:
				std::cout << "Unexpected shell type: " << line.ifcType << " at " << expressID << std::endl;
				break;
			}

			return IfcGeometry();
		}

		void AddFaceToGeometry(uint64_t expressID, IfcGeometry& geometry)
		{
			auto lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);

			switch (line.ifcType)
			{
			case ifc2x4::IFCFACE:
			{
				_loader.MoveToArgumentOffset(line, 0);
				auto bounds = _loader.GetSetArgument();

				std::vector<IfcBound3D> bounds3D;

				for (auto& boundToken : bounds)
				{
					uint32_t boundID = _loader.GetRefArgument(boundToken);
					bounds3D.push_back(GetBound(boundID));
				}

				TriangulateBounds(geometry, bounds3D);
				break;
			}

			default:
				std::cout << "Unexpected face type: " << line.ifcType << " at " << expressID << std::endl;
				break;
			}
		}

		IfcBound3D GetBound(uint64_t expressID)
		{
			auto lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);

			switch (line.ifcType)
			{
			case ifc2x4::IFCFACEOUTERBOUND:
			{
				_loader.MoveToArgumentOffset(line, 0);
				uint32_t loop = _loader.GetRefArgument();
				// IfcToken orientation = tokens[_loader.GetArgumentOffset(tokens, 1)];

				IfcBound3D bound;
				bound.curve = GetLoop(loop);
				bound.orientation = true;
				bound.type = IfcBoundType::OUTERBOUND;

				return bound;
			}
			case ifc2x4::IFCFACEBOUND:
			{
				_loader.MoveToArgumentOffset(line, 0);
				uint32_t loop = _loader.GetRefArgument();
				// IfcToken orientation = tokens[_loader.GetArgumentOffset(tokens, 1)];

				IfcBound3D bound;
				bound.curve = GetLoop(loop);
				bound.orientation = true;
				bound.type = IfcBoundType::BOUND;

				return bound;
			}

			default:
				std::cout << "Unexpected bound type: " << line.ifcType << " at " << expressID << std::endl;
				break;
			}

			return IfcBound3D();
		}

		IfcCurve3D GetLoop(uint64_t expressID)
		{
			auto lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);

			switch (line.ifcType)
			{
			case ifc2x4::IFCPOLYLOOP:
			{
				IfcCurve3D curve;

				_loader.MoveToArgumentOffset(line, 0);
				auto points = _loader.GetSetArgument();

				curve.points.resize(points.size());

				for (auto& token : points)
				{
					uint32_t pointId = _loader.GetRefArgument(token);
					curve.points.push_back(GetCartesianPoint3D(pointId));
				}

				return curve;
			}

			default:
				std::cout << "Unexpected curve type: " << line.ifcType << " at " << expressID << std::endl;
				break;
			}

			IfcCurve3D curve;
			return curve;
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

				/*
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
				*/
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
			switch (line.ifcType)
			{
			case ifc2x4::IFCARBITRARYCLOSEDPROFILEDEF:
			{
				IfcProfile profile;

				_loader.MoveToArgumentOffset(line, 0);
				profile.type = _loader.GetStringArgument();
				_loader.MoveToArgumentOffset(line, 2);
				profile.curve = GetCurve(_loader.GetRefArgument());
				profile.isConvex = IsCurveConvex(profile.curve);

				return profile;
			}
			case ifc2x4::IFCRECTANGLEPROFILEDEF:
			{
				IfcProfile profile;

				_loader.MoveToArgumentOffset(line, 0);
				profile.type = _loader.GetStringArgument();
				profile.isConvex = true;

				_loader.MoveToArgumentOffset(line, 2);
				uint32_t placementID = _loader.GetRefArgument();
				double xdim = _loader.GetDoubleArgument();
				double ydim = _loader.GetDoubleArgument();

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
			case ifc2x4::IFCCIRCLEPROFILEDEF:
			{
				IfcProfile profile;

				_loader.MoveToArgumentOffset(line, 0);
				profile.type = _loader.GetStringArgument();
				profile.isConvex = true;

				_loader.MoveToArgumentOffset(line, 2);
				uint32_t placementID = _loader.GetRefArgument();
				double radius = _loader.GetDoubleArgument();
				
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
				std::cout << "Unexpected profile type: " << line.ifcType << " at " << line.expressID << std::endl;
				break;
			}

			return IfcProfile();
		}

		glm::dmat3 GetAxis2Placement2D(uint64_t expressID)
		{
			uint32_t lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);

			_loader.MoveToArgumentOffset(line, 0);
			uint32_t locationID = _loader.GetRefArgument();
			IfcTokenType dirToken = _loader.GetTokenType();

			glm::dvec2 xAxis = glm::dvec2(1, 0);
			if (dirToken == IfcTokenType::REF)
			{
				_loader.Reverse();
				xAxis = GetCartesianPoint2D(_loader.GetRefArgument());
			}

			glm::dvec2 pos = GetCartesianPoint2D(locationID);

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
			switch (line.ifcType)
			{
			case ifc2x4::IFCAXIS2PLACEMENT3D:
			{
				glm::dvec3 zAxis(0, 0, 1);
				glm::dvec3 xAxis(1, 0, 0);

				_loader.MoveToArgumentOffset(line, 0);
				uint32_t posID = _loader.GetRefArgument();
				IfcTokenType zID = _loader.GetTokenType();
				if (zID == IfcTokenType::REF)
				{
					_loader.Reverse();
					zAxis = GetCartesianPoint3D(_loader.GetRefArgument());
				}

				_loader.MoveToArgumentOffset(line, 2);
				IfcTokenType xID = _loader.GetTokenType();
				if (xID == IfcTokenType::REF)
				{
					_loader.Reverse();
					xAxis = GetCartesianPoint3D(_loader.GetRefArgument());
				}

				glm::dvec3 pos = GetCartesianPoint3D(posID);


					
				glm::dvec3 yAxis = glm::cross(zAxis, xAxis);

				return glm::dmat4(
					glm::dvec4(xAxis, 0),
					glm::dvec4(yAxis, 0),
					glm::dvec4(zAxis, 0),
					glm::dvec4(pos, 1)
				);
			}
			case ifc2x4::IFCLOCALPLACEMENT:
			{
				glm::dmat4 relPlacement(1);
				
				_loader.MoveToArgumentOffset(line, 0);
				IfcTokenType relPlacementToken = _loader.GetTokenType();
				uint32_t relPlacementID;
				if (relPlacementToken == IfcTokenType::REF)
				{
					_loader.Reverse();
					relPlacement = GetLocalPlacement(_loader.GetRefArgument());
				}

				_loader.MoveToArgumentOffset(line, 1);
				uint32_t axis2PlacementID = _loader.GetRefArgument();

				glm::dmat4 axis2Placement = GetLocalPlacement(axis2PlacementID);


				auto result = relPlacement * axis2Placement;
				return result;;
			}
			case ifc2x4::IFCCARTESIANTRANSFORMATIONOPERATOR3D:
			case ifc2x4::IFCCARTESIANTRANSFORMATIONOPERATOR3DNONUNIFORM:
			{
				double scale1 = 1.0;
				double scale2 = 1.0;
				double scale3 = 1.0;

				glm::dvec3 Axis1(1, 0, 0);
				glm::dvec3 Axis2(0, 1, 0);
				glm::dvec3 Axis3(0, 0, 1);


				_loader.MoveToArgumentOffset(line, 0);
				if (_loader.GetTokenType() == IfcTokenType::REF)
				{
					_loader.Reverse();
					Axis1 = GetCartesianPoint3D(_loader.GetRefArgument());
				}
				_loader.MoveToArgumentOffset(line, 1);
				if (_loader.GetTokenType() == IfcTokenType::REF)
				{
					_loader.Reverse();
					Axis2 = GetCartesianPoint3D(_loader.GetRefArgument());
				}

				_loader.MoveToArgumentOffset(line, 2);
				uint32_t posID = _loader.GetRefArgument();
				glm::dvec3 pos = GetCartesianPoint3D(posID);

				_loader.MoveToArgumentOffset(line, 3);
				if (_loader.GetTokenType() == IfcTokenType::REF)
				{
					_loader.Reverse();
					scale1 = _loader.GetDoubleArgument();
				}
				_loader.MoveToArgumentOffset(line, 4);
				if (_loader.GetTokenType() == IfcTokenType::REF)
				{
					_loader.Reverse();
					Axis3 = GetCartesianPoint3D(_loader.GetRefArgument());
				}

				if (line.ifcType == ifc2x4::IFCCARTESIANTRANSFORMATIONOPERATOR3DNONUNIFORM)
				{
					_loader.MoveToArgumentOffset(line, 5);
					if (_loader.GetTokenType() == IfcTokenType::REF)
					{
						_loader.Reverse();
						scale2 = _loader.GetDoubleArgument();
					}

					_loader.MoveToArgumentOffset(line, 6);
					if (_loader.GetTokenType() == IfcTokenType::REF)
					{
						_loader.Reverse();
						scale3 = _loader.GetDoubleArgument();
					}
				}

				return glm::dmat4(
					glm::dvec4(Axis1 * scale1, 0),
					glm::dvec4(Axis2 * scale2, 0),
					glm::dvec4(Axis3 * scale3, 0),
					glm::dvec4(pos, 1)
				);
			}

			default:
				std::cout << "Unexpected placement type: " << line.ifcType << " at " << expressID << std::endl;
				break;
			}

			return glm::dmat4();
		}

		IfcTrimmingSelect ParseTrimSelect(std::vector<uint32_t>& tapeOffsets)
		{
			IfcTrimmingSelect ts;

			if (tapeOffsets.size() == 2)
			{
				_loader.MoveTo(tapeOffsets[0]);
				std::string type = _loader.GetStringArgument();

				if (type == "IFCPARAMETERVALUE")
				{
					ts.hasParam = true;
					_loader.MoveTo(tapeOffsets[1]);
					ts.param = _loader.GetDoubleArgument();
				}
				else
				{
					printf("Unsupported IfcTrimmingSelect type: IfcCartesianPoint");
				}
			}

			return ts;
		}

		IfcCurve GetCurve(uint64_t expressID)
		{
			IfcCurve curve;
			ComputeCurve(expressID, curve);
			return curve;
		}

		void ComputeCurve(uint64_t expressID, IfcCurve& curve, IfcTrimmingArguments trim = {})
		{
			uint32_t lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);
			switch (line.ifcType)
			{
			case ifc2x4::IFCPOLYLINE:
			{
				_loader.MoveToArgumentOffset(line, 0);
				auto points = _loader.GetSetArgument();

				for (auto& token : points)
				{
					uint32_t pointId = _loader.GetRefArgument(token);
					curve.Add(GetCartesianPoint2D(pointId));
				}

				break;
			}
			case ifc2x4::IFCCOMPOSITECURVE:
			{
				_loader.MoveToArgumentOffset(line, 0);
				auto segments = _loader.GetSetArgument();
				auto selfIntersects = _loader.GetStringArgument();

				if (selfIntersects == "T")
				{
					// TODO: this is probably bad news
					printf("Self intersecting composite curve!");
				}

				for (auto& token : segments)
				{
					if (DEBUG_DUMP_SVG)
					{
						DumpSVGCurve(curve.points, L"partial_curve.html");
					}

					uint32_t segmentId = _loader.GetRefArgument(token);

					ComputeCurve(segmentId, curve);
				}

				break;
			}
			case ifc2x4::IFCCOMPOSITECURVESEGMENT:
			{
				_loader.MoveToArgumentOffset(line, 0);
				auto transition = _loader.GetStringArgument();
				auto sameSense = _loader.GetStringArgument();
				auto parentID = _loader.GetRefArgument();

				ComputeCurve(parentID, curve);

				break;
			}
			case ifc2x4::IFCTRIMMEDCURVE:
			{
				_loader.MoveToArgumentOffset(line, 0);
				auto basisCurveID = _loader.GetRefArgument();
				auto trim1Set = _loader.GetSetArgument();
				auto trim2Set = _loader.GetSetArgument();
				auto senseAgreement = _loader.GetStringArgument();
				auto trimmingPreference = _loader.GetStringArgument();

				auto trim1 = ParseTrimSelect(trim1Set);
				auto trim2 = ParseTrimSelect(trim2Set);

				IfcTrimmingArguments trim;
				trim.exist = true;
				trim.start = trim1;
				trim.end = trim2;

				ComputeCurve(basisCurveID, curve, trim);

				break;
			}
			case ifc2x4::IFCCIRCLE:
			{
				_loader.MoveToArgumentOffset(line, 0);
				auto positionID = _loader.GetRefArgument();
				double radius = _loader.GetDoubleArgument();

				glm::dmat3 placement = GetAxis2Placement2D(positionID);

				const int CIRCLE_SEGMENTS = 10;

				double startDegrees = 0;
				double endDegrees = 360;

				if (trim.exist)
				{
					// TODO: support cartesian?
					startDegrees = trim.start.hasParam ? trim.start.param : 0;
					endDegrees = trim.end.hasParam ? trim.end.param : 360;
				}

				if (endDegrees < startDegrees)
				{
					endDegrees += 360;
				}

				double startRad = startDegrees / 180 * CONST_PI;
				double endRad = endDegrees / 180 * CONST_PI;

				double lengthRad = endRad - startRad;

				int startIndex = curve.points.size();

				for (int i = 0; i < CIRCLE_SEGMENTS; i++)
				{
					double ratio = static_cast<double>(i) / ( CIRCLE_SEGMENTS - 1);
					double angle = startRad + ratio * lengthRad;
					glm::dvec2 circleCoordinate(
						radius * std::cosf(angle),
						- radius * std::sinf(angle) // TODO: figure out why this has to be negative
					);
					glm::dvec2 pos = placement * glm::dvec3(circleCoordinate, 1);
					curve.Add(pos);
				}

				// without a trim, we close the circle
				if (!trim.exist)
				{
					curve.Add(curve.points[startIndex]);
				}

				break;
			}

			default:
				std::cout << "Unexpected curve type: " << line.ifcType << " at " << expressID << std::endl;
				break;
			}

			if (DEBUG_DUMP_SVG)
			{
				DumpSVGCurve(curve.points, L"partial_curve.html");
			}
		}

		glm::dvec2 GetCartesianPoint2D(uint64_t expressID)
		{
			uint32_t lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);

			_loader.MoveToArgumentOffset(line, 0);
			auto coords = _loader.GetSetArgument();

			glm::dvec2 point(
				_loader.GetDoubleArgument(coords[0]),
				_loader.GetDoubleArgument(coords[1])
			);

			return point;
		}

		glm::dvec3 GetCartesianPoint3D(uint64_t expressID)
		{
			uint32_t lineID = _loader.ExpressIDToLineID(expressID);
			auto& line = _loader.GetLine(lineID);

			/*
			_loader.MoveToArgumentOffset(line, 0);
			auto coords = _loader.GetSetArgument();

			glm::dvec3 point1(
				_loader.GetDoubleArgument(coords[0]),
				_loader.GetDoubleArgument(coords[1]),
				_loader.GetDoubleArgument(coords[2])
			);
			*/

			// we should do the above, but its slow, so we do this:
			_loader.MoveToArgumentOffset(line, 0);
			IfcTokenType t = _loader.GetTokenType();

			// because these calls cannot be reordered we have to use intermediate variables
			double x = _loader.GetDoubleArgument();
			double y = _loader.GetDoubleArgument();
			double z = _loader.GetDoubleArgument();
			glm::dvec3 point(x, y, z);

			return point;
		}

		IfcLoader& _loader;
		std::vector<IfcGeometry> _geometry;
		std::unordered_map<uint64_t, std::vector<uint64_t>> _relVoids;
		bool _isRelVoidsMapPopulated = false;
	};
}