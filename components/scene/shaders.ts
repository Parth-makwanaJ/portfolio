/**
 * The particle field. Every particle carries only random numbers (aR, aS) and a slot (a shuffled
 * index); each of the eight forms is computed from those in the vertex shader. A frame evaluates
 * the two forms either side of the current scroll position and blends them per particle, with a
 * delay that sweeps across the screen, so every morph ripples through the field.
 *
 * Depth: size falls off with distance and alpha fades into the background, so the field reads as
 * a volume. Particles very close to the camera fade out (no huge sprites).
 * Text: particles drawn over a text block ([data-scene-text]) are thinned to uDim.
 */

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform int uFrom;
  uniform int uTo;
  uniform float uMix;
  uniform vec3 uFocus[8];
  uniform vec2 uView;        // visible width and height at z = 0
  uniform float uUnit;       // min(uView): the scale of contained forms
  uniform float uN;          // particles in the buffer
  uniform float uLatN;       // lattice side
  uniform float uCountA;     // visible particles at the from / to state
  uniform float uCountB;
  uniform float uPhone;
  uniform float uSize;
  uniform float uPR;
  uniform float uMaxSize;
  uniform vec2 uMouse;
  uniform float uMouseStr;
  uniform float uAspect;
  uniform float uProcess;
  attribute vec4 aR;
  attribute vec4 aS;
  attribute float aSlot;
  varying float vAlpha;

  const float TAU = 6.2831853;
  const float CAM_Z = 10.0;

  vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
  vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }
  vec3 sphereDir(vec2 r) { float z = r.x * 2.0 - 1.0; float a = r.y * TAU; float q = sqrt(max(0.0, 1.0 - z * z)); return vec3(q * cos(a), z, q * sin(a)); }
  float hash(float n) { return fract(sin(n) * 43758.5453); }

  vec3 drift(float amp) {
    return amp * vec3(sin(uTime * 0.23 + aR.w * 40.0), cos(uTime * 0.19 + aR.z * 30.0), sin(uTime * 0.13 + aS.x * 20.0));
  }

  // A point filling the camera's view volume between two depths.
  vec3 volume(vec3 r, float zNear, float zFar) {
    float z = mix(zFar, zNear, r.z);
    float k = (CAM_Z - z) / CAM_Z * 1.15;
    return vec3((r.x - 0.5) * uView.x * k, (r.y - 0.5) * uView.y * k, z);
  }

  // 0 · hero: a loose cloud that gathers into a dense core. A share stays behind as dust.
  vec3 formHero(out float a, out float sz) {
    vec3 cloud = volume(aS.xyz, 4.0, -16.0) + drift(0.12);
    if (aR.x < 0.3) { a = 0.5; sz = 0.8; return cloud; }
    float rr = pow(aR.y, 1.7);
    float r = uUnit * (0.015 + 0.36 * rr);
    vec3 p = sphereDir(aR.zw) * r;
    p = rotY(p, uTime * 0.22 / (0.35 + rr * 2.5));
    p = rotX(p, 0.35);
    p += uFocus[0];
    float delay = 0.5 * (0.55 * aR.y + 0.45 * aS.w);
    float k = smoothstep(0.0, 1.0, clamp((uIntro - delay) / 0.5, 0.0, 1.0));
    a = mix(0.55, 0.55 + 0.45 * (1.0 - rr), k);
    sz = mix(0.8, 0.75 + 0.35 * (1.0 - rr), k);
    return mix(cloud, p, k);
  }

  // 1 · Shopify: stacked horizontal layers, like shelves, sliding past each other.
  vec3 formShelves(out float a, out float sz) {
    float lv = floor(aR.x * 5.0);
    float gap = uUnit * mix(0.19, 0.15, uPhone);
    vec3 p = vec3((aR.y - 0.5) * uView.x * 1.3, (lv - 2.0) * gap + (aR.w - 0.5) * 0.025, (aR.z - 0.5) * 7.0);
    p.x += sin(uTime * 0.16 + lv * 1.7) * 0.4;
    p = rotY(p, -0.22 + sin(uTime * 0.05) * 0.06);
    p = rotX(p, 0.42);
    a = 0.6 + 0.4 * smoothstep(0.7, 1.0, aR.z);
    sz = 0.8;
    return p + uFocus[1];
  }

  // 2 · Backend: the ordered lattice. One particle per slot, so the drawn set is the full grid.
  vec3 formLattice(out float a, out float sz) {
    float n = uLatN;
    float x = mod(aSlot, n), y = mod(floor(aSlot / n), n), z = floor(aSlot / (n * n));
    float span = max(uView.x, uView.y) * 1.1;
    vec3 p = (vec3(x, y, z) - (n - 1.0) * 0.5) * (span / (n - 1.0));
    p = rotY(p, uTime * 0.035 + 0.55);
    p = rotX(p, 0.3);
    a = 0.75;
    sz = 0.72;
    return p + uFocus[2];
  }

  // 3 · Speed: long streaks stretched in depth, moving past the camera.
  vec3 formSpeed(out float a, out float sz) {
    float id = floor(aR.x * 520.0);
    float h1 = hash(id * 12.9898), h2 = hash(id * 78.233), h3 = hash(id * 39.425);
    float ang = h1 * TAU;
    float rad = mix(uUnit * 0.22, max(uView.x, uView.y) * 1.15, pow(h2, 0.75));
    float len = 2.4 + h3 * 3.2;
    float head = mod(h3 * 46.0 + uTime * (4.5 + h2 * 4.0), 46.0) - 34.0;
    vec3 p = vec3(cos(ang) * rad, sin(ang) * rad * mix(0.75, 1.0, uPhone), head - aR.y * len);
    a = 0.35 + 0.65 * (1.0 - aR.y);
    sz = 0.7;
    return p + vec3(uFocus[3].xy, 0.0);
  }

  // 4 · SEO: rings expanding outwards from a centre, like a signal spreading over a plane.
  vec3 formRings(out float a, out float sz) {
    float id = floor(aR.x * 12.0);
    float ph = fract(id / 12.0 + uTime * 0.045);
    float r = ph * max(uView.x, uView.y) * 1.05 + uUnit * 0.02;
    float ang = aR.y * TAU;
    vec3 p = vec3(cos(ang) * r, sin(ang) * r, 0.0) + vec3((aR.zw - 0.5) * 0.05, (aS.x - 0.5) * 0.05);
    p = rotX(p, -1.08);
    a = smoothstep(0.0, 0.05, ph) * (1.0 - smoothstep(0.5, 1.0, ph));
    sz = 0.8;
    return p + uFocus[4];
  }

  // 5 · Work: the field thins out and recedes so the glass and the images lead.
  vec3 formWork(out float a, out float sz) {
    a = 0.35;
    sz = 0.7;
    return volume(aS.xyz, -7.0, -24.0) + drift(0.15);
  }

  // 6 · Process: one flowing path with five bright nodes, one per step. Nodes light as the
  // process line in the page reaches each step.
  vec3 pathAt(float u) {
    if (uPhone > 0.5) {
      return vec3(sin(u * TAU * 0.8 + 0.6) * uView.x * 0.3, mix(uView.y * 0.46, -uView.y * 0.46, u), sin(u * TAU * 0.6) * 1.5 - 1.0);
    }
    return vec3(mix(-uView.x * 0.52, uView.x * 0.52, u), sin(u * TAU * 0.85 + 0.4) * uView.y * 0.24, sin(u * TAU * 0.55 + 1.0) * 2.2 - 1.0);
  }
  vec3 formProcess(out float a, out float sz) {
    a = 0.7;
    sz = 0.75;
    if (aR.x < 0.24) {
      float k = floor(aR.y * 5.0);
      float lit = mix(0.3, 1.0, smoothstep(k / 5.0 - 0.02, k / 5.0 + 0.08, uProcess));
      float r = uUnit * 0.055 * pow(aR.z, 1.5);
      a = lit;
      sz = mix(0.9, 1.25, lit);
      return pathAt((k + 0.5) / 5.0) + sphereDir(vec2(aR.w, aS.w)) * r + uFocus[6];
    }
    float u = fract(aR.y + uTime * 0.018);
    float th = uUnit * (0.01 + 0.035 * pow(aR.z, 3.0));
    return pathAt(u) + sphereDir(vec2(aR.w, aS.w)) * th + uFocus[6];
  }

  // 7 · Contact: a calm sphere, slowly turning (Fibonacci points over every slot).
  vec3 formSphere(out float a, out float sz) {
    if (aR.x < 0.15) { a = 0.35; sz = 0.7; return volume(aS.xyz, 2.0, -14.0) + drift(0.12); }
    float i = aSlot + 0.5;
    float y = 1.0 - 2.0 * i / uN;
    float q = sqrt(max(0.0, 1.0 - y * y));
    float th = i * 2.3999632;
    vec3 p = vec3(cos(th) * q, y, sin(th) * q) * uUnit * 0.36;
    p = rotY(p, uTime * 0.07);
    p = rotX(p, 0.28);
    a = 0.85;
    sz = 0.85;
    return p + uFocus[7];
  }

  vec3 form(int f, out float a, out float sz) {
    a = 0.0;
    sz = 1.0;
    if (f == 0) return formHero(a, sz);
    if (f == 1) return formShelves(a, sz);
    if (f == 2) return formLattice(a, sz);
    if (f == 3) return formSpeed(a, sz);
    if (f == 4) return formRings(a, sz);
    if (f == 5) return formWork(a, sz);
    if (f == 6) return formProcess(a, sz);
    return formSphere(a, sz);
  }

  void main() {
    float aA, sA, aB, sB;
    vec3 A = form(uFrom, aA, sA);
    vec3 B = form(uTo, aB, sB);

    // Ripple: a sweep across the screen (down it on phones) plus a little randomness.
    float sweep = uPhone > 0.5 ? clamp(0.5 - A.y / uView.y, 0.0, 1.0) : clamp(A.x / uView.x + 0.5, 0.0, 1.0);
    float delay = 0.35 * (0.65 * sweep + 0.35 * aS.w);
    float k = smoothstep(0.0, 1.0, clamp((uMix - delay) / 0.65, 0.0, 1.0));
    vec3 pos = mix(A, B, k);
    // Travel in arcs, not straight lines.
    pos += sin(k * 3.14159) * (aR.wzy - 0.5) * uUnit * 0.2;
    float alpha = mix(aA, aB, k);
    float size = mix(sA, sB, k);

    // Visible count per state: particles past it fade out as their own morph completes.
    float count = mix(uCountA, uCountB, k);
    alpha *= 1.0 - smoothstep(count - 1500.0, count, float(gl_VertexID));

    vec4 mv = viewMatrix * vec4(pos, 1.0);
    float depth = -mv.z;

    // Pointer: particles near the cursor move away (screen space, so depth doesn't matter).
    vec4 clip = projectionMatrix * mv;
    vec2 d = (clip.xy / clip.w - uMouse) * vec2(uAspect, 1.0);
    float f = uMouseStr * (1.0 - smoothstep(0.0, 0.3, length(d)));
    mv.xy += normalize(d + 1e-5) * f * depth * 0.065;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(uMaxSize, uSize * uPR * size * (0.6 + aR.w * 0.8) / depth);
    float nearFade = smoothstep(1.4, 3.6, depth);
    float fog = smoothstep(44.0, 8.0, depth);
    vAlpha = alpha * nearFade * (0.12 + 0.88 * fog) * (0.45 + 0.55 * aR.z);
  }
`;

export const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec4 uBoxes[6];    // text blocks in drawing-buffer pixels (x0, y0, x1, y1), bottom-left origin
  uniform float uFeather;
  uniform float uDim;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.1, d) * vAlpha;
    vec2 p = gl_FragCoord.xy;
    float m = 0.0;
    for (int i = 0; i < 6; i++) {
      vec4 b = uBoxes[i];
      vec2 q = max(b.xy - p, p - b.zw);
      m = max(m, 1.0 - smoothstep(-uFeather, uFeather, max(q.x, q.y)));
    }
    a *= mix(1.0, uDim, m);
    if (a < 0.003) discard;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;
