import * as fs from 'fs';
import * as path from 'path';
import * as WebIFC from '../../dist/web-ifc-api-node.js';
/**
 * Should be somewhere else.
 */
function Utf8ArrayToStr(array: Uint8Array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}

import type {
    Vector,
    FlatMesh,
    IfcAPI,
    IfcGeometry,
    RawLineData
} from '../../dist/web-ifc-api-node.js';


let ifcApi: IfcAPI;
let modelID: number;
let expressId: number = 9989; // an IFCSPACE
let geometries: Vector < FlatMesh > ; // to store geometries instead of refetching them
let allGeometriesSize: number = 119;
let quantityOfknownErrors: number = 0;
let meshesCount: number = 115;
let totalLineNumber : number = 6487;
let emptyFileModelID: number;
let expressIDMatchingGuid: any = {
    expressID: 2863,
    guid: "0VNYAWfXv8JvIRVfOzYH1j"
}
let expectedVertexAndIndexDatas: any = {
    geometryIndex: 1,
    indexDatas: "1,2,3,27,28,29,1,3,4,26,27,29,1,4,5,25,26,29,1,5,6,25,29,0,1,6,7,24,25,0,1,7,8,23,24,0,1,8,9,22,23,0,1,9,10,21,22,0,1,10,11,20,21,0,1,11,12,19,20,0,1,12,13,18,19,0,1,13,14,17,18,0,1,14,15,16,17,0,0,1,15,15,16,0,32,34,33,58,60,59,32,35,34,57,60,58,32,36,35,56,60,57,32,37,36,56,31,60,32,38,37,55,31,56,32,39,38,54,31,55,32,40,39,53,31,54,32,41,40,52,31,53,32,42,41,51,31,52,32,43,42,50,31,51,32,44,43,49,31,50,32,45,44,48,31,49,32,46,45,47,31,48,31,46,32,46,31,47,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241",
    vertexDatas: "0,0,7969.60009765625,0,0,1,300,0,7969.60009765625,0,0,1,300,90,7969.60009765625,0,0,1,284,90,7969.60009765625,0,0,1,284,22,7969.60009765625,0,0,1,283.8575134277344,20.007593154907227,7969.60009765625,0,0,1,283.4328918457031,18.055744171142578,7969.60009765625,0,0,1,282.7348327636719,16.18419075012207,7969.60009765625,0,0,1,281.7775573730469,14.431028366088867,7969.60009765625,0,0,1,280.58050537109375,12.831950187683105,7969.60009765625,0,0,1,279.1680603027344,11.419506072998047,7969.60009765625,0,0,1,277.5689697265625,10.222450256347656,7969.60009765625,0,0,1,275.8157958984375,9.265151977539062,7969.60009765625,0,0,1,273.9442443847656,8.567098617553711,7969.60009765625,0,0,1,271.9924011230469,8.142499923706055,7969.60009765625,0,0,1,270,8,7969.60009765625,0,0,1,30,8,7969.60009765625,0,0,1,28.007593154907227,8.142499923706055,7969.60009765625,0,0,1,26.055744171142578,8.567098617553711,7969.60009765625,0,0,1,24.18419075012207,9.265151977539062,7969.60009765625,0,0,1,22.431028366088867,10.222450256347656,7969.60009765625,0,0,1,20.83194923400879,11.419506072998047,7969.60009765625,0,0,1,19.419506072998047,12.831950187683105,7969.60009765625,0,0,1,18.222450256347656,14.431028366088867,7969.60009765625,0,0,1,17.265151977539062,16.18419075012207,7969.60009765625,0,0,1,16.56709861755371,18.055744171142578,7969.60009765625,0,0,1,16.142499923706055,20.007593154907227,7969.60009765625,0,0,1,16,22,7969.60009765625,0,0,1,16,90,7969.60009765625,0,0,1,0,90,7969.60009765625,0,0,1,0,0,7969.60009765625,0,0,1,0,0,0,0,0,-1,300,0,0,0,0,-1,300,90,0,0,0,-1,284,90,0,0,0,-1,284,22,0,0,0,-1,283.8575134277344,20.007593154907227,0,0,0,-1,283.4328918457031,18.055744171142578,0,0,0,-1,282.7348327636719,16.18419075012207,0,0,0,-1,281.7775573730469,14.431028366088867,0,0,0,-1,280.58050537109375,12.831950187683105,0,0,0,-1,279.1680603027344,11.419506072998047,0,0,0,-1,277.5689697265625,10.222450256347656,0,0,0,-1,275.8157958984375,9.265151977539062,0,0,0,-1,273.9442443847656,8.567098617553711,0,0,0,-1,271.9924011230469,8.142499923706055,0,0,0,-1,270,8,0,0,0,-1,30,8,0,0,0,-1,28.007593154907227,8.142499923706055,0,0,0,-1,26.055744171142578,8.567098617553711,0,0,0,-1,24.18419075012207,9.265151977539062,0,0,0,-1,22.431028366088867,10.222450256347656,0,0,0,-1,20.83194923400879,11.419506072998047,0,0,0,-1,19.419506072998047,12.831950187683105,0,0,0,-1,18.222450256347656,14.431028366088867,0,0,0,-1,17.265151977539062,16.18419075012207,0,0,0,-1,16.56709861755371,18.055744171142578,0,0,0,-1,16.142499923706055,20.007593154907227,0,0,0,-1,16,22,0,0,0,-1,16,90,0,0,0,-1,0,90,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,-1,0,300,0,7969.60009765625,0,-1,0,0,0,7969.60009765625,0,-1,0,0,0,0,0,-1,0,300,0,0,0,-1,0,300,0,7969.60009765625,0,-1,0,300,0,0,1,0,0,300,90,7969.60009765625,1,0,0,300,0,7969.60009765625,1,0,0,300,0,0,1,0,0,300,90,0,1,0,0,300,90,7969.60009765625,1,0,0,300,90,0,0,1,0,284,90,7969.60009765625,0,1,0,300,90,7969.60009765625,0,1,0,300,90,0,0,1,0,284,90,0,0,1,0,284,90,7969.60009765625,0,1,0,284,90,0,-1,0,0,284,22,7969.60009765625,-1,0,0,284,90,7969.60009765625,-1,0,0,284,90,0,-1,0,0,284,22,0,-1,0,0,284,22,7969.60009765625,-1,0,0,284,22,0,-0.9974521398544312,0.0713391825556755,0,283.8575134277344,20.007593154907227,7969.60009765625,-0.9974521398544312,0.0713391825556755,0,284,22,7969.60009765625,-0.9974521398544312,0.0713391825556755,0,284,22,0,-0.9974521398544312,0.0713391825556755,0,283.8575134277344,20.007593154907227,0,-0.9974521398544312,0.0713391825556755,0,283.8575134277344,20.007593154907227,7969.60009765625,-0.9974521398544312,0.0713391825556755,0,283.8575134277344,20.007593154907227,0,-0.9771468639373779,0.21256528794765472,0,283.4328918457031,18.055744171142578,7969.60009765625,-0.9771468639373779,0.21256528794765472,0,283.8575134277344,20.007593154907227,7969.60009765625,-0.9771468639373779,0.21256528794765472,0,283.8575134277344,20.007593154907227,0,-0.9771468639373779,0.21256528794765472,0,283.4328918457031,18.055744171142578,0,-0.9771468639373779,0.21256528794765472,0,283.4328918457031,18.055744171142578,7969.60009765625,-0.9771468639373779,0.21256528794765472,0,283.4328918457031,18.055744171142578,0,-0.9369497299194336,0.34946417808532715,0,282.7348327636719,16.18419075012207,7969.60009765625,-0.9369497299194336,0.34946417808532715,0,283.4328918457031,18.055744171142578,7969.60009765625,-0.9369497299194336,0.34946417808532715,0,283.4328918457031,18.055744171142578,0,-0.9369497299194336,0.34946417808532715,0,282.7348327636719,16.18419075012207,0,-0.9369497299194336,0.34946417808532715,0,282.7348327636719,16.18419075012207,7969.60009765625,-0.9369497299194336,0.34946417808532715,0,282.7348327636719,16.18419075012207,0,-0.8776789903640747,0.4792490005493164,0,281.7775573730469,14.431028366088867,7969.60009765625,-0.8776789903640747,0.4792490005493164,0,282.7348327636719,16.18419075012207,7969.60009765625,-0.8776789903640747,0.4792490005493164,0,282.7348327636719,16.18419075012207,0,-0.8776789903640747,0.4792490005493164,0,281.7775573730469,14.431028366088867,0,-0.8776789903640747,0.4792490005493164,0,281.7775573730469,14.431028366088867,7969.60009765625,-0.8776789903640747,0.4792490005493164,0,281.7775573730469,14.431028366088867,0,-0.8005412220954895,0.599277675151825,0,280.58050537109375,12.831950187683105,7969.60009765625,-0.8005412220954895,0.599277675151825,0,281.7775573730469,14.431028366088867,7969.60009765625,-0.8005412220954895,0.599277675151825,0,281.7775573730469,14.431028366088867,0,-0.8005412220954895,0.599277675151825,0,280.58050537109375,12.831950187683105,0,-0.8005412220954895,0.599277675151825,0,280.58050537109375,12.831950187683105,7969.60009765625,-0.8005412220954895,0.599277675151825,0,280.58050537109375,12.831950187683105,0,-0.7071067690849304,0.7071067690849304,0,279.1680603027344,11.419506072998047,7969.60009765625,-0.7071067690849304,0.7071067690849304,0,280.58050537109375,12.831950187683105,7969.60009765625,-0.7071067690849304,0.7071067690849304,0,280.58050537109375,12.831950187683105,0,-0.7071067690849304,0.7071067690849304,0,279.1680603027344,11.419506072998047,0,-0.7071067690849304,0.7071067690849304,0,279.1680603027344,11.419506072998047,7969.60009765625,-0.7071067690849304,0.7071067690849304,0,279.1680603027344,11.419506072998047,0,-0.599277675151825,0.8005412220954895,0,277.5689697265625,10.222450256347656,7969.60009765625,-0.599277675151825,0.8005412220954895,0,279.1680603027344,11.419506072998047,7969.60009765625,-0.599277675151825,0.8005412220954895,0,279.1680603027344,11.419506072998047,0,-0.599277675151825,0.8005412220954895,0,277.5689697265625,10.222450256347656,0,-0.599277675151825,0.8005412220954895,0,277.5689697265625,10.222450256347656,7969.60009765625,-0.599277675151825,0.8005412220954895,0,277.5689697265625,10.222450256347656,0,-0.4792490005493164,0.8776789903640747,0,275.8157958984375,9.265151977539062,7969.60009765625,-0.4792490005493164,0.8776789903640747,0,277.5689697265625,10.222450256347656,7969.60009765625,-0.4792490005493164,0.8776789903640747,0,277.5689697265625,10.222450256347656,0,-0.4792490005493164,0.8776789903640747,0,275.8157958984375,9.265151977539062,0,-0.4792490005493164,0.8776789903640747,0,275.8157958984375,9.265151977539062,7969.60009765625,-0.4792490005493164,0.8776789903640747,0,275.8157958984375,9.265151977539062,0,-0.34946417808532715,0.9369497299194336,0,273.9442443847656,8.567098617553711,7969.60009765625,-0.34946417808532715,0.9369497299194336,0,275.8157958984375,9.265151977539062,7969.60009765625,-0.34946417808532715,0.9369497299194336,0,275.8157958984375,9.265151977539062,0,-0.34946417808532715,0.9369497299194336,0,273.9442443847656,8.567098617553711,0,-0.34946417808532715,0.9369497299194336,0,273.9442443847656,8.567098617553711,7969.60009765625,-0.34946417808532715,0.9369497299194336,0,273.9442443847656,8.567098617553711,0,-0.21256528794765472,0.9771468639373779,0,271.9924011230469,8.142499923706055,7969.60009765625,-0.21256528794765472,0.9771468639373779,0,273.9442443847656,8.567098617553711,7969.60009765625,-0.21256528794765472,0.9771468639373779,0,273.9442443847656,8.567098617553711,0,-0.21256528794765472,0.9771468639373779,0,271.9924011230469,8.142499923706055,0,-0.21256528794765472,0.9771468639373779,0,271.9924011230469,8.142499923706055,7969.60009765625,-0.21256528794765472,0.9771468639373779,0,271.9924011230469,8.142499923706055,0,-0.0713391825556755,0.9974521398544312,0,270,8,7969.60009765625,-0.0713391825556755,0.9974521398544312,0,271.9924011230469,8.142499923706055,7969.60009765625,-0.0713391825556755,0.9974521398544312,0,271.9924011230469,8.142499923706055,0,-0.0713391825556755,0.9974521398544312,0,270,8,0,-0.0713391825556755,0.9974521398544312,0,270,8,7969.60009765625,-0.0713391825556755,0.9974521398544312,0,270,8,0,1.7082631831441195e-14,1,0,30,8,7969.60009765625,1.7082631831441195e-14,1,0,270,8,7969.60009765625,1.7082631831441195e-14,1,0,270,8,0,1.7082631831441195e-14,1,0,30,8,0,1.7082631831441195e-14,1,0,30,8,7969.60009765625,1.7082631831441195e-14,1,0,30,8,0,0.0713391825556755,0.9974521398544312,0,28.007593154907227,8.142499923706055,7969.60009765625,0.0713391825556755,0.9974521398544312,0,30,8,7969.60009765625,0.0713391825556755,0.9974521398544312,0,30,8,0,0.0713391825556755,0.9974521398544312,0,28.007593154907227,8.142499923706055,0,0.0713391825556755,0.9974521398544312,0,28.007593154907227,8.142499923706055,7969.60009765625,0.0713391825556755,0.9974521398544312,0,28.007593154907227,8.142499923706055,0,0.21256528794765472,0.9771468639373779,0,26.055744171142578,8.567098617553711,7969.60009765625,0.21256528794765472,0.9771468639373779,0,28.007593154907227,8.142499923706055,7969.60009765625,0.21256528794765472,0.9771468639373779,0,28.007593154907227,8.142499923706055,0,0.21256528794765472,0.9771468639373779,0,26.055744171142578,8.567098617553711,0,0.21256528794765472,0.9771468639373779,0,26.055744171142578,8.567098617553711,7969.60009765625,0.21256528794765472,0.9771468639373779,0,26.055744171142578,8.567098617553711,0,0.34946417808532715,0.9369497299194336,0,24.18419075012207,9.265151977539062,7969.60009765625,0.34946417808532715,0.9369497299194336,0,26.055744171142578,8.567098617553711,7969.60009765625,0.34946417808532715,0.9369497299194336,0,26.055744171142578,8.567098617553711,0,0.34946417808532715,0.9369497299194336,0,24.18419075012207,9.265151977539062,0,0.34946417808532715,0.9369497299194336,0,24.18419075012207,9.265151977539062,7969.60009765625,0.34946417808532715,0.9369497299194336,0,24.18419075012207,9.265151977539062,0,0.4792490005493164,0.8776789903640747,0,22.431028366088867,10.222450256347656,7969.60009765625,0.4792490005493164,0.8776789903640747,0,24.18419075012207,9.265151977539062,7969.60009765625,0.4792490005493164,0.8776789903640747,0,24.18419075012207,9.265151977539062,0,0.4792490005493164,0.8776789903640747,0,22.431028366088867,10.222450256347656,0,0.4792490005493164,0.8776789903640747,0,22.431028366088867,10.222450256347656,7969.60009765625,0.4792490005493164,0.8776789903640747,0,22.431028366088867,10.222450256347656,0,0.599277675151825,0.8005412220954895,0,20.83194923400879,11.419506072998047,7969.60009765625,0.599277675151825,0.8005412220954895,0,22.431028366088867,10.222450256347656,7969.60009765625,0.599277675151825,0.8005412220954895,0,22.431028366088867,10.222450256347656,0,0.599277675151825,0.8005412220954895,0,20.83194923400879,11.419506072998047,0,0.599277675151825,0.8005412220954895,0,20.83194923400879,11.419506072998047,7969.60009765625,0.599277675151825,0.8005412220954895,0,20.83194923400879,11.419506072998047,0,0.7071067690849304,0.7071067690849304,0,19.419506072998047,12.831950187683105,7969.60009765625,0.7071067690849304,0.7071067690849304,0,20.83194923400879,11.419506072998047,7969.60009765625,0.7071067690849304,0.7071067690849304,0,20.83194923400879,11.419506072998047,0,0.7071067690849304,0.7071067690849304,0,19.419506072998047,12.831950187683105,0,0.7071067690849304,0.7071067690849304,0,19.419506072998047,12.831950187683105,7969.60009765625,0.7071067690849304,0.7071067690849304,0,19.419506072998047,12.831950187683105,0,0.8005412220954895,0.599277675151825,0,18.222450256347656,14.431028366088867,7969.60009765625,0.8005412220954895,0.599277675151825,0,19.419506072998047,12.831950187683105,7969.60009765625,0.8005412220954895,0.599277675151825,0,19.419506072998047,12.831950187683105,0,0.8005412220954895,0.599277675151825,0,18.222450256347656,14.431028366088867,0,0.8005412220954895,0.599277675151825,0,18.222450256347656,14.431028366088867,7969.60009765625,0.8005412220954895,0.599277675151825,0,18.222450256347656,14.431028366088867,0,0.8776789903640747,0.4792490005493164,0,17.265151977539062,16.18419075012207,7969.60009765625,0.8776789903640747,0.4792490005493164,0,18.222450256347656,14.431028366088867,7969.60009765625,0.8776789903640747,0.4792490005493164,0,18.222450256347656,14.431028366088867,0,0.8776789903640747,0.4792490005493164,0,17.265151977539062,16.18419075012207,0,0.8776789903640747,0.4792490005493164,0,17.265151977539062,16.18419075012207,7969.60009765625,0.8776789903640747,0.4792490005493164,0,17.265151977539062,16.18419075012207,0,0.9369497299194336,0.34946417808532715,0,16.56709861755371,18.055744171142578,7969.60009765625,0.9369497299194336,0.34946417808532715,0,17.265151977539062,16.18419075012207,7969.60009765625,0.9369497299194336,0.34946417808532715,0,17.265151977539062,16.18419075012207,0,0.9369497299194336,0.34946417808532715,0,16.56709861755371,18.055744171142578,0,0.9369497299194336,0.34946417808532715,0,16.56709861755371,18.055744171142578,7969.60009765625,0.9369497299194336,0.34946417808532715,0,16.56709861755371,18.055744171142578,0,0.9771468639373779,0.21256528794765472,0,16.142499923706055,20.007593154907227,7969.60009765625,0.9771468639373779,0.21256528794765472,0,16.56709861755371,18.055744171142578,7969.60009765625,0.9771468639373779,0.21256528794765472,0,16.56709861755371,18.055744171142578,0,0.9771468639373779,0.21256528794765472,0,16.142499923706055,20.007593154907227,0,0.9771468639373779,0.21256528794765472,0,16.142499923706055,20.007593154907227,7969.60009765625,0.9771468639373779,0.21256528794765472,0,16.142499923706055,20.007593154907227,0,0.9974521398544312,0.0713391825556755,0,16,22,7969.60009765625,0.9974521398544312,0.0713391825556755,0,16.142499923706055,20.007593154907227,7969.60009765625,0.9974521398544312,0.0713391825556755,0,16.142499923706055,20.007593154907227,0,0.9974521398544312,0.0713391825556755,0,16,22,0,0.9974521398544312,0.0713391825556755,0,16,22,7969.60009765625,0.9974521398544312,0.0713391825556755,0,16,22,0,1,-6.018715257086193e-14,0,16,90,7969.60009765625,1,-6.018715257086193e-14,0,16,22,7969.60009765625,1,-6.018715257086193e-14,0,16,22,0,1,-6.018715257086193e-14,0,16,90,0,1,-6.018715257086193e-14,0,16,90,7969.60009765625,1,-6.018715257086193e-14,0,16,90,0,0,1,0,0,90,7969.60009765625,0,1,0,16,90,7969.60009765625,0,1,0,16,90,0,0,1,0,0,90,0,0,1,0,0,90,7969.60009765625,0,1,0,0,90,0,-1,0,0,0,0,7969.60009765625,-1,0,0,0,90,7969.60009765625,-1,0,0,0,90,0,-1,0,0,0,0,0,-1,0,0,0,0,7969.60009765625,-1,0,0"
}
let IFCEXTRUDEDAREASOLIDMeshesCount = 97;
let givenCoordinationMatrix: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];


