"""webifc — native (non-WASM) Python bindings for the web-ifc IFC engine.

Typical use:

    import webifc

    with webifc.open("model.ifc") as model:
        print(model.schema, model.max_express_id)
        walls = model.ids_of_type("IFCWALL")
        line = model.get_line(int(walls[0]))
        for mesh, geometries in model.iter_meshes():
            ...  # mesh.geometries[i].transformation @ homogeneous vertices

Unlike the web-ifc WASM API, nothing is excluded from geometry iteration:
IfcSpace and IfcOpeningElement stream like every other element. Files are
parsed natively from disk with bounded memory, with no 2GiB/4GiB limits.
"""

from ._webifc import (
    ModelSession,
    Model,
    FlatMesh,
    PlacedGeometry,
    Geometry,
    WebIfcError,
    UNKNOWN,
    STRING,
    LABEL,
    ENUM,
    REAL,
    REF,
    EMPTY,
    SET_BEGIN,
    SET_END,
    LINE_END,
    INTEGER,
)

__all__ = [
    "ModelSession",
    "Model",
    "FlatMesh",
    "PlacedGeometry",
    "Geometry",
    "WebIfcError",
    "open",
    "session",
    "UNKNOWN",
    "STRING",
    "LABEL",
    "ENUM",
    "REAL",
    "REF",
    "EMPTY",
    "SET_BEGIN",
    "SET_END",
    "LINE_END",
    "INTEGER",
]

_default_session = None


def session():
    """The process-default ModelSession (created on first use)."""
    global _default_session
    if _default_session is None:
        _default_session = ModelSession()
    return _default_session


def open(path, **settings):
    """Open an IFC file on the default session. See ModelSession.open."""
    return session().open(path, **settings)
