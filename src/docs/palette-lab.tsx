"use client";

/**
 * The Wave Light Curve and the Wave Hues Drift, the two rules every Wave Palette
 * is grown on, and the figures that show them on the docs page under Colors.
 * Storybook-only.
 */

import * as React from "react";

/* ---------------------------------------------------------------------------
 * The process
 * ------------------------------------------------------------------------- */

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
type Step = (typeof STEPS)[number];

/** Wave's darkest text and the white used on fills: the two inks of the rule. */
const DARK_INK = "#0C0D09";
const WHITE_INK = "#FFFFFF";

type Gamut = "srgb" | "p3";
type Lch = { l: number; c: number; h: number };
type Rgb = [number, number, number];

const toLinear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;

/** OKLCH to linear sRGB, unclamped, so out-of-gamut colours can be detected. */
function linearRgbOf({ l, c, h }: Lch): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const lng = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const med = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sht = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * lng - 3.3077115913 * med + 0.2309699292 * sht,
    -1.2684380046 * lng + 2.6097574011 * med - 0.3413193965 * sht,
    -0.0041960863 * lng - 0.7034186147 * med + 1.707614701 * sht,
  ];
}

/** Linear sRGB to linear Display-P3. */
const linearP3Of = ([r, g, b]: Rgb): Rgb => [
  0.8224621 * r + 0.177538 * g,
  0.0331941 * r + 0.9668058 * g,
  0.0170827 * r + 0.0723974 * g + 0.9105199 * b,
];

function inGamut(lch: Lch, gamut: Gamut) {
  const rgb = linearRgbOf(lch);
  return (gamut === "p3" ? linearP3Of(rgb) : rgb).every(
    (v) => v >= -1e-4 && v <= 1 + 1e-4,
  );
}

/** The most chroma a screen can show at this lightness and hue. */
function maxChroma(l: number, h: number, gamut: Gamut) {
  let low = 0;
  let high = 0.5;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (inGamut({ l, c: mid, h }, gamut)) low = mid;
    else high = mid;
  }
  return low;
}

function rgbOfHex(hex: string): Rgb {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255) as Rgb;
}

const yOfLinear = ([r, g, b]: Rgb) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
/** WCAG luminance of a colour, in full (true for P3 colours too). */
const yOf = (lch: Lch) => yOfLinear(linearRgbOf(lch));
const luminanceOf = (rgb: Rgb) => yOfLinear(rgb.map(toLinear) as Rgb);
const ratio = (one: number, other: number) =>
  (Math.max(one, other) + 0.05) / (Math.min(one, other) + 0.05);

const round = ({ l, c, h }: Lch): Lch => ({
  l: Math.round(l * 1000) / 1000,
  c: Math.round(c * 1000) / 1000,
  h: Math.round(h * 10) / 10,
});
const cssOf = ({ l, c, h }: Lch) =>
  `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h})`;

/**
 * A colour at luminance `y`: hue `h` and `share` of the most chroma the gamut
 * can hold (never more than `cap`), at the lightness that gives it that
 * luminance.
 */
function syncedTo(
  y: number,
  h: number,
  share: number,
  gamut: Gamut,
  cap = Infinity,
): Lch {
  const at = (l: number) => ({
    l,
    c: Math.min(share * maxChroma(l, h, gamut), cap),
    h,
  });
  let low = 0;
  let high = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (yOf(at(mid)) < y) low = mid;
    else high = mid;
  }
  return at((low + high) / 2);
}

const DARK_Y = luminanceOf(rgbOfHex(DARK_INK));
const WHITE_Y = luminanceOf(rgbOfHex(WHITE_INK));

/* ---------------------------------------------------------------------------
 * Curves
 * ------------------------------------------------------------------------- */

/**
 * A curve: the luminance every palette takes at each step, so a step means the
 * same contrast in every colour.
 */
type Curve = Record<Step, number>;

/** A curve from lightness: for a neutral, OKLab lightness cubed is luminance. */
const curveOf = (lightness: Record<Step, number>): Curve =>
  Object.fromEntries(
    STEPS.map((step) => [step, lightness[step] ** 3]),
  ) as Curve;

/**
 * A palette on a curve: its hue at 500, and optionally an exact 500 (Wave
 * Blue's, which stays locked).
 */
type OnCurve = {
  name: string;
  hue: number;
  at500?: string;
};

