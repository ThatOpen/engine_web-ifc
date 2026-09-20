# set up cmake to download the external projects
include(FetchContent)
cmake_policy(SET CMP0054 NEW)
cmake_minimum_required(VERSION 3.28)

if(CMAKE_BUILD_TYPE STREQUAL "Debug")
	message("Building In Debug Mode")
	set(RELEASE false)
	set(DEBUG_FLAG "-g -O3")
else()
	set(DEBUG_FLAG "-O3")
	set(RELEASE true)
endif()

project(web-ifc LANGUAGES CXX)
enable_testing()

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set_property(GLOBAL PROPERTY USE_FOLDERS ON)

option(WEB_IFC_WASM_NATIVE_EXCEPTIONS "Use native WebAssembly exception handling (requires a compatible runtime)" ON)
option(BUILD_SHARED_LIBS "Build web-ifc as a shared library instead of static" OFF)
set(WEB_IFC_WASM_EXCEPTION_FLAG "-fexceptions")
if(WEB_IFC_WASM_NATIVE_EXCEPTIONS)
	set(WEB_IFC_WASM_EXCEPTION_FLAG "-fwasm-exceptions")
endif()

# collect source files
file(GLOB_RECURSE web-ifc-source web-ifc/*.cpp)
file(GLOB_RECURSE web-ifc-wasm wasm/*.cpp)

# download the external projects and save their paths
Message("Downloading FastFloat")
FetchContent_Declare(fastfloat GIT_REPOSITORY "https://github.com/fastfloat/fast_float" GIT_TAG "b0ab987b3dfdde13fa1915f65ef2a5c068d9208c" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(fastfloat)

Message("Downloading TinyNURBS")
FetchContent_Declare(tinynurbs GIT_REPOSITORY "https://github.com/QuimMoya/tinynurbs" GIT_TAG "47115cd9b6e922b27bbc4ab01fdeac2e9ea597a4" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(tinynurbs)

Message("Downloading TinyCPPTest")
FetchContent_Declare(tinycpptest GIT_REPOSITORY "https://github.com/kovacsv/TinyCppTest" GIT_TAG "12e42c8ac6e032ce450fb3f772ebdfd1ddc6008c" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(tinycpptest)

Message("Downloading GLM")
FetchContent_Declare(glm GIT_REPOSITORY "https://github.com/g-truc/glm" GIT_TAG "8d1fd52e5ab5590e2c81768ace50c72bae28f2ed" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(glm)

Message("Downloading Earcut")
FetchContent_Declare(earcut GIT_REPOSITORY "https://github.com/mapbox/earcut.hpp" GIT_TAG "c68c8835ccff2b7532d31d8fa8dfcf398f629498" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(earcut)

Message("Downloading CDT")
FetchContent_Declare(cdt GIT_REPOSITORY "https://github.com/artem-ogre/CDT" GIT_TAG "2068d015b9db3c92481e869b0c1f669b96a1d70a" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(cdt)

Message("Downloading spdlog")
FetchContent_Declare(spdlog GIT_REPOSITORY "https://github.com/gabime/spdlog" GIT_TAG "79524ddd08a4ec981b7fea76afd08ee05f83755d" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(spdlog)

Message("Downloading StdUUID")
FetchContent_Declare(stduuid GIT_REPOSITORY "https://github.com/mariusbancila/stduuid" GIT_TAG "3afe7193facd5d674de709fccc44d5055e144d7a" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(stduuid)

Message("Downloading unordered_dense")
FetchContent_Declare(unordered_dense GIT_REPOSITORY "https://github.com/martinus/unordered_dense" GIT_TAG "1c8636e810d7e4a485d17bb9cbd6dccb5fe4e284" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(unordered_dense)

Message("Downloads Finished")

function(PARAM_SETTER THE_EXECUTABLE)
	target_include_directories(${THE_EXECUTABLE} PUBLIC 
		$<BUILD_INTERFACE:${glm_SOURCE_DIR}/>
		$<BUILD_INTERFACE:${glm_SOURCE_DIR}/glm>
	)

	target_include_directories(${THE_EXECUTABLE} PRIVATE
		$<BUILD_INTERFACE:${tinynurbs_SOURCE_DIR}/include>
		$<BUILD_INTERFACE:${fastfloat_SOURCE_DIR}/include>
		$<BUILD_INTERFACE:${cdt_SOURCE_DIR}/CDT/include>
		$<BUILD_INTERFACE:${earcut_SOURCE_DIR}/include>
		$<BUILD_INTERFACE:${spdlog_SOURCE_DIR}/include>
		$<BUILD_INTERFACE:${stduuid_SOURCE_DIR}/include>
		$<BUILD_INTERFACE:${unordered_dense_SOURCE_DIR}/include>
	)

	if(NOT MSVC)
		target_compile_options(${THE_EXECUTABLE} PUBLIC "-Wall")
		target_compile_options(${THE_EXECUTABLE} PUBLIC "-Wextra")
		target_compile_options(${THE_EXECUTABLE} PUBLIC "-Wpedantic")
		target_compile_options(${THE_EXECUTABLE} PUBLIC "-pedantic")
		target_compile_options(${THE_EXECUTABLE} PUBLIC "-std=c++20")

		if(EMSCRIPTEN)
			target_compile_options(${THE_EXECUTABLE} PUBLIC "-fexperimental-library")
			# Enable C++ exception catching in the WASM build so the geometry
			# engine's recovery guards (e.g. BoolProcess try/catch) work instead
			# of aborting the whole module on a recoverable throw.
			target_compile_options(${THE_EXECUTABLE} PUBLIC "${WEB_IFC_WASM_EXCEPTION_FLAG}" "-msimd128")
			if(RELEASE)
				# LTO needs bitcode from the compilation step, not only a linker flag.
				target_compile_options(${THE_EXECUTABLE} PUBLIC "-flto")
			endif()
		endif()

		if(RELEASE)
			target_compile_options(${THE_EXECUTABLE} PUBLIC "-O3")
		endif()
	else()
		# Force UTF-8 for Windows MSVC
		target_compile_options(${THE_EXECUTABLE} PUBLIC "/utf-8")
		target_compile_options(${THE_EXECUTABLE} PUBLIC "-std:c++latest")
	endif()
endfunction()

if(EMSCRIPTEN)
	# build parameters for web-ifc
	add_executable(web-ifc ${web-ifc-source} ${web-ifc-wasm})
	param_setter(web-ifc)
	set_target_properties(web-ifc PROPERTIES LINK_FLAGS "${DEBUG_FLAG} ${WEB_IFC_WASM_EXCEPTION_FLAG} --bind -msimd128 -flto --define-macro=REAL_T_IS_DOUBLE -s ALLOW_MEMORY_GROWTH=1 -s DYNAMIC_EXECUTION=0 -s MAXIMUM_MEMORY=4GB -sSTACK_SIZE=5MB -s EXPORT_NAME=WebIFCWasm -s MODULARIZE=1 -s ENVIRONMENT=web  -sASSERTIONS=1 -s EXPORTED_RUNTIME_METHODS=\"['HEAPU8','HEAPU32','HEAPF32']\"")

	add_executable(web-ifc-node ${web-ifc-source} ${web-ifc-wasm})
	param_setter(web-ifc-node)
	set_target_properties(web-ifc-node PROPERTIES LINK_FLAGS "${DEBUG_FLAG} ${WEB_IFC_WASM_EXCEPTION_FLAG} --bind -msimd128 -flto --define-macro=REAL_T_IS_DOUBLE -s ALLOW_MEMORY_GROWTH=1 -s DYNAMIC_EXECUTION=0 -s MAXIMUM_MEMORY=4GB -sSTACK_SIZE=5MB -s EXPORT_NAME=WebIFCWasm -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=\"['HEAPU8','HEAPU32','HEAPF32']\"")

	# multi-treaded versions
	add_executable(web-ifc-mt ${web-ifc-source} ${web-ifc-wasm})
	param_setter(web-ifc-mt)
	target_compile_options(web-ifc-mt PUBLIC "-pthread")
	set_target_properties(web-ifc-mt PROPERTIES LINK_FLAGS "${DEBUG_FLAG} ${WEB_IFC_WASM_EXCEPTION_FLAG} -msimd128 -pthread -s PTHREAD_POOL_SIZE=navigator.hardwareConcurrency --bind -flto --define-macro=REAL_T_IS_DOUBLE -sSTACK_SIZE=5MB -s ALLOW_MEMORY_GROWTH=1 -s DYNAMIC_EXECUTION=0 -s MAXIMUM_MEMORY=4GB -s EXPORT_NAME=WebIFCWasm -s MODULARIZE=1 -s ENVIRONMENT=web,worker")
endif()

if(NOT EMSCRIPTEN)
	include(GNUInstallDirs)
	include(CMakePackageConfigHelpers)

	# build web-ifc as a static or shared library (controlled by BUILD_SHARED_LIBS)
	add_library(web-ifc-library ${web-ifc-source})
	param_setter(web-ifc-library)

	# Export symbols on Windows (Needed for shared library)
	set_target_properties(web-ifc-library PROPERTIES WINDOWS_EXPORT_ALL_SYMBOLS ON)

	# Add generator expressions for install support
	target_include_directories(web-ifc-library PUBLIC
		$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
		$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/web-ifc>
		$<INSTALL_INTERFACE:${CMAKE_INSTALL_INCLUDEDIR}>
		$<INSTALL_INTERFACE:${CMAKE_INSTALL_INCLUDEDIR}/web-ifc>
	)

	# build parameters for web-ifc-test
	add_executable(web-ifc-test ${web-ifc-source} "./test/encoding_test.cpp" "./test/main.cpp" "./test/io_helpers.cpp")
	param_setter(web-ifc-test)
	target_include_directories(web-ifc-test PUBLIC ${tinycpptest_SOURCE_DIR}/Sources)

	add_test(web-ifc-test web-ifc-test)
	set_tests_properties(web-ifc-test PROPERTIES LABELS "web-ifc")

	# build parameters for web-ifc in testing environment
	add_executable(web-ifc ${web-ifc-source} "./test/web-ifc-test.cpp" "./test/io_helpers.cpp")
	param_setter(web-ifc)
	target_include_directories(web-ifc PUBLIC ${tinycpptest_SOURCE_DIR}/Sources)

	# comment these to prevent debug files being generated
	if(NOT RELEASE)
		target_compile_options(web-ifc PUBLIC "-DCSG_DEBUG_OUTPUT")
		target_compile_options(web-ifc PUBLIC "-DDEBUG_DUMP_SVG")
	endif()

	# Installation rules
	# Install the static library
	install(TARGETS web-ifc-library
		EXPORT web-ifc-targets
		ARCHIVE DESTINATION ${CMAKE_INSTALL_LIBDIR}
		LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
		RUNTIME DESTINATION ${CMAKE_INSTALL_LIBDIR}
	)

	# Install web-ifc headers
	install(DIRECTORY web-ifc/
		DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}/web-ifc
		FILES_MATCHING
		PATTERN "*.h"
		PATTERN "mesh_utils.h" EXCLUDE
		PATTERN "geometryutils.h" EXCLUDE
		PATTERN "shared-position.h" EXCLUDE
		PATTERN "utils.h" EXCLUDE
	)

	# Install version.h
	install(FILES version.h
		DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}/web-ifc
	)

	# Install bundled dependency headers (all header-only)
	install(DIRECTORY ${glm_SOURCE_DIR}/glm 
		DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}
	)
	
	# Export targets with namespace
	install(EXPORT web-ifc-targets
		FILE web-ifc-targets.cmake
		NAMESPACE web-ifc::
		DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/web-ifc
	)

	# Generate and install CMake config file
	configure_package_config_file(
		${CMAKE_CURRENT_SOURCE_DIR}/cmake/web-ifc-config.cmake.in
		${CMAKE_CURRENT_BINARY_DIR}/web-ifc-config.cmake
		INSTALL_DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/web-ifc
	)

	install(FILES ${CMAKE_CURRENT_BINARY_DIR}/web-ifc-config.cmake
		DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/web-ifc
	)
endif()
