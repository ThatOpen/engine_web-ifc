
$f_export = "[" + [string]::Join(',',
    "'_main'"
    ,"'_getString'"
    ,"'_OpenModel'"
    ,"'_CloseModel'"
    ,"'_IsModelOpen'"
    ,"'_GetExpressIdsWithType'"
    ,"'_GetFlattenedGeometry'"
) + "]";

Write-Host "Exporting:"
Write-Host $f_export
# g4 -s SAFE_HEAP=1
em++ -O3 -std=c++17 -g4 --source-map-base http://localhost:5000/web-ifc-js/wasm-lib/ -flto -fno-rtti -fno-exceptions -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'UTF8ArrayToString']" -s EXPORTED_FUNCTIONS=$f_export web-ifc-wasm.cpp -s ALLOW_MEMORY_GROWTH=1 -s FORCE_FILESYSTEM=1 -O3 -o web-ifc-js/wasm-lib/web-ifc.js