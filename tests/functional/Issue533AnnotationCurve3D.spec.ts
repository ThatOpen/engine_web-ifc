import * as WebIFC from '../../dist/web-ifc-api-node.js';

import type { IfcAPI } from '../../dist/web-ifc-api-node.js';
import * as fs from 'fs';
import * as path from 'path';

let ifcApi: IfcAPI;

beforeAll(async () => {
    ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();
    ifcApi.SetLogLevel(WebIFC.LogLevel.LOG_LEVEL_OFF);
});

// Regression for https://github.com/ThatOpen/engine_web-ifc/issues/533.
// The fixture is an IFC4X3 model exporting 3D annotation geometry the way
// Bentley/infrastructure tools do: an IfcShapeRepresentation('Body', 'Curve3D')
// of an IfcAnnotation holding an IfcIndexedPolyCurve over an
// IfcCartesianPointList3D (with and without explicit IfcLineIndex segments),
// plus direct IfcCartesianPoint/IfcCartesianPointList3D representation items.
describe('Issue 533: IFC4X3 3D point and 3D line support', () => {
    const fixturePath = path.join(__dirname, 'fixtures/annotation-curve3d/ifc4x3-annotation-curve3d.ifc');
    const ANNOTATION_POINT_LIST_NO_SEGMENTS = 17;
    const ANNOTATION_LINE_INDEX = 25;
    const ANNOTATION_ARC_INDEX = 33;
    const ANNOTATION_POLYLINE = 43;
    const ANNOTATION_POINT = 50;
    const ANNOTATION_POINT_LIST = 57;
    const PROXY_SOLID_WITH_AXIS = 77;

    function getPlacedGeometry(modelID: number, expressID: number) {
        const flatMesh = ifcApi.GetFlatMesh(modelID, expressID);
        expect(flatMesh.geometries.size()).toBe(1);
        return flatMesh.geometries.get(0);
    }

    function getVertexCount(modelID: number, placed: WebIFC.PlacedGeometry) {
        const geometry = ifcApi.GetGeometry(modelID, placed.geometryExpressID);
        const vertices = ifcApi.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
        geometry.delete();
        return vertices.length / 6;
    }

    // EXPORT_POLYLINES defaults to false: wireframe-only products export no geometry
    test('wireframe-only products export no geometry by default', () => {
        const modelID = ifcApi.OpenModel(fs.readFileSync(fixturePath));

        for (const expressID of [
            ANNOTATION_POINT_LIST_NO_SEGMENTS,
            ANNOTATION_LINE_INDEX,
            ANNOTATION_ARC_INDEX,
            ANNOTATION_POLYLINE,
            ANNOTATION_POINT,
            ANNOTATION_POINT_LIST,
        ]) {
            const flatMesh = ifcApi.GetFlatMesh(modelID, expressID);
            expect(flatMesh.geometries.size()).toBe(0);
        }

        ifcApi.CloseModel(modelID);
    });

    test('products with solid geometry keep exporting triangles only', () => {
        const modelID = ifcApi.OpenModel(fs.readFileSync(fixturePath));

        const placed = getPlacedGeometry(modelID, PROXY_SOLID_WITH_AXIS);
        expect(placed.geomType).toBe(WebIFC.GEOM_TRIANGLES);
        expect(getVertexCount(modelID, placed)).toBeGreaterThanOrEqual(8);

        ifcApi.CloseModel(modelID);
    });
});
