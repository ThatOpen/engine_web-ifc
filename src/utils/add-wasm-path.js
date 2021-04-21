//Stores the path of the WASM file in a global variable that can be configured from outside

const fs = require("fs");

var buildFile = "dist/web-ifc-api.js";
var wasmPathDeclaration = '\n\n var WasmPath = "";';
var oldWasmPath = /var wasmBinaryFile = "web-ifc.wasm";/;
var newWasmPath = 'var wasmBinaryFile = WasmPath + "web-ifc.wasm";';

fs.appendFile(buildFile, wasmPathDeclaration, function (err) {
  if (err) return console.log(err);
});

fs.readFile(buildFile, "utf8", (err, data) => {
  if (err) return console.error(err);
  
  var result = data.replace(oldWasmPath, newWasmPath);
  fs.writeFile(buildFile, result, "utf8", (err) => {
    if (err) return console.log(err);
  });
});
