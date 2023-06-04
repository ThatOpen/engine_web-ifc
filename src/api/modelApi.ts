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
    ENUM,
    EMPTY,
    UNKNOWN
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
    IFCOWNERHISTORY,
    IFCPERSON,
    IFCPOSTALADDRESS,
    IFCPERSONANDORGANIZATION,
    IFCACTORROLE
} from "../ifc-schema";
import { guid } from "../helpers/guid";
//import { Log } from "../helpers/log";

export interface Model {
    schema: string;
    name?: string;
    description?: string[];
    authors?: Person[];
    organizations?: string[];
    authorization?: string;
}

export interface Project {
    ownerHistory: number;
    guid?: string;
    name?: string;
    longName?: string;
    phase?: string;
    description?: string;
    unitAssignment?: number;
    representationContexts?: number[];
}

export interface Application {
    applicationDev: number;
    version: string;
    applicationFullName: string;
    applicationIdentifier: string;
}

export interface OwnerHistory {
    owningUser: number;
    owningApplication: number;
    creationDate: number;
    lastModifyingApplication?: number;
    lastModifyingUser?: number;
    lastModifiedDate?: number;
    changeAction?: string;
    state?: string;
}

export interface Address {
    purpose?: string;
    description?: string;
    userDefinedPurpose?: string;
}

export interface PostalAddress extends Address {
    country: string;
    addressLines?: string[];
    postalBox?: string;
    town?: string;
    region?: string;
    postalCode?: string;
    internalLocation?: string;
}

export interface ActorRole {
    role: string;
    userDefinedRole?: string;
    description?: string;
}

export interface Person {
    name: string;
    organization?: number | Organization;
    address?: number | PostalAddress;
    surname?: string;
    roles?: number [] | ActorRole[];
}

export interface Organization {
    name: string;
    id?: string;
    description?: string;
    roles?: number [] | ActorRole[];
    addresses?: number [] | PostalAddress[];
}

export interface Unit {
    unitType: string;
    name: string;
    prefix?: string;
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
                model.description?.map((d) => ({type: STRING, value: d})) || [{type: STRING, value: 'ViewDefinition []'}], 
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

        this.AddOrganization(modelId, { name: 'ifcjs', description: 'https://ifcjs.io' });

        const appId = this.AddApplication(modelId, {
            applicationDev: 7,
            version: api.GetVersion(),
            applicationFullName: appName,
            applicationIdentifier: 'web-ifc'
        });

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

        const siUnitIds = this.AddSIUnit(modelId, [
            { unitType: 'LENGTHUNIT', name: 'METRE' },
            { unitType: 'AREAUNIT', name: 'SQUARE_METRE' },
            { unitType: 'VOLUMEUNIT', name: 'CUBIC_METRE' },
            { unitType: 'PLANEANGLEUNIT', name: 'RADIAN' },
            { unitType: 'MASSUNIT', name: 'GRAM' , prefix: 'KILO' },
            { unitType: 'TIMEUNIT', name: 'SECOND' },
        ]);
        const unitAssignmentId = this.AddUnitAssignment(modelId, siUnitIds as number[]);

        const authorId = this.AddPerson(modelId, model.authors || []);
        const ownerHistoryId = this.AddOwnerHistory(modelId, {
            owningUser: authorId as number,
            owningApplication: appId as number,
            creationDate: Date.now(),
            lastModifyingApplication: appId as number,
            lastModifyingUser: authorId as number,
            lastModifiedDate: Date.now(),
            changeAction: 'ADDED',
            state: 'READWRITE'
        });

        this.AddProject(modelId, { 
            ownerHistory: ownerHistoryId,
            name: modelName,
            description: description[0].value,
            representationContexts: [geoRepCtxId as number],
            unitAssignment: unitAssignmentId
        });

