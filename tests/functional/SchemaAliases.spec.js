const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { IfcAPI, LogLevel } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
const source = fs.readFileSync(new URL("./fixtures/schema-aliases/strings-base.ifc", require("node:url").pathToFileURL(__filename).href), "utf8");

// These cases verify routing policy, not compatibility with older schema layouts.
for (const schema of ["IFC4X1", "IFC4X2", "IFC4X3_RC1", "IFC4X3_ADD1", "IFC2X_FINAL"]) {
  test(`incompatible ${schema} stays enabled by default and can be disabled`, async () => {
    const api = new IfcAPI();
    await api.Init();
    api.SetLogLevel(LogLevel.LOG_LEVEL_WARN);
    const bytes = new TextEncoder().encode(source.replace("FILE_SCHEMA(('IFC4'))", `FILE_SCHEMA(('${schema}'))`));
    const openers = [
      settings => api.OpenModel(bytes, settings),
      settings => api.OpenModelFromCallback((offset, size) => bytes.subarray(offset, offset + size), settings),
      settings => api.CreateModel({ schema }, settings),
    ];
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (...args) => warnings.push(args.join(" "));
    try {
      for (const settings of [undefined, {}, { ALLOW_INCOMPATIBLE_SCHEMA_ALIASES: undefined }, { ALLOW_INCOMPATIBLE_SCHEMA_ALIASES: true }]) {
        for (const open of openers) {
          const count = warnings.length;
          const model = open(settings);
          assert.ok(model >= 0);
          try {
            assert.equal(api.GetModelSchema(model), schema);
            assert.equal(warnings.length, count + 1);
            assert.ok(warnings[count].includes(`Parsing ${schema} using `));
          } finally { api.CloseModel(model); }
        }
      }
      api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
      for (const open of openers) {
        assert.equal(open({ ALLOW_INCOMPATIBLE_SCHEMA_ALIASES: false }), -1);
        // A strict rejection must not change the default of the next call.
        const model = open();
        assert.ok(model >= 0);
        api.CloseModel(model);
      }
    } finally {
      console.warn = originalWarn;
      api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
    }
  });
}
for (const schema of ["IFC2X3", "IFC4", "IFC4X3", "IFC4X3_ADD2"]) test(`supported ${schema} remains available in default and strict modes`, async () => {
  const api = new IfcAPI();
  await api.Init();
  api.SetLogLevel(LogLevel.LOG_LEVEL_WARN);
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args.join(" "));
  try {
    for (const settings of [undefined, { ALLOW_INCOMPATIBLE_SCHEMA_ALIASES: false }]) {
      const model = api.CreateModel({ schema }, settings);
      assert.ok(model >= 0);
      let bytes;
      try {
        assert.equal(api.GetModelSchema(model), schema);
        bytes = api.SaveModel(model);
      } finally { api.CloseModel(model); }
      for (const open of [
        () => api.OpenModel(bytes, settings),
        () => api.OpenModelFromCallback((offset, size) => bytes.subarray(offset, offset + size), settings),
      ]) {
        const reopened = open();
        assert.ok(reopened >= 0);
        try { assert.equal(api.GetModelSchema(reopened), schema); }
        finally { api.CloseModel(reopened); }
      }
    }
    assert.equal(warnings.length, 0);
  } finally {
    console.warn = originalWarn;
    api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
  }
});
test("unknown schemas remain rejected even when incompatible aliases are allowed", async () => {
  const api = new IfcAPI();
  await api.Init();
  api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
  const schema = "IFC_UNKNOWN";
  const bytes = new TextEncoder().encode(source.replace("FILE_SCHEMA(('IFC4'))", `FILE_SCHEMA(('${schema}'))`));
  for (const settings of [undefined, { ALLOW_INCOMPATIBLE_SCHEMA_ALIASES: true }, { ALLOW_INCOMPATIBLE_SCHEMA_ALIASES: false }]) {
    assert.equal(api.OpenModel(bytes, settings), -1);
    assert.equal(api.OpenModelFromCallback((offset, size) => bytes.subarray(offset, offset + size), settings), -1);
    assert.equal(api.CreateModel({ schema }, settings), -1);
  }
});
