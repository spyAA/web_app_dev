import './style.css';
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { createPelicanBicycle } from './pelicanBike.js';

const app = document.querySelector('#app');
const vrHint = document.querySelector('#vr-hint');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87c9e8);
scene.fog = new THREE.Fog(0x87c9e8, 18, 55);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(3.2, 2.2, 5.2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.xr.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
app.appendChild(renderer.domElement);

const vrButton = VRButton.createButton(renderer);
vrButton.style.zIndex = '10';
document.body.appendChild(vrButton);

if (navigator.xr) {
  navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
    if (vrHint) {
      vrHint.textContent = supported
        ? 'WebXR VR ready — click “Enter VR”.'
        : 'WebXR is wired up; this browser/device has no immersive-VR session.';
    }
  });
} else if (vrHint) {
  vrHint.textContent = 'WebXR not available here — desktop orbit view still works.';
}

const hemi = new THREE.HemisphereLight(0xdff4ff, 0xc2a878, 0.85);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff2d6, 1.35);
sun.position.set(8, 14, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 40;
sun.shadow.camera.left = -12;
sun.shadow.camera.right = 12;
sun.shadow.camera.top = 12;
sun.shadow.camera.bottom = -12;
scene.add(sun);

const fill = new THREE.DirectionalLight(0xa8d8ff, 0.35);
fill.position.set(-6, 4, -4);
scene.add(fill);

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(28, 64),
  new THREE.MeshStandardMaterial({ color: 0xd8c19a, roughness: 0.95, metalness: 0 }),
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const path = new THREE.Mesh(
  new THREE.RingGeometry(4.2, 5.1, 64),
  new THREE.MeshStandardMaterial({ color: 0xb08968, roughness: 0.9 }),
);
path.rotation.x = -Math.PI / 2;
path.position.y = 0.01;
path.receiveShadow = true;
scene.add(path);

const ocean = new THREE.Mesh(
  new THREE.CircleGeometry(40, 64),
  new THREE.MeshStandardMaterial({
    color: 0x3aa0c4,
    roughness: 0.35,
    metalness: 0.1,
    transparent: true,
    opacity: 0.92,
  }),
);
ocean.rotation.x = -Math.PI / 2;
ocean.position.set(0, -0.05, -18);
scene.add(ocean);

for (let i = 0; i < 8; i++) {
  const cloud = new THREE.Mesh(
    new THREE.SphereGeometry(1.2 + Math.random(), 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.85 }),
  );
  cloud.scale.set(2.2, 0.7, 1.4);
  const angle = (i / 8) * Math.PI * 2;
  cloud.position.set(Math.cos(angle) * 14, 7 + (i % 3), Math.sin(angle) * 14 - 4);
  scene.add(cloud);
}

const rider = createPelicanBicycle();
const track = new THREE.Group();
track.add(rider);
rider.position.set(4.6, 0, 0);
rider.rotation.y = Math.PI / 2;
scene.add(track);

const lookTarget = new THREE.Vector3(0, 1.1, 0);
let camAngle = 0.55;
let camHeight = 2.3;
let camRadius = 8.2;
let dragging = false;
let lastX = 0;
let lastY = 0;

renderer.domElement.addEventListener('pointerdown', (e) => {
  if (renderer.xr.isPresenting) return;
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  renderer.domElement.setPointerCapture(e.pointerId);
});
renderer.domElement.addEventListener('pointerup', () => {
  dragging = false;
});
renderer.domElement.addEventListener('pointermove', (e) => {
  if (!dragging || renderer.xr.isPresenting) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  camAngle -= dx * 0.005;
  camHeight = THREE.MathUtils.clamp(camHeight + dy * 0.01, 0.6, 6);
});
renderer.domElement.addEventListener(
  'wheel',
  (e) => {
    if (renderer.xr.isPresenting) return;
    camRadius = THREE.MathUtils.clamp(camRadius + e.deltaY * 0.01, 5.2, 14);
  },
  { passive: true },
);

const controllerFactory = new XRControllerModelFactory();
for (let i = 0; i < 2; i++) {
  const controller = renderer.xr.getController(i);
  scene.add(controller);
  const grip = renderer.xr.getControllerGrip(i);
  grip.add(controllerFactory.createControllerModel(grip));
  scene.add(grip);
}

const xrCameraRig = new THREE.Group();
xrCameraRig.position.set(0, 0, 3.5);
scene.add(xrCameraRig);

renderer.xr.addEventListener('sessionstart', () => {
  xrCameraRig.add(camera);
});
renderer.xr.addEventListener('sessionend', () => {
  scene.add(camera);
  camera.position.set(3.2, 2.2, 5.2);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
let pedalPhase = 0;

renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  pedalPhase += dt * 4.2;
  rider.userData.setPedalPhase(pedalPhase);
  track.rotation.y += dt * 0.35;

  if (!renderer.xr.isPresenting) {
    camera.position.x = Math.cos(camAngle) * camRadius;
    camera.position.z = Math.sin(camAngle) * camRadius;
    camera.position.y = camHeight;
    camera.lookAt(lookTarget);
  }

  renderer.render(scene, camera);
});
