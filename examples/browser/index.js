
const WebIFC = require("web-ifc/web-ifc-api.js");

console.log("Hello web-ifc-browser!");

const ifcapi = new WebIFC.IfcAPI();

async function HttpRequest(url)
{  
    return new Promise((resolve, reject) => {
        var oReq = new XMLHttpRequest();
        oReq.responseType = "arraybuffer";
        oReq.addEventListener("load", () => {
            resolve(new Uint8Array(oReq.response));
        });
        oReq.open("GET", url);
        oReq.send();
    });
}

async function LoadFile(filename)
{
    await ifcapi.Init();

    let ifcData = await HttpRequest(filename);
    console.log("Got data!");

    let modelID = ifcapi.OpenModel(filename, ifcData);

    console.log(`Loaded model ${filename} to modelID ${modelID}`);

    ifcapi.CloseModel(modelID);
}

LoadFile("example.ifc");