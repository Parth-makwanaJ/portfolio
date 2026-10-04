"use client";

/**
 * C · Monolith: a slab of thick glass in front of the headline.
 * WebGL cannot refract HTML, so the headline is drawn into a texture on a plane behind the glass,
 * word by word at the exact positions the browser laid them out (Range rects). The HTML h1 paints
 * first; once the refracted copy is on screen the HTML h1 fades to opacity 0 (it stays in the DOM
 * for screen readers and search engines). The plane scrolls in sync with the page.
 * Glass: drei MeshTransmissionMaterial on five slices sharing one transmission buffer, with
 * chromatic aberration for edge dispersion.
 * Scroll, three stops: 0 upright over the headline -> 1 the slab turns -> 2 the slices spread in depth.
 */

import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { LabCanvas } from "@/components/lab/scenes/LabCanvas";
import { labInput, stops } from "@/components/lab/store";

const BG = "#0E0E0F";
const FG = "#F1EFEA";
const PLANE_Z = -2.4;
const SLICES = 5;
const lerp = THREE.MathUtils.lerp;

/**
 * Draws the backdrop for the whole page height: a few hairlines and every [data-lab-glass] text
 * (headline, services list, contact heading), word by word at its laid-out position.
 * Only bright content survives refraction, so the text itself is what the glass bends.
 */
function drawHeadline(canvas: HTMLCanvasElement) {
  const h1 = document.querySelector<HTMLElement>("[data-lab-headline]");
  const W = window.innerWidth;
  const H = document.documentElement.scrollHeight;
  const dpr = Math.min(window.devicePixelRatio, 2, 8192 / H);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx || !h1) return false;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  ctx.lineWidth = 1;
  const vh = window.innerHeight;
  ctx.strokeStyle = "rgba(241,239,234,0.06)";
  for (let y = vh * 0.12; y < H; y += vh * 0.32) {
    ctx.beginPath();
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(W, Math.round(y) + 0.5);
    ctx.stroke();
  }
  // A tight band of verticals behind the slab's path, one brighter at the centre.
  for (let k = -3; k <= 3; k++) {
    ctx.strokeStyle = k === 0 ? "rgba(241,239,234,0.32)" : `rgba(241,239,234,${0.1 - Math.abs(k) * 0.02})`;
    const x = Math.round(W / 2 + k * Math.max(18, W * 0.018)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  ctx.fillStyle = FG;
  ctx.textBaseline = "alphabetic";
  const range = document.createRange();
  for (const el of document.querySelectorAll<HTMLElement>("[data-lab-glass]")) {
  const cs = getComputedStyle(el);
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? "";
    const re = /\S+/g;
    for (let m = re.exec(text); m; m = re.exec(text)) {
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].length);
      const r = range.getClientRects()[0];
      if (!r) continue;
      const mt = ctx.measureText(m[0]);
      const asc = mt.fontBoundingBoxAscent;
      const desc = mt.fontBoundingBoxDescent;
      const top = r.top + window.scrollY;
      // Canvas can't set Fraunces' optical size, so fit each word to the width the browser laid out.
      const sx = mt.width > 0 ? r.width / mt.width : 1;
      ctx.save();
      ctx.translate(r.left, top + (r.height - (asc + desc)) / 2 + asc);
      ctx.scale(sx, 1);
      ctx.fillText(m[0], 0, 0);
      ctx.restore();
    }
  }
  }
  return true;
}

