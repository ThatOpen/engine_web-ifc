const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const w = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
const source = fs.readFileSync(new URL("./fixtures/step-text/strings-base.ifc", require("node:url").pathToFileURL(__filename).href), "utf8");
for (const text of ["Don't", "\xD5'", "C:\\Models\\a.ifc", "\u{1F600}", "\xD5\u{1F600}\xE4", "\xA0"]) {
  test(`strings: ${JSON.stringify(text)}`, async () => {
    const api = new w.IfcAPI();
    await api.Init();
    assert.equal(api.DecodeText(api.EncodeText(text)), text);
    const input = source.replace("ENDSEC;\nEND-ISO", `#9000=IFCPROPERTYSINGLEVALUE('RoundTrip',$,IFCTEXT('${api.EncodeText(text)}'),$);
ENDSEC;
END-ISO`);
    let m = api.OpenModel(new TextEncoder().encode(input));
    assert.equal(api.GetLine(m, 9e3).NominalValue.value, text);
    const line = api.GetLine(m, 9e3);
    line.NominalValue.value = text;
    api.WriteLine(m, line);
    assert.equal(api.GetLine(m, 9e3).NominalValue.value, text);
    const saved = api.SaveModel(m);
    api.CloseModel(m);
    m = api.OpenModel(saved);
    assert.equal(api.GetLine(m, 9e3).NominalValue.value, text);
    api.CloseModel(m);
  });
}
test("S escape: non-breaking space", async () => {
  const api = new w.IfcAPI();
  await api.Init();
  assert.equal(api.DecodeText("\\S\\ "), "\xA0");
});
for (const encoded of ["\\X2\\00\\X0\\", "\\X2\\D800\\X0\\", "\\X4\\00110000\\X0\\", "\\X2\\00", "\\X2\\GGGG\\X0\\"]) test("reject invalid escape " + encoded, async () => {
  const api = new w.IfcAPI();
  await api.Init();
  assert.equal(api.DecodeText(encoded), "");
});

const stringToken = value => ({ type: w.STRING, value });
async function withModel(run) {
  const api = new w.IfcAPI(); await api.Init(); api.SetLogLevel(w.LogLevel.LOG_LEVEL_OFF);
  const model = api.OpenModel(new TextEncoder().encode(source));
  try { await run(api, model); } finally { api.CloseModel(model); }
}
test.each([["A",65535],["'",32767],["Õ",16381]])("STRING boundary round trip: %s x %i", async (character,count) => withModel(async (api,model) => {
  const text=character.repeat(count);
  const args=[stringToken("boundary"), stringToken(text), null, null];
  assert.equal(api.wasmModule.WriteLine(model,9000,w.IFCPROPERTYSINGLEVALUE,args),true);
  assert.equal(api.GetLine(model,9000).Description.value,text);
  const reopened=api.OpenModel(api.SaveModel(model));
  try { assert.equal(api.GetLine(reopened,9000).Description.value,text); } finally { api.CloseModel(reopened); }
}));
test.each([["A",65536],["'",32768],["Õ",16382]])("oversized escaped STRING is rejected atomically: %s x %i", async (character,count) => withModel(async (api,model) => {
  const text=character.repeat(count);
  const args=[stringToken("original"),stringToken("unchanged"),null,null];
  assert.equal(api.wasmModule.WriteLine(model,9000,w.IFCPROPERTYSINGLEVALUE,args),true);
  const before=api.SaveModel(model);
  for(const payload of [stringToken(text), {type:w.LABEL,label:"IFCTEXT",valueType:w.STRING,value:text}]) {
    assert.equal(api.wasmModule.WriteLine(model,9000,w.IFCPROPERTYSINGLEVALUE,[stringToken("changed"),null,payload,null]),false);
    assert.deepEqual(api.SaveModel(model),before);
    assert.equal(api.GetLine(model,9000).Description.value,"unchanged");
  }
  for(const descriptions of [[stringToken("ok"),[stringToken(text)]], {type:w.STRING,value:["ok",text]}, [text]]) {
    assert.equal(api.wasmModule.WriteHeaderLine(model,w.FILE_DESCRIPTION,[descriptions,stringToken("2;1")]),false);
    assert.deepEqual(api.SaveModel(model),before);
  }
}));
test("compact STRING arrays use the string writer", async () => withModel(async (api,model) => {
  const values=["Don't","Õ😀", "C:\\Models"];
  assert.equal(api.wasmModule.WriteHeaderLine(model,w.FILE_DESCRIPTION,[{type:w.STRING,value:values},stringToken("2;1")]),true);
  const saved=new TextDecoder().decode(api.SaveModel(model));
  assert.ok(saved.includes("FILE_DESCRIPTION((" + values.map(value => "'" + api.EncodeText(value) + "'").join(",") + "),'2;1')"));
}));
test.each([null,42,{},true])("reject non-string payload without changing the model: %p", async value => withModel(async (api,model) => {
  const before=api.SaveModel(model);
  assert.equal(api.wasmModule.WriteLine(model,9000,w.IFCPROPERTYSINGLEVALUE,[stringToken("probe"),stringToken(value),null,null]),false);
  assert.deepEqual(api.SaveModel(model),before);
}));

test("typed STRING wrappers cannot contain an aggregate", async () => withModel(async (api,model) => {
  const before=api.SaveModel(model);
  const value={type:w.LABEL,label:"IFCTEXT",valueType:w.STRING,value:["one","two"]};
  assert.equal(api.wasmModule.WriteLine(model,9000,w.IFCPROPERTYSINGLEVALUE,[stringToken("probe"),null,value,null]),false);
  assert.deepEqual(api.SaveModel(model),before);
}));
