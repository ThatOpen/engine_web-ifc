/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#include <string>
#include <vector>
#include <stack>
#include <sstream>
#include <memory>

#include <emscripten/bind.h>

#include "parsing/IfcLoader.h"
#include "schema/IfcSchemaManager.h"
#include "utility/LoaderSettings.h"
#include "utility/Logging.h"
#include "geometry/IfcGeometryProcessor.h"

#include "version.h"


struct ModelInfo
{
    public:
        ModelInfo(webifc::utility::LoaderSettings _settings, webifc::schema::IfcSchemaManager &_schemaManager) : schemaManager(_schemaManager), settings(_settings)
        {
            errorHandler = new webifc::utility::LoaderErrorHandler();
            loader = new webifc::parsing::IfcLoader(_settings.TAPE_SIZE,_settings.MEMORY_LIMIT,*errorHandler,schemaManager);
        }
        
        webifc::geometry::IfcGeometryProcessor * GetGeometryLoader()
        {
            if (geometryLoader==nullptr)
            {
                geometryLoader = new webifc::geometry::IfcGeometryProcessor(*loader, *errorHandler,schemaManager,settings.CIRCLE_SEGMENTS,settings.COORDINATE_TO_ORIGIN, settings.OPTIMIZE_PROFILES);
            }
            return geometryLoader;
        }
        
        webifc::utility::LoaderErrorHandler * GetErrorHanlder()
        {
            return errorHandler;
        }
        
        webifc::parsing::IfcLoader * GetLoader()
        {
            return loader;
        }

        void Close()
        {
            delete geometryLoader;
            geometryLoader=nullptr;
            delete loader;
            loader=nullptr;
        }

    private:
        webifc::schema::IfcSchemaManager &schemaManager;
        webifc::utility::LoaderSettings settings;
        webifc::parsing::IfcLoader * loader=nullptr;
        webifc::geometry::IfcGeometryProcessor * geometryLoader=nullptr;
        webifc::utility::LoaderErrorHandler * errorHandler=nullptr;
};

std::vector<ModelInfo> models;
webifc::schema::IfcSchemaManager schemaManager;

#ifdef __EMSCRIPTEN_PTHREADS__
    constexpr bool MT_ENABLED = true;
#else
    constexpr bool MT_ENABLED = false;
#endif

bool shown_version_header = false;

int CreateModel(webifc::utility::LoaderSettings settings)
{
    if (!shown_version_header)
    {
        std::stringstream str;
        str << "web-ifc: "<< WEB_IFC_VERSION_NUMBER << " threading: " << (MT_ENABLED ? "enabled" : "disabled");
        str << " schemas available [";
        for (auto schema : schemaManager.GetAvailableSchemas())  str << schemaManager.GetSchemaName(schema)<<",";
        str << "]";
        webifc::utility::log::info(str.str());
        shown_version_header = true;
    }

    models.emplace_back(settings,schemaManager);
    return models.size()-1;
}

int OpenModel(webifc::utility::LoaderSettings settings, emscripten::val callback)
{
    auto modelID = CreateModel(settings);
    const std::function<uint32_t(char *, size_t, size_t)> loaderFunc= [callback](char* dest, size_t sourceOffset, size_t destSize) {    
        emscripten::val retVal = callback((uint32_t)dest,sourceOffset, destSize);
        uint32_t len = retVal.as<uint32_t>();
        return len;
    };
    
    models[modelID].GetLoader()->LoadFile(loaderFunc);

    return modelID;
}

void SaveModel(uint32_t modelID, emscripten::val callback)
{
    models[modelID].GetLoader()->SaveFile([&](char* src, size_t srcSize)
        {
            emscripten::val retVal = callback((uint32_t)src, srcSize);
        }
    );
}

int GetModelSize(uint32_t modelID)
{
    return models[modelID].GetLoader()->GetTotalSize();
}

void CloseModel(uint32_t modelID)
{
    models[modelID].Close();
}

