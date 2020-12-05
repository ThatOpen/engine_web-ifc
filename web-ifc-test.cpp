
#include <iostream>
#include <fstream>

#include "web-ifc-src/web-ifc.h"

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

    std::cout << "Took " << time << "ms" << std::endl;

    std::cout << "Done" << std::endl;
}
