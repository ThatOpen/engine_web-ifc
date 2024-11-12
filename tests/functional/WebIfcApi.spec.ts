import * as fs from 'fs';
import * as path from 'path';
import * as WebIFC from '../../dist/web-ifc-api-node.js';
import {IFC2X3} from '../../dist/web-ifc-api-node.js';
import {LoaderSettings,IfcLineObject,Schemas,IFCFACE,IFCFACEOUTERBOUND,IFCCARTESIANPOINT,IFCLENGTHMEASURE,IFCPOLYLOOP} from '../../dist/web-ifc-api-node.js';

import type {
    Vector,
    FlatMesh,
    IfcAPI,
    IfcGeometry,
    RawLineData
} from '../../dist/web-ifc-api-node.js';


let ifcApi: IfcAPI;
let modelID: number;
let expressId: number = 9989; // an IFCSPACE
let geometries: Vector < FlatMesh > ; // to store geometries instead of refetching them
let allGeometriesSize: number = 119;
let meshesCount: number = 115;
let totalLineNumber : number = 6488;
let emptyFileModelID: number;
let lastExpressId : number = 14313;
let expectedFileDescription : string = "ViewDefinition [CoordinationView_V2.0]";
let expectedFileSchema = "IFC2X3";
let expectedFileName = "3458";
let expressIDMatchingGuid: any = {
    expressID: 2863,
    guid: "0VNYAWfXv8JvIRVfOzYH1j"
}
let expectedVertexAndIndexDatas: any = {
    geometryIndex: 4,
    indexDatas: "2,0,1,6,5,4,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
    vertexDatas: "-834.3258056640625,-287.70660400390625,279.3999938964844,0,0,1,834.3258056640625,-287.70660400390625,279.3999938964844,0,0,1,604.1195068359375,287.70660400390625,279.3999938964844,0,0,1,-834.3258056640625,-287.70660400390625,279.3999938964844,0,0,1,-834.3258056640625,-287.70660400390625,-279.3999938964844,0,0,-1,834.3258056640625,-287.70660400390625,-279.3999938964844,0,0,-1,604.1195068359375,287.70660400390625,-279.3999938964844,0,0,-1,-834.3258056640625,-287.70660400390625,-279.3999938964844,0,0,-1,-834.3258056640625,-287.70660400390625,-279.3999938964844,0,-1,0,834.3258056640625,-287.70660400390625,279.3999938964844,0,-1,0,-834.3258056640625,-287.70660400390625,279.3999938964844,0,-1,0,-834.3258056640625,-287.70660400390625,-279.3999938964844,0,-1,0,834.3258056640625,-287.70660400390625,-279.3999938964844,0,-1,0,834.3258056640625,-287.70660400390625,279.3999938964844,0,-1,0,834.3258056640625,-287.70660400390625,-279.3999938964844,0.9284539222717285,0.3714476525783539,0,604.1195068359375,287.70660400390625,279.3999938964844,0.9284539222717285,0.3714476525783539,0,834.3258056640625,-287.70660400390625,279.3999938964844,0.9284539222717285,0.3714476525783539,0,834.3258056640625,-287.70660400390625,-279.3999938964844,0.9284539222717285,0.3714476525783539,0,604.1195068359375,287.70660400390625,-279.3999938964844,0.9284539222717285,0.3714476525783539,0,604.1195068359375,287.70660400390625,279.3999938964844,0.9284539222717285,0.3714476525783539,0,604.1195068359375,287.70660400390625,-279.3999938964844,-0.37141022086143494,0.9284688830375671,0,-834.3258056640625,-287.70660400390625,279.3999938964844,-0.37141022086143494,0.9284688830375671,0,604.1195068359375,287.70660400390625,279.3999938964844,-0.37141022086143494,0.9284688830375671,0,604.1195068359375,287.70660400390625,-279.3999938964844,-0.37141022086143494,0.9284688830375671,0,-834.3258056640625,-287.70660400390625,-279.3999938964844,-0.37141022086143494,0.9284688830375671,0,-834.3258056640625,-287.70660400390625,279.3999938964844,-0.37141022086143494,0.9284688830375671,0"
}
let IFCEXTRUDEDAREASOLIDMeshesCount = 97;
let givenCoordinationMatrix: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];



