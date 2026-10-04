"use client";

/**
 * D · Instrument: A's rings are the object; B's particles are the light flowing through it;
 * C's glass is the crystal, used at two moments only.
 *
 * Stops (labInput.stop = scrollY / viewport height, one block per viewport):
 *   0 hero      rings in gyroscope state; particles drift in as a cloud, then settle onto the rings
 *   1-4         services: one ring arrangement per service; particles as a thin stream
 *   5 work      glass slices fan out in depth over project images (refraction bends images only)
 *   6 process   particles form the full lattice; rings recede
 *   7 contact   rings flatten into the dial, the crystal closes over it, particles settle into the ticks
 *
 * Budget rules: never all three at full strength; glass exists only at 5 and 7 (half-resolution
 * transmission, switched off elsewhere); particle count is low when the rings are prominent and
 * full only at the lattice. Phones: no refraction (plain transparent glass), fewer particles.
 */

import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { LabCanvas } from "@/components/lab/scenes/LabCanvas";
import { labInput, smooth } from "@/components/lab/store";

const BG = "#0D0C0B";
const LIME = "#D4FF3A";
const N_STOPS = 8;
const lerp = THREE.MathUtils.lerp;

/* ------------------------------------------------------------------ stop timeline */

/** Eased, damped stop position shared by every layer this frame. */
const timeline = { s: 0, intro: 0 };

/** Value of a per-stop table at the current (fractional) stop. */
function at(table: readonly number[], s: number) {
  const i = Math.min(N_STOPS - 1, Math.max(0, Math.floor(s)));
  const j = Math.min(N_STOPS - 1, i + 1);
  return lerp(table[i], table[j], s - i);
}

function useTimeline() {
  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 20);
    const raw = labInput.reduced ? 0 : Math.min(N_STOPS - 1, Math.max(0, labInput.stop));
    const i = Math.floor(raw);
    // Hold at each stop, move between them.
    const target = i + smooth(0.18, 0.82, raw - i);
    timeline.s = THREE.MathUtils.damp(timeline.s, target, 5, d);
    timeline.intro = labInput.reduced ? 1 : smooth(0.4, 2.8, state.clock.elapsedTime);
  });
}

/* ------------------------------------------------------------------ rings */

type Ring = { r: number; w: number; h: number; tone: "steel" | "gun"; spin: number };
const RINGS: Ring[] = [
  { r: 3.1, w: 0.26, h: 0.18, tone: "steel", spin: 0.05 },
  { r: 2.55, w: 0.16, h: 0.24, tone: "gun", spin: -0.08 },
  { r: 2.06, w: 0.2, h: 0.16, tone: "steel", spin: 0.11 },
  { r: 1.6, w: 0.13, h: 0.22, tone: "gun", spin: -0.15 },
  { r: 1.18, w: 0.18, h: 0.14, tone: "steel", spin: 0.2 },
];

