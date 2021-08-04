
console.log("Starting usage examples...");

import properties from "./src/properties";
import modification from "./src/modification";
import exporting from "./src/exporting";
import geometrystream from "./src/geometrystream";
import coordination from "./src/coordination";

(async() => {
    await coordination();
    await exporting();
    await properties();
    await modification();
    await geometrystream();
})();