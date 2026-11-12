// Copyright (c) 2026 Quim Moya.
// geokernel (motor geomètric de MORPHEUS, consola GEOMETRY c6iqev) — fitxer generat per lab/bundle.js, no editar.
// 2026-11-12T09:11:02.054Z
(function (root) {
  var m = { exports: {} };
  (function (module, exports, host) {
// ── 2d/triangulate/assert-simple.js
// geokernel · 2d/triangulate/assert-simple — cap aresta dels contorns no en creua cap altra (si no, LLANÇA).
(function (def) {
  def('2d/triangulate/assertSimple', ['2d/triangulate/basics'], function (K) {
    const { EPS, area, cross, same, ringArea, inTri, pipXY, segsCross } = K;
  // every edge of the outline and the holes against every other (not adjacent): a crossing = not a simple polygon
  function assertSimple(V, rings) {
    const E = []; for (const r of rings) for (let i = 0; i < r.length; i++) E.push([V[r[i]], V[r[(i + 1) % r.length]]]);
    for (let i = 0; i < E.length; i++) for (let j = i + 1; j < E.length; j++) if (segsCross(E[i][0], E[i][1], E[j][0], E[j][1])) throw new Error('poly-tri: the polygon is self-intersecting (or a hole touches / crosses the outline)');
  }
    return { assertSimple };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 2d/triangulate/basics.js
// geokernel · 2d/triangulate/basics — peces mínimes compartides pel triangulador (en double, amb EPS): àrea, producte
// vectorial, igualtat, punt dins de triangle, punt dins de polígon (paritat), creuament de segments.
(function (def) {
  def('2d/triangulate/basics', [], function () {
  const EPS = 1e-12;
  function area(P) { let a = 0; for (let i = 0, j = P.length - 1; i < P.length; j = i++) a += P[j][0] * P[i][1] - P[i][0] * P[j][1]; return a / 2; }
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const same = (a, b) => Math.abs(a[0] - b[0]) <= 1e-12 && Math.abs(a[1] - b[1]) <= 1e-12;
  const ringArea = (V, r) => area(r.map(k => V[k]));
  const inTri = (p, a, b, c) => cross(a, b, p) >= -EPS && cross(b, c, p) >= -EPS && cross(c, a, p) >= -EPS;
  const pipXY = (q, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if (((a[1] > q[1]) !== (b[1] > q[1])) && q[0] < (b[0] - a[0]) * (q[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
  // two segments CROSS (properly, or touch away from a shared endpoint)
  function segsCross(a, b, c, d) {
    const o1 = cross(a, b, c), o2 = cross(a, b, d), o3 = cross(c, d, a), o4 = cross(c, d, b);
    if (((o1 > EPS && o2 < -EPS) || (o1 < -EPS && o2 > EPS)) && ((o3 > EPS && o4 < -EPS) || (o3 < -EPS && o4 > EPS))) return true;
    const on = (p, q, r) => Math.abs(cross(p, q, r)) <= EPS && Math.min(p[0], q[0]) - EPS <= r[0] && r[0] <= Math.max(p[0], q[0]) + EPS && Math.min(p[1], q[1]) - EPS <= r[1] && r[1] <= Math.max(p[1], q[1]) + EPS;
    const shared = same(a, c) || same(a, d) || same(b, c) || same(b, d);
    return !shared && (on(a, b, c) || on(a, b, d) || on(c, d, a) || on(c, d, b));
  }
    return { EPS, area, cross, same, ringArea, inTri, pipXY, segsCross };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 2d/triangulate/bridge.js
// geokernel · 2d/triangulate/bridge — PONT d'un forat cap al contorn (Eberly) amb comprovació de visibilitat: el forat
// queda unit al contorn en un sol anell feblement simple.
(function (def) {
  def('2d/triangulate/bridge', ['2d/triangulate/basics'], function (K) {
    const { EPS, area, cross, same, ringArea, inTri, pipXY, segsCross } = K;
  // is the bridge M → outer[i] valid? it crosses no edge of the ring, of the hole being joined nor of the PENDING holes
  // (edges touching M or the target are skipped), leaves the target INSIDE its interior wedge (picks the right copy of a
  // vertex the earlier bridges doubled), and its midpoint is inside the ring and outside every pending hole
  function bridgeOk(V, outer, hole, pending, i, M) {
    const n = outer.length, R = V[outer[i]], A = V[outer[(i + n - 1) % n]], B = V[outer[(i + 1) % n]];
    if (same(R, M)) return false;
    const conv = cross(A, R, B) >= 0, l1 = cross(A, R, M) > EPS, l2 = cross(R, B, M) > EPS;
    if (conv ? !(l1 && l2) : !(l1 || l2)) return false;
    const hits = (ring) => { for (let k = 0; k < ring.length; k++) { const a = V[ring[k]], b = V[ring[(k + 1) % ring.length]]; if (same(a, M) || same(b, M) || same(a, R) || same(b, R)) continue; if (segsCross(M, R, a, b)) return true; } return false; };
    if (hits(outer) || hits(hole) || pending.some(hits)) return false;
    const mid = [(M[0] + R[0]) / 2, (M[1] + R[1]) / 2];
    return pipXY(mid, outer.map(k => V[k])) && !pending.some(h => pipXY(mid, h.map(k => V[k])));
  }
  // BRIDGE a hole (CW, indices) into the outline (CCW, indices) → one ring. `pending` = the holes not joined yet: Eberly's
  // reflex test only sees the ring, so a pending hole with the SAME max x can sit in (M, I, P) — then the bridge is checked
  // and, if it crosses anything, the nearest valid ring vertex is taken instead (MASTER/AIDESIGN 2026-10-06)
  // el forat ja TOCA el contorn per un vèrtex: s'empalma en aquell punt (el pont natural) si el forat entra dins del
  // falcó interior del contorn en aquell vèrtex → anell feblement simple, sense pont nou que pugui creuar res
  function touchSplice(V, outer, hole) {
    for (let j = 0; j < hole.length; j++) {
      const H = V[hole[j]], N = V[hole[(j + 1) % hole.length]], Pv = V[hole[(j + hole.length - 1) % hole.length]];
      for (let i = 0; i < outer.length; i++) {
        if (!same(V[outer[i]], H)) continue;
        const A = V[outer[(i + outer.length - 1) % outer.length]], R = V[outer[i]], B = V[outer[(i + 1) % outer.length]];
        const inWedge = (Q) => { const conv = cross(A, R, B) >= 0, l1 = cross(A, R, Q) > EPS, l2 = cross(R, B, Q) > EPS; return conv ? l1 && l2 : l1 || l2; };
        if (!inWedge(N) || !inWedge(Pv)) continue;
        const out = outer.slice(0, i + 1);
        for (let k = 1; k <= hole.length; k++) out.push(hole[(j + k) % hole.length]);   // al voltant del forat fins a H
        for (let k = i + 1; k < outer.length; k++) out.push(outer[k]);
        return out;
      }
    }
    return null;
  }
  function bridge(V, outer, hole, pending) {
    const touched = touchSplice(V, outer, hole);
    if (touched) return touched;
    pending = pending || [];
    let mi = 0; for (let i = 1; i < hole.length; i++) { const p = V[hole[i]], q = V[hole[mi]]; if (p[0] > q[0] || (p[0] === q[0] && p[1] > q[1])) mi = i; }
    const M = V[hole[mi]];
    // the nearest outline edge hit by the ray M → +x
    let best = null;
    for (let i = 0; i < outer.length; i++) {
      const a = V[outer[i]], b = V[outer[(i + 1) % outer.length]];
      if ((a[1] - M[1]) * (b[1] - M[1]) > 0 || a[1] === b[1]) continue;
      const x = a[0] + (M[1] - a[1]) * (b[0] - a[0]) / (b[1] - a[1]); if (x < M[0] - EPS) continue;
      if (!best || x < best.x) best = { x, i };
    }
    if (!best) throw new Error('poly-tri: a hole is not inside the outline');
    const ia = outer[best.i], ib = outer[(best.i + 1) % outer.length], I = [best.x, M[1]];
    let vis = same(V[ia], I) ? best.i : same(V[ib], I) ? (best.i + 1) % outer.length : (V[ia][0] > V[ib][0] ? best.i : (best.i + 1) % outer.length);
    // a REFLEX outline vertex inside the triangle (M, I, P) blocks P: take the one with the smallest angle to the ray
    const P = V[outer[vis]];
    if (!same(P, I)) {
      let bestAng = Infinity, bestD = Infinity;
      const t = cross(M, I, P) >= 0 ? [M, I, P] : [M, P, I];
      for (let i = 0; i < outer.length; i++) {
        if (i === vis) continue; const R = V[outer[i]], prev = V[outer[(i + outer.length - 1) % outer.length]], next = V[outer[(i + 1) % outer.length]];
        if (cross(prev, R, next) > EPS) continue;                            // convex: never blocks
        if (!inTri(R, t[0], t[1], t[2])) continue;
        const ang = Math.abs(Math.atan2(R[1] - M[1], R[0] - M[0])), d = Math.hypot(R[0] - M[0], R[1] - M[1]);
        if (ang < bestAng - 1e-12 || (Math.abs(ang - bestAng) <= 1e-12 && d < bestD)) { bestAng = ang; bestD = d; vis = i; }
      }
    }
    if (!bridgeOk(V, outer, hole, pending, vis, M)) {
      const order = outer.map((k, i) => [i, Math.hypot(V[k][0] - M[0], V[k][1] - M[1])]).sort((a, b) => a[1] - b[1]);
      const alt = order.find(([i]) => bridgeOk(V, outer, hole, pending, i, M));
      if (!alt) throw new Error('poly-tri: no valid bridge for a hole (self-intersecting?)');
      vis = alt[0];
    }
    const out = outer.slice(0, vis + 1);
    for (let k = 0; k <= hole.length; k++) out.push(hole[(mi + k) % hole.length]);   // around the hole, back to M
    out.push(outer[vis]);
    for (let i = vis + 1; i < outer.length; i++) out.push(outer[i]);
    return out;
  }
    return { bridge, bridgeOk };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 2d/triangulate/clean-ring.js
// geokernel · 2d/triangulate/clean-ring — contorn sense punts repetits seguits ni vèrtexs rectes (col·lineals).
(function (def) {
  def('2d/triangulate/cleanRing', ['2d/triangulate/basics'], function (K) {
    const { EPS, area, cross, same, ringArea, inTri, pipXY, segsCross } = K;
  // indices of a ring without consecutive duplicates nor collinear (straight-through) vertices
  // keep(k) → true: el vèrtex k no es treu encara que sigui recte (un altre anell hi TOCA: un forat enganxat al contorn per
  // aquell punt; sense ell, el vèrtex del forat quedaria sobre l'aresta del contorn → «es creua», Portowa 4x3)
  function cleanRing(V, idx, keep) {
    let r = idx.filter((k, i) => !same(V[k], V[idx[(i + 1) % idx.length]]));
    for (let changed = true; changed && r.length > 3;) {
      changed = false;
      for (let i = 0; i < r.length && r.length > 3; i++) {
        const a = V[r[(i + r.length - 1) % r.length]], b = V[r[i]], c = V[r[(i + 1) % r.length]];
        const scale = Math.max(1e-300, Math.hypot(a[0] - b[0], a[1] - b[1]) * Math.hypot(c[0] - b[0], c[1] - b[1]));
        if (!(keep && keep(r[i])) && Math.abs(cross(a, b, c)) <= 1e-12 * scale && ((b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1])) >= 0) { r.splice(i, 1); changed = true; i--; }
      }
    }
    return r;
  }
    return { cleanRing };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 2d/triangulate/ear-clip.js
// geokernel · 2d/triangulate/ear-clip — RETALL D'ORELLES sobre un anell CCW (feblement) simple.
(function (def) {
  def('2d/triangulate/earClip', ['2d/triangulate/basics'], function (K) {
    const { EPS, area, cross, same, ringArea, inTri, pipXY, segsCross } = K;
  // ear clipping on a (weakly) simple CCW ring of indices
  function earClip(V, ring) {
    const r = ring.slice(), tris = []; let guard = 0;
    while (r.length > 3) {
      if (guard++ > 4 * ring.length * ring.length + 100) throw new Error('poly-tri: the polygon could not be triangulated (self-intersecting?)');
      let cut = -1;
      for (let i = 0; i < r.length; i++) {
        const ia = r[(i + r.length - 1) % r.length], ib = r[i], ic = r[(i + 1) % r.length], a = V[ia], b = V[ib], c = V[ic];
        if (cross(a, b, c) <= EPS) continue;                                 // reflex or flat
        let ok = true;
        for (const k of r) { if (k === ia || k === ib || k === ic) continue; const q = V[k]; if (same(q, a) || same(q, b) || same(q, c)) continue; if (inTri(q, a, b, c)) { ok = false; break; } }
        if (ok) { cut = i; tris.push([ia, ib, ic]); break; }
      }
      if (cut < 0) {
        // no ear: drop a degenerate (flat / doubled-back) vertex if there is one, else the polygon is not simple
        const flat = r.findIndex((ib, i) => Math.abs(cross(V[r[(i + r.length - 1) % r.length]], V[ib], V[r[(i + 1) % r.length]])) <= EPS);
        if (flat < 0) throw new Error('poly-tri: the polygon could not be triangulated (self-intersecting?)');
        r.splice(flat, 1); continue;
      }
      r.splice(cut, 1);
    }
    if (r.length === 3 && cross(V[r[0]], V[r[1]], V[r[2]]) > EPS) tris.push([r[0], r[1], r[2]]);
    return tris;
  }
    return { earClip };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 2d/triangulate/flip-slivers.js
// geokernel · 2d/triangulate/flip-slivers — FORA TRIANGLES AGULLA d'una triangulació: un triangle d'alçada minúscula
// (un vèrtex del contorn a 0,1 nm de la recta de dos altres) és topològicament correcte però els consumidors el
// consideren degenerat i el treuen (web-ifc, ganxo 2026-11-11: 527, iss_196, bugIssue481 → la malla s'obria). Si la
// seva aresta LLARGA és interior (la comparteix un altre triangle), es gira: (a,b,v)+(b,a,x) → (v,x,b)+(x,v,a)... només
// si els dos nous són ben orientats i no són agulla. Les arestes de contorn no es toquen mai.
// flipSlivers(pts [[x,y]], tris [[i,j,k]] CCW, { ratio = 1e-6 }) → tris (nou array) · stats { slivers, flipped }.
(function (def) {
  def('2d/triangulate/flipSlivers', [], function () {
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
    // alçada relativa: 2·àrea / (aresta llarga)²
    function thin(p, t) {
      const a = p[t[0]], b = p[t[1]], c = p[t[2]], L = Math.max(len(a, b), len(b, c), len(c, a));
      return L > 0 ? Math.abs(cross(a, b, c)) / (L * L) : 0;
    }
    function flipSlivers(pts, tris, opts) {
      const ratio = (opts && opts.ratio) || 1e-6, T = tris.map((t) => t.slice()), stats = { slivers: 0, flipped: 0 };
      const ek = (u, v) => u + ',' + v;
      for (let pass = 0; pass < 8; pass++) {
        const owner = new Map();   // aresta dirigida → triangle
        T.forEach((t, ti) => { if (t) for (let k = 0; k < 3; k++) owner.set(ek(t[k], t[(k + 1) % 3]), ti); });
        let changed = false;
        for (let ti = 0; ti < T.length; ti++) {
          const t = T[ti]; if (!t || thin(pts, t) > ratio) continue;
          if (pass === 0) stats.slivers++;
          // aresta llarga (k → k+1) i el vèrtex oposat v
          let kL = 0, best = -1;
          for (let k = 0; k < 3; k++) { const d = len(pts[t[k]], pts[t[(k + 1) % 3]]); if (d > best) { best = d; kL = k; } }
          const a = t[kL], b = t[(kL + 1) % 3], v = t[(kL + 2) % 3];
          const oi = owner.get(ek(b, a)); if (oi == null) continue;    // aresta de contorn: no es toca
          const o = T[oi], x = o.find((w) => w !== a && w !== b);
          const n1 = [v, a, x], n2 = [v, x, b];
          if (!(cross(pts[n1[0]], pts[n1[1]], pts[n1[2]]) > 0 && cross(pts[n2[0]], pts[n2[1]], pts[n2[2]]) > 0)) continue;
          if (thin(pts, n1) <= ratio || thin(pts, n2) <= ratio) continue;
          T[ti] = n1; T[oi] = n2; stats.flipped++; changed = true;
          for (const [tt, id] of [[n1, ti], [n2, oi]]) for (let k = 0; k < 3; k++) owner.set(ek(tt[k], tt[(k + 1) % 3]), id);
          owner.delete(ek(a, b)); owner.delete(ek(b, a));
        }
        if (!changed) break;
      }
      return { tris: T, stats };
    }
    return { flipSlivers };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 2d/triangulate/keep-collinear.js
// geokernel · 2d/triangulate/keep-collinear — torna a posar els vèrtexs rectes que la neteja havia tret, partint
// l'aresta de frontera on cauen: cap vèrtex del contorn no queda fora (juntes sense T amb les cares veïnes).
(function (def) {
  def('2d/triangulate/keepCollinear', ['2d/triangulate/basics'], function (K) {
    const { EPS, area, cross, same, ringArea, inTri, pipXY, segsCross } = K;
  // KEEP COLLINEAR (opts.keepCollinear): the vertices cleanRing dropped (straight-through ones) are put back, one by one:
  // each lies inside a BOUNDARY edge a–b of some triangle (a,b,c), which is split in two at it, (a,p,c) + (p,b,c) — never
  // degenerate (c is off the line a–b), no extra point. Then EVERY vertex of the outline and of the holes is used by some
  // triangle (BCOM: the side quads of a finish slab need them, else the solid is open).
  function keepCollinear(pts, tris, dropped) {
    const key = (a, b) => a < b ? a + ',' + b : b + ',' + a, uses = new Map();
    const count = (t, d) => { for (let e = 0; e < 3; e++) { const k = key(t[e], t[(e + 1) % 3]); uses.set(k, (uses.get(k) || 0) + d); } };
    tris = tris.map(t => t.slice()); for (const t of tris) count(t, 1);
    // p strictly inside the segment a–b (relative tolerance, like cleanRing)
    const inside = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy; if (L2 <= 0) return false;
      const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2; return t > 1e-12 && t < 1 - 1e-12 && Math.abs(cross(a, b, p)) <= 1e-9 * L2; };
    for (const k of dropped) {
      const p = pts[k];
      split: for (let ti = 0; ti < tris.length; ti++) {
        const t = tris[ti];
        for (let e = 0; e < 3; e++) {
          const a = t[e], b = t[(e + 1) % 3], c = t[(e + 2) % 3];
          if (uses.get(key(a, b)) !== 1 || !inside(p, pts[a], pts[b])) continue;
          count(t, -1); const t1 = [a, k, c], t2 = [k, b, c]; tris[ti] = t1; tris.push(t2); count(t1, 1); count(t2, 1);
          break split;
        }
      }
    }
    return tris;
  }
    return { keepCollinear };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 2d/triangulate/region.js
// geokernel · 2d/triangulate/region — TRIANGULA UNA REGIÓ amb anells NIUATS a qualsevol profunditat: contorn → forat →
// illa dins del forat → forat dins de l'illa… L'orientació d'entrada no importa: la profunditat de cada anell (quants
// el contenen) decideix si és contorn (parell) o forat (senar); cada forat va al contorn que el conté directament.
// triangulateRegion(rings, { keepCollinear }) → { pts (tots els punts, en l'ordre donat), tris: [[i,j,k]…] CCW }.
(function (def) {
  def('2d/triangulate/region', ['2d/triangulate/basics', '2d/triangulate'], function (K, TR) {
    const { area, pipXY } = K;
    // un punt de prova de l'anell que no sigui sobre l'altre: el punt mig de la primera aresta que en quedi clarament
    // dins o fora (un anell que en toca un altre per un vèrtex no confon la prova)
    function containedIn(A, B) {
      let inside = 0, outside = 0;
      for (let i = 0; i < A.length && inside + outside < 3; i++) {
        const p = A[i], q = A[(i + 1) % A.length], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
        if (onRing(m, B)) continue;
        if (pipXY(m, B)) inside++; else outside++;
      }
      return inside > outside;
    }
    function onRing(m, B) {
      for (let i = 0; i < B.length; i++) {
        const a = B[i], b = B[(i + 1) % B.length], dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
        if (!(L2 > 0)) continue;
        const t = ((m[0] - a[0]) * dx + (m[1] - a[1]) * dy) / L2;
        if (t < -1e-12 || t > 1 + 1e-12) continue;
        if (Math.abs((m[0] - a[0]) * dy - (m[1] - a[1]) * dx) <= 1e-12 * L2) return true;
      }
      return false;
    }
    function triangulateRegion(rings, opts) {
      const R = rings.filter((r) => r.length >= 3);
      const absA = R.map((r) => Math.abs(area(r)));
      const parents = R.map((r, i) => R.map((_, j) => j).filter((j) => j !== i && absA[j] > absA[i] && containedIn(r, R[j])));
      const depth = parents.map((p) => p.length);
      const pts = [], off = [];
      R.forEach((r) => { off.push(pts.length); for (const p of r) pts.push([+p[0], +p[1]]); });
      const tris = [];
      R.forEach((r, i) => {
        if (depth[i] % 2) return;                                  // és un forat
        const holes = R.map((_, j) => j).filter((j) => depth[j] === depth[i] + 1 && parents[j].includes(i));
        const t = TR.triangulate(r, holes.map((j) => R[j]), opts);
        const ids = r.map((_, k) => off[i] + k);
        for (const j of holes) for (let k = 0; k < R[j].length; k++) ids.push(off[j] + k);
        for (const tri of t.tris) tris.push([ids[tri[0]], ids[tri[1]], ids[tri[2]]]);
      });
      return { pts, tris };
    }
    return { triangulateRegion };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 2d/triangulate/triangulate.js
// geokernel · 2d/triangulate — TRIANGULACIÓ d'un contorn amb FORATS: neteja → ponts dels forats → orelles → (opcional)
// vèrtexs rectes. Algorisme portat de poly-tri (MORPHEUS, 2026-10). Les illes dins de forats: vegeu region.js.
// triangulate(outer, holes, { keepCollinear }) → { pts, tris } · area(P). Un polígon impossible LLANÇA.
(function (def) {
  def('2d/triangulate', ['2d/triangulate/basics','2d/triangulate/cleanRing','2d/triangulate/bridge','2d/triangulate/earClip','2d/triangulate/assertSimple','2d/triangulate/keepCollinear'], function (K, CR, BR, EC, AS, KC) {
    const { EPS, area, cross, same, ringArea, inTri, pipXY, segsCross } = K;
    const { cleanRing } = CR, { bridge } = BR, { earClip } = EC, { assertSimple } = AS, { keepCollinear } = KC;
  // TRIANGULATE: outer = [[x,y]…], holes = [[[x,y]…]…] → { pts (outer then the holes' points, as given), tris: [[i,j,k]…]
  // counter-clockwise, indices into pts }. opts.keepCollinear → no vertex of the rings is left out (see keepCollinear).
  function triangulate(outer, holes, opts) {
    const pts = outer.map(p => [+p[0], +p[1]]), hs = [];
    for (const h of holes || []) { const o = pts.length; for (const p of h) pts.push([+p[0], +p[1]]); hs.push(h.map((_, k) => o + k)); }
    // punts on un anell en toca un altre (mateixa posició): no es treuen per rectes
    const pos = new Map(), owner = (k) => (k < outer.length ? -1 : hs.findIndex((h) => h.includes(k)));
    for (let k = 0; k < pts.length; k++) { const key = pts[k][0] + ',' + pts[k][1]; if (!pos.has(key)) pos.set(key, new Set()); pos.get(key).add(owner(k)); }
    const keep = (k) => pos.get(pts[k][0] + ',' + pts[k][1]).size > 1;
    let ring = cleanRing(pts, outer.map((_, k) => k), keep); if (ring.length < 3) return { pts, tris: [] };
    if (ringArea(pts, ring) < 0) ring.reverse();
    const hr = hs.map(h => { let r = cleanRing(pts, h, keep); if (ringArea(pts, r) > 0) r.reverse(); return r; }).filter(r => r.length >= 3);
    assertSimple(pts, [ring].concat(hr));
    hr.sort((a, b) => Math.max(...b.map(k => pts[k][0])) - Math.max(...a.map(k => pts[k][0])));   // rightmost hole first
    const kept = new Set([...ring, ...hr.flat()]);
    for (let k = 0; k < hr.length; k++) ring = bridge(pts, ring, hr[k], hr.slice(k + 1));
    const tris = earClip(pts, ring);
    if (!(opts && opts.keepCollinear)) return { pts, tris };
    // the dropped ones that are not a mere repeat of a kept point (a repeat has nothing to add)
    const dropped = []; for (let k = 0; k < pts.length; k++) if (!kept.has(k) && ![...kept, ...dropped].some(j => same(pts[j], pts[k]))) dropped.push(k);   // a repeat of a kept / already taken point adds nothing
    return { pts, tris: keepCollinear(pts, tris, dropped) };
  }
    return { area, triangulate };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 2d/triangulate/untangle.js
// geokernel · 2d/triangulate/untangle — DESFÀ CONTORNS PINÇATS: un vèrtex que cau sobre una aresta del mateix contorn
// (o d'un altre) a menys de `tol` hi entra (la parteix), i després cada contorn que passa dues vegades pel mateix vèrtex
// es separa en lòbuls simples. Els lòbuls d'àrea zero (anar i tornar) desapareixen. Treballa amb índexs: res de
// coordenades noves. untangle(P, loops, tol) → loops · P = [[x,y]…] (per índex), loops = [[i…]…].
(function (def) {
  def('2d/triangulate/untangle', [], function () {
    const area = (P, L) => { let a = 0; for (let i = 0; i < L.length; i++) { const p = P[L[i]], q = P[L[(i + 1) % L.length]]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
    function onSeg(P, v, a, b, tol) {
      const A = P[a], B = P[b], Q = P[v], dx = B[0] - A[0], dy = B[1] - A[1], L2 = dx * dx + dy * dy;
      if (!(L2 > 0)) return false;
      const t = ((Q[0] - A[0]) * dx + (Q[1] - A[1]) * dy) / L2;
      if (t <= 1e-12 || t >= 1 - 1e-12) return false;
      const ex = A[0] + t * dx - Q[0], ey = A[1] + t * dy - Q[1];
      return ex * ex + ey * ey <= tol * tol ? t : false;
    }
    function untangle(P, loops, tol) {
      // 1) vèrtexs sobre arestes → s'hi insereixen
      const all = [...new Set([].concat(...loops))];
      const split = loops.map((L) => {
        const out = [];
        for (let i = 0; i < L.length; i++) {
          const a = L[i], b = L[(i + 1) % L.length];
          out.push(a);
          const ins = [];
          for (const v of all) { if (v === a || v === b) continue; const t = onSeg(P, v, a, b, tol); if (t !== false) ins.push([t, v]); }
          ins.sort((x, y) => x[0] - y[0]);
          for (const [, v] of ins) out.push(v);
        }
        return out;
      });
      // 2) un vèrtex repetit dins d'un contorn → es talla el lòbul
      const result = [];
      for (const L0 of split) {
        const stack = [L0];
        while (stack.length) {
          const L = stack.pop();
          const seen = new Map();
          let cut = null;
          for (let i = 0; i < L.length && !cut; i++) { if (seen.has(L[i])) cut = [seen.get(L[i]), i]; else seen.set(L[i], i); }
          if (!cut) { if (L.length >= 3 && Math.abs(area(P, L)) > 0) result.push(L); continue; }
          const [i, j] = cut;
          stack.push(L.slice(i, j));                          // el lòbul entre les dues aparicions
          stack.push(L.slice(0, i).concat(L.slice(j)));      // la resta
        }
      }
      return result;
    }
    return { untangle };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/boolean/assemble.js
// geokernel · solids/boolean/assemble — CARES PER PLA → SÒLID BREP. Vèrtexs units per clau EXACTA; una cara per
// (pla, sentit) amb tots els seus contorns; pas de CONFORMITAT: un vèrtex que cau EXACTAMENT a l'interior d'una aresta
// d'una altra cara (sobre els dos plans de la recta i entre els extrems) s'hi insereix → cap junta en T.
// Els punts es clonen (els sòlids d'entrada no es toquen) i reben la incidència topològica de les seves cares.
(function (def) {
  def('solids/boolean/assemble', ['solids/point', 'solids/plane2d/frame'], function (PT, FR) {
    function assemble(T, outFaces) {
      const verts = [], vid = new Map();
      // IDENTITAT TOPOLÒGICA dels vèrtexs: el mateix punt EXACTE → el mateix vèrtex. (Fins al 2026-11-10 també es fusionaven
      // punts a menys de 1e-9 de l'escala: això declarava un vèrtex sobre plans que no el contenen exactament — tres plans
      // que gairebé comparteixen una recta, 1194_test_424 pas 8 — i desequilibrava les seccions. Sense fusió: micro-arestes
      // exactes i coherents; la cadena 1194 fa les 29 booleanes.)
      const vOf = (p) => {
        const k = PT.key(p);
        let i = vid.get(k);
        if (i == null) { i = verts.length; vid.set(k, i); verts.push({ p: p.p.slice(), h: p.h, f: p.f, on: new Set(p.p), _key: k }); }
        return i;
      };
      // una cara per (pla, sentit)
      const byPS = new Map();
      for (const of of outFaces) {
        const k = of.plane + ':' + of.sign;
        let f = byPS.get(k);
        if (!f) { f = { plane: of.plane, sign: of.sign, loops: [], epl: [] }; byPS.set(k, f); }
        for (const l of of.loops) { f.loops.push(l.pts.map(vOf)); f.epl.push(l.X.slice()); }
      }
      const faces = [...byPS.values()];
      const stats = { tInserted: conform(T, faces, verts) };
      // incidència topològica
      for (const f of faces) f.loops.forEach((L, li) => L.forEach((v, i) => { const on = verts[v].on; on.add(f.plane); on.add(f.epl[li][i]); on.add(f.epl[li][(i - 1 + L.length) % L.length]); }));
      return { T, faces, verts, stats };
    }
    // insereix a cada aresta els vèrtexs que hi cauen a dins (exacte); filtre per capses en double
    function conform(T, faces, verts) {
      const xyz = verts.map((v) => PT.coords(T, v));
      // graella de vèrtexs per al filtre
      let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
      for (const c of xyz) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], c[k]); hi[k] = Math.max(hi[k], c[k]); }
      const span = Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2], 1e-12), cell = span / Math.max(1, Math.cbrt(verts.length)) + 1e-12;
      const grid = new Map(), gk = (i, j, k) => i + ',' + j + ',' + k, ci = (x, k) => Math.floor((x - lo[k]) / cell);
      xyz.forEach((c, v) => { const k = gk(ci(c[0], 0), ci(c[1], 1), ci(c[2], 2)); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(v); });
      const m = 1e-9 * (span + 1);
      let inserted = 0;
      const frames = new Map(), frameOf = (P) => { let F = frames.get(P); if (!F) { F = FR.frame(T, P); frames.set(P, F); } return F; };
      for (const f of faces) {
        const F = frameOf(f.plane);
        f.loops.forEach((L, li) => {
          const E = f.epl[li], NL = [], NE = [];
          for (let i = 0; i < L.length; i++) {
            const u = L[i], w = L[(i + 1) % L.length], X = E[i];
            NL.push(u); NE.push(X);
            const a = xyz[u], b = xyz[w];
            const cand = [];
            const i0 = ci(Math.min(a[0], b[0]) - m, 0), i1 = ci(Math.max(a[0], b[0]) + m, 0), j0 = ci(Math.min(a[1], b[1]) - m, 1), j1 = ci(Math.max(a[1], b[1]) + m, 1), k0 = ci(Math.min(a[2], b[2]) - m, 2), k1 = ci(Math.max(a[2], b[2]) + m, 2);
            for (let x = i0; x <= i1; x++) for (let y = j0; y <= j1; y++) for (let z = k0; z <= k1; z++) {
              const list = grid.get(gk(x, y, z)); if (!list) continue;
              for (const v of list) {
                if (v === u || v === w) continue;
                const c = xyz[v];
                if (c[0] < Math.min(a[0], b[0]) - m || c[0] > Math.max(a[0], b[0]) + m || c[1] < Math.min(a[1], b[1]) - m || c[1] > Math.max(a[1], b[1]) + m || c[2] < Math.min(a[2], b[2]) - m || c[2] > Math.max(a[2], b[2]) + m) continue;
                const pv = verts[v];
                if (PT.side(T, f.plane, pv) !== 0 || PT.side(T, X, pv) !== 0) continue;
                const c1 = F.lex(verts[u], pv), c2 = F.lex(pv, verts[w]);
                if (c1 !== 0 && c1 === c2) cand.push(v);
              }
            }
            if (cand.length) {
              const asc = F.lex(verts[u], verts[w]) < 0;
              cand.sort((p, q) => (asc ? F.lex(verts[p], verts[q]) : F.lex(verts[q], verts[p])));
              for (const v of cand) { NL.push(v); NE.push(X); inserted++; }
            }
          }
          f.loops[li] = NL; f.epl[li] = NE;
        });
      }
      return inserted;
    }
    return { assemble };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/boolean/boolean.js
// geokernel · solids/boolean — UNIÓ / INTERSECCIÓ / RESTA de dos sòlids BREP de la MATEIXA taula de plans.
// Per a cada pla P amb cares d'A o de B: operands 2D A+, A−, B+, B− (cares sobre P) i SA±, SB± (seccions al límit
// P ± ε) → booleana 2D exacta amb les fórmules del README → cares resultants sobre P (+n i −n). Cap pla nou.
// Un pla que no toca la capsa de l'altre sòlid es resol sense càlcul (les seves cares es queden o se'n van senceres).
(function (def) {
  def('solids/boolean', ['solids/plane2d/frame', 'solids/section', 'solids/region2d/evaluate', 'solids/boolean/assemble', 'solids/point', 'solids/region2d/reverse'], function (FR, SEC, EV, AS, PT, RV) {
    // índexs dels operands: 0 A+, 1 A−, 2 B+, 3 B−, 4 SA+, 5 SA−, 6 SB+, 7 SB−
    const RULES = {
      union: [(w) => (w[0] > 0 && !(w[6] > 0)) || (w[2] > 0 && !(w[4] > 0) && !(w[0] > 0)),
        (w) => (w[1] > 0 && !(w[7] > 0)) || (w[3] > 0 && !(w[5] > 0) && !(w[1] > 0))],
      intersection: [(w) => (w[0] > 0 && w[7] > 0) || (w[2] > 0 && w[5] > 0 && !(w[0] > 0)),
        (w) => (w[1] > 0 && w[6] > 0) || (w[3] > 0 && w[4] > 0 && !(w[1] > 0))],
      difference: [(w) => (w[0] > 0 && !(w[7] > 0)) || (w[3] > 0 && w[5] > 0 && !(w[0] > 0)),
        (w) => (w[1] > 0 && !(w[6] > 0)) || (w[2] > 0 && w[4] > 0 && !(w[1] > 0))],
    };
    function bbox(S) {
      const b = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
      for (const v of S.verts) { const c = PT.coords(S.T, v); for (let k = 0; k < 3; k++) { if (c[k] < b[k]) b[k] = c[k]; if (c[k] > b[k + 3]) b[k + 3] = c[k]; } }
      return b;
    }
    // el pla P talla (o toca) la capsa? (en double amb marge: només serveix per estalviar feina, mai per decidir mal)
    function cutsBox(T, P, b) {
      const n = T.normal(P), p = T.get(P), d = p.fe / (Math.hypot(p.fa, p.fb, p.fc) * Math.pow(2, T.gridExp));
      let lo = Infinity, hi = -Infinity;
      for (let i = 0; i < 8; i++) { const x = [i & 1 ? b[3] : b[0], i & 2 ? b[4] : b[1], i & 4 ? b[5] : b[2]]; const s = n[0] * x[0] + n[1] * x[1] + n[2] * x[2] + d; lo = Math.min(lo, s); hi = Math.max(hi, s); }
      const m = 1e-7 * (Math.abs(b[0]) + Math.abs(b[1]) + Math.abs(b[2]) + Math.abs(b[3]) + Math.abs(b[4]) + Math.abs(b[5]) + 1);
      return lo <= m && hi >= -m;
    }
    // arestes 2D de les cares de S sobre P amb el sentit donat (interior a l'esquerra vist des de +nP)
    function faceEdges(S, F, P, sign, list) {
      const out = [];
      for (const f of list || S.faces) {
        if (f.plane !== P || f.sign !== sign) continue;
        f.loops.forEach((L, li) => {
          for (let i = 0; i < L.length; i++) {
            let a = S.verts[L[i]], b = S.verts[L[(i + 1) % L.length]];
            if (PT.equal(a, b)) continue;
            const X = f.epl[li][i];
            if (sign < 0) { const t = a; a = b; b = t; }
            out.push({ a, b, X, s: F.sense(X, a, b) });
          }
        });
      }
      return out;
    }
    // (els vèrtexs del BREP ja són exactes i compartits: fromMesh els fa concurrents i resol els de ≥4 plans; les antigues
    // «cantonades per cara» ja no calen al càlcul — 2026-11-11, lab/verify-fixes + compare + apex-fuzz sense canvis)
    function copyLoops(S, f) {
      return f.loops.map((L, li) => ({ pts: L.map((v) => S.verts[v]), X: f.epl[li].slice() }));
    }
    function boolean(op, A, B, opts) {
      const rules = RULES[op];
      if (!rules) throw new Error('geokernel.boolean: operació desconeguda «' + op + '» (union | intersection | difference)');
      if (A.T !== B.T) throw new Error('geokernel.boolean: els dos sòlids han de compartir la taula de plans');
      const T = A.T, bA = bbox(A), bB = bbox(B);
      const planes = new Set(); A.faces.forEach((f) => planes.add(f.plane)); B.faces.forEach((f) => planes.add(f.plane));
      const outFaces = [], stats = { planes: planes.size, trivial: 0, computed: 0 };
      // cares per pla (un cop): sense això, cada pla recorria totes les cares (O(plans × cares): 527, 75.000 × 50.000)
      const byPlane = (S) => { const m = new Map(); for (const f of S.faces) { if (!m.has(f.plane)) m.set(f.plane, []); m.get(f.plane).push(f); } return m; };
      const fA = byPlane(A), fB = byPlane(B);
      // drecera per CARA: cap cara del pla no toca la capsa de l'altre sòlid (527: el pla talla la capsa de B però les
      // cares, no) → es queden o se'n van senceres. Capses en double amb marge (només estalvia feina, mai decideix mal).
      const xyz = (S) => { const c = new Map(); return (v) => { let r = c.get(v); if (!r) c.set(v, (r = PT.coords(S.T, S.verts[v]))); return r; }; };
      const cA = xyz(A), cB = xyz(B);
      const faceOut = (S, cs, f, b) => {
        const m = 1e-7 * (Math.abs(b[0]) + Math.abs(b[1]) + Math.abs(b[2]) + Math.abs(b[3]) + Math.abs(b[4]) + Math.abs(b[5]) + 1);
        const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
        for (const L of f.loops) for (const v of L) { const c = cs(v); for (let k = 0; k < 3; k++) { if (c[k] < lo[k]) lo[k] = c[k]; if (c[k] > hi[k]) hi[k] = c[k]; } }
        for (let k = 0; k < 3; k++) if (hi[k] < b[k] - m || lo[k] > b[k + 3] + m) return true;
        return false;
      };
      const away = (S, cs, list, b) => list.every((f) => faceOut(S, cs, f, b));
      for (const P of planes) {
        const inA = fA.has(P), inB = fB.has(P);
        // drecera: el pla (o les seves cares) no toca l'altre sòlid
        if (inA && !inB && (!cutsBox(T, P, bB) || away(A, cA, fA.get(P), bB))) {
          stats.trivial++;
          if (op !== 'intersection') for (const f of fA.get(P)) outFaces.push({ plane: P, sign: f.sign, loops: copyLoops(A, f) });
          continue;
        }
        if (inB && !inA && (!cutsBox(T, P, bA) || away(B, cB, fB.get(P), bA))) {
          stats.trivial++;
          if (op === 'union') for (const f of fB.get(P)) outFaces.push({ plane: P, sign: f.sign, loops: copyLoops(B, f) });
          continue;
        }
        stats.computed++;
        const F = FR.frame(T, P);
        const ops = [faceEdges(A, F, P, 1, fA.get(P) || []), faceEdges(A, F, P, -1, fA.get(P) || []), faceEdges(B, F, P, 1, fB.get(P) || []), faceEdges(B, F, P, -1, fB.get(P) || [])];
        ops.push(inB ? SEC.section(A, P, 1, F) : [], inB ? SEC.section(A, P, -1, F) : []);
        ops.push(inA ? SEC.section(B, P, 1, F) : [], inA ? SEC.section(B, P, -1, F) : []);
        const [plus, minus] = EV.evaluate(T, F, ops, rules);
        if (plus.length) outFaces.push({ plane: P, sign: 1, loops: plus });
        if (minus.length) outFaces.push({ plane: P, sign: -1, loops: minus.map(RV.reverseLoop) });
      }
      const R = AS.assemble(T, outFaces);
      R.stats = Object.assign(stats, R.stats || {});
      return R;
    }
    return { boolean, RULES };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/boolean/chain-mesh.js
// geokernel · solids/boolean/chainMesh — UNA CADENA (base + operands en ordre, format de WEB-IFC) → MALLA final amb el
// seu estat, en dades planes (es pot fer al worker): { ok, positions, indices, steps, total, naked, volume, error }.
// ok = la cadena sencera i la malla tancada i ben orientada. Si falla, error amb el pas.
(function (def) {
  def('solids/boolean/chainMesh', ['solids/diag/chain', 'solids/brep/toMesh', 'solids/validate/mesh'], function (CH, TM, VM) {
    function chainMesh(pc, opts) {
      const r = CH.runChain(pc, opts), total = pc.ops.length;
      if (r.error) return { ok: false, error: r.error, steps: Math.max(r.step, 0), total };
      let m;
      try { m = TM.toMesh(r.X); } catch (e) { return { ok: false, error: 'malla final: ' + e.message, steps: total, total }; }
      const v = VM.check(m);
      return { ok: !v.naked && !v.misoriented, positions: Array.from(m.positions), indices: Array.from(m.indices), steps: total, total, naked: v.naked, nonManifold: v.nonManifold, volume: v.volume };
    }
    return { chainMesh };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/boolean/mesh.js
// geokernel · solids/boolean/mesh — BOOLEANA DE MALLES (la porta d'entrada per a web-ifc i qualsevol malla):
// malla A, malla B → taula de plans comuna → BREP → booleana exacta → malla { positions, indices, faceOf }.
// booleanMesh(op, a, b, opts) · opts: repair (tol de reparació en unitats del model, p. ex. 1e-4 = 0,1 mm; per defecte
// SENSE reparació: una entrada oberta LLANÇA), weld, angTol, distTol, gridExp (vegeu fromMesh i plane).
// Amb repair, els plans d'entrada es canonitzen a la mateixa tolerància (els vèrtexs s'han pogut moure fins a tol).
(function (def) {
  def('solids/boolean/mesh', ['solids/plane', 'solids/brep/fromMesh', 'solids/brep/toMesh', 'solids/boolean', 'solids/repair'], function (PL, FM, TM, BO, RP) {
    function booleanMesh(op, a, b, opts) {
      opts = Object.assign({}, opts);
      const T = PL.table(opts);
      let repairStats = null;
      if (opts.repair) {
        const ra = RP.repair(a, { tol: opts.repair }), rb = RP.repair(b, { tol: opts.repair });
        a = ra; b = rb; repairStats = { A: ra.stats, B: rb.stats };
        if (opts.distTol == null) opts.distTol = opts.repair;
      }
      const A = FM.fromMesh(T, a, opts), B = FM.fromMesh(T, b, opts);
      const R = BO.boolean(op, A, B, opts);
      const m = TM.toMesh(R);
      m.stats = Object.assign({ repair: repairStats }, R.stats);
      return m;
    }
    return { booleanMesh };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/boolean/webifc.js
// geokernel · solids/boolean/webifc — PUNT D'ENTRADA per al GANXO de web-ifc (BoolProcess): una booleana de dues malles
// en les UNITATS DEL MODEL (mm, cm o m: unitToMetre ho diu) → la malla resultat en les mateixes unitats, NOMÉS si és
// tancada i ben orientada; si no, LLANÇA (web-ifc fa servir llavors el seu resultat: mai pitjor que avui).
// La reparació i la tolerància (1e-4 m = 0,1 mm, la de WEB-IFC) van en metres.
// MEMÒRIA DEL BREP: web-ifc encadena les booleanes d'un element tornant-nos com a A la MALLA que li vam donar al pas
// anterior. Tornar a deduir-ne els plans de coordenades en coma flotant els fa derivar (1194: cares de ranures diferents
// fusionades a 0,024 mm → vèrtexs de ≥4 plans inexactes → el pas 8 peta). Per això es recorda el BREP exacte de cada
// resultat (clau = les seves dades exactes) i, si torna com a A, es reprèn tal qual (com fan les cadenes pròpies).
// webifcBool(op, a, b, { unitToMetre }) → { positions: Float64Array, indices: Uint32Array, stats } · webifcBoolStats()
(function (def) {
  def('solids/boolean/webifc', ['solids/plane', 'solids/repair', 'solids/brep/fromMesh', 'solids/boolean', 'solids/brep/toMesh', 'solids/validate/mesh'],
    function (PL, RP, FM, BO, TM, VM) {
      const memo = new Map(), MAX = 64, stats = { calls: 0, reused: 0, fresh: 0, failed: 0 };
      // clau exacta d'una malla: FNV-1a sobre els bits dels Float64 i els índexs
      function keyOf(m) {
        const f = m.positions instanceof Float64Array ? m.positions : Float64Array.from(m.positions);
        const u32 = new Uint32Array(f.buffer, f.byteOffset, f.length * 2);
        let h1 = 0x811c9dc5, h2 = 0x01000193;
        for (let i = 0; i < u32.length; i++) { h1 = Math.imul(h1 ^ u32[i], 16777619); h2 = Math.imul(h2 ^ (u32[i] + i), 2246822519); }
        const I = m.indices;
        for (let i = 0; i < I.length; i++) { h1 = Math.imul(h1 ^ I[i], 16777619); h2 = Math.imul(h2 ^ (I[i] + i), 2246822519); }
        return (h1 >>> 0).toString(36) + ':' + (h2 >>> 0).toString(36) + ':' + f.length + ':' + I.length;
      }
      function scaled(m, k) { const P = new Float64Array(m.positions.length); for (let i = 0; i < P.length; i++) P[i] = m.positions[i] * k; return { positions: P, indices: m.indices }; }
      function webifcBool(op, a, b, opts) {
        opts = opts || {};
        const u = opts.unitToMetre || 1, tol = opts.tol || 1e-4;
        const o = { union: 'union', difference: 'difference', intersection: 'intersection', UNION: 'union', DIFFERENCE: 'difference', INTERSECTION: 'intersection' }[op];
        if (!o) throw new Error('geokernel.webifcBool: operació desconeguda «' + op + '»');
        stats.calls++;
        // entrada mal formada (APHS: índexs de 4.000 milions amb 84 vèrtexs, memòria no inicialitzada?): error CLAR, no un
        // TypeError al mig del motor
        for (const [nm, m] of [['A', a], ['B', b]]) {
          const nv = m.positions.length / 3, I = m.indices;
          if (m.positions.length % 3 || I.length % 3) throw new Error('geokernel.webifcBool: ' + nm + ' mal formada (' + m.positions.length + ' coordenades, ' + I.length + ' índexs)');
          for (let i = 0; i < I.length; i++) if (!(I[i] >= 0 && I[i] < nv)) throw new Error('geokernel.webifcBool: ' + nm + ' té un índex fora de rang (' + I[i] + ' amb ' + nv + ' vèrtexs, posició ' + i + ')');
        }
        // un operand SENSE VOLUM (una làmina: les dues cares d'un rectangle, 2169) no talla ni afegeix res; vol en m³
        const vol = (m) => { const P = m.positions, I = m.indices; let v = 0; for (let t = 0; t < I.length; t += 3) { const a = 3 * I[t], b = 3 * I[t + 1], c = 3 * I[t + 2]; v += P[a] * (P[b + 1] * P[c + 2] - P[b + 2] * P[c + 1]) - P[a + 1] * (P[b] * P[c + 2] - P[b + 2] * P[c]) + P[a + 2] * (P[b] * P[c + 1] - P[b + 1] * P[c]); } return Math.abs(v / 6) * u * u * u; };
        const EMPTY_V = 1e-12;   // m³ (1 mm³ = 1e-9): per sota, cap sòlid real
        if (vol(b) < EMPTY_V && (o === 'difference' || o === 'union')) { stats.emptyOperand = (stats.emptyOperand || 0) + 1; return { positions: Float64Array.from(a.positions), indices: Uint32Array.from(a.indices), stats: { triangles: a.indices.length / 3, volume: vol(a) / (u * u * u), emptyB: true } }; }
        if (vol(b) < EMPTY_V && o === 'intersection') { stats.emptyOperand = (stats.emptyOperand || 0) + 1; return { positions: new Float64Array(0), indices: new Uint32Array(0), stats: { triangles: 0, volume: 0, emptyB: true } }; }
        try {
          const prev = memo.get(keyOf(a));
          let A, T;
          if (prev) { A = prev; T = prev.T; stats.reused++; }
          else { T = PL.table({}); A = FM.fromMesh(T, RP.repair(scaled(a, u), { tol }), { distTol: tol }); stats.fresh++; }
          const B = FM.fromMesh(T, RP.repair(scaled(b, u), { tol }), { distTol: tol });
          const X = BO.boolean(o, A, B);
          // soldadura de sortida a 1 µm (en metres): cap micro-segment ni triangle degenerat que web-ifc o el banc (soldadura a
          // 1e-4) col·lapsin deixant arestes sense parella (bugIssue481: dos vèrtexs a 1e-8 m entre cares)
          const m = TM.toMesh(X, { weld: opts.outWeld || 1e-6 }), v = VM.check(m);
          if (v.naked || v.misoriented) throw new Error('geokernel.webifcBool: resultat obert (' + v.naked + ' nues, ' + v.misoriented + ' mal orientades)');
          // web-ifc (Geometry::AddFace) descarta els triangles amb |(b−a)×(c−a)| ≤ 1e-10 en UNITATS DEL MODEL. Si en queda cap
          // (una agulla amb l'aresta llarga al contorn de la cara), NO es falla: un element tallat amb 3 arestes nues és molt
          // millor que un element sense tallar (527: 1 agulla en 57.000 triangles). Es compta a stats.degenerateForWebifc.
          let degW = 0;
          { const P = m.positions, I = m.indices, lim = 1e-10 * u * u; let deg = 0;
            for (let t = 0; t < I.length; t += 3) {
              const p = 3 * I[t], q = 3 * I[t + 1], r = 3 * I[t + 2];
              const ax = P[q] - P[p], ay = P[q + 1] - P[p + 1], az = P[q + 2] - P[p + 2], bx = P[r] - P[p], by = P[r + 1] - P[p + 1], bz = P[r + 2] - P[p + 2];
              if (Math.hypot(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx) <= lim) deg++;
            }
            degW = deg; if (deg) stats.degenerateForWebifc = (stats.degenerateForWebifc || 0) + deg; }
          const out = scaled(m, 1 / u);
          out.indices = Uint32Array.from(m.indices);
          memo.set(keyOf(out), X);
          if (memo.size > MAX) memo.delete(memo.keys().next().value);
          return { positions: out.positions, indices: out.indices, stats: { triangles: m.indices.length / 3, volume: v.volume / (u * u * u), reused: !!prev, degenerateForWebifc: degW } };
        } catch (e) { stats.failed++; throw e; }
      }
      return { webifcBool, webifcBoolStats: () => Object.assign({ memo: memo.size }, stats) };
    });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/brep/check.js
// geokernel · solids/brep/check — TANCAMENT TOPOLÒGIC EXACTE d'un BREP: per cada parell de vèrtexs, les arestes
// dirigides u→w han de ser tantes com les w→u (cada aresta té la seva bessona). Res de toleràncies: índexs de vèrtex.
// → { edges, naked, nonManifold, ok } · naked = arestes sense bessona (sòlid OBERT) · nonManifold = arestes compartides
// per més de 2 cares (p. ex. dues capses que es toquen per una aresta: és un resultat VÀLID, però cal saber-ho).
(function (def) {
  def('solids/brep/check', [], function () {
    function check(S) {
      const cnt = new Map();
      let edges = 0;
      for (const F of S.faces) for (const L of F.loops) for (let i = 0; i < L.length; i++) {
        const k = L[i] + ',' + L[(i + 1) % L.length];
        cnt.set(k, (cnt.get(k) || 0) + 1); edges++;
      }
      let naked = 0, nonManifold = 0;
      for (const [k, c] of cnt) {
        const [u, w] = k.split(',');
        const t = cnt.get(w + ',' + u) || 0;
        if (t < c) naked += c - t;
        if (c > 1 && +u < +w) nonManifold++;
      }
      return { edges, naked, nonManifold, ok: naked === 0 };
    }
    return { check };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/brep/concur.js
// geokernel · solids/brep/concur — VÈRTEXS DE ≥4 PLANS FETS CONCURRENTS EXACTAMENT, retocant plans dins de la tolerància.
// A la malla, un vèrtex de ≥4 cares és UN punt; els plans ajustats (mitjana dels vèrtexs de cada cara, arrodonida) no
// s'hi tallen exactament: cada cara en veu un de diferent i, si dues vores d'una cara són gairebé la mateixa recta, la
// seva «cantonada» llisca centímetres (2111 #463, desguàs: 217 mm). Aquí, abans de calcular els vèrtexs:
// · el punt del vèrtex = el triple de plans MÉS BEN CONDICIONAT (els «definidors»);
// · cada altre pla del vèrtex es retoca el mínim perquè hi passi EXACTAMENT: per 1 punt, desplaçament paral·lel; per 2,
//   gir mínim al voltant de la recta dels dos; per 3, el pla dels tres (més: només si el pla dels tres ja hi passa);
// · el retoc s'accepta només si TOTS els vèrtexs de la malla de les seves cares queden a ≤ distTol del pla nou;
// · un pla que defineix un vèrtex no es retoca mai (si ho hauria de ser, aquell vèrtex es deixa: stats.conflict).
// És el mateix pla de la cara (la mateixa superfície a ≤ distTol), triat perquè la topologia sigui exacta; els coeficients
// enters són més grans. concur(T, faces, inc, V, opts) → { changed: Map(pla vell → { id, sign }), stats }.
(function (def) {
  def('solids/brep/concur', ['solids/point', 'solids/exact/bigint'], function (PT, B) {
    // el pla per uns punts exactes, el més proper al pla p (punts homogenis [X,Y,Z,W], W>0)
    const MAX_BITS = 600;
    function fitPlane(T, p, pts) {
      if (pts.length === 1) {
        const [X, Y, Z, W] = pts[0].h;
        return { a: p.a * W, b: p.b * W, c: p.c * W, e: -(p.a * X + p.b * Y + p.c * Z) };
      }
      if (pts.length === 2) {
        const [X1, Y1, Z1, W1] = pts[0].h, [X2, Y2, Z2, W2] = pts[1].h;
        const t = [X2 * W1 - X1 * W2, Y2 * W1 - Y1 * W2, Z2 * W1 - Z1 * W2];   // direcció P1→P2 (escalada)
        const n = [p.a, p.b, p.c];
        const cr = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
        const u = cr(n, t), N = cr(t, u);   // normal: perpendicular a t, la més propera a n
        if (N[0] === 0n && N[1] === 0n && N[2] === 0n) return null;
        return { a: N[0] * W1, b: N[1] * W1, c: N[2] * W1, e: -(N[0] * X1 + N[1] * Y1 + N[2] * Z1) };
      }
      // 3 punts: el vector nul de la matriu 3×4 per menors
      const [r1, r2, r3] = pts.map((q) => q.h);
      const m = (i, j, k) => B.det3(r1[i], r1[j], r1[k], r2[i], r2[j], r2[k], r3[i], r3[j], r3[k]);
      const a = m(1, 2, 3), b = -m(0, 2, 3), c = m(0, 1, 3), e = -m(0, 1, 2);
      if (a === 0n && b === 0n && c === 0n) return null;
      return { a, b, c, e };
    }
    function cond(T, ids) {
      const n = ids.map((id) => T.normal(id)), [a, b, c] = n;
      return Math.abs(a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]));
    }
    function concur(T, faces, inc, V, opts) {
      const distTol = opts.distTol;   // stats.why: per què s'ha rebutjat cada pla (diagnosi)
      // vèrtexs de ≥4 plans, els pitjors primer (el seu triple és el que més mana)
      const list = [];
      for (const [v, set] of inc) if (set.size >= 4) list.push({ v, ids: [...set] });
      // primer els PITJOR condicionats (on els triples s'escampen més): són els que han de triar quin pla es retoca;
      // els ben condicionats s'hi adapten (eviten com a definidors els plans ja marcats per retocar)
      // en DOUBLE (només serveix per ordenar; abans, punts exactes BigInt: 14 s a 527)
      const G0 = Math.pow(2, T.gridExp);
      const pl3 = (id) => { const p = T.get(id); return [p.fa, p.fb, p.fc, p.fe / G0]; };
      const meet = (A, Bp, C) => {
        const d = A[0] * (Bp[1] * C[2] - Bp[2] * C[1]) - A[1] * (Bp[0] * C[2] - Bp[2] * C[0]) + A[2] * (Bp[0] * C[1] - Bp[1] * C[0]);
        if (!d) return null;
        const r = [-A[3], -Bp[3], -C[3]];
        const x = (r[0] * (Bp[1] * C[2] - Bp[2] * C[1]) - A[1] * (r[1] * C[2] - Bp[2] * r[2]) + A[2] * (r[1] * C[1] - Bp[1] * r[2])) / d;
        const y = (A[0] * (r[1] * C[2] - Bp[2] * r[2]) - r[0] * (Bp[0] * C[2] - Bp[2] * C[0]) + A[2] * (Bp[0] * r[2] - r[1] * C[0])) / d;
        const z = (A[0] * (Bp[1] * r[2] - r[1] * C[1]) - A[1] * (Bp[0] * r[2] - r[1] * C[0]) + r[0] * (Bp[0] * C[1] - Bp[1] * C[0])) / d;
        return [x, y, z];
      };
      const spread = (ids) => {
        const pts = [], L = ids.map(pl3);
        for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) for (let k = j + 1; k < ids.length; k++) { const p = meet(L[i], L[j], L[k]); if (p && p.every(Number.isFinite)) pts.push(p); }
        let d = 0; for (const a of pts) for (const b of pts) d = Math.max(d, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]));
        return d;
      };
      list.forEach((x) => { x.spread = spread(x.ids); });
      list.sort((x, y) => y.spread - x.spread);
      // si un retoc es rebutja (no hi ha pla dins de distTol), aquell pla passa a FIX (només pot definir) i es reparteix
      // de nou (p. ex. dues cares gairebé paral·leles: es retoca l'altra; 2111 #985)
      // cares per pla (un cop): la comprovació de cada pla retocat no ha de recórrer totes les cares (527: 50.000)
      const facesOf = new Map();
      for (const F of faces) { if (!facesOf.has(F.plane)) facesOf.set(F.plane, []); facesOf.get(F.plane).push(F); }
      const fixed = new Set();
      let res = null;
      for (let round = 0; round < 6; round++) {
        res = run(fixed);
        const bad = res.rejectedIds.filter((id) => !fixed.has(id));
        if (!bad.length) break;
        bad.forEach((id) => fixed.add(id));
      }
      res.stats.fixed = fixed.size;
      return { changed: res.changed, stats: res.stats };
      function run(fixed) {
      const stats = { vertices: 0, planes: 0, conflict: 0, rejected: 0, why: [], conflicts: [] }, adj = new Map(), defs = new Set(), rejectedIds = [];
      for (const { ids } of list) {
        // triples per condicionament, sense plans que ja s'hagin de retocar
        const tri = [];
        for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) for (let k = j + 1; k < ids.length; k++) tri.push([ids[i], ids[j], ids[k]]);
        // condicionament calculat UN cop per triple (el comparador el recalculava a cada comparació: 7 s a 527)
        const cv = new Map(tri.map((t) => [t, cond(T, t)]));
        tri.sort((x, y) => cv.get(y) - cv.get(x));
        let pick = null;
        const mustFix = ids.filter((id) => fixed.has(id));
        // entre els triples BEN condicionats (≥ la meitat del millor), el primer que respecta els rols ja assignats: cap pla
        // a retocar com a definidor, cap definidor a retocar (dues cares quasi coplanàries d'una paret: sempre la mateixa
        // fa de definidora; Spacewell). Si cap no els respecta, conflicte (el vèrtex es deixa).
        const c0 = tri.length ? cv.get(tri[0]) : 0;
        for (const t of tri) {
          if (cv.get(t) < 0.5 * c0) break;
          if (t.some((id) => adj.has(id)) || mustFix.some((id) => !t.includes(id))) continue;
          const p = PT.make(T, t[0], t[1], t[2]);
          if (!p) continue;
          const others = ids.filter((id) => !t.includes(id) && PT.side(T, id, Object.assign({}, p, { on: new Set() })) !== 0);
          if (others.some((id) => defs.has(id))) continue;
          pick = { t, p, others }; break;
        }
        if (!pick) {
          stats.conflict++;
          if (stats.conflicts.length < 6) stats.conflicts.push({ ids, cond: tri.map((t) => +cv.get(t).toFixed(4)), adj: ids.filter((id) => adj.has(id)), defs: ids.filter((id) => defs.has(id)), fixed: mustFix });
          continue;
        }
        const others = pick.others;
        if (!others.length) continue;   // ja concurrents
        pick.t.forEach((id) => defs.add(id));
        for (const id of others) { if (!adj.has(id)) adj.set(id, []); adj.get(id).push(pick.p); }
        stats.vertices++;
      }
      // retoc de cada pla
      const changed = new Map();
      const G = Math.pow(2, T.gridExp);
      for (const [id, pts0] of adj) {
        const seen = new Set(), pts = pts0.filter((q) => { const k = PT.key(q); if (seen.has(k)) return false; seen.add(k); return true; });
        const p = T.get(id);
        let pl = fitPlane(T, p, pts.slice(0, 3));
        if (pl && pts.length > 3) { const s = (q) => pl.a * q.h[0] + pl.b * q.h[1] + pl.c * q.h[2] + pl.e * q.h[3]; if (pts.slice(3).some((q) => s(q) !== 0n)) pl = null; }
        if (!pl) { stats.rejected++; stats.why.push({ plane: id, anchors: pts.length, reason: 'cap pla exacte pels punts' }); rejectedIds.push(id); continue; }
        // PRESSUPOST D'ENTERS: un pla ajustat per punts de plans ja ajustats creix sense límit (527: plans de 480 bits →
        // vèrtexs de 1.300 bits, mcd de minuts). Per sobre de MAX_BITS (reduït) es rebutja com qualsevol altre retoc
        // (el vèrtex el resol resolveVertices). Els casos de la bateria arriben a ~450 bits.
        { const g = B.gcdAll([pl.a, pl.b, pl.c, pl.e]); pl = { a: pl.a / g, b: pl.b / g, c: pl.c / g, e: pl.e / g, reduced: true };
          const big = [pl.a, pl.b, pl.c, pl.e].some((x) => (x < 0n ? -x : x).toString(2).length > MAX_BITS);
          if (big) { stats.rejected++; stats.why.push({ plane: id, anchors: pts.length, reason: 'enters massa grans (> ' + MAX_BITS + ' bits)' }); rejectedIds.push(id); continue; } }
        // compatible amb les dades: tots els vèrtexs de la malla de les cares d'aquest pla a ≤ distTol
        const fa = Number(pl.a), fb = Number(pl.b), fc = Number(pl.c), l = Math.hypot(fa, fb, fc), fe = Number(pl.e);
        const dist = (x) => (fa * x[0] * G + fb * x[1] * G + fc * x[2] * G + fe) / l / G;
        let ok = Number.isFinite(l) && l > 0, worst = 0;
        for (const F of facesOf.get(id) || []) if (ok) for (const L of F.loops) for (const v of L) { const d = Math.abs(dist(V[v])); worst = Math.max(worst, d); if (d > distTol) ok = false; }
        // el mateix sentit que el pla vell (el retoc és d'un angle minúscul)
        const n0 = T.normal(id), same = (n0[0] * fa + n0[1] * fb + n0[2] * fc) / l;
        if (!ok || !(Math.abs(same) > 0.999)) { stats.rejected++; stats.why.push({ plane: id, anchors: pts.length, worst, cos: same }); rejectedIds.push(id); continue; }
        const r = T.fromInts(pl.a, pl.b, pl.c, pl.e, pl.reduced);
        changed.set(id, { id: r.id, sign: r.sign * (same > 0 ? 1 : -1) });
        stats.planes++;
      }
      return { changed, stats, rejectedIds };
      }
    }
    return { concur, fitPlane };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/brep/corners.js
// geokernel · solids/brep/corners — NOMÉS DIAGNOSI (2026-11-11): el càlcul ja no les fa servir, perquè fromMesh fa els
// vèrtexs exactes i compartits (concur + resolveVertices). Serveixen per ENSENYAR el problema d'un vèrtex de ≥4 plans
// (/geo-apex, /geo-vertex, /geo-cas). CANTONADES EXACTES d'una cara: la cantonada i d'un contorn és el punt
// (pla de la cara, pla de l'aresta que hi entra, pla de l'aresta que en surt). Així cada aresta del contorn va d'una
// cantonada a la següent EXACTAMENT sobre la seva recta, encara que el vèrtex topològic sigui un vèrtex de més de 3 plans
// que no es tallen en un punt (dades reals). Si les dues arestes són sobre rectes paral·leles (vèrtex recte), es fa
// servir el punt del vèrtex. Es guarden a la cara (f._corners) i es calculen un sol cop.
(function (def) {
  def('solids/brep/corners', ['solids/point'], function (PT) {
    function corners(S, f) {
      if (f._corners) return f._corners;
      f._corners = f.loops.map((L, li) => {
        const E = f.epl[li], n = L.length;
        return L.map((v, i) => {
          const ep = E[(i - 1 + n) % n], en = E[i];
          if (ep === en) return S.verts[v];
          const c = PT.make(S.T, f.plane, ep, en);
          if (!c) return S.verts[v];
          c.on.add(f.plane);
          return c;
        });
      });
      return f._corners;
    }
    return { corners };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/brep/from-mesh.js
// geokernel · solids/brep/fromMesh — MALLA TANCADA → BREP PER PLANS.
// 1) soldadura de vèrtexs (opts.weld) i fora triangles degenerats; 2) cada aresta dirigida ha de tenir la seva bessona
// (malla tancada i manifold, si no LLANÇA); 3) triangles veïns quasi coplanaris → una cara (llavor = el triangle més gran);
// 4) el pla de cada cara s'ajusta (normal ponderada per àrea) i es CANONITZA a la taula T: si ja hi ha un pla dins de
// la tolerància es fa servir aquell (DECIDEIX la distància: tots els vèrtexs de la cara a menys d'opts.distTol; opts.angTol,
// 1e-3 rad, només és un primer filtre: una llesca llarga i prima té la normal sorollosa) → cares coplanàries de sòlids diferents comparteixen
// EXACTAMENT el mateix pla; 5) contorns de cada cara amb el pla de la cara veïna a cada aresta; 6) fora vèrtexs que
// només separen dues cares en línia recta; 7) cada vèrtex = triple de plans de les seves cares (el més ben condicionat),
// i declarat sobre TOTES les seves cares (incidència topològica).
// Resultat: { T, faces: [{ plane, sign, loops: [[v…]], epl: [[pla de l'aresta v_i → v_i+1]] }], verts: [punt] }.
(function (def) {
  def('solids/brep/fromMesh', ['solids/point', 'solids/plane/snap', 'solids/brep/twins', 'solids/brep/regularize', 'solids/brep/resolveVertices', 'solids/brep/concur', 'solids/brep/untwist'], function (PT, SNAP, TW, RG, RV, CC, UW) {
    function fromMesh(T, mesh, opts) {
      opts = opts || {};
      const weld = opts.weld || 1e-9, angTol = opts.angTol || 1e-3, distTol = opts.distTol || 1e-6;
      const P = mesh.positions, I = mesh.indices;
      // 1) soldadura
      const key = new Map(), V = [], remap = new Int32Array(P.length / 3);
      for (let i = 0; i < P.length / 3; i++) {
        const k = Math.round(P[3 * i] / weld) + ',' + Math.round(P[3 * i + 1] / weld) + ',' + Math.round(P[3 * i + 2] / weld);
        let id = key.get(k);
        if (id == null) { id = V.length; key.set(k, id); V.push([P[3 * i], P[3 * i + 1], P[3 * i + 2]]); }
        remap[i] = id;
      }
      const tris = [];
      for (let t = 0; t < I.length; t += 3) {
        const a = remap[I[t]], b = remap[I[t + 1]], c = remap[I[t + 2]];
        if (a === b || b === c || c === a) continue;
        const p = V[a], q = V[b], r = V[c];
        const u = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], v = [r[0] - p[0], r[1] - p[1], r[2] - p[2]];
        const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
        const ar = Math.hypot(n[0], n[1], n[2]);
        if (!(ar > 0)) continue;
        tris.push({ v: [a, b, c], n, ar, nu: [n[0] / ar, n[1] / ar, n[2] / ar], g: -1, f: mesh.faceOf ? mesh.faceOf[t / 3] : undefined });
      }
      // 2) bessones (radials a les arestes no-manifold)
      const tw = TW.twins(V, tris);
      // 3) CARES. Si cada triangle porta la seva CARA D'ORIGEN (mesh.faceOf: la IfcFace, el costat d'una extrusió, la cara
      // d'un resultat anterior…), una cara = els triangles amb el mateix identificador: cap decisió geomètrica. Si no,
      // creixement de regió per tolerància (només per a malles sense origen).
      const groups = [];
      if (tris.length && tris.every((t) => t.f != null)) {
        const byF = new Map();
        tris.forEach((t, ti) => { if (!byF.has(t.f)) byF.set(t.f, []); byF.get(t.f).push(ti); });
        for (const m of byF.values()) { const gi = groups.length; for (const ti of m) tris[ti].g = gi; groups.push(m); }
      }
      const order = tris.map((_, i) => i).sort((x, y) => tris[y].ar - tris[x].ar);
      // DEDUCCIÓ (només per a malles sense cara d'origen, i un sol cop: després el faceOf s'hereta). DECIDEIX LA DISTÀNCIA:
      // un triangle veí és de la cara si els seus 3 vèrtexs són a menys de distTol del pla del triangle llavor (el més gran,
      // el de normal més fiable) i mira cap al mateix costat. Sense criteri d'angle: un triangle llarg i prim amb un vèrtex
      // desplaçat 0,02 mm sembla girat però és de la cara (1677_27411, WEB-IFC 2026-11-09).
      for (const s of order) {
        if (tris[s].g >= 0) continue;
        const gi = groups.length, n0 = tris[s].nu, p0 = V[tris[s].v[0]];
        const dist = (x) => (x[0] - p0[0]) * n0[0] + (x[1] - p0[1]) * n0[1] + (x[2] - p0[2]) * n0[2];
        const members = [s]; tris[s].g = gi;
        for (let q = 0; q < members.length; q++) {
          const t = tris[members[q]];
          for (let k = 0; k < 3; k++) {
            const o = tw[3 * members[q] + k], to = tris[o];
            if (to.g >= 0) continue;
            const d = to.nu[0] * n0[0] + to.nu[1] * n0[1] + to.nu[2] * n0[2];
            if (d <= 0 || to.v.some((vi) => Math.abs(dist(V[vi])) > distTol)) continue;
            to.g = gi; members.push(o);
          }
        }
        groups.push(members);
      }
      // 4) pla de cada grup, canonitzat
      const gPlane = groups.map((m) => {
        const n = [0, 0, 0], c = [0, 0, 0]; let A = 0;
        const vs = new Set();
        for (const ti of m) { const t = tris[ti]; for (let k = 0; k < 3; k++) { n[k] += t.n[k]; for (const vi of t.v) c[k] += V[vi][k] * t.ar / 3; } A += t.ar; t.v.forEach((x) => vs.add(x)); }
        return SNAP.snap(T, n, [c[0] / A, c[1] / A, c[2] / A], [...vs].map((x) => V[x]), { angTol, distTol });
      });
      // cares = grups units si són veïns i tenen el mateix pla i el mateix sentit
      const uf = groups.map((_, i) => i), find = (x) => { while (uf[x] !== x) x = uf[x] = uf[uf[x]]; return x; };
      tris.forEach((t, ti) => { for (let k = 0; k < 3; k++) { const o = tris[tw[3 * ti + k]]; if (o.g !== t.g && gPlane[o.g].id === gPlane[t.g].id && gPlane[o.g].sign === gPlane[t.g].sign) uf[find(o.g)] = find(t.g); } });
      const faceOfGroup = new Map(), faces = [];
      groups.forEach((_, gi) => { const r = find(gi); if (!faceOfGroup.has(r)) { faceOfGroup.set(r, faces.length); faces.push({ plane: gPlane[r].id, sign: gPlane[r].sign, loops: [], epl: [], nbr: [] }); } });
      const faceOf = (ti) => faceOfGroup.get(find(tris[ti].g));
      // 5) contorns: arestes dirigides de frontera de cada cara
      const out = faces.map(() => new Map());   // per cara: vèrtex inicial → [{ to, nf }]
      tris.forEach((t, ti) => {
        const f = faceOf(ti);
        for (let k = 0; k < 3; k++) {
          const a = t.v[k], b = t.v[(k + 1) % 3], nf = faceOf(tw[3 * ti + k]);
          if (nf === f) continue;
          const m = out[f]; if (!m.has(a)) m.set(a, []); m.get(a).push({ to: b, nf });
        }
      });
      faces.forEach((F, fi) => {
        const m = out[fi];
        for (const [start, list] of m) {
          while (list.length) {
            const loop = [], nb = [];
            let cur = start;
            for (let guard = 0; ; guard++) {
              const l = m.get(cur);
              if (!l || !l.length) throw new Error('geokernel.fromMesh: contorn obert a la cara ' + fi);
              const e = l.pop(); loop.push(cur); nb.push(e.nf); cur = e.to;
              if (cur === start) break;
              if (guard > 1e7) throw new Error('geokernel.fromMesh: contorn infinit');
            }
            F.loops.push(loop); F.nbr.push(nb);
          }
        }
      });
      // 6) fora vèrtexs rectes (les dues arestes toquen la MATEIXA cara veïna)
      for (let changed = true; changed;) {
        changed = false;
        // un vèrtex només és «recte» si NOMÉS el comparteixen les dues cares: si n'hi ha més (una illa enganxada al contorn
        // per aquest vèrtex, 175 #22491), treure'l d'una cara i no de l'altra deixa arestes sense parella
        const nf = new Map();
        faces.forEach((F, fi) => F.loops.forEach((L) => L.forEach((v) => { if (!nf.has(v)) nf.set(v, new Set()); nf.get(v).add(fi); })));
        faces.forEach((F, fi) => { for (let li = 0; li < F.loops.length; li++) {
          const L = F.loops[li], N = F.nbr[li];
          for (let i = 0; i < L.length && L.length > 3; i++) {
            const prev = N[(i + L.length - 1) % L.length];
            // v_i entre les arestes N[i-1] i N[i]: si toquen la mateixa cara, l'aresta v_i-1 → v_i+1 hereta N[i-1]
            if (!(prev === N[i] && nf.get(L[i]).size === 2)) continue;
            // la cara veïna X és un TRIANGLE (contorn de 3) que conté v: és de gruix zero (v sobre la recta dels altres dos;
            // test2, UMDASH) i en treure v ja no queda res → X desapareix sencer i la seva 3a aresta, amb la cara G, passa a
            // aparellar-se amb F (abans: v es treia de F i no de X → BREP inconsistent, «vèrtex amb només 1 plans»)
            const X = faces[prev], xl = X.loops.findIndex((XL) => XL.length === 3 && XL.includes(L[i]));
            let inherit = prev;
            if (xl >= 0) {
              const XL = X.loops[xl], XN = X.nbr[xl], j = XL.indexOf(L[i]), p = XL[(j + 2) % 3], q = XL[(j + 1) % 3];
              const g = XN[(j + 1) % 3];   // la 3a aresta de X: q → p
              if (g === prev) continue;    // X es tanca amb ell mateix: no és aquest cas
              const G = faces[g];
              G.loops.forEach((GL, gl) => GL.forEach((w, k) => { if (w === p && GL[(k + 1) % GL.length] === q && G.nbr[gl][k] === prev) G.nbr[gl][k] = fi; }));
              X.loops.splice(xl, 1); X.nbr.splice(xl, 1);
              inherit = g;
            } else if (X.loops.some((XL) => XL.includes(L[i]) && XL.length <= 3)) continue;
            N[(i + L.length - 1) % L.length] = inherit;
            L.splice(i, 1); N.splice(i, 1); changed = true; i--;
          }
        } });
      }
      const incOf = () => { const m = new Map(); faces.forEach((F) => F.loops.forEach((L) => L.forEach((v) => { if (!m.has(v)) m.set(v, new Set()); m.get(v).add(F.plane); }))); return m; };
      for (let round = 0; round < 4; round++) {
        // 6b) vèrtexs de ≥4 plans → concurrents exactament, retocant plans dins de distTol (solids/brep/concur)
        if (opts.concur !== false) {
          const cc = CC.concur(T, faces, incOf(), V, { distTol });
          for (const F of faces) { const c = cc.changed.get(F.plane); if (c) { F.plane = c.id; F.sign *= c.sign; } }
          if (cc.stats.vertices || cc.stats.conflict || cc.stats.rejected) faces.concur = cc.stats;
        }
        // 6c) contorns creuats per un microsegment (un plec quasi pla que talla una paret a mm de la cantonada; sovint
        // només després dels retocs de 6b) → el segment es col·lapsa i el nou vèrtex de ≥4 plans torna a 6b i acaba a 9
        // (solids/brep/untwist). Fins que no en queda cap (màx. 4 voltes).
        if (opts.untwist === false) break;
        const u = UW.untwist(T, faces, incOf(), { maxLen: opts.untwistLen || 50 * distTol });
        if (!u.merged.size) break;
        faces.untwist = (faces.untwist || 0) + u.merged.size;
      }
      // 7) vèrtexs: plans incidents i triple
      const inc = new Map();
      faces.forEach((F) => F.loops.forEach((L) => L.forEach((v) => { if (!inc.has(v)) inc.set(v, new Set()); inc.get(v).add(F.plane); })));
      const verts = [], vid = new Map();
      for (const [v, set] of inc) {
        const ids = [...set];
        // menys de 3 plans: un vèrtex DINS d'un plec (dues cares del mateix pla, sentits oposats — test2, UMDASH, 540): cap pla
        // de cara en defineix el punt. Es completa amb plans AUXILIARS d'eix pel punt de la malla (com fa la regularització
        // amb les arestes de plec): només serveixen per calcular, no són plans de cap cara; la regularització (8) treu el plec.
        if (ids.length < 3 && ids.length >= 1) {
          const aux = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((n) => T.fromNormalPoint(n, V[v]).id).filter((id) => !set.has(id));
          const pt = bestTriple(T, ids.concat(aux), ids);
          if (pt) { for (const id of ids) pt.on.add(id); vid.set(v, verts.length); verts.push(pt); faces.auxVerts = (faces.auxVerts || 0) + 1; continue; }
        }
        if (ids.length < 3) {
          // diagnosi: on surt el vèrtex a cada contorn (anterior → v → següent)
          const where = []; faces.forEach((F, fi) => F.loops.forEach((L) => L.forEach((w, i) => { if (w === v) where.push('cara ' + fi + ' (pla ' + F.plane + (F.sign > 0 ? '+' : '−') + ')' + ': ' + L[(i + L.length - 1) % L.length] + '→' + v + '→' + L[(i + 1) % L.length] + ' (' + L.length + ')'); })));
          throw new Error('geokernel.fromMesh: vèrtex ' + v + ' amb només ' + ids.length + ' plans (' + V[v] + ') · ' + where.join(' · '));
        }
        const pt = bestTriple(T, ids);
        if (!pt) throw new Error('geokernel.fromMesh: els plans del vèrtex ' + v + ' no es tallen en un punt');
        for (const id of ids) pt.on.add(id);
        vid.set(v, verts.length); verts.push(pt);
      }
      for (const F of faces) {
        F.loops = F.loops.map((L) => L.map((v) => vid.get(v)));
        F.epl = F.nbr.map((N) => N.map((nf) => faces[nf].plane));
        delete F.nbr;
      }
      // 8) làmines de gruix zero i cares oposades sobre el mateix pla → regularització 2D exacta
      // 9) vèrtexs de ≥4 plans no concurrents → la seva geometria exacta (cadena de cantonades a cada cara);
      // opts.resolveVertices = false només per a la diagnosi (/geo-apex dibuixa el problema sense la correcció)
      const R = RG.regularize({ T, faces, verts });
      if (faces.concur) R.concur = faces.concur;
      if (faces.untwist) R.untwist = faces.untwist;
      if (faces.auxVerts) R.auxVerts = faces.auxVerts;
      return opts.resolveVertices === false ? R : RV.resolveVertices(R);
    }
    // el triple de plans més ben condicionat (|det| de les normals unitàries més gran)
    // req: plans que el triple ha de contenir tots (si n'hi ha ≤ 3)
    function bestTriple(T, ids, req) {
      const n = ids.map((id) => T.normal(id));
      let best = null, bd = 0;
      for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) for (let k = j + 1; k < ids.length; k++) {
        const a = n[i], b = n[j], c = n[k];
        const d = Math.abs(a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]));
        if (req && !req.every((r) => r === ids[i] || r === ids[j] || r === ids[k])) continue;
        if (d > bd) { bd = d; best = [ids[i], ids[j], ids[k]]; }
      }
      return best ? PT.make(T, best[0], best[1], best[2]) : null;
    }
    return { fromMesh, bestTriple };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/brep/output-weld.js
// geokernel · solids/brep/outputWeld — NETEJA DE SORTIDA (només per a la malla; el BREP no es toca): els vèrtexs que en
// coma flotant queden a menys de `tol` (micro-arestes exactes d'~1e-10 entre plans gairebé concurrents) passen a ser un
// sol vèrtex de sortida, el MATEIX per a totes les cares → cap esquerda entre cares. Després, als contorns: fora punts
// repetits seguits i puntes de gruix zero (… a b a …). weld(positions, tol) → { positions, map } ·
// cleanLoop(L) → contorn net (pot quedar amb < 3 punts: aleshores la cara ja no hi aporta res).
(function (def) {
  def('solids/brep/outputWeld', [], function () {
    function weld(P, tol) {
      const n = P.length / 3, map = new Int32Array(n), out = [], grid = new Map();
      // claus numèriques (hash) i comprovació de la cel·la de cada candidat: el mateix resultat que amb claus de text
      const cell = (x) => Math.floor(x / tol), key = (i, j, k) => (Math.imul(i, 73856093) ^ Math.imul(j, 19349663) ^ Math.imul(k, 83492791)) | 0, wc = [];
      for (let v = 0; v < n; v++) {
        const x = P[3 * v], y = P[3 * v + 1], z = P[3 * v + 2], ci = cell(x), cj = cell(y), ck = cell(z);
        let found = -1;
        for (let a = -1; a <= 1 && found < 0; a++) for (let b = -1; b <= 1 && found < 0; b++) for (let c = -1; c <= 1 && found < 0; c++) {
          const I = ci + a, J = cj + b, K = ck + c, l = grid.get(key(I, J, K)); if (!l) continue;
          for (const w of l) if (wc[w][0] === I && wc[w][1] === J && wc[w][2] === K && Math.abs(out[3 * w] - x) <= tol && Math.abs(out[3 * w + 1] - y) <= tol && Math.abs(out[3 * w + 2] - z) <= tol) { found = w; break; }
        }
        if (found < 0) { found = out.length / 3; out.push(x, y, z); wc.push([ci, cj, ck]); const k = key(ci, cj, ck); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(found); }
        map[v] = found;
      }
      return { positions: Float64Array.from(out), map };
    }
    function cleanLoop(L) {
      let r = L.slice();
      for (let changed = true; changed && r.length >= 3;) {
        changed = false;
        for (let i = 0; i < r.length && r.length >= 3; i++) {
          const n = r.length, prev = r[(i - 1 + n) % n], next = r[(i + 1) % n];
          if (r[i] === next) { r.splice(i, 1); changed = true; i--; continue; }            // repetit seguit
          if (prev === next) { r.splice(i, 1); changed = true; i--; continue; }            // punta a → b → a: fora b (i el doble a cau a la volta següent)
        }
      }
      return r;
    }
    // CONFORMITAT DE SORTIDA en 3D, igual per a totes les cares: un vèrtex de sortida que cau a menys de `tol` de
    // l'interior d'una aresta d'un contorn s'hi insereix (contorns pinçats, juntes en T) → les cares veïnes parteixen la
    // mateixa aresta pels mateixos punts. loops: [[v…]…] (de totes les cares) → loops nous.
    function conform(P, loops, tol) {
      // GRAELLES PER NIVELLS (mida cs·4^k): cada aresta busca al nivell on la seva caixa (+tol) ocupa ≤ 27 cel·les (més cel·les = més consultes: 4096 → 56 s a 527, 27 → 5 s) → mai
      // un recorregut de tots els vèrtexs (527: 100.000 vèrtexs × arestes llargues = desenes de segons)
      const n = P.length / 3, cs0 = Math.max(tol * 64, 1e-12), gk = (i, j, k) => i + ',' + j + ',' + k, levels = [];
      let span = 0; for (let i = 0; i < P.length; i++) span = Math.max(span, Math.abs(P[i]));
      for (let cs = cs0; ; cs *= 4) {
        const grid = new Map(), ci = (x) => Math.floor(x / cs);
        for (let v = 0; v < n; v++) { const k = gk(ci(P[3 * v]), ci(P[3 * v + 1]), ci(P[3 * v + 2])); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(v); }
        levels.push({ cs, grid, ci });
        if (cs > 2 * span + 1) break;
      }
      const near = (a, b) => {
        for (const { grid, ci } of levels) {
          const lo = [0, 1, 2].map((k) => ci(Math.min(P[3 * a + k], P[3 * b + k]) - tol)), hi = [0, 1, 2].map((k) => ci(Math.max(P[3 * a + k], P[3 * b + k]) + tol));
          if ((hi[0] - lo[0] + 1) * (hi[1] - lo[1] + 1) * (hi[2] - lo[2] + 1) > 27) continue;
          const out = [];
          for (let i = lo[0]; i <= hi[0]; i++) for (let j = lo[1]; j <= hi[1]; j++) for (let k = lo[2]; k <= hi[2]; k++) { const l = grid.get(gk(i, j, k)); if (l) out.push(...l); }
          return out;
        }
        return null;
      };
      return loops.map((L) => {
        const out = [];
        for (let i = 0; i < L.length; i++) {
          const a = L[i], b = L[(i + 1) % L.length];
          out.push(a);
          const d = [P[3 * b] - P[3 * a], P[3 * b + 1] - P[3 * a + 1], P[3 * b + 2] - P[3 * a + 2]], L2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
          if (!(L2 > 0)) continue;
          const cand = near(a, b) || Array.from({ length: n }, (_, v) => v), ins = [];
          for (const v of cand) {
            if (v === a || v === b) continue;
            const t = ((P[3 * v] - P[3 * a]) * d[0] + (P[3 * v + 1] - P[3 * a + 1]) * d[1] + (P[3 * v + 2] - P[3 * a + 2]) * d[2]) / L2;
            if (t <= 1e-12 || t >= 1 - 1e-12) continue;
            const ex = P[3 * a] + t * d[0] - P[3 * v], ey = P[3 * a + 1] + t * d[1] - P[3 * v + 1], ez = P[3 * a + 2] + t * d[2] - P[3 * v + 2];
            if (ex * ex + ey * ey + ez * ez <= tol * tol) ins.push([t, v]);
          }
          ins.sort((x, y) => x[0] - y[0]);
          for (const [, v] of ins) out.push(v);
        }
        return out;
      });
    }
    // REENCADENA els contorns d'una cara de sortida: arestes dirigides de tots els contorns; les parelles u→v / v→u
    // s'anul·len (dues vores d'una llesca exacta de ~1e-10 que la soldadura ha fet coincidir); les que queden es tornen a
    // encadenar girant al màxim cap a la DRETA a cada vèrtex (la regió sempre a l'esquerra) → contorns simples.
    // loops: [[v…]…], P2: v → [x, y] (pla de la cara, CCW vist des de fora) → loops.
    function rechain(loops, P2) {
      const cnt = new Map(), ek = (u, v) => u + ',' + v;
      for (const L of loops) for (let i = 0; i < L.length; i++) { const u = L[i], v = L[(i + 1) % L.length]; if (u === v) continue; const k = ek(u, v), r = ek(v, u); if ((cnt.get(r) || 0) > 0) cnt.set(r, cnt.get(r) - 1); else cnt.set(k, (cnt.get(k) || 0) + 1); }
      const out = new Map();
      for (const [k, c] of cnt) { if (c <= 0) continue; const [u, v] = k.split(',').map(Number); for (let i = 0; i < c; i++) { if (!out.has(u)) out.set(u, []); out.get(u).push(v); } }
      const ang = (u, v) => Math.atan2(P2(v)[1] - P2(u)[1], P2(v)[0] - P2(u)[0]);
      const res = [];
      for (const [s] of out) {
        while (out.get(s) && out.get(s).length) {
          const L = []; let prev = null, cur = s, guard = 0;
          do {
            const l = out.get(cur);
            if (!l || !l.length) break;
            let j = 0;
            if (l.length > 1 && prev != null) {
              // gir més a la dreta respecte de la direcció d'arribada
              const back = ang(cur, prev);
              let best = Infinity;
              l.forEach((v, i) => { let d = back - ang(cur, v); while (d <= 0) d += 2 * Math.PI; while (d > 2 * Math.PI) d -= 2 * Math.PI; if (d < best) { best = d; j = i; } });   // primer en sentit HORARI des de la tornada
            }
            const nx = l.splice(j, 1)[0];
            L.push(cur); prev = cur; cur = nx;
          } while (cur !== s && ++guard < 1e6);
          if (L.length >= 3) res.push(L);
        }
      }
      return res;
    }
    return { weld, cleanLoop, conform, rechain };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/brep/regularize.js
// geokernel · solids/brep/regularize — REGULARITZA un BREP d'entrada: a cada pla amb cares dels DOS sentits (o amb arestes
// de plec, on la cara veïna és al mateix pla) es fa la resta 2D exacta: queden les cares + que no tapa cap cara − i al
// revés. Les LÀMINES DE GRUIX ZERO (dues cares oposades que se solapen) desapareixen. Una aresta de plec no té cap pla
// veí que en defineixi la recta: se li dona un pla auxiliar exacte (plane/through), que només serveix per calcular.
// Si no hi ha res a regularitzar, retorna el mateix sòlid. → sòlid (nou) muntat amb solids/boolean/assemble.
(function (def) {
  def('solids/brep/regularize', ['solids/plane2d/frame', 'solids/region2d/evaluate', 'solids/region2d/reverse', 'solids/boolean/assemble', 'solids/plane/through', 'solids/point'], function (FR, EV, RV, AS, TH, PT) {
    function regularize(S) {
      const T = S.T, byPlane = new Map();
      S.faces.forEach((f) => { if (!byPlane.has(f.plane)) byPlane.set(f.plane, []); byPlane.get(f.plane).push(f); });
      const irregular = new Set();
      for (const [P, fs] of byPlane) {
        const signs = new Set(fs.map((f) => f.sign));
        if (signs.size > 1 || fs.some((f) => f.epl.some((E) => E.includes(P)))) irregular.add(P);
      }
      if (!irregular.size) return S;
      const out = [];
      for (const [P, fs] of byPlane) {
        if (!irregular.has(P)) { for (const f of fs) out.push({ plane: P, sign: f.sign, loops: f.loops.map((L, li) => ({ pts: L.map((v) => S.verts[v]), X: f.epl[li].slice() })) }); continue; }
        const F = FR.frame(T, P), ops = [[], []];
        for (const f of fs) {
          f.loops.forEach((L, li) => {
            for (let i = 0; i < L.length; i++) {
              let a = S.verts[L[i]], b = S.verts[L[(i + 1) % L.length]];
              if (PT.equal(a, b)) continue;
              if (f.sign < 0) { const t = a; a = b; b = t; }
              let X = f.epl[li][i];
              if (X === P) X = TH.throughPointsDir(T, a, b, P).id;
              ops[f.sign > 0 ? 0 : 1].push({ a, b, X, s: F.sense(X, a, b) });
            }
          });
        }
        const [plus, minus] = EV.evaluate(T, F, ops, [(w) => w[0] > 0 && !(w[1] > 0), (w) => w[1] > 0 && !(w[0] > 0)]);
        if (plus.length) out.push({ plane: P, sign: 1, loops: plus });
        if (minus.length) out.push({ plane: P, sign: -1, loops: minus.map(RV.reverseLoop) });
      }
      const R = AS.assemble(T, out);
      R.stats = { regularized: irregular.size };
      return R;
    }
    return { regularize };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/brep/resolve-vertices.js
// geokernel · solids/brep/resolveVertices — VÈRTEXS DE ≥4 PLANS NO CONCURRENTS → la seva geometria EXACTA.
// 4 plans gairebé mai es tallen en un punt: on la malla diu «un vèrtex», els plans exactes hi fan un poliedre minúscul
// (~1e-11 m) amb arestes curtes sobre rectes de plans NO veïns. Si el BREP diu «un punt», cada cara en veu un de diferent
// i un pla que passa per allà els veu a banda i banda: la secció surt oberta (Fixtures/fails/vertex-4-plans-tall-per-apex).
// Aquí, un sol cop en construir el BREP, cada vèrtex així se substitueix a cada cara per la cadena exacta de cantonades
// del poliedre local: cap pla nou (les arestes curtes són sobre rectes de dos plans originals), tot amb predicats exactes.
// · Convex: el sòlid a prop del vèrtex = ∩ semiespais de les seves cares; còncau: el complement d'∩ dels de fora; en sella
//   (barreja) es deixa com estava (stats.saddle).
// · Per a cada cara i, es camina per la recta i∩(aresta d'entrada) cap al vèrtex; a la PRIMERA recta i∩j on se surt del
//   semiespai j es gira cap a i∩j (en el sentit que entra al semiespai d'on venim); s'acaba en arribar a l'aresta de sortida.
// · Coherència: cada aresta curta (i, j) ha d'aparèixer a la cara j en sentit contrari; si no, el vèrtex no es toca
//   (stats.aborted). Vèrtexs de plans exactament concurrents: no es toquen.
// resolveVertices(S) → S (modificat) amb S.resolved = { vertices, saddle, aborted }.
(function (def) {
  def('solids/brep/resolveVertices', ['solids/point'], function (PT) {
    const sgn = (x) => (x > 0n ? 1 : x < 0n ? -1 : 0);
    function resolveVertices(S) {
      const T = S.T, stats = { vertices: 0, saddle: 0, aborted: 0 };
      // incidència: vèrtex → [{ f, li, i }]
      const inc = new Map();
      S.faces.forEach((f, fi) => f.loops.forEach((L, li) => L.forEach((v, i) => { if (!inc.has(v)) inc.set(v, []); inc.get(v).push({ fi, li, i }); })));
      const repl = new Map();   // 'fi,li,i' → { pts: [punt], pl: [pla de l'aresta que surt de cada punt] }
      for (const [v, occ] of inc) {
        if (occ.length < 4) continue;
        const planes = occ.map((o) => S.faces[o.fi].plane);
        if (new Set(planes).size !== planes.length) continue;   // dues cares del mateix pla al vèrtex: fora d'abast
        const signOf = new Map(occ.map((o) => [S.faces[o.fi].plane, S.faces[o.fi].sign]));
        // plans exactament concurrents? (tots els triples al mateix punt)
        const V = S.verts[v], free = (p) => Object.assign({}, p, { on: new Set() });
        if (planes.every((pl) => PT.side(T, pl, free(V)) === 0)) continue;
        // convex / còncau / sella, pels vèrtexs veïns de cada cara
        let neg = false, pos = false;
        for (const o of occ) {
          const L = S.faces[o.fi].loops[o.li], n = L.length;
          for (const u of [L[(o.i - 1 + n) % n], L[(o.i + 1) % n]]) for (const pl of planes) { const s = signOf.get(pl) * PT.side(T, pl, S.verts[u]); if (s < 0) neg = true; if (s > 0) pos = true; }
        }
        if (neg && pos) { stats.saddle++; continue; }
        const sigma = pos ? -1 : 1;   // convex: dins = darrere de les cares (σ=+1); còncau: dins = davant (σ=−1)
        const res = [];
        let ok = true;
        for (const o of occ) {
          const r = walk(T, S, o, planes, signOf, sigma);
          if (!r) { ok = false; break; }
          res.push({ o, r });
        }
        // coherència: cada aresta curta (a→b sobre i∩j a la cara i) ha de ser b→a a la cara j
        if (ok) {
          const E = new Set();
          for (const { o, r } of res) for (let k = 0; k + 1 < r.pts.length; k++) E.add(S.faces[o.fi].plane + '|' + r.pl[k] + '|' + PT.key(r.pts[k]) + '|' + PT.key(r.pts[k + 1]));
          for (const { o, r } of res) for (let k = 0; k + 1 < r.pts.length; k++) if (!E.has(r.pl[k] + '|' + S.faces[o.fi].plane + '|' + PT.key(r.pts[k + 1]) + '|' + PT.key(r.pts[k]))) ok = false;
          // i les arestes llargues (entrada / sortida) han d'acabar al mateix punt a les dues cares
          const endIn = new Map(), endOut = new Map();
          for (const { o, r } of res) { const p = S.faces[o.fi].plane; endIn.set(p + '|' + r.ep, PT.key(r.pts[0])); endOut.set(p + '|' + r.en, PT.key(r.pts[r.pts.length - 1])); }
          for (const { o, r } of res) { const p = S.faces[o.fi].plane; if (endOut.get(r.ep + '|' + p) !== endIn.get(p + '|' + r.ep)) ok = false; }
        }
        if (!ok) { stats.aborted++; continue; }
        stats.vertices++;
        for (const { o, r } of res) repl.set(o.fi + ',' + o.li + ',' + o.i, r);
      }
      if (!repl.size) { S.resolved = stats; return S; }
      // aplicar: vèrtexs nous compartits per clau exacta
      const vid = new Map();
      const idOf = (p) => { const k = PT.key(p); let id = vid.get(k); if (id == null) { id = S.verts.length; S.verts.push(p); vid.set(k, id); } return id; };
      S.faces.forEach((f, fi) => {
        f.loops = f.loops.map((L, li) => {
          const nl = [], ne = [];
          L.forEach((v, i) => {
            const r = repl.get(fi + ',' + li + ',' + i);
            if (!r) { nl.push(v); ne.push(f.epl[li][i]); return; }
            r.pts.forEach((p, k) => { nl.push(idOf(p)); ne.push(k + 1 < r.pts.length ? r.pl[k] : f.epl[li][i]); });
          });
          f.epl[li] = ne;
          return nl;
        });
        delete f._corners;
      });
      S.resolved = stats;
      return S;
    }
    // la cadena exacta de cantonades de la cara o al vèrtex: { pts, pl, ep, en } o null si no es pot decidir
    function walk(T, S, o, planes, signOf, sigma) {
      const f = S.faces[o.fi], L = f.loops[o.li], E = f.epl[o.li], n = L.length;
      const ep = E[(o.i - 1 + n) % n], en = E[o.i], P = f.plane, nrm = (id) => { const p = T.get(id); return [p.a, p.b, p.c]; };
      const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const dt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      // paràmetre exacte sobre la recta (direcció D): t = D·H / W → compara t(p) amb t(q) sense dividir
      const cmpT = (D, p, q) => sgn(dt(D, p.h) * q.h[3] - dt(D, q.h) * p.h[3]);
      let X = ep, D = cr(nrm(P), nrm(X));
      let cur = S.verts[L[(o.i - 1 + n) % n]];
      const s0 = cmpT(D, S.verts[L[o.i]], cur);   // de u cap al vèrtex
      if (!s0) return null;
      let s = s0;
      const pts = [], pl = [];
      for (let step = 0; step <= planes.length; step++) {
        // primera sortida d'un semiespai j per davant de cur
        let best = null, ties = [];
        for (const j of planes) {
          if (j === P || j === X) continue;
          const nd = dt(nrm(j), D);
          if (nd === 0n) continue;
          if (sigma * signOf.get(j) * s * sgn(nd) <= 0) continue;   // hi entra (o paral·lel): no és una sortida
          const q = PT.make(T, P, X, j);
          if (!q) continue;
          if (s * cmpT(D, q, cur) <= 0) continue;   // darrere de la posició actual
          if (!best) { best = { j, q }; ties = []; continue; }
          const c = s * cmpT(D, q, best.q);
          if (c < 0) { best = { j, q }; ties = []; } else if (c === 0) ties.push(j);
        }
        if (!best || ties.length) return null;   // res o empat (plans concurrents en part): no es decideix aquí
        pts.push(best.q);
        if (best.j === en) return { pts, pl, ep, en };
        pl.push(best.j);
        // gir cap a P∩j, en el sentit que entra al semiespai de X (d'on venim)
        const D2 = cr(nrm(P), nrm(best.j)), nx = dt(nrm(X), D2);
        if (nx === 0n) return null;
        const s2 = -sigma * signOf.get(X) * sgn(nx);
        X = best.j; D = D2; s = s2; cur = best.q;
      }
      return null;
    }
    return { resolveVertices };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/brep/to-mesh.js
// geokernel · solids/brep/toMesh — BREP → MALLA de triangles { positions, indices, faceOf } (faceOf[t] = cara
// d'origen de cada triangle, el que demana WEB-IFC). Cada cara es triangula en el seu pla (es descarta l'eix dominant
// de la normal), amb TOTS els vèrtexs dels contorns (keepCollinear) → les juntes amb les cares veïnes no deixen T.
// Abans, neteja de sortida (outputWeld): els vèrtexs a menys de 1e-9 de l'escala són un sol vèrtex de sortida per a totes
// les cares (micro-arestes exactes que el triangulador en coma flotant veuria com a contorns que es creuen).
(function (def) {
  def('solids/brep/toMesh', ['solids/point', '2d/triangulate/region', 'solids/brep/outputWeld', '2d/triangulate/untangle', '2d/triangulate/flipSlivers'], function (PT, TRI, OW, UT, FS) {
    function toMesh(S, opts) {
      const T = S.T;
      const raw = new Float64Array(S.verts.length * 3);
      let span = 0;
      S.verts.forEach((v, i) => { const c = PT.coords(T, v); raw[3 * i] = c[0]; raw[3 * i + 1] = c[1]; raw[3 * i + 2] = c[2]; span = Math.max(span, Math.abs(c[0]), Math.abs(c[1]), Math.abs(c[2])); });
      const tol = (opts && opts.weld) || 1e-9 * (span + 1);
      const W = OW.weld(raw, tol), pos = W.positions;
      // contorns de sortida: soldats, nets i conformes (els vèrtexs que cauen sobre una aresta hi entren, a totes les cares)
      const flat = [], owner = [];
      S.faces.forEach((F, fi) => F.loops.forEach((L) => { flat.push(OW.cleanLoop(L.map((v) => W.map[v]))); owner.push(fi); }));
      const conf = OW.conform(pos, flat, tol).map(OW.cleanLoop);
      const idx = [], faceOf = [];
      S.faces.forEach((F, fi) => {
        const n = T.normal(F.plane, F.sign);
        let k = 0; if (Math.abs(n[1]) > Math.abs(n[k])) k = 1; if (Math.abs(n[2]) > Math.abs(n[k])) k = 2;
        let a = (k + 1) % 3, b = (k + 2) % 3; if (n[k] < 0) { const t = a; a = b; b = t; }
        const p2 = (v) => [pos[3 * v + a], pos[3 * v + b]];
        // els lòbuls d'un contorn pinçat (passa dues vegades pel mateix vèrtex) es separen
        const own = conf.filter((_, i) => owner[i] === fi).filter((L) => L.length >= 3);
        const P2 = []; for (const L of own) for (const v of L) P2[v] = p2(v);
        const loops = UT.untangle(P2, OW.rechain(own, p2), 0);   // fora llesques de gruix ~0, després els lòbuls pinçats
        if (!loops.length) return;
        const ids = [].concat(...loops);
        let r;
        try { r = TRI.triangulateRegion(loops.map((L) => L.map(p2)), { keepCollinear: true }); }
        catch (e) { e.message = 'geokernel.toMesh: no es pot triangular la cara ' + fi + ' (pla ' + F.plane + '): ' + e.message; throw e; }
        // fora triangles agulla (alçada < 1e-6 de l'aresta llarga): web-ifc els treu com a degenerats i la malla s'obriria
        const tris = opts && opts.flipSlivers === false ? r.tris : FS.flipSlivers(r.pts, r.tris).tris;
        for (const t of tris) { idx.push(ids[t[0]], ids[t[1]], ids[t[2]]); faceOf.push(fi); }
      });
      return { positions: pos, indices: Uint32Array.from(idx), faceOf: Int32Array.from(faceOf) };
    }
    return { toMesh };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/brep/twins.js
// geokernel · solids/brep/twins — BESSONA de cada aresta de cada triangle (el triangle de l'altre costat).
// Aresta normal: un triangle u→w i un w→u. Aresta NO-MANIFOLD (4, 6… triangles: dos sòlids que es toquen per una
// aresta): ordenació RADIAL al voltant de l'aresta; un triangle u→w té la normal cap a l'angle creixent, per tant el
// material és cap a l'angle decreixent i la seva bessona és l'anterior (que ha d'anar w→u). Si no alternen → LLANÇA.
// twins(V, tris) → Int32Array tw[3·t + k] = triangle bessó de l'aresta k (v_k → v_k+1) de t.
(function (def) {
  def('solids/brep/twins', [], function () {
    function twins(V, tris) {
      const tw = new Int32Array(tris.length * 3).fill(-1), ed = new Map();
      tris.forEach((t, ti) => { for (let k = 0; k < 3; k++) { const a = t.v[k], b = t.v[(k + 1) % 3], key = a < b ? a + ',' + b : b + ',' + a; if (!ed.has(key)) ed.set(key, []); ed.get(key).push({ ti, k, fwd: a < b }); } });
      for (const [key, l] of ed) {
        const nf = l.filter((x) => x.fwd).length;
        if (nf * 2 !== l.length) throw new Error((nf === l.length || nf === 0) && l.length === 1 ? 'geokernel.fromMesh: malla oberta (aresta nua ' + key + ')' : 'geokernel.fromMesh: aresta ' + key + ' amb ' + nf + ' triangles en un sentit i ' + (l.length - nf) + ' en l\'altre (oberta o mal orientada)');
        if (l.length === 2) { tw[3 * l[0].ti + l[0].k] = l[1].ti; tw[3 * l[1].ti + l[1].k] = l[0].ti; continue; }
        // radial
        const [u, w] = key.split(',').map(Number), U = V[u], d = [V[w][0] - U[0], V[w][1] - U[1], V[w][2] - U[2]];
        const dl = Math.hypot(...d); d[0] /= dl; d[1] /= dl; d[2] /= dl;
        const e1 = Math.abs(d[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
        const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
        const x = cross(cross(d, e1), d), xl = Math.hypot(...x); x[0] /= xl; x[1] /= xl; x[2] /= xl;
        const y = cross(d, x);
        for (const it of l) {
          const t = tris[it.ti].v, c = t[(it.k + 2) % 3], r = [V[c][0] - U[0], V[c][1] - U[1], V[c][2] - U[2]];
          it.ang = Math.atan2(dot(r, y), dot(r, x));
        }
        l.sort((p, q) => p.ang - q.ang);
        for (let i = 0; i < l.length; i++) {
          if (!l[i].fwd) continue;
          const j = (i - 1 + l.length) % l.length;
          if (l[j].fwd) throw new Error('geokernel.fromMesh: aresta no-manifold ' + key + ' sense alternança de sentits (sòlids encreuats?)');
          tw[3 * l[i].ti + l[i].k] = l[j].ti; tw[3 * l[j].ti + l[j].k] = l[i].ti;
        }
      }
      return tw;
    }
    return { twins };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/brep/untwist.js
// geokernel · solids/brep/untwist — CONTORNS CREUATS PER UN MICROSEGMENT (pas 6a de fromMesh).
// Dos plans quasi coplanaris (un plec de 0,24° a la llosa) tallen una paret a 2 mm de la cantonada: la malla hi té dos
// vèrtexs a 2 mm, però en exacte el plec creua l'altra paret ABANS d'arribar-hi i el contorn de la cara fa un llaç
// (… a → x → y → b …, amb a→x creuant y→b). Cap tolerància no ho arregla; la topologia de la malla és la que no casa.
// Correcció: el microsegment x→y (≤ maxLen) es COL·LAPSA a totes les cares (x i y passen a ser un sol vèrtex); el vèrtex
// queda amb ≥ 4 plans i el resolen concur / resolveVertices, que en calculen la topologia exacta.
// Els vèrtexs es mesuren en EXACTE (triple de plans més ben condicionat, aproximat en double per al test de creuament).
// untwist(T, faces, inc, opts) → { merged: Map(y → x), stats } — muta F.loops / F.nbr (ids de vèrtex de malla).
// No col·lapsa mai un segment si algun contorn quedaria amb < 3 vèrtexs.
(function (def) {
  def('solids/brep/untwist', ['solids/point'], function (PT) {
    function bestPoint(T, ids) {
      const n = ids.map((id) => T.normal(id));
      let best = null, bd = 0;
      for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) for (let k = j + 1; k < ids.length; k++) {
        const a = n[i], b = n[j], c = n[k];
        const d = Math.abs(a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]));
        if (d > bd) { bd = d; best = [ids[i], ids[j], ids[k]]; }
      }
      return best && PT.make(T, best[0], best[1], best[2]);
    }
    // creuament PROPI de dos segments 2D (els extrems compartits no compten)
    const orient = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    function crosses(a, b, c, d) {
      const d1 = orient(a, b, c), d2 = orient(a, b, d), d3 = orient(c, d, a), d4 = orient(c, d, b);
      return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
    }
    function untwist(T, faces, inc, opts) {
      const maxLen = opts.maxLen, stats = { checked: 0, twisted: 0, collapsed: 0, skipped: 0 };
      const pos = new Map(), at = (v) => { let p = pos.get(v); if (p === undefined) { const q = bestPoint(T, [...inc.get(v)]); p = q ? PT.coords(T, q) : null; pos.set(v, p); } return p; };
      const merged = new Map();
      for (const F of faces) {
        const n = T.normal(F.plane);
        let k = 0; if (Math.abs(n[1]) > Math.abs(n[k])) k = 1; if (Math.abs(n[2]) > Math.abs(n[k])) k = 2;
        const a2 = (k + 1) % 3, b2 = (k + 2) % 3;
        for (const L of F.loops) {
          const m = L.length; if (m < 4) continue;
          stats.checked++;
          const P2 = L.map((v) => { const p = at(v); return p && [p[a2], p[b2]]; });
          if (P2.some((p) => !p)) continue;
          // només el patró del llaç petit: aresta i creua aresta i+2 (separades per UNA aresta curta)
          for (let i = 0; i < m; i++) {
            const i1 = (i + 1) % m, i2 = (i + 2) % m, i3 = (i + 3) % m;
            if (!crosses(P2[i], P2[i1], P2[i2], P2[i3])) continue;
            stats.twisted++;
            const x = L[i1], y = L[i2], px = at(x), py = at(y);
            const len = Math.hypot(px[0] - py[0], px[1] - py[1], px[2] - py[2]);
            if (len > maxLen) { stats.skipped++; continue; }
            if (!merged.has(y) && !merged.has(x)) merged.set(y, x);
          }
        }
      }
      if (!merged.size) return { merged, stats };
      // no col·lapsar si algun contorn quedaria amb < 3 vèrtexs
      const rep = (v) => merged.get(v) ?? v;
      for (const F of faces) for (const L of F.loops) {
        const r = []; for (const v of L) { const w = rep(v); if (r[r.length - 1] !== w) r.push(w); }
        if (r.length > 1 && r[0] === r[r.length - 1]) r.pop();
        if (r.length < 3) for (const v of L) if (merged.has(v)) { merged.delete(v); stats.skipped++; }
      }
      // aplicar: a cada contorn, y → x, i fora l'aresta x→y (la seva veïna N[i] se'n va amb ella)
      for (const F of faces) for (let li = 0; li < F.loops.length; li++) {
        const L = F.loops[li], N = F.nbr[li], R = [], RN = [];
        for (let i = 0; i < L.length; i++) {
          const w = rep(L[i]);
          if (R.length && R[R.length - 1] === w) { RN[RN.length - 1] = N[i]; continue; }
          R.push(w); RN.push(N[i]);
        }
        if (R.length > 1 && R[0] === R[R.length - 1]) { R.pop(); RN.pop(); }
        F.loops[li] = R; F.nbr[li] = RN;
      }
      stats.collapsed = merged.size;
      return { merged, stats };
    }
    return { untwist };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/diag/apex.js
// geokernel · solids/diag/apex — UN VÈRTEX DE ≥4 PLANS TALLAT PER UN PLA, ampliat (×K) en 2D per al VISOR 2D:
// · ALÇAT (esquerra): el pla de tall P és la recta horitzontal y = 0; cada cara que arriba al vèrtex hi té la SEVA
//   cantonada exacta (cara, aresta d'entrada, aresta de sortida) — amb 4 plans no concurrents són punts diferents, uns per
//   sobre de P i d'altres per sota —, i les rectes de les arestes del vèrtex.
// · SECCIÓ AL PLA P vista en planta (dreta): els segments de tall de cada cara amb el seu sentit (fletxa) i els NODES que
//   no tanquen (cercle vermell): on surten dues arestes i no n'entra cap, el contorn no és un cicle.
// Pur. apexScene({ A, P, diag?, vi? }) → { shapes, K, faces: [{ plane, d, side }], unbalanced }.
(function (def) {
  def('solids/diag/apex', ['solids/point', 'solids/brep/corners', 'solids/diag/draw'], function (PT, CO, DR) {
    const FC = ['#4da3ff', '#ffa040', '#40d080', '#ff5070', '#c080ff', '#ffe040', '#40e0e0'];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const unit = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
    const sci = (x) => { if (x === 0) return '0'; const e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e); return (m >= 0 ? '+' : '') + m.toFixed(1).replace('.', ',') + '·10^' + e; };
    function arrow(a, b, head) {
      const d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]) || 1, u = [d[0] / l, d[1] / l], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], h = Math.min(head, 0.3 * l);
      return [[m[0], m[1], 0, m[0] - h * (u[0] - 0.5 * u[1]), m[1] - h * (u[1] + 0.5 * u[0]), 0], [m[0], m[1], 0, m[0] - h * (u[0] + 0.5 * u[1]), m[1] - h * (u[1] - 0.5 * u[0]), 0]];
    }
    function apexScene(o) {
      const S = o.A, T = S.T, P = o.P, nP = T.normal(P), pp = T.get(P), dP = pp.fe / (Math.hypot(pp.fa, pp.fb, pp.fc) * Math.pow(2, T.gridExp));
      const dist = (c) => dot(nP, c) + dP;   // distància amb signe a P (en double: només per dibuixar; el costat és exacte)
      const inc = (vi) => S.faces.filter((f) => f.loops.some((L) => L.includes(vi)));
      // el vèrtex: el donat, o el de ≥4 cares més proper a P
      let vi = o.vi;
      if (vi == null) {
        let best = Infinity;
        S.verts.forEach((v, i) => { if (inc(i).length < 4) return; const d = Math.abs(dist(PT.coords(T, v))); if (d < best) { best = d; vi = i; } });
      }
      if (vi == null) throw new Error('geokernel.diag.apex: el sòlid no té cap vèrtex de 4 plans o més');
      const V0 = PT.coords(T, S.verts[vi]);
      // la cantonada de cada cara al vèrtex, i les rectes de les seves arestes
      const faces = [], lines = new Map();
      inc(vi).forEach((f) => {
        f.loops.forEach((L, li) => {
          const i = L.indexOf(vi); if (i < 0) return;
          const c = CO.corners(S, f)[li][i], E = f.epl[li], n = L.length, ep = E[(i - 1 + n) % n], en = E[i], q = PT.coords(T, c);
          faces.push({ plane: f.plane, ep, en, q, d: dist(q), side: PT.side(T, P, Object.assign({}, c, { on: new Set() })) });
          for (const X of [ep, en]) { const k = Math.min(f.plane, X) + ',' + Math.max(f.plane, X); if (!lines.has(k)) lines.set(k, { at: q, dir: unit(cross(T.normal(f.plane), T.normal(X))) }); }
        });
      });
      const col = new Map(); faces.forEach((f, i) => col.set(f.plane, FC[i % FC.length]));
      // eix horitzontal de l'alçat: perpendicular a P, on les cantonades s'escampen més
      const a0 = unit(Math.abs(nP[0]) < 0.9 ? cross(nP, [1, 0, 0]) : cross(nP, [0, 1, 0])), b0 = cross(nP, a0);
      let u = a0, spread = -1;
      for (let k = 0; k < 90; k++) {
        const t = (Math.PI * k) / 90, w = [0, 1, 2].map((j) => Math.cos(t) * a0[j] + Math.sin(t) * b0[j]);
        const xs = faces.map((f) => dot(w, sub(f.q, V0))), s = Math.max(...xs) - Math.min(...xs);
        if (s > spread) { spread = s; u = w; }
      }
      const w = cross(nP, u);
      // ampliació: que les cantonades ocupin unes 10 unitats (potència de 10)
      const ext = Math.max(spread, ...faces.map((f) => Math.abs(f.d)), 1e-300);
      const K = Math.pow(10, Math.round(Math.log10(10 / ext)));
      const shapes = [];
      // ── ALÇAT
      const el = (c) => [K * dot(u, sub(c, V0)), K * dist(c), 0];
      const Y = 1.8 * Math.max(...faces.map((f) => Math.abs(K * f.d)), 1);
      let xmin = Infinity, xmax = -Infinity;
      const lsegs = [];
      for (const [, ln] of lines) {
        const r = dot(nP, ln.dir); if (Math.abs(r) < 1e-12) continue;
        const p0 = el(ln.at), t1 = (Y - p0[1]) / (K * r), t2 = (-Y - p0[1]) / (K * r);
        const A1 = [p0[0] + K * dot(u, ln.dir) * t1, Y, 0], A2 = [p0[0] + K * dot(u, ln.dir) * t2, -Y, 0];
        lsegs.push(A1.concat(A2)); xmin = Math.min(xmin, A1[0], A2[0]); xmax = Math.max(xmax, A1[0], A2[0]);
      }
      shapes.push({ id: 'rectes', type: 'segments', segs: lsegs, color: '#6b7484' });
      const pad = 0.15 * (xmax - xmin || 1);
      shapes.push({ id: 'P', type: 'segments', segs: [[xmin - pad, 0, 0, xmax + pad, 0, 0]], color: '#3dd6ff' });
      shapes.push({ id: 'P', type: 'label', p: [xmax + pad, 0, 0], text: 'pla de tall P', color: '#3dd6ff' });
      const R = 0.025 * (xmax - xmin + 2 * Y);
      const items = [];
      faces.forEach((f, i) => {
        const p = el(f.q);
        shapes.push({ id: 'c' + f.plane, type: 'point', p, color: col.get(f.plane) });
        shapes.push(...DR.ring('c' + f.plane, p, R * (1 + 0.35 * i), col.get(f.plane), true));
        items.push({ id: 'c' + f.plane, at: p, text: 'cara ' + f.plane + ': el seu àpex a ' + sci(f.d) + ' m (' + (f.side > 0 ? 'per sobre' : f.side < 0 ? 'per sota' : 'sobre') + ' de P)', color: col.get(f.plane) });
      });
      shapes.push(...DR.callouts2d(items, [xmin - pad, -Y, xmax + pad, Y], 'left'));
      shapes.push({ id: 'tit', type: 'label', p: [xmin, Y * 1.25, 0], text: 'ALÇAT ×' + K.toExponential(0) + ' (1 unitat = ' + (1 / K).toExponential(0) + ' m)', color: '#e6e9ef' });
      // ── SECCIÓ AL PLA P, en planta, a la dreta
      let unbalanced = 0;
      const ops = o.diag ? o.diag.operands : null, L = ops ? (ops[4] && ops[4].length ? ops[4] : ops[5] || []) : [];
      if (L.length) {
        const pl = (c) => [K * dot(u, sub(c, V0)), K * dot(w, sub(c, V0)), 0];
        const pts = L.flatMap((e) => [pl(PT.coords(T, e.a)), pl(PT.coords(T, e.b))]);
        const lo = [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1]))], hi = [Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))];
        const off = [xmax + pad + 0.6 * (xmax - xmin + 2 * pad) - lo[0], -(lo[1] + hi[1]) / 2];
        const at = (c) => { const p = pl(c); return [p[0] + off[0], p[1] + off[1], 0]; };
        const span = Math.max(hi[0] - lo[0], hi[1] - lo[1]) || 1, bal = new Map(), its = [];
        L.forEach((e) => {
          const a = at(PT.coords(T, e.a)), b = at(PT.coords(T, e.b));
          shapes.push({ id: 's' + e.X, type: 'segments', segs: [a.concat(b), ...arrow(a, b, span * 0.12)], color: col.get(e.X) || '#cccccc' });
          its.push({ id: 's' + e.X, at: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], text: 'tall de la cara ' + e.X, color: col.get(e.X) || '#cccccc' });
          for (const [k, p, s] of [[PT.key(e.a), a, 1], [PT.key(e.b), b, -1]]) { const v = bal.get(k) || { n: 0, p }; v.n += s; bal.set(k, v); }
        });
        const bad = [];
        for (const [, v] of bal) if (v.n) { unbalanced++; shapes.push(...DR.ring('nt' + unbalanced, v.p, span * 0.06, '#ff2020', true)); bad.push({ id: 'nt' + unbalanced, at: v.p, text: v.n > 0 ? 'en surten ' + v.n + ', no n\'hi entra cap' : 'n\'hi entren ' + (-v.n) + ', no en surt cap', color: '#ff2020' }); }
        const box = [lo[0] + off[0], lo[1] + off[1], hi[0] + off[0], hi[1] + off[1]];
        shapes.push(...DR.callouts2d(bad, box, 'right'));
        shapes.push(...DR.callouts2d(its, [box[0], box[1] - span * 0.5, box[2], box[3] + span * 0.5], 'left').map((s) => Object.assign(s, { id: s.id + 'l' })));
        shapes.push({ id: 'tit2', type: 'label', p: [box[0], Math.max(box[3] + span * 0.8, Y * 1.25), 0], text: 'SECCIÓ A P, EN PLANTA ×' + K.toExponential(0) + ': ' + (unbalanced ? unbalanced + ' nodes no tanquen' : 'tanca'), color: '#e6e9ef' });
      }
      return { shapes, K, vi, faces: faces.map((f) => ({ plane: f.plane, d: f.d, side: f.side })), unbalanced };
    }
    return { apexScene };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/diag/chain.js
// geokernel · solids/diag/chain — EXECUTA UNA CADENA (base + operands en ordre) fins al final o fins al pas que falla,
// i en guarda l'estat per poder-lo mostrar: el sòlid acumulat abans del pas, l'operand, l'error i (si l'error ve d'un
// pla) el pla i els seus operands 2D. Pur. runChain(piece, { tol, upto }) → { T, X, B, Bmesh, step, op, error, diag }.
(function (def) {
  def('solids/diag/chain', ['solids/plane', 'solids/repair', 'solids/brep/fromMesh', 'solids/boolean'], function (PL, RP, FM, BO) {
    function runChain(pc, opts) {
      opts = opts || {};
      const tol = opts.tol || 1e-4, o = { distTol: tol }, T = PL.table({});
      const res = { T, X: null, B: null, Bmesh: null, step: -1, op: null, error: null, diag: null, steps: pc.ops.length };
      try { res.X = FM.fromMesh(T, RP.repair(pc.base, { tol }), o); } catch (e) { res.error = 'base: ' + e.message; return res; }
      const upto = opts.upto != null ? Math.min(opts.upto, pc.ops.length) : pc.ops.length;
      for (let i = 0; i < upto; i++) {
        res.step = i; res.op = pc.ops[i].op; res.Bmesh = RP.repair(pc.ops[i].B, { tol });
        try { res.B = FM.fromMesh(T, res.Bmesh, o); } catch (e) { res.error = 'operand ' + i + ': ' + e.message; return res; }
        if (i === upto - 1 && opts.upto != null) return res;   // aturat abans d'aplicar el pas demanat
        try { res.X = BO.boolean(pc.ops[i].op, res.X, res.B); } catch (e) { res.error = 'pas ' + i + ' (' + pc.ops[i].op + '): ' + e.message; res.diag = e.diag || null; return res; }
      }
      res.step = upto; res.B = null; res.Bmesh = null;
      return res;
    }
    return { runChain };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/diag/draw.js
// geokernel · solids/diag/draw — PECES DE DIBUIX per a les escenes de diagnosi (format shapes3d de viewer3d), pures:
// · flatMesh: una malla amb OMBREJAT PLA (cada triangle amb els seus vèrtexs: el visor no fa la mitjana de normals entre
//   cares, que difuminava les arestes) + les ARESTES VIVES (entre triangles no coplanaris) com a línies fosques.
// · ring: un CERCLE marcador al voltant d'un punt: en 3D, tres cercles ortogonals (es veu rodó des de qualsevol vista);
//   en 2D (flat), un sol cercle al pla XY.
(function (def) {
  def('solids/diag/draw', [], function () {
    function flatMesh(id, positions, indices, color, opacity, edgeColor) {
      const P = positions, I = indices, pos = [], segs = [], ed = new Map();
      const nrm = (a, b, c) => { const u = [P[3 * b] - P[3 * a], P[3 * b + 1] - P[3 * a + 1], P[3 * b + 2] - P[3 * a + 2]], v = [P[3 * c] - P[3 * a], P[3 * c + 1] - P[3 * a + 1], P[3 * c + 2] - P[3 * a + 2]]; const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], l = Math.hypot(...n) || 1; return [n[0] / l, n[1] / l, n[2] / l]; };
      for (let t = 0; t < I.length; t += 3) {
        const tri = [I[t], I[t + 1], I[t + 2]];
        for (const v of tri) pos.push(P[3 * v], P[3 * v + 1], P[3 * v + 2]);
        const n = nrm(tri[0], tri[1], tri[2]);
        for (let k = 0; k < 3; k++) {
          const a = tri[k], b = tri[(k + 1) % 3], key = a < b ? a + ',' + b : b + ',' + a;
          if (!ed.has(key)) ed.set(key, { a, b, n: [] });
          ed.get(key).n.push(n);
        }
      }
      // aresta viva: només un triangle (contorn obert) o normals que difereixen més d'1°
      for (const e of ed.values()) {
        const sharp = e.n.length !== 2 || (e.n[0][0] * e.n[1][0] + e.n[0][1] * e.n[1][1] + e.n[0][2] * e.n[1][2]) < 0.99985;
        if (sharp) segs.push([P[3 * e.a], P[3 * e.a + 1], P[3 * e.a + 2], P[3 * e.b], P[3 * e.b + 1], P[3 * e.b + 2]]);
      }
      const out = [{ id, type: 'mesh', positions: pos, color, opacity }];
      if (segs.length) out.push({ id, type: 'segments', segs, color: edgeColor || '#1b1f27' });
      return out;
    }
    function ring(id, c, r, color, flat) {
      const N = 40, circle = (ax, ay) => { const pts = []; for (let i = 0; i < N; i++) { const t = (2 * Math.PI * i) / N; pts.push([0, 1, 2].map((k) => c[k] + r * (Math.cos(t) * ax[k] + Math.sin(t) * ay[k]))); } return { id, type: 'poly', pts, closed: true, color }; };
      if (flat) return [circle([1, 0, 0], [0, 1, 0])];
      return [circle([1, 0, 0], [0, 1, 0]), circle([0, 1, 0], [0, 0, 1]), circle([1, 0, 0], [0, 0, 1])];
    }
    // ETIQUETES FORA DEL DIBUIX: cada etiqueta en una columna al costat de la capsa (dreta o esquerra), ordenades per
    // altura perquè les línies de crida no es creuin, unides al seu punt amb una línia DISCONTÍNUA.
    // items: [{ id, at: [x,y,z], text, color }], box: [xmin, ymin, xmax, ymax] (2D, z = 0) → shapes.
    function callouts2d(items, box, side) {
      if (!items.length) return [];
      const w = box[2] - box[0], h = box[3] - box[1], gap = Math.max(w, h) * 0.08 || 1;
      const x = side === 'left' ? box[0] - gap : box[2] + gap;
      const sorted = items.slice().sort((p, q) => q.at[1] - p.at[1]);
      const out = [];
      sorted.forEach((it, i) => {
        const y = sorted.length === 1 ? it.at[1] : box[3] - (h * i) / (sorted.length - 1);
        const p = [x, y, 0];
        out.push({ id: it.id, type: 'segments', segs: [it.at.concat(p)], color: it.color, dash: [gap * 0.06, gap * 0.04] });
        out.push({ id: it.id, type: 'label', p, text: it.text, color: it.color });
      });
      return out;
    }
    // el mateix en 3D: l'etiqueta s'aparta del centre de l'escena en la direcció del punt, fins fora de la capsa
    function callouts3d(items, lo, hi) {
      const c = [0, 1, 2].map((k) => (lo[k] + hi[k]) / 2), diag = Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) || 1, out = [];
      items.forEach((it, i) => {
        let d = [0, 1, 2].map((k) => it.at[k] - c[k]); let l = Math.hypot(...d);
        if (!(l > 1e-9)) { d = [1, 0, 0]; l = 1; }
        const p = [0, 1, 2].map((k) => c[k] + (d[k] / l) * diag * (0.65 + 0.04 * (i % 4)));
        out.push({ id: it.id, type: 'segments', segs: [it.at.concat(p)], color: it.color, dash: [diag * 0.01, diag * 0.007] });
        out.push({ id: it.id, type: 'label', p, text: it.text, color: it.color });
      });
      return out;
    }
    return { flatMesh, ring, callouts2d, callouts3d };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/diag/ifc-scene.js
// geokernel · solids/diag/ifcScene — UN MODEL IFC EN DOS ESCENES (format shapes3d de viewer3d, Z amunt), per comparar:
// · esquerra (web-ifc): totes les peces de context.bin tal com les dona web-ifc; els elements amb booleanes en VERD si
//   el resultat de web-ifc tanca, en VERMELL si té arestes nues;
// · dreta (geokernel): el mateix context, però els elements amb booleanes refets amb el motor (chainMesh × toModel): VERD
//   si totes les seves peces tanquen; si alguna falla, l'element de web-ifc en VERMELL.
// La resta d'elements, en gris clar i en UNA sola malla («context»). web-ifc treballa amb Y amunt: (x, y, z) → (x, −z, y).
// Pur. ifcScenes({ ctx, index, chains: { eid: cadena }, results: { eid: [chainMesh per peça] } })
//   → { left, right, rows: [{ eid, type, pieces, ops, webifcNaked, webifcOk, mine, mineOk }] }
(function (def) {
  def('solids/diag/ifcScene', ['formats/mctx', 'solids/validate/mesh', 'solids/diag/draw'], function (MX, VM, DR) {
    const GREEN = '#58c87a', RED = '#ff4d4d', GREY = '#b9c0cc';
    const zUp = (P) => { const o = new Float64Array(P.length); for (let i = 0; i < P.length; i += 3) { o[i] = P[i]; o[i + 1] = -P[i + 2]; o[i + 2] = P[i + 1]; } return o; };
    function ifcScenes(o) {
      const ctx = o.ctx, index = o.index, chains = o.chains || {}, results = o.results || {};
      const byEid = new Map();
      ctx.pieces.forEach((p) => { if (!byEid.has(p.expressID)) byEid.set(p.expressID, []); byEid.get(p.expressID).push(p); });
      const left = [], right = [], rows = [];
      // malla «plana» (cada triangle amb els seus 3 vèrtexs: ombrejat pla) sense índexs
      const flatPos = (P, I) => { const o = new Float32Array(I.length * 3); for (let i = 0; i < I.length; i++) { o[3 * i] = P[3 * I[i]]; o[3 * i + 1] = P[3 * I[i] + 1]; o[3 * i + 2] = P[3 * I[i] + 2]; } return o; };
      const meshOf = (id, P, I, color) => DR.flatMesh(id, Array.from(P), Array.from(I), color, 1, '#2a2f38');
      const ctxShapes = (eid, color) => (byEid.get(eid) || []).flatMap((p, k) => meshOf('e' + eid + '_' + k, zUp(MX.toModel(p.positions, p.matrix)), p.indices, color));
      // el CONTEXT (elements sense booleanes) en UNA sola malla: milers de peces serien milers d'objectes al visor
      const cP = [], cI = [];
      for (const el of index.elements || []) {
        if (el.hasBooleans && chains[el.expressID]) continue;
        for (const p of byEid.get(el.expressID) || []) {
          const P = zUp(MX.toModel(p.positions, p.matrix)), base = cP.length / 3;
          for (let i = 0; i < P.length; i++) cP.push(P[i]);
          for (let i = 0; i < p.indices.length; i++) cI.push(p.indices[i] + base);
        }
      }
      // amb molts triangles (540: 750k), el context sense arestes vives (el mapa d'arestes ofegaria el visor)
      if (cI.length) { const s = cI.length / 3 > 200000 ? [{ id: 'context', type: 'mesh', positions: flatPos(cP, cI), color: GREY, opacity: 1 }] : meshOf('context', cP, cI, GREY); left.push(...s); right.push(...s); }
      for (const el of index.elements || []) {
        const eid = el.expressID, ch = chains[eid];
        if (!el.hasBooleans || !ch) continue;
        // web-ifc: el seu resultat (el de context.bin), pintat segons si el webifcFinal de cada peça tanca
        let wNaked = 0, ops = 0;
        // (una cadena «prima», de la memòria cau de /geo-ifc, porta nOps i webifcNaked ja calculats)
        for (const pc of ch.pieces) { ops += pc.nOps != null ? pc.nOps : pc.ops.length; wNaked += pc.webifcNaked != null ? pc.webifcNaked : pc.webifcFinal ? VM.check(pc.webifcFinal).naked : 0; }
        left.push(...ctxShapes(eid, wNaked ? RED : GREEN));
        // geokernel
        const res = results[eid] || [], mineOk = res.length === ch.pieces.length && res.every((r) => r && r.ok);
        // una peça sense toModel (web-ifc la deixa buida: no hi ha res amb què encaixar-la) no es pot col·locar
        const placed = ch.pieces.every((pc, k) => pc.toModel || !(res[k] && res[k].positions && res[k].positions.length));
        if (mineOk && !placed) { right.push(...ctxShapes(eid, '#ffb020')); rows.push({ eid, type: el.type, pieces: ch.pieces.length, ops: ch.pieces.reduce((a, pc) => a + (pc.nOps != null ? pc.nOps : pc.ops.length), 0), webifcNaked: wNaked, webifcOk: !wNaked, mine: 'tanca, però sense col·locació (web-ifc buit)', mineOk: true }); continue; }
        if (mineOk) res.forEach((r, k) => r.positions.length && right.push(...meshOf('e' + eid + '_m' + k, zUp(MX.toModel(r.positions, ch.pieces[k].toModel)), r.indices, GREEN)));
        else right.push(...ctxShapes(eid, RED));
        const bad = res.find((r) => r && !r.ok);
        rows.push({ eid, type: el.type, pieces: ch.pieces.length, ops, webifcNaked: wNaked, webifcOk: !wNaked, mine: mineOk ? 'tanca' : bad ? bad.error : 'sense calcular', mineOk });
      }
      return { left, right, rows };
    }
    return { ifcScenes };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/diag/shapes2d.js
// geokernel · solids/diag/shapes2d — EL PLA ON HA FALLAT LA BOOLEANA, dibuixat en 2D (coordenades del marc del pla, a z = 0,
// per al visor vist des de dalt): les arestes de cada operand amb el seu color i una fletxa del sentit, i els NODES
// DESEQUILIBRATS (cercle vermell) (on entren més arestes d'un operand de les que en surten: el contorn no tanca) en vermell gros.
// Pur. plane2d(T, diag) → { shapes, legend, unbalanced: [{ op, at, n }] }.
(function (def) {
  def('solids/diag/shapes2d', ['solids/point', 'solids/diag/draw'], function (PT, DR) {
    const NAMES = ['A+', 'A−', 'B+', 'B−', 'SA+', 'SA−', 'SB+', 'SB−'];
    const COLORS = ['#4da3ff', '#1f5fbf', '#ffa040', '#b86200', '#40d080', '#1f8a4c', '#ff5070', '#b0203a'];
    function plane2d(T, diag) {
      const F = diag.F, xy = (p) => { const c = PT.coords(T, p); return [c[F.a], c[F.b], 0]; };
      const shapes = [], unbalanced = [], legend = [], opLabels = [];
      let span = 0;
      diag.operands.forEach((L) => L.forEach((e) => { const a = xy(e.a), b = xy(e.b); span = Math.max(span, Math.hypot(a[0] - b[0], a[1] - b[1])); }));
      const headMax = span * 0.006;   // fletxes petites: com a molt 0,6 % de l'escena i el 15 % de la seva aresta
      diag.operands.forEach((L, k) => {
        if (!L.length) return;
        legend.push(NAMES[k] + ' (' + L.length + ' arestes)');
        const segs = [], bal = new Map();
        for (const e of L) {
          const a = xy(e.a), b = xy(e.b);
          segs.push(a.concat(b));
          // fletxa al mig
          const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]) || 1, u = [d[0] / l, d[1] / l], head = Math.min(headMax, 0.15 * l);
          segs.push([m[0], m[1], 0, m[0] - head * (u[0] - 0.5 * u[1]), m[1] - head * (u[1] + 0.5 * u[0]), 0]);
          segs.push([m[0], m[1], 0, m[0] - head * (u[0] + 0.5 * u[1]), m[1] - head * (u[1] - 0.5 * u[0]), 0]);
          const ka = PT.key(e.a), kb = PT.key(e.b);
          bal.set(ka, { n: ((bal.get(ka) || {}).n || 0) + 1, at: a }); bal.set(kb, { n: ((bal.get(kb) || {}).n || 0) - 1, at: b });
        }
        shapes.push({ id: 'op' + k, type: 'segments', segs, color: COLORS[k] });
        opLabels.push({ id: 'op' + k, at: xy(L[0].a), text: NAMES[k], color: COLORS[k] });
        for (const [, v] of bal) if (v.n) unbalanced.push({ op: NAMES[k], at: v.at, n: v.n });
      });
      unbalanced.forEach((u, i) => {
        shapes.push(...DR.ring('desq' + i, u.at, Math.max(span * 0.012, 1e-4), '#ff2020', true));   // cercle vermell al node que no tanca
      });
      // etiquetes fora del dibuix amb línia discontínua (els nodes que no tanquen a la dreta, els operands a l'esquerra)
      const box = [Infinity, Infinity, -Infinity, -Infinity];
      diag.operands.forEach((L) => L.forEach((e) => { for (const p of [xy(e.a), xy(e.b)]) { box[0] = Math.min(box[0], p[0]); box[1] = Math.min(box[1], p[1]); box[2] = Math.max(box[2], p[0]); box[3] = Math.max(box[3], p[1]); } }));
      shapes.push(...DR.callouts2d(unbalanced.map((u, i) => ({ id: 'desq' + i, at: u.at, text: u.op + ' no tanca (' + (u.n > 0 ? '+' : '') + u.n + ')', color: '#ff2020' })), box, 'right'));
      shapes.push(...DR.callouts2d(opLabels, box, 'left'));
      return { shapes, legend, unbalanced };
    }
    return { plane2d, NAMES, COLORS };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/diag/shapes3d.js
// geokernel · solids/diag/shapes3d — ESCENA 3D d'un cas (format shapes3d de viewer3d): el sòlid acumulat (gris
// translúcid), l'operand (taronja translúcid), les CANTONADES DESPLAÇADES (cercle vermell al vèrtex real; magenta: línia des del vèrtex real de la malla
// fins on el motor l'ha calculada, amb etiqueta de la desviació), les cares que les provoquen (groc) i el pla on ha fallat
// la booleana (cian). Pur. scene(res, { minDev }) → { shapes, report: [{ solid, dev, at, face }] }.
(function (def) {
  def('solids/diag/shapes3d', ['solids/point', 'solids/brep/corners', 'solids/brep/toMesh', 'solids/diag/draw'], function (PT, CO, TM, DR) {
    const arr = (a) => Array.prototype.slice.call(a);
    function faceShapes(S, color, id, opacity) {
      // el BREP a malla; si no es pot triangular, els contorns com a línies
      try { const m = TM.toMesh(S); return DR.flatMesh(id, m.positions, m.indices, color, opacity); } catch (e) {   // si no es pot triangular, els contorns
        const segs = [];
        for (const f of S.faces) for (const L of f.loops) for (let i = 0; i < L.length; i++) { const a = PT.coords(S.T, S.verts[L[i]]), b = PT.coords(S.T, S.verts[L[(i + 1) % L.length]]); segs.push(a.concat(b)); }
        return [{ id, type: 'segments', segs, color }];
      }
    }
    // desviació de cada cantonada exacta respecte dels vèrtexs d'una malla de referència
    function deviations(S, mesh, minDev, name) {
      const P = mesh.positions, out = [];
      S.faces.forEach((f, fi) => CO.corners(S, f).forEach((L) => L.forEach((c) => {
        const q = PT.coords(S.T, c); let best = Infinity, bp = null;
        for (let j = 0; j < P.length; j += 3) { const d = Math.hypot(P[j] - q[0], P[j + 1] - q[1], P[j + 2] - q[2]); if (d < best) { best = d; bp = [P[j], P[j + 1], P[j + 2]]; } }
        if (best > minDev) out.push({ solid: name, dev: best, at: q, from: bp, face: fi });
      })));
      return out;
    }
    function scene(res, opts) {
      opts = opts || {};
      const minDev = opts.minDev || 1e-3, shapes = [], report = [];
      if (res.X) shapes.push(...faceShapes(res.X, '#9aa4b2', 'A', 0.35));
      if (res.Bmesh) shapes.push(...DR.flatMesh('B', res.Bmesh.positions, res.Bmesh.indices, '#ff8a3d', 0.35, '#7a3a10'));
      if (res.B && res.Bmesh) report.push(...deviations(res.B, res.Bmesh, minDev, 'B'));
      const bad = new Set();
      // radi dels cercles: l'1 % de la diagonal de l'escena (no de les coordenades: un model georeferenciat té xifres grans)
      const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
      for (const s0 of shapes) if (s0.positions) for (let i = 0; i < s0.positions.length; i += 3) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], s0.positions[i + k]); hi[k] = Math.max(hi[k], s0.positions[i + k]); }
      const R0 = Math.max(Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) * 0.01 || 0, 1e-3);
      report.forEach((r, i) => {
        shapes.push({ id: 'dev' + i, type: 'line', a: r.from, b: r.at, color: '#ff3df0' });
        shapes.push({ id: 'dev' + i, type: 'point', p: r.at, color: '#ff3df0' });
        shapes.push(...DR.ring('dev' + i, r.from, R0, '#ff2020'));   // cercle vermell: on hi ha EXACTAMENT el problema (el vèrtex real)
        bad.add(r.face);
      });
      shapes.push(...DR.callouts3d(report.map((r, i) => ({ id: 'dev' + i, at: r.from, text: r.solid + ' cantonada desplaçada ' + (r.dev * 1000).toFixed(1) + ' mm', color: '#ff3df0' })), lo, hi));   // etiquetes fora, línia discontínua
      if (res.B) for (const fi of bad) {
        const f = res.B.faces[fi];
        f.loops.forEach((L, li) => shapes.push({ id: 'cara' + fi, type: 'poly', pts: L.map((v) => PT.coords(res.T, res.B.verts[v])), closed: true, color: '#ffd23f' }));
      }
      if (res.diag && res.X) {
        // el pla del fall: un quadrat translúcid a la mida de l'escena
        const n = res.T.normal(res.diag.P), p = res.T.get(res.diag.P), d = -p.fe / (Math.hypot(p.fa, p.fb, p.fc) * Math.pow(2, res.T.gridExp));
        const all = []; for (const s of shapes) if (s.positions) for (let i = 0; i < s.positions.length; i += 3) all.push(s.positions.slice(i, i + 3));
        if (all.length) {
          const c = [0, 1, 2].map((k) => all.reduce((s, q) => s + q[k], 0) / all.length), r = Math.max(...all.map((q) => Math.hypot(q[0] - c[0], q[1] - c[1], q[2] - c[2])));
          const t = n[0] * c[0] + n[1] * c[1] + n[2] * c[2] - d, o = [c[0] - t * n[0], c[1] - t * n[1], c[2] - t * n[2]];
          const u0 = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], u = [n[1] * u0[2] - n[2] * u0[1], n[2] * u0[0] - n[0] * u0[2], n[0] * u0[1] - n[1] * u0[0]], ul = Math.hypot(...u);
          for (let k = 0; k < 3; k++) u[k] /= ul;
          const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
          const P4 = [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => [0, 1, 2].map((k) => o[k] + r * (a * u[k] + b * v[k])));
          shapes.push({ id: 'pla', type: 'poly', pts: P4, closed: true, fill: true, color: '#3dd6ff', opacity: 0.18 });
        }
      }
      return { shapes, report };
    }
    return { scene, deviations };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/diag/vertex.js
// geokernel · solids/diag/vertex — UN VÈRTEX DE ≥4 PLANS d'un BREP, dibuixat: per a cada cara que hi arriba, la seva
// CANTONADA exacta (cara, aresta d'entrada, aresta de sortida), a quina distància queda del vèrtex de la malla, i l'angle
// entre les dues rectes que la defineixen (si és ~0°, la cantonada és mal condicionada: una diferència ínfima la fa lliscar
// lluny). Tipus del vèrtex: convex, còncau o SELLA (carenes i valls barrejades).
// 3D: el sòlid (gris), les cares del vèrtex en color, cercle vermell al vèrtex, magenta fins a cada cantonada llunyana.
// 2D: vist des de la normal de la cara amb la cantonada pitjor: les vores de les cares del vèrtex i les dues rectes de la
// cantonada pitjor allargades fins on es tallen.
// Pur. vertexScene({ A, vi?, mesh? }) → { shapes3d, shapes2d, vi, kind, faces: [{ plane, ep, en, dev, ang, at }] }.
(function (def) {
  def('solids/diag/vertex', ['solids/point', 'solids/brep/toMesh', 'solids/diag/draw'], function (PT, TM, DR) {
    const FC = ['#4da3ff', '#ffa040', '#40d080', '#ff5070', '#c080ff', '#ffe040', '#40e0e0'];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const unit = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
    function info(A, vi) {
      const T = A.T, occ = [];
      A.faces.forEach((f) => f.loops.forEach((L, li) => { const i = L.indexOf(vi); if (i >= 0) occ.push({ f, li, i }); }));
      const V = PT.coords(T, A.verts[vi]), sg = new Map(occ.map((o) => [o.f.plane, o.f.sign])), free = (p) => Object.assign({}, p, { on: new Set() });
      let ridge = false, valley = false;
      const faces = occ.map((o) => {
        const L = o.f.loops[o.li], E = o.f.epl[o.li], n = L.length, ep = E[(o.i - 1 + n) % n], en = E[o.i];
        const c = PT.make(T, o.f.plane, ep, en), at = c ? PT.coords(T, c) : V;
        // aresta v→següent (entre la cara i en): carena si l'anterior de la cara és darrere de la cara en
        const s = sg.get(en) * PT.side(T, en, free(A.verts[L[(o.i - 1 + n) % n]]));
        if (s < 0) ridge = true; if (s > 0) valley = true;
        const nf = T.normal(o.f.plane), d1 = unit(cross(nf, T.normal(ep))), d2 = unit(cross(nf, T.normal(en)));
        const ang = Math.acos(Math.min(1, Math.abs(dot(d1, d2)))) * 180 / Math.PI;
        return { plane: o.f.plane, ep, en, at, dev: Math.hypot(...sub(at, V)), ang, edge: s < 0 ? 'carena' : s > 0 ? 'vall' : 'plana' };
      });
      return { V, faces, kind: ridge && valley ? 'sella' : valley ? 'còncau' : 'convex' };
    }
    function vertexScene(o) {
      const A = o.A, T = A.T;
      let vi = o.vi;
      if (vi == null) {   // el de ≥4 cares amb la cantonada més lluny
        let best = -1;
        A.verts.forEach((_, i) => { const fs = A.faces.filter((f) => f.loops.some((L) => L.includes(i))); if (fs.length < 4) return; const d = Math.max(...info(A, i).faces.map((f) => f.dev)); if (d > best) { best = d; vi = i; } });
      }
      if (vi == null) throw new Error('geokernel.diag.vertex: el sòlid no té cap vèrtex de 4 plans o més');
      const I = info(A, vi), V = I.V, col = new Map(I.faces.map((f, i) => [f.plane, FC[i % FC.length]]));
      // ── 3D
      const s3 = [];
      const m = o.mesh || TM.toMesh(A);
      s3.push(...DR.flatMesh('A', m.positions, m.indices, '#9aa4b2', 0.35));
      const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
      for (let i = 0; i < m.positions.length; i += 3) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], m.positions[i + k]); hi[k] = Math.max(hi[k], m.positions[i + k]); }
      const diag = Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) || 1;
      A.faces.forEach((f) => { if (!col.has(f.plane)) return; f.loops.forEach((L) => s3.push({ id: 'cara' + f.plane, type: 'poly', pts: L.map((v) => PT.coords(T, A.verts[v])), closed: true, color: col.get(f.plane) })); });
      s3.push(...DR.ring('v', V, diag * 0.012, '#ff2020'));
      const items3 = [{ id: 'v', at: V, text: 'vèrtex de ' + I.faces.length + ' plans (' + I.kind + ')', color: '#ff2020' }];
      I.faces.filter((f) => f.dev > 1e-6).forEach((f) => {
        s3.push({ id: 'dev' + f.plane, type: 'line', a: V, b: f.at, color: '#ff3df0' }, { id: 'dev' + f.plane, type: 'point', p: f.at, color: '#ff3df0' });
        s3.push(...DR.ring('dev' + f.plane, f.at, diag * 0.008, '#ff3df0'));
        items3.push({ id: 'dev' + f.plane, at: f.at, text: 'cantonada de la cara ' + f.plane + ': a ' + (f.dev * 1000).toFixed(1) + ' mm', color: '#ff3df0' });
      });
      // les dues ARESTES REALS de la cara pitjor al vèrtex (entrada i sortida) i el nom de les cares
      const worst = I.faces.reduce((a, b) => (b.dev > a.dev ? b : a));
      const wf = A.faces.find((f) => f.plane === worst.plane), wl = wf.loops.find((L) => L.includes(vi)), wi = wl.indexOf(vi), wn = wl.length;
      const edges = [[PT.coords(T, A.verts[wl[(wi - 1 + wn) % wn]]), V, worst.ep], [V, PT.coords(T, A.verts[wl[(wi + 1) % wn]]), worst.en]];
      const EC = ['#00ffd0', '#ffff00'];
      edges.forEach(([a, b, X], k) => {
        s3.push({ id: 'aresta' + X, type: 'line', a, b, color: EC[k] }, { id: 'aresta' + X, type: 'point', p: a, color: EC[k] }, { id: 'aresta' + X, type: 'point', p: b, color: EC[k] });
        items3.push({ id: 'aresta' + X, at: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], text: 'aresta cara ' + worst.plane + ' ∩ cara ' + X, color: EC[k] });
      });
      for (const pl of new Set([worst.plane, worst.ep, worst.en])) {
        const f = A.faces.find((x) => x.plane === pl), pts = f.loops[0].map((v) => PT.coords(T, A.verts[v]));
        items3.push({ id: 'cara' + pl, at: [0, 1, 2].map((k) => pts.reduce((s, p) => s + p[k], 0) / pts.length), text: 'cara ' + pl, color: col.get(pl) });
      }
      s3.push(...DR.callouts3d(items3, lo, hi));
      // ── 2D: vist des de la normal de la cara amb la cantonada pitjor
      const n = T.normal(worst.plane), u = unit(Math.abs(n[2]) < 0.9 ? cross([0, 0, 1], n) : cross(n, [0, 1, 0])), w = cross(n, u);
      const xy = (p) => { const d = sub(p, V); return [dot(d, u), dot(d, w), 0]; };
      const R = Math.max(worst.dev * 1.4, diag * 0.05);
      const s2 = [];
      // context: vores de totes les cares a prop del vèrtex (gris), i les del vèrtex en color
      const near = (p) => Math.hypot(...sub(p, V)) < R * 2.5;
      A.faces.forEach((f) => f.loops.forEach((L) => {
        const segs = [];
        for (let i = 0; i < L.length; i++) { const a = PT.coords(T, A.verts[L[i]]), b = PT.coords(T, A.verts[L[(i + 1) % L.length]]); if (near(a) || near(b)) segs.push(xy(a).concat(xy(b))); }
        if (segs.length) s2.push({ id: 'cara' + f.plane, type: 'segments', segs, color: col.get(f.plane) || '#5a6270' });
      }));
      // L1 i L2: les dues rectes de la cantonada pitjor (cara ∩ aresta d'entrada, cara ∩ aresta de sortida). Es tallen
      // EXACTAMENT al punt lila (la cantonada), que és sobre totes dues; al vèrtex de la malla estan separades una mica.
      const items2 = [], c2 = xy(worst.at), Ls = [];
      [[worst.ep, "d'entrada"], [worst.en, 'de sortida']].forEach(([X, tag], k) => {
        const d = unit(cross(T.normal(worst.plane), T.normal(X))), dd = [dot(d, u), dot(d, w)], l = Math.hypot(dd[0], dd[1]) || 1;
        Ls.push({ X, tag, d, e: [dd[0] / l, dd[1] / l], name: 'L' + (k + 1), color: col.get(X) || '#ffffff' });
      });
      const ang = Math.atan2(Math.hypot(...cross(Ls[0].d, Ls[1].d)), Math.abs(dot(Ls[0].d, Ls[1].d)));   // rad, precís per a angles petits
      const sepV = Ls.map((Lx) => Math.hypot(...cross(sub(V, worst.at), Lx.d)));   // distància del vèrtex a cada recta
      // tram dibuixat: des de més enllà del punt lila fins a més enllà del vèrtex
      const span = (Lx) => { const sv = -c2[0] * Lx.e[0] - c2[1] * Lx.e[1], m = Math.abs(sv) * 0.25 + R * 0.1; return sv < 0 ? [sv - m, m] : [-m, sv + m]; };
      const draw = (map, tagId) => {
        for (const Lx of Ls) {
          const [s0, s1] = span(Lx), p = map([c2[0] + Lx.e[0] * s0, c2[1] + Lx.e[1] * s0]), q = map([c2[0] + Lx.e[0] * s1, c2[1] + Lx.e[1] * s1]);
          s2.push({ id: tagId + Lx.name, type: 'segments', segs: [p.concat(q)], color: Lx.color, dash: [R * 0.02, R * 0.015] });
          // el nom a l'extrem del costat del vèrtex
          const far = Math.hypot(p[0] - map([0, 0])[0], p[1] - map([0, 0])[1]) < Math.hypot(q[0] - map([0, 0])[0], q[1] - map([0, 0])[1]) ? p : q;
          s2.push({ id: tagId + Lx.name, type: 'label', p: far, text: Lx.name, color: Lx.color });
        }
        edges.forEach(([ea, eb], k) => { const p = map(xy(ea)), q = map(xy(eb)); s2.push({ id: tagId + 'aresta' + k, type: 'segments', segs: [p.concat(q)], color: EC[k] }); });
        s2.push(...DR.ring(tagId + 'v', map([0, 0]), R * 0.03, '#ff2020', true));
        s2.push({ id: tagId + 'cw', type: 'point', p: map(c2), color: '#ff3df0' }, ...DR.ring(tagId + 'cw', map(c2), R * 0.03, '#ff3df0', true));
      };
      // ── dibuix real
      draw((p) => [p[0], p[1], 0], 'r');
      Ls.forEach((Lx) => items2.push({ id: 'r' + Lx.name, at: [c2[0] + Lx.e[0] * R * 0.15, c2[1] + Lx.e[1] * R * 0.15, 0], text: Lx.name + ' = recta cara ' + worst.plane + ' ∩ cara ' + Lx.X + ' (aresta ' + Lx.tag + '); passa a ' + (sepV[Ls.indexOf(Lx)] * 1e6).toFixed(3) + ' µm del vèrtex', color: Lx.color }));
      edges.forEach(([ea, eb, X], k) => { const p = xy(ea), q = xy(eb); items2.push({ id: 'raresta' + k, at: [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, 0], text: 'ARESTA cara ' + worst.plane + ' ∩ cara ' + X + ' (' + (Math.hypot(...sub(eb, ea)) * 1000).toFixed(1) + ' mm), sobre ' + Ls[k].name, color: EC[k] }); });
      items2.push({ id: 'rv', at: [0, 0, 0], text: 'vèrtex de la malla (sobre els 4 plans)', color: '#ff2020' });
      items2.push({ id: 'rcw', at: c2, text: 'L1 i L2 es tallen aquí: cantonada de la cara ' + worst.plane + ' a ' + (worst.dev * 1000).toFixed(1) + ' mm; angle entre L1 i L2 = ' + (ang * 1e6).toFixed(2) + ' µrad (' + (ang * 180 / Math.PI).toExponential(2) + '°)', color: '#ff3df0' });
      const box = [Math.min(-R * 1.2, c2[0] - R * 0.2), -R * 1.2, Math.max(R * 1.2, c2[0] + R * 0.2), R * 1.2];
      s2.push(...DR.callouts2d(items2, box, 'right'));
      s2.push({ id: 'tit', type: 'label', p: [box[0], box[3] * 1.15, 0], text: 'Vist des de la normal de la cara ' + worst.plane + ' (unitats: m) — a escala real L1 i L2 semblen la mateixa recta', color: '#e6e9ef' });
      // ── el mateix, a sota, amb la direcció PERPENDICULAR a L1 ampliada ×K: es veu l'aspa que fan L1 i L2 al punt lila
      const e1 = Ls[0].e, p1 = [-e1[1], e1[0]], O = [0, box[1] - R * 1.6];
      const st = (p) => [(p[0] - c2[0]) * e1[0] + (p[1] - c2[1]) * e1[1], (p[0] - c2[0]) * p1[0] + (p[1] - c2[1]) * p1[1]];
      let tmax = 0;
      for (const Lx of Ls) for (const sv of span(Lx)) tmax = Math.max(tmax, Math.abs(st([c2[0] + Lx.e[0] * sv, c2[1] + Lx.e[1] * sv])[1]));
      edges.forEach(([ea, eb]) => { for (const q of [ea, eb]) tmax = Math.max(tmax, Math.abs(st(xy(q))[1])); });
      const K = tmax > 0 ? Math.pow(10, Math.floor(Math.log10((R * 0.35) / tmax))) : 1;
      const mapK = (p) => { const [sv, tv] = st(p); return [O[0] + c2[0] + sv * e1[0] + K * tv * p1[0], O[1] + c2[1] + sv * e1[1] + K * tv * p1[1], 0]; };
      draw(mapK, 'k');
      s2.push({ id: 'tit2', type: 'label', p: [box[0], O[1] + R * 0.75, 0], text: 'El mateix amb la direcció perpendicular a L1 ampliada ×' + K.toExponential(0) + ': L1 i L2 es tallen al punt lila', color: '#e6e9ef' });
      s2.push({ id: 'kL', type: 'label', p: mapK(c2).map((x, i) => (i === 1 ? x - R * 0.12 : x)), text: 'tall L1 × L2', color: '#ff3df0' });
      return { shapes3d: s3, shapes2d: s2, vi, kind: I.kind, faces: I.faces };
    }
    return { vertexScene, vertexInfo: info };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/exact/bigint.js
// geokernel · solids/exact/bigint — aritmètica entera exacta (BigInt): signe, valor absolut, mcd, determinants.
// Pur. Tot el que és EXACTE al motor passa per aquí (els floats només filtren).
(function (def) {
  def('solids/exact/bigint', [], function () {
    const Z = 0n;
    const sign = (a) => (a > Z ? 1 : a < Z ? -1 : 0);
    const abs = (a) => (a < Z ? -a : a);
    function gcd(a, b) {
      a = abs(a); b = abs(b);
      while (b) { const t = a % b; a = b; b = t; }
      return a;
    }
    function gcdAll(list) {
      let g = Z;
      for (const v of list) { g = gcd(g, v); if (g === 1n) break; }
      return g;
    }
    const det2 = (a, b, c, d) => a * d - b * c;
    // | a b c |
    // | d e f |
    // | g h i |
    const det3 = (a, b, c, d, e, f, g, h, i) => a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    // enter → Number sense perdre el signe ni petar amb valors > 2^53 (arrodoniment normal de Number(BigInt))
    const toNum = (a) => Number(a);
    return { sign, abs, gcd, gcdAll, det2, det3, toNum };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/exact/sign.js
// geokernel · solids/exact/sign — signe EXACTE d'un producte escalar Σ aᵢ·bᵢ amb FILTRE en double.
// Primer en double amb una fita d'error rigorosa; només si el resultat cau dins de la fita es fa en BigInt.
// Compta quantes vegades cal el càlcul exacte (stats) per vigilar el rendiment.
(function (def) {
  def('solids/exact/sign', ['solids/exact/bigint'], function (B) {
    const U = Math.pow(2, -52);
    const stats = { calls: 0, exact: 0 };
    // af, bf: Numbers (aproximacions); ab, bb: BigInt exactes (o funcions que els donen, per no calcular-los si no cal)
    function dotSign(af, bf, ab, bb) {
      stats.calls++;
      const n = af.length;
      let s = 0, m = 0;
      for (let i = 0; i < n; i++) { const t = af[i] * bf[i]; s += t; m += Math.abs(t); }
      const bound = m * (n + 6) * U;
      if (s > bound) return 1;
      if (s < -bound) return -1;
      // m === 0: tots els termes són 0 en double; amb aproximacions ESCALADES (punts d'enters enormes, solids/point) un
      // terme diminut pot haver quedat a 0 sense ser-ho → es decideix en exacte
      stats.exact++;
      const A = typeof ab === 'function' ? ab() : ab, Bv = typeof bb === 'function' ? bb() : bb;
      let e = 0n;
      for (let i = 0; i < n; i++) e += A[i] * Bv[i];
      return B.sign(e);
    }
    return { dotSign, stats, resetStats: () => { stats.calls = 0; stats.exact = 0; } };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/make/box.js
// geokernel · solids/make/box — CAPSA com a malla tancada (12 triangles, cap enfora): box([x0,y0,z0], [x1,y1,z1]).
(function (def) {
  def('solids/make/box', [], function () {
    function box(a, b) {
      const [x0, y0, z0] = a, [x1, y1, z1] = b;
      if (!(x1 > x0 && y1 > y0 && z1 > z0)) throw new Error('geokernel.box: capsa buida ' + a + ' / ' + b);
      const positions = [x0, y0, z0, x1, y0, z0, x1, y1, z0, x0, y1, z0, x0, y0, z1, x1, y0, z1, x1, y1, z1, x0, y1, z1];
      const indices = [0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7, 0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7];
      return { positions: Float64Array.from(positions), indices: Uint32Array.from(indices) };
    }
    return { box };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/make/oracle.js
// geokernel · solids/make/oracle — VOLUM EXACTE d'una seqüència de booleanes de CAPSES ALINEADES (per als tests),
// pel mètode de WEB-IFC: cel·les sobre totes les coordenades dels extrems; cada cel·la es classifica pel seu centre.
// seq = [{ box: [min, max] }, { op: 'union'|'intersection'|'difference', box }, …] → volum.
(function (def) {
  def('solids/make/oracle', [], function () {
    function boxesVolume(seq) {
      const cs = [[], [], []];
      for (const s of seq) for (let k = 0; k < 3; k++) { cs[k].push(s.box[0][k], s.box[1][k]); }
      const u = cs.map((l) => [...new Set(l)].sort((a, b) => a - b));
      const inBox = (p, b) => p[0] > b[0][0] && p[0] < b[1][0] && p[1] > b[0][1] && p[1] < b[1][1] && p[2] > b[0][2] && p[2] < b[1][2];
      let vol = 0;
      for (let i = 0; i + 1 < u[0].length; i++) for (let j = 0; j + 1 < u[1].length; j++) for (let k = 0; k + 1 < u[2].length; k++) {
        const p = [(u[0][i] + u[0][i + 1]) / 2, (u[1][j] + u[1][j + 1]) / 2, (u[2][k] + u[2][k + 1]) / 2];
        let inside = inBox(p, seq[0].box);
        for (let s = 1; s < seq.length; s++) {
          const b = inBox(p, seq[s].box), op = seq[s].op;
          inside = op === 'union' ? inside || b : op === 'intersection' ? inside && b : inside && !b;
        }
        if (inside) vol += (u[0][i + 1] - u[0][i]) * (u[1][j + 1] - u[1][j]) * (u[2][k + 1] - u[2][k]);
      }
      return vol;
    }
    return { boxesVolume };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/make/transform.js
// geokernel · solids/make/transform — transformacions rígides de malles (per generar casos de test):
// rotation(axis, angle) → matriu 3×3 · transform(mesh, R, t) → malla nova amb p' = R·p + t · randomRotation(rnd).
(function (def) {
  def('solids/make/transform', [], function () {
    function rotation(ax, ang) {
      const l = Math.hypot(ax[0], ax[1], ax[2]), x = ax[0] / l, y = ax[1] / l, z = ax[2] / l, c = Math.cos(ang), s = Math.sin(ang), C = 1 - c;
      return [x * x * C + c, x * y * C - z * s, x * z * C + y * s, y * x * C + z * s, y * y * C + c, y * z * C - x * s, z * x * C - y * s, z * y * C + x * s, z * z * C + c];
    }
    function randomRotation(rnd) { return rotation([rnd() - 0.5, rnd() - 0.5, rnd() - 0.5 + 1e-9], rnd() * Math.PI * 2); }
    function transform(mesh, R, t) {
      t = t || [0, 0, 0];
      const P = mesh.positions, out = new Float64Array(P.length);
      for (let i = 0; i < P.length; i += 3) {
        const x = P[i], y = P[i + 1], z = P[i + 2];
        out[i] = R[0] * x + R[1] * y + R[2] * z + t[0];
        out[i + 1] = R[3] * x + R[4] * y + R[5] * z + t[1];
        out[i + 2] = R[6] * x + R[7] * y + R[8] * z + t[2];
      }
      return { positions: out, indices: mesh.indices };
    }
    return { rotation, randomRotation, transform };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/plane/plane.js
// geokernel · solids/plane — TAULA DE PLANS ENTERS. a·x + b·y + c·z + e = 0 amb x en unitats de graella
// (coordenada model = x · 2^-gridExp; la graella és potència de 2 → passar de model a graella és exacte en double).
// La normal es quantitza a enters amb |màx| = 2^normBits; el pla passa EXACTAMENT pel punt de referència arrodonit
// a la graella. Canònic: dividit pel mcd i amb el primer component no nul de (a,b,c) positiu → un pla i el seu
// oposat són el MATEIX id; l'orientació d'una cara és ±1 sobre el pla.
(function (def) {
  def('solids/plane', ['solids/exact/bigint'], function (B) {
    function table(opts) {
      opts = opts || {};
      const gridExp = opts.gridExp != null ? opts.gridExp : 30;
      const normBits = opts.normBits != null ? opts.normBits : 30;
      const G = Math.pow(2, gridExp), NS = Math.pow(2, normBits);
      const planes = [], byKey = new Map();

      const toGrid = (v) => { const x = v * G; if (!Number.isFinite(x)) throw new Error('geokernel.plane: coordenada no finita ' + v); return BigInt(Math.round(x)); };
      const fromGrid = (v) => v / G;

      // pla d'enters → { id, sign } (sign = +1 si (a,b,c) donat té el mateix sentit que el canònic)
      // reduced = true: els enters ja són coprimers (concur els ha reduït per comprovar-ne la mida): no es torna a fer el mcd
      function fromInts(a, b, c, e, reduced) {
        if (a === 0n && b === 0n && c === 0n) throw new Error('geokernel.plane: normal nul·la');
        if (!reduced) { const g = B.gcdAll([a, b, c, e]); a /= g; b /= g; c /= g; e /= g; }
        let s = 1;
        const first = a !== 0n ? a : b !== 0n ? b : c;
        if (first < 0n) { a = -a; b = -b; c = -c; e = -e; s = -1; }
        const key = a + ',' + b + ',' + c + ',' + e;
        let id = byKey.get(key);
        if (id == null) {
          id = planes.length;
          planes.push({ id, a, b, c, e, fa: Number(a), fb: Number(b), fc: Number(c), fe: Number(e) });
          byKey.set(key, id);
        }
        return { id, sign: s };
      }
      // normal (no cal unitària) + punt del pla, en coordenades MODEL
      function fromNormalPoint(n, p) {
        const m = Math.max(Math.abs(n[0]), Math.abs(n[1]), Math.abs(n[2]));
        if (!(m > 0) || !Number.isFinite(m)) throw new Error('geokernel.plane: normal invàlida ' + n);
        const k = NS / m;
        const a = BigInt(Math.round(n[0] * k)), b = BigInt(Math.round(n[1] * k)), c = BigInt(Math.round(n[2] * k));
        const e = -(a * toGrid(p[0]) + b * toGrid(p[1]) + c * toGrid(p[2]));
        return fromInts(a, b, c, e);
      }
      const get = (id) => { const p = planes[id]; if (!p) throw new Error('geokernel.plane: no hi ha el pla ' + id); return p; };
      // normal unitària en double (per a sortida i heurístiques, MAI per decidir)
      function normal(id, sign) {
        const p = get(id), l = Math.hypot(p.fa, p.fb, p.fc), s = (sign || 1) / l;
        return [p.fa * s, p.fb * s, p.fc * s];
      }
      return { gridExp, normBits, planes, fromInts, fromNormalPoint, get, normal, toGrid, fromGrid, size: () => planes.length };
    }
    return { table };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/plane/snap.js
// geokernel · solids/plane/snap — CANONITZACIÓ DIFUSA d'un pla d'entrada (l'ÚNIC pas amb tolerància del motor).
// Si a la taula ja hi ha un pla amb TOTS els punts de la cara a menys de distTol (la normal a menys d'angTol és només
// un primer filtre), es fa
// servir aquell (cares quasi coplanàries de sòlids diferents → EXACTAMENT el mateix pla). Si no, se'n crea un de nou.
// → { id, sign } (sign = sentit de la normal donada respecte del pla canònic).
// ÍNDEX per direcció de normal (a la mateixa taula, T._snapIdx, al dia de manera mandrosa): cel·les de mida angTol de la
// normal unitària; un pla dins d'angTol cau a la mateixa cel·la o a una de veïna (es miren u i −u: el signe canònic
// d'una component quasi nul·la pot girar). Es proven els candidats per id creixent → el MATEIX resultat que la cerca
// lineal d'abans, sense recórrer tota la taula (527: 75.000 plans, 112 s → mil·lisegons).
(function (def) {
  def('solids/plane/snap', [], function () {
    function distance(T, id, x) {
      const p = T.get(id), G = Math.pow(2, T.gridExp);
      return (p.fa * x[0] * G + p.fb * x[1] * G + p.fc * x[2] * G + p.fe) / (Math.hypot(p.fa, p.fb, p.fc) * G);
    }
    const cellKey = (n, h) => Math.floor(n[0] / h) + ',' + Math.floor(n[1] / h) + ',' + Math.floor(n[2] / h);
    function index(T, h) {
      let I = T._snapIdx;
      if (!I || I.h !== h) I = T._snapIdx = { h, n: 0, cells: new Map() };
      for (; I.n < T.size(); I.n++) {
        const k = cellKey(T.normal(I.n), h);
        let c = I.cells.get(k); if (!c) { c = []; I.cells.set(k, c); } c.push(I.n);
      }
      return I;
    }
    function candidates(I, u) {
      const out = new Set();
      for (const s of [1, -1]) {
        const v = [u[0] * s, u[1] * s, u[2] * s], b = [0, 1, 2].map((i) => Math.floor(v[i] / I.h));
        for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
          const c = I.cells.get((b[0] + dx) + ',' + (b[1] + dy) + ',' + (b[2] + dz));
          if (c) for (const id of c) out.add(id);
        }
      }
      return [...out].sort((a, b) => a - b);
    }
    function snap(T, n, c, pts, opts) {
      const l = Math.hypot(n[0], n[1], n[2]);
      if (!(l > 0)) throw new Error('geokernel.snap: normal nul·la');
      const u = [n[0] / l, n[1] / l, n[2] / l], cosT = Math.cos(opts.angTol);
      // cel·la ≥ l'angle de tolerància (la diferència de components d'unitàries a angle θ és ≤ θ)
      const I = index(T, Math.max(opts.angTol, 1e-6));
      for (const id of candidates(I, u)) {
        const m = T.normal(id), d = u[0] * m[0] + u[1] * m[1] + u[2] * m[2];
        if (Math.abs(d) < cosT) continue;
        if (pts.every((x) => Math.abs(distance(T, id, x)) <= opts.distTol)) return { id, sign: d > 0 ? 1 : -1 };
      }
      return T.fromNormalPoint(u, c);
    }
    return { snap, distance };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/plane/through.js
// geokernel · solids/plane/through — PLA AUXILIAR EXACTE que passa per dos punts exactes a i b i conté la direcció de la
// normal d'un pla P (és a dir, perpendicular a P per la recta ab). Coeficients enters per menors 3×3 (sense arrodonir).
// Només per CALCULAR (p. ex. la recta d'una aresta de plec d'una làmina de gruix zero, que no té cap pla veí): no ha
// d'aparèixer mai en un resultat. → { id, sign } de la taula.
(function (def) {
  def('solids/plane/through', ['solids/exact/bigint'], function (B) {
    function throughPointsDir(T, a, b, P) {
      const p = T.get(P);
      // files: (Xa Ya Za Wa), (Xb Yb Zb Wb), (nx ny nz 0) → el vector nul (A, B, C, D) per menors
      const r1 = a.h, r2 = b.h, r3 = [p.a, p.b, p.c, 0n];
      const m = (i, j, k) => B.det3(r1[i], r1[j], r1[k], r2[i], r2[j], r2[k], r3[i], r3[j], r3[k]);
      const A = m(1, 2, 3), Bc = -m(0, 2, 3), C = m(0, 1, 3), D = -m(0, 1, 2);
      if (A === 0n && Bc === 0n && C === 0n) throw new Error('geokernel.through: punts iguals o recta perpendicular al pla');
      return T.fromInts(A, Bc, C, D);
    }
    return { throughPointsDir };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/plane2d/frame.js
// geokernel · solids/plane2d/frame — MARC 2D EXACTE d'un pla P de la taula: es descarta l'eix dominant de la normal
// canònica; el CCW projectat = CCW vist des de +n. Comparacions exactes de punts (racionals, W > 0) i orientació d'un
// punt respecte d'una aresta per la regla orient = −s·side(X, p) (vegeu README).
(function (def) {
  def('solids/plane2d/frame', ['solids/point', 'solids/exact/bigint'], function (PT, B) {
    const U = Math.pow(2, -52);
    function frame(T, P) {
      const p = T.get(P);
      const n = [p.fa, p.fb, p.fc];
      let k = 0; if (Math.abs(n[1]) > Math.abs(n[k])) k = 1; if (Math.abs(n[2]) > Math.abs(n[k])) k = 2;
      let a = (k + 1) % 3, b = (k + 2) % 3;
      if (n[k] < 0) { const t = a; a = b; b = t; }
      // compara una coordenada (i = a o b) de dos punts: sign(p_i/p_W − q_i/q_W)
      function cmpC(i, P1, Q1) {
        const x = P1.f[i] * Q1.f[3], y = Q1.f[i] * P1.f[3], m = (Math.abs(x) + Math.abs(y)) * 4 * U;
        if (x - y > m) return 1; if (y - x > m) return -1;
        return B.sign(P1.h[i] * Q1.h[3] - Q1.h[i] * P1.h[3]);
      }
      const cmpU = (P1, Q1) => cmpC(a, P1, Q1);
      const cmpV = (P1, Q1) => cmpC(b, P1, Q1);
      const lex = (P1, Q1) => cmpU(P1, Q1) || cmpV(P1, Q1);
      // direcció 2D (enters) de la recta P∩X segons nP × nX
      function lineDir(X) {
        const q = T.get(X);
        const c = [p.b * q.c - p.c * q.b, p.c * q.a - p.a * q.c, p.a * q.b - p.b * q.a];
        return [c[a], c[b]];
      }
      // sentit de a→b respecte de nP × nX (exacte)
      function sense(X, A1, B1) {
        const d = lineDir(X);
        const du = B1.h[a] * A1.h[3] - A1.h[a] * B1.h[3], dv = B1.h[b] * A1.h[3] - A1.h[b] * B1.h[3];
        return B.sign(du * d[0] + dv * d[1]);
      }
      // la direcció nP × nX és creixent en ordre lexicogràfic?
      function lexIncreasing(X) { const d = lineDir(X); return d[0] > 0n || (d[0] === 0n && d[1] > 0n); }
      // orientació del punt respecte de l'aresta (X, s): +1 esquerra, −1 dreta, 0 sobre la recta
      const orient = (X, s, Q1) => -s * PT.side(T, X, Q1);
      // les rectes P∩X i P∩Y són paral·leles (o la mateixa)?
      function parallel(X, Y) { const d = lineDir(X), e = lineDir(Y); return d[0] * e[1] - d[1] * e[0] === 0n; }
      return { P, k, a, b, cmpU, cmpV, lex, lineDir, sense, lexIncreasing, orient, parallel };
    }
    return { frame };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/point/point.js
// geokernel · solids/point — PUNTS = intersecció de 3 plans de la taula. Coordenades homogènies exactes
// (X, Y, Z, W) en BigInt per Cramer, amb W > 0; x = X / W en unitats de graella. Cap punt no té coordenades
// flotants com a veritat: les floats són l'aproximació per al filtre i per a la sortida.
// `on` = plans sobre els quals el punt és per DEFINICIÓ (el seu triple i la incidència topològica): side() hi dona 0
// sense calcular (la topologia mana sobre la geometria).
(function (def) {
  def('solids/point', ['solids/exact/bigint', 'solids/exact/sign'], function (B, S) {
    // APROXIMACIÓ EN DOUBLE de les coordenades homogènies, també quan són enormes (vèrtex de tres plans retocats: 1.100+
    // bits, 527) i Number() donaria ±Infinity: totes quatre dividides per la MATEIXA potència de 2 (homogènia → cap
    // signe ni cap coordenada no canvia). Sense escala (el cas normal), el Number() de sempre.
    const bits = (x) => (x < 0n ? -x : x).toString(2).length;
    function approx(h) {
      const s = Math.max(0, Math.max(bits(h[0]), bits(h[1]), bits(h[2]), bits(h[3])) - 1000);
      if (!s) return h.map(Number);
      return h.map((x) => { const a = x < 0n ? -x : x, k = Math.max(0, bits(a) - 60), v = Number(a >> BigInt(k)) * Math.pow(2, k - s); return x < 0n ? -v : v; });
    }
    function make(T, i, j, k) {
      const p = T.get(i), q = T.get(j), r = T.get(k);
      let W = B.det3(p.a, p.b, p.c, q.a, q.b, q.c, r.a, r.b, r.c);
      if (W === 0n) return null;   // plans no independents: no hi ha punt
      let X = B.det3(-p.e, p.b, p.c, -q.e, q.b, q.c, -r.e, r.b, r.c);
      let Y = B.det3(p.a, -p.e, p.c, q.a, -q.e, q.c, r.a, -r.e, r.c);
      let Zc = B.det3(p.a, p.b, -p.e, q.a, q.b, -q.e, r.a, r.b, -r.e);
      if (W < 0n) { W = -W; X = -X; Y = -Y; Zc = -Zc; }
      const h = [X, Y, Zc, W];
      return { p: [i, j, k], h, f: approx(h), on: new Set([i, j, k]) };
    }
    // signe del punt respecte del pla (canònic): +1 davant (costat de la normal canònica), −1 darrere, 0 a sobre
    function side(T, planeId, pt) {
      if (pt.on.has(planeId)) return 0;
      const p = T.get(planeId);
      return S.dotSign([p.fa, p.fb, p.fc, p.fe], pt.f, () => [p.a, p.b, p.c, p.e], pt.h);
    }
    // igualtat exacta (projectiva)
    function equal(a, b) {
      if (a === b) return true;
      const A = a.h, Bh = b.h;
      return A[0] * Bh[3] === Bh[0] * A[3] && A[1] * Bh[3] === Bh[1] * A[3] && A[2] * Bh[3] === Bh[2] * A[3];
    }
    // clau canònica exacta (per indexar vèrtexs): dividit pel mcd
    // CLAU CANÒNICA per classes MÒDUL TRES PRIMERS de ~2²⁶: (X·W⁻¹, Y·W⁻¹, Z·W⁻¹) mod p. Punts iguals (h proporcionals,
    // W > 0) donen sempre la mateixa clau; dos de diferents només coincidirien si les tres coordenades coincideixen mòdul els
    // tres primers (~2⁻²³⁴). Un sol % BigInt per coordenada; la resta en Number (productes < 2⁵³). Molt més barat que el mcd
    // de quatre enters de 1.000 bits (527: 44 s). Si un primer divideix W, la clau reduïda de sempre.
    const PR = [67108859, 67108837, 67108819], PRB = PR.map(BigInt);
    function invN(a, p) {   // invers modular en Number (a, p < 2²⁶, coprimers)
      let r0 = p, r1 = a, s0 = 0, s1 = 1;
      while (r1) { const q = Math.floor(r0 / r1); [r0, r1] = [r1, r0 - q * r1]; [s0, s1] = [s1, s0 - q * s1]; }
      return ((s0 % p) + p) % p;
    }
    const mdN = (x, k) => { const r = Number(x % PRB[k]); return r < 0 ? r + PR[k] : r; };
    function key(pt) {
      if (pt._key) return pt._key;
      const h = pt.h, out = [];
      for (let k = 0; k < 3; k++) {
        const w = mdN(h[3], k);
        if (!w) { const g = B.gcdAll(h); return (pt._key = 'g' + h.map((v) => (v / g).toString(36)).join(':')); }
        const iw = invN(w, PR[k]);
        for (let c = 0; c < 3; c++) out.push((mdN(h[c], k) * iw % PR[k]).toString(36));
      }
      return (pt._key = out.join(':'));
    }
    // coordenades MODEL en double (sortida)
    function coords(T, pt) {
      const G = Math.pow(2, -T.gridExp), s = Math.max(0, bits(pt.h[3]) - 900), S = BigInt(s), w = Number(pt.h[3] >> S);
      // divisió en BigInt primer quan els valors són enormes, per no perdre precisió relativa
      return [0, 1, 2].map((i) => {
        const q = pt.h[i] * 1048576n / pt.h[3];   // 20 bits de fracció exactes
        return (Number(q) / 1048576 + Number((pt.h[i] * 1048576n - q * pt.h[3]) >> S) / w / 1048576) * G;
      });
    }
    return { make, side, equal, key, coords, approx };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/region2d/arrangement.js
// geokernel · solids/region2d/arrangement — ARRANJAMENT PLANAR de sub-arestes ja partides (cap no en creua cap altra).
// Nodes per clau exacta del punt; arestes no dirigides amb `delta[op]` = (còpies u→v) − (còpies v→u) de cada operand;
// mitges arestes ordenades en sentit antihorari per ANGLE EXACTE (semiplà + producte vectorial d'enters);
// next(h) = l'anterior a twin(h) en l'ordre antihorari (la cara queda a l'esquerra); cicles → cares.
(function (def) {
  def('solids/region2d/arrangement', ['solids/point', 'solids/exact/bigint'], function (PT, B) {
    function build(F, subs, nOps) {
      const nodes = [], nodeOf = new Map();
      const node = (p) => { const k = PT.key(p); let i = nodeOf.get(k); if (i == null) { i = nodes.length; nodeOf.set(k, i); nodes.push({ p, out: [] }); } return i; };
      const edges = [], edgeOf = new Map();
      for (const e of subs) {
        let u = node(e.a), v = node(e.b);
        if (u === v) continue;
        let d = 1, s = e.s;
        if (u > v) { const t = u; u = v; v = t; d = -1; s = -s; }
        const k = u + ',' + v;
        let E = edgeOf.get(k);
        // si la mateixa sub-aresta arriba per un altre pla X de la mateixa recta, es queda el primer (X, s): el delta
        // només depèn de l'ordre dels nodes
        if (!E) { E = { u, v, X: e.X, s, delta: new Int32Array(nOps) }; edgeOf.set(k, E); edges.push(E); }
        E.delta[e.op] += d;
      }
      // mitges arestes: 2i = u→v, 2i+1 = v→u
      const H = [];
      edges.forEach((E, i) => {
        const d = F.lineDir(E.X);
        H.push({ from: E.u, to: E.v, e: i, sg: 1, du: E.s > 0 ? d[0] : -d[0], dv: E.s > 0 ? d[1] : -d[1] });
        H.push({ from: E.v, to: E.u, e: i, sg: -1, du: E.s > 0 ? -d[0] : d[0], dv: E.s > 0 ? -d[1] : d[1] });
        nodes[E.u].out.push(2 * i); nodes[E.v].out.push(2 * i + 1);
      });
      const half = (h) => (h.dv > 0n || (h.dv === 0n && h.du > 0n) ? 0 : 1);
      const cmp = (x, y) => { const a = H[x], b = H[y]; const ha = half(a), hb = half(b); if (ha !== hb) return ha - hb; return -B.sign(a.du * b.dv - a.dv * b.du); };
      const pos = new Int32Array(H.length);
      for (const N of nodes) { N.out.sort(cmp); N.out.forEach((h, i) => { pos[h] = i; }); }
      const twin = (h) => h ^ 1;
      const next = (h) => { const t = twin(h), N = nodes[H[t].from]; return N.out[(pos[t] - 1 + N.out.length) % N.out.length]; };
      // cicles
      const face = new Int32Array(H.length).fill(-1), faces = [];
      for (let h = 0; h < H.length; h++) {
        if (face[h] >= 0) continue;
        const fi = faces.length, cyc = [];
        for (let x = h, guard = 0; face[x] < 0; x = next(x), guard++) { face[x] = fi; cyc.push(x); if (guard > H.length) throw new Error('geokernel.arrangement: cicle infinit'); }
        faces.push(cyc);
      }
      return { nodes, edges, H, faces, face, next, twin, pos };
    }
    return { build };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/region2d/evaluate.js
// geokernel · solids/region2d/evaluate — BOOLEANA 2D EXACTA dins d'un pla: operands = llistes d'arestes { a, b, X, s }
// (cada operand: cicles tancats amb l'interior a l'esquerra), predicats = funcions dels nombres de voltes per operand
// (Int32Array) → cert/fals. Un sol arranjament per a tots els predicats. → per predicat, la llista de contorns.
(function (def) {
  def('solids/region2d/evaluate', ['solids/region2d/split', 'solids/region2d/arrangement', 'solids/region2d/winding', 'solids/region2d/extract'], function (SP, AR, WN, EX) {
    function evaluate(T, F, operands, preds) {
      const all = [];
      operands.forEach((list, op) => { for (const e of list) all.push({ a: e.a, b: e.b, X: e.X, s: e.s, op }); });
      if (!all.length) return preds.map(() => []);
      try {
        const subs = SP.split(T, F, all);
        const A = AR.build(F, subs, operands.length);
        const W = WN.windings(F, A, operands.length);
        return preds.map((pred) => EX.extract(A, W.map((w) => (w ? !!pred(w) : false))));
      } catch (e) {
        // l'error arrastra el pla i els operands on ha passat (per a la diagnosi: solids/diag); es torna a llançar
        if (!e.diag) e.diag = { P: F.P, F, operands };
        throw e;
      }
    }
    return { evaluate };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/region2d/extract.js
// geokernel · solids/region2d/extract — CONTORNS d'una regió de l'arranjament: les mitges arestes amb la regió a
// l'esquerra i fora a la dreta, encadenades girant en sentit HORARI des de la bessona a cada node (la regió sempre a
// l'esquerra; dues regions que es toquen per un vèrtex surten en contorns separats). Es treuen els vèrtexs on el
// contorn segueix recte per la mateixa recta (mateix pla X i mateix sentit).
// → [{ pts: [punt…], X: [pla de l'aresta i → i+1], s: [sentit] }]
(function (def) {
  def('solids/region2d/extract', [], function () {
    function extract(A, inside) {
      const { nodes, edges, H, face, pos } = A;
      const isOut = (h) => inside[face[h]] && !inside[face[h ^ 1]];
      const used = new Uint8Array(H.length), loops = [];
      for (let h0 = 0; h0 < H.length; h0++) {
        if (used[h0] || !isOut(h0)) continue;
        const hs = [];
        for (let h = h0, guard = 0; !used[h]; guard++) {
          used[h] = 1; hs.push(h);
          const t = h ^ 1, N = nodes[H[h].to];
          let x = t;
          for (let i = 1; i <= N.out.length; i++) { x = N.out[(pos[t] - i + N.out.length * 2) % N.out.length]; if (isOut(x)) break; }
          if (!isOut(x)) throw new Error('geokernel.extract: contorn obert');
          h = x;
          if (guard > H.length) throw new Error('geokernel.extract: contorn infinit');
        }
        const ed = hs.map((h) => ({ p: nodes[H[h].from].p, X: edges[H[h].e].X, s: edges[H[h].e].s * H[h].sg }));
        // fora els vèrtexs rectes
        for (let changed = true; changed && ed.length > 3;) {
          changed = false;
          for (let i = 0; i < ed.length && ed.length > 3; i++) {
            const pr = ed[(i + ed.length - 1) % ed.length];
            if (pr.X === ed[i].X && pr.s === ed[i].s) { ed.splice(i, 1); changed = true; i--; }
          }
        }
        loops.push({ pts: ed.map((e) => e.p), X: ed.map((e) => e.X), s: ed.map((e) => e.s) });
      }
      return loops;
    }
    return { extract };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/region2d/reverse.js
// geokernel · solids/region2d/reverse — GIRA un contorn { pts, X } (els punts a l'inrevés; el pla de cada aresta segueix la
// seva aresta: la i-èsima nova va de pts[n-1-i] a pts[n-2-i], que era l'aresta n-2-i).
(function (def) {
  def('solids/region2d/reverse', [], function () {
    function reverseLoop(l) {
      const n = l.pts.length, pts = [], X = [];
      for (let j = 0; j < n; j++) { pts.push(l.pts[n - 1 - j]); X.push(l.X[((n - 2 - j) % n + n) % n]); }
      return { pts, X };
    }
    return { reverseLoop };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/region2d/split.js
// geokernel · solids/region2d/split — PARTEIX les arestes 2D d'un pla on es toquen: creuament propi (punt nou =
// (P, X1, X2), EXACTE), extrem sobre l'interior d'una altra (T) i solapament de rectes iguals. Arestes { a, b, X, s, op }.
// Filtre per capses en double amb marge; totes les decisions, exactes. Retorna les sub-arestes (mateix X, s, op).
(function (def) {
  def('solids/region2d/split', ['solids/point'], function (PT) {
    function split(T, F, edges) {
      const n = edges.length;
      const xy = (p) => [p.f[F.a] / p.f[3], p.f[F.b] / p.f[3]];
      const box = edges.map((e) => {
        const A = xy(e.a), B = xy(e.b);
        const m = 1e-9 * (Math.abs(A[0]) + Math.abs(A[1]) + Math.abs(B[0]) + Math.abs(B[1]) + 1);
        return [Math.min(A[0], B[0]) - m, Math.min(A[1], B[1]) - m, Math.max(A[0], B[0]) + m, Math.max(A[1], B[1]) + m];
      });
      const cuts = edges.map(() => []);
      // escombrat per x
      const ord = edges.map((_, i) => i).sort((i, j) => box[i][0] - box[j][0]);
      const strictlyIn = (q, e) => { const c1 = F.lex(e.a, q), c2 = F.lex(q, e.b); return c1 !== 0 && c1 === c2; };
      for (let oi = 0; oi < n; oi++) {
        const i = ord[oi], bi = box[i], ei = edges[i];
        for (let oj = oi + 1; oj < n; oj++) {
          const j = ord[oj], bj = box[j];
          if (bj[0] > bi[2]) break;
          if (bj[1] > bi[3] || bj[3] < bi[1]) continue;
          const ej = edges[j];
          const oa = F.orient(ei.X, ei.s, ej.a), ob = F.orient(ei.X, ei.s, ej.b);
          if (oa === 0 && ob === 0) {            // mateixa recta: solapament
            if (strictlyIn(ej.a, ei)) cuts[i].push(ej.a);
            if (strictlyIn(ej.b, ei)) cuts[i].push(ej.b);
            if (strictlyIn(ei.a, ej)) cuts[j].push(ei.a);
            if (strictlyIn(ei.b, ej)) cuts[j].push(ei.b);
            continue;
          }
          if (oa === ob) continue;
          const oc = F.orient(ej.X, ej.s, ei.a), od = F.orient(ej.X, ej.s, ei.b);
          if (oc === od) continue;
          if (oa * ob < 0 && oc * od < 0) {
            const p = PT.make(T, F.P, ei.X, ej.X);
            if (!p) throw new Error('geokernel.split: rectes que es creuen però paral·leles');
            cuts[i].push(p); cuts[j].push(p);
          } else if (oc * od < 0) {               // un extrem de j sobre l'interior de i
            cuts[i].push(oa === 0 ? ej.a : ej.b);
          } else if (oa * ob < 0) {               // un extrem de i sobre l'interior de j
            cuts[j].push(oc === 0 ? ei.a : ei.b);
          }
        }
      }
      const out = [];
      edges.forEach((e, i) => {
        if (!cuts[i].length) { out.push(e); return; }
        const asc = F.lex(e.a, e.b) < 0;
        const pts = cuts[i].slice().sort((p, q) => (asc ? F.lex(p, q) : F.lex(q, p)));
        let prev = e.a;
        for (const p of pts) { if (PT.equal(p, prev)) continue; out.push({ a: prev, b: p, X: e.X, s: e.s, op: e.op }); prev = p; }
        if (!PT.equal(prev, e.b)) out.push({ a: prev, b: e.b, X: e.X, s: e.s, op: e.op });
      });
      return out;
    }
    return { split };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/region2d/winding.js
// geokernel · solids/region2d/winding — NOMBRE DE VOLTES de cada operand a cada cara de l'arranjament.
// Per cada component connex: el seu node més baix (v, després u) → la cara exterior és a la dreta de la seva primera
// mitja aresta; les voltes d'aquesta cara es compten amb un RAIG EXACTE cap a +u des del node, contra les arestes de
// les ALTRES components (regla semioberta). Després, recorregut en amplada: travessar h d'esquerra a dreta resta delta(h).
// Inconsistència (dues voltes diferents per a la mateixa cara) → LLANÇA.
(function (def) {
  def('solids/region2d/winding', [], function () {
    function windings(F, A, nOps) {
      const { nodes, edges, H, faces, face } = A;
      const uf = nodes.map((_, i) => i), find = (x) => { while (uf[x] !== x) x = uf[x] = uf[uf[x]]; return x; };
      for (const E of edges) uf[find(E.u)] = find(E.v);
      const comps = new Map();
      nodes.forEach((N, i) => { if (!N.out.length) return; const r = find(i); if (!comps.has(r)) comps.set(r, []); comps.get(r).push(i); });
      const W = faces.map(() => null);
      for (const [r, list] of comps) {
        let q = list[0];
        for (const i of list) { const c = F.cmpV(nodes[i].p, nodes[q].p) || F.cmpU(nodes[i].p, nodes[q].p); if (c < 0) q = i; }
        const outer = face[nodes[q].out[0] ^ 1];
        const w0 = new Int32Array(nOps), Q = nodes[q].p;
        for (const E of edges) {
          if (find(E.u) === r) continue;
          const au = F.cmpV(nodes[E.u].p, Q) > 0, av = F.cmpV(nodes[E.v].p, Q) > 0;
          if (au === av) continue;
          const up = !au;                      // u a sota → l'aresta u→v puja
          const s = up ? E.s : -E.s;
          if (F.orient(E.X, s, Q) > 0) for (let k = 0; k < nOps; k++) w0[k] += up ? E.delta[k] : -E.delta[k];
        }
        W[outer] = w0;
        const queue = [outer];
        while (queue.length) {
          const f = queue.pop(), wf = W[f];
          for (const h of faces[f]) {
            const g = face[h ^ 1], E = edges[H[h].e], sg = H[h].sg;
            const wg = new Int32Array(nOps);
            for (let k = 0; k < nOps; k++) wg[k] = wf[k] - sg * E.delta[k];
            if (!W[g]) { W[g] = wg; queue.push(g); }
            else for (let k = 0; k < nOps; k++) if (W[g][k] !== wg[k]) throw new Error('geokernel.winding: voltes inconsistents (operand ' + k + ': ' + W[g][k] + ' ≠ ' + wg[k] + ') — algun operand no és tancat');
          }
        }
      }
      return W;
    }
    return { windings };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/repair/clean.js
// geokernel · solids/repair/clean — fora TRIANGLES DEGENERATS (vèrtex repetit o àrea ~0 respecte de `tol`) i
// DUPLICATS: dos triangles amb els mateixos 3 vèrtexs i el mateix sentit → se'n queda un; en sentit OPOSAT → tots dos
// fora (una paret de gruix zero no és sòlid). Sopa { V, T } → { V, T, stats }.
(function (def) {
  def('solids/repair/clean', [], function () {
    function clean(S, tol) {
      const { V } = S, seen = new Map(), out = [];
      let degenerate = 0, dupSame = 0, dupOpp = 0;
      for (const t of S.T) {
        const [a, b, c] = t;
        if (a === b || b === c || c === a) { degenerate++; continue; }
        const p = V[a], q = V[b], r = V[c];
        const u = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], v = [r[0] - p[0], r[1] - p[1], r[2] - p[2]];
        const n = Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]);
        const lmax = Math.max(Math.hypot(...u), Math.hypot(...v), Math.hypot(r[0] - q[0], r[1] - q[1], r[2] - q[2]));
        if (!(n > 0) || n / lmax < tol * 1e-3) { degenerate++; continue; }   // alçada < tol/1000·2: una agulla sense superfície
        const s = [a, b, c].sort((x, y) => x - y), k = s.join(',');
        // sentit: parell de la permutació respecte de l'ordenat
        const rot = (a < b) + (b < c) + (c < a);   // 2 per a l'ordre cíclic creixent, 1 per al decreixent
        const prev = seen.get(k);
        if (!prev) { seen.set(k, { i: out.length, rot }); out.push(t); continue; }
        if (prev.rot === rot) { dupSame++; continue; }
        dupOpp++; out[prev.i] = null; seen.delete(k);
      }
      return { V, T: out.filter(Boolean), stats: { degenerate, dupSame, dupOpp } };
    }
    return { clean };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/repair/flat-vertices.js
// geokernel · solids/repair/flatVertices — TREU ELS VÈRTEXS PLANS: un vèrtex amb tots els triangles del voltant dins d'un
// mateix pla (a menys de `tol`) i un ventall tancat (vèrtex interior d'una superfície) es treu i el seu contorn es
// retriangula. La forma no canvia (l'àrea amb signe d'un ventall és la del seu contorn, sigui on sigui el centre), i
// desapareixen les «aletes» plegades de volum zero que deixen algunes eines (triangles solapats en sentits oposats).
// Si el contorn no es pot triangular, el vèrtex es queda. Sopa { V, T } → { V, T, stats: { removed } }.
(function (def) {
  def('solids/repair/flatVertices', ['2d/triangulate'], function (TR) {
    function flatVertices(S, tol) {
      const { V } = S;
      let T = S.T.map((t) => { const c = t.slice(); c.f = t.f; return c; }), removed = 0;
      for (let pass = 0; pass < 100; pass++) {
        const inc = new Map();
        T.forEach((t, i) => { if (t) for (const v of t) { if (!inc.has(v)) inc.set(v, []); inc.get(v).push(i); } });
        let changed = false;
        for (const [v, list] of inc) {
          const tris = list.filter((i) => T[i] && T[i].includes(v));
          if (tris.length < 3) continue;
          // amb cara d'origen: només si tots els triangles del voltant són de la MATEIXA cara (si no, el vèrtex és una cantonada)
          const f0 = T[tris[0]].f;
          if (tris.some((i) => T[i].f !== f0)) continue;
          // contorn ordenat: cada triangle (v, a, b) en sentit → aresta a→b
          const next = new Map();
          let bad = false;
          for (const i of tris) { const t = T[i], k = t.indexOf(v), a = t[(k + 1) % 3], b = t[(k + 2) % 3]; if (next.has(a)) { bad = true; break; } next.set(a, b); }
          if (bad) continue;
          const ring = []; let cur = next.keys().next().value;
          for (let g = 0; g <= tris.length; g++) { ring.push(cur); cur = next.get(cur); if (cur == null) { bad = true; break; } if (cur === ring[0]) break; }
          if (bad || ring.length !== tris.length) continue;
          // pla mitjà (Newell del contorn) i tots els punts (centre inclòs) a menys de tol
          const n = [0, 0, 0], c = [0, 0, 0];
          for (let i = 0; i < ring.length; i++) { const p = V[ring[i]], q = V[ring[(i + 1) % ring.length]]; n[0] += (p[1] - q[1]) * (p[2] + q[2]); n[1] += (p[2] - q[2]) * (p[0] + q[0]); n[2] += (p[0] - q[0]) * (p[1] + q[1]); for (let k = 0; k < 3; k++) c[k] += p[k] / ring.length; }
          const nl = Math.hypot(...n); if (!(nl > 0)) continue;
          const u = n.map((x) => x / nl), d = (p) => Math.abs((p[0] - c[0]) * u[0] + (p[1] - c[1]) * u[1] + (p[2] - c[2]) * u[2]);
          if (d(V[v]) > tol || ring.some((r) => d(V[r]) > tol)) continue;
          let k = 0; if (Math.abs(u[1]) > Math.abs(u[k])) k = 1; if (Math.abs(u[2]) > Math.abs(u[k])) k = 2;
          let a = (k + 1) % 3, b = (k + 2) % 3; if (u[k] < 0) { const t = a; a = b; b = t; }
          let res;
          try { res = TR.triangulate(ring.map((r) => [V[r][a], V[r][b]]), [], { keepCollinear: true }); } catch (e) { continue; }   // contorn no triangulable: el vèrtex es queda (cas previst)
          if (!res.tris.length) continue;
          for (const i of tris) T[i] = null;
          for (const t of res.tris) { const nt = [ring[t[0]], ring[t[1]], ring[t[2]]]; nt.f = f0; T.push(nt); }
          removed++; changed = true;   // els vèrtexs veïns, amb la incidència vella, veuen un ventall trencat i esperen la passada següent
        }
        T = T.filter(Boolean);
        if (!changed) break;
      }
      return { V, T, stats: { removed } };
    }
    return { flatVertices };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/repair/orient.js
// geokernel · solids/repair/orient — ORIENTACIÓ COHERENT: per cada component connex (per arestes amb exactament 2
// triangles), recorregut en amplada girant els veïns que recorren l'aresta compartida en el MATEIX sentit; després,
// si el volum signat del component és negatiu, es gira sencer (normals cap enfora).
// Sopa { V, T } → { V, T, stats: { flipped, componentsFlipped, conflicts } } (conflicts = superfície no orientable).
(function (def) {
  def('solids/repair/orient', [], function () {
    function orient(S) {
      const { V } = S, T = S.T.map((t) => { const c = t.slice(); c.f = t.f; return c; });   // conserva la cara d'origen
      const edges = new Map(), ek = (a, b) => (a < b ? a + ',' + b : b + ',' + a);
      T.forEach((t, i) => { for (let e = 0; e < 3; e++) { const k = ek(t[e], t[(e + 1) % 3]); if (!edges.has(k)) edges.set(k, []); edges.get(k).push(i); } });
      const has = (t, a, b) => (t[0] === a && t[1] === b) || (t[1] === a && t[2] === b) || (t[2] === a && t[0] === b);
      const comp = new Int32Array(T.length).fill(-1);
      let flipped = 0, componentsFlipped = 0, conflicts = 0, nc = 0;
      for (let s = 0; s < T.length; s++) {
        if (comp[s] >= 0) continue;
        const members = [s]; comp[s] = nc;
        for (let q = 0; q < members.length; q++) {
          const t = T[members[q]];
          for (let e = 0; e < 3; e++) {
            const a = t[e], b = t[(e + 1) % 3], l = edges.get(ek(a, b));
            if (l.length !== 2) continue;
            const o = l[0] === members[q] ? l[1] : l[0], to = T[o];
            const same = has(to, a, b);                 // el veí recorre a→b igual: mal orientat respecte de t
            if (comp[o] < 0) { if (same) { to.reverse(); flipped++; } comp[o] = nc; members.push(o); }
            else if (same) conflicts++;
          }
        }
        let vol = 0;
        for (const i of members) { const [p, q, r] = T[i].map((v) => V[v]); vol += p[0] * (q[1] * r[2] - q[2] * r[1]) - p[1] * (q[0] * r[2] - q[2] * r[0]) + p[2] * (q[0] * r[1] - q[1] * r[0]); }
        if (vol < 0) { for (const i of members) T[i].reverse(); componentsFlipped++; }
        nc++;
      }
      return { V, T, stats: { flipped, componentsFlipped, conflicts, components: nc } };
    }
    return { orient };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/repair/repair.js
// geokernel · solids/repair — REPARACIÓ D'UNA MALLA D'ENTRADA abans de fer-ne un BREP (les malles de web-ifc i d'altres
// eines arriben obertes, amb T, girades…): soldadura → cares de contacte anul·lades → degenerats/duplicats → juntes en T → degenerats → forats en forma de llesca tapats → orientació → vèrtexs plans fora (aletes plegades).
// repair(mesh, { tol }) → { positions, indices, faceOf?, stats } (faceOf: la cara d'origen de cada triangle, heretada) · tol en unitats del model (per defecte 1e-4 = 0,1 mm en metres,
// la de WEB-IFC). No inventa geometria: només cus la que hi ha, i tapa forats de LLESCA (≤ 10·tol d'ample) que l'eina d'origen ha perdut.
(function (def) {
  def('solids/repair', ['solids/repair/weld', 'solids/repair/clean', 'solids/repair/tjunctions', 'solids/repair/orient', 'solids/repair/flatVertices', 'solids/repair/slivers', 'solids/validate/mesh', 'solids/repair/sheets'], function (W, C, TJ, O, FV, SL, VM, SH) {
    // GARANTIA: la reparació MAI no empitjora una malla. Si l'entrada ja era bona (tancada, manifold, ben orientada,
    // sense degenerats ni duplicats) i la sortida no ho és, es torna l'entrada tal qual (talladors cilíndrics petits:
    // juntes en T falses a vèrtexs de 0,26 mm; un vèrtex «pla» que no ho era — casos del ganxo de web-ifc 2169, 1225, 540).
    // I si la sortida té més arestes nues o no-manifold que l'entrada (APHS), també.
    function repair(mesh, opts) {
      const r = repairSteps(mesh, opts), vin = VM.check(mesh);
      const good = (v) => !v.naked && !v.nonManifold && !v.misoriented && !v.degenerate && !v.duplicates;
      const vout = VM.check(r), worse = vout.naked > vin.naked;
      // també quan l'entrada és tancada i manifold però té degenerats (APHS: 4 triangles de gruix zero → la reparació en
      // feia 3 nues i 6 no-manifold): si la sortida té MÉS arestes nues, es queda l'entrada
      // (les no-manifold no compten: n'hi ha de vàlides que fromMesh aparella radialment — 540, capes en diagonal)
      if ((good(vin) && !good(vout)) || worse) return { positions: Float64Array.from(mesh.positions), indices: Uint32Array.from(mesh.indices), faceOf: mesh.faceOf ? Int32Array.from(mesh.faceOf) : undefined, stats: Object.assign({ kept: "l'entrada ja era bona i la reparació l'empitjorava" }, r.stats) };
      return r;
    }
    function repairSteps(mesh, opts) {
      const tol = (opts && opts.tol) || 1e-4;
      let S = W.weld(mesh, tol);
      const s0 = SH.sheets(S, tol); S = s0;   // cares de contacte (mateix contorn, sentits oposats) fora
      const s1 = C.clean(S, tol); S = s1;
      // una junta en T de debò sempre deixa arestes NUES (per índexs): si no n'hi ha cap, no se'n busquen (en un tallador
      // cilíndric petit, vèrtexs a < tol d'altres arestes donaven centenars de T falses que obrien una malla bona — 2169)
      const nakedIdx = (X) => { const c = new Map(); for (const t of X.T) for (let q = 0; q < 3; q++) { const a = t[q], b = t[(q + 1) % 3]; if (a === b) continue; const k = a < b ? a + ',' + b : b + ',' + a; c.set(k, (c.get(k) || 0) + 1); } let n = 0; for (const v of c.values()) if (v === 1) n++; return n; };
      const s2 = nakedIdx(S) ? TJ.tjunctions(S, tol) : { V: S.V, T: S.T, stats: { split: 0, skipped: 'sense arestes nues' } }; S = s2;
      const s3 = C.clean(S, tol); S = s3;
      const s35 = SL.slivers(S, tol); S = s35;
      const s4 = O.orient(S); S = s4;
      // vèrtexs plans (aletes plegades) fora; però MAI si deixa més arestes nues o no-manifold que abans (test2: una malla
      // ja tancada i manifold sortia amb una no-manifold). Després, una 2a passada de cares de contacte: una làmina de gruix
      // zero (dues cares del mateix pla amb el contorn invers) sovint només apareix neta després de clean (UMDASH)
      const holes = (X) => { const c = new Map(); for (const t of X.T) for (let q = 0; q < 3; q++) { const a = t[q], b = t[(q + 1) % 3]; if (a === b) continue; const k = a < b ? a + ',' + b : b + ',' + a; c.set(k, (c.get(k) || 0) + 1); } let n = 0, m = 0; for (const v of c.values()) { if (v === 1) n++; else if (v > 2) m++; } return [n, m]; };
      const h4 = holes(S), s5t = FV.flatVertices(S, tol), h5 = holes(s5t);
      const s5 = h5[0] > h4[0] || (h5[0] === h4[0] && h5[1] > h4[1]) ? { V: S.V, T: S.T, stats: { removed: 0, skipped: 'empitjorava' } } : s5t; S = s5;
      const s6 = SH.sheets(S, tol); S = { V: s6.V, T: s6.T };
      const positions = new Float64Array(S.V.length * 3);
      S.V.forEach((p, i) => { positions[3 * i] = p[0]; positions[3 * i + 1] = p[1]; positions[3 * i + 2] = p[2]; });
      const indices = new Uint32Array(S.T.length * 3);
      S.T.forEach((t, i) => { indices[3 * i] = t[0]; indices[3 * i + 1] = t[1]; indices[3 * i + 2] = t[2]; });
      // la cara d'origen de cada triangle, si l'entrada en portava
      const faceOf = S.T.length && S.T.every((t) => t.f != null) ? Int32Array.from(S.T.map((t) => t.f)) : undefined;
      return { positions, indices, faceOf, stats: { sheets: s0.stats, clean: s1.stats, tjunctions: s2.stats, clean2: s3.stats, slivers: s35.stats, orient: s4.stats, flatVertices: s5.stats, sheets2: s6.stats } };
    }
    return { repair };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/repair/sheets.js
// geokernel · solids/repair/sheets — CARES DE CONTACTE que s'anul·len: dos sòlids enganxats en una sola malla (web-ifc hi
// ajunta les obertures) es toquen per una cara; hi queden la cara d'un (cap avall) i la de l'altre (cap amunt) sobre el
// MATEIX pla i amb el MATEIX contorn, però sovint triangulades per diagonals diferents → clean (que només anul·la triangles
// idèntics) no les veu i les arestes del contorn queden amb 3 o 4 triangles (2169 #13842: aresta no-manifold sense
// alternança). Aquí es comparen per CONTORN: per a cada pla, peces connexes de triangles coplanaris del mateix sentit (les
// còpies exactes van a capes separades); una peça cap amunt i una cap avall amb el contorn exactament invers s'eliminen
// totes dues (volum zero entre elles). Sopa { V, T } → { V, T, stats: { cancelled } }. Només treu triangles; mai en crea.
(function (def) {
  def('solids/repair/sheets', [], function () {
    function sheets(S, tol) {
      const { V } = S, T = S.T;
      // pla de cada triangle: normal unitària canònica (signe) i distància, arrodonides → clau; sentit = signe
      const info = T.map((t) => {
        const a = V[t[0]], b = V[t[1]], c = V[t[2]];
        const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
        let n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
        const L = Math.hypot(n[0], n[1], n[2]); if (!(L > 0)) return null;
        n = n.map((x) => x / L);
        let k = 0; if (Math.abs(n[1]) > Math.abs(n[k])) k = 1; if (Math.abs(n[2]) > Math.abs(n[k])) k = 2;
        const s = n[k] > 0 ? 1 : -1, m = n.map((x) => x * s), d = m[0] * a[0] + m[1] * a[1] + m[2] * a[2];
        return { key: m.map((x) => Math.round(x * 1e6)).join(',') + '|' + Math.round(d / tol), s };
      });
      const byPlane = new Map();
      T.forEach((t, ti) => { const f = info[ti]; if (!f) return; if (!byPlane.has(f.key)) byPlane.set(f.key, []); byPlane.get(f.key).push(ti); });
      const remove = new Set();
      const ek = (u, v) => u + ',' + v;
      for (const tis of byPlane.values()) {
        if (tis.length < 2) continue;
        const sides = new Set(tis.map((ti) => info[ti].s)); if (sides.size < 2) continue;
        // capes: les còpies exactes (mateixos 3 vèrtexs, mateix sentit) van a capes diferents
        const seen = new Map(), layer = new Map();
        for (const ti of tis) { const k = [...T[ti]].sort((x, y) => x - y).join(',') + '|' + info[ti].s; const n = seen.get(k) || 0; seen.set(k, n + 1); layer.set(ti, n); }
        // peces: connexes per arestes dins del mateix (sentit, capa)
        const groups = new Map();
        for (const ti of tis) { const g = info[ti].s + ':' + layer.get(ti); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(ti); }
        const patches = [];
        for (const [g, list] of groups) {
          const uf = new Map(list.map((ti) => [ti, ti])), find = (x) => { while (uf.get(x) !== x) { uf.set(x, uf.get(uf.get(x))); x = uf.get(x); } return x; };
          const byEdge = new Map();
          for (const ti of list) for (let q = 0; q < 3; q++) { const a = T[ti][q], b = T[ti][(q + 1) % 3], k = a < b ? a + ',' + b : b + ',' + a; if (byEdge.has(k)) uf.set(find(ti), find(byEdge.get(k))); else byEdge.set(k, ti); }
          const comp = new Map(); for (const ti of list) { const r = find(ti); if (!comp.has(r)) comp.set(r, []); comp.get(r).push(ti); }
          for (const c of comp.values()) {
            // contorn: arestes dirigides que no s'anul·len dins de la peça
            const cnt = new Map();
            for (const ti of c) for (let q = 0; q < 3; q++) { const a = T[ti][q], b = T[ti][(q + 1) % 3]; const r = ek(b, a); if (cnt.get(r) > 0) cnt.set(r, cnt.get(r) - 1); else cnt.set(ek(a, b), (cnt.get(ek(a, b)) || 0) + 1); }
            const bd = [...cnt.entries()].filter(([, n]) => n > 0).map(([k]) => k).sort();
            const rev = bd.map((k) => { const [a, b] = k.split(','); return ek(b, a); }).sort();
            patches.push({ s: +g.split(':')[0], tris: c, bd: bd.join(' '), rev: rev.join(' '), used: false });
          }
        }
        for (const p of patches) {
          if (p.used || p.s !== 1 || !p.bd) continue;
          const q = patches.find((x) => !x.used && x.s === -1 && x.bd === p.rev);
          if (!q) continue;
          p.used = q.used = true;
          for (const ti of p.tris) remove.add(ti);
          for (const ti of q.tris) remove.add(ti);
        }
      }
      const out = []; T.forEach((t, ti) => { if (!remove.has(ti)) out.push(t); });
      return { V, T: out, stats: { cancelled: remove.size } };
    }
    return { sheets };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/repair/slivers.js
// geokernel · solids/repair/slivers — TAPA ELS FORATS EN FORMA DE LLESCA: un cicle d'arestes nues de 3 a 8 arestes l'«amplada»
// del qual (2·àrea / aresta més llarga) és ≤ 10·tol es tapa amb un ventall de triangles (sentit contrari a les arestes nues,
// cara d'origen la del triangle de l'aresta més llarga). Són triangles que l'eina d'origen ha perdut entre dues cares (175
// #171813: 19 cm × 0,2 mm). Un forat més ample NO es toca mai (pot ser una obertura real): la malla es queda oberta i
// fromMesh ho diu. Sopa { V, T } → { V, T, stats: { filled } }.
(function (def) {
  def('solids/repair/slivers', [], function () {
    function slivers(S, tol) {
      const { V } = S, T = S.T.map((t) => { const c = t.slice(); c.f = t.f; return c; });
      // una aresta és NUA si només la fa servir UN triangle, en qualsevol sentit (dos triangles girats la fan servir dues
      // vegades en el mateix sentit: no és un forat, és orientació, i ho arregla orient)
      const und = new Map(), owner = new Map();
      T.forEach((t, ti) => { for (let k = 0; k < 3; k++) { const a = t[k], b = t[(k + 1) % 3], u = a < b ? a + ',' + b : b + ',' + a; und.set(u, (und.get(u) || 0) + 1); owner.set(a + ',' + b, ti); } });
      // arestes nues dirigides a→b (sense b→a); un sol successor per vèrtex (si n'hi ha més, ambigu: no es toca)
      const next = new Map(), amb = new Set();
      for (const [key] of owner) { const [a, b] = key.split(',').map(Number); if (und.get(a < b ? key : b + ',' + a) !== 1) continue; if (next.has(a)) amb.add(a); next.set(a, b); }
      const seen = new Set();
      let filled = 0;
      const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
      for (const start of next.keys()) {
        if (seen.has(start) || amb.has(start)) continue;
        const cyc = [];
        let v = start, ok = true;
        while (true) { if (amb.has(v) || !next.has(v) || cyc.length > 8) { ok = false; break; } cyc.push(v); v = next.get(v); if (v === start) break; if (cyc.includes(v)) { ok = false; break; } }
        cyc.forEach((x) => seen.add(x));
        if (!ok || cyc.length < 3) continue;
        // àrea (vector) i aresta més llarga
        const n = [0, 0, 0]; let longest = 0, li = 0;
        for (let i = 0; i < cyc.length; i++) {
          const p = V[cyc[i]], q = V[cyc[(i + 1) % cyc.length]];
          n[0] += p[1] * q[2] - p[2] * q[1]; n[1] += p[2] * q[0] - p[0] * q[2]; n[2] += p[0] * q[1] - p[1] * q[0];
          const l = Math.hypot(...sub(q, p)); if (l > longest) { longest = l; li = i; }
        }
        const area = Math.hypot(...n) / 2;
        if (!(longest > 0) || 2 * area / longest > 10 * tol) continue;
        const f = T[owner.get(cyc[li] + ',' + cyc[(li + 1) % cyc.length])].f;
        // ventall des del primer vèrtex, en sentit contrari al cicle d'arestes nues
        for (let i = 1; i + 1 < cyc.length; i++) { const t = [cyc[0], cyc[i + 1], cyc[i]]; t.f = f; T.push(t); }
        filled++;
      }
      return { V, T, stats: { filled } };
    }
    return { slivers };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/repair/tjunctions.js
// geokernel · solids/repair/tjunctions — JUNTES EN T: un vèrtex que cau a l'interior d'una aresta d'un triangle
// (a menys de `tol` i amb t dins (ε, 1−ε)) parteix el triangle en ventall pels punts de l'aresta, ordenats. Es repeteix
// fins que no queda cap T (els triangles nous poden tenir-ne d'altres). Graella de vèrtexs per al filtre.
// Si els triangles creixen sense límit (527-odéon: 17.000 → 750.000 i 4 GB), LLANÇA: mai una cursa de memòria.
// Sopa { V, T } → { V, T, stats: { split } }.
(function (def) {
  def('solids/repair/tjunctions', [], function () {
    function tjunctions(S, tol) {
      const { V } = S;
      let T = S.T.slice(), split = 0;
      const limit = 20 * T.length + 10000;
      let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
      for (const p of V) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], p[k]); hi[k] = Math.max(hi[k], p[k]); }
      const used = new Set(); for (const t of T) for (const v of t) used.add(v);
      const span = Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2], tol);
      const cell = Math.max(span / Math.max(1, Math.cbrt(used.size) * 2), tol * 4);
      const grid = new Map(), ci = (x, k) => Math.floor((x - lo[k]) / cell), gk = (i, j, k) => i + ',' + j + ',' + k;
      for (const v of used) { const p = V[v], k = gk(ci(p[0], 0), ci(p[1], 1), ci(p[2], 2)); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(v); }
      function onEdge(a, b) {
        const A = V[a], B = V[b], d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], L2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
        if (!(L2 > 0)) return [];
        const res = [], eps = tol / Math.sqrt(L2) * 1e-3;
        const r = [0, 1, 2].map((k) => [ci(Math.min(A[k], B[k]) - tol, k), ci(Math.max(A[k], B[k]) + tol, k)]);
        for (let i = r[0][0]; i <= r[0][1]; i++) for (let j = r[1][0]; j <= r[1][1]; j++) for (let k = r[2][0]; k <= r[2][1]; k++) {
          const l = grid.get(gk(i, j, k)); if (!l) continue;
          for (const v of l) {
            if (v === a || v === b) continue;
            const p = V[v], t = ((p[0] - A[0]) * d[0] + (p[1] - A[1]) * d[1] + (p[2] - A[2]) * d[2]) / L2;
            if (t <= eps || t >= 1 - eps) continue;
            const x = A[0] + t * d[0] - p[0], y = A[1] + t * d[1] - p[1], z = A[2] + t * d[2] - p[2];
            if (x * x + y * y + z * z <= tol * tol) res.push([t, v]);
          }
        }
        return res.sort((x, y) => x[0] - y[0]).map((x) => x[1]);
      }
      let cleanPrev = new Set();
      for (let pass = 0; pass < 20; pass++) {
        const out = []; let changed = false;
        // un triangle sense cap T a les seves arestes ja no en tindrà mai (aquest pas no crea vèrtexs): a partir de la 2a passada
        // només es revisen els triangles NOUS (abans es tornaven a revisar tots: el 13 % del temps d'una crida del ganxo)
        const clean = new Set();
        for (const t of T) {
          if (cleanPrev.has(t)) { out.push(t); clean.add(t); continue; }
          let done = false;
          for (let e = 0; e < 3 && !done; e++) {
            const a = t[e], b = t[(e + 1) % 3], c = t[(e + 2) % 3], pts = onEdge(a, b);
            if (!pts.length) continue;
            const chain = [a, ...pts, b];
            for (let i = 0; i + 1 < chain.length; i++) { const nt = [chain[i], chain[i + 1], c]; nt.f = t.f; out.push(nt); }   // hereta la cara d'origen
            split += pts.length; done = true; changed = true;
          }
          if (!done) { out.push(t); clean.add(t); }
        }
        T = out; cleanPrev = clean;
        if (T.length > limit) throw new Error('geokernel.tjunctions: els triangles creixen sense límit (' + S.T.length + ' → ' + T.length + ')');
        if (!changed) break;
      }
      return { V, T, stats: { split } };
    }
    return { tjunctions };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/repair/weld.js
// geokernel · solids/repair/weld — SOLDADURA de vèrtexs a menys de `tol` (graella amb els 27 veïns: dos punts a
// tocar no se separen per caure a cel·les diferents). malla { positions, indices, faceOf? } → sopa { V: [[x,y,z]], T: [[a,b,c]] }.
(function (def) {
  def('solids/repair/weld', [], function () {
    function weld(mesh, tol) {
      const P = mesh.positions, I = mesh.indices, V = [], grid = new Map(), map = new Int32Array(P.length / 3);
      // claus NUMÈRIQUES (hash de 32 bits de la cel·la) en lloc de text: 27 consultes per vèrtex; cada vèrtex guarda la seva
      // cel·la i només es compara amb els de la cel·la buscada → el mateix resultat que amb claus de text, més ràpid
      const cell = (x) => Math.floor(x / tol), key = (i, j, k) => (Math.imul(i, 73856093) ^ Math.imul(j, 19349663) ^ Math.imul(k, 83492791)) | 0, t2 = tol * tol, vc = [];
      for (let n = 0; n < P.length / 3; n++) {
        const x = P[3 * n], y = P[3 * n + 1], z = P[3 * n + 2];
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) throw new Error('geokernel.weld: coordenada no finita al vèrtex ' + n);
        const ci = cell(x), cj = cell(y), ck = cell(z);
        let found = -1;
        for (let a = -1; a <= 1 && found < 0; a++) for (let b = -1; b <= 1 && found < 0; b++) for (let c = -1; c <= 1 && found < 0; c++) {
          const I = ci + a, J = cj + b, K = ck + c, l = grid.get(key(I, J, K)); if (!l) continue;
          for (const v of l) { const q = vc[v]; if (q[0] !== I || q[1] !== J || q[2] !== K) continue; const p = V[v], dx = p[0] - x, dy = p[1] - y, dz = p[2] - z; if (dx * dx + dy * dy + dz * dz <= t2) { found = v; break; } }
        }
        if (found < 0) { found = V.length; V.push([x, y, z]); vc.push([ci, cj, ck]); const k = key(ci, cj, ck); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(found); }
        map[n] = found;
      }
      const T = [];
      // la CARA D'ORIGEN de cada triangle (mesh.faceOf), si n'hi ha, viatja amb el triangle (propietat .f)
      const FO = mesh.faceOf;
      for (let t = 0; t < I.length; t += 3) { const tri = [map[I[t]], map[I[t + 1]], map[I[t + 2]]]; if (FO) tri.f = FO[t / 3]; T.push(tri); }
      return { V, T };
    }
    return { weld };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/section/section.js
// geokernel · solids/section — SECCIÓ EXACTA d'un sòlid BREP per un pla P de la taula, al LÍMIT P ± ε:
// side = +1 → el pla desplaçat cap a +n (un vèrtex sobre P compta DARRERE), side = −1 → al revés.
// Les cares sobre P no hi aporten res (al límit, la secció la donen les cares veïnes). Resultat: arestes 2D
// { a, b, X, s } amb l'interior del sòlid a l'ESQUERRA vist des de +n de P (sentit nP × n_cara → s = signe de la cara).
// Una cara que dona un nombre senar de talls vol dir un sòlid inconsistent → LLANÇA.
(function (def) {
  def('solids/section', ['solids/point'], function (PT) {
    function section(S, P, side, F) {
      const T = S.T, sv = new Int8Array(S.verts.length), pv = new Int8Array(S.verts.length);
      S.verts.forEach((v, i) => { const s = PT.side(T, P, v); sv[i] = s; pv[i] = s !== 0 ? s : -side; });
      const out = [];
      S.faces.forEach((g, gi) => {
        if (g.plane === P) return;
        const cuts = [];
        g.loops.forEach((L, li) => {
          const E = g.epl[li];
          for (let i = 0; i < L.length; i++) {
            const u = L[i], w = L[(i + 1) % L.length];
            if (pv[u] === pv[w]) continue;
            // un vèrtex SOBRE P → el mateix vèrtex (totes les cares que hi arriben comparteixen exactament aquest punt: és el
            // que manté la secció equilibrada); si no, el punt (P, cara, cara veïna), el mateix per a les dues cares de
            // l'aresta. (Provat 2026-11-09: fer servir sempre (P, cara, veïna) desequilibra les seccions a prop dels
            // vèrtexs inexactes, element-prim de WEB-IFC.)
            let c;
            if (sv[u] === 0) c = S.verts[u];
            else if (sv[w] === 0) c = S.verts[w];
            else {
              c = PT.make(T, P, g.plane, E[i]);
              if (!c) throw new Error('geokernel.section: l\'aresta ' + u + '→' + w + ' de la cara ' + gi + ' creua P però és paral·lela al pla');
            }
            cuts.push(c);
          }
        });
        if (!cuts.length) return;
        if (cuts.length % 2) throw new Error('geokernel.section: la cara ' + gi + ' talla el pla ' + P + ' un nombre senar de vegades (' + cuts.length + ')');
        cuts.sort(F.lex);
        // sentit de la secció: nP × n_g = g.sign · (nP × nG)
        if (F.lexIncreasing(g.plane) !== (g.sign > 0)) cuts.reverse();
        for (let i = 0; i < cuts.length; i += 2) {
          const a = cuts[i], b = cuts[i + 1];
          if (PT.equal(a, b)) continue;
          out.push({ a, b, X: g.plane, s: g.sign });
        }
      });
      return out;
    }
    return { section };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── 3d/solids/validate/mesh-closed.js
// geokernel · solids/validate/mesh — ÉS TANCADA AQUESTA MALLA? Criteris IDÈNTICS als de WEB-IFC (cwifc/Code/cmp-core,
// 2026-11-09): soldadura per clau round(x / weld) (weld = 1e-4 en metres = 0,1 mm); ARESTA NUA = aresta no orientada
// usada per exactament 1 triangle; NO-MANIFOLD = per més de 2; DEGENERAT = triangle amb 2 vèrtexs soldats iguals (les
// seves arestes no compten); DUPLICAT = mateixos 3 vèrtexs soldats (igual o oposada orientació); JUNTA EN T = aresta nua
// amb un altre vèrtex nu a dins (dist < tjunction, t dins (1e-6, 1−1e-6)); VOLUM = Σ v0·(v1×v2)/6; ÀREA = Σ |×|/2.
// ok = 0 nues i 0 no-manifold (i volum dins de la tolerància si es dona `expected`).
// A més (no és de WEB-IFC): ARESTES MAL ORIENTADES = aresta interior on els dos triangles la recorren en el mateix sentit.
(function (def) {
  def('solids/validate/mesh', [], function () {
    function check(mesh, opts) {
      opts = opts || {};
      const weld = opts.weld || 1e-4, tj = opts.tjunction || 2e-4;
      const P = mesh.positions, I = mesh.indices;
      const keyOf = new Map(), wid = new Int32Array(P.length / 3), wpos = [];
      for (let i = 0; i < P.length / 3; i++) {
        const k = Math.round(P[3 * i] / weld) + ',' + Math.round(P[3 * i + 1] / weld) + ',' + Math.round(P[3 * i + 2] / weld);
        let id = keyOf.get(k);
        if (id == null) { id = wpos.length; keyOf.set(k, id); wpos.push([P[3 * i], P[3 * i + 1], P[3 * i + 2]]); }
        wid[i] = id;
      }
      const edges = new Map(), tris = new Map();
      let degenerate = 0, duplicates = 0, volume = 0, area = 0;
      for (let t = 0; t < I.length; t += 3) {
        const a = wid[I[t]], b = wid[I[t + 1]], c = wid[I[t + 2]];
        const p = wpos[a], q = wpos[b], r = wpos[c];
        const ux = q[0] - p[0], uy = q[1] - p[1], uz = q[2] - p[2], vx = r[0] - p[0], vy = r[1] - p[1], vz = r[2] - p[2];
        const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
        area += Math.hypot(cx, cy, cz) / 2;
        // volum amb les posicions originals (no soldades), com WEB-IFC
        const A = 3 * I[t], B = 3 * I[t + 1], C = 3 * I[t + 2];
        volume += (P[A] * (P[B + 1] * P[C + 2] - P[B + 2] * P[C + 1]) - P[A + 1] * (P[B] * P[C + 2] - P[B + 2] * P[C]) + P[A + 2] * (P[B] * P[C + 1] - P[B + 1] * P[C])) / 6;
        if (a === b || b === c || c === a) { degenerate++; continue; }
        const tk = [a, b, c].sort((x, y) => x - y).join(',');
        if (tris.has(tk)) duplicates++; else tris.set(tk, 1);
        for (const [u, w] of [[a, b], [b, c], [c, a]]) {
          const k = u < w ? u + ',' + w : w + ',' + u;
          let e = edges.get(k);
          if (!e) { e = { n: 0, fwd: 0, u: Math.min(u, w), w: Math.max(u, w) }; edges.set(k, e); }
          e.n++; if (u < w) e.fwd++;
        }
      }
      let naked = 0, nonManifold = 0, misoriented = 0;
      const nakedList = [], nakedVerts = new Set();
      for (const e of edges.values()) {
        if (e.n === 1) { naked++; nakedList.push(e); nakedVerts.add(e.u); nakedVerts.add(e.w); }
        else if (e.n > 2) nonManifold++;
        else if (e.fwd !== 1) misoriented++;
      }
      let tjunctions = 0;
      if (naked && naked < 20000) {
        for (const e of nakedList) {
          const a = wpos[e.u], b = wpos[e.w], d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
          if (!(L2 > 0)) continue;
          for (const v of nakedVerts) {
            if (v === e.u || v === e.w) continue;
            const p = wpos[v], t = ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1] + (p[2] - a[2]) * d[2]) / L2;
            if (t <= 1e-6 || t >= 1 - 1e-6) continue;
            const x = a[0] + t * d[0] - p[0], y = a[1] + t * d[1] - p[1], z = a[2] + t * d[2] - p[2];
            if (Math.hypot(x, y, z) < tj) { tjunctions++; break; }
          }
        }
      }
      const res = { triangles: I.length / 3, vertices: wpos.length, naked, nonManifold, misoriented, degenerate, duplicates, tjunctions, volume, area };
      res.closed = naked === 0 && nonManifold === 0;
      if (opts.expected != null) res.volumeOk = Math.abs(volume - opts.expected) <= 1e-4 * Math.max(1, Math.abs(opts.expected));
      res.ok = res.closed && misoriented === 0 && (res.volumeOk !== false);
      return res;
    }
    return { check };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── formats/mctx/mctx.js
// geokernel · formats/mctx — LECTOR del context.bin de WEB-IFC (/cmp-model-export), little-endian:
// [0..3] «MCTX» · [4] version u32 · [8] nPieces u32 · [12] nVerts u32 · [16] nIndices u32 · [20] reservat ·
// des de 24: nPieces registres de 168 B { expressID u32, geometryExpressID u32, vertexOffset u32, vertexCount u32,
// indexOffset u32, indexCount u32, color 4×f32, flatTransformation 16×f64 column-major (local → model coordinat, m) } ·
// positions nVerts×3 f32 (LOCALS, unitats del model) · indices nIndices u32 (relatius a la peça).
// Pur. parse(bytes | base64) → { version, pieces: [{ expressID, geometryExpressID, color, matrix, positions, indices }] }
// · toModel(positions, matrix) → Float64Array en el marc model (m).
(function (def) {
  def('formats/mctx', [], function () {
    function bytesOf(src) {
      if (typeof src !== 'string') return src instanceof Uint8Array ? src : new Uint8Array(src);
      const bin = typeof atob === 'function' ? atob(src.trim()) : Buffer.from(src.trim(), 'base64').toString('binary');
      const u = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      return u;
    }
    function parse(src) {
      const u = bytesOf(src), dv = new DataView(u.buffer, u.byteOffset, u.byteLength);
      if (String.fromCharCode(u[0], u[1], u[2], u[3]) !== 'MCTX') throw new Error('geokernel.mctx: no comença per MCTX');
      const version = dv.getUint32(4, true), nPieces = dv.getUint32(8, true), nVerts = dv.getUint32(12, true), nIdx = dv.getUint32(16, true);
      if (version !== 1) throw new Error('geokernel.mctx: versió ' + version + ' desconeguda');
      const tbl = 24, posAt = tbl + 168 * nPieces, idxAt = posAt + 12 * nVerts;
      if (idxAt + 4 * nIdx > u.byteLength) throw new Error('geokernel.mctx: fitxer truncat (' + u.byteLength + ' B, calen ' + (idxAt + 4 * nIdx) + ')');
      const pieces = [];
      for (let k = 0; k < nPieces; k++) {
        const o = tbl + 168 * k, g = (i) => dv.getUint32(o + i, true);
        const vo = g(8), vc = g(12), io = g(16), ic = g(20);
        const positions = new Float32Array(vc * 3), indices = new Uint32Array(ic), matrix = new Array(16);
        for (let i = 0; i < vc * 3; i++) positions[i] = dv.getFloat32(posAt + 4 * (3 * vo + i), true);
        for (let i = 0; i < ic; i++) indices[i] = dv.getUint32(idxAt + 4 * (io + i), true);
        for (let i = 0; i < 16; i++) matrix[i] = dv.getFloat64(o + 40 + 8 * i, true);
        pieces.push({ expressID: g(0), geometryExpressID: g(4), color: [0, 1, 2, 3].map((i) => dv.getFloat32(o + 24 + 4 * i, true)), matrix, positions, indices });
      }
      return { version, pieces, nVerts, nIndices: nIdx };
    }
    // x' = M · [x 1] (M column-major)
    function toModel(P, M) {
      const out = new Float64Array(P.length);
      for (let i = 0; i < P.length; i += 3) {
        const x = P[i], y = P[i + 1], z = P[i + 2];
        out[i] = M[0] * x + M[4] * y + M[8] * z + M[12];
        out[i + 1] = M[1] * x + M[5] * y + M[9] * z + M[13];
        out[i + 2] = M[2] * x + M[6] * y + M[10] * z + M[14];
      }
      return out;
    }
    return { parse, toModel };
  });
})((function () { var g = typeof globalThis !== 'undefined' ? globalThis : self, k = (typeof host !== 'undefined' && host) || g, m = g.__geokernel || (g.__geokernel = new WeakMap()); if (!m.has(k)) m.set(k, {}); var R = m.get(k); return function (n, d, f) { R[n] = { deps: d, f: f }; }; })());

// ── index.js
// geokernel — ENTRADA. Cada peça (una funció per arxiu, a 2d/ i 3d/) es registra amb def(nom, dependències, fàbrica)
// al registre d'AQUESTA consola; aquí es resolen per dependències i s'exposa l'API.
// Funciona igual a la consola (cada arxiu s'avalua a part, amb `host`), al worker i a Node (tots els arxius
// concatenats en ordre de ruta: 2d/…, 3d/…, index.js — l'entrada sempre és l'última).
(function () {
  const g = typeof globalThis !== 'undefined' ? globalThis : self;
  const key = (typeof host !== 'undefined' && host) || g;
  const R = (g.__geokernel && g.__geokernel.get(key)) || {};
  const cache = {}, loading = {};
  function use(name) {
    if (cache[name]) return cache[name];
    const p = R[name];
    if (!p) throw new Error('geokernel: falta la peça «' + name + '»');
    if (loading[name]) throw new Error('geokernel: dependència circular a «' + name + '»');
    loading[name] = true;
    const deps = p.deps.map(use);
    cache[name] = p.f.apply(null, deps);
    delete loading[name];
    return cache[name];
  }

  const api = {
    version: '0.10.0',   // s'incrementa a cada canvi del motor que es lliura a WEB-IFC (dist/geokernel.js)
    use,                                   // accés a qualsevol peça pel seu nom: use('solids/plane')
    pieces: () => Object.keys(R).sort(),
    formats: { mctx: use('formats/mctx') },
    d2: {
      triangulate: Object.assign({}, use('2d/triangulate'), use('2d/triangulate/region')),
    },
    solids: {
      bigint: use('solids/exact/bigint'),
      sign: use('solids/exact/sign'),
      plane: use('solids/plane'),
      snap: use('solids/plane/snap'),
      point: use('solids/point'),
      fromMesh: use('solids/brep/fromMesh').fromMesh,
      toMesh: use('solids/brep/toMesh').toMesh,
      check: use('solids/brep/check').check,
      validate: use('solids/validate/mesh').check,
      repair: use('solids/repair').repair,
      make: Object.assign({}, use('solids/make/box'), use('solids/make/transform'), use('solids/make/oracle')),
      frame: use('solids/plane2d/frame').frame,
      section: use('solids/section').section,
      boolean: use('solids/boolean').boolean,
      booleanMesh: use('solids/boolean/mesh').booleanMesh,
      chainMesh: use('solids/boolean/chainMesh').chainMesh,
      diag: Object.assign({}, use('solids/diag/chain'), use('solids/diag/shapes3d'), use('solids/diag/shapes2d'), use('solids/diag/draw'), use('solids/diag/apex'), use('solids/diag/vertex'), use('solids/diag/ifcScene')),
    },
  };
  // operacions de primer nivell (les que poden anar al worker)
  api.booleanMesh = api.solids.booleanMesh;
  api.chainMesh = api.solids.chainMesh;
  api.webifcBool = use('solids/boolean/webifc').webifcBool;   // el ganxo de web-ifc (BoolProcess)
  api.webifcBoolStats = use('solids/boolean/webifc').webifcBoolStats;

  if (typeof module !== 'undefined') module.exports = api;
  if (typeof host !== 'undefined' && host && typeof host.provide === 'function') {
    host.provide('geokernelCore', api);
    host.provide('geokernel', Object.assign({}, api), { heavy: ['booleanMesh', 'chainMesh'] });
  }
})();

  })(m, m.exports, undefined);
  root.geokernel = m.exports;
  if (typeof module === "object" && module && module.exports) module.exports = m.exports;
})(typeof globalThis !== "undefined" ? globalThis : self);
