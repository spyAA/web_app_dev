import * as THREE from 'three';

const WHITE = 0xf7fafc;
const WING = 0xe8eef5;
const BEAK = 0xf59e0b;
const POUCH = 0xea8c2f;
const LEG = 0xd97706;
const FRAME = 0x2563eb;
const FRAME_DARK = 0x1d4ed8;
const TIRE = 0x1f2937;
const METAL = 0xcbd5e1;
const SEAT = 0x111827;

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.55,
    metalness: opts.metalness ?? 0.05,
    ...opts,
  });
}

function addMesh(parent, geometry, material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeWheel(radius = 0.55) {
  const wheel = new THREE.Group();
  // Wheel lies in YZ plane (axle along X)
  addMesh(wheel, new THREE.TorusGeometry(radius, 0.055, 12, 40), mat(TIRE, { roughness: 0.92 }), 0, 0, 0, 0, Math.PI / 2, 0);
  addMesh(wheel, new THREE.TorusGeometry(radius * 0.9, 0.014, 8, 40), mat(METAL, { metalness: 0.75, roughness: 0.3 }), 0, 0, 0, 0, Math.PI / 2, 0);
  addMesh(wheel, new THREE.CylinderGeometry(0.07, 0.07, 0.07, 16), mat(METAL, { metalness: 0.7, roughness: 0.35 }), 0, 0, 0, 0, 0, Math.PI / 2);

  const spokeMat = mat(METAL, { metalness: 0.65, roughness: 0.4 });
  for (let i = 0; i < 10; i++) {
    const spoke = addMesh(wheel, new THREE.CylinderGeometry(0.008, 0.008, radius * 1.78, 6), spokeMat);
    // Rotate around X so spokes stay inside the YZ wheel plane
    spoke.rotation.x = (i / 10) * Math.PI;
  }
  return wheel;
}

function makeBicycle() {
  const bike = new THREE.Group();
  const frameMat = mat(FRAME, { metalness: 0.35, roughness: 0.4 });
  const darkMat = mat(FRAME_DARK, { metalness: 0.4, roughness: 0.35 });

  addMesh(bike, new THREE.CylinderGeometry(0.035, 0.035, 1.15, 10), frameMat, -0.15, 0.72, 0, 0, 0, -0.85);
  addMesh(bike, new THREE.CylinderGeometry(0.032, 0.032, 0.95, 10), frameMat, 0.05, 0.95, 0, 0, 0, 0.35);
  addMesh(bike, new THREE.CylinderGeometry(0.032, 0.032, 0.85, 10), darkMat, -0.55, 0.55, 0, 0, 0, 1.15);
  addMesh(bike, new THREE.CylinderGeometry(0.03, 0.03, 0.75, 10), darkMat, 0.35, 0.55, 0, 0, 0, -1.0);
  addMesh(bike, new THREE.CylinderGeometry(0.028, 0.028, 0.7, 10), frameMat, -0.05, 0.35, 0, 0, 0, Math.PI / 2);

  addMesh(bike, new THREE.CylinderGeometry(0.028, 0.028, 0.7, 10), darkMat, 0.72, 0.55, 0.12, 0.18, 0, 0.15);
  addMesh(bike, new THREE.CylinderGeometry(0.028, 0.028, 0.7, 10), darkMat, 0.72, 0.55, -0.12, -0.18, 0, 0.15);

  const bars = new THREE.Group();
  bars.position.set(0.78, 1.05, 0);
  addMesh(bars, new THREE.CylinderGeometry(0.025, 0.025, 0.7, 10), mat(METAL, { metalness: 0.7 }), 0, 0, 0, Math.PI / 2, 0, 0);
  addMesh(bars, new THREE.CylinderGeometry(0.03, 0.03, 0.18, 10), mat(TIRE, { roughness: 0.85 }), 0, 0, 0.38, Math.PI / 2);
  addMesh(bars, new THREE.CylinderGeometry(0.03, 0.03, 0.18, 10), mat(TIRE, { roughness: 0.85 }), 0, 0, -0.38, Math.PI / 2);
  bike.add(bars);

  addMesh(bike, new THREE.BoxGeometry(0.38, 0.08, 0.18), mat(SEAT, { roughness: 0.8 }), -0.35, 1.05, 0);
  addMesh(bike, new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8), mat(METAL, { metalness: 0.6 }), -0.35, 0.95, 0);

  const crank = new THREE.Group();
  crank.position.set(0.05, 0.35, 0);
  addMesh(crank, new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16), mat(METAL, { metalness: 0.7 }), 0, 0, 0, Math.PI / 2);
  addMesh(crank, new THREE.BoxGeometry(0.28, 0.04, 0.04), mat(METAL, { metalness: 0.65 }), 0.12, 0, 0.08);
  addMesh(crank, new THREE.BoxGeometry(0.28, 0.04, 0.04), mat(METAL, { metalness: 0.65 }), -0.12, 0, -0.08);
  addMesh(crank, new THREE.BoxGeometry(0.12, 0.03, 0.18), mat(TIRE), 0.24, 0, 0.14);
  addMesh(crank, new THREE.BoxGeometry(0.12, 0.03, 0.18), mat(TIRE), -0.24, 0, -0.14);
  bike.add(crank);

  const frontWheel = makeWheel(0.55);
  frontWheel.position.set(0.85, 0.55, 0);
  bike.add(frontWheel);

  const rearWheel = makeWheel(0.55);
  rearWheel.position.set(-0.75, 0.55, 0);
  bike.add(rearWheel);

  bike.userData = { frontWheel, rearWheel, crank, bars };
  return bike;
}

