import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('c');
const clockEl = document.getElementById('clock');
const toastEl = document.getElementById('toast');

/** Ads glossary — SAMPLE creatives (not live pitch) */
const SCREEN_MAP = {
  WALL_L: 'assets/sponsors/WALL_L_2.png',       // PKG_SPOT sample (ACME)
  WALL_R: 'assets/sponsors/WALL_R_2.png',       // PKG_WALL_TAKEOVER / Balter SAMPLE
  WALL_BACK: 'assets/sponsors/WALL_BACK.png',   // PKG_TITLE_WRAP
};
const HOUSE = {
  SLEEVE: 'assets/sponsors/WALL_L_1.png',       // OWNED_SLEEVE / RBBR — protected
  GFI: 'assets/sponsors/WALL_R_1.png',          // OWNED_GFI_ARC — protected
};

const loader = new THREE.TextureLoader();
function tex(url) {
  const t = loader.load(url);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const screenTex = {
  WALL_L: tex(SCREEN_MAP.WALL_L),
  WALL_R: tex(SCREEN_MAP.WALL_R),
  WALL_BACK: tex(SCREEN_MAP.WALL_BACK),
};
const cyclePool = [
  tex(SCREEN_MAP.WALL_L),
  tex(SCREEN_MAP.WALL_R),
  tex(SCREEN_MAP.WALL_BACK),
  tex(HOUSE.SLEEVE),
  tex(HOUSE.GFI),
  tex('assets/sponsors/slide-rbbr.png'),
  tex('assets/sponsors/slide-gfi.png'),
  tex('assets/sponsors/slide-balter.png'),
  tex('assets/sponsors/slide-wall-takeover.png'),
  tex('assets/sponsors/slide-dual-wall.png'),
  tex('assets/sponsors/slide-night-own.png'),
  tex('assets/sponsors/slide-your-brand.png'),
];

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toastEl.classList.remove('show'), 1800);
}

// Pickleball court 13.41 × 6.10 m — SHOW court beside padel (padel at -Z)
const COURT_L = 13.41;
const COURT_W = 6.1;
const KITCHEN = 2.13;
const HALL_L = 32;
const HALL_W = 22;
const WALL_H = 7.5;
const EAVES = 9.0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb6bec6);
scene.fog = new THREE.Fog(0xb6bec6, 32, 62);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 140);
// Photo vantage ≈ elevated bleacher side (+Z), looking toward COURT 1 + back wall
camera.position.set(6.5, 8.2, 12.5);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1.1, 0);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.49;
controls.minDistance = 3;
controls.maxDistance = 42;

scene.add(new THREE.AmbientLight(0xffffff, 0.58));
scene.add(new THREE.HemisphereLight(0xe8f0ff, 0x4a5a3a, 0.42));
const key = new THREE.DirectionalLight(0xfff5e6, 1.12);
key.position.set(9, 15, 7);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22 });
scene.add(key);
const fill = new THREE.DirectionalLight(0xcfe8ff, 0.32);
fill.position.set(-12, 9, -5);
scene.add(fill);

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05, ...opts });
}

// Hall floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(HALL_L, HALL_W), mat(0x3f8f5f, { roughness: 0.93 }));
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// ——— SHOW COURT (Court 1) centered; padel to -Z ———
const courtGroup = new THREE.Group();
scene.add(courtGroup);

const courtPad = new THREE.Mesh(new THREE.PlaneGeometry(COURT_L + 1.4, COURT_W + 1.4), mat(0x3a8a58));
courtPad.rotation.x = -Math.PI / 2;
courtPad.position.y = 0.005;
courtPad.receiveShadow = true;
courtGroup.add(courtPad);

const infield = new THREE.Mesh(new THREE.PlaneGeometry(COURT_L, COURT_W), mat(0xd27d56, { roughness: 0.88 }));
infield.rotation.x = -Math.PI / 2;
infield.position.y = 0.01;
infield.receiveShadow = true;
courtGroup.add(infield);

function kitchenBand(z) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(COURT_W, KITCHEN), mat(0xc86f4a));
  m.rotation.x = -Math.PI / 2;
  m.rotation.z = Math.PI / 2;
  m.position.set(0, 0.012, z);
  courtGroup.add(m);
}
kitchenBand(KITCHEN / 2);
kitchenBand(-KITCHEN / 2);

