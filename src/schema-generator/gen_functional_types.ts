import {Entity} from "./gen_functional_types_interfaces";
import {generateInitialiser,findSubClasses,sortEntities,generateClass,crc32,makeCRCTable, parseElements, walkParents} from "./gen_functional_types_helpers"

const fs = require("fs");


let crcTable = makeCRCTable();

console.log("Starting...");

let tsCore: Array<string> = [];
let cppSchema: Array<string> = [];

let completeifcElementList = new Set<string>();

let completeEntityList = new Set<string>();
completeEntityList.add("FILE_SCHEMA");
completeEntityList.add("FILE_NAME");
completeEntityList.add("FILE_DESCRIPTION");

let typeList = new Set<string>();



tsCore.push(`// This is a generated file, please see: gen_functional_types.js`);
tsCore.push('export interface RawLineData { ID: number; type: number; arguments: any[]};');
tsCore.push(`export class Reference<_> { type: number=5; constructor(public value: number) {}}`);
tsCore.push(`export const FromRawLineData: any = {};`);
tsCore.push(`export const InversePropertyDef: any = {};`);
tsCore.push(`export const InheritanceDef: any = {};`);
tsCore.push(`export const Constructors: any = {};`);
tsCore.push(`export const ToRawLineData: any = {};`);
tsCore.push(`export const TypeInitialisers: any = {};`);
tsCore.push('export abstract class IfcLineObject { type: number=0; constructor(public expressID: number) {}}');
tsCore.push('function TypeInitialiser(schema:string,tapeItem:any) {');
tsCore.push('\tif (tapeItem.typecode) return TypeInitialisers[schema][tapeItem.typecode](tapeItem.value); else return tapeItem.value;');
tsCore.push('}');
tsCore.push('function Labelise(tapeItem:any) {');
tsCore.push('\ttapeItem.valueType=tapeItem.type; tapeItem.type=2; tapeItem.label=tapeItem.constructor.name.toUpperCase();');
tsCore.push('\treturn tapeItem;');
tsCore.push('}')


