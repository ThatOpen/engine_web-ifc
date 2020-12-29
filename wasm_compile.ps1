
$f_export = "[" + [string]::Join(',',
    "'_main'"
    ,"'_getString'"
    ,"'_OpenModel'"
    ,"'_CloseModel'"
) + "]";

Write-Host "Exporting:"
Write-Host $f_export

em++ -O2 -s ASSERTIONS=1 -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'UTF8ArrayToString']" -s EXPORTED_FUNCTIONS=$f_export web-ifc-wasm.cpp -s ALLOW_MEMORY_GROWTH=1 -s FORCE_FILESYSTEM=1 -o web-ifc-js/wasm-lib/web-ifc.js