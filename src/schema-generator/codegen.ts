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

function getReturnType(element:string) {
	return "void"
}

function getImmediateChildren(entities : Array<Entity>,parentName :string) {
	let results = new Array<Entity>();
	for (let entity of entities) {
		if (entity.parent == parentName) results.push(entity.name);
	}
	return results;
}


import {Entity} from "./gen_functional_types_interfaces";
import {parseElements, walkParents,sortEntities, findSubClasses} from "./gen_functional_types_helpers"
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
header.push(`#include "../../parsing/IfcLoader.h"`)
header.push(`#include "../../cache/IfcCache.h"`)
routing.push(`#include "generators.h"`)
header.push("namespace webifc::geometry::generators {")
routing.push("namespace webifc::geometry::generators {")
fs.mkdir("../cpp/web-ifc/geometry/generators/implementation/", { recursive: true }, () => {});

let parameters = "const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache"
let parametersNames = "expressID,lineType,loader,cache"

for (let element of representationElements) {
	header.push(`${getReturnType(element.name)} Generate${element.name}(${parameters});`)
	routing.push(`${getReturnType(element.name)} Generate${element.name}(${parameters}) {`)
	let children = getImmediateChildren(entities,element.name)
	if (children.length == 0) {
		routing.push(`\t\treturn Generate${element.name}Impl(${parametersNames});`)
	} else {
		routing.push(`\t\tswitch(lineType) {`)
		for (let child of children) {
			routing.push(`\t\t\t case webifc::schema::${child.toUpperCase()}:`)
			routing.push(`\t\t\t\treturn Generate${child}(${parametersNames});`)
			routing.push(`\t\t\t\tbreak;`)
		}
		if (!element.abstract) {
			routing.push(`\t\t\tdefault:`)
			routing.push(`\t\t\t\treturn Generate${element.name}(${parametersNames});`)
		}
		routing.push(`\t\t}`)
	}

	routing.push(`\t}`)


	if (!element.abstract) {
		header.push(`${getReturnType(element.name)} Generate${element.name}Impl(${parameters});`)
		let implementation: Array<string> = [];
		implementation.push("#include <spdlog/spdlog.h>")
		implementation.push(`#include "../generators.h"`)
		implementation.push("namespace webifc::geometry::generators {")
		implementation.push(`\t${getReturnType(element.name)} Generate${element.name}Impl(${parameters}) {`)
		implementation.push(`\t\tspdlog::debug("[Generate${element.name}Impl({})]", expressID);`)
		implementation.push(`\t}`)
		implementation.push("}");
		implementation.push("");
		fs.writeFileSync("../cpp/web-ifc/geometry/generators/implementation/"+element.name+".cpp", implementation.join("\n")); 
	}
}

header.push("}");
routing.push("}");
routing.push("");
header.push("");
fs.writeFileSync("../cpp/web-ifc/geometry/generators/generators.h", header.join("\n")); 
fs.writeFileSync("../cpp/web-ifc/geometry/generators/generators.cpp", routing.join("\n")); 