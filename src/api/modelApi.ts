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
    IFCPOSTALADDRESS,
    IFCACTORROLE,
    IFCBUILDING,
    IFCBUILDINGSTOREY,
    IFCSITE,
    IFCSPACE,
    IFCPERSON,
    IFCGLOBALLYUNIQUEID,
    // IFCBEAM,
    // IFCBEARING,
    IFCBUILDINGELEMENTPROXY,
    IFC2X3,
    IFC4,
    IFC4X3,
    IFCIDENTIFIER,
    IFCLABEL,
    IFCTEXT,
    IFCPERSONANDORGANIZATION,
    IFCTIMESTAMP,
    // IFCCHIMNEY,
    // IFCCOLUMN,
    // IFCCOVERING,
    // IFCCURTAINWALL,
    // IFCDOOR,
    // IFCFOOTING,
    // IFCMEMBER,
    // IFCPLATE,
    // IFCRAILING,
    // IFCRAMP,
    // IFCRAMPFLIGHT,
    // IFCROOF,
    // IFCSHADINGDEVICE,
    // IFCSLAB,
    // IFCSTAIR,
    // IFCSTAIRFLIGHT,
    // IFCWALL,
    // IFCWINDOW,
} from "../ifc-schema";
import { guid } from "../helpers/guid";
//import { Log } from "../helpers/log";
import { BaseApi } from "./baseApi";
import { LocalPlacement, ProductDefShape } from "./geomApi";

interface Root {
    globalId?: string;
    name?: string;
    description?: string;
    ownerHistory?: number | OwnerHistory;
}

export interface Model {
    schema: string;
    name?: string;
    description?: string[];
    author?: Person;
    organizations?: string[];
    authorization?: string;
}

export interface Project extends Object {
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
    FamilyName: string;
    GivenName?: string;
    MiddleNames?: string[];
    Organization?: number | Organization;
    PrefixTitles?: string[];
    SuffixTitles?: string[];
    Address?: number[] | PostalAddress[];
    Roles?: number[] | null
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

export interface Object extends Root {
    objectType?: string;
}

export interface Product extends Object {
    objectPlacement?: number | LocalPlacement; // TODO: | GridPlacement;
}

export interface Element extends Product {
    tag?: string;
}

export interface SpatialElement extends Product {
    longName?: string;
}

export interface SpatialStructureElement extends SpatialElement {
    compositionType?: string;
}

export interface Building extends SpatialStructureElement {
    buildingAddress?: number | PostalAddress;
    elevationOfRefHeight?: number;
    elevationOfTerrain?: number;
}

export interface BuildingStorey extends SpatialStructureElement {
    elevation?: number;
}

export interface Site extends SpatialStructureElement {
    refLatitude?: number[];
    refLongitude?: number[];
    refElevation?: number;
    landTitleNumber?: string;
    siteAddress?: number | PostalAddress;
}

export interface Space extends SpatialStructureElement {
    elevationWithFlooring?: number;
}

export interface BuildingElement extends Element {
    predefinedType?: string;
    representation?: number | ProductDefShape;
}

class Test {
    optional?:number|null = null;
    constructor(optional:number|null=null){
        this.optional=optional;
    }
}

let c: Test = { };

export interface Beam extends BuildingElement {}
export interface Bearing extends BuildingElement {}
export interface BuildingElementProxy extends BuildingElement {}
export interface Chimney extends BuildingElement {}
export interface Column extends BuildingElement {}
export interface Covering extends BuildingElement {}
export interface CurtainWall extends BuildingElement {}
//export interface DeepFoundation extends BuildingElement {}
export interface Footing extends BuildingElement {}
export interface Member extends BuildingElement {}
export interface Plate extends BuildingElement {}
export interface Railing extends BuildingElement {}
export interface Ramp extends BuildingElement {}
export interface RampFlight extends BuildingElement {}
export interface Roof extends BuildingElement {}
export interface ShadingDevice extends BuildingElement {}
export interface Slab extends BuildingElement {}
export interface Stair extends BuildingElement {}
export interface StairFlight extends BuildingElement {}
export interface Wall extends BuildingElement {}

export interface Door extends BuildingElement {
    overallHeight?: number;
    overallWidth?: number;
    userDefinedOperationType?: string;
}

export interface Window extends BuildingElement {
    overallHeight?: number;
    overallWidth?: number;
    userDefinedPartitionType?: string;
    partitioningType?: string;
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
               model.author ? {type: STRING, value: model.author.FamilyName } : [null],
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

