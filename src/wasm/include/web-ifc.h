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
#include <iomanip>
#include <sstream>

#include "ifc-schema.h"
#include "util.h"
#include "parsing/tokenizer.h"
#include "parsing/parser.h"
#include "ifc-meta-data.h"

const uint32_t TAPE_SIZE = 1 << 24;

namespace webifc
{
        enum class LogLevel : int
	{
		DEBUG = 0,
		INFO,
		WARN,
		ERROR,
		OFF
	};

        LogLevel LOG_LEVEL = LogLevel::INFO;

        struct LoaderSettings
	{
		bool COORDINATE_TO_ORIGIN = false;
		bool USE_FAST_BOOLS = true; //TODO: This needs to be fixed in the future to rely on elalish/manifold
		bool DUMP_CSG_MESHES = false;
		int CIRCLE_SEGMENTS_LOW = 5;
		int CIRCLE_SEGMENTS_MEDIUM = 8;
		int CIRCLE_SEGMENTS_HIGH = 12;
		bool MESH_CACHE = false;
		int BOOL_ABORT_THRESHOLD = 10000; // 10k verts
	};

        void log(const std::string& msg, const LogLevel& level)
	{
        	if (level >= LOG_LEVEL) {
                	std::string fullMsg = msg;
                        switch (level) {
                                case LogLevel::DEBUG: fullMsg = "DEBUG: " + msg; break;
                        	case LogLevel::INFO:  fullMsg = "INFO: "  + msg; break;
                        	case LogLevel::WARN:  fullMsg = "WARN: "  + msg; break;
                        	case LogLevel::ERROR: fullMsg = "ERROR: " + msg; break;
                        	case LogLevel::OFF:   return;
                        }
                        std::cout << fullMsg << std::endl;
                }
        }

        void logDebug(const std::string& msg) { log(msg, LogLevel::DEBUG); }
        void logInfo(const std::string& msg)  { log(msg, LogLevel::INFO);  }
        void logWarn(const std::string& msg)  { log(msg, LogLevel::WARN);  }
        void logError(const std::string& msg) { log(msg, LogLevel::ERROR); }

        enum class LoaderErrorType
	{
		UNSPECIFIED,
		PARSING,
		BOOL_ERROR,
		UNSUPPORTED_TYPE
	};

	struct LoaderError
	{
		LoaderErrorType type;
		std::string message;
		uint32_t expressID;
		uint32_t ifcType;

		LoaderError(LoaderErrorType t = LoaderErrorType::UNSPECIFIED,
                            std::string m = "",
                            uint32_t e = 0,
                            uint32_t type = 0) : type(t),
                                                 message(m),
                                                 expressID(e),
                                                 ifcType(type)
                {
		}
	};

	long long ms()
	{
		using namespace std::chrono;
		milliseconds millis = duration_cast<milliseconds>(
			system_clock::now().time_since_epoch());

		return millis.count();
	}

	class IfcLoader
	{
	public:
		IfcLoader(const LoaderSettings &s = {}) : _settings(s)
		{
		}

		void ActivateSerializer(size_t RamLimit = 200000000)
		{
			_tape.serialize = true;
			_tape.ramLimit = RamLimit;
		}

		void SetSerializedFileName(std::string serializedFileName)
		{
			_tape.serializedFileName = serializedFileName;
		}

		void SetCallback(const std::function<std::string(std::string, size_t)> &storeData)
		{
			_tape._storeData = storeData;
			_tape.callbackActive = true;
		}

		void SetBinPaths(std::vector<std::string> paths)
		{
			_tape.BinPaths = paths;
		}

		void DisableSerializer()
		{
			_tape.serialize = false;
		}

