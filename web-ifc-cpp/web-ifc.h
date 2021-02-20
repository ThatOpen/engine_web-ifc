#pragma once

#include <string>
#include <vector>
#include <deque>
#include <unordered_map>
#include <chrono>
#include <algorithm>
#include <set>

#include "../web-ifc-schema/ifc2x4.h"
#include "util.h"
#include "crack_atof.h"

namespace webifc
{
	// for some reason std::string_view is not compiling...
	struct StringView
	{
		StringView(char* d, uint32_t l) :
			data(d),
			len(l)
		{

		}

		char* data;
		uint32_t len;
	};

	long long ms()
	{
		using namespace std::chrono;
		milliseconds millis = duration_cast<milliseconds>(
			system_clock::now().time_since_epoch()
			);

		return millis.count();
	}

	std::vector<uint32_t> crcTable(256);

	void makeCRCTable() {
		uint32_t c;
		for (uint32_t n = 0; n < 256; n++) {
			c = n;
			for (uint32_t k = 0; k < 8; k++) {
				c = ((c & 1) ? (0xEDB88320 ^ (c >> 1)) : (c >> 1));
			}
			crcTable[n] = c;
		}
	}

	uint32_t crc32Simple(const void* buf, size_t len)
	{
		uint32_t c = 0 ^ 0xFFFFFFFF;
		const uint8_t* u = static_cast<const uint8_t*>(buf);
		for (size_t i = 0; i < len; ++i)
		{
			c = crcTable[(c ^ u[i]) & 0xFF] ^ (c >> 8);
		}
		return c ^ 0xFFFFFFFF;
	}

	enum IfcTokenType : char
	{
		UNKNOWN,
		STRING,
		ENUM,
		REAL,
		REF,
		EMPTY,
		SET_BEGIN,
		SET_END,
		LINE_END
	};

	struct IfcPosition
	{
		uint32_t pos;
		uint32_t end;
	};

	struct IfcLine 
	{
		uint32_t expressID;
		uint32_t ifcType;
		uint32_t lineIndex;
		uint32_t tapeOffset;
		uint32_t tapeEnd;
	};

	class IfcLoader
	{
	public:
		void GetRefs(uint32_t id, std::unordered_map<uint32_t, std::vector<uint32_t>>& refs, std::set<uint32_t>& items)
		{
			items.insert(id);
			auto refsForId = refs[id];
			for (auto& ref : refsForId)
			{
				GetRefs(ref, refs, items);
			}
		}

