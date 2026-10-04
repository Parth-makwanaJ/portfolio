import { LogoMarquee } from "@/components/motion/LogoMarquee";
import { projects } from "@/content/site";

/** Text wordmarks of shipped projects (no logo files supplied yet). */
export function ClientMarquee() {
  const names = projects.map((p) => p.name);
  return (
    <section aria-labelledby="clients-title" className="border-b border-rule-strong">
      <div className="container-page grid-12 items-center gap-y-4 py-6 md:py-8">
        <h2 id="clients-title" className="label col-span-4 font-normal text-fg-subtle md:col-span-2">
          Shipped for
        </h2>
        <LogoMarquee
          label="Projects shipped"
          speed={45}
          className="col-span-4 md:col-span-10"
          items={names.map((n) => (
            <span key={n} className="flex items-center gap-8 pr-8 text-h3 font-extrabold whitespace-nowrap">
              {n}
              <span aria-hidden="true" className="size-2 bg-fg" />
            </span>
          ))}
        />
      </div>
    </section>
  );
}
