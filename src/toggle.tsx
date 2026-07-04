"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "./lib/utils"

const toggleVariants = cva(
  "cursor-clickable hover:text-contrast focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-pressed:bg-secondary gap-1 rounded-md text-sm font-medium motion-color [&_svg:not([class*='size-'])]:size-4 group/toggle hover:bg-secondary inline-flex items-center justify-center whitespace-nowrap outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-edge hover:bg-secondary border bg-transparent",
      },
      size: {
        default: "h-8 min-w-8 px-2",
        sm: "h-7 min-w-7 rounded-sm px-1.5 text-[0.8rem]",
        lg: "h-9 min-w-9 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

type ToggleProps = React.ComponentProps<typeof TogglePrimitive> &
  VariantProps<typeof toggleVariants>

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
  )
}

export { Toggle, toggleVariants }
