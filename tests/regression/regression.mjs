import * as THREE from "three";
import { readFileSync, writeFileSync, readdirSync,readSync, openSync } from "fs";
import * as path from "path"
const {createHash} = await import('node:crypto');
import {IfcAPI} from "../../dist/web-ifc-api-node.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Blob, FileReader } from 'vblob';
global.Blob = Blob;
global.FileReader = FileReader;
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import AdmZip from 'adm-zip';

const REGRESSION_FILES_DIR = "./tests/ifcfiles/";
const REGRESSION_RESULT_FILE = "./tests/regression/results.json";

var materials = {};
var ifcAPI;
var regressionResults = {};


async function RunRegression()
{
    try {
      let update = false;
      if (process.argv.includes("update")) update = true;
      ifcAPI = new IfcAPI();
      await ifcAPI.Init();
      let files = await GetRegressionFiles();
      for (let fileName of files) {
        let properFileName = fileName.replaceAll("\\","/");
        regressionResults[properFileName] = await CreateModelResuts(fileName);
        regressionResults[properFileName] = createHash('sha256').update(JSON.stringify(regressionResults[properFileName])).digest('hex');

      }
      if (update) {
          writeFileSync(REGRESSION_RESULT_FILE, JSON.stringify(regressionResults));
        console.log("--------Results Updated-----------");
      } else {
        let regressionResultsCurrent = JSON.parse(readFileSync(REGRESSION_RESULT_FILE));
        console.log("--------Regression Results-----------");
        let passTests = true;
        try {
          for (let fileName in regressionResults) {
              fileName = fileName.replaceAll("\\","/");
              if (fileName in regressionResultsCurrent) {
                if (regressionResultsCurrent[fileName] == regressionResults[fileName]) console.log(fileName+"- PASS");
                else {
                  console.log(fileName+"- FAIL");
                  passTests = false;
                }
              } else console.log("Could not find:"+fileName);
          }
        } catch (e) {
          console.log(e);
        }
        if (!passTests) {
          console.log("One or models failed - please verify the models and if you are happy run npm run regression-update");
          process.exit(1);
        }
      }
    } catch (e) {
      console.log(e);
    }
}

async function GetRegressionFiles()
{
    let files = readdirSync(REGRESSION_FILES_DIR+"public/").filter((f) => ( f.endsWith(".ifc") || f.endsWith(".ifczip")) ).map((f) => path.join(REGRESSION_FILES_DIR+"public/", f));
    let privateFiles = [];
    try {
      privateFiles = await readdirSync(REGRESSION_FILES_DIR+"private/").filter((f) => ( f.endsWith(".ifc") || f.endsWith(".ifczip")) ).map((f) => path.join(REGRESSION_FILES_DIR+"private/", f));
    } catch (e) {}
    return files.concat(privateFiles);
}

async function CreateModelResuts(filename)
{
  let modelID;
  console.log("Parsing:"+filename);
  if (filename.includes(".ifczip"))  {
        let zip = new AdmZip(filename);
        zip.getEntries().forEach(function (zipEntry) {
            let ifcdata = zipEntry.getData();
            modelID = ifcAPI.OpenModel(ifcdata);
        });
  } else {
    let file = openSync(filename);
    let retriever = function (offset, size) {
            let data = new Uint8Array(size);
            let bytesRead = readSync(file,data,0,size,offset);            
            if (bytesRead <= 0 ) return new Uint8Array(0);
            return data;       
        }
      try {
        modelID = ifcAPI.OpenModelFromCallback(retriever);
      } catch (e) {
        console.log(e);
      }
  }
  let geometries = [];
  ifcAPI.StreamAllMeshes(modelID, (mesh) => {
    const placedGeometries = mesh.geometries;
    for (let i = 0; i < placedGeometries.size(); i++) {
      const placedGeometry = placedGeometries.get(i);
      let mesh = getPlacedGeometry(modelID, placedGeometry);
      let geom = mesh.geometry.applyMatrix4(mesh.matrix);
      geometries.push(geom);
    }
  });

  console.log("Parsed Model:"+filename+"Loading " + geometries.length +" geometries");
  if (geometries.length > 0) {
    const combinedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
    const mat = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
    mat.vertexColors = true;
    const mergedMesh = new THREE.Mesh(combinedGeometry, mat);
    const scene = new THREE.Scene();
    scene.add(mergedMesh);
    const exporter = new GLTFExporter();
    return new Promise((resolve, reject) => {
        exporter.parse(scene, ( gltf ) => { resolve(gltf);}, (e) => {reject(e);});
    });
  }
}

function getPlacedGeometry(modelID, placedGeometry) {
  const geometry = getBufferGeometry(modelID, placedGeometry);
  const material = getMeshMaterial(placedGeometry.color);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.matrix = getMeshMatrix(placedGeometry.flatTransformation);
  mesh.matrixAutoUpdate = false;
  return mesh;
}

function getBufferGeometry(modelID, placedGeometry) {
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

RunRegression().then( res => console.log("FINISHED"));
