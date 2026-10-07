const fs = require("node:fs");
const path = require("node:path");
const plain = fs.readFileSync(path.join(__dirname, "fixed_reference_swept_ifc4.ifc"), "utf8");
const typed = fs.readFileSync(path.join(__dirname, "fixed_reference_swept_ifc4x3.ifc"), "utf8");
module.exports = [
  ["ifc4", plain],
  ["ifc4x3", typed],
  ["omitted-params", plain.replace("#52,0.,1.5707963267949,#11", "#52,$,$,#11")],
  ["length-measures", typed.replace("#52,IFCPARAMETERVALUE(0.),IFCPARAMETERVALUE(1.5707963267949),#11", "#52,IFCLENGTHMEASURE(0.),IFCLENGTHMEASURE(3.1415926535898),#11")],
  ["scaled-reference", plain.replace("#11=IFCDIRECTION((0.,0.,1.))", "#11=IFCDIRECTION((0.,0.,1.E-8))")],
  ["offset-profile", plain.replace("#31=IFCCARTESIANPOINT((0.,0.))", "#31=IFCCARTESIANPOINT((0.03,-0.02))")],
  ["reversed-reference", plain.replace("#42=IFCFIXEDREFERENCESWEPTAREASOLID(#32,#13,#52,0.,1.5707963267949,#11)", "#54=IFCDIRECTION((0.,0.,-1.));\n#42=IFCFIXEDREFERENCESWEPTAREASOLID(#32,#13,#52,0.,1.5707963267949,#54)").replace("#31=IFCCARTESIANPOINT((0.,0.))", "#31=IFCCARTESIANPOINT((0.03,-0.02))")],
  ["tilted-reference", plain.replace("#42=IFCFIXEDREFERENCESWEPTAREASOLID(#32,#13,#52,0.,1.5707963267949,#11)", "#54=IFCDIRECTION((1.,0.,1.));\n#42=IFCFIXEDREFERENCESWEPTAREASOLID(#32,#13,#52,0.,1.5707963267949,#54)")],
  ["optional-placement", plain.replace("#42=IFCFIXEDREFERENCESWEPTAREASOLID(#32,#13,", "#42=IFCFIXEDREFERENCESWEPTAREASOLID(#32,$,")],
  ["translated-placement", plain.replace("#42=IFCFIXEDREFERENCESWEPTAREASOLID(#32,#13,", "#55=IFCCARTESIANPOINT((10.,20.,30.));\n#56=IFCAXIS2PLACEMENT3D(#55,#11,#12);\n#42=IFCFIXEDREFERENCESWEPTAREASOLID(#32,#56,")],
  ["hollow-profile", plain.replace("#32=IFCRECTANGLEPROFILEDEF(.AREA.,$,#30,0.2,0.1)", "#32=IFCRECTANGLEHOLLOWPROFILEDEF(.AREA.,$,#30,0.2,0.1,0.02,$,$)")],
  ["closed-circle", plain.replace("#42=IFCFIXEDREFERENCESWEPTAREASOLID(#32,#13,#52,0.,1.5707963267949,#11)", "#42=IFCFIXEDREFERENCESWEPTAREASOLID(#32,#13,#41,$,$,#11)")],
  ["straight-directrix", plain.replace("#42=IFCFIXEDREFERENCESWEPTAREASOLID(#32,#13,#52,0.,1.5707963267949,#11)", "#57=IFCCARTESIANPOINT((0.,0.,0.));\n#58=IFCCARTESIANPOINT((0.,2.,0.));\n#59=IFCPOLYLINE((#57,#58));\n#42=IFCFIXEDREFERENCESWEPTAREASOLID(#32,#13,#59,$,$,#11)")],
];
