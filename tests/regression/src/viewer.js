import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Viewer
{
    constructor ()
    {
        this.renderer = null;
        this.scene = null;
        this.light = null;
        this.camera = null;
        this.controls = null;
        this.mainObject = null;
        this.Init ();
    }

    Init ()
    {
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.renderer = new THREE.WebGLRenderer ({
            antialias : true
        });
        document.body.appendChild (this.renderer.domElement);

        this.renderer.setClearColor ('#fafafa', 1);
        this.renderer.setSize (width, height);

        this.scene = new THREE.Scene ();

        let ambientLight = new THREE.AmbientLight (0x888888);
        this.scene.add (ambientLight);

        this.light = new THREE.DirectionalLight (0x888888);
        this.scene.add (this.light);

        this.camera = new THREE.PerspectiveCamera (45.0, width / height, 0.1, 1000.0);
        this.camera.position.set (-1.5, 2.0, 3.0);
        this.camera.up.set (0.0, 1.0, 0.0);
        this.camera.lookAt (new THREE.Vector3 (0.0, 0.0, 0.0));
        this.scene.add (this.camera);

        this.controls = new OrbitControls (this.camera, this.renderer.domElement);
        this.controls.addEventListener ('change', () => {
            this.Render ();
        });

        window.addEventListener ('resize', () => {
            this.Resize ();
        });

        this.Resize ();
        this.Render ();
    }

    SetMainObject (object)
    {
        this.ClearMainObject ();
        this.mainObject = object;
        this.scene.add (this.mainObject);
        this.Render ();
    }

    ClearMainObject ()
    {
        if (this.mainObject === null) {
            return;
        }

        this.mainObject.traverse ((obj) => {
            if (obj.isMesh) {
                obj.geometry.dispose ();
            }
        });
        this.scene.remove (this.mainObject);
        this.mainObject = null;
    }

    AddBox ()
    {
        let box = new THREE.BoxGeometry (1.0, 1.0, 1.0);
        let material = new THREE.MeshPhongMaterial ({
            color : 0xcc0000
        });

        let mesh = new THREE.Mesh (box, material);

        this.scene.add (mesh);
        this.Render ();
    }

    FitToScreen ()
    {
        let boundingBox = new THREE.Box3 ().setFromObject (this.scene);
        let boundingSphere = new THREE.Sphere ();
        boundingBox.getBoundingSphere (boundingSphere);
        this.FitToSphere (boundingSphere);
    }   

    FitToSphere (boundingSphere)
    {
        let fieldOfView = this.camera.fov / 2.0;
        if (this.camera.aspect < 1.0) {
            fieldOfView = fieldOfView * this.camera.aspect;
        }

        let cameraDir = this.camera.position.clone ().sub (this.controls.target).normalize ();

        this.controls.target = boundingSphere.center;
        let distance = boundingSphere.radius / Math.sin (THREE.Math.degToRad (fieldOfView));
    
        let cameraPos = this.controls.target.clone ().add (cameraDir.clone ().multiplyScalar (distance));
        this.camera.position.set (cameraPos.x, cameraPos.y, cameraPos.z);
        this.controls.update ();
    }    

    Render ()
    {
        let lightDir = new THREE.Vector3 ().subVectors (this.camera.position, this.controls.target);
        this.light.position.set (lightDir.x, lightDir.y, lightDir.z);
        this.renderer.render (this.scene, this.camera);
    }

    Resize ()
    {
        let width = window.innerWidth;
        let height = window.innerHeight;
        if (window.devicePixelRatio) {
            this.renderer.setPixelRatio (window.devicePixelRatio);
        }
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix ();
        this.renderer.setSize (width, height);
        this.Render ();
    }
};
