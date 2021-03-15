/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#include <iostream>
#include <fstream>
#include <filesystem>

#include "include/web-ifc.h"
#include "include/web-ifc-geometry.h"
#include "include/ifc2x4.h"

std::string ReadFile(std::wstring filename)
{
    std::ifstream t(filename);
    std::stringstream buffer;
    buffer << t.rdbuf();
    return buffer.str();
}

void SpecificLoadTest(webifc::IfcLoader& loader, webifc::IfcGeometryLoader& geometryLoader)
{
    auto walls = loader.GetExpressIDsWithType(ifc2x4::IFCSLAB);

    bool writeFiles = true;
    auto mesh = geometryLoader.GetMesh(65156);
    if (writeFiles)
    {
        geometryLoader.DumpMesh(mesh, L"TEST.obj");
    }

    for (int i = 0; i < walls.size(); i++)
    {
        auto mesh = geometryLoader.GetMesh(walls[i]);

        if (writeFiles)
        {
            geometryLoader.DumpMesh(mesh, L"IFCSLAB" + std::to_wstring(i) + L".obj");
        }
    }

    std::cout << walls.size() << " elements" << std::endl;
}

std::vector<webifc::IfcFlatMesh> LoadAllTest(webifc::IfcLoader& loader, webifc::IfcGeometryLoader& geometryLoader)
{
    std::vector<webifc::IfcFlatMesh> meshes;

    for (auto type : ifc2x4::IfcElements)
    {
        auto elements = loader.GetExpressIDsWithType(type);

        for (int i = 0; i < elements.size(); i++)
        {
            auto mesh = geometryLoader.GetFlatMesh(elements[i]);

            /*
            for (auto& geom : mesh.geometries)
            {
                if (!geometryLoader.HasCachedGeometry(geom.geometryExpressID))
                {
                    printf("asdf");
                }
                auto flatGeom = geometryLoader.GetCachedGeometry(geom.geometryExpressID);
                flatGeom.GetVertexData();
            }
            */

            meshes.push_back(mesh);
        }
    }

    return meshes;
}

void DumpRefs(std::unordered_map<uint32_t, std::vector<uint32_t>>& refs)
{
    std::ofstream of("refs.txt");

    int32_t prev = 0;
    for (auto& it : refs)
    {
        if (!it.second.empty())
        {
            for (auto& i : it.second)
            {
                of << (((int32_t)i) - (prev));
                prev = i;
            }
        }
    }
}

struct BenchMarkResult
{
    std::string file;
    long long timeMS;
    long long sizeBytes;
};

void Benchmark()
{
    std::vector<BenchMarkResult> results;
    std::string path = "../../../benchmark/ifcfiles";
    for (const auto& entry : std::filesystem::directory_iterator(path))
    {
        if (entry.path().extension().string() != ".ifc")
        {
            continue;
        }
        
        std::wstring filePath = entry.path().wstring();
        std::string filename = entry.path().filename().string();

        std::string content = ReadFile(filePath);

        webifc::IfcLoader loader;
        auto start = webifc::ms();
        {
            loader.LoadFile(content);
        }
        auto time = webifc::ms() - start;

        BenchMarkResult result;
        result.file = filename;
        result.timeMS = time;
        result.sizeBytes = entry.file_size();
        results.push_back(result);
        
        std::cout << "Reading " << result.file << " took " << time << "ms" << std::endl;
    }

    std::cout << std::endl;
    std::cout << std::endl;
    std::cout << "Results:" << std::endl;
    
    double avgMBsec = 0;
    for (auto& result : results)
    {
        double MBsec = result.sizeBytes / 1000.0 / result.timeMS;
        avgMBsec += MBsec;
        std::cout << result.file << ": " << MBsec << " MB/sec" << std::endl;
    }

    avgMBsec /= results.size();

    std::cout << std::endl;
    std::cout << "Average: " << avgMBsec << " MB/sec" << std::endl;

    std::cout << std::endl;
    std::cout << std::endl;

}

int main()
{
    std::cout << "Hello web IFC test!\n";

    //Benchmark();

    //return 0;

    std::string content = ReadFile(L"D:/web-ifc/benchmark/ifcfiles/rst_basic_sample_project.ifc");


    webifc::IfcLoader loader;

    auto start = webifc::ms();
    loader.LoadFile(content);
    auto time = webifc::ms() - start;

    std::cout << "Reading took " << time << "ms" << std::endl;

    webifc::IfcGeometryLoader geometryLoader(loader);

    start = webifc::ms();

    //SpecificLoadTest(loader, geometryLoader);
    auto meshes = LoadAllTest(loader, geometryLoader);

    time = webifc::ms() - start;

    std::cout << "Generating geometry took " << time << "ms" << std::endl;

    std::cout << "Done" << std::endl;
}
