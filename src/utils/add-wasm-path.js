//Stores the path of the WASM file in a global variable that can be configured from outside

const fs = require("fs");


function Fix(buildFile)
{
    const wasmPathDeclaration = '\n\n var WasmPath = "";';
    const oldWasmPath = /var wasmBinaryFile = "web-ifc.wasm";/;
    const newWasmPath = 'var wasmBinaryFile = WasmPath + "web-ifc.wasm";';

    fs.appendFileSync(buildFile, wasmPathDeclaration, (err) => {
    if (err) return console.log(err);
    });

    fs.readFileSync(buildFile, "utf8", (err, data) => {
        if (err) return console.error(err);
        
        const result = data.replace(oldWasmPath, newWasmPath);
        fs.writeFileSync(buildFile, result, "utf8", (err) => {
            if (err) return console.log(err);
        });
    });
}

Fix("dist/web-ifc-api.js");
Fix("dist/web-ifc-api-node.js");

