/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <vector>
#include <string_view>
#include <unordered_set>
#include "IfcSchemaManager.h"

namespace webifc::schema {
   
    IfcSchemaManager::IfcSchemaManager() : _crcTable(256)
    {
        uint32_t c;
        for (uint32_t n = 0; n < 256; n++) {
            c = n;
            for (uint32_t k = 0; k < 8; k++) {
                c = ((c & 1) ? (0xEDB88320 ^ (c >> 1)) : (c >> 1));
            }
            _crcTable[n] = c;
        }
        initSchemaData();
    }

    std::string_view IfcSchemaManager::GetSchemaName(IFC_SCHEMA schema)  const
    {
        return _schemaNames[schema];
    }

    const std::vector<IFC_SCHEMA> IfcSchemaManager::GetAvailableSchemas() const
    {
        return _schemas;
    }

    uint32_t IfcSchemaManager::IfcTypeToTypeCode(std::string_view name) const
    {
        return IfcTypeToTypeCode(name.data(),name.size());
    }
 
    uint32_t IfcSchemaManager::IfcTypeToTypeCode(const void * name, size_t len) const
    {
        uint32_t c = 0 ^ 0xFFFFFFFF;
        const uint8_t* u = static_cast<const uint8_t*>(name);
        for (size_t i = 0; i < len; ++i)
        {
            c = _crcTable[(c ^ u[i]) & 0xFF] ^ (c >> 8);
        }
        return c ^ 0xFFFFFFFF;
    }

    bool IfcSchemaManager::IsIfcElement(uint32_t typeCode) const
    {
        return _ifcElements.find(typeCode) != _ifcElements.end();
    }

    const std::unordered_set<uint32_t> & IfcSchemaManager::GetIfcElementList() const
    {
        return _ifcElements;
    }
  
}