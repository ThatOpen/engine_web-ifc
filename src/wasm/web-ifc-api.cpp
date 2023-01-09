/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#include <string>
#include <fstream>
#include <sstream>
#include <iostream>
#include <stack>
#include <memory>
#include <map>

#include <emscripten/bind.h>

#include "include/web-ifc.h"
#include "include/web-ifc-geometry.h"

#include "version.h"

std::map<uint32_t, std::unique_ptr<webifc::IfcLoader>> loaders;
std::map<uint32_t, std::unique_ptr<webifc::IfcGeometryLoader>> geomLoaders;

uint32_t GLOBAL_MODEL_ID_COUNTER = 0;

#ifdef __EMSCRIPTEN_PTHREADS__
    constexpr bool MT_ENABLED = true;
#else
    constexpr bool MT_ENABLED = false;
#endif

bool shown_version_header = false;

// use to construct API placeholders
int main() {
    loaders.emplace();
    geomLoaders.emplace(0, std::make_unique<webifc::IfcGeometryLoader>(*loaders[0]));

    return 0;
}

std::string ReadFile(const std::string& filename)
{
    std::ifstream t("/" + filename);
    t.seekg(0, std::ios::end);
    size_t size = t.tellg();
    std::string buffer(size, ' ');
    t.seekg(0);
    t.read(&buffer[0], size);
    return buffer;
}

void WriteFile(const std::string& filename, const std::string& contents)
{
    std::ofstream t("/" + filename);
    t << contents;
}

int OpenModel(webifc::LoaderSettings settings, emscripten::val callback)
{
    if (!shown_version_header)
    {
        webifc::logInfo("web-ifc: " + WEB_IFC_VERSION_NUMBER +
                        " threading: " + (MT_ENABLED ? "enabled" : "disabled"));
        shown_version_header = true;
    }

    uint32_t modelID = GLOBAL_MODEL_ID_COUNTER++;

    auto loader = std::make_unique<webifc::IfcLoader>(settings);
    loaders.emplace(modelID, std::move(loader));

    // Start the timer.
    auto start = webifc::ms();

    size_t contentOffset = 0;
    loaders[modelID]->LoadFile([&](char* dest, size_t destSize)
                    {
                        emscripten::val retVal = callback((uint32_t)dest, destSize);
                        uint32_t len = retVal.as<uint32_t>();
                        return len;
                    });

    // Ensure IsOpen will return true upon successful load.
    loaders[modelID]->SetOpen();

    // Stop the timer.
    auto end = webifc::ms() - start;

    auto geomLoader = std::make_unique<webifc::IfcGeometryLoader>(*loaders[modelID]);
    geomLoaders.emplace(modelID, std::move(geomLoader));

    return modelID;
}

int CreateModel(webifc::LoaderSettings settings)
{
    uint32_t modelID = GLOBAL_MODEL_ID_COUNTER++;
    
    auto loader = std::make_unique<webifc::IfcLoader>(settings);
    loaders.emplace(modelID, std::move(loader));
    auto geomLoader = std::make_unique<webifc::IfcGeometryLoader>(*loaders[modelID]);
    geomLoaders.emplace(modelID, std::move(geomLoader));

    return modelID;
}