beforeAll(async () => {
    ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();

    const exampleIFCPath = path.join(__dirname, '../artifacts/example.ifc.test');
    const exampleIFCData = fs.readFileSync(exampleIFCPath);

    modelID = ifcApi.OpenModel(exampleIFCData);
    emptyFileModelID = ifcApi.CreateModel();
})

describe('WebIfcApi reading methods', () => {
    test('can retrieve a modelID', () => {
        expect(modelID).toBe(0);

    })
    test('can ensure model is open', () => {
        const isOpen: boolean = ifcApi.IsModelOpen(modelID);

        expect(isOpen).toBeTruthy();
    })
    test('can return the correct number of line with a given Type', () => {
        let properties = ifcApi.GetLineIDsWithType(modelID, WebIFC.IFCPROPERTYSINGLEVALUE)
        expect(properties.size()).toEqual(456);
    })
    test('can return the correct number of line when getting all lines', () => {
        const lines: any = ifcApi.GetAllLines(modelID);
        expect(lines.size()).toEqual(totalLineNumber);
    })
    test('can GetLine', () => {
        const line: Object = ifcApi.GetLine(modelID, expressId);
        expect(line).not.toBeNull();
    })
    test('can flatten a line which will be more verbose', () => {
        const line: any = ifcApi.GetLine(modelID, expressId);
        ifcApi.FlattenLine(modelID, line);
        expect(line.OwnerHistory.OwningUser).not.toBe(null);
    })
    test('expect the correct line to be returned', () => {
        const line: any = ifcApi.GetLine(modelID, expressId);
        expect(line.expressID).toEqual(expressId);
    })
    test('expect getting flatten line return verbose line', () => {
        let flattened: boolean = true;
        const line: any = ifcApi.GetLine(modelID, expressId, flattened);
        expect(line.Representation.Representations.length).toEqual(2); // hardcoded
    })
    test('can Get Raw Line', () => {
        let line: RawLineData = ifcApi.GetRawLineData(modelID, expressId);
        expect(line).not.toBeNull();
    })
    test('expect the correct raw line to be returned', () => {
        let line: RawLineData = ifcApi.GetRawLineData(modelID, expressId);
        expect(line.ID).toEqual(expressId);
    })
    test('can count errors in ifc file', () => {
        let errors: any = ifcApi.GetAndClearErrors(modelID);
        expect(errors.size()).toEqual(quantityOfknownErrors);
    })
    test('can Create Ifc Guid To Express Id Map', () => {
        let count: number = 0;
        ifcApi.CreateIfcGuidToExpressIdMapping(modelID);
        expect(ifcApi.ifcGuidMap.get(0)?.get(expressIDMatchingGuid.expressID)).toEqual(expressIDMatchingGuid.guid);
    })



})
describe('WebIfcApi geometries', () => {
    test('can return the correct number geometries', () => {
        geometries = ifcApi.LoadAllGeometry(modelID);
        expect(geometries.size()).toBe(allGeometriesSize);
    })
    test('can Get a Flat Mesh', () => {
        let geometryExpressId = geometries.get(1).expressID;
        let flatMesh: FlatMesh = ifcApi.GetFlatMesh(modelID, geometryExpressId);
        expect(flatMesh.geometries.size() > 0).toBeTruthy();
    })
    test('expect the correct flatMesh to be returned', () => {
        let geometryExpressId = geometries.get(1).expressID;
        let flatMesh: FlatMesh = ifcApi.GetFlatMesh(modelID, geometryExpressId);
        expect(flatMesh.expressID).toEqual(geometryExpressId);
    })
    test('can get geometry', () => {
        let geometryId = geometries.get(1).expressID;
        const geometry: IfcGeometry = ifcApi.GetGeometry(modelID, geometryId);
        expect(geometry.GetIndexData()).not.toBeNull()
        expect(geometry.GetIndexDataSize()).not.toBeNull()
        expect(geometry.GetVertexData()).not.toBeNull()
        expect(geometry.GetVertexDataSize()).not.toBeNull()
    })
    test('can Get Coordination Matrix', () => {
        let coordinationMatrix: Array < number > = ifcApi.GetCoordinationMatrix(modelID);
        expect(coordinationMatrix.join(",")).toEqual(givenCoordinationMatrix.join(","));
    })
    test('expect index array as Float32Array', () => {
        let geometryId = geometries.get(1).expressID;
        const geometry: IfcGeometry = ifcApi.GetGeometry(modelID, geometryId);
        let indexArray: Float32Array = ifcApi.GetVertexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());
        expect(indexArray).toBeInstanceOf(Float32Array);
    })
    test('expect vertex Array as Float32Array', () => {
        let geometryId = geometries.get(1).expressID;
        const geometry: IfcGeometry = ifcApi.GetGeometry(modelID, geometryId);
        let vertexArray: Float32Array = ifcApi.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
        expect(vertexArray).toBeInstanceOf(Float32Array);
    })
    test('can return vertex array from a flat mesh', () => {
        let geometryExpressId = geometries.get(1).expressID;
        let flatMesh = ifcApi.GetFlatMesh(modelID, geometryExpressId);
        let flatMesheGeometries: IfcGeometry = ifcApi.GetGeometry(modelID, flatMesh.geometries.get(0).geometryExpressID);
        let geometryVertexArray: Float32Array = ifcApi.GetVertexArray(flatMesheGeometries.GetVertexData(), flatMesheGeometries.GetVertexDataSize());
        expect(geometryVertexArray.length > 0).toBeTruthy();
    })
    test('can return geometry index datas from a flat mesh', () => {
        let geometryExpressId = geometries.get(1).expressID;
        let flatMesh = ifcApi.GetFlatMesh(modelID, geometryExpressId);
        let flatMesheGeometries: IfcGeometry = ifcApi.GetGeometry(modelID, flatMesh.geometries.get(0).geometryExpressID);
        let geometryIndexData: Uint32Array = ifcApi.GetIndexArray(flatMesheGeometries.GetIndexData(), flatMesheGeometries.GetIndexDataSize());
        expect(geometryIndexData.length > 0).toBeTruthy();
    })
    test('expect correct vertex and index array from A flat Mesh', () => {
        let flatMesh = ifcApi.GetFlatMesh(modelID, geometries.get(expectedVertexAndIndexDatas.geometryIndex).expressID);
        let geometry = ifcApi.GetGeometry(modelID, flatMesh.geometries.get(0).geometryExpressID);
        let geometryVertexArray = ifcApi.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
        let geometryIndexData = ifcApi.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());
        let geometryIndexDatasString = geometryIndexData.join(",");
        let geometryVertexArrayString = geometryVertexArray.join(",");
        expect(geometryIndexDatasString).toEqual(expectedVertexAndIndexDatas.indexDatas);
        expect(geometryVertexArrayString).toEqual(expectedVertexAndIndexDatas.vertexDatas);

    })
    test('can ensure the corret number of all streamed meshes ', () => {
        let count: number = 0;
        ifcApi.StreamAllMeshes(modelID, (mesh) => {
            count++;
        });
        expect(count).toEqual(meshesCount);
    })
    test('can ensure the corret number of all streamed meshes with a given Types', () => {
        let count: number = 0;
        ifcApi.StreamAllMeshesWithTypes(modelID, [WebIFC.IFCEXTRUDEDAREASOLID], (mesh) => {
            ++count
        });
        expect(count).toEqual(IFCEXTRUDEDAREASOLIDMeshesCount);
    })
});
describe('WebIfcApi geometry transformation', () => {

    test('should throw Error with message \'invalid matrix size\' when matrix size != 16', () => {
        let f = ifcApi.SetGeometryTransformation(modelID, [1]);
        expect(f).toThrow("invalid matrix size");
    })
});
describe('WebIfcApi writing methods', () => {
    test('Can create an empty model', () => {
        expect(emptyFileModelID).toBe(1);
    })
    test('Can ensure modelIDs increment when adding new model in ifcApi', () => {
        expect(emptyFileModelID).toBe(1);
    })
    test('Can write a line from raw datas', () => {
        ifcApi.WriteRawLineData(emptyFileModelID, {
            ID: 1,
            type: 4251960020,
            arguments: [{
                    type: 1,
                    value: '0cqv$41Df7ygSQzJTMBnvM'
                },
                {
                    type: 1,
                    value: ''
                },
                {
                    type: 1,
                    value: 'foo'
                },
                null,
                {
                    type: 1,
                    value: ''
                },
                {
                    type: 1,
                    value: ''
                },
                {
                    type: 1,
                    value: ''
                },
                {
                    type: 1,
                    value: ''
                }
            ]
        })
        let project: any = ifcApi.GetLine(emptyFileModelID, 1);
        expect(project.Description.value).toEqual("foo");
    })
    test('Can modify a line with a rawLineData', () => {
        ifcApi.WriteRawLineData(emptyFileModelID, {
            ID: 1,
            type: 4251960020,
            arguments: [{
                    type: 1,
                    value: '0cqv$41Df7ygSQzJTMBnvM'
                },
                {
                    type: 1,
                    value: ''
                },
                {
                    type: 1,
                    value: 'foobar'
                },
                null,
                {
                    type: 5,
                    value: ''
                },
                {
                    type: 1,
                    value: ''
                },
                {
                    type: 1,
                    value: ''
                },
                {
                    type: 1,
                    value: ''
                }
            ]
        })
        let project: any = ifcApi.GetLine(emptyFileModelID, 1);
        expect(project.Description.value).toBe("foobar");
    })
    test('can write a line by giving a line object', () => {
        let projectBeforeWriting: any = ifcApi.GetAllLines(modelID);
        let payload = {
            expressID: 9999999,
            type: 3856911033,
            toType: 3856911033,
            OwnerHistory: {
                type: 5,
                value: 41
            },
            Name: {
                type: 1,
                value: 'NZ-SHS beam:100x6.0SHS:823947'
            },
            Description: null,
            ObjectType: {
                type: 1,
                value: 'NZ-SHS beam:100x6.0SHS'
            },
            ObjectPlacement: {
                type: 5,
                value: 9750
            },
            Representation: {
                type: 5,
                value: 9987
            },
            LongName: {
                type: 1,
                value: '823947'
            },
            CompositionType: undefined,
            PredefinedType: undefined,
            ElevationWithFlooring: undefined
        }
        ifcApi.WriteLine(modelID, payload);
        let projectAfterWriting: any = ifcApi.GetAllLines(modelID);
        expect(projectBeforeWriting.size() + 1).toEqual(projectAfterWriting.size());
    })
    test('can modify a line by giving a line object', () => {
        let aSpace: any = ifcApi.GetLine(modelID, expressId);
        aSpace.Name.value = "foo";
        ifcApi.WriteLine(modelID, aSpace);
        let aSpaceReloaded: any = ifcApi.GetLine(modelID, expressId);
        expect(aSpaceReloaded.Name.value).toEqual("foo");
    })

    test('can Export File As IFC', () => {
        let ifcDatas = ifcApi.ExportFileAsIFC(modelID);
        let exportModelID = ifcApi.OpenModel(ifcDatas);
        const line: any = ifcApi.GetLine(exportModelID, expressId);
        expect(exportModelID).toEqual(2);
        expect(line.expressID).toEqual(expressId);


    })

})

