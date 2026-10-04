/**
 * Single source of truth for every page on parthdev.co.in.
 *
 * Rules:
 * - Never invent facts. Anything unknown is `null` (or `confirmed: false`) with a `TODO:` comment.
 * - The UI hides any block whose content is `null`, empty, or not confirmed.
 * - Search this file for "TODO" to see everything still to fill.
 */

export type ServiceSlug =
  | "shopify-development"
  | "backend-api-development"
  | "speed-core-web-vitals"
  | "seo-audits";

export type ProjectCategory = "Shopify" | "Backend & APIs" | "Web apps";

export type Image = {
  /** Full resizer URL with a "{size}" placeholder and "?ar=height/width", filled in by lib/image-loader.ts. */
  src: string;
  width: number;
  height: number;
  /** Describe what is in the picture. Use "" only for decorative images. */
  alt: string;
};

export type Project = {
  slug: string;
  name: string;
  category: ProjectCategory;
  /** Services this project is proof for. The first one is the primary service. */
  services: ServiceSlug[];
  /** Freelance, or built while employed somewhere. */
  engagement: string | null;
  /** One line for cards. */
  summary: string;
  need: string;
  built: string[];
  /** A real, measurable outcome. Hidden while null. */
  result: string | null;
  stack: string[];
  live: string | null;
  image: Image;
  /** Optional screen recording for the case study. mp4 and/or webm URL, poster reserves the space. */
  video?: { mp4?: string; webm?: string; poster: Image; label: string };
  featured: boolean;
};

export type Service = {
  slug: ServiceSlug;
  name: string;
  short: string;
  summary: string;
  included: string[];
  forWho: string[];
  stack: string[];
};

export type Faq = {
  question: string;
  answer: string;
  /** Draft answers stay hidden until you confirm them. */
  confirmed: boolean;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  projectSlug?: string;
};

export type Role = {
  company: string;
  title: string;
  start: string;
  end: string | null;
  points: string[];
  stack: string[];
};

export type Award = { name: string; issuer: string; year: string | null; note: string };

export type Stat = { value: number; suffix: string; label: string; confirmed: boolean };

export type TechGroup = { group: string; items: { name: string; icon: string }[] };

/**
 * Remote images. Every image is resized by the host below (imgproxy URL format):
 *   {resizer}/rs:fill:{width}:{height}/q:{quality}/plain/{origin}/{path}@{format}
 * Change the host here and nowhere else. Compressed local copies are kept in
 * public/images as a backup (named by project slug) but are not used.
 */
export const imageCdn = {
  resizer: "https://resize.sandesh.com",
  origin: "epapercdn.sandesh.com/images",
  format: "webp",
} as const;

/** Builds an Image whose src carries its aspect ratio for the loader. Pass the source's own size so nothing is cropped. */
function cdnImage(path: string, ratioW: number, ratioH: number, alt: string): Image {
  const width = 1600;
  const height = Math.round((width * ratioH) / ratioW);
  const format = imageCdn.format ? `@${imageCdn.format}` : "";
  const ar = (ratioH / ratioW).toFixed(4);
  return { src: `${imageCdn.resizer}/{size}/plain/${imageCdn.origin}/${path}${format}?ar=${ar}`, width, height, alt };
}

/** Absolute URL of an image at a given width, for JSON-LD and Open Graph (same format as the loader). */
export function imageUrl(image: Image, width = 1200): string {
  const [url, query = ""] = image.src.split("?");
  const ratio = Number(new URLSearchParams(query).get("ar")) || image.height / image.width;
  return url.replace("{size}", `rs:fill:${width}:${Math.round(width * ratio)}/q:75`);
}

export const site = {
  url: "https://parthdev.co.in",
  name: "Parth Makwana",
  locale: "en_IN",
};

export const profile = {
  name: "Parth Makwana",
  firstName: "Parth",
  jobTitle: "Developer and tech lead",
  location: { city: "Ahmedabad", region: "Gujarat", country: "India", countryCode: "IN" },
  headline: "Fast Shopify stores and solid backends for growing businesses.",
  intro:
    "I'm Parth, a developer and tech lead in Ahmedabad, India. I build Shopify stores, Laravel and Node.js backends, and I make slow sites fast.",
  availability: "Taking on new freelance projects",
  // TODO: where do you take clients from? e.g. ["India", "United Kingdom", "United States"] or "Worldwide".
  // Used for areaServed in structured data; left out while null.
  areaServed: null as string | string[] | null,
  // Original is 3968 x 4288; keep that ratio.
  photo: cdnImage("2024/09/09/Myself.png", 3968, 4288, "Parth Makwana standing in a studio, wearing glasses, a grey t-shirt and black joggers"),
  resume: "/parth-makwana-resume.pdf",
  // TODO: write your story for /about in your own words (3 to 5 short paragraphs).
  // How you started, what you work on now, how you like to work with clients.
  story: [] as string[],
  // TODO: add your education (degree, institution, years).
  education: null as { degree: string; institution: string; years: string } | null,
};

