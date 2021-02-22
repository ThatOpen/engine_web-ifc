import * as API from '../lib/web-ifc-api';
import * as THREE from 'three';
import { Init3DView, scene } from './web-ifc-scene';

//@ts-ignore
window.InitWebIfcViewer = async () => {
  //@ts-ignore
  API.SetModule(Module);
  await API.WaitForModuleReady();
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
  const startRead = API.ms();
  //@ts-ignore
  const data = new Uint8Array(reader.result);
  const readTime = API.ms() - startRead;
  console.log(`Reading took ${readTime} ms`);
  return data;
}

function LoadModel(data: Uint8Array) {
  const start = API.ms();
  const modelID = API.OpenModel('example.ifc', data);
  const time = API.ms() - start;
  console.log(`Opening model took ${time} ms`);
  LoadAllGeometry(modelID);
}

function LoadAllGeometry(modelID: number) {
  const flatMeshes = getFlatMeshes(modelID);
  const startUploadingTime = API.ms();
  for (let i = 0; i < flatMeshes.size(); i++) {
    const placedGeometries = flatMeshes.get(i).geometries;
    for (let j = 0; j < placedGeometries.size(); j++)
      addPlacedGeometry(modelID, placedGeometries.get(j));
  }
  console.log(`Uploading took ${API.ms() - startUploadingTime} ms`);
}

function getFlatMeshes(modelID: number) {
  const startGeomTime = API.ms();
  const flatMeshes: any = API.LoadAllGeometry(modelID);
  const endGeomTime = API.ms();
  console.log(`Loaded ${flatMeshes.size()} flatMeshes`);
  console.log(`Loading geometry took ${endGeomTime - startGeomTime} ms`);
  return flatMeshes;
}

function addPlacedGeometry(modelID: number, placedGeometry: any) {
  const geometry = getBufferGeometry(modelID, placedGeometry);
  const material = getMeshMaterial(placedGeometry.color);
  const mesh = new THREE.Mesh(geometry, material);
  // mesh.frustumCulled = false; why?
  mesh.matrix = getMeshMatrix(placedGeometry.flatTransformation);
  mesh.matrixAutoUpdate = false;
  scene.add(mesh);
}

function getBufferGeometry(modelID: number, placedGeometry: any) {
  //@ts-ignore
  const m: any = Module;
  const geometry = m.GetGeometry(modelID, placedGeometry.geometryExpressID);
  const verts = getSubArray(m.HEAPF32, geometry.GetVertexData(), geometry.GetVertexDataSize());
  const indices = getSubArray(m.HEAPU32, geometry.GetIndexData(), geometry.GetIndexDataSize());
  const bufferGeometry = ifcGeometryToBuffer(verts, indices);
  return bufferGeometry;
}

function getMeshMaterial(color: any) {
  const col = new THREE.Color(color.x, color.y, color.z);
  const material = new THREE.MeshPhongMaterial({ color: col });
  material.transparent = color.w !== 1;
  if (material.transparent) material.opacity = color.w;
  return material;
}

function getMeshMatrix(matrix: Array<number>) {
  const mat = new THREE.Matrix4();
  mat.fromArray(matrix);
  mat.elements[15 - 3] *= 0.001;
  mat.elements[15 - 2] *= 0.001;
  mat.elements[15 - 1] *= 0.001;
  return mat;
}

function ifcGeometryToBuffer(vertexData: Float32Array, indexData: Uint32Array) {
  const geometry = new THREE.BufferGeometry();
  const buffer32 = new THREE.InterleavedBuffer(vertexData, 6);
  geometry.setAttribute('position', new THREE.InterleavedBufferAttribute(buffer32, 3, 0));
  geometry.setAttribute('normal', new THREE.InterleavedBufferAttribute(buffer32, 3, 3));
  geometry.setIndex(new THREE.BufferAttribute(indexData, 1));
  return geometry;
}

function getSubArray(heap, startPtr, sizeBytes) {
  return heap.subarray(startPtr / 4, startPtr / 4 + sizeBytes).slice(0);
}
