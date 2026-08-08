"""Goal 2: IfcSpace / IfcOpeningElement are first-class in the native API,
and emitting them does not disturb host-element geometry (hole subtraction)."""

import numpy as np

import webifc
from conftest import UPSTREAM_EXCLUDED, fixture_path


def test_spaces_and_openings_included_by_default(fzk_model, session):
    space_code = session.type_code("IFCSPACE")
    opening_code = session.type_code("IFCOPENINGELEMENT")
    seen = {space_code: 0, opening_code: 0}
    total = 0
    for mesh, _ in fzk_model.iter_meshes():
        total += 1
        t = fzk_model.line_type(mesh.express_id)
        if t in seen:
            seen[t] += 1
    assert seen[space_code] == 7
    assert seen[opening_code] == 17
    assert total == 107


def test_exclude_types_reproduces_upstream_behaviour(fzk_model):
    ids = [m.express_id for m, _ in fzk_model.iter_meshes(exclude_types=UPSTREAM_EXCLUDED)]
    assert len(ids) == 83  # benchmark.md baseline for the wasm build
    space_ids = set(int(i) for i in fzk_model.ids_of_type("IFCSPACE"))
    assert not (set(ids) & space_ids)


def test_emitting_openings_does_not_change_host_geometry():
    """Hole subtraction is relVoids-driven, independent of what is emitted:
    a voided wall's mesh must be bit-identical whether or not the openings
    were also requested."""
    path = fixture_path("AC20-FZK-Haus.ifc")

    def wall_buffers(include_openings):
        out = {}
        with webifc.open(path) as m:
            host_ids = sorted(
                {int(m.get_line(int(r))["arguments"][4]["value"]) for r in m.ids_of_type("IFCRELVOIDSELEMENT")}
            )
            if include_openings:
                for oid in m.ids_of_type("IFCOPENINGELEMENT"):
                    m.flat_mesh(int(oid))
            for hid in host_ids:
                mesh = m.flat_mesh(hid)
                bufs = []
                for placed in mesh.geometries:
                    g = m.geometry(placed.geometry_express_id)
                    bufs.append((g.vertices.tobytes(), g.indices.tobytes(), placed.transformation.tobytes()))
                out[hid] = bufs
        return out

    plain = wall_buffers(include_openings=False)
    with_openings = wall_buffers(include_openings=True)
    assert plain.keys() == with_openings.keys() and plain
    for hid in plain:
        assert plain[hid] == with_openings[hid], f"host #{hid} geometry changed when openings were emitted"


def test_spaces_have_geometry(fzk_model):
    for sid in fzk_model.ids_of_type("IFCSPACE"):
        mesh = fzk_model.flat_mesh(int(sid))
        assert mesh.geometries, f"space #{sid} produced no geometry"
        total_vertices = sum(
            len(fzk_model.geometry(p.geometry_express_id).vertices) for p in mesh.geometries
        )
        assert total_vertices > 0
