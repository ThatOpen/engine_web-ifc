import { IfcAPI, ms } from '../../dist/web-ifc-api';
import { IfcThree } from './web-ifc-three';
import { Init3DView, scene } from './web-ifc-scene';

let ifcAPI = new IfcAPI();
let ifcThree = new IfcThree(ifcAPI);

//@ts-ignore
window.InitWebIfcViewer = async () => {
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
    const modelID = ifcAPI.OpenModel('example.ifc', data);
    const time = ms() - start;
    console.log(`Opening model took ${time} ms`);
    ifcThree.LoadAllGeometry(scene, modelID);
}