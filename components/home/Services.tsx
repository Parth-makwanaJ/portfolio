import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/content/site";

/**
 * Pinned services. The stage sticks for four screens of scroll; the scene input sets the current
 * step on [data-step] (and the counter and rail), and the particle field takes a new form for each
 * service. The four markers place the scene's states 1-4 in the scroll.
 * Without JavaScript, or with reduced motion, the services sit one after another in normal flow.
 */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="services-track">
      {services.map((s, i) => (
        <span
          key={s.slug}
          aria-hidden="true"
          data-stop-mark={i + 1}
          className="services-only-js pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `calc(${i + 1} * 100svh)` }}
        />
      ))}
      <div data-services-stage data-step="0" className="services-stage">
        <div className="container-page flex h-full flex-col justify-between gap-12 pt-24 pb-[clamp(2rem,7svh,5rem)] md:pt-28">
          <div data-scene-text className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
            <div>
              <p className="label text-fg-muted">Services</p>
              <h2 id="services-title" data-reveal className="mt-4 max-w-[15ch] text-h2">
                What I can do for your business
              </h2>
            </div>
            <div aria-hidden="true" className="services-only-js w-40 pb-2">
              <p className="label tabular-nums text-fg-muted">
                <span data-services-count className="text-fg">
                  01
                </span>{" "}
                / {String(services.length).padStart(2, "0")}
              </p>
              <span className="mt-3 block h-px bg-rule">
                <span className="services-rail block h-px bg-signal" />
              </span>
            </div>
          </div>

          <ol data-scene-text className="services-panels md:max-w-[60%]">
            {services.map((s, i) => (
              <li key={s.slug} data-index={i} className="services-panel">
                <p className="label text-fg-muted">
                  {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-h2">{s.name}</h3>
                <p className="mt-5 max-w-[46ch] text-lead text-fg-muted">{s.summary}</p>
                <ul className="mt-6 hidden max-w-[52ch] grid-cols-2 gap-x-8 gap-y-2 text-small md:grid">
                  {s.included.slice(0, 4).map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-fg-muted" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${s.slug}`}
                  className="group mt-7 inline-flex items-center gap-2 text-small font-medium link-line"
                >
                  What is included
                  <span className="sr-only"> in {s.name}</span>
                  <ArrowRight
                    className="size-4 transition-transform duration-(--dur-fast) ease-brand group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