var files = fs.readdirSync("./");
for (var i = 0; i < files.length; i++) {
  if (!files[i].endsWith(".exp")) continue;
  var schemaName = files[i].replace(".exp","");
  var schemaNameClean = schemaName.replace(".","_");
  console.log("Generating Schema for:"+schemaName);
  let tsCurrentSchema = new Array<string>();
  tsCore.push ("import * as "+schemaNameClean+" from './ifc-schema_"+schemaNameClean+"';");
  tsCore.push(`FromRawLineData['${schemaName}'] = {};`);
  tsCore.push(`Constructors['${schemaName}'] = {};`);
  tsCore.push(`InversePropertyDef['${schemaName}'] = {};`);
  tsCore.push(`InheritanceDef['${schemaName}'] = {};`);
  tsCore.push(`ToRawLineData['${schemaName}'] = {};`);
  tsCore.push(`TypeInitialisers['${schemaName}'] = {};`);


  tsCurrentSchema.push("import {IfcLineObject,Reference} from './ifc-schema_core'");
 
  let schemaData = fs.readFileSync("./"+files[i]).toString();
  let parsed = parseElements(schemaData);
  let entities: Array<Entity> = sortEntities(parsed.entities);
  let types = parsed.types;
  let initialisersDone: Set<string> = new Set<string>();


  types.forEach((type) => {

      if (type.isList)
      {
          tsCurrentSchema.push(`export class ${type.name} {`);
          tsCurrentSchema.push(`\tconstructor(public value: Array<${type.typeName}>) {}`);
          tsCurrentSchema.push(`};`);
          typeList.add(type.name);
      }
      else if (type.isSelect)
      {
          generateInitialiser(type,initialisersDone,tsCore,crcTable,types,schemaNameClean);
          let selectOutput: string = `export type ${type.name} = `;
          type.values.forEach(refType => {
              let isType: boolean = types.some( x => x.name == refType);
              if (isType)
              {
                  selectOutput+=` | ${refType}`;
              }
              else
              {
                  selectOutput+=` | (Reference<${refType}> | ${refType})`;
              }
          });
          selectOutput+=";";
          tsCurrentSchema.push(selectOutput);
      }
      else if (type.isEnum)
      {
          tsCurrentSchema.push(`export class ${type.name} {`);
          tsCurrentSchema.push('\t'+type.values.map((v) => `static ${v} : any =  { type:3, value:'${v}'}; `).join(''));
          tsCurrentSchema.push(`}`);
      }
      else
      {
          let typeName = type.typeName;
          let typeNum = type.typeNum;
          if (type.typeName.search('Ifc') != -1) 
          {
            let rawType = types.find(x=> x.name == type.typeName);
            typeName = rawType!.typeName;
            typeNum = rawType!.typeNum;
          } 

          typeList.add(type.name);
          tsCurrentSchema.push(`export class ${type.name} {`);
          tsCurrentSchema.push(`\ttype: number=${typeNum};`);
          tsCurrentSchema.push(`\tconstructor(public value: ${typeName}) {}`);
          tsCurrentSchema.push(`}`);
      }
  });
  
  entities.forEach((e) => {
      walkParents(e,entities);
  });
  
  //now work out the children
  entities = findSubClasses(entities);
  
  for (var x=0; x < entities.length; x++) 
  {
      generateClass(entities[x],schemaNameClean, tsCurrentSchema,tsCore,types,crcTable);
      completeEntityList.add(entities[x].name);
      if (entities[x].isIfcProduct)
      {
        completeifcElementList.add(entities[x].name);
      }
  
      if (entities[x].children.length > 0)
      {
        tsCore.push(`InheritanceDef['${schemaName}'][${entities[x].name.toUpperCase()}] = [${entities[x].children.map((c) => `${c.toUpperCase()}`).join(",")}];`);
      }
      
      if (entities[x].derivedInverseProps.length > 0)
      {
        let inverseProp:string =`InversePropertyDef['${schemaName}'][${entities[x].name.toUpperCase()}] = [`;
        entities[x].derivedInverseProps.forEach((prop) => {
          let pos = 0;
          //find the target element
          for (let targetEntity of entities) 
          {
            if (targetEntity.name == prop.type) 
            {
              for (let i=0; i < targetEntity.derivedProps.length;i++)
              {
                  if (targetEntity.derivedProps[i].name == prop.for) 
                  {
                    pos = i;
                    break;
                  }
              }
              break;
            }
          }
          let type  = `${prop.type.toUpperCase()}`
          inverseProp+=`['${prop.name}',${type},${pos},${prop.set}],`;
        });
        inverseProp+='];';
        tsCore.push(inverseProp); 
      }
  } 

  //write the TS
  fs.writeFileSync("../schema/ifc-schema_"+schemaNameClean+".ts", tsCurrentSchema.join("\n")); 
}

// now write out the global c++/ts metadata. All the WASM needs to know about is a list of all entities

console.log(`Writing Global WASM/TS Metadata!...`);


cppSchema.push("#pragma once");
cppSchema.push("");
cppSchema.push("#include <unordered_set>");
cppSchema.push("");
cppSchema.push("// unique list of crc32 codes for ifc classes - this is a generated file - please see schema generator in src/schema");
cppSchema.push("");
cppSchema.push("namespace ifc {");
new Set([...completeEntityList,...typeList]).forEach(entity => {
    let name = entity.toUpperCase();
    let code = crc32(name,crcTable);
    cppSchema.push(`\tstatic const unsigned int ${name} = ${code};`);
    tsCore.unshift(`export const ${name} = ${code};`)
});

cppSchema.push("\tinline std::unordered_set<uint32_t> IfcElements { ");
completeifcElementList.forEach(element => {
    cppSchema.push(`\t\t${element.toUpperCase()},`);
});
cppSchema.push("\t};");

cppSchema.push("};");

cppSchema.push("\tinline std::string GetReadableNameFromTypeCode(uint32_t ifcCode) {");
cppSchema.push("\t\tswitch(ifcCode) {");
new Set([...completeEntityList,...typeList]).forEach(entity => {
    cppSchema.push(`\t\t\tcase ifc::${entity.toUpperCase()}: return "${entity.toUpperCase()}";`);
});

cppSchema.push(`\t\t\tdefault: return "<web-ifc-type-unknown>";`);
cppSchema.push("\t\t}");
cppSchema.push("\t}");

fs.writeFileSync("../wasm/parsing/ifc-schema.h", cppSchema.join("\n")); 
fs.writeFileSync("../schema/ifc-schema_core.ts", tsCore.join("\n")); 

console.log(`...Done!`);