beforeAll(async () => {
    ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();
    ifcApi.SetLogLevel(WebIFC.LogLevel.LOG_LEVEL_OFF);
    const exampleIFCPath = path.join(__dirname, '../ifcfiles/public/example.ifc');
    const exampleIFCData = fs.readFileSync(exampleIFCPath);
    modelID = ifcApi.OpenModel(exampleIFCData);
    emptyFileModelID = ifcApi.CreateModel({schema: WebIFC.Schemas.IFC2X3});
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
        const lines: any = ifcApi.GetAllLines(modelID);
        expect(lines.size()).toEqual(totalLineNumber);
    })
    test('can return the correct number of line when getting all lines and iterate over them', () => {
        const lines: any = ifcApi.GetAllLines(modelID);
        let i=0;
        for (let _ of lines) i++;
        expect(i).toEqual(totalLineNumber);
    })
    test('can GetLine', () => {
        const line: Object = ifcApi.GetLine(modelID, expressId);
        expect(line).not.toBeNull();
    })
    test('can flatten a line which will be more verbose', () => {
        const line: any = ifcApi.GetLine(modelID, expressId);
        ifcApi.FlattenLine(modelID, line);
        expect(line.OwnerHistory.OwningUser).not.toBe(null);
    })
    test('expect the correct line to be returned', () => {
        const line: any = ifcApi.GetLine(modelID, expressId);
        expect(line.expressID).toEqual(expressId);
    })
    test('IFC Address Parsing', () => {
        const line: any = ifcApi.GetLine(modelID, 14313);
        expect(line.AddressLines.length).toBe(1);
    })
    test('expect getting flatten line return verbose line', () => {
        let flattened: boolean = true;
        const line: any = ifcApi.GetLine(modelID, expressId, flattened);
        expect(line.Representation.Representations.length).toEqual(2); // hardcoded
    })
    test('can Get Raw Line', () => {
        let line: RawLineData = ifcApi.GetRawLineData(modelID, expressId);
        expect(line).not.toBeNull();
    })
    test('expect the correct raw line to be returned', () => {
        let line: RawLineData = ifcApi.GetRawLineData(modelID, expressId);
        expect(line.ID).toEqual(expressId);
    })
    test('can read MAC ROMAN Characters', () => {
        let line: RawLineData = ifcApi.GetRawLineData(modelID, 1);
        expect(line.arguments[1].value).toEqual('Autodesk Revit 2021 (ENU) Cé');
    })
    test('can Create Ifc Guid To Express Id Map', () => {
        ifcApi.CreateIfcGuidToExpressIdMapping(modelID);
        expect(ifcApi.ifcGuidMap.get(0)?.get(expressIDMatchingGuid.expressID)).toEqual(expressIDMatchingGuid.guid);
    })
    test('can return the next highest expressID if the ID is sequential', () => {
        expect(ifcApi.GetNextExpressID(modelID, 5)).toBe(6);
    })
    test('can return the next highest expressID if the ID is not sequential', () => {
        expect(ifcApi.GetNextExpressID(modelID, 9)).toBe(11);
    })
    test('returns next expressID if it is the max ID', () => {
        expect(ifcApi.GetNextExpressID(modelID, 14312)).toBe(14313);
    })
    test('Can get max expressID', () => {
        const maxExpressId : number = ifcApi.GetMaxExpressID(modelID);
        expect(maxExpressId).toEqual(lastExpressId);
    })
     test('can use the guid->expressID map', () => {
        let eid = ifcApi.GetExpressIdFromGuid(modelID,'39ashYNBDEDR$HhFzW6w9a');
        expect(eid).toBe(138);
        let guid = ifcApi.GetGuidFromExpressId(modelID,138);
        expect(guid).toBe('39ashYNBDEDR$HhFzW6w9a');
    });
    test('Can get header information', () => {
        const descriptionLine : any = ifcApi.GetHeaderLine(modelID, WebIFC.FILE_DESCRIPTION );
        const nameLine : any = ifcApi.GetHeaderLine(modelID, WebIFC.FILE_NAME );
        const schemaLine : any = ifcApi.GetHeaderLine(modelID, WebIFC.FILE_SCHEMA );
        expect(descriptionLine.type).toEqual("FILE_DESCRIPTION");
        expect(descriptionLine.arguments.length).toBeGreaterThan(1);
        expect(descriptionLine.arguments[0][0].value).toEqual(expectedFileDescription);
        expect(nameLine.type).toEqual("FILE_NAME");
        expect(nameLine.arguments.length).toBe(7);
        expect(nameLine.arguments[0].value).toEqual(expectedFileName);
        expect(schemaLine.type).toEqual("FILE_SCHEMA");
        expect(schemaLine.arguments.length).toBe(1);
        expect(schemaLine.arguments[0][0].value).toEqual(expectedFileSchema);
    });
    test('can get name for type code', () => {
        expect(ifcApi.GetNameFromTypeCode(WebIFC.IFCPROPERTYSINGLEVALUE)).toBe("IfcPropertySingleValue");
        expect(ifcApi.GetNameFromTypeCode(WebIFC.IFCWALL)).toBe("IfcWall");
        expect(ifcApi.GetNameFromTypeCode(WebIFC.IFCRELASSOCIATESMATERIAL)).toBe("IfcRelAssociatesMaterial");
    });
    test('can check if is ifcelement', () => {
        expect(ifcApi.IsIfcElement(WebIFC.IFCWALL)).toBeTruthy();
        expect(ifcApi.IsIfcElement(WebIFC.IFCDOOR)).toBeTruthy();
        expect(ifcApi.IsIfcElement(WebIFC.IFCWINDOW)).toBeTruthy();
        expect(ifcApi.IsIfcElement(WebIFC.IFCROOF)).toBeTruthy();
        expect(ifcApi.IsIfcElement(WebIFC.IFCSTAIRFLIGHT)).toBeTruthy();
        expect(ifcApi.IsIfcElement(WebIFC.IFCSTAIR)).toBeTruthy();
        expect(ifcApi.IsIfcElement(WebIFC.IFCSLAB)).toBeTruthy();
        expect(ifcApi.IsIfcElement(WebIFC.IFCRECTANGULARPYRAMID)).toBeFalsy();
        expect(ifcApi.IsIfcElement(WebIFC.IFCPROPERTYSET)).toBeFalsy();
        expect(ifcApi.IsIfcElement(WebIFC.IFCRELDEFINESBYOBJECT)).toBeFalsy();
        expect(ifcApi.IsIfcElement(-1)).toBeFalsy();
        expect(ifcApi.IsIfcElement(-5)).toBeFalsy();
    });
});

