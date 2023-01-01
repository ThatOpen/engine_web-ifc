import * as THREE from 'three';
import * as WebIFC from '../../../dist/web-ifc-api.js';
import { LogBegin, LogEnd } from './logger.js';

var ifcApi = null;

function ConvertIfcMesh (modelID, ifcMesh)
{
    let result = new THREE.Object3D ();
    let ifcGeometries = ifcMesh.geometries;
    for (let geometryIndex = 0; geometryIndex < ifcGeometries.size (); geometryIndex++) {
        let ifcGeometry = ifcGeometries.get (geometryIndex);
        let ifcGeometryData = ifcApi.GetGeometry (modelID, ifcGeometry.geometryExpressID);
        let ifcVertices = ifcApi.GetVertexArray (ifcGeometryData.GetVertexData (), ifcGeometryData.GetVertexDataSize ());
        let ifcIndices = ifcApi.GetIndexArray (ifcGeometryData.GetIndexData (), ifcGeometryData.GetIndexDataSize ());

        let positionBuffer = new Float32Array (ifcVertices.length / 2);
        for (let i = 0; i < ifcVertices.length; i += 6) {
            positionBuffer[i / 2 + 0] = ifcVertices[i + 0];
            positionBuffer[i / 2 + 1] = ifcVertices[i + 1];
            positionBuffer[i / 2 + 2] = ifcVertices[i + 2];            
        }

        let matrix = new THREE.Matrix4 ().fromArray (ifcGeometry.flatTransformation);
        let geometry = new THREE.BufferGeometry ();
        geometry.setAttribute ('position', new THREE.BufferAttribute (positionBuffer, 3));
        geometry.setIndex (new THREE.BufferAttribute (ifcIndices, 1));
        geometry.applyMatrix4 (matrix);
        geometry.computeVertexNormals ();

        let material = new THREE.MeshPhongMaterial ({
            color: new THREE.Color (ifcGeometry.color.x, ifcGeometry.color.y, ifcGeometry.color.z),
            opacity: ifcGeometry.color.w,
            transparent: ifcGeometry.color.w !== 1,
            side: THREE.DoubleSide
        });

        let mesh = new THREE.Mesh (geometry, material);
        result.add (mesh);
    }

    return result;
}

function ConvertIfcFileBuffer (fileBuffer)
{
    LogBegin ('Convert IFC to three.js');
    result = new THREE.Object3D ();
    let modelID = ifcApi.OpenModel (fileBuffer, {
        COORDINATE_TO_ORIGIN : true
    });

    let ifcMeshes = ifcApi.LoadAllGeometry (modelID);
    for (let meshIndex = 0; meshIndex < ifcMeshes.size (); meshIndex++) {
        let ifcMesh = ifcMeshes.get (meshIndex);
        if (ifcMesh.geometries.size () > 0) {
            let mesh = ConvertIfcMesh (modelID, ifcMesh);
            result.add (mesh);
        }
    }

    ifcApi.CloseModel (modelID);
    LogEnd ('Convert IFC to three.js');
    return result;
}

function DownloadAndConvertIfcFile (fileUrl, onReady)
{
    LogBegin ('Download file: ' + fileUrl);
    fetch (fileUrl).then (async (response) => {
        let buffer = await response.arrayBuffer ();
        let fileBuffer = new Uint8Array (buffer);
        LogEnd ('Download file: ' + fileUrl);
        let result = ConvertIfcFileBuffer (fileBuffer, onReady);
        onReady (result);
    });
}

export function ConvertIfcToThreeJS (fileUrl, onReady)
{
    if (ifcApi === null) {
        LogBegin ('Init IfcAPI');
        ifcApi = new WebIFC.IfcAPI ();
        ifcApi.SetWasmPath ('');
        ifcApi.Init ().then (() => {
            LogEnd ('Init IfcAPI');
            DownloadAndConvertIfcFile (fileUrl, onReady);
        })
    } else {
        DownloadAndConvertIfcFile (fileUrl, onReady);
    }
}
