import { Viewer } from './viewer.js';
import { ConvertIfcToThreeJS } from './loader.js';
import { LogBegin, LogEnd } from './logger.js';

if (typeof window != 'undefined')
{
  
  window.onload = function () {
      let viewer = new Viewer ();
      let fileUrl = document.location.hash.substring (1);

      let loader = document.createElement ('div');
      loader.classList.add ('loader');
      loader.innerHTML = 'Loading...';
      document.body.appendChild (loader);

      ConvertIfcToThreeJS (fileUrl, (result) => {
          LogBegin ('Visualizing three.js model');
          viewer.SetMainObject (result);
          viewer.FitToScreen ();
          LogEnd ('Visualizing three.js model');
          document.body.removeChild (loader);
      });
  };

}