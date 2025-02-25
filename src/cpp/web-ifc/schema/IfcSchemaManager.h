/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include "ifc-schema.h"
#include <vector>
#include <string>
#include <string_view>
#include <unordered_set>
#include <cstdint>


namespace webifc::schema {
    class IfcSchemaManager {
        public:
            IfcSchemaManager();
            const std::vector<IFC_SCHEMA> GetAvailableSchemas() const;
            std::string_view GetSchemaName(IFC_SCHEMA schema) const;
            uint32_t IfcTypeToTypeCode(const std::string_view name) const;
            std::string IfcTypeCodeToType(const uint32_t typeCode) const; 
            bool IsIfcElement(const uint32_t typeCode) const;
            const std::unordered_set<uint32_t> & GetIfcElementList() const;
        private: 
            std::vector<uint32_t> _crcTable;
            std::unordered_set<uint32_t> _ifcElements;
            std::vector<IFC_SCHEMA> _schemas;
            std::vector<std::string_view> _schemaNames;
            void initSchemaData();
            uint32_t IfcTypeToTypeCode(const void * name, const size_t len) const;
    };
}