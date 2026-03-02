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

      // Read spans and calculate item widths
      const spans: number[] = []
      for (const item of items) {
        const raw = parseInt(item.dataset.span || "1", 10)
        spans.push(Math.min(Math.max(1, raw), colCount))
      }

      // First pass: set absolute + correct width for height measurement
      for (let i = 0; i < items.length; i++) {
        const s = spans[i]!
        const itemWidth =
          s > 1 ? s * colWidth + (s - 1) * gapPx : colWidth
        items[i]!.style.position = "absolute"
        items[i]!.style.width = `${itemWidth}px`
      }

      // Second pass: batch-read heights (single forced layout)
      const heights: number[] = []
      for (const item of items) {
        heights.push(item.offsetHeight)
      }

      // Third pass: place each item
      for (let i = 0; i < items.length; i++) {
        const s = spans[i]!
        let startCol: number
        let y: number

        if (s <= 1) {
          // Single-column: place in shortest column
          startCol = 0
          for (let c = 1; c < colCount; c++) {
            if (columnBottoms[c]! < columnBottoms[startCol]!) {
              startCol = c
            }
          }
          y = columnBottoms[startCol]!
        } else {
          // Multi-column: find consecutive group with lowest max bottom
          startCol = 0
          let bestMax = Infinity
          for (let start = 0; start <= colCount - s; start++) {
            let groupMax = 0
            for (let c = start; c < start + s; c++) {
              groupMax = Math.max(groupMax, columnBottoms[c]!)
            }
            if (groupMax < bestMax) {
              bestMax = groupMax
              startCol = start
            }
          }
          y = bestMax
        }

        const x = startCol * (colWidth + gapPx)

        items[i]!.style.top = `${y}px`
        items[i]!.style.left = `${x}px`

        // Update all spanned column bottoms
        const bottom = y + heights[i]! + gapPx
        for (let c = startCol; c < startCol + s; c++) {
          columnBottoms[c] = bottom
        }
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
