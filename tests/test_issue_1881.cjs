const WebIFC = require("../dist/web-ifc-api-node.js");
const path = require("path");

// IFC mínim en memòria — sense fitxer
const IFC = `ISO-10303-21;
HEADER;FILE_DESCRIPTION(('test'),'2;1');FILE_NAME('','',(''),(''),'','','');FILE_SCHEMA(('IFC4'));ENDSEC;
DATA;
#1=IFCCARTESIANPOINTLIST2D(((0.,0.),(1.,1.),(2.,0.)));
#2=IFCINDEXEDPOLYCURVE(#1,(IFCARCINDEX((1,2,3))),.F.);
ENDSEC;END-ISO-10303-21;`;

async function test() {
    const api = new WebIFC.IfcAPI();
    await api.Init();

    const modelID = api.OpenModel(Buffer.from(IFC));
    const ids = api.GetLineIDsWithType(modelID, WebIFC.IFCINDEXEDPOLYCURVE);
    console.log("IfcIndexedPolyCurve trobats:", ids.size());

    // GetLine(false) = FromRawLineData sense FlattenLine (que confon IfcArcIndex amb Handle)
    const entity = api.GetLine(modelID, ids.get(0), false);

    const segment = entity.Segments[0];  // IfcArcIndex
    const index   = segment.value[0];    // ha de ser IfcPositiveInteger, no number

    console.log("\n--- Verificació Issue #1881 ---");
    console.log("Segment classe:  ", segment?.constructor?.name);     // IfcArcIndex
    console.log("Índex classe:    ", index?.constructor?.name);       // BEFORE: Number  | AFTER: IfcPositiveInteger
    console.log("Índex .type:     ", index?.type);                    // BEFORE: undefined| AFTER: 10
    console.log("Índex .name:     ", index?.name);                    // BEFORE: undefined| AFTER: IFCPOSITIVEINTEGER
    console.log("Índex .value:    ", index?.value ?? index);          // 1 en ambdós casos

    const ok = index?.constructor?.name === "IfcPositiveInteger" && index?.type === 10;
    console.log(ok ? "\n✓ FIX VERIFICAT: els índexs son IfcPositiveInteger"
                   : "\n✗ BUG PRESENT: els índexs son numbers bruts");

    api.CloseModel(modelID);
    api.Dispose();
}

test().catch(console.error);