void serialize(std::vector<std::string> filePaths, std::string serializedName, emscripten::val callback, uint32_t ramLimit = 200000000)
{
    auto settings = webifc::LoaderSettings();
    auto loader = std::make_unique<webifc::IfcLoader>(settings);

    loader->ActivateSerializer(ramLimit);
    loader->SetSerializedFileName(serializedName);
    loader->SetCallback([&](std::string dest, size_t destSize)
                        {
                        emscripten::val retVal = callback(dest, destSize);
                        return dest; });

    uint32_t numLines = 0;

    for (uint32_t fi = 0; fi < filePaths.size(); fi++)
    {
        std::ifstream bigFile(filePaths[fi], std::ios::binary | std::ios::ate);
        int fileSize = bigFile.tellg();
        bigFile.seekg(0);
        constexpr size_t bufferSize = 5000;
        std::array<char, bufferSize> buffer;
        
        bool inText = false;
        std::string prevStringChunk = "";
        std::string content = "";

        if (bigFile.fail())
        {
            std::cout << "ERROR, Could not open " << filePaths[fi] << std::endl;
            exit(1);
        }

        while (bigFile)
        {
            content.clear();
            for (int i(0); i < bufferSize; ++i)
                buffer[i] = '\0';
            bigFile.read(buffer.data(), bufferSize);
            content = buffer.data();

            if (content.size() > bufferSize)
            {
                content.erase(bufferSize, content.size() - bufferSize);
            }

            // keep record of quotations
            for (int j = 0; j < content.size(); j++)
            {
                if (content[j] == '\'')
                {
                    inText = !inText;
                }
            }

            // Add the preovious uncomplete string chunk
            content = prevStringChunk + content;

            bool doit = true;
            prevStringChunk.clear();
            uint32_t i = 1;
            bool inText2 = inText;

            while (true)
            {
                uint32_t idx = content.size() - i;
                // Negative idx is not suposed to happen

                if (content.size() < i)
                {
                    doit = false;
                    break;
                }
                if (content[idx] == '\'')
                {
                    inText2 = !inText2;
                }
                // Only if you are not in a text the ';' indicates end of line
                if (content[idx] == ';' && !inText2)
                {
                    break;
                }
                else
                {
                    // All the incomplete text is keep in the prevStringChunk
                    prevStringChunk.push_back(content[idx]);
                }
                i++;
            }

            // Reverse the uncomplete string line
            reverse(prevStringChunk.begin(), prevStringChunk.end());

            if (doit)
            {
                // Remove uncomplete last line
                content.erase(content.size() - prevStringChunk.size(), prevStringChunk.size());
                content = content + " ";

                size_t contentOffset = 0;
                numLines += loader->readFilePart([&](char *dest, size_t destSize)
                                                 {
                        uint32_t length = std::min(content.size() - contentOffset, destSize);
                        memcpy(dest, &content[contentOffset], length);

                        contentOffset += length;

                        return length; });
            }
        }
        bigFile.close();
    }

    loader->storeLastChunk();
    loader->storeMetadata(numLines);
    loader->DisableSerializer();
}

uint32_t openSerialized(std::vector<std::string> paths, webifc::LoaderSettings settings, uint32_t ramLimit = 200000000)
{
    for (int i(0); i < paths.size(); ++i)
    {
        std::cout << paths[i] << std::endl;
    }
    uint32_t modelID = CreateModel(settings);

    loaders[modelID]->ActivateSerializer(ramLimit);
    loaders[modelID]->SetBinPaths(paths);
    uint32_t numLines = loaders[modelID]->loadMetadata();

    std::cout << "Metdata loaded..." << std::endl;
    // Continue opening
    loaders[modelID]->LoadSerializedFileData(numLines);

    std::cout << "Context data loaded..." << std::endl;

    // Ensure IsOpen will return true upon successful load.
    loaders[modelID]->SetOpen();

    //testing if it is able to read geometry//

    // std::cout << "Loading geometry..." << std::endl;

    // std::vector<webifc::IfcFlatMesh> meshes;

    // for (auto type : ifc::IfcElements)
    // {
    //     auto elements = loaders[modelID]->GetExpressIDsWithType(type);

    //     for (int i = 0; i < elements.size(); i++)
    //     {
    //         auto mesh = geomLoaders[modelID]->GetFlatMesh(elements[i]);
    //         meshes.push_back(mesh);
    //     }
    // }

    //End testing//

    loaders[modelID]->DisableSerializer();

    std::cout << "Serialized files successfully loaded" << std::endl;

    return modelID;
}

void CloseModel(uint32_t modelID)
{
    geomLoaders.erase(modelID);
    loaders[modelID]->SetClosed();
    loaders.erase(modelID);
}

webifc::IfcFlatMesh GetFlatMesh(uint32_t modelID, uint32_t expressID)
{
    auto& geomLoader = geomLoaders[modelID];

    if (!geomLoader)
    {
        return {};
    }

    webifc::IfcFlatMesh mesh = geomLoader->GetFlatMesh(expressID);
    
    for (auto& geom : mesh.geometries)
    {
        auto& flatGeom = geomLoader->GetCachedGeometry(geom.geometryExpressID);
        flatGeom.GetVertexData();
    }

    return mesh;
}

