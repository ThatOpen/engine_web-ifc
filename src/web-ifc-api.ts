/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { IfcEntities, FILE_SCHEMA } from "./ifc-schema";

let WebIFCWasm: any;

//@ts-ignore
if (typeof self !== 'undefined' && self.crossOriginIsolated) {
    WebIFCWasm = require("./web-ifc-mt");
}
else {
    WebIFCWasm = require("./web-ifc");
}
export * from "./ifc-schema";
import * as ifc from "./ifc_schema_helper";
import { Properties } from "./helpers/properties";
export * from "./ifc_schema_helper";

export const UNKNOWN = 0;
export const STRING = 1;
export const LABEL = 2;
export const ENUM = 3;
export const REAL = 4;
export const REF = 5;
export const EMPTY = 6;
export const SET_BEGIN = 7;
export const SET_END = 8;
export const LINE_END = 9;

export interface LoaderSettings {
    COORDINATE_TO_ORIGIN?: boolean;
    USE_FAST_BOOLS?: boolean;
    CIRCLE_SEGMENTS_LOW?: number;
    CIRCLE_SEGMENTS_MEDIUM?: number;
    CIRCLE_SEGMENTS_HIGH?: number;
    BOOL_ABORT_THRESHOLD?: number;
}


// TODO(pablo): Don't know how to get static refs to the values, so
// manually keeping in-sync with src/wasm/include/web-ifc.h.
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    OFF = 4,
}

export interface Vector<T> {
    get(index: number): T;
    size(): number;
}

export interface Color {
    x: number;
    y: number;
    z: number;
    w: number;
}

export interface PlacedGeometry {
    color: Color;
    geometryExpressID: number;
    flatTransformation: Array<number>;
}

export interface FlatMesh {
    geometries: Vector<PlacedGeometry>;
    expressID: number;
}

export interface RawLineData {
    ID: number;
    type: number;
    arguments: any[];
}

export interface LoaderError {
    type: string;
    message: string;
    expressID: number;
    ifcType: number;
}

export interface IfcGeometry {
    GetVertexData(): number;
    GetVertexDataSize(): number;
    GetIndexData(): number;
    GetIndexDataSize(): number;
}

export interface ifcType {
    typeID: number;
    typeName: string;
}

export function ms() {
    return new Date().getTime();
}

export type LocateFileHandlerFn = (path: string, prefix: string) => string;

export class IfcAPI {
    wasmModule: undefined | any = undefined;
    fs: undefined | any = undefined;
    wasmPath: string = "";
    isWasmPathAbsolute = false;

    modelSchemaList: string[] = [];

    ifcGuidMap: Map<number, Map<string | number, string | number>> = new Map<number, Map<string | number, string | number>>();

    /**
     * Contains all the logic and methods regarding properties, psets, qsets, etc.
     */
    properties = new Properties(this);

    logLevel = LogLevel.INFO

    /**
     * Initializes the WASM module (WebIFCWasm), required before using any other functionality.
     *
     * @param customLocateFileHandler An optional locateFile function that let's
     * you override the path from which the wasm module is loaded.
     */
    async Init(customLocateFileHandler?: LocateFileHandlerFn) {
        if (WebIFCWasm) {
            let locateFileHandler: LocateFileHandlerFn = (path, prefix) => {
                // when the wasm module requests the wasm file, we redirect to include the user specified path
                if (path.endsWith(".wasm")) {
                    if (this.isWasmPathAbsolute) {
                        return this.wasmPath + path;
                    }

                    return prefix + this.wasmPath + path;
                }
                // otherwise use the default path
                return prefix + path;
            }

            //@ts-ignore
            this.wasmModule = await WebIFCWasm({ noInitialRun: true, locateFile: customLocateFileHandler || locateFileHandler });
            this.fs = this.wasmModule.FS;
        }
        else {
            this.LogError(`Could not find wasm module at './web-ifc' from web-ifc-api.ts`);
        }
    }

    /**
     * Opens a model and returns a modelID number
     * @data Buffer containing IFC data (bytes)
     * @data Settings settings for loading the model
    */
    OpenModel(data: Uint8Array, settings?: LoaderSettings): number {
        let s: LoaderSettings = {
            COORDINATE_TO_ORIGIN: false,
            USE_FAST_BOOLS: true, //TODO: This needs to be fixed in the future to rely on elalish/manifold
            CIRCLE_SEGMENTS_LOW: 5,
            CIRCLE_SEGMENTS_MEDIUM: 8,
            CIRCLE_SEGMENTS_HIGH: 12,
            BOOL_ABORT_THRESHOLD: 10000,
            ...settings
        };
        let offsetInSrc = 0;
        let result = this.wasmModule.OpenModel(s, (destPtr: number, destSize: number) => {
            let srcSize = Math.min(data.byteLength - offsetInSrc, destSize);

            let dest = this.wasmModule.HEAPU8.subarray(destPtr, destPtr + destSize);
            let src = data.subarray(offsetInSrc, offsetInSrc + srcSize);

            dest.set(src);

            offsetInSrc += srcSize;

            return srcSize;
        });
        this.modelSchemaList[result] = this.GetHeaderLine(result, FILE_SCHEMA).arguments[0][0].value;
        console.log("Parsing Model using " + this.modelSchemaList[result] + " Schema");
        return result;
    }

