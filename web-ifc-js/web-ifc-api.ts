let wasm_module = undefined;

export function SetModule(module: any)
{
    wasm_module = module;
}

export function ms() {
    return new Date().getTime();
}

export function WaitForModuleReady()
{
    return new Promise<void>((resolve, reject) => {
        wasm_module["onRuntimeInitialized"] = () => {
            resolve();
        };
    })
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