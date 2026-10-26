"use client";

import type * as React from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils";

const toggleVariants = cva(
  "cursor-clickable focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-danger/30 aria-invalid:border-danger rounded-md border border-transparent bg-clip-padding font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap motion-color data-disabled:pointer-events-none data-disabled:opacity-30 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-hidden group/toggle select-none active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "text-contrast hover:bg-highlight data-pressed:bg-primary data-pressed:text-white data-pressed:hover:bg-primary/80 not-supports-backdrop-filter:data-pressed:hover:bg-primary/90 data-pressed:hover:backdrop-blur-xl data-pressed:hover:backdrop-saturate-150",
        outline:
          "border-shade bg-foundation hover:bg-highlight hover:text-contrast data-pressed:border-primary data-pressed:bg-primary data-pressed:text-white data-pressed:hover:bg-primary/80 not-supports-backdrop-filter:data-pressed:hover:bg-primary/90 data-pressed:hover:backdrop-blur-xl data-pressed:hover:backdrop-saturate-150",
      },
      size: {
        default:
          "h-9 min-w-9 gap-1.5 px-3 text-base has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5",
        xs: "h-6 min-w-6 gap-1 rounded-sm px-2 text-xs has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 min-w-8 gap-1 px-3 text-sm has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        lg: "h-11 min-w-11 gap-1.5 px-4 text-lg has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-sm in-data-[slot=toggle-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ToggleProps = React.ComponentProps<typeof TogglePrimitive> &
  VariantProps<typeof toggleVariants>;

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
export type { ToggleProps };
