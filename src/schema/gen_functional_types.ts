import {} from "./gen_functional_types_interfaces";
import {crc32,makeCRCTable, parseElements, walkParents} from "./gen_functional_types_helpers"

const fs = require("fs");
const { type } = require("os");

let fileDescription = {
    name: "FILE_DESCRIPTION",
    parent: null,
    props: [],
    derivedProps: [],
    inverseProps: [],
    derivedInverseProps: [],
    isIfcProduct: false
}
let fileName = {
    name: "FILE_NAME",
    parent: null,
    props: [],
    derivedProps: [],
    inverseProps: [],
    derivedInverseProps: [],
    isIfcProduct: false
}
let fileSchema = {
    name: "FILE_SCHEMA",
    parent: null,
    props: [],
    derivedProps: [],
    inverseProps: [],
    derivedInverseProps: [],
    isIfcProduct: false
}


let crcTable = makeCRCTable();

console.log("Starting...");

let tsHelper = [];
tsHelper.push(`// This is a generated file, please see: gen_functional_types.js`);
tsHelper.push(`import * as ifc from "./ifc-schema";`);
tsHelper.push();


let completeEntityList = new Set();
let completeifcElementList = new Set();

var files = fs.readdirSync("./");
for (var i = 0; i < files.length; i++) {
  if (!files[i].endsWith(".exp")) continue;
  var schemaName = files[i].replace(".exp","");
  console.log("Generating Schema for:"+schemaName);
  let schemaData = fs.readFileSync("./"+files[i]).toString();
  let parsed = parseElements(schemaData);
  let entities = parsed.entities;
  entities.push(fileDescription, fileName, fileSchema);
  let types = parsed.types;
  
  entities.forEach((e) => {
      e.derivedProps = [...e.props];
      walkParents(e,entities);
  });
  
  for (var x=0; x < entities.length; x++) 
  {
      completeEntityList.add(entities[x].name);
      if (entities[x].isIfcProduct)
      {
        completeifcElementList.add(entities[x].name);
      }
  }  
}

//finish writing the TS metaData
fs.writeFileSync("../ifc_schema_helper.ts", tsHelper.join("\n")); 

// now write out the global c++/ts metadata. All the WASM needs to know about is a list of all entities

console.log(`Writing Global WASM/TS Metadata!...`);

let tsHeader = []
let cppHeader = [];
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

cppHeader.push("\tbool isIfcElement(unsigned int ifcCode) {");
cppHeader.push("\t\tswitch(ifcCode) {");

completeifcElementList.forEach(element => {
    let name = element.toUpperCase();
    let code = crc32(name,crcTable);
    cppHeader.push(`\t\t\tcase ifc::${name}: return true;`);
});

cppHeader.push(`\t\t\tdefault: return false;`);

cppHeader.push("\t\t}");
cppHeader.push("\t}");

tsHeader.push("export const IfcElements =[");
cppHeader.push("\tstd::vector<unsigned int> IfcElement { ");
completeifcElementList.forEach(element => {
    let name = element.toUpperCase();
    let code = crc32(name,crcTable);
    cppHeader.push(`\t\t${name},`);
    tsHeader.push(`\t${name},`);
});
cppHeader.push("\t};");
tsHeader.push("];")

cppHeader.push("};");

cppHeader.push("\tconst char* GetReadableNameFromTypeCode(unsigned int ifcCode) {");
cppHeader.push("\t\tswitch(ifcCode) {");
completeEntityList.forEach(entity => {
    let name = entity.toUpperCase();
    let code = crc32(name,crcTable);
    cppHeader.push(`\t\t\tcase ifc::${name}: return "${name}";`);
});

cppHeader.push(`\t\t\tdefault: return "<web-ifc-type-unknown>";`);

cppHeader.push("\t\t}");
cppHeader.push("\t}");

fs.writeFileSync("../wasm/include/ifc-schema.h", cppHeader.join("\n")); 
fs.writeFileSync("../ifc-schema.ts", tsHeader.join("\n")); 

console.log(`...Done!`);




console.log(JSON.stringify(elements, null, 4));


console.log(map["IfcPropertySingleValue"]);
console.log(map["IfcPropertySet"]);

