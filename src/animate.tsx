"use client"

import {
  type CSSProperties,
  type ReactElement,
  type Ref,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react"
import { useInView, type Transition } from "motion/react"

// ── Types ────────────────────────────────────────────────────────────

type Direction = "up" | "down" | "left" | "right"

interface AnimateOnViewProps {
  children: ReactElement
  /** Delay in seconds before animation starts. Default: 0 */
  delay?: number
  /** Direction to animate from. Default: 'up' */
  from?: Direction
  /** Distance in px. Default: 20 */
  distance?: number
  /** Also scale in (0.85 → 1). Default: false */
  scale?: boolean
  /** Blur in from a given amount in px. Default: false */
  blur?: boolean | number
  /** Rotate in from a given angle in degrees. Default: 0 */
  rotate?: number
  /** 3D flip entrance along the axis matching `from`. Default: false */
  flip?: boolean
  /** Spring easing with overshoot. Default: false */
  spring?: boolean
  /** Trigger once or every time it enters view. Default: true */
  once?: boolean
  /** Custom transition override */
  transition?: Transition
}

interface AnimateInProps {
  children: ReactElement
  /** Delay in seconds before animation starts. Default: 0 */
  delay?: number
  /** Direction to animate from. Default: 'up' */
  from?: Direction
  /** Distance in px. Default: 20 */
  distance?: number
  /** Also scale in (0.85 → 1). Default: false */
  scale?: boolean
  /** Blur in from a given amount in px. Default: false */
  blur?: boolean | number
  /** Rotate in from a given angle in degrees. Default: 0 */
  rotate?: number
  /** 3D flip entrance along the axis matching `from`. Default: false */
  flip?: boolean
  /** Spring easing with overshoot. Default: false */
  spring?: boolean
  /** Custom transition override */
  transition?: Transition
}

// ── Internals ────────────────────────────────────────────────────────

const DIRECTION_MAP = {
  up: { prop: "translateY", value: 1 },
  down: { prop: "translateY", value: -1 },
  left: { prop: "translateX", value: 1 },
  right: { prop: "translateX", value: -1 },
} as const

/** Flip axis: vertical directions flip around X, horizontal around Y */
const FLIP_MAP = {
  up: "rotateX(-90deg)",
  down: "rotateX(90deg)",
  left: "rotateY(90deg)",
  right: "rotateY(-90deg)",
} as const

/** CSS cubic-bezier that overshoots then settles — feels like a spring */
const SPRING_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)"

interface BuildStylesOptions {
  from: Direction
  distance: number
  doScale: boolean
  blur: boolean | number
  rotate: number
  flip: boolean
}

function buildStyles(opts: BuildStylesOptions) {
  const { from, distance, doScale, blur, rotate, flip } = opts
  const dir = DIRECTION_MAP[from]

  // Build hidden transform parts
  const hiddenParts: string[] = []
  hiddenParts.push(`${dir.prop}(${dir.value * distance}px)`)
  if (doScale) hiddenParts.push("scale(0.85)")
  if (rotate) hiddenParts.push(`rotate(${rotate}deg)`)
  if (flip) hiddenParts.push(FLIP_MAP[from])

  // Build visible transform parts
  const visibleParts: string[] = []
  visibleParts.push("translateX(0) translateY(0)")
  if (doScale) visibleParts.push("scale(1)")
  if (rotate) visibleParts.push("rotate(0deg)")
  if (flip) visibleParts.push(from === "up" || from === "down" ? "rotateX(0deg)" : "rotateY(0deg)")

  // Resolve blur amount (true = 10px default)
  const blurPx = blur === true ? 10 : typeof blur === "number" ? blur : 0

  const hidden: CSSProperties = {
    opacity: "0",
    transform: hiddenParts.join(" "),
  }

  const visible: CSSProperties = {
    opacity: "1",
    transform: visibleParts.join(" "),
  }

  if (blurPx > 0) {
    hidden.filter = `blur(${blurPx}px)`
    visible.filter = "blur(0px)"
  }

  return { hidden, visible, hasFilter: blurPx > 0 }
}

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (el: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") ref(el)
      else if (ref && typeof ref === "object") {
        ;(ref as { current: T | null }).current = el
      }
    })
  }
}

function getTransitionParams(transition?: Transition, useSpring?: boolean) {
  const duration =
    (transition as Record<string, number>)?.duration ?? 0.5
  const ease =
    useSpring ? SPRING_EASE : ((transition as Record<string, string>)?.ease ?? "ease-out")
  return { duration, ease }
}

function buildTransitionStr(
  duration: number,
  ease: string,
  delay: number,
  hasFilter: boolean,
) {
  const parts = [
    `opacity ${duration}s ${ease} ${delay}s`,
    `transform ${duration}s ${ease} ${delay}s`,
  ]
  if (hasFilter) parts.push(`filter ${duration}s ${ease} ${delay}s`)
  return parts.join(", ")
}