/** Hue families and how each turns from its 500, in degrees, at 50 to 950. */
type Turns = { at: number; turn: number[] }[];

/**
 * How each of Tailwind v4's hue families turns from its 500 as it lightens
 * and darkens, in degrees, at 50 to 950: yellow's tints lean lemon and its
 * darks turn amber, blue's tints lean cyan and its darks lean indigo. A hue
 * between two families turns as a blend of them.
 */
const TAILWIND_TURNS: Turns = [
  { at: 16.4, turn: [-4, -3.9, -6.4, -4.8, -3, 0, 1.1, 0.5, -2.7, -6.2, -4.3] },
  { at: 25.3, turn: [-8, -7.6, -7, -5.8, -3.1, 0, 2, 2.2, 1.6, 0.4, 0.7] },
  {
    at: 47.6,
    turn: [26.1, 27.6, 23.1, 18.7, 8.3, 0, -6.5, -9.2, -10.3, -9.4, -11.3],
  },
  {
    at: 70.1,
    turn: [25.2, 25.5, 25.7, 21.5, 14.3, 0, -11.8, -21.1, -23.9, -24.2, -24.4],
  },
  {
    at: 86,
    turn: [16.2, 17.1, 15.5, 12.1, 5.9, 0, -10.2, -19.6, -24.1, -28.3, -32.2],
  },
  {
    at: 130.8,
    turn: [-10.1, -8.5, -6.5, -4.2, -2, 0, 0.8, 0.7, 0.1, 0.2, 1.3],
  },
  { at: 149.6, turn: [6.2, 7.2, 6.4, 4.9, 2.1, 0, -0.4, 0.5, 1.7, 3, 3.4] },
  { at: 162.5, turn: [3.6, 0.6, 1.7, 2.5, 0.7, 0, 0.7, 3.1, 4.4, 6.5, 10.1] },
  {
    at: 182.5,
    turn: [-1.8, -1.7, -2.1, -1.4, -0.6, 0, 2.2, 3.9, 5.7, 5.9, 10],
  },
  {
    at: 215.2,
    turn: [-14.3, -11.8, -10.2, -8.1, -3.7, 0, 6.5, 7.9, 9.1, 12.2, 14.5],
  },
  { at: 237.3, turn: [-0.7, -0.5, -6.4, -7, -4.7, 0, 4.6, 5.4, 3.5, 3.6, 5.8] },
  { at: 259.8, turn: [-5.2, -4.2, -5.7, -8, -5.2, 0, 3.1, 4.6, 5.8, 5.7, 6.1] },
  {
    at: 277.1,
    turn: [-4.8, -4.3, -3.1, -2.4, -0.2, 0, -0.2, -0.1, 0.2, 1.6, 4.2],
  },
  { at: 292.7, turn: [1, 1.9, 0.6, 0.9, 0.8, 0, 0.3, -0.1, 0, 1, -1.6] },
  { at: 303.9, turn: [4.4, 3.3, 2.8, 2.5, 1.6, 0, -1.6, -2, -0.2, 1.1, -1.2] },
  { at: 322.1, turn: [-2.1, -3.3, -2.5, -0.7, 0, 0, 0.7, 1.8, 2.4, 3.5, 3.5] },
  {
    at: 354.3,
    turn: [-11.1, -12.1, -11.1, -8.3, -4.5, 0, 6.3, 9.7, 9.5, 8.1, 9.6],
  },
];

/**
 * How each of Radix Colors' (3.0) hue families turns, read by lightness: the
 * hue at each step's lightness on the curve, from the hue at 500's, with the
 * solid steps (9 and 10) and the near-whites left out. Beyond its darkest
 * step a family keeps that hue.
 */
