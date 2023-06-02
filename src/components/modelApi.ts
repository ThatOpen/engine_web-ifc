import { 
    IfcAPI,
    NewIfcModel,
    LoaderSettings,
    REAL,
    STRING,
    REF
} from "../web-ifc-api";
import { 
    Schemas,
    IFCCARTESIANPOINT,
    IFCDIRECTION,
    IFCORGANIZATION,
    IFCAPPLICATION,
    IFCPROJECT,
    IFCGEOMETRICREPRESENTATIONCONTEXT,
    IFCAXIS2PLACEMENT3D,
    IFCSIUNIT,
    IFCUNITASSIGNMENT,
} from "../ifc-schema";
import { guid } from "../helpers/guid";

/**
 * ModelApi class
 */
export class ModelApi {
    constructor(private ifcApi: IfcAPI) {
    }

    /**
     * Creates a new model and returns a modelID number
     * establishes the bare minimum of an IFC file
     * @param model - NewIfcModel, defaults to IFC4 with defaul values
     * @param settings - LoaderSettings
	 * @returns ModelID
     * ```typescript
     * const modelID = ifcApi.modelApi.Create({ schema: ifcApi.Schemas.IFC2X3 });
     * ```
    */
    Create(model?: NewIfcModel, settings?: LoaderSettings): number {
        if(!model) model = { schema: Schemas.IFC4 };
        const ifcApi = this.ifcApi;
        const appName = "ifcjs/web-ifc-api";
        const modelId = ifcApi.CreateModel(model, settings);
        const modelName = model.name ? model.name : `IfcModel_${modelId}`;
        const description = model.description && model.description.length ? model.description[0] : 'Created with web-ifc';

        // minimum of an IFC file @see https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/annex_e/ProjectSetup_1.html
        
        // 3D origin
        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCCARTESIANPOINT, [
            {type: REAL, value: 0},
            {type: REAL, value: 0},
            {type: REAL, value: 0}
        ]));
        // 2D origin
        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCCARTESIANPOINT, [
            {type: REAL, value: 0},
            {type: REAL, value: 0},
        ]));
        // x direction
        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCDIRECTION, [
            {type: REAL, value: 1},
            {type: REAL, value: 0},
            {type: REAL, value: 0}
        ]));
        // y direction
        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCDIRECTION, [
            {type: REAL, value: 0},
            {type: REAL, value: 1},
            {type: REAL, value: 0}
        ]));
        // z direction
        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCDIRECTION, [
            {type: REAL, value: 0},
            {type: REAL, value: 0},
            {type: REAL, value: 1}
        ]));

        ifcApi.WriteLine(modelId,ifcApi.CreateIfcEntity(modelId, IFCORGANIZATION, null, {type:1, value: appName}, null, null, null));
        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCAPPLICATION,
                                                    {type: REF, value: 6},
                                                    {type: STRING, value: new Date().getFullYear().toString()}, 
                                                    {type: STRING, value: appName}, {type: STRING, value: 'web-ifc'}
        ));

        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCPROJECT, 
            {type: STRING, value: guid()},
            null,
            {type: STRING, value: modelName},
            {type: STRING, value: description},
            null,
            null,
            null,
            [{type: REF, value: 9}],
            {type: REF, value: 16},
        ));

        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCGEOMETRICREPRESENTATIONCONTEXT,
            null,
            {type: STRING, value: 'Model'},
            {type: REAL, value: 3},
            {type: REAL, value: 1e-6},
            {type: REF, value: 10},
            {type: REF, value: 4},
        ));

        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCAXIS2PLACEMENT3D, 
            {type: REF, value: 1},
            {type: REF, value: 5},
            {type: REF, value: 3},
        ));

        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCSIUNIT));
        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCSIUNIT));
        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCSIUNIT));
        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCSIUNIT));
        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCSIUNIT));
        ifcApi.WriteLine(modelId, ifcApi.CreateIfcEntity(modelId, IFCUNITASSIGNMENT, [
            {type: REF, value: 11},
            {type: REF, value: 12},
            {type: REF, value: 13},
            {type: REF, value: 14},
            {type: REF, value: 15}
        ]));

        return modelId;
    }
}