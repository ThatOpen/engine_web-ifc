import {
    IfcAPI,
    IFCPROJECT, IFCRELAGGREGATES, IFCRELASSOCIATESMATERIAL,
    IFCRELCONTAINEDINSPATIALSTRUCTURE,
    IFCRELDEFINESBYPROPERTIES, IFCRELDEFINESBYTYPE
} from "../web-ifc-api";

import { IfcElements } from './ifc-elements'
import { IfcTypesMap } from "./types-map";

interface pName {
    name: number;
    relating: string;
    related: string;
    key: string;
}

interface Node {
    expressID: number;
    type: string;
    children: Node[];
}

const PropsNames = {
    aggregates: {
        name: IFCRELAGGREGATES,
        relating: 'RelatingObject',
        related: 'RelatedObjects',
        key: 'children'
    },
    spatial: {
        name: IFCRELCONTAINEDINSPATIALSTRUCTURE,
        relating: 'RelatingStructure',
        related: 'RelatedElements',
        key: 'children'
    },
    psets: {
        name: IFCRELDEFINESBYPROPERTIES,
        relating: 'RelatingPropertyDefinition',
        related: 'RelatedObjects',
        key: 'hasPsets'
    },
    materials: {
        name: IFCRELASSOCIATESMATERIAL,
        relating: 'RelatingMaterial',
        related: 'RelatedObjects',
        key: 'hasMaterial'
    },
    type: {
        name: IFCRELDEFINESBYTYPE,
        relating: 'RelatingType',
        related: 'RelatedObjects',
        key: 'hasType'
    }
};

export class Properties {

    private types: any;

    constructor(private api: IfcAPI) {
    }

    getIfcType(type: number) {
        return IfcTypesMap[type];
    }

    async getItemProperties(modelID: number, id: number, recursive = false) {
        return this.api.GetLine(modelID, id, recursive);
    }

    async getPropertySets(modelID: number, elementID: number, recursive = false) {
        return await this.getProperty(modelID, elementID, recursive, PropsNames.psets);
    }

    async getTypeProperties(modelID: number, elementID: number, recursive = false) {
        return await this.getProperty(modelID, elementID, recursive, PropsNames.type);
    }

    async getMaterialsProperties(modelID: number, elementID: number, recursive = false) {
        return await this.getProperty(modelID, elementID, recursive, PropsNames.materials);
    }

    async getSpatialStructure(modelID: number, includeProperties?: boolean) {
        await this.getAllTypesOfModel(modelID);
        const chunks = await this.getSpatialTreeChunks(modelID);
        const allLines = await this.api.GetLineIDsWithType(modelID, IFCPROJECT);
        const projectID = allLines.get(0);
        const project = Properties.newIfcProject(projectID);
        await this.getSpatialNode(modelID, project, chunks, includeProperties);
        this.cleanupTypes();
        return project;
    }

    async getAllItemsOfType(modelID: number, type: number, verbose: boolean) {
        let items: number[] = [];
        const lines = await this.api.GetLineIDsWithType(modelID, type);
        for (let i = 0; i < lines.size(); i++) items.push(lines.get(i));
        if (!verbose) return items;
        const result: any[] = [];
        for (let i = 0; i < items.length; i++) {
            result.push(await this.api.GetLine(modelID, items[i]));
        }
        return result;
    }

    private async getProperty(modelID: number, elementID: number, recursive = false, propName: pName) {
        const propSetIds = await this.getAllRelatedItemsOfType(modelID, elementID, propName);
        const result: any[] = [];
        for (let i = 0; i < propSetIds.length; i++) {
            result.push(await this.api.GetLine(modelID, propSetIds[i], recursive));
        }
        return result;
    }

    private async getChunks(modelID: number, chunks: any, propNames: pName) {
        const relation = await this.api.GetLineIDsWithType(modelID, propNames.name);
        for (let i = 0; i < relation.size(); i++) {
            const rel = await this.api.GetLine(modelID, relation.get(i), false);
            this.saveChunk(chunks, propNames, rel);
        }
    }

    private static isRelated(id: number, rel: any, propNames: pName) {
        const relatedItems = rel[propNames.related];
        if (Array.isArray(relatedItems)) {
            const values = relatedItems.map((item) => item.value);
            return values.includes(id);
        }
        return relatedItems.value === id;
    }

    private static newIfcProject(id: number) {
        return {
            expressID: id,
            type: 'IFCPROJECT',
            children: []
        };
    }

    private async getSpatialNode(modelID: number, node: Node, treeChunks: any, includeProperties?: boolean) {
        await this.getChildren(modelID, node, treeChunks, PropsNames.aggregates, includeProperties);
        await this.getChildren(modelID, node, treeChunks, PropsNames.spatial, includeProperties);
    }

    private async getChildren(modelID: number, node: Node, treeChunks: any, propNames: pName, includeProperties?: boolean) {
        const children = treeChunks[node.expressID];
        if (children == undefined) return;
        const prop = propNames.key as keyof Node;
        const nodes: any[] = [];
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            let node = this.newNode(child);
            if (includeProperties) {
                const properties = await this.getItemProperties(modelID, node.expressID) as any;
                node = {...properties, ...node};
            }
            await this.getSpatialNode(modelID, node, treeChunks, includeProperties);
            nodes.push(node);
        }
        (node[prop] as Node[]) = nodes;
    }

    private newNode(id: number) {
        const typeName = this.getNodeType(id);
        return {
            expressID: id,
            type: typeName,
            children: []
        };
    }

    private getNodeType(id: number) {
        const typeID = this.types[id];
        return IfcElements[typeID];
    }

    private async getSpatialTreeChunks(modelID: number) {
        const treeChunks: any = {};
        await this.getChunks(modelID, treeChunks, PropsNames.aggregates);
        await this.getChunks(modelID, treeChunks, PropsNames.spatial);
        return treeChunks;
    }

    private saveChunk(chunks: any, propNames: pName, rel: any) {
        const relating = rel[propNames.relating].value;
        const related = rel[propNames.related].map((r: any) => r.value);
        if (chunks[relating] == undefined) {
            chunks[relating] = related;
        } else {
            chunks[relating] = chunks[relating].concat(related);
        }
    }

    private getRelated(rel: any, propNames: pName, IDs: number[]) {
        const element = rel[propNames.relating];
        if (!Array.isArray(element)) IDs.push(element.value);
        else element.forEach((ele) => IDs.push(ele.value));
    }

    private async getAllRelatedItemsOfType(modelID: number, id: number, propNames: pName) {
        const lines = await this.api.GetLineIDsWithType(modelID, propNames.name);
        const IDs: number[] = [];
        for (let i = 0; i < lines.size(); i++) {
            const rel = await this.api.GetLine(modelID, lines.get(i));
            const isRelated = Properties.isRelated(id, rel, propNames);
            if (isRelated) this.getRelated(rel, propNames, IDs);
        }
        return IDs;
    }

    private cleanupTypes() {
        this.types = {};
    }

    private async getAllTypesOfModel(modelID: number) {
        const result = {};
        const elements = Object.keys(IfcElements).map((e) => parseInt(e));
        for(let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const lines = await this.api.GetLineIDsWithType(modelID, element);
            const size = lines.size();
            //@ts-ignore
            for (let i = 0; i < size; i++) result[lines.get(i)] = element;
        }
        this.types = result;
    }
}