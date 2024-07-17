import * as fs from "fs";
import * as path from "path";
import * as os from 'os';
import * as WebIFC from '../../dist/web-ifc-api-node';
// @ts-ignore
import AdmZip from 'adm-zip';

let newIfcAPI = new WebIFC.IfcAPI();
const OUTPUT_FILE = './benchmark.md';
const BENCHMARK_FILES_DIR = "./tests/ifcfiles/";

class FileResult
{
    filename !: string;
    fileSize !: number;
    timeTakenToOpenModel !: number;
    timeSuccess !: number;
    numberOfIfcEntities !: number;
    totalNumberOfProducedMesh !: number;
    totalNumberOfGeometries !: number;
    totalNumberOfErrors !: number;
}

class SystemInfo{
    cpuName !: string;
    freeRam !: number;
    totalRam !: number;
}

const ms = (): number => {
  const date = new Date();
  return date.getTime();
};

// hack Object.fromEntries doesn't works
function mapToObj(inputMap : any) {
    let obj : any = {};

    inputMap.forEach(function(value: any , key: any){
        obj[key] = value
    });

    return obj;
}
async function writeResult(content : string){
    fs.writeFile(OUTPUT_FILE, content, () => {
        
    })
}
class BenchMarkResult
{
    results !: Map<string, FileResult>;
}
class BenchmarkResultFormatter{
    results !: Map<string, FileResult>;
    columns !: Object
    getMarkdownTable() : string
    {
        let datas =  mapToObj(this.results);
        const lines = Object.keys(datas);
        const columns = Object.entries(this.columns);
        let benchmarkMarkdown = this.getMarkdownTableHeader(columns);
        lines.map((key) => {
            let line = datas[key];
            benchmarkMarkdown += this.getMarkdownTableRow(line, columns);
        })
        return benchmarkMarkdown;
    }
    private getMarkdownTableHeader(columns: any) : string
    {
        let header = "|";
        let separator = "|";
        for (const [_, value] of columns) {
            header += ` ${value} |`;
            separator += "-------|"
        }
        return `${header}\n${separator}\n|`;
    }
    private getMarkdownTableRow(line : any, columns : any) : string 
    {
        let row = "";
        for (const [column] of columns) {
            row += ` ${line[column]} |`;
        }
        row += "\n";
        return row;
    }
}

async function StreamFileToString(filename: string) {
    let stream = fs.createReadStream(filename);
    return new Promise((resolve, reject) => {
      const data:any = [];

      stream.on('data', (chunk) => {
        data.push(chunk);
      });

      stream.on('end', () => {
        resolve(Buffer.concat(data))
      })

      stream.on('error', (err) => {
        reject(err)
      })

      return data;
    })
}

async function BenchmarkIfcFile(module: any, filename: string): Promise<FileResult>
{
    let result = new FileResult();
    result.filename = filename;

    const ifcFilePath = path.join(filename);
    let ifcFileContent;
    if (filename.includes(".ifczip"))  {
        let zip = new AdmZip(filename);
        zip.getEntries().forEach(function (zipEntry:any) {
            ifcFileContent = zipEntry.getData();
        });
    } else ifcFileContent = await StreamFileToString(ifcFilePath);
    
    let startTime = ms();
    let modelID : number = module.OpenModel(ifcFileContent);
    let endTime = ms();
    result.timeTakenToOpenModel = endTime - startTime; // time to open and close the file and nothing else

    startTime = ms();
    result.numberOfIfcEntities = module.GetAllLines(modelID).size();
    
    result.totalNumberOfProducedMesh = 0;
    module.StreamAllMeshes(modelID, () => {
        ++result.totalNumberOfProducedMesh;
    });

    result.totalNumberOfGeometries = module.LoadAllGeometry(modelID).size();
    let stats = fs.statSync(ifcFilePath);
    let fileSizeInBytes = stats.size;
    // Convert the file size to megabytes (optional)
    let sizeMo = fileSizeInBytes / (1024*1024);
    result.fileSize = parseFloat(sizeMo.toFixed(2));
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
        console.log("-------------------------------");
        console.log(filename);
        console.log("-------------------------------");
        result.results.set(filename, await BenchmarkIfcFile(module, filename));
    }

    return result;
}


async function GetBenchmarkFiles(): Promise<string[]>
{
    let files = await fs.readdirSync(BENCHMARK_FILES_DIR+"public/").filter((f) => ( f.endsWith(".ifc") || f.endsWith(".ifczip")) ).map((f) => path.join(BENCHMARK_FILES_DIR+"public/", f));
    let privateFiles = await fs.readdirSync(BENCHMARK_FILES_DIR+"private/").filter((f) => ( f.endsWith(".ifc") || f.endsWith(".ifczip")) ).map((f) => path.join(BENCHMARK_FILES_DIR+"private/", f));
    return files.concat(privateFiles);
}

async function getSystemInformations(): Promise<SystemInfo>
{
    
    let systemInfo = new SystemInfo();
    systemInfo.cpuName = os.cpus()[0]["model"];

    const osFreeMem = os.freemem();
    const allFreeMem = (osFreeMem / (1024 * 1024));
    systemInfo.freeRam = allFreeMem;
    
    const osTotalMem = os.totalmem();
    const avbMem = (osTotalMem / (1024 * 1024));
    systemInfo.totalRam = avbMem;

    return systemInfo;
}
function generateMarkdownReport(systemInfo : SystemInfo, fileResult : Map<string, FileResult>): string
{
    let formatter = new BenchmarkResultFormatter();
    formatter.columns = {
        filename: "filename",
        fileSize: "Size (mb)",
        timeTakenToOpenModel: "Time to open model (ms)",
        timeSuccess: "Time to execute all (ms)",
        numberOfIfcEntities: "Total ifc entities",
        totalNumberOfProducedMesh: "Total meshes",
        totalNumberOfGeometries : "Total geometries",
        totalNumberOfErrors: "total errors"
    };
    let markdown : string = "# System informations \n "+JSON.stringify(systemInfo)+"\n _________ \n";
    formatter.results = fileResult;
    markdown += formatter.getMarkdownTable();
    return markdown;
}
async function RunBenchmark()
{
    let files = await GetBenchmarkFiles();
    for (let i=0; i < files.length;i++) {
      console.log(files[i]);
    }
    let systemInfo = await getSystemInformations();
    console.log(``);
    console.log(systemInfo);
    console.log(``);

    let newResult = await BenchmarkWebIFC(newIfcAPI, files);
    let markdown = generateMarkdownReport(systemInfo, newResult.results);


    await writeResult(markdown);
}

RunBenchmark();