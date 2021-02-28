var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true})), module2);
};

// lib/web-ifc-three.ts
__markAsModule(exports);
__export(exports, {
  IfcThree: () => IfcThree
});
var THREE = __toModule(require("three"));

// lib/web-ifc-api.ts
function ms() {
  return new Date().getTime();
}

// lib/web-ifc-three.ts
var IfcThree = class {
  constructor(ifcAPI) {
    this.ifcAPI = ifcAPI;
  }
  LoadAllGeometry(scene, modelID) {
    const flatMeshes = this.getFlatMeshes(modelID);
    const startUploadingTime = ms();
    for (let i = 0; i < flatMeshes.size(); i++) {
      const placedGeometries = flatMeshes.get(i).geometries;
      for (let j = 0; j < placedGeometries.size(); j++)
        scene.add(this.getPlacedGeometry(modelID, placedGeometries.get(j)));
    }
    console.log(`Uploading took ${ms() - startUploadingTime} ms`);
  }
  getFlatMeshes(modelID) {
    const startGeomTime = ms();
    const flatMeshes = this.ifcAPI.LoadAllGeometry(modelID);
    const endGeomTime = ms();
    console.log(`Loaded ${flatMeshes.size()} flatMeshes`);
    console.log(`Loading geometry took ${endGeomTime - startGeomTime} ms`);
    return flatMeshes;
  }
  getPlacedGeometry(modelID, placedGeometry) {
    const geometry = this.getBufferGeometry(modelID, placedGeometry);
    const material = this.getMeshMaterial(placedGeometry.color);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.matrix = this.getMeshMatrix(placedGeometry.flatTransformation);
    mesh.matrixAutoUpdate = false;
    return mesh;
  }
  getBufferGeometry(modelID, placedGeometry) {
    const geometry = this.ifcAPI.GetGeometry(modelID, placedGeometry.geometryExpressID);
    const verts = this.ifcAPI.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
    const indices = this.ifcAPI.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());
    const bufferGeometry = this.ifcGeometryToBuffer(verts, indices);
    return bufferGeometry;
  }
  getMeshMaterial(color) {
    const col = new THREE.Color(color.x, color.y, color.z);
    const material = new THREE.MeshPhongMaterial({color: col});
    material.transparent = color.w !== 1;
    if (material.transparent)
      material.opacity = color.w;
    return material;
  }
  getMeshMatrix(matrix) {
    const mat = new THREE.Matrix4();
    mat.fromArray(matrix);
    mat.elements[15 - 3] *= 1e-3;
    mat.elements[15 - 2] *= 1e-3;
    mat.elements[15 - 1] *= 1e-3;
    return mat;
  }
  ifcGeometryToBuffer(vertexData, indexData) {
    const geometry = new THREE.BufferGeometry();
    const buffer32 = new THREE.InterleavedBuffer(vertexData, 6);
    geometry.setAttribute("position", new THREE.InterleavedBufferAttribute(buffer32, 3, 0));
    geometry.setAttribute("normal", new THREE.InterleavedBufferAttribute(buffer32, 3, 3));
    geometry.setIndex(new THREE.BufferAttribute(indexData, 1));
    return geometry;
  }
};
