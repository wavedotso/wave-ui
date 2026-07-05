"use client"

import * as React from "react"

import { cn } from "./lib/utils"
import { Spinner } from "./spinner"

export type InfiniteScrollProps = React.ComponentProps<"div"> & {
  onLoadMore: () => void
  hasMore: boolean
  isLoading?: boolean
  direction?: "down" | "up"
  root?: React.RefObject<Element | null>
  rootMargin?: string
  threshold?: number
  loader?: React.ReactNode
  endMessage?: React.ReactNode
}

function InfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading = false,
  direction = "down",
  root,
  rootMargin = "200px",
  threshold = 0,
  loader,
  endMessage,
  className,
  children,
  ...props
}: InfiniteScrollProps) {
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  const onLoadMoreRef = React.useRef(onLoadMore)
  React.useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  }, [onLoadMore])

  React.useEffect(() => {
    const sentinel = sentinelRef.current
    // Don't observe while a load is in flight. Re-observing when `isLoading`
    // flips back to false re-checks the sentinel's CURRENT visibility (an
    // IntersectionObserver fires an initial callback on `observe`), so a
    // sentinel that stayed in view across the load triggers the next page.
    // Without this the observer only fires on intersection *transitions* and
    // stalls once the sentinel stops moving.
    if (!sentinel || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          onLoadMoreRef.current()
        }
      },
      {
        root: root?.current ?? null,
        rootMargin,
        threshold,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoading, root, rootMargin, threshold])

  const loaderContent = isLoading && (
    <div
      data-slot="infinite-scroll-loader"
      className="flex items-center justify-center py-6"
    >
      {loader ?? <Spinner className="size-6 text-muted" />}
    </div>
  )

  const endContent = !hasMore && !isLoading && endMessage && (
    <div
      data-slot="infinite-scroll-end"
      className="flex items-center justify-center py-6 text-sm text-muted"
    >
      {endMessage}
    </div>
  )

  const sentinel = (
    <div
      ref={sentinelRef}
      data-slot="infinite-scroll-sentinel"
      aria-hidden="true"
      className="h-px"
    />
  )

  return (
    <div
      {...props}
      data-slot="infinite-scroll"
      aria-busy={isLoading}
      className={cn("flex flex-col", className)}
    >
      {direction === "up" && (
        <>
          {sentinel}
          {loaderContent}
          {endContent}
        </>
      )}

      {children}

      {direction === "down" && (
        <>
          {sentinel}
          {loaderContent}
          {endContent}
        </>
      )}
    </div>
  )
}

export { InfiniteScroll }
