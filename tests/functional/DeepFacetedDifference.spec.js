const { test } = require('@jest/globals');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const apiPath = process.env.WEB_IFC_API || path.resolve(__dirname, '../../dist/web-ifc-api-node.js');
// A child-process deadline is essential: a JS timer cannot interrupt synchronous WASM.
const probe = `
const fs = require('node:fs'), path = require('node:path');
const { IfcAPI, LogLevel } = require(process.argv[1]);
(async () => {
  const api = new IfcAPI();
  api.SetWasmPath(path.dirname(process.argv[1]) + path.sep, true);
  await api.Init();
  api.SetLogLevel(LogLevel.LOG_LEVEL_ERROR);
  const bytes = fs.readFileSync(process.argv[2] === '-' ? 0 : process.argv[2]);
  const model = api.OpenModel(bytes, { COORDINATE_TO_ORIGIN: false });
  if (model < 0) throw new Error('model did not open');
  try {
    const enclosure = Number(process.argv[3] || 0), samples = [];
    const id = Number(bytes.toString().match(/#(\\d+)=IFCBUILDINGELEMENT(?:PROXY|PART)\\(/)[1]);
    const mesh = api.GetFlatMesh(model, id);
    const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    let triangles = 0, volume = 0, shiftedVolume = 0, area = 0;
    const areaVector = [0,0,0], moments = Array.from({length:3},()=>[0,0,0]);
    const signedVolume = (a,b,c) => (a[0]*(b[1]*c[2]-b[2]*c[1])-a[1]*(b[0]*c[2]-b[2]*c[0])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6;
    for (let k = 0; k < mesh.geometries.size(); k++) {
      const placed = mesh.geometries.get(k), t = placed.flatTransformation;
      const g = api.GetGeometry(model, placed.geometryExpressID);
      const vertices = api.GetVertexArray(g.GetVertexData(), g.GetVertexDataSize());
      const indices = api.GetIndexArray(g.GetIndexData(), g.GetIndexDataSize());
      if (![...vertices].every(Number.isFinite)) throw new Error('non-finite vertex');
      const point = j => {
        const [x,y,z] = [vertices[j*6], vertices[j*6+1], vertices[j*6+2]];
        return [t[0]*x+t[4]*y+t[8]*z+t[12], t[1]*x+t[5]*y+t[9]*z+t[13], t[2]*x+t[6]*y+t[10]*z+t[14]];
      };
      for (let i = 0; i < indices.length; i += 3) {
        const [a,b,c] = [point(indices[i]), point(indices[i+1]), point(indices[i+2])];
        if (enclosure) samples.push(a.map((v,j)=>(v+b[j]+c[j])/3),
          a.map((v,j)=>(v+b[j])/2), b.map((v,j)=>(v+c[j])/2), c.map((v,j)=>(v+a[j])/2));
        for (const p of [a,b,c]) for (let axis = 0; axis < 3; axis++) {
          lo[axis] = Math.min(lo[axis], p[axis]); hi[axis] = Math.max(hi[axis], p[axis]);
        }
        volume += signedVolume(a,b,c);
        shiftedVolume += signedVolume(...[a,b,c].map(p => p.map((v,j) => v-[10,-20,5][j])));
        const u=b.map((v,j)=>v-a[j]), w=c.map((v,j)=>v-a[j]);
        const faceArea = [u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]].map(v=>v/2);
        area += Math.hypot(...faceArea);
        for(let row=0;row<3;row++) {
          areaVector[row]+=faceArea[row];
          for(let col=0;col<3;col++) moments[row][col]+=faceArea[row]*(a[col]+b[col]+c[col])/3;
        }
        triangles++;
      }
      g.delete();
    }
    let outsideSamples = 0, outsideExamples = [];
    if (enclosure) {
      const source = [], base = api.GetFlatMesh(model, enclosure);
      for (let k=0; k<base.geometries.size(); k++) {
        const placed=base.geometries.get(k), t=placed.flatTransformation;
        const g=api.GetGeometry(model,placed.geometryExpressID);
        const v=api.GetVertexArray(g.GetVertexData(),g.GetVertexDataSize());
        const indices=api.GetIndexArray(g.GetIndexData(),g.GetIndexDataSize());
        const point=j=>{const x=v[j*6],y=v[j*6+1],z=v[j*6+2];return [t[0]*x+t[4]*y+t[8]*z+t[12],t[1]*x+t[5]*y+t[9]*z+t[13],t[2]*x+t[6]*y+t[10]*z+t[14]];};
        for(let i=0;i<indices.length;i+=3)source.push([point(indices[i]),point(indices[i+1]),point(indices[i+2])]);
        g.delete();
      }
      const sub=(a,b)=>a.map((v,j)=>v-b[j]);
      const dot=(a,b)=>a.reduce((s,v,j)=>s+v*b[j],0);
      const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
      // Allow 1 mm of existing tessellation/refit noise; the regression added
      // cutter faces centimetres outside the concave source, despite matching its AABB.
      const tolerance=1e-3, direction=[0.713,0.379,0.593];
      // Independent enclosure oracle: ray parity against the original closed extrusion.
      // Deduplicate hits on shared edges; allow float-cache rounding on its boundary.
      const contains=p=>{
        const hits=[];
        for(const [a,b,c] of source) {
          const u=sub(b,a),v=sub(c,a),n=cross(u,v),length=Math.hypot(...n);
          if(!length)continue;
          const from=sub(p,a),distance=dot(from,n)/length;
          if(Math.abs(distance)<=tolerance) {
            const unit=n.map(x=>x/length),q=p.map((x,j)=>x-distance*unit[j]);
            if([[a,b],[b,c],[c,a]].every(([s,e])=>{
              const edge=sub(e,s);return dot(cross(edge,sub(q,s)),unit)>=-tolerance*Math.hypot(...edge);
            }))return true;
          }
          const h=cross(direction,v),det=dot(u,h);
          if(Math.abs(det)<1e-14)continue;
          const s=dot(from,h)/det,q=cross(from,u),t=dot(direction,q)/det;
          if(s>=-1e-12&&t>=-1e-12&&s+t<=1+1e-12) {
            const travel=dot(v,q)/det;if(travel>0)hits.push(travel);
          }
        }
        hits.sort((a,b)=>a-b);
        return hits.filter((v,i)=>!i||Math.abs(v-hits[i-1])>tolerance).length%2===1;
      };
      const outside=samples.filter(p=>!contains(p));
      outsideSamples=outside.length; outsideExamples=outside.slice(0,5);
    }
    const areaResidual=Math.hypot(...areaVector);
    const momentResidual=Math.max(...moments.flatMap((row,i)=>row.map((v,j)=>Math.abs(v-(i===j?volume:0)))));
    console.log('METRICS ' + JSON.stringify({ triangles, volume, shiftedVolume, area, areaResidual, momentResidual, lo, hi, outsideSamples, outsideExamples }));
  } finally { api.Dispose(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
`;

