export type ProtoId = "a" | "b" | "c";

export type Proto = {
  id: ProtoId;
  name: string;
  idea: string;
  bg: string;
  fg: string;
  muted: string;
  rule: string;
  accent: string;
  onAccent: string;
  display: string; // CSS var set by next/font
  text: string;
  headline: string; // extra classes for the h1 in this type pairing
  layout: "left" | "center";
};

export const protos: Record<ProtoId, Proto> = {
  a: {
    id: "a",
    name: "Calibre",
    idea: "Precision instrument",
    bg: "#0D0C0B",
    fg: "#EDE7DD",
    muted: "#9C9488",
    rule: "rgba(237,231,221,0.14)",
    accent: "#C9A36B",
    onAccent: "#0D0C0B",
    display: "var(--lab-display-a)",
    text: "var(--lab-text-a)",
    headline: "font-normal text-[clamp(3rem,1.2rem+5.4vw,7.25rem)] leading-[0.95] tracking-[-0.02em]",
    layout: "left",
  },
  b: {
    id: "b",
    name: "Signal",
    idea: "Particle field",
    bg: "#0B0C0D",
    fg: "#E9ECEA",
    muted: "#8E9592",
    rule: "rgba(233,236,234,0.14)",
    accent: "#D4FF3A",
    onAccent: "#0B0C0D",
    display: "var(--lab-display-b)",
    text: "var(--lab-text-b)",
    headline: "font-medium text-[clamp(2.25rem,1rem+3.6vw,5rem)] leading-[1.02] tracking-[-0.03em]",
    layout: "left",
  },
  c: {
    id: "c",
    name: "Monolith",
    idea: "Refractive glass",
    bg: "#0E0E0F",
    fg: "#F1EFEA",
    muted: "#9A978F",
    rule: "rgba(241,239,234,0.14)",
    accent: "#F2B84B",
    onAccent: "#0E0E0F",
    display: "var(--lab-display-c)",
    text: "var(--lab-text-c)",
    headline:
      "font-semibold text-[clamp(3rem,0.8rem+6.6vw,8.75rem)] leading-[0.92] tracking-[-0.035em] [font-variation-settings:'opsz'_144,'SOFT'_30]",
    layout: "center",
  },
};
