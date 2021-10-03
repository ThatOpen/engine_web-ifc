import * as WebIFC from "../../dist";
import { IfcAPI, ms } from '../../dist';
import { IfcThree } from './web-ifc-three';
import { Init3DView, InitBasicScene, scene } from './web-ifc-scene';
import * as Monaco from 'monaco-editor';
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

    code = code.replace('import * as WebIFC from "web-ifc";', '');

    let compiled = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS }})

    // this is where we do evil stuff
    {
        console.log(` --- Starting EVAL!`);
        eval(compiled.outputText + `BuildModel(model, ifcAPI)`);
        console.log(` --- Ending EVAL!`);
    }

    let ifcData = ifcAPI.ExportFileAsIFC(model);
    let ifcDataString = new TextDecoder().decode(ifcData);


    ifcThree.LoadAllGeometry(scene, model);


    ifcAPI.CloseModel(model);

    let m2 = ifcAPI.OpenModel(ifcDataString);
    ifcThree.LoadAllGeometry(scene, m2);

}

//@ts-ignore
window.InitMonaco = async (monaco: any) => {

    const ts_decl = [
        await(await fetch('../../dist/ifc2x4.d.ts')).text(),
        await(await fetch('../../dist/ifc2x4_helper.d.ts')).text(),
        await(await fetch('../../dist/web-ifc-api.d.ts')).text(),
    ]
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
    
    console.log(monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `declare module 'web-ifc' { ${ ts_decl.join('\n')} }`,
    ));
}

async function initMonacoEditor(monacoEditor: Monaco.editor.IStandaloneCodeEditor)
{
    let exampleCode = await(await fetch('example.ts')).text();
    // exampleCode = exampleCode.replace('import * as WebIFC from "../../dist";', '');
    exampleCode = exampleCode.replace('import * as WebIFC from "../../dist";', 'import * as WebIFC from "web-ifc";');
    // exampleCode = exampleCode.replace('import * as WebIFC from "web-ifc";', '');

    let item = window.localStorage.getItem("code");

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