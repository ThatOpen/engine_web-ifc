"""Entity access and marshalling shapes (parity with the web-ifc JS API)."""

import pytest

import webifc
from conftest import BENCHMARK_BASELINES, fixture_path


def test_schema_detection(fzk_model):
    # AC20-FZK-Haus declares FILE_SCHEMA(('IFC4')); the old GetSchema walker
    # returned IFC2X3 for every file (fixed in this fork)
    assert fzk_model.schema == "IFC4"


def test_entity_count_matches_benchmark_baseline():
    for name, expected in BENCHMARK_BASELINES.items():
        if name == "schependomlaan.ifc":
            continue  # asserted inside the geometry parity test for that file
        with webifc.open(fixture_path(name)) as m:
            assert len(m.all_ids()) == expected["entities"], name


def test_get_line_shape(fzk_model, session):
    spaces = fzk_model.ids_of_type("IFCSPACE")
    assert len(spaces) == 7
    line = fzk_model.get_line(int(spaces[0]))
    assert set(line) == {"ID", "type", "arguments"}
    assert line["ID"] == spaces[0]
    assert session.type_name(line["type"]) == "IfcSpace"
    args = line["arguments"]
    # IfcSpace: GlobalId, OwnerHistory, Name, ...
    assert args[0]["type"] == webifc.STRING and isinstance(args[0]["value"], str)
    assert args[1]["type"] == webifc.REF and isinstance(args[1]["value"], int)


def test_real_values_are_floats(fzk_model):
    # IfcCartesianPoint coordinates arrive as Python floats, not strings.
    pts = fzk_model.ids_of_type("IFCCARTESIANPOINT")
    line = fzk_model.get_line(int(pts[0]))
    coords = line["arguments"][0]
    assert isinstance(coords, list) and len(coords) >= 2
    assert all(isinstance(c["value"], float) for c in coords)


def test_header_line(fzk_model):
    hdr = fzk_model.get_header_line("FILE_NAME")
    assert hdr is not None and hdr["type"] == "FILE_NAME"


def test_invalid_id_raises(fzk_model):
    with pytest.raises(webifc.WebIfcError):
        fzk_model.get_line(99999999)


def test_closed_model_raises():
    m = webifc.open(fixture_path("example.ifc"))
    m.close()
    with pytest.raises(webifc.WebIfcError):
        m.all_ids()


def test_type_name_roundtrip(session):
    code = session.type_code("IFCOPENINGELEMENT")
    assert session.type_name(code) == "IfcOpeningElement"
    assert session.is_ifc_element(code)
