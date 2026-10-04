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

# Redesign v2 (dark, particle scene), 4 Oct 2026

Local production builds on the same machine on AC power, Lighthouse 12 mobile (default throttling), home page.
"Before" is commit 83ad48c (Swiss/bento home), rebuilt in a separate worktree and run in the same session.

| | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Before (3 runs) | 99, 99, 97 | 100 | 100 | 100 | 2.0–2.5 s | 50–60 ms | 0 |
| After (4 runs) | 96, 94, 92, 88 | 100 | 100 | 100 | 2.3 s (one run 3.3 s) | 160–240 ms | 0 |

The extra blocking time is the scene and motion runtime (three.js, GSAP, Lenis) evaluating after the load event.
Setup is split into short tasks and shaders compile asynchronously; before that change, TBT was about 1.8 s.
Runs made earlier the same day on battery saver (Chrome capped at 30 fps, CPU throttled) scored 80–89 for the old home page and are not comparable.
