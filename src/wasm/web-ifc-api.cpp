/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#include <string>
#include <stack>
#include <memory>

#include <emscripten/bind.h>

#include "parsing/IfcLoader.h"
#include "utility/Logging.h"
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

int OpenModel(webifc::LoaderSettings settings, emscripten::val callback)
{
    if (!shown_version_header)
    {
        webifc::log::info("web-ifc: " + WEB_IFC_VERSION_NUMBER +
                        " threading: " + (MT_ENABLED ? "enabled" : "disabled"));
        shown_version_header = true;
    }

    uint32_t modelID = GLOBAL_MODEL_ID_COUNTER++;

    auto loader = std::make_unique<webifc::IfcLoader>(settings);
    loaders.emplace(modelID, std::move(loader));

    loaders[modelID]->LoadFile([&](char* dest, size_t sourceOffset, size_t destSize)
                    {
                        emscripten::val retVal = callback((uint32_t)dest,sourceOffset, destSize);
                        uint32_t len = retVal.as<uint32_t>();
                        return len;
                    });


    auto geomLoader = std::make_unique<webifc::IfcGeometryLoader>(*loaders[modelID]);
    geomLoaders.emplace(modelID, std::move(geomLoader));
    return modelID;
}

void SaveModel(uint32_t modelID, emscripten::val callback)
{
    loaders[modelID]->SaveFile([&](char* src, size_t srcSize)
        {
            emscripten::val retVal = callback((uint32_t)src, srcSize);
        }
    );
}

