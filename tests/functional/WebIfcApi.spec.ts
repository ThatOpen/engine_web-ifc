import * as fs from 'fs';
import * as path from 'path';
import * as WebIFC from '../../dist/web-ifc-api-node.js';
import type { Vector, FlatMesh, IfcAPI } from '../../dist/web-ifc-api-node.js';

let modelID : number
let ifcApi : IfcAPI
beforeAll(async () => {
    ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();
    ifcApi.SetLogLevel(WebIFC.LogLevel.OFF);
    const exampleIFCPath = path.join(__dirname, '../artifacts/example.ifc.test');
    const exampleIFCData = fs.readFileSync(exampleIFCPath);
    modelID = ifcApi.OpenModel(exampleIFCData);
})

describe('WebIfcApi', () => {
    test('can retrieve a modelID', () => {
        expect(modelID).toBe(0);
    })

    test('can ensure model is open', () => {
        const isOpen : boolean = ifcApi.IsModelOpen(modelID);
        expect(isOpen).toBeTruthy();
    })

    test('can return the correct number of elements', () => {
        const geometry : Vector<FlatMesh> = ifcApi.LoadAllGeometry(modelID);
        expect(geometry.size()).toBe(119);
    })
})

afterAll(() => {
    ifcApi.CloseModel(modelID);
    const isOpen : boolean = ifcApi.IsModelOpen(modelID);
    expect(isOpen).toBeFalsy()
})
