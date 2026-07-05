"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "./lib/utils"

const badgeVariants = cva(
  "h-5 gap-1 rounded-full border border-transparent px-2 py-0.5 text-xs font-medium motion-color has-data-[icon=inline-start]:pl-1.5 has-data-[icon=inline-end]:pr-1.5 [&>svg:not([class*='size-'])]:size-3 inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-focus focus-visible:ring-focus/50 focus-visible:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white [a]:hover:bg-primary/80",
        success:
          "bg-success/10 [a]:hover:bg-success/20 focus-visible:ring-success/50 text-success dark:bg-success/20",
        destructive:
          "bg-destructive/10 text-destructive [a]:hover:bg-destructive/20 focus-visible:ring-destructive/50 dark:bg-destructive/20",
        warning:
          "bg-warning/10 text-warning [a]:hover:bg-warning/20 focus-visible:ring-warning/50 dark:bg-warning/20",
        secondary:
          "bg-secondary text-contrast [a]:hover:bg-secondary/80",
        outline:
          "border-line text-contrast [a]:hover:bg-secondary [a]:hover:text-muted",
        ghost:
          "hover:bg-secondary hover:text-muted dark:hover:bg-secondary/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type BadgeProps = useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
