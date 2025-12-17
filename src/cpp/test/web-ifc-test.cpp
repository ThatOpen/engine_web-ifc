/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <iostream>
#include <fstream>
#include <cstdint>
#include <filesystem>
#include "io_helpers.h"

#include "../web-ifc/parsing/IfcLoader.h"
#include "../web-ifc/schema/IfcSchemaManager.h"
#include "../web-ifc/geometry/IfcGeometryProcessor.h"
#include "../web-ifc/schema/ifc-schema.h"

using namespace webifc::io;

long long ms()
{
    using namespace std::chrono;
    milliseconds millis = duration_cast<milliseconds>(
        system_clock::now().time_since_epoch());

    return millis.count();
}

double RandomDouble(double lo, double hi)
{
    return lo + static_cast<double>(rand()) / (static_cast<double>(RAND_MAX / (hi - lo)));
}

std::string ReadFile(std::string filename)
{
    std::ifstream file(filename, std::ios::binary);
    if (!file) {
        throw std::runtime_error("Could not open file");
    }

    file.seekg(0, std::ios::end);
    std::streamsize size = file.tellg();
    file.seekg(0, std::ios::beg);

    std::string buffer(size, '\0');
    
    if (!file.read(buffer.data(), size)) {
        throw std::runtime_error("Error reading file");
    }

    return buffer;
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

std::vector<webifc::geometry::IfcAlignment> GetAlignments(webifc::parsing::IfcLoader &loader, webifc::geometry::IfcGeometryProcessor &geometryLoader)
{
    std::vector<webifc::geometry::IfcAlignment> alignments;

    auto type = webifc::schema::IFCALIGNMENT;

    auto elements = loader.GetExpressIDsWithType(type);

    for (unsigned int i = 0; i < elements.size(); i++)
    {
        auto alignment = geometryLoader.GetLoader().GetAlignment(elements[i]);
        alignment.transform(geometryLoader.GetCoordinationMatrix());
        alignments.push_back(alignment);
    }

    bool writeFiles = true;

    if (writeFiles)
    {
        DumpAlignment(alignments, "V_ALIGN.obj", "H_ALIGN.obj");
    }

    for (size_t i = 0; i < alignments.size(); i++)
    {
        webifc::geometry::IfcAlignment alignment = alignments[i];
        std::vector<glm::dvec3> pointsH;
        std::vector<glm::dvec3> pointsV;
        for (size_t j = 0; j < alignment.Horizontal.curves.size(); j++)
        {
            for (size_t k = 0; k < alignment.Horizontal.curves[j].points.size(); k++)
            {
                pointsH.push_back(alignment.Horizontal.curves[j].points[k]);
            }
        }
        for (size_t j = 0; j < alignment.Vertical.curves.size(); j++)
        {
            for (size_t k = 0; k < alignment.Vertical.curves[j].points.size(); k++)
            {
                pointsV.push_back(alignment.Vertical.curves[j].points[k]);
            }
        }
        webifc::geometry::IfcCurve curve;
        curve.points = bimGeometry::Convert2DAlignmentsTo3D(pointsH, pointsV);
        alignments[i].Absolute.curves.push_back(curve);
    }

    return alignments;
}

std::vector<webifc::geometry::IfcCrossSections> GetCrossSections3D(webifc::parsing::IfcLoader &loader, webifc::geometry::IfcGeometryProcessor &geometryLoader)
{
    std::vector<webifc::geometry::IfcCrossSections> crossSections;

    std::vector<uint32_t> typeList;
    typeList.push_back(webifc::schema::IFCSECTIONEDSOLID);
    typeList.push_back(webifc::schema::IFCSECTIONEDSURFACE);
    typeList.push_back(webifc::schema::IFCSECTIONEDSOLIDHORIZONTAL);

    for (auto &type : typeList)
    {

        auto elements = loader.GetExpressIDsWithType(type);

        for (unsigned int i = 0; i < elements.size(); i++)
        {
            auto crossSection = geometryLoader.GetLoader().GetCrossSections3D(elements[i]);
            crossSections.push_back(crossSection);
        }
    }

    bool writeFiles = true;

    if (writeFiles)
    {
        DumpCrossSections(crossSections, "CrossSection.obj");
    }

    return crossSections;
}

std::string ReadValue(webifc::parsing::IfcLoader &loader, webifc::parsing::IfcTokenType t)
{
    switch (t)
    {
    case webifc::parsing::IfcTokenType::STRING:
    {
        return loader.GetDecodedStringArgument();
    }
    case webifc::parsing::IfcTokenType::ENUM:
    {
        std::string_view s = loader.GetStringArgument();
        return std::string(s);
    }
    case webifc::parsing::IfcTokenType::REAL:
    {
        std::string_view s = loader.GetDoubleArgumentAsString();
        return std::string(s);
    }
    case webifc::parsing::IfcTokenType::INTEGER:
    {
        long d = loader.GetIntArgument();
        return std::to_string(d);
    }
    case webifc::parsing::IfcTokenType::REF:
    {
        uint32_t ref = loader.GetRefArgument();
        return std::to_string(ref);
    }
    default:
        // use undefined to signal val parse issue
        return "";
    }
}

std::string GetArgs(webifc::parsing::IfcLoader &loader, bool inObject = false, bool inList = false)
{
    std::string arguments;
    size_t size = 0;
    bool endOfLine = false;
    while (!loader.IsAtEnd() && !endOfLine)
    {
        webifc::parsing::IfcTokenType t = loader.GetTokenType();

        switch (t)
        {
        case webifc::parsing::IfcTokenType::LINE_END:
        {
            endOfLine = true;
            break;
        }
        case webifc::parsing::IfcTokenType::EMPTY:
        {
            arguments += " Empty ";
            break;
        }
        case webifc::parsing::IfcTokenType::SET_BEGIN:
        {
            arguments += GetArgs(loader, false, true);
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
            std::string obj;
            obj = " type: LABEL ";
            loader.StepBack();
            auto s = loader.GetStringArgument();
            // read set open
            loader.GetTokenType();
            obj += " value " + GetArgs(loader, true) + " ";
            arguments += obj;
            break;
        }
        case webifc::parsing::IfcTokenType::STRING:
        case webifc::parsing::IfcTokenType::ENUM:
        case webifc::parsing::IfcTokenType::REAL:
        case webifc::parsing::IfcTokenType::INTEGER:
        case webifc::parsing::IfcTokenType::REF:
        {
            loader.StepBack();
            std::string obj;
            if (inObject)
                obj = ReadValue(loader, t);
            else
            {
                std::string obj;
                obj += " type REF ";
                obj += ReadValue(loader, t) + " ";
            }
            arguments += obj;
            break;
        }
        default:
            break;
        }
    }
    return arguments;
}

std::string GetLine(webifc::parsing::IfcLoader &loader, uint32_t expressID)
{
    if (!loader.IsValidExpressID(expressID))
        return "";
    uint32_t lineType = loader.GetLineType(expressID);
    if (lineType == 0)
        return "";

    loader.MoveToArgumentOffset(expressID, 0);

    auto arguments = GetArgs(loader);

    std::string retVal;
    retVal += "\"ID\": " + std::to_string(expressID) + ", ";
    retVal += "\"type\": " + std::to_string(lineType) + ", ";
    retVal += "\"arguments\": " + arguments;
    retVal += "}";

    return retVal;
}

std::vector<webifc::geometry::IfcFlatMesh> LoadAllTest(webifc::parsing::IfcLoader &loader, webifc::geometry::IfcGeometryProcessor &geometryLoader, uint32_t IdToExport)
{
    std::vector<webifc::geometry::IfcFlatMesh> meshes;
    webifc::schema::IfcSchemaManager schema;

    bool writeFiles = true;

    for (auto type : schema.GetIfcElementList())
    {
        auto elements = loader.GetExpressIDsWithType(type);

        for (unsigned int i = 0; i < elements.size(); i++)
        {
            auto mesh = geometryLoader.GetFlatMesh(elements[i]);

            if (mesh.expressID == IdToExport)
            {
                DumpFlatMesh(mesh, geometryLoader, "TEST_GEOM.obj");
            }

            for (auto &geom : mesh.geometries)
            {
                auto flatGeom = geometryLoader.GetGeometry(geom.geometryExpressID);
            }

            meshes.push_back(mesh);
        }
    }

    return meshes;
}

std::vector<webifc::geometry::SweptDiskSolid> GetAllRebars(webifc::parsing::IfcLoader &loader, webifc::geometry::IfcGeometryProcessor &geometryLoader)
{
    std::vector<webifc::geometry::SweptDiskSolid> reinforcingBars;
    std::vector<glm::dmat4> reinforcingBarsTransform;

    auto type = webifc::schema::IFCREINFORCINGBAR;

    auto elements = loader.GetExpressIDsWithType(type);

    for (size_t i = 0; i < elements.size(); i++)
    {
        auto mesh = geometryLoader.GetFlatMesh(elements[i]);

        for (auto &geom : mesh.geometries)
        {
            auto flatGeom = geometryLoader.GetGeometry(geom.geometryExpressID);
            reinforcingBars.push_back(flatGeom.sweptDiskSolid);
            reinforcingBarsTransform.push_back(geom.transformation);
        }
    }

    return reinforcingBars;
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

        std::string filePath = entry.path().string();
        std::string filename = entry.path().filename().string();

        std::string content = ReadFile(filePath);

        auto start = ms();
        {
            // loader.LoadFile(content);
        }
        auto time = ms() - start;

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
        for (unsigned int j = 0; j < PTS_PER_TEST; j++)
        {
            points.push_back({RandomDouble(0, scaleX),
                              RandomDouble(0, scaleY)});
        }

        // points along the edges
        for (unsigned int j = 0; j < EDGE_PTS_PER_TEST; j++)
        {
            glm::dvec2 e1 = b - a;
            glm::dvec2 e2 = c - a;
            glm::dvec2 e3 = b - c;

            points.push_back(a + e1 * RandomDouble(0, 1));
            points.push_back(a + e2 * RandomDouble(0, 1));
            points.push_back(c + e3 * RandomDouble(0, 1));
        }

        std::cout << "Start test " << i << std::endl;

        bool swapped = false;

        // webifc::IsValidTriangulation(triangles, points);

        std::vector<webifc::io::Point> pts;

        for (auto &pt : points)
        {
            webifc::io::Point p;
            p.x = pt.x;
            p.y = pt.y;
            pts.push_back(p);
        }
    }
}

