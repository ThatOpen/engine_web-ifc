/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include <cstdint>
#include <limits>
#include <string_view>

namespace webifc::parsing
{
    // BINARY currently shares the token tape's uint16_t string length field.
    inline constexpr size_t MAX_BINARY_LENGTH = std::numeric_limits<uint16_t>::max();

    inline int BinaryHexDigit(char digit)
    {
        if (digit >= '0' && digit <= '9') return digit - '0';
        if (digit >= 'A' && digit <= 'F') return digit - 'A' + 10;
        if (digit >= 'a' && digit <= 'f') return digit - 'a' + 10;
        return -1;
    }

    inline char CanonicalBinaryDigit(char digit)
    {
        return digit >= 'a' && digit <= 'f' ? digit - 'a' + 'A' : digit;
    }

    // ISO 10303-21, 6.4.6: the prefix counts zero padding bits on the LEFT.
    // Accept lowercase hex for compatibility; callers write canonical uppercase.
    inline bool IsValidStepBinary(std::string_view text)
    {
        if (text.empty() || text.size() > MAX_BINARY_LENGTH || text[0] < '0' || text[0] > '3') return false;
        if (text.size() == 1) return text[0] == '0'; // The empty bit sequence.
        for (size_t i = 1; i < text.size(); ++i)
            if (BinaryHexDigit(text[i]) < 0) return false;
        return BinaryHexDigit(text[1]) < (16 >> (text[0] - '0'));
    }
}
