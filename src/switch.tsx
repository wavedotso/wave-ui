"use client";

import type * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils";

const switchVariants = cva(
  "@container cursor-clickable data-checked:bg-primary data-unchecked:bg-shade data-unchecked:hover:border-focus focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-danger/30 aria-invalid:border-danger peer relative inline-flex shrink-0 items-center rounded-full border border-transparent motion-color outline-hidden after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 aria-invalid:ring-3 data-disabled:pointer-events-none data-disabled:opacity-30",
  {
    variants: {
      size: {
        default: "h-6 w-11 p-1",
        sm: "h-4 w-7 p-0.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const switchThumbVariants = cva(
  "bg-white pointer-events-none block rounded-full ring-0 transition-transform data-checked:translate-x-[calc(100cqw_-_100%)] rtl:data-checked:-translate-x-[calc(100cqw_-_100%)] data-unchecked:translate-x-0 rtl:data-unchecked:-translate-x-0",
  {
    variants: {
      size: {
        default: "h-4 w-6",
        sm: "h-3 w-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> &
  VariantProps<typeof switchVariants>;

function Switch({ className, size = "default", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={switchThumbVariants({ size })}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
export type { SwitchProps };
