/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <vector>
#include <spdlog/spdlog.h>
#include <sstream>
#include "ModelManager.h"
#include "../schema/IfcSchemaManager.h"
#include "../geometry/IfcGeometryProcessor.h"
#include "../parsing/IfcLoader.h"
#include "../version.h"

webifc::manager::ModelManager::ModelManager(bool _mt_enabled) {
    mt_enabled = _mt_enabled;
}

webifc::manager::ModelManager::~ModelManager() {
    for (size_t i=0; i < _loaders.size();i++) {
        if (!IsModelOpen(i)) continue;
        delete _loaders[i];
        delete _geometryProcessors[i];
    }
    _loaders.clear();
    _geometryProcessors.clear();
}

void webifc::manager::ModelManager::SetLogLevel(uint8_t levelArg) {
    spdlog::set_level((spdlog::level::level_enum)levelArg);
    spdlog::set_pattern("[WEB-IFC][%l]%v");
}

webifc::geometry::IfcGeometryProcessor* webifc::manager::ModelManager::GetGeometryProcessor(uint32_t modelID) const {
    if (!IsModelOpen(modelID)) return {};
    return _geometryProcessors[modelID];
}

webifc::parsing::IfcLoader* webifc::manager::ModelManager::GetIfcLoader(uint32_t modelID) const {
    if (!IsModelOpen(modelID)) return {};
    return _loaders[modelID];
}

const webifc::schema::IfcSchemaManager &webifc::manager::ModelManager::GetSchemaManager() const {
    return _schemaManager;
}

bool webifc::manager::ModelManager::IsModelOpen(uint32_t modelID) const {
    if (_loaders.size() <= modelID) return false;
     if (_loaders[modelID] == nullptr) return false;
     return true;
}

void webifc::manager::ModelManager::CloseModel(uint32_t modelID) {
    if (!IsModelOpen(modelID)) return;
    delete _loaders[modelID];
    delete _geometryProcessors[modelID];
    _loaders[modelID] = nullptr;
    _geometryProcessors[modelID] = nullptr;
}

uint32_t webifc::manager::ModelManager::CreateModel(LoaderSettings _settings) {
    if (!header_shown)
    {
        std::stringstream str;
        str << "web-ifc: "<< WEB_IFC_VERSION_NUMBER << " threading: " << (mt_enabled ? "enabled" : "disabled");
        str << " schemas available [";
        for (auto schema : _schemaManager.GetAvailableSchemas())  str << _schemaManager.GetSchemaName(schema)<<",";
        str << "]";
        spdlog::info(str.str());
        header_shown = true;
    }
    webifc::parsing::IfcLoader * loader = new webifc::parsing::IfcLoader(_settings.TAPE_SIZE,_settings.MEMORY_LIMIT,_settings.LINEWRITER_BUFFER,_schemaManager);
    webifc::geometry::IfcGeometryProcessor * processor = new webifc::geometry::IfcGeometryProcessor(*loader,_schemaManager,_settings.CIRCLE_SEGMENTS,_settings.COORDINATE_TO_ORIGIN, _settings.OPTIMIZE_PROFILES);
    _geometryProcessors.push_back(processor);
    _loaders.push_back(loader);
    return _loaders.size()-1;
}