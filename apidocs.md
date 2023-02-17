
<img src="banner.png">
<h1>web-ifc <img src="https://ifcjs.github.io/info/img/logo.svg" width="32">API documentation</h1>

**web-ifc** is a javascript library to read and write ifc files, at native speeds. **web-ifc** is part of the [ifc.js](https://ifcjs.github.io/info/) project, which aims to lower the threshold for developing open BIM applications.

## Documentation

This is the documentation for the web API. The best place to start is at the IfcAPI class <a href="classes/web_ifc.IfcAPI.html">here</a>.

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

## Requirements

These are the requirements needed to build web-ifc (only for those that wish to build their own version).

1. Node v16 or later
2. NPM v7 or later
3. EMSCRIPTEN v3.1.27 or later
4. CMAKE v3.18 or later

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

