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

  return (
    <>
      <Breadcrumbs items={[{ name: "About", href: "/about" }]} />

      <header className="container-page grid-12 gap-y-12 pt-12 md:pt-20">
        <div className="col-span-4 md:col-span-7">
          <p className="label text-fg-muted">About</p>
          <h1 className="mt-5 text-h1">{profile.name}</h1>
          <p className="mt-5 text-fg-muted">
            {profile.jobTitle} · {profile.location.city}, {profile.location.country}
          </p>
          <div className="mt-10 max-w-[52ch] space-y-5 text-lead">
            {story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <a href={profile.resume} download className="btn btn-ghost mt-10 h-14 px-7 text-base">
            <Download className="size-4" aria-hidden="true" />
            Download resume (PDF)
          </a>
        </div>
        <div className="col-span-4 md:col-span-4 md:col-start-9">
          <div className="bg-surface">
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

      <dl className="container-page mt-20 grid grid-cols-3 gap-6 border-t border-rule pt-10 md:mt-28">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse gap-2">
            <dt className="text-small text-fg-muted">{s.label}</dt>
            <dd className="font-display text-h2 leading-none">
              {s.value}
              {s.suffix}
            </dd>
          </div>
        ))}
      </dl>

      <div className="space-y-(--section-space) py-(--section-space)">
        <section aria-labelledby="experience-title">
          <SectionHeader label="Experience" id="experience-title" title="Where I have worked" />
          <ol className="container-page mt-12">
            {experience.map((r) => (
              <li key={r.company} className="grid-12 gap-y-4 border-t border-rule py-10 last:border-b">
                <p className="col-span-4 text-small tabular-nums text-fg-muted md:col-span-3">
                  {r.start} – {r.end ?? "Present"}
                </p>
                <div className="col-span-4 md:col-span-4">
                  <h3 className="text-h3">{r.company}</h3>
                  <p className="mt-2 text-fg-muted">{r.title}</p>
                </div>
                <div className="col-span-4 md:col-span-5">
                  <ul className="space-y-2">
                    {r.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-fg-muted" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-small text-fg-muted">{r.stack.join(", ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="awards-title">
          <SectionHeader label="Awards" id="awards-title" title="Awards" />
          <ul className="container-page mt-12 grid grid-cols-1 gap-x-(--grid-gap) md:grid-cols-2">
            {awards.map((a) => (
              <li key={a.name} className="border-t border-rule py-8">
                <p className="text-small text-fg-muted">
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
            <SectionHeader label="Education" id="education-title" title="Education" />
            <div className="container-page mt-12">
              <div className="border-t border-rule py-8">
                <h3 className="text-h3">{profile.education.degree}</h3>
                <p className="mt-2 text-fg-muted">
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