const lineMat = mat(0xf5f7fa, { roughness: 0.55 });
function line(w, h, x, z) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), lineMat);
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, 0.015, z);
  courtGroup.add(m);
}
line(COURT_L, 0.05, 0, COURT_W / 2);
line(COURT_L, 0.05, 0, -COURT_W / 2);
line(0.05, COURT_W, COURT_L / 2, 0);
line(0.05, COURT_W, -COURT_L / 2, 0);
line(0.05, COURT_W, 0, 0);
line(COURT_L, 0.04, 0, KITCHEN);
line(COURT_L, 0.04, 0, -KITCHEN);

for (const z of [-COURT_W / 2 - 0.05, COURT_W / 2 + 0.05]) {
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.91, 12), mat(0x222222));
  post.position.set(0, 0.455, z);
  post.castShadow = true;
  courtGroup.add(post);
}
const net = new THREE.Mesh(
  new THREE.PlaneGeometry(COURT_W + 0.1, 0.86),
  new THREE.MeshStandardMaterial({ color: 0x111111, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
);
net.position.set(0, 0.43, 0);
net.rotation.y = Math.PI / 2;
courtGroup.add(net);

function picketRail(len, x, z, rotY) {
  const g = new THREE.Group();
  for (const y of [0.18, 0.55]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.04), mat(0xf2f4f6));
    rail.position.y = y;
    g.add(rail);
  }
  const n = Math.floor(len / 0.12);
  for (let i = 0; i <= n; i++) {
    const picket = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.72, 0.03), mat(0xffffff));
    picket.position.set(-len / 2 + i * (len / n), 0.36, 0);
    g.add(picket);
  }
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  scene.add(g);
}
const fx = COURT_L / 2 + 0.55;
const fz = COURT_W / 2 + 0.55;
picketRail(COURT_L + 1.1, 0, fz, 0);
picketRail(COURT_L + 1.1, 0, -fz, 0);
picketRail(COURT_W + 1.1, fx, 0, Math.PI / 2);
picketRail(COURT_W + 1.1, -fx, 0, Math.PI / 2);

// ——— PADEL (left / -Z of show court) ———
const padel = new THREE.Group();
const PADEL_L = 20;
const PADEL_W = 10;
padel.position.set(0, 0, -(COURT_W / 2 + 1.2 + PADEL_W / 2 + 0.8));
const padelFloor = new THREE.Mesh(new THREE.PlaneGeometry(PADEL_L, PADEL_W), mat(0x2f6b4a));
padelFloor.rotation.x = -Math.PI / 2;
padelFloor.position.y = 0.008;
padel.add(padelFloor);
// glass/mesh cage
const cageMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.4, roughness: 0.55, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
const cageH = 3.2;
[[PADEL_L, 0.08, 0, PADEL_W / 2], [PADEL_L, 0.08, 0, -PADEL_W / 2], [0.08, PADEL_W, PADEL_L / 2, 0], [0.08, PADEL_W, -PADEL_L / 2, 0]].forEach(([w, d, x, z]) => {
  const pane = new THREE.Mesh(new THREE.BoxGeometry(w, cageH, d < 1 ? 0.06 : 0.06), cageMat);
  pane.position.set(x, cageH / 2, z);
  padel.add(pane);
});
scene.add(padel);

// Walls
function wallPanel(w, h, x, y, z, rotY, color) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.18), mat(color, { roughness: 0.9 }));
  m.position.set(x, y, z);
  m.rotation.y = rotY;
  m.receiveShadow = true;
  m.castShadow = true;
  scene.add(m);
}
const brickH = 2.5;
wallPanel(HALL_L, brickH, 0, brickH / 2, HALL_W / 2, 0, 0x5a534c);
wallPanel(HALL_L, brickH, 0, brickH / 2, -HALL_W / 2, 0, 0x5a534c);
wallPanel(HALL_W, brickH, HALL_L / 2, brickH / 2, 0, Math.PI / 2, 0x5a534c);
wallPanel(HALL_W, brickH, -HALL_L / 2, brickH / 2, 0, Math.PI / 2, 0x5a534c);
const metalH = WALL_H - brickH;
wallPanel(HALL_L, metalH, 0, brickH + metalH / 2, HALL_W / 2, 0, 0xc8ccd1);
wallPanel(HALL_L, metalH, 0, brickH + metalH / 2, -HALL_W / 2, 0, 0xe8e4d8);
wallPanel(HALL_W, metalH, HALL_L / 2, brickH + metalH / 2, 0, Math.PI / 2, 0xc8ccd1);
wallPanel(HALL_W, metalH, -HALL_L / 2, brickH + metalH / 2, 0, Math.PI / 2, 0xe8e4d8);

