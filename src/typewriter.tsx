"use client"

import {
  type CSSProperties,
  type ReactElement,
  type Ref,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { useInView } from "motion/react"

// ── Types ────────────────────────────────────────────────────────────

interface TextSegment {
  text: string
  /** Optional className applied to this segment (e.g., bold, colored) */
  className?: string
}

interface TypewriterProps {
  /** Simple string or styled segments for per-word/phrase styling */
  text: string | TextSegment[]
  /** Element to render into. Receives the animated text as children. */
  children: ReactElement
  /** Time per character in seconds. Default: 0.04 */
  speed?: number
  /** Delay before typing starts in seconds. Default: 0 */
  delay?: number
  /** Show a blinking cursor during typing. Default: true */
  cursor?: boolean
  /** Cursor character. Default: '|' */
  cursorChar?: string
  /** Trigger when scrolled into view instead of on mount. Default: false */
  onView?: boolean
  /** Trigger once. Default: true */
  once?: boolean
  /**
   * Reveal mode. Default: 'typing'
   * - 'typing': character-by-character like someone typing
   * - 'smooth': sliding mask reveal (cinematic feel)
   */
  variant?: "typing" | "smooth"
  /** Duration of the smooth reveal in seconds. Default: 2 */
  smoothDuration?: number
}

// ── Helpers ──────────────────────────────────────────────────────────

function mergeRef(
  internalRef: React.RefObject<HTMLElement | null>,
  externalRef?: Ref<HTMLElement>,
) {
  return (el: HTMLElement | null) => {
    ;(internalRef as { current: HTMLElement | null }).current = el
    if (typeof externalRef === "function") externalRef(el)
    else if (externalRef && typeof externalRef === "object") {
      ;(externalRef as { current: HTMLElement | null }).current = el
    }
  }
}

/** Flatten text prop into a single string for character counting */
function flattenText(text: string | TextSegment[]): string {
  if (typeof text === "string") return text
  return text.map((s) => s.text).join("")
}

/** Build rendered content from segments up to a character index */
function buildSegmentContent(
  segments: TextSegment[],
  charIndex: number,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let remaining = charIndex

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!
    if (remaining <= 0) break

    const visibleChars = seg.text.slice(0, remaining)
    remaining -= visibleChars.length

    if (seg.className) {
      nodes.push(
        <span key={i} className={seg.className}>
          {visibleChars}
        </span>,
      )
    } else {
      nodes.push(visibleChars)
    }
  }

  return nodes
}

// ── Cursor ───────────────────────────────────────────────────────────

