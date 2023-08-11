
const fs = require("fs");
const { Console } = require("console");
const { ms,IfcAPI, Handle, IFC2X3, IFCBUILDINGSTOREY, IFCPROPERTYSINGLEVALUE, IFCSIUNIT, EMPTY, IFCPROPERTYSET, IFCOWNERHISTORY, IFCRELDEFINESBYPROPERTIES } = require("../../dist/web-ifc-api-node.js");

console.log("Hello web-ifc-node!");

const ifcapi = new IfcAPI();

async function LoadFile(filename) {
    // load model data as a string

    await ifcapi.Init();
    const ifcData = fs.readFileSync(filename);

    let modelID = ifcapi.OpenModel(ifcData);



    console.log(`Loaded model ${filename} to modelID ${modelID}`);

    let numLines = 0;


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
    let units = ifcapi.GetLineIDsWithType(modelID, IFCSIUNIT);
    for (let i = 0; i < units.size(); i++) {
        let expressID = units.get(i);
        const unit = await ifcapi.properties.getItemProperties(modelID, expressID);
        unit.Prefix = { type: 3, value: 'MILLI' };
        ifcapi.WriteLine(modelID, unit);
    }


    //IfcProduct edition
    let storeys = ifcapi.GetLineIDsWithType(modelID, IFCBUILDINGSTOREY);
    for (let i = 0; i < storeys.size(); i++) {
        numLines++;
        let expressID = storeys.get(i);
        const storey = await ifcapi.properties.getItemProperties(modelID, expressID);
        storey.Description = new IFC2X3.IfcText('Description')
        storey.Name = new IFC2X3.IfcLabel('Name')
        storey.LongName = new IFC2X3.IfcText('Long name');
        ifcapi.WriteLine(modelID, storey);
    }

    //IfcProperty edition
    let properties = ifcapi.GetLineIDsWithType(modelID, IFCPROPERTYSINGLEVALUE)
    for (let i = 0; i < properties.size(); i++) {
        numLines++;
        let expressID = properties.get(i);
        const single = await ifcapi.properties.getItemProperties(modelID, expressID);
        if (single.NominalValue.constructor.name == "IfcLabel") {
            single.NominalValue.value = "new label";
        }
        ifcapi.WriteLine(modelID, single);
    }

    console.log(`Add new properties`);

    let start = ms();
    //Max ExpressId
    let maxEID = ifcapi.GetMaxExpressID(modelID);

    //Find ownerHistory
    let owHs = ifcapi.GetLineIDsWithType(modelID, IFCOWNERHISTORY);

    maxEID++;
    numLines++;
    let property = new IFC2X3.IfcPropertySingleValue(
        maxEID,
        new IFC2X3.IfcIdentifier('Classification'),
        null,
        new IFC2X3.IfcLabel('New value'),
        null);
    ifcapi.WriteLine(modelID, property);

    maxEID++;
    numLines++;
    property = new IFC2X3.IfcPropertySingleValue(
        maxEID,
        new IFC2X3.IfcIdentifier('Special Number'),
        null,
        new IFC2X3.IfcReal(0.16),
        null);
    let numberId = maxEID;
    ifcapi.WriteLine(modelID, property);
     maxEID++;
    numLines++;
    property = new IFC2X3.IfcPropertySingleValue(
        maxEID,
        new IFC2X3.IfcIdentifier('Special Number'),
        null,
        new IFC2X3.IfcReal(100000000),
        null);
    ifcapi.WriteLine(modelID, property);
    maxEID++;   
    numLines++;
    property = new IFC2X3.IfcPropertySingleValue(
        maxEID,
        new IFC2X3.IfcIdentifier('Unicode'),
        null,
        new IFC2X3.IfcLabel('Phäsen'),
        null);
    ifcapi.WriteLine(modelID, property);

    //Add property sets
    const propID = maxEID;
    maxEID++;
    numLines++;
    let pSet = new IFC2X3.IfcPropertySet(
        maxEID,
        new IFC2X3.IfcGloballyUniqueId('350fFD9fjAtPfVihcqa4Yn'),
        new Handle(owHs.get(0)), 
        new IFC2X3.IfcLabel('Classification'),
        new IFC2X3.IfcText('Description'),
        [new Handle(propID)]);
    ifcapi.WriteLine(modelID, pSet);

    //Add relationship
    const pSetID = maxEID;
    maxEID++;
    numLines++;
    let psetRel = new IFC2X3.IfcRelDefinesByProperties(
        maxEID,
        new IFC2X3.IfcGloballyUniqueId('53sfET9fjfyPfVi4cqa7Yn'),
        new Handle(owHs.get(0)),
        new IFC2X3.IfcLabel('Name'),
        new IFC2X3.IfcText('Description'),
        [new Handle(storeys.get(0))],
        new Handle(pSetID)
    );
    ifcapi.WriteLine<IFC2X3.IfcRelDefinesByProperties>(modelID, psetRel);

    console.log(`Add new units`);
    //Add units
    const unitID = maxEID;
    maxEID++;
    numLines++;
    let newUnits = new IFC2X3.IfcSIUnit(
        unitID,
        new Handle(1),
        IFC2X3.IfcUnitEnum.LENGTHUNIT,
        IFC2X3.IfcSIPrefix.MILLI,
        IFC2X3.IfcSIUnitName.METRE
    )
    ifcapi.WriteLine(modelID, newUnits);

    const unitID2 = maxEID;
    maxEID++;
    numLines++;
    let newUnits2 = new IFC2X3.IfcSIUnit(
        unitID2,
        new Handle(1),
        IFC2X3.IfcUnitEnum.LENGTHUNIT,
        null,
        IFC2X3.IfcSIUnitName.METRE
    )
    ifcapi.WriteLine(modelID, newUnits2);

    let time = ms() - start;
    let obj =  ifcapi.GetLine(modelID,148);
    console.log(obj.RefLatitude);
    obj.RefLatitude.value[0]=999;
    ifcapi.WriteLine(modelID, obj);
    console.log(`Writing ${numLines} lines took ${time} ms`);

    start = ms();
    fs.writeFileSync("exported.ifc", ifcapi.SaveModel(modelID));
    time = ms() - start;
    console.log(`Exporting took ${time} ms`);

    ifcapi.CloseModel(modelID);

    console.log("Checking we can parse exported model");
    let id = ifcapi.OpenModel(fs.readFileSync("exported.ifc"));
    let numberline = ifcapi.GetLine(id,numberId);
    console.log(numberline);


}

LoadFile("../example.ifc");