        const siUnitIds = this.AddSIUnit(modelId, [
            { unitType: 'LENGTHUNIT', name: 'METRE' },
            { unitType: 'AREAUNIT', name: 'SQUARE_METRE' },
            { unitType: 'VOLUMEUNIT', name: 'CUBIC_METRE' },
            { unitType: 'PLANEANGLEUNIT', name: 'RADIAN' },
            { unitType: 'MASSUNIT', name: 'GRAM' , prefix: 'KILO' },
            { unitType: 'TIMEUNIT', name: 'SECOND' },
        ]);
        const unitAssignmentId = this.AddUnitAssignment(modelId, siUnitIds as number[]);
        
        const authorId = this.AddPerson(modelId, {
            FamilyName: model.author ? api.CreateIfcType(modelId, IFCLABEL, model.author.FamilyName) : null,
            GivenName: model.author ? api.CreateIfcType(modelId, IFCLABEL, model.author.GivenName) : null,
            MiddleNames: model.author?.MiddleNames?.map((name) => api.CreateIfcType(modelId, IFCLABEL, name)) || null,
            PrefixTitles: model.author?.PrefixTitles?.map((title) => api.CreateIfcType(modelId, IFCLABEL, title)) || null,
            SuffixTitles: model.author?.SuffixTitles?.map((title) => api.CreateIfcType(modelId, IFCLABEL, title)) || null,
            Roles: null,
            Addresses: null,
            EngagedIn: null,
            Identification: null,
            expressID: -1,
            type: IFCPERSON
        }) as number;
        
        const personAndOrgId = this.AddPersonAndOrganization(modelId, {
            type: IFCPERSONANDORGANIZATION,
            expressID: -1,
            ThePerson: {type: REF, value: authorId},
            TheOrganization: {type: REF, value: orgId},
            Roles: null,
        }) as number;
        