void StreamMeshes(uint32_t modelID, std::vector<uint32_t> expressIds, emscripten::val callback) {
    auto& loader = loaders[modelID];
    auto& geomLoader = geomLoaders[modelID];

    if (!loader || !geomLoader)
    {
        return;
    }

    int index = 0;
    int total = expressIds.size();

    for (const auto& id : expressIds)
    {
        // read the mesh from IFC
        webifc::IfcFlatMesh mesh = geomLoader->GetFlatMesh(id);

        // prepare the geometry data
        for (auto& geom : mesh.geometries)
        {
            auto& flatGeom = geomLoader->GetCachedGeometry(geom.geometryExpressID);
            flatGeom.GetVertexData();
        }   

        if (!mesh.geometries.empty())
        {
            // transfer control to client, geometry data is alive for the time of the callback
            callback(mesh, index, total);
        }

        // clear geometry, freeing memory, client is expected to have consumed the data
        geomLoader->ClearCachedGeometry();

        index++;
    }
}

void StreamAllMeshesWithTypes(uint32_t modelID, const std::vector<uint32_t>& types, emscripten::val callback)
{
    auto& loader = loaders[modelID];

    if (!loader)
    {
        return;
    }

    for (auto& type : types)
    {
        auto elements = loader->GetExpressIDsWithType(type);
        StreamMeshes(modelID, elements, callback);
    }
}

void StreamAllMeshesWithTypesVal(uint32_t modelID, emscripten::val typesVal, emscripten::val callback)
{
    std::vector<uint32_t> types;

    uint32_t size = typesVal["length"].as<uint32_t>();
    int index = 0;
    while (index < size)
    {
        emscripten::val typeVal = typesVal[std::to_string(index++)];

        uint32_t type = typeVal.as<uint32_t>();

        types.push_back(type);
    }
    
    StreamAllMeshesWithTypes(modelID, types, callback);
}

void StreamAllMeshes(uint32_t modelID, emscripten::val callback) {
    auto& loader = loaders[modelID];
    auto& geomLoader = geomLoaders[modelID];

    if (!loader || !geomLoader)
    {
        return;
    }

    std::vector<uint32_t> types;

    for (auto& type : ifc::IfcElements)
    {
        if (type == ifc::IFCOPENINGELEMENT || type == ifc::IFCSPACE || type == ifc::IFCOPENINGSTANDARDCASE)
        {
            continue;
        }

        types.push_back(type);
    }

    StreamAllMeshesWithTypes(modelID, types, callback);
}

std::vector<webifc::IfcFlatMesh> LoadAllGeometry(uint32_t modelID)
{
    auto& loader = loaders[modelID];
    auto& geomLoader = geomLoaders[modelID];

    if (!loader || !geomLoader)
    {
        return {};
    }

    std::vector<webifc::IfcFlatMesh> meshes;

    for (auto type : ifc::IfcElements)
    {
        auto elements = loader->GetExpressIDsWithType(type);

        if (type == ifc::IFCOPENINGELEMENT || type == ifc::IFCSPACE || type == ifc::IFCOPENINGSTANDARDCASE)
        {
            continue;
        }

        for (int i = 0; i < elements.size(); i++)
        {
            webifc::IfcFlatMesh mesh = geomLoader->GetFlatMesh(elements[i]);
            for (auto& geom : mesh.geometries)
            {
                auto& flatGeom = geomLoader->GetCachedGeometry(geom.geometryExpressID);
                flatGeom.GetVertexData();
            }   
            meshes.push_back(std::move(mesh));
        }
    }

    return meshes;
}

webifc::IfcGeometry GetGeometry(uint32_t modelID, uint32_t expressID)
{
    auto& geomLoader = geomLoaders[modelID];
    if (!geomLoader)
    {
        return {};
    }

    return geomLoader->GetCachedGeometry(expressID);
}

std::vector<webifc::LoaderError> GetAndClearErrors(uint32_t modelID)
{
    auto& loader = loaders[modelID];

    if (!loader)
    {
        return {};
    }
    
    return loader->GetAndClearErrors();
}

