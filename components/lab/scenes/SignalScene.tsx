"use client";

/**
 * B · Signal: a particle field.
 * 50,653 points on desktop (37^3), 19,683 on phones (27^3), drawn in one call with a custom shader.
 * Every particle carries three positions: a loose cloud, an ordered lattice and a sphere.
 * Scroll morphs cloud -> lattice -> sphere with a per-particle stagger, so the change ripples.
 * The lattice inflates into the sphere (sphere point = lattice direction), so the morph reads as one object.
 * Pointer: particles near the cursor move away and settle back as it leaves (the cursor position is damped).
 * One accent colour; alpha fades with depth. Normal blending, no glow.
 */

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { LabCanvas } from "@/components/lab/scenes/LabCanvas";
import { labInput, stops } from "@/components/lab/store";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;      // 0 cloud, 1 lattice, 2 sphere
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uMouse;       // world space
  uniform float uMouseStrength;
  attribute vec3 aCloud;
  attribute vec3 aLattice;
  attribute vec3 aSphere;
  attribute float aRand;
  varying float vAlpha;

  void main() {
    float t1 = smoothstep(0.0, 1.0, clamp((uMorph - aRand * 0.35) / 0.65, 0.0, 1.0));
    float t2 = smoothstep(0.0, 1.0, clamp((uMorph - 1.0 - aRand * 0.35) / 0.65, 0.0, 1.0));
    vec3 pos = mix(aCloud, aLattice, t1);
    pos = mix(pos, aSphere, t2);

    // Breathing drift, strongest in the loose cloud.
    float loose = 1.0 - t1 * 0.8;
    pos += 0.045 * loose * vec3(
      sin(uTime * 0.55 + aRand * 31.0),
      cos(uTime * 0.47 + aRand * 17.0),
      sin(uTime * 0.39 + aRand * 11.0)
    );

    vec4 world = modelMatrix * vec4(pos, 1.0);

    // Pointer repulsion in screen-aligned world space.
    vec2 d = world.xy - uMouse.xy;
    float dist = length(d);
    float f = uMouseStrength * (1.0 - smoothstep(0.0, 1.5, dist));
    world.xy += normalize(d + 1e-4) * f * 0.55;
    world.z += f * 0.35;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aRand * 0.9) / depth;
    vAlpha = smoothstep(15.0, 4.5, depth) * (0.3 + 0.7 * aRand);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.12, d) * vAlpha;
    gl_FragColor = vec4(uColor, a);
  }