webifc::geometry::IfcFlatMesh GetFlatMesh(uint32_t modelID, uint32_t expressID)
{
    auto geomLoader = models[modelID].GetGeometryLoader();

    if (!geomLoader)
    {
        return {};
    }

    webifc::geometry::IfcFlatMesh mesh = geomLoader->GetFlatMesh(expressID);
    
    for (auto& geom : mesh.geometries)
    {
        auto& flatGeom = geomLoader->GetGeometry(geom.geometryExpressID);
        flatGeom.GetVertexData();
    }

    return mesh;
}

void StreamMeshes(uint32_t modelID, const std::vector<uint32_t> & expressIds, emscripten::val callback) {
    auto loader = models[modelID].GetLoader();
    auto geomLoader = models[modelID].GetGeometryLoader();

    if (!loader || !geomLoader)
    {
        return;
    }

    int index = 0;
    int total = expressIds.size();

    for (const auto& id : expressIds)
    {
        // read the mesh from IFC
        webifc::geometry::IfcFlatMesh mesh = geomLoader->GetFlatMesh(id);

        // prepare the geometry data
        for (auto& geom : mesh.geometries)
        {
            auto& flatGeom = geomLoader->GetGeometry(geom.geometryExpressID);
            flatGeom.GetVertexData();
        }   

        if (!mesh.geometries.empty())
        {
            // transfer control to client, geometry data is alive for the time of the callback
            callback(mesh, index, total);
        }

        // clear geometry, freeing memory, client is expected to have consumed the data
        geomLoader->Clear();

        index++;
    }
}

void StreamMeshesWithExpressID(uint32_t modelID, emscripten::val expressIdsVal, emscripten::val callback)
{
    std::vector<uint32_t> expressIds;

    uint32_t size = expressIdsVal["length"].as<uint32_t>();
    uint32_t index = 0;
    for (size_t i=0; i < size; i++) 
    {
        emscripten::val expressIdVal = expressIdsVal[std::to_string(i)];

        uint32_t expressId = expressIdVal.as<uint32_t>();

        expressIds.push_back(expressId);
    }
    
    StreamMeshes(modelID, expressIds, callback);
}

void StreamAllMeshesWithTypes(uint32_t modelID, const std::vector<uint32_t>& types, emscripten::val callback)
{
    auto loader = models[modelID].GetLoader();

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
    auto loader = models[modelID].GetLoader();
    auto geomLoader = models[modelID].GetGeometryLoader();

    if (!loader || !geomLoader)
    {
        return;
    }

    std::vector<uint32_t> types;

    for (auto& type : schemaManager.GetIfcElementList())
    {
        if (type == webifc::schema::IFCOPENINGELEMENT || type == webifc::schema::IFCSPACE || type == webifc::schema::IFCOPENINGSTANDARDCASE)
        {
            continue;
        }

        types.push_back(type);
    }

    StreamAllMeshesWithTypes(modelID, types, callback);
}

std::vector<webifc::geometry::IfcFlatMesh> LoadAllGeometry(uint32_t modelID)
{
    auto loader = models[modelID].GetLoader();
    auto geomLoader = models[modelID].GetGeometryLoader();

    if (!loader || !geomLoader)
    {
        return {};
    }

    std::vector<webifc::geometry::IfcFlatMesh> meshes;

    for (auto type : schemaManager.GetIfcElementList())
    {
        auto elements = loader->GetExpressIDsWithType(type);

        if (type == webifc::schema::IFCOPENINGELEMENT || type == webifc::schema::IFCSPACE || type == webifc::schema::IFCOPENINGSTANDARDCASE)
        {
            continue;
        }

        for (uint32_t i = 0; i < elements.size(); i++)
        {
            webifc::geometry::IfcFlatMesh mesh = geomLoader->GetFlatMesh(elements[i]);
            for (auto& geom : mesh.geometries)
            {
                auto& flatGeom = geomLoader->GetGeometry(geom.geometryExpressID);
                flatGeom.GetVertexData();
            }   
            meshes.push_back(std::move(mesh));
        }
    }

    return meshes;
}

