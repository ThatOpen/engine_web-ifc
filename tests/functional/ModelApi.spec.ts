import * as fs from 'fs';
import * as path from 'path';
import * as WebIFC from '../../dist/web-ifc-api-node.js';

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
                address: {
                    country: 'DE',
                }
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
            }
        };
        ifcApi.modelApi.AddAuthor(modelId, author);
    });

    afterAll(() => {
        const buffer = ifcApi.SaveModel(modelId);
        fs.writeFileSync(path.join(__dirname, '../artifacts/modelApi.ifc'), buffer);
        ifcApi.CloseModel(modelId);
    });
});