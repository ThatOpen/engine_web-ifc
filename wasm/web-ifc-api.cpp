
#include <stdio.h>
#include <string>
#include <fstream>
#include <sstream>
#include <iostream>

#include <emscripten/bind.h>

#include "include/web-ifc.h"
#include "include/web-ifc-geometry.h"

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

    uint32_t modelID = loaders.size();
    std::string contents = ReadFile("filename");
    
    std::cout << "Read " << std::endl;

    webifc::IfcLoader loader;
    loaders.push_back(loader);
    std::cout << "Loading " << std::endl;
    auto start = webifc::ms();
    loaders[modelID].LoadFile(contents);
    auto end = webifc::ms() - start;
    geomLoaders.push_back(webifc::IfcGeometryLoader(loaders[modelID]));

    std::cout << "Loaded " << loaders[modelID].GetNumLines() << " lines in " << end << " ms!" << std::endl;

    return modelID;
}

void CloseModel(uint32_t modelID)
{
    // TODO: use a list or something else...

    // overwrite old loaders, thereby destructing them
    loaders[modelID] = webifc::IfcLoader();
    // geomLoaders[modelID] = webifc::IfcGeometryLoader(loaders[modelID]);
}

int OpenModelFromTapeData(std::string data)
{
    uint32_t modelID = loaders.size();

    std::cout << "Bytes: " << data.size() << std::endl;

    webifc::IfcLoader loader;
    loaders.push_back(loader);
    loaders[modelID].PushDataToTape((void*)data.c_str(), data.size());
    loaders[modelID].ParseTape(1000);
    geomLoaders.push_back(webifc::IfcGeometryLoader(loaders[modelID]));

    return modelID;
}

std::vector<webifc::IfcFlatMesh> LoadAllGeometry(uint32_t modelID)
{
    webifc::IfcLoader& loader = loaders[modelID];
    webifc::IfcGeometryLoader& geomLoader = geomLoaders[modelID];

    std::vector<webifc::IfcFlatMesh> meshes;

    for (auto type : ifc2x4::IfcElements)
    {
        auto elements = loader.GetExpressIDsWithType(type);

        if (type == ifc2x4::IFCOPENINGELEMENT || type == ifc2x4::IFCSPACE || type == ifc2x4::IFCOPENINGSTANDARDCASE)
        {
            continue;
        }

        for (int i = 0; i < elements.size(); i++)
        {
            webifc::IfcFlatMesh mesh = geomLoader.GetFlatMesh(elements[i]);
            for (auto& geom : mesh.geometries)
            {
                auto& flatGeom = geomLoader.GetCachedGeometry(geom.geometryExpressID);
                flatGeom.GetVertexData();
            }   
            meshes.push_back(std::move(mesh));
        }
    }

    return meshes;
}

std::array<double, 16> GetMat()
{
    glm::dmat4 transformation(1);
    transformation[0][0] = 4.5;


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

webifc::IfcGeometry GetGeometry(uint32_t modelID, uint32_t expressID)
{
    return geomLoaders[modelID].GetCachedGeometry(expressID);
}

extern "C" bool IsModelOpen(uint32_t modelID)
{
    return loaders[modelID].IsOpen();
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

    emscripten::register_vector<webifc::IfcPlacedGeometry>("IfcPlacedGeometryVector");

    emscripten::value_object<webifc::IfcFlatMesh>("IfcFlatMesh")
        .field("geometries", &webifc::IfcFlatMesh::geometries)
        ;

    emscripten::register_vector<webifc::IfcFlatMesh>("IfcFlatMeshVector");

    emscripten::function("LoadAllGeometry", &LoadAllGeometry);
    emscripten::function("OpenModel", &OpenModel);
    emscripten::function("OpenModelFromTapeData", &OpenModelFromTapeData);
    emscripten::function("CloseModel", &CloseModel);
    emscripten::function("IsModelOpen", &IsModelOpen);
    emscripten::function("GetGeometry", &GetGeometry);
    emscripten::function("GetMat", &GetMat);
}