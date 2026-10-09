const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const { IfcAPI } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
const cases = require("./fixtures/fixed-reference-swept/cases.js");
const oracle = require("./fixtures/fixed-reference-swept/ifcopenshell-reference.json");

async function geometry(source) {
  const errors = [];
  const spies = ["log", "warn", "error"].map((name) => jest.spyOn(console, name).mockImplementation((...args) => {
    const message = args.join(" ");
    if (message.includes("[error]")) errors.push(message);
  }));
  const api = new IfcAPI();
  let model;
  try {
    await api.Init();
    model = api.OpenModel(new Uint8Array(Buffer.from(source)), { CIRCLE_SEGMENTS: 128 });
    const mesh = api.GetFlatMesh(model, 46);
    const triangles = [];
    for (let i = 0; i < mesh.geometries.size(); ++i) {
      const placed = mesh.geometries.get(i), t = placed.flatTransformation;
      const g = api.GetGeometry(model, placed.geometryExpressID);
      try {
        const v = api.GetVertexArray(g.GetVertexData(), g.GetVertexDataSize());
        const indices = api.GetIndexArray(g.GetIndexData(), g.GetIndexDataSize());
        const point = (j) => {
          const [x, y, z] = [v[j * 6], v[j * 6 + 1], v[j * 6 + 2]];
          const world = [t[0]*x+t[4]*y+t[8]*z+t[12], t[1]*x+t[5]*y+t[9]*z+t[13], t[2]*x+t[6]*y+t[10]*z+t[14]];
          // web-ifc returns Y-up meshes; compare in IFC/IfcOpenShell Z-up coordinates.
          return [world[0], -world[2], world[1]];
        };
        for (let j = 0; j < indices.length; j += 3) triangles.push([point(indices[j]), point(indices[j+1]), point(indices[j+2])]);
      } finally { g.delete(); }
    }
    assert.deepEqual(errors, [], "valid sweep must not log a parser error");
    assert.ok(triangles.length > 0, "sweep must have triangles");
    const min = [Infinity,Infinity,Infinity], max = [-Infinity,-Infinity,-Infinity];
    let area = 0, volume = 0;
    const origin = triangles[0][0], edges = new Map();
    const sub = (a,b) => a.map((x,i) => x-b[i]);
    const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const key = (p) => p.map((x) => Math.round(x*1e6)).join(",");
    for (const [a,b,c] of triangles) {
      for (const p of [a,b,c]) for (let j=0;j<3;++j) {
        assert.ok(Number.isFinite(p[j]), "vertices must be finite");
        min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);
      }
      const normal=cross(sub(b,a),sub(c,a));
      assert.ok(Math.hypot(...normal)>1e-10, "triangles must not be degenerate");
      area+=Math.hypot(...normal)/2;
      const n=cross(sub(b,origin),sub(c,origin)), v=sub(a,origin);
      volume+=v.reduce((sum,x,j)=>sum+x*n[j],0)/6;
      for(const [p,q] of [[a,b],[b,c],[c,a]]) {
        const k=[key(p),key(q)].sort().join("/");edges.set(k,(edges.get(k)||0)+1);
      }
    }
    assert.ok([...edges.values()].every((n)=>n===2), "closed solid must have two faces per welded edge");
    assert.ok(volume>0, "solid must have outward winding and positive signed volume");
    return {min,max,area,volume};
  } finally {
    if(model!==undefined)api.CloseModel(model);
    for(const spy of spies)spy.mockRestore();
  }
}

for (const [name,source] of cases) {
  test(`fixed reference sweep: ${name}`, async () => {
    const actual=await geometry(source), expected=oracle.cases[name];
    if(expected && !["reversed-reference","tilted-reference"].includes(name)) {
      for(let j=0;j<3;++j) {
        assert.ok(Math.abs(actual.min[j]-expected.min[j])<0.002, `min ${actual.min} vs IfcOpenShell ${expected.min}`);
        assert.ok(Math.abs(actual.max[j]-expected.max[j])<0.002, `max ${actual.max} vs IfcOpenShell ${expected.max}`);
      }
      for(const measure of ["area","volume"])
        assert.ok(Math.abs(actual[measure]-expected[measure])/expected[measure]<0.01, `${measure} ${actual[measure]} vs IfcOpenShell ${expected[measure]}`);
    }
    // IfcOpenShell 0.8.5 ignores FixedReference in these two variants. Use the
    // IFC-defined projected X axis as the independent orientation contract.
    if(name==="reversed-reference") {
      assert.ok(Math.abs(actual.min[2]+0.13)<1e-6);
      assert.ok(Math.abs(actual.max[2]-0.07)<1e-6);
    }
    if(name==="tilted-reference") assert.ok(actual.max[0]>2.10 && actual.max[2]>0.105);
    if(name==="closed-circle") assert.ok(Math.abs(actual.volume-0.02*4*Math.PI)<0.002);
  });
}
