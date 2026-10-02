import * as THREE from 'three';

const WHITE = 0xf5f7fa;
const WING = 0xe8edf2;
const BEAK = 0xf0a04b;
const POUCH = 0xe8893a;
const LEG = 0xd97706;
const FRAME = 0x2f6fed;
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
    const tire = addMesh(
        wheel,
        new THREE.TorusGeometry(radius, 0.06, 12, 36),
        mat(TIRE, { roughness: 0.9 }),
        0, 0, 0,
        0, 0, 0,
    );
    tire.rotation.y = Math.PI / 2;

    const hub = addMesh(
        wheel,
        new THREE.CylinderGeometry(0.08, 0.08, 0.08, 16),
        mat(METAL, { metalness: 0.7, roughness: 0.35 }),
        0, 0, 0,
        0, 0, Math.PI / 2,
    );

    const spokeMat = mat(METAL, { metalness: 0.65, roughness: 0.4 });
    for (let i = 0; i < 8; i++) {
        const spoke = addMesh(
            wheel,
            new THREE.BoxGeometry(0.02, radius * 1.85, 0.02),
            spokeMat,
        );
        spoke.rotation.z = (i / 8) * Math.PI;
    }

    const rim = addMesh(
        wheel,
        new THREE.TorusGeometry(radius * 0.92, 0.018, 8, 36),
        mat(METAL, { metalness: 0.75, roughness: 0.3 }),
    );
    rim.rotation.y = Math.PI / 2;

    return wheel;
}

function makeBicycle() {
    const bike = new THREE.Group();
    const frameMat = mat(FRAME, { metalness: 0.35, roughness: 0.4 });
    const darkMat = mat(FRAME_DARK, { metalness: 0.4, roughness: 0.35 });

    // Main diamond frame
    addMesh(bike, new THREE.CylinderGeometry(0.035, 0.035, 1.15, 10), frameMat, -0.15, 0.72, 0, 0, 0, -0.85);
    addMesh(bike, new THREE.CylinderGeometry(0.032, 0.032, 0.95, 10), frameMat, 0.05, 0.95, 0, 0, 0, 0.35);
    addMesh(bike, new THREE.CylinderGeometry(0.032, 0.032, 0.85, 10), darkMat, -0.55, 0.55, 0, 0, 0, 1.15);
    addMesh(bike, new THREE.CylinderGeometry(0.03, 0.03, 0.75, 10), darkMat, 0.35, 0.55, 0, 0, 0, -1.0);
    addMesh(bike, new THREE.CylinderGeometry(0.028, 0.028, 0.7, 10), frameMat, -0.05, 0.35, 0, 0, 0, Math.PI / 2);

    // Fork
    addMesh(bike, new THREE.CylinderGeometry(0.028, 0.028, 0.7, 10), darkMat, 0.72, 0.55, 0.12, 0.18, 0, 0.15);
    addMesh(bike, new THREE.CylinderGeometry(0.028, 0.028, 0.7, 10), darkMat, 0.72, 0.55, -0.12, -0.18, 0, 0.15);

    // Handlebars
    const bars = new THREE.Group();
    bars.position.set(0.78, 1.05, 0);
    addMesh(bars, new THREE.CylinderGeometry(0.025, 0.025, 0.7, 10), mat(METAL, { metalness: 0.7 }), 0, 0, 0, Math.PI / 2, 0, 0);
    addMesh(bars, new THREE.CylinderGeometry(0.03, 0.03, 0.18, 10), mat(TIRE, { roughness: 0.85 }), 0, 0, 0.38, Math.PI / 2);
    addMesh(bars, new THREE.CylinderGeometry(0.03, 0.03, 0.18, 10), mat(TIRE, { roughness: 0.85 }), 0, 0, -0.38, Math.PI / 2);
    bike.add(bars);

    // Seat
    addMesh(bike, new THREE.BoxGeometry(0.38, 0.08, 0.18), mat(SEAT, { roughness: 0.8 }), -0.35, 1.05, 0);
    addMesh(bike, new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8), mat(METAL, { metalness: 0.6 }), -0.35, 0.95, 0);

    // Pedal crank
    const crank = new THREE.Group();
    crank.position.set(0.05, 0.35, 0);
    addMesh(crank, new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16), mat(METAL, { metalness: 0.7 }), 0, 0, 0, Math.PI / 2);
    const armL = addMesh(crank, new THREE.BoxGeometry(0.28, 0.04, 0.04), mat(METAL, { metalness: 0.65 }), 0.12, 0, 0.08);
    const armR = addMesh(crank, new THREE.BoxGeometry(0.28, 0.04, 0.04), mat(METAL, { metalness: 0.65 }), -0.12, 0, -0.08);
    const pedalL = addMesh(crank, new THREE.BoxGeometry(0.12, 0.03, 0.18), mat(TIRE), 0.24, 0, 0.14);
    const pedalR = addMesh(crank, new THREE.BoxGeometry(0.12, 0.03, 0.18), mat(TIRE), -0.24, 0, -0.14);
    bike.add(crank);

    const frontWheel = makeWheel(0.55);
    frontWheel.position.set(0.85, 0.55, 0);
    bike.add(frontWheel);

    const rearWheel = makeWheel(0.55);
    rearWheel.position.set(-0.75, 0.55, 0);
    bike.add(rearWheel);

    bike.userData = { frontWheel, rearWheel, crank, pedalL, pedalR, armL, armR, bars };
    return bike;
}

