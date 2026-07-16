// validate.mjs — compile-free WASM port of validate.cpp's intrinsic validators.
// Runs against a prebuilt web-ifc npm release. Emits the SAME JSON schema as the
// native validate.cpp so tests/regression/driver/compare.py works unchanged.
//
// Usage: node validate.mjs <path-to-web-ifc-module> <model.ifc> <out.json> <label>
//
// Fidelity notes vs the native tool:
//  - WASM vertex data is float32 (6 floats/vertex). Native reads float64. So absolute
//    magnitudes match the kernel real users run; the epsilon floor is float32-bound.
//  - Topology is analysed per placed-geometry in LOCAL coords (GetVertexArray), exactly
//    like AnalysePart(geom.GetPoint) natively — placement is not applied for topology.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const [modArg, modelPath, outPath, label = ''] = process.argv.slice(2);
const modPath = modArg.startsWith('file:') ? modArg : pathToFileURL(modArg).href;
let WebIFC = await import(modPath);
if (!WebIFC.IfcAPI && WebIFC.default) WebIFC = WebIFC.default;
const api = new WebIFC.IfcAPI();
await api.Init();
const nameOf = (tc) => {
  try { if (typeof api.GetNameFromTypeCode === 'function') return api.GetNameFromTypeCode(tc); } catch {}
  return 'TYPE_' + tc;
};

const EMPTY = new Set(['IFCOPENINGELEMENT','IFCSPACE','IFCANNOTATION','IFCGRID','IFCVIRTUALELEMENT']);

function analysePart(vertsF32, idxU32) {
  // vertsF32: 6 floats/vertex (pos+normal). idxU32: triangle indices into vertices.
  const nP = vertsF32.length / 6;
  const t = {triangles:0,weldedVerts:0,nakedEdges:0,nonManifoldEdges:0,degenerate:0,
             duplicates:0,slivers:0,components:0,windingConsistent:true,
             nakedBoundaryClean:true,area:0,signedVolume:0,nanInf:0};
  if (idxU32.length < 3) return t;
  let lo=[Infinity,Infinity,Infinity], hi=[-Infinity,-Infinity,-Infinity], anyFin=false;
  for (let i=0;i<nP;i++){
    const x=vertsF32[i*6],y=vertsF32[i*6+1],z=vertsF32[i*6+2];
    if(!isFinite(x)||!isFinite(y)||!isFinite(z)){t.nanInf++;continue;}
    lo[0]=Math.min(lo[0],x);lo[1]=Math.min(lo[1],y);lo[2]=Math.min(lo[2],z);
    hi[0]=Math.max(hi[0],x);hi[1]=Math.max(hi[1],y);hi[2]=Math.max(hi[2],z);anyFin=true;
  }
  if(!anyFin) return t;
  const diag=Math.hypot(hi[0]-lo[0],hi[1]-lo[1],hi[2]-lo[2]);
  const eps=Math.max(1e-12,diag*1e-7);
  const areaTol=Math.max(1e-24,diag*diag*1e-14);
  // weld
  const weld=new Map(), remap=new Int32Array(nP).fill(-1), W=[];
  for(let i=0;i<nP;i++){
    const x=vertsF32[i*6],y=vertsF32[i*6+1],z=vertsF32[i*6+2];
    if(!isFinite(x)||!isFinite(y)||!isFinite(z))continue;
    const k=Math.round(x/eps)+','+Math.round(y/eps)+','+Math.round(z/eps);
    let id=weld.get(k);
    if(id===undefined){id=W.length;weld.set(k,id);W.push([x,y,z]);}
    remap[i]=id;
  }
  t.weldedVerts=W.length;
  const parent=new Int32Array(W.length);for(let i=0;i<W.length;i++)parent[i]=i;
  const find=(x)=>{while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;};
  const uni=(a,b)=>{const ra=find(a),rb=find(b);if(ra!==rb)parent[ra]=rb;};
  const edgeUse=new Map(), dirUse=new Set(), triSeen=new Map();
  const tris=[];
  const ek=(a,b)=>a<b?a+':'+b:b+':'+a;
  for(let f=0;f+2<idxU32.length;f+=3){
    let a=remap[idxU32[f]],b=remap[idxU32[f+1]],c=remap[idxU32[f+2]];
    if(a<0||b<0||c<0)continue;
    const pa=W[a],pb=W[b],pc=W[c];
    const ux=pb[0]-pa[0],uy=pb[1]-pa[1],uz=pb[2]-pa[2];
    const vx=pc[0]-pa[0],vy=pc[1]-pa[1],vz=pc[2]-pa[2];
    const cx=uy*vz-uz*vy,cy=uz*vx-ux*vz,cz=ux*vy-uy*vx;
    const area2=Math.hypot(cx,cy,cz);
    if(a===b||b===c||a===c||area2<areaTol){t.degenerate++;continue;}
    t.triangles++;t.area+=0.5*area2;
    t.signedVolume+=(pa[0]*(pb[1]*pc[2]-pb[2]*pc[1])+pa[1]*(pb[2]*pc[0]-pb[0]*pc[2])+pa[2]*(pb[0]*pc[1]-pb[1]*pc[0]))/6;
    const sk=[a,b,c].sort((x,y)=>x-y).join(':');
    triSeen.set(sk,(triSeen.get(sk)||0)+1);if(triSeen.get(sk)>1)t.duplicates++;
    tris.push([a,b,c]);
    for(const [p,q] of [[a,b],[b,c],[c,a]]){edgeUse.set(ek(p,q),(edgeUse.get(ek(p,q))||0)+1);
      const d=p+'>'+q;if(dirUse.has(d))t.windingConsistent=false;else dirUse.add(d);}
    uni(a,b);uni(b,c);
  }
  const nakedDeg=new Map();
  for(const [e,cnt] of edgeUse){if(cnt===1){t.nakedEdges++;const[p,q]=e.split(':').map(Number);
      nakedDeg.set(p,(nakedDeg.get(p)||0)+1);nakedDeg.set(q,(nakedDeg.get(q)||0)+1);}
    else if(cnt>2)t.nonManifoldEdges++;}
  for(const [,deg] of nakedDeg)if(deg!==2){t.nakedBoundaryClean=false;break;}
  for(const [a,b,c] of tris){let n=0;if(edgeUse.get(ek(a,b))===1)n++;if(edgeUse.get(ek(b,c))===1)n++;if(edgeUse.get(ek(c,a))===1)n++;if(n>1)t.slivers++;}
  const roots=new Set();for(const [a] of tris)roots.add(find(a));t.components=roots.size;
  return t;
}

