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

interface CountProps {
  /** Target number or Date to count to */
  to: number | Date
  /** Starting number. Default: 0. Ignored when `to` is a Date. */
  from?: number
  /** Animation duration in milliseconds. Default: 900. Ignored when `to` is a Date. */
  duration?: number
  /** Delay before starting in seconds. Default: 0 */
  delay?: number
  /**
   * Format the value for display.
   * - For numbers: receives the current interpolated number.
   * - For dates: receives remaining milliseconds.
   * Default: toLocaleString() for numbers, dd:hh:mm:ss for dates.
   */
  format?: (value: number) => string
  /** Prefix string (e.g., "$"). Default: '' */
  prefix?: string
  /** Suffix string (e.g., "%", "+"). Default: '' */
  suffix?: string
  /** Element to render into. Receives the formatted value as children. */
  children: ReactElement
  /** Trigger once. Default: true */
  once?: boolean
  /** Easing function. Default: easeOut. Ignored when `to` is a Date. */
  easing?: (t: number) => number
  /** Called when the count finishes (reaches target or date passes). */
  onComplete?: () => void
}

/** @deprecated Use `Count` instead. `CountUp` is an alias kept for backwards compatibility. */
type CountUpProps = CountProps

// ── Easing ───────────────────────────────────────────────────────────

/** Cubic ease-out: fast start, smooth deceleration */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// ── Date Formatting ──────────────────────────────────────────────────

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00"

  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n: number) => String(n).padStart(2, "0")

  if (days > 0) {
    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

// ── Ref Merge ────────────────────────────────────────────────────────

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

// ── Count ────────────────────────────────────────────────────────────

/**
 * Animated number counter. Counts up, counts down, or live-counts to a date.
 *
 * Direction is automatic — if `from < to` it counts up, if `from > to` it
 * counts down. When `to` is a Date, it becomes a live countdown that ticks
 * every second.
 *
 * Zero wrapper — injects the formatted value as children via cloneElement.
 *
 * @example
 * ```tsx
 * // Count up
 * <Count to={1234}>
 *   <span className="text-4xl font-bold tabular-nums" />
 * </Count>
 *
 * // Count down
 * <Count from={100} to={0} onComplete={() => alert("Done!")}>
 *   <span className="text-4xl font-bold tabular-nums" />
 * </Count>
 *
 * // Live countdown to a date
 * <Count to={new Date("2026-04-01T00:00:00")}>
 *   <span className="text-2xl font-mono tabular-nums" />
 * </Count>
 *
 * // Custom date format
 * <Count to={launchDate} format={(ms) => `${Math.ceil(ms / 86400000)} days left`}>
 *   <span className="text-xl" />
 * </Count>
 * ```
 */
function Count({
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
  onComplete,
}: CountProps) {
  const isDate = to instanceof Date

  if (isDate) {
    return (
      <DateCount
        to={to}
        delay={delay}
        format={format}
        prefix={prefix}
        suffix={suffix}
        once={once}
        onComplete={onComplete}
      >
        {children}
      </DateCount>
    )
  }

  return (
    <NumberCount
      to={to}
      from={start}
      duration={duration}
      delay={delay}
      format={format}
      prefix={prefix}
      suffix={suffix}
      once={once}
      easing={easing}
      onComplete={onComplete}
    >
      {children}
    </NumberCount>
  )
}

// ── Number Count (up or down) ────────────────────────────────────────

function NumberCount({
  to,
  from: start,
  duration,
  delay,
  format,
  prefix,
  suffix,
  children,
  once,
  easing,
  onComplete,
}: {
  to: number
  from: number
  duration: number
  delay: number
  format?: (value: number) => string
  prefix: string
  suffix: string
  children: ReactElement
  once: boolean
  easing: (t: number) => number
  onComplete?: () => void
}) {
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
        } else {
          onComplete?.()
        }
      }

      raf = requestAnimationFrame(animate)
    }, delayMs)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [isInView, to, start, duration, delay, easing, onComplete])

  if (!isValidElement(children)) return children

  const childProps = children.props as Record<string, unknown>
  const existingRef = (childProps as { ref?: Ref<HTMLElement> }).ref

  return cloneElement(children, {
    ref: mergeRef(ref, existingRef),
    children: `${prefix}${formatFn(display)}${suffix}`,
  } as Record<string, unknown>)
}

// ── Date Count (live countdown) ──────────────────────────────────────

function DateCount({
  to,
  delay,
  format,
  prefix,
  suffix,
  children,
  once,
  onComplete,
}: {
  to: Date
  delay: number
  format?: (value: number) => string
  prefix: string
  suffix: string
  children: ReactElement
  once: boolean
  onComplete?: () => void
}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  const [remaining, setRemaining] = useState(() => Math.max(0, to.getTime() - Date.now()))
  const [started, setStarted] = useState(false)
  const completedRef = useRef(false)

  const formatFn = format ?? formatCountdown

  useEffect(() => {
    if (!isInView || started) return
    const timer = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [isInView, delay, started])

  useEffect(() => {
    if (!started) return

    const tick = () => {
      const ms = Math.max(0, to.getTime() - Date.now())
      setRemaining(ms)

      if (ms <= 0 && !completedRef.current) {
        completedRef.current = true
        onComplete?.()
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [started, to, onComplete])

  if (!isValidElement(children)) return children

  const childProps = children.props as Record<string, unknown>
  const existingRef = (childProps as { ref?: Ref<HTMLElement> }).ref

  return cloneElement(children, {
    ref: mergeRef(ref, existingRef),
    children: `${prefix}${formatFn(remaining)}${suffix}`,
  } as Record<string, unknown>)
}

// ── Exports ──────────────────────────────────────────────────────────

/** @deprecated Use `Count` instead */
const CountUp = Count

export { Count, CountUp, easeOut }
export type { CountProps, CountUpProps }