const RADIX_TURNS: Turns = [
  {
    at: 3.8,
    turn: [-7.5, -7.5, -8.1, -8.9, -6.4, 0, -2.4, -5.3, -6.9, -6.9, -6.9],
  }, // crimson
  {
    at: 13.3,
    turn: [-6.1, -5.8, -5.9, -6.2, -4.5, 0, -1, -2.5, -3.3, -3.3, -3.3],
  }, // ruby
  {
    at: 24.9,
    turn: [-11, -10.4, -7.9, -6.6, -4.1, 0, -3.3, -6.5, -8.3, -8.3, -8.3],
  }, // red
  {
    at: 32.7,
    turn: [-0.9, -0.1, -0.1, -0.5, -0.3, 0, -1.1, -1.9, -2.3, -2.3, -2.3],
  }, // tomato
  {
    at: 42.6,
    turn: [36.5, 34.9, 28.9, 17.4, 7.7, 0, -0.8, -1.5, -1.7, -1.7, -1.7],
  }, // orange
  {
    at: 63.7,
    turn: [36.3, 34.3, 30.9, 20, 8.1, 0, -4.5, -8, -9.5, -9.5, -9.5],
  }, // amber
  { at: 77.0, turn: [27, 23.9, 18.9, 14.5, 7.5, 0, 4.8, 8.6, 9.9, 9.9, 9.9] }, // yellow
  {
    at: 128.6,
    turn: [-9.9, -9.1, -6.3, -3.5, -0.3, 0, -3.1, -6.3, -7.6, -7.6, -7.6],
  }, // lime
  { at: 147.4, turn: [-2, -1.3, -1.2, -0.2, 0.6, 0, 0.2, 0.8, 1.2, 1.2, 1.2] }, // grass
  {
    at: 159.6,
    turn: [-3.7, -3.4, -2.2, -0.6, 0.5, 0, 1.7, 3.5, 4.9, 4.9, 4.9],
  }, // green
  {
    at: 170.4,
    turn: [-10.1, -8.3, -5, -0.9, 2.1, 0, -0.3, -0.3, -0.3, -0.3, -0.3],
  }, // jade
  { at: 176.2, turn: [2.8, 2.4, 1.9, 2.1, 1.3, 0, 1.1, 3.9, 5.1, 5.1, 5.1] }, // mint
  { at: 179.1, turn: [2.7, 1.5, 2.3, 3.5, 3.2, 0, 2.1, 4.3, 5.9, 5.9, 5.9] }, // teal
  {
    at: 219.9,
    turn: [-17.3, -15.6, -13, -10.2, -5.9, 0, 0.1, -0.6, -1, -1, -1],
  }, // cyan
  {
    at: 231.7,
    turn: [-12, -12.4, -10.2, -6.3, -2.5, 0, 4.2, 8.7, 10.6, 10.6, 10.6],
  }, // sky
  {
    at: 251.7,
    turn: [-13.1, -15.7, -10.3, -8.7, -6.2, 0, 3.1, 5.4, 7.1, 7.1, 7.1],
  }, // blue
  { at: 268.0, turn: [1.8, 1.8, 2.1, 3.4, 1.8, 0, -0.5, 0.1, 0.6, 0.6, 0.6] }, // indigo
  {
    at: 280.2,
    turn: [3.6, 3.6, 2.7, 2.5, 0.9, 0, -0.9, -1.9, -2.7, -2.7, -2.7],
  }, // iris
  {
    at: 289.7,
    turn: [7.9, 7.9, 4.9, 3.9, 2.2, 0, -1.5, -2.3, -3.1, -3.1, -3.1],
  }, // violet
  { at: 306.3, turn: [5.4, 5.9, 4.9, 3.4, 1.2, 0, -1, -1.8, -2.5, -2.5, -2.5] }, // purple
  {
    at: 322.0,
    turn: [3.8, 3.4, 2.9, 1.3, 0.2, 0, -0.2, -0.4, -0.5, -0.5, -0.5],
  }, // plum
  {
    at: 347.1,
    turn: [-4.8, -5.4, -6.7, -5.2, -3.6, 0, -0.6, -1.4, -1.7, -1.7, -1.7],
  }, // pink
];

/**
 * How far a hue (at 500) turns at a step: a blend of the two nearest families
 * in a table.
 */
function turnAt(table: Turns, hue: number, step: Step): number {
  const i = STEPS.indexOf(step);
  const at = (k: number) => table[(k + table.length) % table.length];
  const next = table.findIndex((f) => f.at > hue);
  const upper = at(next === -1 ? 0 : next);
  const lower = at((next === -1 ? table.length : next) - 1);
  if (!upper || !lower) return 0;
  const span = (((upper.at - lower.at) % 360) + 360) % 360 || 360;
  const t = ((((hue - lower.at) % 360) + 360) % 360) / span;
  return (lower.turn[i] ?? 0) * (1 - t) + (upper.turn[i] ?? 0) * t;
}

/**
 * How much of the most chroma the gamut holds each step takes on a curve: the
 * full gamut at 500, the fill people see most (as Wave Blue does),
 * tapering smoothly toward the tints and the near-blacks.
 */
