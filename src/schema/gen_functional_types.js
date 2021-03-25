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

function ParseElements(data)
{
    let lines = data.split(";");

    let entities = [];
    let types = [];
    let type = false;
    let entity = false;
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
                parent: false,
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
            let values = false;

            let typeName = "";
            if (isList)
            {
                typeName = split[split.length - 1];
            }
            else if (isEnum || isSelect)
            {
                let firstBracket = line.indexOf("(");
                let secondBracket = line.indexOf(")");

                values = line.substring(firstBracket + 1, secondBracket);
                values = values.split(",").map((s) => s.trim());
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
            types.push(type);
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
            type = expTypeToTSType(type);
            entity.props.push({
                name,
                type,
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
    WalkParents(e, map[e.parent]);
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

buffer.push(`export interface Handle<T> { expressID: number; }`);
buffer.push(`export function Write<T>(obj: T): Handle<T> { return { expressID: 0 }; }`);
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
    else if (type.isEnum)
    {
        buffer.push(`export enum ${type.name} {`);
        buffer.push(type.values.map((v) => `\t${v}`).join(",\n"));
        buffer.push(`};`);
    }
    else if (type.isSelect)
    {
        buffer.push(`export type ${type.name} = `);
        buffer.push(type.values.map((v) => `|${v}`).join("\n"));
        buffer.push(`;`);
    }
    else
    {
        buffer.push(`export type ${type.name} = ${type.typeName};`);
    }
});

elements.forEach((entity) => {
    let params = [];
    entity.derivedProps.forEach((prop) => {
        let isType = tmap[prop.type];
        let propType = `${isType ? prop.type : "Handle<" + prop.type + ">" }${prop.set ? "[]" : ""} ${prop.optional ? "| null" : ""}`;
        params.push({ name: prop.name, type: propType, prop, isType });
    });

    buffer.push(`export class ${entity.name} {`);
    buffer.push(`\tconstructor(${params.map((p) => `${p.name}: ${p.type}`).join(", ")})`)
    buffer.push(`\t{`)
    params.forEach((param) => {
        buffer.push(`\t\tthis.${param.name} = ${param.name};`)
    })
    buffer.push(`\t}`)
    params.forEach((param) => {
        buffer.push(`\t${param.name}: ${param.type};`)
    })
    buffer.push(`\tstatic FromTape(tape: any[]): ${entity.name}`)
    buffer.push(`\t{`)
    let tapeIndex = 0;
    for (let i = 0; i < params.length; i++)
    {
        let param = params[i];
        if (param.prop.type === "IfcValue")
        {
            if (param.prop.optional)
            {
                buffer.push(`\t\tlet ${param.name} = tape[${tapeIndex}] ? { t: tape[${tapeIndex}], v: tape[${++tapeIndex}][0]} as any : null;`)
            }
            else
            {
                buffer.push(`\t\tlet ${param.name} = { t: tape[${tapeIndex}], v: tape[${++tapeIndex}][0]} as any;`)
            }
        }
        else
        {
            buffer.push(`\t\tlet ${param.name} = tape[${tapeIndex}];`)
        }
        tapeIndex++;
    }
    buffer.push(`\t\treturn new ${entity.name}(${params.map((p) => p.name).join(", ")});`);
    buffer.push(`\t}`)
    buffer.push(`\tToTape(): any[]`)
    buffer.push(`\t{`)
    buffer.push(`\t\tlet args: any[] = [];`)
    params.forEach((param) => {
        if (param.prop.optional)
        {
            buffer.push(`\t\tif(this.${param.name}){`);
        }
        if (param.isType)
        {
            let type = tmap[param.prop.type];
            let printValue = true;
            if (type.typeName === "number")
            {
                buffer.push(`\t\targs.push(REAL)`);
            }
            else if (type.typeName === "string")
            {
                buffer.push(`\t\targs.push(STRING)`);
            }
            else if (param.prop.type === "IfcValue")
            {
                if (param.prop.set)
                {
                }
                else
                {
                    buffer.push(`\t\targs.push(LABEL)`);
                    buffer.push(`\t\t//@ts-ignore`);
                    buffer.push(`\t\targs.push(this.${param.name}.t)`);
                    buffer.push(`\t\targs.push(SET_BEGIN)`);
                    buffer.push(`\t\t//@ts-ignore`);
                    buffer.push(`\t\targs.push(typeof this.${param.name}.v == 'string' ? STRING : REAL)`);
                    buffer.push(`\t\t//@ts-ignore`);
                    buffer.push(`\t\targs.push(this.${param.name}.v)`);
                    buffer.push(`\t\targs.push(SET_END)`);
                }

                printValue = false;
            }
            else
            {
                // TODO: implement
                printValue = false;
            }

            if (printValue)
            {
                if (param.prop.set)
                {
                    buffer.push(`\t\targs.push(...this.${param.name})`);
                }
                else
                {
                    buffer.push(`\t\targs.push(this.${param.name})`);
                }
            }
        }
        else
        {
            if (param.prop.set)
            {
                buffer.push(`\t\targs.push(SET_BEGIN)`);
                buffer.push(`\t\tthis.${param.name}.forEach((e) => { args.push(REF); args.push(e.expressID); });`);
                buffer.push(`\t\targs.push(SET_END)`);
            }
            else
            {
                buffer.push(`\t\targs.push(REF)`);
                buffer.push(`\t\targs.push(this.${param.name}.expressID)`);
            }
        }
        if (param.prop.optional)
        {
            buffer.push(`\t\t}`);
            buffer.push(`\t\telse{ args.push(EMPTY); }`);
        }
    });
    buffer.push(`\t\treturn args;`)
    buffer.push(`\t}`)
    buffer.push(`};`);
});

fs.writeFileSync(TS_OUTPUT_FILE, buffer.join("\n"));