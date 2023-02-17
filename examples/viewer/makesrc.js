const wifcapi = "../../dist/web-ifc-api-node.d.ts";
const ifc_schema = "../../dist/ifc-schema.d.ts";

const fs = require("fs");

const wifcapi_data = fs.readFileSync(wifcapi).toString();
const ifc_schema_data = fs.readFileSync(ifc_schema).toString();

let escape = (s) => {
    return JSON.stringify(s.replace(/export/g, "")).slice(1, -1);
}

let tsContent = `
    export let wifcapi = "${escape(wifcapi_data)}";
    export let ifc_schema = "${escape(ifc_schema_data)}";
`;

fs.writeFileSync("ts_src.js", tsContent);
