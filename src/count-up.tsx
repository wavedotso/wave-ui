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

interface CountUpProps {
  /** Target number to count up to */
  to: number
  /** Starting number. Default: 0 */
  from?: number
  /** Animation duration in milliseconds. Default: 900 */
  duration?: number
  /** Delay before starting in seconds. Default: 0 */
  delay?: number
  /** Format the number for display. Default: toLocaleString() */
  format?: (value: number) => string
  /** Prefix string (e.g., "$"). Default: '' */
  prefix?: string
  /** Suffix string (e.g., "%", "+"). Default: '' */
  suffix?: string
  /** Element to render into. Receives the formatted number as children. */
  children: ReactElement
  /** Trigger once. Default: true */
  once?: boolean
  /** Easing function. Default: easeOut */
  easing?: (t: number) => number
}

// ── Easing ───────────────────────────────────────────────────────────

/** Cubic ease-out: fast start, smooth deceleration */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// ── CountUp ──────────────────────────────────────────────────────────

/**
 * Animated number counter that counts up when scrolled into view.
 *
 * Zero wrapper — injects the formatted number as children of the
 * provided element via cloneElement.
 *
 * @example
 * ```tsx
 * <CountUp to={1234}>
 *   <span className="text-4xl font-bold tabular-nums" />
 * </CountUp>
 *
 * <CountUp to={99.9} prefix="$" suffix="M" format={(n) => n.toFixed(1)}>
 *   <h2 className="text-3xl" />
 * </CountUp>
 * ```
 */
function CountUp({
  to,
  from: start = 0,
  duration = 900,
  delay = 0,
  format,
  prefix = "",
  suffix = "",
  children,
  once = true,
  easing = easeOut,
}: CountUpProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  const [display, setDisplay] = useState(start)
  const hasAnimated = useRef(false)

  const formatFn = format ?? ((n: number) =>
    Number.isInteger(to) ? Math.round(n).toLocaleString() : n.toLocaleString()
  )

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const delayMs = delay * 1000
    let raf: number
    let startTime: number

    const timer = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easing(progress)
        const current = start + (to - start) * easedProgress

        setDisplay(current)

        if (progress < 1) {
          raf = requestAnimationFrame(animate)
        }
      }

      raf = requestAnimationFrame(animate)
    }, delayMs)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [isInView, to, start, duration, delay, easing])

  if (!isValidElement(children)) return children

  const childProps = children.props as Record<string, unknown>
  const existingRef = (childProps as { ref?: Ref<HTMLElement> }).ref

  const mergedRef = (el: HTMLElement | null) => {
    ;(ref as { current: HTMLElement | null }).current = el
    if (typeof existingRef === "function") existingRef(el)
    else if (existingRef && typeof existingRef === "object") {
      ;(existingRef as { current: HTMLElement | null }).current = el
    }
  }

  return cloneElement(children, {
    ref: mergedRef,
    children: `${prefix}${formatFn(display)}${suffix}`,
  } as Record<string, unknown>)
}

// ── Exports ──────────────────────────────────────────────────────────

export { CountUp, easeOut }
export type { CountUpProps }
