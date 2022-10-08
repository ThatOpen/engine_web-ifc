import * as fs from 'fs';
import * as path from 'path';
import * as WebIFC from '../../dist/web-ifc-api-node.js';
import type { Vector, FlatMesh, IfcAPI, IfcExtrudedAreaSolid, RawLineData } from '../../dist/web-ifc-api-node.js';
import { IfcGeometry, IfcThermalExpansionCoefficientMeasure, LoaderError } from 'web-ifc';


let ifcApi : IfcAPI;
let modelID : number ;
let expressId : number = 9989; // an IFCSPACE
let geometries : Vector<FlatMesh> ; // to store geometries instead of refetching them
let allGeometriesSize : number = 119;
let quantityOfknownErrors : number = 0;
let meshesCount : number = 115;
let emptyFileModelID : number;
let expressIDMatchingGuid: any = {
    expressID:2863,
    guid:"0VNYAWfXv8JvIRVfOzYH1j"
}
let IFCEXTRUDEDAREASOLIDMeshesCount = 97; 

beforeAll(async () => {
    ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();

    const exampleIFCPath = path.join(__dirname, '../artifacts/example.ifc.test');
    const exampleIFCData = fs.readFileSync(exampleIFCPath);
    modelID = ifcApi.OpenModel(exampleIFCData);
    emptyFileModelID = ifcApi.CreateModel();
})

