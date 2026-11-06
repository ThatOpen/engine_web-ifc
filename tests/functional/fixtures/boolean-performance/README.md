# Deep faceted differences

`deep-faceted-difference.ifc` is a sanitized, standalone reproducer for
[web-ifc #2366](https://github.com/ThatOpen/engine_web-ifc/issues/2366).
Product `#66150` has 53 nested differences with faceted BRep cutters over
extrusion `#2639585`. Identifying project data and placement were removed;
the operand geometry and millimetre units were retained.

The functional test runs synchronous WASM in a child process with a deadline.
It checks completion, finite geometry and enclosure by the original extrusion.
This stress fixture is **not a watertightness reference**: an independent exact
solid result is not available. The adjacent synthetic tests separately verify
analytic volume, surface area, translation invariance and closure for deep
faceted and mixed cutter chains.

Run with `npm test -- --runTestsByPath tests/functional/DeepFacetedDifference.spec.js`
after building the API and WASM, or set `WEB_IFC_API` to a matching Node API build.
