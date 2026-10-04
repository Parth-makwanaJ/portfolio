import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { profile, services } from "@/content/site";
import type { Proto } from "@/components/lab/protos";

/**
 * Server-rendered HTML on top of the canvas: the real headline paints immediately and never
 * waits for WebGL. Three stops of 100svh each drive the scene (hero, services, contact).
 */
export function LabOverlay({ proto }: { proto: Proto }) {
  const center = proto.layout === "center";
  return (
    <div className="relative z-10" style={{ fontFamily: proto.text, color: proto.fg }}>
      <section className="flex min-h-svh flex-col justify-end px-5 pt-24 pb-14 md:px-12 md:pb-16">
        <p
          className={`text-[11px] tracking-[0.18em] uppercase ${center ? "text-center" : ""}`}
          style={{ color: proto.muted }}
        >
          {profile.name} · {profile.jobTitle} · {profile.location.city}
        </p>
        <h1
          data-lab-headline
          data-lab-glass
          className={`mt-6 max-w-[16ch] transition-opacity duration-300 ${center ? "mx-auto text-center" : ""} ${proto.headline}`}
          style={{ fontFamily: proto.display }}
        >
          {profile.headline}
        </h1>
        <div className={`mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between ${center ? "md:justify-center md:text-center" : ""}`}>
          <p className={`max-w-[42ch] text-[17px] leading-relaxed ${center ? "mx-auto md:mx-0" : ""}`} style={{ color: proto.muted }}>
            {profile.intro}
          </p>
          <div className={`flex gap-3 ${center ? "justify-center" : ""}`}>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center gap-3 px-6 text-[15px] font-medium transition-opacity duration-100 ease-out hover:opacity-85"
              style={{ background: proto.accent, color: proto.onAccent }}
            >
              Start a project <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/work"
              className="inline-flex h-12 items-center px-6 text-[15px] font-medium transition-colors duration-100 ease-out"
              style={{ boxShadow: `inset 0 0 0 1px ${proto.rule}` }}
            >
              See work
            </Link>
          </div>
        </div>
      </section>

      <section className={`flex min-h-svh flex-col justify-center px-5 md:px-12 ${center ? "items-center text-center" : ""}`}>
        <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: proto.muted }}>
          What I do
        </p>
        <ul data-lab-glass-group="1" className="mt-6 space-y-2">
          {services.map((s) => (
            <li key={s.slug} data-lab-glass className="text-[clamp(1.75rem,1rem+2.4vw,3.5rem)] leading-[1.05] transition-opacity duration-300" style={{ fontFamily: proto.display }}>
              {s.name}
            </li>
          ))}
        </ul>
      </section>

      <section className={`flex min-h-svh flex-col justify-center px-5 pb-24 md:px-12 ${center ? "items-center text-center" : ""}`}>
        <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: proto.muted }}>
          Contact
        </p>
        <p data-lab-glass data-lab-glass-group="2" className="mt-6 max-w-[14ch] text-[clamp(2.75rem,1rem+5vw,6.5rem)] leading-[0.95] transition-opacity duration-300" style={{ fontFamily: proto.display }}>
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