void SetGeometryTransformation(uint32_t modelID, std::array<double, 16> m)
{
    auto& geomLoader = geomLoaders[modelID];
    if (!geomLoader)
    {
        return;
    }

    glm::dmat4 transformation;
    glm::dvec4 v1(m[0], m[1], m[2], m[3]);
    glm::dvec4 v2(m[4], m[5], m[6], m[7]);
    glm::dvec4 v3(m[8], m[9], m[10], m[11]);
    glm::dvec4 v4(m[12], m[13], m[14], m[15]);

    transformation[0] = v1;
    transformation[1] = v2;
    transformation[2] = v3;
    transformation[3] = v4;

    geomLoaders[modelID]->SetTransformation(transformation);
}

std::array<double, 16> GetCoordinationMatrix(uint32_t modelID)
{
    auto& geomLoader = geomLoaders[modelID];
    if (!geomLoader)
    {
        return {};
    }

    return webifc::FlattenTransformation(geomLoader->GetCoordinationMatrix());
}

std::vector<uint32_t> GetLineIDsWithType(uint32_t modelID, emscripten::val types)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return {};
    }

    std::vector<uint32_t> expressIDs;

    uint32_t size = types["length"].as<uint32_t>();
    for (int i=0; i < size; i++) {
    
        uint32_t type = types[std::to_string(i)].as<uint32_t>();
        auto lineIDs = loader->GetLineIDsWithType(type);
        for (auto lineID : lineIDs)
        {
          expressIDs.push_back(loader->LineIDToExpressID(lineID));
        }
    }
    return expressIDs;
}

std::vector<uint32_t> GetInversePropertyForItem(uint32_t modelID, uint32_t expressID, emscripten::val targetTypes, uint32_t position, bool set)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return {};
    }
    std::vector<uint32_t> inverseIDs;
    auto expressIDs = GetLineIDsWithType(modelID,targetTypes);
    for (auto foundExpressID : expressIDs)
    {
      auto lineID = loader->ExpressIDToLineID(foundExpressID); 
      loader->MoveToLineArgument(lineID, position);
      auto& _tape = loader->GetTape();

      webifc::IfcTokenType t = static_cast<webifc::IfcTokenType>(_tape.Read<char>());
      if (t == webifc::IfcTokenType::REF) 
      {
        uint32_t val = _tape.template Read<uint32_t>();
        if (val == expressID)
        {
          inverseIDs.push_back(foundExpressID);
          if (!set) return inverseIDs;
        }
      }
      else if (t == webifc::IfcTokenType::SET_BEGIN)
      {
          while (!_tape.AtEnd())
          {
              webifc::IfcTokenType setValueType = static_cast<webifc::IfcTokenType>(_tape.Read<char>());
              if (setValueType == webifc::IfcTokenType::SET_END) break;
              if (setValueType == webifc::IfcTokenType::REF) 
              {
                uint32_t val = _tape.template Read<uint32_t>();
                if (val == expressID)
                {
                  inverseIDs.push_back(foundExpressID);
                  if (!set) return inverseIDs;
                }
              }
          }
      }
    }
    return inverseIDs;
}

bool ValidateExpressID(uint32_t modelID, uint32_t expressId)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return {};
    }

    return loader->ValidateExpressID(expressId);
}

uint32_t GetNextExpressID(uint32_t modelID, uint32_t expressId)
{
    auto& loader = loaders[modelID];
    if(!loader)
    {
        return {};
    }

    uint32_t currentId = expressId;

    bool cont = true;
    uint32_t maxId = loader->GetMaxExpressId();

    while(cont)
    {
        if(currentId >= maxId)
        {
            cont = false;
            continue;
        }
        currentId++;
        cont = !(loader->ValidateExpressID(currentId));
    }

    return currentId;
}

std::vector<uint32_t> GetAllLines(uint32_t modelID)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return {};
    }

    std::vector<uint32_t> expressIDs;
    auto numLines = loader->GetNumLines();
    for (int i = 0; i < numLines; i++)
    {
        expressIDs.push_back(loader->GetLine(i).expressID);
    }
    return expressIDs;
}

void ExportFileAsIFC(uint32_t modelID)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return;
    }

    std::string exportData = loader->DumpAsIFC();
    WriteFile("export.ifc", exportData);
    webifc::logInfo("Exported to export.ifc");
}

