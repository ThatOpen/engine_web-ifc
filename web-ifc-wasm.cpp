
#include <stdio.h>
#include <string>
#include <fstream>
#include <sstream>

#include "web-ifc-cpp/web-ifc.h"

std::vector<webifc::IfcLoader> loaders;

// use to construct API placeholders
int main() {
    loaders.emplace_back();
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

extern "C" int OpenModel(const std::string& filename)
{
    std::string content = ReadFile(filename);

    webifc::IfcLoader loader;
    uint32_t modelID = loaders.size();
    loaders.push_back(loader);
    loaders[modelID].LoadFile(content);

    return modelID;
}

extern "C" void CloseModel(uint32_t modelID)
{
    webifc::IfcLoader loader;

    // overwrite old loader, thereby destructing it
    loaders[modelID] = loader;
}

extern "C" bool IsModelOpen(uint32_t modelID)
{
    return loaders[modelID].IsOpen();
}

struct s
{
    const char* str;
    int32_t strLen;
    int32_t test;
};

s bla;

extern "C" s* getString()
{
    bla.str = "asdfÉÎÐÑáąğƇ";
    bla.strLen = strlen(bla.str);
    bla.test = 31;

    return &bla;
}