function makePelican() {
    const pelican = new THREE.Group();
    const bodyMat = mat(WHITE, { roughness: 0.65 });
    const wingMat = mat(WING, { roughness: 0.7 });
    const beakMat = mat(BEAK, { roughness: 0.45 });
    const pouchMat = mat(POUCH, { roughness: 0.55 });
    const legMat = mat(LEG, { roughness: 0.5 });
    const eyeMat = mat(0x111827, { roughness: 0.3 });

    // Body
    const body = addMesh(pelican, new THREE.SphereGeometry(0.42, 24, 18), bodyMat, 0, 0.15, 0);
    body.scale.set(1.35, 1.0, 0.95);

    // Chest fluff
    addMesh(pelican, new THREE.SphereGeometry(0.28, 16, 12), bodyMat, 0.22, -0.05, 0).scale.set(1.1, 0.9, 0.95);

    // Neck
    const neck = addMesh(pelican, new THREE.CylinderGeometry(0.12, 0.16, 0.55, 12), bodyMat, 0.42, 0.45, 0, 0, 0, -0.55);
    neck.scale.set(1, 1, 0.9);

    // Head
    const head = new THREE.Group();
    head.position.set(0.72, 0.78, 0);
    addMesh(head, new THREE.SphereGeometry(0.2, 18, 14), bodyMat);

    // Distinctive pelican beak + pouch
    const upperBeak = addMesh(head, new THREE.ConeGeometry(0.09, 0.55, 10), beakMat, 0.32, 0.02, 0, 0, 0, -Math.PI / 2);
    upperBeak.scale.set(1, 1, 0.7);
    const pouch = addMesh(head, new THREE.SphereGeometry(0.18, 16, 12), pouchMat, 0.28, -0.12, 0);
    pouch.scale.set(1.6, 0.75, 0.85);

    addMesh(head, new THREE.SphereGeometry(0.035, 10, 8), eyeMat, 0.08, 0.08, 0.14);
    addMesh(head, new THREE.SphereGeometry(0.035, 10, 8), eyeMat, 0.08, 0.08, -0.14);
    pelican.add(head);

    // Wings
    const wingL = addMesh(pelican, new THREE.BoxGeometry(0.7, 0.08, 0.35), wingMat, -0.05, 0.2, 0.38, 0.25, 0.15, 0.2);
    wingL.scale.set(1, 1, 1);
    const wingR = addMesh(pelican, new THREE.BoxGeometry(0.7, 0.08, 0.35), wingMat, -0.05, 0.2, -0.38, -0.25, -0.15, -0.2);

    // Tail
    addMesh(pelican, new THREE.ConeGeometry(0.18, 0.4, 8), wingMat, -0.55, 0.1, 0, 0, 0, Math.PI / 2).scale.set(0.7, 1, 1.1);

    // Legs (thigh + shin groups for pedaling)
    function makeLeg(side) {
        const leg = new THREE.Group();
        leg.position.set(0.05, -0.25, side * 0.12);
        const thigh = addMesh(leg, new THREE.CylinderGeometry(0.045, 0.04, 0.32, 8), legMat, 0, -0.12, 0);
        const shinGroup = new THREE.Group();
        shinGroup.position.set(0, -0.28, 0);
        const shin = addMesh(shinGroup, new THREE.CylinderGeometry(0.035, 0.03, 0.3, 8), legMat, 0, -0.12, 0);
        const foot = addMesh(shinGroup, new THREE.BoxGeometry(0.14, 0.04, 0.08), legMat, 0.04, -0.26, 0);
        leg.add(shinGroup);
        leg.userData = { thigh, shinGroup, shin, foot };
        pelican.add(leg);
        return leg;
    }

    const legL = makeLeg(1);
    const legR = makeLeg(-1);

    // Wings slight folded resting pose
    wingL.rotation.z = 0.15;
    wingR.rotation.z = -0.15;

    pelican.userData = { head, wingL, wingR, legL, legR, pouch };
    return pelican;
}

export function createPelicanBicycle() {
    const rig = new THREE.Group();
    const bike = makeBicycle();
    const pelican = makePelican();

    // Seat the pelican on the bike
    pelican.position.set(-0.2, 1.15, 0);
    pelican.rotation.y = 0;
    pelican.scale.set(0.95, 0.95, 0.95);

    rig.add(bike);
    rig.add(pelican);

    rig.userData = {
        bike,
        pelican,
        setPedalPhase(phase) {
            const { frontWheel, rearWheel, crank } = bike.userData;
            frontWheel.rotation.z = -phase;
            rearWheel.rotation.z = -phase;
            crank.rotation.z = -phase;

            const radius = 0.24;
            const { legL, legR } = pelican.userData;

            // Left foot follows one pedal, right the opposite
            const lx = Math.cos(phase) * radius;
            const ly = Math.sin(phase) * radius;
            const rx = Math.cos(phase + Math.PI) * radius;
            const ry = Math.sin(phase + Math.PI) * radius;

            // Approximate IK: swing thighs / shins toward pedal positions
            legL.rotation.z = -0.35 + ly * 1.2;
            legL.userData.shinGroup.rotation.z = 0.6 - ly * 0.8;
            legR.rotation.z = -0.35 + ry * 1.2;
            legR.userData.shinGroup.rotation.z = 0.6 - ry * 0.8;

            // Subtle wing / head bob
            pelican.userData.wingL.rotation.z = 0.12 + Math.sin(phase * 2) * 0.05;
            pelican.userData.wingR.rotation.z = -0.12 - Math.sin(phase * 2) * 0.05;
            pelican.position.y = 1.15 + Math.sin(phase * 2) * 0.02;
            pelican.userData.head.rotation.z = Math.sin(phase) * 0.05;
        },
    };

    return rig;
}
