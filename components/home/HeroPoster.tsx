/**
 * Static stand-in for the hero 3D scene: a particle sphere with one band in the signal colour.
 * Rendered on the server as plain SVG. Used as the poster on mobile, low-power devices
 * and with prefers-reduced-motion, and as the placeholder until the canvas loads.
 */

const N = 340;
const SIZE = 600;
const R = 220;
const TILT = 0.42;

type Dot = { x: number; y: number; r: number; o: number; band: boolean; z: number };

const dots: Dot[] = (() => {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const out: Dot[] = [];
  for (let i = 0; i < N; i++) {
    const y0 = 1 - (i / (N - 1)) * 2;
    const ring = Math.sqrt(1 - y0 * y0);
    const t = golden * i;
    const x0 = Math.cos(t) * ring;
    const z0 = Math.sin(t) * ring;
    // tilt around the x axis
    const y = y0 * Math.cos(TILT) - z0 * Math.sin(TILT);
    const z = y0 * Math.sin(TILT) + z0 * Math.cos(TILT);
    const depth = (z + 1) / 2; // 0 = back, 1 = front
    out.push({
      x: Math.round((SIZE / 2 + x0 * R) * 10) / 10,
      y: Math.round((SIZE / 2 + y * R) * 10) / 10,
      r: Math.round((1 + depth * 2) * 10) / 10,
      o: Math.round((0.18 + depth * 0.72) * 100) / 100,
      band: Math.abs(y0) < 0.07,
      z,
    });
  }
  return out.sort((a, b) => a.z - b.z);
})();

export function HeroPoster({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={className} aria-hidden="true" focusable="false">
      <g stroke="var(--rule-strong)" strokeWidth="1" fill="none">
        <line x1="0" y1={SIZE / 2} x2={SIZE} y2={SIZE / 2} strokeDasharray="2 6" />
        <line x1={SIZE / 2} y1="0" x2={SIZE / 2} y2={SIZE} strokeDasharray="2 6" />
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R + 40} />
      </g>
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.band ? d.r + 0.6 : d.r}
          fill={d.band ? "var(--signal)" : "var(--fg)"}
          opacity={d.band ? Math.max(d.o, 0.55) : d.o}
        />
      ))}
    </svg>
  );
}
