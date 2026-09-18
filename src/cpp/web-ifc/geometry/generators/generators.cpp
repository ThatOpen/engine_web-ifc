#include "generators.h"
namespace webifc::geometry::generators {
void GenerateIfcStyledItem(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcStyledItemImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcTopologicalRepresentationItem(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCVERTEX:
				return GenerateIfcVertex(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCONNECTEDFACESET:
				return GenerateIfcConnectedFaceSet(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCEDGE:
				return GenerateIfcEdge(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCFACE:
				return GenerateIfcFace(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCFACEBOUND:
				return GenerateIfcFaceBound(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCLOOP:
				return GenerateIfcLoop(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCPATH:
				return GenerateIfcPath(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcVertex(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCVERTEXPOINT:
				return GenerateIfcVertexPoint(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcVertex(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcVertexPoint(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcVertexPointImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcConnectedFaceSet(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCOPENSHELL:
				return GenerateIfcOpenShell(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCLOSEDSHELL:
				return GenerateIfcClosedShell(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcConnectedFaceSet(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcOpenShell(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcOpenShellImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcClosedShell(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcClosedShellImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcEdge(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCEDGECURVE:
				return GenerateIfcEdgeCurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCORIENTEDEDGE:
				return GenerateIfcOrientedEdge(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSUBEDGE:
				return GenerateIfcSubedge(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcEdge(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcEdgeCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcEdgeCurveImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcOrientedEdge(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcOrientedEdgeImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSubedge(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSubedgeImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcFace(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCFACESURFACE:
				return GenerateIfcFaceSurface(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcFace(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcFaceSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCADVANCEDFACE:
				return GenerateIfcAdvancedFace(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcFaceSurface(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcAdvancedFace(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcAdvancedFaceImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcFaceBound(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCFACEOUTERBOUND:
				return GenerateIfcFaceOuterBound(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcFaceBound(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcFaceOuterBound(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcFaceOuterBoundImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcLoop(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCPOLYLOOP:
				return GenerateIfcPolyLoop(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCVERTEXLOOP:
				return GenerateIfcVertexLoop(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCEDGELOOP:
				return GenerateIfcEdgeLoop(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcLoop(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcPolyLoop(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcPolyLoopImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcVertexLoop(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcVertexLoopImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcEdgeLoop(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcEdgeLoopImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcPath(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcPathImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcGeometricRepresentationItem(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCGEOMETRICSET:
				return GenerateIfcGeometricSet(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCHALFSPACESOLID:
				return GenerateIfcHalfSpaceSolid(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCLIGHTSOURCE:
				return GenerateIfcLightSource(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCPLACEMENT:
				return GenerateIfcPlacement(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCPLANAREXTENT:
				return GenerateIfcPlanarExtent(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCPOINT:
				return GenerateIfcPoint(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSECTIONEDSPINE:
				return GenerateIfcSectionedSpine(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSEGMENT:
				return GenerateIfcSegment(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSHELLBASEDSURFACEMODEL:
				return GenerateIfcShellBasedSurfaceModel(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSOLIDMODEL:
				return GenerateIfcSolidModel(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSURFACE:
				return GenerateIfcSurface(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCTESSELLATEDITEM:
				return GenerateIfcTessellatedItem(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCTEXTLITERAL:
				return GenerateIfcTextLiteral(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCVECTOR:
				return GenerateIfcVector(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCANNOTATIONFILLAREA:
				return GenerateIfcAnnotationFillArea(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCBOOLEANRESULT:
				return GenerateIfcBooleanResult(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCBOUNDINGBOX:
				return GenerateIfcBoundingBox(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCARTESIANPOINTLIST:
				return GenerateIfcCartesianPointList(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCARTESIANTRANSFORMATIONOPERATOR:
				return GenerateIfcCartesianTransformationOperator(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCSGPRIMITIVE3D:
				return GenerateIfcCsgPrimitive3D(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCURVE:
				return GenerateIfcCurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCDIRECTION:
				return GenerateIfcDirection(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCFACEBASEDSURFACEMODEL:
				return GenerateIfcFaceBasedSurfaceModel(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCFILLAREASTYLEHATCHING:
				return GenerateIfcFillAreaStyleHatching(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCFILLAREASTYLETILES:
				return GenerateIfcFillAreaStyleTiles(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcGeometricSet(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCGEOMETRICCURVESET:
				return GenerateIfcGeometricCurveSet(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcGeometricSet(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcGeometricCurveSet(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcGeometricCurveSetImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcHalfSpaceSolid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCPOLYGONALBOUNDEDHALFSPACE:
				return GenerateIfcPolygonalBoundedHalfSpace(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCBOXEDHALFSPACE:
				return GenerateIfcBoxedHalfSpace(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcHalfSpaceSolid(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcPolygonalBoundedHalfSpace(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcPolygonalBoundedHalfSpaceImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcBoxedHalfSpace(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcBoxedHalfSpaceImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcLightSource(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCLIGHTSOURCEAMBIENT:
				return GenerateIfcLightSourceAmbient(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCLIGHTSOURCEDIRECTIONAL:
				return GenerateIfcLightSourceDirectional(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCLIGHTSOURCEGONIOMETRIC:
				return GenerateIfcLightSourceGoniometric(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCLIGHTSOURCEPOSITIONAL:
				return GenerateIfcLightSourcePositional(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcLightSourceAmbient(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcLightSourceAmbientImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcLightSourceDirectional(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcLightSourceDirectionalImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcLightSourceGoniometric(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcLightSourceGoniometricImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcLightSourcePositional(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCLIGHTSOURCESPOT:
				return GenerateIfcLightSourceSpot(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcLightSourcePositional(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcLightSourceSpot(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcLightSourceSpotImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcPlacement(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCAXIS1PLACEMENT:
				return GenerateIfcAxis1Placement(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCAXIS2PLACEMENT2D:
				return GenerateIfcAxis2Placement2D(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCAXIS2PLACEMENT3D:
				return GenerateIfcAxis2Placement3D(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCAXIS2PLACEMENTLINEAR:
				return GenerateIfcAxis2PlacementLinear(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcAxis1Placement(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcAxis1PlacementImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcAxis2Placement2D(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcAxis2Placement2DImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcAxis2Placement3D(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcAxis2Placement3DImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcAxis2PlacementLinear(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcAxis2PlacementLinearImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcPlanarExtent(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCPLANARBOX:
				return GenerateIfcPlanarBox(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcPlanarExtent(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcPlanarBox(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcPlanarBoxImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcPoint(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCPOINTBYDISTANCEEXPRESSION:
				return GenerateIfcPointByDistanceExpression(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCPOINTONCURVE:
				return GenerateIfcPointOnCurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCPOINTONSURFACE:
				return GenerateIfcPointOnSurface(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCARTESIANPOINT:
				return GenerateIfcCartesianPoint(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcPointByDistanceExpression(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcPointByDistanceExpressionImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcPointOnCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcPointOnCurveImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcPointOnSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcPointOnSurfaceImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCartesianPoint(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcCartesianPointImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSectionedSpine(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSectionedSpineImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSegment(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCCOMPOSITECURVESEGMENT:
				return GenerateIfcCompositeCurveSegment(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCURVESEGMENT:
				return GenerateIfcCurveSegment(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcCompositeCurveSegment(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCREPARAMETRISEDCOMPOSITECURVESEGMENT:
				return GenerateIfcReparametrisedCompositeCurveSegment(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcCompositeCurveSegment(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcReparametrisedCompositeCurveSegment(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcReparametrisedCompositeCurveSegmentImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCurveSegment(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcCurveSegmentImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcShellBasedSurfaceModel(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcShellBasedSurfaceModelImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSolidModel(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCSWEPTAREASOLID:
				return GenerateIfcSweptAreaSolid(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSWEPTDISKSOLID:
				return GenerateIfcSweptDiskSolid(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCSGSOLID:
				return GenerateIfcCsgSolid(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCMANIFOLDSOLIDBREP:
				return GenerateIfcManifoldSolidBrep(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSECTIONEDSOLID:
				return GenerateIfcSectionedSolid(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcSweptAreaSolid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCDIRECTRIXCURVESWEPTAREASOLID:
				return GenerateIfcDirectrixCurveSweptAreaSolid(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCEXTRUDEDAREASOLID:
				return GenerateIfcExtrudedAreaSolid(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCREVOLVEDAREASOLID:
				return GenerateIfcRevolvedAreaSolid(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcDirectrixCurveSweptAreaSolid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCFIXEDREFERENCESWEPTAREASOLID:
				return GenerateIfcFixedReferenceSweptAreaSolid(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSURFACECURVESWEPTAREASOLID:
				return GenerateIfcSurfaceCurveSweptAreaSolid(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcFixedReferenceSweptAreaSolid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCDIRECTRIXDERIVEDREFERENCESWEPTAREASOLID:
				return GenerateIfcDirectrixDerivedReferenceSweptAreaSolid(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcFixedReferenceSweptAreaSolid(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcDirectrixDerivedReferenceSweptAreaSolid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcDirectrixDerivedReferenceSweptAreaSolidImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSurfaceCurveSweptAreaSolid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSurfaceCurveSweptAreaSolidImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcExtrudedAreaSolid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCEXTRUDEDAREASOLIDTAPERED:
				return GenerateIfcExtrudedAreaSolidTapered(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcExtrudedAreaSolid(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcExtrudedAreaSolidTapered(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcExtrudedAreaSolidTaperedImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcRevolvedAreaSolid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCREVOLVEDAREASOLIDTAPERED:
				return GenerateIfcRevolvedAreaSolidTapered(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcRevolvedAreaSolid(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcRevolvedAreaSolidTapered(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcRevolvedAreaSolidTaperedImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSweptDiskSolid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCSWEPTDISKSOLIDPOLYGONAL:
				return GenerateIfcSweptDiskSolidPolygonal(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcSweptDiskSolid(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcSweptDiskSolidPolygonal(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSweptDiskSolidPolygonalImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCsgSolid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcCsgSolidImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcManifoldSolidBrep(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCADVANCEDBREP:
				return GenerateIfcAdvancedBrep(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCFACETEDBREP:
				return GenerateIfcFacetedBrep(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcAdvancedBrep(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCADVANCEDBREPWITHVOIDS:
				return GenerateIfcAdvancedBrepWithVoids(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcAdvancedBrep(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcAdvancedBrepWithVoids(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcAdvancedBrepWithVoidsImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcFacetedBrep(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCFACETEDBREPWITHVOIDS:
				return GenerateIfcFacetedBrepWithVoids(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcFacetedBrep(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcFacetedBrepWithVoids(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcFacetedBrepWithVoidsImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSectionedSolid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCSECTIONEDSOLIDHORIZONTAL:
				return GenerateIfcSectionedSolidHorizontal(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcSectionedSolidHorizontal(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSectionedSolidHorizontalImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCSWEPTSURFACE:
				return GenerateIfcSweptSurface(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCBOUNDEDSURFACE:
				return GenerateIfcBoundedSurface(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCELEMENTARYSURFACE:
				return GenerateIfcElementarySurface(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSECTIONEDSURFACE:
				return GenerateIfcSectionedSurface(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcSweptSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCSURFACEOFLINEAREXTRUSION:
				return GenerateIfcSurfaceOfLinearExtrusion(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSURFACEOFREVOLUTION:
				return GenerateIfcSurfaceOfRevolution(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcSurfaceOfLinearExtrusion(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSurfaceOfLinearExtrusionImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSurfaceOfRevolution(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSurfaceOfRevolutionImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcBoundedSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCCURVEBOUNDEDPLANE:
				return GenerateIfcCurveBoundedPlane(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCURVEBOUNDEDSURFACE:
				return GenerateIfcCurveBoundedSurface(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCRECTANGULARTRIMMEDSURFACE:
				return GenerateIfcRectangularTrimmedSurface(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCBSPLINESURFACE:
				return GenerateIfcBSplineSurface(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcCurveBoundedPlane(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcCurveBoundedPlaneImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCurveBoundedSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcCurveBoundedSurfaceImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcRectangularTrimmedSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcRectangularTrimmedSurfaceImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcBSplineSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCBSPLINESURFACEWITHKNOTS:
				return GenerateIfcBSplineSurfaceWithKnots(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcBSplineSurfaceWithKnots(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCRATIONALBSPLINESURFACEWITHKNOTS:
				return GenerateIfcRationalBSplineSurfaceWithKnots(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcBSplineSurfaceWithKnots(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcRationalBSplineSurfaceWithKnots(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcRationalBSplineSurfaceWithKnotsImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcElementarySurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCPLANE:
				return GenerateIfcPlane(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSPHERICALSURFACE:
				return GenerateIfcSphericalSurface(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCTOROIDALSURFACE:
				return GenerateIfcToroidalSurface(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCYLINDRICALSURFACE:
				return GenerateIfcCylindricalSurface(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcPlane(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcPlaneImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSphericalSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSphericalSurfaceImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcToroidalSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcToroidalSurfaceImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCylindricalSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcCylindricalSurfaceImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSectionedSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSectionedSurfaceImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcTessellatedItem(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCINDEXEDPOLYGONALFACE:
				return GenerateIfcIndexedPolygonalFace(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCTESSELLATEDFACESET:
				return GenerateIfcTessellatedFaceSet(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcIndexedPolygonalFace(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCINDEXEDPOLYGONALFACEWITHVOIDS:
				return GenerateIfcIndexedPolygonalFaceWithVoids(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcIndexedPolygonalFace(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcIndexedPolygonalFaceWithVoids(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcIndexedPolygonalFaceWithVoidsImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcTessellatedFaceSet(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCTRIANGULATEDFACESET:
				return GenerateIfcTriangulatedFaceSet(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCPOLYGONALFACESET:
				return GenerateIfcPolygonalFaceSet(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcTriangulatedFaceSet(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCTRIANGULATEDIRREGULARNETWORK:
				return GenerateIfcTriangulatedIrregularNetwork(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcTriangulatedFaceSet(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcTriangulatedIrregularNetwork(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcTriangulatedIrregularNetworkImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcPolygonalFaceSet(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcPolygonalFaceSetImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcTextLiteral(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCTEXTLITERALWITHEXTENT:
				return GenerateIfcTextLiteralWithExtent(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcTextLiteral(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcTextLiteralWithExtent(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcTextLiteralWithExtentImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcVector(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcVectorImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcAnnotationFillArea(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcAnnotationFillAreaImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcBooleanResult(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCBOOLEANCLIPPINGRESULT:
				return GenerateIfcBooleanClippingResult(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcBooleanResult(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcBooleanClippingResult(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcBooleanClippingResultImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcBoundingBox(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcBoundingBoxImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCartesianPointList(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCCARTESIANPOINTLIST2D:
				return GenerateIfcCartesianPointList2D(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCARTESIANPOINTLIST3D:
				return GenerateIfcCartesianPointList3D(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcCartesianPointList2D(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcCartesianPointList2DImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCartesianPointList3D(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcCartesianPointList3DImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCartesianTransformationOperator(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCCARTESIANTRANSFORMATIONOPERATOR2D:
				return GenerateIfcCartesianTransformationOperator2D(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCARTESIANTRANSFORMATIONOPERATOR3D:
				return GenerateIfcCartesianTransformationOperator3D(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcCartesianTransformationOperator2D(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCCARTESIANTRANSFORMATIONOPERATOR2DNONUNIFORM:
				return GenerateIfcCartesianTransformationOperator2DnonUniform(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcCartesianTransformationOperator2D(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcCartesianTransformationOperator2DnonUniform(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcCartesianTransformationOperator2DnonUniformImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCartesianTransformationOperator3D(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCCARTESIANTRANSFORMATIONOPERATOR3DNONUNIFORM:
				return GenerateIfcCartesianTransformationOperator3DnonUniform(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcCartesianTransformationOperator3D(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcCartesianTransformationOperator3DnonUniform(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcCartesianTransformationOperator3DnonUniformImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCsgPrimitive3D(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCRECTANGULARPYRAMID:
				return GenerateIfcRectangularPyramid(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCRIGHTCIRCULARCONE:
				return GenerateIfcRightCircularCone(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCRIGHTCIRCULARCYLINDER:
				return GenerateIfcRightCircularCylinder(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSPHERE:
				return GenerateIfcSphere(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCBLOCK:
				return GenerateIfcBlock(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcRectangularPyramid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcRectangularPyramidImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcRightCircularCone(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcRightCircularConeImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcRightCircularCylinder(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcRightCircularCylinderImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSphere(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSphereImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcBlock(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcBlockImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCLINE:
				return GenerateIfcLine(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCOFFSETCURVE:
				return GenerateIfcOffsetCurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCPCURVE:
				return GenerateIfcPcurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCPOLYNOMIALCURVE:
				return GenerateIfcPolynomialCurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSPIRAL:
				return GenerateIfcSpiral(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSURFACECURVE:
				return GenerateIfcSurfaceCurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCBOUNDEDCURVE:
				return GenerateIfcBoundedCurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCONIC:
				return GenerateIfcConic(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcLine(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcLineImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcOffsetCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCOFFSETCURVE2D:
				return GenerateIfcOffsetCurve2D(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCOFFSETCURVE3D:
				return GenerateIfcOffsetCurve3D(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCOFFSETCURVEBYDISTANCES:
				return GenerateIfcOffsetCurveByDistances(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcOffsetCurve2D(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcOffsetCurve2DImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcOffsetCurve3D(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcOffsetCurve3DImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcOffsetCurveByDistances(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcOffsetCurveByDistancesImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcPcurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcPcurveImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcPolynomialCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcPolynomialCurveImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSpiral(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCTHIRDORDERPOLYNOMIALSPIRAL:
				return GenerateIfcThirdOrderPolynomialSpiral(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCLOTHOID:
				return GenerateIfcClothoid(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCOSINESPIRAL:
				return GenerateIfcCosineSpiral(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSECONDORDERPOLYNOMIALSPIRAL:
				return GenerateIfcSecondOrderPolynomialSpiral(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSEVENTHORDERPOLYNOMIALSPIRAL:
				return GenerateIfcSeventhOrderPolynomialSpiral(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSINESPIRAL:
				return GenerateIfcSineSpiral(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcThirdOrderPolynomialSpiral(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcThirdOrderPolynomialSpiralImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcClothoid(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcClothoidImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCosineSpiral(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcCosineSpiralImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSecondOrderPolynomialSpiral(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSecondOrderPolynomialSpiralImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSeventhOrderPolynomialSpiral(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSeventhOrderPolynomialSpiralImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSineSpiral(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSineSpiralImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSurfaceCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCINTERSECTIONCURVE:
				return GenerateIfcIntersectionCurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSEAMCURVE:
				return GenerateIfcSeamCurve(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcSurfaceCurve(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcIntersectionCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcIntersectionCurveImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSeamCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSeamCurveImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcBoundedCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCCOMPOSITECURVE:
				return GenerateIfcCompositeCurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCINDEXEDPOLYCURVE:
				return GenerateIfcIndexedPolyCurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCPOLYLINE:
				return GenerateIfcPolyline(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCTRIMMEDCURVE:
				return GenerateIfcTrimmedCurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCBSPLINECURVE:
				return GenerateIfcBSplineCurve(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcCompositeCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCCOMPOSITECURVEONSURFACE:
				return GenerateIfcCompositeCurveOnSurface(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCGRADIENTCURVE:
				return GenerateIfcGradientCurve(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCSEGMENTEDREFERENCECURVE:
				return GenerateIfcSegmentedReferenceCurve(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcCompositeCurve(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcCompositeCurveOnSurface(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCBOUNDARYCURVE:
				return GenerateIfcBoundaryCurve(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcCompositeCurveOnSurface(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcBoundaryCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCOUTERBOUNDARYCURVE:
				return GenerateIfcOuterBoundaryCurve(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcBoundaryCurve(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcOuterBoundaryCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcOuterBoundaryCurveImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcGradientCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcGradientCurveImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcSegmentedReferenceCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcSegmentedReferenceCurveImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcIndexedPolyCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcIndexedPolyCurveImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcPolyline(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcPolylineImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcTrimmedCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcTrimmedCurveImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcBSplineCurve(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCBSPLINECURVEWITHKNOTS:
				return GenerateIfcBSplineCurveWithKnots(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcBSplineCurveWithKnots(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCRATIONALBSPLINECURVEWITHKNOTS:
				return GenerateIfcRationalBSplineCurveWithKnots(expressID,lineType,loader,cache);
				break;
			default:
				return GenerateIfcBSplineCurveWithKnots(expressID,lineType,loader,cache);
		}
	}
void GenerateIfcRationalBSplineCurveWithKnots(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcRationalBSplineCurveWithKnotsImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcConic(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		switch(lineType) {
			 case webifc::schema::IFCELLIPSE:
				return GenerateIfcEllipse(expressID,lineType,loader,cache);
				break;
			 case webifc::schema::IFCCIRCLE:
				return GenerateIfcCircle(expressID,lineType,loader,cache);
				break;
		}
	}
void GenerateIfcEllipse(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcEllipseImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcCircle(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcCircleImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcDirection(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcDirectionImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcFaceBasedSurfaceModel(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcFaceBasedSurfaceModelImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcFillAreaStyleHatching(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcFillAreaStyleHatchingImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcFillAreaStyleTiles(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcFillAreaStyleTilesImpl(expressID,lineType,loader,cache);
	}
void GenerateIfcMappedItem(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		return GenerateIfcMappedItemImpl(expressID,lineType,loader,cache);
	}
}
