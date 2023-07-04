/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <iostream>
#include <fstream>
#include <filesystem>
#include <locale>
#include <signal.h> // used to stop with feedback on ctrl-c

#include "test/io_helpers.h"
#include "parsing/IfcLoader.h"
#include "schema/IfcSchemaManager.h"
#include "geometry/IfcGeometryProcessor.h"
#include "utility/LoaderError.h"
#include "utility/LoaderSettings.h"
#include "schema/ifc-schema.h"

using namespace webifc::io;

long long ms()
{
    using namespace std::chrono;
    milliseconds millis = duration_cast<milliseconds>(
        system_clock::now().time_since_epoch());

    return millis.count();
}

std::string ReadFile(std::string filename)
{
    std::ifstream t(filename);
    std::stringstream buffer;
    buffer << t.rdbuf();
    return buffer.str();
}

void SpecificLoadTest(webifc::parsing::IfcLoader &loader, webifc::geometry::IfcGeometryProcessor &geometryLoader, uint64_t num)
{
    auto walls = loader.GetExpressIDsWithType(webifc::schema::IFCSLAB);
    bool writeFiles = true;

    auto mesh = geometryLoader.GetMesh(num);

    if (writeFiles)
    {
        DumpMesh(mesh, geometryLoader, "TEST.obj");
    }
}

struct BenchMarkResult
{
    std::string file;
    long long timeMS;
    long long sizeBytes;
};

int iProcessingGeom = -1;

// Define the function to be called when ctrl-c (SIGINT) is sent to process
void signal_callback_handler(int signum) {
    std::cout.imbue(std::locale("C"));
    std::cout << "Stopped on entity: #" << iProcessingGeom << std::endl;
    // Terminate program
    exit(signum);
}


BenchMarkResult ReportOneFile(std::filesystem::directory_entry file, bool tabSeparated)
{
    std::string filePath = file.path().string();
    BenchMarkResult result;
    result.file = filePath;
    result.sizeBytes = file.file_size();
    std::string unit = "B";
    iProcessingGeom = -1;
    double sz = file.file_size();
    while (sz > 1024)
    {
        sz /= 1024;
        if (unit == "B")
            unit = "Kb";
        else if (unit == "Kb")
            unit = "Mb";
        else if (unit == "Mb")
            unit = "Gb";
    }

    if (!tabSeparated)
    {
        std::cout.imbue(std::locale(""));
        std::cout << "Processing " << filePath << std::endl;
        std::cout << " - size is " << result.sizeBytes << " bytes." << std::endl;
    }
    else
        std::cout << filePath << "\t" << result.sizeBytes << "\t" << sz << " " << unit << "\t";

    // registering cancellation handler
    signal(SIGINT, signal_callback_handler);

    webifc::utility::LoaderSettings set;
    set.COORDINATE_TO_ORIGIN = true;
    webifc::utility::LoaderErrorHandler errorHandler;
    webifc::schema::IfcSchemaManager schemaManager;
    webifc::parsing::IfcLoader loader(set.TAPE_SIZE, set.MEMORY_LIMIT, errorHandler, schemaManager);

    auto firstStart = ms();
    std::string content = ReadFile(filePath);
    loader.LoadFile([&](char* dest, size_t sourceOffset, size_t destSize)
        {
            uint32_t length = std::min(content.size() - sourceOffset, destSize);
            memcpy(dest, &content[sourceOffset], length);
            return length;
        });
    // std::ofstream outputStream("D:/web-ifc/benchmark/ifcfiles/output.ifc");
    // outputStream << loader.DumpAsIFC();
    // exit(0);

    auto midtime = ms();

    if (!tabSeparated)
        std::cout << " - Reading and loading took " << midtime - firstStart << " ms." << std::endl;
    else
        std::cout << midtime - firstStart << "\t";

    // std::ofstream outputFile("output.ifc");
    // outputFile << loader.DumpSingleObjectAsIFC(14363);
    // outputFile.close();
    int tallyEntities = 0;
    int errorEntities = 0;
    auto geomStart = ms();
    webifc::geometry::IfcGeometryProcessor geometryLoader(loader, errorHandler, schemaManager, set.CIRCLE_SEGMENTS, set.COORDINATE_TO_ORIGIN, true);
    // std::vector<webifc::geometry::IfcFlatMesh> meshes;
    long totalVertices = 0;
    long totalIndices = 0;
    for (auto type : schemaManager.GetIfcElementList())
    {
        auto elements = loader.GetExpressIDsWithType(type);
        for (uint32_t i = 0; i < elements.size(); i++)
        {
            tallyEntities++;
            webifc::geometry::IfcFlatMesh mesh = geometryLoader.GetFlatMesh(elements[i]);
            for (auto& geom : mesh.geometries)
            {
                iProcessingGeom = geom.geometryExpressID;
                auto& flatGeom = geometryLoader.GetGeometry(geom.geometryExpressID);
                flatGeom.GetVertexData();
                totalVertices += flatGeom.GetVertexDataSize();
                totalIndices += flatGeom.GetIndexDataSize();
            }
            if (errorHandler.GetErrors().size() > 0)
            {
                errorEntities++;
                errorHandler.ClearErrors();
            }
            geometryLoader.Clear(); // removing the data
        }
    }
    auto endtime = ms();

    if (!tabSeparated)
    {
        std::cout << " - Generating geometry took " << endtime - geomStart << " msec." << std::endl;
        std::cout << " - Total processing took " << endtime - firstStart << " msec." << std::endl;
        std::cout << " - " << totalVertices << " vertices count." << std::endl;
        std::cout << " - " << totalIndices << " indices count." << std::endl;
        std::cout << " - " << errorEntities << " errors." << std::endl;
        std::cout << " - " << tallyEntities << " entities." << std::endl << std::endl;
    }
    else
    {
        std::cout << endtime - geomStart << "\t";
        std::cout << endtime - firstStart << "\t" ;
        std::cout << totalVertices << "\t";
        std::cout << totalIndices << "\t";
        std::cout << errorEntities << "\t" << tallyEntities << "\t";
        std::cout << std::endl;
    }

    result.timeMS = endtime - firstStart;

    return result;
}