describe('WebIfcApi reading methods', () => {
    test('can retrieve a modelID', () => {
        expect(modelID).toBe(0);
    })
    test('can ensure model is open', () => {
        const isOpen : boolean = ifcApi.IsModelOpen(modelID);
        expect(isOpen).toBeTruthy();
    })
    test('can return the correct number of line with a given Type', () => {
        let properties = ifcApi.GetLineIDsWithType(modelID, WebIFC.IFCPROPERTYSINGLEVALUE)
        expect(properties.size()).toEqual(456);
    })
    test('can return the correct number of line when getting all lines', () => {
        const lines : any = ifcApi.GetAllLines(modelID);
        expect(lines.size()).toEqual(6487);
    })
    test('can GetLine', () => {
        const line : Object = ifcApi.GetLine(modelID, expressId);
        expect(line).not.toBeNull();
    })
    test('can flatten a line which will be more verbose', () => {
        const line : any = ifcApi.GetLine(modelID, expressId);
        ifcApi.FlattenLine(modelID, line);
        expect(line.OwnerHistory.OwningUser).not.toBe(null);
    })
    test('expect the correct line to be returned', () => {
        const line : any = ifcApi.GetLine(modelID, expressId);
        expect(line.expressID).toEqual(expressId);
    })
    test('expect getting flatten line return verbose line', () => {
        let flattened : boolean = true;
        const line : any = ifcApi.GetLine(modelID, expressId, flattened);
        expect(line.Representation.Representations.length).toEqual(2); // hardcoded
    })
    test('can Get Raw Line', () => {
        let line : RawLineData = ifcApi.GetRawLineData(modelID, expressId);
        expect(line).not.toBeNull();
    })
    test('expect the correct raw line to be returned', () => {
        let line : RawLineData = ifcApi.GetRawLineData(modelID, expressId);
        expect(line.ID).toEqual(expressId);
    })
    test('can count errors in ifc file', () => {
        let errors : any = ifcApi.GetAndClearErrors(modelID);
        expect(errors.size()).toEqual(quantityOfknownErrors);
    }) 
    test('can Create Ifc Guid To Express Id Map', () => {
        let count : number = 0;
        ifcApi.CreateIfcGuidToExpressIdMapping(modelID);
        expect(ifcApi.ifcGuidMap.get(0)?.get(expressIDMatchingGuid.expressID)).toEqual(expressIDMatchingGuid.guid);
    })



})
describe('WebIfcApi geometries', () => {
    test('can return the correct number geometries', () => {
        geometries = ifcApi.LoadAllGeometry(modelID);
        expect(geometries.size()).toBe(allGeometriesSize);
    })
    test('can Get a Flat Mesh', () => {
        let geometryExpressId = geometries.get(1).expressID;
        let flatMesh : FlatMesh  = ifcApi.GetFlatMesh(modelID, geometryExpressId);
        expect(flatMesh.geometries.size() > 0).toBeTruthy();
    })
    test('can ensure the corret number of all streamed meshes ', () => {
        let count : number = 0;
        ifcApi.StreamAllMeshes(modelID,(mesh)=>{
            count++;
        });
        expect(count).toEqual(meshesCount);
    })
    test('can ensure the corret number of all streamed meshes with a given Types', () => {
        let count : number = 0;
        ifcApi.StreamAllMeshesWithTypes(modelID, [WebIFC.IFCEXTRUDEDAREASOLID],(mesh)=>{
           ++count
        });
        expect(count).toEqual(IFCEXTRUDEDAREASOLIDMeshesCount);
    })  
    test('can get geometry', () => {
        let geometryId = geometries.get(1).expressID;
        const geometry : IfcGeometry = ifcApi.GetGeometry(modelID,geometryId);
        expect(geometry.GetIndexData()).not.toBeNull()
        expect(geometry.GetIndexDataSize()).not.toBeNull()
        expect(geometry.GetVertexData()).not.toBeNull()
        expect(geometry.GetVertexDataSize()).not.toBeNull()
    })
    test('can Get Coordination Matrix', () => {
        let coordinationMatrix : Array<number> = ifcApi.GetCoordinationMatrix(modelID);
        expect(coordinationMatrix.join(",")).toEqual("1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1");
    })
    test('expect vertexArray as Float32Array', () => {
        let geometryId = geometries.get(1).expressID;
        const geometry : IfcGeometry = ifcApi.GetGeometry(modelID,geometryId);
        let vertexArray : Float32Array = ifcApi.GetVertexArray(geometry.GetVertexData(),geometry.GetVertexDataSize());
        expect(vertexArray).toBeInstanceOf(Float32Array);
    })
    // this test must be reviewed!
    test('can return vertex array from a flat mesh', () => {
        let geometryExpressId = geometries.get(1).expressID;
        let flatMesh = ifcApi.GetFlatMesh(modelID, geometryExpressId);
        let flatMesheGeometries : IfcGeometry = ifcApi.GetGeometry(modelID, flatMesh.geometries.get(0).geometryExpressID);
        let geometryVertexArray : Float32Array = ifcApi.GetVertexArray(flatMesheGeometries.GetVertexData(), flatMesheGeometries.GetVertexDataSize());
        expect(geometryVertexArray.length > 0).toBeTruthy();
    })
    test('expect index array as Float32Array', () => {
        let geometryId = geometries.get(1).expressID;
        const geometry : IfcGeometry = ifcApi.GetGeometry(modelID,geometryId);
        let indexArray : Float32Array = ifcApi.GetVertexArray(geometry.GetIndexData(),geometry.GetIndexDataSize());
        expect(indexArray).toBeInstanceOf(Float32Array);
    })
    // this test must be reviewed!
    test('can return geometry index datas from a flat mesh', () => {
        let geometryExpressId = geometries.get(1).expressID;
        let flatMesh = ifcApi.GetFlatMesh(modelID, geometryExpressId);
        let flatMesheGeometries : IfcGeometry = ifcApi.GetGeometry(modelID, flatMesh.geometries.get(0).geometryExpressID);
        let geometryIndexData : Uint32Array = ifcApi.GetIndexArray(flatMesheGeometries.GetIndexData(), flatMesheGeometries.GetIndexDataSize());
        expect(geometryIndexData.length > 0).toBeTruthy();
    })
});
describe('WebIfcApi geometry transformation', () => {

    test('should throw Error with message \'invalid matrix size\' when matrix size != 16', () => {
        let f = ifcApi.SetGeometryTransformation(modelID, [1]);
        expect(f).toThrow("invalid matrix size");
    })
});
describe('WebIfcApi writing methods', () => {
    test('Can create an empty model', () => {
        expect(emptyFileModelID).toBe(1);
    })
    test('Can ensure modelIDs increment when adding new model in ifcApi', () => {
        expect(emptyFileModelID).toBe(1);
    })
    test('Can write a line from raw datas', () => {
        ifcApi.WriteRawLineData(emptyFileModelID,{
            ID: 1,
            type: 4251960020,
            arguments: [
              { type: 1, value: '0cqv$41Df7ygSQzJTMBnvM' },
              { type: 1, value: '' },
              { type: 1, value: 'foo' },
              null,
              { type: 1, value: '' },
              { type: 1, value: '' },
              { type: 1, value: '' },
              { type: 1, value: '' }
            ]
        })
        let project : any = ifcApi.GetLine(emptyFileModelID,1);
        expect(project.Description.value).toEqual("foo");
    })
    test('Can modify a line with a rawLineData', () => {
        ifcApi.WriteRawLineData(emptyFileModelID,{
            ID: 1,
            type: 4251960020,
            arguments: [
              { type: 1, value: '0cqv$41Df7ygSQzJTMBnvM' },
              { type: 1, value: '' },
              { type: 1, value: 'foobar' },
              null,
              { type: 5, value: '' },
              { type: 1, value: '' },
              { type: 1, value: '' },
              { type: 1, value: '' }
            ]
        })
        let project : any = ifcApi.GetLine(emptyFileModelID,1);
        expect(project.Description.value).toBe("foobar");
    })
    test('can write a line by giving a line object',() =>{
        let anIfcSpace : any = ifcApi.GetLine(modelID,9989);
        let projectBeforeWriting : any = ifcApi.GetAllLines(modelID);
        let payload = {
            expressID:9999999,
            type: 3856911033,
            toType: 3856911033,
            OwnerHistory: { type: 5, value: 41 },
            Name: { type: 1, value: 'NZ-SHS beam:100x6.0SHS:823947' },
            Description: null,
            ObjectType: { type: 1, value: 'NZ-SHS beam:100x6.0SHS' },
            ObjectPlacement: { type: 5, value: 9750 },
            Representation: { type: 5, value: 9987 },
            LongName: { type: 1, value: '823947' },
            CompositionType: undefined,
            PredefinedType: undefined,
            ElevationWithFlooring: undefined
        }
        
        ifcApi.WriteLine(modelID,payload);
        let projectAfterWriting : any = ifcApi.GetAllLines(modelID);
        expect(projectBeforeWriting.size()+1).toEqual(projectAfterWriting.size());
    })
    test('can modify a line by giving a line object',() =>{
        let project : any = ifcApi.GetLine(modelID,1);
        project.Name.value = "foo";
        ifcApi.WriteLine(modelID,project);
        let projectReloaded : any = ifcApi.GetLine(modelID,1);
        expect(projectReloaded.Name.value).toEqual("foo");
    })
    test('can Export File As IFC',() =>{
        let ifcDatas =  ifcApi.ExportFileAsIFC(modelID);
        let exportModelID= ifcApi.OpenModel(ifcDatas);
        const line : any = ifcApi.GetLine(exportModelID, expressId);
        expect(exportModelID).toEqual(2);
        expect(line.expressID).toEqual(expressId);
        
    })
    
})


