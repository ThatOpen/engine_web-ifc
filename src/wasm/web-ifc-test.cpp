/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <iostream>
#include <fstream>
#include <filesystem>

#include "include/web-ifc.h"
#include "include/web-ifc-geometry.h"
#include "include/math/triangulate-with-boundaries.h"
#include "include/ifc2x4.h"

std::string ReadFile(std::wstring filename)
{
    std::ifstream t(filename);
    std::stringstream buffer;
    buffer << t.rdbuf();
    return buffer.str();
}

void SpecificLoadTest(webifc::IfcLoader &loader, webifc::IfcGeometryLoader &geometryLoader, uint64_t num)
{
    auto walls = loader.GetExpressIDsWithType(ifc2x4::IFCSLAB);

    bool writeFiles = true;

    auto mesh = geometryLoader.GetMesh(num);

    if (writeFiles)
    {
        geometryLoader.DumpMesh(mesh, L"TEST.obj");
    }
}

std::vector<webifc::IfcFlatMesh> LoadAllTest(webifc::IfcLoader &loader, webifc::IfcGeometryLoader &geometryLoader)
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

void DumpRefs(std::unordered_map<uint32_t, std::vector<uint32_t>> &refs)
{
    std::ofstream of("refs.txt");

    int32_t prev = 0;
    for (auto &it : refs)
    {
        if (!it.second.empty())
        {
            for (auto &i : it.second)
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
    for (const auto &entry : std::filesystem::directory_iterator(path))
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
            // loader.LoadFile(content);
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
    for (auto &result : results)
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

void TestTriangleDecompose()
{
    const int NUM_TESTS = 100;
    const int PTS_PER_TEST = 100;
    const int EDGE_PTS_PER_TEST = 10;

    const double scaleX = 650;
    const double scaleY = 1;

    glm::dvec2 a(0, 0);
    glm::dvec2 b(scaleX, 0);
    glm::dvec2 c(0, scaleY);

    for (int i = 0; i < NUM_TESTS; i++)
    {
        srand(i);

        std::vector<glm::dvec2> points;

        // random points
        for (int j = 0; j < PTS_PER_TEST; j++)
        {
            points.push_back({webifc::RandomDouble(0, scaleX),
                              webifc::RandomDouble(0, scaleY)});
        }

        // points along the edges
        for (int j = 0; j < EDGE_PTS_PER_TEST; j++)
        {
            glm::dvec2 e1 = b - a;
            glm::dvec2 e2 = c - a;
            glm::dvec2 e3 = b - c;

            points.push_back(a + e1 * webifc::RandomDouble(0, 1));
            points.push_back(a + e2 * webifc::RandomDouble(0, 1));
            points.push_back(c + e3 * webifc::RandomDouble(0, 1));
        }

        std::vector<webifc::Loop> loops;

        for (auto &pt : points)
        {
            // if (pt.x > scaleX / 2)
            {
                webifc::Loop l;
                l.hasOne = true;
                l.v1 = pt;
                loops.push_back(l);
            }
        }

        std::cout << "Start test " << i << std::endl;

        bool swapped = false;
        auto triangles = webifc::triangulate(a, b, c, loops, swapped);

        // webifc::IsValidTriangulation(triangles, points);

        std::vector<webifc::Point> pts;

        for (auto &pt : points)
        {
            webifc::Point p;
            p.x = pt.x;
            p.y = pt.y;
            pts.push_back(p);
        }

        webifc::DumpSVGTriangles(triangles, webifc::Point(), webifc::Point(), L"triangles.svg", pts);
    }
}

int main()
{
    std::cout << "Hello web IFC test!\n";

    // TestTriangleDecompose();

    // return 0;

    // Benchmark();

    // return 0;

    // std::string content = ReadFile(L"C:/Users/qmoya/Desktop/PROGRAMES/VSCODE/IFC.JS/issues/#145 Solved/S_Office_Integrated Design Archi.ifc");
    // std::string content = ReadFile(L"C:/Users/qmoya/Desktop/PROGRAMES/VSCODE/IFC.JS/issues/#156 Solved/#172 Processing/15_testing.ifc");
    //std::string content = ReadFile(L"C:/Users/qmoya/Desktop/IFC/IFC_BSI_ADVANCEDBREPS/bsi_basin-advanced-brep FAIL.ifc");
    std::string content = ReadFile(L"C:/Users/qmoya/Desktop/PROGRAMES/VSCODE/IFC.JS/issues/#156 Solved/#172 Processing/15_testing.ifc");

    webifc::LoaderSettings set;
    set.COORDINATE_TO_ORIGIN = true;
    set.DUMP_CSG_MESHES = false;
    set.USE_FAST_BOOLS = true;

    webifc::IfcLoader loader(set);

    auto start = webifc::ms();
    size_t contentOffset = 0;
    loader.LoadFile([&](char *dest, size_t destSize)
                    {
                        uint32_t length = std::min(content.size() - contentOffset, destSize);
                        memcpy(dest, &content[contentOffset], length);

                        contentOffset += length;

                        return length; });

    // std::ofstream outputStream(L"D:/web-ifc/benchmark/ifcfiles/output.ifc");
    // outputStream << loader.DumpAsIFC();
    // exit(0);
    auto time = webifc::ms() - start;

    std::cout << "Reading took " << time << "ms" << std::endl;

    // std::ofstream outputFile("output.ifc");
    // outputFile << loader.DumpSingleObjectAsIFC(14363);
    // outputFile.close();

    webifc::IfcGeometryLoader geometryLoader(loader);

    start = webifc::ms();
    SpecificLoadTest(loader, geometryLoader, 11);
    // SpecificLoadTest(loader, geometryLoader, 414835);
    // SpecificLoadTest(loader, geometryLoader, 30782);
    // SpecificLoadTest(loader, geometryLoader, 217102);
    // SpecificLoadTest(loader, geometryLoader, 181);
    // auto meshes = LoadAllTest(loader, geometryLoader);
    auto trans = webifc::FlattenTransformation(geometryLoader.GetCoordinationMatrix());

    auto errors = loader.GetAndClearErrors();

    for (auto error : errors)
    {
        std::cout << error.expressID << " " << error.ifcType << " " << std::to_string((int)error.type) << " " << error.message << std::endl;
    }

    time = webifc::ms() - start;

    std::cout << "Generating geometry took " << time << "ms" << std::endl;

    std::cout << "Done" << std::endl;
}
