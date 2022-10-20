/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#include <stdio.h>
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
#define DEF_MT_ENABLED 
#endif

#ifdef DEF_MT_ENABLED
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
        std::cout << "web-ifc: " << WEB_IFC_VERSION_NUMBER << " threading: " << MT_ENABLED << std::endl;
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
            callback(mesh);
        }

        // clear geometry, freeing memory, client is expected to have consumed the data
        geomLoader->ClearCachedGeometry();
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

    for (auto& type : ifc2x4::IfcElements)
    {
        if (type == ifc2x4::IFCOPENINGELEMENT || type == ifc2x4::IFCSPACE || type == ifc2x4::IFCOPENINGSTANDARDCASE)
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

    for (auto type : ifc2x4::IfcElements)
    {
        auto elements = loader->GetExpressIDsWithType(type);

        if (type == ifc2x4::IFCOPENINGELEMENT || type == ifc2x4::IFCSPACE || type == ifc2x4::IFCOPENINGSTANDARDCASE)
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

std::vector<uint32_t> GetLineIDsWithType(uint32_t modelID, uint32_t type)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return {};
    }

    auto lineIDs = loader->GetLineIDsWithType(type);
    std::vector<uint32_t> expressIDs;
    for (auto lineID : lineIDs)
    {
        expressIDs.push_back(loader->GetLine(lineID).expressID);
    }
    return expressIDs;
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
    std::cout << "Exported" << std::endl;
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
            std::cout << "Error in writeline: unknown object received" << std::endl;
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

emscripten::val GetLine(uint32_t modelID, uint32_t expressID)
{
    auto& loader = loaders[modelID];
    if (!loader)
    {
        return emscripten::val::undefined();
    }

    auto& line = loader->GetLine(loader->ExpressIDToLineID(expressID));
    auto& _tape = loader->GetTape();

    loader->MoveToArgumentOffset(line, 0);

    std::stack<emscripten::val> valueStack;
    std::stack<int> valuePosition;

    auto arguments = emscripten::val::array();

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

    auto retVal = emscripten::val::object();
    retVal.set(emscripten::val("ID"), line.expressID);
    retVal.set(emscripten::val("type"), line.ifcType);
    retVal.set(emscripten::val("arguments"), arguments);

    return retVal;
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

    emscripten::register_vector<webifc::LoaderError>("LoaderErrorVector");

    emscripten::register_vector<webifc::IfcPlacedGeometry>("IfcPlacedGeometryVector");

    emscripten::value_object<webifc::IfcFlatMesh>("IfcFlatMesh")
        .field("geometries", &webifc::IfcFlatMesh::geometries)
        .field("expressID", &webifc::IfcFlatMesh::expressID)
        ;

    emscripten::register_vector<webifc::IfcFlatMesh>("IfcFlatMeshVector");
    emscripten::register_vector<uint32_t>("UintVector");

    emscripten::function("LoadAllGeometry", &LoadAllGeometry);
    emscripten::function("OpenModel", &OpenModel);
    emscripten::function("CreateModel", &CreateModel);
    emscripten::function("GetMaxExpressID", &GetMaxExpressID);
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
    emscripten::function("WriteLine", &WriteLine);
    emscripten::function("ExportFileAsIFC", &ExportFileAsIFC);
    emscripten::function("GetLineIDsWithType", &GetLineIDsWithType);
    emscripten::function("GetAllLines", &GetAllLines);
    emscripten::function("SetGeometryTransformation", &SetGeometryTransformation);
}