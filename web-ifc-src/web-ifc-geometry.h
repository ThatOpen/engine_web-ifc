#pragma once

#include <string>
#include <vector>
#include <deque>
#include <unordered_map>
#include <chrono>
#include <algorithm>

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
		std::vector<double> vertexData;
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
	};

	struct IfcComposedMesh
	{
		glm::dmat4 transformation;
		uint64_t geometryRef;
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

				mesh.transformation = GetTransformationByLine(localPlacement);
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

				if (DEBUG_DUMP_SVG)
				{
					DumpSVGCurve(profile.curve.points, L"IFCEXTRUDEDAREASOLID_curve.html");
				}



				mesh.transformation = glm::dmat4(1);

				return mesh;
			}

			default:
				break;
			}

			return IfcComposedMesh();
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

				return profile;
			}

			default:
				break;
			}

			return IfcProfile();
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
					curve.points.push_back(GetCartesianPoint(pointId));
				}

				return curve;
			}

			default:
				break;
			}

			return IfcCurve();
		}

		glm::dvec2 GetCartesianPoint(uint64_t expressID)
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

		glm::dmat4 GetTransformationByLine(uint64_t lineID)
		{
			return glm::dmat4(1);
		}

		IfcLoader& _loader;
		std::vector<IfcGeometry> geometry;
	};
}