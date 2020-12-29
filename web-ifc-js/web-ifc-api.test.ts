import * as API from "./web-ifc-api";
import * as fs from "fs";

function assert(name: string, clause: boolean)
{
    if (!clause)
    {
        throw new Error(`Assertion failed for ${name}`);
    }
}

async function test(name: string, f: any)
{
    try {
        await f();
    }
    catch(e)
    {
        console.error(e);
        console.error(`Error in ${name}`);
    }
}

test('Test opening and closing file', async () => {
    let data = fs.readFileSync("B:\\ifcfiles\\02_BIMcollab_Example_STR_optimized.ifc").toString();

    await API.WaitForModuleReady();
    let modelID = API.OpenModel("02_BIMcollab_Example_STR_optimized.ifc", data);

    assert("Model ID is initialized", modelID == 1);

    API.CloseModel(modelID);
});