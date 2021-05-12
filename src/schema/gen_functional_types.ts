import { FromRawLineData } from "../ifc2x4_helper";

const fs = require("fs");
const { type } = require("os");

console.log("Starting...");

let ifc4x2 = fs.readFileSync("./IFC4x2.exp").toString();

console.log("Read def file");

function expTypeToTSType(expTypeName)
{
    let tsType = expTypeName;
    if (expTypeName == "REAL" || expTypeName == "INTEGER" || expTypeName == "NUMBER")
    {
        tsType = "number";
    }
    else if (expTypeName == "STRING")
    {
        tsType = "string";
    }
    else if (expTypeName == "BOOLEAN")
    {
        tsType = "boolean";
    }
    else if (expTypeName == "BINARY")
    {
        tsType = "number";
    }
    else if (expTypeName == "LOGICAL")
    {
        tsType = "boolean";
    }

    return tsType;
}

interface Type {
    name: string;
    typeName : string;
    isList: boolean;
    isEnum: boolean;
    isSelect: boolean;
    values: string[];
}

interface Prop {
    name: string;
    type: string;
    primitive: boolean;
    optional: boolean;
    set: boolean;
}

interface Entity {
    name: string;
    parent: null | string;
    props: Prop[];
    derivedProps: Prop[] | null;
}

function ParseElements(data)
{
    let lines = data.split(";");

    let entities: Entity[] = [];
    let types: Type[] = [];
    let type: Type | false = false;
    let entity: Entity | false = false;
    let readProps = false;

    for (let i = 0; i < lines.length; i++)
    {
        let line = lines[i].trim();
        let hasColon = line.indexOf(" : ") != -1;
        if (line.indexOf("ENTITY") == 0)
        {
            let split = line.split(" ");
            let name = split[1].trim();
            entity = {
                name,
                parent: null,
                props: [],
                derivedProps: []
            };
            readProps = true;

            let subIndex = split.indexOf("SUBTYPE");
            if (subIndex != -1)
            {
                let parent = split[subIndex + 2].replace("(", "").replace(")", "");
                entity.parent = parent;
            }
        }
        else if (line.indexOf("END_ENTITY") == 0)
        {
            if (entity) entities.push(entity);
            readProps = false;
        }
        else if (line.indexOf("WHERE") == 0)
        {
            readProps = false;
        }
        else if (line.indexOf("INVERSE") == 0)
        {
            readProps = false;
        }
        else if (line.indexOf("DERIVE") == 0)
        {
            readProps = false;
        }
        else if (line.indexOf("UNIQUE") == 0)
        {
            readProps = false;
        }
        else if (line.indexOf("TYPE") == 0)
        {
            readProps = false;

            let split = line.split(" ").map((s) => s.trim());
            let name = split[1];


            let isList = split.indexOf("LIST") != -1 || split.indexOf("SET") != -1 || split.indexOf("ARRAY") != -1;
            let isEnum = split.indexOf("ENUMERATION") != -1;
            let isSelect = split[3].indexOf("SELECT") == 0;
            let values: null | string[] = null;

            let typeName = "";
            if (isList)
            {
                typeName = split[split.length - 1];
            }
            else if (isEnum || isSelect)
            {
                let firstBracket = line.indexOf("(");
                let secondBracket = line.indexOf(")");

                let stringList = line.substring(firstBracket + 1, secondBracket);
                values = stringList.split(",").map((s) => s.trim());
            }
            else
            {
                typeName = split[3];
            }

            let firstBracket = typeName.indexOf("(");
            if (firstBracket != -1)
            {
                typeName = typeName.substr(0, firstBracket);
            }

            typeName = expTypeToTSType(typeName);
            
            type = {
                name,
                typeName,
                isList,
                isEnum,
                isSelect,
                values
            }
        }
        else if (line.indexOf("END_TYPE") == 0)
        {
            if (type)
            {
                types.push(type);
            }
            type = false;
        }
        else if (entity && readProps && hasColon)
        {
            // property
            let split = line.split(" ");
            let name = split[0];
            let optional = split.indexOf("OPTIONAL") != -1;
            let set = split.indexOf("SET") != -1 || split.indexOf("LIST") != -1;
            let type = split[split.length - 1].replace(";", "");
            let tsType = expTypeToTSType(type);
            entity.props.push({
                name,
                type: tsType,
                primitive: tsType !== type,
                optional,
                set
            })
        }
    }

    return {
        entities,
        types
    };
}

let parsed = ParseElements(ifc4x2);
let elements = parsed.entities;
let types = parsed.types;
console.log(JSON.stringify(elements, null, 4));

let map = {};
elements.forEach((e) => {
    map[e.name] = e;
})

function WalkParents(entity, parent)
{
    if (!parent)
    {
        return;
    }
    entity.derivedProps = [...parent.props, ...entity.derivedProps];
    WalkParents(entity, map[parent.parent]);
}

elements.forEach((e) => {
    e.derivedProps = [...e.props];
    if (e.parent)
    {
        WalkParents(e, map[e.parent]);
    }
});

