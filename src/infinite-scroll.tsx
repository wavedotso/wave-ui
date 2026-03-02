"use client"

import * as React from "react"

import { cn } from "./lib/utils"
import { Spinner } from "./spinner"

type InfiniteScrollProps = {
  onLoadMore: () => void
  hasMore: boolean
  isLoading?: boolean
  direction?: "down" | "up"
  root?: React.RefObject<Element | null>
  rootMargin?: string
  threshold?: number
  loader?: React.ReactNode
  endMessage?: React.ReactNode
  className?: string
  children?: React.ReactNode
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
}: InfiniteScrollProps) {
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const loadingRef = React.useRef(false)

  const onLoadMoreRef = React.useRef(onLoadMore)
  React.useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  }, [onLoadMore])

  React.useEffect(() => {
    if (!isLoading) {
      loadingRef.current = false
    }
  }, [isLoading])

  React.useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting && !loadingRef.current) {
          loadingRef.current = true
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
  }, [hasMore, root, rootMargin, threshold])

  const loaderContent = isLoading && (
    <div
      data-slot="infinite-scroll-loader"
      className="flex items-center justify-center py-6"
    >
      {loader ?? <Spinner className="size-6 text-muted-foreground" />}
    </div>
  )

  const endContent = !hasMore && !isLoading && endMessage && (
    <div
      data-slot="infinite-scroll-end"
      className="flex items-center justify-center py-6 text-sm text-muted-foreground"
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
      data-slot="infinite-scroll"
      aria-busy={isLoading}
      className={cn("flex flex-col", className)}
    >
      {direction === "up" && (
        <>
          {sentinel}
          {loaderContent}
        </>
      )}

      {children}

      {direction === "down" && (
        <>
          {sentinel}
          {loaderContent}
        </>
      )}

      {endContent}
    </div>
  )
}

export { InfiniteScroll, type InfiniteScrollProps }