describe('WebIfcApi known failures', () => {
    describe("issue:#212", () => {
        test("GetLine doesn't support all entity types (only IFC4?) issue:#212", async () => {
            let ifcApi = new WebIFC.IfcAPI();
            await ifcApi.Init();
            let failModelID = 0;
            const exampleIFCPath: string = path.join(__dirname, '../artifacts/Sample_entities.ifc.test');
            const exampleIFCData = fs.readFileSync(exampleIFCPath);
            failModelID = ifcApi.OpenModel(exampleIFCData);
            const IFCELECTRICDISTRIBUTIONPOINT_EXPRESSID = 237;
            try {
                ifcApi.GetLine(failModelID, IFCELECTRICDISTRIBUTIONPOINT_EXPRESSID);
                expect(false).toBeTruthy();
            } catch (error) {
                expect(true).toBeTruthy();
            }

            ifcApi.CloseModel(failModelID);
        });
    })

    describe("issue:#209", () => {
        test("OpenModel fails when USE_FAST_BOOLS is disabled issue:#209", async () => {
            let ifcApi = new WebIFC.IfcAPI();
            let config = {
                COORDINATE_TO_ORIGIN: false,
                USE_FAST_BOOLS: false
            };
            await ifcApi.Init();
            let failModelID = 0;
            const exampleIFCPath: string = path.join(__dirname, '../artifacts/S_Office_Integrated Design Archi.ifc.test');
            const exampleIFCData = fs.readFileSync(exampleIFCPath);
            try {
                ifcApi.OpenModel(exampleIFCData, config);
                expect(true).toBeFalsy();
            } catch (error) {
                expect(true).toBeTruthy();
            }
            ifcApi.CloseModel(failModelID);
        })
    });
    describe("issue:#214", () => {
        test("REAL numbers written by ExportFileAsIFC() are in an invalid format", async () => {
            let ifcApi = new WebIFC.IfcAPI();
            await ifcApi.Init();
            let failModelID = 0;
            const exampleIFCPath: string = path.join(__dirname, '../artifacts/example.ifc_issue_214.test');
            const exampleIFCData = fs.readFileSync(exampleIFCPath);
            failModelID = ifcApi.OpenModel(exampleIFCData);
            let ifcDatas = ifcApi.ExportFileAsIFC(failModelID);
            let rawIfcString = Utf8ArrayToStr(ifcDatas);

            expect(rawIfcString.indexOf("#6=IFCCARTESIANPOINT((0.,0.,0.));") == -1).toBeTruthy();
            expect(rawIfcString.indexOf("#13=IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.000000000000001E-05,#12,$);") == -1).toBeTruthy();

            ifcApi.CloseModel(failModelID);
        });
        test("when ExportFileAsIFC() exponents need to be written with a 'E' not 'e'", async () => {
            let ifcApi = new WebIFC.IfcAPI();
            await ifcApi.Init();
            let failModelID = 0;
            const exampleIFCPath: string = path.join(__dirname, '../artifacts/example.ifc_issue_214.test');
            const exampleIFCData = fs.readFileSync(exampleIFCPath);
            failModelID = ifcApi.OpenModel(exampleIFCData);
            let ifcDatas = ifcApi.ExportFileAsIFC(failModelID);
            let rawIfcString = Utf8ArrayToStr(ifcDatas);
            expect(rawIfcString.indexOf("#13=IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.000000000000001E-05,#12,$);") == -1).toBeTruthy();
            ifcApi.CloseModel(failModelID);
        });

        test("FILE_NAME header should have 7 attributes not 5", async () => {
            expect(true).toBeTruthy();
        });
    });

})

