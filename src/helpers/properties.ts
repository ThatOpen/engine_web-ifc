/**
 * Web-IFC Properties
 * @module Properties
 */

import {
    IfcAPI,
    IFCPROJECT, IFCRELAGGREGATES,
    IFCRELCONTAINEDINSPATIALSTRUCTURE,
    IFCRELDEFINESBYPROPERTIES,
    IFCRELASSOCIATESMATERIAL,
    IFCRELDEFINESBYTYPE,
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
    },
    psets: {
        name: IFCRELDEFINESBYPROPERTIES,
        relating: 'RelatingPropertyDefinition',
        related: 'RelatedObjects',
        key: 'IsDefinedBy'
    },
    materials: {
        name: IFCRELASSOCIATESMATERIAL,
        relating: 'RelatingMaterial',
        related: 'RelatedObjects',
        key: 'HasAssociations',
    },
    type: {
        name: IFCRELDEFINESBYTYPE,
        relating: 'RelatingType',
        related: 'RelatedObjects',
        key: 'IsDefinedBy'
    }
};

export class Properties {

    /** @ignore */
    constructor(private api: IfcAPI) {
    }

	/**
	 * 
	 * @param modelID model handle
	 * @param id  expressID of IfcElement
	 * @param recursive default false, if true get all nested properties recursively
	 * @param inverse default false, if true get all inverse properties recursively
	 * @returns IfcElement
	 */
    async getItemProperties(modelID: number, id: number, recursive = false, inverse = false) {
        return this.api.GetLine(modelID, id, recursive, inverse);
    }

	/**
	 * Get IfcPropertySets of IfcElements
	 * @param modelID model handle
	 * @param elementID expressID of IfcElement, default 0 (all psets in model)
	 * @param recursive default false, if true get all nested properties recursively
	 * @returns array of IfcElements inheriting from IfcPropertySetDefinition
	 */
    async getPropertySets(modelID: number, elementID = 0, recursive = false, includeTypeProperties = false) {
        if (includeTypeProperties)
        {
            let types = await this.getTypeProperties(modelID,elementID,false);
            let results: any[] = [];
            for (let t of types) results.push(...await this.getPropertySets(modelID,t.expressID,recursive));
            return results;

        } else return await this.getRelatedProperties(modelID, elementID, PropsNames.psets, recursive);
    }

	/**
	 * Set IfcRelDefinesByProperties relations of IfcElements and IfcPropertySets
	 * @param modelID model handle
	 * @param elementID expressID or array of expressIDs of IfcElements
	 * @param psetID expressID or array of expressIDs of IfcPropertySets
	 * @returns true if success or false if error
	 */
	async setPropertySets(modelID: number, elementID: number|number[], psetID: number|number[]) {
		return this.setItemProperties(modelID, elementID,  psetID, PropsNames.psets);
	}

    /**
     * Get TypeObject of IfcElements
     * @param modelID model handle
     * @param elementID expressID of IfcElement, default 0 (all type objects in model)
     * @param recursive default false, if true get all nested properties of the type object recursively
     * @returns array of objects inheriting from IfcTypeObject
     */
    async getTypeProperties(modelID: number, elementID: number = 0, recursive = false) {
        if (this.api.GetModelSchema(modelID) == 'IFC2X3')
        {
          return await this.getRelatedProperties(modelID, elementID, PropsNames.type, recursive);
        } 
        else
        {
          return await this.getRelatedProperties(modelID, elementID, {...PropsNames.type, key: 'IsTypedBy'}, recursive);
        }
    }

	/**
	 * Get materials of IfcElement
	 * @param modelID model handle
	 * @param elementID expressID of IfcElement, default 0 (all materials in model)
	 * @param recursive default false, if true get all nested properties recursively
	 * @returns array of IfcElements inheriting from IfcMaterialDefinition
	 */
    async getMaterialsProperties(modelID: number, elementID = 0, recursive = false, includeTypeMaterials = false) {
        if (includeTypeMaterials)
        {
            let types = await this.getTypeProperties(modelID,elementID,false);
            let results: any[] = [];
            for (let t of types) results.push(...await this.getMaterialsProperties(modelID,t.expressID,recursive));
            return results;

        } else return await this.getRelatedProperties(modelID, elementID, PropsNames.materials, recursive);
    }

