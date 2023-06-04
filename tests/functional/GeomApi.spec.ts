import * as fs from 'fs';
import * as path from 'path';
import * as WebIFC from '../../dist/web-ifc-api-node.js';

let ifcApi: WebIFC.IfcAPI;
let modelId = -1

describe('GeomApi', () => {
    beforeAll(async () => {
        ifcApi = new WebIFC.IfcAPI();
        await ifcApi.Init();
        ifcApi.SetLogLevel(WebIFC.LogLevel.LOG_LEVEL_OFF);
        const model = {
            schema: WebIFC.Schemas.IFC4X3,
            name: 'ModelApi',
            description: ['ViewDefinition []'],
            organizations: ['Acme'],
            authors: [{
                name: 'Schmitz',
                organization: {
                    name: 'Acme',
                },
            }],
        };
        modelId = ifcApi.modelApi.Create(model);
    });

    test('Add LocalPlacement', () => {
        const localPlacement = {
            relativePlacement: 9,
        };
        ifcApi.geomApi.AddLocalPlacement(modelId, localPlacement);
    });

    test('Add Axis2Placement3D', () => {
        const axis2Placement3D = {
            location: {
                x: 0, y: 0, z: 0,
            },
            axis: {
                x: 1, y: 0, z: 0,
            },
        };
        ifcApi.geomApi.AddAxis2Placement3D(modelId, axis2Placement3D);
    });

    test('Add CartesianPointList3D', () => {
        // cube
        const coordList = [
            {x: 0, y: 0, z: 0},
            {x: 1, y: 0, z: 0},
            {x: 1, y: 1, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 0, z: 1},
            {x: 1, y: 0, z: 1},
            {x: 1, y: 1, z: 1},
            {x: 0, y: 1, z: 1},
        ];
        const cartesianPointList3D = {
            coordList,
        };
        ifcApi.geomApi.AddCartesianPointList3D(modelId, cartesianPointList3D);
    });

    test('Add Polyline', () => {
        const polyline = {
            points: [
                {x: 0, y: 0, z: 0,}, 
                {x: 1, y: 0, z: 0},
                {x: 1, y: 1, z: 0},
            ],
        };
        const polyline2 = {
            points: [ 28, 29, 30 ]
        };

        ifcApi.geomApi.AddPolyline(modelId, [polyline, polyline2]);
    });

    test('Add Block', () => {
        const block = {
            position: 26,
            xLength: 1,
            yLength: 1,
            zLength: 1,
        };
        ifcApi.geomApi.AddCsgPrimitive3D(modelId, block);
    });

    afterAll(() => {
        const buffer = ifcApi.SaveModel(modelId);
        fs.writeFileSync(path.join(__dirname, '../artifacts/geomApi.ifc'), buffer);
        ifcApi.CloseModel(modelId);
    });
});