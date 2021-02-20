# web-ifc

Web ifc is a WASM-based ifc parser & geometry generator. This repository contains the c++/typescript source code.

https://www.npmjs.com/package/web-ifc

## Installing the library as an npm dependency

`npm install web-ifc`

## Installing the library as a C++ dependency

The library is header only, the files in `web-ifc-cpp` can be trivially included in any project. The library depends on [GLM](https://github.com/g-truc/glm) and [earcut](https://github.com/mapbox/earcut), which it expects in a folder `./deps` in the root of the project (pending change).

## Using the library

See `examples` for different ways to use web-ifc.

## Compiling the library

### C++ executable

Compiling the library to a standalone executable requires use of CMAKE. For visual studio code, the easiest way is by installing [cmake-tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools).

### WASM library

The WASM library is built through emscripten, please see [the emscripten installation guide](https://emscripten.org/docs/getting_started/downloads.html) for information on how to set up emscripten. Afterwards the library can be built by using:
`.\wasm_setup_env.bat` and `.\wasm_compile.ps1`.