function makePelican() {
  const pelican = new THREE.Group();
  const bodyMat = mat(WHITE, { roughness: 0.62 });
  const wingMat = mat(WING, { roughness: 0.7 });
  const beakMat = mat(BEAK, { roughness: 0.42 });
  const pouchMat = mat(POUCH, { roughness: 0.55 });
  const legMat = mat(LEG, { roughness: 0.5 });
  const eyeMat = mat(0x111827, { roughness: 0.3 });
  const accentMat = mat(0xf8fafc, { roughness: 0.8 });

  // Plump body
  const body = addMesh(pelican, new THREE.SphereGeometry(0.4, 24, 18), bodyMat, -0.05, 0.12, 0);
  body.scale.set(1.45, 1.05, 1.0);

  // Chest
  addMesh(pelican, new THREE.SphereGeometry(0.26, 16, 12), accentMat, 0.28, -0.02, 0).scale.set(1.15, 0.95, 1.0);

  // Long S-curve pelican neck (two segments)
  addMesh(pelican, new THREE.CylinderGeometry(0.1, 0.14, 0.42, 12), bodyMat, 0.38, 0.38, 0, 0, 0, -0.85);
  addMesh(pelican, new THREE.CylinderGeometry(0.09, 0.1, 0.38, 12), bodyMat, 0.62, 0.68, 0, 0, 0, -0.2);

  const head = new THREE.Group();
  head.position.set(0.78, 0.95, 0);
  addMesh(head, new THREE.SphereGeometry(0.18, 18, 14), bodyMat);

  // Long flat upper mandible — classic pelican silhouette
  const upperBeak = addMesh(head, new THREE.BoxGeometry(0.72, 0.07, 0.16), beakMat, 0.42, 0.04, 0);
  upperBeak.scale.set(1, 1, 1);
  addMesh(head, new THREE.BoxGeometry(0.12, 0.05, 0.1), beakMat, 0.76, 0.07, 0); // tip bump

  // Big throat pouch hanging under the beak
  const pouch = addMesh(head, new THREE.SphereGeometry(0.22, 18, 14), pouchMat, 0.38, -0.14, 0);
  pouch.scale.set(1.85, 0.95, 1.05);

  addMesh(head, new THREE.SphereGeometry(0.032, 10, 8), eyeMat, 0.06, 0.06, 0.13);
  addMesh(head, new THREE.SphereGeometry(0.032, 10, 8), eyeMat, 0.06, 0.06, -0.13);
  // Tiny eye highlight
  addMesh(head, new THREE.SphereGeometry(0.01, 6, 6), mat(0xffffff), 0.08, 0.08, 0.145);
  addMesh(head, new THREE.SphereGeometry(0.01, 6, 6), mat(0xffffff), 0.08, 0.08, -0.145);
  pelican.add(head);

  // Folded wings with primary tips
  const wingL = new THREE.Group();
  wingL.position.set(-0.05, 0.18, 0.36);
  addMesh(wingL, new THREE.BoxGeometry(0.75, 0.07, 0.32), wingMat, 0, 0, 0, 0.2, 0.1, 0.15);
  addMesh(wingL, new THREE.BoxGeometry(0.28, 0.05, 0.18), mat(0xdbe4ee), -0.4, -0.02, 0.02, 0.1, 0, 0.2);
  pelican.add(wingL);

  const wingR = new THREE.Group();
  wingR.position.set(-0.05, 0.18, -0.36);
  addMesh(wingR, new THREE.BoxGeometry(0.75, 0.07, 0.32), wingMat, 0, 0, 0, -0.2, -0.1, -0.15);
  addMesh(wingR, new THREE.BoxGeometry(0.28, 0.05, 0.18), mat(0xdbe4ee), -0.4, -0.02, -0.02, -0.1, 0, -0.2);
  pelican.add(wingR);

  // Tail fan
  addMesh(pelican, new THREE.ConeGeometry(0.2, 0.45, 8), wingMat, -0.62, 0.08, 0, 0, 0, Math.PI / 2).scale.set(0.55, 1, 1.25);

  function makeLeg(side) {
    const leg = new THREE.Group();
    leg.position.set(0.08, -0.28, side * 0.13);
    const thigh = addMesh(leg, new THREE.CylinderGeometry(0.045, 0.04, 0.3, 8), legMat, 0, -0.1, 0);
    const shinGroup = new THREE.Group();
    shinGroup.position.set(0, -0.26, 0);
    const shin = addMesh(shinGroup, new THREE.CylinderGeometry(0.035, 0.028, 0.28, 8), legMat, 0, -0.1, 0);
    const foot = addMesh(shinGroup, new THREE.BoxGeometry(0.16, 0.035, 0.1), legMat, 0.05, -0.24, 0);
    // Webbed foot suggestion
    addMesh(shinGroup, new THREE.BoxGeometry(0.1, 0.02, 0.14), legMat, 0.1, -0.24, 0);
    leg.add(shinGroup);
    leg.userData = { thigh, shinGroup, shin, foot };
    pelican.add(leg);
    return leg;
  }

  const legL = makeLeg(1);
  const legR = makeLeg(-1);

  pelican.userData = { head, wingL, wingR, legL, legR, pouch };
  return pelican;
}

