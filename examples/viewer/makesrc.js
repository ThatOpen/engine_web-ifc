const wifcapi = "../../dist/web-ifc-api-node.d.ts";
const ifc_schema = "../../dist/ifc-schema.d.ts";

const fs = require("fs");
const cp = require("child_process");

let git_rev = "unknown";
try {
    git_rev = cp.execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim().slice(0, 10);
} catch (e) {
    // keep "unknown" when git is unavailable
}

const wifcapi_data = fs.readFileSync(wifcapi).toString();
const ifc_schema_data = fs.readFileSync(ifc_schema).toString();

let escape = (s) => {
    return JSON.stringify(s.replace(/export/g, "")).slice(1, -1);
}

let tsContent = `
    export let wifcapi = "${escape(wifcapi_data)}";
    export let ifc_schema = "${escape(ifc_schema_data)}";
    export let git_rev = "${git_rev}";
`;

fs.writeFileSync("ts_src.js", tsContent);
