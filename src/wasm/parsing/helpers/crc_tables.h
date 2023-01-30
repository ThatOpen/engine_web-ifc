/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#pragma once

void makeCRCTable(std::vector<uint32_t> &crcTable) {
	uint32_t c;
	for (uint32_t n = 0; n < 256; n++) {
		c = n;
		for (uint32_t k = 0; k < 8; k++) {
			c = ((c & 1) ? (0xEDB88320 ^ (c >> 1)) : (c >> 1));
		}
		crcTable[n] = c;
	}
}

uint32_t crc32Simple(const void* buf, const size_t len, std::vector<uint32_t> &crcTable)
{
	uint32_t c = 0 ^ 0xFFFFFFFF;
	const uint8_t* u = static_cast<const uint8_t*>(buf);
	for (size_t i = 0; i < len; ++i)
	{
		c = crcTable[(c ^ u[i]) & 0xFF] ^ (c >> 8);
	}
	return c ^ 0xFFFFFFFF;
}