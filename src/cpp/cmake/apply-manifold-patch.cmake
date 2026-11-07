# Temporary compatibility fix for the pinned Manifold 3.5.4.
# Upstream removed this code path in https://github.com/elalish/manifold/pull/1790;
# master b36ab18 passes our touching-shell reproducer without the patch.
# When upgrading to a release containing that change, rerun the touching-shell
# regressions without the patch, then remove this helper, its CMakeLists.txt
# include and patches/manifold-preserve-face-orientation.patch.
#
# The dependency is pinned; fail configuration if its source no longer matches
# the reviewed fix. Also support repeated configuration and source overrides.
find_package(Git REQUIRED)
set(patch "${CMAKE_CURRENT_LIST_DIR}/patches/manifold-preserve-face-orientation.patch")
execute_process(COMMAND "${GIT_EXECUTABLE}" apply --reverse --check "${patch}"
    WORKING_DIRECTORY "${manifold_SOURCE_DIR}"
    RESULT_VARIABLE already_applied OUTPUT_QUIET ERROR_QUIET)
if(NOT already_applied EQUAL 0)
    execute_process(COMMAND "${GIT_EXECUTABLE}" apply "${patch}"
        WORKING_DIRECTORY "${manifold_SOURCE_DIR}"
        RESULT_VARIABLE patch_result ERROR_VARIABLE patch_error)
    if(NOT patch_result EQUAL 0)
        message(FATAL_ERROR "Cannot apply the Manifold orientation fix: ${patch_error}")
    endif()
endif()
