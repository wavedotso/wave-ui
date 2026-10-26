"use client";

import type * as React from "react";
import {
  Group as GroupPrimitive,
  Panel as PanelPrimitive,
  Separator as SeparatorPrimitive,
} from "react-resizable-panels";

import { cn } from "./lib/utils";

// The library takes its element ref as `elementRef`; every part here takes a
// plain `ref` instead, like the rest of the library, and hands it over.
type ResizablePanelGroupProps = Omit<
  React.ComponentProps<typeof GroupPrimitive>,
  "elementRef"
> & {
  ref?: React.Ref<HTMLDivElement>;
};
type ResizablePanelProps = Omit<
  React.ComponentProps<typeof PanelPrimitive>,
  "elementRef"
> & {
  ref?: React.Ref<HTMLDivElement>;
};
type ResizableHandleProps = Omit<
  React.ComponentProps<typeof SeparatorPrimitive>,
  "elementRef"
> & {
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Show a grip on the line, a visible hint that it can be dragged.
   *
   * @default false
   */
  grip?: boolean;
};

/**
 * A row of panels the user resizes by dragging the handles between them, or
 * from the keyboard once a handle has focus. Pass `orientation="vertical"` to
 * stack them instead.
 *
 * The group fills its parent: it sets its own `width` and `height` to 100%
 * inline, so a height class on the group has no effect. Size the parent, or
 * pass `style`.
 */
function ResizablePanelGroup({ ref, ...props }: ResizablePanelGroupProps) {
  return (
    <GroupPrimitive
      data-slot="resizable-panel-group"
      elementRef={ref}
      {...props}
    />
  );
}

/**
 * One resizable region. Numeric sizes are pixels; use strings for
 * percentages (`defaultSize="25%"`). `className` lands on the panel's inner
 * element, which scrolls when the content overflows.
 */
function ResizablePanel({ ref, ...props }: ResizablePanelProps) {
  return (
    <PanelPrimitive data-slot="resizable-panel" elementRef={ref} {...props} />
  );
}

/**
 * The line between two panels. It lights up while the pointer is close
 * enough to drag it: the library hit-tests a zone wider than the line itself
 * and reports it in `data-separator` (`hover`, `active`, `focus`, `disabled`),
 * which CSS `:hover` on a 1px line would miss.
 */
function ResizableHandle({
  className,
  grip = false,
  ref,
  ...props
}: ResizableHandleProps) {
  return (
    <SeparatorPrimitive
      data-slot="resizable-handle"
      elementRef={ref}
      className={cn(
        // `z-10` keeps the grip and the focus ring above both neighbours.
        // Disabled keeps the line (it still divides the content) and drops
        // pointer events, which also hides the library's inline
        // `cursor: not-allowed`.
        "group/resizable-handle bg-contour z-10 flex items-center justify-center motion-color outline-hidden focus-visible:ring-3 focus-visible:ring-focus/50 data-[separator=active]:bg-focus data-[separator=hover]:bg-focus data-[separator=disabled]:pointer-events-none aria-[orientation=horizontal]:h-px aria-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    >
      {grip && (
        <div
          data-slot="resizable-handle-grip"
          className="bg-shade h-6 w-1 shrink-0 rounded-full motion-color group-data-[separator=active]/resizable-handle:bg-focus group-data-[separator=hover]/resizable-handle:bg-focus group-data-[separator=disabled]/resizable-handle:opacity-30 group-aria-[orientation=horizontal]/resizable-handle:h-1 group-aria-[orientation=horizontal]/resizable-handle:w-6"
        />
      )}
    </SeparatorPrimitive>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };

export type {
  ResizablePanelGroupProps,
  ResizablePanelProps,
  ResizableHandleProps,
};
