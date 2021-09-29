# web-ifc

[![Build](https://github.com/tomvandig/web-ifc/actions/workflows/build.yml/badge.svg)](https://github.com/tomvandig/web-ifc/actions/workflows/build.yml)

# Warning: this is pre-alpha software, an experimental backend for IFC.js

Web ifc is a WASM-based ifc parser & geometry generator. This repository contains the c++/typescript source code.

https://www.npmjs.com/package/web-ifc

[Example viewer application using ThreeJS](https://tomvandig.github.io/web-ifc/examples/viewer/index.html)

## Installing the library as an npm dependency

`npm install web-ifc`

## Using the library

See `examples` for different ways to use web-ifc.

For a short intro, this is how to use the library from javascript:

```JavaScript
const WebIFC = require("web-ifc/web-ifc-api.js");

// initialize the API
const ifcApi = new WebIFC.IfcAPI();

// initialize the library
await ifcApi.Init();

// open a model from data
let modelID = ifcApi.OpenModel(/* IFC data as a string or UInt8Array */, /* optional settings object */, );

// the model is now loaded! use modelID to fetch geometry or properties
// checkout examples/usage for some details on how to read/write IFC

// close the model, all memory is freed
ifcApi.CloseModel(modelID);

```

## Building the library

### Setting up emscripten

The WASM library is built through emscripten, please see [the emscripten installation guide](https://emscripten.org/docs/getting_started/downloads.html) for information on how to set up emscripten. Afterwards both `setup-env` and `em++` need to be in your path.

### WASM library

Run `npm install` to install all dependencies.

Run `npm run setup-env` whenever you open a new terminal, this will set up the required emscripten environment variables for you to compile code.

Run `npm run build-release` to build a release version of the wasm binary and the accompanying web-ifc api. It will be placed in `./dist`.

Run `npm run dev` to launch a development server with a basic ifc file viewer.


### Stand alone C++ executable

Compiling the library to a standalone executable requires use of CMAKE. For visual studio code, the easiest way is by installing [cmake-tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools).

## Using the library as a C++ dependency

The library is header only, the files in `web-ifc-cpp` can be trivially included in any project. The library depends on [GLM](https://github.com/g-truc/glm) and [earcut](https://github.com/mapbox/earcut.hpp).


# Contributing

Want to help out? Great!

Please checkout [our contribution suggestsions](https://github.com/tomvandig/web-ifc/blob/main/contributing.md).
