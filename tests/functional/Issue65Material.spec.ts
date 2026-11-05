import * as WebIFC from '../../dist/web-ifc-api-node.js';
import {
    IFCDOOR,
    IFCWINDOW,
    IFCWALLSTANDARDCASE,
    IFCSLAB,
} from '../../dist/web-ifc-api-node.js';

import type { IfcAPI, FlatMesh, PlacedGeometry } from '../../dist/web-ifc-api-node.js';
import * as fs from 'fs';
import * as path from 'path';

let ifcApi: IfcAPI;

beforeAll(async () => {
    ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();
    ifcApi.SetLogLevel(WebIFC.LogLevel.LOG_LEVEL_OFF);
});

// Regression for https://github.com/ThatOpen/engine_web-ifc/issues/65.
// The Simplebim-normalized fixture carries materials by name only and has no
// IfcSurfaceStyle/IfcStyledItem anywhere, so the engine must report
// hasColor === false (instead of pretending the neutral default white is a
// material) while still producing geometry for the boolean-processed walls and
// for the roof slabs, doors and windows the issue is about.
describe('Issue 65: colour reporting for a model without styles', () => {
    const EXPECTED_COUNTS: Record<number, number> = {
        [IFCWALLSTANDARDCASE]: 9,
        [IFCSLAB]: 7,
        [IFCDOOR]: 9,
        [IFCWINDOW]: 7,
    };

    test('walls, slabs, doors and windows have geometry and report hasColor false', () => {
        const fixturePath = path.join(__dirname, 'fixtures/issue65/test_energieausweis_abstractBIM.ifc');
        const modelID = ifcApi.OpenModel(fs.readFileSync(fixturePath));

        for (const typeKey of Object.keys(EXPECTED_COUNTS)) {
            const type = Number(typeKey);
            const ids = ifcApi.GetLineIDsWithType(modelID, type);
            expect(ids.size()).toBe(EXPECTED_COUNTS[type]);

            for (let i = 0; i < ids.size(); i++) {
                const flatMesh: FlatMesh = ifcApi.GetFlatMesh(modelID, ids.get(i));
                expect(flatMesh.geometries.size()).toBeGreaterThan(0);

                for (let j = 0; j < flatMesh.geometries.size(); j++) {
                    const placed: PlacedGeometry = flatMesh.geometries.get(j);
                    expect(placed.hasColor).toBe(false);
                    expect([placed.color.x, placed.color.y, placed.color.z, placed.color.w]).toEqual([1, 1, 1, 1]);
                }
            }
        }

        ifcApi.CloseModel(modelID);
    });
});
