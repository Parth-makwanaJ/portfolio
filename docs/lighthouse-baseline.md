# Lighthouse baseline (before redesign)

Measured 4 Oct 2026 on a local production build (`next build && next start`) of the working tree at commit 99ceb9e plus uncommitted changes.
Lighthouse mobile (default throttling), Chrome headless, 3 runs. Median run shown.

| Category | Score |
|---|---|
| Performance | 51 (runs: 50, 53, 51) |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 100 |

| Metric | Value | Target |
|---|---|---|
| First Contentful Paint | 2.8 s | |
| Largest Contentful Paint | 5.5 s | < 2.0 s |
| Total Blocking Time | 750–980 ms | |
| Cumulative Layout Shift | 0 | < 0.05 |
| Speed Index | 5.4 s | |
| Total transfer | 771 KiB | |
| JavaScript transfer | 450 KiB across 8 files | < 150 KB gzipped initial |
| JS boot-up time | 3.8 s | |
| Main-thread work | 6.0 s | |

Notes:
- LCP element is the hero `<h1>`. It starts at `opacity: 0` via Framer Motion, so it cannot paint until JS hydrates.
- Three.js loads eagerly as part of the hero, which drives most of the blocking time.
- Accessibility failure: `link-name` (social icon links have no accessible name).
- SEO 100 is Lighthouse's basic check only. robots.txt, sitemap, canonical, OG and JSON-LD are all missing on the live site.
