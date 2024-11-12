import {Entity} from "./gen_functional_types_interfaces";
import {generatePropAssignment,generateTapeAssignment,generateInitialiser,findSubClasses,sortEntities,generateClass,crc32,makeCRCTable, parseElements, walkParents} from "./gen_functional_types_helpers"

import schemaAliases from "./schema_aliases";

const fs = require("fs");

let crcTable = makeCRCTable();

console.log("Starting...");

let tsSchema: Array<string> = [];
let cppSchema: Array<string> = [];
let chSchema: Array<string> = [];

let completeifcElementList = new Set<string>();

let completeEntityList = new Set<string>();
completeEntityList.add("FILE_SCHEMA");
completeEntityList.add("FILE_NAME");
completeEntityList.add("FILE_DESCRIPTION");

let typeList = new Set<string>();

tsSchema.push('/**');
tsSchema.push(' * Web-IFC IFC Schema Representation');
tsSchema.push(' * @module ifc-schema');
tsSchema.push('*/');

tsSchema.push(`// This is a generated file, please see: gen_functional_types.js`);



tsSchema.push(`export class Handle<_> {`);
tsSchema.push(`type: number=5;`);
tsSchema.push(`constructor(public value: number) {}`);
tsSchema.push(`}`);

tsSchema.push(`export enum logical {FALSE,TRUE,UNKNOWN}`);

tsSchema.push(`export abstract class IfcLineObject {`);
tsSchema.push(`type: number=0;`);
tsSchema.push(`constructor(public expressID: number = -1) {}`);
tsSchema.push(`}`);
tsSchema.push('/** @ignore */');
tsSchema.push(`export const FromRawLineData: any=[];`);
tsSchema.push('/** @ignore */');
tsSchema.push(`export const InversePropertyDef: any={};`);
tsSchema.push('/** @ignore */');
tsSchema.push(`export const InheritanceDef: any={};`);
tsSchema.push('/** @ignore */');
tsSchema.push(`export const Constructors: any={};`);
tsSchema.push('/** @ignore */');
tsSchema.push(`export const ToRawLineData: any={};`);
tsSchema.push('/** @ignore */');
tsSchema.push(`export const TypeInitialisers: any={};`);
tsSchema.push('/** @ignore */');
tsSchema.push(`export const SchemaNames: Array<Array<string>>=[];`);


tsSchema.push('function TypeInitialiser(schema:number,tapeItem:any) {');
tsSchema.push('if (Array.isArray(tapeItem)) tapeItem.map((p:any)=>TypeInitialiser(schema,p));');
tsSchema.push('if (tapeItem.typecode) return TypeInitialisers[schema][tapeItem.typecode](tapeItem.value); else return tapeItem.value;');
tsSchema.push('}');
tsSchema.push('function Labelise(tapeItem:any) {');
tsSchema.push('if (tapeItem.label) return tapeItem; else return {value:tapeItem.value.toString(),valueType:tapeItem.type,type:2,label:tapeItem.name};');
tsSchema.push('}')
tsSchema.push('function BooleanConvert(item:boolean | logical) {');
tsSchema.push(' switch(item.toString()) { case \'true\':return \'T\'; case \'false\':return \'F\';case \'0\':return \'F\';case \'1\':return \'T\';case \'2\':return \'U\';}');
tsSchema.push('}')

var files = fs.readdirSync("./");
tsSchema.push("// supported ifc schemas");
  tsSchema.push(`export enum Schemas {`);
  for (var i = 0; i < files.length; i++) {
	  if (!files[i].endsWith(".exp")) continue;
	  const schemaName = files[i].replace(".exp","");
	  tsSchema.push(`\t${schemaName.replace(".", "_")}="${schemaName}",`);
  }
tsSchema.push(`};`);