describe('WebIfcApi geometries', () => {
    test('can return the correct number geometries', () => {
        geometries = ifcApi.LoadAllGeometry(modelID);
        expect(geometries.size()).toBe(allGeometriesSize);
    })
    test('can Get a Flat Mesh', () => {
        let geometryExpressId = geometries.get(4).expressID;
        let flatMesh: FlatMesh = ifcApi.GetFlatMesh(modelID, geometryExpressId);
        expect(flatMesh.geometries.size() > 0).toBeTruthy();
    })
    test('expect the correct flatMesh to be returned', () => {
        let geometryExpressId = geometries.get(4).expressID;
        let flatMesh: FlatMesh = ifcApi.GetFlatMesh(modelID, geometryExpressId);
        expect(flatMesh.expressID).toEqual(geometryExpressId);
    })
    test('can get geometry', () => {
        let geometryId = geometries.get(1).expressID;
        const geometry: IfcGeometry = ifcApi.GetGeometry(modelID, geometryId);
        expect(geometry.GetIndexData()).not.toBeNull()
        expect(geometry.GetIndexDataSize()).not.toBeNull()
        expect(geometry.GetVertexData()).not.toBeNull()
        expect(geometry.GetVertexDataSize()).not.toBeNull()
    })
    test('can Get Coordination Matrix', () => {
        let coordinationMatrix: Array < number > = ifcApi.GetCoordinationMatrix(modelID);
        expect(coordinationMatrix.join(",")).toEqual(givenCoordinationMatrix.join(","));
    })
    test('expect index array as Float32Array', () => {
        let geometryId = geometries.get(1).expressID;
        const geometry: IfcGeometry = ifcApi.GetGeometry(modelID, geometryId);
        let indexArray: Float32Array = ifcApi.GetVertexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());
        expect(indexArray).toBeInstanceOf(Float32Array);
    })
    test('expect vertex Array as Float32Array', () => {
        let geometryId = geometries.get(4).expressID;
        const geometry: IfcGeometry = ifcApi.GetGeometry(modelID, geometryId);
        let vertexArray: Float32Array = ifcApi.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
        expect(vertexArray).toBeInstanceOf(Float32Array);
    })
    test('can return vertex array from a flat mesh', () => {
        let geometryExpressId = geometries.get(4).expressID;
        let flatMesh = ifcApi.GetFlatMesh(modelID, geometryExpressId);
        let flatMesheGeometries: IfcGeometry = ifcApi.GetGeometry(modelID, flatMesh.geometries.get(0).geometryExpressID);
        let geometryVertexArray: Float32Array = ifcApi.GetVertexArray(flatMesheGeometries.GetVertexData(), flatMesheGeometries.GetVertexDataSize());
        expect(geometryVertexArray.length > 0).toBeTruthy();
    })
    test('can return geometry index datas from a flat mesh', () => {
        let geometryExpressId = geometries.get(4).expressID;
        let flatMesh = ifcApi.GetFlatMesh(modelID, geometryExpressId);
        let flatMesheGeometries: IfcGeometry = ifcApi.GetGeometry(modelID, flatMesh.geometries.get(0).geometryExpressID);
        let geometryIndexData: Uint32Array = ifcApi.GetIndexArray(flatMesheGeometries.GetIndexData(), flatMesheGeometries.GetIndexDataSize());
        expect(geometryIndexData.length > 0).toBeTruthy();
    })
    test('expect correct vertex and index array from A flat Mesh', () => {
        let flatMesh = ifcApi.GetFlatMesh(modelID, geometries.get(expectedVertexAndIndexDatas.geometryIndex).expressID);
        let geometry = ifcApi.GetGeometry(modelID, flatMesh.geometries.get(0).geometryExpressID);
        let geometryVertexArray = ifcApi.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
        let geometryIndexData = ifcApi.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());
        let geometryIndexDatasString = geometryIndexData.join(",");
        let geometryVertexArrayString = geometryVertexArray.join(",");
        expect(geometryIndexDatasString).toEqual(expectedVertexAndIndexDatas.indexDatas);
        expect(geometryVertexArrayString).toEqual(expectedVertexAndIndexDatas.vertexDatas);
    })
    test('can ensure the corret number of all streamed meshes ', () => {
        let count: number = 0;
        ifcApi.StreamAllMeshes(modelID, () => {
            count++;
        });
        expect(count).toEqual(meshesCount);
    })
    test('get totals and indexes of streamed meshes ', () => {
        ifcApi.StreamAllMeshes(modelID, (_,index,total) => {
            expect(index).toBeLessThan(total);
        });
    })
    test('can ensure the corret number of all streamed meshes with a given Types', () => {
        let count: number = 0;
        ifcApi.StreamAllMeshesWithTypes(modelID, [WebIFC.IFCEXTRUDEDAREASOLID], () => {
            ++count
        });
        expect(count).toEqual(IFCEXTRUDEDAREASOLIDMeshesCount);
    })
});

