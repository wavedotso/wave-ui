"use client";

import type * as React from "react";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";

import { cn } from "./lib/utils";
import { CheckIcon, MinusIcon } from "./lib/internal-icons";

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;

function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "cursor-clickable border-edge dark:bg-edge/30 data-checked:bg-primary data-indeterminate:bg-primary data-checked:text-white data-indeterminate:text-white dark:data-checked:bg-primary dark:data-indeterminate:bg-primary data-checked:border-primary data-indeterminate:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors outline-hidden group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group/indicator grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon className="col-start-1 row-start-1 group-data-indeterminate/indicator:hidden" />
        <MinusIcon className="col-start-1 row-start-1 hidden group-data-indeterminate/indicator:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
export type { CheckboxProps };
