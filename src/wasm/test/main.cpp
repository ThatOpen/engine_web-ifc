#include <TinyCppTest.hpp>

int main (int, char* argv[])
{
	std::string executablePath (argv[0]);
	std::wstring wExecutablePath (executablePath.begin (), executablePath.end ());
	TinyCppTest::SetAppLocation (wExecutablePath);
	if (!TinyCppTest::RunTests ()) {
		return 1;
	}
	return 0;
}
