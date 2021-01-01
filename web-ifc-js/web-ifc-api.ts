import { ExpressIDList } from "../web-ifc-interop/gen/Types";

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

export function OpenModel(filename: string, data: string): number
{
    wasm_module['FS_createDataFile']('/', "filename", data, true, true, true);
    return wasm_module._OpenModel(filename);
}

export function CloseModel(modelID: number)
{
    wasm_module._CloseModel(modelID);
}

export function IsModelOpen(modelID: number): boolean
{
    return wasm_module._IsModelOpen(modelID);
}

export function GetExpressIdsWithType(modelID: number, type: number): number
{
    return wasm_module._GetExpressIdsWithType(modelID, type);
}
export function GetFlattenedGeometry(modelID: number, expressID: number): number
{
    return wasm_module._GetFlattenedGeometry(modelID, expressID);
}