// Roller door (right / +X wall)
const door = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.2, 3.6), mat(0x6a7078, { metalness: 0.45, roughness: 0.5 }));
door.position.set(HALL_L / 2 - 0.2, 2.1, 4.5);
scene.add(door);

for (let i = -5; i <= 5; i++) {
  const beam = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.38, HALL_W - 0.5), mat(0x6a727a, { metalness: 0.55, roughness: 0.45 }));
  beam.position.set(i * 2.9, EAVES - 0.45, 0);
  beam.castShadow = true;
  scene.add(beam);
}
const roof = new THREE.Mesh(new THREE.BoxGeometry(HALL_L + 0.6, 0.12, HALL_W + 0.6), mat(0x9aa3ab, { metalness: 0.4, roughness: 0.55 }));
roof.position.y = EAVES;
scene.add(roof);

// Skylight strips
for (let i = -2; i <= 2; i++) {
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(HALL_L * 0.7, 1.1),
    new THREE.MeshBasicMaterial({ color: 0xdde8f5, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
  );
  sky.rotation.x = Math.PI / 2;
  sky.position.set(0, EAVES - 0.05, i * 2.8);
  scene.add(sky);
}

for (let x = -10; x <= 10; x += 5) {
  for (let z = -6; z <= 6; z += 6) {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.12, 24), mat(0x222222));
    lamp.position.set(x, EAVES - 1.0, z);
    scene.add(lamp);
    const bulb = new THREE.PointLight(0xfff2dd, 0.48, 16, 2);
    bulb.position.set(x, EAVES - 1.2, z);
    scene.add(bulb);
  }
}

// Industrial fan
const fan = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.08, 32), mat(0x1a1a1a, { metalness: 0.5 }));
fan.position.set(-6, EAVES - 1.6, -2);
scene.add(fan);

function makeLabel(text) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 512, 128);
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 72px system-ui,sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 64);
  const texC = new THREE.CanvasTexture(c);
  texC.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.05), new THREE.MeshBasicMaterial({ map: texC, transparent: true }));
}
const label = makeLabel('COURT 1');
label.position.set(-HALL_L / 2 + 0.25, 3.5, 0);
label.rotation.y = Math.PI / 2;
scene.add(label);

// ——— Curt LEDs HARD LOCK: 1× 3×2m each side + 5m back = 3 screens ———
const ledScreens = [];
function makeLed(w, h, x, y, z, rotY, zone, map) {
  const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, h + 0.1, 0.14), mat(0x111111, { metalness: 0.6, roughness: 0.4 }));
  frame.position.set(x, y, z);
  frame.rotation.y = rotY;
  frame.castShadow = true;
  scene.add(frame);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map, toneMapped: false })
  );
  const n = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
  screen.position.set(x, y, z).addScaledVector(n, 0.08);
  screen.rotation.y = rotY;
  scene.add(screen);
  const wash = new THREE.PointLight(0x88ff66, 0.3, 7, 2);
  wash.position.copy(screen.position).addScaledVector(n, 0.45);
  scene.add(wash);
  ledScreens.push({ mesh: screen, zone, slide: 0 });
  return screen;
}

const sideY = 2.7;
// Long sides of show court (along X): one LED each — facing inward to court
makeLed(3.0, 2.0, 0, sideY, -(COURT_W / 2 + 1.35), 0, 'WALL_L', screenTex.WALL_L);       // padel side
makeLed(3.0, 2.0, 0, sideY, (COURT_W / 2 + 1.35), Math.PI, 'WALL_R', screenTex.WALL_R); // bleacher side
// Back 5 m on -X wall behind Court 1
makeLed(5.0, 2.6, -HALL_L / 2 + 0.4, 3.1, 0, Math.PI / 2, 'WALL_BACK', screenTex.WALL_BACK);

// ——— HIGH PACKED BLEACHERS at photo vantage (+Z elevated) ———
const bleacher = new THREE.Group();
const rows = 8;
for (let row = 0; row < rows; row++) {
  const step = new THREE.Mesh(
    new THREE.BoxGeometry(16, 0.28, 0.85),
    mat(row % 2 ? 0x2e333a : 0x3a4048, { roughness: 0.78 })
  );
  step.position.set(0, 0.35 + row * 0.48, HALL_W / 2 - 1.6 - row * 0.72);
  step.castShadow = true;
  step.receiveShadow = true;
  bleacher.add(step);
}
scene.add(bleacher);

