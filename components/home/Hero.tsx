import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroPoster } from "@/components/home/HeroPoster";
import { profile, services } from "@/content/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-rule">
      {/* 12-column guide lines: texture, not content */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="container-page grid-12 h-full">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className={`border-l border-rule/60 ${i >= 4 ? "hidden md:block" : ""} ${i === 11 ? "border-r" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="container-page relative grid-12 pt-12 pb-10 md:pt-24 md:pb-14">
        <p className="label col-span-4 flex items-center gap-3 text-fg-muted md:col-span-6 md:col-start-1 md:row-start-1">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-signal" />
          </span>
          {profile.availability}
        </p>
        <p className="label col-span-4 mt-2 text-fg-subtle md:col-span-6 md:col-start-7 md:row-start-1 md:mt-0 md:text-right">
          {profile.location.city}, {profile.location.country}
        </p>

        <h1
          id="hero-title"
          className="col-span-4 mt-10 text-display font-semibold [font-stretch:94%] md:col-span-8 md:row-start-2 md:mt-16"
        >
          {profile.headline}
        </h1>

        <div className="col-span-4 mt-8 md:col-span-6 md:row-start-3 md:mt-12">
          <p className="max-w-[46ch] text-lead text-fg-muted">{profile.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-(--radius) bg-signal px-6 font-medium text-on-signal transition-opacity duration-(--dur-fast) ease-brand hover:opacity-90"
            >
              Start a project
              <ArrowRight
                className="size-4 transition-transform duration-(--dur-fast) ease-brand group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/work"
              className="inline-flex h-12 items-center justify-center rounded-(--radius) border border-rule-strong px-6 font-medium text-fg transition-colors duration-(--dur-fast) ease-brand hover:bg-surface"
            >
              See work
            </Link>
          </div>
        </div>

        {/* Reserved, fixed-ratio slot. Phase 4 mounts the 3D canvas here over the poster. */}
        <div className="relative col-span-4 mx-auto mt-14 aspect-square w-3/5 max-w-64 md:col-span-4 md:col-start-9 md:row-span-2 md:row-start-2 md:mt-16 md:w-full md:max-w-none md:self-center">
          <HeroPoster className="absolute inset-0 size-full" />
        </div>
      </div>

      {/* Services index */}
      <nav aria-label="Services" className="relative border-t border-rule">
        <ol className="container-page grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {services.map((s, i) => (
            <li key={s.slug} className="border-rule max-sm:not-first:border-t sm:max-md:[&:nth-child(n+3)]:border-t md:not-first:border-l md:first:[&>a]:pl-0">
              <Link
                href={`/services/${s.slug}`}
                className="group flex items-baseline gap-4 py-5 transition-colors duration-(--dur-fast) ease-brand md:px-5"
              >
                <span className="label text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-small font-medium text-fg-muted group-hover:text-fg">{s.name}</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
