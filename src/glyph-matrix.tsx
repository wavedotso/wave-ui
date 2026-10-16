"use client";

import * as React from "react";

import { mergeRefs } from "./lib/merge-refs";
import { cn } from "./lib/utils";

interface GlyphMatrixProps extends React.ComponentProps<"canvas"> {
  /** Characters picked from at random. */
  glyphs?: string;
  /** Multiplies how fast the field changes. 0 holds it still. */
  speed?: number;
  /**
   * Bright flashes, some typing short runs along a row. Off leaves a calm
   * shimmer: glyphs swapping quietly at their resting brightness.
   */
  glitch?: boolean;
}

interface Flare {
  peak: number;
  hold: number;
  fade: number;
  accent: boolean;
}

interface Streak {
  index: number;
  left: number;
  carry: number;
  flare: Flare;
}

const DEFAULT_GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789";
/** Space beside each glyph and the row height, in ems. */
const CELL_GAP = 0.6;
const ROW_HEIGHT = 1.55;
/** Share of cells left blank. */
const BLANK_SHARE = 0.1;
/** Resting opacity range of the other cells. */
const REST_MIN = 0.12;
const REST_RANGE = 0.38;
/** Share of the field that quietly swaps its glyph each second. */
const SWAP_RATE = 0.2;
/** Share of the field that flares each second. */
const FLARE_RATE = 0.035;
/** Chance a flare starts a streak: a run that types along its row. */
const STREAK_CHANCE = 0.24;
/** Share of streaks that run long (10–24 cells instead of 2–8). */
const LONG_STREAK_CHANCE = 1 / 16;
/** Seconds between a streak's cells. */
const STREAK_PACE = 0.028;
/** Faint background glyphs gain nothing from more than 2 device pixels per px. */
const MAX_PIXEL_RATIO = 2;
/** How often the canvas's color and font are re-read, in seconds. */
const STYLE_CHECK = 0.25;

function randomGlyph(pool: string[]) {
  return pool[Math.floor(Math.random() * pool.length)] ?? " ";
}

function randomRest() {
  return Math.random() < BLANK_SHARE
    ? 0
    : REST_MIN + Math.random() * REST_RANGE;
}

function randomFlare(): Flare {
  return {
    peak: 0.45 + Math.random() * 0.55,
    hold: 0.04 + Math.random() * 0.26,
    fade: 0.45 + Math.random() * 0.6,
    accent: Math.random() < 0.5,
  };
}

/** Cells a streak adds after its first one. */
function streakLength() {
  return Math.random() < LONG_STREAK_CHANCE
    ? 9 + Math.floor(Math.random() * 15)
    : 1 + Math.floor(Math.random() * 7);
}

/**
 * A field of glitching glyphs, for decorative backgrounds (`glitch={false}`
 * for a calm shimmer behind busy content). Styled with
 * classes: `text-*` sets the glyphs' color and size, `font-*` their typeface,
 * and `accent-*` the color of the flares, which alternate with the text color
 * at full strength. A theme switch re-tints the field. `opacity-*` makes it
 * fainter, and `mask-*` fades it toward an edge (`mask-b-from-40%`) or around
 * content on top (`mask-radial-from-transparent mask-radial-to-black`).
 */
