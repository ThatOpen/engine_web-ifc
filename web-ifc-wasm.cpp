
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

int OpenModel(std::string filename)
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

void CloseModel(uint32_t modelID)
{
    webifc::IfcLoader loader;

    // overwrite old loader, thereby destructing it
    loaders[modelID] = loader;
}

std::vector<uint32_t> expressIds;
ExpressIDList ExpressIDListMessage;

void* GetExpressIdsWithType(uint32_t modelID, uint32_t type)
{
    expressIds = loaders[modelID].GetExpressIDsWithType(type);
    ExpressIDListMessage.expressIds_data = &expressIds[0];
    ExpressIDListMessage.expressIds_length = expressIds.size();

    return &ExpressIDListMessage;
}

std::vector<webifc::IfcFlatMesh> LoadAllGeometry(uint32_t modelID)
{
    webifc::IfcLoader& loader = loaders[modelID];
    webifc::IfcGeometryLoader& geomLoader = geomLoaders[modelID];

    std::vector<webifc::IfcFlatMesh> meshes;

    for (auto type : ifc2x4::IfcElements)
    {
        auto elements = loader.GetExpressIDsWithType(type);

        // std::cout << type << std::endl;
        // std::cout << elements.size() << std::endl;

        for (int i = 0; i < elements.size(); i++)
        {
            meshes.push_back(geomLoader.GetFlatMesh(elements[i]));
        }
    }

    return meshes;
}

extern "C" bool IsModelOpen(uint32_t modelID)
{
    return loaders[modelID].IsOpen();
}
    
EMSCRIPTEN_BINDINGS(my_module) {

    emscripten::value_object<glm::dvec4>("dvec4")
        .field("x", &glm::dvec4::x)
        .field("y", &glm::dvec4::y)
        .field("z", &glm::dvec4::z)
        .field("a", &glm::dvec4::a)
        ;
        
    emscripten::value_object<glm::dmat4>("dmat4")
        ;

    emscripten::value_object<webifc::IfcPlacedGeometry>("IfcPlacedGeometry")
        .field("color", &webifc::IfcPlacedGeometry::color)
        .field("transformation", &webifc::IfcPlacedGeometry::transformation)
        .field("geometryExpressID", &webifc::IfcPlacedGeometry::geometryExpressID)
        ;

    emscripten::register_vector<webifc::IfcPlacedGeometry>("IfcPlacedGeometryVector");

    emscripten::value_object<webifc::IfcFlatMesh>("IfcFlatMesh")
        .field("geometries", &webifc::IfcFlatMesh::geometries)
        ;

    emscripten::register_vector<webifc::IfcFlatMesh>("IfcFlatMeshVector");

    emscripten::function("LoadAllGeometry", &LoadAllGeometry);
    emscripten::function("OpenModel", &OpenModel);
    emscripten::function("CloseModel", &CloseModel);
    emscripten::function("IsModelOpen", &IsModelOpen);

}