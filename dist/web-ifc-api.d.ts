export declare function SetModule(module: any): void;
export declare function ms(): number;
export declare function WaitForModuleReady(): Promise<void>;
/**  Opens a model and returns a handle
*/
export declare function OpenModel(filename: string, data: string | Uint8Array): number;
export declare function CloseModel(modelID: number): void;
export declare function IsModelOpen(modelID: number): boolean;
export declare function LoadAllGeometry(modelID: number): void;
