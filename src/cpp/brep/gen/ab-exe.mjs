// Compare two brep-bench builds on path B: same output (digest) and how much faster.
// Runs base, opt, opt, base per file (ABBA) so machine load drifts cancel; reports min of each.
//   node ab-exe.mjs <base.exe> <opt.exe> <list> [--only file-substring] [--out ab.jsonl]
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const [base, opt, list, ...rest] = process.argv.slice(2);
const flag = (k) => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : null; };
const only = flag("--only");
const out = flag("--out");
const files = readFileSync(list, "utf8").split(/\r?\n/).map((l) => l.trim()).filter((p) => p && existsSync(p) && (!only || p.includes(only)));

// An exe may carry env overrides: "path.exe|KEY=v|KEY2=w".
const run = (spec, f) => {
  const [exe, ...kv] = spec.split("|");
  const extra = Object.fromEntries(kv.map((s) => s.split("=")));
  const r = spawnSync(exe, [f, "--rounds", "3", "--only", "B"], { encoding: "utf8", env: { ...process.env, BREP_DIGEST: "1", ...extra }, timeout: 1800000, maxBuffer: 1 << 26 });
  const line = (r.stdout || "").split(/\r?\n/).find((l) => l.startsWith("RESULT:"));
  return line ? JSON.parse(line.slice(7)).B : null;
};
let tb = 0, to = 0, same = 0, diff = 0;
for (const f of files) {
  const b1 = run(base, f), o1 = run(opt, f), o2 = run(opt, f), b2 = run(base, f);
  if (!b1 || !o1 || !o2 || !b2) { console.log("FAIL", f); continue; }
  const K = (x) => x.kernelGcycles ?? x.kernelMs; const kb = Math.min(K(b1), K(b2)), ko = Math.min(K(o1), K(o2));
  const eq = b1.digest === o1.digest && b1.digest === b2.digest && o1.digest === o2.digest && b1.items === o1.items;
  eq ? same++ : diff++;
  tb += kb; to += ko;
  const name = f.split(/[\\/]/).pop();
  console.log(`${eq ? "same" : "DIFF"}\t${kb.toFixed(0)}\t${ko.toFixed(0)}\t${(ko / kb).toFixed(2)}\t${name}`);
  if (out) appendFileSync(out, JSON.stringify({ file: name, same: eq, baseKernelMs: kb, optKernelMs: ko, baseDigest: b1.digest, optDigest: o1.digest }) + "\n");
}
console.log(`identical ${same}/${same + diff}; kernel ms base ${tb.toFixed(0)} -> opt ${to.toFixed(0)} (${(to / tb).toFixed(3)})`);
