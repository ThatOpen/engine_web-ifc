/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include "crack_atof.h"
#include "../util.h"

namespace webifc
{
	enum IfcTokenType : char
	{
		UNKNOWN = 0,
		STRING,
        LABEL,
		ENUM,
		REAL,
		REF,
		EMPTY,
		SET_BEGIN,
		SET_END,
		LINE_END
	};

    template<uint32_t N>
    class Tokenizer {
    public:

        Tokenizer(webifc::DynamicTape<N>& t):
            _tape(t)
        {

        }

        uint32_t Tokenize(const std::string& content)
        {
			buf = content.data();
			pos = 0;
			len = static_cast<uint32_t>(content.size());

			uint32_t numLines = 0;
			while (TokenizeLine())
			{
				numLines++;
			}

            return numLines;
        }

		bool TokenizeLine()
		{
			bool eof = false;
			bool isSTEPLine = false;
			
			while (true)
			{
				if (pos >= len)
				{
					eof = true;
					break;
				}

				const char c = buf[pos];

				bool isFirstToken = pos == 0 || (buf[pos - 1] == '\n' && buf[pos - 2] == ';');
				bool isWhiteSpace = c == ' ' || c == '\n' || c == '\r' || c == '\t';

				// only consider a line a stepline if the very first non-whitespace character is a ref
				if (!isWhiteSpace && isFirstToken && c == '#')
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
					// apparently I dont fully understand strings in IFC yet
					// this example from uptown shows that escaping is not used: 'Type G5 - 800kg/m\X2\00B2\X0\';
					// this example from revit shows that double quotes are used as one quote: 'RPC Tree - Deciduous:Scarlet Oak - 42'':946835'
					// turns out this is just part of ISO 10303-21, thanks ottosson!
					while (true)
					{
						// if its a quote, maybe its the end of the string
						if (buf[pos] == '\'')
						{
							// if there's another quote behind it, its not
							if (buf[pos + 1] == '\'')
							{
								// we also bump pos, otherwise we still break next loop...
								pos++;
							}
							else
							{
								break;
							}
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
				else if (c == '$')
				{
					_tape.push(IfcTokenType::EMPTY);
				}
				else if (c == '*')
				{
					_tape.push(IfcTokenType::UNKNOWN);
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

					_tape.push(IfcTokenType::LABEL);
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

    private:
        webifc::DynamicTape<N>& _tape;

		uint32_t pos;
		uint32_t len;
		const char* buf;
    };
}