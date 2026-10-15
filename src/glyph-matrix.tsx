"use client";

import * as React from "react";

import { mergeRefs } from "./lib/merge-refs";
import { cn } from "./lib/utils";

interface GlyphMatrixProps extends React.ComponentProps<"canvas"> {
  /** Characters picked from at random. */
  glyphs?: string;
  /** Cell size in px, which also sets the font size. */
  cellSize?: number;
  /** Share (0–1) of the cells that change on each tick. */
  mutationRate?: number;
  /** Time between ticks, in ms. */
  interval?: number;
  /** How far the glyphs fade toward the bottom (0 = no fade, 1 = to nothing). */
  fadeBottom?: number;
}

const DEFAULT_GLYPHS = "01·•+*/\\<>=";
const DEFAULT_CELL_SIZE = 14;

function randomGlyph(pool: string) {
  return pool[Math.floor(Math.random() * pool.length)] ?? " ";
}

function randomAlpha(range: number) {
  return 0.07 + Math.random() * range;
}

/**
 * A field of flickering glyphs, for decorative backgrounds. Styled like text:
 * the glyphs take the canvas's own `color` and `font-family`, so `text-*` and
 * `font-*` classes set them and a theme switch re-tints the field. Choose a
 * stronger token (`text-contrast`, `text-primary`) for a bolder field and
 * `opacity-*` for a fainter one.
 */
function GlyphMatrix({
  glyphs = DEFAULT_GLYPHS,
  cellSize = DEFAULT_CELL_SIZE,
  mutationRate = 0.04,
  interval = 90,
  fadeBottom = 0.6,
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

    const pool = glyphs.length > 0 ? glyphs : DEFAULT_GLYPHS;
    const size =
      Number.isFinite(cellSize) && cellSize > 0 ? cellSize : DEFAULT_CELL_SIZE;
    const fadeAmount = Math.min(1, Math.max(0, fadeBottom));
    // Read live on each tick, so changing the OS setting applies at once.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let cols = 0;
    let rows = 0;
    let cells: string[] = [];
    let alphas: number[] = [];
    let color = "";
    let font = "";
    let visible = true;
    let frame = 0;
    let lastTick = 0;

    // Picks up the canvas's computed color and font, and reports whether
    // either changed. Reading them live is what lets a theme switch or a class
    // change re-style the field.
    const syncStyle = () => {
      const computed = getComputedStyle(canvas);
      const nextFont = `${Math.max(1, size - 2)}px ${computed.fontFamily}`;
      if (computed.color === color && nextFont === font) return false;

      color = computed.color;
      font = nextFont;
      return true;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { clientWidth: width, clientHeight: height } = canvas;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / size);
      rows = Math.ceil(height / size);

      const total = cols * rows;
      cells = Array.from({ length: total }, () => randomGlyph(pool));
      alphas = Array.from({ length: total }, () => randomAlpha(0.47));
    };

    // Resizing the canvas resets its drawing state, so every paint sets the
    // color and font again. Each cell's own opacity rides on `globalAlpha`,
    // which keeps any CSS color (and its own alpha) exactly as written.
    const paint = () => {
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      context.fillStyle = color;
      context.font = font;
      context.textBaseline = "top";

      for (let y = 0; y < rows; y++) {
        const fade = 1 - (y / rows) * fadeAmount;

        for (let x = 0; x < cols; x++) {
          const index = y * cols + x;
          context.globalAlpha = (alphas[index] ?? 0) * fade;
          context.fillText(cells[index] ?? " ", x * size, y * size);
        }
      }
      context.globalAlpha = 1;
    };

    const mutate = () => {
      const total = cols * rows;
      const count = Math.ceil(total * mutationRate);

      for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * total);
        cells[index] = randomGlyph(pool);
        alphas[index] = randomAlpha(0.6);
      }
    };

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible || time - lastTick < interval) return;
      lastTick = time;

      // Reduced motion keeps the field still: no mutations, and a repaint only
      // when the color or font changes (a theme switch, say).
      if (reducedMotion.matches) {
        if (syncStyle()) paint();
        return;
      }

      mutate();
      syncStyle();
      paint();
    };

    // Fires once on observe, which builds and paints the first frame.
    const resizeObserver = new ResizeObserver(() => {
      resize();
      syncStyle();
      paint();
    });
    resizeObserver.observe(canvas);

    // Skip the work while the field is scrolled out of view.
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry) visible = entry.isIntersecting;
    });
    intersectionObserver.observe(canvas);

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [glyphs, cellSize, mutationRate, interval, fadeBottom]);

  return (
    <canvas
      ref={mergedRef}
      data-slot="glyph-matrix"
      aria-hidden="true"
      className={cn(
        "text-muted font-mono pointer-events-none block size-full",
        className,
      )}
      {...props}
    />
  );
}

export { GlyphMatrix };
export type { GlyphMatrixProps };
