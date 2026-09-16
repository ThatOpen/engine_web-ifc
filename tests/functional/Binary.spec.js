const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const w = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
const base = fs.readFileSync(new URL("./fixtures/binary/strings-base.ifc", require("node:url").pathToFileURL(__filename).href), "utf8");
for (const schema of ["IFC4", "IFC4X3_ADD2"]) test("binary pixel parse/write/save " + schema, async () => {
  const api = new w.IfcAPI();
  await api.Init();
  const pixelFixture = fs.readFileSync(new URL("./fixtures/binary/pixel-texture.ifc", require("node:url").pathToFileURL(__filename).href), "utf8");
  const text = pixelFixture.replace("FILE_SCHEMA(('IFC4'))", `FILE_SCHEMA(('${schema}'))`);
  let m = api.OpenModel(new TextEncoder().encode(text));
  const raw = api.GetRawLineData(m, 9e3);
  assert.equal(raw.arguments.length, 9);
  assert.equal(raw.arguments[8][0].type, 11);
  assert.equal(raw.arguments[8][0].value, "0FF00AA");
  const row = api.GetLine(m, 9e3);
  assert.equal(row.Pixel.length, 1);
  assert.equal(row.Pixel[0].value, "0FF00AA");
  row.Pixel[0].value = "0ABCDEF";
  api.WriteLine(m, row);
  assert.equal(api.GetLine(m, 9e3).Pixel[0].value, "0ABCDEF");
  const saved = api.SaveModel(m);
  api.CloseModel(m);
  assert.match(new TextDecoder().decode(saved), /"0ABCDEF"/);
  m = api.OpenModel(saved);
  assert.equal(api.GetLine(m, 9e3).Pixel[0].value, "0ABCDEF");
  api.CloseModel(m);
});
test("IFC2X3 primitive binary array remains binary when written", async () => {
  const api = new w.IfcAPI();
  await api.Init();
  const base2x3 = fs.readFileSync(new URL("./fixtures/binary/ifc2x3-block.ifc", require("node:url").pathToFileURL(__filename).href), "utf8");
  const text = base2x3.replace("ENDSEC;\nEND-ISO", '#9000=IFCPIXELTEXTURE(.T.,.T.,.TEXTURE.,$,1,1,3,("0FF00AA"));\nENDSEC;\nEND-ISO');
  let m = api.OpenModel(new TextEncoder().encode(text));
  const row = api.GetLine(m, 9e3);
  assert.deepEqual(row.Pixel, ["0FF00AA"]);
  row.Pixel[0] = "0ABCDEF";
  api.WriteLine(m, row);
  const saved = api.SaveModel(m);
  api.CloseModel(m);
  assert.match(new TextDecoder().decode(saved), /"0ABCDEF"/);
  m = api.OpenModel(saved);
  assert.deepEqual(api.GetLine(m, 9e3).Pixel, ["0ABCDEF"]);
  api.CloseModel(m);
});

// These cases exercise STEP BINARY syntax independently of Pixel dimensions.
function binaryModel(literal) {
  return new TextEncoder().encode(base.replace("ENDSEC;\nEND-ISO",
    `#9000=IFCPIXELTEXTURE(.T.,.T.,$,$,$,1,1,3,(${literal}));\nENDSEC;\nEND-ISO`));
}

for (const literal of ["0", "30", "31", "23B", "092A", "17F", "207F", "301", "0ff00aa"]) {
  test(`STEP binary padding and canonical round-trip: ${literal}`, async () => {
    const api = new w.IfcAPI();
    await api.Init();
    let model = api.OpenModel(binaryModel(`"${literal}"`));
    try {
      assert.notEqual(model, -1);
      assert.equal(api.GetRawLineData(model, 9000).arguments[8][0].value, literal.toUpperCase());
      const row = api.GetLine(model, 9000);
      row.Pixel[0].value = literal.toLowerCase();
      api.WriteLine(model, row);
      const saved = api.SaveModel(model);
      assert.ok(new TextDecoder().decode(saved).includes(`"${literal.toUpperCase()}"`));
      api.CloseModel(model);
      model = api.OpenModel(saved);
      assert.equal(api.GetLine(model, 9000).Pixel[0].value, literal.toUpperCase());
    } finally { if (model !== -1) api.CloseModel(model); }
  });
}