console.log(types);

let tmap = {};
types.forEach((t) => {
    tmap[t.name] = t;
})

console.log(tmap["IfcActionSourceTypeEnum"]);




buffer.push(`export let FromRawLineData = {};`);
elements.forEach((entity) => {
    buffer.push(`FromRawLineData[ifc2x4.${entity.name.toUpperCase()}] = (d) => {`);
    buffer.push(`\treturn ${entity.name}.FromTape(d.ID, d.type, d.arguments);`);
    buffer.push(`};`);
});

buffer.push(`export let InversePropertyDef = {};`);
elements.forEach((entity) => {
    if (entity.derivedInverseProps.length == 0) return;
    buffer.push(`InversePropertyDef[ifc2x4.${entity.name.toUpperCase()}] = [`);
    entity.derivedInverseProps.forEach((prop) => {
      let pos = 0;
      //find the target element
      for (targetEntity of elements) 
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
      let type = crc32(prop.type.toUpperCase());
      buffer.push(`\t\t ['${prop.name}',${type},${pos},${prop.set}],`);
    });
    buffer.push(`];`);
});

buffer.push(`export class Handle<T> {`);
buffer.push(`\tvalue: number;`);
buffer.push(`\tconstructor(id: number) { this.value = id; }`);
buffer.push(`\ttoTape(args: any[]){ args.push({ type: 5, value: this.value }); }`);
buffer.push(`}`);
buffer.push(``);
//buffer.push(`export function Write<T>(obj: T): Handle<T> { return { expressID: 0 }; }`);
buffer.push(`export function Value(type: string, value: any): any { return { t: type, v: value }; }`);

buffer.push(`const UNKNOWN = 0;`);
buffer.push(`const STRING = 1;`);
buffer.push(`const LABEL = 2;`);
buffer.push(`const ENUM = 3;`);
buffer.push(`const REAL = 4;`);
buffer.push(`const REF = 5;`);
buffer.push(`const EMPTY = 6;`);
buffer.push(`const SET_BEGIN = 7;`);
buffer.push(`const SET_END = 8;`);
buffer.push(`const LINE_END = 9;`);

types.forEach((type) => {
    if (type.isList)
    {
        buffer.push(`export type ${type.name} = Array<${type.typeName}>;`);
    }
    else if (type.isSelect)
    {
        buffer.push(`export type ${type.name} = `);
        type.values.forEach(type => {
            let isType: Type = tmap[type];
            if (isType)
            {
                buffer.push(`| ${type}`);
            }
            else
            {
                buffer.push(`| (Handle<${type}> | ${type})`);
            }
        });
        buffer.push(`;`);
    }
    else if (type.isEnum)
    {
        buffer.push(`export class ${type.name} {`);
        buffer.push(`\tvalue: string;`)
        buffer.push(`\tconstructor(v: string) { this.value = v;}`);
        buffer.push(type.values.map((v) => `\tstatic ${v} = "${v}";`).join("\n"));
        buffer.push(`};`);
    }
    else
    {
        buffer.push(`export class ${type.name} {`);
        buffer.push(`\tvalue: ${type.typeName};`)
        buffer.push(`\tconstructor(v: ${type.typeName}) { this.value = v;}`);
        buffer.push(`};`);
    }
});

// TODO: slow linear search!
buffer.push(`function ParseType(obj: any): any {`);
buffer.push(`\tif (obj.type === 5) { return new Handle<any>(obj.expressID); }`)
buffer.push(`\tif (obj.type !== 2) { return obj; }`)
types.forEach((type) => {
    if (type.isList)
    {
        // skip, array
    }
    else if (type.isSelect)
    {
        // skip, OR
    }
    else
    {
        buffer.push(`\tif (obj.label === "${type.name.toUpperCase()}") { return new ${type.name}(obj.value); }`)
    }
});
buffer.push(`\tconsole.log("Unknown type: " + name);`);
buffer.push(`};`);

