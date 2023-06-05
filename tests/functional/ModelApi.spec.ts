import * as fs from 'fs';
import * as path from 'path';
import * as WebIFC from '../../dist/web-ifc-api-node.js';
//import { Building, BuildingStorey } from '../../dist/api/modelApi.js';

let ifcApi: WebIFC.IfcAPI;
let modelId = -1

describe('ModelApi', () => {
    beforeAll(async () => {
        ifcApi = new WebIFC.IfcAPI();
        await ifcApi.Init();
        ifcApi.SetLogLevel(WebIFC.LogLevel.LOG_LEVEL_OFF);
    })

    test('Create', () => {
        const model = {
            schema: WebIFC.Schemas.IFC4X3,
            name: 'ModelApi',
            author:  {
                FamilyName: {type: WebIFC.IFCLABEL, value: 'Meijer'},
                GivenName: {type: WebIFC.IFCLABEL, value: 'Jeroen'},
                MiddleNames: [{type: WebIFC.IFCLABEL, value: 'Peter'}],
                PrefixTitles: [{type: WebIFC.IFCLABEL, value: 'Ing.'}],
                SuffixTitles: [{type: WebIFC.IFCLABEL, value: 'MSc'}],
                EngagedIn: null,
                type: WebIFC.IFCPERSON
            },
        }
        modelId = ifcApi.modelApi.Create(model);
        expect(modelId).toBeGreaterThan(-1);
    });

    test('Add IfcApplication', () => {
        const application = new WebIFC.IFC4X3.IfcApplication(
            {type: WebIFC.REF , value: 23},
            {type: WebIFC.IFCLABEL, value: '1.0'},
            {type: WebIFC.IFCLABEL, value: 'WebIFC'},
            {type: WebIFC.IFCLABEL, value: 'WebIFC'},
        );
        ifcApi.modelApi.AddApplication(modelId, application) as number;
    });
/*
    test('Add author and Postaladdress', () => {
        const author = new WebIFC.IFC4X3.IfcPerson(
            null,
            ifcApi.CreateIfcType(modelId, WebIFC.IFCLABEL, 'Schmitz'),
            ifcApi.CreateIfcType(modelId, WebIFC.IFCLABEL, 'Jeroen'),
            [ifcApi.CreateIfcType(modelId, WebIFC.IFCLABEL, 'Peter')],
            [ifcApi.CreateIfcType(modelId, WebIFC.IFCLABEL, 'Ing.')],
            [ifcApi.CreateIfcType(modelId, WebIFC.IFCLABEL, 'MSc')],
        );
        // jest bug ? 
        const personId = ifcApi.modelApi.AddPerson(modelId, author) as unknown as number;
        expect(personId).toBeGreaterThan(0);
        // if organization is set, the return id is the PersonAndOrganization id
        const line = ifcApi.GetLine(modelId, personId-1);
        expect(line.FamilyName.value).toBe('Meijer');
        expect(line.GivenName.value).toBe('Jeroen');
        expect(line.MiddleNames[0].value).toBe('Peter');
        expect(line.PrefixTitles[0].value).toBe('Ing.');
        expect(line.SuffixTitles[0].value).toBe('MSc');
    });
    */
/*
    test('Add Building', () => {
        const building: Building = {
            globalId: '2X0Q1XJzv0yQjz1Q1X0Q1',
            ownerHistory: 21,
            name: 'Building',
            longName: 'Building Test',
            description: 'Building for test',
            compositionType: 'ELEMENT',
            elevationOfRefHeight: 0,
            elevationOfTerrain: 0,
            buildingAddress: 23,
            objectPlacement: {
                relativePlacement: 9,
            },
            objectType: 'USERDEFINED',
        };
        const buildingId = ifcApi.modelApi.AddBuilding(modelId, building) as number;
        expect(buildingId).toBeGreaterThan(0);
        const line = ifcApi.GetLine(modelId, buildingId);
        expect(line.Name.value).toBe('Building');
        expect(line.LongName.value).toBe('Building Test');
        expect(line.Description.value).toBe('Building for test');
    });

    test('Add BuildingStorey', () => {
        const buildingStorey: BuildingStorey = {
            globalId: '2X0Q1XJzv0yQjz1Q1X0Q2',
            ownerHistory: 21,
            name: 'Level 1',
            longName: 'Level 1',
            description: 'Level 1 ground floor',
            elevation: 0,
            compositionType: 'ELEMENT',
            objectPlacement: 26,
            objectType: 'USERDEFINED',
        };
        const storeyId = ifcApi.modelApi.AddBuildingStorey(modelId, buildingStorey) as number;
        expect(storeyId).toBeGreaterThan(0);
        const line = ifcApi.GetLine(modelId, storeyId);
        expect(line.Name.value).toBe('Level 1');
        expect(line.LongName.value).toBe('Level 1');
        expect(line.Description.value).toBe('Level 1 ground floor');
    });

    test('Add BuildingElementProxy', () => {
        const buildingElementProxy = {
            globalId: '2X0Q1XJzv0yQjz1Q1X0Q3',
            ownerHistory: 21,
            name: 'Proxy',
            description: 'Proxy for test',
            objectPlacement: {
                relativePlacement: 9,
            },
            representation: {
                representations: [{
                    contextOfItems: 10,
                    representationId: 'Body',
                    representationType: 'BoundingBox',
                    items: [33],
                }],
            }
        };
        const proxyId = ifcApi.modelApi.AddBuildingElementProxy(modelId, buildingElementProxy) as number;
        expect(proxyId).toBeGreaterThan(0);
        const line = ifcApi.GetLine(modelId, proxyId);
        expect(line.Name.value).toBe('Proxy');
        expect(line.Description.value).toBe('Proxy for test');
        const block = {
            position: 9,
            xLength: 1,
            yLength: 1,
            zLength: 1,
        };
        ifcApi.geomApi.AddCsgPrimitive3D(modelId, block);

    });
*/
    afterAll(() => {
        const buffer = ifcApi.SaveModel(modelId);
        fs.writeFileSync(path.join(__dirname, '../artifacts/modelApi.ifc'), buffer);
        ifcApi.CloseModel(modelId);
    });
});