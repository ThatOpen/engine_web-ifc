import * as fs from 'fs';
import * as path from 'path';
import * as WebIFC from '../../dist/web-ifc-api-node.js';
import type { IfcAPI } from '../../dist/web-ifc-api-node.js';
import type { Properties } from '../../dist/helpers/properties.js';

let modelID : number
let ifcApi : IfcAPI
let properties : Properties

beforeAll(async () => {
    ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();

    const exampleIFCPath = path.join(__dirname, '../artifacts/example.ifc.test');
    const exampleIFCData = fs.readFileSync(exampleIFCPath);
    modelID = ifcApi.OpenModel(exampleIFCData);
    properties = ifcApi.properties
})

describe('Properties', () => {
    test('can get all IFCWALLSTANDARDCASE items', async () => {
        // TODO Get IFCWALLSTANDARDCASE from the types map.
        const IFCWALLSTANDARDCASE = 3512223829
        const walls : any[] = await properties.getAllItemsOfType(modelID, IFCWALLSTANDARDCASE, false)
        expect(walls.length).toBe(17)
    })

    test('can get IFCWALLSTANDARDCASE details', async () => {
        // TODO Get IFCWALLSTANDARDCASE from the types map.
        const IFCWALLSTANDARDCASE = 3512223829
        const allWalls : any[] = await properties.getAllItemsOfType(modelID, IFCWALLSTANDARDCASE, false)
        const firstWallId = allWalls[0]
        const line = await properties.getItemProperties(modelID, firstWallId)
        expect(line.Name.value).toEqual('Basic Wall:150 Concrete:677248')
    })
})

afterAll(() => {
    ifcApi.CloseModel(modelID);
})
