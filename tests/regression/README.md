# Intrinsic geometry validation for web-ifc

A fingerprint tells you build B **differs** from build A. It cannot tell you which one is
**right**. If a fix changes 40 elements, a fingerprint diff shrugs.

This tool answers the other question. It judges a mesh on its own terms — no golden file,
no reference build, no human looking at a picture — so it can say whether B is *better* or
*worse* than A.

## The rule that governs everything here

> If model A has more naked edges than model B, but in A **all objects had geometry** while
> in B **not all objects did**, then A is probably better — because B didn't generate the
> problematic geometry at all.

**Silence is not success.** A build that crashes on a hard boolean and emits nothing scores a
perfect zero on "bad triangles". That is a regression, not a win.

So metrics are not one scalar. They form a **dominance order**, and build B beats build A only
if it does not regress a *higher* tier:

| Tier | Name | Question |
|---|---|---|
| 1 | **Coverage** | Did geometry get produced at all, for everything that should have it? |
| 2 | **Hard invalidity** | NaN/Inf, inverted volume, zero-area everything |
| 3 | **Topological integrity** | Naked edges, non-manifold edges, bad winding, shattering |
| 4 | **Metric fidelity** | Does the mesh agree with what the IFC file itself asserts? |

A tier-3 improvement never masks a tier-1 loss.

## What's implemented (Phase 1)

`src/validate.cpp` → `webifc_validate <model.ifc> [out.json]`

| ID | Validator | Tier |
|---|---|---|
| V7 | NaN/Inf sweep over vertex positions | 2 |
| V13 | Naked (boundary) edges → watertightness | 3 |
| V14 | Winding consistency + signed volume sign | 3 |
| V15 | Non-manifold edges, duplicate & degenerate triangles | 3 |
| — | Connected-component count (boolean shattering) | 3 |
| — | Triangles with >1 naked edge (dangling slivers) | 3 |

Each validator was selected because it would have caught **real, historical web-ifc bugs** —
not because it sounded good in theory. The full derivation (which of the 540 resolved issues
each check maps to) lives in the knowledge base at `workflows/model-validation.md`.

Checks that the issue corpus did **not** justify were dropped, notably Euler characteristic /
genus — it is subsumed by naked-edge count plus component count, and caught nothing in 540 real
bugs that those two don't already catch.

## Two implementation facts that are easy to get wrong

Both were verified against the v0.0.78 source, not assumed:

**1. web-ifc geometry has unshared vertices.** `Geometry::AddFace(dvec3,dvec3,dvec3)` calls
`AddPoint()` three times (`bim-geometry/geometry.cpp:80-82`), so every triangle owns three fresh
vertices and `indexData` is effectively `0,1,2,3,4,5...`. **Computing edge adjacency on the raw
indices would report every single edge as naked.** The validator welds vertices by position
first. This is the single most important detail in the implementation.

**2. Positions are double natively.** `bimGeometry::Geometry` holds both `fvertexData` (float32
— what `GetVertexData()` hands to WASM) and `vertexData` (float64 — what `GetPoint()` returns).
Linking natively we read the doubles, so the float32 epsilon floor (`1e-4`) that constrains the
WASM-facing path does not apply here.

**Tolerances are scale-relative, never absolute.** The weld epsilon and the degenerate-area
threshold both derive from the element's own bounding-box diagonal. An absolute epsilon is
precisely the bug behind issues #751, #1014 and #1665 (a 5 mm sphere collapses while a 10 mm one
survives; a half-space distance hardcoded to `1` means one metre in a millimetre model). A
validator that repeated that mistake would invent naked edges in small elements.

## Build

```bash
cmake -S src/cpp -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --target webifc_validate -j
```

## Run

```bash
./build/webifc_validate model.ifc report.json [commit-label]
```

## Comparing two builds — what this is actually for

```bash
# build the validator against each kernel, holding validate.cpp identical
./build_before/webifc_validate model.ifc before.json "abc123 (before)"
./build_after/webifc_validate  model.ifc after.json  "def456 (after)"
python3 driver/compare.py before.json after.json
```

