import * as THREE from "three";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import * as path from "path"
import {IfcAPI} from "../../dist/web-ifc-api-node.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import AdmZip from 'adm-zip';

const REGRESSION_FILES_DIR = "./tests/ifcfiles/public/";

var materials = {};

async function RunRegression()
{
    const ifcAPI = new IfcAPI();
    await ifcAPI.Init();
    let files = await GetRegressionFiles();
    for (let file of files) await CreateModel(ifcAPI, file);
}

async function GetRegressionFiles()
{
    return readdirSync(REGRESSION_FILES_DIR).filter((f) => ( f.endsWith(".ifc") || f.endsWith(".ifczip")) ).map((f) => path.join(REGRESSION_FILES_DIR, f));
}

async function CreateModel(ifcAPI, filename)
{
  let ifcdata;
  if (filename.includes(".ifczip"))  {
        let zip = new AdmZip(filename);
        zip.getEntries().forEach(function (zipEntry) {
            ifcdata = zipEntry.getData();
        });
  } else ifcdata = readFileSync(filename);
  
  let modelID = ifcAPI.OpenModel(ifcdata);
  let geometries = [];
  ifcAPI.StreamAllMeshes(modelID, (mesh) => {
    const placedGeometries = mesh.geometries;
    for (let i = 0; i < placedGeometries.size(); i++) {
      const placedGeometry = placedGeometries.get(i);
      let mesh = getPlacedGeometry(ifcAPI,modelID, placedGeometry);
      let geom = mesh.geometry.applyMatrix4(mesh.matrix);
      geometries.push(geom);
    }
  });

  console.log("Parsing Model:"+filename+"Loading " + geometries.length +" geometries");
  if (geometries.length > 0) {
    const combinedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
    const mat = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
    mat.vertexColors = true;
    const mergedMesh = new THREE.Mesh(combinedGeometry, mat);
    const scene = new THREE.Scene();
    scene.add(mergedMesh);
    const exporter = new STLExporter();
    const result = exporter.parse(scene, { binary: true });
    let newFileName=filename.replace(".ifczip",".stl").replace(".ifc",".stl");
    writeFileSync(newFileName, result, "utf-8");
  }
}

function getPlacedGeometry(ifcAPI,modelID, placedGeometry) {
  const geometry = getBufferGeometry(ifcAPI, modelID, placedGeometry);
  const material = getMeshMaterial(placedGeometry.color);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.matrix = getMeshMatrix(placedGeometry.flatTransformation);
  mesh.matrixAutoUpdate = false;
  return mesh;
}

function getBufferGeometry(ifcAPI,modelID, placedGeometry) {
  const geometry = ifcAPI.GetGeometry(
    modelID,
    placedGeometry.geometryExpressID
  );
  const verts = ifcAPI.GetVertexArray(
    geometry.GetVertexData(),
    geometry.GetVertexDataSize()
  );
  const indices = ifcAPI.GetIndexArray(
    geometry.GetIndexData(),
    geometry.GetIndexDataSize()
  );
  const bufferGeometry = ifcGeometryToBuffer(
    placedGeometry.color,
    verts,
    indices
  );
  geometry.delete();
  return bufferGeometry;
}

function getMeshMaterial(color) {
  let colID = `${color.x}${color.y}${color.z}${color.w}`;
  if (materials[colID]) {
    return materials[colID];
  }

  const col = new THREE.Color(color.x, color.y, color.z);
  const material = new THREE.MeshStandardMaterial({
    color: col,
    side: THREE.DoubleSide,
  });
  material.transparent = color.w !== 1;
  if (material.transparent) material.opacity = color.w;

  materials[colID] = material;

  return material;
}

function getMeshMatrix(matrix) {
  const mat = new THREE.Matrix4();
  mat.fromArray(matrix);
  return mat;
}

function ifcGeometryToBuffer(color, vertexData, indexData) {
  const geometry = new THREE.BufferGeometry();
  let posFloats = new Float32Array(vertexData.length / 2);
  let normFloats = new Float32Array(vertexData.length / 2);
  let colorFloats = new Float32Array(vertexData.length / 2);

  for (let i = 0; i < vertexData.length; i += 6) {
    posFloats[i / 2 + 0] = vertexData[i + 0];
    posFloats[i / 2 + 1] = vertexData[i + 1];
    posFloats[i / 2 + 2] = vertexData[i + 2];

    normFloats[i / 2 + 0] = vertexData[i + 3];
    normFloats[i / 2 + 1] = vertexData[i + 4];
    normFloats[i / 2 + 2] = vertexData[i + 5];

    colorFloats[i / 2 + 0] = color.x;
    colorFloats[i / 2 + 1] = color.y;
    colorFloats[i / 2 + 2] = color.z;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(posFloats, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normFloats, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colorFloats, 3));
  geometry.setIndex(new THREE.BufferAttribute(indexData, 1));
  return geometry;
}

RunRegression();
