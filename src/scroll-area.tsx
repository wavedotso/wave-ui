"use client";

import type * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";

import { cn } from "./lib/utils";

type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  /**
   * Fade the content out toward any edge that has more to scroll to. On by
   * default; the fade size follows `--scroll-area-fade` (default `2.5rem`).
   */
  fade?: boolean;
};

type ScrollBarProps = React.ComponentProps<
  typeof ScrollAreaPrimitive.Scrollbar
>;

/**
 * A scrollable region with styled scrollbars. Both scrollbars are built in:
 * Base UI only mounts one when its axis overflows, so pass content and the
 * right bars appear. They fade in while the area is hovered or scrolling.
 */
function ScrollArea({
  className,
  children,
  fade = true,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn(
        // The focus ring lives on the root: a mask clips everything its
        // element paints, the viewport's own ring included.
        "relative motion-color has-[>[data-slot=scroll-area-viewport]:focus-visible]:ring-3 has-[>[data-slot=scroll-area-viewport]:focus-visible]:ring-focus/50 has-[>[data-slot=scroll-area-viewport]:focus-visible]:outline-hidden",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full rounded-[inherit] focus-visible:outline-hidden",
          // The edges fade where there is more to scroll (`scroll-fade` in
          // styles.css).
          fade && "scroll-fade",
        )}
      >
        {/* Content is what Base UI watches for size changes, so the thumb
         * keeps up when the content grows or shrinks after mount. */}
        <ScrollAreaPrimitive.Content data-slot="scroll-area-content">
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
      <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
    </ScrollAreaPrimitive.Root>
  );
}

// Hidden until the area is hovered or scrolling: it appears at once when
// scrolling starts and fades out on the motion tokens once it stops. The 1px
// transparent border is a spacer between the content and the bar.
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "pointer-events-none flex touch-none p-px opacity-0 transition-opacity duration-(--duration-md) ease-(--ease) select-none data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5 data-[orientation=vertical]:border-s data-[orientation=vertical]:border-s-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="bg-neutral relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
export type { ScrollAreaProps, ScrollBarProps };