describe('WebIfcApi known failures', () => {
    test("GetLine doesn't support all entity types (only IFC4?) issue:#212", async () => {
        let ifcApi = new WebIFC.IfcAPI();
        await ifcApi.Init();
        let failModelID = 0;
        const exampleIFCPath : string = path.join(__dirname, '../artifacts/Sample_entities.ifc');
        const exampleIFCData = fs.readFileSync(exampleIFCPath);
        failModelID = ifcApi.OpenModel(exampleIFCData);
        const IFCELECTRICDISTRIBUTIONPOINT_EXPRESSID = 237;
        //console.log(ifcApi.GetLineIDsWithType(failModelID, IFCELECTRICDISTRIBUTIONPOINT));
        let f = ifcApi.GetLine(failModelID, IFCELECTRICDISTRIBUTIONPOINT_EXPRESSID);

        
        expect(f).toThrow("FromRawLineData[rawLineData.type] is not a function"); // fail if error doesnt exist anymore ;) 
        ifcApi.CloseModel(failModelID);
    });

    test("IFCTEXT with length > 256: the last 256 chars get cut of the text issue:#146", async () => {
        let ifcApi = new WebIFC.IfcAPI();
        await ifcApi.Init();
        let failModelID = 0;
        let expressID = 248;
        const exampleIFCPath : string = path.join(__dirname, '../artifacts/Sample_entities.ifc');
        const exampleIFCData = fs.readFileSync(exampleIFCPath);
        failModelID = ifcApi.OpenModel(exampleIFCData);
        let line = ifcApi.GetLine(failModelID, expressID);
        
        expect(line.NominalValue.value.length).toEqual(259); 
        ifcApi.CloseModel(failModelID);
    });
})

afterAll(() => {
    ifcApi.CloseModel(modelID);
    const isOpen : boolean = ifcApi.IsModelOpen(modelID);
    const isOpenEmptyFileModelID : boolean = ifcApi.IsModelOpen(emptyFileModelID);
    expect(isOpen).toBeFalsy()
    expect(isOpenEmptyFileModelID).toBeFalsy()
})
