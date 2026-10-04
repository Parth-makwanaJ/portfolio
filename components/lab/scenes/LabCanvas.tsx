"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, type ReactNode } from "react";
import * as THREE from "three";
import { FpsMeter } from "@/components/lab/FpsMeter";
import { labInput } from "@/components/lab/store";

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
}: {
  children: ReactNode;
  fps: boolean;
  camera: { position: [number, number, number]; fov: number };
  shadows?: boolean;
  background: string;
  maxDpr?: number;
  transmissionScale?: number;
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
      {fps && <FpsMeter />}
      {children}
    </Canvas>
  );
}