const H = Math.PI / 2;
// Per-stop ring tilts [x, y] for each of the five rings.
const TILTS: [number, number][][] = [
  /* 0 hero: gyroscope */ [[0, 0], [0.62, 0.18], [-0.4, 0.74], [0.95, -0.5], [-0.66, 0.34]],
  /* 1 shopify: aligned */ [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
  /* 2 backend: armillary */ [[0, 0], [H, 0], [0, H], [H, 0], [0, H]],
  /* 3 speed: aligned, spread */ [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
  /* 4 seo: fanned blades */ [[0, 0], [0, 0.4], [0, 0.8], [0, 1.2], [0, 1.6]],
  /* 5 work */ [[0, 0], [0.5, 0.2], [-0.3, 0.6], [0.8, -0.4], [-0.5, 0.3]],
  /* 6 process */ [[0, 0], [0.3, 0.1], [-0.2, 0.3], [0.4, -0.2], [-0.3, 0.2]],
  /* 7 contact: dial */ [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
];

type Pose = { x: number[]; y: number[]; z: number[]; s: number[]; rx: number[]; ry: number[]; spread: number[]; camZ: number[] };
const DESKTOP: Pose = {
  x: [3.05, 3.0, 3.0, 3.0, 3.3, 3.6, 4.4, 3.05],
  y: [0.15, 0, 0, 0, 0, 0.25, 0.4, 0],
  z: [0, 0, 0, 0, 0, -4.5, -8, 0],
  s: [0.86, 0.8, 0.78, 0.8, 0.62, 0.62, 0.45, 0.66],
  rx: [-0.28, -0.95, -0.35, 0.15, -0.25, -0.2, -0.2, -0.06],
  ry: [0.55, 0.3, 0.6, 1.15, 0.25, 0.35, 0.3, -0.18],
  spread: [0, 0, 0, 0.55, 0, 0, 0, 0],
  camZ: [10.5, 10.5, 10.5, 10.5, 10.5, 8.6, 10, 10.5],
};
// Phones: object in the top half, text below. The hero ring stays clear of the label.
const PHONE: Pose = {
  x: [0, 0, 0, 0, 0, 0.1, 0, 0],
  y: [2.12, 1.75, 1.75, 1.75, 1.75, 2.0, 2.35, 1.75],
  z: [0, 0, 0, 0, 0, -3, -5, 0],
  s: [0.35, 0.44, 0.42, 0.42, 0.44, 0.38, 0.16, 0.46],
  rx: DESKTOP.rx,
  ry: DESKTOP.ry,
  spread: [0, 0, 0, 0.55, 0, 0, 0, 0],
  camZ: [10.5, 10.5, 10.5, 10.5, 10.5, 9.4, 10, 10],
};

/** Ring spin meshes, shared with the particle layer (particles follow the rings' live transforms). */
const rig: { spins: (THREE.Mesh | null)[] } = { spins: [] };

function ringGeometry({ r, w, h }: Ring) {
  const c = Math.min(w, h) * 0.18;
  const pts = [
    [r - w / 2, -h / 2 + c],
    [r - w / 2 + c, -h / 2],
    [r + w / 2 - c, -h / 2],
    [r + w / 2, -h / 2 + c],
    [r + w / 2, h / 2 - c],
    [r + w / 2 - c, h / 2],
    [r - w / 2 + c, h / 2],
    [r - w / 2, h / 2 - c],
    [r - w / 2, -h / 2 + c],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(pts, 192);
  g.rotateX(Math.PI / 2);
  g.computeVertexNormals();
  return g;
}

function Ticks({ ring }: { ring: Ring }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 60;
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const major = i % 5 === 0;
      const len = major ? ring.w * 0.8 : ring.w * 0.45;
      const rr = ring.r - ring.w / 2 + len / 2 + 0.01;
      q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), a);
      m.compose(new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr, ring.h / 2 + 0.004), q, new THREE.Vector3(len, major ? 0.022 : 0.011, 0.008));
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [ring]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f1ebe0" metalness={1} roughness={0.18} />
    </instancedMesh>
  );
}

function Rings() {
  const group = useRef<THREE.Group>(null);
  const tilts = useRef<(THREE.Group | null)[]>([]);
  const look = useRef({ x: 0, y: 0 });
  const geos = useMemo(() => RINGS.map(ringGeometry), []);
  const steel = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#a39e96", metalness: 1, roughness: 0.26, anisotropy: 0.85, anisotropyRotation: H, clearcoat: 0.25, clearcoatRoughness: 0.25 }),
    [],
  );
  const gun = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#4a4744", metalness: 1, roughness: 0.34, anisotropy: 0.7, anisotropyRotation: H }), []);

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 20);
    const s = timeline.s;
    const P = labInput.mobile ? PHONE : DESKTOP;
    state.camera.position.z = at(P.camZ, s);

    const g = group.current;
    if (g) {
      look.current.x = THREE.MathUtils.damp(look.current.x, labInput.pointer.x, 3, d);
      look.current.y = THREE.MathUtils.damp(look.current.y, labInput.pointer.y, 3, d);
      g.position.set(at(P.x, s), at(P.y, s), at(P.z, s));
      g.scale.setScalar(at(P.s, s));
      g.rotation.x = at(P.rx, s) - look.current.y * 0.08;
      g.rotation.y = at(P.ry, s) + look.current.x * 0.12;
    }
    const i = Math.min(N_STOPS - 1, Math.floor(s));
    const j = Math.min(N_STOPS - 1, i + 1);
    const t = s - i;
    const spread = at(P.spread, s);
    RINGS.forEach((ring, k) => {
      const tg = tilts.current[k];
      if (tg) {
        tg.rotation.x = lerp(TILTS[i][k][0], TILTS[j][k][0], t);
        tg.rotation.y = lerp(TILTS[i][k][1], TILTS[j][k][1], t);
        tg.position.z = -k * spread;
      }
      const m = rig.spins[k];
      if (m && !labInput.reduced) m.rotation.z += ring.spin * d;
    });
  });

  return (
    <group ref={group}>
      {RINGS.map((ring, k) => (
        <group key={k} ref={(el) => void (tilts.current[k] = el)}>
          <mesh
            ref={(el) => void (rig.spins[k] = el)}
            geometry={geos[k]}
            material={ring.tone === "steel" ? steel : gun}
            castShadow
            receiveShadow
          >
            {k === 0 && <Ticks ring={ring} />}
          </mesh>
        </group>
      ))}
      <Crystal />
    </group>
  );
}

