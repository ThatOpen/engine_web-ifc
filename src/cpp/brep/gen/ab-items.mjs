// Compare two brep-bench builds that change geometry on purpose: per Body item, accepted or not and
// its signed volume, plus kernel cycles (fastest of base, opt, opt, base).
//   node ab-items.mjs <base.exe> <opt.exe> <list> [--out file.jsonl]
import { readFileSync, appendFileSync, existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

const [base, opt, list, ...rest] = process.argv.slice(2);
const out = rest.includes("--out") ? rest[rest.indexOf("--out") + 1] : null;
const files = readFileSync(list, "utf8").split(/\r?\n/).map((l) => l.trim()).filter((p) => p && existsSync(p));
mkdirSync("vc", { recursive: true });
const run = (exe, f, tag) => {
  const log = `vc/${tag}.txt`;
  const r = spawnSync(exe, [f, "--rounds", "2", "--only", "B"], { encoding: "utf8", env: { ...process.env, BREP_ITEMLOG: log }, timeout: 1800000, maxBuffer: 1 << 26 });
  const line = (r.stdout || "").split(/\r?\n/).find((l) => l.startsWith("RESULT:"));
  if (!line) return null;
  const items = new Map(readFileSync(log, "utf8").trim().split("\n").filter(Boolean).map((l) => {
    const [id, a, v] = l.split(" ");
    return [id, { a: +a, v: +v }];
  }));
  return { B: JSON.parse(line.slice(7)).B, items };
};
const T = { lost: 0, gained: 0, volDiff: 0, base: 0, opt: 0 };
for (const f of files) {
  const b1 = run(base, f, "b1"), o1 = run(opt, f, "o1"), o2 = run(opt, f, "o2"), b2 = run(base, f, "b2");
  if (!b1 || !o1 || !o2 || !b2) { console.log("FAIL", f); continue; }
  let lost = 0, gained = 0, volDiff = 0, worst = 0;
  const lostIds = [];
  for (const [id, x] of b1.items) {
    const y = o1.items.get(id);
    if (!y) continue;
    if (x.a && !y.a) { lost++; lostIds.push(id); }
    else if (!x.a && y.a) gained++;
    else if (x.a && y.a) {
      const rel = Math.abs(x.v - y.v) / Math.max(1e-12, Math.abs(x.v));
      if (rel > 1e-5) { volDiff++; worst = Math.max(worst, rel); }
    }
  }
  const kb = Math.min(b1.B.kernelGcycles, b2.B.kernelGcycles), ko = Math.min(o1.B.kernelGcycles, o2.B.kernelGcycles);
  T.lost += lost; T.gained += gained; T.volDiff += volDiff; T.base += kb; T.opt += ko;
  const name = f.split(/[\/]/).pop();
  console.log(`${name.slice(0, 40).padEnd(41)} cyc ${kb.toFixed(3)} -> ${ko.toFixed(3)}  lost ${lost}${lost ? " [" + lostIds.slice(0, 5).join(",") + "]" : ""} gained ${gained} vol>1e-5 ${volDiff}${volDiff ? " worst " + (worst * 100).toFixed(4) + "%" : ""}`);
  if (out) appendFileSync(out, JSON.stringify({ file: name, kb, ko, lost, lostIds, gained, volDiff, worst }) + "\n");
}
console.log(`TOTAL cycles ${T.base.toFixed(2)} -> ${T.opt.toFixed(2)}; lost ${T.lost} gained ${T.gained} volDiff ${T.volDiff}`);
