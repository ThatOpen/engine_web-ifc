/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include <vector>
#include <functional>

#include "crack_atof.h"
#include "p21decode.h"
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

		std::vector<char> _temp;

		struct BufferPointer
		{
			char prev;
			char cur;
			char next;

			uint32_t bufPos;
			uint32_t bufLength;

			const size_t READ_BUF_SIZE = 1024 * 1024; // 1 mb
			std::function<uint32_t(char*, size_t)> _requestData;
			std::vector<char> _readBuffer;

			bool done = false;

			BufferPointer() :
				_readBuffer(READ_BUF_SIZE)
			{

			}

			inline void Advance()
			{
				bufPos++;

				if (!done && AtEnd())
				{
					bufPos = 0;
					bufLength = _requestData(&_readBuffer[0], READ_BUF_SIZE);
					done = bufLength == 0;
				}

				prev = cur;
				cur = next;
				next = done ? 0 : _readBuffer[bufPos];
			}

			inline bool AtEnd()
			{
				return bufPos >= bufLength;
			}
		};

		BufferPointer _ptr;

        Tokenizer(webifc::DynamicTape<N>& t):
            _tape(t)
        {

        }

        uint32_t Tokenize(const std::function<uint32_t(char*, size_t)>& requestData)
        {
			_ptr._requestData = requestData;
			_ptr.bufPos = 1;
			_ptr.bufLength = 0;
			_ptr.Advance();
			_ptr.Advance();

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
			
			while (true)
			{
				if (_ptr.done)
				{
					eof = true;
					break;
				}

				const char c = _ptr.cur;

				bool isWhiteSpace = c == ' ' || c == '\n' || c == '\r' || c == '\t';
				
				if (isWhiteSpace)
				{
					_ptr.Advance();
					continue;
				}

				if (c == '\'')
				{
					_ptr.Advance();
					bool prevSlash = false;
					_temp.clear();
					// apparently I dont fully understand strings in IFC yet
					// this example from uptown shows that escaping is not used: 'Type G5 - 800kg/m\X2\00B2\X0\';
					// this example from revit shows that double quotes are used as one quote: 'RPC Tree - Deciduous:Scarlet Oak - 42'':946835'
					// turns out this is just part of ISO 10303-21, thanks ottosson!
					while (true)
					{
						_temp.push_back(_ptr.cur);
						// if its a quote, maybe its the end of the string
						if (_ptr.cur == '\'')
						{
							// if there's another quote behind it, its not
							if (_ptr.next == '\'')
							{
								// we also bump pos, otherwise we still break next loop...
								_ptr.Advance();
								_temp.push_back(_ptr.cur);
							}
							else
							{
								_temp.pop_back();
								break;
							}
						}

						_ptr.Advance();
					}

					if (need_to_decode(_temp))
						_temp = p21decoder(_temp).unescape();

					_tape.push(IfcTokenType::STRING);
					_tape.push2((uint16_t)_temp.size());
					if (!_temp.empty())
					{
						_tape.push((void*)&_temp[0], _temp.size());
					}
				} 
				else if (c == '#')
				{
					_ptr.Advance();

					uint32_t num = readInt();

					_tape.push(IfcTokenType::REF);
					_tape.push(&num, sizeof(uint32_t));

					// skip next advance
					continue;
				}
				else if (c == '$')
				{
					_tape.push(IfcTokenType::EMPTY);
				}
				else if (c == '*')
				{
					if (_ptr.prev == '/')
					{
						_ptr.Advance();

						// comment
						while (!(_ptr.prev == '*' && _ptr.cur == '/'))
						{
							_ptr.Advance();
						}
					}
					else
					{
						_tape.push(IfcTokenType::UNKNOWN);
					}
				}
				else if (c == '(')
				{
					_tape.push(IfcTokenType::SET_BEGIN);
				}
				else if (c >= '0' && c <= '9')
				{
					bool negative = _ptr.prev == '-';
					double value = readDouble();
					if (negative)
					{
						value *= -1;
					}

					_tape.push(IfcTokenType::REAL);
					_tape.push(&value, sizeof(double));

					// skip next advance
					continue;
				}
				else if (c == '.')
				{
					_temp.clear();
					_ptr.Advance();
					while (_ptr.cur != '.')
					{
						_temp.push_back(_ptr.cur);
						_ptr.Advance();
					}

					_tape.push(IfcTokenType::ENUM);
					_tape.push2((uint16_t)_temp.size());
					_tape.push((void*)&_temp[0], _temp.size());
				}
				else if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z'))
				{
					_temp.clear();
					while ((_ptr.cur >= 'A' && _ptr.cur <= 'Z') || (_ptr.cur >= 'a' && _ptr.cur <= 'z') || (_ptr.cur >= '0' && _ptr.cur <= '9') || _ptr.cur == '_')
					{
						const char c2 = toupper(_ptr.cur);
						_temp.push_back(c2);
						_ptr.Advance();
					}

					_tape.push(IfcTokenType::LABEL);
					_tape.push2((uint16_t)_temp.size());
					_tape.push((void*)&_temp[0], _temp.size());

					// skip next advance
					continue;
				}
				else if (c == ')')
				{
					_tape.push(IfcTokenType::SET_END);
				}
				else if (c == ';')
				{
					_tape.push(IfcTokenType::LINE_END);
					_ptr.Advance();

					break;
				}

				_ptr.Advance();
			}

			
			return !eof && !_ptr.done;
		}
        
		uint32_t readInt()
		{
			uint32_t val = 0;
			char c = _ptr.cur;
			
			while (c >= '0' && c <= '9')
			{
				val = val * 10 + (c - '0');
				_ptr.Advance();
				c = _ptr.cur;
			}

			return val;
		}

		double readDouble()
		{
			char c = _ptr.cur;

			_temp.clear();

			while ((_ptr.cur >= '0' && _ptr.cur <= '9') || (_ptr.cur == '.') || _ptr.cur == 'e' || _ptr.cur == 'E' || _ptr.cur == '-'|| _ptr.cur == '+')
			{
				_temp.push_back(_ptr.cur);
				_ptr.Advance();
			}

			const char* start = &(_temp[0]);
			const char* end = start;
			double d = crack_atof(end, start + _temp.size());

			return d;
		}

    private:
        webifc::DynamicTape<N>& _tape;
    };
}