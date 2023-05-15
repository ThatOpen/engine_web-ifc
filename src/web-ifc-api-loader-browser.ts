/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Logic to load the WASM in Browser
 */


let WebIFCWasm: any;

//@ts-ignore
if (typeof self !== 'undefined' && self.crossOriginIsolated) {
    try {
        WebIFCWasm = require("./web-ifc-mt");
    } catch (ex){
        WebIFCWasm = require("./web-ifc");
    }
}