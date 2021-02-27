#pragma once

#include <unordered_map>

namespace webifc
{
	struct IfcLine 
	{
		uint32_t expressID;
		uint32_t ifcType;
		uint32_t lineIndex;
		uint32_t tapeOffset;
		uint32_t tapeEnd;
	};

    struct IfcMetaData
    {
		std::vector<IfcLine> lines;
		std::vector<uint32_t> expressIDToLine;
		std::unordered_map<uint32_t, std::vector<uint32_t>> ifcTypeToLineID;

		std::unordered_map<uint32_t, std::vector<uint32_t>> _relVoids;
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> _styledItems;
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> _relMaterials;
		std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> _materialDefinitions;
    };
}