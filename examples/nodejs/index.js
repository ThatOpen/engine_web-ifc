const WebIFC = require("../../dist/web-ifc-api-node.js");
const fs = require("fs");
const { Console } = require("console");
const { IfcPropertySingleValue, IFCPROPERTYSINGLEVALUE, IfcText, IfcIdentifier, IfcValve } = require("../../dist/web-ifc-api-node.js");
const { EMPTY, IfcPropertySet, IFCPROPERTYSET, IfcGloballyUniqueId, IfcLabel, IfcRelDefinesByProperties, IFCRELDEFINESBYPROPERTIES } = require("../../dist/web-ifc-api-node.js");

console.log("Hello web-ifc-node!");

const ifcapi = new WebIFC.IfcAPI();

async function LoadFile(filename) {
    // load model data as a string
    const ifcData = fs.readFileSync(filename);

    await ifcapi.Init();

    let modelID = ifcapi.OpenModel(ifcData);

    console.log(`Loaded model ${filename} to modelID ${modelID}`);

    let numLines = 0;

    let start = WebIFC.ms();

    //Data types

    // enum IfcTokenType : char
    // {
    // 	UNKNOWN = 0,
    // 	STRING = 1
    //  LABEL = 2
    // 	ENUM = 3
    // 	REAL = 4
    // 	REF = 5
    // 	EMPTY = 6
    // 	SET_BEGIN 
    // 	SET_END
    // 	LINE_END
    // };

    console.log(`Modify values`);

    //IfcProduct edition
    let storeys = ifcapi.GetLineIDsWithType(modelID, WebIFC.IFCBUILDINGSTOREY);
    for (let i = 0; i < storeys.size(); i++) {
        numLines++;
        let expressID = storeys.get(i);
        const storey = await ifcapi.properties.getItemProperties(modelID, expressID);
        storey.Description = { type: 1, value: 'Description' }; //Value type is 1 -> STRING
        storey.Name = { type: 1, value: 'Name' }; //Use always '
        storey.LongName = { type: 1, value: 'Long name' };
        ifcapi.WriteLine(modelID, storey);
    }

    //IfcProperty edition
    let properties = ifcapi.GetLineIDsWithType(modelID, WebIFC.IFCPROPERTYSINGLEVALUE)
    for (let i = 0; i < properties.size(); i++) {
        numLines++;
        let expressID = properties.get(i);
        const single = await ifcapi.properties.getItemProperties(modelID, expressID);
        if (single.NominalValue.label == "IFCLABEL") {
            single.NominalValue.value = "new label";
        }
        ifcapi.WriteLine(modelID, single);
    }

    console.log(`Add new properties`);

    //Max ExpressId
    let maxEID = ifcapi.GetMaxExpressID(modelID);

    //Find ownerHistory
    let owHs = ifcapi.GetLineIDsWithType(modelID, WebIFC.IFCOWNERHISTORY);

    maxEID++;
    numLines++;
    let property = new IfcPropertySingleValue(
        maxEID,
        IFCPROPERTYSINGLEVALUE,
        { type: 1, value: 'Classification' },
        null,
        {
            type: 2, //Property content is type 2 -> LABEL
            label: 'IFCLABEL',
            valueType: 1, //Value is type 1 -> STRING
            value: 'New value'
        },
        null);
    ifcapi.WriteLine(modelID, property);

    //Add property sets
    const propID = maxEID;
    maxEID++;
    numLines++;
    let pSet = new IfcPropertySet(
        maxEID,
        IFCPROPERTYSET,
        { type: 1, value: '350fFD9fjAtPfVihcqa4Yn' },
        { type: 5, value: owHs.get(0) }, //Reference is type 5 -> REF
        { type: 1, value: 'Classification' },
        { type: 1, value: 'Description' },
        [{ type: 5, value: propID }]);
    ifcapi.WriteLine(modelID, pSet);

    //Add relationship
    const pSetID = maxEID;
    maxEID++;
    numLines++;
    let psetRel = new IfcRelDefinesByProperties(
        maxEID,
        IFCRELDEFINESBYPROPERTIES,
        { type: 1, value: '53sfET9fjfyPfVi4cqa7Yn' },
        { type: 5, value: owHs.get(0) },
        { type: 1, value: 'Name' },
        { type: 1, value: 'Description' },
        [{ type: 5, value: storeys.get(0) }],
        { type: 5, value: pSetID }
    );
    ifcapi.WriteLine(modelID, psetRel);

    let time = WebIFC.ms() - start;
    console.log(`Writing ${numLines} lines took ${time} ms`);

    start = WebIFC.ms();
    fs.writeFileSync("exported.ifc", ifcapi.ExportFileAsIFC(modelID));
    time = WebIFC.ms() - start;
    console.log(`Exporting took ${time} ms`);

    ifcapi.CloseModel(modelID);
}

LoadFile("../example.ifc");