        const ownerHistoryId = this.AddOwnerHistory(modelId, {
            expressID: -1,
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
            expressID: -1,
            type: IFCPROJECT,
            OwnerHistory: {type: REF, value: ownerHistoryId},
            Name: api.CreateIfcType(modelId, IFCLABEL, model.name || 'Default Project'),
            GlobalId: api.CreateIfcType(modelId, IFCGLOBALLYUNIQUEID, guid()),
            LongName: null,
            Phase: null,
            RepresentationContexts: [{type: REF, value: geoRepCtxId as number}],
            Description: api.CreateIfcType(modelId, IFCTEXT, model.description?.join(';') || 'Default Project'),
            UnitsInContext: {type: REF, value: unitAssignmentId},
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

    /**
     * Adds one or multiple postal address to the model
     * @param modelId model id
     * @param address address or array of addresses
     * @returns address id or array of address ids
     */
    // AddPostalAddress(modelId: number, address: PostalAddress | PostalAddress[]) {
    //     const api = this.api;
    //     if(!Array.isArray(address)) address = [address];
    //     const addressLines = [];

    //     for(const addr of address) {
    //         addressLines.push(api.CreateIfcEntity(modelId, IFCPOSTALADDRESS,
    //             {type: ENUM, value: addr.purpose || 'USERDEFINED'},
    //             addr.description ? {type: STRING, value: addr.description} : null,
    //             addr.userDefinedPurpose ? {type: STRING, value: addr.userDefinedPurpose} : null,
    //             addr.internalLocation ? {type: STRING, value: addr.internalLocation} : null,
    //             addr.addressLines?.map(line => ({type: STRING, value: line})) || null,
    //             addr.postalBox ? {type: STRING, value: addr.postalBox} : null,
    //             addr.town ? {type: STRING, value: addr.town} : null,
    //             addr.region ? {type: STRING, value: addr.region} : null,
    //             addr.postalCode ? {type: STRING, value: addr.postalCode} : null,
    //             addr.country ? {type: STRING, value: addr.country} : null
    //         ));
    //     }
    //     return api.WriteLine(modelId, addressLines);
    // }

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

    /**
     * Adds one or multiple actor role to the model
     * @param modelId model id
     * @param role actor role or array of actor roles
     * @returns actor role id or array of actor role ids
     */
    // AddActorRole(modelId: number, role: ActorRole | ActorRole[]) {
    //     const api = this.api;
    //     if(!Array.isArray(role)) role = [role];
    //     const roleLines = [];

    //     for(const r of role) {
    //         roleLines.push(api.CreateIfcEntity(modelId, IFCACTORROLE,
    //             {type: ENUM, value: r.role},
    //             r.userDefinedRole ? {type: STRING, value: r.userDefinedRole} : null,
    //             r.description ? {type: STRING, value: r.description} : null
    //         ));
    //     }
    //     return api.WriteLine(modelId, roleLines);
    // }

    // AddSIUnit(modelId: number, units: Unit | Unit[]) {
    //     const api = this.api;
    //     if(!Array.isArray(units)) units = [units];
    //     const unitLines = [];

    //     for(const unit of units) {
    //         unitLines.push(api.CreateIfcEntity(modelId, IFCSIUNIT,
    //             {type: UNKNOWN},
    //             {type: ENUM, value: unit.unitType},
    //             unit.prefix ? {type: ENUM, value: unit.prefix} : null,
    //             {type: ENUM, value: unit.name},
    //         ));
    //     }
    //     return api.WriteLine(modelId, unitLines);
    // }

    /**
     * Adds a unit assignment to the model
     * @param modelId model id
     * @param unitIds unit ids
     * @returns unit assignment id
     */
    // AddUnitAssignment(modelId: number, unitIds: number[]) {
    //     const api = this.api;
    //     return api.WriteLine(modelId, api.CreateIfcEntity(modelId, IFCUNITASSIGNMENT,
    //         unitIds.map((unit) => ({type: REF, value: unit}))
    //     )) as number;
    // }

    /**
     * Adds one or multiple building to the model
     * @param modelId model id
     * @param building building or array of buildings
     * @returns building id or array of building ids
     */
    // AddBuilding(modelId: number, building: Building | Building[]) {
    //     const api = this.api;
    //     if(!Array.isArray(building)) building = [building];
    //     const buildingLines = [];

    //     for(const b of building) {
    //         if(b.buildingAddress && typeof b.buildingAddress !== 'number') {
    //             b.buildingAddress = this.AddPostalAddress(modelId, b.buildingAddress) as number;
    //         }

    //         if(b.ownerHistory && typeof b.ownerHistory !== 'number') {
    //             b.ownerHistory = this.AddOwnerHistory(modelId, b.ownerHistory) as number;
    //         }

    //         if(b.objectPlacement && typeof b.objectPlacement !== 'number') {
    //             b.objectPlacement = api.geomApi.AddLocalPlacement(modelId, b.objectPlacement) as number;
    //         }

    //         buildingLines.push(api.CreateIfcEntity(modelId, IFCBUILDING,
    //             {type: STRING, value: b.globalId || guid()},
    //             b.ownerHistory ? {type: REF, value: b.ownerHistory} : null,
    //             b.name ? {type: STRING, value: b.name} : null,
    //             b.description? {type: STRING, value: b.description} : null,
    //             b.objectType ? {type: ENUM, value: b.objectType} : null,
    //             b.objectPlacement ? {type: REF, value: b.objectPlacement} : null,
    //             null,
    //             b.longName ? {type: STRING, value: b.longName} : null,
    //             b.compositionType ? {type: ENUM, value: b.compositionType} : null,
    //             b.elevationOfRefHeight !== undefined ? {type: REAL, value: b.elevationOfRefHeight} : null,
    //             b.elevationOfTerrain !== undefined ? {type: REAL, value: b.elevationOfTerrain} : null,
    //             b.buildingAddress ? {type: REF, value: b.buildingAddress} : null,
    //         ));
    //     }

    //     return api.WriteLine(modelId, buildingLines);
    // }

    /**
     * Adds one or multiple building storey to the model
     * @param modelId model id
     * @param storey storey or array of storeys
     * @returns storey id or array of storey ids
     */
    // AddBuildingStorey(modelId: number, storey: BuildingStorey | BuildingStorey[]) {
    //     const api = this.api;
    //     if(!Array.isArray(storey)) storey = [storey];
    //     const storeyLines = [];

    //     for(const s of storey) {
    //         if(s.ownerHistory && typeof s.ownerHistory !== 'number') {
    //             s.ownerHistory = this.AddOwnerHistory(modelId, s.ownerHistory) as number;
    //         }

    //         if(s.objectPlacement && typeof s.objectPlacement !== 'number') {
    //             s.objectPlacement = api.geomApi.AddLocalPlacement(modelId, s.objectPlacement) as number;
    //         }

    //         storeyLines.push(api.CreateIfcEntity(modelId, IFCBUILDINGSTOREY,
    //             {type: STRING, value: s.globalId || guid()},
    //             s.ownerHistory ? {type: REF, value: s.ownerHistory} : null,
    //             s.name ? {type: STRING, value: s.name} : null,
    //             s.description ? {type: STRING, value: s.description} : null,
    //             s.objectType ? {type: ENUM, value: s.objectType} : null,
    //             s.objectPlacement ? {type: REF, value: s.objectPlacement} : null,
    //             null,
    //             s.longName ? {type: STRING, value: s.longName} : null,
    //             s.compositionType ? {type: ENUM, value: s.compositionType} : null,
    //             s.elevation !== undefined ? {type: REAL, value: s.elevation} : null,
    //         ));
    //     }

    //     return api.WriteLine(modelId, storeyLines);
    // }

    /**
     * Adds one or multiple site to the model
     * @param modelId model id
     * @param site site or array of sites
     * @returns site id or array of site ids
     */
    // AddSite(modelId: number, site: Site | Site[]) {
    //     const api = this.api;
    //     if(!Array.isArray(site)) site = [site];
    //     const siteLines = [];

    //     for(const s of site) {
    //         if(s.ownerHistory && typeof s.ownerHistory !== 'number') {
    //             s.ownerHistory = this.AddOwnerHistory(modelId, s.ownerHistory) as number;
    //         }

    //         if(s.objectPlacement && typeof s.objectPlacement !== 'number') {
    //             s.objectPlacement = api.geomApi.AddLocalPlacement(modelId, s.objectPlacement) as number;
    //         }

    //         siteLines.push(api.CreateIfcEntity(modelId, IFCSITE,
    //             {type: STRING, value: s.globalId || guid()},
    //             s.ownerHistory ? {type: REF, value: s.ownerHistory} : null,
    //             s.name ? {type: STRING, value: s.name} : null,
    //             s.description ? {type: STRING, value: s.description} : null,
    //             s.objectType ? {type: ENUM, value: s.objectType} : null,
    //             s.objectPlacement ? {type: REF, value: s.objectPlacement} : null,
    //             null,
    //             s.longName ? {type: STRING, value: s.longName} : null,
    //             s.compositionType ? {type: ENUM, value: s.compositionType} : null,
    //             s.refLatitude ? s.refLatitude.map(lat => ({type: REAL, value: lat})) : null,
    //             s.refLongitude ? s.refLongitude.map(lon => ({type: REAL, value: lon})) : null,
    //             s.refElevation !== undefined ? {type: REAL, value: s.refElevation} : null,
    //             s.landTitleNumber ? {type: STRING, value: s.landTitleNumber} : null,
    //             s.siteAddress ? {type: REF, value: s.siteAddress} : null,
    //         ));
    //     }

    //     return api.WriteLine(modelId, siteLines);
    // }

    /**
     * Adds one or multiple space to the model
     * @param modelId model id
     * @param space space or array of spaces
     * @returns space id or array of space ids
     */
    // AddSpace(modelId: number, space: Space | Space[]) {
    //     const api = this.api;
    //     if(!Array.isArray(space)) space = [space];
    //     const spaceLines = [];

    //     for(const s of space) {
    //         if(s.ownerHistory && typeof s.ownerHistory !== 'number') {
    //             s.ownerHistory = this.AddOwnerHistory(modelId, s.ownerHistory) as number;
    //         }

    //         if(s.objectPlacement && typeof s.objectPlacement !== 'number') {
    //             s.objectPlacement = api.geomApi.AddLocalPlacement(modelId, s.objectPlacement) as number;
    //         }

    //         spaceLines.push(api.CreateIfcEntity(modelId, IFCSPACE,
    //             {type: STRING, value: s.globalId || guid()},
    //             s.ownerHistory ? {type: REF, value: s.ownerHistory} : null,
    //             s.name ? {type: STRING, value: s.name} : null,
    //             s.description ? {type: STRING, value: s.description} : null,
    //             s.objectType ? {type: ENUM, value: s.objectType} : null,
    //             s.objectPlacement ? {type: REF, value: s.objectPlacement} : null,
    //             null,
    //             s.longName ? {type: STRING, value: s.longName} : null,
    //             s.compositionType ? {type: ENUM, value: s.compositionType} : null,
    //             s.elevationWithFlooring ? {type: REAL, value: s.elevationWithFlooring} : null,
    //         ));
    //     }

    //     return api.WriteLine(modelId, spaceLines);
    // }

    // AddBuildingElementProxy(modelId: number, buildingElementProxy: BuildingElementProxy | BuildingElementProxy[]) {
    //     const api = this.api;
    //     if(!Array.isArray(buildingElementProxy)) buildingElementProxy = [buildingElementProxy];
    //     const buildingElementProxyLines = [];

    //     for(const b of buildingElementProxy) {
    //         if(b.ownerHistory && typeof b.ownerHistory !== 'number') {
    //             b.ownerHistory = this.AddOwnerHistory(modelId, b.ownerHistory) as number;
    //         }

    //         if(b.objectPlacement && typeof b.objectPlacement !== 'number') {
    //             b.objectPlacement = api.geomApi.AddLocalPlacement(modelId, b.objectPlacement) as number;
    //         }

    //         if(b.representation && typeof b.representation !== 'number') {
    //             b.representation = api.geomApi.AddProductDefShape(modelId, b.representation) as number;
    //         }

    //         buildingElementProxyLines.push(api.CreateIfcEntity(modelId, IFCBUILDINGELEMENTPROXY,
    //             {type: STRING, value: b.globalId || guid()},
    //             b.ownerHistory ? {type: REF, value: b.ownerHistory} : null,
    //             b.name ? {type: STRING, value: b.name} : null,
    //             b.description ? {type: STRING, value: b.description} : null,
    //             b.objectType ? {type: ENUM, value: b.objectType} : null,
    //             b.objectPlacement ? {type: REF, value: b.objectPlacement} : null,
    //             b.representation ? {type: REF, value: b.representation} : null,
    //             b.predefinedType ? {type: ENUM, value: b.predefinedType} : null,
    //             null
    //         ));
    //     }

    //     return api.WriteLine(modelId, buildingElementProxyLines);
    // }

    /*
    AddGeoReference(modelID: number, geoRef: IfcGeoRef): void {

    }
    */
}