"use client";

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { rampOf } from "./palette-lab";

const meta = {
  title: "Colors/Palettes",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Every color token in Wave, grouped by role. **Palettes** are the Wave Palettes: Wave Blue and its nine signature colours, from Wave Indigo to Wave Teal, each hue placed by hand and every step grown on the Wave Light Curve with the Wave Hues Drift, plus Wave Gray, the curve in pure grey. **Themes** are the three neutral ramps (Graphite, Ink and Paper), and **Interface** is the semantic layer components actually consume. Swatches read the live CSS variables, so they reflect the theme selected in the toolbar.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Token = { name: string; label?: string; fg?: string; bg?: string };
/** A set of single tokens shown as tiles, or a whole ramp shown as one row. */
type Group = { label: string; note?: string } & (
  | { tokens: Token[] }
  | { ramp: string }
  | { hue: number; share500?: number }
  | { swatches: readonly string[]; steps?: readonly number[] }
);

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/**
 * Graphite's and Paper's mid greys are too light for white text at their 500,
 * so those two take their text colour by luminance; every other ramp, Ink
 * included, carries white text from 500.
 */
const LUMINANCE_TEXT = new Set(["graphite", "paper"]);

// The Wave Palettes, shared by every theme. A step has the same
// contrast in every palette: dark text below 500, white from 500.
const PALETTE_GROUPS: Group[] = [
  {
    label: "Wave Blue",
    note: "The brand ramp. `primary`, `info` and the focus ring resolve to wave-blue-500.",
    ramp: "wave-blue",
  },
  { label: "Wave Indigo", ramp: "wave-indigo" },
  { label: "Wave Purple", ramp: "wave-purple" },
  { label: "Wave Pink", ramp: "wave-pink" },
  {
    label: "Wave Red",
    note: "`danger` resolves to wave-red-500.",
    ramp: "wave-red",
  },
  {
    label: "Wave Orange",
    note: "`warning` resolves to wave-orange-500.",
    ramp: "wave-orange",
  },
  { label: "Wave Yellow", ramp: "wave-yellow" },
  { label: "Wave Lime", ramp: "wave-lime" },
  {
    label: "Wave Green",
    note: "`success` resolves to wave-green-500.",
    ramp: "wave-green",
  },
  { label: "Wave Teal", ramp: "wave-teal" },
  {
    label: "Wave Gray",
    note: "Pure grey on the Wave Light Curve, for neutral badges and labels beside the colours.",
    ramp: "wave-gray",
  },
];

// The three neutral ramps — one per theme. Each theme's semantic layer references
// its ramp directly: Paper → light, Graphite → default dark, Ink → night.
const THEME_GROUPS: Group[] = [
  {
    label: "Graphite — neutral (dark)",
    note: "The neutral dark theme — the dark-OS default, and pinned with `.graphite`.",
    ramp: "graphite",
  },
  {
    label: "Ink — navy (night)",
    note: "The premium night theme — opt-in only, active under `.ink`.",
    ramp: "ink",
  },
  {
    label: "Paper — warm (light)",
    note: "The light theme — the light-OS default, and pinned with `.paper`.",
    ramp: "paper",
  },
];

// The semantic layer — what components actually consume. Resolves through the
// active theme, so these are the tokens to override when re-skinning.
const INTERFACE_GROUPS: Group[] = [
  {
    label: "Surfaces",
    note: "Backgrounds = elevation.",
    tokens: [
      { name: "--foundation", fg: "--contrast" },
      { name: "--surface", fg: "--contrast" },
      { name: "--elevated", fg: "--contrast" },
    ],
  },
  {
    label: "Contrast",
    note: "Text / icons = emphasis (contrast → muted → soft).",
    tokens: [{ name: "--contrast" }, { name: "--muted" }, { name: "--soft" }],
  },
  {
    label: "Inverse",
    note: "Inverted neutral pair for surfaces like the dark tooltip.",
    tokens: [
      { name: "--surface-inverse", fg: "--contrast-inverse" },
      { name: "--contrast-inverse", fg: "--surface-inverse" },
    ],
  },
  {
    label: "Brand roles",
    note: "primary · secondary · accent. Text on the saturated fills is white; on the neutral secondary it is contrast.",
    tokens: [
      { name: "--primary", fg: "white" },
      { name: "--secondary", fg: "--contrast" },
      { name: "--accent", fg: "white" },
    ],
  },
  {
    label: "Status",
    note: "Semantic status colors, each its palette's 500 in every theme: `danger` Wave Red, `success` Wave Green, `warning` Wave Orange, `info` Wave Blue. Each `-text` token is that colour as words and icons: the 600 in Paper, the 400 in Ink, and in Graphite each status a touch lighter than its 400, so it reads on Graphite's menus.",
    tokens: [
      { name: "--danger" },
      { name: "--danger-text" },
      { name: "--success" },
      { name: "--success-text" },
      { name: "--warning" },
      { name: "--warning-text" },
      { name: "--info" },
      { name: "--info-text" },
    ],
  },
  {
    label: "Form",
    note: "The theme's foreground made translucent, at three strengths, the way a form is drawn: `contour` (where a shape ends), `highlight` (where attention lands), `shade` (a control's body, and the intense border). The ring is brand-themed (focus = primary).",
    tokens: [
      { name: "--contour" },
      { name: "--highlight" },
      { name: "--shade" },
      { name: "--focus" },
    ],
  },
  {
    label: "Presence",
    note: "Status dots. `invisible` resolves to `--foundation` — the page colour itself — so paired with a border it reads as a hollow/ghost ring: present, but blended away.",
    tokens: [
      { name: "--presence-online" },
      { name: "--presence-away" },
      { name: "--presence-busy" },
      { name: "--presence-invisible" },
    ],
  },
  {
    label: "Shadow",
    tokens: [
      {
        name: "--shadow-strength",
        label: "shadow",
        bg: "oklch(from var(--shadow-color, var(--foundation)) calc(l * 0.16) c h / var(--shadow-strength))",
      },
    ],
  },
];

/** Format a computed `rgb()/rgba()` string as hex (opaque) or rgba (with alpha). */
function formatColor(value: string): string {
  const match = value.match(/^rgba?\(([^)]+)\)$/);
  if (!match) return value;
  const parts = (match[1] ?? "").split(/[,\s/]+/).filter(Boolean);
  const r = Number(parts[0]);
  const g = Number(parts[1]);
  const b = Number(parts[2]);
  const a = parts[3] !== undefined ? Number(parts[3]) : 1;
  if ([r, g, b].some(Number.isNaN)) return value;
  if (a < 1) return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`.toUpperCase();
}

function Swatch({
  token: name,
  fg,
  label: labelOverride,
  bg,
}: {
  token: string;
  fg?: string;
  label?: string;
  bg?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = React.useState("");

  React.useEffect(() => {
    if (!ref.current) return;
    // Read the RESOLVED background-color so tokens that alias another var
    // (e.g. `var(--paper-200)` → the active theme's ramp) display real hex/rgba.
    setResolved(formatColor(getComputedStyle(ref.current).backgroundColor));
    // Resolve once on mount — the swatch's bg is a live CSS var (updates with
    // the theme on its own); only the printed hex is a mount-time snapshot.
  }, []);

  const label = labelOverride ?? name.replace(/^--(color-)?/, "");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        ref={ref}
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          backgroundColor: bg ?? `var(${name})`,
          border: "1px solid var(--contour)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 11,
          color: fg ? (fg.startsWith("--") ? `var(${fg})` : fg) : undefined,
          fontWeight: 600,
        }}
      >
        {fg ? "Aa" : null}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "monospace",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--soft)",
            fontFamily: "monospace",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 180,
          }}
        >
          {resolved || "..."}
        </div>
      </div>
    </div>
  );
}

let fallbacks: Map<string, string> | null = null;

/**
 * A token's sRGB fallback: the value its own `:root` rule sets, outside the
 * Display-P3 block. On a P3 screen the live value is the P3 one, so the hex is
 * read from this instead, to match the hex written beside the token.
 */
function fallbackOf(token: string) {
  if (!fallbacks) {
    fallbacks = new Map();
    for (const sheet of document.styleSheets) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // A sheet from another origin can't be read.
      }
      for (const rule of rules) {
        if (
          !(rule instanceof CSSStyleRule) ||
          !rule.selectorText.includes(":root")
        )
          continue;
        for (const name of rule.style) {
          if (name.startsWith("--") && !fallbacks.has(name)) {
            fallbacks.set(name, rule.style.getPropertyValue(name).trim());
          }
        }
      }
    }
  }
  return fallbacks.get(token);
}

/**
 * One step of a ramp: its colour (a live token, or a preview), its sRGB
 * fallback as hex, and the contrast of the text it holds. On the Wave Palettes that text follows the
 * curve's rule, dark below 500 and white from 500; on a neutral ramp it is
 * whichever of the two reads better.
 */
function RampSwatch({
  color,
  fallback,
  step,
  hasRule = false,
}: {
  color: string;
  /** The sRGB value the hex is read from; the live colour when absent. */
  fallback?: string;
  step: number;
  hasRule?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hex, setHex] = React.useState("");
  const [isDark, setIsDark] = React.useState(false);
  const [ratio, setRatio] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const resolved = getComputedStyle(ref.current).backgroundColor;
    const linear = (v: number) =>
      v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4;
    // The hex is the token's sRGB fallback, the same on every screen, worked
    // out with the browser's own colour maths. A canvas read back can come out
    // a step off per channel once the screen's colour profile gets involved.
    const probe = document.createElement("span");
    probe.style.color = `color(from ${fallback ?? resolved} srgb r g b)`;
    ref.current.append(probe);
    const [r = 0, g = 0, b = 0] = (
      getComputedStyle(probe).color.match(/-?[\d.]+(?:e-?\d+)?/g) ?? []
    )
      .slice(0, 3)
      .map((v) => Math.round(Math.min(1, Math.max(0, Number(v))) * 255));
    probe.remove();
    // Luminance is read on a Display-P3 canvas, so a P3 colour is measured as
    // it is on screen, not squeezed into sRGB first.
    const p3 = document
      .createElement("canvas")
      .getContext("2d", { colorSpace: "display-p3" });
    if (!p3) return;
    p3.fillStyle = resolved;
    p3.fillRect(0, 0, 1, 1);
    const [pr = 0, pg = 0, pb = 0] = p3.getImageData(0, 0, 1, 1, {
      colorSpace: "display-p3",
    }).data;
    // Display-P3's luminance weights (its own primaries, D65 white).
    const luminance =
      0.2289746 * linear(pr) + 0.6917385 * linear(pg) + 0.0792869 * linear(pb);
    // Wave's darkest text, paper-950, as the dark ink.
    const ink = 0.004;
    // Below 0.19, white text reads better than the dark ink.
    const isWhiteText = hasRule ? step >= 500 : luminance < 0.19;
    setIsDark(isWhiteText);
    setRatio(
      isWhiteText
        ? 1.05 / (luminance + 0.05)
        : (luminance + 0.05) / (ink + 0.05),
    );
    setHex(
      `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase(),
    );
  }, [fallback, hasRule, step]);

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: color,
        color: isDark ? "white" : "var(--paper-950)",
        border: "1px solid var(--contour)",
        borderRadius: 8,
        padding: 6,
        minHeight: 66,
        display: "grid",
        alignContent: "space-between",
        fontFamily: "monospace",
        fontSize: 10,
      }}
    >
      <span style={{ fontWeight: 700 }}>{step}</span>
      <span style={{ display: "grid", gap: 2 }}>
        <span>{hex || "..."}</span>
        <span
          title={
            isDark ? "Contrast with white text" : "Contrast with dark text"
          }
        >
          {ratio === null
            ? "..."
            : `${ratio >= 4.5 ? "✓" : "✗"} ${ratio.toFixed(2)}`}
        </span>
      </span>
    </div>
  );
}

