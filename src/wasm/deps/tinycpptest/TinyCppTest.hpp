// https://github.com/kovacsv/TinyCppTest
// Version: 0.1.1

#ifndef TINYCPPTEST_HPP
#define TINYCPPTEST_HPP

#include <iostream>
#include <vector>
#include <string>
#include <memory>
#include <cmath>

#ifdef _WIN32
#include <windows.h>
#endif

#define WIN_PATH_SEPARATOR	L'\\'
#define PATH_SEPARATOR		L'/'

namespace TinyCppTest
{

enum class ConsoleColor
{
	Normal,
	Red,
	Green
};

#ifdef _WIN32
class ColoredConsoleWriter
{
public:
	ColoredConsoleWriter (ConsoleColor consoleColor) :
		consoleColor (consoleColor),
		consoleHandle (NULL)
	{
		consoleHandle = GetStdHandle (STD_OUTPUT_HANDLE);
		GetConsoleScreenBufferInfo (consoleHandle, &screenBufferInfo);
	}

	~ColoredConsoleWriter ()
	{
		SetConsoleTextAttribute (consoleHandle, screenBufferInfo.wAttributes);
	}

	void Write (const std::string& text)
	{
		if (consoleColor == ConsoleColor::Green) {
			SetConsoleTextAttribute (consoleHandle, FOREGROUND_GREEN | FOREGROUND_INTENSITY);
		} else if (consoleColor == ConsoleColor::Red) {
			SetConsoleTextAttribute (consoleHandle, FOREGROUND_RED | FOREGROUND_INTENSITY);
		}
		std::cout << text;
		SetConsoleTextAttribute (consoleHandle, screenBufferInfo.wAttributes);
	}

private:
	ConsoleColor consoleColor;
	HANDLE consoleHandle;
	CONSOLE_SCREEN_BUFFER_INFO screenBufferInfo;
};
#else
class ColoredConsoleWriter
{
public:
	ColoredConsoleWriter (ConsoleColor consoleColor) :
		consoleColor (consoleColor)
	{
	}

	~ColoredConsoleWriter ()
	{
	}

	void Write (const std::string& text)
	{
		if (consoleColor == ConsoleColor::Green) {
			std::cout << "\033[32m";
		} else if (consoleColor == ConsoleColor::Red) {
			std::cout << "\033[31m";
		}
		std::cout << text;
		std::cout << "\033[39m";
	}

private:
	ConsoleColor consoleColor;
};
#endif

class Test
{
public:
	Test (const std::string& testName) :
		testName (testName),
		testSuccess (true)
	{

	}

	virtual ~Test ()
	{

	}
	
	bool Run ()
	{
		ColoredConsoleWriter green (ConsoleColor::Green);
		ColoredConsoleWriter red (ConsoleColor::Red);
		green.Write ("[ RUNNING ] ");
		std::cout << testName;
		RunTest ();
		if (testSuccess) {
			std::cout << std::endl;
			green.Write ("[ SUCCESS ]");
		} else {
			red.Write ("[ FAILURE ]");
		}
		std::cout << " " << testName << std::endl;
		return testSuccess;
	}

	const std::string& GetName () const
	{
		return testName;
	}

protected:
	void TestAssert (bool condition, const std::string& fileName, int lineNumber)
	{
		if (!condition) {
			if (testSuccess) {
				std::cout << std::endl;
			}
			std::cout << "Assertion failed: " << fileName << " (" << lineNumber << ")" << std::endl;
#ifdef _WIN32
			OutputDebugStringA (fileName.c_str ());
			OutputDebugStringA ("(");
			OutputDebugStringA (std::to_string (lineNumber).c_str ());
			OutputDebugStringA ("): Assertion failed\n");
#endif
			testSuccess = false;
		}
	}

	virtual void RunTest () = 0;

	std::string testName;
	bool testSuccess;
};

class Suite
{
public:
	Suite () :
		tests (),
		appLocation ()
	{

	}

