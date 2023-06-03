tsc  --incremental --emitDeclarationOnly 
cpy src/*.ts dist/  --flat
cpy src/helpers/* dist/helpers --flat 
cpy src/api/* dist/api --flat 
cpy dist/web-ifc-api.d.ts . --rename=web-ifc-api-node.d.ts
echo "Done building TS Api"