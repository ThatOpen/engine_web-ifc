const wasm_module = require("./wasm-lib/web-ifc.js");

export function ms() {
    return new Date().getTime();
}

function readString(ptr, len)
{
    let string = wasm_module.HEAP8.subarray(ptr, ptr + len);
    return wasm_module.UTF8ArrayToString(string, 0);
}

function readInt32(ptr)
{
    return wasm_module.HEAP32[ptr/4];
}

export function OpenModel(filename: string, data: string): number
{
    wasm_module['FS_createDataFile']('/', filename, data, true, true, true);
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

export async function WaitForModuleReady()
{
    return new Promise((resolve, reject) => {
        wasm_module["onRuntimeInitialized"] = () => {
            resolve();
        };
    })
}


wasm_module["onRuntimeInitialized"] = () => {

    console.log("init");

    {
        let start = ms();
        let ptr = wasm_module._getBuffer();
        let end = ms();

        let arr = wasm_module.HEAP8.subarray(ptr, ptr + 1000);
        console.log(`Took ${end - start} ms`);
        console.log(wasm_module.HEAP8[ptr + 1]);

        console.log(arr);
    }


    {
        let start = ms();
        let str;
        let value;
        for (let i = 0; i < 100; i++)
        {
            let structPtr = wasm_module._getString();
            str = readString(wasm_module.HEAP32[structPtr / 4], wasm_module.HEAP32[structPtr / 4 + 1]);
            value = readInt32(structPtr + 8);
        }
        let end = ms();
        console.log(`Took ${end - start} ms`);

        console.log(str);
        console.log(value);
    }
};