elements.forEach((entity) => {
    let params: Param[] = [];
    entity.derivedProps.forEach((prop) => {
        let isType: Type = tmap[prop.type];
        let propType = `${(isType || prop.primitive) ? prop.type : "(Handle<" + prop.type + `> | ${prop.type})` }${prop.set ? "[]" : ""} ${prop.optional ? "| null" : ""}`;
        params.push({ name: prop.name, type: propType, prop, isType });
    });
    
    buffer.push(`export class ${entity.name} {`);
    buffer.push(`\tconstructor(expressID: number, type: number, ${params.map((p) => `${p.name}: ${p.type}`).join(", ")})`)
    buffer.push(`\t{`)
    buffer.push(`\t\tthis.expressID = expressID;`)
    buffer.push(`\t\tthis.type = type;`)
    params.forEach((param) => {
        buffer.push(`\t\tthis.${param.name} = ${param.name};`)
    })
    buffer.push(`\t}`)
    buffer.push(`\texpressID: number;`);
    buffer.push(`\ttype: number;`);
    params.forEach((param) => {
        buffer.push(`\t${param.name}: ${param.type};`)
    })
    entity.derivedInverseProps.forEach((prop) => {
        let type = `${"(Handle<" + prop.type + `> | ${prop.type})` }${prop.set ? "[]" : ""} ${"| null"}`;
        buffer.push(`\t${prop.name}: ${type};`);
    });
    
    buffer.push(`\tstatic FromTape(expressID: number, type: number, tape: any[]): ${entity.name}`)
    buffer.push(`\t{`);
    buffer.push(`\t\tlet ptr = 0;`);
    let tapeIndex = 0;
    for (let i = 0; i < params.length; i++)
    {
        let param = params[i];
        //buffer.push(`\t\tlet ${param.name};`)
        if (false)
        {
            buffer.push(`\t\tif (tape[ptr] && tape[ptr].type !== 0) {`);
        }
        {
            let parseElement = (val) => {
                /*
                if (param.isType && param.isType.isSelect)
                {
                    return `ParseType(tape[ptr++])`;
                }
                else if (param.isType && param.isType.isEnum)
                {
                    return `tape[ptr++]`;
                }
                else if (!param.isType && !param.prop.primitive)
                {
                    return `new Handle<${param.prop.type}>(tape[ptr++].expressID)`;
                }
                else
                */
                {
                    return `tape[ptr++]`;
                }
            };

            let parseElementSet = (arrayName, indexVarName) => {
                /*
                if (param.isType && param.isType.isSelect)
                {
                    return `ParseType(${arrayName}[${indexVarName}++])`;
                }
                else if (param.isType && param.isType.isEnum)
                {
                    return `${arrayName}[${indexVarName}++]`;
                }
                else if (!param.isType && !param.prop.primitive)
                {
                    return `new Handle<${param.prop.type}>(${arrayName}[${indexVarName}++].expressID)`;
                }
                else
                */
                {
                    return `${arrayName}[${indexVarName}++]`;
                }
            };

            /*
            if (param.prop.set)
            {
                buffer.push(`\t\tlet ${param.name}: any[] = [];`);
                let indexVarName = `${param.name}_index`;
                buffer.push(`\t\tlet ${indexVarName} = 0;`);
                buffer.push(`\t\twhile (${indexVarName} < tape[ptr].length) {`);
                buffer.push(`\t\t\t${param.name}.push(${parseElementSet(`tape[ptr]`, indexVarName)});`);
                buffer.push(`\t\t}`);
                buffer.push(`\tptr++;`);
            }
            else
            */
            {
                buffer.push(`\t\tlet ${param.name} = ${parseElement(tapeIndex)};`);
            }
        }
        if (false)
        {
            buffer.push(`\t\t} else { ${param.name} = tape[ptr]; ptr++; }`);
        }

        tapeIndex++;
    }
    buffer.push(`\t\treturn new ${entity.name}(expressID, type, ${params.map((p) => p.name).join(", ")});`);
    buffer.push(`\t}`)
    buffer.push(`\tToTape(): any[]`)
    buffer.push(`\t{`)
    buffer.push(`\t\tlet args: any[] = [];`)
    params.forEach((param) => {
        let m = `this.${param.name}`;
        if (false)
        {
            buffer.push(`\t\t//@ts-ignore`);
            buffer.push(`\t\tif (${m} && ${m}.type !== 0) {`);
        }
        {
            let writeElement = (val) => {
                /*
                if (param.isType && param.isType.isSelect)
                {
                    return `${m}.toTape(args)`;
                }
                else if (param.isType && param.isType.isEnum)
                {
                    return `args.push(${m});`;
                }
                else if (!param.isType && !param.prop.primitive)
                {
                    return `${m}.toTape(args)`;
                }
                else
                */
                {
                    return `args.push(${m});`;
                }
            };

            let writeElementSet = (arrayName, indexVarName) => {
                if (param.isType && param.isType.isSelect)
                {
                    return `ParseType(${arrayName}[${indexVarName}++])`;
                }
                else if (param.isType && param.isType.isEnum)
                {
                    return `new ${param.isType.name}(${arrayName}[${indexVarName}++])`;
                }
                else if (!param.isType && !param.prop.primitive)
                {
                    return `new Handle<${param.prop.type}>(${arrayName}[${indexVarName}++].expressID)`;
                }
                else
                {
                    return `${arrayName}[${indexVarName}++]`;
                }
            };

                /*
            if (param.prop.set)
            {
                buffer.push(`\t\t${param.name} = [];`);
                let indexVarName = `${param.name}_index`;
                buffer.push(`\t\tlet ${indexVarName} = 0;`);
                buffer.push(`\t\twhile (${indexVarName} < tape[ptr].length) {`);
                buffer.push(`\t\t\t${param.name}.push(${parseElementSet(`tape[ptr]`, indexVarName)});`);
                buffer.push(`\t\t}`);
                buffer.push(`\tptr++;`);
            }
            else
                */
            {
                buffer.push(`\t\t${writeElement(tapeIndex)};`);
            }
        }
        if (false)
        {
            buffer.push(`\t\t} else { args.push(${m}); }`);
        }
    });
    buffer.push(`\t\treturn args;`)
    buffer.push(`\t}`)
    buffer.push(`};`);
});

