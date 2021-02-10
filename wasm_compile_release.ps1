
$f_export = "[" + [string]::Join(',',
    "'_main'"
    ,"'_getString'"
    ,"'_OpenModel'"
    ,"'_CloseModel'"
    ,"'_IsModelOpen'"
    ,"'_GetExpressIdsWithType'"
    ,"'_GetFlattenedGeometry'"
    ,"'_LoadAllGeometry'"
) + "]";

Write-Host "Exporting:"
Write-Host $f_export
# g4 -s SAFE_HEAP=1
em++ --bind -O3 -flto -fno-exceptions -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'UTF8ArrayToString']" web-ifc-wasm.cpp -s ALLOW_MEMORY_GROWTH=1 -s FORCE_FILESYSTEM=1 -O3 -o web-ifc-js/wasm-lib/web-ifc.js