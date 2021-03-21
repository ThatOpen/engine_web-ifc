
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

    let properties = ifcapi.GetLineIDsWithType(modelID, WebIFC.IFCPROPERTYSINGLEVALUE)
    for (let i = 0; i < properties.size(); i++)
    {
        let expressID = properties.get(i);
        console.log(ifcapi.GetLine(modelID, expressID));
    }

    console.log(`Loaded model ${filename} to modelID ${modelID}`);

    let args = [];
    args.push(WebIFC.STRING);
    args.push("string");
    args.push(WebIFC.REAL);
    args.push(23.21);
    args.push(WebIFC.REF);
    args.push(123);
    args.push(WebIFC.EMPTY);
    args.push(WebIFC.UNKNOWN);
    let set = [];
    set.push(WebIFC.REAL);
    set.push(0.5);
    set.push(WebIFC.REAL);
    set.push(0.25);
    args.push(set);
    args.push(WebIFC.ENUM);
    args.push("ENUM");
    args.push(WebIFC.LABEL);
    args.push("LABEL");

    let start = WebIFC.ms();
    for (let i = 0; i < 1000; i++)
    {
        ifcapi.WriteLine(modelID, i, WebIFC.IFCPROPERTYSINGLEVALUE, args);
    }
    let time = WebIFC.ms() - start;
    console.log(`Writing 1000 lines took ${time} ms`);

    start = WebIFC.ms();
    fs.writeFileSync("exported.ifc", ifcapi.ExportFileAsIFC(modelID));
    time = WebIFC.ms() - start;
    console.log(`Exporting took ${time} ms`);

    ifcapi.CloseModel(modelID);
}

LoadFile("../example.ifc");