const PEAK_SHARE: Record<Step, number> = {
  50: 0.8,
  100: 0.82,
  200: 0.86,
  300: 0.92,
  400: 0.97,
  500: 1,
  600: 0.97,
  700: 0.92,
  800: 0.86,
  900: 0.8,
  950: 0.75,
};

/**
 * The most chroma a tint takes on a curve: Tailwind v4's most colourful tint
 * at each step (its yellows and limes). A light green or cyan could hold far
 * more, and turns neon if it does. 500 and darker are not capped.
 */
const TINT_CAP: Partial<Record<Step, number>> = {
  50: 0.031,
  100: 0.071,
  200: 0.129,
  300: 0.196,
  400: 0.238,
};

/**
 * A hue-drift rule: how far a hue (its value at 500) turns at a step, in
 * degrees.
 */
type Drift = (hue: number, step: Step) => number;

/**
 * The Wave Hues Drift: how a hue turns as it lightens and darkens. The tints
 * take Radix's turns, its most designed steps; the darks take Tailwind's,
 * which keep warm hues rich instead of olive. Then smoothed: a path only bends
 * further as it moves away from 500, never back, never doubles back through
 * 500 (when both halves turn the same way, the gentler half stays straight).
 */
function waveHuesDrift(hue: number, step: Step): number {
  const mid = STEPS.indexOf(500);
  const raw = STEPS.map((s, k) =>
    k < mid
      ? turnAt(RADIX_TURNS, hue, s)
      : k > mid
        ? turnAt(TAILWIND_TURNS, hue, s)
        : 0,
  );
  // One half's turns, from 500 outward, made to grow in one direction only:
  // the direction of its largest turn.
  const smooth = (outward: number[]) => {
    const largest = outward.reduce(
      (most, t) => (Math.abs(t) > Math.abs(most) ? t : most),
      0,
    );
    const sign = Math.sign(largest);
    let reach = 0;
    return outward.map((t) => {
      reach = Math.max(reach, sign * t);
      return sign * reach;
    });
  };
  // From 500 outward: 400 first, 50 last.
  const light = smooth(
    Array.from({ length: mid }, (_, k) => raw[mid - 1 - k] ?? 0),
  );
  const dark = smooth(raw.slice(mid + 1));
  const lightEnd = light[light.length - 1] ?? 0;
  const darkEnd = dark[dark.length - 1] ?? 0;
  // Both halves turning the same way would kink at 500: straighten the gentler.
  if (Math.sign(lightEnd) === Math.sign(darkEnd) && lightEnd !== 0) {
    if (Math.abs(lightEnd) < Math.abs(darkEnd)) light.fill(0);
    else dark.fill(0);
  }
  const path = [
    ...Array.from({ length: mid }, (_, k) => light[mid - 1 - k] ?? 0),
    0,
    ...dark,
  ];
  return path[STEPS.indexOf(step)] ?? 0;
}

/** The drifts on the map: the Wave Hues Drift, and no drift for reference. */
const DRIFTS: { name: string; note: string; turn: Drift }[] = [
  {
    name: "Wave Hues Drift",
    note: "warms the light tints toward peach or lemon, while the darks deepen into amber, rust or indigo, never olive.",
    turn: (hue, step) => waveHuesDrift(hue, step),
  },
  {
    name: "No drift",
    note: "holds a single hue across every step, shown for reference.",
    turn: () => 0,
  },
];

/**
 * A map of hue drift under one rule: the hue wheel across, the steps down,
 * each point painted the colour that hue takes at that step on the curve, and
 * each palette's path drawn on it.
 */
