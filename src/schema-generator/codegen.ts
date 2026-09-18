function findElementByParent(entities : Array<Entity>,parentName :string) {
	let results = new Array<Entity>();
	for (let entity of entities) {
		if (entity.parent == parentName) {
			results.push(entity);
			var res = findElementByParent(entities,entity.name);
			results.push(...res)
		}
	}
	return results;
}



import {Entity} from "./gen_functional_types_interfaces";
import {parseElements, walkParents,sortEntities} from "./gen_functional_types_helpers"
import schemaAliases from "./schema_aliases";
const fs = require("fs");
const files: string[] = ["", ...fs.readdirSync("./").filter((name: string) => name.endsWith(".exp")).sort()];
const file = files[files.length-1];
console.log("Generating Geometry Code Based on:"+file);
let schemaData = fs.readFileSync("./"+file).toString();
let parsed = parseElements(schemaData);
let entities: Array<Entity> = sortEntities(parsed.entities);
entities.forEach((e) => {
	walkParents(e,entities);
});

let representationElements = findElementByParent(entities,"IfcRepresentationItem")

let header: Array<string> = [];
let routing: Array<string> = [];
fs.mkdir("../cpp/web-ifc/geometry/generators/implementation/", { recursive: true }, () => {});

for (let element of representationElements) {


	if (!element.abstract) {
		let implementation: Array<string> = [];
		
		fs.writeFileSync("../cpp/web-ifc/geometry/generators/implementation/"+element.name+".cpp", implementation.join("\n")); 
	}
}


fs.writeFileSync("../cpp/web-ifc/geometry/generators/generators.h", header.join("\n")); 
fs.writeFileSync("../cpp/web-ifc/geometry/generators/generators.cpp", routing.join("\n")); 
