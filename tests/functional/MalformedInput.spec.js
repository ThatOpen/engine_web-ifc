const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { fileURLToPath } = require("node:url");
const api = process.env.WEB_IFC_API || fileURLToPath(new URL("../../dist/web-ifc-api-node.js", require("node:url").pathToFileURL(__filename).href));
const script = `const fs=require('node:fs'),w=require(process.argv[1]);(async()=>{const api=new w.IfcAPI();await api.Init();const bytes=fs.readFileSync(process.argv[2]);const model=api.OpenModel(bytes);if(model<0)return;try{const match=bytes.toString().match(/#(\\d+)=IFCBUILDINGELEMENTPROXY/);if(match)api.GetFlatMesh(model,Number(match[1]));}finally{api.CloseModel(model);}})().catch(e=>{console.error(e);process.exitCode=1;});`;
for (const name of ["unterminated-string", "unterminated-comment", "invalid-index", "cyclic-placement", "missing-placement"]) test("bounded malformed input: " + name, () => {
  const result = spawnSync(process.execPath, ["-e", script, api, fileURLToPath(new URL("./fixtures/malformed-input/" + name + ".ifc", require("node:url").pathToFileURL(__filename).href))], { timeout: 5e3, maxBuffer: 1024 * 1024, encoding: "utf8" });
  assert.equal(result.error, void 0);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout + result.stderr, /memory access out of bounds|RuntimeError|stack overflow|Aborted\(/);
});