describe('WebIfcApi geometry transformation', () => {
    test('should throw with message \'invalid matrix size\' when matrix size != 16', () => {
        expect(() => {
            ifcApi.SetGeometryTransformation(modelID, [1])
        }).toThrow("invalid matrix size: 1");
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
        ifcApi.WriteRawLineData(emptyFileModelID, {
            ID: 1,
            type: WebIFC.IFCPROJECT,
            arguments: [{
                    type: 1,
                    value: '0cqv$41Df7ygSQzJTMBnvM'
                },
                {
                    type: 1,
                    value: ''
                },
                {
                    type: 1,
                    value: 'foo'
                },
                null,
                {
                    type: 5,
                    value: 1
                },
                {
                    type: 1,
                    value: ''
                },
                {
                    type: 5,
                    value: 2
                },
                [{
                    type: 5,
                    value: 3
                }],
                {
                    type: 5,
                    value: 2
                }
            ]
        })
        let project: any = ifcApi.GetLine(emptyFileModelID, 1); 
        expect(project.Name.value).toEqual("foo");
    })
    test('Can modify a line with a rawLineData', () => {
        ifcApi.WriteRawLineData(emptyFileModelID, {
            ID: 1,
            type: WebIFC.IFCPROJECT,
            arguments: [{
                    type: 1,
                    value: '0cqv$41Df7ygSQzJTMBnvM'
                },
                {
                    type: 1,
                    value: ''
                },
                {
                    type: 1,
                    value: 'foobar'
                },
                null,
                {
                    type: 5,
                    value: 1
                },
                {
                    type: 1,
                    value: ''
                },
                {
                    type: 5,
                    value: 2
                },
                [{
                    type: 5,
                    value: 3
                }],
                {
                    type: 5,
                    value: 2
                }
            ]
        })
        let project: any = ifcApi.GetLine(emptyFileModelID, 1);
        expect(project.Name.value).toBe("foobar");
    })
    test('can write a line by giving a line object', () => {
        let projectBeforeWriting: any = ifcApi.GetAllLines(modelID);
        let payload = new IFC2X3.IfcBuildingElementProxy(
            new IFC2X3.IfcGloballyUniqueId('GUID'),
            new WebIFC.Handle(41),
            new IFC2X3.IfcLabel('NZ-SHS beam:100x6.0SHS:823947'),
            null,
            new IFC2X3.IfcLabel('NZ-SHS beam:100x6.0SHS'),
            new WebIFC.Handle(9750),
            new WebIFC.Handle(9987),
            null,
            null,
        );
        ifcApi.WriteLine(modelID, payload);
        let projectAfterWriting: any = ifcApi.GetAllLines(modelID);
        expect(projectBeforeWriting.size() + 1).toEqual(projectAfterWriting.size());
    })
    test('can modify a line by giving a line object', () => {
        let aSpace: any = ifcApi.GetLine(modelID, expressId);
        aSpace.Name.value = "foo";
        ifcApi.WriteLine(modelID, aSpace);
        let aSpaceReloaded: any = ifcApi.GetLine(modelID, expressId);
        expect(aSpaceReloaded.Name.value).toEqual("foo");
    })

    test('can Export File As IFC', () => {
        let ifcDatas = ifcApi.SaveModel(modelID);
        let exportModelID = ifcApi.OpenModel(ifcDatas);
        const line: any = ifcApi.GetLine(exportModelID, expressId);
        expect(exportModelID).toEqual(2);
        expect(line.expressID).toEqual(expressId);
    })

});