webifc::geometry::IfcGeometry GetGeometry(uint32_t modelID, uint32_t expressID)
{
    auto geomLoader = models[modelID].GetGeometryLoader();
    if (!geomLoader)
    {
        return {};
    }

    return geomLoader->GetGeometry(expressID);
}

std::vector<webifc::geometry::IfcAlignment> GetAllAlignments(uint32_t modelID)
{
    auto loader = models[modelID].GetLoader();
    auto geomLoader = models[modelID].GetGeometryLoader();

    if (!loader || !geomLoader)
    {
        return {};
    }

    auto type = webifc::schema::IFCALIGNMENT;

    auto elements = loader->GetExpressIDsWithType(type);

    std::vector<webifc::geometry::IfcAlignment> alignments;

    for (size_t i = 0; i < elements.size(); i++)
    {
        webifc::geometry::IfcAlignment alignment = geomLoader->GetLoader().GetAlignment(elements[i]);
        alignment.transform(geomLoader->GetCoordinationMatrix());
        alignments.push_back(alignment);
    }

    return alignments;
}

std::vector<webifc::utility::LoaderError> GetAndClearErrors(uint32_t modelID)
{
    auto errorHandler = models[modelID].GetErrorHanlder();

    if (!errorHandler)
    {
        return {};
    }
    
    auto errors = errorHandler->GetErrors();
    errorHandler->ClearErrors();
    return errors;
}

void SetGeometryTransformation(uint32_t modelID, std::array<double, 16> m)
{
    auto geomLoader = models[modelID].GetGeometryLoader();
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

    geomLoader->SetTransformation(transformation);
}

std::array<double, 16> FlattenTransformation(const glm::dmat4 &transformation)
{
    std::array<double, 16> flatTransformation;

    for (int i = 0; i < 4; i++)
    {
        for (int j = 0; j < 4; j++)
        {
            flatTransformation[i * 4 + j] = transformation[i][j];
        }
    }

    return flatTransformation;
}

std::array<double, 16> GetCoordinationMatrix(uint32_t modelID)
{
    auto geomLoader = models[modelID].GetGeometryLoader();
    if (!geomLoader)
    {
        return {};
    }

    return FlattenTransformation(geomLoader->GetCoordinationMatrix());
}

std::vector<uint32_t> GetLineIDsWithType(uint32_t modelID, emscripten::val types)
{
    auto loader = models[modelID].GetLoader();
    if (!loader)
    {
        return {};
    }

    std::vector<uint32_t> expressIDs;

    uint32_t size = types["length"].as<uint32_t>();
    for (uint32_t i=0; i < size; i++) {
    
        uint32_t type = types[std::to_string(i)].as<uint32_t>();
        auto ids = loader->GetExpressIDsWithType(type);
        expressIDs.insert(expressIDs.end(),ids.begin(),ids.end());    
    }
    return expressIDs;
}