export const contact = {
  email: "parthmakwan02@gmail.com",
  // WhatsApp and booking links come from env vars:
  // NEXT_PUBLIC_WHATSAPP_URL and NEXT_PUBLIC_BOOKING_URL
  projectTypes: [
    "Shopify store",
    "Backend or API",
    "Speed / Core Web Vitals",
    "SEO audit",
    "Something else",
  ],
  // TODO: set the budget ranges you want to show on the contact form (currency and bands).
  budgets: [] as string[],
};

export const socials = [
  { name: "GitHub", href: "https://github.com/Parth-makwanaJ", handle: "Parth-makwanaJ" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/parth-makwana-408571278/", handle: "parth-makwana" },
  { name: "X", href: "https://x.com/parthx09", handle: "@parthx09" },
] as const;

export const stats: Stat[] = [
  // TODO: confirm all three numbers. They are copied from the current site.
  { value: 3, suffix: "+", label: "Years building for the web", confirmed: false },
  { value: 40, suffix: "+", label: "Projects shipped", confirmed: false },
  { value: 25, suffix: "+", label: "Clients", confirmed: false },
];

export const services: Service[] = [
  {
    slug: "shopify-development",
    name: "Shopify development",
    short: "Stores built from scratch or improved, with payments and shipping wired in.",
    summary:
      "I build Shopify stores from scratch and keep existing ones improving. Custom sections, payment gateways and shipping automation, set up so you can run the store yourself.",
    included: [
      "New store build or rebuild on a custom theme",
      "Custom sections and features your theme does not have",
      "Payment gateway setup",
      "Shipping automation, for example with Shiprocket",
      "Ongoing maintenance and improvements",
    ],
    forWho: [
      "Brands launching their first proper online store",
      "Stores that have outgrown their theme",
      "Teams that need a developer on call for their store",
    ],
    stack: ["Shopify", "Liquid", "JavaScript"],
  },
  {
    slug: "backend-api-development",
    name: "Backend and API development",
    short: "Laravel and Node.js backends, APIs for web and mobile apps, admin dashboards.",
    summary:
      "I design and build the server side: APIs for web and mobile apps, admin dashboards, payment services and the database behind them. Laravel or Node.js, depending on what fits.",
    included: [
      "REST APIs for web and mobile apps",
      "Admin dashboards and internal tools",
      "Payment services",
      "Push notifications with Firebase",
      "Caching with Redis and database tuning",
    ],
    forWho: [
      "Startups building a web or mobile product",
      "Businesses replacing spreadsheets with a real system",
      "Teams whose current backend is slow or hard to change",
    ],
    stack: ["Laravel", "Node.js", "PHP", "MySQL", "SQL Server", "Redis", "Firebase"],
  },
  {
    slug: "speed-core-web-vitals",
    name: "Speed and Core Web Vitals",
    short: "Find what makes a site slow and fix it, from images to database queries.",
    summary:
      "I find what makes your site slow and fix it. Images, caching, scripts and database queries, measured before and after so you can see the difference.",
    included: [
      "Audit of loading speed and Core Web Vitals (LCP, INP, CLS)",
      "Image optimisation and modern formats like WebP",
      "Server-side caching with Redis",
      "Database query tuning",
      "Before and after report",
    ],
    forWho: [
      "Stores losing sales to slow pages",
      "Content sites failing Core Web Vitals",
      "Apps whose APIs slow down under load",
    ],
    stack: ["Lighthouse", "Redis", "MySQL", "Next.js", "Shopify"],
  },
  {
    slug: "seo-audits",
    name: "SEO audits",
    short: "A technical SEO check of your site with a fix list in priority order.",
    summary:
      "A technical check of how search engines see your site, with a fix list in priority order. I can make the fixes too.",
    included: [
      "Crawling and indexing: robots.txt, sitemap, redirects, canonical tags",
      "Titles, descriptions and heading structure",
      "Structured data (JSON-LD)",
      "Core Web Vitals and mobile checks",
      "Prioritised fix list, and the fixes if you want them",
    ],
    forWho: [
      "New sites before or right after launch",
      "Sites that lost traffic after a redesign or migration",
      "Stores with many products and thin pages",
    ],
    stack: ["Lighthouse", "Search Console", "Schema.org"],
  },
];

export const projects: Project[] = [
  {
    slug: "sandesh",
    name: "Sandesh",
    category: "Backend & APIs",
    services: ["backend-api-development", "speed-core-web-vitals"],
    // TODO: confirm. Sandesh is your current employer, so this is not freelance work.
    engagement: "At Sandesh Digital",
    summary: "News CMS and APIs for a large Gujarati news site with a high-volume database.",
    need: "A large news publisher needed a CMS and APIs that could handle a high volume of articles and readers.",
    built: [
      "Led development of the news CMS and the API layer",
      "Built core CMS modules",
      "Optimised the Node.js APIs against a high-volume database",
    ],
    // TODO: add a real result (for example response time, traffic handled, publishing time saved).
    result: null,
    stack: ["Laravel", "Node.js", "MySQL"],
    live: "https://sandesh.com/",
    image: cdnImage("2024/09/09/Sandesh.png", 1891, 948, "Sandesh news homepage with Gujarati headlines, a live blog and trending videos"),
    featured: true,
  },
  {
    slug: "matrubharti",
    name: "Matrubharti",
    category: "Backend & APIs",
    services: ["backend-api-development"],
    // TODO: freelance, or at NicheTech / Sandesh Digital?
    engagement: null,
    summary: "Backend APIs and payment services for a story and book publishing app.",
    need: "A platform where people publish and read stories and books needed a backend for its Flutter app, including payments.",
    built: [
      "Led the backend APIs behind the Flutter app",
      "Built payment microservices",
      "Managed the admin dashboard",
      "Added Redis caching",
    ],
    // TODO: add a real result.
    result: null,
    stack: ["Node.js", "Laravel", "PHP", "Redis"],
    live: "https://matrubharti.com/",
    image: cdnImage("2024/09/09/Matrubharti.png", 1885, 945, "Matrubharti homepage inviting readers to publish and read stories, novels and books"),
    featured: true,
  },
  {
    slug: "crystal-world",
    name: "Crystal World",
    category: "Shopify",
    services: ["shopify-development"],
    // TODO: freelance, or at NicheTech?
    engagement: null,
    summary: "Shopify store built from scratch, with payments and Shiprocket delivery automation.",
    need: "A crystal shop needed an online store that could take payments and ship orders without manual work.",
    built: [
      "Built the Shopify store from scratch",
      "Set up the payment gateways",
      "Automated delivery handling through Shiprocket",
    ],
    // TODO: add a real result.
    result: null,
    stack: ["Shopify", "Shiprocket"],
    live: "https://crystalworlld.com/",
    image: cdnImage("2024/09/09/crystalworlld.png", 1895, 886, "Crystal World Shopify store showing the founder's story next to the shop menu"),
    featured: true,
  },
  {
    slug: "champions-cricket-club",
    name: "Champions Cricket Club",
    category: "Web apps",
    services: ["backend-api-development"],
    // TODO: freelance, or at NicheTech?
    engagement: null,
    summary: "Laravel club management system for players, subscriptions, events and venues.",
    need: "A cricket club needed one system to manage players, subscriptions, events, teams and venues.",
    built: [
      "Built the club management system in Laravel",
      "Player registration and subscriptions",
      "Events, teams and venue management",
    ],
    // TODO: add a real result.
    result: null,
    stack: ["Laravel", "MySQL"],
    live: "https://championscricket.club/",
    image: cdnImage("2024/09/09/3c.png", 1903, 908, "Champions Cricket Club homepage with a batsman mid-shot and a register button"),
    featured: true,
  },
  {
    slug: "field-tracking-system",
    name: "Field Tracking System",
    category: "Web apps",
    services: ["backend-api-development"],
    // TODO: freelance, or at NicheTech?
    engagement: null,
    summary: "Complaint tracking backend with notifications, serving two companies with separate workflows.",
    need: "Two companies in one group needed to track field complaints, each with its own workflow, in a single system.",
    built: [
      "Built the backend for the complaint tracking platform",
      "Designed the logic that keeps each company's workflow separate",
      "Integrated notifications with Firebase",
    ],
    // TODO: add a real result.
    result: null,
    stack: ["CodeIgniter", "SQL Server", "Firebase"],
    live: "https://www.prasadgroup.com/",
    image: cdnImage("2024/09/09/FTS.png", 1919, 896, "Admin sign-in screen of the Field Tracking System"),
    featured: false,
  },
  {
    slug: "pragati-finance",
    name: "Pragati Finance",
    category: "Backend & APIs",
    services: ["backend-api-development"],
    // TODO: freelance, or at NicheTech?
    engagement: null,
    summary: "Node.js APIs for interest calculation, brokerage and transaction tracking.",
    need: "A finance business needed software to calculate interest and brokerage and to track every transaction.",
    built: [
      "Led backend API development for the financial modules",
      "Interest and brokerage calculation",
      "Transaction tracking",
    ],
    // TODO: add a real result.
    result: null,
    stack: ["Node.js"],
    live: null,
    image: cdnImage("2024/09/09/Pragati.png", 1914, 908, "Pragati Finance dashboard with transaction totals and a daily transactions table"),
    featured: false,
  },
  {
    slug: "duali",
    name: "Duali",
    category: "Shopify",
    services: ["shopify-development"],
    // TODO: freelance, or at NicheTech?
    engagement: null,
    summary: "Ongoing custom features and speed work for a ceramics and home decor Shopify store.",
    need: "A ceramics and home decor brand needed a developer to keep adding features to its Shopify store and keep it fast.",
    built: [
      "Designed and built custom store features",
      "Maintained the store over time",
      "Kept optimising performance and the shopping experience",
      // TODO: name 1 or 2 specific features you built for Duali.
    ],
    // TODO: add a real result.
    result: null,
    stack: ["Shopify"],
    live: "https://duali.co/",
    image: cdnImage("2024/09/09/Duali.png", 1908, 911, "Duali Shopify store homepage with floral ceramic vases"),
    featured: false,
  },
  {
    slug: "luxaderme",
    name: "LuxaDerme",
    category: "Shopify",
    services: ["shopify-development"],
    // TODO: freelance, or at NicheTech?
    engagement: null,
    summary: "Fast, responsive Shopify store for a Korean skincare brand.",
    need: "A Korean skincare brand needed a fast store that works well on phones.",
    built: [
      "Built a fast, fully responsive Shopify store",
      // TODO: name 1 or 2 specific things you built for LuxaDerme.
    ],
    // TODO: add a real result.
    result: null,
    stack: ["Shopify"],
    live: "https://luxaderme.in/",
    image: cdnImage("2024/09/09/luxaderme.png", 1904, 910, "LuxaDerme Shopify store homepage showing Korean skincare products"),
    featured: false,
  },
  {
    slug: "white-maison-de-couture",
    name: "White Maison De Couture",
    category: "Shopify",
    services: ["shopify-development"],
    // TODO: freelance, or at NicheTech?
    engagement: null,
    summary: "Shopify store for a designer couture label, built for speed.",
    need: "A designer couture label needed a store that could grow with its collections and stay fast.",
    built: [
      "Built a scalable Shopify store with a focus on speed",
      // TODO: name 1 or 2 specific things you built for White Maison De Couture.
    ],
    // TODO: add a real result.
    result: null,
    stack: ["Shopify"],
    live: "https://whitemaisondecouture.com/",
    image: cdnImage("2024/09/09/WMDC.png", 1904, 910, "White Maison De Couture Shopify store featuring a designer collection"),
    featured: false,
  },
  {
    slug: "amin-new-york",
    name: "Amin New York",
    category: "Shopify",
    services: ["shopify-development"],
    // TODO: freelance, or at NicheTech?
    engagement: null,
    summary: "Responsive Shopify store for a custom-made menswear brand.",
    need: "A custom-made menswear brand needed a store that loads fast and is easy to browse.",
    built: [
      "Built and optimised a responsive Shopify store",
      // TODO: name 1 or 2 specific things you built for Amin New York.
    ],
    // TODO: add a real result.
    result: null,
    stack: ["Shopify"],
    live: "https://aminnewyork.com/",
    image: cdnImage("2024/09/09/aminnewyork.png", 1904, 913, "Amin New York Shopify store showing custom-made menswear"),
    featured: false,
  },
];

export const experience: Role[] = [
  {
    company: "Sandesh Digital",
    // TODO: confirm your title. The brief says "tech lead"; the current site says "Backend Developer".
    title: "Backend Developer",
    start: "2025",
    end: null,
    points: [
      "Lead a full development team while working as a backend developer",
      "Improved system performance with Redis caching, WebP image conversion and database tuning",
    ],
    stack: ["Node.js", "Laravel", "Shopify", "AWS", "Figma"],
  },
  {
    company: "NicheTech Computer Solutions",
    title: "Backend Developer",
    start: "2023",
    end: "2025",
    // TODO: confirm. Inferred from the tech list on the current site.
    points: ["Built Laravel, Node.js and Shopify projects for clients"],
    stack: ["Laravel", "Node.js", "Shopify", "Framer"],
  },
];

export const awards: Award[] = [
  {
    name: "Rising Star Award",
    issuer: "NicheTech Computer Solutions",
    // TODO: add the year.
    year: null,
    note: "For strong performance and fast growth.",
  },
  {
    name: "Tech Expert of the Year",
    issuer: "NicheTech Computer Solutions",
    year: "2025",
    note: "For technical skill and impact.",
  },
];

// TODO: confirm these step descriptions match how you work.
export const process = [
  { step: "Discover", text: "A call to understand your business, what you need and what done looks like." },
  { step: "Design", text: "A written plan: scope, stack, timeline and cost, agreed before any code." },
  { step: "Build", text: "Work in small pieces you can see and test as it comes together." },
  { step: "Launch", text: "Go live with checks for speed, SEO basics and errors." },
  { step: "Support", text: "Fixes and improvements after launch, so the site keeps working." },
];

export const faqs: Faq[] = [
  // TODO: every answer below is a DRAFT. Edit it to match how you actually work, then set confirmed: true.
  // Only confirmed answers are shown, and they are also used for FAQPage structured data.
  {
    question: "How much does a project cost?",
    answer: "It depends on scope. After a short call I send a fixed quote for the agreed scope.",
    confirmed: false,
  },
  {
    question: "How long does a project take?",
    answer: "A Shopify store or a speed fix usually takes weeks, not months. You get a timeline with the quote.",
    confirmed: false,
  },
  {
    question: "How do payments work?",
    answer: "Part upfront to start, the rest in milestones as work is delivered.",
    confirmed: false,
  },
  {
    question: "Do you support the site after launch?",
    answer: "Yes. Every project includes a support period after launch, and ongoing support is available monthly.",
    confirmed: false,
  },
  {
    question: "Do you work with clients outside India?",
    answer: "Yes. I work remotely and can overlap with UK, EU and US hours for calls.",
    confirmed: false,
  },
  {
    question: "Who owns the code?",
    answer: "You do. Once the project is paid for, the code, accounts and access are yours.",
    confirmed: false,
  },
  {
    question: "Can you work on an existing site someone else built?",
    answer: "Yes. I start with a review of the current code and tell you what I would keep and what I would change.",
    confirmed: false,
  },
];

// TODO: add real testimonials. The section stays hidden while this list is empty.
export const testimonials: Testimonial[] = [];

export const techStack: TechGroup[] = [
  {
    group: "Languages",
    items: [
      { name: "PHP", icon: "php" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Python", icon: "python" },
    ],
  },
  {
    group: "Frameworks",
    items: [
      { name: "Laravel", icon: "laravel" },
      { name: "Node.js", icon: "nodejs" },
      { name: "CodeIgniter", icon: "codeigniter" },
      { name: "Next.js", icon: "nextjs" },
    ],
  },
  {
    group: "Databases",
    items: [
      { name: "MySQL", icon: "mysql" },
      { name: "SQL Server", icon: "database" },
      { name: "Supabase", icon: "supabase" },
      { name: "Redis", icon: "redis" },
    ],
  },
  {
    group: "Platforms and cloud",
    items: [
      { name: "Shopify", icon: "shopify" },
      { name: "AWS", icon: "aws" },
      { name: "Firebase", icon: "firebase" },
      { name: "DigitalOcean", icon: "digitalocean" },
      { name: "Vercel", icon: "vercel" },
      { name: "Framer", icon: "framer" },
    ],
  },
  {
    group: "Monitoring",
    items: [{ name: "Grafana", icon: "grafana" }],
  },
  {
    group: "AI",
    items: [
      { name: "Hugging Face", icon: "huggingface" },
      { name: "OpenAI APIs", icon: "openai" },
      { name: "scikit-learn", icon: "scikitlearn" },
    ],
  },
];

/* ---------- helpers ---------- */

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const featuredProjects = () => projects.filter((p) => p.featured);
export const projectsForService = (slug: ServiceSlug) => projects.filter((p) => p.services.includes(slug));
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
export const visibleFaqs = () => faqs.filter((f) => f.confirmed);
