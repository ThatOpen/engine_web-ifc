make-dir dist

esbuild dist/web-ifc-api.ts \
    --bundle \
    --format=esm \
    --external:path \
    --define:__WASM_PATH__=\"./web-ifc-node\" \
    --external:fs --external:os \
    --external:perf_hooks \
    --outfile=./dist/web-ifc-api-node.mjs

esbuild dist/web-ifc-api.ts \
    --define:__WASM_PATH__=\"./web-ifc-node\" \
    --bundle --platform=node --outfile=./dist/web-ifc-api-node.js

echo "Done building Node Api"