std::vector<uint32_t> GetInversePropertyForItem(uint32_t modelID, uint32_t expressID, emscripten::val targetTypes, uint32_t position, bool set)
{
    auto loader = models[modelID].GetLoader();
    if (!loader)
    {
        return {};
    }
    std::vector<uint32_t> inverseIDs;
    auto expressIDs = GetLineIDsWithType(modelID,targetTypes);
    for (auto foundExpressID : expressIDs)
    {
      loader->MoveToLineArgument(foundExpressID, position);

      webifc::parsing::IfcTokenType t = loader->GetTokenType();
      if (t == webifc::parsing::IfcTokenType::REF) 
      {
        loader->StepBack();
        uint32_t val = loader->GetRefArgument();
        if (val == expressID)
        {
          inverseIDs.push_back(foundExpressID);
          if (!set) return inverseIDs;
        }
      }
      else if (t == webifc::parsing::IfcTokenType::SET_BEGIN)
      {
          while (!loader->IsAtEnd())
          {
              webifc::parsing::IfcTokenType setValueType = loader->GetTokenType();
              if (setValueType == webifc::parsing::IfcTokenType::SET_END) break;
              if (setValueType == webifc::parsing::IfcTokenType::REF) 
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
    auto loader = models[modelID].GetLoader();
    if (!loader)
    {
        return {};
    }
    return loader->IsValidExpressID(expressId);
}

uint32_t GetNextExpressID(uint32_t modelID, uint32_t expressId)
{
    auto loader = models[modelID].GetLoader();
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
    auto loader = models[modelID].GetLoader();
    if (!loader)
    {
        return {};
    }

    std::vector<uint32_t> expressIDs;
    auto numLines = loader->GetMaxExpressId();
    for (uint32_t i = 1; i <= numLines; i++)
    {
        if (!loader->IsValidExpressID(i) || loader->GetLine(i).ifcType==0) continue;
        expressIDs.push_back(i);
    }
    return expressIDs;
}

bool WriteValue(uint32_t modelID, webifc::parsing::IfcTokenType t, emscripten::val value)
{
    bool responseCode = true;
    auto loader = models[modelID].GetLoader();
    switch (t)
    {
    case webifc::parsing::IfcTokenType::STRING:
    case webifc::parsing::IfcTokenType::ENUM:
    {
        std::string copy = value.as<std::string>();

        uint16_t length = copy.size();
        loader->Push<uint16_t>((uint16_t)length);
        loader->Push((void*)copy.c_str(), copy.size());

        break;
    }
    case webifc::parsing::IfcTokenType::REF:
    {
        uint32_t val = value.as<uint32_t>();
        loader->Push<uint32_t>(val);

        break;
    }
    case webifc::parsing::IfcTokenType::REAL:
    {
        double val = value.as<double>();
        loader->Push<double>(val);

        break;
    }
    default:
        // use undefined to signal val parse issue
        loader->Push<uint8_t>('?');
        responseCode = false;
    }
    return responseCode;
}

bool WriteSet(uint32_t modelID, emscripten::val& val)
{
    bool responseCode = true;
    auto loader = models[modelID].GetLoader();
    loader->Push<uint8_t>(webifc::parsing::IfcTokenType::SET_BEGIN);

    uint32_t size = val["length"].as<uint32_t>();
    for (size_t i=0; i < size;i++) 
    {
        emscripten::val child = val[std::to_string(i)];
        if (child.isNull()) loader->Push<uint8_t>(webifc::parsing::IfcTokenType::EMPTY);
        else if (child.isUndefined()) continue;
        else if (child.isArray()) WriteSet(modelID,child);
        else if (child["value"].isArray())
        {
            emscripten::val innerVal = child["value"];
            loader->Push(webifc::parsing::IfcTokenType::SET_BEGIN);
            uint32_t sz = innerVal["length"].as<uint32_t>();
            for (size_t z=0; z < sz;z++) {
                double value = innerVal[std::to_string(z)].as<double>();
                loader->Push<uint8_t>(webifc::parsing::IfcTokenType::REAL);
                loader->Push<double>(value);
            }
            loader->Push(webifc::parsing::IfcTokenType::SET_END);
        }
        else if (child["type"].isNumber())
        {
            webifc::parsing::IfcTokenType type = static_cast<webifc::parsing::IfcTokenType>(child["type"].as<uint32_t>());
            loader->Push(type);
            switch(type)
            {
                case webifc::parsing::IfcTokenType::LINE_END:
                case webifc::parsing::IfcTokenType::EMPTY:
                case webifc::parsing::IfcTokenType::SET_BEGIN:
                case webifc::parsing::IfcTokenType::SET_END:
                {
                    // ignore, we should not be seeing this
                    break;
                }
                case webifc::parsing::IfcTokenType::UNKNOWN:
                {
                    // ignore, already pushed above, no further data
                    break;
                }
                case webifc::parsing::IfcTokenType::LABEL:
                {
                    auto label = child["label"];
                    auto valueType = static_cast<webifc::parsing::IfcTokenType>(child["valueType"].as<uint32_t>());
                    auto value = child["value"];

                    std::string copy = label.as<std::string>();

                    uint16_t length = copy.size();
                    loader->Push<uint16_t>((uint16_t)length);
                    loader->Push((void*)copy.c_str(), copy.size());

                    loader->Push<uint8_t>(webifc::parsing::IfcTokenType::SET_BEGIN);

                    loader->Push<uint8_t>(valueType);
                    WriteValue(modelID,valueType, value);

                    loader->Push<uint8_t>(webifc::parsing::IfcTokenType::SET_END);

                    break;
                }
                case webifc::parsing::IfcTokenType::STRING:
                case webifc::parsing::IfcTokenType::ENUM:
                case webifc::parsing::IfcTokenType::REF:
                case webifc::parsing::IfcTokenType::REAL:
                {
                    WriteValue(modelID,type, child["value"]);
                    break;
                }
                default:
                    break;
            }
        } 
        else if (child.isNumber() || child.isTrue() || child.isFalse() || child.isString())
        {
            webifc::parsing::IfcTokenType type;
            if (child.isNumber()) type = webifc::parsing::IfcTokenType::REAL;
            else if (child.isString()) type = webifc::parsing::IfcTokenType::STRING;
            else type = webifc::parsing::IfcTokenType::ENUM;
            WriteValue(modelID, type, child);
        }
        else
        {
            webifc::utility::log::error("Error in writeline: unknown object received");
            responseCode = false;
        }
    }

    loader->Push<uint8_t>(webifc::parsing::IfcTokenType::SET_END);
    return responseCode;
}


std::string GetNameFromTypeCode(uint32_t type) 
{
    return schemaManager.IfcTypeCodeToType(type);
}

uint32_t GetTypeCodeFromName(std::string typeName) 
{
    return schemaManager.IfcTypeToTypeCode(typeName);
}

bool IsIfcElement(uint32_t type) 
{
    return schemaManager.IsIfcElement(type);
}

bool WriteHeaderLine(uint32_t modelID,uint32_t type, emscripten::val parameters)
{
    auto loader = models[modelID].GetLoader();
    if (!loader)
    {
        return false;
    }
    uint32_t start = loader->GetTotalSize();
    std::string ifcName = schemaManager.IfcTypeCodeToType(type);
    loader->Push<uint8_t>(webifc::parsing::IfcTokenType::LABEL);
    loader->Push<uint16_t>((uint16_t)ifcName.size());
    loader->Push((void*)ifcName.c_str(), ifcName.size());
    bool responseCode = WriteSet(modelID,parameters);
    loader->Push<uint8_t>(webifc::parsing::IfcTokenType::LINE_END);
    loader->AddHeaderLineTape(type, start);
    return responseCode;
}

void RemoveLine(uint32_t modelID, uint32_t expressID)
{
    auto loader = models[modelID].GetLoader();
    if (!loader) return;
    loader->RemoveLine(expressID);
}

bool WriteLine(uint32_t modelID, uint32_t expressID, uint32_t type, emscripten::val parameters)
{
    auto loader = models[modelID].GetLoader();
    if (!loader)
    {
        return false;
    }
    uint32_t start = loader->GetTotalSize();

    // line ID
    loader->Push<uint8_t>(webifc::parsing::IfcTokenType::REF);
    loader->Push<uint32_t>(expressID);

    // line TYPE
    std::string ifcName = schemaManager.IfcTypeCodeToType(type);
    loader->Push<uint8_t>(webifc::parsing::IfcTokenType::LABEL);
    loader->Push<uint16_t>((uint16_t)ifcName.size());
    loader->Push((void*)ifcName.c_str(), ifcName.size());
    bool responseCode = WriteSet(modelID,parameters);
    // end line
    loader->Push<uint8_t>(webifc::parsing::IfcTokenType::LINE_END);

    loader->UpdateLineTape(expressID, type, start);
    return responseCode;
}


emscripten::val ReadValue(uint32_t modelID, webifc::parsing::IfcTokenType t)
{
    auto loader = models[modelID].GetLoader();
    switch (t)
    {
    case webifc::parsing::IfcTokenType::STRING:
    case webifc::parsing::IfcTokenType::ENUM:
    {
        std::string s = loader->GetStringArgument();
        return emscripten::val(s);
    }
    case webifc::parsing::IfcTokenType::REAL:
    {
        double d = loader->GetDoubleArgument();
        return emscripten::val(std::to_string(d));
    }
    case webifc::parsing::IfcTokenType::REF:
    {
        uint32_t ref = loader->GetRefArgument();
        return emscripten::val(ref);
    }
    default:
        // use undefined to signal val parse issue
        return emscripten::val::undefined();
    }
}

emscripten::val GetArgs(uint32_t modelID, bool inObject=false)
{
    auto loader = models[modelID].GetLoader();
    auto arguments = emscripten::val::array();
    size_t size = 0;
    bool endOfLine = false;
    while (!loader->IsAtEnd() && !endOfLine)
    {
        webifc::parsing::IfcTokenType t = loader->GetTokenType();

        switch (t)
        {
            case webifc::parsing::IfcTokenType::LINE_END:
            {
                endOfLine = true;
                break;
            }
            case webifc::parsing::IfcTokenType::EMPTY:
            {
                arguments.set(size++,emscripten::val::null());
                break;
            }
            case webifc::parsing::IfcTokenType::SET_BEGIN:
            {
                arguments.set(size++,GetArgs(modelID));
                break;
            }
            case webifc::parsing::IfcTokenType::SET_END:
            {
                endOfLine = true;
                break;
            }
            case webifc::parsing::IfcTokenType::LABEL:
            {
                // read label
                auto obj = emscripten::val::object(); 
                obj.set("type", emscripten::val(static_cast<uint32_t>(webifc::parsing::IfcTokenType::LABEL)));
                loader->StepBack();
                auto s=loader->GetStringArgument();
                auto typeCode = schemaManager.IfcTypeToTypeCode(s);
                obj.set("typecode", emscripten::val(typeCode));
                // read set open
                loader->GetTokenType();
                obj.set("value", GetArgs(modelID,true));
                arguments.set(size++, obj);
                break;
            }
            case webifc::parsing::IfcTokenType::STRING:
            case webifc::parsing::IfcTokenType::ENUM:
            case webifc::parsing::IfcTokenType::REAL:
            case webifc::parsing::IfcTokenType::REF:
            {
                loader->StepBack();
                emscripten::val obj;
                if (inObject) obj = ReadValue(modelID,t);
                else {
                    obj = emscripten::val::object(); 
                    obj.set("type", emscripten::val(static_cast<uint32_t>(t)));
                    obj.set("value", ReadValue(modelID,t));
                }
                arguments.set(size++, obj);
                break;
            }
            default:
                break;
        }
    }
    if (size == 0) return emscripten::val::null();
    if (size == 1 && inObject) return arguments[0];
    return arguments;
}

emscripten::val GetHeaderLine(uint32_t modelID, uint32_t headerType)
{
    auto loader = models[modelID].GetLoader();
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

    std::string s(schemaManager.IfcTypeCodeToType(line.ifcType));
    auto arguments = GetArgs(modelID);
    auto retVal = emscripten::val::object();
    retVal.set("ID", line.lineIndex);
    retVal.set("type", s);
    retVal.set("arguments", arguments);
    return retVal;
}

emscripten::val GetLine(uint32_t modelID, uint32_t expressID)
{
    auto loader = models[modelID].GetLoader();
    if (!loader)
    {
        return emscripten::val::undefined();
    }

    if (!loader->IsValidExpressID(expressID)) return emscripten::val::object();
    auto& line = loader->GetLine(expressID);
    if (line.ifcType==0) return emscripten::val::object();

    loader->MoveToArgumentOffset(line, 0);

    auto arguments = GetArgs(modelID);

    auto retVal = emscripten::val::object();
    retVal.set(emscripten::val("ID"), expressID);
    retVal.set(emscripten::val("type"), line.ifcType);
    retVal.set(emscripten::val("arguments"), arguments);
    return retVal;
}

uint32_t GetLineType(uint32_t modelID, uint32_t expressID)
{
    auto loader = models[modelID].GetLoader();
    if (!loader)
    {
        return 0;
    }
    if (!loader->IsValidExpressID(expressID)) return 0;

    auto& line = loader->GetLine(expressID);
    return line.ifcType;
}

std::string GetVersion() 
{
    return WEB_IFC_VERSION_NUMBER;
}

uint32_t GetMaxExpressID(uint32_t modelID)
{
    auto loader = models[modelID].GetLoader();
    return loader->GetMaxExpressId();
}

extern "C" bool IsModelOpen(uint32_t modelID)
{
    if (modelID >= models.size()) return false;
    auto loader = models[modelID].GetLoader();
    if (!loader)
    {
        return false;
    }

    return true;
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
    webifc::utility::setLogLevel(levelArg);
}

EMSCRIPTEN_BINDINGS(my_module) {

    emscripten::class_<webifc::geometry::IfcGeometry>("IfcGeometry")
        .constructor<>()
        .function("GetVertexData", &webifc::geometry::IfcGeometry::GetVertexData)
        .function("GetVertexDataSize", &webifc::geometry::IfcGeometry::GetVertexDataSize)
        .function("GetIndexData", &webifc::geometry::IfcGeometry::GetIndexData)
        .function("GetIndexDataSize", &webifc::geometry::IfcGeometry::GetIndexDataSize)
        ;


    emscripten::value_object<glm::dvec4>("dvec4")
        .field("x", &glm::dvec4::x)
        .field("y", &glm::dvec4::y)
        .field("z", &glm::dvec4::z)
        .field("w", &glm::dvec4::w)
        ;

    emscripten::value_object<webifc::utility::LoaderSettings>("LoaderSettings")
        .field("OPTIMIZE_PROFILES", &webifc::utility::LoaderSettings::OPTIMIZE_PROFILES)
        .field("COORDINATE_TO_ORIGIN", &webifc::utility::LoaderSettings::COORDINATE_TO_ORIGIN)
        .field("CIRCLE_SEGMENTS", &webifc::utility::LoaderSettings::CIRCLE_SEGMENTS)
        .field("TAPE_SIZE", &webifc::utility::LoaderSettings::TAPE_SIZE)
        .field("MEMORY_LIMIT", &webifc::utility::LoaderSettings::MEMORY_LIMIT)
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

    emscripten::value_object<webifc::geometry::IfcPlacedGeometry>("IfcPlacedGeometry")
        .field("color", &webifc::geometry::IfcPlacedGeometry::color)
        .field("flatTransformation", &webifc::geometry::IfcPlacedGeometry::flatTransformation)
        .field("geometryExpressID", &webifc::geometry::IfcPlacedGeometry::geometryExpressID)
        ;

    emscripten::enum_<webifc::utility::LogLevel>("LogLevel")
        .value("DEBUG", webifc::utility::LogLevel::LOG_LEVEL_DEBUG)
        .value("INFO", webifc::utility::LogLevel::LOG_LEVEL_INFO)
        .value("WARN", webifc::utility::LogLevel::LOG_LEVEL_WARN)
        .value("ERROR", webifc::utility::LogLevel::LOG_LEVEL_ERROR)
        .value("OFF", webifc::utility::LogLevel::LOG_LEVEL_OFF)
        ;

    emscripten::enum_<webifc::utility::LoaderErrorType>("LoaderErrorType")
        .value("BOOL_ERROR", webifc::utility::LoaderErrorType::BOOL_ERROR)
        .value("PARSING", webifc::utility::LoaderErrorType::PARSING)
        .value("UNSPECIFIED", webifc::utility::LoaderErrorType::UNSPECIFIED)
        .value("UNSUPPORTED_TYPE", webifc::utility::LoaderErrorType::UNSUPPORTED_TYPE)
        ;

    emscripten::value_object<webifc::utility::LoaderError>("LoaderError")
        .field("type", &webifc::utility::LoaderError::type)
        .field("message", &webifc::utility::LoaderError::message)
        .field("expressID", &webifc::utility::LoaderError::expressID)
        .field("ifcType", &webifc::utility::LoaderError::ifcType)
        ;

    emscripten::register_vector<std::string>("stringVector");

    emscripten::register_vector<webifc::utility::LoaderError>("LoaderErrorVector");

    emscripten::register_vector<webifc::geometry::IfcPlacedGeometry>("IfcPlacedGeometryVector");

    emscripten::value_object<webifc::geometry::IfcFlatMesh>("IfcFlatMesh")
        .field("geometries", &webifc::geometry::IfcFlatMesh::geometries)
        .field("expressID", &webifc::geometry::IfcFlatMesh::expressID)
        ;

    emscripten::register_vector<webifc::geometry::IfcFlatMesh>("IfcFlatMeshVector");
    emscripten::register_vector<uint32_t>("UintVector");

    emscripten::register_vector<webifc::geometry::IfcAlignment>("IfcAlignmentVector");

    emscripten::value_object<webifc::geometry::IfcAlignment>("IfcAlignment")
        .field("Horizontal", &webifc::geometry::IfcAlignment::Horizontal)
        .field("Vertical", &webifc::geometry::IfcAlignment::Vertical);

    emscripten::value_object<glm::dvec3>("glmDvec3")
        .field("x", &glm::dvec3::x)
        .field("y", &glm::dvec3::y)
        .field("z", &glm::dvec3::z);

    emscripten::value_object<webifc::geometry::IfcAlignmentSegment>("IfcAlignmentSegment")
        .field("curves", &webifc::geometry::IfcAlignmentSegment::curves);

    emscripten::register_vector<webifc::geometry::IfcCurve>("IfcCurveVector");

    emscripten::value_object<webifc::geometry::IfcCurve>("IfcCurve")
        .field("points", &webifc::geometry::IfcCurve::points);

    emscripten::register_vector<glm::vec<2, glm::f64>>("vector2doubleVector");

    emscripten::value_object<glm::vec<2, glm::f64>>("vector2double")
        .field("x", &glm::vec<2, glm::f64>::x)
        .field("y", &glm::vec<2, glm::f64>::y);

    emscripten::register_vector<glm::vec<3, glm::f64>>("vector3doubleVector");


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
    emscripten::function("StreamMeshes", &StreamMeshesWithExpressID);
    emscripten::function("GetCoordinationMatrix", &GetCoordinationMatrix);
    emscripten::function("StreamAllMeshes", &StreamAllMeshes);
    emscripten::function("StreamAllMeshesWithTypes", &StreamAllMeshesWithTypesVal);
    emscripten::function("GetAndClearErrors", &GetAndClearErrors);
    emscripten::function("GetLine", &GetLine);
    emscripten::function("GetLineType", &GetLineType);
    emscripten::function("GetHeaderLine", &GetHeaderLine);
    emscripten::function("WriteLine", &WriteLine);
    emscripten::function("RemoveLine", &RemoveLine);
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
    emscripten::function("GetVersion", &GetVersion);
}