function BlinkingCursor({ char, id }: { char: string; id: string }) {
  const name = `tw-blink-${id}`
  return (
    <>
      <span
        aria-hidden
        style={{
          animation: `${name} 0.8s step-end infinite`,
          fontWeight: "normal",
        }}
      >
        {char}
      </span>
      <style>{`@keyframes ${name} { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </>
  )
}

// ── Typewriter ───────────────────────────────────────────────────────

/**
 * Text reveal animation with two modes:
 *
 * **typing** (default) — character-by-character like someone typing.
 * **smooth** — cinematic sliding mask reveal.
 *
 * Supports plain strings or styled segments for per-word coloring.
 * Zero wrapper divs — renders into the child element via cloneElement.
 *
 * @example
 * ```tsx
 * // Simple string
 * <Typewriter text="Welcome to the future.">
 *   <h1 className="text-4xl font-bold" />
 * </Typewriter>
 *
 * // Per-word styling
 * <Typewriter text={[
 *   { text: "Build on " },
 *   { text: "Intuition", className: "text-primary font-bold" },
 * ]}>
 *   <h1 className="text-4xl" />
 * </Typewriter>
 *
 * // Smooth reveal
 * <Typewriter text="Cinematic reveal." variant="smooth" smoothDuration={1.5}>
 *   <h1 className="text-4xl font-bold" />
 * </Typewriter>
 * ```
 */
function Typewriter({
  text,
  children,
  speed = 0.04,
  delay = 0,
  cursor = true,
  cursorChar = "|",
  onView = false,
  once = true,
  variant = "typing",
  smoothDuration = 2,
}: TypewriterProps) {
  const ref = useRef<HTMLElement>(null)
  const id = useId().replace(/:/g, "")
  const isInView = useInView(ref, { once, margin: "-50px" })

  const shouldAnimate = onView ? isInView : true

  if (variant === "smooth") {
    return (
      <SmoothReveal
        text={text}
        elementRef={ref}
        id={id}
        delay={delay}
        duration={smoothDuration}
        cursor={cursor}
        cursorChar={cursorChar}
        shouldAnimate={shouldAnimate}
      >
        {children}
      </SmoothReveal>
    )
  }

  return (
    <TypingReveal
      text={text}
      elementRef={ref}
      id={id}
      speed={speed}
      delay={delay}
      cursor={cursor}
      cursorChar={cursorChar}
      shouldAnimate={shouldAnimate}
    >
      {children}
    </TypingReveal>
  )
}

// ── Typing Reveal ────────────────────────────────────────────────────

function TypingReveal({
  text,
  children,
  elementRef,
  id,
  speed,
  delay,
  cursor,
  cursorChar,
  shouldAnimate,
}: {
  text: string | TextSegment[]
  children: ReactElement
  elementRef: React.RefObject<HTMLElement | null>
  id: string
  speed: number
  delay: number
  cursor: boolean
  cursorChar: string
  shouldAnimate: boolean
}) {
  const flat = flattenText(text)
  const segments = typeof text === "string" ? [{ text }] : text
  const [charIndex, setCharIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!shouldAnimate || started) return
    const timer = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [shouldAnimate, delay, started])

  useEffect(() => {
    if (!started || done) return
    if (charIndex >= flat.length) {
      setDone(true)
      return
    }
    const timer = setTimeout(() => setCharIndex((prev) => prev + 1), speed * 1000)
    return () => clearTimeout(timer)
  }, [started, charIndex, flat.length, speed, done])

  if (!isValidElement(children)) return children

  const childProps = children.props as Record<string, unknown>
  const existingRef = (childProps as { ref?: Ref<HTMLElement> }).ref

  const content = started ? buildSegmentContent(segments, charIndex) : null
  const showCursor = cursor && started && !done

  return cloneElement(children, {
    ref: mergeRef(elementRef, existingRef),
    children: (
      <>
        {content}
        {showCursor && <BlinkingCursor char={cursorChar} id={id} />}
      </>
    ),
  } as Record<string, unknown>)
}

// ── Smooth Reveal ────────────────────────────────────────────────────

function SmoothReveal({
  text,
  children,
  elementRef,
  id,
  delay,
  duration,
  cursor,
  cursorChar,
  shouldAnimate,
}: {
  text: string | TextSegment[]
  children: ReactElement
  elementRef: React.RefObject<HTMLElement | null>
  id: string
  delay: number
  duration: number
  cursor: boolean
  cursorChar: string
  shouldAnimate: boolean
}) {
  const segments = typeof text === "string" ? [{ text }] : text
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!shouldAnimate || revealed) return
    const timer = setTimeout(() => setRevealed(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [shouldAnimate, delay, revealed])

  useEffect(() => {
    if (!revealed) return
    const timer = setTimeout(() => setDone(true), duration * 1000)
    return () => clearTimeout(timer)
  }, [revealed, duration])

  if (!isValidElement(children)) return children

  const childProps = children.props as Record<string, unknown>
  const existingRef = (childProps as { ref?: Ref<HTMLElement> }).ref
  const existingStyle = (childProps.style ?? {}) as CSSProperties

  const animName = `tw-smooth-${id}`
  const showCursor = cursor && revealed && !done

  // Full text is always in the DOM — the mask clip animates to reveal it
  const fullContent = segments.map((seg, i) =>
    seg.className ? (
      <span key={i} className={seg.className}>
        {seg.text}
      </span>
    ) : (
      seg.text
    ),
  )

  return cloneElement(children, {
    ref: mergeRef(elementRef, existingRef),
    style: {
      ...existingStyle,
      whiteSpace: "nowrap" as const,
      overflow: "hidden" as const,
      ...(revealed
        ? {
            animation: `${animName} ${duration}s linear forwards`,
          }
        : {
            maxWidth: 0,
          }),
    },
    children: (
      <>
        <style>{`@keyframes ${animName} { from { max-width: 0; } to { max-width: 100%; } }`}</style>
        {fullContent}
        {showCursor && <BlinkingCursor char={cursorChar} id={id} />}
      </>
    ),
  } as Record<string, unknown>)
}

// ── Exports ──────────────────────────────────────────────────────────

export { Typewriter }
export type { TypewriterProps, TextSegment }
