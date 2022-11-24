/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#pragma once

#include <unordered_map>

#include "tokenizer.h"
#include "../util.h"
#include "../ifc-meta-data.h"

namespace webifc
{
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

    template<uint32_t N>
    class Parser {
    public:
        Parser(webifc::DynamicTape<N>& t, IfcMetaData& metaData):
            _tape(t),
            _metaData(metaData)
        {

        }

        void ParseTape(uint32_t numLines)
		{
			makeCRCTable();

			uint32_t maxExpressId = 0;
			uint32_t lineStart = 0;
			uint32_t currentIfcType = 0;
			uint32_t currentExpressID = 0;
			uint32_t currentTapeOffset = 0;
			_metaData.lines.reserve(numLines);
			while (!_tape.AtEnd())
			{
				IfcTokenType t = static_cast<IfcTokenType>(_tape.template Read<char>());

				switch (t)
				{
				case IfcTokenType::LINE_END:
				{
					if (currentExpressID != 0)
					{
						IfcLine l;
						l.expressID = currentExpressID;
						l.ifcType = currentIfcType;
						l.lineIndex = static_cast<uint32_t>(_metaData.lines.size());
						l.tapeOffset = currentTapeOffset;
						l.tapeEnd = _tape.GetReadOffset();

						_metaData.ifcTypeToLineID[l.ifcType].push_back(l.lineIndex);
						maxExpressId = std::max(maxExpressId, l.expressID);

						_metaData.lines.push_back(std::move(l));
					}
					else if (currentIfcType != 0)
					{
						if(currentIfcType == ifc::FILE_DESCRIPTION || currentIfcType == ifc::FILE_NAME||currentIfcType == ifc::FILE_SCHEMA )
						{
							IfcHeaderLine l;
							l.ifcType = currentIfcType;
							l.lineIndex = static_cast<uint32_t>(_metaData.headerLines.size());
							l.tapeOffset = currentTapeOffset;
							l.tapeEnd = _tape.GetReadOffset();

							_metaData.ifcTypeToHeaderLineID[l.ifcType].push_back(l.lineIndex);
							_metaData.headerLines.push_back(std::move(l));
						}
					}

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
					StringView s = _tape.ReadStringView();

					break;
				}
				case IfcTokenType::LABEL:
				{
					StringView s = _tape.ReadStringView();

					if (currentIfcType == 0)
					{
						currentIfcType = crc32Simple(s.data, s.len);
					}

					break;
				}
				case IfcTokenType::REF:
				{
					uint32_t ref = _tape.template Read<uint32_t>();
					if (currentExpressID == 0)
					{
						currentExpressID = ref;
					}

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

			_metaData.expressIDToLine.resize(maxExpressId + 1);

			for (int i = 0; i < _metaData.lines.size(); i++)
			{
				_metaData.expressIDToLine[_metaData.lines[i].expressID] = i;
			}
		}

    private:
        webifc::DynamicTape<N>& _tape;
        IfcMetaData& _metaData;
    };
}