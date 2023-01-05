#set up cmake to download the external projects
include(ExternalProject)
cmake_policy(SET CMP0054 NEW)
cmake_minimum_required (VERSION 3.18)

#transfer the arguments from the emcmake into variables to pass to manifold
list(APPEND CMAKE_ARGS "-DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE}")
list(APPEND CMAKE_ARGS "-DCMAKE_BUILD_TYPE=Release")
list(GET CMAKE_CROSSCOMPILING_EMULATOR 0 CROSS_COMPILER)
list(APPEND CMAKE_ARGS "-DCMAKE_CROSSCOMPILING_EMULATOR=${CROSS_COMPILER}")
list(APPEND CMAKE_ARGS_MT "-DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE}")
list(APPEND CMAKE_ARGS_MT "-DCMAKE_BUILD_TYPE=Release")
list(APPEND CMAKE_ARGS_MT "-DCMAKE_CROSSCOMPILING_EMULATOR=${CROSS_COMPILER}")
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

set (
	WebIfcFiles
	${WebIfcCoreFiles}
	${WebIfcMathFiles}
	${WebIfcParsingFiles}
	${WebIfcSourceFiles}
)

set (WebIfcTestFiles ${WebIfcTestSourceFiles})

#set the command needed to patch manifold
set(manifold_patch_command git apply ${CMAKE_BINARY_DIR}/manifold/src/manifold/thrust.diff || cd .)
set(manifold_mt_patch_command git apply ${CMAKE_BINARY_DIR}/manifold_mt/src/manifold_mt/thrust.diff || cd .)

#download the external projects and save their paths
ExternalProject_Add(tinynurbs GIT_REPOSITORY "https://github.com/pradeep-pyro/tinynurbs" GIT_TAG "2fc6562d71665312c6298f7c340bace1bcf1b7a1" PREFIX "tinynurbs" CONFIGURE_COMMAND "" BUILD_COMMAND "" INSTALL_COMMAND "")
ExternalProject_Get_property(tinynurbs SOURCE_DIR)
set(TINYNURBS_SOURCE_DIR ${SOURCE_DIR})

ExternalProject_Add(tinycpptest GIT_REPOSITORY "https://github.com/kovacsv/TinyCppTest" GIT_TAG "12e42c8ac6e032ce450fb3f772ebdfd1ddc6008c" PREFIX "tinycpptest" CONFIGURE_COMMAND "" BUILD_COMMAND "" INSTALL_COMMAND "")
ExternalProject_Get_property(tinycpptest SOURCE_DIR)
set(TINYCPPTEST_SOURCE_DIR ${SOURCE_DIR})
if (EMSCRIPTEN)
	ExternalProject_Add(manifold GIT_REPOSITORY "https://github.com/elalish/manifold" GIT_TAG "491d7d8045d75b0c0b025d3c8a9a65d121d50786" PREFIX "manifold" PATCH_COMMAND "${manifold_patch_command}" CMAKE_ARGS ${CMAKE_ARGS} INSTALL_COMMAND "")
	ExternalProject_Get_property(manifold SOURCE_DIR)
	set(MANIFOLD_SOURCE_DIR ${SOURCE_DIR})
	ExternalProject_Get_property(manifold BINARY_DIR)
	set(MANIFOLD_BINARY_DIR ${BINARY_DIR})

	list(APPEND CMAKE_ARGS_MT "-DCMAKE_CXX_FLAGS=-pthread")
	list(APPEND CMAKE_ARGS_MT "-DCMAKE_EXE_LINKER_FLAGS=-pthread")
	
	ExternalProject_Add(manifold_mt GIT_REPOSITORY "https://github.com/elalish/manifold" GIT_TAG "491d7d8045d75b0c0b025d3c8a9a65d121d50786" PREFIX "manifold_mt" PATCH_COMMAND "${manifold_mt_patch_command}" CMAKE_ARGS ${CMAKE_ARGS_MT}  INSTALL_COMMAND "")
	ExternalProject_Get_property(manifold_mt SOURCE_DIR)
	set(MANIFOLD_MT_SOURCE_DIR ${SOURCE_DIR})
	ExternalProject_Get_property(manifold_mt BINARY_DIR)
	set(MANIFOLD_MT_BINARY_DIR ${BINARY_DIR})
endif()

ExternalProject_Add(glm GIT_REPOSITORY "https://github.com/g-truc/glm" GIT_TAG "bf71a834948186f4097caa076cd2663c69a10e1e" PREFIX "glm" CONFIGURE_COMMAND "" BUILD_COMMAND "" INSTALL_COMMAND "")
ExternalProject_Get_property(glm SOURCE_DIR)
set(GLM_SOURCE_DIR ${SOURCE_DIR})

