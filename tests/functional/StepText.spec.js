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
