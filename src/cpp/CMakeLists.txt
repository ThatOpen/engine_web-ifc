# set up cmake to download the external projects
include(FetchContent)
cmake_policy(SET CMP0054 NEW)
cmake_minimum_required(VERSION 3.18)

if(CMAKE_BUILD_TYPE STREQUAL "Debug")
	message("Building In Debug Mode")
	set(RELEASE false)
	set(DEBUG_FLAG "-g")
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

# collect source files
file(GLOB_RECURSE web-ifc-source web-ifc/*.cpp)
file(GLOB_RECURSE web-ifc-wasm wasm/*.cpp)

# download the external projects and save their paths
Message("Downloading FastFloat")
FetchContent_Declare(fastfloat GIT_REPOSITORY "https://github.com/fastfloat/fast_float" GIT_TAG "2b2395f9ac836ffca6404424bcc252bff7aa80e4" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(fastfloat)
FetchContent_GetProperties(fastfloat)

Message("Downloading TinyNURBS")
FetchContent_Declare(tinynurbs GIT_REPOSITORY "https://github.com/QuimMoya/tinynurbs" GIT_TAG "47115cd9b6e922b27bbc4ab01fdeac2e9ea597a4" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(tinynurbs)
FetchContent_GetProperties(tinynurbs)

Message("Downloading TinyCPPTest")
FetchContent_Declare(tinycpptest GIT_REPOSITORY "https://github.com/kovacsv/TinyCppTest" GIT_TAG "12e42c8ac6e032ce450fb3f772ebdfd1ddc6008c" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(tinycpptest)
FetchContent_GetProperties(tinycpptest)

Message("Downloading GLM")
FetchContent_Declare(glm GIT_REPOSITORY "https://github.com/g-truc/glm" GIT_TAG "0af55ccecd98d4e5a8d1fad7de25ba429d60e863" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(glm)
FetchContent_GetProperties(glm)

Message("Downloading Earcut")
FetchContent_Declare(earcut GIT_REPOSITORY "https://github.com/mapbox/earcut.hpp" GIT_TAG "4811a2b69b91f6127a75e780de6e2113609ddabb" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(earcut)
FetchContent_GetProperties(earcut)

Message("Downloading CDT")
FetchContent_Declare(cdt GIT_REPOSITORY "https://github.com/artem-ogre/CDT" GIT_TAG "4d0c9026b8ec846fe544897e7111f8f9080d5f8a" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(cdt)
FetchContent_GetProperties(cdt)

Message("Downloading spdlog")
FetchContent_Declare(spdlog GIT_REPOSITORY "https://github.com/gabime/spdlog" GIT_TAG "f355b3d58f7067eee1706ff3c801c2361011f3d5" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(spdlog)
FetchContent_GetProperties(spdlog)

Message("Downloading StdUUID")
FetchContent_Declare(stduuid GIT_REPOSITORY "https://github.com/mariusbancila/stduuid" GIT_TAG "3afe7193facd5d674de709fccc44d5055e144d7a" EXCLUDE_FROM_ALL)
FetchContent_MakeAvailable(stduuid)
FetchContent_GetProperties(stduuid)


Message("Downloads Finished")

function(PARAM_SETTER THE_EXECUTABLE)
	target_include_directories(${THE_EXECUTABLE} PUBLIC ${tinynurbs_SOURCE_DIR}/include)
	target_include_directories(${THE_EXECUTABLE} PUBLIC ${fastfloat_SOURCE_DIR}/include)
	target_include_directories(${THE_EXECUTABLE} PUBLIC ${cdt_SOURCE_DIR}/CDT/include)
	target_include_directories(${THE_EXECUTABLE} PUBLIC ${glm_SOURCE_DIR}/)
	target_include_directories(${THE_EXECUTABLE} PUBLIC ${glm_SOURCE_DIR}/glm)
	target_include_directories(${THE_EXECUTABLE} PUBLIC ${earcut_SOURCE_DIR}/include)
	target_include_directories(${THE_EXECUTABLE} PUBLIC ${spdlog_SOURCE_DIR}/include)
	target_include_directories(${THE_EXECUTABLE} PUBLIC ${stduuid_SOURCE_DIR}/include)

	if(NOT MSVC)
		target_compile_options(${THE_EXECUTABLE} PUBLIC "-Wall")
		target_compile_options(${THE_EXECUTABLE} PUBLIC "-Wextra")
		target_compile_options(${THE_EXECUTABLE} PUBLIC "-Wpedantic")
		target_compile_options(${THE_EXECUTABLE} PUBLIC "-pedantic")
		target_compile_options(${THE_EXECUTABLE} PUBLIC "-std=c++20")

		if(EMSCRIPTEN)
			target_compile_options(${THE_EXECUTABLE} PUBLIC "-fexperimental-library")
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
	set_target_properties(web-ifc PROPERTIES LINK_FLAGS "${DEBUG_FLAG} --bind -flto --define-macro=REAL_T_IS_DOUBLE -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -sSTACK_SIZE=5MB -s EXPORT_NAME=WebIFCWasm -s MODULARIZE=1 -s ENVIRONMENT=web  -sASSERTIONS=1 -s EXPORTED_RUNTIME_METHODS=\"['HEAPU8','HEAPU32','HEAPF32']\"")

	add_executable(web-ifc-node ${web-ifc-source} ${web-ifc-wasm})
	param_setter(web-ifc-node)
	set_target_properties(web-ifc-node PROPERTIES LINK_FLAGS "${DEBUG_FLAG} --bind -flto --define-macro=REAL_T_IS_DOUBLE -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -sSTACK_SIZE=5MB -s EXPORT_NAME=WebIFCWasm -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=\"['HEAPU8','HEAPU32','HEAPF32']\"")

	# multi-treaded versions
	add_executable(web-ifc-mt ${web-ifc-source} ${web-ifc-wasm})
	param_setter(web-ifc-mt)
	target_compile_options(web-ifc-mt PUBLIC "-pthread")
	set_target_properties(web-ifc-mt PROPERTIES LINK_FLAGS "${DEBUG_FLAG} -pthread -s PTHREAD_POOL_SIZE=navigator.hardwareConcurrency --bind -flto --define-macro=REAL_T_IS_DOUBLE -sSTACK_SIZE=5MB -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -s EXPORT_NAME=WebIFCWasm -s MODULARIZE=1 -s ENVIRONMENT=web,worker")
endif()

if(NOT EMSCRIPTEN)
	# build web-ifc as a static library
	add_library(web-ifc-library STATIC ${web-ifc-source})
	param_setter(web-ifc-library)

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
endif()
