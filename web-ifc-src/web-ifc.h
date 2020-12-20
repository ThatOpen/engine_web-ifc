#pragma once

#include <string>
#include <vector>
#include <deque>
#include <unordered_map>
#include <chrono>
#include <algorithm>

#include "ifc2x3.h"

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

	__forceinline uint32_t crc32Simple(const void* buf, size_t len)
	{
		uint32_t c = 0 ^ 0xFFFFFFFF;
		const uint8_t* u = static_cast<const uint8_t*>(buf);
		for (size_t i = 0; i < len; ++i)
		{
			c = crcTable[(c ^ u[i]) & 0xFF] ^ (c >> 8);
		}
		return c ^ 0xFFFFFFFF;
	}

	enum class IfcTokenType
	{
		UNKNOWN,
		STRING,
		ENUM,
		REAL,
		REF,
		EXPRESSTYPE,
		EMPTY,
		SET_BEGIN,
		SET_END,
		LINE_END
	};

	struct IfcToken
	{
		IfcTokenType type = IfcTokenType::UNKNOWN;
		uint64_t num;
		double real;
		uint64_t pos;
		uint64_t end;
	};

	struct IfcLine 
	{
		uint64_t expressID;
		uint64_t ifcType;
		uint64_t lineIndex;
	};

	class IfcLoader
	{
	public:
		void LoadFile(const std::string& content)
		{
			makeCRCTable();

			buf = content.data();
			pos = 0;
			len = content.size();

			while (TokenizeLine())
			{
				//
			}

			uint64_t maxExpressId = 0;
			for (int i = 0; i < lineTokens.size(); i++)
			{
				auto& line = lineTokens[i];
				if (line[0].type == IfcTokenType::REF)
				{
					IfcLine l;
					l.expressID = line[0].num;
					l.lineIndex = i;

					maxExpressId = std::max(maxExpressId, l.expressID);

					if (line[1].type == IfcTokenType::STRING)
					{
						auto& type = line[1];
						l.ifcType = crc32Simple(&buf[type.pos], type.end - type.pos);
						ifcTypeToLineID[l.ifcType].push_back(l.lineIndex);
					}

					lines.push_back(l);
				}
				else
				{
					IfcLine l;
					l.expressID = 0;
					l.ifcType = 0;

					lines.push_back(l);
				}
			}

			expressIDToLine.resize(maxExpressId + 1);

			for (int i = 0; i < lines.size(); i++)
			{
				expressIDToLine[lines[i].expressID] = i;
			}
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

		uint32_t ExpressIDToLineID(uint32_t expressID)
		{
			return expressIDToLine[expressID];
		}

		IfcLine& GetLine(uint32_t lineID)
		{
			return lines[lineID];
		}

		std::vector<IfcToken>& GetLineTokens(uint32_t lineID)
		{
			return lineTokens[lineID];
		}

		std::string GetString(IfcToken& token)
		{
			return std::string(&buf[token.pos], token.end - token.pos);
		}

	private:
		bool TokenizeLine()
		{
			static std::vector<IfcToken> line;
			line.clear();
			bool eof = false;
			while (true)
			{
				if (pos >= len)
				{
					eof = true;
					break;
				}

				const char c = buf[pos];

				// whitespace check
				if (c == ' ' || c == '\n' || c == '\r' || c == '\t')
				{
					pos++;
					continue;
				}else if (c == '\'')
				{
					pos++;
					bool prevSlash = false;
					int start = pos;
					while (!(buf[pos] == '\'' && !prevSlash))
					{
						if (buf[pos] == '\\')
						{
							prevSlash != prevSlash;
						}
						else
						{
							prevSlash = false;
						}

						pos++;
					}

					IfcToken token;
					token.type = IfcTokenType::STRING;
					token.pos = start;
					token.end = pos;
					line.push_back(std::move(token));
				} 
				else if (c == '#')
				{
					pos++;

					IfcToken token;
					token.type = IfcTokenType::REF;
					token.num = readInt();
					token.pos = pos;
					line.push_back(std::move(token));
				} 
				else if (c == '$' || c == '*')
				{
					IfcToken token;
					token.type = IfcTokenType::EMPTY;
					token.pos = pos;
					line.push_back(std::move(token));
				}
				else if (c == '(')
				{
					IfcToken token;
					token.type = IfcTokenType::SET_BEGIN;
					token.pos = pos;
					line.push_back(std::move(token));
				}
				else if (c >= '0' && c <= '9')
				{

					IfcToken token;
					token.type = IfcTokenType::REAL;
					bool negative = buf[pos - 1] == '-';
					token.real = readDouble();
					if (negative)
					{
						token.real *= -1;
					}
					token.pos = pos;
					line.push_back(std::move(token));
				}
				else if (c == '.')
				{
					pos++;
					uint32_t start = pos;
					while (buf[pos] != '.')
					{
						pos++;
					}
					IfcToken token;
					token.type = IfcTokenType::ENUM;
					token.pos = start;
					token.end = pos;
					line.push_back(std::move(token));
				}
				else if (c >= 'A' && c <= 'Z')
				{
					uint32_t start = pos;
					while ((buf[pos] >= 'A' && buf[pos] <= 'Z') || buf[pos] >= '0' && buf[pos] <= '9')
					{
						pos++;
					}
					IfcToken token;
					token.type = IfcTokenType::STRING;
					token.pos = start;
					token.end = pos;
					line.push_back(std::move(token));

					pos--;
				}
				else if (c == ')')
				{
					IfcToken token;
					token.type = IfcTokenType::SET_END;
					token.pos = pos;
					line.push_back(std::move(token));
				}
				else if (c == ';')
				{
					pos++;
					break;
				}

				pos++;
			}

			IfcToken token;
			token.type = IfcTokenType::LINE_END;
			token.pos = pos;

			line.push_back(std::move(token));

			lineTokens.push_back(line);
			return !eof;
		}

		uint64_t readInt()
		{
			uint64_t val = 0;
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
			char* end;
			double d = std::strtod(&buf[pos], &end);
			int size = end - &buf[pos];
			pos += size;
			return d;
		}

		uint32_t pos;
		uint32_t len;
		const char* buf;

		std::deque<std::vector<IfcToken>> lineTokens;
		std::vector<IfcLine> lines;
		std::vector<uint32_t> expressIDToLine;
		std::unordered_map<uint32_t, std::vector<uint32_t>> ifcTypeToLineID;
	};
}