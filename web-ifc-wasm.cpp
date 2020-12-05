
#include <stdio.h>
#include <string>
#include <fstream>
#include <sstream>


extern "C" int functionCall(std::string p)
{
    //printf("hello from function call !\n");

    std::ifstream t("/filename");
    t.seekg(0, std::ios::end);
    size_t size = t.tellg();
    std::string buffer(size, ' ');
    t.seekg(0);
    t.read(&buffer[0], size);

    //printf("Find semis !\n");
    int count = 0;
    for (int i = 0; i < size; i++)
    {
        count += (buffer[i] == ';');
    }

    //printf("%d\n", count);
    return count;
}

int main() {
  printf("hello, world 3 !\n");
  return 0;
}