const fs = require("fs");
const { type } = require("os");
const path = require("path");

console.log(`Launching interop gen ....`);

let data = fs.readFileSync("./types.interop").toString();

let outputDir = "./gen";

let tsFileName = path.join(outputDir, "Types.ts");
let cppFileName = path.join(outputDir, "Types.h");

function ParseTypes(data)
{
    let lines = data.split("\r\n");

    let types = [];

    let currentType = false;
    for (let i = 0; i < lines.length; i++)
    {
        let line = lines[i];
        let lineSplit = line.split(" ");
        let lineType = lineSplit[0];

        if (lineType === "TYPE")
        {
            if (currentType)
            {
                types.push(currentType);
            }
            currentType = {
                name: "unknown",
                fields: [],
                offset: 0
            };

            // new type
            currentType.name = lineSplit[1]
        }
        else if (lineType === "ARRAY")
        {
            let type = lineSplit[1];
            let name = lineSplit[2];
            currentType.fields.push({
                name: name,
                type: lineType,
                elementType: type,
                offset: currentType.offset
            })
            currentType.offset += 8; // one for ptr, one for length
        }
    }
    types.push(currentType);

    return types;
}

let types = ParseTypes(data);
console.log(JSON.stringify(types));

function GenTypescriptData(types)
{
    let data = "";

    function typeToTSType(type)
    {
        if (type === "UINT")
        {
            return "number";
        }
        else
        {
            return "<unknown type>";
        }
    }

    function typeToHEAPType(type)
    {
        if (type === "UINT")
        {
            return "HEAPU32";
        }
        if (type === "FLOAT")
        {
            return "HEAPF32";
        }
        else
        {
            return "<unknown type>";
        }
    }
    
    function ArrayTypeToTSType(type)
    {
        if (type === "UINT")
        {
            return "Uint32Array";
        }
        else if (type === "FLOAT")
        {
            return "Float32Array";
        }
        else
        {
            return "<unknown type>";
        }
    }

    types.forEach(type => {
        let typeData = [];
        typeData.push(`export class ${type.name}`);
        typeData.push("{");

        type.fields.forEach(field => {
            if (field.type === "ARRAY")
            {  
                let tsElementType = ArrayTypeToTSType(field.elementType);
                typeData.push(`\tstatic ${field.name}(module: any, ptr: number): ${tsElementType}`);
                typeData.push(`\t{`);
                let arrayOffset = field.offset / 4;
                let lengthOffset = field.offset / 4 + 1;
                let heap = typeToHEAPType(field.elementType);
                typeData.push(`\t\tlet dataPtr = module.HEAPU32[ptr/4 + ${arrayOffset}]/4;`);
                typeData.push(`\t\treturn module.${heap}.subarray(dataPtr, dataPtr + module.HEAPU32[ptr/4 + ${lengthOffset}])`);
                typeData.push(`\t}`);
            }
            else
            {

            }
        });

        typeData.push(`};`);
        typeData.push(``);
        typeData.push(``);
        data += typeData.join("\n");
    });

    return data;
}

function GenCPPData(types)
{
    let data = "#pragma once\n\n";

    function typeToCPPType(type)
    {
        if (type === "UINT")
        {
            return "uint32_t";
        }
        else
        {
            return "<unknown type>";
        }
    }
    
    function ArrayTypeToCPPType(type)
    {
        if (type === "UINT")
        {
            return "uint32_t*";
        }
        else if (type === "FLOAT")
        {
            return "float*";
        }
        else
        {
            return "<unknown type>";
        }
    }

    types.forEach(type => {
        let typeData = [];
        typeData.push(`struct ${type.name}`);
        typeData.push("{");

        type.fields.forEach(field => {
            if (field.type === "ARRAY")
            {  
                let cppElementType = ArrayTypeToCPPType(field.elementType);
                typeData.push(`\t${cppElementType} ${field.name}_data;`);
                typeData.push(`\tuint32_t ${field.name}_length;`);
            }
            else
            {

            }
        });

        typeData.push(`};`);
        typeData.push(``);
        typeData.push(``);
        data += typeData.join("\n");
    });

    return data;
}

fs.writeFileSync(tsFileName, GenTypescriptData(types));
fs.writeFileSync(cppFileName, GenCPPData(types));