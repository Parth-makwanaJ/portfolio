import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/site/JsonLd";
import { site } from "@/content/site";

export type Crumb = { name: string; href: string };

/** Visible breadcrumbs plus matching BreadcrumbList JSON-LD. "Home" is added automatically. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <Breadcrumb className="container-page pt-6 md:pt-8">
        <BreadcrumbList className="label gap-2 text-fg-subtle sm:gap-2">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <Fragment key={c.href}>
                <BreadcrumbItem>
                  {last ? (
                    <BreadcrumbPage className="text-fg">{c.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild className="hover:text-fg">
                      <Link href={c.href}>{c.name}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!last && <BreadcrumbSeparator className="[&>svg]:size-3" />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: `${site.url}${c.href === "/" ? "" : c.href}`,
          })),
        }}
      />
    </>
  );
}