console.log(map["IfcPropertySingleValue"]);
console.log(map["IfcPropertySet"]);

console.log(types);

let tmap = {};
types.forEach((t) => {
    tmap[t.name] = t;
})

console.log(tmap["IfcActionSourceTypeEnum"]);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// --------------------------------------------- code generation ---------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const TS_OUTPUT_FILE = "../ifc2x4_helper.ts";

let buffer = [];

buffer.push();
buffer.push(`// This is a generated file, please see: gen_functional_types.js`);
buffer.push();
buffer.push();
buffer.push(`import * as ifc2x4 from "./ifc2x4";`);
buffer.push();

buffer.push(`export let FromRawLineData = {};`);
elements.forEach((entity) => {
    buffer.push(`FromRawLineData[ifc2x4.${entity.name.toUpperCase()}] = (d) => {`);
    buffer.push(`\treturn ${entity.name}.FromTape(d.ID, d.type, d.arguments);`);
    buffer.push(`};`);
});



buffer.push(`export class Handle<T> {`);
buffer.push(`\texpressID: number;`);
buffer.push(`\tconstructor(id: number) { this.expressID = id; }`);
buffer.push(`\ttoTape(args: any[]){ args.push({ type: 5, expressID: this.expressID }); }`);
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
        buffer.push(type.values.map((v) => `|${v}`).join("\n"));
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

interface Param
{
    name: string;
    type: string;
    prop: Prop;
    isType: Type;
}

elements.forEach((entity) => {
    let params: Param[] = [];
    entity.derivedProps.forEach((prop) => {
        let isType: Type = tmap[prop.type];
        let propType = `${(isType || prop.primitive) ? prop.type : "Handle<" + prop.type + ">" }${prop.set ? "[]" : ""} ${prop.optional ? "| null" : ""}`;
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

{
    let ifcElements = JSON.parse(fs.readFileSync("./ifc4-elements.json").toString());

    var makeCRCTable = function(){
        var c;
        var crcTable = [];
        for(var n =0; n < 256; n++){
            c = n;
            for(var k =0; k < 8; k++){
                c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            crcTable[n] = c;
        }
        return crcTable;
    }

    let crcTable = false;

    var crc32 = function(str) {
        var crcTable = crcTable || (crcTable = makeCRCTable());
        var crc = 0 ^ (-1);

        for (var i = 0; i < str.length; i++ ) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
        }

        return (crc ^ (-1)) >>> 0;
    };

    let tsHeader = [];
    let cppHeader = [];
    cppHeader.push("#pragma once");
    cppHeader.push("");
    cppHeader.push("#include <vector>");
    cppHeader.push("");
    cppHeader.push("// unique list of crc32 codes for ifc classes");
    cppHeader.push("");
    cppHeader.push("namespace ifc2x4 {");

    elements.forEach(element => {
        let name = element.name.toUpperCase();
        let code = crc32(name);
        cppHeader.push(`\tstatic const unsigned int ${name} = ${code};`);
        tsHeader.push(`export const ${name} = ${code};`);
    });

    cppHeader.push("\tbool IsIfcElement(unsigned int ifcCode) {");
    cppHeader.push("\t\tswitch(ifcCode) {");

    Object.keys(ifcElements).forEach(element => {
        let name = element.toUpperCase();
        let code = crc32(name);
        cppHeader.push(`\t\t\tcase ${code}: return true;`);
    });

    cppHeader.push(`\t\t\tdefault: return false;`);

    cppHeader.push("\t\t}");
    cppHeader.push("\t}");

    cppHeader.push("\tstd::vector<unsigned int> IfcElements { ");
    cppHeader.push(Object.keys(ifcElements).map(element => {
        let name = element.toUpperCase();
        let code = crc32(name);
        return `\t\t${code}`;
    }).join(",\n"));
    cppHeader.push("\t};");

    cppHeader.push("};");

    cppHeader.push("\tconst char* GetReadableNameFromTypeCode(unsigned int ifcCode) {");
    cppHeader.push("\t\tswitch(ifcCode) {");

    elements.forEach(element => {
        let name = element.name.toUpperCase();
        let code = crc32(name);
        cppHeader.push(`\t\t\tcase ${code}: return "${name}";`);
    });

    cppHeader.push(`\t\t\tdefault: return "<web-ifc-type-unknown>";`);

    cppHeader.push("\t\t}");
    cppHeader.push("\t}");

    tsHeader.push("");
    tsHeader.push("export const IfcElements = [");
    tsHeader.push(Object.keys(ifcElements).map(element => {
        let name = element.toUpperCase();
        let code = crc32(name);
        return `\t${code}`;
    }).join(",\n"));
    tsHeader.push("];");


    fs.writeFileSync("../wasm/include/ifc2x4.h", cppHeader.join("\n")); 
    fs.writeFileSync("../ifc2x4.ts", tsHeader.join("\n")); 

    console.log(`Done!`);
}