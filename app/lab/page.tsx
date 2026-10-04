import type { Metadata } from "next";
import { LabOverlay } from "@/components/lab/LabOverlay";
import { LabPicker } from "@/components/lab/LabPicker";
import { LabScene } from "@/components/lab/LabScene";
import { protos, type ProtoId } from "@/components/lab/protos";
import { calibreDisplay, calibreText, monolithDisplay, monolithText, signalDisplay, signalText } from "@/app/lab/fonts";

// Prototype lab for the v2 hero. Not linked anywhere, not in the sitemap, noindex.
export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

const fontVars = [calibreDisplay, calibreText, signalDisplay, signalText, monolithDisplay, monolithText]
  .map((f) => f.variable)
  .join(" ");

export default async function LabPage({ searchParams }: { searchParams: Promise<{ v?: string; fps?: string }> }) {
  const { v, fps } = await searchParams;
  const id: ProtoId = v === "b" || v === "c" ? v : "a";
  const proto = protos[id];
  const showFps = fps === "1";

  return (
    <div data-lab={id} className={fontVars}>
      {/* Hide the current site chrome on /lab so each prototype is judged on its own. */}
      <style>{`
        html:has([data-lab]) { background: ${proto.bg}; color-scheme: dark; }
        body:has([data-lab]) [data-site-chrome] { display: none !important; }
      `}</style>
      <LabScene id={id} fps={showFps} />
      <LabOverlay proto={proto} />
      <LabPicker current={id} fps={showFps} />
    </div>
  );
}