describe('WebIfcApi known failures', () => {
    describe("issue:#212", () => {
        test("GetLine doesn't support all entity types (only IFC4?) issue:#212", async () => {
            let ifcApi = new WebIFC.IfcAPI();
            await ifcApi.Init();
            let failModelID = 0;
            const exampleIFCPath: string = path.join(__dirname, '../ifcfiles/public/Sample_entities.ifc');
            const exampleIFCData = fs.readFileSync(exampleIFCPath);
            failModelID = ifcApi.OpenModel(exampleIFCData);
            const IFCELECTRICDISTRIBUTIONPOINT_EXPRESSID = 237;
            try {
                ifcApi.GetLine(failModelID, IFCELECTRICDISTRIBUTIONPOINT_EXPRESSID);
                expect(false).toBeTruthy();
            } catch (error) {
                expect(true).toBeTruthy();
            }

            ifcApi.CloseModel(failModelID);
        })
    });

    describe("issue:#209", () => {
        test("OpenModel fails when USE_FAST_BOOLS is disabled issue:#209", async () => {
            let ifcApi = new WebIFC.IfcAPI();
            let config = {
                COORDINATE_TO_ORIGIN: false,
                USE_FAST_BOOLS: false
            };
            await ifcApi.Init();
            let failModelID = 0;
            const exampleIFCPath: string = path.join(__dirname, '../ifcfiles/public/S_Office_Integrated Design Archi.ifc');
            const exampleIFCData = fs.readFileSync(exampleIFCPath);
            try {
                ifcApi.OpenModel(exampleIFCData, config);
                expect(true).toBeFalsy();
            } catch (error) {
                expect(true).toBeTruthy();
            }
            ifcApi.CloseModel(failModelID);
        })
    });
})

