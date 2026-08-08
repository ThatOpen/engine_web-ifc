"""Geometry regression: real buffer hashing (what regression.mjs never did),
count parity with the committed wasm benchmark, and placement consistency."""

import hashlib

import numpy as np
import pytest

import webifc
from conftest import BENCHMARK_BASELINES, UPSTREAM_EXCLUDED, fixture_path


def _mesh_counts(model, exclude=()):
    meshes = 0
    geometry_ids = set()
    for mesh, geoms in model.iter_meshes(exclude_types=exclude):
        meshes += 1
        geometry_ids.update(geoms)
    return meshes, len(geometry_ids)


def _model_digest(model):
    """Order-stable digest over every element's geometry buffers + transforms."""
    h = hashlib.sha256()
    for mesh, geoms in model.iter_meshes():
        h.update(np.uint32(mesh.express_id).tobytes())
        for placed in mesh.geometries:
            h.update(np.uint32(placed.geometry_express_id).tobytes())
            h.update(np.round(placed.transformation, 9).tobytes())
            g = geoms[placed.geometry_express_id]
            h.update(np.round(g.vertices, 9).tobytes())
            h.update(g.indices.tobytes())
    return h.hexdigest()


@pytest.mark.parametrize("name", ["AC20-FZK-Haus.ifc", "duplex.ifc", "example.ifc", "schependomlaan.ifc"])
def test_mesh_count_parity_with_wasm_baseline(name):
    """In upstream-exclusion mode our native mesh and entity counts must equal
    the committed benchmark.md numbers produced by the wasm build."""
    expected = BENCHMARK_BASELINES[name]
    with webifc.open(fixture_path(name)) as m:
        assert len(m.all_ids()) == expected["entities"]
        meshes, _ = _mesh_counts(m, exclude=UPSTREAM_EXCLUDED)
        assert meshes == expected["meshes"]


# Golden digest over duplex.ifc geometry (transforms + float64 buffers).
# Regenerate deliberately (print _model_digest) when output legitimately changes.
DUPLEX_GOLDEN_DIGEST = "b047b89bcdff1878b181938e5e25ea6de497dd09ef13d331c82c9a9c46a6bd8a"


def test_geometry_hash_matches_golden():
    """Real numeric regression: parsing duplex must reproduce the pinned digest
    bit-for-bit (this is the check regression.mjs only pretended to do)."""
    with webifc.open(fixture_path("duplex.ifc")) as a:
        meshes = sum(1 for _ in a.iter_meshes())
        assert meshes > 200  # digest over an empty walk must not pass
        assert _model_digest(a) == DUPLEX_GOLDEN_DIGEST


def test_cache_stays_raw_and_repeat_reads_identical():
    """#1462 regression guard: flat-mesh emission must not mutate the cached
    geometry. Two reads of the same id are bit-identical, and cached local
    frames are NOT origin-centered (the old code normalized them in place)."""
    import numpy as np
    with webifc.open(fixture_path("AC20-FZK-Haus.ifc")) as m:
        oid = int(m.ids_of_type("IFCOPENINGELEMENT")[0])
        mesh1 = m.flat_mesh(oid)
        gid = mesh1.geometries[0].geometry_express_id
        first = m.geometry(gid)
        mesh2 = m.flat_mesh(oid)
        second = m.geometry(gid)
        assert first.vertices.tobytes() == second.vertices.tobytes()
        assert first.indices.tobytes() == second.indices.tobytes()
        # if per-mesh normalization returned, every local bbox center would be ~0
        centers = []
        for _, geoms in m.iter_meshes(types=["IFCWALLSTANDARDCASE", "IFCSLAB"]):
            for g in geoms.values():
                if len(g.vertices):
                    lo = g.vertices[:, :3].min(axis=0)
                    hi = g.vertices[:, :3].max(axis=0)
                    centers.append(np.linalg.norm((lo + hi) / 2))
        assert centers and max(centers) > 0.5, "cached local frames look normalized"


def test_geometry_buffers_well_formed(fzk_model):
    mesh, geoms = next(iter(fzk_model.iter_meshes(types=["IFCSLAB"])))
    for g in geoms.values():
        assert g.vertices.dtype == np.float64 and g.vertices.shape[1] == 6
        assert g.indices.dtype == np.uint32 and len(g.indices) % 3 == 0
        assert g.indices.max() < len(g.vertices)
        assert np.isfinite(g.vertices).all()


def test_flat_mesh_order_independence():
    """Placement must not depend on element processing order (#1462 class).

    Openings requested on a fresh model must land exactly where they land
    after all regular elements were processed first.
    """
    path = fixture_path("AC20-FZK-Haus.ifc")

    def opening_boxes(model, warmup):
        if warmup:
            for _ in model.iter_meshes(exclude_types=UPSTREAM_EXCLUDED, clear_per_element=False):
                pass
        boxes = {}
        for oid in model.ids_of_type("IFCOPENINGELEMENT"):
            mesh = model.flat_mesh(int(oid))
            pts = []
            for placed in mesh.geometries:
                g = model.geometry(placed.geometry_express_id)
                if len(g.vertices) == 0:
                    continue
                hom = np.column_stack([g.vertices[:, :3], np.ones(len(g.vertices))])
                world = (placed.transformation @ hom.T).T[:, :3]
                pts.append(world)
            if pts:
                allpts = np.vstack(pts)
                boxes[int(oid)] = (allpts.min(axis=0), allpts.max(axis=0))
        return boxes

    with webifc.open(path) as fresh:
        fresh_boxes = opening_boxes(fresh, warmup=False)
    with webifc.open(path) as warm:
        warm_boxes = opening_boxes(warm, warmup=True)

    assert fresh_boxes.keys() == warm_boxes.keys() and fresh_boxes
    for oid in fresh_boxes:
        np.testing.assert_allclose(fresh_boxes[oid][0], warm_boxes[oid][0], atol=1e-9)
        np.testing.assert_allclose(fresh_boxes[oid][1], warm_boxes[oid][1], atol=1e-9)


def test_openings_overlap_their_hosts(fzk_model, session):
    """Every IfcRelVoidsElement opening must intersect its host's AABB."""
    rel_ids = fzk_model.ids_of_type("IFCRELVOIDSELEMENT")
    assert len(rel_ids) == 17
    pairs = []
    for rid in rel_ids:
        args = fzk_model.get_line(int(rid))["arguments"]
        pairs.append((args[4]["value"], args[5]["value"]))  # host, opening

    def world_box(model, eid):
        mesh = model.flat_mesh(int(eid))
        pts = []
        for placed in mesh.geometries:
            g = model.geometry(placed.geometry_express_id)
            if len(g.vertices):
                hom = np.column_stack([g.vertices[:, :3], np.ones(len(g.vertices))])
                pts.append((placed.transformation @ hom.T).T[:, :3])
        if not pts:
            return None
        allpts = np.vstack(pts)
        return allpts.min(axis=0), allpts.max(axis=0)

    checked = 0
    for host, opening in pairs:
        hb, ob = world_box(fzk_model, host), world_box(fzk_model, opening)
        if hb is None or ob is None:
            continue
        tol = 0.5
        assert (ob[0] <= hb[1] + tol).all() and (ob[1] >= hb[0] - tol).all(), (
            f"opening #{opening} does not overlap host #{host}"
        )
        checked += 1
    assert checked >= 15
