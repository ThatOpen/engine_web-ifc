import * as WebIFC from '../../dist/web-ifc-api-node.js';
import {IFCBUILDINGELEMENTPROXY} from '../../dist/web-ifc-api-node.js';

import type {IfcAPI} from '../../dist/web-ifc-api-node.js';

const OBLIQUE_EXTRUSION_IFC = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [CoordinationView]'),'2;1');
FILE_NAME('','',(''),(''),'','','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#1=IFCCARTESIANPOINT((0.,0.,0.));
#2=IFCDIRECTION((0.,0.,1.));
#3=IFCDIRECTION((1.,0.,0.));
#4=IFCAXIS2PLACEMENT3D(#1,#2,#3);
#5=IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.0000000000000001E-05,#4,$);
#6=IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.);
#7=IFCSIUNIT(*,.AREAUNIT.,$,.SQUARE_METRE.);
#8=IFCSIUNIT(*,.VOLUMEUNIT.,$,.CUBIC_METRE.);
#9=IFCUNITASSIGNMENT((#6,#7,#8));
#10=IFCPROJECT('2f_i2TP$150hNbqDbwEUL1',$,'Oblique extrusion repro',$,$,$,$,(#5),#9);
#11=IFCAXIS2PLACEMENT3D(#1,$,$);
#12=IFCLOCALPLACEMENT($,#11);
#13=IFCSITE('0z6rD9EWn33QJVUZExLX2Y',$,'Site',$,$,#12,$,$,.ELEMENT.,$,$,$,$,$);
#14=IFCRELAGGREGATES('0TkvLXYq52jRxohG2h9SSr',$,$,$,#10,(#13));
#15=IFCRECTANGLEPROFILEDEF(.AREA.,$,$,2.,1.);
#16=IFCDIRECTION((0.,0.,1.));
#17=IFCEXTRUDEDAREASOLID(#15,$,#16,3.);
#18=IFCSHAPEREPRESENTATION(#5,'Body','SweptSolid',(#17));
#19=IFCPRODUCTDEFINITIONSHAPE($,$,(#18));
#20=IFCCARTESIANPOINT((0.,0.,0.));
#21=IFCAXIS2PLACEMENT3D(#20,$,$);
#22=IFCLOCALPLACEMENT(#12,#21);
#23=IFCBUILDINGELEMENTPROXY('2$wN9$6EH8VwEE17izw0qF',$,'perpendicular box',$,$,#22,#19,$,$);
#24=IFCRECTANGLEPROFILEDEF(.AREA.,$,$,2.,1.);
#25=IFCDIRECTION((0.,0.70710678118654757,0.70710678118654757));
#26=IFCEXTRUDEDAREASOLID(#24,$,#25,3.);
#27=IFCSHAPEREPRESENTATION(#5,'Body','SweptSolid',(#26));
#28=IFCPRODUCTDEFINITIONSHAPE($,$,(#27));
#29=IFCCARTESIANPOINT((5.,0.,0.));
#30=IFCAXIS2PLACEMENT3D(#29,$,$);
#31=IFCLOCALPLACEMENT(#12,#30);
#32=IFCBUILDINGELEMENTPROXY('1boC6KILrCrPTXUvdBNeDo',$,'oblique box',$,$,#31,#28,$,$);
#33=IFCRELCONTAINEDINSPATIALSTRUCTURE('30Mj6b91v3cwc4FkOgiRIL',$,$,$,(#23,#32),#13);
ENDSEC;
END-ISO-10303-21;
`;

let ifcApi: IfcAPI;
let modelID: number;

function minStoredVsGeometricNormalDot(expressID: number): number {
    const flatMesh = ifcApi.GetFlatMesh(modelID, expressID);
    let minDot = 2;
    for (let g = 0; g < flatMesh.geometries.size(); g++) {
        const placedGeometry = flatMesh.geometries.get(g);
        const geometry = ifcApi.GetGeometry(modelID, placedGeometry.geometryExpressID);
        const indices = ifcApi.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());
        const vertices = ifcApi.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
        for (let t = 0; t < indices.length; t += 3) {
            const position = (k: number) => [vertices[6 * indices[t + k]], vertices[6 * indices[t + k] + 1], vertices[6 * indices[t + k] + 2]];
            const storedNormal = (k: number) => [vertices[6 * indices[t + k] + 3], vertices[6 * indices[t + k] + 4], vertices[6 * indices[t + k] + 5]];
            const [a, b, c] = [position(0), position(1), position(2)];
            const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
            const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
            const cross = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
            const crossLength = Math.hypot(cross[0], cross[1], cross[2]);
            if (crossLength < 1e-12) continue;
            const geometricNormal = cross.map(x => x / crossLength);
            for (const k of [0, 1, 2]) {
                const stored = storedNormal(k);
                const dot = Math.abs(geometricNormal[0] * stored[0] + geometricNormal[1] * stored[1] + geometricNormal[2] * stored[2]);
                minDot = Math.min(minDot, dot);
            }
        }
    }
    return minDot;
}

beforeAll(async () => {
    ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();
    ifcApi.SetLogLevel(WebIFC.LogLevel.LOG_LEVEL_OFF);
    modelID = ifcApi.OpenModel(new TextEncoder().encode(OBLIQUE_EXTRUSION_IFC));
});

afterAll(() => {
    ifcApi.CloseModel(modelID);
});

describe('IfcExtrudedAreaSolid cap normals', () => {
    test('stored vertex normals match geometric normals for a perpendicular extrusion', () => {
        const ids = ifcApi.GetLineIDsWithType(modelID, IFCBUILDINGELEMENTPROXY);
        let checked = 0;
        for (let i = 0; i < ids.size(); i++) {
            const id = ids.get(i);
            if (!ifcApi.GetLine(modelID, id).Name.value.includes('perpendicular')) continue;
            expect(minStoredVsGeometricNormalDot(id)).toBeGreaterThan(0.999);
            checked++;
        }
        expect(checked).toBe(1);
    });

    test('stored vertex normals match geometric normals for an oblique extrusion', () => {
        const ids = ifcApi.GetLineIDsWithType(modelID, IFCBUILDINGELEMENTPROXY);
        let checked = 0;
        for (let i = 0; i < ids.size(); i++) {
            const id = ids.get(i);
            if (!ifcApi.GetLine(modelID, id).Name.value.includes('oblique')) continue;
            expect(minStoredVsGeometricNormalDot(id)).toBeGreaterThan(0.999);
            checked++;
        }
        expect(checked).toBe(1);
    });
});
