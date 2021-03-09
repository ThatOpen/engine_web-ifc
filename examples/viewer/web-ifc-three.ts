/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
import * as THREE from "three";
import { IfcAPI, ms, PlacedGeometry, Color } from "../../dist/web-ifc-api";
  
export class IfcThree
{
    private ifcAPI: IfcAPI;

    /**
        Creates an instance of IfcThree, requires a valid instance of IfcAPI
    */
    constructor(ifcAPI: IfcAPI)
    {
        this.ifcAPI = ifcAPI;
    }

    /**
     * Loads all geometry for the model with id "modelID" into the supplied scene
     * @scene Threejs Scene object
     * @modelID Model handle retrieved by OpenModel, model must not be closed
    */
    public LoadAllGeometry(scene: THREE.Scene, modelID: number) {
        const flatMeshes = this.getFlatMeshes(modelID);
        const startUploadingTime = ms();
        for (let i = 0; i < flatMeshes.size(); i++) {
            const placedGeometries = flatMeshes.get(i).geometries;
            for (let j = 0; j < placedGeometries.size(); j++)
                scene.add(this.getPlacedGeometry(modelID, placedGeometries.get(j)));
        }
        console.log(`Uploading took ${ms() - startUploadingTime} ms`);
    }
    
    private getFlatMeshes(modelID: number) {
        const startGeomTime = ms();
        const flatMeshes = this.ifcAPI.LoadAllGeometry(modelID);
        const endGeomTime = ms();
        console.log(`Loaded ${flatMeshes.size()} flatMeshes`);
        console.log(`Loading geometry took ${endGeomTime - startGeomTime} ms`);
        return flatMeshes;
    }
    
    private getPlacedGeometry(modelID: number, placedGeometry: PlacedGeometry) {
        const geometry = this.getBufferGeometry(modelID, placedGeometry);
        const material = this.getMeshMaterial(placedGeometry.color);
        const mesh = new THREE.Mesh(geometry, material);
        // mesh.frustumCulled = false; why?
        mesh.matrix = this.getMeshMatrix(placedGeometry.flatTransformation);
        mesh.matrixAutoUpdate = false;
        return mesh;
    }
    
    private getBufferGeometry(modelID: number, placedGeometry: PlacedGeometry) {
        const geometry = this.ifcAPI.GetGeometry(modelID, placedGeometry.geometryExpressID);
        const verts = this.ifcAPI.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
        const indices = this.ifcAPI.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());
        const bufferGeometry = this.ifcGeometryToBuffer(verts, indices);
        return bufferGeometry;
    }
    
    private getMeshMaterial(color: Color) {
        const col = new THREE.Color(color.x, color.y, color.z);
        const material = new THREE.MeshPhongMaterial({ color: col, side: THREE.DoubleSide });
        material.transparent = color.w !== 1;
        if (material.transparent) material.opacity = color.w;
        return material;
    }
    
    private getMeshMatrix(matrix: Array<number>) {
        const mat = new THREE.Matrix4();
        mat.fromArray(matrix);
        return mat;
    }
    
    private ifcGeometryToBuffer(vertexData: Float32Array, indexData: Uint32Array) {
        const geometry = new THREE.BufferGeometry();
        const buffer32 = new THREE.InterleavedBuffer(vertexData, 6);
        geometry.setAttribute('position', new THREE.InterleavedBufferAttribute(buffer32, 3, 0));
        geometry.setAttribute('normal', new THREE.InterleavedBufferAttribute(buffer32, 3, 3));
        geometry.setIndex(new THREE.BufferAttribute(indexData, 1));
        return geometry;
    }
}