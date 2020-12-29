import * as API from "./web-ifc-api";
import * as fs from "fs";

import { ExpressIDList } from "../web-ifc-interop/gen/Types";

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
        let startTime = API.ms();
        await f();
        let endTime = API.ms();
        let time = endTime - startTime;
        console.log(`Completed ${name} successfully in ${time}ms`);
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
    assert("Model ID is open", API.IsModelOpen(modelID));

    let expressIds = ExpressIDList.expressIds(API.module, API.GetExpressIdsWithType(modelID, 1529196076)); // IFCSLAB
    console.log(expressIds);
    
    API.CloseModel(modelID);

    assert("Model ID is closed", !API.IsModelOpen(modelID));
});