/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Section and floor plan of the loaded model with web-ifc's SectionMesh: the part in front of the plane is hidden
// with a three.js clipping plane (only the model's materials), and the cut is drawn on the plane: the cut area of
// every element (cap, in the element's colour) and the cut lines (black).
//   Section: vertical plane through the centre of the model, across its longer horizontal side; "Rotate 90°" turns it.
//   Plan:    horizontal plane at mid height, looking down on the lower half.

import * as THREE from "three";
import { IfcAPI } from "../../dist/web-ifc-api";
import { IfcThree, SectionElement } from "./web-ifc-three";

type Mode = "off" | "section" | "plan";

export class SectionTool {
  private mode: Mode = "off";
  private axis = 0;                               // section normal: 0 → along the longer horizontal side, 1 → turned 90°
  private group: THREE.Group | null = null;
  private plane = new THREE.Plane();
  public onStatus: (text: string) => void = () => {};

  constructor(private ifcAPI: IfcAPI, private ifcThree: IfcThree, private scene: THREE.Scene, private renderer: THREE.WebGLRenderer,
              private camera: THREE.PerspectiveCamera, private controls: any) {
    this.renderer.localClippingEnabled = true;
  }

  Section() { this.mode = "section"; this.Update(true); }
  Rotate() { this.axis = 1 - this.axis; if (this.mode !== "section") this.mode = "section"; this.Update(true); }
  Plan() { this.mode = "plan"; this.Update(true); }
  Off() { this.mode = "off"; this.Update(false); }
  /** The scene was cleared or a new model loaded. */
  Reset() { this.group = null; this.mode = "off"; this.onStatus(""); }

  private bounds() {
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (const e of this.ifcThree.sectionElements)
      for (let a = 0; a < 3; a++) { if (e.min[a] < min[a]) min[a] = e.min[a]; if (e.max[a] > max[a]) max[a] = e.max[a]; }
    return { min, max };
  }

  private modelMaterials(): THREE.Material[] {
    const mats: THREE.Material[] = [];
    this.scene.traverse((o: any) => {
      if (!o.isMesh || (this.group && this.isInGroup(o))) return;
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) mats.push(m);
    });
    return mats;
  }

  private isInGroup(o: THREE.Object3D) { for (let p: THREE.Object3D | null = o; p; p = p.parent) if (p === this.group) return true; return false; }

  private Update(moveCamera: boolean) {
    if (this.group) { this.scene.remove(this.group); this.disposeGroup(this.group); this.group = null; }
    const mats = this.modelMaterials();
    if (this.mode === "off" || this.ifcThree.sectionElements.length === 0) {
      for (const m of mats) { m.clippingPlanes = null; m.needsUpdate = true; }
      this.onStatus(this.ifcThree.sectionElements.length === 0 && this.mode !== "off" ? "No model loaded" : "");
      if (this.ifcThree.sectionElements.length === 0) this.mode = "off";
      return;
    }
    const { min, max } = this.bounds();
    const c = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
    let n: number[];                              // normal pointing to the KEPT side
    if (this.mode === "plan") n = [0, -1, 0];      // keep below
    else {
      const longX = max[0] - min[0] >= max[2] - min[2];
      const alongX = (this.axis === 0) === longX;  // cut across the longer side: normal along it
      n = alongX ? [-1, 0, 0] : [0, 0, -1];        // keep the half with smaller x / z
    }
    const point = c;
    // three.js keeps where dot(normal, p) + constant >= 0
    this.plane.set(new THREE.Vector3(n[0], n[1], n[2]), -(n[0] * point[0] + n[1] * point[1] + n[2] * point[2]));
    for (const m of mats) { m.clippingPlanes = [this.plane]; m.needsUpdate = true; }

    const t0 = performance.now();
    const cut = this.cut(point, n);
    const ms = performance.now() - t0;
    this.group = cut.group;
    this.scene.add(this.group);
    this.onStatus(`${this.mode === "plan" ? "Plan" : "Section"}: ${cut.elements} elements cut · ${cut.loops} areas` +
      (cut.byGap ? ` (${cut.byGap} closed across a small gap)` : "") +
      (cut.open ? ` · ${cut.open} open outlines (lines only)` : "") + ` · ${ms.toFixed(0)} ms`);
    if (moveCamera) this.placeCamera(min, max, c, n);
  }

  private cut(point: number[], n: number[]) {
    const plane = { point, normal: n };
    const capPos: number[] = [], capCol: number[] = [], capIdx: number[] = [], linePos: number[] = [];
    let elements = 0, loops = 0, byGap = 0, open = 0;
    const size = (() => { const b = this.bounds(); return Math.hypot(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]); })();
    const lift = size * 1e-5;                      // draw the cut a hair in front of the plane (towards the removed side)
    const off = [-n[0] * lift, -n[1] * lift, -n[2] * lift];
    for (const e of this.ifcThree.sectionElements) {
      const dmin = this.side(e, point, n, "min"), dmax = this.side(e, point, n, "max");
      if (dmin >= 0 || dmax <= 0) continue;        // the plane does not cross its box
      const r = this.ifcAPI.SectionMesh(e.positions, e.indices, plane, { weld: 1e-5, closeGap: 5e-3 });
      if (!r.lines.length) continue;
      elements++; loops += r.closedLoops; byGap += r.closedByGap; open += r.openChains;
      const base = capPos.length / 3;
      for (let k = 0; k < r.capPositions.length; k += 3) {
        capPos.push(r.capPositions[k] + off[0], r.capPositions[k + 1] + off[1], r.capPositions[k + 2] + off[2]);
        capCol.push(e.color.x * 0.8, e.color.y * 0.8, e.color.z * 0.8);
      }
      for (let k = 0; k < r.capIndices.length; k++) capIdx.push(r.capIndices[k] + base);
      for (let k = 0; k < r.lines.length; k += 3) linePos.push(r.lines[k] + 2 * off[0], r.lines[k + 1] + 2 * off[1], r.lines[k + 2] + 2 * off[2]);
    }
    const group = new THREE.Group();
    group.name = "web-ifc section";
    if (capIdx.length) {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(capPos, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(capCol, 3));
      g.setIndex(capIdx);
      group.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })));
    }
    if (linePos.length) {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
      group.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x000000 })));
    }
    return { group, elements, loops, byGap, open };
  }

  // Signed distance to the plane of the box corner that is lowest ("min") or highest ("max") along n.
  private side(e: SectionElement, p: number[], n: number[], which: "min" | "max") {
    let d = 0;
    for (let a = 0; a < 3; a++) {
      const lo = (n[a] >= 0) === (which === "min");
      d += n[a] * ((lo ? e.min[a] : e.max[a]) - p[a]);
    }
    return d;
  }

  private placeCamera(min: number[], max: number[], c: number[], n: number[]) {
    const size = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
    const dist = size * 1.4;
    const target = new THREE.Vector3(c[0], c[1], c[2]);
    // look at the cut from the removed side
    const eye = this.mode === "plan" ? new THREE.Vector3(c[0], c[1] + dist, c[2] + dist * 0.001)
      : new THREE.Vector3(c[0] - n[0] * dist, c[1] + size * 0.2, c[2] - n[2] * dist);
    this.camera.near = Math.max(size / 1000, 0.01);
    this.camera.far = size * 20 + 100;
    this.camera.updateProjectionMatrix();
    this.camera.position.copy(eye);
    if (this.controls) { this.controls.target.copy(target); this.controls.update(); } else this.camera.lookAt(target);
  }

  private disposeGroup(g: THREE.Group) {
    g.traverse((o: any) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  }
}