/** Shared swatch layout — one focused set of token groups, centered. */
function PaletteView({ groups }: { groups: Group[] }) {
  return (
    <div className="bg-foundation text-contrast p-10">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        {groups.map((group) => (
          <div key={group.label}>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--muted)",
                margin: "0 0 4px",
              }}
            >
              {group.label}
            </h3>
            {group.note ? (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--soft)",
                  margin: "0 0 12px",
                }}
              >
                {group.note}
              </p>
            ) : (
              <div style={{ height: 8 }} />
            )}
            {"ramp" in group || "hue" in group || "swatches" in group ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${"swatches" in group ? group.swatches.length : 11}, minmax(0, 1fr))`,
                  gap: 4,
                }}
              >
                {"swatches" in group
                  ? group.swatches.map((color, i) => (
                      <RampSwatch
                        key={i}
                        color={color}
                        fallback={
                          color.startsWith("var(")
                            ? fallbackOf(color.slice(4, -1))
                            : color
                        }
                        step={
                          ("steps" in group && group.steps
                            ? group.steps[i]
                            : STEPS[i]) ?? 0
                        }
                      />
                    ))
                  : "ramp" in group
                    ? STEPS.map((step) => (
                        <RampSwatch
                          key={step}
                          color={`var(--${group.ramp}-${step})`}
                          fallback={fallbackOf(`--${group.ramp}-${step}`)}
                          step={step}
                          hasRule={!LUMINANCE_TEXT.has(group.ramp)}
                        />
                      ))
                    : rampOf(group.hue, group.share500).map(
                        ({ step, p3, srgb }) => (
                          <RampSwatch
                            key={step}
                            color={
                              window.matchMedia("(color-gamut: p3)").matches
                                ? p3
                                : srgb
                            }
                            fallback={srgb}
                            step={step}
                            hasRule
                          />
                        ),
                      )}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                {group.tokens.map((t) => (
                  <Swatch
                    key={t.name}
                    token={t.name}
                    fg={"fg" in t ? t.fg : undefined}
                    bg={"bg" in t ? t.bg : undefined}
                    label={"label" in t ? t.label : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export const Palettes: Story = {
  render: () => <PaletteView groups={PALETTE_GROUPS} />,
};

export const Themes: Story = {
  render: () => <PaletteView groups={THEME_GROUPS} />,
};

export const Interface: Story = {
  render: () => <PaletteView groups={INTERFACE_GROUPS} />,
};
