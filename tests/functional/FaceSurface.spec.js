const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { IfcAPI } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
test("shell with FaceSurface retains its bounded B-spline face", async () => {
  const api = new IfcAPI();
  await api.Init();
  const bytes = fs.readFileSync(new URL("./fixtures/face-surface/ifc4-surface-bspline.ifc", require("node:url").pathToFileURL(__filename).href));
  const m = api.OpenModel(bytes);
  try {
    const id = Number(bytes.toString().match(/#(\d+)=IFCBUILDINGELEMENTPROXY/)[1]);
    const mesh = api.GetFlatMesh(m, id);
    let area = 0;
    for (let k = 0; k < mesh.geometries.size(); k++) {
      const g = api.GetGeometry(m, mesh.geometries.get(k).geometryExpressID), v = api.GetVertexArray(g.GetVertexData(), g.GetVertexDataSize()), ix = api.GetIndexArray(g.GetIndexData(), g.GetIndexDataSize());
      for (let i = 0; i < ix.length; i += 3) {
        const [a, b, c] = Array.from(ix.slice(i, i + 3), (j) => Array.from(v.slice(j * 6, j * 6 + 3)));
        const u = b.map((x, j) => x - a[j]), w = c.map((x, j) => x - a[j]);
        area += Math.hypot(u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]) / 2;
      }
      g.delete();
    }
    assert.ok(Math.abs(area - 16) < 0.02, `area ${area}, expected 16 within 0.02 m2 tessellation allowance`);
  } finally {
    api.CloseModel(m);
  }
});
