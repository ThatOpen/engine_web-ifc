#!/usr/bin/env python3
"""Compare two validate.py reports and decide whether B is better or worse than A.

The whole point of this file is the dominance rule:

    B beats A only if it does not regress a HIGHER tier.

A tier-3 topology improvement never offsets a tier-1 coverage loss. That asymmetry is
deliberate and it is the reason this system exists: a build that dies on a hard boolean
and emits nothing scores a perfect zero on "bad triangles". Without the tier order,
that reads as an improvement. It is a regression.

Outcome is one of IMPROVEMENT / REGRESSION / MIXED / NEUTRAL. MIXED exists because a
strict lexicographic gate would block essentially every real fix -- most non-trivial
fixes trade something somewhere, and a check that blocks every PR gets switched off
within a month. So tier-1 regressions are surfaced explicitly, with their
representation chains, and are blocking-by-default but waivable by a human who has
actually looked at them. The rule preserved is that a tier-1 loss can never be
*silently* offset -- not that it can never be accepted.

Usage:
    compare.py before.json after.json
"""
import json
import sys

TIERS = [
    (1, "coverage"),
    (2, "hard invalidity"),
    (3, "topology"),
    (4, "metric fidelity"),
]


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def elements_by_id(report):
    return {e["expressID"]: e for e in report["elements"]}


def element_tier_state(e):
    """The per-element state at each tier. Lower tier number = more important."""
    return {
        1: e["coverageMiss"],
        2: e["nanInf"] > 0 or (e["hasGeometry"] and e["nakedEdges"] == 0
                               and e["nonManifoldEdges"] == 0 and e["signedVolume"] < 0),
        3: e["torn"] or e["shattered"] or not e["windingConsistent"],
        4: e["suspectNoOp"],
    }


