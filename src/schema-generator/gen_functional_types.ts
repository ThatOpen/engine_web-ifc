import {Entity} from "./gen_functional_types_interfaces";
import {generatePropAssignment,generateTapeAssignment,generateInitialiser,findSubClasses,sortEntities,generateClass,crc32,makeCRCTable, parseElements, walkParents} from "./gen_functional_types_helpers"

const fs = require("fs");

let crcTable = makeCRCTable();

console.log("Starting...");

let tsSchema: Array<string> = [];
let cppSchema: Array<string> = [];

let completeifcElementList = new Set<string>();

let completeEntityList = new Set<string>();
completeEntityList.add("FILE_SCHEMA");
completeEntityList.add("FILE_NAME");
completeEntityList.add("FILE_DESCRIPTION");

let typeList = new Set<string>();

tsSchema.push(`// This is a generated file, please see: gen_functional_types.js`);

tsSchema.push(`export class Handle<_> {`);
tsSchema.push(`\ttype: number=5;`);
tsSchema.push(`\tconstructor(public value: number) {}`);
tsSchema.push(`}`);

tsSchema.push(`export abstract class IfcLineObject {`);
tsSchema.push(`\ttype: number=0;`);
tsSchema.push(`\tconstructor(public expressID: number) {}`);
tsSchema.push(`}`);

tsSchema.push(`export const FromRawLineData: any = [];`);
tsSchema.push(`export const InversePropertyDef: any = {};`);
tsSchema.push(`export const InheritanceDef: any = {};`);
tsSchema.push(`export const Constructors: any = {};`);
tsSchema.push(`export const ToRawLineData: any = {};`);
tsSchema.push(`export const TypeInitialisers: any = {};`);
tsSchema.push(`export const SchemaNames: Array<string> = [];`);


tsSchema.push('function TypeInitialiser(schema:number,tapeItem:any) {');
tsSchema.push('\tif (tapeItem.typecode) return TypeInitialisers[schema][tapeItem.typecode](tapeItem.value); else return tapeItem.value;');
tsSchema.push('}');
tsSchema.push('function Labelise(tapeItem:any) {');
tsSchema.push('\ttapeItem.valueType=tapeItem.type; tapeItem.type=2; tapeItem.label=tapeItem.constructor.name.toUpperCase();');
tsSchema.push('\treturn tapeItem;');
tsSchema.push('}')


var files = fs.readdirSync("./");
for (var i = 0; i < files.length; i++) {
  if (!files[i].endsWith(".exp")) continue;
  var schemaName = files[i].replace(".exp","");
  var schemaNameClean = schemaName.replace(".","_");
  console.log("Generating Schema for:"+schemaName);
  tsSchema.push(`SchemaNames[${i}]='${schemaNameClean}';`);

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
    let constructorArray = entities[x].derivedProps.filter(i => !entities[x].ifcDerivedProps.includes(i.name));
    tsSchema.push(`\t${crc32(entities[x].name.toUpperCase(),crcTable)}:(id:number, ${constructorArray.length==0? '_:any' :'v:any[]'}) => new ${schemaNameClean}.${entities[x].name}(id, ${entities[x].derivedProps.filter(i => !entities[x].ifcDerivedProps.includes(i.name)).map((p, i) => generatePropAssignment(p,i,types,schemaNameClean,i)).join(", ")}),`);
  }
  tsSchema.push('}');
  
  //generate InheritanceDef
  tsSchema.push(`InheritanceDef[${i}]={`)
  for (var x=0; x < entities.length; x++) 
  {
      if (entities[x].children.length > 0) tsSchema.push(`\t${crc32(entities[x].name.toUpperCase(),crcTable)}: [${entities[x].children.map((c) => `${c.toUpperCase()}`).join(",")}],`);
  }
  tsSchema.push('}');
  
  //generate InversePropertyDef
  tsSchema.push(`InversePropertyDef[${i}]={`)
  for (var x=0; x < entities.length; x++) 
  {
    if (entities[x].derivedInverseProps.length > 0)
      {
        let inverseProp:string =`\t${crc32(entities[x].name.toUpperCase(),crcTable)}:[`;
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
        inverseProp+='],';
        tsSchema.push(inverseProp); 
      }
  }
  tsSchema.push('}');
  
  //generate Constructors
  tsSchema.push(`Constructors[${i}]={`)
  for (var x=0; x < entities.length; x++) 
  {
    let constructorArray = entities[x].derivedProps.filter(i => !entities[x].ifcDerivedProps.includes(i.name));
    tsSchema.push(`\t${crc32(entities[x].name.toUpperCase(),crcTable)}:(ID:number, ${constructorArray.length==0? '_:any':'a: any[]'}) => new ${schemaNameClean}.${entities[x].name}(ID, ${constructorArray.map((_, i) => 'a['+i+']').join(", ")}),`);
  
  }
  tsSchema.push('}');
  
  //generate ToRawLineData
  tsSchema.push(`ToRawLineData[${i}]={`)
  for (var x=0; x < entities.length; x++) tsSchema.push(`\t${crc32(entities[x].name.toUpperCase(),crcTable)}:(${entities[x].derivedProps.length==0?'_:any': `i:${schemaNameClean}.${entities[x].name}`}):unknown[] => [${entities[x].derivedProps.map((p) => generateTapeAssignment(p,types)).join(", ")}],`);
  tsSchema.push('}');

  //initialisers
  let initialisersDone: Set<string> = new Set<string>();
  tsSchema.push(`TypeInitialisers[${i}]={`)
  types.forEach((type) => {
     if (type.isSelect) generateInitialiser(type,initialisersDone,new Array<string>,crcTable,types,schemaNameClean,i);
  });
  tsSchema.push(`};`)

  //generate Classes
  tsSchema.push("export namespace "+schemaNameClean+" {")
  types.forEach((type) => {

      if (type.isList)
      {
          tsSchema.push(`\texport class ${type.name} {`);
          tsSchema.push(`\t\tconstructor(public value: Array<${type.typeName}>) {}`);
          tsSchema.push(`\t};`);
          typeList.add(type.name);
      }
      else if (type.isSelect)
      {
          let selectOutput: string = `\texport type ${type.name} = `;
          type.values.forEach(refType => {
              let isType: boolean = types.some( x => x.name == refType);
              if (isType)
              {
                  selectOutput+=` | ${refType}`;
              }
              else
              {
                  selectOutput+=` | (Handle<${refType}> | ${refType})`;
              }
          });
          selectOutput+=";";
          tsSchema.push(selectOutput);
      }
      else if (type.isEnum)
      {
          tsSchema.push(`\texport class ${type.name} {`);
          tsSchema.push('\t\t'+type.values.map((v) => `static ${v} : any =  { type:3, value:'${v}'}; `).join(''));
          tsSchema.push(`\t}`);
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
          tsSchema.push(`\texport class ${type.name} {`);
          tsSchema.push(`\t\ttype: number=${typeNum};`);
          tsSchema.push(`\t\tconstructor(public value: ${typeName}) {}`);
          tsSchema.push(`\t}`);
      }
  });
  
  for (var x=0; x < entities.length; x++) generateClass(entities[x], tsSchema,types,crcTable);
  tsSchema.push("}"); 
   

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
    tsSchema.unshift(`export const ${name} = ${code};`)
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
fs.writeFileSync("../ifc-schema.ts", tsSchema.join("\n")); 

console.log(`...Done!`);
