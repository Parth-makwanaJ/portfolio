/**
 * The home scene: one fixed, full-viewport WebGL canvas behind the page. Plain three.js (no React
 * renderer), loaded as its own chunk after first paint by HomeScene.
 *
 * Layers:
 * - The particle field (shaders.ts): one draw call, eight forms, one per scroll state.
 * - At the work state only: five glass slices in front of the featured project images. On desktop
 *   the glass refracts the images (three's transmission pass at half resolution); on phones it is
 *   plain see-through glass. Project names stay HTML, never behind the glass.
 *
 * Budget: the visible particle count is set per state (full only at the lattice, lowest at work);
 * pixel ratio is capped at 2 (1.5 on phones); the loop pauses when the tab is hidden or the scene's
 * sections are off screen. Runtime guard: if the frame rate stays under 40 fps the loop stops and
 * the scene becomes a static render that updates only when scrolling settles. Reduced motion gets
 * that static render from the start. No WebGL: a static image.
 */

import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
  WebGLRenderTarget,
  type Texture,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { sceneInput, smooth } from "@/components/scene/input";
import { fragmentShader, vertexShader } from "@/components/scene/shaders";

const BG = "#0d0c0b";
const LIME = "#d4ff3a";
const N_STOPS = 8;
const CAM_Z = 10;
const FOV = 40;
const FLOOR_FPS = 40;

// Visible particles per state: hero, shopify, backend, speed, seo, work, process, contact.
// Full count only for the lattice, which needs every slot; lowest at work, where the glass leads.
const COUNT_DESKTOP = [22000, 26000, 50653, 18000, 22000, 3000, 16000, 18000];
const COUNT_PHONE = [9000, 10000, 19683, 8000, 9000, 1500, 7000, 8000];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const damp = (a: number, b: number, lambda: number, dt: number) => lerp(a, b, 1 - Math.exp(-lambda * dt));
/** Smooth 0..1 presence around a state (full at it, gone one state away). */
const presence = (s: number, stop: number) => smooth(0, 1, 1 - Math.min(1, Math.abs(s - stop)));

type Debug = Window & { __scene?: { fps: number[]; fallback: string | null; stop: number } };

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!c.getContext("webgl2");
  } catch {
    return false;
  }
}

function buildParticles(n: number) {
  const count = n * n * n;
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const slots = new Float32Array(count);
  for (let i = 0; i < count; i++) slots[i] = i;
  // Shuffled slots: any leading draw range is an even sample of every form.
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = slots[i];
    slots[i] = slots[j];
    slots[j] = t;
  }
  const r = new Float32Array(count * 4);
  const s = new Float32Array(count * 4);
  for (let i = 0; i < count * 4; i++) {
    r[i] = rnd();
    s[i] = rnd();
  }
  const g = new BufferGeometry();
  // three needs a position attribute to size the draw; the shader computes the real positions.
  g.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute("aR", new BufferAttribute(r, 4));
  g.setAttribute("aS", new BufferAttribute(s, 4));
  g.setAttribute("aSlot", new BufferAttribute(slots, 1));
  return { geometry: g, count };
}

/** A small studio environment for the glass: three soft light panels, prefiltered once. */
function studioEnvironment(renderer: WebGLRenderer) {
  const env = new Scene();
  const panel = (w: number, h: number, intensity: number, pos: [number, number, number]) => {
    const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(intensity, intensity, intensity) }));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  panel(1.2, 14, 6, [-6, 2, 4]);
  panel(1.2, 10, 3.5, [6, -1, 3]);
  panel(16, 1.2, 2, [0, 7, -3]);
  panel(12, 3, 1.4, [2, 4, 10]);
  const pmrem = new PMREMGenerator(renderer);
  const rt = pmrem.fromScene(env, 0.02);
  pmrem.dispose();
  env.traverse((o) => {
    if (o instanceof Mesh) {
      o.geometry.dispose();
      (o.material as MeshBasicMaterial).dispose();
    }
  });
  return rt;
}

