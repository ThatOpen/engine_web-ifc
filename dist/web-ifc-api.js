var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// lib/web-ifc-api.ts
__markAsModule(exports);
__export(exports, {
  CloseModel: () => CloseModel,
  IsModelOpen: () => IsModelOpen,
  LoadAllGeometry: () => LoadAllGeometry,
  OpenModel: () => OpenModel,
  SetModule: () => SetModule,
  WaitForModuleReady: () => WaitForModuleReady,
  ms: () => ms
});
var wasm_module = void 0;
function SetModule(module2) {
  wasm_module = module2;
}
function ms() {
  return new Date().getTime();
}
function WaitForModuleReady() {
  return new Promise((resolve, reject) => {
    wasm_module["onRuntimeInitialized"] = () => {
      resolve();
    };
  });
}
function OpenModel(filename, data) {
  wasm_module["FS_createDataFile"]("/", "filename", data, true, true, true);
  console.log("Wrote file");
  let result = wasm_module.OpenModel(filename);
  wasm_module["FS_unlink"]("/filename");
  return result;
}
function CloseModel(modelID) {
  wasm_module.CloseModel(modelID);
}
function IsModelOpen(modelID) {
  return wasm_module.IsModelOpen(modelID);
}
function LoadAllGeometry(modelID) {
  return wasm_module.LoadAllGeometry(modelID);
}
