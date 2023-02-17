import * as WebIFC from "../../../dist/web-ifc-api-node.js";
import { Equals, WithIFCFileLoaded } from "./utils";

export default async function() {
    await WithIFCFileLoaded("geometrystream", (ifcapi: WebIFC.IfcAPI, modelID: number) => {

        let totalSizeVerts = 0;
        let totalSizeIndices = 0;

        // grab all types except SPACE, OPENING and OPENINGSTANDARDCASE
        ifcapi.StreamAllMeshes(modelID, (mesh: WebIFC.FlatMesh) => {
            
            // only during the lifetime of this function call, the geometry is available in memory

            const placedGeometries = mesh.geometries;

            for (let i = 0; i < placedGeometries.size(); i++)
            {
                const placedGeometry = placedGeometries.get(i);
                const geometry = ifcapi.GetGeometry(modelID, placedGeometry.geometryExpressID);
                const verts = ifcapi.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
                const indices = ifcapi.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());

                totalSizeVerts += verts.length;
                totalSizeIndices += indices.length;
            }
        });

        Equals("total num vertices", totalSizeVerts, 181548);
        Equals("total num indices", totalSizeIndices, 43980);
    });

    await WithIFCFileLoaded("partialgeometrystream", (ifcapi: WebIFC.IfcAPI, modelID: number) => {

        let totalSizeVerts = 0;
        let totalSizeIndices = 0;

        // grab all types except IFCCOLUMN
        let types = ifcapi.GetIfcEntityList(modelID).filter((f) => (f !== WebIFC.IFCCOLUMN && ifcapi.IsIfcElement(f)));

        ifcapi.StreamAllMeshesWithTypes(modelID, types, (mesh: WebIFC.FlatMesh) => {
            
            // only during the lifetime of this function call, the geometry is available in memory

            const placedGeometries = mesh.geometries;

            for (let i = 0; i < placedGeometries.size(); i++)
            {
                const placedGeometry = placedGeometries.get(i);
                const geometry = ifcapi.GetGeometry(modelID, placedGeometry.geometryExpressID);
                const verts = ifcapi.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
                const indices = ifcapi.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());

                totalSizeVerts += verts.length;
                totalSizeIndices += indices.length;
            }
        });

        Equals("total num vertices", totalSizeVerts, 132060);
        Equals("total num indices", totalSizeIndices, 32196);
    });
}