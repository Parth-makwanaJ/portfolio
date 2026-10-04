import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredProjects, process as steps, profile, services } from "@/content/site";
import type { Proto } from "@/components/lab/protos";

/**
 * Overlay for prototype D: eight blocks of one viewport each. The scene reads the scroll position
 * as a stop index (scrollY / viewport height): 0 hero, 1-4 the four services, 5 work, 6 process,
 * 7 contact. Text always sits left of the object (top/bottom on phones), never behind the glass.
 */
export function LabOverlayD({ proto }: { proto: Proto }) {
  const label = "text-[11px] tracking-[0.18em] uppercase";
  const display = { fontFamily: proto.display };
  const block = "flex min-h-svh flex-col px-5 md:w-1/2 md:px-12";
  return (
    <div className="relative z-10" style={{ fontFamily: proto.text, color: proto.fg }}>
      {/* 0 · hero */}
      <section className={`${block} justify-end pt-24 pb-14 md:w-auto md:pb-16`}>
        <p className={label} style={{ color: proto.muted }}>
          {profile.name} · {profile.jobTitle} · {profile.location.city}
        </p>
        <h1 className={`mt-6 max-w-[14ch] ${proto.headline}`} style={display}>
          {profile.headline}
        </h1>
        <div className="mt-10 flex flex-col gap-8">
          <p className="max-w-[42ch] text-[17px] leading-relaxed" style={{ color: proto.muted }}>
            {profile.intro}
          </p>
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center gap-3 px-6 text-[15px] font-medium transition-opacity duration-100 ease-out hover:opacity-85"
              style={{ background: proto.accent, color: proto.onAccent }}
            >
              Start a project <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/work"
              className="inline-flex h-12 items-center px-6 text-[15px] font-medium"
              style={{ boxShadow: `inset 0 0 0 1px ${proto.rule}` }}
            >
              See work
            </Link>
          </div>
        </div>
      </section>

      {/* 1-4 · services, one per viewport */}
      {services.map((s, i) => (
        <section key={s.slug} className={`${block} justify-end pb-24 md:justify-center md:pb-0`}>
          <p className={label} style={{ color: proto.muted }}>
            Service {String(i + 1).padStart(2, "0")} / 04
          </p>
          <h2 className="mt-5 text-[clamp(2.5rem,1.2rem+3.6vw,5rem)] leading-[1] tracking-[-0.015em]" style={display}>
            {s.name}
          </h2>
          <p className="mt-5 max-w-[40ch] text-[17px] leading-relaxed" style={{ color: proto.muted }}>
            {s.summary}
          </p>
        </section>
      ))}

      {/* 5 · work */}
      <section className={`${block} justify-end pb-24 md:justify-center md:pb-0`}>
        <p className={label} style={{ color: proto.muted }}>
          Selected work
        </p>
        <ul className="mt-6 divide-y" style={{ borderColor: proto.rule }}>
          {featuredProjects().map((p) => (
            <li key={p.slug} style={{ borderColor: proto.rule }}>
              <Link href={`/work/${p.slug}`} className="flex items-baseline justify-between gap-6 py-4">
                <span className="text-[clamp(1.6rem,1rem+1.6vw,2.6rem)] leading-tight" style={display}>
                  {p.name}
                </span>
                <span className="text-[13px]" style={{ color: proto.muted }}>
                  {p.category}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 6 · process */}
      <section className={`${block} justify-end pb-24 md:justify-center md:pb-0`}>
        <p className={label} style={{ color: proto.muted }}>
          Process
        </p>
        <ol className="mt-6 space-y-4">
          {steps.map((s, i) => (
            <li key={s.step} className="grid grid-cols-[2.5rem_1fr] gap-x-3">
              <span className="pt-1 text-[12px] tabular-nums" style={{ color: proto.muted }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-[26px] leading-tight" style={display}>
                  {s.step}
                </span>
                <span className="text-[15px]" style={{ color: proto.muted }}>
                  {s.text}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* 7 · contact */}
      <section className={`${block} justify-end pb-28 md:justify-center md:pb-0`}>
        <p className={label} style={{ color: proto.muted }}>
          Contact
        </p>
        <p className="mt-6 max-w-[12ch] text-[clamp(3rem,1rem+5vw,6.75rem)] leading-[0.95]" style={display}>
          Have a project in mind?
        </p>
        <Link
          href="/contact"
          className="mt-10 inline-flex h-12 w-fit items-center gap-3 px-6 text-[15px] font-medium"
          style={{ background: proto.accent, color: proto.onAccent }}
        >
          Start a project <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
