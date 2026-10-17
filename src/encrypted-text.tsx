"use client";

import * as React from "react";

import { cn } from "./lib/utils";

type EncryptedTextProps = React.ComponentProps<"span"> & {
  text: string;
  revealDelayMs?: number;
  charset?: string;
  flipDelayMs?: number;
  encryptedClassName?: string;
  revealedClassName?: string;
  scrambleOnly?: boolean;
  scrambleOneChar?: boolean;
  /** Where the reveal begins. Default: "start" */
  revealDirection?: "start" | "end" | "center" | "random";
  /** Scramble and reveal again when hovered. Default: false */
  scrambleOnHover?: boolean;
  /** Scramble and reveal again after every reveal. Default: false */
  loop?: boolean;
  /** Pause between a reveal and the next loop, in ms. Default: 2000 */
  loopDelayMs?: number;
};

interface Frame {
  glyphs: string[];
  scales: number[];
  /** Each character's place in the reveal order; -1 for spaces. */
  ranks: number[];
  revealed: number;
}

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** Opacity of a scrambled character far from its turn. */
const ENCRYPTED_OPACITY = 0.6;
/** Characters ahead of the reveal that brighten toward full opacity. */
const LEAD = 4;

function isSpace(char: string) {
  return /\s/.test(char);
}

function randomGlyph(pool: string[]) {
  return pool[Math.floor(Math.random() * pool.length)] ?? "";
}

/**
 * A scramble that's the same on the server and in the browser, so the text
 * can start encrypted without a hydration mismatch.
 */
function initialFrame(chars: string[], pool: string[]): Frame {
  let rank = 0;
  return {
    glyphs: chars.map((char, index) =>
      isSpace(char)
        ? char
        : (pool[((char.codePointAt(0) ?? 0) + index * 7) % pool.length] ??
          char),
    ),
    scales: chars.map(() => 1),
    ranks: chars.map((char) => (isSpace(char) ? -1 : rank++)),
    revealed: 0,
  };
}

/** Each character's place in the reveal order for a direction; -1 for spaces. */
function rankLetters(
  chars: string[],
  direction: NonNullable<EncryptedTextProps["revealDirection"]>,
) {
  const order = chars.flatMap((char, index) => (isSpace(char) ? [] : [index]));
  if (direction === "end") order.reverse();
  if (direction === "center") {
    const middle = (chars.length - 1) / 2;
    order.sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle));
  }
  if (direction === "random") {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j] ?? 0, order[i] ?? 0];
    }
  }
  const ranks = chars.map(() => -1);
  order.forEach((index, rank) => {
    ranks[index] = rank;
  });
  return ranks;
}

const glyphWidths = new Map<string, number>();
let measurer: CanvasRenderingContext2D | null | undefined;

/** Measures a glyph in a font, caching it once the font has loaded. */
function measureGlyph(font: string, glyph: string) {
  const key = `${font}|${glyph}`;
  const cached = glyphWidths.get(key);
  if (cached !== undefined) return cached;

  measurer ??= document.createElement("canvas").getContext("2d");
  if (!measurer) return 0;
  measurer.font = font;
  const width = measurer.measureText(glyph).width;
  // A web font still loading would be measured as its fallback.
  if (document.fonts.check(font)) glyphWidths.set(key, width);
  return width;
}

/** How much to narrow a stand-in glyph so it fits the real one's width. */
function squeeze(font: string, char: string, glyph: string) {
  const room = measureGlyph(font, char);
  const need = measureGlyph(font, glyph);
  return need > room && need > 0 ? Math.max(0.05, room / need) : 1;
}

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const getServerReducedMotion = () => false;

/**
 * Text that starts scrambled and reveals itself, character by character, once
 * it scrolls into view. Each character keeps its real width while scrambled
 * (the stand-in glyph sits over an invisible copy and narrows to fit), so the
 * text never shifts what's around it. Screen readers get the real text.
 */