    /**
     * Fetches the schema version of a given model
     *
    */
    GetModelSchema(modelID: number) {
        return this.modelSchemaList[modelID];
    }

    /**
     * Creates a new model and returns a modelID number
     * @data Settings settings for generating data the model
    */
    CreateModel(schema: string, settings?: LoaderSettings): number {
        let s: LoaderSettings = {
            COORDINATE_TO_ORIGIN: false,
            USE_FAST_BOOLS: true, //TODO: This needs to be fixed in the future to rely on elalish/manifold
            CIRCLE_SEGMENTS_LOW: 5,
            CIRCLE_SEGMENTS_MEDIUM: 8,
            CIRCLE_SEGMENTS_HIGH: 12,
            BOOL_ABORT_THRESHOLD: 10000,
            ...settings
        };
        let result = this.wasmModule.CreateModel(s);
        this.modelSchemaList[result] = schema;
        return result;
    }

    ExportFileAsIFC(modelID: number): Uint8Array {
        this.wasmModule.ExportFileAsIFC(modelID);
        //@ts-ignore
        let result = this.fs.readFile("/export.ifc");
        this.wasmModule['FS_unlink']("/export.ifc");
        return result;
    }

    async Serialize(paths: any, serializedFileName: any, storeSerialized: (buffer: any) => void, ramLimit: number = 200000000): Promise<void> {
        this.wasmModule.Serialize(paths, serializedFileName, storeSerialized, ramLimit);
    }

    OpenSerialized(paths: any, settings?: LoaderSettings, ramLimit: number = 200000000): number {
        let s: LoaderSettings = {
            COORDINATE_TO_ORIGIN: false,
            USE_FAST_BOOLS: true,
            CIRCLE_SEGMENTS_LOW: 5,
            CIRCLE_SEGMENTS_MEDIUM: 8,
            CIRCLE_SEGMENTS_HIGH: 12,
            BOOL_ABORT_THRESHOLD: 10000,
            ...settings
        };
        return this.wasmModule.OpenSerialized(paths, s, ramLimit);
    }

    /**
     * Opens a model and returns a modelID number
     * @modelID Model handle retrieved by OpenModel, model must not be closed
     * @data Buffer containing IFC data (bytes)
    */
    GetGeometry(modelID: number, geometryExpressID: number): IfcGeometry {
        return this.wasmModule.GetGeometry(modelID, geometryExpressID);
    }

    GetHeaderLine(modelID: number, headerType: number) {
        return this.wasmModule.GetHeaderLine(modelID, headerType);
    }

    GetAllTypesOfModel(modelID: number): ifcType[] {
        let typesNames: ifcType[] = [];
        const elements = Object.keys(IfcEntities).map((e) => parseInt(e));
        for (let i = 0; i < elements.length; i++) {
            const lines = this.GetLineIDsWithType(modelID, elements[i]);
            if (lines.size() > 0) typesNames.push({ typeID: elements[i], typeName: IfcEntities[elements[i]] });
        }
        return typesNames;
    }

    GetLine(modelID: number, expressID: number, flatten: boolean = false, inverse: boolean = false) {
        let expressCheck = this.wasmModule.ValidateExpressID(modelID, expressID);
        if (!expressCheck) {
            return;
        }

        let rawLineData = this.GetRawLineData(modelID, expressID);
        let lineData = ifc.FromRawLineData[this.modelSchemaList[modelID]][rawLineData.type](rawLineData);

        if (flatten) {
            this.FlattenLine(modelID, lineData);
        }

        let inverseData = ifc.InversePropertyDef[this.modelSchemaList[modelID]][rawLineData.type];
        if (inverse && inverseData != null) 
        {
          for (let inverseProp of inverseData) 
          {
            if (!inverseProp[3]) lineData[inverseProp[0]] = null;
            else lineData[inverseProp[0]] = [];
            
            let targetTypes = [inverseProp[1]];
            if (typeof ifc.InheritanceDef[this.modelSchemaList[modelID]][inverseProp[1]] != "undefined")
            {
              targetTypes=targetTypes.concat(ifc.InheritanceDef[this.modelSchemaList[modelID]][inverseProp[1]]);
            }
            let inverseIDs = this.wasmModule.GetInversePropertyForItem(modelID, expressID, targetTypes, inverseProp[2], inverseProp[3]);
            if (!inverseProp[3] && inverseIDs.size()>0) 
            {
              if (!flatten) lineData[inverseProp[0]] = { type: 5,  value: inverseIDs.get(0) };
              else lineData[inverseProp[0]] = this.GetLine(modelID, inverseIDs.get(0));
            }
            else 
            {
                for (let x = 0; x < inverseIDs.size(); x++) {
                  if (!flatten) lineData[inverseProp[0]].push({ type: 5,  value: inverseIDs.get(x) });
                  else lineData[inverseProp[0]].push(this.GetLine(modelID, inverseIDs.get(x)));
                }
            }
          }
        }
        return lineData;
    }