template<uint32_t N>
void WriteValue(webifc::DynamicTape<N>& tape, webifc::IfcTokenType t, emscripten::val value)
{
    switch (t)
    {
    case webifc::IfcTokenType::STRING:
    case webifc::IfcTokenType::ENUM:
    {
        std::string copy = value.as<std::string>();

        uint16_t length = copy.size();
        tape.push2((uint16_t)length);
        tape.push((void*)copy.c_str(), copy.size());

        break;
    }
    case webifc::IfcTokenType::REF:
    {
        uint32_t val = value.as<uint32_t>();
        tape.push(&val, sizeof(uint32_t));

        break;
    }
    case webifc::IfcTokenType::REAL:
    {
        double val = value.as<double>();
        tape.push(&val, sizeof(double));

        break;
    }
    default:
        // use undefined to signal val parse issue
        tape.push('?');
    }
}

void WriteSet(webifc::DynamicTape<TAPE_SIZE>& _tape, emscripten::val& val)
{
    _tape.push(webifc::IfcTokenType::SET_BEGIN);

    uint32_t size = val["length"].as<uint32_t>();
    int index = 0;
    while (true && index < size)
    {
        emscripten::val child = val[std::to_string(index)];
        if (child.isArray())
        {
            WriteSet(_tape, child);
        }
        else if (child.isNull())
        {
            _tape.push(webifc::IfcTokenType::EMPTY);
        }
        else if (child.isUndefined())
        {
            // nothing to do here, possibly mismatch in ifc spec!
            index++;
            continue;
        }
        else if (child["type"].isNumber())
        {
            webifc::IfcTokenType type = static_cast<webifc::IfcTokenType>(child["type"].as<uint32_t>());
            _tape.push(type);
            switch(type)
            {
                case webifc::IfcTokenType::LINE_END:
                case webifc::IfcTokenType::EMPTY:
                case webifc::IfcTokenType::SET_BEGIN:
                case webifc::IfcTokenType::SET_END:
                {
                    // ignore, we should not be seeing this
                    break;
                }
                case webifc::IfcTokenType::UNKNOWN:
                {
                    // ignore, already pushed above, no further data
                    break;
                }
                case webifc::IfcTokenType::LABEL:
                {
                    auto label = child["label"];
                    auto valueType = static_cast<webifc::IfcTokenType>(child["valueType"].as<uint32_t>());
                    auto value = child["value"];

                    std::string copy = label.as<std::string>();

                    uint16_t length = copy.size();
                    _tape.push2((uint16_t)length);
                    _tape.push((void*)copy.c_str(), copy.size());

                    _tape.push(webifc::IfcTokenType::SET_BEGIN);

                    _tape.push(valueType);
                    WriteValue(_tape, valueType, value);

                    _tape.push(webifc::IfcTokenType::SET_END);

                    break;
                }
                case webifc::IfcTokenType::STRING:
                case webifc::IfcTokenType::ENUM:
                case webifc::IfcTokenType::REF:
                case webifc::IfcTokenType::REAL:
                {
                    WriteValue(_tape, type, child["value"]);
                    break;
                }
                default:
                    break;
            }
        }
        else
        {
            webifc::logError("Error in writeline: unknown object received");
        }

        index++;
    }

    _tape.push(webifc::IfcTokenType::SET_END);
}

void WriteLine(uint32_t modelID, uint32_t expressID, uint32_t type, emscripten::val parameters)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return;
    }

    auto& _tape = loader->GetTape();

    _tape.SetWriteAtEnd();

    uint32_t start = _tape.GetTotalSize();

    // line ID
    _tape.push(webifc::IfcTokenType::REF);
    _tape.push(&expressID, sizeof(uint32_t));

    // line TYPE
    const char* ifcName = GetReadableNameFromTypeCode(type);
    _tape.push(webifc::IfcTokenType::LABEL);
    uint16_t length = strlen(ifcName);
    _tape.push2((uint16_t)length);
    _tape.push((void*)ifcName, length);

    WriteSet(_tape, parameters);

    // end line
    _tape.push(webifc::IfcTokenType::LINE_END);

    uint32_t end = _tape.GetTotalSize();

    loader->UpdateLineTape(expressID, type, start, end);
}

template<uint32_t N>
emscripten::val ReadValue(webifc::DynamicTape<N>& tape, webifc::IfcTokenType t)
{
    switch (t)
    {
    case webifc::IfcTokenType::STRING:
    case webifc::IfcTokenType::ENUM:
    {
        webifc::StringView view = tape.ReadStringView();
        std::string copy(view.data, view.len);

        return emscripten::val(copy);
    }
    case webifc::IfcTokenType::REAL:
    {
        double d = tape.template Read<double>();

        return emscripten::val(d);
    }
    case webifc::IfcTokenType::REF:
    {
        uint32_t ref = tape.template Read<uint32_t>();

        return emscripten::val(ref);
    }
    default:
        // use undefined to signal val parse issue
        return emscripten::val::undefined();
    }
}

