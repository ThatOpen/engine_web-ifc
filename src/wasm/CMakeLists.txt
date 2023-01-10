#set up cmake to download the external projects
include(FetchContent)
cmake_policy(SET CMP0054 NEW)
cmake_minimum_required (VERSION 3.18)

if (CMAKE_BUILD_TYPE STREQUAL "Debug")
	message("Building In Debug Mode")
	set(DEBUG_FLAG "-g")
else()
	set(DEBUG_FLAG "")
endif()

project (web-ifc LANGUAGES CXX)
enable_testing ()

set (CMAKE_CXX_STANDARD 17)
set (CMAKE_CXX_STANDARD_REQUIRED ON)
set (CMAKE_CXX_EXTENSIONS OFF)
set_property (GLOBAL PROPERTY USE_FOLDERS ON)

#collect source files
file (GLOB WebIfcCoreFiles include/*.h)
file (GLOB WebIfcMathFiles include/math/*.h)
file (GLOB WebIfcParsingFiles include/parsing/*.h)
file (GLOB WebIfcSourceFiles web-ifc-api.cpp)
file (GLOB WebIfcTestSourceFiles test/*.cpp)
file (GLOB WebIfcTestingMain web-ifc-test.cpp)

set (
	WebIfcFiles
	${WebIfcCoreFiles}
	${WebIfcMathFiles}
	${WebIfcParsingFiles}
	${WebIfcSourceFiles}
)

set (WebIfcTestFiles ${WebIfcTestSourceFiles})

#download the external projects and save their paths
Message("Downloading TinyNURBS")
FetchContent_Declare(tinynurbs GIT_REPOSITORY "https://github.com/pradeep-pyro/tinynurbs" GIT_TAG "2fc6562d71665312c6298f7c340bace1bcf1b7a1" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(tinynurbs)
FetchContent_GetProperties(tinynurbs)

Message("Downloading TinyCPPTest")
FetchContent_Declare(tinycpptest GIT_REPOSITORY "https://github.com/kovacsv/TinyCppTest" GIT_TAG "12e42c8ac6e032ce450fb3f772ebdfd1ddc6008c" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(tinycpptest)
FetchContent_GetProperties(tinycpptest)

Message("Downloading GLM")
FetchContent_Declare(glm GIT_REPOSITORY "https://github.com/g-truc/glm" GIT_TAG "bf71a834948186f4097caa076cd2663c69a10e1e" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(glm)
FetchContent_GetProperties(glm)

Message("Downloading Earcut")
FetchContent_Declare(earcut GIT_REPOSITORY "https://github.com/mapbox/earcut.hpp" GIT_TAG "4811a2b69b91f6127a75e780de6e2113609ddabb" SOURCE_SUBDIR "../")
FetchContent_MakeAvailable(earcut)
FetchContent_GetProperties(earcut)

Message("Downloading Manifold")
#set the command needed to patch manifold
set(manifold_patch_command git apply ${CMAKE_BINARY_DIR}/_deps/manifold-src/thrust.diff || cd .)
FetchContent_Declare(manifold GIT_REPOSITORY "https://github.com/elalish/manifold" GIT_TAG "a701d2be8e6b59969e070fdb6b38a7357237e754" PATCH_COMMAND "${manifold_patch_command}")
FetchContent_MakeAvailable(manifold)
FetchContent_GetProperties(manifold)
target_compile_options(manifold PUBLIC "-pthread")
target_compile_options(collider PUBLIC "-pthread")
target_compile_options(polygon PUBLIC "-pthread")
target_compile_options(graphlite PUBLIC "-pthread")
set_target_properties(samples PROPERTIES EXCLUDE_FROM_ALL TRUE)
set_target_properties(samplesGPU PROPERTIES EXCLUDE_FROM_ALL TRUE)
set_target_properties(manifold_test PROPERTIES EXCLUDE_FROM_ALL TRUE)
set_target_properties(perfTest PROPERTIES EXCLUDE_FROM_ALL TRUE)
set_target_properties(gtest_main PROPERTIES EXCLUDE_FROM_ALL TRUE)
set_target_properties(gmock_main PROPERTIES EXCLUDE_FROM_ALL TRUE)
set_target_properties(gtest PROPERTIES EXCLUDE_FROM_ALL TRUE)
set_target_properties(gmock PROPERTIES EXCLUDE_FROM_ALL TRUE)


Message("Downloads Finished")


if (EMSCRIPTEN)
	set_target_properties(manifoldjs PROPERTIES EXCLUDE_FROM_ALL TRUE)
	
	#build parameters for web-ifc
	add_executable (web-ifc ${WebIfcFiles})
	target_include_directories(web-ifc PUBLIC ${tinynurbs_SOURCE_DIR}/include)
	target_include_directories(web-ifc PUBLIC ${manifold_SOURCE_DIR}/src)
	target_include_directories(web-ifc PUBLIC ${manifold_SOURCE_DIR}/src/utilities/include)
	target_include_directories(web-ifc PUBLIC ${glm_SOURCE_DIR})
	target_include_directories(web-ifc PUBLIC ${earcut_SOURCE_DIR}/include)
	target_link_libraries(web-ifc manifold)
	target_compile_options(web-ifc PUBLIC "-Wall")
	set_target_properties(web-ifc PROPERTIES LINK_FLAGS "${DEBUG_FLAG} --bind -03 -flto --define-macro=REAL_T_IS_DOUBLE -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -s FORCE_FILESYSTEM=1 -s EXPORT_NAME=WebIFCWasm -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=[\"FS, WORKERFS\"] -lworkerfs.js")
		

	#multi-treaded versions
	add_executable (web-ifc-mt ${WebIfcFiles})
	target_include_directories(web-ifc-mt PUBLIC ${tinynurbs_SOURCE_DIR}/include)
	target_include_directories(web-ifc-mt PUBLIC ${manifold_SOURCE_DIR}/src)
	target_include_directories(web-ifc-mt PUBLIC ${manifold_SOURCE_DIR}/src/utilities/include)
	target_include_directories(web-ifc-mt PUBLIC ${glm_SOURCE_DIR})
	target_include_directories(web-ifc-mt PUBLIC ${earcut_SOURCE_DIR}/include)
	target_link_libraries(web-ifc-mt manifold)
	target_compile_options(web-ifc-mt PUBLIC "-pthread")
	target_compile_options(web-ifc-mt PUBLIC "-Wall")
	set_target_properties(web-ifc-mt PROPERTIES LINK_FLAGS "${DEBUG_FLAG} -pthread -s PTHREAD_POOL_SIZE=navigator.hardwareConcurrency --bind -03 -flto --define-macro=REAL_T_IS_DOUBLE -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -s FORCE_FILESYSTEM=1 -s EXPORT_NAME=WebIFCWasm -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=[\"FS, WORKERFS\"] -lworkerfs.js")
endif()


if (NOT EMSCRIPTEN)

	#build parameters for web-ifc-test
	add_executable (web-ifc-test ${WebIfcTestFiles})
	target_include_directories(web-ifc-test PUBLIC ${tinynurbs_SOURCE_DIR}/include)
	target_include_directories(web-ifc-test PUBLIC ${manifold_SOURCE_DIR}/src)
	target_include_directories(web-ifc-test PUBLIC ${manifold_SOURCE_DIR}/src/utilities/include)
	target_include_directories(web-ifc-test PUBLIC ${glm_SOURCE_DIR})
	target_include_directories(web-ifc-test PUBLIC ${earcut_SOURCE_DIR}/include)
	target_include_directories(web-ifc-test PUBLIC ${tinycpptest_SOURCE_DIR}/Sources)
	target_compile_options(web-ifc-test PUBLIC "-Wall")
	add_test (web-ifc-test web-ifc-test)
	set_tests_properties(web-ifc-test PROPERTIES LABELS "web-ifc")
	
	#build parameters for web-ifc in testing environment
	add_executable (web-ifc ${WebIfcTestingMain})
	target_include_directories(web-ifc PUBLIC ${tinynurbs_SOURCE_DIR}/include)
	target_include_directories(web-ifc PUBLIC ${manifold_SOURCE_DIR}/src)
	target_include_directories(web-ifc PUBLIC ${manifold_SOURCE_DIR}/src/utilities/include)
	target_include_directories(web-ifc PUBLIC ${glm_SOURCE_DIR})
	target_include_directories(web-ifc PUBLIC ${earcut_SOURCE_DIR}/include)
	target_include_directories(web-ifc PUBLIC ${tinycpptest_SOURCE_DIR}/Sources)
	target_link_libraries(web-ifc manifold)
	target_compile_options(web-ifc PUBLIC "-Wall")
endif()
