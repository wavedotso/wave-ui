"use client"

import * as React from "react"

import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react"

import { StarIcon } from "./lib/internal-icons"
import { cn } from "./lib/utils"

const STAGGER_STEP = 0.05 // 50ms between each item's enter animation

const MasonryStaggerContext = React.createContext<(() => number) | null>(null)

type MasonryProps = React.ComponentProps<"div"> & {
  columns?: number
  columnWidth?: number
  gap?: number
}

type MasonryItemProps = Omit<HTMLMotionProps<"div">, "children"> & {
  span?: number
  children?: React.ReactNode
}

function Masonry({
  columns,
  columnWidth,
  gap = 4,
  className,
  children,
  ...props
}: MasonryProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const rafRef = React.useRef<number>(0)
  const staggerCounterRef = React.useRef(0)

  // Reset counter each render so new items in a batch get fresh 0-based indices
  staggerCounterRef.current = 0

  const getStaggerIndex = React.useCallback(
    () => staggerCounterRef.current++,
    [],
  )

  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const remPx = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    )
    const gapPx = gap * 0.25 * remPx

    function reflow() {
      const allChildren = Array.from(container!.children) as HTMLElement[]
      // Skip exiting items — they keep their position during exit animation
      const items = allChildren.filter((el) => el.dataset.exiting == null)

      if (items.length === 0) {
        container!.style.removeProperty("height")
        return
      }

      const containerWidth = container!.clientWidth
      if (containerWidth === 0) return

      let colCount: number
      if (columns != null) {
        colCount = Math.max(1, columns)
      } else if (columnWidth != null) {
        colCount = Math.max(
          1,
          Math.floor((containerWidth + gapPx) / (columnWidth + gapPx)),
        )
      } else {
        colCount = Math.max(
          1,
          Math.floor((containerWidth + gapPx) / (240 + gapPx)),
        )
      }

      // Single column: use normal flow with gap
      if (colCount <= 1) {
        container!.style.removeProperty("height")
        container!.style.display = "flex"
        container!.style.flexDirection = "column"
        container!.style.gap = `${gapPx}px`
        for (const item of items) {
          item.style.removeProperty("position")
          item.style.removeProperty("top")
          item.style.removeProperty("left")
          item.style.removeProperty("width")
        }
        return
      }

      // Multi-column: clear single-column styles
      container!.style.removeProperty("display")
      container!.style.removeProperty("flex-direction")
      container!.style.removeProperty("gap")

      const colWidth = (containerWidth - (colCount - 1) * gapPx) / colCount
      const columnBottoms = new Array<number>(colCount).fill(0)

      // Partition items: spanning (top-pinned) vs regular
      const topItems: { el: HTMLElement; span: number }[] = []
      const regularItems: HTMLElement[] = []
      for (const item of items) {
        const raw = parseInt(item.dataset.span || "1", 10)
        if (raw > 1) {
          topItems.push({ el: item, span: Math.min(raw, colCount) })
        } else {
          regularItems.push(item)
        }
      }

      // First pass: set width on all items for correct height measurement
      for (const { el, span } of topItems) {
        el.style.position = "absolute"
        el.style.width = `${span * colWidth + (span - 1) * gapPx}px`
      }
      for (const item of regularItems) {
        item.style.position = "absolute"
        item.style.width = `${colWidth}px`
      }

      // Second pass: batch-read heights
      const topHeights: number[] = []
      for (const { el } of topItems) {
        topHeights.push(el.offsetHeight)
      }
      const regularHeights: number[] = []
      for (const item of regularItems) {
        regularHeights.push(item.offsetHeight)
      }

      // Third pass: place top items at Y=0, left-to-right
      let nextCol = 0
      for (let i = 0; i < topItems.length; i++) {
        const { el, span } = topItems[i]!
        const s = Math.min(span, colCount - nextCol)

        const x = nextCol * (colWidth + gapPx)
        el.style.top = "0px"
        el.style.left = `${x}px`
        // Recalculate width if span was clamped
        if (s !== span) {
          el.style.width = `${s * colWidth + (s - 1) * gapPx}px`
        }

        const bottom = topHeights[i]! + gapPx
        for (let c = nextCol; c < nextCol + s; c++) {
          columnBottoms[c] = bottom
        }

        nextCol += s
      }

      // Fourth pass: place regular items in shortest column
      for (let i = 0; i < regularItems.length; i++) {
        let shortestCol = 0
        for (let c = 1; c < colCount; c++) {
          if (columnBottoms[c]! < columnBottoms[shortestCol]!) {
            shortestCol = c
          }
        }

        const x = shortestCol * (colWidth + gapPx)
        const y = columnBottoms[shortestCol]!

        regularItems[i]!.style.top = `${y}px`
        regularItems[i]!.style.left = `${x}px`

        columnBottoms[shortestCol] = y + regularHeights[i]! + gapPx
      }

      const maxBottom = Math.max(...columnBottoms) - gapPx
      container!.style.height = `${Math.max(0, maxBottom)}px`
    }

    function scheduleReflow() {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(reflow)
    }

    reflow()

    const ro = new ResizeObserver(scheduleReflow)
    ro.observe(container)

    const mo = new MutationObserver(scheduleReflow)
    mo.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-exiting", "data-span"],
    })

    // Detect image/media loads that change item heights
    container.addEventListener("load", scheduleReflow, true)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      mo.disconnect()
      container.removeEventListener("load", scheduleReflow, true)
      container.style.removeProperty("height")
      container.style.removeProperty("display")
      container.style.removeProperty("flex-direction")
      container.style.removeProperty("gap")
      const items = Array.from(container.children) as HTMLElement[]
      for (const item of items) {
        item.style.removeProperty("position")
        item.style.removeProperty("top")
        item.style.removeProperty("left")
        item.style.removeProperty("width")
      }
    }
  }, [columns, columnWidth, gap])

  return (
    <MasonryStaggerContext.Provider value={getStaggerIndex}>
      <div
        ref={containerRef}
        data-slot="masonry"
        className={cn("relative", className)}
        {...props}
      >
        <AnimatePresence>
          {children}
        </AnimatePresence>
      </div>
    </MasonryStaggerContext.Provider>
  )
}

function FeaturedBadge() {
  return (
    <span
      data-slot="masonry-badge"
      className="absolute top-2 right-2 z-10 flex size-5 items-center justify-center rounded-full bg-foreground/80 text-background"
      aria-label="Featured"
    >
      <StarIcon width={10} height={10} fill="currentColor" aria-hidden />
    </span>
  )
}

function MasonryItem({
  className,
  span,
  children,
  ...props
}: MasonryItemProps) {
  const isSpanned = span != null && span > 1
  const getStaggerIndex = React.useContext(MasonryStaggerContext)

  // Capture stagger index once on mount — useState initializer runs exactly once
  const [staggerDelay] = React.useState(() =>
    getStaggerIndex ? getStaggerIndex() * STAGGER_STEP : 0,
  )

  return (
    <motion.div
      data-slot="masonry-item"
      data-span={isSpanned ? span : undefined}
      className={cn("relative", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: -40,
        x: 40,
        filter: "blur(8px)",
        scale: 2,
        position: "absolute",
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: staggerDelay,
      }}
      {...props}
    >
      {children}
      {isSpanned && <FeaturedBadge />}
    </motion.div>
  )
}

export { Masonry, MasonryItem }
