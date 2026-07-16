// quality.mjs — corpus quality snapshot, mirroring regression.mjs but storing intrinsic
// QUALITY metrics (not a hash) so two snapshots can be judged better/worse, not just "differs".
//
// Discovers the same corpus as regression.mjs: <corpusRoot>/public + <corpusRoot>/private.
// Runs the proven single-model validator (validate.mjs) as a SUBPROCESS per model, so a model
// that aborts the wasm kernel is isolated (recorded as crashed) instead of killing the run.
//
// Usage: node quality.mjs <web-ifc-module-file> <corpusRoot> <out.json> <label>
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import AdmZip from 'adm-zip';

// quality.mjs <web-ifc-module> <corpusRoot> <out.json> <label>
// All optional; defaults mirror regression.mjs (locally built dist + tests/ifcfiles).
const here = path.dirname(fileURLToPath(import.meta.url));
const VALIDATE = path.join(here, 'src', 'validate.mjs');
const a = process.argv.slice(2);
const modFile    = a[0] || path.join(here, '..', '..', 'dist', 'web-ifc-api-node.js');
const corpusRoot = a[1] || path.join(here, '..', 'ifcfiles');
const outPath    = a[2] || path.join(here, 'quality-current.json');
const label      = a[3] || 'current';
const modUrl = pathToFileURL(modFile).href;
const tmp = mkdtempSync(path.join(tmpdir(), 'qual-'));

function discover(sub) {
  const dir = path.join(corpusRoot, sub);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.ifc') || f.endsWith('.ifczip'))
    .map(f => ({ rel: (sub + '/' + f).replace(/\\/g, '/'), abs: path.join(dir, f) }));
}
const files = [...discover('public'), ...discover('private')];
console.log(`corpus: ${files.length} models (${modFile.split(/[\\/]/).pop()})`);

const models = {};
for (const { rel, abs } of files) {
  const outJson = path.join(tmp, rel.replace(/[\\/]/g, '_') + '.json');
  // .ifczip -> extract the first .ifc entry to a temp file, mirroring regression.mjs
  let modelPath = abs;
  if (abs.endsWith('.ifczip')) {
    try {
      const entry = new AdmZip(abs).getEntries().find(e => !e.isDirectory);
      modelPath = path.join(tmp, rel.replace(/[\\/]/g, '_') + '.ifc');
      writeFileSync(modelPath, entry.getData());
    } catch (e) {
      models[rel] = { crashed: true, exitCode: null, note: 'unzip failed: ' + e.message };
      console.log(`  CRASH  ${rel}  (unzip failed)`); continue;
    }
  }
  const r = spawnSync('node', [VALIDATE, modUrl, modelPath, outJson, rel],
                      { encoding: 'utf-8', timeout: 45000, killSignal: 'SIGKILL', maxBuffer: 1 << 28 });
  const timedOut = r.error && r.error.code === 'ETIMEDOUT';
  if (r.status !== 0 || !existsSync(outJson)) {
    const tail = (r.stderr || r.stdout || '').trim().split('\n').slice(-2).join(' | ');
    models[rel] = { crashed: true, timedOut: !!timedOut, exitCode: r.status,
                    note: timedOut ? 'TIMEOUT >45s (non-terminating)' : tail.slice(0, 240) };
    console.log(`  ${timedOut ? 'TIMEOUT' : 'CRASH'}  ${rel}`);
    continue;
  }
  const doc = JSON.parse(readFileSync(outJson, 'utf-8'));
  const s = doc.summary;
  // Per-element IDs needed to classify tier-2 changes across versions:
  //   watertight = closed (no naked/non-manifold edges); inverted = watertight AND wound inward.
  // This lets the comparator tell "was a valid closed solid, now inverted" (real regression)
  // from "was open, became watertight and happens to be inward" (visibility of better topology).
  const wt = [], inv = [];
  for (const e of doc.elements) {
    const watertight = e.hasGeometry && e.nakedEdges === 0 && e.nonManifoldEdges === 0;
    if (!watertight) continue;
    wt.push(e.expressID);
    if (e.signedVolume < 0) inv.push(e.expressID);
  }
  models[rel] = {
    crashed: false,
    expected: s.tier1_coverage.expected,
    meshed: s.tier1_coverage.meshed,
    missing: s.tier1_coverage.missing,
    inverted: s.tier2_hardInvalidity.elementsInvertedVolume,
    nanInf: s.tier2_hardInvalidity.nanInfVertices,
    torn: s.tier3_topology.elementsTorn,
    badWinding: s.tier3_topology.elementsInconsistentWinding,
    nonManifold: s.tier3_topology.nonManifoldEdges,
    nakedEdges: s.tier3_topology.nakedEdges,
    suspectNoOp: s.tier4_fidelity.elementsSuspectBooleanNoOp,
    totalTriangles: s.totalTriangles,
    invertedIds: inv,
    watertightIds: wt,
  };
  const m = models[rel];
  console.log(`  ok     ${rel}  meshed ${m.meshed}/${m.expected} torn ${m.torn} tris ${m.totalTriangles}`);
}

writeFileSync(outPath, JSON.stringify({ meta: { label, module: modFile }, models }, null, 1));
console.log(`\nsnapshot -> ${outPath}  (${Object.keys(models).length} models)`);
