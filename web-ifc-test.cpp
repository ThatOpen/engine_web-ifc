
#include <iostream>
#include <fstream>

#include "web-ifc-cpp/web-ifc.h"
#include "web-ifc-cpp/web-ifc-geometry.h"
#include "web-ifc-schema/ifc2x4.h"

std::string ReadFile(std::wstring filename)
{
    std::ifstream t(filename);
    t.seekg(0, std::ios::end);
    size_t size = t.tellg();
    std::string buffer(size, ' ');
    t.seekg(0);
    t.read(&buffer[0], size);

    return buffer;
}

void SpecificLoadTest(webifc::IfcLoader& loader, webifc::IfcGeometryLoader& geometryLoader)
{
    auto walls = loader.GetExpressIDsWithType(ifc2x4::IFCOPENINGELEMENT);

    bool writeFiles = false;
    auto mesh = geometryLoader.GetMesh(walls[88]);
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

void LoadAllTest(webifc::IfcLoader& loader, webifc::IfcGeometryLoader& geometryLoader)
{
    for (auto type : ifc2x4::IfcElements)
    {
        auto elements = loader.GetExpressIDsWithType(type);

        for (int i = 0; i < elements.size(); i++)
        {
            auto mesh = geometryLoader.GetMesh(elements[i]);
        }
    }
}

int main()
{
    std::cout << "Hello web IFC test!\n";

    //std::wstring filename = L"B:\\ifcfiles\\UpTown.ifc";
    //std::wstring filename = L"B:\\ifcfiles\\02_BIMcollab_Example_STR_optimized.ifc";
    //std::wstring filename = L"B:\\ifcfiles\\01_BIMcollab_Example_ARC_optimized.ifc";
    std::wstring filename = L"B:\\ifcfiles\\IFC Schependomlaan.ifc";

    std::string content = ReadFile(filename);

    webifc::IfcLoader loader;

    auto start = webifc::ms();
    loader.LoadFile(content);
    auto time = webifc::ms() - start;

    std::cout << "Reading took " << time << "ms" << std::endl;

    start = webifc::ms();

    webifc::IfcGeometryLoader geometryLoader(loader);

    //SpecificLoadTest(loader, geometryLoader);
    LoadAllTest(loader, geometryLoader);

    time = webifc::ms() - start;

    std::cout << "Generating geometry took " << time << "ms" << std::endl;

    std::cout << "Done" << std::endl;
}
