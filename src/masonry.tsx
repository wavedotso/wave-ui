"use client"

import * as React from "react"

import { cn } from "./lib/utils"

type MasonryProps = React.ComponentProps<"div"> & {
  columns?: number
  columnWidth?: number
  gap?: number
}

type MasonryItemProps = React.ComponentProps<"div"> & {
  span?: number
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

  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const remPx = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    )
    const gapPx = gap * 0.25 * remPx

    function reflow() {
      const items = Array.from(container!.children) as HTMLElement[]
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

      // Single column: use normal flow, no positioning needed
      if (colCount <= 1) {
        for (const item of items) {
          item.style.removeProperty("position")
          item.style.removeProperty("top")
          item.style.removeProperty("left")
          item.style.removeProperty("width")
        }
        container!.style.removeProperty("height")
        return
      }

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
      // Top items get their spanning width
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
    mo.observe(container, { childList: true, subtree: true })

    // Detect image/media loads that change item heights
    container.addEventListener("load", scheduleReflow, true)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      mo.disconnect()
      container.removeEventListener("load", scheduleReflow, true)
      container.style.removeProperty("height")
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
    <div
      ref={containerRef}
      data-slot="masonry"
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function MasonryItem({ className, span, ...props }: MasonryItemProps) {
  return (
    <div
      data-slot="masonry-item"
      data-span={span != null && span > 1 ? span : undefined}
      className={className}
      {...props}
    />
  )
}

export { Masonry, MasonryItem }
