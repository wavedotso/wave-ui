"use client"

import { useRef, useEffect, useState, useId, useCallback } from "react"
import { cn } from "./lib/utils"

interface GradientRevealTextProps {
  /** The text to display */
  text: string
  /** Spotlight follow speed in seconds. Default: 0 (instant) */
  duration?: number
  /** Gradient colors for the reveal effect. Default: rainbow */
  colors?: string[]
  /** Base stroke opacity when not hovered. Default: 0.3 */
  baseOpacity?: number
  /** Hovered stroke opacity. Default: 0.7 */
  hoverOpacity?: number
  /** Font family for SVG text. Default: Helvetica Neue */
  fontFamily?: string
  /** Spotlight radius multiplier relative to text height. Default: 0.6 */
  spotlightSize?: number
  /** Stroke width in px. Default: auto (1.5% of text height) */
  strokeWidth?: number
  /** Base stroke color. Default: neutral-200 (light) / neutral-800 (dark) via Tailwind */
  baseColor?: string
  className?: string
}

const DEFAULT_COLORS = [
  "#eab308",
  "#ef4444",
  "#3b82f6",
  "#06b6d4",
  "#8b5cf6",
]

/**
 * Large decorative text with a gradient spotlight that follows the cursor.
 *
 * Renders as an SVG that auto-sizes to fit the text with zero padding.
 * The gradient reveal effect activates on hover — a circular spotlight
 * follows the mouse, revealing rainbow-colored strokes beneath.
 *
 * @example
 * ```tsx
 * <GradientRevealText text="HELLO" />
 * <GradientRevealText text="BRAND" colors={["#ff0000", "#00ff00"]} />
 * ```
 */
function GradientRevealText({
  text,
  duration = 0,
  colors = DEFAULT_COLORS,
  baseOpacity = 0.3,
  hoverOpacity = 0.7,
  fontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif",
  spotlightSize = 0.6,
  strokeWidth: strokeWidthPx,
  baseColor,
  className,
}: GradientRevealTextProps) {
  const uid = useId()
  const svgRef = useRef<SVGSVGElement>(null)
  const textRef = useRef<SVGTextElement>(null)
  const gradientRef = useRef<SVGRadialGradientElement>(null)

  const [vb, setVb] = useState({ x: 0, y: 0, w: 100, h: 20 })
  const [measured, setMeasured] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Target position (where cursor is) and current animated position
  const targetPos = useRef({ cx: 0.5, cy: 0.5 })
  const currentPos = useRef({ cx: 0.5, cy: 0.5 })
  const rafId = useRef<number>(0)

  // Measure text bbox → set viewBox to fit exactly
  const measure = useCallback(() => {
    const el = textRef.current
    if (!el) return
    const bbox = el.getBBox()
    if (bbox.width === 0) return

    setVb({ x: bbox.x, y: bbox.y, w: bbox.width, h: bbox.height })
    setMeasured(true)
  }, [])

  useEffect(() => {
    measure()
    document.fonts?.ready?.then(measure)
  }, [text, measure])

  // Update the SVG gradient attributes directly (no React re-render)
  const applyGradientPos = useCallback((cx: number, cy: number) => {
    const el = gradientRef.current
    if (!el) return
    const svgCx = vb.x + cx * vb.w
    const svgCy = vb.y + cy * vb.h
    el.setAttribute("cx", String(svgCx))
    el.setAttribute("cy", String(svgCy))
  }, [vb])

  // RAF loop for smooth follow
  useEffect(() => {
    if (duration <= 0) return

    // Lerp factor: higher = faster catch-up. Derived from duration.
    const speed = 1 - Math.pow(0.001, 1 / (duration * 60))

    const tick = () => {
      const cur = currentPos.current
      const tgt = targetPos.current
      cur.cx += (tgt.cx - cur.cx) * speed
      cur.cy += (tgt.cy - cur.cy) * speed
      applyGradientPos(cur.cx, cur.cy)
      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [duration, applyGradientPos])

  const updatePos = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / rect.width
    const cy = (e.clientY - rect.top) / rect.height
    targetPos.current = { cx, cy }

    // If no smooth follow, apply instantly
    if (duration <= 0) {
      currentPos.current = { cx, cy }
      applyGradientPos(cx, cy)
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<SVGSVGElement>) => {
    // Snap to entry point — no lerp on first frame
    const svg = svgRef.current
    if (svg) {
      const rect = svg.getBoundingClientRect()
      const cx = (e.clientX - rect.left) / rect.width
      const cy = (e.clientY - rect.top) / rect.height
      targetPos.current = { cx, cy }
      currentPos.current = { cx, cy }
      applyGradientPos(cx, cy)
    }
    setHovered(true)
  }

  // Derived values
  const spotlightR = vb.h * spotlightSize
  const strokeW = strokeWidthPx ?? vb.h * 0.015
  const initCx = vb.x + 0.5 * vb.w
  const initCy = vb.y + 0.5 * vb.h

  // Unique SVG IDs
  const gradientId = `grad-${uid}`
  const maskId = `mask-${uid}`
  const revealId = `reveal-${uid}`

  // Evenly distribute color stops
  const stops = colors.map((color, i) => ({
    offset: `${(i / Math.max(colors.length - 1, 1)) * 100}%`,
    color,
  }))

  const textStyle = {
    fontSize: "1em",
    fontFamily,
    fill: "none",
    strokeWidth: strokeW,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
    paintOrder: "stroke fill" as const,
  }

  return (
    <svg
      ref={svgRef}
      data-slot="gradient-reveal-text"
      width="100%"
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={updatePos}
      className={cn("select-none", className)}
      style={{ opacity: measured ? 1 : 0 }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {hovered &&
            stops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
        </linearGradient>

        <radialGradient
          ref={gradientRef}
          id={revealId}
          gradientUnits="userSpaceOnUse"
          r={spotlightR}
          cx={initCx}
          cy={initCy}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>

        <mask id={maskId}>
          <rect
            x={vb.x - vb.w}
            y={vb.y - vb.h}
            width={vb.w * 3}
            height={vb.h * 3}
            fill={`url(#${revealId})`}
          />
        </mask>
      </defs>

      {/* Hidden text for measurement */}
      <text
        ref={textRef}
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-bold"
        style={{ fontSize: "1em", fontFamily, visibility: "hidden" }}
      >
        {text}
      </text>

      {/* Base stroke — subtle outline */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className={baseColor ? "font-bold" : "font-bold stroke-neutral-200 dark:stroke-neutral-800"}
        style={{
          ...textStyle,
          ...(baseColor ? { stroke: baseColor } : {}),
          opacity: hovered ? hoverOpacity : baseOpacity,
          transition: "opacity 0.3s ease",
        }}
      >
        {text}
      </text>

      {/* Gradient reveal on hover */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        mask={`url(#${maskId})`}
        className="font-bold"
        style={{
          ...textStyle,
          stroke: `url(#${gradientId})`,
        }}
      >
        {text}
      </text>
    </svg>
  )
}

export { GradientRevealText }
export type { GradientRevealTextProps }
