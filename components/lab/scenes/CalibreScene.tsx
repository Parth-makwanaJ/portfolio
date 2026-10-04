"use client";

/**
 * A · Calibre: a precision instrument.
 * Five machined rings (lathe-turned, chamfered rectangular profile) in brushed steel and gunmetal,
 * lit by a studio environment built from Lightformers (no HDR download) and one warm key light.
 * Idle: the rings counter-rotate in their own planes, like wheels in a movement.
 * Scroll, three stops: 0 gimbal (rings tilted on crossing axes) -> 1 dial (all aligned, facing you)
 * -> 2 tunnel (rings stacked in depth; the camera pushes through them).
 * Pointer: slight parallax tilt.
 */

import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { LabCanvas } from "@/components/lab/scenes/LabCanvas";
import { labInput, stops } from "@/components/lab/store";

type Ring = { r: number; w: number; h: number; tone: "steel" | "gun"; spin: number };

const RINGS: Ring[] = [
  { r: 3.1, w: 0.26, h: 0.18, tone: "steel", spin: 0.05 },
  { r: 2.55, w: 0.16, h: 0.24, tone: "gun", spin: -0.08 },
  { r: 2.06, w: 0.2, h: 0.16, tone: "steel", spin: 0.11 },
  { r: 1.6, w: 0.13, h: 0.22, tone: "gun", spin: -0.15 },
  { r: 1.18, w: 0.18, h: 0.14, tone: "steel", spin: 0.2 },
];

// Per-ring tilt in the "gimbal" state (rad).
const GIMBAL: [number, number][] = [
  [0, 0],
  [0.62, 0.18],
  [-0.4, 0.74],
  [0.95, -0.5],
  [-0.66, 0.34],
];

const lerp = THREE.MathUtils.lerp;

function ringGeometry({ r, w, h }: Ring) {
  const c = Math.min(w, h) * 0.18; // chamfer
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
  g.rotateX(Math.PI / 2); // ring faces the camera (+z)
  g.computeVertexNormals();
  return g;
}

function Ticks({ ring }: { ring: Ring }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 60;
  const matrices = useMemo(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const out: THREE.Matrix4[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const major = i % 5 === 0;
      const len = major ? ring.w * 0.8 : ring.w * 0.45;
      const rr = ring.r - ring.w / 2 + len / 2 + 0.01;
      q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), a);
      m.compose(
        new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr, ring.h / 2 + 0.004),
        q,
        new THREE.Vector3(len, major ? 0.022 : 0.011, 0.008),
      );
      out.push(m.clone());
    }
    return out;
  }, [ring]);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrices]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f1ebe0" metalness={1} roughness={0.18} />
    </instancedMesh>
  );
}

function Movement() {
  const group = useRef<THREE.Group>(null);
  const tilts = useRef<(THREE.Group | null)[]>([]);
  const spins = useRef<(THREE.Mesh | null)[]>([]);
  const p = useRef(0);
  const look = useRef({ x: 0, y: 0 });
  const geos = useMemo(() => RINGS.map(ringGeometry), []);
  const steel = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#a39e96",
        metalness: 1,
        roughness: 0.26,
        anisotropy: 0.85,
        anisotropyRotation: Math.PI / 2,
        clearcoat: 0.25,
        clearcoatRoughness: 0.25,
      }),
    [],
  );
  const gun = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#4a4744",
        metalness: 1,
        roughness: 0.34,
        anisotropy: 0.7,
        anisotropyRotation: Math.PI / 2,
      }),
    [],
  );

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 20);
    const target = labInput.reduced ? 0 : labInput.progress;
    p.current = THREE.MathUtils.damp(p.current, target, 4, d);
    const [a, b] = stops(p.current);
    const mobile = labInput.mobile;

    // Camera: push in, then through the rings.
    // On desktop the tunnel sits right of the contact text; the camera pushes into it.
    state.camera.position.z = lerp(lerp(10.5, 8.6, a), mobile ? 5.4 : 5.6, b);
    state.camera.position.x = lerp(0, mobile ? 0 : 0.9, b);

    // Placement of the whole movement per stop.
    const g = group.current;
    if (g) {
      const x0 = mobile ? 0 : 3.05;
      const y0 = mobile ? 1.7 : 0.15;
      g.position.x = lerp(lerp(x0, mobile ? 0 : 3.0, a), mobile ? 0 : 3.1, b);
      g.position.y = lerp(lerp(y0, mobile ? 2.35 : 0, a), mobile ? 2.3 : 0, b);
      const s = mobile ? 0.58 : 0.86;
      g.scale.setScalar(lerp(lerp(s, mobile ? 0.48 : 0.86, a), mobile ? 0.5 : 0.62, b));
      // pointer parallax (desktop only)
      look.current.x = THREE.MathUtils.damp(look.current.x, labInput.pointer.x, 3, d);
      look.current.y = THREE.MathUtils.damp(look.current.y, labInput.pointer.y, 3, d);
      g.rotation.y = lerp(lerp(0.55, 0, a), 0, b) + look.current.x * 0.12;
      g.rotation.x = lerp(lerp(-0.28, 0, a), 0, b) - look.current.y * 0.08;
    }

    RINGS.forEach((ring, i) => {
      const t = tilts.current[i];
      if (t) {
        t.rotation.x = lerp(GIMBAL[i][0], 0, a);
        t.rotation.y = lerp(GIMBAL[i][1], 0, a);
        t.position.z = lerp(0, -i * 1.3, b);
      }
      const m = spins.current[i];
      if (m && !labInput.reduced) m.rotation.z += ring.spin * d * (1 + b * 1.5);
    });
  });

  return (
    <group ref={group}>
      {RINGS.map((ring, i) => (
        <group key={i} ref={(el) => void (tilts.current[i] = el)}>
          <mesh
            ref={(el) => void (spins.current[i] = el)}
            geometry={geos[i]}
            material={ring.tone === "steel" ? steel : gun}
            castShadow
            receiveShadow
          >
            {i === 0 && <Ticks ring={ring} />}
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function CalibreScene({ fps }: { fps: boolean }) {
  return (
    <LabCanvas fps={fps} camera={{ position: [0, 0, 10.5], fov: 35 }} shadows background="#0D0C0B">
      <ambientLight intensity={0.04} />
      <directionalLight
        position={[-4.5, 5.5, 6]}
        intensity={3.2}
        color="#ffcf9a"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#ffe1bd" position={[-5, 3, 5]} scale={[6, 0.6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[5, -1.5, 4]} scale={[4, 0.3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.9} color="#ffffff" position={[0, 6, -3]} scale={[8, 0.25, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.35} color="#c9a36b" position={[0, -6, 2]} scale={[10, 0.6, 1]} target={[0, 0, 0]} />
      </Environment>
      <Movement />
    </LabCanvas>
  );
}
