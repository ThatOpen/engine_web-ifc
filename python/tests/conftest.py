import pathlib

import pytest

import webifc

REPO_ROOT = pathlib.Path(__file__).resolve().parents[2]
FIXTURES = REPO_ROOT / "tests" / "ifcfiles" / "public"

# Types the upstream wasm layer hard-excludes; used to reproduce its counts.
UPSTREAM_EXCLUDED = ("IFCSPACE", "IFCOPENINGELEMENT", "IFCOPENINGSTANDARDCASE")

# entities / meshes / geometries from the committed benchmark.md (Apple M1
# baseline, produced by the wasm build with the exclusion in effect).
BENCHMARK_BASELINES = {
    "AC20-FZK-Haus.ifc": {"entities": 44249, "meshes": 83},
    "duplex.ifc": {"entities": 38898, "meshes": 215},
    "example.ifc": {"entities": 6490, "meshes": 115},
    "schependomlaan.ifc": {"entities": 714485, "meshes": 3569},
}


def fixture_path(name: str) -> pathlib.Path:
    p = FIXTURES / name
    if not p.exists():
        pytest.skip(f"fixture {name} not present")
    return p


@pytest.fixture(scope="session")
def session():
    return webifc.session()


@pytest.fixture()
def fzk_model():
    with webifc.open(fixture_path("AC20-FZK-Haus.ifc")) as m:
        yield m


@pytest.fixture()
def duplex_model():
    with webifc.open(fixture_path("duplex.ifc")) as m:
        yield m