fs.writeFileSync(TS_OUTPUT_FILE, buffer.join("\n"));

/////////////////////////////////////////////////////////////
//////////// CRC32 GEN //////////////////////////////////////
/////////////////////////////////////////////////////////////


let ifcElements = elements.filter((e) => e.isIfcProduct);


elements.forEach(element => {
    let name = element.name.toUpperCase();
    let code = crc32(name);
    cppHeader.push(`\tstatic const unsigned int ${name} = ${code};`);
    tsHeader.push(`export const ${name} = ${code};`);
});

cppHeader.push("\tbool IsIfcElement(unsigned int ifcCode) {");
cppHeader.push("\t\tswitch(ifcCode) {");

ifcElements.forEach(element => {
    let name = element.name.toUpperCase();
    let code = crc32(name);
    cppHeader.push(`\t\t\tcase ifc2x4::${name}: return true;`);
});

cppHeader.push(`\t\t\tdefault: return false;`);

cppHeader.push("\t\t}");
cppHeader.push("\t}");

cppHeader.push("\tstd::vector<unsigned int> IfcElements { ");
cppHeader.push(ifcElements.map(element => {
    let name = element.name.toUpperCase();
    let code = crc32(name);
    return `\t\t${name}`;
}).join(",\n"));
cppHeader.push("\t};");

cppHeader.push("};");

cppHeader.push("\tconst char* GetReadableNameFromTypeCode(unsigned int ifcCode) {");
cppHeader.push("\t\tswitch(ifcCode) {");

elements.forEach(element => {
    let name = element.name.toUpperCase();
    let code = crc32(name);
    cppHeader.push(`\t\t\tcase ifc2x4::${name}: return "${name}";`);
});

cppHeader.push(`\t\t\tdefault: return "<web-ifc-type-unknown>";`);

cppHeader.push("\t\t}");
cppHeader.push("\t}");

tsHeader.push("");
tsHeader.push("export const IfcElements = [");
tsHeader.push(ifcElements.map(element => {
    let name = element.name.toUpperCase();
    let code = crc32(name);
    return `\t${name}`;
}).join(",\n"));
tsHeader.push("];");





console.log(`Done!`);
