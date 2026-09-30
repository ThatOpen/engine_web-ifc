import * as WebIFC from '../../dist/web-ifc-api-node.js';
import {IFCBUILDINGELEMENTPROXY} from '../../dist/web-ifc-api-node.js';

import type {IfcAPI} from '../../dist/web-ifc-api-node.js';

const TYPE_MATERIAL_IFC4 = `ISO-10303-21;
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
#8=IFCPROJECT('0Kq3wV8Lr1mBxYdT2uHc9f',$,'Type material repro',$,$,$,$,(#5),#7);
#9=IFCAXIS2PLACEMENT3D(#1,$,$);
#10=IFCLOCALPLACEMENT($,#9);
#11=IFCSITE('1Fh7Zs2Qp4eNwLxK8vRb3a',$,'Site',$,$,#10,$,$,.ELEMENT.,$,$,$,$,$);
#12=IFCRELAGGREGATES('2Gp9Yt3Rq5fOxMyL9wSc4b',$,$,$,#8,(#11));
#13=IFCCOLOURRGB($,1.,0.,0.);
#14=IFCSURFACESTYLESHADING(#13,$);
#15=IFCSURFACESTYLE('red',.BOTH.,(#14));
#16=IFCSTYLEDITEM($,(#15),$);
#17=IFCSTYLEDREPRESENTATION(#5,'Body',$,(#16));
#18=IFCMATERIAL('type material',$,$);
#19=IFCMATERIALDEFINITIONREPRESENTATION($,$,(#17),#18);
#20=IFCCOLOURRGB($,0.,0.,1.);
#21=IFCSURFACESTYLESHADING(#20,$);
#22=IFCSURFACESTYLE('blue',.BOTH.,(#21));
#23=IFCSTYLEDITEM($,(#22),$);
#24=IFCSTYLEDREPRESENTATION(#5,'Body',$,(#23));
#25=IFCMATERIAL('occurrence material',$,$);
#26=IFCMATERIALDEFINITIONREPRESENTATION($,$,(#24),#25);
#27=IFCBUILDINGELEMENTPROXYTYPE('3Hq0Zu4Sr6gPyNzM0xTd5c',$,'proxy type',$,$,$,$,$,$,.NOTDEFINED.);
#28=IFCRELASSOCIATESMATERIAL('0Ir1au5Ts7hQzOaN1yUe6d',$,$,$,(#27),#18);
#29=IFCRECTANGLEPROFILEDEF(.AREA.,$,#47,1.,1.);
#30=IFCEXTRUDEDAREASOLID(#29,#9,#2,1.);
#31=IFCSHAPEREPRESENTATION(#5,'Body','SweptSolid',(#30));
#32=IFCPRODUCTDEFINITIONSHAPE($,$,(#31));
#33=IFCLOCALPLACEMENT(#10,#9);
#34=IFCBUILDINGELEMENTPROXY('1Js2bv6Ut8iRaPbO2zVf7e',$,'typed box',$,$,#33,#32,$,$);
#35=IFCRECTANGLEPROFILEDEF(.AREA.,$,#47,1.,1.);
#36=IFCEXTRUDEDAREASOLID(#35,#9,#2,1.);
#37=IFCSHAPEREPRESENTATION(#5,'Body','SweptSolid',(#36));
#38=IFCPRODUCTDEFINITIONSHAPE($,$,(#37));
#39=IFCCARTESIANPOINT((3.,0.,0.));
#40=IFCAXIS2PLACEMENT3D(#39,$,$);
#41=IFCLOCALPLACEMENT(#10,#40);
#42=IFCBUILDINGELEMENTPROXY('2Kt3cw7Vu9jSbQcP3$Wg8f',$,'override box',$,$,#41,#38,$,$);
#43=IFCRELDEFINESBYTYPE('3Lu4dx8Wv0kTcRdQ4_Xh9g',$,$,$,(#34,#42),#27);
#44=IFCRELASSOCIATESMATERIAL('0Mv5ey9Xw1lUdSeR5aYi0h',$,$,$,(#42),#25);
#45=IFCRELCONTAINEDINSPATIALSTRUCTURE('1Nw6fz0Yx2mVeTfS6bZj1i',$,$,$,(#34,#42),#11);
#46=IFCCARTESIANPOINT((0.,0.));
#47=IFCAXIS2PLACEMENT2D(#46,$);
ENDSEC;
END-ISO-10303-21;
`;

