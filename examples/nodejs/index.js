
const WebIFCWasm = require("web-ifc/web-ifc.js");
const WebIFC = require("web-ifc/web-ifc-api.js");
const fs = require("fs");

global.WebIFCWasm = WebIFCWasm;

console.log("Hello web-ifc-node!");

const ifcapi = new WebIFC.IfcAPI();

async function LoadFile(filename)
{
    // load model data as a string
    const ifcData = fs.readFileSync(filename).toString();
    await ifcapi.WaitForModuleReady();

    let modelID = ifcapi.OpenModel("example.ifc", ifcData);

    console.log(`Loaded model ${filename} to modelID ${modelID}`);

    ifcapi.CloseModel(modelID);
}

LoadFile("../example.ifc");