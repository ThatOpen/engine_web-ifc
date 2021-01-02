import * as API from "./web-ifc-api";
import * as fs from "fs";
const wasm_module = require("./wasm-lib/web-ifc.js");

API.SetModule(wasm_module);

import { ExpressIDList, GeometryBuffer } from "../web-ifc-interop/gen/Types";

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

    let expressIds: ExpressIDList;
    {
        let start = API.ms();
        expressIds = API.GetExpressIdsWithType(modelID, 1529196076); // IFCSLAB
        let time = API.ms() - start;
        console.log(`Call took ${time} ms`);
        console.log(expressIds);
    }

    let firstSlabExpressId = expressIds.expressIds[0];
    console.log(firstSlabExpressId);

    {
        let start = API.ms();
        let geometryBuffer = API.GetFlattenedGeometry(modelID, firstSlabExpressId);
        let vertexData = geometryBuffer.vertexData();
        let indexData = geometryBuffer.indexData();
        let time = API.ms() - start;
        console.log(`Call took ${time} ms`);

        console.log(vertexData);
        console.log(indexData);
    }

    
    API.CloseModel(modelID);

    assert("Model ID is closed", !API.IsModelOpen(modelID));
});