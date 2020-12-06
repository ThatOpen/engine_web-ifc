#pragma once

#include <string>
#include <vector>
#include <deque>
#include <unordered_map>
#include <chrono>
#include <algorithm>
#include <sstream>
#include <fstream>

#include <glm/glm.hpp>
#include "deps/glm/glm/gtx/transform.hpp"

#include "ifc2x3.h"
#include "web-ifc.h"
#include "util.h"

const bool DEBUG_DUMP_SVG = true;

namespace webifc
{
	struct Face
	{
		int i0;
		int i1;
		int i2;
	};

	struct IfcGeometry
	{
		std::vector<glm::dvec3> points;
		std::vector<Face> faces;
	};
	
	struct IfcCurve
	{
		std::vector<glm::dvec2> points;
	};

	struct IfcProfile
	{
		std::string type;
		IfcCurve curve;
		bool isConvex;
	};

	struct IfcComposedMesh
	{
		glm::dmat4 transformation;
		uint64_t geometryRef;
		IfcGeometry geom; // TODO: remove and make ref
		std::vector<IfcComposedMesh> children;
	};

	class IfcGeometryLoader
	{
	public:
		IfcGeometryLoader(IfcLoader& l) :
			_loader(l)
		{

		}

		IfcGeometry& GetGeometry(uint64_t index)
		{
			return geometry[index];
		}

		IfcComposedMesh GetMesh(uint64_t expressID)
		{
			return GetMeshByLine(_loader.ExpressIDToLineID(expressID));
		}

		IfcProfile GetProfile(uint64_t expressID)
		{
			return GetProfileByLine(_loader.ExpressIDToLineID(expressID));
		}

	private:

		int GetArgumentOffset(std::vector<IfcToken> line, int argumentIndex)
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

		std::string GetStringArgument(std::vector<IfcToken> line, int argumentIndex)
		{
			int offset = GetArgumentOffset(line, argumentIndex);
			IfcToken& str = line[offset];
			return _loader.GetString(str);
		}

		std::vector<uint32_t> GetSetArgument(std::vector<IfcToken> line, int argumentIndex)
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

		IfcComposedMesh GetMeshByLine(uint64_t lineID)
		{
			auto& line = _loader.GetLine(lineID);
			auto& tokens = _loader.GetLineTokens(lineID);
			switch (line.ifcType)
			{
			case ifc2x3::IFCWALLSTANDARDCASE:
			{
				IfcComposedMesh mesh;

				uint32_t localPlacement = tokens[GetArgumentOffset(tokens, 5)].num;
				uint32_t ifcPresentation = tokens[GetArgumentOffset(tokens, 6)].num;

				mesh.transformation = GetLocalPlacement(localPlacement);
				mesh.children.push_back(GetMesh(ifcPresentation));

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

		std::string ToObj(IfcGeometry& geom)
		{
			std::stringstream obj;

			double scale = 0.001;

			for (auto& pt : geom.points)
			{
				obj << "v " << pt.x * scale << " " << pt.y * scale << " " << pt.z * scale << "\n";
			}

			for (auto& f : geom.faces)
			{
				obj << "f " << (f.i0+1) << "// " << (f.i1+1) << "// " << (f.i2+1) << "//\n";
			}

			return obj.str();
		}

		void DumpIfcGeometry(IfcGeometry& geom, std::wstring filename)
		{
			std::ofstream out(L"debug_output/" + filename);
			out << ToObj(geom);
		}

		IfcGeometry Extrude(IfcProfile profile, glm::dmat4 placement, glm::dvec3 dir, double distance)
		{
			// TODO: This code generates much more vertices than needed!
			IfcGeometry geom;

			if (profile.isConvex)
			{
				// simplified convex fan triangulation
				int offset = 0;
				for (int i = 0; i < profile.curve.points.size(); i++)
				{
					glm::dvec2 pt = profile.curve.points[i];
					glm::dvec4 sb = placement * glm::vec4(glm::dvec3(pt, 0), 1);
					geom.points.push_back(sb);

					if (i > 1)
					{
						Face f1;
						f1.i0 = offset + 0;
						f1.i1 = offset + i-1;
						f1.i2 = offset + i;

						geom.faces.push_back(f1);
					}
				}

				offset = geom.points.size();
				for (int i = 0; i < profile.curve.points.size(); i++)
				{
					glm::dvec2 pt = profile.curve.points[i];
					glm::dvec4 et = placement * glm::vec4(glm::dvec3(pt, 0) + dir * distance, 1);
					geom.points.push_back(et);

					if (i > 0)
					{
						Face f2;
						f2.i0 = offset + 0;
						f2.i1 = offset + i;
						f2.i2 = offset + i - 1;

						geom.faces.push_back(f2);
					}
				}
			}
			else
			{
				// TODO: triangulate concave profile and append to geom
			}

			// for each line
			for (int i = 1; i < profile.curve.points.size(); i++)
			{
				auto& start = profile.curve.points[i - 1];
				auto& end = profile.curve.points[i];

				glm::dvec4 sb = placement * glm::vec4(start, 0, 1);
				glm::dvec4 eb = placement * glm::vec4(end, 0, 1);

				glm::dvec4 st = placement * glm::vec4(glm::dvec3(start, 0) + dir * distance, 1);
				glm::dvec4 et = placement * glm::vec4(glm::dvec3(end, 0) + dir * distance, 1);

				int offset = geom.points.size();
				geom.points.push_back(sb);
				geom.points.push_back(eb);

				geom.points.push_back(st);
				geom.points.push_back(et);

				// sb st eb
				Face f1;
				f1.i0 = offset + 0;
				f1.i1 = offset + 2;
				f1.i2 = offset + 1;

				// st et eb
				Face f2;
				f2.i0 = offset + 2;
				f2.i1 = offset + 3;
				f2.i2 = offset + 1;

				geom.faces.push_back(f1);
				geom.faces.push_back(f2);
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

			default:
				break;
			}

			return IfcProfile();
		}

		glm::dvec3 computeNormal(glm::dvec3 v1, glm::dvec3 v2, glm::dvec3 v3)
		{
			glm::dvec3 v12(v2 - v1);
			glm::dvec3 v13(v3 - v1);

			glm::dvec3 norm = glm::cross(v12, v13);

			return glm::normalize(norm);
		}

		glm::mat4 GetLocalPlacement(uint64_t expressID)
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

				glm::dvec3 zAxis(0, 1, 0);
				glm::dvec3 xAxis(1, 0, 0);
				
				if (zID.type == IfcTokenType::REF)
				{
					zAxis = GetCartesianPoint3D(zID.num);
				}

				if (xID.type == IfcTokenType::REF)
				{
					xAxis = GetCartesianPoint3D(xID.num);
				}

				glm::dvec3 yAxis = glm::cross(xAxis, zAxis);

				return glm::dmat4(
					glm::vec4(xAxis, 0),
					glm::vec4(yAxis, 0),
					glm::vec4(zAxis, 0),
					glm::vec4(pos, 1)
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
		std::vector<IfcGeometry> geometry;
	};
}