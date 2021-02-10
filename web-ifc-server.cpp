
#include <iostream>
#include <fstream>

#include "web-ifc-cpp/web-ifc.h"

#include <httplib.h>

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
    std::cout << "IFC web server test!\n";

    //std::wstring filename = L"B:\\ifcfiles\\UpTown.ifc";
    std::wstring filename = L"B:\\ifcfiles\\02_BIMcollab_Example_STR_optimized.ifc";
    //std::wstring filename = L"B:\\ifcfiles\\01_BIMcollab_Example_ARC_optimized.ifc";
    //std::wstring filename = L"B:\\ifcfiles\\IFC Schependomlaan.ifc";
    //std::wstring filename = L"B:\\ifcfiles\\0912104-04slab_recess_tek_1.ifc";

    std::string content = ReadFile(filename);

    webifc::IfcLoader loader;

    auto start = webifc::ms();
    loader.LoadFile(content);
    auto time = webifc::ms() - start;

    std::cout << "Reading took " << time << "ms" << std::endl;

    auto refs = loader.GetRefs();

    start = webifc::ms();
    for (int i = 0; i < 100; i++)
    {
        std::set<uint32_t> allRefs;
        loader.GetAllRefs(allRefs, 67);
    }
    time = webifc::ms() - start;

    std::cout << "Query took " << time << "ms" << std::endl;


    httplib::Server svr;

    uint8_t* buffer = new uint8_t[1024 * 1024]; // 1mb

    svr.Get(R"(/expressID/(\d+))", [&](const httplib::Request& req, httplib::Response& res) {
        std::string numbers = req.matches[1];
        int expressID = std::stoi(numbers);

        std::cout << "Fetching: " << expressID << std::endl;


        std::set<uint32_t> allRefs;
        loader.GetAllRefs(allRefs, expressID);
        std::cout << "Got: " << allRefs.size() << " refs" << std::endl;

        uint32_t bufferOffset = 0;

        for (auto ref : allRefs)
        {
            bufferOffset += loader.CopyTapeForExpressLine(ref, &buffer[bufferOffset]);
        }

        std::cout << "Buffer size bytes: " << bufferOffset <<  std::endl;

        res.set_content(std::string((char*)buffer, bufferOffset), "text/plain");
    });

    svr.Get("/stop", [&](const httplib::Request& req, httplib::Response& res) {
        svr.stop();
    });

    svr.listen("localhost", 1234);

    std::cout << "Done" << std::endl;
}
