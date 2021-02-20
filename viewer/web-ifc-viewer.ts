import * as API from "../lib/web-ifc-api";
import * as IfcSchema from "../lib/ifc2x4";

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ antialias: true });
let controls;

function GetSubArray(heap, startPtr, sizeBytes)
{
    return heap.subarray(startPtr / 4, startPtr / 4 + sizeBytes).slice(0);
}

function IfcGeometryToBuffer(vertexData: Float32Array, indexData: Uint32Array): THREE.BufferGeometry
{
    const geometry = new THREE.BufferGeometry();

    const interleavedBuffer32 = new THREE.InterleavedBuffer( vertexData, 6 );

    geometry.setAttribute( 'position', new THREE.InterleavedBufferAttribute( interleavedBuffer32, 3, 0 ) );
    geometry.setAttribute( 'normal', new THREE.InterleavedBufferAttribute( interleavedBuffer32, 3, 3 ) );
   
    geometry.setIndex(new THREE.BufferAttribute(indexData, 1));


    return geometry;
}

function AddPlacedGeometry(geometry: THREE.BufferGeometry, matrix: any, color: any)
{
    let col = new THREE.Color(color.x, color.y, color.z);
    const material = new THREE.MeshPhongMaterial( { color: col } );
    if (color.w !== 1)
    {
        material.transparent = true;
        material.opacity = color.w;
    }
    let mesh = new THREE.Mesh( geometry, material );
    mesh.frustumCulled = false;
    const m = new THREE.Matrix4();
    m.fromArray(matrix);
    m.elements[15 - 3] *= 0.001;
    m.elements[15 - 2] *= 0.001;
    m.elements[15 - 1] *= 0.001;
    mesh.matrix = m;
    mesh.matrixAutoUpdate = false;

    scene.add( mesh );
}

function LoadAllGeometry(modelID: number)
{
    let startGeomTime = API.ms();
    let flatMeshes: any = API.LoadAllGeometry(modelID);
    let endGeomTime = API.ms();
    let size = flatMeshes.size();
    console.log(`Loaded ${size} flatMeshes`);
    //@ts-ignore
    let m: any = Module;
    for (let i = 0; i < size; i++)
    {
        let mesh = flatMeshes.get(i);
        let placedGeometries = mesh.geometries;
        let numPlacedGeometries = placedGeometries.size();
        for (let j = 0; j < numPlacedGeometries; j++)
        {
            let placedGeometry = placedGeometries.get(j);
            //@ts-ignore
            let ifcGeometry = Module.GetGeometry(modelID, placedGeometry.geometryExpressID);
            //console.log(placedGeometry);
            //console.log(ifcGeometry.GetVertexData());
            //console.log(ifcGeometry.GetVertexDataSize());
            //console.log(ifcGeometry.GetVertexData());
            //console.log(ifcGeometry.GetVertexDataSize());
            let verts = GetSubArray(m.HEAPF32, ifcGeometry.GetVertexData(), ifcGeometry.GetVertexDataSize());
            let indices = GetSubArray(m.HEAPU32, ifcGeometry.GetIndexData(), ifcGeometry.GetIndexDataSize());
            let bufferGeometry = IfcGeometryToBuffer(verts, indices);
            AddPlacedGeometry(bufferGeometry, placedGeometry.flatTransformation, placedGeometry.color);
        }
    }
    let endUploadTime = API.ms();
    let totalGeomTime = endGeomTime - startGeomTime;
    console.log(`Loading geometry took ${totalGeomTime} ms`);
    console.log(`Uploading took ${endUploadTime - endGeomTime} ms`);
}

function LoadModel(data: Uint8Array)
{
    let start = API.ms();
    let modelID = API.OpenModel("example.ifc", data);
    let time = API.ms() - start;
    console.log(`Opening model took ${time} ms`);

    LoadAllGeometry(modelID);
}

async function fileInputChanged()
{
    let fileInput = document.getElementById("finput");

    console.log("change");
    if (fileInput.files.length == 0)
    {
        console.log("No files selected!");
        return;
    }

    var file = fileInput.files[0];

    console.log("Waiting for wasm module");
    // await API.WaitForModuleReady();
    console.log("Done");

    let startRead = API.ms();
    var fr = new FileReader();
    fr.onload = function() {
        let data = new Uint8Array(fr.result);
        let readTime = API.ms() - startRead;
        console.log(`Reading took ${readTime} ms`);
        LoadModel(data);
        fileInput.value = '';
    };
    fr.readAsArrayBuffer(file);
}

let cube;

function Init3DView()
{
    renderer.setSize( window.innerWidth * 0.9, window.innerHeight * 0.9);
    document.body.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement )

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    
    const directionalLight1 = new THREE.DirectionalLight( 0xffeeff, 0.8 );
    directionalLight1.position.set(1, 1, 1);
    scene.add( directionalLight1 );
    
    const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.8 );
    directionalLight2.position.set(-1, 0.5, -1);
    scene.add( directionalLight2 );
    
    
    const ambientLight = new THREE.AmbientLight( 0xffffee, 0.25 );
    scene.add( ambientLight );

    scene.background = new THREE.Color(0x8cc7de)

    camera.position.z = 5;
}

function Update3DView()
{
    requestAnimationFrame( Update3DView );
    
	controls.update();

    renderer.render( scene, camera );
}

//@ts-ignore
window.InitWebIfcViewer = async () =>
{
    //@ts-ignore
    let m: any = Module;

    //@ts-ignore
    API.SetModule(m);
    //@ts-ignore
    console.log(m);
    await API.WaitForModuleReady();

    let fileInput = document.getElementById("finput");
    let textInput = document.getElementById("tinput");
    let streamButton = document.getElementById("bstream");

    fileInput.addEventListener('change', fileInputChanged);

    Init3DView();
    Update3DView();
}