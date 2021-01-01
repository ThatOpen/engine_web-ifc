import * as API from "../web-ifc-js/web-ifc-api";

async function LoadModel(data: Uint8Array)
{
    let start = API.ms();
    API.OpenModel("example.ifc", data);
    let time = API.ms() - start;
    console.log(`Opening model took ${time} ms`);
}

async function fileInputChanged()
{
    let fileInput = document.getElementById("finput");

    console.log("change");
    if (fileInput.files.length == 0)
    {
        console.log("No files selected!");
        return;
    }

    var file = fileInput.files[0];

    console.log("Waiting for wasm module");
    // await API.WaitForModuleReady();
    console.log("Done");

    var fr = new FileReader();
    fr.onload = function() {
        LoadModel(new Uint8Array(fr.result));
        fileInput.value = '';
    };
    fr.readAsArrayBuffer(file);
}

//@ts-ignore
window.InitWebIfcViewer = () =>
{
    //@ts-ignore
    API.SetModule(Module);
    let fileInput = document.getElementById("finput");

    fileInput.addEventListener('change', fileInputChanged);
}