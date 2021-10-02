import * as WebIFC from "../../../dist";
import { Equals, WithIFCFileLoaded, TestInfo } from "./utils";

let settings: any = {
    COORDINATE_TO_ORIGIN: true
}

export default async function() {
    await WithIFCFileLoaded("coordinate_model", (ifcapi: WebIFC.IfcAPI, modelID: number, info: TestInfo) => {
        // load all geometry so that we have a coordination
        ifcapi.LoadAllGeometry(modelID);

        // retrieve the coordination
        let coordinationMatrix = ifcapi.GetCoordinationMatrix(modelID);
        let position = coordinationMatrix.slice(12, 15);

        console.log(position);

        // TODO: exports are NOT lossless, currently losing header and double precision
        Equals("X coordinate", position[0], 32.53202252630053);
        Equals("Y coordinate", position[1], -3.5);
        Equals("Z coordinate", position[2], 97.03402644555202);
    }, settings);
}