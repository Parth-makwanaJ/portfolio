import { contact, imageUrl, profile, services, site, socials } from "@/content/site";

/** JSON-LD builders. Everything comes from content/site.ts; nothing here is invented. */

const address = {
  "@type": "PostalAddress",
  addressLocality: profile.location.city,
  addressRegion: profile.location.region,
  addressCountry: profile.location.countryCode,
};

export const personId = `${site.url}/#person`;
export const businessId = `${site.url}/#business`;

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    jobTitle: profile.jobTitle,
    url: site.url,
    image: imageUrl(profile.photo, 800),
    email: `mailto:${contact.email}`,
    address,
    sameAs: socials.map((s) => s.href),
    knowsAbout: services.map((s) => s.name),
  };
}

export function professionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": businessId,
    name: `${profile.name}, freelance development`,
    url: site.url,
    image: imageUrl(profile.photo, 800),
    email: contact.email,
    address,
    founder: { "@id": personId },
    ...(profile.areaServed ? { areaServed: profile.areaServed } : {}),
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.short,
        url: `${site.url}/services/${s.slug}`,
      },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "en",
    publisher: { "@id": personId },
  };
}
