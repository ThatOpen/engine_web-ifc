# Does the validator actually work?

Everything here was run, not reasoned about. Results are as they came out, including the
ones that came out empty.

## 1. The metrics are correct — exact-volume control

A synthetic slab: a 10×6 outer rectangle with a 4×2 rectangular void, extruded 2.0.
The correct volume is therefore `(10*6 - 4*2) * 2.0 = 104.0` exactly.

```
#100  IfcSlab  expected=True  hasGeom=True  tri=32  signedVolume=104.0000  watertight=True
```

The validator computed **104.0000** with no golden file, no reference build, and no
snapshot — from the divergence theorem over the triangle buffer alone. It also saw that
the void really was subtracted (an uncut slab would be 120.0), pronounced the mesh
watertight, and classified the slab as `expected` while correctly *not* expecting geometry
from Site / Building / Storey.

That is the whole thesis of an intrinsic validator in one line: it knew the right answer
without ever being shown a correct version of the model.

## 2. The dominance rule works — fault-injection control

Two builds of `main`, identical but for one line: in the broken one,
`IFCBOOLEANCLIPPINGRESULT` returns an empty mesh. This mimics a real, documented failure
class — loop-reconstruction failure ("Loop in findLoop", "No basis found for brep!") and
the vertex-count abort threshold — where a clipped element silently disappears instead of
raising an error. The validator source was byte-identical on both sides.

### GOOD → BROKEN (`duplex.ifc`)

```
!! coverage: meshed            215        211      -4
!! coverage: missing             0          4      +4
   torn elements                24         24      =
   non-manifold edges            0          0      =
   total triangles           28188      28102     -86

  REGRESSED  tier1 coverage  #4287  IfcWallStandardCase -- triangles 14 -> 0
  REGRESSED  tier1 coverage  #4399  IfcWallStandardCase -- triangles 12 -> 0
  REGRESSED  tier1 coverage  #4465  IfcWallStandardCase -- triangles 44 -> 0
  REGRESSED  tier1 coverage  #24596 IfcWallStandardCase -- triangles 16 -> 0

VERDICT: REGRESSION          (exit 2)
```

It named the four walls that vanished, by ExpressID.

### BROKEN → GOOD (`dental_clinic.ifc`) — the case the whole design exists for

```
OK coverage: meshed           2560       2586     +26
OK coverage: missing            26          0     -26
!! bad winding                 421        422      +1
!! non-manifold edges           31         40      +9
!! duplicate triangles           0          4      +4
   total triangles          192867     193743    +876

VERDICT: MIXED
  highest tier improved:   1 (coverage)
  highest tier regressed:  3 (topology)
  Improvement is at tier 1, regression only at the lower-priority tier 3.
  -> net positive, but review the tier-3 regressions.
```

**Read that table again.** The good build is *worse* on every topology metric: more
non-manifold edges, more duplicate triangles, worse winding. It is worse because it
actually generated the difficult geometry. The broken build scored better by not trying.

A single-scalar "count the bad triangles" metric would have declared the broken build
the winner. The tier order gets it right.

This is the founding requirement, stated by the user before a line of this was written:

> If a model has more naked edges than another, but in the first one all objects had
> geometry while in the second not all objects had geometry, then probably the first one
> — although it has more wrong triangles — is better, because the second one directly
> didn't generate this problematic geometry.

**Silence is not success.**

## 3. What we could NOT show, and why it matters

Three attempts to detect a *real* historical fix all came back with no change. None of
them was a failure of the validator, and none should be quietly dropped:

| Fix | Result | Why |
|---|---|---|
| `df182060` — `GetCurve(ref,2)` → `(ref,3)` for `IFCARBITRARYPROFILEDEFWITHVOIDS` | no change on any of 11 models | **Every model in the repo authors those profile curves with 2D points.** The fix only affects 3D-authored curves, so there is genuinely nothing to detect. A hand-built 3D-point repro also produced identical (correct, 104.0) output in both builds — so a polyline of 3D `IfcCartesianPoint`s is not what the dimension argument governs. |
| `5a4d01e9` — "Fix extrusion" (99 lines of `curve-utils.h`) | no change on any of 12 models | Not exercised by any available model. |
| `984c45e8` — `GetBasisFromCoplanarPoints()` | **could not build** | Predates `353c231f "Seperate Cache from Loader"`; the kernel API the validator links against did not exist yet. See the API-window note in the README. |

The first row is a finding about the *project*, not about the tool: **that fix shipped
with no test model in the repo that covers it.** Given that 34% of web-ifc's resolved
issues are regressions, a fix with no covering model is a regression waiting to happen.
Both of the first two rows are exactly the gap this suite exists to close.

## Reproducing

```bash
# exact-volume control
webifc_validate tests/regression/fixtures/repro3d.ifc report.json

# fault-injection control: in IfcGeometryProcessor.cpp, first line of the
# IFCBOOLEANCLIPPINGRESULT case body, insert `return mesh;`, build to a second dir, then
python3 tests/regression/driver/compare.py good.json broken.json   # -> REGRESSION, exit 2
python3 tests/regression/driver/compare.py broken.json good.json   # -> IMPROVEMENT / MIXED
```
