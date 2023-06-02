make-dir dist/helpers
make-dir dist/api
cpy \"src/*.ts\" dist 
cpy \"src/helpers/*\" dist/helpers --flat 
cpy \"src/api/*\" dist/api --flat 
tsc  --incremental --emitDeclarationOnly 
cpy dist/web-ifc-api.d.ts . --rename=web-ifc-api-node.d.ts
echo "Done building TS Api"