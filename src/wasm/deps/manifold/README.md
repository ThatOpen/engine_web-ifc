## Environment

I used win64, emcc v3.1.12, additionally cmake 3.20.21032501-MSVC_2, mingw32-make 3.82.90 (in MinGW setup from https://osdn.net/projects/mingw/ include mingw32-base to get it) to build manifold:

`set PATH=%PATH%;C:\MinGW\bin` - change to your mingw32-make path;
`set PATH=%PATH%;C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin` - change to your cmake path.


## Build manifold

This folder comes a couple of .h files and pre-built .a files that should make this build procedure unnecessary. But, if you need to reproduce this build (or build more recent manifold version), follow these steps:

`git clone git@github.com:elalish/manifold.git && cd manifold` from deps folder to get the source;

`git checkout 5d25c9c` (optional) skip if you are upgrading manifold;

`git submodule update --init --recursive`

Then, modify CMakeLists.txt and third_party/CMakeLists.txt like it is done here (just copy them over if you are building from 5d25c9c) - this is mostly to avoid building assimp and google test;

`mkdir release && cd release`
`emcmake cmake -DCMAKE_TOOLCHAIN_FILE=C:\Users\Makc\emsdk\upstream\emscripten\cmake\Modules\Platform\Emscripten.cmake -DCMAKE_BUILD_TYPE=Release ..` - this command should be checked with the one in manifold.yml if you are upgrading;

OR

`mkdir release-mt && cd release-mt`
`emcmake cmake -DCMAKE_TOOLCHAIN_FILE=C:\Users\Makc\emsdk\upstream\emscripten\cmake\Modules\Platform\Emscripten.cmake -DCMAKE_BUILD_TYPE=Release -DEMSCRIPTEN_PTHREADS=ON ..` - to build with pthreads;

Finally, `emmake make`.
