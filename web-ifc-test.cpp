
#include <iostream>
#include <fstream>

#include "web-ifc-src/web-ifc.h"
#include "web-ifc-src/web-ifc-geometry.h"
#include "web-ifc-src/ifc2x3.h"

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

int main()
{
    std::cout << "Hello web IFC test!\n";

    // std::wstring filename = L"B:\\ifcfiles\\UpTown.ifc";
    std::wstring filename = L"B:\\ifcfiles\\02_BIMcollab_Example_STR_optimized.ifc";

    std::string content = ReadFile(filename);

    webifc::IfcLoader loader;

    auto start = webifc::ms();
    loader.LoadFile(content);
    auto time = webifc::ms() - start;

    std::cout << "Reading took " << time << "ms" << std::endl;

    start = webifc::ms();

    auto walls = loader.GetExpressIDsWithType(ifc2x3::IFCWALLSTANDARDCASE);

    webifc::IfcGeometryLoader geometryLoader(loader);


    auto mesh = geometryLoader.GetMesh(walls[16]);
    geometryLoader.DumpMesh(mesh, L"TEST.obj");

        for (int i = 0; i < walls.size(); i++)
    {
        auto mesh = geometryLoader.GetMesh(walls[i]);
        geometryLoader.DumpMesh(mesh, L"IFCOPENINGELEMENT" + std::to_wstring(i) + L".obj");
    }
    time = webifc::ms() - start;


    std::cout << walls.size() << " elements" << std::endl;
    std::cout << "Generating geometry took " << time << "ms" << std::endl;

    std::cout << "Done" << std::endl;
}
