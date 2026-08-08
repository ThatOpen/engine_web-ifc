"""Goal 1 proof: parse a synthetic IFC whose token tape exceeds 4GiB, with a
memory limit far below the file size (bounded-RAM streaming + uint64 offsets).

Slow and disk-hungry (writes ~4.6GiB); run explicitly with:  pytest -m slow
"""

import os
import pathlib

import pytest

import webifc

pytestmark = pytest.mark.slow

TARGET_BYTES = 4_700_000_000  # comfortably past the 2^32 tape/file wall


def _generate_big_ifc(path: pathlib.Path) -> int:
    """Repeated IfcCartesianPoint + IfcPropertySingleValue lines with fat
    string payloads; returns the express ID of the LAST line, whose tape
    offset is guaranteed to exceed 2^32."""
    filler = "X" * 900
    with path.open("w") as f:
        f.write(
            "ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION((''),'2;1');\n"
            "FILE_NAME('','',(''),(''),'','','');\nFILE_SCHEMA(('IFC4'));\nENDSEC;\nDATA;\n"
        )
        eid = 0
        written = f.tell()
        chunk = []
        while written < TARGET_BYTES:
            for _ in range(2000):
                eid += 1
                chunk.append(f"#{eid}=IFCPROPERTYSINGLEVALUE('P{eid}','{filler}',$,$);\n")
            block = "".join(chunk)
            f.write(block)
            written += len(block)
            chunk.clear()
        eid += 1
        f.write(f"#{eid}=IFCCARTESIANPOINT((1.5,2.5,3.5));\n")
        f.write("ENDSEC;\nEND-ISO-10303-21;\n")
    return eid


def test_parse_beyond_4gib(tmp_path_factory):
    import shutil

    big_dir = os.environ.get("WEBIFC_BIG_FILE_DIR")
    base = pathlib.Path(big_dir) if big_dir else tmp_path_factory.mktemp("bigifc")
    if shutil.disk_usage(base).free < 6_000_000_000:
        pytest.skip("needs ~6GiB free disk")
    path = base / "big.ifc"
    try:
        last_id = _generate_big_ifc(path)
        assert path.stat().st_size > 4_294_967_296

        # 1 GiB resident tape forces chunk eviction + re-tokenization via >4GiB
        # file seeks; the last line's tape offset exceeds 2^32.
        with webifc.open(path, memory_limit=1_073_741_824) as m:
            assert m.tape_size > 4_294_967_296, "token tape must exceed the old uint32 wall"
            assert m.max_express_id == last_id
            line = m.get_line(last_id)
            coords = [c["value"] for c in line["arguments"][0]]
            assert coords == [1.5, 2.5, 3.5]
            # random-access far-apart lines to force eviction round-trips
            mid = last_id // 2
            assert m.get_line(mid)["arguments"][0]["value"] == f"P{mid}"
            assert m.get_line(1)["arguments"][0]["value"] == "P1"
    finally:
        path.unlink(missing_ok=True)
