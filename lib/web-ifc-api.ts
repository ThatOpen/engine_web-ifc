
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

    async WaitForModuleReady()
    {
        //@ts-ignore
        this.wasmModule = await WebIFCWasm({noInitialRun: true});
        console.log(this.wasmModule);
    }

    /**  Opens a model and returns a handle
    */
    OpenModel(filename: string, data: string | Uint8Array): number
    {
        this.wasmModule['FS_createDataFile']('/', "filename", data, true, true, true);
        console.log("Wrote file");
        let result = this.wasmModule.OpenModel(filename);
        this.wasmModule['FS_unlink']("/filename");
        return result;
    }

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

    CloseModel(modelID: number)
    {
        this.wasmModule.CloseModel(modelID);
    }

    IsModelOpen(modelID: number): boolean
    {
        return this.wasmModule.IsModelOpen(modelID);
    }

    LoadAllGeometry(modelID: number): Vector<FlatMesh>
    {
        return this.wasmModule.LoadAllGeometry(modelID);
    }
}