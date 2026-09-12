const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { IfcAPI, LogLevel } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
async function check(text, expected) {
  const api = new IfcAPI();
  await api.Init();
  api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
  const model = api.OpenModel(new TextEncoder().encode(text), { CIRCLE_SEGMENTS: 96 });
  try {
    const product = Number(text.match(/#(\d+)=IFCBUILDINGELEMENTPROXY/)[1]);
    const mesh = api.GetFlatMesh(model, product);
    let volume = 0, triangles = 0;
    const edges = /* @__PURE__ */ new Map(), world = [];
    for (let k = 0; k < mesh.geometries.size(); k++) {
      const g = api.GetGeometry(model, mesh.geometries.get(k).geometryExpressID);
      const v = api.GetVertexArray(g.GetVertexData(), g.GetVertexDataSize());
      const indices = api.GetIndexArray(g.GetIndexData(), g.GetIndexDataSize());
      const t = mesh.geometries.get(k).flatTransformation;
      for (let i = 0; i < v.length; i += 6) {
        const x = v[i], y = v[i + 1], z = v[i + 2];
        world.push([t[0] * x + t[4] * y + t[8] * z + t[12], -(t[2] * x + t[6] * y + t[10] * z + t[14]), t[1] * x + t[5] * y + t[9] * z + t[13]]);
      }
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
    return [0, 1, 2].map((i) => [Math.min(...world.map((p) => p[i])), Math.max(...world.map((p) => p[i]))]);
  } finally {
    api.CloseModel(model);
  }
}
for (const schema of ["ifc2x3", "ifc4", "ifc4x3_add2"]) {
  // IFC2X3 primitive wrappers require the separate CsgSolid dispatch change.
  const profiles = [["circle", 16 * Math.PI], ["hollow-circle", 7 * Math.PI], ["ellipse", 8 * Math.PI]];
  const shapes = schema === "ifc2x3" ? profiles : [["sphere", 32 * Math.PI / 3], ["cylinder", 16 * Math.PI], ...profiles];
  for (const [name, volume] of shapes) {
    test(`${schema}: closed ${name}`, async () => check(fs.readFileSync(new URL(`./fixtures/circular-seams-and-sphere/${schema}-${name}.ifc`, require("node:url").pathToFileURL(__filename).href), "utf8"), volume));
  }
}
test("sphere placement is applied exactly once", async () => {
  const text = fs.readFileSync(new URL("./fixtures/circular-seams-and-sphere/ifc4-sphere.ifc", require("node:url").pathToFileURL(__filename).href), "utf8").replace("#13=IFCCARTESIANPOINT((0.,0.,0.));", "#13=IFCCARTESIANPOINT((10.,20.,30.));");
  const bounds = await check(text, 32 * Math.PI / 3);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) assert.ok(Math.abs(bounds[i][j] - ([10, 20, 30][i] + (j ? 2 : -2))) < 1e-5);
});
