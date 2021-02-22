import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1,1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
let controls;

function Init3DView() {
  renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const directionalLight1 = new THREE.DirectionalLight(0xffeeff, 0.8);
  directionalLight1.position.set(1, 1, 1);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight2.position.set(-1, 0.5, -1);
  scene.add(directionalLight2);

  const ambientLight = new THREE.AmbientLight(0xffffee, 0.25);
  scene.add(ambientLight);

  scene.background = new THREE.Color(0x8cc7de);

  camera.position.z = 5;

  AnimationLoop();
}

function AnimationLoop() {
  requestAnimationFrame(AnimationLoop);
  controls.update();
  renderer.render(scene, camera);
}

export { scene, Init3DView };
