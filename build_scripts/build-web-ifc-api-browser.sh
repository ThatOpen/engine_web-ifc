make-dir dist 
esbuild dist/web-ifc-api.ts \
    --bundle \
    --format=esm \
    --define:__WASM_PATH__=\"./web-ifc\" \
    --outfile=./dist/web-ifc-api.js
echo "Done building Browser Api"