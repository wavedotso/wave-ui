"use client"

import {
  Children,
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
import { useInView, type Transition } from "motion/react"

// ── Types ────────────────────────────────────────────────────────────

type Direction = "up" | "down" | "left" | "right"

interface AnimateOnViewProps {
  children: ReactElement
  /** Delay in seconds before animation starts. Default: 0 */
  delay?: number
  /** Direction to animate from. Default: 'down' */
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
  /** Direction to animate from. Default: 'down' */
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

interface StaggerProps {
  children: ReactElement[]
  /** Delay increment between each child in seconds. Default: 0.08 */
  interval?: number
  /** Base delay before the first child animates in seconds. Default: 0 */
  baseDelay?: number
}

interface PulseProps {
  children: ReactElement
  /** Min scale factor. Default: 0.97 */
  min?: number
  /** Max scale factor. Default: 1.03 */
  max?: number
  /** Animation duration in seconds. Default: 2 */
  duration?: number
  /** Also pulse opacity between these bounds [min, max]. Off by default. */
  opacity?: [number, number]
  /** Pause animation. Default: false */
  paused?: boolean
}

interface FloatProps {
  children: ReactElement
  /** Vertical float distance in px. Default: 6 */
  distance?: number
  /** Animation duration in seconds. Default: 3 */
  duration?: number
  /** Also rotate slightly while floating (degrees). Default: 0 */
  rotate?: number
  /** Pause animation. Default: false */
  paused?: boolean
}

// ── Internals ────────────────────────────────────────────────────────

/**
 * Direction map: `from` means where the element COMES FROM.
 * `from="left"` = starts to the left, slides right into place.
 */
const DIRECTION_MAP = {
  up: { prop: "translateY", value: -1 },
  down: { prop: "translateY", value: 1 },
  left: { prop: "translateX", value: -1 },
  right: { prop: "translateX", value: 1 },
} as const

/** Flip axis: vertical directions flip around X, horizontal around Y */
const FLIP_MAP = {
  up: "rotateX(90deg)",
  down: "rotateX(-90deg)",
  left: "rotateY(-90deg)",
  right: "rotateY(90deg)",
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

  const hiddenParts: string[] = []
  if (flip) hiddenParts.push("perspective(800px)")
  hiddenParts.push(`${dir.prop}(${dir.value * distance}px)`)
  if (doScale) hiddenParts.push("scale(0.85)")
  if (rotate) hiddenParts.push(`rotate(${rotate}deg)`)
  if (flip) hiddenParts.push(FLIP_MAP[from])

  const visibleParts: string[] = []
  if (flip) visibleParts.push("perspective(800px)")
  visibleParts.push("translateX(0) translateY(0)")
  if (doScale) visibleParts.push("scale(1)")
  if (rotate) visibleParts.push("rotate(0deg)")
  if (flip) visibleParts.push(from === "up" || from === "down" ? "rotateX(0deg)" : "rotateY(0deg)")

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
 * Renders children unchanged on server to avoid hydration mismatch.
 *
 * @example
 * ```tsx
 * <AnimateOnView from="up" blur scale>
 *   <Card>Hello</Card>
 * </AnimateOnView>
 * ```
 */
function AnimateOnView({
  children,
  delay = 0,
  from = "down",
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
      ...(isInView ? { transition: transitionStr } : {}),
      willChange: "opacity, transform",
    },
  } as Record<string, unknown>)
}

// ── AnimateIn ────────────────────────────────────────────────────────

/**
 * Animates a child element immediately on mount.
 *
 * Zero DOM overhead — applies styles directly to the child via cloneElement.
 * Uses a two-phase approach: hidden → visible with requestAnimationFrame.
 *
 * @example
 * ```tsx
 * <AnimateIn from="up" blur spring>
 *   <h1>Welcome</h1>
 * </AnimateIn>
 * ```
 */
function AnimateIn({
  children,
  delay = 0,
  from = "down",
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
      ...(phase === "visible" ? { transition: transitionStr } : {}),
      willChange: "opacity, transform",
    },
  } as Record<string, unknown>)
}

// ── Stagger ──────────────────────────────────────────────────────────

