"use client";

/**
 * Mounts the chosen prototype's canvas after first paint. Each scene is its own lazy chunk,
 * so three, R3F and drei never block the HTML headline.
 */

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { startLabInput } from "@/components/lab/store";
import type { ProtoId } from "@/components/lab/protos";

const scenes = {
  a: dynamic(() => import("@/components/lab/scenes/CalibreScene"), { ssr: false }),
  b: dynamic(() => import("@/components/lab/scenes/SignalScene"), { ssr: false }),
  c: dynamic(() => import("@/components/lab/scenes/MonolithScene"), { ssr: false }),
  d: dynamic(() => import("@/components/lab/scenes/InstrumentScene"), { ssr: false }),
};

export function LabScene({ id, fps }: { id: ProtoId; fps: boolean }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stop = startLabInput();
    // Wait for the first paint, then load WebGL.
    const raf = requestAnimationFrame(() => setTimeout(() => setReady(true), 0));
    return () => {
      cancelAnimationFrame(raf);
      stop();
    };
  }, []);

  const Scene = scenes[id];
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {ready && <Scene fps={fps} />}
    </div>
  );
}
