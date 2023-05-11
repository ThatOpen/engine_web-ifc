import * as WebIFC from "../../../dist/web-ifc-api-node.js";
import { Equals, WithIFCFileLoaded } from "./utils";

let settings: any = {
    COORDINATE_TO_ORIGIN: true
}

export default async function() {
    await WithIFCFileLoaded("coordinate_model", (ifcapi: WebIFC.IfcAPI, modelID: number) => {
        // load all geometry so that we have a coordination
        ifcapi.LoadAllGeometry(modelID);

        // retrieve the coordination
        let coordinationMatrix = ifcapi.GetCoordinationMatrix(modelID);
        let position = coordinationMatrix.slice(12, 15);

        console.log(position);

        // TODO: exports are NOT lossless, currently losing header and double precision
        Equals("X coordinate", position[0], 36.52331501322146);
        Equals("Y coordinate", position[1], 0.125);
        Equals("Z coordinate", position[2], 104.56433843213091 );
    }, settings);
}