function DriftMap({
  curve,
  specs,
  drift,
}: {
  curve: Curve;
  specs: OnCurve[];
  drift: Drift;
}) {
  const left = 40;
  const top = 78;
  const row = 28;
  const width = 1080;
  const height = top + row * STEPS.length + 8;
  // The wheel starts between purple and pink, where no palette's path runs,
  // so none is split across the edges.
  const origin = 328;
  const x = (h: number) =>
    left + (((((h - origin) % 360) + 360) % 360) / 360) * width;
  const y = (i: number) => top + i * row + row / 2;
  const cells = React.useMemo(
    () =>
      STEPS.flatMap((step, i) =>
        Array.from({ length: 120 }, (_, k) => {
          const h = origin + k * 3 + 1.5;
          const lch = syncedTo(
            curve[step],
            h,
            PEAK_SHARE[step],
            "p3",
            TINT_CAP[step],
          );
          return { key: `${step}-${k}`, i, k, fill: cssOf(round(lch)) };
        }),
      ),
    [curve],
  );
  const paths = React.useMemo(
    () =>
      specs.map((spec) => ({
        spec,
        hues: STEPS.map(
          (step) => (spec.hue + drift(spec.hue, step) + 360) % 360,
        ),
      })),
    [specs, drift],
  );
  // A path, broken where it wraps round the hue wheel.
  const segments = (hues: number[]) => {
    const runs: { x: number; y: number }[][] = [[]];
    hues.forEach((h, i) => {
      const point = { x: x(h), y: y(i) };
      const run = runs[runs.length - 1];
      const last = run?.[run.length - 1];
      if (run && last && Math.abs(point.x - last.x) > width / 2) runs.push([]);
      runs[runs.length - 1]?.push(point);
    });
    return runs.map((run) => run.map((p) => `${p.x},${p.y}`).join(" "));
  };
  return (
    <svg
      viewBox={`0 0 ${left + width + 8} ${height}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="Hue drift of every palette"
    >
      {cells.map((c) => (
        <rect
          key={c.key}
          x={left + c.k * (width / 120)}
          y={top + c.i * row}
          width={width / 120 + 0.5}
          height={row + 0.5}
          fill={c.fill}
        />
      ))}
      {STEPS.map((step, i) => (
        <text
          key={step}
          x={left - 6}
          y={y(i) + 4}
          textAnchor="end"
          fontSize={11}
          fontFamily={mono}
          fill="currentColor"
        >
          {step}
        </text>
      ))}
      {paths.map(({ spec, hues }) => (
        <g key={spec.name}>
          {segments(hues).map((points) => (
            <g key={points}>
              <polyline
                points={points}
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity={0.85}
                strokeWidth={3.6}
              />
              <polyline
                points={points}
                fill="none"
                stroke="#0C0D09"
                strokeWidth={1.6}
              />
            </g>
          ))}
          {hues.map((h, i) => (
            <circle
              key={STEPS[i]}
              cx={x(h)}
              cy={y(i)}
              r={2.6}
              fill="#FFFFFF"
              stroke="#0C0D09"
              strokeWidth={1.2}
            />
          ))}
          <text
            x={x(hues[0] ?? spec.hue)}
            y={top - 8}
            fontSize={11}
            fontWeight={spec.name === "wave" ? 700 : 500}
            fill="currentColor"
            transform={`rotate(-50 ${x(hues[0] ?? spec.hue)} ${top - 8})`}
          >
            {paletteName(spec.name)}
          </text>
        </g>
      ))}
    </svg>
  );
}

/**
 * The Wave Light Curve, set by lightness. 300 just clears dark-theme text on highlighted
 * rows, 500 holds white with a little margin (4.56), and 600 reads as text on
 * Paper; the gaps rise smoothly to the middle (0.12) and ease off toward both
 * ends.
 */
const WAVE_LIGHT_CURVE: Curve = curveOf({
  50: 0.975,
  100: 0.945,
  200: 0.89,
  300: 0.806,
  400: 0.686,
  500: 0.565,
  600: 0.465,
  700: 0.385,
  800: 0.315,
  900: 0.255,
  950: 0.2,
});

/** A palette's name as Wave says it: Wave Blue, Wave Indigo, Wave Purple… */
const paletteName = (name: string) =>
  name === "wave"
    ? "Wave Blue"
    : `Wave ${name[0]?.toUpperCase()}${name.slice(1)}`;

/**
 * The Wave Palettes: Wave Blue and its nine signature colours, each by its hue
 * at 500, placed by hand in a space of its own on the colour wheel and evenly
 * apart from its neighbours. In order around the wheel from Wave Blue.
 */
const WAVE_HUES: OnCurve[] = [
  { name: "wave", hue: 255, at500: "#0074DE" },
  // Wave Indigo: moved from 278.3 to 283, into an open space, with more room
  // from Wave Blue.
  { name: "indigo", hue: 283 },
  // Wave Purple: moved from 302 to 309, into an open space, evenly apart from
  // Wave Indigo and Wave Pink.
  { name: "purple", hue: 309 },
  // Wave Pink: moved from 353.5 to 342, off the crowded hot pinks, evenly
  // apart from Wave Purple and Wave Red.
  { name: "pink", hue: 342 },
  // Wave Red: moved from 24.7 to 21, further from the warning orange. Its 500
  // keeps 91% of the most saturation the curve gives, toned down as before.
  { name: "red", hue: 21, at500: "#E22841" },
  // Wave Orange moved from 47.1 to 49.5 and Wave Yellow from 82 to 88,
  // together: the warm colours space evenly from Wave Red to Wave Lime,
  // orange stays orange and yellow stays golden.
  { name: "orange", hue: 49.5 },
  { name: "yellow", hue: 88 },
  // Wave Lime: kept at 124, already in a space of its own, evenly apart from
  // Wave Yellow and Wave Green.
  { name: "lime", hue: 124 },
  // Wave Green: moved from 150.1 to 160, cooler, and evenly apart from Wave
  // Lime and Wave Teal.
  { name: "green", hue: 160 },
  // Wave Teal: the settled teal's hue (#008291), whose 500 the curve already
  // gives.
  { name: "teal", hue: 208.9 },
];

/** A drift map with its one-line legend underneath. */
function DriftFigure({
  curve,
  specs,
  rule,
}: {
  curve: Curve;
  specs: OnCurve[];
  rule: (typeof DRIFTS)[number];
}) {
  return (
    <figure style={{ display: "grid", gap: 8, margin: 0 }}>
      <DriftMap curve={curve} specs={specs} drift={rule.turn} />
      <figcaption style={{ textAlign: "center", fontSize: 13 }}>
        <span style={{ fontWeight: 600 }}>{rule.name}</span>{" "}
        <span className="text-muted">{rule.note}</span>
      </figcaption>
    </figure>
  );
}

/** The curve itself: each step's lightness, the gap above it, and contrast. */
function CurveRow({ curve }: { curve: Curve }) {
  // Sizes set on every line, so a docs page's own type can't override them.
  const line = { fontFamily: mono, fontSize: 11, lineHeight: 1.5 };
  const rule = (
    <div className="border-t border-contour" style={{ margin: "6px 0" }} />
  );
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(11, 1fr)",
        gap: 8,
      }}
    >
      {STEPS.map((step, i) => {
        const y = curve[step];
        const above = STEPS[i - 1];
        const gap = above ? Math.cbrt(curve[above]) - Math.cbrt(y) : 0;
        const white = step >= 500;
        return (
          <div
            key={step}
            className="bg-surface ring-1 ring-contour"
            style={{ borderRadius: 8, padding: 8, display: "grid" }}
          >
            <span style={{ ...line, fontWeight: 700 }}>{step}</span>
            <span style={line}>L {Math.cbrt(y).toFixed(3)}</span>
            {rule}
            <span className="text-muted" style={line}>
              Gap {gap === 0 ? "0" : gap.toFixed(3)}
            </span>
            {rule}
            <span style={line}>{white ? "white" : "dark"}</span>
            <span style={line}>{fmt(ratio(y, white ? WHITE_Y : DARK_Y))}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

const fmt = (n: number) => n.toFixed(2);
const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

/** The Wave Light Curve's steps, for the docs page under Colors. */
function WaveLightCurve() {
  return <CurveRow curve={WAVE_LIGHT_CURVE} />;
}

/** The Wave Hues Drift map, with no drift for reference, for the docs page. */
function WaveHuesDrift() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      {DRIFTS.map((rule) => (
        <DriftFigure
          key={rule.name}
          curve={WAVE_LIGHT_CURVE}
          specs={WAVE_HUES}
          rule={rule}
        />
      ))}
    </div>
  );
}

/**
 * A palette grown from a hue at 500 on the Wave Light Curve with the Wave Hues
 * Drift, for previews: each step in P3 and in sRGB, as the tokens are made.
 * `share500` sets how much of the most saturation the 500 takes, for a
 * palette whose 500 is toned down, as red's is.
 */
function rampOf(hue: number, share500?: number) {
  return STEPS.map((step) => {
    const h = (hue + waveHuesDrift(hue, step) + 360) % 360;
    const at = (gamut: Gamut) =>
      cssOf(
        round(
          syncedTo(
            WAVE_LIGHT_CURVE[step],
            h,
            step === 500 && share500 !== undefined
              ? share500
              : PEAK_SHARE[step],
            gamut,
            TINT_CAP[step],
          ),
        ),
      );
    return { step, p3: at("p3"), srgb: at("srgb") };
  });
}

export { rampOf, WaveHuesDrift, WaveLightCurve };
