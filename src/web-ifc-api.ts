/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { WebIFCWasm } from "./web-ifc";
import * as ifc2x4helper from "./ifc2x4_helper";

export const UNKNOWN = 0;
export const STRING = 1;
export const LABEL = 2;
export const ENUM = 3;
export const REAL = 4;
export const REF = 5;
export const EMPTY = 6;
export const SET_BEGIN = 7;
export const SET_END = 8;
export const LINE_END = 9;

export interface LoaderSettings
{
    COORDINATE_TO_ORIGIN: boolean;
    USE_FAST_BOOLS: boolean;
    CIRCLE_SEGMENTS_LOW?: number
    CIRCLE_SEGMENTS_MEDIUM?: number
    CIRCLE_SEGMENTS_HIGH?: number
    BOOL_ABORT_THRESHOLD?: number
}

export interface Vector<T> {
    get(index: number): T;
    size(): number;
}

export interface Color {
    x: number;
    y: number;
    z: number;
    w: number;
}

export interface PlacedGeometry {
    color: Color;
    geometryExpressID: number;
    flatTransformation: Array<number>;
}

export interface FlatMesh {
    geometries: Vector<PlacedGeometry>;
    expressID: number;
}

export interface RawLineData {
    ID: number;
    type: number;
    arguments: any[];
}

export interface LoaderError
{
    type: string;
    message: string;
    expressID: number;
    ifcType: number;
}

export interface IfcGeometry
{
    GetVertexData(): number;
    GetVertexDataSize(): number;
    GetIndexData(): number;
    GetIndexDataSize(): number;
}

export function ms() {
    return new Date().getTime();
}

export class IfcAPI
{
    wasmModule: undefined | any = undefined;
    fs: undefined | any = undefined;
    wasmPath: string = "";

    /**
     * Initializes the WASM module (WebIFCWasm), required before using any other functionality
    */
    async Init()
    {
        if (WebIFCWasm)
        {
            let locateFileHandler = (path, prefix) => {
                // when the wasm module requests the wasm file, we redirect to include the user specified path
                if (path.endsWith(".wasm")) return prefix + this.wasmPath + path;
                // otherwise use the default path
                return prefix + path;
            }

            //@ts-ignore
            this.wasmModule = await WebIFCWasm({ noInitialRun: true, locateFile: locateFileHandler});
            this.fs = this.wasmModule.FS;
        }
        else
        {
            console.error(`Could not find wasm module at './web-ifc' from web-ifc-api.ts`);
        }
    }

    /**  
     * Opens a model and returns a modelID number
     * @data Buffer containing IFC data (bytes)
     * @data Settings settings for loading the model
    */
    OpenModel(data: string | Uint8Array, settings?: LoaderSettings): number
    {
        this.wasmModule['FS_createDataFile']('/', "filename", data, true, true, true);
        let s: LoaderSettings = {
            COORDINATE_TO_ORIGIN: false,
            USE_FAST_BOOLS: false,
            CIRCLE_SEGMENTS_LOW: 5,
            CIRCLE_SEGMENTS_MEDIUM: 8,
            CIRCLE_SEGMENTS_HIGH: 12,
            BOOL_ABORT_THRESHOLD: 10000,
            ...settings
        };
        let result = this.wasmModule.OpenModel(s);
        this.wasmModule['FS_unlink']("/filename");
        return result;
    }

    /**  
     * Creates a new model and returns a modelID number
     * @data Settings settings for generating data the model
    */
    CreateModel(settings?: LoaderSettings): number
    {
        let s: LoaderSettings = {
            COORDINATE_TO_ORIGIN: false,
            USE_FAST_BOOLS: false,
            CIRCLE_SEGMENTS_LOW: 5,
            CIRCLE_SEGMENTS_MEDIUM: 8,
            CIRCLE_SEGMENTS_HIGH: 12,
            BOOL_ABORT_THRESHOLD: 10000,
            ...settings
        };
        let result = this.wasmModule.CreateModel(s);
        return result;
    }

    ExportFileAsIFC(modelID: number): Uint8Array
    {
        this.wasmModule.ExportFileAsIFC(modelID);
        //@ts-ignore
        let result = this.fs.readFile("/export.ifc");
        this.wasmModule['FS_unlink']("/export.ifc");
        return result;
    }


    /**  
     * Opens a model and returns a modelID number
     * @modelID Model handle retrieved by OpenModel, model must not be closed
     * @data Buffer containing IFC data (bytes)
    */
    GetGeometry(modelID: number, geometryExpressID: number): IfcGeometry
    {
        return this.wasmModule.GetGeometry(modelID, geometryExpressID);
    }

    GetLine(modelID: number, expressID: number, flatten: boolean = false)
    {
        let rawLineData = this.GetRawLineData(modelID, expressID);
        let lineData = ifc2x4helper.FromRawLineData[rawLineData.type](rawLineData);
        if (flatten)
        {
            this.FlattenLine(modelID, lineData);
        }

        return lineData;
    }

