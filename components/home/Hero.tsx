import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { profile } from "@/content/site";

/**
 * Hero: headline, one line of intro, two buttons. The particle scene sits behind (HomeScene).
 * Server-rendered and never animated: the headline is the LCP element and paints immediately.
 */
export function Hero() {
  return (
    <section
      id="hero"
      data-stop-mark="0"
      aria-labelledby="hero-title"
      className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-end"
    >
      <div className="container-page pb-[clamp(2rem,6svh,4.5rem)]">
        <div data-scene-text className="w-fit max-w-full">
          <p className="label text-fg-muted">
            {profile.name} · {profile.jobTitle} · {profile.location.city}
          </p>
          <h1 id="hero-title" className="mt-[clamp(1rem,3svh,1.75rem)] max-w-[16ch] text-display">
            {profile.headline}
          </h1>
        </div>
        <div className="mt-[clamp(1.5rem,4.5svh,3rem)] flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-12">
          <p data-scene-text className="max-w-[44ch] text-lead text-fg-muted">
            {profile.intro}
          </p>
          <div data-scene-text className="flex flex-col gap-3 sm:flex-row">
            <MagneticButton href="/contact">Start a project</MagneticButton>
            <Link href="/work" className="btn btn-ghost h-14 px-7 text-base">
              See work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
