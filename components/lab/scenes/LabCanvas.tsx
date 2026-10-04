"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { FpsMeter } from "@/components/lab/FpsMeter";
import { labInput } from "@/components/lab/store";

/**
 * Runtime fallback: after a 5 s warm-up (intro, shader compiles and texture uploads are done by then),
 * takes the median of five one-second samples. If it is under the floor (40 fps on phones, 30 on
 * desktop), the loop stops on the current frame: a static render. One-off hitches can't trigger it.
 * Reduced motion: a single static render from the start.
 */
function Guard() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);
  const t0 = useRef(0);
  const frames = useRef(0);
  const samples = useRef<number[]>([]);
  const done = useRef(false);
  useEffect(() => {
    if (labInput.reduced) {
      setFrameloop("demand");
      invalidate();
      (window as Window & { __labFallback?: string }).__labFallback = "reduced-motion";
    }
  }, [setFrameloop, invalidate]);
  useFrame((state) => {
    if (done.current || labInput.reduced) return;
    const t = state.clock.elapsedTime;
    if (t < 5) return;
    if (!t0.current) t0.current = t;
    frames.current++;
    if (t - t0.current >= 1) {
      samples.current.push(frames.current / (t - t0.current));
      frames.current = 0;
      t0.current = t;
    }
    if (samples.current.length === 5) {
      done.current = true;
      const fps = [...samples.current].sort((a, b) => a - b)[2];
      const floor = labInput.mobile ? 40 : 30;
      if (fps < floor) {
        setFrameloop("never");
        (window as Window & { __labFallback?: string }).__labFallback = `static (${Math.round(fps)} fps)`;
      }
    }
  });
  return null;
}

/** Stops the render loop while the tab is hidden. */
function PauseWhenHidden() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? "never" : "always");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [setFrameloop]);
  return null;
}

export function LabCanvas({
  children,
  fps,
  camera,
  shadows = false,
  background,
  maxDpr = 2,
  transmissionScale = 1,
  guard = false,
}: {
  children: ReactNode;
  fps: boolean;
  camera: { position: [number, number, number]; fov: number };
  shadows?: boolean;
  background: string;
  maxDpr?: number;
  transmissionScale?: number;
  guard?: boolean;
}) {
  const mobile = labInput.mobile;
  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : maxDpr]}
      shadows={shadows && !mobile ? "percentage" : false}
      camera={{ ...camera, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        gl.transmissionResolutionScale = transmissionScale;
        scene.background = new THREE.Color(background);
      }}
    >
      <PauseWhenHidden />
      {guard && <Guard />}
      {fps && <FpsMeter />}
      {children}
    </Canvas>
  );
}
