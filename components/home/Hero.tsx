import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { HeroComposition } from "@/components/home/HeroComposition";
import { profile } from "@/content/site";

// Name and location are hidden on phones: the header shows the name and the intro says where.
const facts = [
  { key: "Name", value: profile.name, phone: false },
  { key: "Role", value: profile.jobTitle, phone: true },
  { key: "Based in", value: `${profile.location.city}, ${profile.location.country}`, phone: false },
  { key: "Status", value: profile.availability, phone: true },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-rule-strong">
      <div className="container-page grid-12 pt-6 pb-16 md:pt-[clamp(1.5rem,4svh,3rem)] md:pb-24">
        <dl className="col-span-4 grid grid-cols-2 gap-x-(--grid-gap) gap-y-5 border-t border-rule-strong pt-3 md:col-span-12 md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.key} className={f.phone ? "" : "max-md:hidden"}>
              <dt className="label text-fg-subtle">{f.key}</dt>
              <dd className="mt-1 text-small font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>

        <h1 id="hero-title" className="col-span-4 mt-8 text-display md:col-span-11 md:mt-[clamp(2rem,6svh,5rem)]">
          {profile.headline}
        </h1>

        <div className="col-span-4 mt-8 md:col-span-5 md:mt-[clamp(1.75rem,5svh,4rem)]">
          <p className="max-w-[34ch] text-lead text-fg-muted">{profile.intro}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
            <MagneticButton href="/contact">Start a project</MagneticButton>
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