    GetNextExpressID(modelID: number, expressID: number): number {
        return this.wasmModule.GetNextExpressID(modelID, expressID);
    }

    GetAndClearErrors(modelID: number): Vector<LoaderError> {
        return this.wasmModule.GetAndClearErrors(modelID);
    }

    WriteLine(modelID: number, lineObject: any) {
        // this is pretty weakly-typed nonsense
        Object.keys(lineObject).forEach(propertyName => {
            let property = lineObject[propertyName];
            if (property && property.expressID !== undefined) {
                // this is a real object, we have to write it as well and convert to a handle
                // TODO: detect if the object needs to be written at all, or if it's unchanged
                this.WriteLine(modelID, property);

                // overwrite the reference
                // NOTE: this modifies the parameter
                lineObject[propertyName] = {
                    type: 5,
                    value: property.expressID
                }
            }
            else if (Array.isArray(property) && property.length > 0) {
                for (let i = 0; i < property.length; i++) {
                    if (property[i].expressID !== undefined) {
                        // this is a real object, we have to write it as well and convert to a handle
                        // TODO: detect if the object needs to be written at all, or if it's unchanged
                        this.WriteLine(modelID, property[i]);

                        // overwrite the reference
                        // NOTE: this modifies the parameter
                        lineObject[propertyName][i] = {
                            type: 5,
                            value: property[i].expressID
                        }
                    }
                }
            }
        });
        
        if(lineObject.expressID === undefined || lineObject.expressID < 0) {
            lineObject.expressID = this.IncrementMaxExpressID(modelID, 1);
        }

        // See https://github.com/IFCjs/web-ifc/issues/178 for some pitfalls here.
        if (lineObject.expressID === undefined
            || lineObject.type === undefined
            || lineObject.ToTape === undefined) {
            this.LogWarn('Line object cannot be serialized; invalid format:', lineObject)
            return
        }

        let rawLineData: RawLineData = {
            ID: lineObject.expressID,
            type: lineObject.type,
            arguments: lineObject.ToTape() as any[]
        }

        this.WriteRawLineData(modelID, rawLineData);
    }

    FlattenLine(modelID: number, line: any) {
        Object.keys(line).forEach(propertyName => {
            let property = line[propertyName];
            if (property && property.type === 5) {
                line[propertyName] = this.GetLine(modelID, property.value, true);
            }
            else if (Array.isArray(property) && property.length > 0 && property[0].type === 5) {
                for (let i = 0; i < property.length; i++) {
                    line[propertyName][i] = this.GetLine(modelID, property[i].value, true);
                }
            }
        });
    }

    GetRawLineData(modelID: number, expressID: number): RawLineData {
        return this.wasmModule.GetLine(modelID, expressID) as RawLineData;
    }

    WriteRawLineData(modelID: number, data: RawLineData) {
        return this.wasmModule.WriteLine(modelID, data.ID, data.type, data.arguments);
    }

    GetLineIDsWithType(modelID: number, type: number, includeInherited: boolean = false): Vector<number> {
        let types: Array<number> = [];
        types.push(type);
        if (includeInherited && typeof ifc.InheritanceDef[this.modelSchemaList[modelID]][type] != "undefined")
        {
          types = types.concat(ifc.InheritanceDef[this.modelSchemaList[modelID]][type]);
        } 
        return this.wasmModule.GetLineIDsWithType(modelID, types);
    }

    GetAllLines(modelID: Number): Vector<number> {
        return this.wasmModule.GetAllLines(modelID);
    }

    SetGeometryTransformation(modelID: number, transformationMatrix: Array<number>) {
        if (transformationMatrix.length != 16) {
            throw new Error(`invalid matrix size: ${transformationMatrix.length}`);
        }
        this.wasmModule.SetGeometryTransformation(modelID, transformationMatrix);
    }

    GetCoordinationMatrix(modelID: number): Array<number> {
        return this.wasmModule.GetCoordinationMatrix(modelID) as Array<number>;
    }

