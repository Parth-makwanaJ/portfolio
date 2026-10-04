import { SectionHeader } from "@/components/SectionHeader";
import { TechIcon } from "@/components/TechIcon";
import { techStack } from "@/content/site";

export function TechStack({ number }: { number: string }) {
  return (
    <section aria-labelledby="stack-title" className="section-space">
      <SectionHeader number={number} label="Stack" id="stack-title" title="Tools I work with" />
      <div className="container-page mt-12 md:mt-16">
        {techStack.map(({ group, items }) => (
          <div key={group} className="grid-12 gap-y-3 border-t border-rule py-5">
            <h3 className="label col-span-4 pt-3 font-normal text-fg-subtle md:col-span-3">{group}</h3>
            <ul className="col-span-4 flex flex-wrap gap-2 md:col-span-9">
              {items.map((item) => (
                <li key={item.name} className="flex h-11 items-center gap-2.5 border border-rule-strong px-3 text-small font-medium">
                  <TechIcon name={item.icon} className="size-4" />
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
