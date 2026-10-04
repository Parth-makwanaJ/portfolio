/**
 * The hero's 3D layer, loaded on demand by HeroMotionLoader (its own chunk, never in the
 * initial JavaScript). Uses Motion's animate() + scroll(): scroll-linked animations that run
 * on the browser's ScrollTimeline where supported. Transform only.
 *
 * As the visitor scrolls from the top of the page until the hero has left the viewport:
 * - the scene tilts back in perspective (rotateX) and turns (rotateZ)
 * - each shape comes forward by its own depth (translateZ, from data-depth), some also rotate
 * The pointer adds a small tilt on top (CSS transition on a separate wrapper).
 */
import { animate, scroll } from "framer-motion";

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof scroll>[1]>["offset"]>;

const EASE = [0.2, 0, 0, 1] as const;

// Extra rotation for a few shapes so the layers read as separate planes.
const spin: Record<string, string> = {
  c: "rotateY(0deg)",
  f: "rotateZ(45deg)",
  h: "rotateY(55deg)",
  i: "rotateX(-35deg)",
  d: "rotateX(30deg)",
};

export function initHeroMotion(hero: HTMLElement): () => void {
  const scene = hero.querySelector<HTMLElement>("[data-hero-scene]");
  const tilt = hero.querySelector<HTMLElement>("[data-hero-tilt]");
  if (!scene || !tilt) return () => {};

  const cleanups: (() => void)[] = [];
  const offset: ScrollOffset = ["start start", "end start"];
  const range = { target: hero, offset };

  const sceneAnim = animate(
    scene,
    {
      transform: [
        "translateY(0px) rotateX(0deg) rotateZ(0deg) scale(1)",
        "translateY(-60px) rotateX(55deg) rotateZ(-20deg) scale(0.92)",
      ],
    },
    { ease: EASE, duration: 1 },
  );
  cleanups.push(scroll(sceneAnim, range));

  scene.querySelectorAll<HTMLElement>("[data-shape]").forEach((el) => {
    const depth = Number(el.dataset.depth ?? 0);
    const extra = spin[el.dataset.shape ?? ""] ?? "";
    const anim = animate(
      el,
      { transform: ["translateZ(0px)", `translateZ(${depth}px) ${extra}`.trim()] },
      { ease: EASE, duration: 1 },
    );
    cleanups.push(scroll(anim, range));
  });

  // Pointer tilt: small, on its own wrapper so it never fights the scroll animation.
  let raf = 0;
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg)`;
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(raf);
    tilt.style.transform = "";
  };
  hero.addEventListener("pointermove", onMove, { passive: true });
  hero.addEventListener("pointerleave", onLeave);
  cleanups.push(() => {
    hero.removeEventListener("pointermove", onMove);
    hero.removeEventListener("pointerleave", onLeave);
    onLeave();
  });

  return () => {
    cleanups.forEach((c) => c());
    sceneAnim.cancel();
    scene.querySelectorAll<HTMLElement>("[data-shape]").forEach((el) => (el.style.transform = ""));
    scene.style.transform = "";
  };
}
