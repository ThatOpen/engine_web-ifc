# Fixed-reference sweep fixtures

The two IFC files are the hand-written minimal reproductions from
https://github.com/ThatOpen/engine_web-ifc/issues/2248. `cases.js` derives additional
valid encodings, placements, profiles and reference directions from them.

`ifcopenshell-reference.json` records world-space Z-up bounding boxes, surface area
and signed volume from IfcOpenShell 0.8.5, using `geom.create_shape` with default
settings and `use-world-coords=true`. All 13 variants passed schema and EXPRESS
where-rule validation with `ifcopenshell.validate.validate(..., express_rules=True)`.
web-ifc is compared with `CIRCLE_SEGMENTS=128`; bounding-box tolerance is 2 mm and
area/volume tolerance is 1% to accommodate different curve tessellations.

IfcOpenShell 0.8.5 cannot tessellate the closed-circle variant. That case uses the
analytic volume (profile area times the 2 m radius circle's circumference).
IfcOpenShell also returns the original orientation for reversed and tilted
FixedReference variants. Those cases use the IFC-defined projected local X axis
instead of treating that output as an orientation oracle:
https://standards.buildingsmart.org/IFC/DEV/IFC4_3/HTML/lexical/IfcFixedReferenceSweptAreaSolid.html

The tests also require finite, non-degenerate triangles, outward winding and two
faces per welded edge. StartParam/EndParam trimming remains the existing handler
behavior; these cases use an already-trimmed directrix or its complete range.
