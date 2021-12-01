import * as fs from 'fs';
import * as path from 'path';
import * as WebIFC from '../../dist/web-ifc-api-node.js';
import type { Vector, FlatMesh, IfcAPI } from '../../dist/web-ifc-api-node.js';

let modelID : number
let ifcApi : IfcAPI
beforeAll(async () => {
    ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();

    const exampleIFCPath = path.join(__dirname, '../artifacts/example.ifc');
    const exampleIFCData = fs.readFileSync(exampleIFCPath);
    modelID = ifcApi.OpenModel(exampleIFCData);
})

describe('WebIfcApi', () => {
    test('Load a basic IFC model', async () => {
        const geometry : Vector<FlatMesh> = ifcApi.LoadAllGeometry(modelID);

        expect(modelID).toBe(0);
        expect(geometry.size()).toBe(119);
    })
})

afterAll(() => {
    ifcApi.CloseModel(modelID);
})
