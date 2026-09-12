const { test } = require("@jest/globals");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { IfcAPI } = require(process.env.WEB_IFC_API || "../../dist/web-ifc-api-node.js");
test("shell with FaceSurface retains its bounded B-spline face", async () => {
  const api = new IfcAPI();
  await api.Init();
  const bytes = fs.readFileSync(new URL("./fixtures/face-surface/ifc4-surface-bspline.ifc", require("node:url").pathToFileURL(__filename).href));
  const m = api.OpenModel(bytes);
  try {
    const id = Number(bytes.toString().match(/#(\d+)=IFCBUILDINGELEMENTPROXY/)[1]);
    const mesh = api.GetFlatMesh(m, id);
    let area = 0;
    for (let k = 0; k < mesh.geometries.size(); k++) {
      const g = api.GetGeometry(m, mesh.geometries.get(k).geometryExpressID), v = api.GetVertexArray(g.GetVertexData(), g.GetVertexDataSize()), ix = api.GetIndexArray(g.GetIndexData(), g.GetIndexDataSize());
      for (let i = 0; i < ix.length; i += 3) {
        const [a, b, c] = Array.from(ix.slice(i, i + 3), (j) => Array.from(v.slice(j * 6, j * 6 + 3)));
        const u = b.map((x, j) => x - a[j]), w = c.map((x, j) => x - a[j]);
        area += Math.hypot(u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]) / 2;
      }
      g.delete();
    }
    assert.ok(Math.abs(area - 16) < 0.02, `area ${area}, expected 16 within 0.02 m2 tessellation allowance`);
  } finally {
    api.CloseModel(m);
  }
});

const source = fs.readFileSync(new URL("./fixtures/face-surface/ifc4-surface-bspline.ifc", require("node:url").pathToFileURL(__filename).href), "utf8");
test.each(["spline", "plane"].flatMap(surface => [true, false].flatMap(sameSense => [false, true].map(reverseBound => [surface, sameSense, reverseBound]))).concat([["direct",true,false],["direct",false,false],["swapped-uv",true,false],["swapped-uv",false,false]]))(
  "%s face: SameSense=%s, reversed bound=%s", async (surface, sameSense, reverseBound) => {
    const api=new IfcAPI();await api.Init();
    let text=source.replace("#24=IFCFACESURFACE((#23),#17,.T.);",`#24=IFCFACESURFACE((#23),#17,.${sameSense ? "T" : "F"}.);`);
    if(surface==="plane") text=text.replace(/#17=IFCBSPLINESURFACEWITHKNOTS\([^\n]+/,"#17=IFCPLANE(#7);");
    if(surface==="direct") text=text.replace("IFCSHAPEREPRESENTATION(#8,'Body','SurfaceModel',(#26))","IFCTOPOLOGYREPRESENTATION(#8,'Body','Face',(#24))");
    if(surface==="swapped-uv") text=text.replace("((#13,#14),(#15,#16))","((#13,#15),(#14,#16))");
    if(reverseBound) text=text.replace("IFCFACEOUTERBOUND(#22,.T.)","IFCFACEOUTERBOUND(#22,.F.)");
    const model=api.OpenModel(new TextEncoder().encode(text));
    try {
      const mesh=api.GetFlatMesh(model,32);let area=0;
      for(let k=0;k<mesh.geometries.size();k++) {
        const part=mesh.geometries.get(k),g=api.GetGeometry(model,part.geometryExpressID);
        const v=api.GetVertexArray(g.GetVertexData(),g.GetVertexDataSize()),ix=api.GetIndexArray(g.GetIndexData(),g.GetIndexDataSize()),t=part.flatTransformation;
        for(let i=0;i<ix.length;i+=3) {
          const [a,b,c]=Array.from(ix.slice(i,i+3),j=>Array.from(v.slice(j*6,j*6+3)));
          const u=b.map((x,j)=>x-a[j]),q=c.map((x,j)=>x-a[j]);
          const n=[u[1]*q[2]-u[2]*q[1],u[2]*q[0]-u[0]*q[2],u[0]*q[1]-u[1]*q[0]];
          area+=Math.hypot(...n)/2;
          // Viewer +Y is IFC +Z. Swapping U/V reverses the parametric normal.
          assert.ok((n[0]*t[1]+n[1]*t[5]+n[2]*t[9])*(sameSense?1:-1)*(surface==="swapped-uv"?-1:1)>0);
          for(const j of ix.slice(i,i+3)) assert.ok(n.reduce((sum,x,d)=>sum+x*v[j*6+3+d],0)>0,"stored normals follow winding");
        }
        g.delete();
      }
      assert.ok(Math.abs(area-16)<0.02);
    } finally {api.CloseModel(model);}
  });
test.each([true,false])("cylindrical face normals follow SameSense=%s", async sameSense => {
  const api=new IfcAPI();await api.Init();
  let text=source.replace(/#17=IFCBSPLINESURFACEWITHKNOTS\([^\n]+/,"#17=IFCCYLINDRICALSURFACE(#7,2.);")
    .replace("#24=IFCFACESURFACE((#23),#17,.T.);",`#24=IFCFACESURFACE((#23),#17,.${sameSense?"T":"F"}.);`);
  for(const [id,point] of [[18,"2.,0.,0."],[19,"0.,2.,0."],[20,"0.,2.,4."],[21,"2.,0.,4."]])
    text=text.replace(new RegExp(`#${id}=IFCCARTESIANPOINT\\([^\\n]+`),`#${id}=IFCCARTESIANPOINT((${point}));`);
  // Use curved edges on the cylinder; straight polyloop chords are not surface bounds.
  text=text.replace("#22=IFCPOLYLOOP((#18,#19,#20,#21));", `
#40=IFCVERTEXPOINT(#18); #41=IFCVERTEXPOINT(#19); #42=IFCVERTEXPOINT(#20); #43=IFCVERTEXPOINT(#21);
#44=IFCCIRCLE(#7,2.); #45=IFCCARTESIANPOINT((0.,0.,4.)); #46=IFCAXIS2PLACEMENT3D(#45,$,$); #47=IFCCIRCLE(#46,2.);
#48=IFCPOLYLINE((#19,#20)); #49=IFCPOLYLINE((#21,#18));
#50=IFCEDGECURVE(#40,#41,#44,.T.); #51=IFCEDGECURVE(#41,#42,#48,.T.);
#52=IFCEDGECURVE(#43,#42,#47,.T.); #53=IFCEDGECURVE(#43,#40,#49,.T.);
#54=IFCORIENTEDEDGE(*,*,#50,.T.); #55=IFCORIENTEDEDGE(*,*,#51,.T.); #56=IFCORIENTEDEDGE(*,*,#52,.F.); #57=IFCORIENTEDEDGE(*,*,#53,.T.);
#22=IFCEDGELOOP((#54,#55,#56,#57));`);
  const model=api.OpenModel(new TextEncoder().encode(text),{CIRCLE_SEGMENTS:96});
  try {
    const mesh=api.GetFlatMesh(model,32);let area=0;
    for(let k=0;k<mesh.geometries.size();k++) {
      const part=mesh.geometries.get(k),g=api.GetGeometry(model,part.geometryExpressID),t=part.flatTransformation;
      const v=api.GetVertexArray(g.GetVertexData(),g.GetVertexDataSize()),ix=api.GetIndexArray(g.GetIndexData(),g.GetIndexDataSize());
      for(let i=0;i<ix.length;i+=3) {
        const [a,b,c]=Array.from(ix.slice(i,i+3),j=>[0,1,2].map(d=>v[j*6]*t[d]+v[j*6+1]*t[4+d]+v[j*6+2]*t[8+d]+t[12+d]));
        const u=b.map((x,j)=>x-a[j]),q=c.map((x,j)=>x-a[j]);
        const n=[u[1]*q[2]-u[2]*q[1],u[2]*q[0]-u[0]*q[2],u[0]*q[1]-u[1]*q[0]];
        assert.ok((n[0]*(a[0]+b[0]+c[0])+n[2]*(a[2]+b[2]+c[2]))*(sameSense?1:-1)>0);
        area+=Math.hypot(...n)/2;
      }
      g.delete();
    }
    assert.ok(Math.abs(area-4*Math.PI)<0.002, `cylindrical area ${area}, expected ${4*Math.PI}`);
  } finally {api.CloseModel(model);}
});
