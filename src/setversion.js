const fs = require("fs");

let pckg = JSON.parse(fs.readFileSync("package.json").toString());

console.log(`Setting version to ${pckg.version}`);

let file = `
#pragma once\n#include<string_view>\n
const std::string_view WEB_IFC_VERSION_NUMBER = "${pckg.version}";
`

fs.writeFileSync("./src/cpp/version.h", file);