for (var i = 0; i < files.length; i++) {
  if (!files[i].endsWith(".exp")) continue;
  var schemaName = files[i].replace(".exp","");
  var schemaNameClean = schemaName.replace(".","_");
  console.log("Generating Schema for:"+schemaName);
  let schemaAssignments: string = `SchemaNames[${i}]=['${schemaNameClean}'`;
  for (const schemaAlias of schemaAliases)
  {
    if (schemaAlias.alias==schemaNameClean) schemaAssignments+=`,'${schemaAlias.schemaName}'`;
  }
  schemaAssignments+='];'
  tsSchema.push(schemaAssignments);

  let schemaData = fs.readFileSync("./"+files[i]).toString();
  let parsed = parseElements(schemaData);
  let entities: Array<Entity> = sortEntities(parsed.entities);
  let types = parsed.types;


  entities.forEach((e) => {
      walkParents(e,entities);
  });
  
  //now work out the children
  entities = findSubClasses(entities);
  
  for (var x=0; x < entities.length; x++) 
  {
      completeEntityList.add(entities[x].name);
      if (entities[x].isIfcProduct) completeifcElementList.add(entities[x].name);
  }
  

  //generate FromRawLineData
  tsSchema.push(`FromRawLineData[${i}]={`)
  for (var x=0; x < entities.length; x++) 
  {
    let constructorArray = entities[x].derivedProps.filter(j => !entities[x].ifcDerivedProps.includes(j.name));
    tsSchema.push(`${crc32(entities[x].name.toUpperCase(),crcTable)}:(${constructorArray.length==0? '_:any' :'v:any[]'})=>new ${schemaNameClean}.${entities[x].name}(${entities[x].derivedProps.filter(j => !entities[x].ifcDerivedProps.includes(j.name)).map((p, j) => generatePropAssignment(p,j,types,schemaNameClean,i)).join(", ")}),`);
  }
  tsSchema.push('}');
  
  //generate InheritanceDef
  tsSchema.push(`InheritanceDef[${i}]={`)
  for (var x=0; x < entities.length; x++) 
  {
      if (entities[x].children.length > 0) tsSchema.push(`${crc32(entities[x].name.toUpperCase(),crcTable)}: [${entities[x].children.map((c) => `${c.toUpperCase()}`).join(",")}],`);
  }
  tsSchema.push('}');
  
  //generate InversePropertyDef
  tsSchema.push(`InversePropertyDef[${i}]={`)
  for (var x=0; x < entities.length; x++) 
  {
    if (entities[x].derivedInverseProps.length > 0)
      {
        let inverseProp:string =`${crc32(entities[x].name.toUpperCase(),crcTable)}:[`;
        entities[x].derivedInverseProps.forEach((prop) => {
          let pos = 0;
          //find the target element
          for (let targetEntity of entities) 
          {
            if (targetEntity.name == prop.type) 
            {
              for (let j=0; j < targetEntity.derivedProps.length;j++)
              {
                  if (targetEntity.derivedProps[j].name == prop.for) 
                  {
                    pos = j;
                    break;
                  }
              }
              break;
            }
          }
          let type  = `${prop.type.toUpperCase()}`
          inverseProp+=`['${prop.name}',${type},${pos},${prop.set}],`;
        });
        inverseProp+='],';
        tsSchema.push(inverseProp); 
      }
  }
  tsSchema.push('}');
  
  //generate Constructors
  tsSchema.push(`Constructors[${i}]={`)
  for (var x=0; x < entities.length; x++) 
  {
    let constructorArray = entities[x].derivedProps.filter(j => !entities[x].ifcDerivedProps.includes(j.name));
    tsSchema.push(`${crc32(entities[x].name.toUpperCase(),crcTable)}:(${constructorArray.length==0? '_:any':'a: any[]'})=>new ${schemaNameClean}.${entities[x].name}(${constructorArray.map((_, i) => 'a['+i+']').join(", ")}),`);
  
  }
  tsSchema.push('}');
  
  //generate ToRawLineData
  tsSchema.push(`ToRawLineData[${i}]={`)
  for (var x=0; x < entities.length; x++) tsSchema.push(`${crc32(entities[x].name.toUpperCase(),crcTable)}:(${entities[x].derivedProps.length==0?'_:any': `i:${schemaNameClean}.${entities[x].name}`}):unknown[]=>[${entities[x].derivedProps.map((p) => generateTapeAssignment(p,entities[x].ifcDerivedProps,types)).join(", ")}],`);
  tsSchema.push('}');

  //initialisers
  let initialisersDone: Set<string> = new Set<string>();
  tsSchema.push(`TypeInitialisers[${i}]={`)
  types.forEach((type) => {
     generateInitialiser(type,initialisersDone,tsSchema,crcTable,types,schemaNameClean,i);
  });
  tsSchema.push(`};`)

  //generate Classes
  tsSchema.push("export namespace "+schemaNameClean+" {")
  types.forEach((type) => {

      if (type.isList)
      {
          let typeNum = type.typeNum;
          tsSchema.push(`export class ${type.name} { type: number=${typeNum}; constructor(public value: Array<${type.typeName}>) {} };`);
          typeList.add(type.name);
      }
      else if (type.isSelect)
      {
          let selectOutput: string = `export type ${type.name} = `;
          let first = true;
          type.values.forEach(refType => {
              let isType: boolean = types.some( x => x.name == refType);
              if(!first) selectOutput+='|'
              if (isType)
              { 
                selectOutput+=refType;
              }
              else
              {
                selectOutput+=`(Handle<${refType}> | ${refType})`;
              }
              first = false;

          });
          selectOutput+=";";
          tsSchema.push(selectOutput);
      }
      else if (type.isEnum)
      {
          tsSchema.push(`export class ${type.name} {` + type.values.map((v) => `static ${v} : any =  { type:3, value:'${v}'}; `).join('') +'}');
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
          tsSchema.push(`export class ${type.name} {`);
          tsSchema.push(`type: number=${typeNum};`);
          tsSchema.push(`name: string='${type.name.toUpperCase()}';`);
          if (typeName=="number") {
            tsSchema.push(`public value: number;`);
            tsSchema.push(`constructor(v: any) { this.value = v === null ? v : parseFloat(v);}`);
          } else if (typeName=="boolean") {
              tsSchema.push(`public value: boolean;`);
              tsSchema.push(`constructor(v: any) { this.value = v === null ? v : v == "T" ? true : false; }`);
          } else if (typeName=="logical") {
              tsSchema.push(`public value: logical;`);
              tsSchema.push(`constructor(v: any) { this.value = v === null ? v : v == "T" ? logical.TRUE : v == "F" ? logical.FALSE: logical.UNKNOWN; }`);
          } else {
            tsSchema.push(`constructor(public value: ${typeName}) {}`);
          }
          tsSchema.push(`}`);
      }
  });
  
  for (var x=0; x < entities.length; x++) generateClass(entities[x], tsSchema,types,crcTable);
  tsSchema.push("}"); 
}