	/**
	 * Set IfcRelAssociatesMaterial relations of IfcElements and IfcMaterialDefinitions
	 * @param modelID model handle
	 * @param elementID expressID or array of expressIDs of IfcElements
	 * @param materialID expressID or array of expressIDs of IfcMaterialDefinitions
	 * @returns true if success or false if error
	 */
	async setMaterialsProperties(modelID: number, elementID: number|number[], materialID: number|number[]) {
		return this.setItemProperties(modelID, elementID,  materialID, PropsNames.materials);
	}

	/**
	 * Get Spatial Structure of IfcProject
	 * @param modelID model handle
	 * @param includeProperties default false
	 * @returns IfcProject as Node
	 */
    async getSpatialStructure(modelID: number, includeProperties = false): Promise<Node> {
        const chunks = await this.getSpatialTreeChunks(modelID);
        const allLines = await this.api.GetLineIDsWithType(modelID, IFCPROJECT);
        const projectID = allLines.get(0);
        const project = Properties.newIfcProject(projectID);
        await this.getSpatialNode(modelID, project, chunks, includeProperties);
        return project;
    }


    private async getRelatedProperties(modelID: number, elementID: number, propsName: pName, recursive = false) {
        const result: any[] = [];
        let rels = null;
        if (elementID !== 0)
            rels = await this.api.GetLine(modelID, elementID, false, true, propsName.key)[propsName.key];
        else {
			let vec = this.api.GetLineIDsWithType(modelID, propsName.name);
			rels = [];
			for (let i = 0; i<vec.size(); ++i)
				rels.push({value: vec.get(i)});
		}
            
        if (rels == null ) return result;
        if (!Array.isArray(rels)) rels = [rels];
        for (let i = 0; i < rels.length; i++) {
          let propSetIds =  await this.api.GetLine(modelID, rels[i].value, false, false)[propsName.relating];
          if (propSetIds == null) continue;
          if (!Array.isArray(propSetIds)) propSetIds = [propSetIds];
          for (let x = 0; x < propSetIds.length; x++) {
            result.push(await this.api.GetLine(modelID, propSetIds[x].value, recursive));
          }
        }
        return result;
    }

    private async getChunks(modelID: number, chunks: any, propNames: pName) {
        const relation = await this.api.GetLineIDsWithType(modelID, propNames.name, true);
        for (let i = 0; i < relation.size(); i++) {
            const rel = await this.api.GetLine(modelID, relation.get(i), false);
            this.saveChunk(chunks, propNames, rel);
        }
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
            type: this.api.GetNameFromTypeCode(type),
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

	private async setItemProperties(modelID: number, elementID: number|number[], propID: number|number[], propsName: pName) {
		if (!Array.isArray(elementID)) elementID = [elementID];
		if (!Array.isArray(propID)) propID = [propID];
		let foundRel = 0;
		const rels: any[] = [];
		const elements: any[] = [];
		for(const elID of elementID) {
			const element = await this.api.GetLine(modelID, elID, false, true);
			if (!element[propsName.key]) continue;
			elements.push(element);
		}
		if (elements.length < 1) return false;
		const relations = this.api.GetLineIDsWithType(modelID, propsName.name);
		for (let i = 0; i < relations.size(); ++i) {
			const rel = await this.api.GetLine(modelID, relations.get(i));
			if (propID.includes(Number(rel[propsName.relating].value))) {
				rels.push(rel);	
				foundRel++;
			}
			if (foundRel == propID.length) break;
		}
		for (const element of elements) {
			for (const rel of rels) {
				// @ts-ignore
				if (!element[propsName.key].some(e => e.value === rel.expressID))
					element[propsName.key].push({ type: 5, value: rel.expressID });
				// @ts-ignore
				if (!rel[propsName.related].some(e => e.value === element.expressID)) {
					rel[propsName.related].push({ type: 5, value: element.expressID });
					this.api.WriteLine(modelID, rel);
				}
			}
			this.api.WriteLine(modelID, element);
		}
		return true;
	}
}
