
#include <stdio.h>
#include <string>
#include <fstream>
#include <sstream>
#include <iostream>

#include <emscripten/bind.h>

#include "web-ifc-cpp/web-ifc.h"
#include "web-ifc-cpp/web-ifc-geometry.h"
#include "web-ifc-interop/gen/Types.h"

std::vector<webifc::IfcLoader> loaders;
std::vector<webifc::IfcGeometryLoader> geomLoaders;



struct Test
{
    int a;
    int b;
};

struct Mesh
{
    std::vector<Test> tests;
};

Test t { 5, 3};
Mesh m;
// use to construct API placeholders
int main() {
    loaders.emplace_back();
    geomLoaders.emplace_back(loaders[0]);
    m.tests.push_back(t);

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

extern "C" int OpenModel(std::string filename)
{
    std::cout << "Loading: " << filename << std::endl;

    std::string content = ReadFile("filename");
    
    std::cout << "Read " << std::endl;

    webifc::IfcLoader loader;
    uint32_t modelID = loaders.size();
    loaders.push_back(loader);
    std::cout << "Loading " << std::endl;
    auto start = webifc::ms();
    loaders[modelID].LoadFile(content);
    auto end = webifc::ms() - start;
    geomLoaders.push_back(webifc::IfcGeometryLoader(loaders[modelID]));

    std::cout << "Loaded " << loaders[modelID].GetNumLines() << " lines in " << end << " ms!" << std::endl;

    return modelID;
}

extern "C" void CloseModel(uint32_t modelID)
{
    webifc::IfcLoader loader;

    // overwrite old loader, thereby destructing it
    loaders[modelID] = loader;
}

std::vector<uint32_t> expressIds;
ExpressIDList ExpressIDListMessage;

extern "C" ExpressIDList* GetExpressIdsWithType(uint32_t modelID, uint32_t type)
{
    expressIds = loaders[modelID].GetExpressIDsWithType(type);
    ExpressIDListMessage.expressIds_data = &expressIds[0];
    ExpressIDListMessage.expressIds_length = expressIds.size();

    return &ExpressIDListMessage;
}

webifc::IfcGeometry flatGeometry;
GeometryBuffer GeometryBufferMessage;
std::vector<uint32_t> indexData;
std::vector<float> vertexData;

extern "C" GeometryBuffer* GetFlattenedGeometry(uint32_t modelID, uint64_t expressID)
{
    webifc::IfcGeometryLoader& geomLoader = geomLoaders[modelID];
    
    auto start = webifc::ms();
    flatGeometry = geomLoader.GetFlattenedGeometry(expressID);
    auto end = webifc::ms() - start;
    // std::cout << "Geometry generation took " << end << " ms" << std::endl;

    indexData.resize(flatGeometry.faces.size() * 3);
    vertexData.resize(flatGeometry.points.size() * 3);

    for (int i = 0; i < flatGeometry.points.size(); i++)
    {
        vertexData[i * 3 + 0] = flatGeometry.points[i].x;
        vertexData[i * 3 + 1] = flatGeometry.points[i].y;
        vertexData[i * 3 + 2] = flatGeometry.points[i].z;
    }

    for (int i = 0; i < flatGeometry.faces.size(); i++)
    {
        indexData[i * 3 + 0] = flatGeometry.faces[i].i0;
        indexData[i * 3 + 1] = flatGeometry.faces[i].i1;
        indexData[i * 3 + 2] = flatGeometry.faces[i].i2;
    }

    GeometryBufferMessage.indexData_data = &indexData[0];
    GeometryBufferMessage.indexData_length = indexData.size();
    
    GeometryBufferMessage.vertexData_data = &vertexData[0];
    GeometryBufferMessage.vertexData_length = vertexData.size();

    return &GeometryBufferMessage;
}

extern "C" void LoadAllGeometry(uint32_t modelID)
{
    webifc::IfcLoader& loader = loaders[modelID];
    webifc::IfcGeometryLoader& geomLoader = geomLoaders[modelID];
    for (auto type : ifc2x4::IfcElements)
    {
        auto elements = loader.GetExpressIDsWithType(type);

        // std::cout << type << std::endl;
        // std::cout << elements.size() << std::endl;

        for (int i = 0; i < elements.size(); i++)
        {
            auto mesh = geomLoader.GetMesh(elements[i]);
        }
    }
}

extern "C" bool IsModelOpen(uint32_t modelID)
{
    return loaders[modelID].IsOpen();
}
    
Mesh getTest() {
    return m;
}

EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::value_object<Test>("Test")
        .field("a", &Test::a)
        .field("b", &Test::b)
        ;
    emscripten::register_vector<Test>("VectorTest");

    emscripten::value_object<Mesh>("Mesh")
        .field("tests", &Mesh::tests)
        ;

    emscripten::function("getTest", &getTest);
}