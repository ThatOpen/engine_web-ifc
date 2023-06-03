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
    REF
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
    IFCSIUNIT,
    IFCUNITASSIGNMENT,
    //IFCOWNERHISTORY,
    IFCPERSON,
    IFCPOSTALADDRESS
} from "../ifc-schema";
import { guid } from "../helpers/guid";
//import { Log } from "../helpers/log";

export interface Model {
    schema: string;
    name?: string;
    description?: string[];
    authors?: Author[];
    organizations?: string[];
    authorization?: string;
}

export interface IfcGeoRef {
    longitude: number;
    latitude: number;
    elevation: number;
    angle: number;
}

export interface OwnerHistory {
    owningUserId: number;
    owningApplicationId: number;
}

export interface PostalAddress {
    country: string;
    addressLines?: string[];
    postalBox?: string;
    town?: string;
    region?: string;
    postalCode?: string;
    internalLocation?: string;
}

export interface Role {
    name: string;
}

export interface Author {
    name: string;
    address: PostalAddress;
    surname?: string;
    roles?: Role[];
}

export interface Organization {
    name: string;
    id?: string;
    description?: string;
    roles?: Role[];
    addresses?: PostalAddress[];
}

/**
 * ModelApi class
 */
export class ModelApi {
    constructor(private api: IfcAPI) {}

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
        const description = model.description?.map((d) => ({type: STRING, value: d})) || [{type: STRING, value: 'ViewDefinition []'}];
        const orgs = model.organizations?.map((o) => ({type: STRING, value: o})) || [{type: STRING, value: appName}];
        const auth = model.authorization ? {type: STRING, value: model.authorization} : null;
        
        api.wasmModule.WriteHeaderLine(modelId,FILE_DESCRIPTION,[
               description, 
               {type: STRING, value: '2;1'}
           ]);
        api.wasmModule.WriteHeaderLine(modelId,FILE_NAME,[
               {type: STRING, value: modelName+'.ifc'},
               {type: STRING, value: timestamp},
               model.authors?.map(a=>({type: STRING, value: a.name })) || [null],
               orgs,
               {type: STRING, value: appName},
               {type: STRING, value: appName},
               auth,
           ]);
        api.wasmModule.WriteHeaderLine(modelId,FILE_SCHEMA,[[{type: STRING, value: model.schema}]]);

        // minimum of an IFC file @see https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/annex_e/ProjectSetup_1.html
        // 3D origin
        api.geomApi.AddCartesianPoint(modelId, { x: 0, y: 0, z: 0 });
        // 2D origin
        api.geomApi.AddCartesianPoint(modelId, { x: 0, y: 0 });
        // x direction
        api.geomApi.AddDirection(modelId, { x: 1, y: 0, z: 0 });
        // y direction, up
        api.geomApi.AddDirection(modelId, { x: 0, y: 1, z: 0 });
        // z direction
        api.geomApi.AddDirection(modelId, { x: 0, y: 0, z: 1 });

        api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCDIMENSIONALEXPONENTS,
                {type: REAL, value: 0},
                {type: REAL, value: 0},
                {type: REAL, value: 0},
                {type: REAL, value: 0},
                {type: REAL, value: 0},
                {type: REAL, value: 0},
                {type: REAL, value: 0}
        ));

        this.AddOrganization(modelId, { name: 'ifcjs', description: 'https://ifcjs.io' });

        api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCAPPLICATION,
                {type: REF, value: 7},
                {type: STRING, value: new Date().getFullYear().toString()}, 
                {type: STRING, value: appName},
                {type: STRING, value: 'web-ifc'}
        ));

        api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCPROJECT, 
               {type: STRING, value: guid()},
               null,
               {type: STRING, value: modelName},
               description[0],
               null,
               null,
               null,
               [{type: REF, value: 10}],
               {type: REF, value: 17},
           ));

        api.geomApi.AddGeometricRepresentationContext(modelId, {
            contextType: 'Model_View',
            coordinateSpaceDimension: 3,
            worldCoordinateSystem: 11,
            trueNorth: 4,
        });

        api.geomApi.AddAxis2Placement3D(modelId, {
            location: 1,
            axis: 5,
            refDirection: 3,
        });

        api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCSIUNIT));
        api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCSIUNIT));
        api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCSIUNIT));
        api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCSIUNIT));
        api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCSIUNIT));
        api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCUNITASSIGNMENT, [
               {type: REF, value: 12},
               {type: REF, value: 13},
               {type: REF, value: 14},
               {type: REF, value: 15},
               {type: REF, value: 16}
           ]));
        this.AddAuthor(modelId, model.authors || []);
        return modelId;
    }

    AddAuthor(modelID: number, authors: Author | Author[]) {
        const authorIds = [];
        if(!Array.isArray(authors)) authors = [authors];
        for(const author of authors) {
            const { name, surname, address } = author;
            const addressId = this.api.WriteLine(modelID, this.api.CreateIfcEntity(modelID, IFCPOSTALADDRESS,
                null,
                null,
                null,
                null,
                address.addressLines?.map(line => ({type: STRING, value: line})) || null,
                null,
                address.town ? {type: STRING, value: address.town} : null,
                address.region ? {type: STRING, value: address.region} : null,
                address.postalCode ? {type: STRING, value: address.postalCode} : null,
                {type: STRING, value: address.country}
            ));

            const authorId = this.api.WriteLine(modelID, this.api.CreateIfcEntity(modelID, IFCPERSON,
                null, 
                {type: STRING, value: name},
                surname ? {type: STRING, value: surname} : null,
                null,
                null,
                null,
                [], // refs to actor roles
                [{type: REF, value: addressId}]
            ));
            authorIds.push(authorId);
        }

        return authorIds;
    }

    AddOrganization(modelId: number, organizations: Organization | Organization[]) {
        const api = this.api;
        const organizationIds = [];
        if(!Array.isArray(organizations)) organizations = [organizations];

        for(const organization of organizations) {
            const [ id ] = api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCORGANIZATION,
                null, 
                {type: STRING, value: organization.name}, 
                organization.description ? {type: STRING, value: organization.description} : null,
                null,
                null
            ));
            organizationIds.push(id);
        }

        return organizationIds;
    }


    /*
    AddGeoReference(modelID: number, geoRef: IfcGeoRef): void {

    }

    OwnerHistory(modelID: number, ownerHistoryID: number) {
        const this.api = this this.api;
        // TODO: handle existing owner history
        const lines = this.api.GetLineIDsWithType(modelID, IFCOWNERHISTORY);
        let ownerHistory;
        if(lines && lines.size() > 0){
            ownerHistory = this.api.GetLine(modelID, lines.get(0));
        }
     this.api.WriteLine(modelID, this.api.CreateIfcEntity(modelID, IFCPROJECT));
    }

    */
}