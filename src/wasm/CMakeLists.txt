cmake_minimum_required (VERSION 3.11)

project (web-ifc)

enable_testing ()

set (CMAKE_CXX_STANDARD 17)
set (CMAKE_CXX_STANDARD_REQUIRED ON)
set (CMAKE_CXX_EXTENSIONS OFF)
set_property (GLOBAL PROPERTY USE_FOLDERS ON)

file (GLOB WebIfcCoreFiles include/*.h)
file (GLOB WebIfcMathFiles include/math/*.h)
file (GLOB WebIfcParsingFiles include/parsing/*.h)
file (GLOB WebIfcSourceFiles web-ifc-test.cpp)

set (
	WebIfcFiles
	${WebIfcCoreFiles}
	${WebIfcMathFiles}
	${WebIfcParsingFiles}
	${WebIfcSourceFiles}
)
source_group ("core" FILES ${WebIfcCoreFiles})
source_group ("math" FILES ${WebIfcMathFiles})
source_group ("parsing" FILES ${WebIfcParsingFiles})
source_group ("sources" FILES ${WebIfcSourceFiles})

add_executable (web-ifc ${WebIfcFiles})

file (GLOB WebIfcTestSourceFiles test/*.cpp)
set (WebIfcTestFiles ${WebIfcTestSourceFiles})
add_executable (web-ifc-test ${WebIfcTestFiles})
source_group ("Tests" FILES ${WebIfcTestSourceFiles})
add_test (web-ifc-test web-ifc-test)
