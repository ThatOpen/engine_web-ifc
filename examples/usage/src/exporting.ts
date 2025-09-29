import * as WebIFC from "../../../dist/web-ifc-api-node.js";
//import * as WebIFC from "web-ifc";
import { Equals, WithIFCFileLoaded } from "./utils";
import fs from "fs";

export interface TestInfo
{
    rawFileData: Uint8Array;    
}

const FILE_NAME = "../example.ifc";

export default async function() {
    await WithIFCFileLoaded("read_and_export", (ifcapi: WebIFC.IfcAPI, modelID: number) => {

        let data: Uint8Array = ifcapi.SaveModel(modelID);

        const ifcData = fs.readFileSync(FILE_NAME);
        let info: TestInfo = {
            rawFileData: new Uint8Array(ifcData)
        };

        let diffBytes = 0;
        for (var i = 0 ; i != info.rawFileData.byteLength ; i++)
        {
            if (info.rawFileData[i] != data[i]) {
                diffBytes++;
            };
        }

        Equals("In eq out", diffBytes, 403556);
    });
}