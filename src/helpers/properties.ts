import {
    IfcAPI, IfcEntities,
    IFCPROJECT, IFCRELAGGREGATES,
    IFCRELCONTAINEDINSPATIALSTRUCTURE,
} from "../web-ifc-api";

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
    }
};

export class Properties {

    constructor(private api: IfcAPI) {
    }

    getIfcType(type: number) {
       return IfcEntities[type];
    }

    async getItemProperties(modelID: number, id: number, recursive = false, inverse = false) {
        return this.api.GetLine(modelID, id, recursive, inverse);
    }

    async getPropertySets(modelID: number, elementID: number, recursive = false) {
        return await this.getRelatedProperties(modelID, elementID,recursive, 'IsDefinedBy', 'RelatingPropertyDefinition');
    }

    async getTypeProperties(modelID: number, elementID: number, recursive = false) {
        if (this.api.GetModelSchema(modelID) == 'IFX2X3')
        {
          return await this.getRelatedProperties(modelID, elementID, recursive, 'IsDefinedBy', 'RelatingType');
        } 
        else
        {
          return await this.getRelatedProperties(modelID, elementID, recursive, 'IsTypedBy', 'RelatingType');
        }
    }

    async getMaterialsProperties(modelID: number, elementID: number, recursive = false) {
        return await this.getRelatedProperties(modelID, elementID,recursive, 'HasAssociations', 'RelatingMaterial');
    }

    async getSpatialStructure(modelID: number, includeProperties?: boolean): Promise<Node> {
        const chunks = await this.getSpatialTreeChunks(modelID);
        const allLines = await this.api.GetLineIDsWithType(modelID, IFCPROJECT);
        const projectID = allLines.get(0);
        const project = Properties.newIfcProject(projectID);
        await this.getSpatialNode(modelID, project, chunks, includeProperties);
        return project;
    }


    private async getRelatedProperties(modelID: number, elementID: number, recursive = false, inversePropname, relationName) {
        const lineData = await this.api.GetLine(modelID, elementID, false, true);
        const result: any[] = [];
        let rels = lineData[inversePropname];
        if (rels == null ) return result;
        if (!Array.isArray(rels)) rels = [rels];
        for (let i = 0; i < rels.length; i++) {
          let propSetIds =  await this.api.GetLine(modelID, rels[i].value, false, false)[relationName];
          if (propSetIds == null) continue;
          if (!Array.isArray(propSetIds)) propSetIds = [propSetIds];
          for (let x = 0; x < propSetIds.length; x++) {
            result.push(await this.api.GetLine(modelID, propSetIds[x].value, recursive));
          }
        }
        return result;
    }

    private async getChunks(modelID: number, chunks: any, propNames: pName) {
        const relation = await this.api.GetLineIDsWithType(modelID, propNames.name,true);
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
            let node = this.newNode(child,this.api.GetLineType(modelID, child));
            if (includeProperties) {
                const properties = await this.getItemProperties(modelID, node.expressID) as any;
                node = {...properties, ...node};
            }
            await this.getSpatialNode(modelID, node, treeChunks, includeProperties);
            nodes.push(node);
        }
        (node[prop] as Node[]) = nodes;
    }

    private newNode(id: number, type: number) {
        return {
            expressID: id,
            type: IfcEntities[type],
            children: []
        };
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
}