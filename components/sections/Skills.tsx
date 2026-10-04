import { SectionHeading } from "@/components/SectionHeading";
import { TechIcon } from "@/components/TechIcon";
import { techStack } from "@/content/site";

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative max-w-7xl mx-auto px-6">
      <SectionHeading title="Tech stack" subtitle="The tools I use to build and ship." />

      <div className="space-y-16">
        {techStack.map(({ group, items }) => (
          <div key={group}>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-4">
              {group}
              <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <li key={item.name} className="glass p-6 rounded-2xl flex flex-col items-center justify-center gap-4">
                  <TechIcon name={item.icon} className="w-6 h-6" />
                  <span className="font-medium text-sm">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
