"""Save/reload round-trips and the >64KiB string policy (Goal 1 groundwork:
token lengths are uint32 on the tape now — long strings must survive intact)."""

import numpy as np

import webifc
from conftest import fixture_path


def test_save_and_reload(tmp_path):
    out = tmp_path / "roundtrip.ifc"
    with webifc.open(fixture_path("example.ifc")) as m:
        original_ids = m.all_ids()
        m.save(out)
    assert out.stat().st_size > 0
    with webifc.open(out) as m2:
        assert len(m2.all_ids()) == len(original_ids)
        assert m2.schema in ("IFC2X3", "IFC4", "IFC4X3", "IFC4X3_ADD2")


def test_long_string_attribute_survives(tmp_path):
    """A STEP string longer than 64KiB must come back intact (the old uint16
    token length silently truncated it)."""
    payload = "A" * 200_000  # > 2**16
    ifc = tmp_path / "longstring.ifc"
    ifc.write_text(
        "ISO-10303-21;\n"
        "HEADER;\n"
        "FILE_DESCRIPTION((''),'2;1');\n"
        "FILE_NAME('','',(''),(''),'','','');\n"
        "FILE_SCHEMA(('IFC4'));\n"
        "ENDSEC;\n"
        "DATA;\n"
        "#1=IFCPROJECT('3MD_HkJ6X2EwpfIbCFm0g_',$,'" + payload + "',$,$,$,$,$,$);\n"
        "ENDSEC;\n"
        "END-ISO-10303-21;\n"
    )
    with webifc.open(ifc) as m:
        line = m.get_line(1)
        name = line["arguments"][2]["value"]
        assert len(name) == 200_000
        assert name == payload


def test_long_string_roundtrip(tmp_path):
    payload = "B" * 100_000
    src = tmp_path / "long_src.ifc"
    src.write_text(
        "ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION((''),'2;1');\n"
        "FILE_NAME('','',(''),(''),'','','');\nFILE_SCHEMA(('IFC4'));\nENDSEC;\nDATA;\n"
        "#1=IFCPROJECT('3MD_HkJ6X2EwpfIbCFm0g_',$,'" + payload + "',$,$,$,$,$,$);\n"
        "ENDSEC;\nEND-ISO-10303-21;\n"
    )
    out = tmp_path / "long_out.ifc"
    with webifc.open(src) as m:
        m.save(out)
    with webifc.open(out) as m2:
        assert m2.get_line(1)["arguments"][2]["value"] == payload
