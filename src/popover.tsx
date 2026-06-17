"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "./lib/utils"
import { resolveFinalFocus, type RestoreFocusOnClose } from "./lib/focus"

type PopoverProps = React.ComponentProps<typeof PopoverPrimitive.Root>
type PopoverTriggerProps = React.ComponentProps<typeof PopoverPrimitive.Trigger>
type PopoverPortalProps = React.ComponentProps<typeof PopoverPrimitive.Portal>
type PopoverPositionerProps = React.ComponentProps<typeof PopoverPrimitive.Positioner>
type PopoverTitleProps = React.ComponentProps<typeof PopoverPrimitive.Title>
type PopoverDescriptionProps = React.ComponentProps<typeof PopoverPrimitive.Description>

type PopoverBackdropProps = React.ComponentProps<typeof PopoverPrimitive.Backdrop>

type PopoverHeaderProps = React.ComponentProps<"div">

type PopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof PopoverPrimitive.Positioner>,
    "align" | "alignOffset" | "side" | "sideOffset" | "anchor"
  > & {
    /**
     * Focus-restoration policy when the popover closes. Defaults to
     * Base UI's behaviour (restore to the trigger). Use `"keyboard"`
     * when the trigger is hover/focus-within–revealed so a pointer
     * close doesn't keep it pinned visible. See {@link RestoreFocusOnClose}.
     */
    restoreFocusOnClose?: RestoreFocusOnClose
  }

function Popover({ ...props }: PopoverProps) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverPortal({ ...props }: PopoverPortalProps) {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />
}

function PopoverPositioner({ className, ...props }: PopoverPositionerProps) {
  return (
    <PopoverPrimitive.Positioner
      data-slot="popover-positioner"
      className={className}
      {...props}
    />
  )
}

function PopoverBackdrop({ className, ...props }: PopoverBackdropProps) {
  return (
    <PopoverPrimitive.Backdrop
      data-slot="popover-backdrop"
      className={cn("fixed inset-0 z-40", className)}
      {...props}
    />
  )
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  anchor,
  restoreFocusOnClose,
  finalFocus,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPortal>
      <PopoverPositioner
        anchor={anchor}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "motion-pop-md bg-popover text-popover-foreground ring-foreground/10 z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg p-2.5 text-sm shadow-md ring-1 outline-hidden",
            className
          )}
          finalFocus={resolveFinalFocus(restoreFocusOnClose, finalFocus)}
          {...props}
        />
      </PopoverPositioner>
    </PopoverPortal>
  )
}

function PopoverHeader({ className, ...props }: PopoverHeaderProps) {
  return (
    <div
      data-slot="popover-header"
      className={cn(
        "flex flex-col gap-0.5 text-sm",
        className
      )}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverDescriptionProps) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverBackdrop,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  PopoverPortal,
  PopoverPositioner,
}
