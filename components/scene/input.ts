/**
 * Shared input for the home scene and the pinned services stage. Written by plain DOM listeners and
 * read once per frame by the scene, so scrolling and pointer moves never cause React renders.
 *
 * stop: a continuous position through the eight scene states, measured from the page itself:
 *   0 hero · 1-4 the four services (pinned) · 5 work · 6 process · 7 contact.
 * Each state has a marker element ([data-stop-mark="k"]); the state is fully on when its marker is
 * centred in the viewport. Between markers the value moves linearly with the scroll.
 */

export const sceneInput = {
  stop: 0,
  /** 0..1 through the process steps (matches the line that draws itself). */
  process: 0,
  /** Pointer in normalised device coordinates (-1..1), mouse only. */
  pointer: { x: 0, y: 0 },
  /** performance.now() of the last mouse move. */
  pointerAt: -1e9,
  /** performance.now() of the last scroll. */
  scrollAt: 0,
  reduced: false,
  mobile: false,
  /** Text blocks the particles thin out behind. */
  textEls: [] as HTMLElement[],
};

const N_STOPS = 8;
let marks: number[] = [];
let stage: HTMLElement | null = null;
let stageCount: HTMLElement | null = null;
let processList: HTMLElement | null = null;
let lastStep = -1;

/**
 * Pinned services must fit the screen. Re-checked on every measure: if the stage content is taller
 * than the stage, the track falls back to stacked blocks ([data-flow]) so nothing spills into the
 * next section. Checked without the fallback first, so a larger screen can pin again.
 */
function fitServices() {
  const track = document.querySelector<HTMLElement>(".services-track");
  const stage = track?.querySelector<HTMLElement>("[data-services-stage]");
  if (!track || !stage) return;
  delete track.dataset.flow;
  if (getComputedStyle(stage).position !== "sticky") return;
  const inner = stage.firstElementChild as HTMLElement | null;
  if (inner && inner.scrollHeight > stage.clientHeight + 1) track.dataset.flow = "";
}

function measure() {
  fitServices();
  const vh = window.innerHeight;
  const max = Math.max(0, document.documentElement.scrollHeight - vh);
  const y = window.scrollY;
  const next: number[] = [];
  for (let k = 0; k < N_STOPS; k++) {
    // The first marker for this state that is laid out (pinned and stacked layouts use different ones).
    const el = Array.from(document.querySelectorAll<HTMLElement>(`[data-stop-mark="${k}"]`)).find((e) => e.getClientRects().length > 0);
    if (!el) {
      next.push(next.length ? next[next.length - 1] + 1 : 0);
      continue;
    }
    const r = el.getBoundingClientRect();
    const centre = r.top + y + r.height / 2 - vh / 2;
    next.push(Math.min(max, Math.max(0, centre)));
  }
  // Keep the marks strictly increasing so every gap has a length.
  for (let k = 1; k < N_STOPS; k++) next[k] = Math.max(next[k], next[k - 1] + 1);
  marks = next;
  stage = document.querySelector("[data-services-stage]");
  stageCount = document.querySelector("[data-services-count]");
  processList = document.querySelector("[data-process]");
  sceneInput.textEls = Array.from(document.querySelectorAll<HTMLElement>("[data-scene-text]"));
}

function stopAt(y: number) {
  if (!marks.length || y <= marks[0]) return 0;
  for (let k = 0; k < N_STOPS - 1; k++) {
    if (y < marks[k + 1]) return k + (y - marks[k]) / (marks[k + 1] - marks[k]);
  }
  return N_STOPS - 1;
}

function onScroll() {
  const s = stopAt(window.scrollY);
  sceneInput.stop = s;
  sceneInput.scrollAt = performance.now();

  if (stage) {
    const step = Math.min(3, Math.max(0, Math.round(s) - 1));
    if (step !== lastStep) {
      lastStep = step;
      stage.dataset.step = String(step);
      if (stageCount) stageCount.textContent = String(step + 1).padStart(2, "0");
    }
    stage.style.setProperty("--svc", String(Math.min(1, Math.max(0, (s - 1) / 3))));
  }
  if (processList) {
    const r = processList.getBoundingClientRect();
    const vh = window.innerHeight;
    sceneInput.process = Math.min(1, Math.max(0, (vh * 0.72 - r.top) / (r.height + vh * 0.1)));
  }
}

let users = 0;
let teardown: (() => void) | null = null;

/** Starts the listeners (reference counted). Returns the matching stop function. */
export function startSceneInput() {
  users++;
  if (!teardown) teardown = listen();
  return () => {
    users--;
    if (users === 0 && teardown) {
      teardown();
      teardown = null;
    }
  };
}

function listen() {
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqMobile = window.matchMedia("(max-width: 767px), (pointer: coarse)");
  const sync = () => {
    sceneInput.reduced = mqReduce.matches;
    sceneInput.mobile = mqMobile.matches;
  };
  const remeasure = () => {
    measure();
    onScroll();
  };
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    sceneInput.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    sceneInput.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    sceneInput.pointerAt = performance.now();
  };

  sync();
  remeasure();
  // The page grows as fonts and images arrive: measure again whenever its size changes.
  const ro = new ResizeObserver(remeasure);
  ro.observe(document.body);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", remeasure);
  window.addEventListener("orientationchange", remeasure);
  window.addEventListener("load", remeasure);
  void document.fonts?.ready.then(remeasure);
  window.addEventListener("pointermove", onPointer, { passive: true });
  mqReduce.addEventListener("change", sync);
  mqMobile.addEventListener("change", sync);
  return () => {
    ro.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", remeasure);
    window.removeEventListener("orientationchange", remeasure);
    window.removeEventListener("load", remeasure);
    window.removeEventListener("pointermove", onPointer);
    mqReduce.removeEventListener("change", sync);
    mqMobile.removeEventListener("change", sync);
    lastStep = -1;
  };
}

/** Smoothstep between edges a and b. */
export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
