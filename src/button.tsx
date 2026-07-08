"use client";

import type * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils";

const buttonVariants = cva(
  "cursor-clickable focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-destructive/30 aria-invalid:border-destructive rounded-md border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap motion-color disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-hidden group/button select-none active:not-aria-[haspopup]:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/80",
        outline:
          "border-edge bg-foundation hover:bg-secondary/80 hover:text-contrast dark:bg-edge/30 aria-expanded:bg-secondary aria-expanded:text-contrast",
        secondary:
          "bg-secondary text-contrast hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-contrast",
        ghost:
          "text-contrast hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-contrast",
        destructive:
          "bg-destructive text-white hover:bg-destructive/80 focus-visible:ring-destructive/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5",
        xs: "h-6 gap-1 rounded-sm px-2.5 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-sm in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<typeof ButtonPrimitive> &
  VariantProps<typeof buttonVariants>;

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      nativeButton={props.render ? false : undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