const TYPE_MATERIAL_IFC2X3 = `ISO-10303-21;
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
#11=IFCAPPLICATION(#9,'1','app','app');
#12=IFCOWNERHISTORY(#10,#11,$,.ADDED.,$,$,$,0);
#13=IFCPROJECT('0Ox7gA1Zy3nWfUgT7cak2j',#12,'IFC2X3 type material repro',$,$,$,$,(#5),#7);
#14=IFCAXIS2PLACEMENT3D(#1,$,$);
#15=IFCLOCALPLACEMENT($,#14);
#16=IFCSITE('1Py8hB2az4oXgVhU8dbl3k',#12,'Site',$,$,#15,$,$,.ELEMENT.,$,$,$,$,$);
#17=IFCRELAGGREGATES('2Qz9iC3b_5pYhWiV9ecm4l',#12,$,$,#13,(#16));
#18=IFCCOLOURRGB($,0.,1.,0.);
#19=IFCSURFACESTYLESHADING(#18);
#20=IFCSURFACESTYLE('green',.BOTH.,(#19));
#21=IFCPRESENTATIONSTYLEASSIGNMENT((#20));
#22=IFCSTYLEDITEM($,(#21),$);
#23=IFCSTYLEDREPRESENTATION(#5,'Body',$,(#22));
#24=IFCMATERIAL('type material');
#25=IFCMATERIALDEFINITIONREPRESENTATION($,$,(#23),#24);
#26=IFCBUILDINGELEMENTPROXYTYPE('3R_0jD4c06qZiXjW0fdn5m',#12,'proxy type',$,$,$,$,$,$,.NOTDEFINED.);
#27=IFCRELASSOCIATESMATERIAL('0S$1kE5d17r_jYkX1gfo6n',#12,$,$,(#26),#24);
#28=IFCCARTESIANPOINT((0.,0.));
#29=IFCAXIS2PLACEMENT2D(#28,$);
#30=IFCRECTANGLEPROFILEDEF(.AREA.,$,#29,1.,1.);
#31=IFCEXTRUDEDAREASOLID(#30,#14,#2,1.);
#32=IFCSHAPEREPRESENTATION(#5,'Body','SweptSolid',(#31));
#33=IFCPRODUCTDEFINITIONSHAPE($,$,(#32));
#34=IFCLOCALPLACEMENT(#15,#14);
#35=IFCBUILDINGELEMENTPROXY('1T02lF6e28s0kZlY2hgp7o',#12,'ifc2x3 typed box',$,$,#34,#33,$,$);
#36=IFCRELDEFINESBYTYPE('2U13mG7f39t1l_mZ3ihq8p',#12,$,$,(#35),#26);
#37=IFCRELCONTAINEDINSPATIALSTRUCTURE('3V24nH8g4Au2m0n_4jir9q',#12,$,$,(#35),#16);
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

beforeAll(async () => {
    ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();
    ifcApi.SetLogLevel(WebIFC.LogLevel.LOG_LEVEL_OFF);
});

describe('Material colour inherited from the element type', () => {
    test('an occurrence without its own material uses the type material colour', () => {
        const modelID = ifcApi.OpenModel(new TextEncoder().encode(TYPE_MATERIAL_IFC4));
        const color = colorOf(modelID, 'typed box');
        expect([color.x, color.y, color.z]).toEqual([1, 0, 0]);
        ifcApi.CloseModel(modelID);
    });

    test('the occurrence material overrides the type material', () => {
        const modelID = ifcApi.OpenModel(new TextEncoder().encode(TYPE_MATERIAL_IFC4));
        const color = colorOf(modelID, 'override box');
        expect([color.x, color.y, color.z]).toEqual([0, 0, 1]);
        ifcApi.CloseModel(modelID);
    });

    test('IFC2X3 occurrence uses the type material colour', () => {
        const modelID = ifcApi.OpenModel(new TextEncoder().encode(TYPE_MATERIAL_IFC2X3));
        const color = colorOf(modelID, 'ifc2x3 typed box');
        expect([color.x, color.y, color.z]).toEqual([0, 1, 0]);
        ifcApi.CloseModel(modelID);
    });
});
