
<p align="center">
  <a href="https://ifcjs.github.io/info/">ifc.js</a>
  |
  <a href="https://tomvandig.github.io/web-ifc/examples/viewer/index.html">demo</a>
  |
  <a href="https://discord.com/invite/g7Uzn2KSwB">discord</a>
  |
  <a href="https://github.com/tomvandig/web-ifc/tree/main/examples/usage/src">usage examples</a>
  |
  <a href="https://www.npmjs.com/package/web-ifc">npm package</a>
  |
  <a href="https://github.com/tomvandig/web-ifc/blob/main/contributing.md">contributing</a>
</p>

<img src="banner.png">
<h1>web-ifc <img src="https://ifcjs.github.io/info/img/logo.svg" width="32"></h1>

[![Build](https://github.com/tomvandig/web-ifc/actions/workflows/build.yml/badge.svg)](https://github.com/tomvandig/web-ifc/actions/workflows/build.yml)
![npm](https://img.shields.io/npm/dw/web-ifc)

**web-ifc** is a javascript library to read and write ifc files, at native speeds. **web-ifc** is part of the [ifc.js](https://ifcjs.github.io/info/) project, which aims to lower the threshold for developing open BIM applications.

## Status

Although it is quite stable and fast already, web-ifc is in **pre-alpha status** until ifc support matures. The list of currently supported ifc elements, or level of support for different ifc types, is an undocumented work in progress. 

Depending on your models, web-ifc may be quick and correct, or slow and broken, please share any problematic models so I can take a look :)

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

See [examples](https://github.com/tomvandig/web-ifc/tree/main/examples/usage/src) for more details on how to use web-ifc.

## Building WASM module

### Setting up emscripten

The WASM library is built through emscripten, please see [the emscripten installation guide](https://emscripten.org/docs/getting_started/downloads.html) for information on how to set up emscripten. Afterwards both `setup-env` and `em++` need to be in your path.

### WASM library

Run `npm install` to install all dependencies.

Run `npm run setup-env` whenever you open a new terminal, this will set up the required emscripten environment variables for you to compile code.

Run `npm run build-release-all` to build a release version of the wasm binary and the accompanying web-ifc api. It will be placed in `./dist`.

Run `npm run dev` to launch a development server with a basic ifc file viewer.

## Stand alone C++

Although the primary focus of the library is to be used through WebAssembly in the browser/nodejs, the project can be used stand-alone as a c++ library or executable. See [here](https://github.com/tomvandig/web-ifc/blob/main/src/wasm/web-ifc-test.cpp) for a simple entry point to get started.

## Contributing

Want to help out? Great!

Please checkout [our contribution suggestsions](https://github.com/tomvandig/web-ifc/blob/main/contributing.md).
