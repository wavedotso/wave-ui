"use client";

import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils";

const textareaVariants = cva(
  "bg-edge hover:border-focus focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-destructive/30 aria-invalid:border-destructive resize-y resize-handle disabled:pointer-events-none placeholder:text-soft flex field-sizing-content w-full rounded-md border border-transparent motion-color outline-hidden focus-visible:ring-3 disabled:opacity-30 aria-invalid:ring-3",
  {
    variants: {
      // Shared control ladder — same tiers/names as Button and Input. Textarea
      // grows with its content (`field-sizing-content`), so the ladder maps to a
      // `min-h-*` floor rather than a fixed height. Flat font ladder 12/14/16/18 —
      // one size per tier, no responsive split.
      size: {
        xs: "min-h-12 rounded-sm px-2 py-1 text-xs",
        sm: "min-h-14 px-3 py-1.5 text-sm",
        default: "min-h-16 px-3 py-2 text-base",
        lg: "min-h-20 px-4 py-2.5 text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type TextareaProps = Omit<React.ComponentProps<"textarea">, "onChange"> & {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onValueChange?: (value: string) => void;
} & VariantProps<typeof textareaVariants>;

function Textarea({
  className,
  size = "default",
  onChange,
  onValueChange,
  ...props
}: TextareaProps) {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange?.(e);
    onValueChange?.(e.target.value);
  }

  return (
    <textarea
      data-slot="textarea"
      data-size={size}
      className={cn(textareaVariants({ size }), className)}
      onChange={handleChange}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };

export type { TextareaProps };
