const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const w = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
const source = fs.readFileSync(new URL("./fixtures/integers/strings-base.ifc", require("node:url").pathToFileURL(__filename).href), "utf8");
for (const value of [0, 2147483647, 2147483648, -2147483649, 9007199254740991, -9007199254740991]) test("integer read/write " + value, async () => {
  const api = new w.IfcAPI();
  await api.Init();
  const text = source.replace("ENDSEC;\nEND-ISO", `#9000=IFCPROPERTYSINGLEVALUE('RoundTrip',$,IFCINTEGER(${value}),$);
ENDSEC;
END-ISO`);
  let m = api.OpenModel(new TextEncoder().encode(text));
  let p = api.GetLine(m, 9e3);
  assert.equal(p.NominalValue.value, value);
  const negated = value === 0 ? 0 : -value;
  p.NominalValue.value = negated;
  api.WriteLine(m, p);
  assert.equal(api.GetLine(m, 9e3).NominalValue.value, negated);
  const saved = api.SaveModel(m);
  api.CloseModel(m);
  m = api.OpenModel(saved);
  assert.equal(api.GetLine(m, 9e3).NominalValue.value, negated);
  api.CloseModel(m);
});

const safeValues = [0, 2147483647, 2147483648, -2147483649, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
const integer = (value) => ({ type: w.INTEGER, value });
const label = (value) => ({ type: w.LABEL, label: "IFCINTEGER", valueType: w.INTEGER, value });
const referenceArgs = (list) => [null, null, null, list, null];

for (const compact of [false, true]) test(`integer list round-trip (${compact ? "compact" : "nested tokens"})`, async () => {
  const api = new w.IfcAPI();
  await api.Init();
  let model = api.OpenModel(new TextEncoder().encode(source));
  try {
    const list = compact ? integer(safeValues) : safeValues.map(integer);
    assert.equal(api.wasmModule.WriteLine(model, 9000, w.IFCREFERENCE, referenceArgs(list)), true);
    const read = () => api.GetRawLineData(model, 9000).arguments[3].map((item) => item.value);
    assert.deepEqual(read(), safeValues);
    const saved = api.SaveModel(model);
    assert.ok(new TextDecoder().decode(saved).includes(`(${safeValues.join(",")})`));
    api.CloseModel(model);
    model = api.OpenModel(saved);
    assert.deepEqual(read(), safeValues);
  } finally {
    api.CloseModel(model);
  }
});

const writeForms = [
  ["labelled scalar", w.IFCPROPERTYSINGLEVALUE, (value) => [{ type: w.STRING, value: "Integer" }, null, label(value), null]],
  ["compact integer list", w.IFCREFERENCE, (value) => referenceArgs(integer([1, value]))],
  ["nested integer lists", w.IFCINDEXEDPOLYGONALFACEWITHVOIDS, (value) => [[1, 2, 3].map(integer), [[4, 5, value].map(integer)]]],
];
for (const [name, type, args] of writeForms) test(`invalid ${name} writes leave existing and new lines untouched`, async () => {
  const api = new w.IfcAPI();
  await api.Init();
  api.SetLogLevel(w.LogLevel.LOG_LEVEL_OFF);
  let model = api.OpenModel(new TextEncoder().encode(source));
  try {
    assert.equal(api.wasmModule.WriteLine(model, 9000, type, args(7)), true);
    const original = api.GetRawLineData(model, 9000);
    const before = api.SaveModel(model);
    for (const invalid of [1.5, NaN, Infinity, -Infinity, 2 ** 53, -(2 ** 53), "42", null]) {
      assert.equal(api.wasmModule.WriteLine(model, 9000, type, args(invalid)), false, `${name}: reject ${invalid}`);
      assert.deepEqual(api.GetRawLineData(model, 9000), original);
      assert.equal(api.wasmModule.WriteLine(model, 9001, type, args(invalid)), false);
      assert.equal(api.GetLineType(model, 9001), 0);
      assert.deepEqual(api.SaveModel(model), before, "rejected writes must not change the saved model");
    }
    assert.equal(api.wasmModule.WriteLine(model, 9000, type, args(11)), true, "a valid write still succeeds after rejection");
    const updated = api.GetRawLineData(model, 9000);
    const saved = api.SaveModel(model);
    api.CloseModel(model);
    model = api.OpenModel(saved);
    assert.deepEqual(api.GetRawLineData(model, 9000), updated);
  } finally {
    api.CloseModel(model);
  }
});

test("invalid integer in a header write leaves the header and saved model unchanged", async () => {
  const api = new w.IfcAPI();
  await api.Init();
  api.SetLogLevel(w.LogLevel.LOG_LEVEL_OFF);
  const model = api.OpenModel(new TextEncoder().encode(source));
  try {
    const before = api.SaveModel(model);
    const header = api.GetHeaderLine(model, w.FILE_DESCRIPTION);
    assert.equal(api.wasmModule.WriteHeaderLine(model, w.FILE_DESCRIPTION, [[integer(Infinity)], { type: w.STRING, value: "2;1" }]), false);
    assert.deepEqual(api.GetHeaderLine(model, w.FILE_DESCRIPTION), header);
    assert.deepEqual(api.SaveModel(model), before);
  } finally {
    api.CloseModel(model);
  }
});
