import * as WebIFC from "../../dist/web-ifc-api-node.js";
import { Equals, WithIFCFileLoaded } from "./utils";

export default async function() {
    await WithIFCFileLoaded("single_properties_test", (ifcapi: WebIFC.IfcAPI, modelID: number) => {

        // this returns a propertyset object at line number 244
        let propertySetFlattened = ifcapi.GetLine(modelID, 244, true) as WebIFC.IfcPropertySet;

        // check some relevant fields of ifcpropertyset
        Equals("ID", propertySetFlattened.expressID, 244);
        Equals("Type", propertySetFlattened.type, WebIFC.IFCPROPERTYSET);
        Equals("GUID", propertySetFlattened.GlobalId.value, "0uNK5AgoP1Vw6UlaHiS$iF");
        Equals("Description", propertySetFlattened.Description, null);
        Equals("Name", propertySetFlattened.Name.value, "Pset_ColumnCommon");

        // look at the properties inside
        let props = propertySetFlattened.HasProperties as WebIFC.IfcPropertySingleValue[];
        Equals("Num props", props.length, 3);

        // check the value of the first property, should be an identifier of 300x300
        Equals("Prop 0 label", props[0].NominalValue.label, "IFCIDENTIFIER");
        Equals("Prop 0 value", props[0].NominalValue.value, "300x300");
    });

    await WithIFCFileLoaded("all_properties_test", (ifcapi: WebIFC.IfcAPI, modelID: number) => {

        // grab all propertyset lines in the file
        let lines = ifcapi.GetLineIDsWithType(modelID, WebIFC.IFCPROPERTYSET);

        // count number of properties
        let numPropsCount = 0;

        for (let i = 0; i < lines.size(); i++)
        {
            let expressID = lines.get(i);
            if (expressID !== 0)
            {
                let propertySet = ifcapi.GetLine(modelID, expressID) as WebIFC.IfcPropertySet;
                numPropsCount += propertySet.HasProperties.length;
            }
        }

        Equals("num props", numPropsCount, 1061);
    });
}