		void GetRefsForLine(std::vector<uint32_t>& refs)
		{
			bool first = true;
			while (!_tape.AtEnd())
			{
				IfcTokenType t = static_cast<IfcTokenType>(_tape.Read<char>());

				switch (t)
				{
				case IfcTokenType::LINE_END:
				{
					return;
					break;
				}
				case IfcTokenType::UNKNOWN:
				case IfcTokenType::EMPTY:
				case IfcTokenType::SET_BEGIN:
				case IfcTokenType::SET_END:
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
					if (!first)
					{
						refs.push_back(ref);
					}
					else
					{
						first = false;
					}
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

		std::unordered_map<uint32_t, std::vector<uint32_t>> GetRefs()
		{
			std::unordered_map<uint32_t, std::vector<uint32_t>> refs;

			for (auto& line : lines)
			{
				_tape.MoveTo(line.tapeOffset);
				GetRefsForLine(refs[line.expressID]);
			}

			return refs;
		}

		void GetAllRefs(std::set<uint32_t>& refs, uint32_t start)
		{
			auto result = refs.insert(start);
			if (!result.second)
			{
				return;
			}

			_tape.MoveTo(lines[expressIDToLine[start]].tapeOffset);

			std::vector<uint32_t> r;
			GetRefsForLine(r);

			auto material = _relMaterials.find(start);
			if (material != _relMaterials.end())
			{
				auto& materials = material->second;
				for (auto item : materials)
				{
					if (item.first != start) GetAllRefs(refs, item.first);
					GetAllRefs(refs, item.second);

					if (_materialDefinitions.count(item.second) != 0)
					{
						auto& defs = _materialDefinitions[item.second];
						for (auto def : defs)
						{
							if (def.first != start) GetAllRefs(refs, def.first);
							GetAllRefs(refs, def.second);
						}
					}
				}
			}

			auto styledItem = _styledItems.find(start);
			if (styledItem != _styledItems.end())
			{
				auto items = styledItem->second;
				for (auto item : items)
				{
					if (item.first != start) GetAllRefs(refs, item.first);
					GetAllRefs(refs, item.second);
				}
			}

			for (auto& ref : r)
			{
				GetAllRefs(refs, ref);
			}
		}

		void PushDataToTape(void* data, size_t size)
		{
			_tape.push(data, size);
		}

		void ParseTape(uint32_t numLines)
		{
			makeCRCTable();

			std::cout << "Tape " << _tape.GetTotalSize() << std::endl;

			uint32_t maxExpressId = 0;
			uint32_t lineStart = 0;
			uint32_t currentIfcType = 0;
			uint32_t currentExpressID = 0;
			uint32_t currentTapeOffset = 0;
			lines.reserve(numLines);
			while (!_tape.AtEnd())
			{
				IfcTokenType t = static_cast<IfcTokenType>(_tape.Read<char>());

				switch (t)
				{
				case IfcTokenType::LINE_END:
				{
					IfcLine l;
					l.expressID = currentExpressID;
					l.ifcType = currentIfcType;
					l.lineIndex = static_cast<uint32_t>(lines.size());
					l.tapeOffset = currentTapeOffset;
					l.tapeEnd = _tape.GetReadOffset();

					ifcTypeToLineID[l.ifcType].push_back(l.lineIndex);
					maxExpressId = std::max(maxExpressId, l.expressID);

					lines.push_back(std::move(l));

					// reset
					currentExpressID = 0;
					currentIfcType = 0;
					currentTapeOffset = _tape.GetReadOffset();

					break;
				}
				case IfcTokenType::UNKNOWN:
				case IfcTokenType::EMPTY:
				case IfcTokenType::SET_BEGIN:
				case IfcTokenType::SET_END:
					break;
				case IfcTokenType::STRING:
				case IfcTokenType::ENUM:
				{
					Reverse();
					StringView s = GetStringViewArgument();

					if (currentIfcType == 0)
					{
						currentIfcType = crc32Simple(s.data, s.len);
					}

					break;
				}
				case IfcTokenType::REF:
				{
					uint32_t ref = _tape.Read<uint32_t>();
					if (currentExpressID == 0)
					{
						currentExpressID = ref;
					}

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

			std::cout << "Lines normal " << lines.size() << std::endl;
			std::cout << "Max express ID " << maxExpressId << std::endl;

			expressIDToLine.resize(maxExpressId + 1);

			for (int i = 0; i < lines.size(); i++)
			{
				expressIDToLine[lines[i].expressID] = i;
			}

			PopulateRelVoidsMap();
			PopulateStyledItemMap();
			PopulateRelMaterialsMap();

			_open = true;
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<uint32_t>>& GetRelVoids()
		{
			return _relVoids;
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>>& GetStyledItems()
		{
			return _styledItems;
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>>& GetRelMaterials()
		{
			return _relMaterials;
		}

		// this is lazy
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>>& GetMaterialDefinitions()
		{
			return _materialDefinitions;
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

				_relVoids[relatingBuildingElement].push_back(relatedOpeningElement);
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
						_styledItems[representationItem].emplace_back(styledItemID, styleAssignmentID);
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
					_relMaterials[ifcRootID].emplace_back(styledItemID, materialSelect);
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
					_materialDefinitions[material].emplace_back(styledItemID, representationID);
				}
			}
		}

		void LoadFile(const std::string& content)
		{
			buf = content.data();
			pos = 0;
			len = static_cast<uint32_t>(content.size());

			uint32_t numLines = 0;
			while (TokenizeLine())
			{
				numLines++;
			}

			ParseTape(numLines);
		}

		void DumpToDisk()
		{
			_tape.DumpToDisk();
		}

        size_t GetNumLines()
        {
            return lines.size();
        }

		std::vector<uint32_t>& GetLineIDsWithType(uint32_t type)
		{
			return ifcTypeToLineID[type];
		}

		std::vector<uint32_t> GetExpressIDsWithType(uint32_t type)
		{
			auto& list = ifcTypeToLineID[type];
			std::vector<uint32_t> ret(list.size());

			std::transform(list.begin(), list.end(), ret.begin(), [&](uint32_t lineID) {
				return lines[lineID].expressID;
			});

			return ret;
		}

		uint32_t CopyTapeForExpressLine(uint32_t expressID, uint8_t* dest)
		{
			uint32_t startOffset = lines[expressIDToLine[expressID]].tapeOffset;
			uint32_t endOffset = lines[expressIDToLine[expressID]].tapeEnd;

			return _tape.Copy(startOffset, endOffset, dest);
		}

		uint32_t ExpressIDToLineID(uint32_t expressID)
		{
			return expressIDToLine[expressID];
		}

		IfcLine& GetLine(uint32_t lineID)
		{
			return lines[lineID];
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
			_tape.MoveTo(lines[lineID].tapeOffset);
		}

		inline void MoveTo(uint32_t offset)
		{
			_tape.MoveTo(offset);
		}

		inline void MoveToLineArgument(uint32_t lineID, int argumentIndex)
		{
			MoveToArgumentOffset(lines[lineID], argumentIndex);
		}

		inline std::string GetStringArgument()
		{
			_tape.Read<char>(); // string type
			uint8_t length = _tape.Read<uint8_t>();
			char* charPtr = (char*)_tape.GetReadPtr();
			_tape.AdvanceRead(length);

			return std::string(charPtr, length);
		}

		inline StringView GetStringViewArgument()
		{
			_tape.Read<char>(); // string type
			uint8_t length = _tape.Read<uint8_t>();
			char* charPtr = (char*)_tape.GetReadPtr();
			_tape.AdvanceRead(length);

			return StringView { charPtr, length };
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
		webifc::DynamicTape<1 << 24> _tape; // 16mb chunked tape

		bool TokenizeLine()
		{
			bool eof = false;
			bool isSTEPLine = false;
			bool firstToken = true;
			while (true)
			{
				if (pos >= len)
				{
					eof = true;
					break;
				}

				const char c = buf[pos];

				bool isWhiteSpace = c == ' ' || c == '\n' || c == '\r' || c == '\t';

				// only consider a line a stepline if the very first non-whitespace character is a ref
				if (!isWhiteSpace && firstToken && c == '#')
				{
					isSTEPLine = true;
				}
				
				if (isWhiteSpace)
				{
					pos++;
					continue;
				}

				if (!isSTEPLine)
				{
					pos++;
					continue;
				}

				if (c == '\'')
				{
					pos++;
					bool prevSlash = false;
					uint32_t start = pos;
					// apparently string escaping is not allowed in IFC ???
					// example from uptown: #114143= IFCPROPERTYSINGLEVALUE('Type Comments',$,IFCTEXT('Type G5 - 800kg/m\X2\00B2\X0\'),$);
					while (!(buf[pos] == '\'' /*&& !prevSlash*/))
					{
						if (buf[pos] == '\\')
						{
							prevSlash = !prevSlash;
						}
						else
						{
							prevSlash = false;
						}

						pos++;
					}

					_tape.push(IfcTokenType::STRING);
					uint8_t length = pos - start;
					_tape.push(length);
					_tape.push((void*)&buf[start], length);
				} 
				else if (c == '#')
				{
					pos++;

					uint32_t num = readInt();

					_tape.push(IfcTokenType::REF);
					_tape.push(&num, sizeof(uint32_t));
				} 
				else if (c == '$' || c == '*')
				{
					_tape.push(IfcTokenType::EMPTY);
				}
				else if (c == '(')
				{
					_tape.push(IfcTokenType::SET_BEGIN);
				}
				else if (c >= '0' && c <= '9')
				{

					bool negative = buf[pos - 1] == '-';
					double value = readDouble();
					if (negative)
					{
						value *= -1;
					}

					_tape.push(IfcTokenType::REAL);
					_tape.push(&value, sizeof(double));
				}
				else if (c == '.')
				{
					pos++;
					uint32_t start = pos;
					while (buf[pos] != '.')
					{
						pos++;
					}
					
					_tape.push(IfcTokenType::ENUM);
					uint8_t length = pos - start;
					_tape.push(length);
					_tape.push((void*)&buf[start], length);
				}
				else if (c >= 'A' && c <= 'Z')
				{
					uint32_t start = pos;
					while ((buf[pos] >= 'A' && buf[pos] <= 'Z') || buf[pos] >= '0' && buf[pos] <= '9')
					{
						pos++;
					}

					_tape.push(IfcTokenType::STRING);
					uint8_t length = pos - start;
					_tape.push(length);
					_tape.push((void*)&buf[start], length);

					pos--;
				}
				else if (c == ')')
				{
					_tape.push(IfcTokenType::SET_END);
				}
				else if (c == ';')
				{
					pos++;
					break;
				}

				pos++;
			}

			_tape.push(IfcTokenType::LINE_END);
			
			return !eof;
		}

		uint32_t readInt()
		{
			uint32_t val = 0;
			char c = buf[pos];
			
			while (c >= '0' && c <= '9')
			{
				val = val * 10 + (c - '0');
				pos++;
				c = buf[pos];
			}

			pos--;

			return val;
		}

		double readDouble()
		{
			/*
			char* end1;
			double d1 = std::strtod(&buf[pos], &end1);
			ptrdiff_t size1 = end1 - &buf[pos];
			*/

			const char* start = &buf[pos];
			const char* end = start;
			double d = crack_atof(end, &buf[len]);
			ptrdiff_t size = end - start;

			/*
			if (size1 != size)
			{
				printf("asdf");
			}
			if (std::fabs(d1 - d) > 1e-4)
			{
				printf("asdf");
			}
			*/

			pos += static_cast<uint32_t>(size - 1);

			return d;
		}
		uint32_t pos;
		uint32_t len;
		const char* buf;

		std::vector<IfcLine> lines;
		std::vector<uint32_t> expressIDToLine;
		std::unordered_map<uint32_t, std::vector<uint32_t>> ifcTypeToLineID;
		std::unordered_map<uint32_t, std::vector<uint32_t>> _relVoids;
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> _styledItems;
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> _relMaterials;
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> _materialDefinitions;
	};
}