function GlyphMatrix({
  glyphs = DEFAULT_GLYPHS,
  speed = 1,
  glitch = true,
  className,
  ref,
  ...props
}: GlyphMatrixProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const mergedRef = React.useMemo(() => mergeRefs(canvasRef, ref), [ref]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const pool = Array.from(glyphs.length > 0 ? glyphs : DEFAULT_GLYPHS);
    const pace = Number.isFinite(speed) ? Math.max(0, speed) : 1;
    // Read live on each frame, so changing the OS setting applies at once.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let color = "";
    let accent = "";
    let font = "";
    let cellWidth = 0;
    let cellHeight = 0;
    let cols = 0;
    let total = 0;
    let cells: string[] = [];
    let rests = new Float32Array(0);
    let heats = new Float32Array(0);
    let flares: (Flare | undefined)[] = [];
    const active = new Set<number>();
    const dirty = new Set<number>();
    const streaks: Streak[] = [];
    let swapCarry = 0;
    let flareCarry = 0;
    let styleCheck = STYLE_CHECK;
    let visible = true;
    let disposed = false;
    let frame = 0;
    let last = 0;

    // Draws one cell: its resting glyph, dimmed as the cell heats up, under
    // the flare color at the cell's heat.
    const drawCell = (index: number) => {
      const x = (index % cols) * cellWidth;
      const y = Math.floor(index / cols) * cellHeight;
      const glyph = cells[index] ?? " ";
      const rest = rests[index] ?? 0;
      const heat = heats[index] ?? 0;

      context.clearRect(x, y, cellWidth, cellHeight);
      if (rest * (1 - heat) > 0.004) {
        context.fillStyle = color;
        context.globalAlpha = rest * (1 - heat);
        context.fillText(glyph, x + cellWidth / 2, y + cellHeight / 2);
      }
      if (heat > 0.004) {
        context.fillStyle = flares[index]?.accent ? accent : color;
        context.globalAlpha = heat;
        context.fillText(glyph, x + cellWidth / 2, y + cellHeight / 2);
      }
    };

    // Resizing the canvas resets its drawing state, so a full paint sets the
    // font and alignment again.
    const paintAll = () => {
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      context.font = font;
      context.textAlign = "center";
      context.textBaseline = "middle";
      for (let index = 0; index < total; index++) drawCell(index);
      dirty.clear();
    };

    // Sizes the canvas and lays a fresh grid over it, cells sized from the
    // widest glyph plus the gap.
    const build = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      const { clientWidth: width, clientHeight: height } = canvas;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      context.font = font;
      const size = parseFloat(getComputedStyle(canvas).fontSize) || 14;
      let advance = 1;
      for (const glyph of new Set(pool)) {
        advance = Math.max(advance, context.measureText(glyph).width);
      }
      cellWidth = Math.ceil(advance + size * CELL_GAP);
      cellHeight = Math.ceil(size * ROW_HEIGHT);

      cols = Math.ceil(width / cellWidth);
      total = cols * Math.ceil(height / cellHeight);
      cells = Array.from({ length: total }, () => randomGlyph(pool));
      rests = Float32Array.from({ length: total }, randomRest);
      heats = new Float32Array(total);
      flares = [];
      active.clear();
      dirty.clear();
      streaks.length = 0;
      paintAll();
    };

    // Picks up the canvas's computed colors and font. A font change rebuilds
    // the grid (cell sizes follow it), again once the font has loaded, since
    // canvas draws a fallback until then; a color change just repaints.
    const syncStyle = () => {
      const computed = getComputedStyle(canvas);
      const nextAccent =
        computed.accentColor === "auto" ? computed.color : computed.accentColor;
      const nextFont = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
      const colorChanged = computed.color !== color || nextAccent !== accent;
      color = computed.color;
      accent = nextAccent;

      if (nextFont !== font) {
        font = nextFont;
        build();
        // A web font still loading gets one more build once it lands; one
        // that fails to load keeps the fallback, which is already drawn.
        if (!document.fonts.check(nextFont)) {
          document.fonts.load(nextFont).then(
            () => {
              if (!disposed && font === nextFont) build();
            },
            () => {},
          );
        }
      } else if (colorChanged) {
        paintAll();
      }
    };

    const ignite = (index: number, flare: Flare) => {
      flares[index] = { ...flare };
      heats[index] = flare.peak;
      active.add(index);
      dirty.add(index);
    };

    // Advances the field by `dt` seconds: quiet glyph swaps, new flares (some
    // starting streaks), streaks typing on, and flares holding then fading
    // while their glyphs scramble. Only the cells that changed are redrawn.
    const update = (dt: number) => {
      swapCarry += total * SWAP_RATE * pace * dt;
      for (; swapCarry >= 1; swapCarry--) {
        const index = Math.floor(Math.random() * total);
        if (active.has(index)) continue;
        cells[index] = randomGlyph(pool);
        dirty.add(index);
      }

      if (glitch) flareCarry += total * FLARE_RATE * pace * dt;
      for (; flareCarry >= 1; flareCarry--) {
        const index = Math.floor(Math.random() * total);
        const flare = randomFlare();
        ignite(index, flare);
        if (Math.random() < STREAK_CHANCE) {
          streaks.push({ index, left: streakLength(), carry: 0, flare });
        }
      }

      for (let s = streaks.length - 1; s >= 0; s--) {
        const streak = streaks[s];
        if (!streak) continue;
        streak.carry += (dt * pace) / STREAK_PACE;
        while (streak.carry >= 1 && streak.left > 0) {
          streak.carry -= 1;
          streak.left -= 1;
          streak.index += 1;
          // A streak stops at its row's end rather than wrapping.
          if (streak.index % cols === 0 || streak.index >= total) {
            streak.left = 0;
            break;
          }
          ignite(streak.index, streak.flare);
        }
        if (streak.left <= 0) streaks.splice(s, 1);
      }

      for (const index of active) {
        const flare = flares[index];
        if (!flare) {
          active.delete(index);
          continue;
        }
        if (flare.hold > 0) {
          flare.hold -= dt;
        } else {
          heats[index] = (heats[index] ?? 0) * Math.exp((-dt * 4) / flare.fade);
        }
        const heat = heats[index] ?? 0;
        if (heat < 0.012 && flare.hold <= 0) {
          heats[index] = 0;
          active.delete(index);
        } else if (Math.random() < heat * dt * 12) {
          cells[index] = randomGlyph(pool);
        }
        dirty.add(index);
      }

      for (const index of dirty) drawCell(index);
      dirty.clear();
    };

    // Drops every flare and streak, for when reduced motion turns on mid-way.
    const settle = () => {
      for (const index of active) {
        heats[index] = 0;
        drawCell(index);
      }
      active.clear();
      streaks.length = 0;
    };

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 0;
      last = time;
      if (!visible || dt === 0) return;

      styleCheck -= dt;
      if (styleCheck <= 0) {
        styleCheck = STYLE_CHECK;
        syncStyle();
      }

      // Reduced motion keeps the field still: nothing changes, and it only
      // repaints when the color or font does (a theme switch, say).
      if (reducedMotion.matches) {
        if (active.size > 0) settle();
        return;
      }
      update(dt);
    };

    // Fires once on observe, which reads the style and builds the first grid;
    // later resizes just rebuild it.
    const resizeObserver = new ResizeObserver(() => {
      if (font) build();
      else syncStyle();
    });
    resizeObserver.observe(canvas);

    // Skip the work while the field is scrolled out of view.
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry) visible = entry.isIntersecting;
    });
    intersectionObserver.observe(canvas);

    frame = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [glyphs, speed, glitch]);

  return (
    <canvas
      ref={mergedRef}
      data-slot="glyph-matrix"
      aria-hidden="true"
      className={cn(
        "text-contrast accent-accent font-mono text-sm pointer-events-none block size-full",
        className,
      )}
      {...props}
    />
  );
}

export { GlyphMatrix };
export type { GlyphMatrixProps };
