/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
 #pragma once

#include <string>
#include <vector>
#include <deque>
#include <unordered_map>
#include <chrono>
#include <algorithm>
#include <set>

#include "ifc2x4.h"
#include "util.h"
#include "parsing/tokenizer.h"
#include "parsing/parser.h"
#include "ifc-meta-data.h"

const uint32_t TAPE_SIZE = 1 << 24;

namespace webifc
{

	long long ms()
	{
		using namespace std::chrono;
		milliseconds millis = duration_cast<milliseconds>(
			system_clock::now().time_since_epoch()
			);

		return millis.count();
	}

	class IfcLoader
	{
	public:

		void PushDataToTape(void* data, size_t size)
		{
			_tape.push(data, size);
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<uint32_t>>& GetRelVoids()
		{
			return _metaData._relVoids;
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>>& GetStyledItems()
		{
			return _metaData._styledItems;
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>>& GetRelMaterials()
		{
			return _metaData._relMaterials;
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>>& GetMaterialDefinitions()
		{
			return _metaData._materialDefinitions;
		}

		std::vector<uint32_t> GetExpressIDsWithType(uint32_t type)
		{
			auto& list = _metaData.ifcTypeToLineID[type];
			std::vector<uint32_t> ret(list.size());

			std::transform(list.begin(), list.end(), ret.begin(), [&](uint32_t lineID) {
				return _metaData.lines[lineID].expressID;
			});

			return ret;
		}

		void LoadFile(const std::string& content)
		{
            Tokenizer<TAPE_SIZE> tokenizer(_tape);
            uint32_t numLines = tokenizer.Tokenize(content);

            Parser<TAPE_SIZE> parser(_tape, _metaData);
            parser.ParseTape(numLines);

			PopulateRelVoidsMap();
			PopulateStyledItemMap();
			PopulateRelMaterialsMap();
			ReadLinearScalingFactor();
		}

		double ConvertPrefix(const std::string& prefix)
		{
			if (prefix == "")
			{
				return 1;
			}
			else if (prefix == "EXA")
			{
				return 1e18;
			}
			else if (prefix == "PETA")
			{
				return 1e15;
			}
			else if (prefix == "TERA")
			{
				return 1e12;
			}
			else if (prefix == "GIGA")
			{
				return 1e9;
			}
			else if (prefix == "MEGA")
			{
				return 1e6;
			}
			else if (prefix == "KILO")
			{
				return 1e3;
			}
			else if (prefix == "HECTO")
			{
				return 1e2;
			}
			else if (prefix == "DECA")
			{
				return 10;
			}
			else if (prefix == "DECI")
			{
				return 1e-1;
			}
			else if (prefix == "CENTI")
			{
				return 1e-2;
			}
			else if (prefix == "MILLI")
			{
				return 1e-3;
			}
			else if (prefix == "MICRO")
			{
				return 1e-6;
			}
			else if (prefix == "NANO")
			{
				return 1e-9;
			}
			else if (prefix == "PICO")
			{
				return 1e-12;
			}
			else if (prefix == "FEMTO")
			{
				return 1e-15;
			}
			else if (prefix == "ATTO")
			{
				return 1e-18;
			}
			else
			{
				return 1;
			}
		}

		void ReadLinearScalingFactor()
		{
			auto projects = GetExpressIDsWithType(ifc2x4::IFCPROJECT);

			if (projects.size() != 1)
			{
				std::cout << "Unexpected empty IFCPROJECT: " << projects.size() << std::endl;
				return;
			}

			auto projectEID = projects[0];

			auto& line = GetLine(ExpressIDToLineID(projectEID));
			MoveToArgumentOffset(line, 8);

			auto unitsID = GetRefArgument();

			auto& unitsLine = GetLine(ExpressIDToLineID(unitsID));
			MoveToArgumentOffset(unitsLine, 0);

			auto unitIds = GetSetArgument();

			for (auto& unitID : unitIds)
			{
				auto unitRef = GetRefArgument(unitID);

				auto& line = GetLine(ExpressIDToLineID(unitRef));

				if (line.ifcType == ifc2x4::IFCSIUNIT)
				{
					MoveToArgumentOffset(line, 1);
					std::string unitType = GetStringArgument();

					std::string unitPrefix;

					MoveToArgumentOffset(line, 2);
					if (GetTokenType() == IfcTokenType::ENUM)
					{
						Reverse();
						unitPrefix = GetStringArgument();
					}

					MoveToArgumentOffset(line, 3);
					std::string unitName = GetStringArgument();

					if (unitType == "LENGTHUNIT" && unitName == "METRE")
					{
						double prefix = ConvertPrefix(unitPrefix);
						_metaData.linearScalingFactor = prefix;
					}
				}
			}
		}

		void PopulateRelVoidsMap()
		{
			auto relVoids = GetExpressIDsWithType(ifc2x4::IFCRELVOIDSELEMENT);

			for (uint32_t relVoidID : relVoids)
			{
				uint32_t lineID = ExpressIDToLineID(relVoidID);
				auto& line = GetLine(lineID);

				MoveToArgumentOffset(line, 4);

				uint32_t relatingBuildingElement = GetRefArgument();
				uint32_t relatedOpeningElement = GetRefArgument();

				_metaData._relVoids[relatingBuildingElement].push_back(relatedOpeningElement);
			}
		}


		void PopulateStyledItemMap()
		{
			auto styledItems = GetExpressIDsWithType(ifc2x4::IFCSTYLEDITEM);

			for (uint32_t styledItemID : styledItems)
			{
				uint32_t lineID = ExpressIDToLineID(styledItemID);
				auto& line = GetLine(lineID);

				MoveToArgumentOffset(line, 0);

				if (GetTokenType() == IfcTokenType::REF)
				{
					Reverse();
					uint32_t representationItem = GetRefArgument();

					auto lineID = ExpressIDToLineID(representationItem);
					auto line = GetLine(lineID);

					auto styleAssignments = GetSetArgument();

					for (auto& styleAssignment : styleAssignments)
					{
						uint32_t styleAssignmentID = GetRefArgument(styleAssignment);
						_metaData._styledItems[representationItem].emplace_back(styledItemID, styleAssignmentID);
					}
				}
			}
		}

		void PopulateRelMaterialsMap()
		{
			auto styledItems = GetExpressIDsWithType(ifc2x4::IFCRELASSOCIATESMATERIAL);

			for (uint32_t styledItemID : styledItems)
			{
				uint32_t lineID = ExpressIDToLineID(styledItemID);
				auto& line = GetLine(lineID);

				MoveToArgumentOffset(line, 5);

				uint32_t materialSelect = GetRefArgument();

				MoveToArgumentOffset(line, 4);

				auto RelatedObjects = GetSetArgument();

				for (auto& ifcRoot : RelatedObjects)
				{
					uint32_t ifcRootID = GetRefArgument(ifcRoot);
					_metaData._relMaterials[ifcRootID].emplace_back(styledItemID, materialSelect);
				}
			}

			auto matDefs = GetExpressIDsWithType(ifc2x4::IFCMATERIALDEFINITIONREPRESENTATION);

			for (uint32_t styledItemID : matDefs)
			{
				uint32_t lineID = ExpressIDToLineID(styledItemID);
				auto& line = GetLine(lineID);

				MoveToArgumentOffset(line, 2);

				auto representations = GetSetArgument();

				MoveToArgumentOffset(line, 3);

				uint32_t material = GetRefArgument();

				for (auto& representation : representations)
				{
					uint32_t representationID = GetRefArgument(representation);
					_metaData._materialDefinitions[material].emplace_back(styledItemID, representationID);
				}
			}
		}

		void DumpToDisk()
		{
			_tape.DumpToDisk();
		}

        size_t GetNumLines()
        {
            return _metaData.lines.size();
        }

		std::vector<uint32_t>& GetLineIDsWithType(uint32_t type)
		{
			return _metaData.ifcTypeToLineID[type];
		}

		uint32_t CopyTapeForExpressLine(uint32_t expressID, uint8_t* dest)
		{
			uint32_t startOffset = _metaData.lines[_metaData.expressIDToLine[expressID]].tapeOffset;
			uint32_t endOffset = _metaData.lines[_metaData.expressIDToLine[expressID]].tapeEnd;

			return _tape.Copy(startOffset, endOffset, dest);
		}

		uint32_t ExpressIDToLineID(uint32_t expressID)
		{
			return _metaData.expressIDToLine[expressID];
		}

		IfcLine& GetLine(uint32_t lineID)
		{
			return _metaData.lines[lineID];
		}

		double GetLinearScalingFactor()
		{
			return _metaData.linearScalingFactor;
		}

        bool IsOpen()
        {
            return _open;
        }

		void MoveToArgumentOffset(IfcLine& line, int argumentIndex)
		{
			_tape.MoveTo(line.tapeOffset);

			int movedOver = -3; // first is express id, second is express type, third is set begin
			bool insideSet = false; // assume no nested sets
			while (!(movedOver == argumentIndex && !insideSet))
			{
				if (!insideSet)
				{
					movedOver++;
				}

				IfcTokenType t = static_cast<IfcTokenType>(_tape.Read<char>());

				switch (t)
				{
				case IfcTokenType::LINE_END:
				{
					assert(false);
					break;
				}
				case IfcTokenType::UNKNOWN:
				case IfcTokenType::EMPTY:
					break;
				case IfcTokenType::SET_BEGIN:
					insideSet = movedOver != 0;
					break;
				case IfcTokenType::SET_END:
					insideSet = false;
					break;
				case IfcTokenType::STRING:
				case IfcTokenType::ENUM:
				{
					uint8_t length = _tape.Read<uint8_t>();
					_tape.AdvanceRead(length);
					break;
				}
				case IfcTokenType::REF:
				{
					uint32_t ref = _tape.Read<uint32_t>();
					break;
				}
				case IfcTokenType::REAL:
				{
					_tape.Read<double>();
					break;
				}
				default:
					break;
				}
			}
		}

		inline void MoveToLine(uint32_t lineID)
		{
			_tape.MoveTo(_metaData.lines[lineID].tapeOffset);
		}

		inline void MoveTo(uint32_t offset)
		{
			_tape.MoveTo(offset);
		}

		inline void MoveToLineArgument(uint32_t lineID, int argumentIndex)
		{
			MoveToArgumentOffset(_metaData.lines[lineID], argumentIndex);
		}

		inline std::string GetStringArgument()
		{
			_tape.Read<char>(); // string type
			StringView s = _tape.ReadStringView();

			return std::string(s.data, s.len);
		}

		inline StringView GetStringViewArgument()
		{
			_tape.Read<char>(); // string type

			return _tape.ReadStringView();
		}

		inline double GetDoubleArgument()
		{
			_tape.Read<char>(); // real type
			return _tape.Read<double>();
		}

		inline double GetDoubleArgument(uint32_t tapeOffset)
		{
			_tape.MoveTo(tapeOffset);
			return GetDoubleArgument();
		}

		inline uint32_t GetRefArgument()
		{
			_tape.Read<char>(); // ref type
			return _tape.Read<uint32_t>();
		}

		inline uint32_t GetRefArgument(uint32_t tapeOffset)
		{
			_tape.MoveTo(tapeOffset);
			return GetRefArgument();
		}

		inline IfcTokenType GetTokenType()
		{
			return static_cast<IfcTokenType>(_tape.Read<char>());
		}

		inline void Reverse()
		{
			_tape.Reverse();
		}

		inline std::vector<uint32_t> GetSetArgument()
		{
			std::vector<uint32_t> tapeOffsets;
			_tape.Read<char>(); // set begin
			int depth = 1;
			while (true)
			{
				uint32_t offset = _tape.GetReadOffset();
				IfcTokenType t = static_cast<IfcTokenType>(_tape.Read<char>());

				if (t == IfcTokenType::SET_BEGIN)
				{
					depth++;
				}
				else if (t == IfcTokenType::SET_END)
				{
					depth--;
				}
				else
				{
					tapeOffsets.push_back(offset);

					if (t == IfcTokenType::REAL)
					{
						_tape.Read<double>();
					}
					else if (t == IfcTokenType::REF)
					{
						_tape.Read<uint32_t>();
					}
					else if (t == IfcTokenType::STRING)
					{
						uint8_t length = _tape.Read<uint8_t>();
						_tape.AdvanceRead(length);
					}
					else
					{
						assert(false);
					}
				}

				if (depth == 0)
				{
					break;
				}
			}

			return tapeOffsets;
		}

	private:
        bool _open = false;
		webifc::DynamicTape<TAPE_SIZE> _tape; // 16mb chunked tape

        IfcMetaData _metaData;
	};
}