export function mountScene(container: HTMLElement): () => void {
  if (!webglAvailable()) {
    container.dataset.scene = "static-image";
    return () => delete container.dataset.scene;
  }

  const mobile = sceneInput.mobile;
  const debug = window as Debug;
  debug.__scene = { fps: [], fallback: null, stop: 0 };
  // ?scene-debug: measure the real frame rate per state (the guard is off, so it never stops the loop).
  const measuring = new URLSearchParams(window.location.search).has("scene-debug");

  const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance", alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  renderer.setClearColor(BG, 1);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.transmissionResolutionScale = 0.5;
  const canvas = renderer.domElement;
  canvas.style.cssText = "display:block;width:100%;height:100%;opacity:0;transition:opacity 700ms cubic-bezier(0.22,1,0.36,1)";
  container.append(canvas);

  const scene = new Scene();
  scene.background = new Color(BG);
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 80);
  camera.position.set(0, 0, CAM_Z);
  const envRT = studioEnvironment(renderer);
  scene.environment = envRT.texture;

  /* ---------------------------------------------------------------- particles */

  const side = mobile ? 27 : 37;
  const { geometry, count: total } = buildParticles(side);
  const counts = mobile ? COUNT_PHONE : COUNT_DESKTOP;
  const boxes = Array.from({ length: 6 }, () => new Vector4(-9e4, -9e4, -9e4, -9e4));
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uFrom: { value: 0 },
      uTo: { value: 1 },
      uMix: { value: 0 },
      uFocus: { value: Array.from({ length: N_STOPS }, () => new Vector3()) },
      uView: { value: new Vector2(1, 1) },
      uUnit: { value: 1 },
      uN: { value: total },
      uLatN: { value: side },
      uCountA: { value: counts[0] },
      uCountB: { value: counts[1] },
      uPhone: { value: mobile ? 1 : 0 },
      uSize: { value: mobile ? 26 : 30 },
      uPR: { value: renderer.getPixelRatio() },
      uMaxSize: { value: 26 * renderer.getPixelRatio() },
      uMouse: { value: new Vector2(9, 9) },
      uMouseStr: { value: 0 },
      uAspect: { value: 1 },
      uProcess: { value: 0 },
      uColor: { value: new Color(LIME) },
      uBoxes: { value: boxes },
      uFeather: { value: 36 * renderer.getPixelRatio() },
      uDim: { value: 0.16 },
    },
  });
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);
  const u = material.uniforms;

  /* ---------------------------------------------------------------- work: glass over images */

  const work = new Group();
  work.visible = false;
  scene.add(work);
  const slugs = (container.dataset.projects ?? "").split(",").filter(Boolean).slice(0, 4);
  const cards: Mesh[] = [];
  const cardZ = slugs.map(() => 0);
  const sliceGeometry = new RoundedBoxGeometry(0.44, 1.7, 0.22, 3, 0.02);
  const glass = mobile
    ? new MeshPhysicalMaterial({ color: "#ffffff", transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0 })
    : new MeshPhysicalMaterial({ color: "#ffffff", transmission: 1, thickness: 0.5, roughness: 0.04, ior: 1.5, dispersion: 3, metalness: 0 });
  const slices = Array.from({ length: 5 }, () => {
    const m = new Mesh(sliceGeometry, glass);
    work.add(m);
    return m;
  });

  let texturesRequested = false;
  const loadCards = () => {
    texturesRequested = true;
    const loader = new TextureLoader();
    Promise.all(slugs.map((slug) => loader.loadAsync(`/scene/${slug}.webp`)))
      .then((textures: Texture[]) => {
        if (disposed) return textures.forEach((t) => t.dispose());
        textures.forEach((t) => {
          t.colorSpace = SRGBColorSpace;
          t.anisotropy = 4;
          const img = t.image as HTMLImageElement;
          const card = new Mesh(new PlaneGeometry(2.3, (2.3 * img.height) / img.width), new MeshBasicMaterial({ map: t, toneMapped: false }));
          cards.push(card);
          work.add(card);
          renderer.initTexture(t); // upload now, not on the frame the work state arrives
        });
        // Compile the new materials now too, then draw again if the loop is not running.
        const was = work.visible;
        work.visible = true;
        renderer.compile(scene, camera);
        work.visible = was;
        if (mode !== "live") renderStatic();
      })
      .catch(() => {});
  };

  /* ---------------------------------------------------------------- layout */

  const view = new Vector2();
  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const vh = 2 * Math.tan((FOV * Math.PI) / 360) * CAM_Z;
    view.set(vh * camera.aspect, vh);
    u.uView.value.copy(view);
    u.uUnit.value = Math.min(view.x, view.y);
    u.uAspect.value = camera.aspect;
    const W = view.x;
    const H = view.y;
    // Where each form sits. Desktop: the contained forms sit right of the text column.
    // Phones: above the text, which sits low on the screen.
    const focus: [number, number, number][] = mobile
      ? [[0, H * 0.2, 0], [0, H * 0.1, -1], [0, 0, -4], [0, H * 0.12, 0], [0, H * 0.16, -1.5], [0, 0, 0], [0, 0, 0], [0, H * 0.2, -1]]
      : [[W * 0.22, H * 0.03, 0], [W * 0.06, 0, -1], [0, 0, -5], [W * 0.16, 0, 0], [W * 0.2, -H * 0.06, -2], [0, 0, 0], [0, 0, 0], [W * 0.2, 0, -1]];
    focus.forEach((f, k) => (u.uFocus.value[k] as Vector3).set(...f));
    if (mode !== "live") renderStatic();
  };

  /* ---------------------------------------------------------------- per-frame state */

  const timeline = { s: 0, intro: 0 };
  const mouse = new Vector2(9, 9);
  let elapsed = 0;
  let mode: "live" | "static" = sceneInput.reduced ? "static" : "live";

  /** Target state with a hold at every stop: the form settles, then the next morph runs. */
  const target = () => {
    const raw = Math.min(N_STOPS - 1, Math.max(0, sceneInput.stop));
    const i = Math.floor(raw);
    return i + smooth(0.2, 0.8, raw - i);
  };

  const pr = renderer.getPixelRatio();
  const updateBoxes = () => {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    let n = 0;
    for (const el of sceneInput.textEls) {
      if (n === boxes.length) break;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh || r.width === 0) continue;
      const pad = 14;
      boxes[n++].set(
        Math.max(0, r.left - pad) * pr,
        Math.max(0, vh - r.bottom - pad) * pr,
        Math.min(vw, r.right + pad) * pr,
        Math.min(vh, vh - r.top + pad) * pr,
      );
    }
    for (; n < boxes.length; n++) boxes[n].set(-9e4, -9e4, -9e4, -9e4);
  };

  const apply = (s: number, dt: number) => {
    const i = Math.min(N_STOPS - 1, Math.floor(s));
    const j = Math.min(N_STOPS - 1, i + 1);
    u.uFrom.value = i;
    u.uTo.value = j;
    u.uMix.value = s - i;
    u.uCountA.value = counts[i];
    u.uCountB.value = counts[j];
    geometry.setDrawRange(0, Math.min(total, Math.max(counts[i], counts[j])));
    u.uIntro.value = timeline.intro;
    u.uProcess.value = sceneInput.process;

    // Pointer: damped, so particles settle back smoothly when it stops or leaves.
    const now = performance.now();
    const active = mode === "live" && !mobile && now - sceneInput.pointerAt < 1200;
    mouse.lerp(sceneInput.pointer as Vector2, 1 - Math.exp(-7 * dt));
    u.uMouse.value.copy(mouse);
    u.uMouseStr.value = damp(u.uMouseStr.value, active ? 1 : 0, 3, dt);

    updateBoxes();

    // Glass and cards at the work state.
    const p = presence(s, 5);
    work.visible = p > 0.01 && cards.length > 0;
    if (work.visible) {
      const W = view.x;
      const H = view.y;
      work.position.set(mobile ? 0 : W * 0.21, mobile ? H * 0.25 : 0.05, 0);
      work.scale.setScalar(mobile ? W / 5.4 : H / 6.4);
      work.rotation.y = mobile ? 0 : -0.28;
      slices.forEach((m, k) => {
        const c = k - 2;
        m.position.set(c * 0.46, 0, 0.6 + c * 0.32 * p);
        m.rotation.y = c * 0.1 * p;
        m.scale.setScalar(Math.max(0.001, p));
      });
      const hover = sceneInput.hover;
      cards.forEach((m, k) => {
        // The hovered (or focused) project comes forward; the others step back.
        const base = -0.9 - k * 0.45;
        const goal = hover < 0 ? base : hover === k ? -0.35 : base - 0.5;
        cardZ[k] = mode === "live" ? damp(cardZ[k] || base, goal, 6, dt) : goal;
        m.position.set(-0.5 + k * 0.32, 0.38 - k * 0.26, lerp(-6, cardZ[k], p));
      });
    }
  };

  const renderStatic = () => {
    if (disposed) return;
    timeline.s = target();
    timeline.intro = 1;
    apply(timeline.s, 1);
    renderer.render(scene, camera);
    canvas.style.opacity = "1";
  };

  /* ---------------------------------------------------------------- loop */

  let raf = 0;
  let last = 0;
  let disposed = false;
  let running = false;
  let onScreen = true;
  // Guard: one sample per second of live rendering; the median of the last five decides.
  const samples: number[] = [];
  let sampleStart = 0;
  let sampleFrames = 0;
  let shown = false;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - (last || now)) / 1000, 1 / 20);
    last = now;
    elapsed += dt;
    u.uTime.value += dt;

    timeline.s = damp(timeline.s, target(), 5, dt);
    timeline.intro = smooth(0.3, 2.6, elapsed);
    apply(timeline.s, dt);
    if (!texturesRequested && (elapsed > 3.5 || timeline.s > 2)) loadCards();

    renderer.render(scene, camera);
    if (!shown) {
      shown = true;
      canvas.style.opacity = "1";
    }

    // Guard (after a 5 s warm-up: intro, compiles and uploads are done by then).
    if (elapsed > 5) {
      if (!sampleStart) sampleStart = now;
      sampleFrames++;
      if (now - sampleStart >= 1000) {
        samples.push((sampleFrames * 1000) / (now - sampleStart));
        if (samples.length > 5) samples.shift();
        debug.__scene!.fps.push(Math.round(samples[samples.length - 1]));
        sampleStart = now;
        sampleFrames = 0;
        if (samples.length === 5) {
          const median = [...samples].sort((a, b) => a - b)[2];
          if (median < FLOOR_FPS && !measuring) {
            debug.__scene!.fallback = `static (${Math.round(median)} fps)`;
            mode = "static";
            stop();
            renderStatic();
          }
        }
      }
    }
    debug.__scene!.stop = timeline.s;
  };

  const play = () => {
    if (running || disposed || mode !== "live" || document.hidden || !onScreen) return;
    running = true;
    last = 0;
    sampleStart = 0;
    sampleFrames = 0;
    raf = requestAnimationFrame(frame);
  };
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // Static mode: draw once more when scrolling settles, at the state it settled on.
  let idle = 0;
  const onScroll = () => {
    if (mode !== "static") return;
    window.clearTimeout(idle);
    idle = window.setTimeout(renderStatic, 160);
  };

  const onVisibility = () => (document.hidden ? stop() : play());
  // Off screen: none of the scene's sections are in view (for example only the footer is).
  const sections = Array.from(document.querySelectorAll("[data-stop-mark]"));
  const inView = new Set<Element>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target)));
    onScreen = inView.size > 0;
    if (onScreen) play();
    else stop();
  });
  sections.forEach((s) => io.observe(s));

  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // Compile every material once up front, the hidden glass included, and draw one offscreen frame
  // with it so the transmission buffer is allocated now and not on the frame the work state arrives.
  work.visible = true;
  renderer.compile(scene, camera);
  if (!mobile) {
    const size = renderer.getDrawingBufferSize(new Vector2());
    const rt = new WebGLRenderTarget(size.x, size.y);
    renderer.setRenderTarget(rt);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    rt.dispose();
  }
  work.visible = false;

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("scroll", onScroll, { passive: true });
  if (mode === "live") play();
  else {
    renderStatic();
    loadCards();
  }

  return () => {
    disposed = true;
    stop();
    window.clearTimeout(idle);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("scroll", onScroll);
    geometry.dispose();
    material.dispose();
    sliceGeometry.dispose();
    glass.dispose();
    cards.forEach((c) => {
      c.geometry.dispose();
      const m = c.material as MeshBasicMaterial;
      m.map?.dispose();
      m.dispose();
    });
    envRT.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
}
