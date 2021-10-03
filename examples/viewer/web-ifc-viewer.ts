import * as WebIFC from "../../dist";
import { IfcAPI, ms, IfcExtrudedAreaSolid } from '../../dist';
import { IfcThree } from './web-ifc-three';
import { Init3DView, InitBasicScene, scene } from './web-ifc-scene';
import * as Monaco from 'monaco-editor';
import * as ts_decl from "./ts_src";
import * as ts from "typescript";

(window as any).WebIFC = WebIFC;

let ifcAPI = new IfcAPI();
ifcAPI.wasmPath = '../../dist/';
let ifcThree = new IfcThree(ifcAPI);

let timeout = undefined;

function Edited(monacoEditor: Monaco.editor.IStandaloneCodeEditor)
{
    let code = monacoEditor.getValue();
    let model = ifcAPI.CreateModel();

    scene.clear();
    InitBasicScene();

    window.localStorage.setItem('code', code);
    console.log("Saved code...");

    code = code.replace('import * as WebIFC from "../../dist";', '');

    let compiled = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS }})

    // this is where we do evil stuff
    {
        console.log(` --- Starting EVAL!`);
        eval(compiled.outputText + `BuildModel(model, ifcAPI)`);
        console.log(` --- Ending EVAL!`);
    }

    let ifcData = ifcAPI.ExportFileAsIFC(model);
    let ifcDataString = new TextDecoder().decode(ifcData);
    console.log(ifcDataString);


    ifcThree.LoadAllGeometry(scene, model);


    ifcAPI.CloseModel(model);

    let m2 = ifcAPI.OpenModel(ifcDataString);
    ifcThree.LoadAllGeometry(scene, m2);

}

//@ts-ignore
window.InitMonaco = (monaco: any) => {
    console.log(ts_decl.ifc2x4);
    // validation settings
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false
    });
    
    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES6,
        allowNonTsExtensions: true,
    });
    //@ts-ignore
    console.log(monaco.languages.typescript.typescriptDefaults.addExtraLib(ts_decl.ifc2x4));
    console.log(monaco.languages.typescript.typescriptDefaults.addExtraLib(ts_decl.ifc2x4helper));
    console.log(monaco.languages.typescript.typescriptDefaults.addExtraLib(ts_decl.wifcapi));
}

async function initMonacoEditor(monacoEditor: Monaco.editor.IStandaloneCodeEditor)
{
    let exampleCode = await(await fetch('example.ts')).text();
    console.log(exampleCode);
    

    let item = window.localStorage.getItem("code");
    console.log(item);

    if (item)
    {
        monacoEditor.setValue(item);
    }
    else
    {
        monacoEditor.setValue(exampleCode);
    }

    monacoEditor.onDidChangeModelContent((e) => {
        if (timeout)
        {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => Edited(monacoEditor), 1000);
    });

    setTimeout(() => {
        Edited(monacoEditor);
    }, 1000);
}

//@ts-ignore
window.InitWebIfcViewer = async (monacoEditor: Monaco.editor.IStandaloneCodeEditor) => {
    await initMonacoEditor(monacoEditor);
  await ifcAPI.Init();
  const fileInput = document.getElementById('finput');
  fileInput.addEventListener('change', fileInputChanged);
  Init3DView();
};

async function fileInputChanged() {
  let fileInput = <HTMLInputElement>document.getElementById('finput');
  if (fileInput.files.length == 0) return console.log('No files selected!');
  const file = fileInput.files[0];
  const reader = getFileReader(fileInput);
  reader.readAsArrayBuffer(file);
}

function getFileReader(fileInput: HTMLInputElement){
  var reader = new FileReader();
  reader.onload = () => {
    const data = getData(reader);
    LoadModel(data);
    fileInput.value = '';
  };
  return reader;
}

function getData(reader : FileReader){
  const startRead = ms();
  //@ts-ignore
  const data = new Uint8Array(reader.result);
  const readTime = ms() - startRead;
  console.log(`Reading took ${readTime} ms`);
  return data;
}

function LoadModel(data: Uint8Array) {
    const start = ms();
    const modelID = ifcAPI.OpenModel(data, { COORDINATE_TO_ORIGIN: true, USE_FAST_BOOLS: false });
    const time = ms() - start;
    console.log(`Opening model took ${time} ms`);
    ifcThree.LoadAllGeometry(scene, modelID);

    // log errors to console
    let errors = ifcAPI.GetAndClearErrors(modelID);
    for (let i = 0; i < errors.size(); i++)
    {
        console.log(errors.get(i));
    }
}