function EncryptedText({
  text,
  className,
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  flipDelayMs = 50,
  encryptedClassName,
  revealedClassName,
  scrambleOnly = false,
  scrambleOneChar = false,
  revealDirection = "start",
  scrambleOnHover = false,
  loop = false,
  loopDelayMs = 2000,
  onPointerEnter,
  ...props
}: EncryptedTextProps) {
  const prefersReducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const ref = React.useRef<HTMLSpanElement>(null);
  const restartRef = React.useRef<(() => void) | null>(null);
  const isRunningRef = React.useRef(false);
  const [isInView, setIsInView] = React.useState(false);

  const chars = React.useMemo(() => Array.from(text), [text]);
  const pool = React.useMemo(
    () => Array.from(charset.length > 0 ? charset : DEFAULT_CHARSET),
    [charset],
  );
  const initial = React.useMemo(() => initialFrame(chars, pool), [chars, pool]);
  // A frame is only used for the text it was built from, so a new `text`
  // never shows a stale scramble before its own run starts.
  const [live, setLive] = React.useState<{ chars: string[]; frame: Frame }>();
  const frame = live?.chars === chars ? live.frame : initial;

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  React.useEffect(() => {
    const root = ref.current;
    if (prefersReducedMotion || !isInView || !root) return;

    const computed = getComputedStyle(root);
    const font = `${computed.fontStyle} ${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
    const letters = chars.filter((char) => !isSpace(char)).length;
    let glyphs: string[] = [];
    let scales: number[] = [];
    let ranks: number[] = [];
    let revealed = 0;
    let start = 0;
    let lastFlip = 0;
    let frameId = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const scramble = (index: number) => {
      const glyph = randomGlyph(pool);
      glyphs[index] = glyph;
      scales[index] = squeeze(font, chars[index] ?? glyph, glyph);
    };

    const publish = () => {
      setLive({
        chars,
        frame: { glyphs: [...glyphs], scales: [...scales], ranks, revealed },
      });
    };

    // Each frame: move the reveal on, and every `flipDelayMs` give the
    // still-scrambled characters new glyphs. Re-renders only when either
    // happens.
    const update = (now: number) => {
      let isChanged = false;

      if (!scrambleOnly) {
        const next = Math.min(
          letters,
          Math.floor((now - start) / Math.max(1, revealDelayMs)),
        );
        isChanged = next !== revealed;
        revealed = next;

        if (revealed >= letters) {
          publish();
          isRunningRef.current = false;
          if (loop) timer = setTimeout(run, Math.max(0, loopDelayMs));
          return;
        }
      }

      if (now - lastFlip >= Math.max(0, flipDelayMs)) {
        lastFlip = now;
        isChanged = true;
        if (scrambleOnly && scrambleOneChar) {
          const scrambled = chars.flatMap((char, index) =>
            isSpace(char) ? [] : [index],
          );
          const index = scrambled[Math.floor(Math.random() * scrambled.length)];
          if (index !== undefined) scramble(index);
        } else {
          chars.forEach((char, index) => {
            if (!isSpace(char) && (ranks[index] ?? 0) >= revealed) {
              scramble(index);
            }
          });
        }
      }

      if (isChanged) publish();
      frameId = requestAnimationFrame(update);
    };

    // Scrambles every character and starts the reveal over.
    const run = () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
      isRunningRef.current = true;
      ranks = rankLetters(chars, revealDirection);
      glyphs = [...chars];
      scales = chars.map(() => 1);
      chars.forEach((char, index) => {
        if (!isSpace(char)) scramble(index);
      });
      revealed = 0;
      start = performance.now();
      lastFlip = start;
      publish();
      frameId = requestAnimationFrame(update);
    };

    restartRef.current = run;
    run();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
      isRunningRef.current = false;
      restartRef.current = null;
    };
  }, [
    prefersReducedMotion,
    isInView,
    chars,
    pool,
    revealDelayMs,
    flipDelayMs,
    scrambleOnly,
    scrambleOneChar,
    revealDirection,
    loop,
    loopDelayMs,
  ]);

  const handlePointerEnter = (event: React.PointerEvent<HTMLSpanElement>) => {
    onPointerEnter?.(event);
    if (scrambleOnHover && !scrambleOnly && !isRunningRef.current) {
      restartRef.current?.();
    }
  };

  if (!text) return null;

  // Words stay whole: each character is its own box, which could otherwise
  // break a word across lines mid-scramble.
  const words: { start: number; letters: string[] }[] = [];
  chars.forEach((char, index) => {
    const word = words.at(-1);
    if (isSpace(char) || !word || isSpace(chars[index - 1] ?? " ")) {
      words.push({ start: index, letters: [char] });
    } else {
      word.letters.push(char);
    }
  });

  return (
    <span
      ref={ref}
      data-slot="encrypted-text"
      className={className}
      onPointerEnter={handlePointerEnter}
      {...props}
    >
      {/* Real text for assistive tech; the animated glyphs below are decorative
       * (aria-label on a role-less span is unreliable, and the scrambled
       * characters must not be read out). */}
      <span className="sr-only">{text}</span>
      {words.map((word) =>
        isSpace(word.letters[0] ?? "") ? (
          <React.Fragment key={word.start}>{word.letters[0]}</React.Fragment>
        ) : (
          <span
            key={word.start}
            aria-hidden="true"
            data-slot="encrypted-text-word"
            className="whitespace-nowrap"
          >
            {word.letters.map((char, offset) => {
              const index = word.start + offset;
              const rank = frame.ranks[index] ?? 0;
              // Reduced motion skips the scramble and shows the real text.
              const isRevealed =
                prefersReducedMotion ||
                (!scrambleOnly && rank < frame.revealed);
              const distance = rank - frame.revealed;
              const lift = Math.max(0, 1 - distance / LEAD);
              const scale = frame.scales[index] ?? 1;

              return (
                <span
                  key={index}
                  data-slot="encrypted-text-char"
                  data-revealed={isRevealed || undefined}
                  className={cn(
                    "motion-color relative inline-block",
                    isRevealed ? revealedClassName : encryptedClassName,
                  )}
                  style={
                    isRevealed || scrambleOnly
                      ? undefined
                      : {
                          opacity:
                            ENCRYPTED_OPACITY + (1 - ENCRYPTED_OPACITY) * lift,
                        }
                  }
                >
                  {isRevealed ? (
                    char
                  ) : (
                    <>
                      <span
                        data-slot="encrypted-text-ghost"
                        className="invisible"
                      >
                        {char}
                      </span>
                      <span
                        data-slot="encrypted-text-glyph"
                        className="absolute top-0 left-1/2 -translate-x-1/2"
                        style={scale < 1 ? { scale: `${scale} 1` } : undefined}
                      >
                        {frame.glyphs[index] ?? char}
                      </span>
                    </>
                  )}
                </span>
              );
            })}
          </span>
        ),
      )}
    </span>
  );
}

export { EncryptedText };
export type { EncryptedTextProps };
