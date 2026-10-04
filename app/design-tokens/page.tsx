// TEMPORARY: design review page for Phase 2. Delete before launch.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design tokens",
  robots: { index: false, follow: false },
};

const colours = [
  { token: "--bg", dark: "#0F0E0C", light: "#F3F0E8", note: "page background" },
  { token: "--surface", dark: "#171613", light: "#EAE6DC", note: "raised areas, hovers" },
  { token: "--fg", dark: "#EDE9E1", light: "#151410", note: "text · 15.9 / 16.2 : 1" },
  { token: "--fg-muted", dark: "#A29C90", light: "#5E5A51", note: "body copy · 7.1 / 6.0 : 1" },
  { token: "--fg-subtle", dark: "#8C867B", light: "#6B665C", note: "labels, meta · 5.3 / 5.0 : 1" },
  { token: "--rule", dark: "fg 11%", light: "fg 12%", note: "hairlines" },
  { token: "--rule-strong", dark: "fg 24%", light: "fg 28%", note: "borders, inputs" },
  { token: "--signal", dark: "#FF6B35", light: "#B23C0A", note: "the one accent · 6.8 / 5.2 : 1" },
];

const type = [
  { name: "display", cls: "text-display font-display font-semibold [font-stretch:94%]", spec: "Bricolage Grotesque 600 · 44→112px · lh .95", sample: "Fast stores." },
  { name: "h1", cls: "text-h1 font-display font-semibold [font-stretch:94%]", spec: "Bricolage 600 · 40→88px · lh 1", sample: "Selected work" },
  { name: "h2", cls: "text-h2 font-display font-semibold", spec: "Bricolage 600 · 32→60px · lh 1.05", sample: "How I work" },
  { name: "h3", cls: "text-h3 font-display font-semibold", spec: "Bricolage 600 · 22→30px · lh 1.2", sample: "Shopify development" },
  { name: "lead", cls: "text-lead text-fg-muted", spec: "Instrument Sans 400 · 18→22px · lh 1.5", sample: "I build Shopify stores, Laravel and Node.js backends, and I make slow sites fast." },
  { name: "body", cls: "text-body text-fg-muted", spec: "Instrument Sans 400 · 17px · lh 1.65", sample: "A crystal shop needed an online store that could take payments and ship orders without manual work." },
  { name: "small", cls: "text-small text-fg-muted", spec: "Instrument Sans 400/500 · 14px", sample: "Laravel · Node.js · MySQL" },
  { name: "label", cls: "label text-fg-subtle", spec: "JetBrains Mono 400 · 12px · caps · +0.08em", sample: "01 — Case study · 2025" },
];

const space = [
  { token: "4px base", v: "Tailwind scale 1 = 4px", w: "1rem" },
  { token: "--gutter", v: "16 → 40px", w: "2.5rem" },
  { token: "--grid-gap", v: "16 → 24px", w: "1.5rem" },
  { token: "--section-space", v: "80 → 160px", w: "10rem" },
];

function Swatches({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className={`${theme} bg-bg text-fg border border-rule p-6 md:p-8`}>
      <p className="label text-fg-subtle">{theme} theme</p>
      <ul className="mt-6 divide-y divide-rule">
        {colours.map((c) => (
          <li key={c.token} className="flex items-center gap-4 py-3">
            <span
              className="size-10 shrink-0 rounded-(--radius) border border-rule"
              style={{ background: `var(${c.token})` }}
            />
            <span className="label w-32 shrink-0 text-fg">{c.token}</span>
            <span className="label w-20 shrink-0 text-fg-subtle">{theme === "dark" ? c.dark : c.light}</span>
            <span className="text-small text-fg-muted">{c.note}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="inline-flex h-12 items-center rounded-(--radius) bg-signal px-6 font-medium text-on-signal">
          Start a project
        </span>
        <span className="inline-flex h-12 items-center rounded-(--radius) border border-rule-strong px-6 font-medium">
          See work
        </span>
        <span className="inline-flex h-12 items-center rounded-(--radius) border border-rule-strong px-6 font-medium outline-2 outline-offset-3 outline-signal">
          Focus ring
        </span>
        <span className="text-signal underline underline-offset-4">Text link</span>
      </div>
    </div>
  );
}

export default function DesignTokens() {
  return (
    <div className="container-page section-space">
      <p className="label text-fg-subtle">Phase 2 · design system</p>
      <h1 className="mt-4 text-h1 [font-stretch:94%]">Design tokens</h1>

      <section className="mt-16">
        <h2 className="label text-fg-subtle">Colour</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Swatches theme="dark" />
          <Swatches theme="light" />
        </div>
      </section>

      <section className="mt-20">
        <h2 className="label text-fg-subtle">Type</h2>
        <ul className="mt-6 divide-y divide-rule border-y border-rule">
          {type.map((t) => (
            <li key={t.name} className="grid-12 items-baseline gap-y-2 py-6">
              <span className="label col-span-4 text-fg md:col-span-2">{t.name}</span>
              <span className="label col-span-4 text-fg-subtle md:col-span-3">{t.spec}</span>
              <span className={`col-span-4 md:col-span-7 ${t.cls}`}>{t.sample}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 grid gap-12 lg:grid-cols-3">
        <div>
          <h2 className="label text-fg-subtle">Spacing</h2>
          <ul className="mt-6 space-y-4">
            {space.map((s) => (
              <li key={s.token}>
                <div className="flex justify-between">
                  <span className="label text-fg">{s.token}</span>
                  <span className="label text-fg-subtle">{s.v}</span>
                </div>
                <div className="mt-2 h-2 bg-signal/80" style={{ width: s.w }} />
              </li>
            ))}
          </ul>
          <p className="mt-6 text-small text-fg-muted">12-column grid on ≥768px, 4 columns below. Max width 1440px.</p>
        </div>
        <div>
          <h2 className="label text-fg-subtle">Radius and lines</h2>
          <div className="mt-6 flex items-end gap-4">
            <div className="size-20 rounded-(--radius) border border-rule-strong" />
            <div className="size-20 rounded-(--radius) bg-surface" />
          </div>
          <p className="mt-4 text-small text-fg-muted">
            One radius: 4px. Sections are separated by space and 1px rules, not boxes. Grain texture at 5–6%.
          </p>
        </div>
        <div>
          <h2 className="label text-fg-subtle">Motion</h2>
          <dl className="mt-6 space-y-3 text-small">
            {[
              ["--dur-fast", "150ms · hovers, focus, toggles"],
              ["--dur-base", "250ms · reveals, menus"],
              ["--dur-slow", "400ms · page transitions, count-ups (max)"],
              ["--ease-out-brand", "cubic-bezier(.22, 1, .36, 1) · everything entering"],
              ["--ease-in-brand", "cubic-bezier(.55, 0, 1, .45) · exits only"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <dt className="label text-fg">{k}</dt>
                <dd className="text-fg-muted">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-small text-fg-muted">
            Only transform and opacity animate. Reduced motion: fades only, no 3D.
          </p>
        </div>
      </section>
    </div>
  );
}