for (const callback of [false, true]) {
  test(`malformed binary rejects the entire model (${callback ? "callback" : "buffer"})`, async () => {
    const api = new w.IfcAPI();
    await api.Init();
    const open = data => callback
      ? api.OpenModelFromCallback((offset, size) => data.subarray(offset, offset + size), { TAPE_SIZE: 1024 })
      : api.OpenModel(data, { TAPE_SIZE: 1024 });
    const invalid = ['""', '"4ABC"', '"0AG"', '"1"', '"3F"', '"2C"', '"0a b"', '"' + "0" + "F".repeat(65535) + '"'];
    const inputs = invalid.map(binaryModel);
    // EOF inside a literal, both before any tokens and after valid entities.
    inputs.push(new TextEncoder().encode('"0FF'));
    inputs.push(new TextEncoder().encode(base.split("ENDSEC;\nEND-ISO")[0] + '#9000=IFCPIXELTEXTURE("0FF'));
    for (const data of inputs) {
      assert.equal(open(data), -1);
      const good = open(binaryModel('"0FF00AA"'));
      try {
        assert.notEqual(good, -1);
        assert.equal(api.IsModelOpen(good - 1), false, "failed model must be closed");
        assert.equal(api.GetLine(good, 9000).Pixel[0].value, "0FF00AA");
      } finally { api.CloseModel(good); }
    }
  });
}

function lineIDs(api, model) {
  const ids = api.GetAllLines(model);
  try { return Array.from({ length: ids.size() }, (_, i) => ids.get(i)); }
  finally { ids.delete(); }
}

const binaryArguments = {
  nested: value => [[{ type: w.BINARY, value }]],
  compact: value => [{ type: w.BINARY, value: [value] }],
  typed: value => [{ type: w.LABEL, label: "IFCBINARY", valueType: w.BINARY, value }],
};
for (const [shape, args] of Object.entries(binaryArguments)) {
  test(`binary writes validate before mutation: ${shape}`, async () => {
    const api = new w.IfcAPI();
    await api.Init();
    const model = api.OpenModel(binaryModel('"0FF00AA"'));
    try {
      const original = api.GetRawLineData(model, 9000);
      const originalIDs = lineIDs(api, model);
      const saved = api.SaveModel(model);
      for (const invalid of ["", "4ABC", "0AG", "1", "3F", "2C", "0F\"", "0" + "F".repeat(65535), 42, null, undefined]) {
        assert.equal(api.wasmModule.WriteLine(model, 9000, w.IFCPIXELTEXTURE, args(invalid)), false);
        assert.deepEqual(api.GetRawLineData(model, 9000), original);
        assert.deepEqual(api.SaveModel(model), saved);
        assert.equal(api.wasmModule.WriteLine(model, 9001, w.IFCPIXELTEXTURE, args(invalid)), false);
        assert.deepEqual(lineIDs(api, model), originalIDs);
      }
      // Check each accepted encoding path too, including compact BINARY arrays.
      const pixels = shape === "typed" ? args("0abcdef") : args("0abcdef")[0];
      const parameters = original.arguments.slice();
      parameters[8] = pixels;
      assert.equal(api.wasmModule.WriteLine(model, 9000, w.IFCPIXELTEXTURE, parameters), true);
      const updated = api.SaveModel(model);
      assert.ok(new TextDecoder().decode(updated).includes('"0ABCDEF"'));
      const reopened = api.OpenModel(updated);
      try { assert.notEqual(reopened, -1); } finally { api.CloseModel(reopened); }
    } finally { api.CloseModel(model); }
  });
}

test("invalid binary header write leaves the model unchanged", async () => {
  const api = new w.IfcAPI();
  await api.Init();
  const model = api.OpenModel(binaryModel('"0FF00AA"'));
  try {
    const saved = api.SaveModel(model);
    assert.equal(api.wasmModule.WriteHeaderLine(model, w.FILE_DESCRIPTION, binaryArguments.nested("4ABC")), false);
    assert.deepEqual(api.SaveModel(model), saved);
  } finally { api.CloseModel(model); }
});

test("binary length boundary and chunk eviction preserve the token tape", async () => {
  const api = new w.IfcAPI();
  await api.Init();
  const value = "0" + "F".repeat(65534);
  let model = api.OpenModel(binaryModel(`"${value}"`), { TAPE_SIZE: 1024, MEMORY_LIMIT: 2048 });
  try {
    assert.notEqual(model, -1);
    // Revisit earlier chunks after reading the large token.
    assert.equal(api.GetLine(model, 9000).Pixel[0].value, value);
    assert.equal(api.GetLine(model, 23).Name.value, "Regression");
    const row = api.GetLine(model, 9000);
    row.Pixel[0].value = value.toLowerCase();
    api.WriteLine(model, row);
    const saved = api.SaveModel(model);
    api.CloseModel(model);
    model = api.OpenModel(saved);
    assert.equal(api.GetLine(model, 9000).Pixel[0].value, value);
    assert.equal(api.GetLine(model, 23).Name.value, "Regression");
  } finally { if (model !== -1) api.CloseModel(model); }
});
