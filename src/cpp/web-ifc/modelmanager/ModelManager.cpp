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
#include "../../version.h"

webifc::manager::ModelManager::ModelManager(bool _mt_enabled)
{
    mt_enabled = _mt_enabled;
}

webifc::manager::ModelManager::~ModelManager()
{
    CloseAllModels();
}

void webifc::manager::ModelManager::CloseAllModels()
{
    for (size_t i = 0; i < _loaders.size(); i++)
    {
        if (!IsModelOpen(i))
            continue;
        delete _loaders[i];
        delete _geometryProcessors[i];
    }
    _loaders.clear();
    _geometryProcessors.clear();
}

void webifc::manager::ModelManager::SetLogLevel(uint8_t levelArg)
{
    spdlog::set_level((spdlog::level::level_enum)levelArg);
    spdlog::set_pattern("[WEB-IFC][%l]%v");
}

webifc::geometry::IfcGeometryProcessor *webifc::manager::ModelManager::GetGeometryProcessor(uint32_t modelID)
{
    if (!IsModelOpen(modelID))
        return {};
    if (!_geometryProcessors.contains(modelID))
    {
        webifc::geometry::IfcGeometryProcessor *processor = new webifc::geometry::IfcGeometryProcessor(*GetIfcLoader(modelID), _schemaManager, GetSettings(modelID).CIRCLE_SEGMENTS, GetSettings(modelID).COORDINATE_TO_ORIGIN, GetSettings(modelID).TOLERANCE_PLANE_INTERSECTION, GetSettings(modelID).TOLERANCE_PLANE_DEVIATION, GetSettings(modelID).TOLERANCE_BACK_DEVIATION_DISTANCE, GetSettings(modelID).TOLERANCE_INSIDE_OUTSIDE_PERIMETER, GetSettings(modelID).TOLERANCE_SCALAR_EQUALITY, GetSettings(modelID).PLANE_REFIT_ITERATIONS, GetSettings(modelID).BOOLEAN_UNION_THRESHOLD);
        _geometryProcessors[modelID] = processor;
    }
    return _geometryProcessors.at(modelID);
}

webifc::parsing::IfcLoader *webifc::manager::ModelManager::GetIfcLoader(uint32_t modelID) const
{
    if (!IsModelOpen(modelID))
        return {};
    return _loaders[modelID];
}

const webifc::manager::LoaderSettings &webifc::manager::ModelManager::GetSettings(uint32_t modelID) const
{
    if (!IsModelOpen(modelID))
        return LoaderSettings();
    return _settings[modelID];
}

const webifc::schema::IfcSchemaManager &webifc::manager::ModelManager::GetSchemaManager() const
{
    return _schemaManager;
}

bool webifc::manager::ModelManager::IsModelOpen(uint32_t modelID) const
{
    if (_loaders.size() <= modelID)
        return false;
    if (_loaders[modelID] == nullptr)
        return false;
    return true;
}

void webifc::manager::ModelManager::CloseModel(uint32_t modelID)
{
    if (!IsModelOpen(modelID))
        return;
    delete _loaders[modelID];
    delete _geometryProcessors[modelID];
    _loaders[modelID] = nullptr;
    _geometryProcessors[modelID] = nullptr;
}

uint32_t webifc::manager::ModelManager::CreateModel(LoaderSettings settings)
{
    if (!header_shown)
    {
        std::stringstream str;
        str << "web-ifc: " << WEB_IFC_VERSION_NUMBER << " threading: " << (mt_enabled ? "enabled" : "disabled");
        str << " schemas available [";
        for (auto schema : _schemaManager.GetAvailableSchemas())
            str << _schemaManager.GetSchemaName(schema) << ",";
        str << "]";
        spdlog::info(str.str());
        header_shown = true;
    }
    webifc::parsing::IfcLoader *loader = new webifc::parsing::IfcLoader(settings.TAPE_SIZE, settings.MEMORY_LIMIT, settings.LINEWRITER_BUFFER, _schemaManager);
    _loaders.push_back(loader);
    _settings.push_back(settings);
    return _loaders.size() - 1;
}