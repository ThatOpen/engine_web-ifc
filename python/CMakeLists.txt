cmake_minimum_required(VERSION 3.18)
project(webifc-python LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
if(NOT CMAKE_BUILD_TYPE)
	set(CMAKE_BUILD_TYPE Release)
endif()

# Core engine (FetchContent pulls header-only deps; needs network on first configure)
set(WEBIFC_BUILD_TESTS OFF)
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/../src/cpp webifc_core)

find_package(Python COMPONENTS Interpreter Development.Module NumPy REQUIRED)

# Cythonize
set(WEBIFC_PYX ${CMAKE_CURRENT_SOURCE_DIR}/webifc/_webifc.pyx)
set(WEBIFC_CXX ${CMAKE_CURRENT_BINARY_DIR}/_webifc.cpp)
add_custom_command(
	OUTPUT ${WEBIFC_CXX}
	COMMAND ${Python_EXECUTABLE} -m cython --cplus -3 ${WEBIFC_PYX} -o ${WEBIFC_CXX}
	DEPENDS ${WEBIFC_PYX}
	VERBATIM
)

python_add_library(_webifc MODULE ${WEBIFC_CXX} ${CMAKE_CURRENT_SOURCE_DIR}/bridge/pybridge.cpp WITH_SOABI)
target_include_directories(_webifc PRIVATE
	${CMAKE_CURRENT_SOURCE_DIR}/bridge
	${CMAKE_CURRENT_SOURCE_DIR}/../src/cpp/web-ifc
	${CMAKE_CURRENT_SOURCE_DIR}/../src/cpp/web-ifc/parsing
	${CMAKE_CURRENT_SOURCE_DIR}/../src/cpp/web-ifc/modelmanager
	${Python_NumPy_INCLUDE_DIRS}
)
target_link_libraries(_webifc PRIVATE web-ifc-library)
target_compile_definitions(_webifc PRIVATE NPY_NO_DEPRECATED_API=NPY_1_7_API_VERSION)

install(TARGETS _webifc DESTINATION webifc)
