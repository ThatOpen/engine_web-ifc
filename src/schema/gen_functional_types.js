const fs = require("fs");

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
            let set = split.indexOf("SET") != -1;
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
    buffer.push(`export class ${entity.name} {};`);
    let params = [];
    entity.derivedProps.forEach((prop) => {
        let isType = tmap[prop.type];
        let propType = `${isType ? prop.type : "Handle<" + prop.type + ">" }${prop.set ? "[]" : ""} ${prop.optional ? "| null" : ""}`;
        params.push(`${prop.name}: ${propType}`)
    });
    buffer.push(`export function Create${entity.name}(${params.join(", ")}): Handle<${entity.name}> {`);
    buffer.push(`\treturn { expressID: 0 };`)
    buffer.push(`}`)
});

fs.writeFileSync(TS_OUTPUT_FILE, buffer.join("\n"));