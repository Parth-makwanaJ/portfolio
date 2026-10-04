import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroComposition } from "@/components/home/HeroComposition";
import { profile } from "@/content/site";

const facts = [
  { key: "Name", value: profile.name },
  { key: "Role", value: profile.jobTitle },
  { key: "Based in", value: `${profile.location.city}, ${profile.location.country}` },
  { key: "Status", value: profile.availability },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-rule-strong">
      <div className="container-page grid-12 pt-8 pb-16 md:pt-12 md:pb-24">
        <dl className="col-span-4 grid grid-cols-2 gap-x-(--grid-gap) gap-y-5 border-t border-rule-strong pt-3 md:col-span-12 md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.key}>
              <dt className="label text-fg-subtle">{f.key}</dt>
              <dd className="mt-1 text-small font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>

        <h1 id="hero-title" className="col-span-4 mt-12 text-display md:col-span-11 md:mt-20">
          {profile.headline}
        </h1>

        <div className="col-span-4 mt-10 md:col-span-5 md:mt-16">
          <p className="max-w-[34ch] text-lead text-fg-muted">{profile.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex h-12 items-center justify-between gap-6 bg-signal px-5 font-medium text-on-signal transition-opacity duration-(--dur-fast) ease-brand hover:opacity-90"
            >
              Start a project
              <ArrowRight
                className="size-4 transition-transform duration-(--dur-fast) ease-brand group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/work"
              className="inline-flex h-12 items-center justify-center border border-rule-strong px-5 font-medium transition-colors duration-(--dur-fast) ease-brand hover:bg-fg hover:text-bg"
            >
              See work
            </Link>
          </div>
        </div>

        {/* Fixed-size slot (height comes from CSS, not JS), so nothing shifts when Phase 4 animates it. */}
        <HeroComposition className="col-span-4 mt-14 md:col-span-6 md:col-start-7 md:mt-16" />
      </div>
    </section>
  );
}
