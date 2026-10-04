/**
 * One trigger for starting the heavy, non-essential code (three.js scene, GSAP, Lenis):
 * the first of
 *   - the browser being idle after the page has loaded (the headline has painted by then), or
 *   - the visitor's first scroll, wheel, pointer move, touch or key press.
 * Callbacks registered after it has fired run on the next task.
 */

const EVENTS = ["scroll", "wheel", "pointermove", "pointerdown", "touchstart", "keydown"] as const;

let fired = false;
let armed = false;
const queue: (() => void)[] = [];

function fire() {
  if (fired) return;
  fired = true;
  EVENTS.forEach((e) => window.removeEventListener(e, fire));
  // Each callback in its own task, so starting two libraries is never one long task.
  queue.splice(0).forEach((cb) => setTimeout(cb, 0));
}

function arm() {
  armed = true;
  EVENTS.forEach((e) => window.addEventListener(e, fire, { passive: true, once: true }));
  const idle = () =>
    "requestIdleCallback" in window ? window.requestIdleCallback(fire, { timeout: 3000 }) : setTimeout(fire, 1500);
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

export function whenStartAllowed(cb: () => void) {
  if (fired) {
    setTimeout(cb, 0);
    return;
  }
  queue.push(cb);
  if (!armed) arm();
}