export function createPelicanBicycle() {
  const rig = new THREE.Group();
  const bike = makeBicycle();
  const pelican = makePelican();

  pelican.position.set(-0.22, 1.18, 0);
  pelican.scale.set(0.92, 0.92, 0.92);

  rig.add(bike);
  rig.add(pelican);

  rig.userData = {
    bike,
    pelican,
    setPedalPhase(phase) {
      const { frontWheel, rearWheel, crank } = bike.userData;
      frontWheel.rotation.x = -phase;
      rearWheel.rotation.x = -phase;
      crank.rotation.z = -phase;

      const { legL, legR } = pelican.userData;
      const ly = Math.sin(phase);
      const ry = Math.sin(phase + Math.PI);

      legL.rotation.z = -0.3 + ly * 1.05;
      legL.userData.shinGroup.rotation.z = 0.55 - ly * 0.75;
      legR.rotation.z = -0.3 + ry * 1.05;
      legR.userData.shinGroup.rotation.z = 0.55 - ry * 0.75;

      pelican.userData.wingL.rotation.z = 0.08 + Math.sin(phase * 2) * 0.04;
      pelican.userData.wingR.rotation.z = -0.08 - Math.sin(phase * 2) * 0.04;
      pelican.position.y = 1.18 + Math.sin(phase * 2) * 0.02;
      pelican.userData.head.rotation.z = Math.sin(phase) * 0.04;
      pelican.userData.pouch.scale.y = 0.95 + Math.sin(phase * 2) * 0.04;
    },
  };

  return rig;
}