// ── AnimateOnView ────────────────────────────────────────────────────

/**
 * Animates a child element when it scrolls into view.
 *
 * Zero DOM overhead — applies styles directly to the child via cloneElement.
 * Works with any element: HTML, custom components, anything React renders.
 * Server Component compatible — renders children unchanged on server.
 *
 * @example
 * ```tsx
 * // Simple fade + slide
 * <AnimateOnView from="up" delay={0.2}>
 *   <Card>Hello</Card>
 * </AnimateOnView>
 *
 * // Blur + scale entrance
 * <AnimateOnView blur scale>
 *   <h1>Welcome</h1>
 * </AnimateOnView>
 *
 * // 3D flip with spring
 * <AnimateOnView flip spring from="left">
 *   <Card>Flipped</Card>
 * </AnimateOnView>
 * ```
 */
function AnimateOnView({
  children,
  delay = 0,
  from = "up",
  distance = 20,
  scale = false,
  blur = false,
  rotate = 0,
  flip = false,
  spring = false,
  once = true,
  transition,
}: AnimateOnViewProps) {
  const ref = useRef<HTMLElement>(null)
  const [hydrated, setHydrated] = useState(false)
  const isInView = useInView(ref, { once, margin: "-50px" })

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!isValidElement(children)) return children

  const childProps = children.props as Record<string, unknown>
  const existingStyle = (childProps.style ?? {}) as CSSProperties
  const existingRef = (childProps as { ref?: Ref<HTMLElement> }).ref

  // Before hydration: render unchanged (server match)
  if (!hydrated) {
    return cloneElement(children, {
      ref: mergeRefs(ref, existingRef),
    } as Record<string, unknown>)
  }

  const styles = buildStyles({ from, distance, doScale: scale, blur, rotate, flip })
  const { duration, ease } = getTransitionParams(transition, spring)
  const currentStyle = isInView ? styles.visible : styles.hidden
  const transitionStr = buildTransitionStr(duration, ease, delay, styles.hasFilter)

  return cloneElement(children, {
    ref: mergeRefs(ref, existingRef),
    style: {
      ...existingStyle,
      ...currentStyle,
      transition: transitionStr,
      willChange: "opacity, transform",
      ...(flip ? { perspective: "800px" } : {}),
    },
  } as Record<string, unknown>)
}

// ── AnimateIn ────────────────────────────────────────────────────────

/**
 * Animates a child element immediately on mount.
 *
 * Zero DOM overhead — applies styles directly to the child via cloneElement.
 * Uses a two-phase approach: hidden → visible with requestAnimationFrame
 * to ensure CSS transitions have a starting point.
 *
 * @example
 * ```tsx
 * // Blur in from below with spring
 * <AnimateIn from="up" blur spring>
 *   <h1>Welcome</h1>
 * </AnimateIn>
 *
 * // Rotate in with scale
 * <AnimateIn rotate={-10} scale delay={0.2}>
 *   <Icon />
 * </AnimateIn>
 * ```
 */
function AnimateIn({
  children,
  delay = 0,
  from = "up",
  distance = 20,
  scale = false,
  blur = false,
  rotate = 0,
  flip = false,
  spring = false,
  transition,
}: AnimateInProps) {
  const ref = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<"server" | "hidden" | "visible">("server")

  useEffect(() => {
    setPhase("hidden")
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("visible"))
    })
  }, [])

  if (!isValidElement(children)) return children

  const childProps = children.props as Record<string, unknown>
  const existingStyle = (childProps.style ?? {}) as CSSProperties
  const existingRef = (childProps as { ref?: Ref<HTMLElement> }).ref

  // Server render: no styles injected
  if (phase === "server") {
    return cloneElement(children, {
      ref: mergeRefs(ref, existingRef),
    } as Record<string, unknown>)
  }

  const styles = buildStyles({ from, distance, doScale: scale, blur, rotate, flip })
  const { duration, ease } = getTransitionParams(transition, spring)
  const currentStyle = phase === "visible" ? styles.visible : styles.hidden
  const transitionStr = buildTransitionStr(duration, ease, delay, styles.hasFilter)

  return cloneElement(children, {
    ref: mergeRefs(ref, existingRef),
    style: {
      ...existingStyle,
      ...currentStyle,
      transition: transitionStr,
      willChange: "opacity, transform",
      ...(flip ? { perspective: "800px" } : {}),
    },
  } as Record<string, unknown>)
}

// ── Exports ──────────────────────────────────────────────────────────

export { AnimateOnView, AnimateIn }
export type { AnimateOnViewProps, AnimateInProps, Direction }
