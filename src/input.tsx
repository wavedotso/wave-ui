import type * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils";

const inputVariants = cva(
  "dark:bg-edge/30 hover:bg-edge/50 dark:hover:bg-edge/50 border-edge focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-destructive/30 aria-invalid:border-destructive disabled:bg-edge/50 dark:disabled:bg-edge/80 placeholder:text-soft flex w-full min-w-0 items-center overflow-hidden rounded-md border bg-transparent motion-color outline-hidden file:inline-flex file:my-[3px] file:items-center file:me-3 file:cursor-clickable file:rounded-md file:border-0 file:bg-primary file:px-2.5 file:leading-none file:font-medium file:text-white file:motion-color file:hover:bg-primary/80 focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-3",
  {
    variants: {
      // Shared control ladder — same tiers/names as Button, so a `sm` input,
      // `sm` select and `sm` button line up. `text-base` on the touch sizes keeps
      // the 16px that stops iOS zoom-on-focus, dropping to `md:text-sm` on desktop.
      //
      // The file button is inset 3px from the field: `file:my-[3px]` sets the
      // top/bottom gap and `file:h-*` (tier height − 2px border − 6px margin, landing
      // on the h-4/6/7/8 scale) fills the rest, while `file:-ms-*` pulls it 3px off the
      // leading edge. Fixed px because `::file-selector-button` ignores `%`/flex heights.
      size: {
        xs: "h-6 rounded-sm px-2 text-xs file:-ms-[5px] file:h-4",
        sm: "h-8 px-2.5 text-base file:-ms-[7px] file:h-6 md:text-sm",
        default: "h-9 px-3 text-base file:-ms-[9px] file:h-7 md:text-sm",
        lg: "h-10 px-3.5 text-base file:-ms-[11px] file:h-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

// `size` is the CVA variant, not the legacy native `size` (character-width)
// attribute — same trade Radix's TextField makes; use CSS width for that.
type InputProps = Omit<React.ComponentProps<typeof InputPrimitive>, "size"> &
  VariantProps<typeof inputVariants>;

function Input({ className, type, size = "default", ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants };
export type { InputProps };
