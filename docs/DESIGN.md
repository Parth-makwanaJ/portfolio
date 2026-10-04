# Design decisions

Swiss design (International Typographic Style) with bento grids. Decided October 2026. Change a decision here before changing it in code.

## Product

- **Audience:** business owners and startup founders deciding whether to hire Parth. Not recruiters.
- **Mode:** persuade. One action: start a project.
- **Voice:** plain, specific, short sentences. No buzzwords. No invented facts (see `content/site.ts`).

## Tokens (all in `app/globals.css`)

| Decision | Value | Why |
|---|---|---|
| Default theme | Light; dark is the inverse | Swiss print tradition; the toggle remembers the choice |
| Accent | `#E30613` light / `#FF3B30` dark | One strong red, only for the primary button, links, focus rings and one highlight per section |
| Text | `#111` on `#FFF`; muted `#555`; subtle `#6B6B6B` | All pass WCAG AA (5.3:1 or better) |
| Type | Inter Tight 400 / 500 / 800; IBM Plex Mono for labels and numbers | One grotesque family; mono only for metadata |
| Headlines | Up to 148px, line height 0.88, tracking -4.5% | Heavy and tight; height-capped (svh) so the hero CTA stays above the fold on 1366x768 |
| Grid | 12 columns (4 on phones), visible behind every page | Structure is part of the look |
| Corners | 0 | Square everywhere; circles only as shapes in the hero composition |
| Lines | 1px rules; strong rule `#111` between sections | No shadows, gradients, glass, blur or texture |
| Motion | 120 / 200 / 320ms, `cubic-bezier(.2,0,0,1)` | Transform and opacity only; reduced motion gets fades only |

## Components

- Project screenshots always sit in `ProjectFrame`: 2:1 box, 1px rule, flat mat, image at its own ratio (no crop).
- Bento grids (services, selected work) use 1px gaps on a dark background; other grids use per-cell borders so a half-empty row never shows a dark block.
- Section headers are numbered only when they render (`01, 02, 03...`, computed per page).
- Page titles (h1) are never animated. Section h2s use the word reveal (`RevealText`), which is visible without JavaScript.
- The hero composition is static HTML/CSS; the 3D scroll layer (`heroMotion.ts`) only loads on capable desktops.

## Performance rules

- Home initial JavaScript under 150 KB gzipped (currently ~139 KB). An empty Next 16 app is already ~126 KB with webpack, so new client code must be small or lazy.
- Client components never import `content/site.ts` (pass data as props) and never use `cn()` (use `cx()`), to keep content and tailwind-merge out of the browser bundle.
- Fonts use `display: optional`; CSS is inlined.
