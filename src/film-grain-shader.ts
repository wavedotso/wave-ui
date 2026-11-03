export const vertexShader = `#version 300 es
in vec2 position;
out vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const fragmentShader = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uDensity;
uniform float uOpacity;
uniform float uFps;
uniform vec3 uColor;

in vec2 vUv;
out vec4 fragColor;

// Integer hash (two rounds of a permuted congruential mix): three
// independent values from three inputs, identical on every GPU. No sine:
// a sine hash loses precision on some mobile GPUs and draws faint stripes.
uvec3 hash3(uvec3 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return v;
}

const float UNIT = 1.0 / 4294967295.0;

// A pixel's fine speck: the average of two values, so it gathers round the
// middle as film grain does, with fewer pure darks and lights.
float fine(uvec2 pixel, uint frame) {
  uvec3 h = hash3(uvec3(pixel, frame));
  return (float(h.x) + float(h.y)) * (0.5 * UNIT);
}

// Film response curve (soft toe + shoulder rolloff)
float filmCurve(float x) {
  return smoothstep(0.0, 0.2, x) * (1.0 - smoothstep(0.8, 1.0, x));
}

void main() {
  uvec2 p = uvec2(gl_FragCoord.xy);
  // The grain changes once per frame of its fps; the component only draws
  // when this changes.
  uint frame = uint(floor(uTime * uFps));

  // Multi-scale grain. One hash per 4x4 block gives its coarse speck, its
  // clumping and, a byte for each 2x2 quarter, its medium specks.
  uvec3 block = hash3(uvec3(p >> 2u, frame ^ 0x9e3779b9u));
  uint quarter = ((p.y >> 1u) & 1u) * 2u + ((p.x >> 1u) & 1u);
  float medium = float((block.z >> (quarter * 8u)) & 255u) / 255.0;
  float coarse = float(block.x) * UNIT;
  float grain = fine(p, frame) * 0.65 + medium * 0.25 + coarse * 0.10;

  // Emulsion clumping (organic structure)
  grain *= mix(0.75, 1.35, float(block.y) * UNIT);

  // Density threshold
  grain = smoothstep(1.0 - uDensity, 1.0, grain);

  // Film response curve (replaces raw pow gamma)
  grain = filmCurve(grain);

  // Micro-blur: sample neighbors for optical diffusion
  float n1 = fine(p + uvec2(1u, 0u), frame);
  float n2 = fine(p - uvec2(1u, 0u), frame);
  float n3 = fine(p + uvec2(0u, 1u), frame);
  float n4 = fine(p - uvec2(0u, 1u), frame);
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

  fragColor = vec4(color, grain * uOpacity);
}
`;
