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
        modelId = ifcApi.modelApi.Create() || -1;
        expect(modelId).toBeGreaterThan(-1);
        const buffer = ifcApi.SaveModel(modelId);
        fs.writeFileSync(path.join(__dirname, '../artifacts/modelApi.ifc'), buffer);
    });
});