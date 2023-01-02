import * as fs from 'fs';
import * as path from 'path';
import {IfcAPI,IFCWALLSTANDARDCASE,LogLevel}  from '../../dist/web-ifc-api-node.js';
import {Properties} from '../../dist/helpers/properties.js';

let modelID: number
let ifcApi: IfcAPI
let properties: Properties

beforeAll(async () => {
    ifcApi = new IfcAPI();
    await ifcApi.Init();
    ifcApi.SetLogLevel(LogLevel.OFF);
    const exampleIFCPath = path.join(__dirname, '../artifacts/example.ifc.test');
    const exampleIFCData = fs.readFileSync(exampleIFCPath);
    modelID = ifcApi.OpenModel(exampleIFCData);
    properties = ifcApi.properties
})

describe('Properties', () => {
    test('can get all IFCWALLSTANDARDCASE items', async () => {
        const walls: any = await ifcApi.GetLineIDsWithType(modelID, IFCWALLSTANDARDCASE)
        expect(walls.size()).toBe(17)
    })

    test('can get IFCWALLSTANDARDCASE details', async () => {
        const allWalls: any = await ifcApi.GetLineIDsWithType(modelID, IFCWALLSTANDARDCASE)
        const firstWallId = allWalls.get(0);
        const line = await properties.getItemProperties(modelID, firstWallId)
        expect(line.Name.value).toEqual('Basic Wall:150 Concrete:677248')
    })

    test('can get IFC type from integer', async () => {
        const wallsStandard = properties.getIfcType(IFCWALLSTANDARDCASE);
        expect(wallsStandard).toEqual("IFCWALLSTANDARDCASE")
    })

    test('can get property sets', async () => {
        const propertySets = await properties.getPropertySets(modelID, 9989);
        expect(propertySets.length).toEqual(4);
    })

    test('can get property sets with children datas', async () => {
        const propertySets = await properties.getPropertySets(modelID, 9989, true);
        let HasProperties = propertySets[0]["HasProperties"].length;
        expect(HasProperties > 0).toBe(true);
    })

    test('can get property sets with children datas ', async () => {
        const propertySets = await properties.getPropertySets(modelID, 9989, true);
        let HasProperties = propertySets[0]["HasProperties"].length;
        expect(HasProperties > 0).toBe(true);
    })

    test('can get property materials on one given element', async () => {
        const propertyMaterials = await properties.getMaterialsProperties(modelID, 10258);
        expect(propertyMaterials[0]["Name"]["value"]).toEqual('Metal - Steel - 345 MPa');
    })

    // this test stink it needs to be reviewed
    test('can get spatial structure ', async () => {
        const spatialStructure: any = await properties.getSpatialStructure(modelID);
        let site = spatialStructure.children[0];
        let building = site.children[0];
        let storey = building.children[0];

        expect(spatialStructure.expressID == 119).toBeTruthy();
        expect(site.expressID == 148).toBeTruthy();
        expect(building.expressID == 129).toBeTruthy();
        expect(storey.expressID == 138).toBeTruthy();
        expect(storey.children.length).toEqual(46);
    })

    test('can get spatial structure including properties', async () => {
        const spatialStructure: any = await properties.getSpatialStructure(modelID, true);
        let site = spatialStructure.children[0];
        let building = site.children[0];
        let storey = building.children[0];
        let elements = storey.children;
        expect(elements[0].hasOwnProperty("GlobalId")).toBeTruthy();
    })

    test('can get all items of a given type', async () => {
        const IFCWALLSTANDARDCASEITEMS: any = await ifcApi.GetLineIDsWithType(modelID, IFCWALLSTANDARDCASE);
        expect(IFCWALLSTANDARDCASEITEMS.size()).toEqual(17);
    })

    test('can get all items of a given type with more details ( verbose )', async () => {
        const IFCWALLSTANDARDCASEITEMS: any = await ifcApi.GetLineIDsWithType(modelID, IFCWALLSTANDARDCASE);
        expect(IFCWALLSTANDARDCASEITEMS.size()).toEqual(17);
        const IFCWALLSTANDARDCASELINEDATA: any = await ifcApi.GetLine(modelID, IFCWALLSTANDARDCASEITEMS.get(0));
        expect(IFCWALLSTANDARDCASELINEDATA.hasOwnProperty("GlobalId")).toBeTruthy();
    })

})

afterAll(() => {
    ifcApi.CloseModel(modelID);
})