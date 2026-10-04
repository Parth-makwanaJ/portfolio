import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeader } from "@/components/SectionHeader";
import { WorkGrid } from "@/components/work/WorkGrid";
import { FinalCta } from "@/components/home/FinalCta";
import { projects, type ProjectCategory } from "@/content/site";

export const metadata = pageMetadata({
  title: "Work: Shopify stores, backends and web apps",
  description: "Shopify stores, Laravel and Node.js backends and web apps by Parth Makwana, with what each client needed and what was built.",
  path: "/work",
});

const categories: ProjectCategory[] = ["Shopify", "Backend & APIs", "Web apps"];

export default function WorkPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Work", href: "/work" }]} />
      <section aria-labelledby="work-title" className="pt-12 pb-(--section-space) md:pt-20">
        <SectionHeader
          as="h1"
          label="Work"
          id="work-title"
          title="All projects"
          intro="Every project I can show. Open one for what the client needed, what I built and the stack."
        />
        <div className="container-page mt-12 md:mt-16">
          <WorkGrid projects={projects} categories={categories} />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
