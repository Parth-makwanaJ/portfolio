"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

declare global {
  interface Window {
    __labFps?: number[];
  }
}

/** Counts rendered frames per second; samples go to window.__labFps for measurement and the on-screen readout. */
export function FpsMeter() {
  const frames = useRef(0);
  const last = useRef(performance.now());
  useFrame(() => {
    frames.current++;
    const now = performance.now();
    if (now - last.current >= 1000) {
      const fps = Math.round((frames.current * 1000) / (now - last.current));
      frames.current = 0;
      last.current = now;
      (window.__labFps ??= []).push(fps);
      const el = document.getElementById("lab-fps");
      if (el) el.textContent = `${fps} fps`;
    }
  });
  return null;
}
