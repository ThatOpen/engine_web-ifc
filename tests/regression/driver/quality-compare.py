#!/usr/bin/env python3
"""Compare two corpus quality snapshots (quality.mjs output) and decide whether the code
change globally IMPROVED or DEGRADED the models.

Dominance rule, applied per model then rolled up across the corpus:
    tier 1 coverage  > tier 2 invalidity > tier 3 topology > tier 4 fidelity
A tier-1 loss on ANY model (fewer meshed, more missing, or a crash) can never be washed
out by tier-3 gains elsewhere. Silence is not success, at corpus scale.

Usage: quality-compare.py baseline.json current.json
Exit:  0 improvement/neutral, 1 mixed-needs-review, 2 regression.
"""
import json, sys

TIERS = {1: "coverage", 2: "invalidity", 3: "topology", 4: "fidelity"}

def load(p):
    return json.load(open(p, encoding="utf-8"))["models"]

def model_deltas(a, b):
    """Return {tier: +1 regressed / -1 improved / 0} for one model, plus a detail string."""
    # crash transitions dominate (tier 1)
    if b.get("crashed") and not a.get("crashed"):
        return {1: +1}, "meshed -> CRASH"
    if a.get("crashed") and not b.get("crashed"):
        return {1: -1}, "CRASH -> recovered"
    if a.get("crashed") and b.get("crashed"):
        return {}, "both crash"
    d, notes = {}, []
    # tier 1: coverage
    if b["meshed"] < a["meshed"] or b["missing"] > a["missing"]:
        d[1] = +1; notes.append(f"meshed {a['meshed']}->{b['meshed']}")
    elif b["meshed"] > a["meshed"] or b["missing"] < a["missing"]:
        d[1] = -1; notes.append(f"meshed {a['meshed']}->{b['meshed']}")
    # tier 2 — hard invalidity, refined. An inverted-volume element that was OPEN in the
    # baseline and merely became watertight now is a *visibility* of improved topology, not a
    # fresh regression. Only a solid that was already valid-and-closed and is now inward
    # ("flipped") counts as a real tier-2 loss. Needs per-element IDs; falls back to counts.
    if "invertedIds" in a and "invertedIds" in b:
        base_inv, cur_inv = set(a["invertedIds"]), set(b["invertedIds"])
        base_wt = set(a["watertightIds"])
        new_inv = cur_inv - base_inv
        flipped = [i for i in new_inv if i in base_wt]        # closed & valid -> inward (REAL)
        revealed = [i for i in new_inv if i not in base_wt]   # became watertight & inward (visibility)
        fixed = base_inv - cur_inv
        nan_delta = b["nanInf"] - a["nanInf"]
        if flipped or nan_delta > 0:
            d[2] = +1; notes.append(f"inverted-flip {len(flipped)}" + (f" nan+{nan_delta}" if nan_delta > 0 else ""))
        elif fixed or nan_delta < 0:
            d[2] = -1; notes.append(f"inverted-fixed {len(fixed)}")
        if revealed:
            notes.append(f"[{len(revealed)} newly-watertight-inward -> review, NOT tier2]")
    else:
        inv_a, inv_b = a["inverted"] + a["nanInf"], b["inverted"] + b["nanInf"]
        if inv_b > inv_a: d[2] = +1; notes.append(f"invalid {inv_a}->{inv_b}")
        elif inv_b < inv_a: d[2] = -1; notes.append(f"invalid {inv_a}->{inv_b}")
    # tier 3
    top_a = a["torn"] + a["badWinding"] + a["nonManifold"]
    top_b = b["torn"] + b["badWinding"] + b["nonManifold"]
    if top_b > top_a: d[3] = +1; notes.append(f"topo {top_a}->{top_b}")
    elif top_b < top_a: d[3] = -1; notes.append(f"topo {top_a}->{top_b}")
    # tier 4
    if b["suspectNoOp"] > a["suspectNoOp"]: d[4] = +1; notes.append("noop+")
    elif b["suspectNoOp"] < a["suspectNoOp"]: d[4] = -1; notes.append("noop-")
    return d, ", ".join(notes)

def main():
    a, b = load(sys.argv[1]), load(sys.argv[2])
    common = sorted(set(a) & set(b))
    only_a, only_b = sorted(set(a) - set(b)), sorted(set(b) - set(a))

    regressed = {t: [] for t in TIERS}
    improved = {t: [] for t in TIERS}
    per_model = []
    for m in common:
        d, note = model_deltas(a[m], b[m])
        worst_r = min([t for t, v in d.items() if v > 0], default=None)
        best_i = min([t for t, v in d.items() if v < 0], default=None)
        for t, v in d.items():
            (regressed if v > 0 else improved)[t].append((m, note))
        if worst_r or best_i:
            per_model.append((m, worst_r, best_i, note))

    print(f"baseline: {sys.argv[1]}")
    print(f"current:  {sys.argv[2]}")
    print(f"models compared: {len(common)}   (only-baseline {len(only_a)}, only-current {len(only_b)})")
    print()
    for m, wr, bi, note in per_model:
        tag = ("REGRESSED tier%d" % wr) if (wr and (not bi or wr <= bi)) else \
              ("IMPROVED  tier%d" % bi) if bi and (not wr or bi < wr) else "MIXED"
        print(f"  {tag:18s} {m:34s} {note}")
    if not per_model:
        print("  (no model changed on any tier)")

    worst = next((t for t in TIERS if regressed[t]), None)
    best = next((t for t in TIERS if improved[t]), None)
    outcome = ("NEUTRAL" if worst is None and best is None else
               "IMPROVEMENT" if worst is None else
               "REGRESSION" if best is None else "MIXED")
    print("\n" + "=" * 72)
    print(f"GLOBAL VERDICT: {outcome}")
    if worst: print(f"  highest tier regressed: {worst} ({TIERS[worst]}) on {len(regressed[worst])} model(s): "
                    + ", ".join(m for m, _ in regressed[worst][:6]))
    if best:  print(f"  highest tier improved:  {best} ({TIERS[best]}) on {len(improved[best])} model(s): "
                    + ", ".join(m for m, _ in improved[best][:6]))
    if outcome == "MIXED":
        if worst < best:
            print(f"  A tier-{worst} loss cannot be paid for with a tier-{best} gain -> treat as REGRESSION unless waived.")
        elif worst > best:
            print(f"  Improvement at tier {best}; regression only at lower-priority tier {worst} -> net positive, review it.")
        else:
            print(f"  Improvement AND regression both at tier {worst} -> genuinely mixed; review the tier-{worst} regressions before accepting.")
    print("=" * 72)
    return 2 if outcome == "REGRESSION" or (outcome == "MIXED" and worst <= (best or 99)) else \
           1 if outcome == "MIXED" else 0

if __name__ == "__main__":
    sys.exit(main())
