import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeader } from "@/components/SectionHeader";
import { WorkGrid } from "@/components/work/WorkGrid";
import { FinalCta } from "@/components/home/FinalCta";
import { projects, type ProjectCategory } from "@/content/site";

export const metadata: Metadata = {
  title: "Work | Parth Makwana",
  description: "Shopify stores, Laravel and Node.js backends and web apps built by Parth Makwana. Filter by category.",
};

const categories: ProjectCategory[] = ["Shopify", "Backend & APIs", "Web apps"];

export default function WorkPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Work", href: "/work" }]} />
      <section aria-labelledby="work-title" className="pt-10 pb-(--section-space) md:pt-16">
        <SectionHeader
          as="h1"
          number="—"
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
