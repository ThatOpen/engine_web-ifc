const fs = require("fs");
const path = require("path");

console.log(`Launching interop gen ....`);

let data = fs.readFileSync("./types.interop").toString();

let outputDir = "./gen";

let tsFileName = path.join(outputDir, "Types.ts");
let cppFileName = path.join(outputDir, "Types.h");

let tsData = "";
let cppData = "";


fs.writeFileSync(tsFileName, tsData);
fs.writeFileSync(cppFileName, cppData);