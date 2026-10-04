import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { services } from "@/content/site";
import { cn } from "@/lib/utils";

// Bento: different cell sizes on the 12-column grid, divided by 1px lines.
const layout = [
  "md:col-span-7 md:row-span-2", // Shopify: the lead service
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-12",
];

export function ServicesBento({ number }: { number: string }) {
  return (
    <section aria-labelledby="services-title" className="section-space">
      <SectionHeader
        number={number}
        label="Services"
        id="services-title"
        title="What I can do for your business"
        intro="Four things, done properly. Each one has its own page with what is included."
      />
      <div className="container-page mt-12 md:mt-16">
        <ul className="grid grid-cols-1 gap-px border border-rule-strong bg-rule-strong md:grid-cols-12">
          {services.map((s, i) => {
            const lead = i === 0;
            const wide = i === 3;
            return (
              <li key={s.slug} className={cn("bg-bg", layout[i])}>
                <Link
                  href={`/services/${s.slug}`}
                  className={cn(
                    "group flex h-full flex-col gap-6 p-5 transition-colors duration-(--dur-fast) ease-brand hover:bg-surface md:p-8",
                    wide && "md:grid md:grid-cols-12 md:items-start md:gap-x-(--grid-gap)",
                  )}
                >
                  <div className={cn("flex items-start justify-between gap-4", wide && "md:col-span-5")}>
                    <div>
                      <p className="label text-fg-subtle">{String(i + 1).padStart(2, "0")}</p>
                      <h3 className={cn("mt-3 font-extrabold", lead ? "text-h2" : "text-h3")}>{s.name}</h3>
                    </div>
                    <ArrowUpRight
                      aria-hidden="true"
                      className={cn(
                        "size-6 shrink-0 transition-transform duration-(--dur-fast) ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                        lead && "text-signal",
                      )}
                    />
                  </div>
                  <p className={cn("max-w-[44ch] text-fg-muted", lead ? "text-lead" : "text-body", wide && "md:col-span-4")}>
                    {s.short}
                  </p>
                  <ul className={cn("mt-auto space-y-1.5 border-t border-rule pt-4 text-small", wide && "md:col-span-3 md:mt-0 md:border-t-0 md:pt-0")}>
                    {s.included.slice(0, lead ? 5 : 3).map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 bg-fg" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