// ---- run ----
const buf=readFileSync(modelPath);
const modelID=api.OpenModel(new Uint8Array(buf));

// coverage: expected set via representation scan
const meshed=new Map(); // expressID -> element record
const rows=[];
api.StreamAllMeshes(modelID,(flatMesh)=>{
  const eid=flatMesh.expressID;
  const geos=flatMesh.geometries;
  const rec={expressID:eid,triangles:0,weldedVerts:0,nanInf:0,nakedEdges:0,nonManifoldEdges:0,
             degenerate:0,duplicates:0,slivers:0,components:0,windingConsistent:true,
             nakedBoundaryClean:true,signedVolume:0,area:0,partCount:geos.size(),
             declaredVoids:0,voidsWithCutEvidence:0};
  for(let i=0;i<geos.size();i++){
    const pg=geos.get(i);
    const g=api.GetGeometry(modelID,pg.geometryExpressID);
    const v=api.GetVertexArray(g.GetVertexData(),g.GetVertexDataSize());
    const ix=api.GetIndexArray(g.GetIndexData(),g.GetIndexDataSize());
    const t=analysePart(v,ix);
    rec.triangles+=t.triangles;rec.weldedVerts+=t.weldedVerts;rec.nanInf+=t.nanInf;
    rec.nakedEdges+=t.nakedEdges;rec.nonManifoldEdges+=t.nonManifoldEdges;
    rec.degenerate+=t.degenerate;rec.duplicates+=t.duplicates;rec.slivers+=t.slivers;
    rec.components+=t.components;rec.area+=t.area;rec.signedVolume+=t.signedVolume;
    if(!t.windingConsistent)rec.windingConsistent=false;
    if(!t.nakedBoundaryClean)rec.nakedBoundaryClean=false;
    g.delete();
  }
  rec.hasGeometry=rec.triangles>0;
  meshed.set(eid,rec);
});

