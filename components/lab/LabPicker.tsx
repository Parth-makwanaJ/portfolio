import Link from "next/link";
import { protos, type ProtoId } from "@/components/lab/protos";

/** Prototype switcher, fixed at the bottom. Full navigation per prototype keeps each one isolated. */
export function LabPicker({ current, fps }: { current: ProtoId; fps: boolean }) {
  return (
    <nav
      aria-label="Prototypes"
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 bg-[#1b1b1b]/90 p-1 text-[12px] text-[#e8e8e8]"
      style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
    >
      {(Object.keys(protos) as ProtoId[]).map((id) => (
        // Full page loads on purpose: each prototype gets a fresh WebGL context.
        <a
          key={id}
          href={`/lab?v=${id}${fps ? "&fps=1" : ""}`}
          aria-current={id === current ? "page" : undefined}
          className={`px-3 py-2 transition-colors duration-100 ${id === current ? "bg-[#e8e8e8] text-[#111]" : "hover:bg-white/10"}`}
        >
          {id.toUpperCase()} · {protos[id].name}
        </a>
      ))}
      <Link href={`/lab?v=${current}${fps ? "" : "&fps=1"}`} className="px-3 py-2 text-[#9a9a9a] hover:text-white">
        {fps ? <span id="lab-fps">… fps</span> : "fps"}
      </Link>
    </nav>
  );
}
