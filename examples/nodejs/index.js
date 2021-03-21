
const WebIFC = require("../../dist/web-ifc-api-node.js");
const fs = require("fs");

console.log("Hello web-ifc-node!");

const ifcapi = new WebIFC.IfcAPI();

async function LoadFile(filename)
{
    // load model data as a string
    const ifcData = fs.readFileSync(filename);
    
    await ifcapi.Init();

    let modelID = ifcapi.OpenModel("example.ifc", new Uint8Array(ifcData));

    // propertysinglevalue
    let properties = ifcapi.GetLineIDsWithType(modelID, 3650150729)
    for (let i = 0; i < properties.size(); i++)
    {
        let expressID = properties.get(i);
        console.log(ifcapi.GetLine(modelID, expressID));
    }

    console.log(`Loaded model ${filename} to modelID ${modelID}`);

    ifcapi.WriteLine(modelID, 123, 3650150729, [[]]);

    fs.writeFileSync("exported.ifc", ifcapi.ExportFileAsIFC(modelID));

    ifcapi.CloseModel(modelID);
}

LoadFile("../example.ifc");