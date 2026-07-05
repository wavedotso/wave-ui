import * as React from "react"

import { cn } from "./lib/utils"

export type SkeletonProps = React.ComponentProps<"div">

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-secondary animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