`;

function buildForms(n: number) {
  const count = n * n * n;
  const cloud = new Float32Array(count * 3);
  const lattice = new Float32Array(count * 3);
  const sphere = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  const L = 2.3;
  const R = 2.55;
  let k = 0;
  // Small deterministic PRNG so every load looks the same.
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const v = new THREE.Vector3();
  for (let x = 0; x < n; x++)
    for (let y = 0; y < n; y++)
      for (let z = 0; z < n; z++) {
        const lx = (x / (n - 1) - 0.5) * 2 * L;
        const ly = (y / (n - 1) - 0.5) * 2 * L;
        const lz = (z / (n - 1) - 0.5) * 2 * L;
        lattice.set([lx, ly, lz], k * 3);

        // Jitter by about one lattice step so points on the centre planes do not stack on great circles.
        const j = ((2 * L) / (n - 1)) * 1.2;
        v.set(lx + (rnd() - 0.5) * j, ly + (rnd() - 0.5) * j, lz + (rnd() - 0.5) * j).normalize();
        const rr = R * (0.985 + rnd() * 0.03);
        sphere.set([v.x * rr, v.y * rr, v.z * rr], k * 3);

        // Cloud: lattice pushed out, scattered and swirled around the vertical axis.
        const spread = 0.95 + rnd() * 0.45;
        let cx = lx * spread + (rnd() - 0.5) * 1.4;
        const cy = ly * spread * 0.85 + (rnd() - 0.5) * 1.4;
        let cz = lz * spread + (rnd() - 0.5) * 1.4;
        const ang = Math.hypot(cx, cz) * 0.3;
        const ca = Math.cos(ang);
        const sa = Math.sin(ang);
        [cx, cz] = [cx * ca - cz * sa, cx * sa + cz * ca];
        cloud.set([cx, cy, cz], k * 3);

        rand[k] = rnd();
        k++;
      }
  return { count, cloud, lattice, sphere, rand };
}

function Field() {
  const points = useRef<THREE.Points>(null);
  const { camera, gl } = useThree();
  const mobile = labInput.mobile;
  const forms = useMemo(() => buildForms(mobile ? 27 : 37), [mobile]);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(forms.lattice, 3));
    g.setAttribute("aCloud", new THREE.BufferAttribute(forms.cloud, 3));
    g.setAttribute("aLattice", new THREE.BufferAttribute(forms.lattice, 3));
    g.setAttribute("aSphere", new THREE.BufferAttribute(forms.sphere, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(forms.rand, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);
    return g;
  }, [forms]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uSize: { value: mobile ? 24 : 21 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
          uMouse: { value: new THREE.Vector3(99, 99, 0) },
          uMouseStrength: { value: 0 },
          uColor: { value: new THREE.Color("#D4FF3A") },
        },
      }),
    [gl, mobile],
  );

  const p = useRef(0);
  const mouse = useRef(new THREE.Vector3(99, 99, 0));
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });
  const tmp = useMemo(() => ({ v: new THREE.Vector3(), dir: new THREE.Vector3() }), []);

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 20);
    const o = points.current;
    if (!o) return;
    const u = (o.material as THREE.ShaderMaterial).uniforms;
    const reduced = labInput.reduced;
    if (!reduced) u.uTime.value += d;
    p.current = THREE.MathUtils.damp(p.current, reduced ? 0 : labInput.progress, 4, d);
    const [a, b] = stops(p.current);
    u.uMorph.value = a + b;

    {
      const x0 = mobile ? 0 : 3.1;
      o.position.x = THREE.MathUtils.lerp(THREE.MathUtils.lerp(x0, mobile ? 0 : 3.0, a), mobile ? 0 : 2.4, b);
      o.position.y = THREE.MathUtils.lerp(mobile ? 1.9 : 0.15, mobile ? 1.7 : 0, Math.max(a, b));
      if (!reduced) o.rotation.y += d * 0.06;
      o.rotation.x = THREE.MathUtils.lerp(0.18, 0.42, a) * (1 - b);
      o.scale.setScalar(THREE.MathUtils.lerp(THREE.MathUtils.lerp(0.82, 0.6, a), 0.78, b) * (mobile ? 0.62 : 1));
    }

    // Pointer -> world point on the z = 0 plane; damped so particles settle back smoothly.
    const ptr = labInput.pointer;
    const moved = ptr.x !== lastPointer.current.x || ptr.y !== lastPointer.current.y;
    if (moved) lastPointer.current = { x: ptr.x, y: ptr.y, t: state.clock.elapsedTime };
    const active = !mobile && !reduced && state.clock.elapsedTime - lastPointer.current.t < 1.2;
    tmp.v.set(ptr.x, ptr.y, 0.5).unproject(camera);
    tmp.dir.copy(tmp.v).sub(camera.position).normalize();
    const dist = -camera.position.z / tmp.dir.z;
    tmp.v.copy(camera.position).addScaledVector(tmp.dir, dist);
    mouse.current.lerp(tmp.v, 1 - Math.exp(-6 * d));
    u.uMouse.value.copy(mouse.current);
    u.uMouseStrength.value = THREE.MathUtils.damp(u.uMouseStrength.value, active ? 1 : 0, 3, d);
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}

export default function SignalScene({ fps }: { fps: boolean }) {
  return (
    <LabCanvas fps={fps} camera={{ position: [0, 0, 9], fov: 38 }} background="#0B0C0D">
      <Field />
    </LabCanvas>
  );
}
