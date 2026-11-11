// Runs brep-bench over a list of IFC files (one per line, or a TSV whose last column is the path)
// and prints a table plus totals. Each file runs in its own process; a crash or timeout is recorded.
//   node run-sample.mjs <bench.exe> <list> [--rounds 2] [--timeout 1800] [--out results.jsonl]
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const [exe, list, ...rest] = process.argv.slice(2);
const opt = (k, d) => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : d; };
const rounds = opt("--rounds", "2");
const timeout = Number(opt("--timeout", "1800")) * 1000;
const out = opt("--out", null);

const files = readFileSync(list, "utf8").split(/\r?\n/).map((l) => l.split("\t").pop().trim()).filter((p) => p && existsSync(p));
const rows = [];
for (const f of files) {
  const t0 = Date.now();
  // A .js bench is the wasm build: run it under this node.
  const [cmd, pre] = exe.endsWith(".js") ? [process.execPath, ["--stack-size=65500", exe]] : [exe, []];
  const r = spawnSync(cmd, [...pre, f, "--rounds", rounds], { encoding: "utf8", timeout, maxBuffer: 1 << 26 });
  const line = (r.stdout || "").split(/\r?\n/).find((l) => l.startsWith("RESULT:"));
  let row;
  if (line) row = JSON.parse(line.slice(7));
  else row = { file: f.split(/[\\/]/).pop(), error: r.error ? String(r.error.code || r.error) : `exit ${r.status}`, stderr: (r.stderr || "").slice(-300) };
  row.wallMs = Date.now() - t0;
  rows.push(row);
  if (out) appendFileSync(out, JSON.stringify(row) + "\n");
  const a = row.A?.totalMs, b = row.B?.totalMs;
  console.log([row.file, row.mb?.toFixed?.(1), a?.toFixed?.(0), b?.toFixed?.(0), a && b ? (b / a).toFixed(2) : row.error ?? ""].join("\t"));
}
const ok = rows.filter((r) => r.A && r.B);
const sum = (k, p) => ok.reduce((s, r) => s + (r[p]?.[k] ?? 0), 0);
const ratios = ok.map((r) => r.B.totalMs / r.A.totalMs).sort((x, y) => x - y);
const med = ratios.length ? ratios[Math.floor(ratios.length / 2)] : NaN;
console.log(`files ${rows.length}, both ok ${ok.length}`);
console.log(`A total ${sum("totalMs", "A").toFixed(0)} ms (mesh ${sum("meshMs", "A").toFixed(0)}, shell ${sum("shellMs", "A").toFixed(0)})`);
console.log(`B total ${sum("totalMs", "B").toFixed(0)} ms (kernel ${sum("kernelMs", "B").toFixed(0)}, shell ${sum("shellMs", "B").toFixed(0)}, fallback ${sum("fallbackMs", "B").toFixed(0)})`);
console.log(`B/A overall ${(sum("totalMs", "B") / sum("totalMs", "A")).toFixed(3)}, median per file ${med.toFixed(3)}`);
