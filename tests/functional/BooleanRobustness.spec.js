const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { IfcAPI, LogLevel } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");

// Thin millimetre wall layers with openings, synthetic. Reference volume (m3) and area (m2) are
// from IfcOpenShell 0.8.5. The cases cover face vertices with sub-micron rounding noise, openings
// a few 1e-5 mm off hole edges, boxes touching a face from outside, and walls rotated off the axes.
const fixtures = path.join(__dirname, "fixtures", "boolean-robustness");
const cases = [
  ["noisy-face-opening.ifc", 0.2087, 34.1992],
  ["wall-openings-2675.ifc", 2.89994, 63.4876],
  ["wall-openings-2825.ifc", 0.416, 17.68],
  ["wall-openings-655.ifc", 0.56, 23.08],
  ["wall-openings-3154.ifc", 0.14431, 22.5603],
  ["wall-openings-3926.ifc", 3.78448, 44.3776],
  ["wall-openings-895.ifc", 2.24476, 50.2984],
  ["wall-openings-2374.ifc", 0.24806, 38.8211],
  ["wall-openings-1170.ifc", 0.09023, 14.2827],
  ["wall-openings-3396.ifc", 3.771, 79.08],
  ["wall-openings-2892.ifc", 0.4635, 74.625],
];

async function measure(file) {
  const api = new IfcAPI();
  await api.Init();
  api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
  const text = fs.readFileSync(path.join(fixtures, file), "utf8");
  const model = api.OpenModel(new TextEncoder().encode(text));
  try {
    const wall = Number(text.match(/#(\d+)=IFCWALL\(/)[1]);
    const mesh = api.GetFlatMesh(model, wall);
    const shift = [10, -20, 5];
    let volume = 0, shiftedVolume = 0, area = 0;
    const signedVolume = (a, b, c) => (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
    for (let k = 0; k < mesh.geometries.size(); k++) {
      const placed = mesh.geometries.get(k);
      const t = placed.flatTransformation;
      const g = api.GetGeometry(model, placed.geometryExpressID);
      const v = api.GetVertexArray(g.GetVertexData(), g.GetVertexDataSize());
      const indices = api.GetIndexArray(g.GetIndexData(), g.GetIndexDataSize());
      const point = (j) => {
        const [x, y, z] = [v[j * 6], v[j * 6 + 1], v[j * 6 + 2]];
        return [t[0] * x + t[4] * y + t[8] * z + t[12], t[1] * x + t[5] * y + t[9] * z + t[13], t[2] * x + t[6] * y + t[10] * z + t[14]];
      };
      for (let i = 0; i < indices.length; i += 3) {
        const [a, b, c] = [point(indices[i]), point(indices[i + 1]), point(indices[i + 2])];
        volume += signedVolume(a, b, c);
        shiftedVolume += signedVolume(...[a, b, c].map((p) => p.map((x, j) => x - shift[j])));
        const u = b.map((x, j) => x - a[j]), w = c.map((x, j) => x - a[j]);
        area += Math.hypot(u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]) / 2;
      }
      g.delete();
    }
    return { volume, shiftedVolume, area };
  } finally {
    api.CloseModel(model);
  }
}

for (const [file, expectedVolume, expectedArea] of cases) {
  test(`boolean robustness: ${file}`, async () => {
    const { volume, shiftedVolume, area } = await measure(file);
    assert.ok(Math.abs(volume - shiftedVolume) < 1e-4 * Math.max(1, Math.abs(volume)), `mesh is not closed: volume ${volume} depends on the origin (${shiftedVolume})`);
    assert.ok(Math.abs(volume - expectedVolume) < 1e-3 * Math.max(1, expectedVolume), `volume ${volume}, expected ${expectedVolume}`);
    assert.ok(Math.abs(area - expectedArea) < 1e-3 * expectedArea, `area ${area}, expected ${expectedArea}`);
  });
}
