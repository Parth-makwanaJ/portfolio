/**
 * Triggers for starting the heavy, non-essential code (three.js scene, GSAP, Lenis).
 *
 * whenStartAllowed (desktop): the first of
 *   - the browser being idle after the page has loaded (the headline has painted by then), or
 *   - the visitor's first scroll, wheel, pointer move, touch or key press.
 * whenInteracted (phones): only the visitor's first touch, scroll or key press. Nothing heavy is
 *   downloaded or run before that.
 * Callbacks registered after a trigger has fired run on the next task, each in its own task.
 */

const IDLE_OR_INPUT = ["scroll", "wheel", "pointermove", "pointerdown", "touchstart", "keydown"] as const;
const INPUT = ["scroll", "wheel", "pointerdown", "touchstart", "keydown"] as const;

/** Phones: a coarse pointer or a viewport under 768px wide. */
export const isPhone = () => window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;

function gate(events: readonly string[], idle: boolean) {
  let fired = false;
  let armed = false;
  const queue: (() => void)[] = [];
  const fire = () => {
    if (fired) return;
    fired = true;
    events.forEach((e) => window.removeEventListener(e, fire));
    queue.splice(0).forEach((cb) => setTimeout(cb, 0));
  };
  const arm = () => {
    armed = true;
    events.forEach((e) => window.addEventListener(e, fire, { passive: true, once: true }));
    if (!idle) return;
    const onIdle = () =>
      "requestIdleCallback" in window ? window.requestIdleCallback(fire, { timeout: 3000 }) : setTimeout(fire, 1500);
    if (document.readyState === "complete") onIdle();
    else window.addEventListener("load", onIdle, { once: true });
  };
  return (cb: () => void) => {
    if (fired) return void setTimeout(cb, 0);
    queue.push(cb);
    if (!armed) arm();
  };
}

export const whenStartAllowed = gate(IDLE_OR_INPUT, true);
export const whenInteracted = gate(INPUT, false);
