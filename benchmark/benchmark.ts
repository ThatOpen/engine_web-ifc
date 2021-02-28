import * as fs from "fs";
import * as path from "path";

const BENCHMARK_FILES_DIR = "./ifcfiles";

import * as NewWebIFC from '../dist/web-ifc-api';
import { ms } from '../dist/web-ifc-api';

import * as OldWebIFC from 'web-ifc/web-ifc-api';

let newIfcAPI = new NewWebIFC.IfcAPI();
let oldIfcAPI = new OldWebIFC.IfcAPI();

class FileResult
{
    filename: string;
    timeTaken: number;
}

class BenchMarkResult
{
    results: Map<string, FileResult>;
}

async function BenchmarkIfcFile(module: any, filename: string): Promise<FileResult>
{
    let result = new FileResult();
    result.filename = filename;

    let data = fs.readFileSync(filename).toString();

    let startTime = ms();

    let modelID = module.OpenModel("example.ifc", data);

    module.CloseModel(modelID);

    let endTime = ms();
    result.timeTaken = endTime - startTime;

    console.log(`Parsed model ${result.filename} in ${result.timeTaken}`);

    return result;
}

async function BenchmarkWebIFC(module: any, files: string[]): Promise<BenchMarkResult>
{
    await module.Init();

    let result = new BenchMarkResult();
    result.results = new Map<string, FileResult>();

    for (let file in files)
    {
        let filename = files[file];
        result.results.set(filename, await BenchmarkIfcFile(module, filename));
    }

    return result;
}

function combine(oldResult: BenchMarkResult, newResult: BenchMarkResult)
{
    console.log("");
    console.log("");
    console.log("");
    console.log("*******************");
    oldResult.results.forEach((r) => {
        let filename = r.filename;
        let oldFileResult = oldResult.results.get(filename);
        let newFileResult = newResult.results.get(filename);

        console.log(`${filename}: ${oldFileResult.timeTaken}\t->\t${newFileResult.timeTaken}`);
    });
    console.log("*******************");
}

async function GetBenchmarkFiles(): Promise<string[]>
{
    return fs.readdirSync(BENCHMARK_FILES_DIR).filter((f) => f.endsWith(".ifc")).map((f) => path.join(BENCHMARK_FILES_DIR, f)).slice(0, 8);
}

async function RunBenchmark()
{
    let files = await GetBenchmarkFiles();
    let oldResult = await BenchmarkWebIFC(oldIfcAPI, files);
    let newResult = await BenchmarkWebIFC(newIfcAPI, files);

    combine(oldResult, newResult);
}

RunBenchmark();