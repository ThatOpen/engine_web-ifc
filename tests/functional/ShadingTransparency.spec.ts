import * as WebIFC from '../../dist/web-ifc-api-node.js';
import {IFCBUILDINGELEMENTPROXY} from '../../dist/web-ifc-api-node.js';

import type {IfcAPI} from '../../dist/web-ifc-api-node.js';

const SHADING_TRANSPARENCY_IFC4 = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [CoordinationView]'),'2;1');
FILE_NAME('','',(''),(''),'','','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#1=IFCCARTESIANPOINT((0.,0.,0.));
#2=IFCDIRECTION((0.,0.,1.));
#3=IFCDIRECTION((1.,0.,0.));
#4=IFCAXIS2PLACEMENT3D(#1,#2,#3);
#5=IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.0000000000000001E-05,#4,$);
#6=IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.);
#7=IFCUNITASSIGNMENT((#6));
#8=IFCPROJECT('1x7xm5lGf9o8yVrMp7_oY3',$,'Shading transparency repro',$,$,$,$,(#5),#7);
#9=IFCAXIS2PLACEMENT3D(#1,$,$);
#10=IFCLOCALPLACEMENT($,#9);
#11=IFCSITE('2zqnrS0557_gMa3Jzg7KCA',$,'Site',$,$,#10,$,$,.ELEMENT.,$,$,$,$,$);
#12=IFCRELAGGREGATES('3bVA_CHvz6GQIw9DLQws4X',$,$,$,#8,(#11));
#13=IFCCOLOURRGB($,1.,0.,0.);
#14=IFCSURFACESTYLESHADING(#13,0.80000000000000004);
#15=IFCSURFACESTYLE('shading with transparency',.BOTH.,(#14));
#16=IFCSURFACESTYLERENDERING(#13,0.80000000000000004,$,$,$,$,$,$,.NOTDEFINED.);
#17=IFCSURFACESTYLE('rendering with transparency',.BOTH.,(#16));
#18=IFCRECTANGLEPROFILEDEF(.AREA.,$,$,1.,1.);
#19=IFCDIRECTION((0.,0.,1.));
#20=IFCEXTRUDEDAREASOLID(#18,$,#19,1.);
#21=IFCSTYLEDITEM(#20,(#15),$);
#22=IFCSHAPEREPRESENTATION(#5,'Body','SweptSolid',(#20));
#23=IFCPRODUCTDEFINITIONSHAPE($,$,(#22));
#24=IFCCARTESIANPOINT((0.,0.,0.));
#25=IFCAXIS2PLACEMENT3D(#24,$,$);
#26=IFCLOCALPLACEMENT(#10,#25);
#27=IFCBUILDINGELEMENTPROXY('1$N9WPo3bE6wRF4P$YuzAX',$,'shading box',$,$,#26,#23,$,$);
#28=IFCRECTANGLEPROFILEDEF(.AREA.,$,$,1.,1.);
#29=IFCDIRECTION((0.,0.,1.));
#30=IFCEXTRUDEDAREASOLID(#28,$,#29,1.);
#31=IFCSTYLEDITEM(#30,(#17),$);
#32=IFCSHAPEREPRESENTATION(#5,'Body','SweptSolid',(#30));
#33=IFCPRODUCTDEFINITIONSHAPE($,$,(#32));
#34=IFCCARTESIANPOINT((3.,0.,0.));
#35=IFCAXIS2PLACEMENT3D(#34,$,$);
#36=IFCLOCALPLACEMENT(#10,#35);
#37=IFCBUILDINGELEMENTPROXY('0wKFqjAy15eQieFk7gc1RM',$,'rendering box',$,$,#36,#33,$,$);
#38=IFCRELCONTAINEDINSPATIALSTRUCTURE('1EGVveoy18y8ZUzzCxJAQ7',$,$,$,(#27,#37),#11);
ENDSEC;
END-ISO-10303-21;
`;

const SHADING_IFC2X3 = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [CoordinationView]'),'2;1');
FILE_NAME('','',(''),(''),'','','');
FILE_SCHEMA(('IFC2X3'));
ENDSEC;
DATA;
#1=IFCCARTESIANPOINT((0.,0.,0.));
#2=IFCDIRECTION((0.,0.,1.));
#3=IFCDIRECTION((1.,0.,0.));
#4=IFCAXIS2PLACEMENT3D(#1,#2,#3);
#5=IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.0000000000000001E-05,#4,$);
#6=IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.);
#7=IFCUNITASSIGNMENT((#6));
#8=IFCPERSON($,$,$,$,$,$,$,$);
#9=IFCORGANIZATION($,'org',$,$,$);
#10=IFCPERSONANDORGANIZATION(#8,#9,$);
#11=IFCORGANIZATION($,'org',$,$,$);
#12=IFCAPPLICATION(#11,'1','app','app');
#13=IFCOWNERHISTORY(#10,#12,$,.ADDED.,$,$,$,0);
#14=IFCPROJECT('1pHRBOsmT8txw9xBa7JqLd',#13,'IFC2X3 shading repro',$,$,$,$,(#5),#7);
#15=IFCAXIS2PLACEMENT3D(#1,$,$);
#16=IFCLOCALPLACEMENT($,#15);
#17=IFCSITE('29FHeh_Yr3af5Ouh7msCzT',#13,'Site',$,$,#16,$,$,.ELEMENT.,$,$,$,$,$);
#18=IFCRELAGGREGATES('0$9Z_B8ATFjPYckHxMI5Yk',#13,$,$,#14,(#17));
#19=IFCCOLOURRGB($,0.,1.,0.);
#20=IFCSURFACESTYLESHADING(#19);
#21=IFCSURFACESTYLE('plain IFC2X3 shading',.BOTH.,(#20));
#22=IFCCARTESIANPOINT((0.,0.));
#23=IFCAXIS2PLACEMENT2D(#22,$);
#24=IFCRECTANGLEPROFILEDEF(.AREA.,$,#23,1.,1.);
#25=IFCAXIS2PLACEMENT3D(#1,$,$);
#26=IFCDIRECTION((0.,0.,1.));
#27=IFCEXTRUDEDAREASOLID(#24,#25,#26,1.);
#28=IFCPRESENTATIONSTYLEASSIGNMENT((#21));
#29=IFCSTYLEDITEM(#27,(#28),$);
#30=IFCSHAPEREPRESENTATION(#5,'Body','SweptSolid',(#27));
#31=IFCPRODUCTDEFINITIONSHAPE($,$,(#30));
#32=IFCAXIS2PLACEMENT3D(#1,$,$);
#33=IFCLOCALPLACEMENT(#16,#32);
#34=IFCBUILDINGELEMENTPROXY('2RLsNYqGPD4wePf6E53no2',#13,'ifc2x3 shading box',$,$,#33,#31,$,$);
#35=IFCRELCONTAINEDINSPATIALSTRUCTURE('2DCzxJhfT8GvuOYkp9pSos',#13,$,$,(#34),#17);
ENDSEC;
END-ISO-10303-21;
`;

let ifcApi: IfcAPI;

function colorOf(modelID: number, nameFragment: string) {
    const ids = ifcApi.GetLineIDsWithType(modelID, IFCBUILDINGELEMENTPROXY);
    for (let i = 0; i < ids.size(); i++) {
        const id = ids.get(i);
        if (!ifcApi.GetLine(modelID, id).Name.value.includes(nameFragment)) continue;
        return ifcApi.GetFlatMesh(modelID, id).geometries.get(0).color;
    }
    throw new Error(`no element matching "${nameFragment}"`);
}

function open(content: string): number {
    return ifcApi.OpenModel(new TextEncoder().encode(content));
}

beforeAll(async () => {
    ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();
    ifcApi.SetLogLevel(WebIFC.LogLevel.LOG_LEVEL_OFF);
});

describe('IfcSurfaceStyleShading transparency', () => {
    test('IFC4 plain Shading Transparency is applied to the mesh color alpha', () => {
        const modelID = open(SHADING_TRANSPARENCY_IFC4);
        const color = colorOf(modelID, 'shading box');
        expect(color.w).toBeCloseTo(0.2, 5);
        ifcApi.CloseModel(modelID);
    });

    test('IFC4 Rendering Transparency keeps working the same way', () => {
        const modelID = open(SHADING_TRANSPARENCY_IFC4);
        const color = colorOf(modelID, 'rendering box');
        expect(color.w).toBeCloseTo(0.2, 5);
        ifcApi.CloseModel(modelID);
    });

    test('IFC2X3 Shading (no Transparency attribute) stays opaque', () => {
        const modelID = open(SHADING_IFC2X3);
        const color = colorOf(modelID, 'ifc2x3 shading box');
        expect(color.w).toBeCloseTo(1.0, 5);
        ifcApi.CloseModel(modelID);
    });
});
