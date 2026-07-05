"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "./lib/utils"

type TooltipProviderProps = React.ComponentProps<typeof TooltipPrimitive.Provider>

type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>

type TooltipTriggerProps = React.ComponentProps<typeof TooltipPrimitive.Trigger>

type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Popup> & {
  side?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["side"];
  sideOffset?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["sideOffset"];
  align?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["align"];
  alignOffset?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["alignOffset"];
  anchor?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["anchor"];
  positionerClassName?: string;
}

/**
 * Inherits Base UI's 600ms open delay (hover-intent) — we deliberately
 * do NOT force `delay={0}`, which makes grouped tooltips fire on
 * incidental mouse-over. Pass `delay` to override per provider.
 */
function TooltipProvider({ ...props }: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      {...props}
    />
  )
}

/**
 * Defaults to a non-hoverable popup (`disableHoverablePopup={true}`)
 * because Wave tooltips are non-interactive labels; a hoverable popup is
 * only needed when the tooltip contains links/controls. Pass
 * `disableHoverablePopup={false}` for interactive tooltip content.
 */
function Tooltip({ disableHoverablePopup = true, ...props }: TooltipProps) {
  return <TooltipPrimitive.Root data-slot="tooltip" disableHoverablePopup={disableHoverablePopup} {...props} />
}

function TooltipTrigger({ children, ...props }: TooltipTriggerProps) {
  // If children is a valid React element, use it as the render target
  // This avoids nested button issues when wrapping Button components
  if (React.isValidElement(children)) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" render={children} {...props} />
  }

  // Raw text/primitives not supported - warn in development
  if (process.env.NODE_ENV === "development" && children != null) {
    console.warn("[TooltipTrigger] Children must be a valid React element, not raw text. Wrap text in a <span> or <button>.")
  }

  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props}>{children}</TooltipPrimitive.Trigger>
}

function TooltipContent({
  className,
  positionerClassName,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  anchor,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        data-slot="tooltip-positioner"
        anchor={anchor}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={cn("isolate z-50", positionerClassName)}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "motion-pop-md bg-surface-inverse text-contrast-inverse z-50 w-fit max-w-xs origin-(--transform-origin) rounded-sm px-3 py-1.5 text-xs",
            className,
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
}

export type {
  TooltipProviderProps,
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
}