emscripten::val& GetArgs(const std::unique_ptr<webifc::IfcLoader>& loader, emscripten::val& arguments)
{
    auto& _tape = loader->GetTape();

    std::stack<emscripten::val> valueStack;
    std::stack<int> valuePosition;

    valueStack.push(arguments);
    valuePosition.push(0);

    bool endOfLine = false;
    while (!_tape.AtEnd() && !endOfLine)
    {
        webifc::IfcTokenType t = static_cast<webifc::IfcTokenType>(_tape.Read<char>());

        auto& topValue = valueStack.top();
        auto& topPosition = valuePosition.top();

        switch (t)
        {
        case webifc::IfcTokenType::LINE_END:
        {
            endOfLine = true;
            break;
        }
        case webifc::IfcTokenType::UNKNOWN:
        {
            auto obj = emscripten::val::object(); 
            obj.set("type", emscripten::val(static_cast<uint32_t>(webifc::IfcTokenType::UNKNOWN))); 

            topValue.set(topPosition++, obj);
            
            break;
        }
        case webifc::IfcTokenType::EMPTY:
        {
            topValue.set(topPosition++, emscripten::val::null());
            
            break;
        }
        case webifc::IfcTokenType::SET_BEGIN:
        {
            auto newValue = emscripten::val::array();

            valueStack.push(newValue);
            valuePosition.push(0);

            break;
        }
        case webifc::IfcTokenType::SET_END:
        {
            if (valueStack.size() == 1)
            {
                // this is a pop just before endline, so ignore
                endOfLine = true;
            }
            else
            {
                auto topCopy = valueStack.top();

                valueStack.pop();
                valuePosition.pop();
                auto& parent = valueStack.top();
                int& parentCount = valuePosition.top();
                parent.set(parentCount++, topCopy);
            }

            break;
        }
        case webifc::IfcTokenType::LABEL:
        {
            // read label
            webifc::StringView view = _tape.ReadStringView();
            std::string copy(view.data, view.len);

            auto obj = emscripten::val::object(); 
            obj.set("type", emscripten::val(static_cast<uint32_t>(webifc::IfcTokenType::LABEL)));
            obj.set("label", emscripten::val(copy));

            // read set open
            _tape.Read<char>();
            
            // read value following label
            webifc::IfcTokenType t = static_cast<webifc::IfcTokenType>(_tape.Read<char>());
            obj.set("valueType", emscripten::val(static_cast<uint32_t>(t)));
            obj.set("value", ReadValue(_tape, t));

            // read set close
            _tape.Read<char>();

            topValue.set(topPosition++, obj);

            break;
        }
        case webifc::IfcTokenType::STRING:
        case webifc::IfcTokenType::ENUM:
        case webifc::IfcTokenType::REAL:
        case webifc::IfcTokenType::REF:
        {
            auto obj = emscripten::val::object(); 
            obj.set("type", emscripten::val(static_cast<uint32_t>(t)));
            obj.set("value", ReadValue(_tape, t));

            topValue.set(topPosition++, obj);

            break;
        }
        default:
            break;
        }
    }

    return arguments;
}

emscripten::val GetHeaderLine(uint32_t modelID, uint32_t headerType)
{
    auto& loader = loaders[modelID];
    
    if (!loader)
    {
        return emscripten::val::undefined();
    }

    auto lines = loader->GetHeaderLinesWithType(headerType);

    if(lines.size() <= 0){
        return emscripten::val::undefined(); 
    }
    auto line = lines[0];
    loader->MoveToHeaderArgumentOffset(line, 0);

    auto arguments = emscripten::val::array();

    GetArgs(loader, arguments);

    std::string s(GetReadableNameFromTypeCode(line.ifcType));
    auto retVal = emscripten::val::object();
    retVal.set(emscripten::val("ID"), line.lineIndex);
    retVal.set(emscripten::val("type"), s);
    retVal.set(emscripten::val("arguments"), arguments);

    return retVal;
}