        return modelId;
    }

    /**
     * Adds a project to the model
     * @param modelID model id
     * @param project 
     * @returns project id
     */
    AddProject(modelId: number, project: Project) {
        const api = this.api;
        
        const projectLine = api.CreateIfcEntity(modelId, IFCPROJECT, 
            {type: STRING, value: project.guid || guid()},
            {type: REF, value: project.ownerHistory},
            project.name ? {type: STRING, value: project.name} : null,
            project.description ? {type: STRING, value: project.description} : null,
            null,
            project.longName ? {type: STRING, value: project.longName} : null,
            project.phase ? {type: STRING, value: project.phase} : null,
            project.representationContexts?.map((context) => ({type: REF, value: context})) || null,
            project.unitAssignment ? {type: REF, value: project.unitAssignment} : null,
        );

        // single project per model rule
        const projectIds = this.api.GetLineIDsWithType(modelId, IFCPROJECT);
        if(projectIds && projectIds.size() > 0)
            projectLine.expressID = projectIds.get(0);

        return api.WriteLine(modelId, projectLine) as number;
    }

    /**
     * Adds an application to the model
     * @param modelId model id
     * @param application application
     * @returns application id
     */
    AddApplication(modelId: number, application: Application) {
        const api = this.api;
        return api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCAPPLICATION,
            {type: REF, value: application.applicationDev},
            {type: STRING, value: application.version},
            {type: STRING, value: application.applicationFullName},
            {type: STRING, value: application.applicationIdentifier}
        )) as number;
    }

    /**
     * Adds one or multiple postal address to the model
     * @param modelId model id
     * @param address address or array of addresses
     * @returns address id or array of address ids
     */
    AddPostalAddress(modelId: number, address: PostalAddress | PostalAddress[]) {
        const api = this.api;
        if(!Array.isArray(address)) address = [address];
        const addressLines = [];

        for(const addr of address) {
            addressLines.push(api.CreateIfcEntity(modelId, IFCPOSTALADDRESS,
                {type: ENUM, value: addr.purpose || 'OFFICE'},
                addr.description ? {type: STRING, value: addr.description} : null,
                addr.userDefinedPurpose ? {type: STRING, value: addr.userDefinedPurpose} : null,
                null,
                addr.addressLines?.map(line => ({type: STRING, value: line})) || [{type: EMPTY}],
                null,
                addr.town ? {type: STRING, value: addr.town} : null,
                addr.region ? {type: STRING, value: addr.region} : null,
                addr.postalCode ? {type: STRING, value: addr.postalCode} : null,
                addr.country ? {type: STRING, value: addr.country} : null
            ));
        }
        return api.WriteLine(modelId, addressLines);
    }

    /**
     * Adds one or multiple person to the model
     * @param modelID model id
     * @param authors author or array of authors
     * @returns author id or array of author ids
     */
    AddPerson(modelID: number, authors: Person | Person[]) {
        const authorIds = [];
        if(!Array.isArray(authors)) authors = [authors];
        for(const author of authors) {
            const { name, surname, address, organization } = author;
            let addressId;
            if(address) {
                if(typeof address === 'number') addressId = address;
                else
                    addressId = this.AddPostalAddress(modelID, address) as number;
            }

            let authorId = this.api.WriteLine(modelID, this.api.CreateIfcEntity(modelID, IFCPERSON,
                null, 
                {type: STRING, value: name + (surname ? ' ' + surname : '')},
                surname ? {type: STRING, value: surname} : null,
                null,
                null,
                null,
                [{type: EMPTY}], // refs to actor roles
                addressId ? [{type: REF, value: addressId}] : [{type: EMPTY}]
            ));

            if(organization) {
                let organizationId;
                if(typeof organization === 'number')
                    organizationId = organization;
                else
                    organizationId = this.AddOrganization(modelID, organization);

                authorId = this.api.WriteLine(modelID, this.api.CreateIfcEntity(modelID, IFCPERSONANDORGANIZATION,
                    {type: REF, value: authorId as number},
                    {type: REF, value: organizationId as number},
                    [{type: EMPTY}] // refs to actor roles
                ));
            }

            authorIds.push(authorId as number);
        }

        return authorIds.length > 1 ? authorIds : authorIds[0];
    }

    /**
     * Adds one or multiple organization to the model
     * @param modelId model id
     * @param organizations organization or array of organizations
     * @returns organization id or array of organization ids
     */
    AddOrganization(modelId: number, organizations: Organization | Organization[]) {
        const api = this.api;
        const organizationLines = [];
        if(!Array.isArray(organizations)) organizations = [organizations];

        for(const organization of organizations) {
            if(organization.addresses) {
                if(typeof organization.addresses[0] === 'number')
                    organization.addresses = organization.addresses as number[];
                else
                    organization.addresses = this.AddPostalAddress(modelId, organization.addresses as PostalAddress[]) as number[];
            }

            if(organization.roles) {
                if(typeof organization.roles[0] === 'number')
                    organization.roles = organization.roles as number[];
                else
                    organization.roles = this.AddActorRole(modelId, organization.roles as ActorRole[]) as number[];
            }

            organizationLines.push(api.CreateIfcEntity(modelId, IFCORGANIZATION,
                organization.id ? {type: STRING, value: organization.id} : null, 
                {type: STRING, value: organization.name}, 
                organization.description ? {type: STRING, value: organization.description} : null,
                organization.roles ? organization.roles.map((role) => ({type: REF, value: role})) : null,
                organization.addresses ? organization.addresses.map((address) => ({type: REF, value: address})) : null,
            ));
        }

        return api.WriteLine(modelId, organizationLines);
    }

    /**
     * Adds an owner history to the model
     * @param modelId model id
     * @param ownerHistory owner history
     * @returns owner history id
     */
    AddOwnerHistory(modelId: number, ownerHistory: OwnerHistory) {
        const api = this.api;
        return api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCOWNERHISTORY,
            {type: REF, value: ownerHistory.owningUser},
            {type: REF, value: ownerHistory.owningApplication},
            ownerHistory.state ? {type: ENUM, value: ownerHistory.state} : null,
            ownerHistory.changeAction ? {type: ENUM, value: ownerHistory.changeAction} : null,
            {type: REAL, value: ownerHistory.creationDate},
            ownerHistory.lastModifyingUser ? {type: REF, value: ownerHistory.lastModifyingUser} : null,
            ownerHistory.lastModifyingApplication ? {type: REF, value: ownerHistory.lastModifyingApplication} : null,
            ownerHistory.lastModifiedDate ? {type: REAL, value: ownerHistory.lastModifiedDate} : null
        )) as number;
    }

    /**
     * Adds one or multiple actor role to the model
     * @param modelId model id
     * @param role actor role or array of actor roles
     * @returns actor role id or array of actor role ids
     */
    AddActorRole(modelId: number, role: ActorRole | ActorRole[]) {
        const api = this.api;
        if(!Array.isArray(role)) role = [role];
        const roleLines = [];

        for(const r of role) {
            roleLines.push(api.CreateIfcEntity(modelId, IFCACTORROLE,
                {type: ENUM, value: r.role},
                r.userDefinedRole ? {type: STRING, value: r.userDefinedRole} : null,
                r.description ? {type: STRING, value: r.description} : null
            ));
        }
        return api.WriteLine(modelId, roleLines);
    }

    AddSIUnit(modelId: number, units: Unit | Unit[]) {
        const api = this.api;
        if(!Array.isArray(units)) units = [units];
        const unitLines = [];

        for(const unit of units) {
            unitLines.push(api.CreateIfcEntity(modelId, IFCSIUNIT,
                {type: UNKNOWN},
                {type: ENUM, value: unit.unitType},
                unit.prefix ? {type: ENUM, value: unit.prefix} : null,
                {type: ENUM, value: unit.name},
            ));
        }
        return api.WriteLine(modelId, unitLines);
    }

    /**
     * Adds a unit assignment to the model
     * @param modelId model id
     * @param unitIds unit ids
     * @returns unit assignment id
     */
    AddUnitAssignment(modelId: number, unitIds: number[]) {
        const api = this.api;
        return api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCUNITASSIGNMENT,
            unitIds.map((unit) => ({type: REF, value: unit}))
        )) as number;
    }

    /*
    AddGeoReference(modelID: number, geoRef: IfcGeoRef): void {

    }
    */
}