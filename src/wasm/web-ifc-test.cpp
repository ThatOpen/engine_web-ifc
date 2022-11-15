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

uint32_t openSerialized(std::vector<std::string> paths, webifc::LoaderSettings settings)
{
    std::map<uint32_t, std::unique_ptr<webifc::IfcLoader>> loaders;
    std::map<uint32_t, std::unique_ptr<webifc::IfcGeometryLoader>> geomLoaders;

    uint32_t modelID = 0;

    auto loader = std::make_unique<webifc::IfcLoader>(settings);
    loaders.emplace(modelID, std::move(loader));
    auto geomLoader = std::make_unique<webifc::IfcGeometryLoader>(*loaders[modelID]);
    geomLoaders.emplace(modelID, std::move(geomLoader));

    for (int i(0); i < paths.size(); ++i)
    {
        std::cout << paths[i] << std::endl;
    }

    loaders[modelID]->ActivateSerializer();
    loaders[modelID]->SetBinPaths(paths);
    uint32_t numLines = loaders[modelID]->loadMetadata();

    // Continue opening
    loaders[modelID]->LoadSerializedFileData(numLines);

    // Ensure IsOpen will return true upon successful load.
    loaders[modelID]->SetOpen();

    ////////////

    std::vector<webifc::IfcFlatMesh> meshes;

    for (auto type : ifc2x4::IfcElements)
    {
        auto elements = loaders[modelID]->GetExpressIDsWithType(type);

        for (int i = 0; i < elements.size(); i++)
        {
            auto mesh = geomLoaders[modelID]->GetFlatMesh(elements[i]);
            meshes.push_back(mesh);
        }
    }

    loaders[modelID]->DisableSerializer();

    ////////////

    return modelID;
}

void serialize(std::vector<std::string> filePaths, std::string serializedName)
{
    auto settings = webifc::LoaderSettings();
    auto loader = std::make_unique<webifc::IfcLoader>(settings);

    loader->ActivateSerializer();
    loader->SetSerializedFileName(serializedName);

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

        uint32_t count = 0;
        uint32_t update = 0;

        while (bigFile)
        {
            content.clear(); // You must clean string this way, otherwise memory leaks in chrome
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
            prevStringChunk.clear(); // You must clean string this way, otherwise memory leaks in chrome
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

            count++;
            update++;
        }
        bigFile.close();
    }

    loader->storeLastChunk();
    loader->storeMetadata(numLines);
    loader->DisableSerializer();
}

int main()
{
    std::cout << "Hello web IFC test!\n";

    // TestTriangleDecompose();

    // return 0;

    // Benchmark();

    // return 0;

    //std::string content = ReadFile(L"C:/Users/qmoya/Desktop/PROGRAMES/VSCODE/IFC.JS/issues/#83 processing/05111002_IFCR2_Geo_Columns_1.ifc");
    std::string content = ReadFile(L"C:/Users/qmoya/Desktop/PROGRAMES/VSCODE/IFC.JS/issues/#sweptdisk/IfcSurfaceCurveSweptAreaSolid.ifc");

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
    //SpecificLoadTest(loader, geometryLoader, 2591);
    //SpecificLoadTest(loader, geometryLoader, 2837);
    auto meshes = LoadAllTest(loader, geometryLoader);
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
