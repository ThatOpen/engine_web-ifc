make-dir dist
esbuild dist/web-ifc-api.ts \
    --bundle \
    --format=iife \
    --define:__WASM_PATH__=\"./web-ifc\" \
    --outfile=./dist/web-ifc-api-umd.js
echo "Done building UMD Api"