int GetModelSize(uint32_t modelID)
{
    return loaders[modelID]->GetTotalSize();
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
    uint32_t index = 0;
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

        for (uint32_t i = 0; i < elements.size(); i++)
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

std::vector<webifc::IfcAlignment> GetAllAlignments(uint32_t modelID)
{
    auto &loader = loaders[modelID];
    auto &geomLoader = geomLoaders[modelID];

    if (!loader || !geomLoader)
    {
        return {};
    }

    auto type = ifc::IFCALIGNMENT;

    auto elements = loader->GetExpressIDsWithType(type);

    std::vector<webifc::IfcAlignment> alignments;

    for (int i = 0; i < elements.size(); i++)
    {
        webifc::IfcAlignment alignment = geomLoader->GetAlignment(elements[i]);
        alignment.transform(geomLoader->GetCoordinationMatrix());
        alignments.push_back(alignment);
    }

    return alignments;
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
    for (uint32_t i=0; i < size; i++) {
    
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

      webifc::IfcTokenType t = loader->GetTokenType();
      if (t == webifc::IfcTokenType::REF) 
      {
        loader->StepBack();
        uint32_t val = loader->GetRefArgument();
        if (val == expressID)
        {
          inverseIDs.push_back(foundExpressID);
          if (!set) return inverseIDs;
        }
      }
      else if (t == webifc::IfcTokenType::SET_BEGIN)
      {
          while (!loader->IsAtEnd())
          {
              webifc::IfcTokenType setValueType = loader->GetTokenType();
              if (setValueType == webifc::IfcTokenType::SET_END) break;
              if (setValueType == webifc::IfcTokenType::REF) 
              {
                loader->StepBack();
                uint32_t val = loader->GetRefArgument();
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

    return loader->IsValidExpressID(expressId);
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
        if(currentId > maxId)
        {
            cont = false;
            continue;
        }
        currentId++;
        cont = !(loader->IsValidExpressID(currentId));
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
    for (uint32_t i = 0; i < numLines; i++)
    {
        expressIDs.push_back(loader->GetLine(i).expressID);
    }
    return expressIDs;
}

void WriteValue(uint32_t modelID, webifc::IfcTokenType t, emscripten::val value)
{
    auto& loader = loaders[modelID];
    switch (t)
    {
    case webifc::IfcTokenType::STRING:
    case webifc::IfcTokenType::ENUM:
    {
        std::string copy = value.as<std::string>();

        uint16_t length = copy.size();
        loader->Push<uint16_t>((uint16_t)length);
        loader->Push((void*)copy.c_str(), copy.size());

        break;
    }
    case webifc::IfcTokenType::REF:
    {
        uint32_t val = value.as<uint32_t>();
        loader->Push<uint32_t>(val);

        break;
    }
    case webifc::IfcTokenType::REAL:
    {
        double val = value.as<double>();
        loader->Push<double>(val);

        break;
    }
    default:
        // use undefined to signal val parse issue
        loader->Push<uint8_t>('?');
    }
}

void WriteSet(uint32_t modelID, emscripten::val& val)
{
    auto& loader = loaders[modelID];
    loader->Push<uint8_t>(webifc::IfcTokenType::SET_BEGIN);

    uint32_t size = val["length"].as<uint32_t>();
    for (size_t i=0; i < size;i++) 
    {
        emscripten::val child = val[std::to_string(i)];
        if (child.isNull()) loader->Push<uint8_t>(webifc::IfcTokenType::EMPTY);
        else if (child.isUndefined()) continue;
        else if (child.isArray()) WriteSet(modelID,child);
        else if (child["type"].isNumber())
        {
            webifc::IfcTokenType type = static_cast<webifc::IfcTokenType>(child["type"].as<uint32_t>());
            loader->Push(type);
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
                    loader->Push<uint16_t>((uint16_t)length);
                    loader->Push((void*)copy.c_str(), copy.size());

                    loader->Push<uint8_t>(webifc::IfcTokenType::SET_BEGIN);

                    loader->Push<uint8_t>(valueType);
                    WriteValue(modelID,valueType, value);

                    loader->Push<uint8_t>(webifc::IfcTokenType::SET_END);

                    break;
                }
                case webifc::IfcTokenType::STRING:
                case webifc::IfcTokenType::ENUM:
                case webifc::IfcTokenType::REF:
                case webifc::IfcTokenType::REAL:
                {
                    WriteValue(modelID,type, child["value"]);
                    break;
                }
                default:
                    break;
            }
        }
        else
        {
            webifc::log::error("Error in writeline: unknown object received");
        }
    }

    loader->Push<uint8_t>(webifc::IfcTokenType::SET_END);
}


std::string GetNameFromTypeCode(uint32_t type) 
{
    return GetReadableNameFromTypeCode(type);
}

uint32_t GetTypeCodeFromName(uint32_t modelID,std::string typeName) 
{
    auto& loader = loaders[modelID];
    if (!loader) return 0;
    return loader->IfcTypeToTypeCode(typeName);
}

bool IsIfcElement(uint32_t type) 
{
    return ifc::IfcElements.find(type) != ifc::IfcElements.end();
}

void WriteHeaderLine(uint32_t modelID,uint32_t type, emscripten::val parameters)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return;
    }
    uint32_t start = loader->GetTotalSize();
    std::string ifcName = GetReadableNameFromTypeCode(type);
    loader->Push<uint8_t>(webifc::IfcTokenType::LABEL);
    loader->Push<uint16_t>((uint16_t)ifcName.size());
    loader->Push((void*)ifcName.c_str(), ifcName.size());
    WriteSet(modelID,parameters);
    loader->Push<uint8_t>(webifc::IfcTokenType::LINE_END);
    uint32_t end = loader->GetTotalSize();
    loader->AddHeaderLineTape(type, start, end);
}

void WriteLine(uint32_t modelID, uint32_t expressID, uint32_t type, emscripten::val parameters)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return;
    }
    uint32_t start = loader->GetTotalSize();

    // line ID
    loader->Push<uint8_t>(webifc::IfcTokenType::REF);
    loader->Push<uint32_t>(expressID);

    // line TYPE
    std::string ifcName = GetReadableNameFromTypeCode(type);
    loader->Push<uint8_t>(webifc::IfcTokenType::LABEL);
    loader->Push<uint16_t>((uint16_t)ifcName.size());
    loader->Push((void*)ifcName.c_str(), ifcName.size());
     WriteSet(modelID,parameters);
    // end line
    loader->Push<uint8_t>(webifc::IfcTokenType::LINE_END);

    uint32_t end = loader->GetTotalSize();

    loader->UpdateLineTape(expressID, type, start, end);
}


emscripten::val ReadValue(uint32_t modelID, webifc::IfcTokenType t)
{
    auto& loader = loaders[modelID];
    switch (t)
    {
    case webifc::IfcTokenType::STRING:
    case webifc::IfcTokenType::ENUM:
    {
        std::string s = loader->GetStringArgument();
        return emscripten::val(s);
    }
    case webifc::IfcTokenType::REAL:
    {
        double d = loader->GetDoubleArgument();
        return emscripten::val(std::to_string(d));
    }
    case webifc::IfcTokenType::REF:
    {
        uint32_t ref = loader->GetRefArgument();
        return emscripten::val(ref);
    }
    default:
        // use undefined to signal val parse issue
        return emscripten::val::undefined();
    }
}