describe('some use cases', () => {
    test("can write a new property value and read it back in", async () => {
        async function getFirstStorey(api, mId) {
            const storeyIds = await api.properties.getAllItemsOfType(mId, WebIFC.IFCBUILDINGSTOREY, false);
            expect(storeyIds.length).toBe(2);
            const storeyId = storeyIds[0];
            const storey = await api.properties.getItemProperties(mId, storeyId);
            return [storey, storeyId];
          }
          let [storey, storeyId] = await getFirstStorey(ifcApi, modelID);
          const newStoreyName = 'Nivel 1 - Editado'
          storey.LongName.value = newStoreyName;
          ifcApi.WriteLine(modelID, storey);
          storey = await ifcApi.properties.getItemProperties(modelID, storeyId);
          expect(storey.LongName.value).toBe(newStoreyName);
      
          const writtenData = await ifcApi.ExportFileAsIFC(modelID);
          let modelId = ifcApi.OpenModel(writtenData);
          [storey, storeyId] = await getFirstStorey(ifcApi, modelId);
          expect(storey.LongName.value).toBe(newStoreyName);
    });
    
})

afterAll(() => {

    ifcApi.CloseModel(modelID);
    const isOpen: boolean = ifcApi.IsModelOpen(modelID);
    const isOpenEmptyFileModelID: boolean = ifcApi.IsModelOpen(emptyFileModelID);

    expect(isOpen).toBeFalsy()
    expect(isOpenEmptyFileModelID).toBeFalsy()
})