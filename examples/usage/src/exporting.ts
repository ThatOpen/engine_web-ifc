import { FlatShading } from "three";
// import * as WebIFC from "../../../dist/web-ifc-api-node.js";
import * as WebIFC from "web-ifc";
import { Equals, WithIFCFileLoaded, TestInfo } from "./utils";

export default async function() {
    await WithIFCFileLoaded("read_and_export", (ifcapi: WebIFC.IfcAPI, modelID: number, info: TestInfo) => {

        let data = ifcapi.ExportFileAsIFC(modelID);

        let diffBytes = 0;
        for (var i = 0 ; i != info.rawFileData.byteLength ; i++)
        {
            if (info.rawFileData[i] != data[i]) {
                diffBytes++;
            };
        }

        // TODO: exports are NOT lossless, currently losing header and double precision
        Equals("In eq out", diffBytes, 410006);
    });
}