/* ------------------------------------------------------------------ particles */

const pVertex = /* glsl */ `
  uniform float uTime;
  uniform float uW[5];          // cloud, ring, stream, lattice, tick
  uniform mat4 uRing[5];        // ring world matrices (live, include spin)
  uniform float uRadius[5];
  uniform float uWidth[5];
  uniform float uHeight[5];
  uniform vec3 uCloudC;
  uniform vec3 uLatticeC;
  uniform float uLatticeS;
  uniform vec3 uStreamC;
  uniform float uTickR0;        // inner edge of the tick band on ring 0 (local)
  uniform float uTickH;
  uniform float uSize;
  uniform float uPR;
  attribute vec3 aCloud;
  attribute vec3 aLattice;
  attribute vec4 aRing;         // ring index, angle, radial jitter, depth jitter
  attribute vec2 aStream;       // phase, lateral jitter
  attribute vec2 aTick;         // tick index (0..59), position along the tick (0..1)
  attribute float aRand;
  varying float vAlpha;

  // Halo just outside the metal: either beyond the inner/outer edge or above the front/back face.
  vec3 ringPos(int i, float a, float jr, float jz) {
    float halfW = uWidth[i] * 0.5;
    float halfH = uHeight[i] * 0.5;
    float onEdge = step(0.0, jr * jz);          // about half on the edges, half on the faces
    float r = uRadius[i] + mix(jr * 1.4, sign(jr) * (halfW + 0.03 + abs(jr) * 0.8), onEdge);
    float z = mix(sign(jz) * (halfH + 0.025 + abs(jz) * 0.9), jz * 1.2, onEdge);
    return (uRing[i] * vec4(cos(a) * r, sin(a) * r, z, 1.0)).xyz;
  }

  void main() {
    vec3 cloud = uCloudC + aCloud + 0.06 * vec3(sin(uTime * 0.5 + aRand * 31.0), cos(uTime * 0.43 + aRand * 17.0), sin(uTime * 0.37 + aRand * 11.0));

    int ri = int(aRing.x);
    vec3 ring = ringPos(ri, aRing.y, aRing.z, aRing.w);

    float u = fract(aStream.x + uTime * 0.035);
    vec3 stream = uStreamC + vec3((u - 0.5) * 7.0, sin(u * 9.0 + uTime * 0.4) * 0.45 + aStream.y * 0.08, cos(u * 7.0 + uTime * 0.3) * 0.7 + aStream.y * 0.08);

    vec3 lattice = uLatticeC + aLattice * uLatticeS;

    float ta = floor(aTick.x) / 60.0 * 6.2831853;
    float major = step(0.5, 1.0 - mod(floor(aTick.x), 5.0));
    float len = mix(0.12, 0.21, major);
    float tr = uTickR0 + aTick.y * len;
    vec3 tick = (uRing[0] * vec4(cos(ta) * tr, sin(ta) * tr, uTickH, 1.0)).xyz;

    vec3 pos = cloud * uW[0] + ring * uW[1] + stream * uW[2] + lattice * uW[3] + tick * uW[4];

    vec4 mv = viewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    float traced = uW[1] + uW[4];             // tracing the metal: steadier, brighter points
    gl_PointSize = uSize * uPR * mix(0.55 + aRand * 0.9, 0.9 + aRand * 0.5, traced) / depth;
    vAlpha = smoothstep(18.0, 5.0, depth) * mix(0.35 + 0.65 * aRand, 0.75 + 0.25 * aRand, traced);
  }
`;

const pFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.12, d) * vAlpha);
  }
`;

// Visible particle count per stop: low while the rings lead, full only at the lattice.
// Work and contact were cut after measuring (desktop dipped to 58 and 57 fps): no particles while the
// glass leads at work, 1,800 tick particles at contact (30 per tick).
const COUNT_DESKTOP = [9000, 4500, 4500, 4500, 4500, 0, 50653, 1800];
const COUNT_PHONE = [3500, 1800, 1800, 1800, 1800, 0, 19683, 3000];
// Form weights per stop: [cloud, ring, stream, lattice, tick]. Stop 0 is cloud->ring over the intro.
const WEIGHTS: number[][] = [
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1],
];

function buildParticles(n: number) {
  const count = n * n * n;
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  // Random order, so any draw range is an even sample of every form.
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const cloud = new Float32Array(count * 3);
  const lattice = new Float32Array(count * 3);
  const ring = new Float32Array(count * 4);
  const stream = new Float32Array(count * 2);
  const tick = new Float32Array(count * 2);
  const rand = new Float32Array(count);
  const L = 2.3;
  for (let idx = 0; idx < count; idx++) {
    const k = order[idx];
    const x = Math.floor(k / (n * n));
    const y = Math.floor(k / n) % n;
    const z = k % n;
    const lx = (x / (n - 1) - 0.5) * 2 * L;
    const ly = (y / (n - 1) - 0.5) * 2 * L;
    const lz = (z / (n - 1) - 0.5) * 2 * L;
    lattice.set([lx, ly, lz], idx * 3);
    const sp = 1.1 + rnd() * 0.6;
    cloud.set([lx * sp + (rnd() - 0.5) * 1.6, ly * sp * 0.8 + (rnd() - 0.5) * 1.6, lz * sp + (rnd() - 0.5) * 1.6], idx * 3);
    ring.set([Math.floor(rnd() * 5), rnd() * Math.PI * 2, (rnd() - 0.5) * 0.18, (rnd() - 0.5) * 0.16], idx * 4);
    stream.set([rnd(), rnd() - 0.5], idx * 2);
    tick.set([Math.floor(rnd() * 60), rnd()], idx * 2);
    rand[idx] = rnd();
  }
  return { count, cloud, lattice, ring, stream, tick, rand };
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const gl = useThree((s) => s.gl);
  const mobile = labInput.mobile;
  const data = useMemo(() => buildParticles(mobile ? 27 : 37), [mobile]);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.lattice, 3));
    g.setAttribute("aCloud", new THREE.BufferAttribute(data.cloud, 3));
    g.setAttribute("aLattice", new THREE.BufferAttribute(data.lattice, 3));
    g.setAttribute("aRing", new THREE.BufferAttribute(data.ring, 4));
    g.setAttribute("aStream", new THREE.BufferAttribute(data.stream, 2));
    g.setAttribute("aTick", new THREE.BufferAttribute(data.tick, 2));
    g.setAttribute("aRand", new THREE.BufferAttribute(data.rand, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 50);
    return g;
  }, [data]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pVertex,
        fragmentShader: pFragment,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        uniforms: {
          uTime: { value: 0 },
          uW: { value: [1, 0, 0, 0, 0] },
          uRing: { value: RINGS.map(() => new THREE.Matrix4()) },
          uRadius: { value: RINGS.map((r) => r.r) },
          uWidth: { value: RINGS.map((r) => r.w) },
          uHeight: { value: RINGS.map((r) => r.h) },
          uCloudC: { value: new THREE.Vector3() },
          uLatticeC: { value: new THREE.Vector3() },
          uLatticeS: { value: 0.55 },
          uStreamC: { value: new THREE.Vector3() },
          uTickR0: { value: RINGS[0].r - RINGS[0].w / 2 + 0.01 },
          uTickH: { value: RINGS[0].h / 2 + 0.03 },
          uSize: { value: mobile ? 22 : 19 },
          uPR: { value: Math.min(gl.getPixelRatio(), 2) },
          uColor: { value: new THREE.Color(LIME) },
        },
      }),
    [gl, mobile],
  );

  useFrame((_, dt) => {
    const o = ref.current;
    if (!o) return;
    const u = (o.material as THREE.ShaderMaterial).uniforms;
    const s = timeline.s;
    if (!labInput.reduced) u.uTime.value += Math.min(dt, 1 / 20);
    const P = labInput.mobile ? PHONE : DESKTOP;

    // Weights: blend the two neighbouring stops; stop 0 also blends cloud -> ring over the intro.
    const i = Math.min(N_STOPS - 1, Math.floor(s));
    const j = Math.min(N_STOPS - 1, i + 1);
    const t = s - i;
    const w = WEIGHTS[i].map((v, k) => lerp(v, WEIGHTS[j][k], t));
    const intro = timeline.intro;
    const heroShare = 1 - Math.min(1, s);
    w[0] += heroShare * (1 - intro);
    w[1] -= heroShare * (1 - intro);
    u.uW.value = w;

    rig.spins.forEach((m, k) => m && (u.uRing.value[k] as THREE.Matrix4).copy(m.matrixWorld));
    const cx = at(P.x, s);
    const cy = at(P.y, s);
    u.uCloudC.value.set(P.x[0], P.y[0], 0);
    u.uLatticeC.value.set(labInput.mobile ? 0 : 2.7, labInput.mobile ? 2.3 : 0, 0);
    u.uLatticeS.value = labInput.mobile ? 0.2 : 0.55;
    u.uStreamC.value.set(cx, cy, 0);

    const counts = labInput.mobile ? COUNT_PHONE : COUNT_DESKTOP;
    geometry.setDrawRange(0, Math.round(Math.min(data.count, at(counts, s))));
  });

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}

/* ------------------------------------------------------------------ glass and images */

/** Smooth 0..1 presence around a stop (full at the stop, gone one stop away). */
const presence = (s: number, stop: number) => smooth(0, 1, 1 - Math.min(1, Math.abs(s - stop)));

const IMAGES = ["sandesh", "crystal-world", "matrubharti"];

function WorkGlass() {
  const group = useRef<THREE.Group>(null);
  const slices = useRef<(THREE.Mesh | null)[]>([]);
  const cards = useRef<(THREE.Mesh | null)[]>([]);
  const mobile = labInput.mobile;
  const gl = useThree((s) => s.gl);
  const [textures, setTextures] = useState<THREE.Texture[] | null>(null);
  const requested = useRef(false);

  useFrame((state) => {
    const s = timeline.s;
    // Load the (same-origin) image textures early, in a quiet moment after the intro, so decoding
    // and upload never land on the frames where the work stop arrives.
    if (!requested.current && (state.clock.elapsedTime > 3.5 || s > 2)) {
      requested.current = true;
      const loader = new THREE.TextureLoader();
      Promise.all(IMAGES.map((n) => loader.loadAsync(`/lab/${n}.webp`))).then((ts) => {
        ts.forEach((t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = 4;
          gl.initTexture(t); // upload now, not on the frame the work stop appears
        });
        setTextures(ts);
      });
    }
    const g = group.current;
    if (!g) return;
    const p = presence(s, 5);
    g.visible = p > 0.01 && textures !== null;
    if (!g.visible) return;
    g.position.set(mobile ? 0 : 2.35, mobile ? 1.95 : 0.1, 0);
    g.scale.setScalar(mobile ? 0.62 : 1.1);
    g.rotation.y = mobile ? 0 : -0.28;
    // Slices fan out in depth as the stop arrives.
    slices.current.forEach((m, k) => {
      if (!m) return;
      const c = k - 2;
      m.position.set(c * 0.46, 0, 0.6 + c * 0.32 * p);
      m.rotation.y = c * 0.1 * p;
      m.scale.setScalar(lerp(0.001, 1, p));
    });
    // Cards slide in from depth behind the glass.
    cards.current.forEach((m, k) => {
      if (!m) return;
      m.position.set(-0.35 + k * 0.35, 0.3 - k * 0.3, lerp(-6, -0.9 - k * 0.5, p));
    });
  });

  // The image cards mount after the first precompile pass: compile them now, not on first sight.
  const { scene, camera } = useThree();
  useLayoutEffect(() => {
    const g = group.current;
    if (!textures || !g) return;
    const was = g.visible;
    g.visible = true;
    gl.compile(scene, camera);
    g.visible = was;
  }, [textures, gl, scene, camera]);

  return (
    <group ref={group} visible={false}>
      {textures &&
        textures.map((t, k) => (
          <mesh key={k} ref={(el) => void (cards.current[k] = el)}>
            <planeGeometry args={[2.3, 2.3 * ((t.image as HTMLImageElement).height / (t.image as HTMLImageElement).width)]} />
            <meshBasicMaterial map={t} toneMapped={false} />
          </mesh>
        ))}
      {Array.from({ length: 5 }, (_, k) => (
        <RoundedBox key={k} ref={(el: THREE.Mesh | null) => void (slices.current[k] = el)} args={[0.44, 1.7, 0.22]} radius={0.02} smoothness={3}>
          {mobile ? (
            <meshPhysicalMaterial color="#ffffff" transparent opacity={0.16} roughness={0.05} metalness={0} />
          ) : (
            <MeshTransmissionMaterial transmissionSampler samples={3} thickness={0.5} roughness={0.03} ior={1.5} chromaticAberration={0.06} anisotropicBlur={0} distortion={0} backside={false} color="#ffffff" />
          )}
        </RoundedBox>
      ))}
    </group>
  );
}

/** The crystal over the dial. Lives inside the ring group, so it shares the dial's exact pose. */
function Crystal() {
  const ref = useRef<THREE.Mesh>(null);
  const mobile = labInput.mobile;
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const p = smooth(6.3, 7, timeline.s);
    m.visible = p > 0.01;
    // Closes over the dial like a shutter: from a line to the full disc.
    m.scale.set(1, 1, Math.max(0.001, p));
  });
  return (
    <mesh ref={ref} visible={false} position={[0, 0, 0.32]} rotation={[H, 0, 0]}>
      <cylinderGeometry args={[3.25, 3.25, 0.16, 96, 1]} />
      {mobile ? (
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.12} roughness={0.04} metalness={0} depthWrite={false} />
      ) : (
        // Contact measured 55-56 fps on desktop with more samples: cut the supporting effect, not the rings.
        <MeshTransmissionMaterial transmissionSampler samples={1} thickness={0.25} roughness={0.02} ior={1.45} chromaticAberration={0} anisotropicBlur={0} distortion={0} backside={false} color="#ffffff" depthWrite={false} />
      )}
    </mesh>
  );
}

/* ------------------------------------------------------------------ scene */

function Timeline() {
  useTimeline();
  return null;
}

/**
 * Compiles every material once right after mount, with the hidden glass made visible for the pass,
 * so the transmission shaders don't compile (and stall ~2 s) the first time the work stop arrives.
 */
function Precompile() {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    const hidden: THREE.Object3D[] = [];
    scene.traverse((o) => {
      if (!o.visible) {
        hidden.push(o);
        o.visible = true;
      }
    });
    gl.compile(scene, camera);
    // One offscreen frame with the glass visible allocates the transmission buffer up front too.
    const size = gl.getDrawingBufferSize(new THREE.Vector2());
    const rt = new THREE.WebGLRenderTarget(size.x, size.y);
    gl.setRenderTarget(rt);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    rt.dispose();
    hidden.forEach((o) => (o.visible = false));
  }, [gl, scene, camera]);
  return null;
}

export default function InstrumentScene({ fps }: { fps: boolean }) {
  return (
    <LabCanvas fps={fps} camera={{ position: [0, 0, 10.5], fov: 35 }} shadows background={BG} transmissionScale={0.5} guard>
      <Timeline />
      <ambientLight intensity={0.04} />
      <directionalLight
        position={[-4.5, 5.5, 6]}
        intensity={3.2}
        color="#ffcf9a"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#ffe1bd" position={[-5, 3, 5]} scale={[6, 0.6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[5, -1.5, 4]} scale={[4, 0.3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.9} color="#ffffff" position={[0, 6, -3]} scale={[8, 0.25, 1]} target={[0, 0, 0]} />
        {/* A soft panel in front: the crystal shows as glass by reflecting it across the dial. */}
        <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[2, 4, 9]} scale={[9, 2.2, 1]} target={[3, 0, 0]} />
      </Environment>
      <Rings />
      <Particles />
      <WorkGlass />
      <Precompile />
    </LabCanvas>
  );
}
