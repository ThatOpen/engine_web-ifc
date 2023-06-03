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
    IFCAXIS2PLACEMENT3D
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

export interface Axis2Placement3D {
    location: number;
    axis: number;
    refDirection: number;
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
            const line = api.CreateIfcEntity(modelId, IFCGEOMETRICREPRESENTATIONCONTEXT,
                null,
                {type: STRING, value: ctx.contextType},
                {type: REAL, value: ctx.coordinateSpaceDimension || 3},
                {type: REAL, value: ctx.precision || 1e-6},
                ctx.worldCoordinateSystem ? {type: REF, value: ctx.worldCoordinateSystem} : null,
                ctx.trueNorth ? {type: REF, value: ctx.trueNorth} : null,
            );
            contextLines.push(line);
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
            const line = api.CreateIfcEntity(modelId, IFCCARTESIANPOINT, _points);
            pointLines.push(line);
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
            const line = api.CreateIfcEntity(modelId, IFCDIRECTION, _direction);
            directionLines.push(line);
        });
        return api.WriteLine(modelId, directionLines);
    }

    AddAxis2Placement3D(modelId: number, axis2Placement3D: Axis2Placement3D | Axis2Placement3D[]) {
        const api = this.api;
        if (!Array.isArray(axis2Placement3D)) axis2Placement3D = [axis2Placement3D];
        const axis2Placement3DLines: IfcLineObject[] = [];

        axis2Placement3D.forEach((axis) => {
            const line = api.CreateIfcEntity(modelId, IFCAXIS2PLACEMENT3D, [
                {type: REF, value: axis.location},
                {type: REF, value: axis.axis},
                {type: REF, value: axis.refDirection},
            ]);
            axis2Placement3DLines.push(line);
        });

        return api.WriteLine(modelId, axis2Placement3DLines);
    }
}