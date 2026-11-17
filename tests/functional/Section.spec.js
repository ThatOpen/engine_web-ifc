const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { IfcAPI, LogLevel } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");

// Sections and floor plans: SectionMesh (one mesh) and GetSection (a whole model).

function capArea(r) {
  let a = 0;
  const P = r.capPositions;
  for (let t = 0; t < r.capIndices.length; t += 3) {
    const [i, j, k] = [r.capIndices[t] * 3, r.capIndices[t + 1] * 3, r.capIndices[t + 2] * 3];
    const u = [P[j] - P[i], P[j + 1] - P[i + 1], P[j + 2] - P[i + 2]], v = [P[k] - P[i], P[k + 1] - P[i + 1], P[k + 2] - P[i + 2]];
    a += Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]) / 2;
  }
  return a;
}

// Axis-aligned box as 12 outward triangles (flip = inward, for a cavity).
function box(P, I, lo, hi, flip = false) {
  const b = P.length / 3;
  for (let i = 0; i < 8; i++) P.push(i & 1 ? hi[0] : lo[0], i & 2 ? hi[1] : lo[1], i & 4 ? hi[2] : lo[2]);
  const f = [[0, 2, 1], [1, 2, 3], [4, 5, 6], [5, 7, 6], [0, 1, 4], [1, 5, 4], [2, 6, 3], [3, 6, 7], [0, 4, 2], [2, 4, 6], [1, 3, 5], [3, 7, 5]];
  for (const t of f) flip ? I.push(b + t[0], b + t[2], b + t[1]) : I.push(b + t[0], b + t[1], b + t[2]);
}

async function api() {
  const a = new IfcAPI();
  await a.Init();
  a.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
  a.SetBooleanFallback(null);
  return a;
}

test("SectionMesh: a box cut in the middle gives one square cap", async () => {
  const a = await api();
  const P = [], I = [];
  box(P, I, [0, 0, 0], [1, 1, 1]);
  const r = a.SectionMesh(P, I, { point: [0, 0, 0.5], normal: [0, 0, 1] });
  assert.equal(r.closedLoops, 1);
  assert.equal(r.openChains, 0);
  assert.ok(Math.abs(capArea(r) - 1) < 1e-9, "cap area " + capArea(r));
  assert.ok(r.lines.length / 6 >= 4);
});

test("SectionMesh: a box with a cavity gives a ring (the hole is kept)", async () => {
  const a = await api();
  const P = [], I = [];
  box(P, I, [0, 0, 0], [3, 3, 3]);
  box(P, I, [1, 1, 1], [2, 2, 2], true);
  const r = a.SectionMesh(new Float32Array(P), new Uint32Array(I), { point: [0, 0, 1.5], normal: [0, 0, 1] });
  assert.equal(r.closedLoops, 2);
  assert.ok(Math.abs(capArea(r) - 8) < 1e-6, "cap area " + capArea(r));
});

test("SectionMesh: an open mesh gives lines only, unless the gap is closed", async () => {
  const a = await api();
  const P = [], I = [];
  box(P, I, [0, 0, 0], [1, 1, 1]);
  I.splice(4 * 3, 2 * 3); // drop one side face
  const open = a.SectionMesh(P, I, { point: [0, 0, 0.5], normal: [0, 0, 1] });
  assert.equal(open.openChains, 1);
  assert.equal(open.capIndices.length, 0);
  assert.ok(open.lines.length > 0);
  const closed = a.SectionMesh(P, I, { point: [0, 0, 0.5], normal: [0, 0, 1] }, { closeGap: 1.5 });
  assert.equal(closed.openChains, 0);
  assert.equal(closed.closedByGap, 1);
  assert.ok(Math.abs(capArea(closed) - 1) < 1e-9);
});

test("SectionMesh: a plane that misses the mesh gives nothing", async () => {
  const a = await api();
  const P = [], I = [];
  box(P, I, [0, 0, 0], [1, 1, 1]);
  const r = a.SectionMesh(P, I, { point: [0, 0, 5], normal: [0, 0, 1] });
  assert.equal(r.lines.length, 0);
  assert.equal(r.capIndices.length, 0);
});

test("GetSection: plan and section of a hollow cube (4 m, 2 m cavity) are 12 m² rings", async () => {
  const a = await api();
  const text = fs.readFileSync(__dirname + "/fixtures/primitives-and-voids/ifc4-brep-void.ifc");
  const model = a.OpenModel(new Uint8Array(text));
  try {
    // centre of the model, in the model frame (Y up)
    const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    a.StreamAllMeshes(model, (mesh) => {
      for (let i = 0; i < mesh.geometries.size(); i++) {
        const pg = mesh.geometries.get(i), m = pg.flatTransformation;
        const g = a.GetGeometry(model, pg.geometryExpressID);
        const v = a.GetVertexArray(g.GetVertexData(), g.GetVertexDataSize());
        for (let k = 0; k < v.length; k += 6) {
          const p = [0, 1, 2].map((r) => m[r] * v[k] + m[4 + r] * v[k + 1] + m[8 + r] * v[k + 2] + m[12 + r]);
          for (let c = 0; c < 3; c++) { lo[c] = Math.min(lo[c], p[c]); hi[c] = Math.max(hi[c], p[c]); }
        }
        g.delete();
      }
    });
    const c = [0, 1, 2].map((k) => (lo[k] + hi[k]) / 2);
    assert.ok(Math.abs(hi[1] - lo[1] - 4) < 1e-6, "height " + (hi[1] - lo[1]));
    for (const normal of [[0, 1, 0], [1, 0, 0], [0, 0, 1]]) {
      const s = a.GetSection(model, { point: c, normal });
      assert.equal(s.length, 1, "one element cut");
      assert.equal(s[0].openChains, 0);
      assert.equal(s[0].closedLoops, 2);
      assert.ok(Math.abs(capArea(s[0]) - 12) < 1e-4, "cap area " + capArea(s[0]) + " for normal " + normal);
      assert.ok(Number.isInteger(s[0].expressID) && s[0].color);
    }
    // a plane above the model cuts nothing
    assert.equal(a.GetSection(model, { point: [c[0], hi[1] + 1, c[2]], normal: [0, 1, 0] }).length, 0);
  } finally {
    a.CloseModel(model);
  }
});
