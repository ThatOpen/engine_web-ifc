/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const WebIFCWasm = require("./web-ifc");
 
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
    wasmModule = undefined;

    /**
     * Initializes the WASM module (WebIFCWasm), required before using any other functionality
    */
    async Init()
    {
        if (WebIFCWasm)
        {
            //@ts-ignore
            this.wasmModule = await WebIFCWasm({noInitialRun: true});
        }
        else
        {
            console.error(`Could not find wasm module at './web-ifc' from web-ifc-api.ts`);
        }
    }

    /**  
     * Opens a model and returns a modelID number
     * @filename Is for debuggin purposes
     * @data Buffer containing IFC data (bytes)
    */
    OpenModel(filename: string, data: string | Uint8Array): number
    {
        this.wasmModule['FS_createDataFile']('/', "filename", data, true, true, true);
        console.log("Wrote file");
        let result = this.wasmModule.OpenModel(filename);
        this.wasmModule['FS_unlink']("/filename");
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

    GetVertexArray(ptr: number, size: number)
    {
        return this.getSubArray(this.wasmModule.HEAPF32, ptr, size);
    }

    GetIndexArray(ptr: number, size: number)
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
}