# Surface-curve sweep fixtures

These are the hand-written IFC4 / IFC4X3 reproductions from
https://github.com/ThatOpen/engine_web-ifc/issues/2247. They differ only in the schema
and the plain versus typed encoding of StartParam/EndParam.

Both passed schema and EXPRESS where-rule validation in IfcOpenShell 0.8.5, which
produced 292 triangles, area 1.9247035599361784 m2 and volume 0.06282178090424108 m3
for each. The patched web-ifc produces identical geometry for the two encodings
(92 triangles with default settings). At CIRCLE_SEGMENTS=128, area and volume
differ from IfcOpenShell by less than 0.02%.

This fixture verifies parameter parsing and preservation of ReferenceSurface.
The known 90-degree profile-orientation difference and actual sweep-bound trimming
are outside this parser fix. Geometry equivalence to the existing IFC4 handler is
the regression contract; matching volume alone does not establish orientation.
