const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { IfcAPI, LogLevel } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
const source = fs.readFileSync(new URL("./fixtures/tapered-extrusion/ifc4-tapered.ifc", require("node:url").pathToFileURL(__filename).href), "utf8");
async function check(text, expected) {
  const api = new IfcAPI();
  await api.Init();
  api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
  const model = api.OpenModel(new TextEncoder().encode(text));
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
    assert.ok(Math.abs(Math.abs(volume) - expected) < 1e-5, `volume ${Math.abs(volume)}, expected ${expected}`);
    assert.ok([...edges.values()].every(([count, winding]) => count === 2 && winding === 0), "closed mesh with consistent winding");
  } finally {
    api.CloseModel(model);
  }
}
test("tapered: rectangle frustum", async () => check(source, 28));
test("tapered: equal profiles", async () => check(source.replace("2.,2.);", "4.,4.);"), 48));
test("tapered: widening frustum", async () => check(source.replace("2.,2.);", "6.,6.);"), 76));
test("tapered: negative extrusion direction", async () => check(source.replace("IFCDIRECTION((0.,0.,1.))", "IFCDIRECTION((0.,0.,-1.))"), 28));
test("tapered: oblique extrusion direction", async () => check(source.replace("IFCDIRECTION((0.,0.,1.))", "IFCDIRECTION((0.,0.6,0.8))"), 22.4));
test("tapered: independently shrinking hole", async () => check(fs.readFileSync(new URL("./fixtures/tapered-extrusion/ifc4-tapered-hole.ifc", require("node:url").pathToFileURL(__filename).href), "utf8"), 21));
test("tapered: shifted end profile", async () => check(source.replace("#17=IFCRECTANGLEPROFILEDEF(.AREA.,$,$,2.,2.);", "#100=IFCCARTESIANPOINT((1.,0.5));\n#101=IFCAXIS2PLACEMENT2D(#100,$);\n#17=IFCRECTANGLEPROFILEDEF(.AREA.,$,#101,2.,2.);"), 28));
