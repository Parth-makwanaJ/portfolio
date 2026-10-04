import { SectionHeader } from "@/components/SectionHeader";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { process } from "@/content/site";

export function Process({ number }: { number: string }) {
  return (
    <section aria-labelledby="process-title" className="section-space pt-0">
      <SectionHeader
        number={number}
        label="Process"
        id="process-title"
        title="How a project runs"
        intro="Five steps. You always know what is happening and what comes next."
      />
      <ProcessSteps steps={process} />
    </section>
  );
}