describe('some use cases', () => {
    test("can write a new property value and read it back in", async () => {
    
          let storey = await ifcApi.properties.getItemProperties(modelID, 138);
          const newStoreyName = 'Nivel 1 - Editado'
          storey.LongName.value = newStoreyName;
          ifcApi.WriteLine(modelID, storey);
          storey = await ifcApi.properties.getItemProperties(modelID, 138);
          expect(storey.LongName.value).toBe(newStoreyName);
      
          const writtenData = await ifcApi.SaveModel(modelID);
          let modelId = ifcApi.OpenModel(writtenData);
          storey = await ifcApi.properties.getItemProperties(modelId, 138);
          expect(storey.LongName.value).toBe(newStoreyName);
    })
})


describe('creating ifc', () => {
    test('can create new ifc model', () => {
        let createdID = ifcApi.CreateModel({schema: WebIFC.Schemas.IFC2X3});
        expect(createdID).toBe(4);
        expect(ifcApi.GetModelSchema(createdID)).toBe(WebIFC.Schemas.IFC2X3);
        expect(ifcApi.wasmModule.GetModelSize(createdID)).toBeGreaterThan(0);
        expect(ifcApi.GetHeaderLine(createdID, WebIFC.FILE_NAME)['arguments'].length).toBe(7);
        expect(ifcApi.GetHeaderLine(createdID, WebIFC.FILE_DESCRIPTION)['arguments'].length).toBeGreaterThan(1);
        expect(ifcApi.GetHeaderLine(createdID, WebIFC.FILE_SCHEMA)['arguments'].length).toBe(1);
        ifcApi.CloseModel(createdID);
    });

    test('can create & save new ifc model', () => {
        let createdID = ifcApi.CreateModel({schema: WebIFC.Schemas.IFC2X3});
        expect(createdID).toBe(5);
        ifcApi.SaveModel(createdID);
        ifcApi.CloseModel(createdID);
    });

    test("create an IFC object from Typecode", () => {
        let entity: IfcLineObject  = ifcApi.CreateIfcEntity(modelID, WebIFC.IFCCARTESIANPOINT, [new IFC2X3.IfcLengthMeasure(5), new IFC2X3.IfcLengthMeasure(5), new IFC2X3.IfcLengthMeasure(5)]);
        expect(entity.type).toBe(WebIFC.IFCCARTESIANPOINT);
        expect(entity.constructor.name).toBe('IfcCartesianPoint');
    });

    test('can write new ifc entity', () => {
        let entity: IfcLineObject  = ifcApi.CreateIfcEntity(modelID, WebIFC.IFCCARTESIANPOINT, [new IFC2X3.IfcLengthMeasure(5), new IFC2X3.IfcLengthMeasure(5), new IFC2X3.IfcLengthMeasure(5)]);
        ifcApi.WriteLine(modelID, entity);
    });

    test('can create ifc type', () => {
        let type = ifcApi.CreateIfcType(modelID, WebIFC.IFCREAL, 1.0);
        expect(type.type).toBe(WebIFC.REAL);
        expect(type.constructor.name).toBe('IfcReal');
        expect(type.value).toBe(1.0);
    });

    test('can delete ifc line', () => {
        let entity: IfcLineObject  = ifcApi.CreateIfcEntity(modelID, WebIFC.IFCCARTESIANPOINT, [new IFC2X3.IfcLengthMeasure(5), new IFC2X3.IfcLengthMeasure(5), new IFC2X3.IfcLengthMeasure(5)]);
        ifcApi.WriteLine(modelID, entity);
        ifcApi.DeleteLine(modelID,entity.expressID);
        expect(ifcApi.GetLine(modelID,entity.expressID)).toBe(undefined);
    });

    
});