		void PushDataToTape(void *data, size_t size)
		{
			_tape.push(data, size);
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<uint32_t>> &GetRelVoids()
		{
			return _metaData._relVoids;
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<uint32_t>> &GetRelVoidRels()
		{
			return _metaData._relVoidRel;
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<uint32_t>> &GetRelAggregates()
		{
			return _metaData._relAggregates;
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &GetStyledItems()
		{
			return _metaData._styledItems;
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &GetRelMaterials()
		{
			return _metaData._relMaterials;
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &GetMaterialDefinitions()
		{
			return _metaData._materialDefinitions;
		}

		std::vector<uint32_t> GetExpressIDsWithType(uint32_t type)
		{
			auto &list = _metaData.ifcTypeToLineID[type];
			std::vector<uint32_t> ret(list.size());

			std::transform(list.begin(), list.end(), ret.begin(), [&](uint32_t lineID)
						   { return _metaData.lines[lineID].expressID; });

			return ret;
		}

		uint32_t readFilePart(const std::function<uint32_t(char *, size_t)> &requestData)
		{
			Tokenizer<TAPE_SIZE> tokenizer(_tape);
			return tokenizer.Tokenize(requestData);
			return 0;
		}

		void storeLastChunk()
		{
			Tokenizer<TAPE_SIZE> tokenizer(_tape);
			_tape.storeChunk();
			_tape.updateMemory();
		}

		uint32_t loadMetadata()
		{
			uint32_t numLns = _tape.loadMetadata();
			_tape.updateChunks();
			return numLns;
		}

		void storeMetadata(uint32_t numLines)
		{
			_tape.storeMetadata(numLines);
		}

		void LoadSerializedFileData(uint32_t numLines)
		{
			Parser<TAPE_SIZE> parser(_tape, _metaData);
			parser.ParseTape(numLines);
			PopulateRelVoidsMap();
			PopulateRelAggregatesMap();
			PopulateStyledItemMap();
			PopulateRelMaterialsMap();
			ReadLinearScalingFactor();
		}

		std::vector<IfcHeaderLine> GetHeaderLinesWithType(uint32_t type)
		{
			auto &list = _metaData.ifcTypeToHeaderLineID[type];
			std::vector<IfcHeaderLine> ret(list.size());

			std::transform(list.begin(), list.end(), ret.begin(), [&](uint32_t lineID)
						   { return _metaData.headerLines[lineID]; });

			return ret;
		}

		void LoadFile(const std::function<uint32_t(char *, size_t)> &requestData)
		{
			Tokenizer<TAPE_SIZE> tokenizer(_tape);
			uint32_t numLines = tokenizer.Tokenize(requestData);

			Parser<TAPE_SIZE> parser(_tape, _metaData);
			parser.ParseTape(numLines);

			PopulateRelVoidsMap();
			PopulateRelAggregatesMap();
			PopulateStyledItemMap();
			PopulateRelMaterialsMap();
			ReadLinearScalingFactor();
		}

		double ConvertPrefix(const std::string &prefix)
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
			auto projects = GetExpressIDsWithType(ifc::IFCPROJECT);

			if (projects.size() != 1)
			{
				ReportError({LoaderErrorType::PARSING, "unexpected empty ifc project"});
				return;
			}

			auto projectEID = projects[0];

			auto &line = GetLine(ExpressIDToLineID(projectEID));
			MoveToArgumentOffset(line, 8);

			auto unitsID = GetRefArgument();

			auto &unitsLine = GetLine(ExpressIDToLineID(unitsID));
			MoveToArgumentOffset(unitsLine, 0);

			auto unitIds = GetSetArgument();

			for (auto &unitID : unitIds)
			{
				auto unitRef = GetRefArgument(unitID);

				auto &line = GetLine(ExpressIDToLineID(unitRef));

				if (line.ifcType == ifc::IFCSIUNIT)
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
						_metaData.linearScalingFactor *= prefix;
					}
				}
				if(line.ifcType == ifc::IFCCONVERSIONBASEDUNIT)
				{
					MoveToArgumentOffset(line, 1);
					std::string unitType = GetStringArgument();
					MoveToArgumentOffset(line, 3);
					auto unitRefLine = GetRefArgument();
					auto &unitLine = GetLine(ExpressIDToLineID(unitRefLine));
					
					MoveToArgumentOffset(unitLine, 1);
					auto ratios = GetSetArgument();

					///Scale Correction

					MoveToArgumentOffset(unitLine, 2);
					auto scaleRefLine = GetRefArgument();

					auto &scaleLine = GetLine(ExpressIDToLineID(scaleRefLine));

					MoveToArgumentOffset(scaleLine, 1);
					std::string unitTypeScale = GetStringArgument();

					std::string unitPrefix;

					MoveToArgumentOffset(scaleLine, 2);
					if (GetTokenType() == IfcTokenType::ENUM)
					{
						Reverse();
						unitPrefix = GetStringArgument();
					}

					MoveToArgumentOffset(scaleLine, 3);
					std::string unitName = GetStringArgument();

					if (unitTypeScale == "LENGTHUNIT" && unitName == "METRE")
					{
						double prefix = ConvertPrefix(unitPrefix);
						_metaData.linearScalingFactor *= prefix;
					}

					///

					double ratio = GetDoubleArgument(ratios[0]);
					if(unitType == "LENGTHUNIT")
					{
						_metaData.linearScalingFactor *= ratio;
					}
					else if (unitType == "AREAUNIT")
					{
						_metaData.squaredScalingFactor *= ratio;
					}
					else if (unitType == "VOLUMEUNIT")
					{
						_metaData.cubicScalingFactor *= ratio;
					}
					else if (unitType == "PLANEANGLEUNIT")
					{
						_metaData.angularScalingFactor *= ratio;
					}
				}		
			}
		}

		void PopulateRelVoidsMap()
		{
			auto relVoids = GetExpressIDsWithType(ifc::IFCRELVOIDSELEMENT);

			for (uint32_t relVoidID : relVoids)
			{
				uint32_t lineID = ExpressIDToLineID(relVoidID);
				auto &line = GetLine(lineID);

				MoveToArgumentOffset(line, 4);

				uint32_t relatingBuildingElement = GetRefArgument();
				uint32_t relatedOpeningElement = GetRefArgument();

				_metaData._relVoids[relatingBuildingElement].push_back(relatedOpeningElement);
				_metaData._relVoidRel[relatingBuildingElement].push_back(relVoidID);
			}
		}

		void PopulateRelAggregatesMap()
		{
			auto relVoids = GetExpressIDsWithType(ifc::IFCRELAGGREGATES);

			for (uint32_t relVoidID : relVoids)
			{
				uint32_t lineID = ExpressIDToLineID(relVoidID);
				auto &line = GetLine(lineID);

				MoveToArgumentOffset(line, 4);

				uint32_t relatingBuildingElement = GetRefArgument();
				auto aggregates = GetSetArgument();

				for (auto &aggregate : aggregates)
				{
					uint32_t aggregateID = GetRefArgument(aggregate);
					_metaData._relAggregates[relatingBuildingElement].push_back(aggregateID);
				}
			}
		}

		void PopulateStyledItemMap()
		{
			auto styledItems = GetExpressIDsWithType(ifc::IFCSTYLEDITEM);

			for (uint32_t styledItemID : styledItems)
			{
				uint32_t lineID = ExpressIDToLineID(styledItemID);
				auto &line = GetLine(lineID);

				MoveToArgumentOffset(line, 0);

				if (GetTokenType() == IfcTokenType::REF)
				{
					Reverse();
					uint32_t representationItem = GetRefArgument();

					auto lineID = ExpressIDToLineID(representationItem);
					auto line = GetLine(lineID);

					auto styleAssignments = GetSetArgument();

					for (auto &styleAssignment : styleAssignments)
					{
						uint32_t styleAssignmentID = GetRefArgument(styleAssignment);
						_metaData._styledItems[representationItem].emplace_back(styledItemID, styleAssignmentID);
					}
				}
			}
		}

		void PopulateRelMaterialsMap()
		{
			auto styledItems = GetExpressIDsWithType(ifc::IFCRELASSOCIATESMATERIAL);

			for (uint32_t styledItemID : styledItems)
			{
				uint32_t lineID = ExpressIDToLineID(styledItemID);
				auto &line = GetLine(lineID);

				MoveToArgumentOffset(line, 5);

				uint32_t materialSelect = GetRefArgument();

				MoveToArgumentOffset(line, 4);

				auto RelatedObjects = GetSetArgument();

				for (auto &ifcRoot : RelatedObjects)
				{
					uint32_t ifcRootID = GetRefArgument(ifcRoot);
					_metaData._relMaterials[ifcRootID].emplace_back(styledItemID, materialSelect);
				}
			}

			auto matDefs = GetExpressIDsWithType(ifc::IFCMATERIALDEFINITIONREPRESENTATION);

			for (uint32_t styledItemID : matDefs)
			{
				uint32_t lineID = ExpressIDToLineID(styledItemID);
				auto &line = GetLine(lineID);

				MoveToArgumentOffset(line, 2);

				auto representations = GetSetArgument();

				MoveToArgumentOffset(line, 3);

				uint32_t material = GetRefArgument();

				for (auto &representation : representations)
				{
					uint32_t representationID = GetRefArgument(representation);
					_metaData._materialDefinitions[material].emplace_back(styledItemID, representationID);
				}
			}
		}

		size_t GetNumLines()
		{
			return _metaData.lines.size();
		}

		std::vector<uint32_t> &GetLineIDsWithType(uint32_t type)
		{
			return _metaData.ifcTypeToLineID[type];
		}

		uint32_t GetMaxExpressId()
		{
			return _metaData.expressIDToLine.size() - 1;
		}

		uint32_t IncreaseMaxExpressId(uint32_t incrementSize)
		{
			_metaData.expressIDToLine.resize(GetMaxExpressId() + incrementSize + 1);
			return GetMaxExpressId();
		}

		uint32_t CopyTapeForExpressLine(uint32_t expressID, uint8_t *dest)
		{
			uint32_t startOffset = _metaData.lines[_metaData.expressIDToLine[expressID]].tapeOffset;
			uint32_t endOffset = _metaData.lines[_metaData.expressIDToLine[expressID]].tapeEnd;

			return _tape.Copy(startOffset, endOffset, dest);
		}

		bool ValidExpressID(uint32_t expressID)
		{
			return _metaData.expressIDToLine.capacity() > expressID;
		}

		bool ValidateExpressID(uint32_t expressID)
		{
			std::vector<IfcLine>& lines = _metaData.lines;

			auto check = find_if(lines.begin(), lines.end(), [&expressID](const IfcLine& obj){return obj.expressID == expressID;});

			return (check != lines.end());
		}

		uint32_t ExpressIDToLineID(uint32_t expressID)
		{
			return _metaData.expressIDToLine[expressID];
		}
		
		uint32_t LineIDToExpressID(uint32_t lineID)
		{
			return _metaData.lines[lineID].expressID;
		}

		IfcLine &GetLine(uint32_t lineID)
		{
			return _metaData.lines[lineID];
		}

		webifc::DynamicTape<TAPE_SIZE> &GetTape()
		{
			return _tape;
		}

		double GetLinearScalingFactor()
		{
			return _metaData.linearScalingFactor;
		}

		bool IsOpen()
		{
			return _open;
		}

		void SetOpen()
		{
			_open = true;
		}

		void SetClosed()
		{
			_open = false;
		}

		void MoveToArgumentOffset(IfcLine &line, int argumentIndex)
		{
			_tape.MoveTo(line.tapeOffset);
			ArgumentOffset(argumentIndex);
		}

		void MoveToHeaderArgumentOffset(IfcHeaderLine &line, int argumentIndex)
		{
			_tape.MoveTo(line.tapeOffset);
			ArgumentOffset(argumentIndex);	
		}

		void ArgumentOffset(int argumentIndex)
		{
			int movedOver = -1;
			int setDepth = 0;
			while (true)
			{
				if (setDepth == 1)
				{
					movedOver++;

					if (movedOver == argumentIndex)
					{
						return;
					}
				}

				IfcTokenType t = static_cast<IfcTokenType>(_tape.Read<char>());

				switch (t)
				{
				case IfcTokenType::LINE_END:
				{
					ReportError({LoaderErrorType::PARSING, "unexpected line end"});
					assert(false);
					break;
				}
				case IfcTokenType::UNKNOWN:
				case IfcTokenType::EMPTY:
					break;
				case IfcTokenType::SET_BEGIN:
					setDepth++;
					break;
				case IfcTokenType::SET_END:
					setDepth--;
					if (setDepth == 0)
					{
						return;
					}
					break;
				case IfcTokenType::STRING:
				case IfcTokenType::ENUM:
				case IfcTokenType::LABEL:
				{
					uint16_t length = _tape.Read<uint16_t>();
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

		inline std::string GetStringArgument(uint32_t tapeOffset)
		{
			_tape.MoveTo(tapeOffset);
			return GetStringArgument();
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
			if (!_tape.Expect(IfcTokenType::REF))
			{
				ReportError({LoaderErrorType::PARSING, "unexpected token type, expected REF"});
				return 0;
			}
			return _tape.Read<uint32_t>();
		}

		inline uint32_t GetOptionalRefArgument()
		{
			IfcTokenType t = GetTokenType();
			if (t == IfcTokenType::EMPTY)
			{
				return 0;
			}
			else if (t == IfcTokenType::REF)
			{
				return _tape.Read<uint32_t>();
			}
			else
			{
				ReportError({LoaderErrorType::PARSING, "unexpected token type, expected REF or EMPTY"});
				return 0;
			}
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

		inline void GetLineDependencies(uint32_t expressID, std::set<uint32_t> &deps)
		{
			// move tape to line
			uint32_t lineID = ExpressIDToLineID(expressID);
			auto &line = GetLine(lineID);
			MoveToArgumentOffset(line, 0);

			std::vector<uint32_t> localDeps;

			// scan tape for dependencies
			while (!_tape.AtEnd())
			{
				IfcTokenType t = static_cast<IfcTokenType>(_tape.template Read<char>());

				if (t == IfcTokenType::LINE_END)
				{
					break;
				}

				switch (t)
				{
				case IfcTokenType::UNKNOWN:
				case IfcTokenType::EMPTY:
				case IfcTokenType::SET_BEGIN:
				case IfcTokenType::SET_END:
					break;
				case IfcTokenType::STRING:
				case IfcTokenType::ENUM:
				case IfcTokenType::LABEL:
				{
					StringView s = _tape.ReadStringView();

					break;
				}
				case IfcTokenType::REF:
				{
					uint32_t ref = _tape.template Read<uint32_t>();
					deps.insert(ref);

					// can't recurse here, it will mess up the tape!
					localDeps.push_back(ref);
					break;
				}
				case IfcTokenType::REAL:
				{
					_tape.template Read<double>();
					break;
				}
				default:
					break;
				}
			}

			for (auto &localDep : localDeps)
			{
				GetLineDependencies(localDep, deps);
			}
		}

		inline std::set<uint32_t> GetLineDependencies(uint32_t expressID)
		{
			std::set<uint32_t> deps;
			GetLineDependencies(expressID, deps);

			auto voids = GetRelVoidRels()[expressID];

			for (auto &v : voids)
			{
				deps.insert(v);
				GetLineDependencies(v, deps);
			}

			return deps;
		}

		inline std::vector<IfcLine> GetLinesForExpressIDs(const std::set<uint32_t> &expressIDs)
		{
			std::vector<IfcLine> lines;

			for (auto eid : expressIDs)
			{
				auto lineID = ExpressIDToLineID(eid);
				lines.push_back(GetLine(lineID));
			}

			return lines;
		}

		inline void Reverse()
		{
			_tape.Reverse();
		}

		inline void UpdateLineTape(uint32_t expressID, uint32_t type, uint32_t start, uint32_t end)
		{
			uint64_t pos = _tape.GetTotalSize();

			// new line?
			if (expressID >= _metaData.expressIDToLine.size() || _metaData.expressIDToLine[expressID] == 0)
			{
				// allocate some space
				_metaData.expressIDToLine.resize(expressID * 2);

				// create line object
				int lineID = _metaData.lines.size();
				_metaData.lines.emplace_back();

				// create a line ID
				_metaData.expressIDToLine[expressID] = lineID;
				auto &line = _metaData.lines[lineID];

				// fill line data
				line.expressID = expressID;
				line.lineIndex = lineID;
				line.ifcType = type;

				_metaData.ifcTypeToLineID[type].push_back(lineID);
			}

			auto lineID = _metaData.expressIDToLine[expressID];
			auto &line = _metaData.lines[lineID];

			line.tapeOffset = start;
			line.tapeEnd = end;
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
						uint16_t length = _tape.Read<uint16_t>();
						_tape.AdvanceRead(length);
					}
					else if (t == IfcTokenType::LABEL)
					{
						uint16_t length = _tape.Read<uint16_t>();
						_tape.AdvanceRead(length);
					}
					else
					{
						ReportError({LoaderErrorType::PARSING, "unexpected token"});
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

		inline std::vector<std::vector<uint32_t>> GetSetListArgument()
		{
			std::vector<std::vector<uint32_t>> tapeOffsets;
			_tape.Read<char>(); // set begin
			int depth = 1;
			std::vector<uint32_t> tempSet;

			while (true)
			{
				uint32_t offset = _tape.GetReadOffset();
				IfcTokenType t = static_cast<IfcTokenType>(_tape.Read<char>());

				if (t == IfcTokenType::SET_BEGIN)
				{
					tempSet = std::vector<uint32_t>();
					depth++;
				}
				else if (t == IfcTokenType::SET_END)
				{
					if (tempSet.size() > 0)
					{
						tapeOffsets.push_back(tempSet);
						tempSet = std::vector<uint32_t>();
					}
					depth--;
				}
				else
				{
					tempSet.push_back(offset);

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
						uint16_t length = _tape.Read<uint16_t>();
						_tape.AdvanceRead(length);
					}
					else if (t == IfcTokenType::LABEL)
					{
						uint16_t length = _tape.Read<uint16_t>();
						_tape.AdvanceRead(length);
					}
					else
					{
						ReportError({LoaderErrorType::PARSING, "unexpected token"});
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

		std::string DumpSingleObjectAsIFC(uint32_t expressID)
		{
			auto deps = GetLineDependencies(expressID);
			deps.insert(expressID);
			auto lines = GetLinesForExpressIDs(deps);
			return DumpAsIFC(lines);
		}

		std::string getAsStringWithBigE(double theNumber)
		{
			std::stringstream stream;
			stream << theNumber;
			std::string s = stream.str();

			for (unsigned int j = 0; j < s.length(); j++)
			{
				if (s[j] == 'e')
				{
					s[j] = 'E';
					break;
				}
			}

			return s;
		}

		std::string DumpAsIFC(const std::vector<IfcLine> &lines = {})
		{
			std::stringstream file;
			file << std::setprecision(std::numeric_limits<double>::digits10 + 1);

			std::string description = "no description";
			std::string name = "no name";

			file << "ISO-10303-21;" << std::endl;
			file << "HEADER;" << std::endl;
			file << "FILE_DESCRIPTION(('" << description << "'), '2;1');" << std::endl;
			file << "FILE_NAME('" << name << "', '', (''), (''), 'web-ifc-export', '', '');" << std::endl;
			file << "FILE_SCHEMA(('IFC2X3'));" << std::endl;
			file << "ENDSEC;" << std::endl;
			file << "DATA;" << std::endl;

			const auto &linesToWrite = lines.empty() ? _metaData.lines : lines;

			for (auto &line : linesToWrite)
			{
				_tape.MoveTo(line.tapeOffset);
				bool newLine = true;
				bool insideSet = false;
				IfcTokenType prev = IfcTokenType::EMPTY;
				while (!_tape.AtEnd())
				{
					IfcTokenType t = static_cast<IfcTokenType>(_tape.Read<char>());

					if (t != IfcTokenType::SET_END && t != IfcTokenType::LINE_END)
					{
						if (insideSet && prev != IfcTokenType::SET_BEGIN && prev != IfcTokenType::LABEL && prev != IfcTokenType::LINE_END)
						{
							file << ",";
						}
					}

					if (t == IfcTokenType::LINE_END)
					{
						file << ";" << std::endl;
						break;
					}

					switch (t)
					{
					case IfcTokenType::UNKNOWN:
					{
						file << "*";

						break;
					}
					case IfcTokenType::EMPTY:
					{
						file << "$";

						break;
					}
					case IfcTokenType::SET_BEGIN:
					{
						file << "(";

						insideSet = true;

						break;
					}
					case IfcTokenType::SET_END:
					{
						file << ")";

						break;
					}
					case IfcTokenType::STRING:
					{
						StringView view = _tape.ReadStringView();
						std::string copy(view.data, view.len);

						file << "'" << copy << "'";

						break;
					}
					case IfcTokenType::ENUM:
					{
						StringView view = _tape.ReadStringView();
						std::string copy(view.data, view.len);

						file << "." << copy << ".";

						break;
					}
					case IfcTokenType::LABEL:
					{
						StringView view = _tape.ReadStringView();
						std::string copy(view.data, view.len);

						file << copy;

						break;
					}
					case IfcTokenType::REF:
					{
						uint32_t ref = _tape.Read<uint32_t>();

						file << "#" << ref;

						if (newLine)
						{
							file << "=";
						}

						break;
					}
					case IfcTokenType::REAL:
					{
						double d = _tape.Read<double>();

						// file << d;

						file << getAsStringWithBigE(d);

						break;
					}
					default:
						break;
					}

					if (t == IfcTokenType::LINE_END)
					{
						newLine = true;
						insideSet = false;
					}
					else
					{
						newLine = false;
					}

					prev = t;
				}
			}

			file << "ENDSEC;" << std::endl
                             << "END-ISO-10303-21;";

			return file.str();
		}

		const LoaderSettings &GetSettings()
		{
			return _settings;
		}

		void ReportError(const LoaderError &&error)
		{
			logError(error.message);
			_errors.push_back(std::move(error));
		}

		std::vector<LoaderError> GetAndClearErrors()
		{
			auto temp = _errors;
			_errors = {};
			return temp;
		}

	private:
		bool _open = false;
		std::vector<LoaderError> _errors;
		DynamicTape<TAPE_SIZE> _tape; // 16mb chunked tape
		LoaderSettings _settings;

		IfcMetaData _metaData;
	};
}
