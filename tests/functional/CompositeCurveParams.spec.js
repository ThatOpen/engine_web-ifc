const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { IfcAPI, LogLevel, IFCREINFORCINGBAR } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");

// A 10 mm swept disk along an IfcCompositeCurve: a 1000 mm line, a 90 degree arc of radius 200 mm
// and a 500 mm line, with DEGREE as plane angle unit (as Revit writes rebars). Its parameter range
// is 1 + 90 + 1 = 92: each polyline edge counts one unit and a trimmed circle its angle.
const fixtures = path.join(__dirname, "fixtures", "composite-curve-params");
const radius = 0.01;
const arc = (0.2 * Math.PI) / 2;
const cases = [
  ["full-range.ifc", 1.0 + arc + 0.5],
  ["end-rounding.ifc", 1.0 + arc + 0.5],
  ["partial.ifc", 0.5 + arc / 2],
  ["arc-only.ifc", arc],
  // A two-edge directrix (1000 mm and 500 mm) whose EndParam exceeds 2 by rounding noise, as
  // exporters write it; the whole curve must still be swept.
  ["polyline-end-rounding.ifc", 1.5],
  ["indexed-polycurve-end-rounding.ifc", 1.5],
  ["polyline-partial.ifc", 0.5 + 0.25],
];

async function area(file) {
  const api = new IfcAPI();
  await api.Init();
  api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
  const model = api.OpenModel(new Uint8Array(fs.readFileSync(path.join(fixtures, file))));
  try {
    const ids = api.GetLineIDsWithType(model, IFCREINFORCINGBAR);
    const mesh = api.GetFlatMesh(model, ids.get(0));
    let total = 0;
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
        const u = b.map((x, j) => x - a[j]), w = c.map((x, j) => x - a[j]);
        total += Math.hypot(u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]) / 2;
      }
      g.delete();
    }
    return total;
  } finally {
    api.CloseModel(model);
  }
}

for (const [file, length] of cases) {
  test(`swept disk parameters: ${file}`, async () => {
    const expected = 2 * Math.PI * radius * length + 2 * Math.PI * radius * radius;
    const actual = await area(file);
    assert.ok(Math.abs(actual - expected) < 0.02 * expected, `area ${actual}, expected ${expected} for a swept length of ${length} m`);
  });
}