// now write out the global c++/ts metadata. All the WASM needs to know about is a list of all entities

console.log(`Writing Global WASM/TS Metadata!...`);



chSchema.push("#pragma once");
chSchema.push("// unique list of crc32 codes for ifc classes - this is a generated file - please see schema generator in src/schema");
chSchema.push("");
chSchema.push("namespace webifc::schema {");
new Set([...completeEntityList,...typeList]).forEach(entity => {
    let name = entity.toUpperCase();
    let code = crc32(name,crcTable);
    chSchema.push(`\tstatic const unsigned int ${name} = ${code};`);
    tsSchema.unshift(`export const ${name} = ${code};`)
});

chSchema.push("}");

cppSchema.push("#include <unordered_set>");
cppSchema.push("#include <string>");
cppSchema.push("#include \"ifc-schema.h\"");
cppSchema.push("#include \"IfcSchemaManager.h\"");
cppSchema.push("namespace webifc::schema {")
cppSchema.push("void IfcSchemaManager::initSchemaData() {");
completeifcElementList.forEach(element => {
    cppSchema.push(`_ifcElements.insert(${element.toUpperCase()});`);
});
chSchema.push(`enum IFC_SCHEMA {`)
for (var i = 0; i < files.length; i++) {
  if (!files[i].endsWith(".exp")) continue;
  var schemaName = files[i].replace(".exp","");
  var schemaNameClean = schemaName.replace(".","_");
  chSchema.push(`${schemaNameClean},`)
  cppSchema.push(`_schemaNames.push_back("${schemaNameClean}");`);
  cppSchema.push(`_schemas.push_back(${schemaNameClean});`);
}
cppSchema.push("}");
chSchema.push(`};`)

cppSchema.push("std::string IfcSchemaManager::IfcTypeCodeToType(uint32_t typeCode) const {");
cppSchema.push("switch(typeCode) {");
new Set([...completeEntityList,...typeList]).forEach(entity => {
    cppSchema.push(`case schema::${entity.toUpperCase()}: return "${entity}";`);
});

cppSchema.push(`default: return "<web-ifc-type-unknown>";`);
cppSchema.push("}");
cppSchema.push("}");
cppSchema.push("}");

fs.writeFileSync("../cpp/schema/ifc-schema.h", chSchema.join("\n")); 
fs.writeFileSync("../cpp/schema/schema-functions.cpp", cppSchema.join("\n")); 
fs.writeFileSync("../ts/ifc-schema.ts", tsSchema.join("\n")); 

console.log(`...Done!`);