emscripten::val GetLine(uint32_t modelID, uint32_t expressID)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return emscripten::val::undefined();
    }

    auto& line = loader->GetLine(loader->ExpressIDToLineID(expressID));

    loader->MoveToArgumentOffset(line, 0);

    auto arguments = emscripten::val::array();

    GetArgs(loader, arguments);

    auto retVal = emscripten::val::object();
    retVal.set(emscripten::val("ID"), line.expressID);
    retVal.set(emscripten::val("type"), line.ifcType);
    retVal.set(emscripten::val("arguments"), arguments);

    return retVal;
}

uint32_t GetLineType(uint32_t modelID, uint32_t expressID)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return -1;
    }

    auto& line = loader->GetLine(loader->ExpressIDToLineID(expressID));
    return line.ifcType;
}

uint32_t GetMaxExpressID(uint32_t modelID)
{
    auto &loader = loaders[modelID];
    return loader->GetMaxExpressId();
}

uint32_t IncrementMaxExpressID(uint32_t modelID, uint32_t incrementSize)
{
    auto &loader = loaders[modelID];
    return loader->IncreaseMaxExpressId(incrementSize);
}

extern "C" bool IsModelOpen(uint32_t modelID)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return false;
    }

    return loader->IsOpen();
}

// TODO(pablo): the level param ought to be LogLevel, but I couldn't
// get the value passing from typescript correctly.  The levels are
// kept in sync with src/web-ifc-api.ts

/**
 * Sets the global log level.
 * @data levelArg Will be clamped between DEBUG and OFF.
 */
void SetLogLevel(int levelArg)
{
    if (levelArg < static_cast<int>(webifc::LogLevel::DEBUG)) {
        webifc::LOG_LEVEL = webifc::LogLevel::DEBUG;
    } else if (levelArg > static_cast<int>(webifc::LogLevel::OFF)) {
        webifc::LOG_LEVEL = webifc::LogLevel::OFF;
    } else {
        webifc::LOG_LEVEL = static_cast<webifc::LogLevel>(levelArg);
    }
}

