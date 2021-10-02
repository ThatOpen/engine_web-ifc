/**
 * Convert emscripted JS file to TS
 */

const fs = require("fs");

let data = fs.readFileSync('wasm/build/web-ifc.js', "utf8");

data = '// @ts-nocheck \n' + data;

data = data.replace('var WebIFCWasm', 'export const WebIFCWasm');

const end = '})();';
data = data.slice(0, data.indexOf(end) + end.length );

fs.writeFileSync('src/web-ifc.ts', data, 'utf8');