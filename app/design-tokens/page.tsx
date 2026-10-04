// TEMPORARY: design review page for Phase 2. Delete before launch.
import type { Metadata } from "next";
import Image from "next/image";
import { ProjectFrame } from "@/components/ProjectFrame";
import { profile, projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Design tokens",
  robots: { index: false, follow: false },
};

const colours = [
  { token: "--bg", light: "#FFFFFF", dark: "#0B0B0B", note: "page" },
  { token: "--surface", light: "#F4F4F4", dark: "#161616", note: "hover fills, inputs" },
  { token: "--fg", light: "#111111", dark: "#F2F2F2", note: "text · 18.9 / 17.6 : 1" },
  { token: "--fg-muted", light: "#555555", dark: "#A6A6A6", note: "body copy · 7.5 / 8.1 : 1" },
  { token: "--fg-subtle", light: "#6B6B6B", dark: "#8F8F8F", note: "labels · 5.3 / 6.1 : 1" },
  { token: "--rule", light: "#E2E2E2", dark: "#262626", note: "cell dividers" },
  { token: "--rule-strong", light: "#111111", dark: "#F2F2F2", note: "section rules, outlines" },
  { token: "--grid-line", light: "fg 7%", dark: "fg 7%", note: "the visible grid" },
  { token: "--signal", light: "#E30613", dark: "#FF3B30", note: "the one accent · 4.9 / 5.6 : 1" },
];

const type = [
  { name: "display", cls: "text-display", spec: "800 · 48→148px · lh .88 · −4.5%", sample: "Fast stores." },
  { name: "h1", cls: "text-h1", spec: "800 · 44→112px · lh .9 · −4%", sample: "Selected work" },
  { name: "h2", cls: "text-h2", spec: "800 · 36→80px · lh .95 · −3.5%", sample: "How I work" },
  { name: "h3", cls: "text-h3 font-medium", spec: "500 · 24→36px · lh 1.05 · −3%", sample: "Shopify development" },
  { name: "lead", cls: "text-lead text-fg-muted", spec: "400 · 19→24px · lh 1.35", sample: "I build Shopify stores, Laravel and Node.js backends, and I make slow sites fast." },
  { name: "body", cls: "text-body text-fg-muted", spec: "400 · 17px · lh 1.55", sample: "A crystal shop needed an online store that could take payments and ship orders without manual work." },
  { name: "small", cls: "text-small font-medium", spec: "500 · 14px", sample: "Laravel · Node.js · MySQL" },
  { name: "label", cls: "label text-fg-subtle", spec: "IBM Plex Mono 400 · 12px · caps", sample: "01 — Case study · 2025" },
];

function Swatches({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className={`${theme} border border-rule-strong bg-bg p-5 text-fg md:p-6`}>
      <p className="label text-fg-subtle">{theme === "light" ? "Light (default)" : "Dark"}</p>
      <ul className="mt-4 border-t border-rule">
        {colours.map((c) => (
          <li key={c.token} className="grid grid-cols-[2.5rem_8rem_5rem_1fr] items-center gap-3 border-b border-rule py-2">
            <span className="size-8 border border-rule" style={{ background: `var(${c.token})` }} />
            <span className="label">{c.token}</span>
            <span className="label text-fg-subtle">{theme === "light" ? c.light : c.dark}</span>
            <span className="text-small text-fg-muted">{c.note}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="inline-flex h-12 items-center bg-signal px-5 font-medium text-on-signal">Start a project</span>
        <span className="inline-flex h-12 items-center border border-rule-strong px-5 font-medium">See work</span>
        <span className="inline-flex h-12 items-center border border-rule-strong px-5 font-medium outline-2 outline-offset-2 outline-signal">
          Focus
        </span>
        <span className="text-signal underline underline-offset-4">Text link</span>
      </div>
    </div>
  );
}

export default function DesignTokens() {
  return (
    <div className="container-page section-space">
      <p className="label text-fg-subtle">Phase 2 · Swiss design system</p>
      <h1 className="mt-4 text-h1">Design tokens</h1>

      <section className="mt-16 border-t border-rule-strong pt-4">
        <h2 className="label">01 Colour</h2>
        <div className="mt-6 grid gap-(--grid-gap) lg:grid-cols-2">
          <Swatches theme="light" />
          <Swatches theme="dark" />
        </div>
      </section>

      <section className="mt-20 border-t border-rule-strong pt-4">
        <h2 className="label">02 Type · Inter Tight 400 / 500 / 800, IBM Plex Mono for labels</h2>
        <ul className="mt-6">
          {type.map((t) => (
            <li key={t.name} className="grid-12 items-baseline gap-y-2 border-b border-rule py-6">
              <span className="label col-span-4 md:col-span-2">{t.name}</span>
              <span className="label col-span-4 text-fg-subtle md:col-span-3">{t.spec}</span>
              <span className={`col-span-4 md:col-span-7 ${t.cls}`}>{t.sample}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 grid gap-12 border-t border-rule-strong pt-4 lg:grid-cols-3">
        <div>
          <h2 className="label">03 Grid and spacing</h2>
          <dl className="mt-6 space-y-2 text-small">
            {[
              ["Columns", "12 from 768px, 4 below; visible on every page"],
              ["--gutter", "16 → 40px page margin"],
              ["--grid-gap", "16 → 24px column gap"],
              ["--section-space", "80 → 160px between sections"],
              ["Max width", "1440px"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] border-b border-rule pb-2">
                <dt className="label">{k}</dt>
                <dd className="text-fg-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="label">04 Lines and corners</h2>
          <div className="mt-6 flex items-end gap-4">
            <div className="size-20 border border-rule-strong" />
            <div className="size-20 bg-fg" />
            <div className="size-20 rounded-full bg-signal" />
          </div>
          <p className="mt-4 text-small text-fg-muted">
            Square corners. 1px rules. No shadows, gradients, glass or texture. Circles appear only as shapes in compositions.
          </p>
        </div>
        <div>
          <h2 className="label">05 Motion</h2>
          <dl className="mt-6 space-y-2 text-small">
            {[
              ["--dur-fast", "120ms · hovers, focus"],
              ["--dur-base", "200ms · reveals, menu"],
              ["--dur-slow", "320ms · page transitions (max)"],
              ["--ease-out-brand", "cubic-bezier(.2, 0, 0, 1)"],
              ["--ease-in-brand", "cubic-bezier(.4, 0, 1, 1) · exits"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] border-b border-rule pb-2">
                <dt className="label">{k}</dt>
                <dd className="text-fg-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-20 border-t border-rule-strong pt-4">
        <h2 className="label">06 Project frame · original ratio, no crop · loaded from the remote resizer</h2>
        <ul className="mt-6 grid grid-cols-2 gap-(--grid-gap) md:grid-cols-4">
          {projects.map((p) => (
            <li key={p.slug}>
              <ProjectFrame image={p.image} sizes="(min-width: 768px) 25vw, 50vw" />
              <p className="label mt-2">{p.name}</p>
            </li>
          ))}
          <li className="border border-rule-strong">
            <Image
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={profile.photo.width}
              height={profile.photo.height}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="w-full"
            />
            <p className="label border-t border-rule-strong px-2 py-1.5">Photo</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
