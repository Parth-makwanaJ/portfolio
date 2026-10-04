import { Instrument_Serif, Geist, Unbounded, Hanken_Grotesk, Fraunces, Figtree } from "next/font/google";

// One display + one text face per prototype. Only loaded on /lab.
export const calibreDisplay = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--lab-display-a", display: "swap" });
export const calibreText = Geist({ subsets: ["latin"], variable: "--lab-text-a", display: "swap" });
export const signalDisplay = Unbounded({ subsets: ["latin"], variable: "--lab-display-b", display: "swap" });
export const signalText = Hanken_Grotesk({ subsets: ["latin"], variable: "--lab-text-b", display: "swap" });
export const monolithDisplay = Fraunces({ subsets: ["latin"], axes: ["opsz", "SOFT"], variable: "--lab-display-c", display: "swap" });
export const monolithText = Figtree({ subsets: ["latin"], variable: "--lab-text-c", display: "swap" });
