import * as WebIFC from "../../../dist/web-ifc-api-node.js";
import chalk from 'chalk';
import fs from "fs";

const FILE_NAME = "../example.ifc";

let clog = console.log.bind(console);

export async function WithIFCFileLoaded(name: string, usageExample: (ifcapi: WebIFC.IfcAPI, modelID: number) => void, settings?: WebIFC.LoaderSettings) {
    console.log("Start " + chalk.green(`${name}`));

    console.log = function () {
        clog.apply(this, [chalk.gray(`[${name}]:`), ...arguments]);
    }
    const ifcData = fs.readFileSync(FILE_NAME);

    const ifcapi = new WebIFC.IfcAPI();
    //    ifcapi.SetWasmPath("node_modules/web-ifc/");
    ifcapi.SetWasmPath("./");
    await ifcapi.Init();

    let rawFileData = new Uint8Array(ifcData)

    let modelID = ifcapi.OpenModel(rawFileData, settings);

    let startTime = WebIFC.ms();
    usageExample(ifcapi, modelID);
    let endTime = WebIFC.ms();

    console.log = clog;

    console.log("End " + chalk.green(`${name}`) + chalk.yellow(` (${endTime - startTime} ms elapsed)`));

    ifcapi.CloseModel(modelID);
}

export function Equals(name: string, value: any, expectedValue: any) {
    if (value !== expectedValue) {
        let msg = `[${name}] expected: ${JSON.stringify(expectedValue, null, 4)}, received: ${JSON.stringify(value, null, 4)}`;
        console.log(chalk.redBright(`${msg}`));
        throw new Error(msg)
    }
    else {
        console.log(chalk.green(`${name}`));
    }
}