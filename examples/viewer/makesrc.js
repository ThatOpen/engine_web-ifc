const wifcapi = "../../dist/web-ifc-api-node.d.ts";
const ifc2x4helper = "../../dist/ifc2x4_helper.d.ts";
const ifc2x4 = "../../dist/ifc2x4.d.ts";

const fs = require("fs");

const wifcapi_data = fs.readFileSync(wifcapi).toString();
const ifc2x4helper_data = fs.readFileSync(ifc2x4helper).toString();
const ifc2x4_data = fs.readFileSync(ifc2x4).toString();

let escape = (s) => {
    return JSON.stringify(s.replace(/export/g, "")).slice(1, -1);
}

let tsContent = `
    export let wifcapi = "${escape(wifcapi_data)}";
    export let ifc2x4helper = "${escape(ifc2x4helper_data)}";
    export let ifc2x4 = "${escape(ifc2x4_data)}";

`;

fs.writeFileSync("ts_src.ts", tsContent);
