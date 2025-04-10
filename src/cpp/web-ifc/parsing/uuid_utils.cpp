#include <map>
#include <random>
#include "uuid.h"
#include "IfcLoader.h"

namespace webifc::parsing {

	std::string generateStringUUID() {
		std::random_device rd;
		auto seed_data = std::array<int, 6> {};
		std::generate(std::begin(seed_data), std::end(seed_data), std::ref(rd));
		std::seed_seq seq(std::begin(seed_data), std::end(seed_data));
		std::ranlux48_base generator(seq);
		uuids::basic_uuid_random_generator<std::ranlux48_base> gen(&generator);
		auto id = gen();
		std::string final =  uuids::to_string(id);
		return final;
	}

	static constexpr const int8_t base16mask[] = { -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
					- 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
					- 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
					0,  1,  2,  3,  4,  5,  6,  7,  8,  9, -1, -1, -1, -1, -1, -1, 
					- 1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
					- 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
					- 1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
					- 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 };


	static constexpr const int8_t base64mask[] = { -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
					- 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
					- 1, -1, -1, -1, 63, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
					0,  1,  2,  3,  4,  5,  6,  7,  8,  9, -1, -1, -1, -1, -1, -1, 
					- 1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 
					25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, -1, -1, -1, -1, 62, 
					- 1, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 
					51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1 };

	static constexpr const char base16Chars[] = { '0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F' };

	static constexpr std::array<char, 64> base64Chars = {
			'0','1','2','3','4','5','6','7','8','9',
			'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
			'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
			'_','$'
		};

	std::string expandIfcGuid(const std::string_view &guid) {
		char temp[34];
		uint8_t ii = 0;

		for (size_t i = 0; i < 22; i += 2)
		{
			uint16_t n = base64mask[(uint8_t)guid[i]] << 6;
			n += base64mask[(uint8_t)guid[i + 1]];
			uint16_t t = n / 16;
			temp[ii + 2] = base16Chars[n % 16];
			temp[ii + 1] = base16Chars[t % 16];
			temp[ii] = base16Chars[t / 16];
			ii += 3;
		}
		temp[ii] = '\0';

		std::string result;
		result.resize(36);
		for (size_t i = 1; i < 36; ++i)
		{
			if (i == 9 || i == 13 || i == 17 || i == 21) result.push_back('-');
			result.push_back(temp[i]);
		}
		return result;	
	}


	std::string compressIfcGuid(const std::string& guid)
	{
		std::string temp;
		temp.push_back('0');
		for (size_t ii = 0; ii < guid.length(); ++ii) if (guid[ii] != '-') temp.push_back(guid[ii]);

		// compress
		size_t n = 0;
		char result[23];
		for (size_t i = 0, oi = 0; i < 32; i += 3)
		{
			n = base16mask[(uint8_t)temp[i]] << 8;
			n += base16mask[(uint8_t)temp[i + 1]] << 4;
			n += base16mask[(uint8_t)temp[i + 2]];
			result[oi + 1] = base64Chars[n % 64];
			result[oi] = base64Chars[n / 64];
			oi+=2;
		}
		result[22]='\0';
		return std::string(result);
	}
}	