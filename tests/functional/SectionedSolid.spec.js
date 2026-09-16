const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { IfcAPI, LogLevel } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
const source = fs.readFileSync(new URL("./fixtures/sectioned-solid/ifc4x3_add2-sectioned-horizontal.ifc", require("node:url").pathToFileURL(__filename).href), "utf8");
async function check(text, expected, open = false) {
  const api = new IfcAPI();
  await api.Init();
  api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
  const model = api.OpenModel(new TextEncoder().encode(text));
  try {
    const product = Number(text.match(/#(\d+)=IFCBUILDINGELEMENTPROXY/)[1]);
    const mesh = api.GetFlatMesh(model, product);
    let volume = 0, triangles = 0, area = 0;
    const edges = /* @__PURE__ */ new Map();
    for (let k = 0; k < mesh.geometries.size(); k++) {
      const g = api.GetGeometry(model, mesh.geometries.get(k).geometryExpressID);
      const v = api.GetVertexArray(g.GetVertexData(), g.GetVertexDataSize());
      const indices = api.GetIndexArray(g.GetIndexData(), g.GetIndexDataSize());
      for (let i = 0; i < indices.length; i += 3) {
        const p = Array.from(indices.slice(i, i + 3), (j) => Array.from(v.slice(j * 6, j * 6 + 3)));
        assert.ok(p.flat().every(Number.isFinite));
        const [a, b, c] = p;
        const u = b.map((x, j) => x - a[j]), q = c.map((x, j) => x - a[j]);
        area += Math.hypot(u[1]*q[2]-u[2]*q[1],u[2]*q[0]-u[0]*q[2],u[0]*q[1]-u[1]*q[0])/2;
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
    if (expected > 0) assert.ok(triangles > 0, "geometry must be present");
    if (open) { assert.ok(Math.abs(area - expected) < 1e-5, `area ${area}, expected ${expected}`); assert.equal(triangles, 2); return; }
    // Float32 vertex conversion is allowed one part per million in volume.
    assert.ok(Math.abs(Math.abs(volume) - expected) < expected * 1e-6, `volume ${Math.abs(volume)}, expected ${expected}`);
    assert.ok([...edges.values()].every(([count, winding]) => count === 2 && winding === 0), "closed mesh with consistent winding");
  } finally {
    api.CloseModel(model);
  }
}
test("sectioned solid: horizontal cross sections form an oriented closed shell", async () => check(source, 60));
test("sectioned solid: rotated horizontal directrix", async () => check(source.replace("IFCCARTESIANPOINT((10.,0.,0.))", "IFCCARTESIANPOINT((8.,6.,0.))"), 60));

const hollow = source.replaceAll("IFCRECTANGLEPROFILEDEF(.AREA.,$,$,2.,3.)", "IFCRECTANGLEHOLLOWPROFILEDEF(.AREA.,$,$,2.,3.,0.5,$,$)");
test("sectioned solid: void continues through the caps and walls", async () => check(hollow,40));
test("sectioned solid: rotated hollow sections", async () => check(hollow.replace("IFCCARTESIANPOINT((10.,0.,0.))", "IFCCARTESIANPOINT((8.,6.,0.))"),40));
const surface = source.replace("'AdvancedSweptSolid'", "'Surface3D'").replace("IFCSECTIONEDSOLIDHORIZONTAL(#15,(#20,#21),(#17,#19))", "IFCSECTIONEDSURFACE(#15,(#17,#19),(#20,#21))")
  .replaceAll("IFCRECTANGLEPROFILEDEF(.AREA.,$,$,2.,3.)", "IFCARBITRARYOPENPROFILEDEF(.CURVE.,$,#902)")
  .replace("#20=", "#900=IFCCARTESIANPOINT((-1.,0.));\n#901=IFCCARTESIANPOINT((1.,0.));\n#902=IFCPOLYLINE((#900,#901));\n#20=");
test("sectioned surface: placed open sections create a 20 square metre strip", async () => check(surface,20,true));
test("sectioned surface: rotated directrix retains open strip area", async () => check(surface.replace("IFCCARTESIANPOINT((10.,0.,0.))", "IFCCARTESIANPOINT((8.,6.,0.))"),20,true));

test("sectioned surface: Axis rotates the profile within the curve frame", async () => {
  const text=surface.replace("#17=IFCAXIS2PLACEMENTLINEAR(#16,$,$);","#903=IFCDIRECTION((0.,1.,0.));\n#17=IFCAXIS2PLACEMENTLINEAR(#16,#903,$);")
    .replace("IFCAXIS2PLACEMENTLINEAR(#18,$,$)","IFCAXIS2PLACEMENTLINEAR(#18,#903,$)");
  await check(text,20,true);
  const api=new IfcAPI();await api.Init();const model=api.OpenModel(new TextEncoder().encode(text));
  try {
    const sections=api.GetAllCrossSections3D(model)[0];
    assert.deepEqual(sections.curves[0].points.map(p=>[p.x,p.y,p.z]),[[0,0,1],[0,0,-1]]);
    assert.deepEqual(sections.curves[1].points.map(p=>[p.x,p.y,p.z]),[[10,0,1],[10,0,-1]]);
  } finally {api.CloseModel(model);}
});
test("sectioned solid: caps retain two separate void boundaries", async () => {
  const rings=[[[-1,-1.5],[1,-1.5],[1,1.5],[-1,1.5]], [[-.75,-.5],[-.25,-.5],[-.25,.5],[-.75,.5]], [[.25,-.5],[.75,-.5],[.75,.5],[.25,.5]]];
  let definitions="", next=1000;const refs=[];
  for(const ring of rings) {
    const points=ring.map(([x,y])=>{const id=next++;definitions+=`#${id}=IFCCARTESIANPOINT((${x.toFixed(2)},${y.toFixed(2)}));\n`;return `#${id}`;});
    const id=next++;definitions+=`#${id}=IFCPOLYLINE((${[...points,points[0]].join(",")}));\n`;refs.push(`#${id}`);
  }
  const profile=`IFCARBITRARYPROFILEDEFWITHVOIDS(.AREA.,$,${refs[0]},(${refs.slice(1).join(",")}))`;
  await check(source.replaceAll("IFCRECTANGLEPROFILEDEF(.AREA.,$,$,2.,3.)",profile).replace("#20=",definitions+"#20="),50);
});
