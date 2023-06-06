/** 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

import { 
    IfcAPI,
    LoaderSettings,
    REAL,
    STRING,
    REF,
} from "../web-ifc-api";
import { 
    FILE_DESCRIPTION,
    FILE_NAME,
    FILE_SCHEMA,
    Schemas,
    IFCDIMENSIONALEXPONENTS,
    IFCORGANIZATION,
    IFCAPPLICATION,
    IFCPROJECT,
    // IFCSIUNIT,
    IFCUNITASSIGNMENT,
    IFCOWNERHISTORY,
    IFCPERSON,
    IFCGLOBALLYUNIQUEID,
    IFC2X3,
    IFC4,
    IFC4X3,
    IFCIDENTIFIER,
    IFCLABEL,
    IFCTEXT,
    IFCPERSONANDORGANIZATION,
    IFCTIMESTAMP,
} from "../ifc-schema";
import { guid } from "../helpers/guid";
import { BaseApi } from "./baseApi";

export interface Model {
    schema: string;
    name?: string;
    description?: string[];
    author?: IFC2X3.IfcPerson | IFC4.IfcPerson | IFC4X3.IfcPerson;
    organizations?: string[];
    authorization?: string;
}

/**
 * ModelApi class
 */
export class ModelApi extends BaseApi {
    ownerHistories: number[] = [];
    constructor(api: IfcAPI) {
        super(api);
    }

