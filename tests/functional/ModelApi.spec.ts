import * as fs from 'fs';
import * as path from 'path';
import * as WebIFC from '../../dist/web-ifc-api-node.js';
import { Building, BuildingStorey } from '../../dist/api/modelApi.js';

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
            schema: WebIFC.Schemas.IFC4,
            name: 'ModelApi',
            description: ['ViewDefinition []'],
            organizations: ['Acme'],
            authors: [{
                name: 'Schmitz',
                organization: {
                    name: 'Acme',
                },
            }],
        }
        modelId = ifcApi.modelApi.Create(model);
        expect(modelId).toBeGreaterThan(-1);
    });

    test('Add author', () => {
        const author = {
            name: 'Meijer',
            address: {
                country: 'NL',
            },
            organization: 19,
        };
        ifcApi.modelApi.AddPerson(modelId, author);
    });

    test('Add Building', () => {
        const building: Building = {
            globalId: '2X0Q1XJzv0yQjz1Q1X0Q1',
            ownerHistory: 21,
            name: 'Building',
            longName: 'Building Test',
            description: 'Building',
            compositionType: 'ELEMENT',
            elevationOfRefHeight: 0,
            elevationOfTerrain: 0,
            buildingAddress: 23,
            objectPlacement: {
                relativePlacement: 9,
            }
        };
        ifcApi.modelApi.AddBuilding(modelId, building);
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
            
        };
        ifcApi.modelApi.AddBuildingStorey(modelId, buildingStorey);
    });


    afterAll(() => {
        const buffer = ifcApi.SaveModel(modelId);
        fs.writeFileSync(path.join(__dirname, '../artifacts/modelApi.ifc'), buffer);
        ifcApi.CloseModel(modelId);
    });
});