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
                familyName: 'Schmitz',
                organization: {
                    name: 'Acme',
                },
            }],
        }
        modelId = ifcApi.modelApi.Create(model);
        expect(modelId).toBeGreaterThan(-1);
    });

    test('Add author and Postaladdress', () => {
        const author = {
            familyName: 'Meijer',
            givenName: 'Jeroen',
            middleNames: ['Peter'],
            prefixTitles: ['Ing.'],
            suffixTitles: ['MSc'],
            address: [{
                purpose: 'OFFICE',
                description: 'Office for Team1',
                internalLocation: 'Office1',
                addressLines: ['Street 1'],
                postalBox: '123',
                town: 'Amsterdam',
                postalCode: '1234AB',
                region: 'Noord-Holland',
                country: 'NL',
            }],
            organization: 19,
        };
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

        const addr = ifcApi.GetLine(modelId, 23);
        expect(addr.Purpose.value).toBe('OFFICE');
        expect(addr.Description.value).toBe('Office for Team1');
        expect(addr.InternalLocation.value).toBe('Office1');
        expect(addr.AddressLines[0].value).toBe('Street 1');
        expect(addr.PostalBox.value).toBe('123');
        expect(addr.Town.value).toBe('Amsterdam');
        expect(addr.PostalCode.value).toBe('1234AB');
        expect(addr.Region.value).toBe('Noord-Holland');
        expect(addr.Country.value).toBe('NL');
    });

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


    afterAll(() => {
        const buffer = ifcApi.SaveModel(modelId);
        fs.writeFileSync(path.join(__dirname, '../artifacts/modelApi.ifc'), buffer);
        ifcApi.CloseModel(modelId);
    });
});