
const WebIFC = require("../../dist/web-ifc-api-node.js");
import * as ifc2x4 from "../../src/ifc2x4_helper";
const fs = require("fs");

console.log("Hello web-ifc-node!");

const ifcapi = new WebIFC.IfcAPI();

async function LoadFile(filename)
{
    // load model data as a string
    const ifcData = fs.readFileSync(filename);
    
    await ifcapi.Init();

    let modelID = ifcapi.OpenModel("example.ifc", new Uint8Array(ifcData));

    let properties = ifcapi.GetLineIDsWithType(modelID, WebIFC.IFCPROPERTYSINGLEVALUE)
    for (let i = 0; i < properties.size(); i++)
    {
        let expressID = properties.get(i);
        console.log(ifcapi.GetLine(modelID, expressID));
    }

    console.log(`Loaded model ${filename} to modelID ${modelID}`);

    let property = new ifc2x4.IfcPropertySingleValue("Name", null, "val", null);
    ifcapi.WriteLine(modelID, 123, WebIFC.IFCPROPERTYSINGLEVALUE, property.ToTape());

    let set = new ifc2x4.IfcPropertySet("Name", null, "Pset_name", null, [{expressID: 123}]);
    ifcapi.WriteLine(modelID, 124, WebIFC.IFCPROPERTYSET, set.ToTape());

    fs.writeFileSync("exported.ifc", ifcapi.ExportFileAsIFC(modelID));

    ifcapi.CloseModel(modelID);
}

LoadFile("../example.ifc");