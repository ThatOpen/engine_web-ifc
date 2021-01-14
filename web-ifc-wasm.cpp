
#include <stdio.h>
#include <string>
#include <fstream>
#include <sstream>
#include <iostream>

#include "web-ifc-cpp/web-ifc.h"
#include "web-ifc-cpp/web-ifc-geometry.h"
#include "web-ifc-interop/gen/Types.h"

std::vector<webifc::IfcLoader> loaders;
std::vector<webifc::IfcGeometryLoader> geomLoaders;

// use to construct API placeholders
int main() {
    loaders.emplace_back();
    geomLoaders.emplace_back(loaders[0]);
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
    loaders[modelID].LoadFile(content);
    geomLoaders.push_back(webifc::IfcGeometryLoader(loaders[modelID]));

    std::cout << "Loaded " << loaders[modelID].GetNumLines() << " lines!" << std::endl;

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

extern "C" bool IsModelOpen(uint32_t modelID)
{
    return loaders[modelID].IsOpen();
}

struct s
{
    const char* str;
    int32_t strLen;
    int32_t test;
};

s bla;

extern "C" s* getString()
{
    bla.str = "asdfÉÎÐÑáąğƇ";
    bla.strLen = strlen(bla.str);
    bla.test = 31;

    return &bla;
}