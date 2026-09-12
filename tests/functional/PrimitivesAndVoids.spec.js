const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { IfcAPI, LogLevel } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
async function check(text, expected, segments = 96) {
  const api = new IfcAPI();
  await api.Init();
  api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
  const model = api.OpenModel(new TextEncoder().encode(text), { CIRCLE_SEGMENTS: segments });
  try {
    const product = Number(text.match(/#(\d+)=IFCBUILDINGELEMENTPROXY/)[1]);
    const mesh = api.GetFlatMesh(model, product);
    let volume = 0, triangles = 0;
    const edges = /* @__PURE__ */ new Map();
    for (let k = 0; k < mesh.geometries.size(); k++) {
      const g = api.GetGeometry(model, mesh.geometries.get(k).geometryExpressID);
      const v = api.GetVertexArray(g.GetVertexData(), g.GetVertexDataSize());
      const indices = api.GetIndexArray(g.GetIndexData(), g.GetIndexDataSize());
      for (let i = 0; i < indices.length; i += 3) {
        const p = Array.from(indices.slice(i, i + 3), (j) => Array.from(v.slice(j * 6, j * 6 + 3)));
        assert.ok(p.flat().every(Number.isFinite));
        const [a, b, c] = p;
        volume += (a[0] * (b[1] * c[2] - b[2] * c[1]) + a[1] * (b[2] * c[0] - b[0] * c[2]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
        const ids = p.map((a2) => a2.map((x) => Math.round(x * 1e6)).join(","));
        for (let j = 0; j < 3; j++) {
          const a2 = ids[j], b2 = ids[(j + 1) % 3];
          assert.notEqual(a2, b2);
          const key = [a2, b2].sort().join("|");
          const e = edges.get(key) || [0, 0];
          e[0]++;
          e[1] += a2 < b2 ? 1 : -1;
          edges.set(key, e);
        }
        triangles++;
      }
      g.delete();
    }
    assert.ok(triangles > 0, "geometry must be present");
    assert.ok(Math.abs(Math.abs(volume) - expected) < expected * 0.01, `volume ${Math.abs(volume)}, expected ${expected}`);
    assert.ok([...edges.values()].every(([count, winding]) => count === 2 && winding === 0), "closed mesh with consistent winding");
  } finally {
    api.CloseModel(model);
  }
}
for (const schema of ["ifc2x3", "ifc4", "ifc4x3_add2"]) {
  for (const [name, volume] of [["block", 24], ["cone", 16 * Math.PI / 3], ["pyramid", 8], ["brep-void", 56]]) {
    test(`${schema}: ${name}`, async () => check(fs.readFileSync(new URL(`./fixtures/primitives-and-voids/${schema}-${name}.ifc`, require("node:url").pathToFileURL(__filename).href), "utf8"), volume));
  }
}

test.each([0, 3, 4])("shared circle helper: minimum samples %i", async segments => {
  const text = fs.readFileSync(new URL("./fixtures/primitives-and-voids/ifc4-circle.ifc", require("node:url").pathToFileURL(__filename).href), "utf8");
  await check(text, 12 * Math.sqrt(3), segments);
});