const crowdMat = [
  mat(0x1f2430), mat(0x2a3140), mat(0x3a2a28), mat(0x243028), mat(0x402828)
];
for (let i = 0; i < 56; i++) {
  const row = i % rows;
  const col = Math.floor(i / rows);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.16 + (i % 3) * 0.02, 0.5 + (i % 4) * 0.04, 4, 8), crowdMat[i % crowdMat.length]);
  body.position.set(-7 + col * 0.95 + (row % 2) * 0.15, 0.95 + row * 0.48, HALL_W / 2 - 1.6 - row * 0.72);
  body.castShadow = true;
  scene.add(body);
}

// Cameras + Curt broadcast + 2× Phantom (one each end)
function cameraRig(x, y, z, lookAt, color = 0x1a1a1a) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.24, 0.5), mat(color, { metalness: 0.5 }));
  g.add(body);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.22, 16), mat(0x333333));
  lens.rotation.x = Math.PI / 2;
  lens.position.z = 0.3;
  g.add(lens);
  g.position.set(x, y, z);
  g.lookAt(lookAt);
  scene.add(g);
  return g;
}
cameraRig(7, EAVES - 1.6, 5, new THREE.Vector3(0, 1, 0)); // Curt broadcast beam
cameraRig(-4, EAVES - 1.6, -4, new THREE.Vector3(0, 1, 0));
// Phantoms — one each baseline end
cameraRig(COURT_L / 2 + 0.9, 1.55, 0, new THREE.Vector3(0, 1, 0), 0x222266);
cameraRig(-COURT_L / 2 - 0.9, 1.55, 0, new THREE.Vector3(0, 1, 0), 0x222266);

const tripod = new THREE.Group();
const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 1.4, 8), mat(0x222222));
pole.position.y = 0.7;
tripod.add(pole);
const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.42), mat(0x111111));
head.position.set(0, 1.45, 0);
tripod.add(head);
tripod.position.set(COURT_L / 2 + 1.35, 0, COURT_W / 2 + 1.6);
scene.add(tripod);

const presets = {
  orbit: { pos: new THREE.Vector3(6.5, 8.2, 12.5), target: new THREE.Vector3(0, 1.1, 0) },
  broadcast: { pos: new THREE.Vector3(tripod.position.x + 0.2, 1.65, tripod.position.z + 0.2), target: new THREE.Vector3(0, 1.0, 0) },
  bleacher: { pos: new THREE.Vector3(0, 5.8, HALL_W / 2 - 0.4), target: new THREE.Vector3(0, 1.2, 0) },
  wall_l: { pos: new THREE.Vector3(0, 2.9, -(COURT_W / 2 + 1.35) + 4), target: new THREE.Vector3(0, 2.5, -(COURT_W / 2 + 1.35)) },
  wall_r: { pos: new THREE.Vector3(0, 2.9, (COURT_W / 2 + 1.35) - 4), target: new THREE.Vector3(0, 2.5, COURT_W / 2 + 1.35) },
  wall_back: { pos: new THREE.Vector3(-HALL_L / 2 + 7, 3.3, 0), target: new THREE.Vector3(-HALL_L / 2 + 0.4, 3.1, 0) },
  walk: { pos: new THREE.Vector3(HALL_L / 2 - 4, 1.7, 5), target: new THREE.Vector3(0, 1.3, 0) },
};

let camMode = 'orbit';
function setCam(mode) {
  camMode = mode;
  const p = presets[mode];
  if (!p) return;
  camera.position.copy(p.pos);
  controls.target.copy(p.target);
  controls.update();
  document.querySelectorAll('.chip[data-cam]').forEach((el) => {
    el.classList.toggle('on', el.dataset.cam === mode);
  });
  toast(mode.toUpperCase().replace('_', ' '));
}
document.querySelectorAll('.chip[data-cam]').forEach((el) => {
  el.addEventListener('click', () => setCam(el.dataset.cam));
});

let slideTimer = 0;
function tickSlides(dt) {
  slideTimer += dt;
  if (slideTimer < 3.5) return;
  slideTimer = 0;
  ledScreens.forEach((led, i) => {
    led.slide = (led.slide + 1 + i) % cyclePool.length;
    led.mesh.material.map = cyclePool[led.slide];
    led.mesh.material.needsUpdate = true;
  });
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  controls.enabled = camMode === 'orbit' || camMode === 'walk';
  controls.update();
  tickSlides(dt);
  clockEl.textContent = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' AEST';
  renderer.render(scene, camera);
}
animate();
toast('HOP SHOW · 3 LEDs (L/R/Back) · packed bleachers · SAMPLE');
