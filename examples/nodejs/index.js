
const wifc = require("web-ifc/web-ifc.js");
const ifcapi = require("web-ifc/web-ifc-api.js");
const fs = require("fs");

console.log("Hello web-ifc-node!");

async function LoadFile(filename)
{
    // load model data as a string
    const ifcData = fs.readFileSync(filename).toString();
    ifcapi.SetModule(wifc);
    await ifcapi.WaitForModuleReady();

    let modelID = ifcapi.OpenModel("example.ifc", ifcData);

    console.log(`Loaded model ${filename} to modelID ${modelID}`);

    ifcapi.CloseModel(modelID);
}

LoadFile("../example.ifc");