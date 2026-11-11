// Summarise a sampler file: self and inclusive time per function.
//   node prof-report.mjs <exe> <samples.txt> [top]
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const [exe, file, topArg] = process.argv.slice(2);
const top = Number(topArg ?? 30);
const lines = readFileSync(file, "utf8").trim().split("\n").map((l) => l.split(" ").map((h) => parseInt(h, 16)));
// ImageBase of a PE built by lld is 0x140000000; the symbolizer wants absolute VAs.
const BASE = 0x140000000;
const uniq = [...new Set(lines.flat())];
const sym = process.env.LLVM_SYMBOLIZER ?? "llvm-symbolizer";
const out = execFileSync(sym, ["--obj=" + exe, "--functions=short", "--demangle", "--inlines"], { input: uniq.map((a) => "0x" + (a + BASE).toString(16)).join("\n"), maxBuffer: 1 << 28 }).toString();
const blocks = out.trim().split(/\r?\n\r?\n/);
// With --inlines each block lists innermost..outermost frames as name/location line pairs; the last
// name is the physical function the address belongs to.
const names = (b) => (b ?? "??").split(/\r?\n/).filter((_, k) => k % 2 === 0);
const name = new Map(uniq.map((a, i) => { const n = names(blocks[i]); return [a, n[n.length - 1]]; }));
const leaf = new Map(uniq.map((a, i) => [a, names(blocks[i])[0]]));
// Code built without debug info (mimalloc, the CRT) symbolises as ??: name it from the symbol table.
const nm = execFileSync(sym.replace("llvm-symbolizer", "llvm-nm"), ["-n", "--demangle", exe], { maxBuffer: 1 << 28 }).toString()
  .split(/\r?\n/).map((l) => l.match(/^([0-9a-f]+) [tT] (.*)$/i)).filter(Boolean).map((m) => [parseInt(m[1], 16) - BASE, m[2]]);
const nearest = (a) => { let lo = 0, hi = nm.length - 1, r = null; while (lo <= hi) { const m = (lo + hi) >> 1; if (nm[m][0] <= a) { r = nm[m][1]; lo = m + 1; } else hi = m - 1; } return r ? "~" + r.split("(")[0] : "??"; };
for (const a of uniq) { if (name.get(a) === "??") name.set(a, nearest(a)); if (leaf.get(a) === "??") leaf.set(a, nearest(a)); }
const self = new Map(), incl = new Map();
for (const s of lines) {
  if (!s.length) continue;
  const f = name.get(s[0]) + "  [" + leaf.get(s[0]) + "]"; self.set(f, (self.get(f) ?? 0) + 1);
  for (const n of new Set(s.map((a) => name.get(a)))) incl.set(n, (incl.get(n) ?? 0) + 1);
}
const N = lines.length;
const show = (m, t) => { console.log(`-- ${t} (of ${N} samples)`); [...m].sort((a, b) => b[1] - a[1]).slice(0, top).forEach(([f, n]) => console.log(`${(100 * n / N).toFixed(1).padStart(5)}%  ${f.slice(0, 150)}`)); };
show(self, "self"); show(incl, "inclusive");
