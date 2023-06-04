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
                familyName: 'Schmitz',
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
        const cartesianPointList3D = {
            coordList: [
                {x: 0, y: 0, z: 0},
                {x: 1, y: 0, z: 0},
                {x: 1, y: 1, z: 0},
                {x: 0, y: 1, z: 0},
                {x: 0, y: 0, z: 1},
                {x: 1, y: 0, z: 1},
                {x: 1, y: 1, z: 1},
                {x: 0, y: 1, z: 1},
            ],
        };
        ifcApi.geomApi.AddCartesianPointList3D(modelId, cartesianPointList3D);
    });

    test('Add TriangulatedFaceSet', () => {
        const triangulatedFaceSet = {
            coordinates: 27,
            closed: true,
            coordIndex: [
                [0, 1, 2],
                [0, 2, 3],
                [0, 1, 5],
                [0, 5, 4],
                [0, 3, 7],
                [0, 7, 4],
                [1, 2, 6],
                [1, 6, 5],
                [2, 6, 7],
                [2, 7, 3],
                [4, 5, 6],
                [4, 6, 7],
            ]
        };

        ifcApi.geomApi.AddTriangulatedFaceSet(modelId, triangulatedFaceSet);
    });

    test('Add shape representation & product definition shape', () => {
        const shapeId = ifcApi.geomApi.AddShapeRepresentation(modelId, {
            contextOfItems: 10,
            representationId: 'Body',
            representationType: 'Tessellation',
            items: [28],
        }) as number;
        ifcApi.geomApi.AddProductDefShape(modelId, {
            representations: [shapeId],
        });
    });

    test('Add Polyline', () => {
        const polyline = {
            points: [
                {x: 0, y: 0, z: 0,}, 
                {x: 1, y: 0, z: 0},
                {x: 1, y: 1, z: 0},
            ],
        };

        ifcApi.geomApi.AddPolyline(modelId, polyline);
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