function measure(file, input, timeout = 10000, enclosure = 0) {
  const result = spawnSync(process.execPath, ['-e', probe, apiPath, file, String(enclosure)], {
    input, timeout, maxBuffer: 1024 * 1024, encoding: 'utf8',
  });
  assert.equal(result.error, undefined, `conversion exceeded ${timeout} ms: ${result.error}`);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout + result.stderr, /No bound found|bool aborted|CSG .* threw|RuntimeError|Aborted\(/);
  const line = result.stdout.split('\n').find(line => line.startsWith('METRICS '));
  assert.ok(line, result.stdout);
  return JSON.parse(line.slice(8));
}

function notchedBlock(offset, mixed, internalSegments = 0) {
  const lines = [];
  const add = text => { lines.push(`#${lines.length+1}=${text};`); return lines.length; };
  const point = p => add(`IFCCARTESIANPOINT((${p.map((v,j) => v+offset[j]).join(',')}))`);
  const placement = p => add(`IFCAXIS2PLACEMENT3D(#${point(p)},$,$)`);
  const zero = add('IFCCARTESIANPOINT((0.,0.,0.))');
  const origin = add(`IFCAXIS2PLACEMENT3D(#${zero},$,$)`);
  const context = add(`IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-7,#${origin},$)`);
  const length = add('IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.)');
  const units = add(`IFCUNITASSIGNMENT((#${length}))`);
  add(`IFCPROJECT('0000000000000000000001',$,'Deep cut regression',$,$,$,$,(#${context}),#${units})`);
  const extrude = (lo,hi) => {
    const profile = add(`IFCRECTANGLEPROFILEDEF(.AREA.,$,$,${hi[0]-lo[0]},${hi[1]-lo[1]})`);
    const position = placement([(lo[0]+hi[0])/2,(lo[1]+hi[1])/2,lo[2]]);
    const direction = add('IFCDIRECTION((0.,0.,1.))');
    return add(`IFCEXTRUDEDAREASOLID(#${profile},#${position},#${direction},${hi[2]-lo[2]})`);
  };
  const brep = (lo,hi,segments=1) => {
    const corners = [[lo[0],lo[1],lo[2]],[hi[0],lo[1],lo[2]],[hi[0],hi[1],lo[2]],[lo[0],hi[1],lo[2]],
      [lo[0],lo[1],hi[2]],[hi[0],lo[1],hi[2]],[hi[0],hi[1],hi[2]],[lo[0],hi[1],hi[2]]];
    const faces = [];
    for(const indices of [[0,3,2,1],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]]) {
      const [a,b,,d]=indices.map(i=>corners[i]);
      const grid=Array.from({length:segments+1},(_,i)=>Array.from({length:segments+1},(_,j)=>
        point(a.map((v,k)=>v+(b[k]-v)*i/segments+(d[k]-v)*j/segments))));
      for(let i=0;i<segments;i++)for(let j=0;j<segments;j++) {
      const vertices=[grid[i][j],grid[i+1][j],grid[i+1][j+1],grid[i][j+1]];
      const loop = add(`IFCPOLYLOOP((${vertices.map(id=>'#'+id).join(',')}))`);
      const bound = add(`IFCFACEOUTERBOUND(#${loop},.T.)`);
      faces.push(add(`IFCFACE((#${bound}))`));
      }
    }
    const shell = add(`IFCCLOSEDSHELL((${faces.map(id=>'#'+id).join(',')}))`);
    return add(`IFCFACETEDBREP(#${shell})`);
  };
  let body = extrude([0,0,0],[10,2,2]);
  if(internalSegments) {
    const cutter=brep([4,0.5,0.5],[6,1.5,1.5],internalSegments);
    body=add(`IFCBOOLEANRESULT(.DIFFERENCE.,#${body},#${cutter})`);
  } else for (let i = 0; i < 9; i++) {
    const cutter = (mixed && i % 2 ? extrude : brep)([i+0.5,0.5,0.5],[i+1,1.5,2.5]);
    body = add(`IFCBOOLEANRESULT(.DIFFERENCE.,#${body},#${cutter})`);
  }
  const representation = add(`IFCSHAPEREPRESENTATION(#${context},'Body','CSG',(#${body}))`);
  const shape = add(`IFCPRODUCTDEFINITIONSHAPE($,$,(#${representation}))`);
  add(`IFCBUILDINGELEMENTPROXY('0000000000000000000002',$,'Notched block',$,$,$,#${shape},$,$)`);
  return `ISO-10303-21;HEADER;FILE_DESCRIPTION((''),'2;1');FILE_NAME('','',(''),(''),'','','');FILE_SCHEMA(('IFC4'));ENDSEC;DATA;\n${lines.join('\n')}\nENDSEC;END-ISO-10303-21;`;
}