    GetVertexArray(ptr: number, size: number): Float32Array {
        return this.getSubArray(this.wasmModule.HEAPF32, ptr, size);
    }

    GetIndexArray(ptr: number, size: number): Uint32Array {
        return this.getSubArray(this.wasmModule.HEAPU32, ptr, size);
    }

    getSubArray(heap: any, startPtr: number, sizeBytes: number) {
        return heap.subarray(startPtr / 4, startPtr / 4 + sizeBytes).slice(0);
    }

    /**
     * Closes a model and frees all related memory
     * @modelID Model handle retrieved by OpenModel, model must not be closed
    */
    CloseModel(modelID: number) {
        this.ifcGuidMap.delete(modelID);
        this.wasmModule.CloseModel(modelID);
    }

    StreamAllMeshes(modelID: number, meshCallback: (mesh: FlatMesh) => void) {
        this.wasmModule.StreamAllMeshes(modelID, meshCallback);
    }

    StreamAllMeshesWithTypes(modelID: number, types: Array<number>, meshCallback: (mesh: FlatMesh) => void) {
        this.wasmModule.StreamAllMeshesWithTypes(modelID, types, meshCallback);
    }

    /**
     * Checks if a specific model ID is open or closed
     * @modelID Model handle retrieved by OpenModel
    */
    IsModelOpen(modelID: number): boolean {
        return this.wasmModule.IsModelOpen(modelID);
    }

    /**
     * Load all geometry in a model
     * @modelID Model handle retrieved by OpenModel
    */
    LoadAllGeometry(modelID: number): Vector<FlatMesh> {
        return this.wasmModule.LoadAllGeometry(modelID);
    }

    /**
     * Load geometry for a single element
     * @modelID Model handle retrieved by OpenModel
    */
    GetFlatMesh(modelID: number, expressID: number): FlatMesh {
        return this.wasmModule.GetFlatMesh(modelID, expressID);
    }

    /**
         * Returns the maximum ExpressID value in the IFC file, ex.- #9999999
         * @param modelID Model handle retrieved by OpenModel
         * @returns Express numerical value
         */
    GetMaxExpressID(modelID: number) {
        return this.wasmModule.GetMaxExpressID(modelID);
    }

    /**
         * Returns the maximum ExpressID value in the IFC file after incrementing the maximum ExpressID by the increment size, ex.- #9999999
         * @param modelID Model handle retrieved by OpenModel
         * @param incrementSize The value to add to the max ExpressID for the new max ExpressID
         * @returns ExpressID numerical value
         */
    IncrementMaxExpressID(modelID: number, incrementSize: number) {
        return this.wasmModule.IncrementMaxExpressID(modelID, incrementSize);
    }

    /**
         * Returns the type of a given ifc entity in the fiule.
         * @param modelID Model handle retrieved by OpenModel
         * @param expressID Line Number
         * @returns IFC Type Code
         */

    GetLineType(modelID: number, expressID: number) {
        return this.wasmModule.GetLineType(modelID, expressID);
    }

    /**
     * Creates a map between element ExpressIDs and GlobalIDs.
     * Each element has two entries, (ExpressID -> GlobalID) and (GlobalID -> ExpressID).
     * @modelID Model handle retrieved by OpenModel
     */
    CreateIfcGuidToExpressIdMapping(modelID: number): void {
        const map = new Map<string | number, string | number>();
        for (const typeId in IfcEntities) {
            const lines = this.GetLineIDsWithType(modelID, Number(typeId));
            const size = lines.size();
            for (let y = 0; y < size; y++) {
                const expressID = lines.get(y);
                const info = this.GetLine(modelID, expressID);
                if (info.GlobalId == null) {
                    continue;
                }
                const globalID = info.GlobalId.value;
                map.set(expressID, globalID);
                map.set(globalID, expressID);
            }
        }
        this.ifcGuidMap.set(modelID, map);
    }

    SetWasmPath(path: string, absolute = false) {
        this.wasmPath = path;
        this.isWasmPathAbsolute = absolute;
    }

    SetLogLevel(level: LogLevel): void {
        this.logLevel = level;
        this.wasmModule.SetLogLevel(level);
    }

    LogDebug(...msg: string[]): void {
        if (this.logLevel >= LogLevel.DEBUG) {
            console.log('DEBUG:', ...msg);
        }
    }

    LogInfo(...msg: string[]): void {
        if (this.logLevel >= LogLevel.INFO) {
            console.log('INFO:', ...msg);
        }
    }

    LogWarn(...msg: string[]): void {
        if (this.logLevel >= LogLevel.WARN) {
            console.warn('WARN:', ...msg);
        }
    }

    LogError(...msg: string[]): void {
        if (this.logLevel >= LogLevel.ERROR) {
            console.error('ERROR:', ...msg);
        }
    }
}