bool isDirectory(const std::string& path) {
    return std::filesystem::is_directory(path);
}
bool isFile(const std::string& path) {
    return std::filesystem::is_regular_file(path);
}

int Benchmark(char *argPath, bool tabSeparated)
{
    std::string path(argPath);
    if (!std::filesystem::exists(path))
    {
        std::cout << "Path '" <<  path << "' not found." << std::endl;
        return 1;
    }
    if (tabSeparated)
        std::cout << "File\tbytes\tsize\treading msec\tgeom msec\ttotal msec\tvertices count\tindexes count\terror count\tentity count" << std::endl;

    if (isFile(path))
    {       
        std::filesystem::directory_entry entry(path);
        ReportOneFile(entry, tabSeparated);
        return 0;
    }
    std::vector<BenchMarkResult> results;
    
    for (const auto& entry : std::filesystem::directory_iterator(path))
    {
        if (!entry.is_regular_file() || entry.path().extension().string() != ".ifc")
        {
            continue;
        }       
        auto result = ReportOneFile(entry, tabSeparated);
        results.push_back(result);
    }

    std::cout << std::endl;
    std::cout << "Results:" << std::endl;
    double avgMBsec = 0;
    for (auto& result : results)
    {
        double MBsec = result.sizeBytes / 1000.0 / result.timeMS;
        avgMBsec += MBsec;
        std::cout << " - " << result.file << ": " << MBsec << " MB/sec" << std::endl;
    }
    avgMBsec /= results.size();

    std::cout << std::endl;
    std::cout << "Average: " << avgMBsec << " MB/sec" << std::endl;
    std::cout << std::endl;
    return 0;
}

int main(int argc, char *argv[])
{
    if (argc == 1 || argc >= 1 && (strcmp(argv[1],"help")==0))
    {
        std::cout << "Command line options are: " << std::endl;
        std::cout << "  benchmark <source>        geometry performance evaluation of ifc files in folder" << std::endl;
        std::cout << "  benchmarktable <source>   geometry performance evaluation (tab separated, one line per file)" << std::endl;
        std::cout << "  help                      prints this help" << std::endl;
        std::cout << std::endl;
        std::cout << "  <source>                  can be either an ifc file or a folder" << std::endl;
        std::cout << std::endl;
        std::cout << "In case the program hangs, ctrl-c reports the geometry entity being meshed." << std::endl;
        return 1;
    }
    if (argc > 1 
        && 
        (
            strcmp(argv[1],"benchmark") == 0 ||
            strcmp(argv[1],"benchmarktable") == 0 
       ))
    {
        if (argc == 2)
        {
            std::cout << "The benchmark option requires a further parameter identifying the folder to process." << std::endl;
            return 1;
        }
        if (strcmp(argv[1], "benchmarktable") == 0)
            return Benchmark(argv[2], true);
        else
            return Benchmark(argv[2], false);
    }
    std::cout << "Invalid command line options, use 'regression help' for instructions." << std::endl;
    return 0;
}