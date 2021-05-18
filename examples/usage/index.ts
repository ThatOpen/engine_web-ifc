
console.log("Starting usage examples...");

import properties from "./src/properties";
import modification from "./src/modification";
import exporting from "./src/exporting";

(async() => {
    await exporting();
    await properties();
    await modification();
})();