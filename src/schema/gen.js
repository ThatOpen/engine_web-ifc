/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
const fs = require("fs");

console.log(`Launching schema gen ....`);

let elements = JSON.parse(fs.readFileSync("./ifc4-elements.json").toString());
let entities = JSON.parse(fs.readFileSync("./entity-descriptions.json").toString());

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

Object.keys(entities).forEach(element => {
    let name = element.toUpperCase();
    let code = crc32(name);
    cppHeader.push(`\tstatic const unsigned int ${name} = ${code};`);
    tsHeader.push(`export const ${name} = ${code};`);
});

cppHeader.push("\tbool IsIfcElement(unsigned int ifcCode) {");
cppHeader.push("\t\tswitch(ifcCode) {");

Object.keys(elements).forEach(element => {
    let name = element.toUpperCase();
    let code = crc32(name);
    cppHeader.push(`\t\t\tcase ${code}: return true;`);
});

cppHeader.push(`\t\t\tdefault: return false;`);

cppHeader.push("\t\t}");
cppHeader.push("\t}");

cppHeader.push("\tstd::vector<unsigned int> IfcElements { ");
cppHeader.push(Object.keys(elements).map(element => {
    let name = element.toUpperCase();
    let code = crc32(name);
    return `\t\t${code}`;
}).join(",\n"));
cppHeader.push("\t};");

cppHeader.push("};");

tsHeader.push("");
tsHeader.push("export const IfcElements = [");
tsHeader.push(Object.keys(elements).map(element => {
    let name = element.toUpperCase();
    let code = crc32(name);
    return `\t${code}`;
}).join(",\n"));
tsHeader.push("];");


fs.writeFileSync("../wasm/include/ifc2x4.h", cppHeader.join("\n")); 
fs.writeFileSync("../ifc2x4.ts", tsHeader.join("\n")); 
