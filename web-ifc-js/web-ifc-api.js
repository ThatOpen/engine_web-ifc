const m = require("./wasm-lib/web-ifc.js");

let ms = () => {
    return new Date().getTime();
}

function readString(ptr, len)
{
    let string = m.HEAP8.subarray(ptr, ptr + len);
    return m.UTF8ArrayToString(string, 0);
}

function readInt32(ptr)
{
    return m.HEAP32[ptr/4];
}

m["onRuntimeInitialized"] = () => {

    console.log("init");

    {
        let start = ms();
        let ptr = m._getBuffer();
        let end = ms();

        let arr = m.HEAP8.subarray(ptr, ptr + 1000);
        console.log(`Took ${end - start} ms`);
        console.log(m.HEAP8[ptr + 1]);

        console.log(arr);
    }


    {
        let start = ms();
        let str;
        let value;
        for (let i = 0; i < 100; i++)
        {
            let structPtr = m._getString();
            str = readString(m.HEAP32[structPtr / 4], m.HEAP32[structPtr / 4 + 1]);
            value = readInt32(structPtr + 8);
        }
        let end = ms();
        console.log(`Took ${end - start} ms`);

        console.log(str);
        console.log(value);
    }
};
