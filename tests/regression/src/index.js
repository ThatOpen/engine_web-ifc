import { Viewer } from './viewer.js';
import { ConvertIfcToThreeJS } from './loader.js';

window.onload = function () {
	let viewer = new Viewer ();
    let fileUrl = document.location.hash.substring (1);

    let loader = document.createElement ('div');
    loader.classList.add ('loader');
    loader.innerHTML = 'Loading...';
    document.body.appendChild (loader);

    ConvertIfcToThreeJS (fileUrl, (result) => {
        viewer.SetMainObject (result);
        viewer.FitToScreen ();
        document.body.removeChild (loader);
    });
};
