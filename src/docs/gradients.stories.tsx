"use client";

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert, AlertDescription, AlertTitle } from "../alert";
import {
  AlertTriangleIcon,
  ErrorCircleIcon,
  InfoCircleIcon,
  SuccessCircleIcon,
} from "../lib/internal-icons";

const meta = {
  title: "Colors/Gradients",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The Alert component with a gradient of light along its edge, in translucent Wave Palette 500s over the theme's surface. The brand signature moves, a light running along its edge; the status alerts hold still, showing the whole gradient in each status's two colours. They exist because colour belongs in fills and symbols, not text: the status lives in the edge and the icon, the surface and words stay neutral and readable in every theme, and motion is kept for the brand alone.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const label: React.CSSProperties = { fontSize: 11, fontWeight: 600 };

const CALLOUTS = [
  {
    variant: "danger",
    palettes: ["wave-orange", "wave-red"],
    Icon: ErrorCircleIcon,
    title: "Couldn't post",
  },
  {
    variant: "success",
    palettes: ["wave-teal", "wave-green"],
    Icon: SuccessCircleIcon,
    title: "Post shared",
  },
  {
    variant: "warning",
    palettes: ["wave-orange", "wave-yellow"],
    Icon: AlertTriangleIcon,
    title: "Slow connection",
  },
  {
    variant: "info",
    palettes: ["wave-indigo", "wave-blue"],
    Icon: InfoCircleIcon,
    title: "New feature",
  },
] as const;

/**
 * The border beam, cloned from the reference, on the Alert component. A turning angle
 * drives three layers inside the edge: colour pools and a soft inner shine,
 * shown where a wide window of the turn passes (`::before`); the 1px edge,
 * lit by a white highlight and the same pools, only inside that window
 * (`::after`); and a blurred spark riding the edge (the bloom). It fades in
 * when it starts. `data-still`, and reduced motion, stop it and show the
 * whole gradient at once: every pool around the edge, with no window,
 * highlight or spark. The moving window lights about 45% of the edge at any
 * moment, so the still beam's glow and edge are scaled to about that share
 * (19% and 12% instead of 42% and 26%) to read as strong. The Alert's own border goes transparent and a `contour`
 * hairline sits exactly where the lit edge runs, so the two read as one line.
 */
const BEAM_CSS = `
@property --beam-angle { syntax: "<angle>"; initial-value: 0deg; inherits: true; }
@property --beam-opacity { syntax: "<number>"; initial-value: 0; inherits: true; }
@keyframes beam-spin { 100% { --beam-angle: 360deg; } }
@keyframes beam-fade-in { 100% { --beam-opacity: 1; } }
.beam {
  position: relative;
  overflow: hidden;
  border-color: transparent;
  background-clip: padding-box;
  box-shadow: inset 0 0 0 1px var(--contour);
  animation: beam-spin 2.4s linear infinite, beam-fade-in 0.6s ease forwards;
}
.beam > :not([data-beam-bloom]) { position: relative; z-index: 10; }
.beam::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background:
    conic-gradient(from var(--beam-angle), transparent 0%, transparent 54%, rgba(255, 255, 255, 0.1) 57%, rgba(255, 255, 255, 0.3) 60%, rgba(255, 255, 255, 0.6) 63%, rgba(255, 255, 255, 0.75) 66%, rgba(255, 255, 255, 0.6) 69%, rgba(255, 255, 255, 0.3) 72%, rgba(255, 255, 255, 0.1) 75%, transparent 78%, transparent 100%),
    var(--beam-pools);
  -webkit-mask:
    conic-gradient(from var(--beam-angle), transparent 0%, transparent 30%, rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%, white 52%, white 80%, rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%, transparent 95%, transparent 100%),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    conic-gradient(from var(--beam-angle), transparent 0%, transparent 30%, rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%, white 52%, white 80%, rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%, transparent 95%, transparent 100%),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  z-index: 2;
  opacity: calc(var(--beam-opacity) * 0.26);
  filter: brightness(1.35) saturate(1.25);
}
.beam::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--beam-pools-soft);
  box-shadow: inset 0 0 9px 1px rgba(255, 255, 255, 0.27);
  -webkit-mask-image:
    conic-gradient(from var(--beam-angle), transparent 0%, transparent 30%, rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%, white 52%, white 80%, rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%, transparent 95%, transparent 100%),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  -webkit-mask-composite: source-in, source-over;
  mask-image:
    conic-gradient(from var(--beam-angle), transparent 0%, transparent 30%, rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%, white 52%, white 80%, rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%, transparent 95%, transparent 100%),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  mask-composite: intersect, add;
  pointer-events: none;
  z-index: 1;
  opacity: calc(var(--beam-opacity) * 0.42);
  filter: brightness(1.35) saturate(1.25);
}
.beam > [data-beam-bloom] {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: conic-gradient(from var(--beam-angle), transparent 0%, transparent 58%, rgba(255, 255, 255, 0.03) 62%, rgba(255, 255, 255, 0.08) 65%, rgba(255, 255, 255, 0.2) 67%, rgba(255, 255, 255, 0.45) 69%, rgba(255, 255, 255, 0.85) 70%, rgba(255, 255, 255, 0.85) 70.5%, rgba(255, 255, 255, 0.45) 71.5%, rgba(255, 255, 255, 0.2) 73%, rgba(255, 255, 255, 0.08) 75%, rgba(255, 255, 255, 0.03) 78%, transparent 82%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0);
  padding: 1px;
  filter: blur(8px) brightness(1.35) saturate(1.25);
  pointer-events: none;
  z-index: 3;
  opacity: calc(var(--beam-opacity) * 0.24);
}
.beam[data-still] { animation: none; --beam-opacity: 1; }
.beam[data-still]::before, .beam[data-still]::after { animation: none; }
.beam[data-still]::before {
  -webkit-mask-image:
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  -webkit-mask-composite: source-over;
  mask-image:
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  mask-composite: add;
  opacity: 0.19;
}
.beam[data-still]::after {
  background: var(--beam-pools);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0);
  opacity: 0.12;
}
.beam[data-still] > [data-beam-bloom] { display: none; }
@media (prefers-reduced-motion: reduce) {
  .beam { animation: none; --beam-opacity: 1; }
  .beam::before, .beam::after { animation: none; }
  .beam::before {
    -webkit-mask-image:
      linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
      linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
    -webkit-mask-composite: source-over;
    mask-image:
      linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
      linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
    mask-composite: add;
    opacity: 0.19;
  }
  .beam::after {
    background: var(--beam-pools);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0);
    opacity: 0.12;
  }
  .beam > [data-beam-bloom] { display: none; }
}
`;

/** The reference's nine colour pools: width, height and where each sits. */
const POOLS = [
  [70, 40, "33% -7.4%"],
  [60, 35, "12% -5%"],
  [40, 70, "2.1% 68.3%"],
  [20, 35, "2.1% 68.3%"],
  [180, 32, "74.4% 100%"],
  [85, 26, "55% 100%"],
  [74, 32, "93.9% 0%"],
  [26, 42, "100% 27.1%"],
  [52, 48, "100% 27.1%"],
] as const;

/**
 * The pools for nine colours: full size and strength on the lit edge, and at
 * nine tenths of the size and 45% for the soft glow, as in the reference.
 */
const beamColors = (colors: readonly string[]) =>
  ({
    "--beam-pools": POOLS.map(
      ([w, h, at], i) =>
        `radial-gradient(ellipse ${w}px ${h}px at ${at}, ${colors[i]}, transparent)`,
    ).join(", "),
    "--beam-pools-soft": POOLS.map(
      ([w, h, at], i) =>
        `radial-gradient(ellipse ${Math.round(w * 0.9)}px ${Math.round(h * 0.9)}px at ${at}, color-mix(in srgb, ${colors[i]} 45%, transparent), transparent)`,
    ).join(", "),
  }) as React.CSSProperties;

/** A palette's 500 made translucent. */
const translucent = (palette: string, strength: number) =>
  `color-mix(in srgb, var(--${palette}-500) ${strength}%, transparent)`;

/**
 * Two Wave Palettes in the reference's own places, all as 500s: the first
 * where it has blue, at full strength or at 70% where the lighter blues sat
 * (over white, the 500 at 70% lands on the 400), and the second where it has
 * violet, at full strength. The two spots that light the bottom-left corner
 * and the three that light the top-right corner are at half their strength.
 * Over a dark surface the same 500s glow deep instead of turning into pale
 * blotches.
 */
const pairColors = ([first, second]: readonly [string, string]) => [
  translucent(second, 100),
  translucent(first, 100),
  translucent(second, 50),
  translucent(first, 35),
  translucent(second, 100),
  translucent(first, 70),
  translucent(second, 50),
  translucent(second, 50),
  translucent(second, 50),
];

/** The brand signature's two palettes. */
const SIGNATURE_PAIR = ["wave-blue", "wave-indigo"] as const;

/** The status callouts' text: neutral, as the icon carries the status. */
const STATUS_TEXT = "Neutral text; the icon carries the status.";

/**
 * An alert's icon in a small box, the theme's elevated surface with a contour
 * edge and Wave's smallest shadow (white on Paper). The box is as tall as the
 * title and description together, so it runs from the top of the title to
 * the bottom of the description; the Alert nudges its icon down 2px to sit on
 * a single line, so at this size the nudge is undone. As the Alert's icon
 * slot, it takes the variant's status colour.
 */
function IconBox({
  Icon,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <span
      data-icon="inline-start"
      className="bg-elevated border-line flex size-[42px] items-center justify-center rounded-md border shadow-sm"
      style={{ translate: "none" }}
    >
      <Icon className="size-5" aria-hidden />
    </span>
  );
}

/** The brand signature's content. */
const SIGNATURE_CONTENT = {
  Icon: InfoCircleIcon,
  title: "New feature",
  text: "Share a post to more than one room at once.",
} as const;

export const Beam: Story = {
  render: () => (
    <div
      className="bg-foundation text-contrast"
      style={{ padding: 32, display: "grid", gap: 10 }}
    >
      <style>{BEAM_CSS}</style>
      <div
        style={{
          display: "grid",
          gap: 8,
          width: "100%",
          maxWidth: 512,
          margin: "0 auto",
        }}
      >
        <div style={label}>Brand signature</div>
        <Alert className="beam" style={beamColors(pairColors(SIGNATURE_PAIR))}>
          <span data-beam-bloom aria-hidden />
          <IconBox Icon={SIGNATURE_CONTENT.Icon} />
          <AlertTitle>{SIGNATURE_CONTENT.title}</AlertTitle>
          <AlertDescription>{SIGNATURE_CONTENT.text}</AlertDescription>
        </Alert>
        {CALLOUTS.map(({ variant, palettes, Icon, title }) => (
          <React.Fragment key={variant}>
            <div style={label}>Still, {variant}</div>
            <Alert
              variant={variant}
              className="beam"
              data-still
              style={beamColors(pairColors(palettes))}
            >
              <span data-beam-bloom aria-hidden />
              <IconBox Icon={Icon} />
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{STATUS_TEXT}</AlertDescription>
            </Alert>
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
