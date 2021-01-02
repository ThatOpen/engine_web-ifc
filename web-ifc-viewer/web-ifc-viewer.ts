import * as API from "../web-ifc-js/web-ifc-api";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GeometryBuffer } from "../web-ifc-interop/gen/Types";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
let controls;

async function LoadModel(data: Uint8Array)
{
    let start = API.ms();
    let modelID = API.OpenModel("example.ifc", data);
    let time = API.ms() - start;
    console.log(`Opening model took ${time} ms`);
    
    let slabs = API.GetExpressIdsWithType(modelID, 1529196076).expressIds(); // IFCSLAB
    console.log(slabs);
    for (let i = 0; i < slabs.length; i++)
    {
        let slabEID = slabs[i];
        console.log(`Adding slab ${slabEID}`);
        let flatGeometry = API.GetFlattenedGeometry(modelID, slabEID);
        let threeGeometry = IfcGeometryToThreejs(flatGeometry);
        
        const material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
        let mesh = new THREE.Mesh( threeGeometry, material );
        scene.add( mesh );
    }
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

    var fr = new FileReader();
    fr.onload = function() {
        LoadModel(new Uint8Array(fr.result));
        fileInput.value = '';
    };
    fr.readAsArrayBuffer(file);
}

let cube;

function IfcGeometryToThreejs(buffer: GeometryBuffer): THREE.Geometry
{
    const geometry = new THREE.Geometry();

    let vertices = buffer.vertexData();
    let indices = buffer.indexData();

    // TODO: remove this hack
    let scale = 0.001;

    for (let i = 0; i < vertices.length; i += 3)
    {
        geometry.vertices.push(
            new THREE.Vector3(
                vertices[i + 0] * scale,
                vertices[i + 1] * scale,
                vertices[i + 2] * scale
            )
        );
    }

    for (let i = 0; i < indices.length; i += 3)
    {
        geometry.faces.push( 
            new THREE.Face3( 
                indices[i + 0],
                indices[i + 1],
                indices[i + 2]
            )
        );
    }

    return geometry;
}

function Init3DView()
{
    renderer.setSize( window.innerWidth * 0.9, window.innerHeight * 0.9);
    document.body.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement )

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;
}

function Update3DView()
{
    requestAnimationFrame( Update3DView );
    
	controls.update();

    renderer.render( scene, camera );
}

//@ts-ignore
window.InitWebIfcViewer = () =>
{
    //@ts-ignore
    API.SetModule(Module);
    let fileInput = document.getElementById("finput");

    fileInput.addEventListener('change', fileInputChanged);

    Init3DView();
    Update3DView();
}