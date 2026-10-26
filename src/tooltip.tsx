"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "./lib/utils";

type TooltipProviderProps = React.ComponentProps<
  typeof TooltipPrimitive.Provider
>;

type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>;

type TooltipTriggerProps = React.ComponentProps<
  typeof TooltipPrimitive.Trigger
>;

type TooltipContentProps = React.ComponentProps<
  typeof TooltipPrimitive.Popup
> & {
  side?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["side"];
  sideOffset?: React.ComponentProps<
    typeof TooltipPrimitive.Positioner
  >["sideOffset"];
  align?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["align"];
  alignOffset?: React.ComponentProps<
    typeof TooltipPrimitive.Positioner
  >["alignOffset"];
  anchor?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["anchor"];
  positionerClassName?: string;
  /** Render the pointer arrow. Defaults to `false`. */
  arrow?: boolean;
};

/**
 * Inherits Base UI's 600ms open delay (hover-intent) — we deliberately
 * do NOT force `delay={0}`, which makes grouped tooltips fire on
 * incidental mouse-over. Pass `delay` to override per provider.
 */
function TooltipProvider({ ...props }: TooltipProviderProps) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" {...props} />;
}

/**
 * Defaults to a non-hoverable popup (`disableHoverablePopup={true}`)
 * because Wave tooltips are non-interactive labels; a hoverable popup is
 * only needed when the tooltip contains links/controls. Pass
 * `disableHoverablePopup={false}` for interactive tooltip content.
 */
function Tooltip({ disableHoverablePopup = true, ...props }: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      data-slot="tooltip"
      disableHoverablePopup={disableHoverablePopup}
      {...props}
    />
  );
}

function TooltipTrigger({ children, ...props }: TooltipTriggerProps) {
  // If children is a valid React element, use it as the render target
  // This avoids nested button issues when wrapping Button components
  if (React.isValidElement(children)) {
    return (
      <TooltipPrimitive.Trigger
        data-slot="tooltip-trigger"
        render={children}
        {...props}
      />
    );
  }

  // Raw text/primitives not supported - warn in development
  if (process.env.NODE_ENV === "development" && children != null) {
    console.warn(
      "[TooltipTrigger] Children must be a valid React element, not raw text. Wrap text in a <span> or <button>.",
    );
  }

  return (
    <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props}>
      {children}
    </TooltipPrimitive.Trigger>
  );
}

function TooltipContent({
  className,
  positionerClassName,
  side = "top",
  sideOffset,
  align = "center",
  alignOffset = 0,
  anchor,
  arrow = false,
  children,
  ...props
}: TooltipContentProps) {
  // Give the arrow room: a bit more gap from the anchor when it's shown.
  const resolvedSideOffset = sideOffset ?? (arrow ? 12 : 8);

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        data-slot="tooltip-positioner"
        anchor={anchor}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={resolvedSideOffset}
        className={cn("isolate z-50", positionerClassName)}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "motion-pop-md bg-surface-inverse text-contrast-inverse z-50 w-fit max-w-xs rounded-sm px-3 py-1.5 text-xs",
            "inline-flex items-center gap-1.5 has-data-[slot=kbd]:pe-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-lg",
            className,
          )}
          {...props}
        >
          {children}
          {arrow ? (
            <TooltipPrimitive.Arrow
              data-slot="tooltip-arrow"
              className="bg-surface-inverse size-2.5 rounded-[2px] translate-y-[calc(-50%-2px)] rotate-45 data-[side=bottom]:top-1 data-[side=inline-end]:-start-1 data-[side=inline-end]:translate-x-[1.5px] rtl:data-[side=inline-end]:-translate-x-[1.5px] data-[side=inline-end]:translate-y-0 data-[side=inline-start]:-end-1 data-[side=inline-start]:translate-x-[-1.5px] rtl:data-[side=inline-start]:-translate-x-[-1.5px] data-[side=inline-start]:translate-y-0 data-[side=left]:-right-1 data-[side=left]:translate-x-[-1.5px] rtl:data-[side=left]:-translate-x-[-1.5px] data-[side=left]:translate-y-0 data-[side=right]:-left-1 data-[side=right]:translate-x-[1.5px] rtl:data-[side=right]:-translate-x-[1.5px] data-[side=right]:translate-y-0 data-[side=top]:-bottom-2.5"
            />
          ) : null}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

export type {
  TooltipProviderProps,
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
};