emscripten::val& GetArgs(uint32_t modelID, emscripten::val& arguments)
{
    auto& loader = loaders[modelID];
    std::stack<emscripten::val> valueStack;
    std::stack<int> valuePosition;

    valueStack.push(arguments);
    valuePosition.push(0);

    bool endOfLine = false;
    while (!loader->IsAtEnd() && !endOfLine)
    {
        webifc::IfcTokenType t = loader->GetTokenType();

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
            auto obj = emscripten::val::object(); 
            obj.set("type", emscripten::val(static_cast<uint32_t>(webifc::IfcTokenType::LABEL)));
            loader->StepBack();
            auto s=loader->GetStringArgument();
            auto typeCode = loader->IfcTypeToTypeCode(s);
            obj.set("typecode", emscripten::val(typeCode));
            // read set open
            loader->GetTokenType();
            
            // read value following label
            webifc::IfcTokenType t = loader->GetTokenType();
            loader->StepBack();
            obj.set("value", ReadValue(modelID,t));

            // read set close
            loader->GetTokenType();

            topValue.set(topPosition++, obj);

            break;
        }
        case webifc::IfcTokenType::STRING:
        case webifc::IfcTokenType::ENUM:
        case webifc::IfcTokenType::REAL:
        case webifc::IfcTokenType::REF:
        {
            
            auto obj = emscripten::val::object(); 
            loader->StepBack();
            obj.set("type", emscripten::val(static_cast<uint32_t>(t)));
            obj.set("value", ReadValue(modelID,t));

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
    loader->MoveToHeaderLineArgument(line.lineIndex, 0);

    auto arguments = emscripten::val::array();
    std::string s(GetReadableNameFromTypeCode(line.ifcType));
    GetArgs(modelID, arguments);
    auto retVal = emscripten::val::object();
    retVal.set("ID", line.lineIndex);
    retVal.set("type", s);
    retVal.set("arguments", arguments);
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

    GetArgs(modelID, arguments);

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
    webifc::setLogLevel(levelArg);
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
        .field("TAPE_SIZE", &webifc::LoaderSettings::TAPE_SIZE)
        .field("MEMORY_LIMIT", &webifc::LoaderSettings::MEMORY_LIMIT)
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
        .value("DEBUG", webifc::LogLevel::LOG_LEVEL_DEBUG)
        .value("INFO", webifc::LogLevel::LOG_LEVEL_INFO)
        .value("WARN", webifc::LogLevel::LOG_LEVEL_WARN)
        .value("ERROR", webifc::LogLevel::LOG_LEVEL_ERROR)
        .value("OFF", webifc::LogLevel::LOG_LEVEL_OFF)
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

    emscripten::register_vector<webifc::IfcAlignment>("IfcAlignmentVector");

    emscripten::value_object<webifc::IfcAlignment>("IfcAlignment")
        .field("Horizontal", &webifc::IfcAlignment::Horizontal)
        .field("Vertical", &webifc::IfcAlignment::Vertical);

    emscripten::value_object<glm::dvec3>("glmDvec3")
        .field("x", &glm::dvec3::x)
        .field("y", &glm::dvec3::y)
        .field("z", &glm::dvec3::z);

    emscripten::value_object<webifc::IfcAlignmentSegment>("IfcAlignmentSegment")
        .field("curves", &webifc::IfcAlignmentSegment::curves);

    emscripten::register_vector<webifc::IfcCurve<2>>("IfcCurve<2>Vector");

    emscripten::value_object<webifc::IfcCurve<2>>("IfcCurve<2>")
        .field("points", &webifc::IfcCurve<2>::points);

    emscripten::register_vector<glm::vec<2, glm::f64>>("vector2doubleVector");

    emscripten::value_object<glm::vec<2, glm::f64>>("vector2double")
        .field("x", &glm::vec<2, glm::f64>::x)
        .field("y", &glm::vec<2, glm::f64>::y);

    emscripten::register_vector<double>("DoubleVector");

    emscripten::function("LoadAllGeometry", &LoadAllGeometry);
    emscripten::function("GetAllAlignments", &GetAllAlignments);
    emscripten::function("OpenModel", &OpenModel);
    emscripten::function("CreateModel", &CreateModel);
    emscripten::function("GetMaxExpressID", &GetMaxExpressID);
    emscripten::function("CloseModel", &CloseModel);
    emscripten::function("GetModelSize", &GetModelSize);
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
    emscripten::function("WriteHeaderLine", &WriteHeaderLine);
    emscripten::function("SaveModel", &SaveModel);
    emscripten::function("ValidateExpressID", &ValidateExpressID);
    emscripten::function("GetNextExpressID", &GetNextExpressID);
    emscripten::function("GetLineIDsWithType", &GetLineIDsWithType);
    emscripten::function("GetInversePropertyForItem", &GetInversePropertyForItem);
    emscripten::function("GetAllLines", &GetAllLines);
    emscripten::function("SetGeometryTransformation", &SetGeometryTransformation);
    emscripten::function("SetLogLevel", &SetLogLevel);
    emscripten::function("GetNameFromTypeCode", &GetNameFromTypeCode);
    emscripten::function("GetTypeCodeFromName", &GetTypeCodeFromName);
    emscripten::function("IsIfcElement", &IsIfcElement);
}
