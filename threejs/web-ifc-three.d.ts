import * as THREE from "three";
import { IfcAPI } from "web-ifc";
export declare class IfcThree {
    private ifcAPI;
    /**
        Creates an instance of IfcThree, requires a valid instance of IfcAPI
    */
    constructor(ifcAPI: IfcAPI);
    /**
     * Loads all geometry for the model with id "modelID" into the supplied scene
     * @scene Threejs Scene object
     * @modelID Model handle retrieved by OpenModel, model must not be closed
    */
    LoadAllGeometry(scene: THREE.Scene, modelID: number): void;
    private getFlatMeshes;
    private getPlacedGeometry;
    private getBufferGeometry;
    private getMeshMaterial;
    private getMeshMatrix;
    private ifcGeometryToBuffer;
}