// expected = geometric elements (IfcElement + subtypes) via ONE fast type query.
// (The old per-line GetLine scan was O(all lines) and stalled on big models.)
let expectedIDs=new Set();
try{
  const code=WebIFC.IFCELEMENT;
  if(code!==undefined){
    const v=api.GetLineIDsWithType(modelID,code,true); // includeInherited
    for(let i=0;i<v.size();i++)expectedIDs.add(v.get(i));
  }
}catch{}
if(expectedIDs.size===0){for(const id of meshed.keys())expectedIDs.add(id);} // fallback: coverage==meshed-count
const seen=new Set();
for(const id of expectedIDs){
  let tname;try{tname=nameOf(api.GetLineType(modelID,id));}catch{continue;}
  if(EMPTY.has(tname))continue;
  seen.add(id);
  const rec=meshed.get(id);
  if(rec){rec.ifcType=tname;rec.expected=true;rows.push(rec);}
  else rows.push({expressID:id,ifcType:tname,expected:true,hasGeometry:false,triangles:0,
    weldedVerts:0,nanInf:0,nakedEdges:0,nonManifoldEdges:0,degenerate:0,duplicates:0,
    slivers:0,components:0,windingConsistent:true,nakedBoundaryClean:true,signedVolume:0,
    area:0,partCount:0,declaredVoids:0,voidsWithCutEvidence:0});
}
for(const [id,rec] of meshed){ // meshed but not in expected set: still count its geometry/topology
  if(seen.has(id))continue;
  let tname;try{tname=nameOf(api.GetLineType(modelID,id));}catch{tname='UNKNOWN';}
  rec.ifcType=tname;rec.expected=false;rows.push(rec);
}

// derived verdict fields per element
for(const r of rows){
  r.coverageMiss=!!r.expected&&!r.hasGeometry;
  r.shattered=r.hasGeometry&&r.partCount>0&&r.components>r.partCount;
  r.torn=r.hasGeometry&&r.nakedEdges>0&&(!r.nakedBoundaryClean||r.slivers>0);
  r.suspectNoOp=r.declaredVoids>0&&r.voidsWithCutEvidence<r.declaredVoids;
}
rows.sort((a,b)=>a.expressID-b.expressID);

// summary
const cov={};let expTot=0,meshTot=0,nMiss=0,tTri=0,tNaked=0,tNonMan=0,tDup=0,tDegen=0,tNaN=0,tSliv=0;
let nTorn=0,nShat=0,nInv=0,nBadW=0,nNoOp=0;
for(const r of rows){
  if(r.expected){const c=cov[r.ifcType]||(cov[r.ifcType]={expected:0,meshed:0,missing:[]});
    c.expected++;expTot++;if(r.hasGeometry){c.meshed++;meshTot++;}else{c.missing.push(r.expressID);nMiss++;}}
  tTri+=r.triangles;tNaked+=r.nakedEdges;tNonMan+=r.nonManifoldEdges;tDup+=r.duplicates;
  tDegen+=r.degenerate;tNaN+=r.nanInf;tSliv+=r.slivers;
  if(r.torn)nTorn++;if(r.shattered)nShat++;
  if(r.hasGeometry&&r.nakedEdges===0&&r.nonManifoldEdges===0&&r.signedVolume<0)nInv++;
  if(!r.windingConsistent)nBadW++;if(r.suspectNoOp)nNoOp++;
}
const out={meta:{model:modelPath,commit:label,tool:'validate-wasm',
    webifcVersion:(WebIFC.Version||'?')},
  summary:{tier1_coverage:{expected:expTot,meshed:meshTot,missing:nMiss,
      perType:Object.entries(cov).map(([k,c])=>({ifcType:k,expected:c.expected,meshed:c.meshed,
        pct:c.expected?c.meshed/c.expected:1,missingIds:c.missing}))},
    tier2_hardInvalidity:{nanInfVertices:tNaN,elementsInvertedVolume:nInv},
    tier3_topology:{elementsTorn:nTorn,elementsShattered:nShat,elementsInconsistentWinding:nBadW,
      nakedEdges:tNaked,nonManifoldEdges:tNonMan,duplicateTriangles:tDup,degenerateTriangles:tDegen,slivers:tSliv},
    tier4_fidelity:{elementsSuspectBooleanNoOp:nNoOp},totalTriangles:tTri},
  elements:rows};
writeFileSync(outPath,JSON.stringify(out,null,1));
console.log(`[wasm] ${label}: expected=${expTot} meshed=${meshTot} missing=${nMiss} tris=${tTri} torn=${nTorn} badWinding=${nBadW} nonManifold=${tNonMan}`);
api.CloseModel(modelID);
