/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "pybridge.h"

#include <filesystem>
#include <spdlog/spdlog.h>

namespace webifc::pybridge
{

Session::Session() : _manager(false)
{
    _manager.SetLogLevel(4); // errors only by default; SetLogLevel overrides
}

Session::~Session()
{
    CloseAll();
}

int64_t Session::OpenFromPath(const std::string &path, const webifc::manager::LoaderSettings &settings, std::string &errorOut)
{
    std::error_code ec;
    if (!std::filesystem::is_regular_file(path, ec) || ec)
    {
        errorOut = "not a regular file: " + path;
        return -1;
    }
    if (std::filesystem::file_size(path, ec) == 0 || ec)
    {
        errorOut = "empty or unreadable file: " + path;
        return -1;
    }
    auto stream = std::make_unique<std::ifstream>(path, std::ios::binary);
    if (!*stream)
    {
        errorOut = "cannot open file: " + path;
        return -1;
    }
    uint32_t modelID = _manager.CreateModel(settings);
    // Register the stream first: chunk eviction re-reads from it for the
    // model's lifetime, and the failure path must unwind cleanly.
    _streams[modelID] = std::move(stream);
    try
    {
        _manager.GetIfcLoader(modelID)->LoadFile(*_streams[modelID]);
    }
    catch (...)
    {
        _manager.CloseModel(modelID);
        _streams.erase(modelID);
        throw;
    }
    return modelID;
}

void Session::Close(uint32_t modelID)
{
    if (!_manager.IsModelOpen(modelID))
        return;
    _manager.CloseModel(modelID);
    _streams.erase(modelID);
}

void Session::CloseAll()
{
    _manager.CloseAllModels();
    _streams.clear();
}

bool Session::IsOpen(uint32_t modelID) const
{
    return _manager.IsModelOpen(modelID);
}

bool Session::SaveToPath(uint32_t modelID, const std::string &path, bool orderLinesByExpressID)
{
    if (!_manager.IsModelOpen(modelID))
        return false;
    std::ofstream out(path, std::ios::binary);
    if (!out)
        return false;
    _manager.GetIfcLoader(modelID)->SaveFile(out, orderLinesByExpressID);
    return out.good();
}

webifc::parsing::IfcLoader *Session::Loader(uint32_t modelID) const
{
    return _manager.GetIfcLoader(modelID);
}

uint64_t Session::GetTotalSize(uint32_t modelID) const
{
    return _manager.IsModelOpen(modelID) ? _manager.GetIfcLoader(modelID)->GetTotalSize() : 0;
}

std::string Session::SchemaName(uint32_t modelID) const
{
    if (!_manager.IsModelOpen(modelID))
        return "";
    auto schema = _manager.GetIfcLoader(modelID)->GetSchema();
    return std::string(_manager.GetSchemaManager().GetSchemaName(schema));
}

FlatMeshData Session::GetFlatMesh(uint32_t modelID, uint32_t expressID)
{
    FlatMeshData result;
    result.expressID = expressID;
    if (!_manager.IsModelOpen(modelID))
        return result;
    auto mesh = _manager.GetGeometryProcessor(modelID)->GetFlatMesh(expressID);
    result.geometryExpressIDs.reserve(mesh.geometries.size());
    result.transformations.reserve(mesh.geometries.size() * 16);
    result.colors.reserve(mesh.geometries.size() * 4);
    for (auto &placed : mesh.geometries)
    {
        result.geometryExpressIDs.push_back(placed.geometryExpressID);
        for (int i = 0; i < 16; i++)
            result.transformations.push_back(placed.flatTransformation[i]);
        result.colors.push_back(placed.color.x);
        result.colors.push_back(placed.color.y);
        result.colors.push_back(placed.color.z);
        result.colors.push_back(placed.color.w);
    }
    return result;
}

const double *Session::VertexData(uint32_t modelID, uint32_t geometryExpressID, size_t &countOut)
{
    countOut = 0;
    if (!_manager.IsModelOpen(modelID))
        return nullptr;
    auto &geom = _manager.GetGeometryProcessor(modelID)->GetGeometry(geometryExpressID);
    countOut = geom.vertexData.size();
    return countOut ? geom.vertexData.data() : nullptr;
}

const uint32_t *Session::IndexData(uint32_t modelID, uint32_t geometryExpressID, size_t &countOut)
{
    countOut = 0;
    if (!_manager.IsModelOpen(modelID))
        return nullptr;
    auto &geom = _manager.GetGeometryProcessor(modelID)->GetGeometry(geometryExpressID);
    countOut = geom.indexData.size();
    return countOut ? geom.indexData.data() : nullptr;
}

void Session::ClearGeometry(uint32_t modelID)
{
    if (_manager.IsModelOpen(modelID))
        _manager.GetGeometryProcessor(modelID)->Clear();
}

std::vector<uint32_t> Session::ElementTypes() const
{
    const auto &types = _manager.GetSchemaManager().GetIfcElementList();
    return std::vector<uint32_t>(types.begin(), types.end());
}

uint32_t Session::TypeNameToCode(const std::string &name) const
{
    return _manager.GetSchemaManager().IfcTypeToTypeCode(name);
}

std::string Session::TypeCodeToName(uint32_t typeCode) const
{
    return std::string(_manager.GetSchemaManager().IfcTypeCodeToType(typeCode));
}

bool Session::IsIfcElement(uint32_t typeCode) const
{
    return _manager.GetSchemaManager().IsIfcElement(typeCode);
}

void Session::SetLogLevel(uint8_t level)
{
    _manager.SetLogLevel(level);
}

std::string GetStringArgumentCopy(webifc::parsing::IfcLoader &loader)
{
    return std::string(loader.GetStringArgument());
}

} // namespace webifc::pybridge
