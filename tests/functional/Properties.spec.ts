import * as fs from 'fs';
import * as path from 'path';
import { Properties, IfcAPI, IFCRELASSOCIATESMATERIAL, IFCRELDEFINESBYPROPERTIES, IFCWALLSTANDARDCASE, LogLevel, logical } from '../../dist/web-ifc-api-node.js';

declare global {
	namespace jest {
	  interface Matchers<R> {
		toContainHandle(arg: {type: number, value:number}): R;
	  }
	}
}

expect.extend({
	toContainHandle(received, argument) {
		const pass = this.equals(received,
			expect.arrayContaining([
				expect.objectContaining(argument)
			])
		);
		if (pass) {
			return {
				message: () => `expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`,
				pass: true,
			};
		} else {
			return {
				message: () => `expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`,
				pass: false,
			};
		}
	},
});

let modelID: number
let ifcApi: IfcAPI
let properties: Properties
let totalPsets: number;
let totalMaterials: number;

beforeAll(async () => {
    ifcApi = new IfcAPI();
    await ifcApi.Init();
    ifcApi.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
    const exampleIFCPath = path.join(__dirname, '../ifcfiles/public/example.ifc');
    const exampleIFCData = fs.readFileSync(exampleIFCPath);
    modelID = ifcApi.OpenModel(exampleIFCData);
    properties = ifcApi.properties;
	totalPsets = ifcApi.GetLineIDsWithType(modelID, IFCRELDEFINESBYPROPERTIES).size();
	totalMaterials = ifcApi.GetLineIDsWithType(modelID, IFCRELASSOCIATESMATERIAL).size();
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
        const wallsStandard = ifcApi.GetNameFromTypeCode(IFCWALLSTANDARDCASE);
        expect(wallsStandard).toEqual("IfcWallStandardCase")
    })

    test('can get property sets', async () => {
        const propertySets = await properties.getPropertySets(modelID, 9989);
        expect(propertySets.length).toEqual(4);
    })

	test('can get all property sets in project', async () => {
        const propertySets = await properties.getPropertySets(modelID);
        expect(propertySets.length).toEqual(totalPsets);
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

	test('can get all property materials in project', async () => {
        const propertyMaterials = await properties.getMaterialsProperties(modelID);
        expect(propertyMaterials.length).toEqual(totalMaterials);
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

    test('get get the proper value of a logical', async () => {
	       const line = await ifcApi.GetLine(modelID,13862);
	       expect(line.NominalValue.value == logical.UNKNOWN);
    })

    test('get get the proper value of a boolean', async () => {
	       const line = await ifcApi.GetLine(modelID,242);
	       expect(line.NominalValue.value == false);
	       const line2 = await ifcApi.GetLine(modelID,243);
	       expect(line2.NominalValue.value == true);
    })

})

describe('Setting material & propertySets on IfcElements', () => {
	test('can set one material on one element', async () => {
		// #14047= IFCRELASSOCIATESMATERIAL('3xRpPFCPD3cwCupbS83ngR',#41,$,$,(#917),#926);
		// #14050= IFCRELASSOCIATESMATERIAL('2kcWWB4wHAhQ3YG$4Zv5JK',#41,$,$,(#1469),#1476);
		const ascLength = await ifcApi.GetLine(modelID, 917, false, true)['HasAssociations'].length;
		let materialProps = await properties.getMaterialsProperties(modelID, 917);
		const matLength = materialProps.length;

		await properties.setMaterialsProperties(modelID, 917, 1476);

		materialProps = await properties.getMaterialsProperties(modelID, 917);
		const rel = await ifcApi.GetLine(modelID, 14050);
		const element = await ifcApi.GetLine(modelID, 917, false, true);
		expect(materialProps.length - matLength).toEqual(1);
		expect(rel['RelatedObjects'].length).toEqual(2);
		expect(element['HasAssociations'].length - ascLength).toEqual(1);
		expect(element['HasAssociations']).toContainHandle({type:5, value:14050});
		expect(rel['RelatedObjects']).toContainHandle({type:5, value:917});
	});

	test('can not set existing material on element', async () => {
		// #14047= IFCRELASSOCIATESMATERIAL('3xRpPFCPD3cwCupbS83ngR',#41,$,$,(#917),#926);
		// #14050= IFCRELASSOCIATESMATERIAL('2kcWWB4wHAhQ3YG$4Zv5JK',#41,$,$,(#1469),#1476);
		const ascLength = await ifcApi.GetLine(modelID, 917, false, true)['HasAssociations'].length;
		let materialProps = await properties.getMaterialsProperties(modelID, 917);
		const matLength = materialProps.length;

		await properties.setMaterialsProperties(modelID, 917, 1476);

		materialProps = await properties.getMaterialsProperties(modelID, 917);
		const rel = await ifcApi.GetLine(modelID, 14050);
		const element = await ifcApi.GetLine(modelID, 917, false, true);
		expect(materialProps.length - matLength).toEqual(0);	// no changes
		expect(rel['RelatedObjects'].length).toEqual(2);
		expect(element['HasAssociations'].length - ascLength).toEqual(0);	// no changes	
		expect(element['HasAssociations']).toContainHandle({type:5, value:14050});
		expect(rel['RelatedObjects']).toContainHandle({type:5, value:917});
	});

	test('can set many materials on many elements', async () => {
		// #14047= IFCRELASSOCIATESMATERIAL('3xRpPFCPD3cwCupbS83ngR',#41,$,$,(#917),#926);
		// #14050= IFCRELASSOCIATESMATERIAL('2kcWWB4wHAhQ3YG$4Zv5JK',#41,$,$,(#1469),#1476);
		// #14052= IFCRELASSOCIATESMATERIAL('3BvHT8u3T52eiBSaJrrWo0',#41,$,$,(#1477),#1473);
		const ascLength = await ifcApi.GetLine(modelID, 1469, false, true)['HasAssociations'].length;
		let materialProps = await properties.getMaterialsProperties(modelID, 1469);
		const matLength = materialProps.length;

		await properties.setMaterialsProperties(modelID, [1469], [926, 1473]);

		materialProps = await properties.getMaterialsProperties(modelID, 1469);
		const rel = await ifcApi.GetLine(modelID, 14052);
		const rel1 = await ifcApi.GetLine(modelID, 14047);
		const element = await ifcApi.GetLine(modelID, 1469, false, true);
		expect(materialProps.length - matLength).toEqual(2);
		expect(rel['RelatedObjects'].length).toEqual(2);
		expect(element['HasAssociations'].length - ascLength).toEqual(2);
		expect(element['HasAssociations']).toContainHandle({type:5, value:14052});
		expect(element['HasAssociations']).toContainHandle({type:5, value:14047});
		expect(rel['RelatedObjects']).toContainHandle({type:5, value:1469});
		expect(rel1['RelatedObjects']).toContainHandle({type:5, value:1469});
	});

	test('can set propertyset on an element', async () => {
		// #158= IFCRELDEFINESBYPROPERTIES('2V77wsE0r5MQR$Rh7MmJbX',#41,$,$,(#148),#153);
		let propSets = await properties.getPropertySets(modelID, 9989);
		const length = propSets.length;

		await properties.setPropertySets(modelID, 9989, 153);

		propSets = await properties.getPropertySets(modelID, 9989);
		expect(propSets.length - length).toEqual(1);
	});

	test('can not set materials on IfcEntities who inherit from IfcRelationships', async () => {
		expect(await properties.setMaterialsProperties(modelID, 14050, 1476)).toEqual(false);
	});

	test('can not set psets on IfcEntities who inherit from IfcRelationships', async () => {
		expect(await properties.setPropertySets(modelID, 14050, 153)).toEqual(false);
	});
});

afterAll(() => {
    ifcApi.CloseModel(modelID);
})