EMSCRIPTEN_BINDINGS(my_module) {

    emscripten::class_<webifc::IfcGeometry>("IfcGeometry")
        .constructor<>()
        .function("GetVertexData", &webifc::IfcGeometry::GetVertexData)
        .function("GetVertexDataSize", &webifc::IfcGeometry::GetVertexDataSize)
        .function("GetIndexData", &webifc::IfcGeometry::GetIndexData)
        .function("GetIndexDataSize", &webifc::IfcGeometry::GetIndexDataSize)
        ;


    emscripten::value_object<glm::dvec4>("dvec4")
        .field("x", &glm::dvec4::x)
        .field("y", &glm::dvec4::y)
        .field("z", &glm::dvec4::z)
        .field("w", &glm::dvec4::w)
        ;


    emscripten::value_object<webifc::LoaderSettings>("LoaderSettings")
        .field("COORDINATE_TO_ORIGIN", &webifc::LoaderSettings::COORDINATE_TO_ORIGIN)
        .field("USE_FAST_BOOLS", &webifc::LoaderSettings::USE_FAST_BOOLS)
        .field("CIRCLE_SEGMENTS_LOW", &webifc::LoaderSettings::CIRCLE_SEGMENTS_LOW)
        .field("CIRCLE_SEGMENTS_MEDIUM", &webifc::LoaderSettings::CIRCLE_SEGMENTS_MEDIUM)
        .field("CIRCLE_SEGMENTS_HIGH", &webifc::LoaderSettings::CIRCLE_SEGMENTS_HIGH)
        .field("BOOL_ABORT_THRESHOLD", &webifc::LoaderSettings::BOOL_ABORT_THRESHOLD)
        ;

    emscripten::value_array<std::array<double, 16>>("array_double_16")
            .element(emscripten::index<0>())
            .element(emscripten::index<1>())
            .element(emscripten::index<2>())
            .element(emscripten::index<3>())
            .element(emscripten::index<4>())
            .element(emscripten::index<5>())
            .element(emscripten::index<6>())
            .element(emscripten::index<7>())
            .element(emscripten::index<8>())
            .element(emscripten::index<9>())
            .element(emscripten::index<10>())
            .element(emscripten::index<11>())
            .element(emscripten::index<12>())
            .element(emscripten::index<13>())
            .element(emscripten::index<14>())
            .element(emscripten::index<15>())
            ;

    emscripten::value_object<webifc::IfcPlacedGeometry>("IfcPlacedGeometry")
        .field("color", &webifc::IfcPlacedGeometry::color)
        .field("flatTransformation", &webifc::IfcPlacedGeometry::flatTransformation)
        .field("geometryExpressID", &webifc::IfcPlacedGeometry::geometryExpressID)
        ;

    emscripten::enum_<webifc::LogLevel>("LogLevel")
        .value("DEBUG", webifc::LogLevel::DEBUG)
        .value("INFO", webifc::LogLevel::INFO)
        .value("WARN", webifc::LogLevel::WARN)
        .value("ERROR", webifc::LogLevel::ERROR)
        .value("OFF", webifc::LogLevel::OFF)
        ;

    emscripten::enum_<webifc::LoaderErrorType>("LoaderErrorType")
        .value("BOOL_ERROR", webifc::LoaderErrorType::BOOL_ERROR)
        .value("PARSING", webifc::LoaderErrorType::PARSING)
        .value("UNSPECIFIED", webifc::LoaderErrorType::UNSPECIFIED)
        .value("UNSUPPORTED_TYPE", webifc::LoaderErrorType::UNSUPPORTED_TYPE)
        ;

    emscripten::value_object<webifc::LoaderError>("LoaderError")
        .field("type", &webifc::LoaderError::type)
        .field("message", &webifc::LoaderError::message)
        .field("expressID", &webifc::LoaderError::expressID)
        .field("ifcType", &webifc::LoaderError::ifcType)
        ;

    emscripten::register_vector<std::string>("stringVector");

    emscripten::register_vector<webifc::LoaderError>("LoaderErrorVector");

    emscripten::register_vector<webifc::IfcPlacedGeometry>("IfcPlacedGeometryVector");

    emscripten::value_object<webifc::IfcFlatMesh>("IfcFlatMesh")
        .field("geometries", &webifc::IfcFlatMesh::geometries)
        .field("expressID", &webifc::IfcFlatMesh::expressID)
        ;

    emscripten::register_vector<webifc::IfcFlatMesh>("IfcFlatMeshVector");
    emscripten::register_vector<uint32_t>("UintVector");

    emscripten::function("LoadAllGeometry", &LoadAllGeometry);
    emscripten::function("Serialize", &serialize);
    emscripten::function("OpenSerialized", &openSerialized);
    emscripten::function("OpenModel", &OpenModel);
    emscripten::function("CreateModel", &CreateModel);
    emscripten::function("GetMaxExpressID", &GetMaxExpressID);
    emscripten::function("IncrementMaxExpressID", &IncrementMaxExpressID);
    emscripten::function("CloseModel", &CloseModel);
    emscripten::function("IsModelOpen", &IsModelOpen);
    emscripten::function("GetGeometry", &GetGeometry);
    emscripten::function("GetFlatMesh", &GetFlatMesh);
    emscripten::function("StreamMeshes", &StreamMeshes);
    emscripten::function("GetCoordinationMatrix", &GetCoordinationMatrix);
    emscripten::function("StreamAllMeshes", &StreamAllMeshes);
    emscripten::function("StreamAllMeshesWithTypes", &StreamAllMeshesWithTypesVal);
    emscripten::function("GetAndClearErrors", &GetAndClearErrors);
    emscripten::function("GetLine", &GetLine);
    emscripten::function("GetLineType", &GetLineType);
    emscripten::function("GetHeaderLine", &GetHeaderLine);
    emscripten::function("WriteLine", &WriteLine);
    emscripten::function("ExportFileAsIFC", &ExportFileAsIFC);
    emscripten::function("ValidateExpressID", &ValidateExpressID);
    emscripten::function("GetNextExpressID", &GetNextExpressID);
    emscripten::function("GetLineIDsWithType", &GetLineIDsWithType);
    emscripten::function("GetInversePropertyForItem", &GetInversePropertyForItem);
    emscripten::function("GetAllLines", &GetAllLines);
    emscripten::function("SetGeometryTransformation", &SetGeometryTransformation);
    emscripten::function("SetLogLevel", &SetLogLevel);
}
