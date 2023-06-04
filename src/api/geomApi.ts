/** 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

import { 
    IfcAPI,
    REAL,
    STRING,
    REF,
    IfcLineObject
} from "../web-ifc-api";
import { 
    IFCGEOMETRICREPRESENTATIONCONTEXT,
    IFCCARTESIANPOINT,
    IFCDIRECTION,
    IFCAXIS2PLACEMENT3D,
    IFCLOCALPLACEMENT
} from "../ifc-schema";


export interface GeometricRepresentationContext {
    contextType: string;
    coordinateSpaceDimension?: number;
    precision?: number;
    worldCoordinateSystem: number;
    trueNorth: number;
}

export interface CartesianPoint {
    x: number;
    y: number;
    z?: number;
}

export interface Placement {
    location: number | CartesianPoint;
}

export interface Axis2Placement3D extends Placement {
    axis?: number | Direction;
    refDirection?: number | Direction; 
}

export interface LocalPlacement {
    relativePlacement: number | Axis2Placement3D;
    placementRelTo?: number | ObjectPlacement;
}

export interface ObjectPlacement {
    placesObject: number;
    referencedByPlacements: number[] | LocalPlacement[];
}

export interface ProductDefShape {
    name?: string;
    description?: string;
    representations: number[] | ShapeRepresentation[];
}

export interface ShapeRepresentation {
    contextOfItems: number | GeometricRepresentationContext;
    representationType?: string;
    representationId?: string;
    items: number[];
}


export interface Direction extends CartesianPoint {}

export class GeomApi {
    constructor(private api: IfcAPI) {}

    /**
     * Adds one or multiple IfcGeometricRepresentationContext to the model.
     * @param modelId model id
     * @param context context to add
     * @returns context ids
     * - context.contextType The type of the context. Can be one of the following:
     * - context.coordinateSpaceDimension The dimensionality of the coordinate space. Can be 2 or 3, default value is 3.
     * - context.precision The precision of the coordinates in the coordinate space, default value is 1e-6.
     * - context.worldCoordinateSystem a reference to IfcAxis2Placement3D defining the world coordinate system.
     * - context.trueNorth a reference to IfcDirection defining the direction of true north.
     * @see interface GeometricRepresentationContext
     */
    AddGeometricRepresentationContext(modelId: number, context: GeometricRepresentationContext | GeometricRepresentationContext[]) {
        const api = this.api;
        if (!Array.isArray(context)) context = [context];
        const contextLines: IfcLineObject[] = [];

        context.forEach((ctx) => {
            contextLines.push(api.CreateIfcEntity(modelId, IFCGEOMETRICREPRESENTATIONCONTEXT,
                null,
                {type: STRING, value: ctx.contextType},
                {type: REAL, value: ctx.coordinateSpaceDimension || 3},
                {type: REAL, value: ctx.precision || 1e-6},
                ctx.worldCoordinateSystem ? {type: REF, value: ctx.worldCoordinateSystem} : null,
                ctx.trueNorth ? {type: REF, value: ctx.trueNorth} : null,
            ));
        });

        return api.WriteLine(modelId, contextLines);
    }

    /**
     * Adds one or multiple IfcCartesianPoint to the model.
     * @param modelId model id
     * @param point point to add, can be one or multiple points
     * @returns point ids
     * @see interface CartesianPoint
     */
    AddCartesianPoint(modelId: number, point: CartesianPoint | CartesianPoint[]) {
        const api = this.api;
        if (!Array.isArray(point)) point = [point];
        const pointLines: IfcLineObject[] = [];

        point.forEach((pt) => {
            const _points = [ {type: REAL, value: pt.x}, {type: REAL, value: pt.y} ];
            if (pt.z !== undefined) _points.push({type: REAL, value: pt.z});
            pointLines.push(api.CreateIfcEntity(modelId, IFCCARTESIANPOINT, _points));
        });

        return api.WriteLine(modelId, pointLines);
    }

    /**
     * Adds one or multiple IfcDirection to the model.
     * @param modelId model id
     * @param direction direction to add, can be one or multiple directions
     * @returns direction ids
     * @see interface Direction
     */
    AddDirection(modelId: number, direction: Direction | Direction[]) {
        const api = this.api;
        if (!Array.isArray(direction)) direction = [direction];
        const directionLines: IfcLineObject[] = [];

        direction.forEach((dir) => {
            const _direction = [{type: REAL, value: dir.x}, {type: REAL, value: dir.y}];
            if (dir.z !== undefined) _direction.push({type: REAL, value: dir.z});
            directionLines.push(api.CreateIfcEntity(modelId, IFCDIRECTION, _direction));
        });
        return api.WriteLine(modelId, directionLines);
    }

    AddAxis2Placement3D(modelId: number, axis2Placement3D: Axis2Placement3D | Axis2Placement3D[]) {
        const api = this.api;
        if (!Array.isArray(axis2Placement3D)) axis2Placement3D = [axis2Placement3D];
        const axis2Placement3DLines: IfcLineObject[] = [];

        axis2Placement3D.forEach((axis) => {
            let axisLocId: number;
            let axisId: number | undefined;
            let refDirId: number | undefined;

            if(typeof axis.location !== 'number') {
                axisLocId = this.AddCartesianPoint(modelId, axis.location as CartesianPoint) as number;
            } else axisLocId = axis.location;
            if(axis.axis && typeof axis.axis !== 'number') {
                axisId = this.AddDirection(modelId, axis.axis) as number;
            } else axisId = axis.axis;
            if(axis.refDirection && typeof axis.refDirection !== 'number') {
                refDirId = this.AddDirection(modelId, axis.refDirection as Direction) as number;
            } else refDirId = axis.refDirection as number;

            axis2Placement3DLines.push(api.CreateIfcEntity(modelId, IFCAXIS2PLACEMENT3D,
                {type: REF, value: axisLocId},
                axisId ? {type: REF, value: axisId} : null,
                refDirId ? {type: REF, value: refDirId} : null,
            ));
        });

        return api.WriteLine(modelId, axis2Placement3DLines);
    }

    AddLocalPlacement(modelId: number, localPlacement: LocalPlacement | LocalPlacement[]) {
        const api = this.api;
        if (!Array.isArray(localPlacement)) localPlacement = [localPlacement];
        const localPlacementLines: IfcLineObject[] = [];

        localPlacement.forEach((local) => {
            let placementRelTo: number | undefined;
            let relativePlacement: number;
            if(local.placementRelTo && typeof local.placementRelTo !== 'number')
                placementRelTo = this.AddObjectPlacement(modelId, local.placementRelTo) as number;
            else placementRelTo = local.placementRelTo;
            if(typeof local.relativePlacement !== 'number')
                relativePlacement = this.AddAxis2Placement3D(modelId, local.relativePlacement) as number;
            else relativePlacement = local.relativePlacement;

            localPlacementLines.push(api.CreateIfcEntity(modelId, IFCLOCALPLACEMENT,
                placementRelTo ? {type: REF, value: placementRelTo} : null,
                {type: REF, value: relativePlacement},
            ));
        });

        return api.WriteLine(modelId, localPlacementLines);
    }

    AddObjectPlacement(modelId: number, objectPlacement: ObjectPlacement | ObjectPlacement[]) {
        const api = this.api;
        if (!Array.isArray(objectPlacement)) objectPlacement = [objectPlacement];
        const objectPlacementLines: IfcLineObject[] = [];

        objectPlacement.forEach((obj) => {
            let placesObjectId: number;
            let referencedByPlacements: number[] | undefined;

            if(typeof obj.placesObject !== 'number') {
                placesObjectId = this.AddObjectPlacement(modelId, obj.placesObject) as number;
            } else placesObjectId = obj.placesObject;
            if(obj.referencedByPlacements && typeof obj.referencedByPlacements[0] !== 'number') {
                referencedByPlacements = this.AddLocalPlacement(modelId, obj.referencedByPlacements as LocalPlacement[]) as number[];
            } else referencedByPlacements = obj.referencedByPlacements as number[];

            objectPlacementLines.push(api.CreateIfcEntity(modelId, IFCLOCALPLACEMENT,
                {type: REF, value: placesObjectId},
                referencedByPlacements ? referencedByPlacements.map((id) => ({type: REF, value: id})) : null,
            ));
        });

        return api.WriteLine(modelId, objectPlacementLines);
    }

    AddProductDefShape(modelId: number, productDefShapes: ProductDefShape | ProductDefShape[]) {
        const api = this.api;
        if (!Array.isArray(productDefShapes)) productDefShapes = [productDefShapes];
        const productDefShapeLines: IfcLineObject[] = [];

        productDefShapes.forEach((productDefShape) => {
            let representations: number[] | undefined;

            if(productDefShape.representations && typeof productDefShape.representations[0] !== 'number') {
                representations = this.AddShapeRepresentation(modelId, productDefShape.representations as ShapeRepresentation[]) as number[];
            } else representations = productDefShape.representations as number[];

            productDefShapeLines.push(api.CreateIfcEntity(modelId, IFCLOCALPLACEMENT,
                productDefShape.name ? {type: STRING, value: productDefShape.name} : null,
                productDefShape.description ? {type: STRING, value: productDefShape.description} : null,
                representations ? representations.map((id) => ({type: REF, value: id})) : null,
            ));
        });

        return api.WriteLine(modelId, productDefShapeLines);
    }

    AddShapeRepresentation(modelId: number, shapeRepresentations: ShapeRepresentation | ShapeRepresentation[]) {
        const api = this.api;
        if (!Array.isArray(shapeRepresentations)) shapeRepresentations = [shapeRepresentations];
        const shapeRepresentationLines: IfcLineObject[] = [];

        shapeRepresentations.forEach((shapeRepresentation) => {
            let contextOfItems: number;
            let items = shapeRepresentation.items;

            if(typeof shapeRepresentation.contextOfItems !== 'number') {
                contextOfItems = this.AddGeometricRepresentationContext(modelId, shapeRepresentation.contextOfItems as GeometricRepresentationContext) as number;
            } else contextOfItems = shapeRepresentation.contextOfItems;

            shapeRepresentationLines.push(api.CreateIfcEntity(modelId, IFCLOCALPLACEMENT,
                {type: REF, value: contextOfItems},
                shapeRepresentation.representationType ? {type: STRING, value: shapeRepresentation.representationType} : null,
                shapeRepresentation.representationId ? {type: STRING, value: shapeRepresentation.representationId} : null,
                items ? items.map((id) => ({type: REF, value: id})) : null,
            ));
        });
        
        return api.WriteLine(modelId, shapeRepresentationLines);
    }
}