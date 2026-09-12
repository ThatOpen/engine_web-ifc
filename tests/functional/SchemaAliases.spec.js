const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { IfcAPI, LogLevel } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
const source = fs.readFileSync(new URL("./fixtures/schema-aliases/strings-base.ifc", require("node:url").pathToFileURL(__filename).href), "utf8");
for (const schema of ["IFC4X1", "IFC4X2", "IFC4X3_RC1", "IFC4X3_ADD1", "IFC2X_FINAL"]) {
  test(`incompatible ${schema} requires an explicit opt-in`, async () => {
    const api = new IfcAPI();
    await api.Init();
    api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
    const bytes = new TextEncoder().encode(source.replace("FILE_SCHEMA(('IFC4'))", `FILE_SCHEMA(('${schema}'))`));
    assert.equal(api.OpenModel(bytes), -1);
    assert.equal(api.OpenModelFromCallback((offset, size) => bytes.subarray(offset, offset + size)), -1);
    assert.equal(api.CreateModel({ schema }), -1);
    const settings = { ALLOW_INCOMPATIBLE_SCHEMA_ALIASES: true };
    for (const model of [api.OpenModel(bytes, settings), api.OpenModelFromCallback((offset, size) => bytes.subarray(offset, offset + size), settings), api.CreateModel({ schema }, settings)]) {
      assert.ok(model >= 0);
      assert.equal(api.GetModelSchema(model), schema);
      api.CloseModel(model);
    }
  });
}
for (const schema of ["IFC2X3", "IFC4", "IFC4X3", "IFC4X3_ADD2"]) test(`supported ${schema} remains available`, async () => {
  const api = new IfcAPI();
  await api.Init();
  const model = api.CreateModel({ schema });
  assert.ok(model >= 0);
  assert.equal(api.GetModelSchema(model), schema);
  api.CloseModel(model);
});