describe('opening large amounts of data', () => {
    test("open a small model but with a heavy memory restriction", () => {
        let s: LoaderSettings = {
            MEMORY_LIMIT :  10485760,
            TAPE_SIZE : 104857
        };
        const exampleIFCData = fs.readFileSync(path.join(__dirname, '../ifcfiles/public/S_Office_Integrated Design Archi.ifc'));
        let modelId = ifcApi.OpenModel(exampleIFCData,s);
        expect(modelId).toBe(6);
    });

     test("open a small model but many times", () => {
        let s: LoaderSettings = {
            TAPE_SIZE : 104857
        };
        const exampleIFCData = fs.readFileSync(path.join(__dirname, '../ifcfiles/public/example.ifc'));
        let exampleIFCDatas : Array<Uint8Array> = [];
        for (let i=0; i < 100; i++) exampleIFCDatas.push(exampleIFCData); 
        let modelIds = ifcApi.OpenModels(exampleIFCDatas,s);
        expect(modelIds.length).toBe(100);
    });
    
})

describe('function based opening', () => {
    test("open a file through a callback function",  () => {
       
        let file =fs.openSync(path.join(__dirname, '../ifcfiles/public/example.ifc'),'r');
        let retriever = function (offset:number, size: number) {
            let data = new Uint8Array(size);
            let bytesRead = fs.readSync(file,data,0,size,offset);            
            if (bytesRead <= 0 ) return new Uint8Array(0);
            return data;       
        }
        let modelId = ifcApi.OpenModelFromCallback(retriever);
        fs.closeSync(file);
        expect(ifcApi.GetAllLines(modelId).size()).toBe(6488);
    });
});