    /**
     * Creates a new model and returns a modelID number
     * establishes the bare minimum of an IFC file
     * @param model - Model, schema defaults to IFC4 with defaul values
     * @param settings - LoaderSettings
	 * @returns ModelID
     * ```typescript
     * const modelID = ifcApi.modelApi.Create({ schema: this.api.Schemas.IFC2X3 });
     * ```
    */
    Create(model?: Model, settings?: LoaderSettings): number {
        const api = this.api;
        if(!model) model = { schema: Schemas.IFC4 };
        const modelId = api.CreateModel(model.schema, settings);
        
        const appName = 'ifcjs/web-ifc ' + api.GetVersion();
        const modelName = model.name || `IfcModel_${modelId}`;
        const timestamp = new Date().toISOString().slice(0,19);
        //const description = model.description?.map((d) => ({type: STRING, value: d})) || [{type: STRING, value: 'ViewDefinition []'}];
        const orgs = model.organizations?.map((o) => ({type: STRING, value: o})) || [{type: STRING, value: appName}];
        const auth = model.authorization ? {type: STRING, value: model.authorization} : null;
        
        api.wasmModule.WriteHeaderLine(modelId,FILE_DESCRIPTION,[
                model.description?.map((d) => ({type: STRING, value: d})) || [{type: STRING, value: 'ViewDefinition []'}], 
                {type: STRING, value: '2;1'}
           ]);
        api.wasmModule.WriteHeaderLine(modelId,FILE_NAME,[
               {type: STRING, value: modelName+'.ifc'},
               {type: STRING, value: timestamp},
               [{type: STRING, value: model.author?.FamilyName?.value || '' }],
               orgs,
               {type: STRING, value: appName},
               {type: STRING, value: appName},
               auth,
           ]);
        api.wasmModule.WriteHeaderLine(modelId,FILE_SCHEMA,[[{type: STRING, value: model.schema}]]);
        // minimum of an IFC file @see https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/annex_e/ProjectSetup_1.html
        api.geomApi.AddCartesianPoint(modelId,[
            { x: 0, y: 0, z: 0 },  // 3D origin
            { x: 0, y: 0 }     // 2D origin
        ]);
        api.geomApi.AddDirection(modelId, [
            { x: 1, y: 0, z: 0 },   // x direction
            { x: 0, y: 1, z: 0 },   // y direction, up
            { x: 0, y: 0, z: 1 }    // z direction
        ]);

        api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCDIMENSIONALEXPONENTS,
                {type: REAL, value: 0},
                {type: REAL, value: 0},
                {type: REAL, value: 0},
                {type: REAL, value: 0},
                {type: REAL, value: 0},
                {type: REAL, value: 0},
                {type: REAL, value: 0}
        ));

        const orgId = this.AddOrganization(modelId, {
            type: IFCORGANIZATION,
            Id: api.CreateIfcType(modelId, IFCIDENTIFIER, 'ifcjs'),
            Name: api.CreateIfcType(modelId, IFCLABEL, 'ifcjs'),
            Description: api.CreateIfcType(modelId, IFCTEXT, 'https://ifcjs.io'),
            Engages: null,
            IsRelatedBy: null,
            Relates: null
        }) as number;

        const appId = this.AddApplication(modelId, {
            type: IFCAPPLICATION,
            ApplicationDeveloper: {type: REF, value: orgId},
            Version: api.CreateIfcType(modelId, IFCLABEL, api.GetVersion()),
            ApplicationFullName: api.CreateIfcType(modelId, IFCLABEL, 'ifcjs/web-ifc' + api.GetVersion()),
            ApplicationIdentifier: api.CreateIfcType(modelId, IFCIDENTIFIER, 'web-ifc'),
        }) as number;

        const axisId = api.geomApi.AddAxis2Placement3D(modelId, {
            location: 1,
            axis: 5,
            refDirection: 3,
        });

        const geoRepCtxId = api.geomApi.AddGeometricRepresentationContext(modelId, {
            contextType: 'Model',
            coordinateSpaceDimension: 3,
            worldCoordinateSystem: axisId as number,
            trueNorth: 4,
        });
        
        const authorId = this.AddPerson(modelId, {
            FamilyName: model.author ? api.CreateIfcType(modelId, IFCLABEL, model.author.FamilyName?.value || '') : null,
            GivenName: model.author ? api.CreateIfcType(modelId, IFCLABEL, model.author.GivenName?.value || '') : null,
            MiddleNames: model.author?.MiddleNames?.map((name) => api.CreateIfcType(modelId, IFCLABEL, name.value)) || null,
            PrefixTitles: model.author?.PrefixTitles?.map((title) => api.CreateIfcType(modelId, IFCLABEL, title.value)) || null,
            SuffixTitles: model.author?.SuffixTitles?.map((title) => api.CreateIfcType(modelId, IFCLABEL, title.value)) || null,
            EngagedIn: null,
            Identification: null,
            type: IFCPERSON
        }) as number;
        
        const personAndOrgId = this.AddPersonAndOrganization(modelId, {
            type: IFCPERSONANDORGANIZATION,
            ThePerson: {type: REF, value: authorId},
            TheOrganization: {type: REF, value: orgId},
        }) as number;
        
        const ownerHistoryId = this.AddOwnerHistory(modelId, {
            type: IFCOWNERHISTORY,
            OwningUser: {type: REF, value: personAndOrgId},
            OwningApplication: {type: REF, value: appId},
            CreationDate: api.CreateIfcType(modelId, IFCTIMESTAMP, Date.now()),
            LastModifyingApplication: {type: REF, value: appId},
            LastModifyingUser: {type: REF, value: personAndOrgId},
            LastModifiedDate: api.CreateIfcType(modelId, IFCTIMESTAMP, Date.now()),
            State: null,
            ChangeAction: null,
        }) as number;
        this.ownerHistories.push(ownerHistoryId);

        this.AddProject(modelId, {
            type: IFCPROJECT,
            OwnerHistory: {type: REF, value: ownerHistoryId},
            Name: api.CreateIfcType(modelId, IFCLABEL, model.name || 'Default Project'),
            GlobalId: api.CreateIfcType(modelId, IFCGLOBALLYUNIQUEID, guid()),
            LongName: null,
            Phase: null,
            RepresentationContexts: [{type: REF, value: geoRepCtxId as number}],
            Description: api.CreateIfcType(modelId, IFCTEXT, model.description?.join(';') || 'Default Project'),
            UnitsInContext: {type: IFCUNITASSIGNMENT, value: 9999}, // TODO: add units
            ObjectType: null,
            IsDefinedBy: null,
            HasAssignments: null,
            HasAssociations: null,
            IsDecomposedBy: null,
            Decomposes: null,
        });
        return modelId;
    }

    /**
     * Adds a project to the model
     * @param modelID model id
     * @param project 
     * @returns project id
     */
    AddProject(modelId: number, project: IFC2X3.IfcProject | IFC4.IfcProject | IFC4X3.IfcProject | (IFC2X3.IfcProject | IFC4.IfcProject | IFC4X3.IfcProject)[]) {
        return this.api.WriteLine(modelId, project);
    }

    /**
     * Adds an application to the model
     * @param modelId model id
     * @param application application
     * @returns application id
     */
    AddApplication(modelId: number, application: IFC2X3.IfcApplication | IFC4.IfcApplication | IFC4X3.IfcApplication | (IFC2X3.IfcApplication | IFC4.IfcApplication | IFC4X3.IfcApplication)[]) {
        return this.api.WriteLine(modelId, application);
    }

    AddPerson(modelId: number, person: IFC2X3.IfcPerson | IFC4.IfcPerson | IFC4X3.IfcPerson | (IFC2X3.IfcPerson | IFC4.IfcPerson | IFC4X3.IfcPerson)[]) {
        return this.api.WriteLine(modelId, person);
    }

    AddPersonAndOrganization(modelId: number, personAndOrganization: IFC2X3.IfcPersonAndOrganization | IFC4.IfcPersonAndOrganization | IFC4X3.IfcPersonAndOrganization | (IFC2X3.IfcPersonAndOrganization | IFC4.IfcPersonAndOrganization | IFC4X3.IfcPersonAndOrganization)[]) {
        return this.api.WriteLine(modelId, personAndOrganization);
    }

    AddOrganization(modelId: number, organization: IFC2X3.IfcOrganization | IFC4.IfcOrganization | IFC4X3.IfcOrganization | (IFC2X3.IfcOrganization | IFC4.IfcOrganization | IFC4X3.IfcOrganization)[]) {
        return this.api.WriteLine(modelId, organization);
    }

    /**
     * Adds an owner history to the model
     * @param modelId model id
     * @param ownerHistory owner history
     * @returns owner history id
     */
    AddOwnerHistory(modelId: number, ownerHistory: IFC2X3.IfcOwnerHistory | IFC4.IfcOwnerHistory | IFC4X3.IfcOwnerHistory | (IFC2X3.IfcOwnerHistory | IFC4.IfcOwnerHistory | IFC4X3.IfcOwnerHistory)[]) {
        return this.api.WriteLine(modelId, ownerHistory);
    }
}