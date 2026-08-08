# webifc (native Python bindings)

Cython bindings over the web-ifc C++ core — no WASM, no Node, no 2GiB/4GiB
limits. Files stream from disk with bounded memory (chunk eviction), geometry
comes out as double-precision numpy arrays, and IfcSpace/IfcOpeningElement are
first-class citizens.

```python
import webifc

with webifc.open("model.ifc") as model:
    print(model.schema)
    for mesh, geometries in model.iter_meshes():
        for placed in mesh.geometries:
            geom = geometries[placed.geometry_express_id]
            # world = (placed.transformation @ [x, y, z, 1])[:3]
```

## Build

```
cd python
uv venv && uv pip install -e . --no-build-isolation  # needs cython, scikit-build-core, numpy
# or: pip install .
```

First configure needs network access (CMake FetchContent pulls the pinned
header-only deps of the core).

## API shape

`get_line` returns the same `{"ID", "type", "arguments"}` structure as the
web-ifc JS API, with `{"type": token, "value": ...}` wrappers, so pipelines can
migrate from the Node/WASM stack with minimal changes. Divergences: REAL values
are Python floats (not strings), and geometry iteration never excludes types —
pass `exclude_types=("IFCSPACE", "IFCOPENINGELEMENT", "IFCOPENINGSTANDARDCASE")`
to reproduce upstream viewer behaviour.
