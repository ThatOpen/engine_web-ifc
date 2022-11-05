import * as fs from "fs";
import * as path from "path";
import * as os from 'os';
const BENCHMARK_FILES_DIR = "./ifcfiles";
import { getGPUTier } from 'detect-gpu';
import * as NewWebIFC from '../dist/web-ifc-api-node';
import { ms } from '../dist/web-ifc-api-node';

let newIfcAPI = new NewWebIFC.IfcAPI();

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

class SystemInfo{
    gpu: string;
    cpuName: string;
    freeRam: number;
    totalRam: number;
}
// hack Object.fromEntries doesn't works
function mapToObj(inputMap) {
    let obj = {};

    inputMap.forEach(function(value, key){
        obj[key] = value
    });

    return obj;
}
class BenchMarkResult
{
    results: Map<string, FileResult>;
}
class BenchmarkResultFormatter{
    results: Map<string, FileResult>;
    getMarkdownTable() : string
    {
        let datas =  mapToObj(this.results);
        console.log(datas)
        const keys = Object.keys(datas);

        // todo auto gen
        let header = "| filename | fileSize | timeTakenToOpenModel | timeSuccess | numberOfIfcEntities | totalNumberOfProducedMesh | totalNumberOfGeometries | totalNumberOfErrors | \n"
        // todo auto gen
        let separator = "|-------|------|-------|-------|-------|-------|-------|-------| \n";
        let readme = `${header}${separator}`;
        // todo auto gen
        keys.map((key) => {
            let line = datas[key];
            readme += `| ${line["filename"]} | ${line["fileSize"]} | ${line["timeTakenToOpenModel"]} | ${line["timeSuccess"]} | ${line["numberOfIfcEntities"]} | ${line["totalNumberOfProducedMesh"]} | ${line["totalNumberOfGeometries"]} | ${line["totalNumberOfErrors"]} |\n `
        })
        return readme;
    }
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


    endTime = ms();
    result.timeSuccess = endTime - startTime;
    console.log(`Parsed model ${result.filename} in ${result.timeTakenToOpenModel} ms`);

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


async function GetBenchmarkFiles(): Promise<string[]>
{
    return fs.readdirSync(BENCHMARK_FILES_DIR).filter((f) => f.endsWith(".ifc")).map((f) => path.join(BENCHMARK_FILES_DIR, f)).slice(0, 8);
}

async function getSystemInformations(): Promise<SystemInfo>
{
    const gpuTier = await getGPUTier();
    let systemInfo = new SystemInfo();
    systemInfo.gpu = gpuTier.gpu ? gpuTier.gpu : "";
    systemInfo.cpuName = os.cpus()[0]["model"];

    const osFreeMem = os.freemem();
    const allFreeMem = (osFreeMem / (1024 * 1024));
    systemInfo.freeRam = allFreeMem;
    
    const osTotalMem = os.totalmem();
    const avbMem = (osTotalMem / (1024 * 1024));
    systemInfo.totalRam = avbMem;

    return systemInfo;
}

async function RunBenchmark()
{
    let files = await GetBenchmarkFiles();
    let systemInfo = await getSystemInformations();
    console.log(``);
    console.log(systemInfo);
    console.log(``);

    let newResult = await BenchmarkWebIFC(newIfcAPI, files);

    let systemInfo = await getSystemInformations();
    console.log(systemInfo);
    console.log(newResult.results.values());
}

RunBenchmark();