for(const [segments,offset] of [[1,[0,0,0]],[15,[0,0,0]],[15,[1250,-2000,13.75]]]) {
  test(`enclosed cutter preserves its boundary at ${12*segments*segments} triangles and offset ${offset}`,()=>{
    const metrics=measure('-',notchedBlock(offset,false,segments));
    assert.ok(Math.abs(metrics.volume-38)<1e-3,`volume ${metrics.volume}, expected 38`);
    assert.ok(Math.abs(metrics.area-98)<1e-3,`area ${metrics.area}, expected 98`);
    assert.ok(Math.abs(metrics.volume-metrics.shiftedVolume)<1e-3,'closed cavity surface');
  });
}

for (const [name, offset, mixed] of [
  ['faceted cutters', [0,0,0], false],
  ['translated mixed cutters', [1250,-2000,13.75], true],
]) {
  test(`deep sequential differences preserve geometry: ${name}`, () => {
    const metrics = measure('-', notchedBlock(offset, mixed));
    assert.ok(metrics.triangles > 12);
    assert.ok(Math.abs(metrics.volume-33.25) < 1e-3, `volume ${metrics.volume}`);
    assert.ok(Math.abs(metrics.shiftedVolume-metrics.volume) < 1e-3, 'closed surface');
    assert.ok(Math.abs(metrics.area-128.5) < 1e-3, `surface area ${metrics.area}`);
    // GetFlatMesh uses viewer axes: IFC (x,y,z) becomes (x,z,-y).
    const lo = [offset[0],offset[2],-offset[1]-2];
    const hi = [offset[0]+10,offset[2]+2,-offset[1]];
    for (let axis = 0; axis < 3; axis++) {
      assert.ok(Math.abs(metrics.lo[axis]-lo[axis]) < 1e-4, JSON.stringify(metrics));
      assert.ok(Math.abs(metrics.hi[axis]-hi[axis]) < 1e-4, JSON.stringify(metrics));
    }
  });
}

test('53 faceted differences complete within a bounded child process', () => {
  const metrics = measure(path.join(__dirname, 'fixtures/boolean-performance/deep-faceted-difference.ifc'), undefined, 90000, 2639585);
  assert.ok(metrics.triangles > 124, 'cuts must produce geometry beyond the base extrusion');
  assert.ok(metrics.area > 0 && Number.isFinite(metrics.area));
  assert.ok(Math.abs(metrics.volume-metrics.shiftedVolume) < 1e-5, 'volume must be independent of the origin: '+JSON.stringify(metrics));
  assert.ok(metrics.areaResidual < 1e-5 && metrics.momentResidual < 1e-5, 'surface must enclose a solid: '+JSON.stringify(metrics));
  assert.equal(metrics.outsideSamples, 0, 'triangle centres and edge midpoints must remain inside the actual source solid: '+JSON.stringify(metrics));
  // Bounds of the source extrusion; subtraction must not add exterior cutter faces.
  const lo = [-0.1001,-0.0001,0.2869], hi = [0.5093,4.4555,13.3292];
  for (let axis = 0; axis < 3; axis++) {
    assert.ok(metrics.lo[axis] >= lo[axis] && metrics.hi[axis] <= hi[axis], JSON.stringify(metrics));
    assert.ok(metrics.hi[axis]-metrics.lo[axis] > 1e-3);
  }
}, 100000);