	bool Run ()
	{
		ColoredConsoleWriter green (ConsoleColor::Green);
		ColoredConsoleWriter red (ConsoleColor::Red);
		green.Write ("[ ------- ] ");
		std::cout << "Running " << tests.size () << " tests." << std::endl;
		std::vector<std::string> failedTestNames;
		for (const std::shared_ptr<Test>& test : tests) {
			if (!test->Run ()) {
				failedTestNames.push_back (test->GetName ());
			}
		}
		green.Write ("[ ------- ] ");
		std::cout << "Finished running " << tests.size () << " tests." << std::endl << std::endl;
		bool success = (failedTestNames.empty ());
		if (success) {
			green.Write ("[ ------- ] ");
			std::cout << std::endl;
			green.Write ("[ SUCCESS ] ");
			std::cout << "All tests succeeeded." << std::endl;
			green.Write ("[ ------- ] ");
		} else {
			red.Write ("[ ------- ] ");
			std::cout << std::endl;
			red.Write ("[ FAILURE ] ");
			std::cout << "The following tests are failed:" << std::endl;
			for (const std::string& failedTestName : failedTestNames) {
				red.Write ("[ FAILURE ] ");
				std::cout << failedTestName << std::endl;
			}
			red.Write ("[ ------- ] ");
		}
		std::cout << std::endl;
		return success;
	}

	void AddTest (Test* test)
	{
		tests.push_back (std::shared_ptr<Test> (test));
	}

	const std::wstring& GetAppLocation () const
	{
		return appLocation;
	}

	void SetAppLocation (const std::wstring& newAppLocation)
	{
		appLocation = newAppLocation;
	}

	static Suite& Get ()
	{
		static Suite suite;
		return suite;
	}

private:
	std::vector<std::shared_ptr<Test>> tests;
	std::wstring appLocation;
};

inline void SetAppLocation (const std::wstring& newAppLocation)
{
	std::wstring appLocation = newAppLocation;
	for (size_t i = 0; i < appLocation.length (); ++i) {
		if (appLocation[i] == WIN_PATH_SEPARATOR) {
			appLocation[i] = PATH_SEPARATOR;
		}
	}
	Suite& suite = Suite::Get ();
	suite.SetAppLocation (appLocation);
}

inline std::wstring GetAppLocation ()
{
	const Suite& suite = Suite::Get ();
	return suite.GetAppLocation ();
}

inline std::wstring GetAppFolderLocation ()
{
	std::wstring appLocation = GetAppLocation ();
	size_t lastSeparator = appLocation.find_last_of (PATH_SEPARATOR);
	if (lastSeparator == std::wstring::npos) {
		return std::wstring ();
	}
	std::wstring directoryPath = appLocation.substr (0, lastSeparator) + PATH_SEPARATOR;
	return directoryPath;
}

inline bool RunTests ()
{
	Suite& suite = Suite::Get ();
	return suite.Run ();
}

inline void RegisterTest (Test* test)
{
	Suite& suite = Suite::Get ();
	suite.AddTest (test);
}

}

#define TEST(TESTNAME)												\
class TESTNAME##_Test : public TinyCppTest::Test {					\
public:																\
	TESTNAME##_Test () :											\
		TinyCppTest::Test (#TESTNAME)								\
	{																\
	}																\
	virtual void RunTest () override;								\
};																	\
static class TESTNAME##_Registrator {								\
	public:															\
		TESTNAME##_Registrator ()									\
		{															\
			TinyCppTest::RegisterTest (new TESTNAME##_Test ());		\
		}															\
} TESTNAME##_RegistratorInstance;									\
void TESTNAME##_Test::RunTest ()

#define ASSERT(condition) TestAssert (condition, __FILE__, __LINE__)
#define ASSERT_EQ(a, b) TestAssert (a == b, __FILE__, __LINE__)
#define ASSERT_NEQ(a, b) TestAssert (a != b, __FILE__, __LINE__)
#define ASSERT_EQ_EPS(a, b, eps) TestAssert (std::fabs (a - b) < eps, __FILE__, __LINE__)
#define ASSERT_NEQ_EPS(a, b, eps) TestAssert (std::fabs (a - b) >= eps, __FILE__, __LINE__)

#endif
