/**
 * Convert emscripted JS file to TS 
 * and add global variable `WasmPath` 
 * to configure .wasm file path.
 */

const fs = require("fs");

let data = fs.readFileSync('wasm/build/web-ifc.js', "utf8");

data = '// @ts-nocheck \n' + data;

data = data.replace('var WebIFCWasm', 'export const WebIFCWasm');

data = data.replace('"web-ifc.wasm"', 'WasmPath+"web-ifc.wasm"');

const end = '})();';
data = data.slice(0, data.indexOf(end) + end.length );

data += '\n\nvar WasmPath = "";';

fs.writeFileSync('src/web-ifc.ts', data, 'utf8');