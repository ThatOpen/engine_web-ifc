import * as API from "../web-ifc-js/web-ifc-api";

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
        console.log("Open Model");
        API.OpenModel("example.ifc", fr.result);

        console.log("Model open");

        fileInput.value = '';
    };
    fr.readAsText(file);
}

//@ts-ignore
window.InitWebIfcViewer = () =>
{
    //@ts-ignore
    API.SetModule(Module);
    let fileInput = document.getElementById("finput");

    fileInput.addEventListener('change', fileInputChanged);
}