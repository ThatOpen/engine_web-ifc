<p align="center">
  <a href="https://thatopen.com/">TOC</a>
  |
  <a href="https://thatopen.github.io/engine_web-ifc/docs">web-ifc documentation</a>
  |
  <a href="https://docs.thatopen.com/intro"> platform documentation</a>
  |
  <a href="https://thatopen.github.io/engine_web-ifc/demo">demo</a>
  |
  <a href="https://people.thatopen.com/">community</a>
  |
  <a href="https://www.npmjs.com/package/web-ifc">npm package</a>
</p>

![cover](banner.png)

<h1>Web IFC <img src="https://thatopen.github.io/engine_components/resources/favicon.ico" width="32"/></h1>

[![NPM Package][npm]][npm-url]
[![NPM Package][npm-downloads]][npm-url]

**web-ifc** is a javascript library to read and write ifc files, at native speeds. **web-ifc** is part of the [That Open Company](https://thatopen.com) project, which aims to lower the threshold for developing open BIM applications.

## Install

`npm install web-ifc`

## Quick setup

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

See [examples](https://github.com/ThatOpen/engine_web-ifc/tree/main/examples/usage) for more details on how to use web-ifc.

## Current Build

The current live build of web-ifc is available [here](https://thatopen.github.io/engine_web-ifc/build.zip). Using this allows you to test newest fixes before we make a release. If you wish to use this version then download the zip file and place the contents of the dist folder manually into your node_modules/web-ifc folder. I.e if you are using web-ifc-three then it will be node_modules/web-ifc-three/node_modules/web-ifc. Please note you must replace the javascript and the WASM.

## Requirements

These are the requirements needed to build web-ifc (only for those that wish to build their own version).

1. Node v16 or later
2. NPM v7 or later
3. EMSCRIPTEN v3.1.44 or later
4. CMAKE v3.18 or later

## Regression Testing

We have a library of test models in the tests/public folder. If you have a model you would like to contribute please open a PR.

You can run regression tests on all these models by running `npm run regression`. It will alert you if any of the sample model geometry has changed. If the change is correct you can refresh the regression tests by running `npm run regression-update`.

## Building WASM module

### Setting up emscripten and build system

The WASM library is built through emscripten, please see [the emscripten installation guide](https://emscripten.org/docs/getting_started/downloads.html) for information on how to set up emscripten. Afterwards `emsdk_env` needs to be in your path.

To build the WASM you also need CMAKE [see here](https://cmake.org/download/) and (on windows) MINGW [see here](https://sourceforge.net/projects/mingw/) - once installed (and in your path) run `npm run setup-mingw` to configure the environment for web-ifc.

### WASM library

Run `npm install` to install all dependencies.

Run `npm run setup-env` whenever you open a new terminal, this will set up the required emscripten environment variables for you to compile code.

Run `npm run build-release` to build a release version of the wasm binary and the accompanying web-ifc api. It will be placed in `./dist`.

If you wish to build the WASM with debugging enabled you can run `npm run build-debug`. This will enable you to inspect debugging information better when running web-ifc.

Run `npm run dev` to launch a development server with a basic ifc file viewer.

### Build Files

The output of the build process consts of the following files:

1. web-ifc.wasm - The wasm (compiled C++) to run in the browser
2. web-ifc-mt.wasm - The wasm (compiled C++) to run in the browser if multi-threading is supported.
3. web-ifc-node.wasm - The wasm (compiled C++) to run in node
4. web-ifc-api-node.js - Compiled javascript wrapper for the wasm to run in node.
5. web-ifc-api-node.d.ts - Typescript definitions for the web-ifc api (for node)
6. web-ifc-api.js - Compiled javascript wrapper for the wasm to run in browser.
7. web-ifc-api.d.ts - Typescript definitions for the main web-ifc API
8. ifc-schema.d.ts - Typescript definitions for the IFC schema
9. helpers/properties.d.ts - Typescript definitions for the properties aspect of the web-ifc API
10. helpers/log.d.ts - Typescript definitions for the logger aspect of the web-ifc API
11. web-ifc-mt.worker.js - Webworker javascript to enable multi-threading in the browser.

## Stand alone C++

Although the primary focus of the library is to be used through WebAssembly in the browser/nodejs, the project can be used stand-alone as a c++ library or executable. See [here](https://github.com/ThatOpen/engine_web-ifc/blob/main/src/cpp/test/web-ifc-test.cpp) for a simple entry point to get started.

[npm]: https://img.shields.io/npm/v/web-ifc
[npm-url]: https://www.npmjs.com/package/web-ifc
[npm-downloads]: https://img.shields.io/npm/dw/web-ifc
