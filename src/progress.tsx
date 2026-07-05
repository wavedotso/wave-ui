"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "./lib/utils"

// `value` is typed from the primitive, so it accepts `number | null`;
// `null` puts the progress bar into its indeterminate state (Base UI then
// emits `data-indeterminate` on the root and omits the indicator width).
export type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>
export type ProgressTrackProps = React.ComponentProps<typeof ProgressPrimitive.Track>
export type ProgressIndicatorProps = React.ComponentProps<typeof ProgressPrimitive.Indicator>
export type ProgressLabelProps = React.ComponentProps<typeof ProgressPrimitive.Label>
export type ProgressValueProps = React.ComponentProps<typeof ProgressPrimitive.Value>

function Progress({ className, children, value = null, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn("group/progress flex flex-wrap gap-3", className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressTrackProps) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "bg-secondary relative flex h-1 w-full items-center overflow-x-hidden rounded-full",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({ className, ...props }: ProgressIndicatorProps) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "bg-primary h-full transition-[width]",
        // Indeterminate: Base UI omits the indicator width (rendering an
        // invisible zero-width bar), so give it a sensible pulsing partial
        // fill instead of collapsing to nothing.
        "group-data-indeterminate/progress:w-2/5 group-data-indeterminate/progress:animate-pulse",
        className
      )}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressLabelProps) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressValueProps) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "text-muted ml-auto text-sm tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
