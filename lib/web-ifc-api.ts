let wasm_module = undefined;

export function ms() {
    return new Date().getTime();
}

export async function WaitForModuleReady()
{
    //@ts-ignore
    wasm_module = await WebIFCWasm({noInitialRun: true});
    console.log(wasm_module);
}

/**  Opens a model and returns a handle
*/
export function OpenModel(filename: string, data: string | Uint8Array): number
{
    wasm_module['FS_createDataFile']('/', "filename", data, true, true, true);
    console.log("Wrote file");
    let result = wasm_module.OpenModel(filename);
    wasm_module['FS_unlink']("/filename");
    return result;
}

export function GetGeometry(modelID: number, geometryExpressID: number): any
{
    return wasm_module.GetGeometry(modelID, geometryExpressID);
}

export function GetHEAPF32()
{
    return wasm_module.HEAPF32;
}

export function GetHEAPU32()
{
    return wasm_module.HEAPU32;
}

export function CloseModel(modelID: number)
{
    wasm_module.CloseModel(modelID);
}

export function IsModelOpen(modelID: number): boolean
{
    return wasm_module.IsModelOpen(modelID);
}

export function LoadAllGeometry(modelID: number): void
{
    return wasm_module.LoadAllGeometry(modelID);
}