/**
 * Auto-staggers delay on child AnimateIn/AnimateOnView elements.
 * Eliminates manual `delay={i * 0.08}` math.
 *
 * @example
 * ```tsx
 * <Stagger interval={0.1}>
 *   <AnimateIn from="up"><Card>One</Card></AnimateIn>
 *   <AnimateIn from="up"><Card>Two</Card></AnimateIn>
 * </Stagger>
 * ```
 */
function Stagger({
  children,
  interval = 0.08,
  baseDelay = 0,
}: StaggerProps) {
  return (
    <>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child
        return cloneElement(child as ReactElement<{ delay?: number }>, {
          delay: baseDelay + index * interval,
        })
      })}
    </>
  )
}

// ── Pulse ────────────────────────────────────────────────────────────

/**
 * Continuous, subtle scale pulse. Great for live indicators and CTAs.
 * Zero DOM overhead — injects a scoped keyframe via `<style>`.
 *
 * @example
 * ```tsx
 * <Pulse>
 *   <span className="size-3 rounded-full bg-green-500" />
 * </Pulse>
 * ```
 */
function Pulse({
  children,
  min = 0.97,
  max = 1.03,
  duration = 2,
  opacity,
  paused = false,
}: PulseProps) {
  const id = useId().replace(/:/g, "")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!isValidElement(children)) return children
  if (!hydrated) return children

  const name = `pulse-${id}`
  const opacityFrom = opacity?.[0] ?? 1
  const opacityTo = opacity?.[1] ?? 1

  const keyframes = `@keyframes ${name} {
  0%, 100% { transform: scale(${min}); opacity: ${opacityFrom}; }
  50% { transform: scale(${max}); opacity: ${opacityTo}; }
}`

  const childProps = children.props as Record<string, unknown>
  const existingStyle = (childProps.style ?? {}) as CSSProperties
  const existingRef = (childProps as { ref?: Ref<HTMLElement> }).ref

  return (
    <>
      <style>{keyframes}</style>
      {cloneElement(children, {
        ref: existingRef ? mergeRefs(existingRef) : undefined,
        style: {
          ...existingStyle,
          animation: `${name} ${duration}s ease-in-out infinite`,
          animationPlayState: paused ? "paused" : "running",
        },
      } as Record<string, unknown>)}
    </>
  )
}

// ── Float ────────────────────────────────────────────────────────────

/**
 * Gentle continuous up/down float. Perfect for decorative elements.
 * Zero DOM overhead — injects a scoped keyframe via `<style>`.
 *
 * @example
 * ```tsx
 * <Float distance={10} duration={4}>
 *   <Card>Floating</Card>
 * </Float>
 * ```
 */
function Float({
  children,
  distance = 6,
  duration = 3,
  rotate = 0,
  paused = false,
}: FloatProps) {
  const id = useId().replace(/:/g, "")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!isValidElement(children)) return children
  if (!hydrated) return children

  const name = `float-${id}`
  const rotA = rotate ? ` rotate(${-rotate}deg)` : ""
  const rotB = rotate ? ` rotate(${rotate}deg)` : ""

  const keyframes = `@keyframes ${name} {
  0%, 100% { transform: translateY(0px)${rotA}; }
  50% { transform: translateY(${-distance}px)${rotB}; }
}`

  const childProps = children.props as Record<string, unknown>
  const existingStyle = (childProps.style ?? {}) as CSSProperties
  const existingRef = (childProps as { ref?: Ref<HTMLElement> }).ref

  return (
    <>
      <style>{keyframes}</style>
      {cloneElement(children, {
        ...(existingRef ? { ref: existingRef } : {}),
        style: {
          ...existingStyle,
          animation: `${name} ${duration}s ease-in-out infinite`,
          animationPlayState: paused ? "paused" : "running",
        },
      } as Record<string, unknown>)}
    </>
  )
}

// ── Exports ──────────────────────────────────────────────────────────

export { AnimateOnView, AnimateIn, Stagger, Pulse, Float }
export type {
  AnimateOnViewProps,
  AnimateInProps,
  StaggerProps,
  PulseProps,
  FloatProps,
  Direction,
}
