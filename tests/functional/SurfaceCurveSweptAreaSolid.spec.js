const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { IfcAPI } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");

const fixtures = path.join(__dirname, "fixtures", "surface-curve-swept");
const plain = fs.readFileSync(path.join(fixtures, "surface_curve_swept_ifc4.ifc"), "utf8");
const typed = fs.readFileSync(path.join(fixtures, "surface_curve_swept_ifc4x3.ifc"), "utf8");

// Keep the reference surface at argument 5 regardless of nested SELECT tokens.
function parameters(start, end, schema = "IFC4X3_ADD2") {
  return plain.replace("FILE_SCHEMA(('IFC4'))", `FILE_SCHEMA(('${schema}'))`)
    .replace("#42=IFCSURFACECURVESWEPTAREASOLID(#32,#13,#52,0.,1.5707963267949,#40);",
      `#42=IFCSURFACECURVESWEPTAREASOLID(#32,#13,#52,${start},${end},#40);`);
}

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
    model = api.OpenModel(new Uint8Array(Buffer.from(source)));
    const mesh = api.GetFlatMesh(model, 46);
    const result = [];
    for (let i = 0; i < mesh.geometries.size(); ++i) {
      const placed = mesh.geometries.get(i);
      const g = api.GetGeometry(model, placed.geometryExpressID);
      try {
        result.push({
          transformation: Array.from(placed.flatTransformation),
          vertices: Array.from(api.GetVertexArray(g.GetVertexData(), g.GetVertexDataSize())),
          indices: Array.from(api.GetIndexArray(g.GetIndexData(), g.GetIndexDataSize())),
        });
      } finally { g.delete(); }
    }
    assert.deepEqual(errors, [], "valid sweep must not log a parser error");
    assert.ok(result.length > 0 && result.some((g) => g.indices.length > 0), "sweep must have triangles");
    for (const g of result) assert.ok(g.vertices.every(Number.isFinite), "vertices must be finite");
    return result;
  } finally {
    if (model !== undefined) api.CloseModel(model);
    for (const spy of spies) spy.mockRestore();
  }
}

const cases = [
  ["IFC4 real parameters", plain],
  ["IFC4X3 parameter measures (issue #2247)", typed],
  ["IFC4X3 length measures", parameters("IFCLENGTHMEASURE(0.)", "IFCLENGTHMEASURE(3.1415926535898)")],
  ["integer parameter measures", parameters("IFCPARAMETERVALUE(0)", "IFCPARAMETERVALUE(1.5707963267949)")],
  ["omitted parameters", parameters("$", "$", "IFC4")],
  ["omitted start and typed end", parameters("$", "IFCPARAMETERVALUE(1.5707963267949)")],
  ["typed start and omitted end", parameters("IFCPARAMETERVALUE(0.)", "$")],
  ["IFC4 integer start", parameters("0", "1.5707963267949", "IFC4")],
];

for (const [name, source] of cases) {
  test(`surface curve sweep: ${name}`, async () => {
    // This handler already receives a trimmed directrix. The parser fix must
    // preserve its existing geometry while accepting IFC4X3 parameter encoding.
    assert.deepEqual(await geometry(source), await geometry(plain));
  });
}

// 0.2 x 0.1 rectangle swept along two directrix segments; the volume is 0.02 per metre of directrix
test.each([
  ["collinear points", "1.,0.,0.", "2.,0.,0.", 0.04],
  ["166 degree turn", "2.,0.,0.", "0.,0.5,0.", 0.02 * (2 + Math.hypot(2, 0.5))],
])("surface curve sweep: directrix with %s", async (name, middle, end, expected) => {
  const source = plain.replace("#42=IFCSURFACECURVESWEPTAREASOLID(#32,#13,#52,0.,1.5707963267949,#40);",
    `#60=IFCCARTESIANPOINT((0.,0.,0.));\n#61=IFCCARTESIANPOINT((${middle}));\n#62=IFCCARTESIANPOINT((${end}));\n` +
    "#63=IFCPOLYLINE((#60,#61,#62));\n#64=IFCPLANE(#13);\n#42=IFCSURFACECURVESWEPTAREASOLID(#32,#13,#63,$,$,#64);");
  let volume = 0;
  for (const { vertices: v, indices } of await geometry(source)) {
    for (let i = 0; i < indices.length; i += 3) {
      const [a, b, c] = Array.from(indices.slice(i, i + 3), (j) => v.slice(j * 6, j * 6 + 3));
      volume += (a[0] * (b[1] * c[2] - b[2] * c[1]) + a[1] * (b[2] * c[0] - b[0] * c[2]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
    }
  }
  assert.ok(Math.abs(Math.abs(volume) - expected) < 1e-6, `volume ${Math.abs(volume)}, expected ${expected}`);
});
