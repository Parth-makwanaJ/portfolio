import { CountUp } from "@/components/motion/CountUp";
import { stats } from "@/content/site";

export function Numbers() {
  return (
    <section aria-label="In numbers" className="border-y border-rule-strong">
      <dl className="container-page grid grid-cols-1 sm:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col-reverse gap-2 py-8 sm:py-12 ${i > 0 ? "border-t border-rule sm:border-t-0 sm:border-l sm:pl-(--grid-gap)" : ""}`}
          >
            <dt className="label text-fg-subtle">{s.label}</dt>
            <dd className="text-display">
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
