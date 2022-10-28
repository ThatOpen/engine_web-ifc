import { IfcAPI, ms } from '../../dist/web-ifc-api';
import { IfcThree } from './web-ifc-three';
import { Init3DView, InitBasicScene, scene } from './web-ifc-scene';
import * as Monaco from 'monaco-editor';
import * as ts_decl from "./ts_src";
import * as ts from "typescript";
import { exampleCode } from './example';

let ifcAPI = new IfcAPI();
ifcAPI.SetWasmPath("wasm/")
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

    let m2 = ifcAPI.OpenModel(ifcData);
    ifcThree.LoadAllGeometry(scene, m2);

}

if (typeof window != 'undefined')
{
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
        allowNonTsExtensions: true
    });
    //@ts-ignore
    console.log(monaco.languages.typescript.typescriptDefaults.addExtraLib(ts_decl.ifc2x4));
    console.log(monaco.languages.typescript.typescriptDefaults.addExtraLib(ts_decl.ifc2x4helper));
    console.log(monaco.languages.typescript.typescriptDefaults.addExtraLib(ts_decl.wifcapi));
}
}

function initMonacoEditor(monacoEditor: Monaco.editor.IStandaloneCodeEditor)
{
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

if (typeof window != 'undefined')
{
//@ts-ignore
window.InitWebIfcViewer = async (monacoEditor: Monaco.editor.IStandaloneCodeEditor) => {
  await ifcAPI.Init();
  initMonacoEditor(monacoEditor);
  const fileInput = document.getElementById('finput');
  fileInput.addEventListener('change', fileInputChanged);
  Init3DView();
};
}

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
    //TODO: This needs to be fixed in the future to rely on elalish/manifold
    const modelID = ifcAPI.OpenModel(data, { COORDINATE_TO_ORIGIN: false, USE_FAST_BOOLS: true }); 
    const time = ms() - start;
    console.log(`Opening model took ${time} ms`);
    ifcThree.LoadAllGeometry(scene, modelID);

    // log errors to console
    let errors = ifcAPI.GetAndClearErrors(modelID);
    for (let i = 0; i < errors.size(); i++)
    {
        console.log(errors.get(i));
    }

    ifcAPI.CloseModel(modelID);
}