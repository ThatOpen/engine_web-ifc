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

// A valid header and earlier records must not turn a tokenizer failure into a partial model.
const rejectionScript = `const assert=require('node:assert/strict'),w=require(process.argv[1]);
(async()=>{
 const api=new w.IfcAPI();await api.Init();api.SetLogLevel(w.LogLevel.LOG_LEVEL_OFF);
 const valid="ISO-10303-21;HEADER;FILE_DESCRIPTION((''),'2;1');FILE_NAME('','',(''),(''),'','','');FILE_SCHEMA(('IFC4'));ENDSEC;DATA;#1=IFCCARTESIANPOINT((0.,0.,0.));ENDSEC;END-ISO-10303-21;";
 const open=(text)=>{const bytes=Buffer.from(text);return process.argv[3]==='callback'
   ?api.OpenModelFromCallback((offset,size)=>bytes.subarray(offset,offset+size),{TAPE_SIZE:64})
   :api.OpenModel(bytes,{TAPE_SIZE:64});};
 for(let i=0;i<3;i++){
   const broken=valid.replace('ENDSEC;END-ISO-10303-21;',process.argv[2]);
   assert.equal(open(broken),-1,'reject malformed token after a valid header');
   const good=open(valid);assert.ok(good>=0);assert.equal(api.GetAllLines(good).size(),1);api.CloseModel(good);
 }
})().catch(e=>{console.error(e);process.exitCode=1;});`;
test.each(["buffer", "callback"].flatMap(mode => ["#2=IFCLABEL('unfinished", "/* unfinished", "#2=IFCBOOLEAN(.UNFINISHED"].map(tail => [mode, tail])))(
  "reject late malformed token via %s: %s", (mode, tail) => {
    const result=spawnSync(process.execPath,["-e",rejectionScript,api,tail,mode],{timeout:10000,maxBuffer:1024*1024,encoding:"utf8"});
    assert.equal(result.error,undefined);assert.equal(result.status,0,result.stderr);
  });
