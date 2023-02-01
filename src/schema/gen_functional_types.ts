import {Entity} from "./gen_functional_types_interfaces";
import {findSubClasses,sortEntities,generateClass,crc32,makeCRCTable, parseElements, walkParents} from "./gen_functional_types_helpers"

const fs = require("fs");


let crcTable = makeCRCTable();

console.log("Starting...");

let tsHelper: Array<string> = [];
tsHelper.push(`// This is a generated file, please see: gen_functional_types.js`);
tsHelper.push(`import  * as ifc from "./ifc-schema";`);
tsHelper.push(`import {RawLineData} from "./web-ifc-api";`);
tsHelper.push();
tsHelper.push(`export class Handle<_> {`);
tsHelper.push(`\tvalue: number;`);
tsHelper.push(`\ttype: number;`)
tsHelper.push(`\tconstructor(id: number) { this.type=5; this.value = id; }`);
tsHelper.push(`}`);
tsHelper.push(``);
tsHelper.push(`export function Value(type: string, value: unknown): unknown { return { t: type, v: value }; }`);

tsHelper.push(`export const FromRawLineData: any = {};`);
tsHelper.push(`export const InversePropertyDef: any = {};`);
tsHelper.push(`export const InheritanceDef: any = {};`);
tsHelper.push('export abstract class IfcLineObject {');
tsHelper.push(`\texpressID: number;`);
tsHelper.push(`\ttype: number;`);
tsHelper.push('\tconstructor(expressID: number, type: number) {');
tsHelper.push(`\t\t\tthis.expressID = expressID;`);
tsHelper.push(`\t\t\tthis.type = type;`);
tsHelper.push('\t}');
tsHelper.push('\tabstract ToTape(): unknown[];');
tsHelper.push('}');


let tsHelperClasses: Array<string>  = [];

let completeEntityList = new Set<string>();
completeEntityList.add("FILE_SCHEMA");
completeEntityList.add("FILE_NAME");
completeEntityList.add("FILE_DESCRIPTION");
let completeifcElementList = new Set<string>();

var files = fs.readdirSync("./");
for (var i = 0; i < files.length; i++) {
  if (!files[i].endsWith(".exp")) continue;
  var schemaName = files[i].replace(".exp","");
  var schemaNameClean = schemaName.replace(".","_");
  console.log("Generating Schema for:"+schemaName);
  tsHelper.push(`FromRawLineData['${schemaName}'] = {};`);
  tsHelper.push(`InversePropertyDef['${schemaName}'] = {};`);
  tsHelper.push(`InheritanceDef['${schemaName}'] = {};`);
  tsHelperClasses.push(`export namespace ${schemaNameClean} {`);
  tsHelperClasses.push(`\t let TypeInitialiser: any = {};`)
  let schemaData = fs.readFileSync("./"+files[i]).toString();
  let parsed = parseElements(schemaData);
  let entities: Array<Entity> = sortEntities(parsed.entities);
  let types = parsed.types;
  let initialisersDone: Set<string> = new Set<string>();


  types.forEach((type) => {

      if (type.isList)
      {
          tsHelperClasses.push(`\texport class ${type.name} {`);
          tsHelperClasses.push(`\t\tvalue: Array<${type.typeName}>;`)
          tsHelperClasses.push(`\t\tconstructor(v: Array<${type.typeName}>) { this.value = v;}`);
          tsHelperClasses.push(`\t};`);
          tsHelperClasses.push(`\tTypeInitialiser[${crc32(type.name,crcTable)}] = (v: any) => { return new ${type.name}(v); }`);
      }
      else if (type.isSelect)
      {
          tsHelperClasses.push(`\texport type ${type.name} = `);
          type.values.forEach(refType => {
              let isType: boolean = types.some( x => x.name == refType);
              if (isType)
              {
                  tsHelperClasses.push(`\t\t| ${refType}`);
              }
              else
              {
                  tsHelperClasses.push(`\t\t| (Handle<${refType}> | ${refType})`);
              }
          });
          tsHelperClasses.push(`\t;`);
          type.values.forEach(refType => {
            if (!initialisersDone.has(refType)) {
                if (types.some( x => x.name == refType))
                {
                  //tsHelperClasses.push(`\tTypeInitialiser[${crc32(refType,crcTable)}] = (v: any) => { return new ${refType}(v); }`);
                } else {
                  tsHelperClasses.push(`\tTypeInitialiser[${crc32(refType,crcTable)}] = (v: any) => { return new Handle<${refType}>(v); }`);
                }
                initialisersDone.add(refType);
              }
          });
      }
      else if (type.isEnum)
      {
          tsHelperClasses.push(`\texport class ${type.name} {`);
          tsHelperClasses.push(`\t\tvalue : string;`);
          tsHelperClasses.push(`\t\ttype: number;`);
          tsHelperClasses.push(`\t\tconstructor(v: string) { this.type = 3; this.value = v;}`);
          tsHelperClasses.push(type.values.map((v) => `\t\tstatic ${v} = "${v}";`).join("\n"));
          tsHelperClasses.push(`\t}`);
      }
      else if (type.typeName.indexOf('Ifc') !== -1 )
      {
          tsHelperClasses.push(`\texport type ${type.name} = ${type.typeName};`);
          if (!initialisersDone.has(type.name)) {
              if (types.some( x => x.name == type.name))
              {
                //tsHelperClasses.push(`\tTypeInitialiser[${crc32(type.name,crcTable)}] = (v: any) => { return new ${type.name}(v); }`);
              } else {
                tsHelperClasses.push(`\tTypeInitialiser[${crc32(type.name,crcTable)}] = (v: any) => { return new Handle<${type.name}>(v); }`);
              }
              initialisersDone.add(type.name);
          }

      }
      else
      {
          tsHelperClasses.push(`\texport class ${type.name} {`);
          tsHelperClasses.push(`\t\tvalue: ${type.typeName};`)
          tsHelperClasses.push(`\t\ttype: number;`);
          tsHelperClasses.push(`\t\tconstructor(v: ${type.typeName}) { this.type=${type.typeNum}; this.value = v;}`);
          tsHelperClasses.push(`\t}`);
      }
  });
  
  entities.forEach((e) => {
      walkParents(e,entities);
  });
  
  //now work out the children
  entities = findSubClasses(entities);
  
  for (var x=0; x < entities.length; x++) 
  {
      generateClass(entities[x],tsHelperClasses,types);
      completeEntityList.add(entities[x].name);
      if (entities[x].isIfcProduct)
      {
        completeifcElementList.add(entities[x].name);
      }
  
      tsHelper.push(`FromRawLineData['${schemaName}'][ifc.${entities[x].name.toUpperCase()}] = (d: RawLineData) => { return ${schemaNameClean}.${entities[x].name}.FromTape(d.ID, d.type, d.arguments); }`);
    
      if (entities[x].children.length > 0)
      {
        tsHelper.push(`InheritanceDef['${schemaName}'][ifc.${entities[x].name.toUpperCase()}] = [${entities[x].children.map((c) => `ifc.${c.toUpperCase()}`).join(",")}];`);
      }
      
      if (entities[x].derivedInverseProps.length > 0)
      {
        tsHelper.push(`InversePropertyDef['${schemaName}'][ifc.${entities[x].name.toUpperCase()}] = [`);
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
          let type  = `ifc.${prop.type.toUpperCase()}`
          tsHelper.push(`\t\t['${prop.name}',${type},${pos},${prop.set}],`);
        });
        tsHelper.push(`];`);
        
      }
  }  
  tsHelperClasses.push("}");
}

