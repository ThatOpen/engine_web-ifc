//Stores the path of the WASM file in a global variable that can be configured from outside

const fs = require("fs");

const buildFile = "dist/web-ifc-api.js";
const wasmPathDeclaration = '\n\n var WasmPath = "";';
const oldWasmPath = /var wasmBinaryFile = "web-ifc.wasm";/;
const newWasmPath = 'var wasmBinaryFile = WasmPath + "web-ifc.wasm";';

fs.appendFile(buildFile, wasmPathDeclaration, (err) => {
  if (err) return console.log(err);
});

fs.readFile(buildFile, "utf8", (err, data) => {
  if (err) return console.error(err);
  
  const result = data.replace(oldWasmPath, newWasmPath);
  fs.writeFile(buildFile, result, "utf8", (err) => {
    if (err) return console.log(err);
  });
});
