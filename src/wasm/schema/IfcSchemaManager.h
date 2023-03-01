/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include "ifc-schema.h"
#include <vector>
#include <string>
#include <unordered_set>


namespace webifc::schema {
    class IfcSchemaManager {
        public:
            IfcSchemaManager();
            std::vector<IFC_SCHEMA> GetAvailableSchemas();
            std::string GetSchemaName(IFC_SCHEMA schema);
            uint32_t IfcTypeToTypeCode(const std::string name);
            uint32_t IfcTypeToTypeCode(const std::string_view name);
            std::string IfcTypeCodeToType(const uint32_t typeCode);
            bool IsIfcElement(const uint32_t typeCode);
            std::unordered_set<uint32_t> & GetIfcElementList();
        private: 
            std::vector<uint32_t> _crcTable;
            std::unordered_set<uint32_t> _ifcElements;
            std::vector<IFC_SCHEMA> _schemas;
            std::vector<std::string> _schemaNames;
            void initSchemaData();
            uint32_t IfcTypeToTypeCode(const void * name, const size_t len);
    };
}