ExternalProject_Add(earcut GIT_REPOSITORY "https://github.com/mapbox/earcut.hpp" GIT_TAG "4811a2b69b91f6127a75e780de6e2113609ddabb" PREFIX "earcut" CONFIGURE_COMMAND "" BUILD_COMMAND "" INSTALL_COMMAND "")
ExternalProject_Get_property(earcut SOURCE_DIR)
set(EARCUT_SOURCE_DIR ${SOURCE_DIR})

if (EMSCRIPTEN)
	#build parameters for web-ifc
	add_executable (web-ifc ${WebIfcFiles})
	target_include_directories(web-ifc PUBLIC ${TINYNURBS_SOURCE_DIR}/include)
	target_include_directories(web-ifc PUBLIC ${MANIFOLD_SOURCE_DIR}/src)
	target_include_directories(web-ifc PUBLIC ${MANIFOLD_SOURCE_DIR}/src/utilities/include)
	target_include_directories(web-ifc PUBLIC ${GLM_SOURCE_DIR})
	target_include_directories(web-ifc PUBLIC ${EARCUT_SOURCE_DIR}/include)
	target_link_libraries(web-ifc ${MANIFOLD_BINARY_DIR}/src/collider/libcollider.a)
	target_link_libraries(web-ifc ${MANIFOLD_BINARY_DIR}/src/manifold/libmanifold.a)
	target_link_libraries(web-ifc ${MANIFOLD_BINARY_DIR}/src/polygon/libpolygon.a)
	target_link_libraries(web-ifc ${MANIFOLD_BINARY_DIR}/src/utilities/libutilities.a)
	target_link_libraries(web-ifc ${MANIFOLD_BINARY_DIR}/src/third_party/graphlite/libgraphlite.a)
	set_target_properties(web-ifc PROPERTIES LINK_FLAGS "${DEBUG_FLAG} --bind -03 -flto --define-macro=REAL_T_IS_DOUBLE -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -s FORCE_FILESYSTEM=1 -s EXPORT_NAME=WebIFCWasm -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=[\"FS, WORKERFS\"] -lworkerfs.js")
	
	#multi-treaded versions
	add_executable (web-ifc-mt ${WebIfcFiles})
	target_include_directories(web-ifc-mt PUBLIC ${TINYNURBS_SOURCE_DIR}/include)
	target_include_directories(web-ifc-mt PUBLIC ${MANIFOLD_SOURCE_DIR}/src)
	target_include_directories(web-ifc-mt PUBLIC ${MANIFOLD_SOURCE_DIR}/src/utilities/include)
	target_include_directories(web-ifc-mt PUBLIC ${GLM_SOURCE_DIR})
	target_include_directories(web-ifc-mt PUBLIC ${EARCUT_SOURCE_DIR}/include)
	target_link_libraries(web-ifc-mt ${MANIFOLD_MT_BINARY_DIR}/src/collider/libcollider.a)
	target_link_libraries(web-ifc-mt ${MANIFOLD_MT_BINARY_DIR}/src/manifold/libmanifold.a)
	target_link_libraries(web-ifc-mt ${MANIFOLD_MT_BINARY_DIR}/src/polygon/libpolygon.a)
	target_link_libraries(web-ifc-mt ${MANIFOLD_MT_BINARY_DIR}/src/utilities/libutilities.a)
	target_link_libraries(web-ifc-mt ${MANIFOLD_MT_BINARY_DIR}/src/third_party/graphlite/libgraphlite.a)
	target_compile_options(web-ifc-mt PUBLIC "-pthread")
	set_target_properties(web-ifc-mt PROPERTIES LINK_FLAGS "${DEBUG_FLAG} -pthread -s PTHREAD_POOL_SIZE=navigator.hardwareConcurrency --bind -03 -flto --define-macro=REAL_T_IS_DOUBLE -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -s FORCE_FILESYSTEM=1 -s EXPORT_NAME=WebIFCWasm -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=[\"FS, WORKERFS\"] -lworkerfs.js")
endif()


if (NOT EMSCRIPTEN)
	#build parameters for web-ifc-test
	add_executable (web-ifc-test ${WebIfcTestFiles})
	target_include_directories(web-ifc-test PUBLIC ${TINYNURBS_SOURCE_DIR}/include)
	target_include_directories(web-ifc-test PUBLIC ${MANIFOLD_SOURCE_DIR}/src)
	target_include_directories(web-ifc-test PUBLIC ${MANIFOLD_SOURCE_DIR}/src/utilities/include)
	target_include_directories(web-ifc-test PUBLIC ${GLM_SOURCE_DIR})
	target_include_directories(web-ifc-test PUBLIC ${EARCUT_SOURCE_DIR}/include)
	target_include_directories(web-ifc-test PUBLIC ${TINYCPPTEST_SOURCE_DIR}/Sources)
	add_test (web-ifc-test web-ifc-test)
endif()
