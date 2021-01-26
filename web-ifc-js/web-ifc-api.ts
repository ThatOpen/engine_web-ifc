import { ExpressIDList, GeometryBuffer } from "../web-ifc-interop/gen/Types";

let wasm_module = undefined;

export  function SetModule(module: any)
{
    wasm_module = module;
}

export function ms() {
    return new Date().getTime();
}

export async function WaitForModuleReady()
{
    return new Promise((resolve, reject) => {
        wasm_module["onRuntimeInitialized"] = () => {
            resolve();
        };
    })
}

export function OpenModel(filename: string, data: string | Uint8Array): number
{
    wasm_module['FS_createDataFile']('/', "filename", data, true, true, true);
    console.log("Wrote file");
    let result = wasm_module.OpenModel(filename);
    wasm_module['FS_unlink']("/filename");
    return result;
}

export function CloseModel(modelID: number)
{
    wasm_module.CloseModel(modelID);
}

export function IsModelOpen(modelID: number): boolean
{
    return wasm_module.IsModelOpen(modelID);
}

export function GetExpressIdsWithType(modelID: number, type: number): ExpressIDList
{
    return new ExpressIDList(wasm_module, wasm_module._GetExpressIdsWithType(modelID, type));
}

export function GetFlattenedGeometry(modelID: number, expressID: number): GeometryBuffer
{
    return new GeometryBuffer(wasm_module, wasm_module.GetFlattenedGeometry(modelID, expressID));
}

export function LoadAllGeometry(modelID: number): void
{
    return wasm_module.LoadAllGeometry(modelID);
}