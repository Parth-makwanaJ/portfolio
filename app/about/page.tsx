import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { Download } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeader } from "@/components/SectionHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/site/JsonLd";
import { awards, experience, profile, stats } from "@/content/site";
import { personSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "About Parth Makwana, developer in Ahmedabad",
  absoluteTitle: true,
  description:
    "Parth Makwana is a developer and tech lead in Ahmedabad, India. Experience, awards and resume for Shopify, Laravel and Node.js work.",
  path: "/about",
  type: "profile",
});

export default function AboutPage() {
  // The story is a TODO in content/site.ts; until it is written, the intro stands in.
  const story = profile.story.length > 0 ? profile.story : [profile.intro];

  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <>
      <Breadcrumbs items={[{ name: "About", href: "/about" }]} />

      <header className="container-page grid-12 gap-y-10 pt-10 md:pt-16">
        <div className="col-span-4 md:col-span-7">
          <p className="label text-fg-subtle">About</p>
          <h1 className="mt-4 text-h1">{profile.name}</h1>
          <p className="label mt-4 text-fg-muted">
            {profile.jobTitle} · {profile.location.city}, {profile.location.country}
          </p>
          <div className="mt-8 max-w-[52ch] space-y-5 text-lead">
            {story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <a
            href={profile.resume}
            download
            className="mt-10 inline-flex h-12 items-center gap-3 border border-rule-strong px-5 font-medium transition-colors duration-(--dur-fast) ease-brand hover:bg-fg hover:text-bg"
          >
            <Download className="size-4" aria-hidden="true" />
            Download resume (PDF)
          </a>
        </div>
        <div className="col-span-4 md:col-span-4 md:col-start-9">
          <div className="border border-rule-strong bg-surface">
            <Image
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={profile.photo.width}
              height={profile.photo.height}
              sizes="(min-width: 768px) 30vw, 100vw"
              preload
              className="h-auto w-full"
            />
          </div>
        </div>
      </header>

      <dl className="container-page mt-16 grid grid-cols-1 border-y border-rule-strong sm:grid-cols-3 md:mt-24">
        {stats.map((s, i) => (
          <div key={s.label} className={`flex flex-col-reverse gap-1 py-6 ${i > 0 ? "border-t border-rule sm:border-t-0 sm:border-l sm:pl-(--grid-gap)" : ""}`}>
            <dt className="label text-fg-subtle">{s.label}</dt>
            <dd className="text-h2">
              {s.value}
              {s.suffix}
            </dd>
          </div>
        ))}
      </dl>

      <div className="section-space space-y-16 md:space-y-24">
        <section aria-labelledby="experience-title">
          <SectionHeader number={num()} label="Experience" id="experience-title" title="Where I have worked" />
          <ol className="container-page mt-10">
            {experience.map((r) => (
              <li key={r.company} className="grid-12 gap-y-3 border-t border-rule py-8">
                <p className="label col-span-4 text-fg-subtle md:col-span-3">
                  {r.start} – {r.end ?? "Present"}
                </p>
                <div className="col-span-4 md:col-span-4">
                  <h3 className="text-h3">{r.company}</h3>
                  <p className="mt-1 text-fg-muted">{r.title}</p>
                </div>
                <div className="col-span-4 md:col-span-5">
                  <ul className="space-y-2">
                    {r.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 bg-fg" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="label mt-4 text-fg-subtle">{r.stack.join(" · ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="awards-title">
          <SectionHeader number={num()} label="Awards" id="awards-title" title="Awards" />
          <ul className="container-page mt-10 grid grid-cols-1 border-t border-l border-rule-strong md:grid-cols-2">
            {awards.map((a) => (
              <li key={a.name} className="border-r border-b border-rule-strong p-5 md:p-6">
                <p className="label text-fg-subtle">
                  {a.issuer}
                  {a.year ? ` · ${a.year}` : ""}
                </p>
                <h3 className="mt-3 text-h3">{a.name}</h3>
                <p className="mt-2 text-fg-muted">{a.note}</p>
              </li>
            ))}
          </ul>
        </section>

        {profile.education && (
          <section aria-labelledby="education-title">
            <SectionHeader number={num()} label="Education" id="education-title" title="Education" />
            <div className="container-page grid-12 mt-10">
              <div className="col-span-4 border-t border-rule py-6 md:col-span-9 md:col-start-4">
                <h3 className="text-h3">{profile.education.degree}</h3>
                <p className="mt-1 text-fg-muted">
                  {profile.education.institution}, {profile.education.years}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      <FinalCta />
      <JsonLd data={personSchema()} />
    </>
  );
}
