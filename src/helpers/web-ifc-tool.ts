import { IfcTypesMap } from './types-map'
import { IfcAPI } from "../web-ifc-api";

export class WebIfcTool {

    constructor(public api: IfcAPI) {
    }

    isA(entity: any, entity_class: string){
        var test = false;
        if (entity_class){
            if (IfcTypesMap[entity.type] === entity_class.toUpperCase()){
                test = true;
            }
            return test
        }
        else {
            return IfcTypesMap[entity.type]
        }
    }


    async byId (modelID: number, id: number) {
        return this.api.GetLine(modelID, id);
    }

    async IdsByType(modelID: number, entity_class: string){
        /* Returns the entities Ids of a Given Ifc Class */
        let entities_ids = await this.api.GetLineIDsWithType(modelID, Number(ifcClasses[entity_class.toUpperCase()]) );
        return entities_ids
    }

    async byType(modelID:number, entity_class:string){
        /* Returns all entities of the chosen class */
        let entities_ids = this.api.GetLineIDsWithType(modelID, Number(ifcClasses[entity_class.toUpperCase()]) )
        //let entities_ids = await this.IdsByType(modelID, entity_class) 
        if (entities_ids !== null){
            let items: any[] = [];
            for (let i = 0; i < entities_ids.size(); i++){
                let entity_id = entities_ids.get(i)
                if (entity_id !==0){
                    let entity = await this.byId(modelID, entity_id)
                    items.push(entity);
                }
                else {
                    return
                }
            }
            return items;
        }
    }
}

const reverseElementMapping = (obj) => {
    const reverseElement = {};
    Object.keys(obj).forEach(key => {
        reverseElement[obj[key]] = key;
    })
    return reverseElement;
}
const ifcClasses = reverseElementMapping(IfcTypesMap)