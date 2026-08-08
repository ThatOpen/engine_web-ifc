/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Thin C++ shim between the web-ifc core and the Cython extension. Absorbs
// everything Cython handles poorly: istream ownership (chunk eviction re-reads
// the byte source until CloseModel), string_view returns, glm matrices, and
// per-mesh buffer serialization.

#pragma once

#include <cstdint>
#include <fstream>
#include <map>
#include <memory>
#include <string>
#include <vector>

#include "modelmanager/ModelManager.h"

namespace webifc::pybridge
{

// Structure-of-arrays form of one IfcFlatMesh: geometryExpressIDs[i] pairs
// with transformations[i*16..] (column-major) and colors[i*4..] (RGBA).
struct FlatMeshData
{
    uint32_t expressID = 0;
    std::vector<uint32_t> geometryExpressIDs;
    std::vector<double> transformations;
    std::vector<double> colors;
};

class Session
{
  public:
    Session();
    ~Session();

    // Returns the modelID, or -1 with errorOut set. The opened file handle
    // stays owned by the session until Close(modelID).
    int64_t OpenFromPath(const std::string &path, const webifc::manager::LoaderSettings &settings, std::string &errorOut);
    void Close(uint32_t modelID);
    void CloseAll();
    bool IsOpen(uint32_t modelID) const;
    bool SaveToPath(uint32_t modelID, const std::string &path, bool orderLinesByExpressID);

    webifc::parsing::IfcLoader *Loader(uint32_t modelID) const;
    uint64_t GetTotalSize(uint32_t modelID) const;
    std::string SchemaName(uint32_t modelID) const;

    FlatMeshData GetFlatMesh(uint32_t modelID, uint32_t expressID);
    // Pointers remain valid until ClearGeometry/Close on the same model.
    const double *VertexData(uint32_t modelID, uint32_t geometryExpressID, size_t &countOut);
    const uint32_t *IndexData(uint32_t modelID, uint32_t geometryExpressID, size_t &countOut);
    void ClearGeometry(uint32_t modelID);

    std::vector<uint32_t> ElementTypes() const;
    uint32_t TypeNameToCode(const std::string &name) const;
    std::string TypeCodeToName(uint32_t typeCode) const;
    bool IsIfcElement(uint32_t typeCode) const;

    void SetLogLevel(uint8_t level);

  private:
    webifc::manager::ModelManager _manager;
    std::map<uint32_t, std::unique_ptr<std::ifstream>> _streams;
};

// string_view-returning loader calls, copied for Cython.
std::string GetStringArgumentCopy(webifc::parsing::IfcLoader &loader);

} // namespace webifc::pybridge