    GetAndClearErrors(modelID: number): Vector<LoaderError>
    {
        return this.wasmModule.GetAndClearErrors(modelID);
    }

    WriteLine(modelID: number, lineObject: any)
    {
        // this is pretty weakly-typed nonsense
        Object.keys(lineObject).forEach(propertyName => {
            let property = lineObject[propertyName];
            if (property && property.expressID !== undefined)
            {
                // this is a real object, we have to write it as well and convert to a handle
                // TODO: detect if the object needs to be written at all, or if it's unchanged
                this.WriteLine(modelID, property);

                // overwrite the reference 
                // NOTE: this modifies the parameter
                lineObject[propertyName] = {
                    type: 5,
                    value: property.expressID
                }
            }
            else if (Array.isArray(property) && property.length > 0)
            {
                for (let i = 0; i < property.length; i++)
                {
                    if (property[i].expressID !== undefined)
                    {
                        // this is a real object, we have to write it as well and convert to a handle
                        // TODO: detect if the object needs to be written at all, or if it's unchanged
                        this.WriteLine(modelID, property[i]);
        
                        // overwrite the reference 
                        // NOTE: this modifies the parameter
                        lineObject[propertyName][i] = {
                            type: 5,
                            value: property[i].expressID
                        }
                    }
                }
            }
        });

        let rawLineData: RawLineData = {
            ID: lineObject.expressID,
            type: lineObject.type,
            arguments: lineObject.ToTape() as any[]
        }

        this.WriteRawLineData(modelID, rawLineData);
    }

    FlattenLine(modelID: number, line: any)
    {
        Object.keys(line).forEach(propertyName => {
            let property = line[propertyName];
            if (property && property.type === 5)
            {
                line[propertyName] = this.GetLine(modelID, property.value, true);
            }
            else if (Array.isArray(property) && property.length > 0 && property[0].type === 5)
            {
                for (let i = 0; i < property.length; i++)
                {
                    line[propertyName][i] = this.GetLine(modelID, property[i].value, true);
                }
            }
        });
    }

    GetRawLineData(modelID: number, expressID: number): RawLineData
    {
        return this.wasmModule.GetLine(modelID, expressID) as RawLineData;
    }

    WriteRawLineData(modelID: number, data: RawLineData)
    {
        return this.wasmModule.WriteLine(modelID, data.ID, data.type, data.arguments);
    }

    GetLineIDsWithType(modelID: number, type: number): Vector<number>
    {
        return this.wasmModule.GetLineIDsWithType(modelID, type);
    }

    GetAllLines(modelID: Number): Vector<number>
    {
        return this.wasmModule.GetAllLines(modelID);
    }

    SetGeometryTransformation(modelID: number, transformationMatrix: Array<number>)
    {
        if (transformationMatrix.length != 16)
        {
            console.log(`Bad transformation matrix size: ${transformationMatrix.length}`);
            return;
        }
        this.wasmModule.SetGeometryTransformation(modelID, transformationMatrix);
    }

    GetCoordinationMatrix(modelID: number): Array<number>
    {
        return this.wasmModule.GetCoordinationMatrix(modelID) as Array<number>;
    }

    GetVertexArray(ptr: number, size: number): Float32Array
    {
        return this.getSubArray(this.wasmModule.HEAPF32, ptr, size);
    }

    GetIndexArray(ptr: number, size: number): Uint32Array
    {
        return this.getSubArray(this.wasmModule.HEAPU32, ptr, size);
    }

    getSubArray(heap, startPtr, sizeBytes) {
        return heap.subarray(startPtr / 4, startPtr / 4 + sizeBytes).slice(0);
    }

    /**  
     * Closes a model and frees all related memory
     * @modelID Model handle retrieved by OpenModel, model must not be closed
    */
    CloseModel(modelID: number)
    {
        this.wasmModule.CloseModel(modelID);
    }

    StreamAllMeshes(modelID: number, meshCallback: (mesh: FlatMesh)=>void)
    {
        this.wasmModule.StreamAllMeshes(modelID, meshCallback);
    }

    StreamAllMeshesWithTypes(modelID: number, types: Array<number>, meshCallback: (mesh: FlatMesh)=>void)
    {
        this.wasmModule.StreamAllMeshesWithTypes(modelID, types, meshCallback);
    }

    /**  
     * Checks if a specific model ID is open or closed
     * @modelID Model handle retrieved by OpenModel
    */
    IsModelOpen(modelID: number): boolean
    {
        return this.wasmModule.IsModelOpen(modelID);
    }

    /**  
     * Load all geometry in a model
     * @modelID Model handle retrieved by OpenModel
    */
    LoadAllGeometry(modelID: number): Vector<FlatMesh>
    {
        return this.wasmModule.LoadAllGeometry(modelID);
    }

    /**  
     * Load geometry for a single element
     * @modelID Model handle retrieved by OpenModel
    */
   GetFlatMesh(modelID: number, expressID: number): FlatMesh
    {
        return this.wasmModule.GetFlatMesh(modelID, expressID);
    }

    SetWasmPath(path: string){
        this.wasmPath = path;
    }
}