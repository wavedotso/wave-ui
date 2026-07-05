"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "./lib/utils";

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  controlClassName?: string;
  /**
   * Accessible name for the thumb(s). The thumb is the interactive slider
   * control, so it needs its own name — a plain `aria-label` on `<Slider>`
   * labels the group, not the thumb. Receives the thumb index for range sliders.
   */
  getThumbAriaLabel?: (index: number) => string;
};

function Slider({
  className,
  controlClassName,
  defaultValue,
  value,
  min = 0,
  max = 100,
  orientation = "horizontal",
  "aria-label": ariaLabel,
  getThumbAriaLabel,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      className={cn(
        "data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full",
        className,
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      orientation={orientation}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control
        data-slot="slider-control"
        className={cn(
          "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-disabled:cursor-not-allowed data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          controlClassName,
        )}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="bg-secondary relative grow overflow-hidden rounded-full select-none data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            aria-label={
              getThumbAriaLabel ? getThumbAriaLabel(index) : ariaLabel
            }
            className="border-focus ring-focus/50 relative block size-3 shrink-0 rounded-full border bg-white motion-color cursor-clickable select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 data-disabled:pointer-events-none"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
export type { SliderProps };
