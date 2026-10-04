/**
 * The motion runtime: the site's one scroll system. Loaded after first paint by MotionRoot.
 *
 * - Lenis smooth scrolling on desktop (pointer: fine), driven by GSAP's ticker and synced to
 *   ScrollTrigger. Touch devices keep native scrolling. Lenis works on the real window scroll,
 *   so keyboard scrolling, anchor links, back/forward and the native scrollbar keep working.
 * - Section headings ([data-reveal]) rise line by line from a mask as they enter.
 * - The process line draws itself with the scroll; each step's marker lights as the line reaches it.
 * - A custom cursor on desktop, reading "View" over projects ([data-cursor="view"]).
 *
 * Reduced motion: no Lenis, no cursor, no movement; headings fade in (150 ms) and the line is full.
 * Elements already on screen when this runs are never hidden, so nothing visible ever flickers.
 */

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { setScroller } from "@/lib/motion/scroll";

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = () => window.matchMedia("(pointer: fine)").matches;

let lenis: Lenis | null = null;

export function start() {
  if (!reduced() && fine()) {
    lenis = new Lenis({ lerp: 0.11, anchors: true, autoRaf: false, stopInertiaOnNavigate: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    setScroller(lenis);
    startCursor();
  }
  void document.fonts?.ready.then(() => ScrollTrigger.refresh());
  // The page height changes as fonts and images arrive, or when the services switch between pinned
  // and stacked: measure the triggers again once it settles.
  let t = 0;
  new ResizeObserver(() => {
    window.clearTimeout(t);
    t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
  }).observe(document.body);
}

/** Sets up the current page's scroll effects. Returns the cleanup for the next navigation. */
export function initPage() {
  // After a client-side navigation the router has already moved the window; Lenis follows it.
  requestAnimationFrame(() => lenis?.scrollTo(window.scrollY, { immediate: true, force: true }));

  const ctx = gsap.context(() => {
    reveals();
    processLine();
  });
  // The page-enter transition moves content by 12px for 300 ms; measure again once it is done.
  const t = window.setTimeout(() => ScrollTrigger.refresh(), 360);
  return () => {
    window.clearTimeout(t);
    ctx.revert();
  };
}

/* ------------------------------------------------------------------ heading reveals */

function reveals() {
  const vh = window.innerHeight;
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    // Already on screen: leave it exactly as it is.
    if (el.getBoundingClientRect().top < vh * 0.9) return;
    // Hidden until it arrives; split into lines only then (splitting every heading up front is a
    // long task on slow phones). ScrollTrigger also catches a jump past the heading.
    gsap.set(el, { opacity: 0 });
    ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => reveal(el) });
  });
}

function reveal(el: HTMLElement) {
  if (reduced()) {
    gsap.to(el, { opacity: 1, duration: 0.15, ease: "none" });
    return;
  }
  const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "rl" });
  gsap.set(el, { opacity: 1 });
  gsap.from(split.lines, {
    yPercent: 112,
    duration: 0.6,
    ease: "power3.out",
    stagger: 0.07,
    // Back to the original markup: no masks left to clip descenders, nothing to re-split on resize.
    onComplete: () => split.revert(),
  });
}

/* ------------------------------------------------------------------ process line */

function processLine() {
  const list = document.querySelector<HTMLElement>("[data-process]");
  const line = list?.querySelector<HTMLElement>("[data-process-line]");
  if (!list || !line || reduced()) return;

  gsap.fromTo(
    line,
    { scaleY: 0 },
    { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 72%", end: "bottom 62%", scrub: true } },
  );
  list.querySelectorAll<HTMLElement>("[data-process-step]").forEach((step) => {
    step.dataset.off = "";
    ScrollTrigger.create({
      trigger: step,
      start: "top 66%",
      onEnter: () => delete step.dataset.off,
      onLeaveBack: () => (step.dataset.off = ""),
    });
  });
}

/* ------------------------------------------------------------------ cursor */

function startCursor() {
  const ring = document.createElement("div");
  ring.className = "cursor cursor-ring";
  ring.setAttribute("aria-hidden", "true");
  ring.innerHTML = "<span>View</span>";
  const dot = document.createElement("div");
  dot.className = "cursor cursor-dot";
  dot.setAttribute("aria-hidden", "true");
  const els = [ring, dot];
  els.forEach((el) => {
    el.dataset.state = "hidden";
    document.body.append(el);
  });

  const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });
  let state = "hidden";
  const setState = (s: string) => {
    if (s === state) return;
    state = s;
    els.forEach((el) => (el.dataset.state = s));
  };

  const stateFor = (target: EventTarget | null) => {
    const el = target instanceof Element ? target : null;
    if (!el) return "default";
    if (el.closest("input, textarea, select")) return "hidden";
    if (el.closest('[data-cursor="view"]')) return "view";
    if (el.closest("a, button, [role='button'], summary, label")) return "link";
    return "default";
  };

  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return setState("hidden");
      document.documentElement.classList.add("has-cursor");
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      if (state === "hidden") gsap.set(ring, { x: e.clientX, y: e.clientY });
      ringX(e.clientX);
      ringY(e.clientY);
      setState(stateFor(e.target));
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => setState("hidden"));
  // Moving into something under a still pointer (scrolling) updates the state too.
  window.addEventListener(
    "scroll",
    () => {
      if (state === "hidden") return;
      const x = gsap.getProperty(dot, "x") as number;
      const y = gsap.getProperty(dot, "y") as number;
      setState(stateFor(document.elementFromPoint(x, y)));
    },
    { passive: true },
  );
}