`compare.py` exits 0 on improvement/neutral, 1 on mixed-needing-review, 2 on regression.

**Hold the validator constant.** Only the kernel may vary between the two builds. If
`validate.cpp` differs across the two sides you are measuring your own instrument, not
the change.

### The API window (a real constraint, learned the hard way)

The validator links against the kernel, so **it can only compare commits that share the
kernel's API**. Concretely: anything before `353c231f "Seperate Cache from Loader"` has
no `IfcCache`, and `IfcGeometryProcessor` takes a different constructor — the validator
does not compile there at all.

So an A/B across that boundary needs a compatibility shim, or a validator pinned to each
era's API. Reaching for an older "known fix" to test against and finding it does not
build is the expected outcome, not a surprise.

## Not yet implemented

- **V1 (coverage)** — the headline tier-1 validator. It is blocked on an `expectedGeometry`
  classifier, which is the harder half: "has a Representation" is **not** the right predicate.
  `IfcOpeningElement` correctly produces no standalone mesh (it is consumed by the boolean);
  `IfcSpace` / `IfcAnnotation` / `IfcGrid` are often intentionally empty; an element whose
  representation carries only `Axis`/`FootPrint`/`Box` subcontexts and no `Body` has nothing to
  mesh by design. Ship V1 on a naive predicate and the per-type coverage table — the first thing
  the report prints — becomes noise.
- **V4** — silent boolean no-op (result ≡ first operand; ~10% of all boolean issues).
- **V5** — per-call, not per-model, non-termination watchdog.
- **V9** — scale-invariance metamorphic test (rescale ×k, assert volume ∝ k³, topology
  invariant). Needs no oracle at all.
- **V18/V19** — metric fidelity against IFC-authored parameters and the placement chain.

The QTO oracle (comparing mesh volume against authored `IfcElementQuantity`) is deliberately
**not** shipped as a validator. It is an appealing idea, but zero of the 540 resolved issues
confirm that variant, and its false-positive rate against real files is unmeasured — unit
mismatch (mm vs m ⇒ 1e9 error on volume) and gross-vs-net authoring disagreement would likely
swamp the signal. It is queued as an *experiment* with a measured FP rate, not an assumption.

## Corpus quality harness (better/worse across all models)

`regression.mjs` hashes each model's geometry and reports PASS/FAIL — it tells you a model
**differs**, never whether it got **better or worse**. The quality harness answers the second
question over the *same* corpus (`tests/ifcfiles/public` + `private`).

- `quality.mjs` runs the intrinsic validator (`src/validate.mjs`, the WASM port of
  `validate.cpp`) on every model, as an isolated subprocess per model so a kernel abort/hang
  is recorded (crash / TIMEOUT) instead of killing the run. It writes a per-model snapshot.
- `driver/quality-compare.py` diffs two snapshots with the **dominance rule** (tier 1 coverage
  > 2 invalidity > 3 topology > 4 fidelity), per model and globally. A tier-1 loss on any model
  can never be washed out by tier-3 gains elsewhere.

```bash
# snapshot the current build (defaults: dist/web-ifc-api-node.js over tests/ifcfiles)
npm run quality                       # -> tests/regression/quality-current.json
cp tests/regression/quality-current.json baseline.json
# ...make a C++ change, rebuild dist (npm run build-release), then:
npm run quality
python tests/regression/driver/quality-compare.py baseline.json tests/regression/quality-current.json
```

`quality.mjs` also accepts explicit args — `node quality.mjs <web-ifc-module> <corpusRoot> <out.json> <label>`
— so a snapshot can be taken against any prebuilt release (`npm i web-ifc@X`) with **zero
compilation**, for released-version A/Bs.

**Tier-2 refinement.** An inverted-volume element that was *open* in the baseline and only
became watertight now is the *visibility* of improved topology, not a fresh regression. The
comparator uses per-element IDs to separate a genuine "was a valid closed solid, now inward"
flip (real tier-2 loss) from "newly watertight and inward" (surfaced for review, not counted
as tier-2).
