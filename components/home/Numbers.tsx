import { CountUp } from "@/components/motion/CountUp";
import { stats, techStack } from "@/content/site";

/** Numbers and tools: quiet and small. The only motion is the count-up. */
export function Numbers() {
  return (
    <section aria-labelledby="facts-title" className="pb-(--section-space)">
      <div data-scene-text className="container-page grid-12 items-start gap-y-14 border-t border-rule pt-10 md:pt-14">
        <h2 id="facts-title" className="sr-only">
          In numbers, and the tools I work with
        </h2>
        <dl className="col-span-4 grid grid-cols-3 gap-6 md:col-span-5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-2">
              <dt className="text-small text-fg-muted">{s.label}</dt>
              <dd className="font-display text-[clamp(2.25rem,1.6rem+2vw,3.5rem)] leading-none">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="col-span-4 md:col-span-6 md:col-start-7">
          <h3 className="label font-sans text-fg-muted">Tools I work with</h3>
          <dl className="mt-5 space-y-3 text-small">
            {techStack.map(({ group, items }) => (
              <div key={group} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-rule pb-3 last:border-0">
                <dt className="text-fg-muted">{group}</dt>
                <dd>{items.map((i) => i.name).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
