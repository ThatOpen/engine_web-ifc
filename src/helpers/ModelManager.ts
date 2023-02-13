import {IfcAPI, STRING} from "../web-ifc-api";
import { IFC2X3, IFC4_3, IFC4 } from "../ifc_schema_helper";
import {  
    Schemas,
    FILE_SCHEMA, 
    FILE_NAME, 
    FILE_DESCRIPTION,
    IFCPROJECT,
    IFCORGANIZATION,
    IFCAPPLICATION,
    IFCCARTESIANPOINT,
    IFCPERSON,
    IFCPERSONANDORGANIZATION,
    IFCOWNERHISTORY
} from "../ifc-schema";

export class ModelManager {
	constructor(private api: IfcAPI) {
    }

	InitModel(modelID: number, modelName?: string) {
        const schema = this.api.modelSchemaList[modelID];
        modelName = modelName || "web-ifc-model-"+modelID+".ifc";

        this.api.wasmModule.WriteHeaderLine(modelID,FILE_DESCRIPTION,[
            {type: STRING, value: ''}, 
            {type: STRING, value: '2;1'}
        ]);
        this.api.wasmModule.WriteHeaderLine(modelID,FILE_NAME,[
            {type: STRING, value: modelName},
            {type: STRING, value: new Date().toISOString()},
            null,
            null,
            {type: STRING, value: "ifcjs/web-ifc-api"},
            {type: STRING, value: "ifcjs/web-ifc-api"},
            null,
        ]);
        this.api.wasmModule.WriteHeaderLine(modelID,FILE_SCHEMA,[{type: STRING, value: schema}]);

        switch(schema) {
            case Schemas.IFC2X3:
                this.api.WriteLine(modelID, new IFC2X3.IfcOrganization(1, IFCORGANIZATION, null, {type: 1, value: 'IFCjs WebIFC'}, null, null, null));
                this.api.WriteLine(modelID, new IFC2X3.IfcApplication(2, IFCAPPLICATION, {type:5, value: 1}, {type: 1, value: ''}, {type:1, value: 'IFCjs WebIFC'}, {type:1, value: 'web-ifc'}));
                this.api.WriteLine(modelID, new IFC2X3.IfcPerson(3, IFCPERSON, null, null, null, null, null, null, [], null));
                this.api.WriteLine(modelID, new IFC2X3.IfcPersonAndOrganization(4, IFCPERSONANDORGANIZATION, {type: 5, value: 3}, {type: 5, value: 1}, null));
                this.api.WriteLine(modelID, new IFC2X3.IfcOwnerHistory(5, IFCOWNERHISTORY, {type: 5, value: 4}, {type: 5, value: 2}, null, {type:3}, null,null, null, {type: 1, value: Date.now()}));
                this.api.WriteLine(modelID, new IFC2X3.IfcCartesianPoint(6, IFCCARTESIANPOINT, [{type: 4, value: 0.0},{type: 4, value: 0.0},{type: 4, value: 0.0}]));
                this.api.WriteLine(modelID, new IFC2X3.IfcProject(7, IFCPROJECT, {type: 1, value: 'Default Project'}, {type: 5, value: 5}, null, null, null, null, null, [], {type: 5, value: 1}));
                break;
            case Schemas.IFC4:
                this.api.WriteLine(modelID, new IFC4.IfcOrganization(1, IFCORGANIZATION, null, {type: 1, value: 'IFCjs WebIFC'}, null, null, null));
                this.api.WriteLine(modelID, new IFC4.IfcApplication(2, IFCAPPLICATION, {type:5, value: 1}, {type: 1, value: ''}, {type:1, value: 'IFCjs WebIFC'}, {type:1, value: 'web-ifc'}));
                this.api.WriteLine(modelID, new IFC4.IfcPerson(3, IFCPERSON, null, null, null, null, null, null, [], null));
                this.api.WriteLine(modelID, new IFC4.IfcPersonAndOrganization(4, IFCPERSONANDORGANIZATION, {type: 5, value: 3}, {type: 5, value: 1}, null));
                this.api.WriteLine(modelID, new IFC4.IfcOwnerHistory(5, IFCOWNERHISTORY, {type: 5, value: 4}, {type: 5, value: 2}, null, {type:3}, null,null, null, {type: 1, value: Date.now()}));
                this.api.WriteLine(modelID, new IFC4.IfcCartesianPoint(6, IFCCARTESIANPOINT, [{type: 4, value: 0.0},{type: 4, value: 0.0},{type: 4, value: 0.0}]));
                this.api.WriteLine(modelID, new IFC4.IfcProject(7, IFCPROJECT, {type: 1, value: 'Default Project'}, {type: 5, value: 5}, null, null, null, null, null, [], {type: 5, value: 1}));
                break;
            case Schemas.IFC4_3:
                this.api.WriteLine(modelID, new IFC4_3.IfcOrganization(1, IFCORGANIZATION, null, {type: 1, value: 'IFCjs WebIFC'}, null, null, null));
                this.api.WriteLine(modelID, new IFC4_3.IfcApplication(2, IFCAPPLICATION, {type:5, value: 1}, {type: 1, value: ''}, {type:1, value: 'IFCjs WebIFC'}, {type:1, value: 'web-ifc'}));
                this.api.WriteLine(modelID, new IFC4_3.IfcPerson(3, IFCPERSON, null, null, null, null, null, null, [], null));
                this.api.WriteLine(modelID, new IFC4_3.IfcPersonAndOrganization(4, IFCPERSONANDORGANIZATION, {type: 5, value: 3}, {type: 5, value: 1}, null));
                this.api.WriteLine(modelID, new IFC4_3.IfcOwnerHistory(5, IFCOWNERHISTORY, {type: 5, value: 4}, {type: 5, value: 2}, null, {type:3}, null,null, null, {type: 1, value: Date.now()}));
                this.api.WriteLine(modelID, new IFC4_3.IfcCartesianPoint(6, IFCCARTESIANPOINT, [{type: 4, value: 0.0},{type: 4, value: 0.0},{type: 4, value: 0.0}]));
                this.api.WriteLine(modelID, new IFC4_3.IfcProject(7, IFCPROJECT, {type: 1, value: 'Default Project'}, {type: 5, value: 5}, null, null, null, null, null, [], {type: 5, value: 1}));
                break;
            default:
                throw new Error("Schema not supported");

        }
    }
}