"use client"

import * as React from "react"
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"

import { cn } from "./lib/utils"

type PreviewCardProps = React.ComponentProps<typeof PreviewCardPrimitive.Root>
type PreviewCardTriggerProps = React.ComponentProps<typeof PreviewCardPrimitive.Trigger>
type PreviewCardPortalProps = React.ComponentProps<typeof PreviewCardPrimitive.Portal>
type PreviewCardPositionerProps = React.ComponentProps<typeof PreviewCardPrimitive.Positioner>
type PreviewCardPopupProps = React.ComponentProps<typeof PreviewCardPrimitive.Popup>

type PreviewCardContentProps = PreviewCardPopupProps &
  Pick<
    PreviewCardPositionerProps,
    "align" | "alignOffset" | "side" | "sideOffset" | "anchor"
  >

function PreviewCard({ ...props }: PreviewCardProps) {
  return <PreviewCardPrimitive.Root data-slot="preview-card" {...props} />
}

function PreviewCardTrigger({ ...props }: PreviewCardTriggerProps) {
  return (
    <PreviewCardPrimitive.Trigger
      data-slot="preview-card-trigger"
      {...props}
    />
  )
}

function PreviewCardPortal({ ...props }: PreviewCardPortalProps) {
  return <PreviewCardPrimitive.Portal data-slot="preview-card-portal" {...props} />
}

function PreviewCardPositioner({
  className,
  ...props
}: PreviewCardPositionerProps) {
  return (
    <PreviewCardPrimitive.Positioner
      data-slot="preview-card-positioner"
      className={className}
      {...props}
    />
  )
}

function PreviewCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  anchor,
  ...props
}: PreviewCardContentProps) {
  return (
    <PreviewCardPortal>
      <PreviewCardPositioner
        anchor={anchor}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="preview-card-content"
          className={cn(
            "motion-slide bg-popover text-popover-foreground ring-foreground/10 z-50 w-64 origin-(--transform-origin) rounded-lg p-2.5 text-sm shadow-md ring-1 outline-hidden",
            className,
          )}
          {...props}
        />
      </PreviewCardPositioner>
    </PreviewCardPortal>
  )
}

export {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardContent,
  PreviewCardPortal,
  PreviewCardPositioner,
}