//finish writing the TS metaData
tsHelper = tsHelper.concat(tsHelperClasses);
fs.writeFileSync("../ifc_schema_helper.ts", tsHelper.join("\n")); 

// now write out the global c++/ts metadata. All the WASM needs to know about is a list of all entities

console.log(`Writing Global WASM/TS Metadata!...`);

let tsHeader:Array<string> = []
let cppHeader: Array<string> = [];
cppHeader.push("#pragma once");
cppHeader.push("");
cppHeader.push("#include <vector>");
cppHeader.push("");
cppHeader.push("// unique list of crc32 codes for ifc classes - this is a generated file - please see schema generator in src/schema");
tsHeader.push("// unique list of crc32 codes for ifc classes - this is a generated file - please see schema generator in src/schema");
cppHeader.push("");
cppHeader.push("namespace ifc {");
completeEntityList.forEach(entity => {
    let name = entity.toUpperCase();
    let code = crc32(name,crcTable);
    cppHeader.push(`\tstatic const unsigned int ${name} = ${code};`);
    tsHeader.push(`export const ${name} = ${code};`)
});

cppHeader.push("\tinline bool isIfcElement(unsigned int ifcCode) {");
cppHeader.push("\t\tswitch(ifcCode) {");

completeifcElementList.forEach(element => {
    let name = element.toUpperCase();
    cppHeader.push(`\t\t\tcase ifc::${name}: return true;`);
});

cppHeader.push(`\t\t\tdefault: return false;`);

cppHeader.push("\t\t}");
cppHeader.push("\t}");


cppHeader.push("\tinline std::vector<unsigned int> IfcElements { ");
tsHeader.push("export const IfcElements = [")
completeifcElementList.forEach(element => {
    let name = element.toUpperCase();
    cppHeader.push(`\t\t${name},`);
    tsHeader.push(`\t${name},`);
});
cppHeader.push("\t};");
tsHeader.push("];")

cppHeader.push("};");

cppHeader.push("\tinline const char* GetReadableNameFromTypeCode(unsigned int ifcCode) {");
cppHeader.push("\t\tswitch(ifcCode) {");
tsHeader.push("export const IfcEntities: {[key: number]: string} = {");
completeEntityList.forEach(entity => {
    let name = entity.toUpperCase();
    let code = crc32(name,crcTable);
    cppHeader.push(`\t\t\tcase ifc::${name}: return "${name}";`);
    tsHeader.push(`\t${code}: '${name}',`);
});
tsHeader.push("};")

cppHeader.push(`\t\t\tdefault: return "<web-ifc-type-unknown>";`);

cppHeader.push("\t\t}");
cppHeader.push("\t}");

fs.writeFileSync("../wasm/parsing/ifc-schema.h", cppHeader.join("\n")); 
fs.writeFileSync("../ifc-schema.ts", tsHeader.join("\n")); 

console.log(`...Done!`);
