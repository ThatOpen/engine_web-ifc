import * as fs from "fs";
import * as path from "path";

const BENCHMARK_FILES_DIR = "./ifcfiles";

import * as NewWebIFC from '../dist/web-ifc-api-node';
import { ms } from '../dist/web-ifc-api-node';

import * as OldWebIFC from 'web-ifc/web-ifc-api-node';

let newIfcAPI = new NewWebIFC.IfcAPI();
let oldIfcAPI = new OldWebIFC.IfcAPI();

class FileResult
{
    filename: string;
    fileSize: number;
    timeTakenToOpenModel: number;
    timeSuccess: number;
    numberOfIfcEntities: number;
    totalNumberOfProducedMesh: number;
    totalNumberOfGeometries : number;
    totalNumberOfErrors: number;
}

class BenchMarkResult
{
    results: Map<string, FileResult>;
}

async function BenchmarkIfcFile(module: any, filename: string): Promise<FileResult>
{
    let result = new FileResult();
    result.filename = filename;

    //let modelID = module.OpenModel("example.ifc", new Uint8Array(data.toString()));

    const ifcFilePath = path.join(__dirname, './'+filename);
    const ifcFileContent = fs.readFileSync(ifcFilePath);
    let startTime = ms();
    let modelID : number = module.OpenModel(ifcFileContent);
    let endTime = ms();
    result.timeTakenToOpenModel = endTime - startTime; // time to open and close the file and nothing else

    startTime = ms();
    result.numberOfIfcEntities = module.GetAllLines(modelID).size();

    result.totalNumberOfProducedMesh = 0;
    module.StreamAllMeshes(modelID, (mesh) => {
        ++result.totalNumberOfProducedMesh;
    });

    result.totalNumberOfGeometries = module.LoadAllGeometry(modelID).size();
    let stats = fs.statSync(ifcFilePath);
    let fileSizeInBytes = stats.size;
    // Convert the file size to megabytes (optional)
    let sizeMo = fileSizeInBytes / (1024*1024);
    result.fileSize = parseFloat(sizeMo.toFixed(2));

    result.totalNumberOfErrors =  module.GetAndClearErrors(modelID).size();
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

    console.log(`Previous version...`);
    console.log(``);

    let oldResult = await BenchmarkWebIFC(oldIfcAPI, files);

    console.log(``);
    console.log(`New version...`);
    console.log(``);

    let newResult = await BenchmarkWebIFC(newIfcAPI, files);

    combine(oldResult, newResult);
}

RunBenchmark();