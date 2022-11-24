const WebIFC = require("../../dist/web-ifc-api-node.js");
const fs = require("fs");
const { Console } = require("console");
const { IFC2X3, IFCPROPERTYSINGLEVALUE, EMPTY, IFCPROPERTYSET, IFCRELDEFINESBYPROPERTIES, IFCSIUNIT } = require("../../dist/web-ifc-api-node.js");

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

    //Change units
    let units = ifcapi.GetLineIDsWithType(modelID, WebIFC.IFCSIUNIT);
    for (let i = 0; i < units.size(); i++) {
        let expressID = units.get(i);
        const unit = await ifcapi.properties.getItemProperties(modelID, expressID);
        unit.Prefix = { type: 3, value: 'MILLI' };
        ifcapi.WriteLine(modelID, unit);
    }

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
    let property = new IFC2X3.IfcPropertySingleValue(
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
    let pSet = new IFC2X3.IfcPropertySet(
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
    let psetRel = new IFC2X3.IfcRelDefinesByProperties(
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

    console.log(`Add new units`);
    //Add units
    const unitID = maxEID;
    maxEID++;
    numLines++;
    let newUnits = new IFC2X3.IfcSIUnit(
        unitID,
        IFCSIUNIT,
        { type: 0, value: '*' },
        { type: 3, value: 'LENGTHUNIT' },
        { type: 3, value: 'MILLI' },
        { type: 3, value: 'METRE' }
    )
    ifcapi.WriteLine(modelID, newUnits);

    const unitID2 = maxEID;
    maxEID++;
    numLines++;
    let newUnits2 = new IFC2X3.IfcSIUnit(
        unitID2,
        IFCSIUNIT,
        { type: 0, value: '*' },
        { type: 3, value: 'LENGTHUNIT' },
        null,
        { type: 3, value: 'METRE' }
    )
    ifcapi.WriteLine(modelID, newUnits2);

    let time = WebIFC.ms() - start;
    console.log(`Writing ${numLines} lines took ${time} ms`);

    start = WebIFC.ms();
    fs.writeFileSync("exported.ifc", ifcapi.ExportFileAsIFC(modelID));
    time = WebIFC.ms() - start;
    console.log(`Exporting took ${time} ms`);

    ifcapi.CloseModel(modelID);
}

LoadFile("../example.ifc");