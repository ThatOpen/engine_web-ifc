/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
import * as THREE from "three";
import { IfcAPI, ms, PlacedGeometry, Color, FlatMesh, IFCSITE } from "../../dist/web-ifc-api";
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
  
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

        const startUploadingTime = ms();

        /*
        const flatMeshes = this.getFlatMeshes(modelID);
        for (let i = 0; i < flatMeshes.size(); i++) {
            // console.log(flatMeshes.get(i).expressID);
            const placedGeometries = flatMeshes.get(i).geometries;
            for (let j = 0; j < placedGeometries.size(); j++)
                scene.add(this.getPlacedGeometry(modelID, placedGeometries.get(j)));
        }
        */

        let geometries = [];
        let transparentGeometries = [];

        this.ifcAPI.StreamAllMeshes(modelID, (mesh: FlatMesh) => {
            // only during the lifetime of this function call, the geometry is available in memory
            const placedGeometries = mesh.geometries;

            for (let i = 0; i < placedGeometries.size(); i++)
            {
                const placedGeometry = placedGeometries.get(i);
                let mesh = this.getPlacedGeometry(modelID, placedGeometry);
                let geom = mesh.geometry.applyMatrix4(mesh.matrix);
                if (placedGeometry.color.w !== 1)
                {
                    transparentGeometries.push(geom);
                }
                else
                {
                    geometries.push(geom);
                }
            }

            //console.log(this.ifcAPI.wasmModule.HEAPU8.length);
        });

        console.log("Loading "+geometries.length+" geometries and "+transparentGeometries.length+" transparent geometries");
        if (geometries.length > 0)
        { 
            const combinedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
            let mat = new THREE.MeshPhongMaterial({side:THREE.DoubleSide});
            mat.vertexColors = true;
            const mergedMesh = new THREE.Mesh(combinedGeometry, mat);
            scene.add(mergedMesh);
        }

        if (transparentGeometries.length > 0)
        {
            const combinedGeometryTransp = BufferGeometryUtils.mergeGeometries(transparentGeometries);
            let matTransp = new THREE.MeshPhongMaterial({side:THREE.DoubleSide});
            matTransp.vertexColors = true;
            matTransp.transparent = true;
            matTransp.opacity = 0.5;
            const mergedMeshTransp = new THREE.Mesh(combinedGeometryTransp, matTransp);
            scene.add(mergedMeshTransp);
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
        mesh.matrix = this.getMeshMatrix(placedGeometry.flatTransformation);
        mesh.matrixAutoUpdate = false;
        return mesh;
    }
    
    private getBufferGeometry(modelID: number, placedGeometry: PlacedGeometry) {
        // WARNING: geometry must be deleted when requested from WASM
        const geometry = this.ifcAPI.GetGeometry(modelID, placedGeometry.geometryExpressID);
        const verts = this.ifcAPI.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
        const indices = this.ifcAPI.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());
        const bufferGeometry = this.ifcGeometryToBuffer(placedGeometry.color, verts, indices);

        //@ts-ignore
        geometry.delete();
        return bufferGeometry;
    }

    private materials = {};
    
    private getMeshMaterial(color: Color) {
        let colID = `${color.x}${color.y}${color.z}${color.w}`;
        if (this.materials[colID])
        {
            return this.materials[colID];
        }

        const col = new THREE.Color(color.x, color.y, color.z);
        const material = new THREE.MeshPhongMaterial({ color: col, side: THREE.DoubleSide });
        material.transparent = color.w !== 1;
        if (material.transparent) material.opacity = color.w;

        this.materials[colID] = material;

        return material;
    }
    
    private getMeshMatrix(matrix: Array<number>) {
        const mat = new THREE.Matrix4();
        mat.fromArray(matrix);
        return mat;
    }
    
    private ifcGeometryToBuffer(color: Color, vertexData: Float32Array, indexData: Uint32Array) {
        const geometry = new THREE.BufferGeometry();
        /*
        const buffer32 = new THREE.InterleavedBuffer(vertexData, 6);
        geometry.setAttribute('position', new THREE.InterleavedBufferAttribute(buffer32, 3, 0));
        geometry.setAttribute('normal', new THREE.InterleavedBufferAttribute(buffer32, 3, 3));
        */

        let posFloats = new Float32Array(vertexData.length / 2);
        let normFloats = new Float32Array(vertexData.length / 2);
        let colorFloats = new Float32Array(vertexData.length / 2);

        for (let i = 0; i < vertexData.length; i += 6)
        {
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
       
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(posFloats, 3));
        geometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(normFloats, 3));
        geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(colorFloats, 3));
        geometry.setIndex(new THREE.BufferAttribute(indexData, 1));
        return geometry;
    }
}