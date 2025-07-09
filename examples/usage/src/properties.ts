import * as WebIFC from "../../../dist/web-ifc-api-node.js";
import { Equals, WithIFCFileLoaded } from "./utils";

export default async function() {
    await WithIFCFileLoaded("single_propertyset", (ifcapi: WebIFC.IfcAPI, modelID: number) => {

        // this returns a propertyset object at line number 244
        let propertySetFlattened = ifcapi.GetLine(modelID, 244, true) as WebIFC.IFC2X3.IfcPropertySet;
        // check some relevant fields of ifcpropertyset
        Equals("ID", propertySetFlattened.expressID, 244);
        Equals("Type", propertySetFlattened.type, WebIFC.IFCPROPERTYSET);
        Equals("GUID", propertySetFlattened.GlobalId!.value, "0uNK5AgoP1Vw6UlaHiS$iF");
        Equals("Description", propertySetFlattened.Description, null);
        Equals("Name", propertySetFlattened.Name!.value, "Pset_ColumnCommon");

        // look at the properties inside
        let props = propertySetFlattened.HasProperties as WebIFC.IFC2X3.IfcPropertySingleValue[];
        Equals("Num props", props.length, 3);

        // check the value of the first property, should be an identifier of 300x300
        Equals("Prop 0 label", props![0].NominalValue!.constructor.name, "IfcIdentifier");
        Equals("Prop 0 value", props![0].NominalValue!.value, "300x300");
    });

    await WithIFCFileLoaded("all_propertysets", (ifcapi: WebIFC.IfcAPI, modelID: number) => {

        // grab all propertyset lines in the file
        let lines = ifcapi.GetLineIDsWithType(modelID, WebIFC.IFCPROPERTYSET);

        // count number of properties
        let numPropsCount = 0;

        for (let i = 0; i < lines.size(); i++)
        {
            let expressID = lines.get(i);
            if (expressID !== 0)
            {
                let propertySet = ifcapi.GetLine(modelID, expressID) as WebIFC.IFC2X3.IfcPropertySet;
                numPropsCount += propertySet.HasProperties.length;
            }
        }

        Equals("num props", numPropsCount, 1061);
    });

    await WithIFCFileLoaded("properties_for_element", (ifcapi: WebIFC.IfcAPI, modelID: number) => {

        // IFCWall
        let elementID = 2186;

        let element = ifcapi.GetLine(modelID, elementID);
        console.log(`Listing properties for element: ${element.GlobalId.value}`);

        // grab all propertyset lines in the file
        let lines = ifcapi.GetLineIDsWithType(modelID, WebIFC.IFCRELDEFINESBYPROPERTIES);

        let propSetIds: any = [];
        for (let i = 0; i < lines.size(); i++)
        {
            let relID = lines.get(i);
            let rel = ifcapi.GetLine(modelID, relID) as WebIFC.IFC2X3.IfcRelDefinesByProperties;
            let foundElement = false;
            rel.RelatedObjects.forEach((relID: any ) => {
                if (typeof relID.value != "undefined" &&  relID.value === elementID)
                {
                    foundElement = true;
                }
            })

            if (foundElement)
            {
                if (!Array.isArray(rel.RelatingPropertyDefinition))
                {
                    let handle = rel.RelatingPropertyDefinition as WebIFC.Handle<WebIFC.IFC2X3.IfcPropertySetDefinition>;
                    propSetIds.push(handle.value);
                }
            }
        }

        // count number of properties
        let propsets = propSetIds.map((id:number) => ifcapi.GetLine(modelID, id, true));

        Equals("num propsets", propsets.length, 5);

        let props: any = [];
        propsets.forEach((set:any) => {
            set.HasProperties.forEach((p:any) => {
                console.log(`${set.Name.value}/${p.Name.value}:  ${p.NominalValue.value}`);
                console.log(p);
                props.push(p);
            });
        });

        Equals("num props", props.length, 9);
    });
}