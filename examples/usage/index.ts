
import * as WebIFC from "../../dist/web-ifc-api-node.js";
const fs = require("fs");

console.log("Hello web-ifc-node!");

const ifcapi = new WebIFC.IfcAPI();

async function LoadFile(filename)
{
    // load model data as a string
    const ifcData = fs.readFileSync(filename);
    
    await ifcapi.Init();

    let modelID = ifcapi.OpenModel(filename, new Uint8Array(ifcData));

    let linesJson = [];
    let lines = ifcapi.GetAllLines(modelID);

    let propertySetFlattened = ifcapi.GetLine(modelID, 244, true);
    console.log(JSON.stringify(propertySetFlattened, null, 4));
    let start = WebIFC.ms();
    for (let i = 0; i < lines.size(); i++)
    {
        let expressID = lines.get(i);
        if (expressID !== 0)
        {
            //console.log(ifcapi.GetRawLineData(modelID, expressID));
            let line = ifcapi.GetLine(modelID, expressID);
            ifcapi.WriteLine(modelID, line);

            linesJson.push(line);
        }
        /*
        let property = new ifc2x4.IfcPropertySingleValue("Name", null, ifc2x4.Value("IFCLABEL", `Value${i}`), null);
        let property = new ifc2x4.IfcPropertySingleValue("Name", null, new ifc2x4.IfcLabel(`Value${i}`), null);
        let property = new ifc2x4.IfcPropertySingleValue("Name", null, new ifc2x4.IfcInteger(5), null);
        */
        //ifcapi.WriteLine(modelID, expressID, WebIFC.IFCPROPERTYSINGLEVALUE, property.ToTape());
    }
    let duration = WebIFC.ms() - start;
    console.log(`Writing took ${duration} ms`);

    console.log("Done");

    fs.writeFileSync("output.json", JSON.stringify(linesJson, null, 4));

    // API as simple as possible, traversing references is up to the client
    // change GetLine into GetRawLineData, and GetLine returns full object
    //ifc2x4.QueryPath(`$.IFCPRODUCT[expressID: 123].properties`);


    console.log(`Loaded model ${filename} to modelID ${modelID}`);

    fs.writeFileSync("exported.ifc", ifcapi.ExportFileAsIFC(modelID));

    ifcapi.CloseModel(modelID);
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

let f = "D:/web-ifc/benchmark/ifcfiles/rac_advanced_sample_project.ifc";
LoadFile("../example.ifc");