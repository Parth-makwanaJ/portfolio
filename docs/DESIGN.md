# Design decisions

Dark, cinematic, engineered: a warm near-black page, a serif display face, and one lime accent. The home page has a real-time particle field behind it that changes form with each section. Decided October 2026 (redesign v2, replacing the Swiss and bento direction). Change a decision here before changing it in code.

## Product

- **Audience:** business owners and startup founders deciding whether to hire Parth. Not recruiters.
- **Mode:** persuade. One action: start a project.
- **Voice:** plain, specific, short sentences. No buzzwords. No invented facts (see `content/site.ts`).
- **Dials (taste-skill, high-end):** design variance 8, motion intensity 8, visual density 3.

## Tokens (all in `app/globals.css`)

| Decision | Value | Why |
|---|---|---|
| Theme | Dark only | The lime and the particle field don't hold up on a light page, so the toggle was removed |
| Background | `#0D0C0B`, surface `#161513` | Warm near-black, never pure black |
| Text | `#EDE7DD` (15.9:1); muted `#9C9488` (6.5:1) | Both pass WCAG AA on the background and the surface |
| Hairlines | text colour at 12% and 24% | Structure without heavy rules |
| Accent | Lime `#D4FF3A`, text on it `#0D0C0B` (16.9:1) | One job: the primary action, focus rings, progress (services rail, process line, active nav dot) and the particles |
| Type | Instrument Serif 400 for display and headings; Geist 400/500 for text | A serif with character over a clean grotesque. Labels: 12px uppercase, 0.14em tracking |
| Display size | Up to 140px, line height 0.94, height-capped with svh | Keeps the hero buttons above the fold on 1366x768 |
| Shape | Pill buttons; square media; no shadows, gradients, glass cards or glow | |
| Motion | Hover 100ms, UI 200ms, page 300ms, heading reveal 600ms with a 70ms stagger per line; ease-out `cubic-bezier(.22,1,.36,1)` | Transform and opacity only |

## The home scene (`components/scene`)

- One fixed, full-viewport WebGL canvas behind the home page only, written in plain three.js (no React renderer) and loaded as its own chunk after the load event. Inner pages never run live WebGL.
- One particle buffer, one draw call. Each particle carries random numbers and a shuffled slot; the vertex shader computes eight forms from them and blends the two either side of the scroll position, with a delay that sweeps across the screen so every morph ripples.
  - 0 hero: a loose cloud that gathers into a dense core (about a third stays behind as dust)
  - 1 Shopify: five stacked shelves with bright front edges, sliding past each other
  - 2 backend: the ordered lattice, one particle per grid slot (the only state at full count)
  - 3 speed: long streaks stretched in depth, flying past the camera
  - 4 SEO: rings expanding from a centre across a tilted plane
  - 5 work: the field thins out and recedes; glass slices in front of the project images lead
  - 6 process: one flowing path with five nodes that light as the page's process line reaches each step
  - 7 contact: a calm sphere, slowly turning, behind the very large type
- Depth: point size falls off with distance, alpha fades into the background, and particles very close to the camera fade out.
- Text: particles over any `[data-scene-text]` block are drawn at 16% so every line stays readable.
- Pointer (desktop): particles near the cursor move away and settle back.
- States are placed by marker elements (`[data-stop-mark]`). A state is fully on when its marker is centred in the viewport, and there is a short hold at each one.
- Budget: visible particles per state (full only for the lattice, lowest at work); pixel ratio capped at 2 (1.5 on phones); MSAA only below 1.5x; glass refraction only on desktop, at half resolution. The loop pauses when the tab is hidden or the scene's sections are off screen.
- Fallbacks: below 40 fps (median of five one-second samples after a 5 s warm-up) the loop stops and the scene redraws only when scrolling settles. Reduced motion gets that from the start. Without WebGL 2, a static image is shown.

## Motion system (`lib/motion/runtime.ts`)

- One scroll system: Lenis (desktop, `pointer: fine`) driven by GSAP's ticker and synced to ScrollTrigger. Touch devices keep native scrolling. It is loaded after first paint, when the browser is idle.
- Section h2s carry `data-reveal`: SplitText masks the lines and they rise as the heading enters, then the markup is restored. Headings already on screen are never hidden.
- Services: a CSS sticky stage over four screens of scroll; the scene input sets the step. Without JavaScript, or with reduced motion, the four services sit in normal flow.
- Custom cursor on desktop only: a dot plus a ring that grows into a lime "View" over projects (`data-cursor="view"`).
- Reduced motion: no Lenis, no cursor, no movement; headings fade in over 150ms.

## Components

- Project screenshots always sit in `ProjectFrame`: a 2:1 box on the surface colour, image at its own ratio (no crop).
- Page titles (h1) are never animated; they are often the LCP element.
- Section labels are plain words, not numbers.

## Performance rules

- Home JavaScript before first paint under 150 KB gzipped. The scene and the motion runtime are separate lazy chunks.
- Client components never import `content/site.ts` (pass data as props) and never use `cn()` (use `cx()`), to keep content and tailwind-merge out of the browser bundle.
- Fonts use `display: optional`; CSS is inlined.
- The work-stop textures are same-origin copies in `public/scene/`: the image CDN sends no CORS header, so WebGL can't read its images.
