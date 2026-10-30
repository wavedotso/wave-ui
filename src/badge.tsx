"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils";

const badgeVariants = cva(
  "h-5 gap-1 rounded-full border border-transparent px-2 py-0.5 text-xs font-medium motion-color has-data-[icon=inline-start]:ps-1.5 has-data-[icon=inline-end]:pe-1.5 [&_svg:not([class*='size-'])]:size-3 inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&_svg]:shrink-0 [&_svg]:pointer-events-none focus-visible:border-focus focus-visible:ring-focus/50 focus-visible:ring-3 aria-invalid:ring-danger/30 aria-invalid:border-danger overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: "bg-primary text-white [a]:hover:bg-primary/80",
        success: "bg-success text-white [a]:hover:bg-success/80",
        danger:
          "bg-danger text-white [a]:hover:bg-danger/80 [a]:focus-visible:ring-danger/50",
        warning: "bg-warning text-white [a]:hover:bg-warning/80",
        secondary: "bg-secondary text-contrast [a]:hover:bg-secondary/80",
        outline:
          "border-contour bg-foundation [a]:hover:bg-highlighted [a]:hover:text-contrast",
        ghost: "text-muted [a]:hover:bg-highlighted",
        link: "text-primary [a]:underline-offset-4 [a]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

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
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
export type { BadgeProps };
