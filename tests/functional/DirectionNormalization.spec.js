const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { IfcAPI, LogLevel } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
const read = (name) => fs.readFileSync(new URL(`./fixtures/direction-normalization/${name}`, require("node:url").pathToFileURL(__filename).href), "utf8");
async function measure(text) {
  const api = new IfcAPI();
  await api.Init();
  api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
  const model = api.OpenModel(new TextEncoder().encode(text));
  try {
    const product = Number(text.match(/#(\d+)=IFCBUILDINGELEMENTPROXY/)[1]);
    const mesh = api.GetFlatMesh(model, product);
    let volume = 0, triangles = 0;
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (let k = 0; k < mesh.geometries.size(); k++) {
      const g = api.GetGeometry(model, mesh.geometries.get(k).geometryExpressID);
      const v = api.GetVertexArray(g.GetVertexData(), g.GetVertexDataSize());
      const indices = api.GetIndexArray(g.GetIndexData(), g.GetIndexDataSize());
      const t = mesh.geometries.get(k).flatTransformation;
      for (let i = 0; i < v.length; i += 6) {
        const [x, y, z] = [0, 1, 2].map((a) => v[i] * t[a] + v[i + 1] * t[4 + a] + v[i + 2] * t[8 + a] + t[12 + a]);
        // Back from the Y-up output to IFC Z-up coordinates
        [x, -z, y].forEach((p, a) => {
          min[a] = Math.min(min[a], p);
          max[a] = Math.max(max[a], p);
        });
      }
      for (let i = 0; i < indices.length; i += 3) {
        const [a, b, c] = Array.from(indices.slice(i, i + 3), (j) => Array.from(v.slice(j * 6, j * 6 + 3)));
        volume += (a[0] * (b[1] * c[2] - b[2] * c[1]) + a[1] * (b[2] * c[0] - b[0] * c[2]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
        triangles++;
      }
      g.delete();
    }
    assert.ok(triangles > 0, "geometry must be present");
    return { volume: Math.abs(volume), min, max };
  } finally {
    api.CloseModel(model);
  }
}
const close = (actual, expected, label) => assert.ok(Math.abs(actual - expected) < 1e-5, `${label} ${actual}, expected ${expected}`);

test("extruded area solid: non-unit extruded direction", async () => {
  const { volume, max } = await measure(read("extruded-area-solid.ifc"));
  close(max[2], 3, "top");
  close(volume, 12, "volume");
});
test("extruded area solid: non-unit oblique extruded direction", async () => {
  const { volume, max } = await measure(read("extruded-area-solid.ifc").replace("IFCDIRECTION((0.,0.,2.))", "IFCDIRECTION((0.,3.,4.))"));
  close(max[1], 1 + 1.8, "y max");
  close(max[2], 2.4, "top");
  close(volume, 9.6, "volume");
});
test("line: non-unit IfcVector orientation", async () => {
  const { min, max } = await measure(read("swept-disk-line.ifc"));
  close(max[0] - min[0], 3, "length");
});