int main()
{
    std::cout << "Hello web IFC test!" << std::endl;

    // TestTriangleDecompose();

    // return 0;

    // Benchmark();

    // return 0;

    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/VEC-IFC-INST-totaal-20130726.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/15.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/F_MA_160_ALT3.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/1256.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/540.ifc");
    std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/1092_A.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/Sample3_ArchiCAD25.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/384.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/Spacewell_Wall.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/1450.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/15.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/1544.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/800087_5217721a.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/818.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/bc-78.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/83.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/1506.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/TAR_E1A_LA_RVT_0001.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/1665.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/1677 (2).ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/1604.ifc");
    // std::string content = ReadFile("C:/Users/qmoya/Desktop/MODELS/fragments_89.ifc");

    struct LoaderSettings
    {
        bool COORDINATE_TO_ORIGIN = false;
        uint16_t CIRCLE_SEGMENTS = 12;
        uint32_t TAPE_SIZE = 67108864; // probably no need for anyone other than web-ifc devs to change this
        uint32_t MEMORY_LIMIT = 2147483648;
        uint16_t LINEWRITER_BUFFER = 10000;
        double TOLERANCE_PLANE_INTERSECTION = 1.0E-01;
        double TOLERANCE_PLANE_DEVIATION = 3.0E-04;
        double TOLERANCE_BACK_DEVIATION_DISTANCE = 3.0E-04;
        double TOLERANCE_INSIDE_OUTSIDE_PERIMETER = 1.0E-10;
        double TOLERANCE_SCALAR_EQUALITY = 1.0E-04;
        uint16_t PLANE_REFIT_ITERATIONS = 10;
        uint16_t BOOLEAN_UNION_THRESHOLD = 150;
    };

    LoaderSettings set;
    set.COORDINATE_TO_ORIGIN = true;

    webifc::schema::IfcSchemaManager schemaManager;
    webifc::parsing::IfcLoader loader(set.TAPE_SIZE, set.MEMORY_LIMIT, set.LINEWRITER_BUFFER, schemaManager);

    auto start = ms();
    loader.LoadFile([&](char *dest, size_t sourceOffset, size_t destSize)
                    {
                        uint32_t length = std::min(content.size() - sourceOffset, destSize);
                        memcpy(dest, &content[sourceOffset], length);

                        return length; });
    // std::ofstream outputStream("D:/web-ifc/benchmark/ifcfiles/output.ifc");
    // outputStream << loader.DumpAsIFC();
    // exit(0);
    auto time = ms() - start;

    std::cout << "Reading took " << time << "ms" << std::endl;

    // std::ofstream outputFile("output.ifc");
    // outputFile << loader.DumpSingleObjectAsIFC(14363);
    // outputFile.close();

    webifc::geometry::IfcGeometryProcessor geometryLoader(loader, schemaManager, set.CIRCLE_SEGMENTS, set.COORDINATE_TO_ORIGIN, set.TOLERANCE_PLANE_INTERSECTION, set.TOLERANCE_PLANE_DEVIATION, set.TOLERANCE_BACK_DEVIATION_DISTANCE, set.TOLERANCE_INSIDE_OUTSIDE_PERIMETER, set.TOLERANCE_SCALAR_EQUALITY, set.PLANE_REFIT_ITERATIONS, set.BOOLEAN_UNION_THRESHOLD);

    start = ms();
    SpecificLoadTest(loader, geometryLoader, 85583); //1092_A
    // SpecificLoadTest(loader, geometryLoader, 44230); //1677 (2)
    // SpecificLoadTest(loader, geometryLoader, 1229); //1665
    // SpecificLoadTest(loader, geometryLoader, 146); //1604
    // SpecificLoadTest(loader, geometryLoader, 543139); // 
    // SpecificLoadTest(loader, geometryLoader, 350038); // 
    // SpecificLoadTest(loader, geometryLoader, 252); // 1506
    // SpecificLoadTest(loader, geometryLoader, 407); // 1450
    // SpecificLoadTest(loader, geometryLoader, 1125); // 1544
    // SpecificLoadTest(loader, geometryLoader, 92180); // 15
    // SpecificLoadTest(loader, geometryLoader, 140426); //1256
    // SpecificLoadTest(loader, geometryLoader, 107287);
    // SpecificLoadTest(loader, geometryLoader, 437004); // 540
    // SpecificLoadTest(loader, geometryLoader, 165617); // 1092_A
    // SpecificLoadTest(loader, geometryLoader, 36487);
    // SpecificLoadTest(loader, geometryLoader, 1201);
    // auto meshes = LoadAllTest(loader, geometryLoader, 85583);
    // auto meshes = LoadAllTest(loader, geometryLoader, 85261);
    // auto rebars = GetAllRebars(loader, geometryLoader);
    // std::cout << GetLine(loader, 13) << std::endl;
    // auto alignments = GetAlignments(loader, geometryLoader);

    time = ms() - start;

    std::cout << "Generating geometry took " << time << "ms" << std::endl;

    std::cout << "Done" << std::endl;
}
