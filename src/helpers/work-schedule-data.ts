import { WebIfcTool } from "./web-ifc-tool";
import {IfcAPI} from "../web-ifc-api"

export class WorkScheduleData { 
    data: {};
    webIfcTool: any;

    constructor(private api: IfcAPI)
        {
            this.webIfcTool = new WebIfcTool(this.api)
        }

    //TO DO: Refactor to retrieve top-level task from a workschedule entity, and then load tasks.
    // Currently only tasks are retrieved. 
    async loadTaskData(modelID: number){
        await this.loadTasks(modelID)
        await this.loadTaskSequence(modelID)
        await this.loadTaskOutputs(modelID)
        await this.loadTaskNesting(modelID)
        await this.loadTaskOperations(modelID)
    }

    async loadTasks(modelID: number){
        let tasks = await this.webIfcTool.byType(modelID, "IfcTask")
        for (let i = 0; i < tasks.length; i++){
            let task = tasks[i]
            this.data[task.expressID] = {   
                "Id": task.expressID,
                "Name": task.Name.value,
                "TaskTime": ((task.TaskTime) ? this.webIfcTool.byId(modelID, task.TaskTime.value) : ""), 
                "Identification": task.Identification.value,
                "IsMilestone": task.IsMilestone.value,
                "IsPredecessorTo": [],
                "IsSucessorFrom": [],
                "Inputs": [],
                "Resources": [],
                "Outputs": [],
                "Controls": [],
                "Nests": [],
                "IsNestedBy": [],
                "OperatesOn":[],
            }
        }
    }

    async loadTaskSequence(modelID: number){
        let relSequence = await this.webIfcTool.byType(modelID, "IfcRelSequence")
        for (let i = 0; i < relSequence.length; i++){
            let rel_sequence = relSequence[i]
            let related_process = rel_sequence.RelatedProcess.value;
            let relatingProcess = rel_sequence.RelatingProcess.value;
            this.data[relatingProcess]["IsPredecessorTo"].push(rel_sequence.expressID)
            //TO DO: Next lines should be refactored to provide access to expressID only.
            let successorData = {
                "ref": rel_sequence.expressID,
                "entity": rel_sequence
            }
            this.data[related_process]["IsSucessorFrom"].push(successorData)
        }
    }

    async loadTaskOutputs(modelID: number){
        let rels_assigns_to_product = await this.webIfcTool.byType(modelID, "IfcRelAssignsToProduct");
        for (let i = 0; i < rels_assigns_to_product.length; i++){
            let relAssignsToProduct = rels_assigns_to_product[i]
            let relatingProduct = await this.webIfcTool.byId(modelID, relAssignsToProduct.RelatingProduct.value);
            let relatedObject = await this.webIfcTool.byId(modelID, relAssignsToProduct.RelatedObjects[0].value); 
            if (this.webIfcTool.isA(relatedObject, "IfcTask")) {
                this.data[relatedObject.expressID]["Outputs"].push(relatingProduct.expressID);
            }
        }
    }

    async loadTaskNesting(modelID: number){
        let rels_nests = await this.webIfcTool.byType(modelID, "IfcRelNests");
        for (let i = 0; i < rels_nests.length; i++){
            let relNests = rels_nests[i];
            let relating_object = await this.webIfcTool.byId(modelID, relNests.RelatingObject.value);
            let relatedObjects = relNests.RelatedObjects;
            if (this.webIfcTool.isA(relating_object, "IfcTask")) {
                for (var object_index = 0; object_index < relatedObjects.length; object_index++) {
                    this.data[relating_object.expressID]["IsNestedBy"].push(relatedObjects[object_index].value);
                    this.data[relatedObjects[object_index].value]["Nests"].push(relating_object.expressID);
                }
            }
            
        }

    }

    async loadTaskOperations(modelID: number){
        let relsAssignsToProcess = await this.webIfcTool.byType(modelID, "IfcRelAssignsToProcess");
        for (let i = 0; i < relsAssignsToProcess.length; i++){
            let relAssignToProcess = relsAssignsToProcess[i];
            let relatingProcess = await this.webIfcTool.byId(modelID, relAssignToProcess.RelatingProcess.value);
            let relatedObjects = relAssignToProcess.RelatedObjects;
            if (this.webIfcTool.isA(relatingProcess, "IfcTask")) {
                for (var object_index = 0; object_index < relatedObjects.length; object_index++) {
                    this.data[relatingProcess.expressID]["OperatesOn"].push(relatedObjects[object_index].value);
                    console.log(relatingProcess.expressID);
                    console.log("Has Operations");
                }
            }
        }
    }
}

    

