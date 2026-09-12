const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { IfcAPI, LogLevel } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
const source = fs.readFileSync(new URL("./fixtures/revolved-solids/ifc4-revolve-1.57.ifc", require("node:url").pathToFileURL(__filename).href), "utf8");
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
test("revolution: quarter turn", async () => check(source, 3 * Math.PI));
test("revolution: full turn", async () => check(fs.readFileSync(new URL("./fixtures/revolved-solids/ifc4-revolve-6.28.ifc", require("node:url").pathToFileURL(__filename).href), "utf8"), 12 * Math.PI));
test("revolution: reversed axis", async () => check(source.replace("IFCDIRECTION((0.,1.,0.))", "IFCDIRECTION((0.,-1.,0.))"), 3 * Math.PI));
test("revolution: profile with a rectangular void", async () => {
  // Explicit boundaries isolate revolution from the hollow-profile wall-thickness fix.
  const profile = [
    "#900=IFCCARTESIANPOINT((2.,-0.5));",
    "#901=IFCCARTESIANPOINT((4.,-0.5));",
    "#902=IFCCARTESIANPOINT((4.,0.5));",
    "#903=IFCCARTESIANPOINT((2.,0.5));",
    "#904=IFCPOLYLINE((#900,#901,#902,#903,#900));",
    "#905=IFCCARTESIANPOINT((2.2,-0.3));",
    "#906=IFCCARTESIANPOINT((2.2,0.3));",
    "#907=IFCCARTESIANPOINT((3.8,0.3));",
    "#908=IFCCARTESIANPOINT((3.8,-0.3));",
    "#909=IFCPOLYLINE((#905,#906,#907,#908,#905));",
    "#15=IFCARBITRARYPROFILEDEFWITHVOIDS(.AREA.,$,#904,(#909));",
  ].join("\n");
  await check(source.replace("#15=IFCRECTANGLEPROFILEDEF(.AREA.,$,#14,2.,1.);", profile), 1.56 * Math.PI);
});
test("revolution: offset axis", async () => check(source.replace("#18=IFCCARTESIANPOINT((0.,0.,0.));", "#18=IFCCARTESIANPOINT((1.,0.,0.));"), 2 * Math.PI));
test("revolution: rotated profile", async () => check(source.replace("#14=IFCAXIS2PLACEMENT2D(#13,$);", "#900=IFCDIRECTION((0.8660254037844386,0.5));\n#14=IFCAXIS2PLACEMENT2D(#13,#900);"), 3 * Math.PI));
test("revolution: missing angle unit defaults to radians", async () => check(source.replace("IFCUNITASSIGNMENT((#9,#10))", "IFCUNITASSIGNMENT((#9))"), 3 * Math.PI));
test("revolution: conversion-based degree unit", async () => check(source.replace("#10=IFCSIUNIT(*,.PLANEANGLEUNIT.,$,.RADIAN.);", "#910=IFCSIUNIT(*,.PLANEANGLEUNIT.,$,.RADIAN.);\n#911=IFCDIMENSIONALEXPONENTS(0,0,0,0,0,0,0);\n#912=IFCMEASUREWITHUNIT(IFCPLANEANGLEMEASURE(0.017453292519943295),#910);\n#10=IFCCONVERSIONBASEDUNIT(#911,.PLANEANGLEUNIT.,'DEGREE',#912);").replace("#20,1.5707963267948966)", "#20,90.)"), 3 * Math.PI));
test("revolution: negative exported angle preserves geometry", async () => check(source.replace("#20,1.5707963267948966)", "#20,-1.5707963267948966)"), 3 * Math.PI));
test("revolution: direction follows axis cross radius", async () => {
  const bounds = await check(source, 3 * Math.PI), expected = [[0, 4], [-0.5, 0.5], [-4, 0]];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) assert.ok(Math.abs(bounds[i][j] - expected[i][j]) < 1e-5);
  const reversed = await check(source.replace("#20,1.5707963267948966)", "#20,-1.5707963267948966)"), 3 * Math.PI);
  assert.ok(Math.abs(reversed[2][0]) < 1e-5 && Math.abs(reversed[2][1] - 4) < 1e-5);
});