def main():
    if len(sys.argv) < 3:
        print("usage: compare.py before.json after.json", file=sys.stderr)
        return 2

    a, b = load(sys.argv[1]), load(sys.argv[2])
    ea, eb = elements_by_id(a), elements_by_id(b)

    regressions = {t: [] for t, _ in TIERS}
    improvements = {t: [] for t, _ in TIERS}

    for eid in sorted(set(ea) | set(eb)):
        # An element present in one build and absent from the other is itself a
        # coverage event -- don't silently skip it.
        if eid not in eb:
            regressions[1].append((eid, ea[eid]["ifcType"], "element absent from B entirely"))
            continue
        if eid not in ea:
            improvements[1].append((eid, eb[eid]["ifcType"], "element newly present in B"))
            continue

        sa, sb = element_tier_state(ea[eid]), element_tier_state(eb[eid])
        for tier, _ in TIERS:
            if not sa[tier] and sb[tier]:
                regressions[tier].append((eid, eb[eid]["ifcType"], describe(tier, ea[eid], eb[eid])))
            elif sa[tier] and not sb[tier]:
                improvements[tier].append((eid, eb[eid]["ifcType"], describe(tier, ea[eid], eb[eid])))

    # ---- verdict ----------------------------------------------------------
    worst_regression = next((t for t, _ in TIERS if regressions[t]), None)
    best_improvement = next((t for t, _ in TIERS if improvements[t]), None)

    if worst_regression is None and best_improvement is None:
        outcome = "NEUTRAL"
    elif worst_regression is None:
        outcome = "IMPROVEMENT"
    elif best_improvement is None:
        outcome = "REGRESSION"
    else:
        outcome = "MIXED"

    # ---- report -----------------------------------------------------------
    print(f"A (before): {a['meta'].get('commit') or sys.argv[1]}")
    print(f"B (after):  {b['meta'].get('commit') or sys.argv[2]}")
    print(f"model:      {b['meta']['model']}")
    print()

    ca, cb = a["summary"]["tier1_coverage"], b["summary"]["tier1_coverage"]
    print(f"{'':22s} {'A':>10s} {'B':>10s}   delta")
    row("coverage: meshed", ca["meshed"], cb["meshed"], higher_is_better=True)
    row("coverage: missing", ca["missing"], cb["missing"], higher_is_better=False)
    ta, tb = a["summary"]["tier2_hardInvalidity"], b["summary"]["tier2_hardInvalidity"]
    row("NaN/Inf vertices", ta["nanInfVertices"], tb["nanInfVertices"], False)
    row("inverted volume", ta["elementsInvertedVolume"], tb["elementsInvertedVolume"], False)
    pa, pb = a["summary"]["tier3_topology"], b["summary"]["tier3_topology"]
    row("torn elements", pa["elementsTorn"], pb["elementsTorn"], False)
    row("shattered elements", pa["elementsShattered"], pb["elementsShattered"], False)
    row("bad winding", pa["elementsInconsistentWinding"], pb["elementsInconsistentWinding"], False)
    row("non-manifold edges", pa["nonManifoldEdges"], pb["nonManifoldEdges"], False)
    row("duplicate triangles", pa["duplicateTriangles"], pb["duplicateTriangles"], False)
    fa, fb = a["summary"]["tier4_fidelity"], b["summary"]["tier4_fidelity"]
    row("suspect boolean no-op", fa["elementsSuspectBooleanNoOp"], fb["elementsSuspectBooleanNoOp"], False)
    row("total triangles", a["summary"]["totalTriangles"], b["summary"]["totalTriangles"], None)
    print()

    for tier, name in TIERS:
        for eid, ifctype, detail in regressions[tier]:
            print(f"  REGRESSED  tier{tier} {name:16s} #{eid} {ifctype} -- {detail}")
    for tier, name in TIERS:
        for eid, ifctype, detail in improvements[tier]:
            print(f"  IMPROVED   tier{tier} {name:16s} #{eid} {ifctype} -- {detail}")

    print()
    print("=" * 72)
    print(f"VERDICT: {outcome}")
    if worst_regression is not None:
        print(f"  highest tier regressed:  {worst_regression} ({dict(TIERS)[worst_regression]})")
    if best_improvement is not None:
        print(f"  highest tier improved:   {best_improvement} ({dict(TIERS)[best_improvement]})")

    if outcome == "MIXED":
        # State the dominance rule out loud rather than hiding it in an exit code.
        if worst_regression < best_improvement:
            print()
            print(f"  Tier-{worst_regression} regression is NOT offset by the tier-{best_improvement} "
                  f"improvement.")
            print(f"  A higher-tier loss cannot be paid for with a lower-tier gain.")
            print(f"  -> treat as REGRESSION unless a human waives it explicitly.")
        else:
            print()
            print(f"  Improvement is at tier {best_improvement}, regression only at the lower-priority "
                  f"tier {worst_regression}.")
            print(f"  -> net positive, but review the tier-{worst_regression} regressions.")
    print("=" * 72)

    # exit code: 0 good/neutral, 1 needs a human, 2 outright regression
    if outcome == "REGRESSION":
        return 2
    if outcome == "MIXED" and worst_regression <= (best_improvement or 99):
        return 1
    return 0


def describe(tier, a, b):
    if tier == 1:
        return f"triangles {a['triangles']} -> {b['triangles']}"
    if tier == 2:
        return f"nanInf {a['nanInf']} -> {b['nanInf']}, signedVol {a['signedVolume']:.3f} -> {b['signedVolume']:.3f}"
    if tier == 3:
        return (f"naked {a['nakedEdges']}->{b['nakedEdges']}, nonMan {a['nonManifoldEdges']}->{b['nonManifoldEdges']}, "
                f"comp {a['components']}/{a['partCount']}->{b['components']}/{b['partCount']}")
    return f"voids cut {a['voidsWithCutEvidence']}/{a['declaredVoids']} -> {b['voidsWithCutEvidence']}/{b['declaredVoids']}"


def row(label, va, vb, higher_is_better):
    d = vb - va
    if d == 0:
        mark, ds = "  ", "     ="
    elif higher_is_better is None:
        mark, ds = "  ", f"{d:+7d}"
    elif (d > 0) == bool(higher_is_better):
        mark, ds = "OK", f"{d:+7d}"
    else:
        mark, ds = "!!", f"{d:+7d}"
    print(f"{mark} {label:20s} {va:10d} {vb:10d} {ds}")


if __name__ == "__main__":
    sys.exit(main())