describe('write a large IFC file', () => {
    test("write a large IFC file in stages",  () => {
         const modelOption = {
            schema: Schemas.IFC2X3,  // ifc版本
            name: "test.ifc",
            description: ["1", "2"],
            authors: ["3", "4"],
            organizations: ["5", "6"],
            authorization: "78",
        }
        const modelCount = 2;
        let newModelID = 0;
        let maxExpressID = 1;
        for (let i = 0; i < modelCount; i++) {
            newModelID = ifcApi.CreateModel(modelOption);
            const faces = [];
            let cartPoint1 = ifcApi.CreateIfcEntity(newModelID,IFCCARTESIANPOINT,[ifcApi.CreateIfcType(newModelID,IFCLENGTHMEASURE,1),ifcApi.CreateIfcType(newModelID,IFCLENGTHMEASURE,2),ifcApi.CreateIfcType(newModelID,IFCLENGTHMEASURE,3)]);
            cartPoint1.expressID = maxExpressID++;
            let cartPoint2 = ifcApi.CreateIfcEntity(newModelID,IFCCARTESIANPOINT,[ifcApi.CreateIfcType(newModelID,IFCLENGTHMEASURE,4),ifcApi.CreateIfcType(newModelID,IFCLENGTHMEASURE,5),ifcApi.CreateIfcType(newModelID,IFCLENGTHMEASURE,6)]);
            cartPoint2.expressID = maxExpressID++;
            let cartPoint3 = ifcApi.CreateIfcEntity(newModelID,IFCCARTESIANPOINT,[ifcApi.CreateIfcType(newModelID,IFCLENGTHMEASURE,7),ifcApi.CreateIfcType(newModelID,IFCLENGTHMEASURE,8),ifcApi.CreateIfcType(newModelID,IFCLENGTHMEASURE,9)]);
            cartPoint3.expressID = maxExpressID++;
            let array = [cartPoint1, cartPoint2, cartPoint3];
            let poly = ifcApi.CreateIfcEntity(newModelID,IFCPOLYLOOP, array);
            poly.expressID = maxExpressID++;
            ifcApi.WriteLine(newModelID, poly);

            const faceOuterBound = ifcApi.CreateIfcEntity(newModelID,IFCFACEOUTERBOUND, poly, true)
            faceOuterBound.expressID = maxExpressID++;
            ifcApi.WriteLine(newModelID, faceOuterBound);

            const face = ifcApi.CreateIfcEntity(newModelID,IFCFACE, [faceOuterBound])
            face.expressID = maxExpressID++;
            faces.push(face);
            ifcApi.WriteLine(newModelID, face);
            
            fs.appendFileSync("test.ifc", ifcApi.SaveModel(newModelID)); 
            fs.appendFileSync("test.ifc", "\n---------------------\n"); 
            ifcApi.CloseModel(newModelID)
        }

    });
    test("write a large IFC file",  () => {
        const modelOption = {
            schema: Schemas.IFC2X3,  // ifc版本
            name: "test.ifc",
            description: ["1", "2"],
            authors: ["3", "4"],
            organizations: ["5", "6"],
            authorization: "78",
        }
        let newModID = ifcApi.CreateModel(modelOption);
        const modelCount = 1;
        for (let i = 0; i < modelCount; i++) {
            for (let j = 0; j < 1; j++) {
                let cartPoint1 = ifcApi.CreateIfcEntity(newModID,IFCCARTESIANPOINT,[ifcApi.CreateIfcType(newModID,IFCLENGTHMEASURE,1),ifcApi.CreateIfcType(newModID,IFCLENGTHMEASURE,2),ifcApi.CreateIfcType(newModID,IFCLENGTHMEASURE,3)]);
                let cartPoint2 = ifcApi.CreateIfcEntity(newModID,IFCCARTESIANPOINT,[ifcApi.CreateIfcType(newModID,IFCLENGTHMEASURE,4),ifcApi.CreateIfcType(newModID,IFCLENGTHMEASURE,5),ifcApi.CreateIfcType(newModID,IFCLENGTHMEASURE,6)]);
                let cartPoint3 = ifcApi.CreateIfcEntity(newModID,IFCCARTESIANPOINT,[ifcApi.CreateIfcType(newModID,IFCLENGTHMEASURE,7),ifcApi.CreateIfcType(newModID,IFCLENGTHMEASURE,8),ifcApi.CreateIfcType(newModID,IFCLENGTHMEASURE,9)]);
                let array = [cartPoint1, cartPoint2, cartPoint3];
                let poly = ifcApi.CreateIfcEntity(newModID,IFCPOLYLOOP,array);
                ifcApi.WriteLine(newModID, poly);
            }
        }      
    // save file
    function callback(_:Uint8Array) {}
    ifcApi.SaveModelToCallback(newModID,callback);
    ifcApi.CloseModel(newModID);
       
    });
});

afterAll(() => {
    ifcApi.CloseModel(modelID);
    ifcApi.CloseModel(emptyFileModelID);
    const isOpen: boolean = ifcApi.IsModelOpen(modelID);
    const isOpenEmptyFileModelID: boolean = ifcApi.IsModelOpen(emptyFileModelID);

    expect(isOpen).toBeFalsy()
    expect(isOpenEmptyFileModelID).toBeFalsy()
})
