
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
        let tape = ifcapi.GetLine(modelID, expressID);
        let prop = ifc2x4.IfcPropertySingleValue.FromTape(tape.arguments);
        console.log(prop);
    }

    console.log(`Loaded model ${filename} to modelID ${modelID}`);

    /*
    let start = WebIFC.ms();
    let size = 10;
    for (let i = 0; i < size; i++)
    {
        let property = new ifc2x4.IfcPropertySingleValue("Name", null, ifc2x4.Value("IFCLABEL", `Value${i}`), null);
        ifcapi.WriteLine(modelID, i*2, WebIFC.IFCPROPERTYSINGLEVALUE, property.ToTape());

        let set = new ifc2x4.IfcPropertySet("Name", null, "Pset_name", null, [{expressID: i*2}]);
        ifcapi.WriteLine(modelID, i*2 + 1, WebIFC.IFCPROPERTYSET, set.ToTape());
    }
    let time = WebIFC.ms() - start;
    console.log(`Writing ${size} lines took ${time} ms`);
    console.log(`Writing ${Math.floor(size / (time / 1000))} lines per second`);

    fs.writeFileSync("exported.ifc", ifcapi.ExportFileAsIFC(modelID));

    ifcapi.CloseModel(modelID);
    */
}

LoadFile("../example.ifc");