function Backdrop({ onReady }: { onReady: () => void }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  const canvas = useMemo(() => document.createElement("canvas"), []);
  const pageH = useRef(1);
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [canvas]);
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    let alive = true;
    const redraw = () =>
      document.fonts.ready.then(() => {
        if (!alive) return;
        if (drawHeadline(canvas)) {
          pageH.current = document.documentElement.scrollHeight;
          texture.needsUpdate = true;
          setDrawn((n) => n + 1);
        }
      });
    redraw();
    window.addEventListener("resize", redraw);
    return () => {
      alive = false;
      window.removeEventListener("resize", redraw);
    };
  }, [canvas, texture]);

  const announced = useRef(false);
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const cam = camera as THREE.PerspectiveCamera;
    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * (cam.position.z - PLANE_Z);
    const visW = visH * (size.width / size.height);
    const upp = visH / size.height;
    const planeH = pageH.current * upp;
    m.scale.set(visW, planeH, 1);
    // Top of the plane = top of the page; it moves up exactly as the page scrolls.
    m.position.y = visH / 2 - planeH / 2 + labInput.scrollY * upp;
    if (drawn > 0 && !announced.current) {
      announced.current = true;
      onReady();
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, PLANE_Z]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Slab() {
  const group = useRef<THREE.Group>(null);
  const slices = useRef<(THREE.Mesh | null)[]>([]);
  const p = useRef(0);
  const look = useRef({ x: 0, y: 0 });
  const { size, camera } = useThree();
  const mobile = labInput.mobile;
  const W = mobile ? 0.62 : 1.3;
  const D = 0.62;
  // Slice height follows the headline's laid-out height so the slab covers exactly the headline.
  const [sliceH] = useState(() => {
    const h1 = document.querySelector<HTMLElement>("[data-lab-headline]");
    const cam = camera as THREE.PerspectiveCamera;
    const upp = (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z) / size.height;
    const h = h1 ? h1.getBoundingClientRect().height * upp * 1.06 : 2.6;
    return h / SLICES;
  });

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 20);
    const reduced = labInput.reduced;
    p.current = THREE.MathUtils.damp(p.current, reduced ? 0 : labInput.progress, 4, d);
    const [a, b] = stops(p.current);

    // Each stop: sit over that stop's text on screen (live rects, so it tracks while scrolling).
    const cam = camera as THREE.PerspectiveCamera;
    const upp = (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z) / size.height;
    const yOf = (sel: string) => {
      const el = document.querySelector<HTMLElement>(sel);
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return (size.height / 2 - (r.top + r.height / 2)) * upp;
    };
    const ys = [yOf("[data-lab-headline]"), yOf('[data-lab-glass-group="1"]'), yOf('[data-lab-glass-group="2"]')];

    look.current.x = THREE.MathUtils.damp(look.current.x, labInput.pointer.x, 3, d);
    look.current.y = THREE.MathUtils.damp(look.current.y, labInput.pointer.y, 3, d);
    const g = group.current;
    if (g) {
      const idle = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.35) * 0.06;
      g.position.y = lerp(lerp(ys[0], ys[1], a), ys[2], b);
      g.rotation.y = lerp(lerp(-0.42, 1.9, a), 3.0, b) + idle + look.current.x * 0.18;
      g.rotation.x = lerp(0.06, -0.12, a) - look.current.y * 0.1;
      g.rotation.z = lerp(0, 0.08, b);
    }
    slices.current.forEach((s, i) => {
      if (!s) return;
      const k = i - (SLICES - 1) / 2;
      s.position.z = lerp(0, k * 0.85, b);
      s.position.x = lerp(0, k * 0.22, b);
      s.position.y = k * sliceH + lerp(0, k * 0.12, b);
      s.rotation.y = lerp(0, k * 0.22, b);
    });
  });

  return (
    <group ref={group}>
      {Array.from({ length: SLICES }, (_, i) => (
        <RoundedBox
          key={i}
          ref={(el: THREE.Mesh | null) => void (slices.current[i] = el)}
          args={[W, sliceH, D]}
          radius={0.035}
          smoothness={4}
        >
          <MeshTransmissionMaterial
            transmissionSampler
            samples={mobile ? 3 : 4}
            thickness={0.9}
            roughness={0.04}
            ior={1.5}
            chromaticAberration={0.09}
            anisotropicBlur={0}
            distortion={0}
            backside={false}
            color="#ffffff"
            attenuationColor="#f3ece0"
            attenuationDistance={3}
          />
        </RoundedBox>
      ))}
    </group>
  );
}

export default function MonolithScene({ fps }: { fps: boolean }) {
  // The refracted copies are on screen: fade the HTML text (it stays in the DOM for assistive tech).
  const onReady = () => document.querySelectorAll<HTMLElement>("[data-lab-glass]").forEach((el) => (el.style.opacity = "0"));
  useEffect(
    () => () => document.querySelectorAll<HTMLElement>("[data-lab-glass]").forEach((el) => (el.style.opacity = "")),
    [],
  );

  return (
    // Transmission buffer at half resolution: the glass is soft anyway, and it halves the cost (35 -> 60 fps).
    <LabCanvas fps={fps} camera={{ position: [0, 0, 7], fov: 30 }} background={BG} maxDpr={1.5} transmissionScale={0.5}>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={6} color="#ffffff" position={[-4, 2, 3]} scale={[0.6, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={4} color="#ffe7c2" position={[4, -1, 2]} scale={[0.6, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, 5, -2]} scale={[8, 0.6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[0, -4, 4]} scale={[6, 0.4, 1]} target={[0, 0, 0]} />
      </Environment>
      <Backdrop onReady={onReady} />
      <Slab />
    </LabCanvas>
  );
}
