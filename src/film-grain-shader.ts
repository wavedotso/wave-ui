export const vertexShader = `
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

export const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uDensity;
uniform float uOpacity;
uniform float uFps;
uniform vec3 uColor;

varying vec2 vUv;

// Stable hash
float hash(vec2 p, float seed) {
  return fract(sin(dot(p + seed, vec2(127.1, 311.7))) * 43758.5453123);
}

// Film response curve (soft toe + shoulder rolloff)
float filmCurve(float x) {
  return smoothstep(0.0, 0.2, x) * (1.0 - smoothstep(0.8, 1.0, x));
}

void main() {
  vec2 uv = gl_FragCoord.xy;
  vec2 p = floor(uv);

  // Temporal coherence: blend between current and next frame seed
  float frame = floor(uTime * uFps);
  float t = fract(uTime * uFps);
  float seed = frame * 0.1731;

  // Multi-scale grain with inter-frame blending on fine layer
  float fineA = hash(p, seed);
  float fineB = hash(p, seed + 0.1731);
  float fine = mix(fineA, fineB, t);

  float medium = hash(floor(uv * 0.5), seed + 3.1);
  float coarse = hash(floor(uv * 0.25), seed + 7.93);

  float grain = fine * 0.65 + medium * 0.25 + coarse * 0.10;

  // Emulsion clumping (organic structure)
  float cluster = hash(floor(uv * 0.18), seed + 9.2);
  grain *= mix(0.75, 1.35, cluster);

  // Density threshold
  grain = smoothstep(1.0 - uDensity, 1.0, grain);

  // Film response curve (replaces raw pow gamma)
  grain = filmCurve(grain);

  // Micro-blur: sample neighbors for optical diffusion
  float n1 = hash(p + vec2(1.0, 0.0), seed);
  float n2 = hash(p - vec2(1.0, 0.0), seed);
  float n3 = hash(p + vec2(0.0, 1.0), seed);
  float n4 = hash(p - vec2(0.0, 1.0), seed);
  float neighbors = (n1 + n2 + n3 + n4) * 0.25;
  grain = mix(grain, neighbors, 0.15);

  // Chromatic aberration (reuse neighbor hashes)
  float rShift = n1 * 0.015;
  float bShift = n2 * 0.015;

  vec3 color = uColor * vec3(
    grain + rShift,
    grain,
    grain + bShift
  );

  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, grain * uOpacity);
}
`
