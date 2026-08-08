"""Fast chunk-eviction coverage: a tiny tape and memory limit force constant
eviction and istream re-seeks after EOF — the exact path behind the
failbit/reload bug class, in under a second."""

import webifc
from conftest import fixture_path


def test_eviction_roundtrip_small_limits():
    # ~2.7MB tape in 64KiB chunks with only 2 resident: dozens of evictions,
    # every get_line below hits a reload
    with webifc.open(fixture_path("AC20-FZK-Haus.ifc"), tape_size=65536, memory_limit=131072) as m:
        last = m.max_express_id
        first_line = m.get_line(1)
        assert first_line["arguments"] is not None
        # far end of the tape, then back to the start (forces re-seek past EOF)
        assert m.get_line(last if m.is_valid_id(last) else int(m.all_ids()[-1]))
        again = m.get_line(1)
        assert again == first_line
        # geometry still generates correctly under eviction pressure
        spaces = m.ids_of_type("IFCSPACE")
        mesh = m.flat_mesh(int(spaces[0]))
        assert mesh.geometries
