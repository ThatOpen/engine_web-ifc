import * as WebIFC from "../../../dist/web-ifc-api-node.js";
// import * as WebIFC from "web-ifc";
import { Equals, WithIFCFileLoaded, TestInfo } from "./utils";

export default async function() {
    await WithIFCFileLoaded("geometrystream", (ifcapi: WebIFC.IfcAPI, modelID: number, info: TestInfo) => {

        let totalSizeVerts = 0;
        let totalSizeIndices = 0;

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

        Equals("total num vertices", totalSizeVerts, 186234);
        Equals("total num indices", totalSizeIndices, 45147);
    });
}