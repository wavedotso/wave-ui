"use client"

import {
  type ReactElement,
  type Ref,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react"
import { useInView } from "motion/react"

// ── Types ────────────────────────────────────────────────────────────

interface TypewriterProps {
  /** Text to reveal character by character */
  text: string
  /** Element to render as. Receives the animated text as children. */
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
}

// ── Typewriter ───────────────────────────────────────────────────────

/**
 * Character-by-character text reveal, like someone typing in real time.
 *
 * Renders into the child element — no wrapper divs. Pass any element
 * (h1, p, span) and the text is injected as its children.
 *
 * @example
 * ```tsx
 * <Typewriter text="Welcome to the future." speed={0.05}>
 *   <h1 className="text-4xl font-bold" />
 * </Typewriter>
 *
 * <Typewriter text="Built for builders." onView delay={0.3}>
 *   <p className="text-muted-foreground" />
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
}: TypewriterProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  const [charIndex, setCharIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)

  const shouldAnimate = onView ? isInView : true

  useEffect(() => {
    if (!shouldAnimate || started) return

    const delayMs = delay * 1000
    const timer = setTimeout(() => setStarted(true), delayMs)
    return () => clearTimeout(timer)
  }, [shouldAnimate, delay, started])

  useEffect(() => {
    if (!started || done) return

    if (charIndex >= text.length) {
      setDone(true)
      return
    }

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + 1)
    }, speed * 1000)

    return () => clearTimeout(timer)
  }, [started, charIndex, text.length, speed, done])

  if (!isValidElement(children)) return children

  const childProps = children.props as Record<string, unknown>
  const existingRef = (childProps as { ref?: Ref<HTMLElement> }).ref

  const displayText = started ? text.slice(0, charIndex) : ""
  const showCursor = cursor && started && !done

  const mergedRef = (el: HTMLElement | null) => {
    ;(ref as { current: HTMLElement | null }).current = el
    if (typeof existingRef === "function") existingRef(el)
    else if (existingRef && typeof existingRef === "object") {
      ;(existingRef as { current: HTMLElement | null }).current = el
    }
  }

  return cloneElement(children, {
    ref: mergedRef,
    children: (
      <>
        {displayText}
        {showCursor && (
          <span
            aria-hidden
            style={{
              animation: "typewriter-blink 0.8s step-end infinite",
              fontWeight: "normal",
            }}
          >
            {cursorChar}
          </span>
        )}
        {/* Inject the blink keyframe once */}
        {showCursor && (
          <style>{`@keyframes typewriter-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
        )}
      </>
    ),
  } as Record<string, unknown>)
}

// ── Exports ──────────────────────────────────────────────────────────

export { Typewriter }
export type { TypewriterProps }
