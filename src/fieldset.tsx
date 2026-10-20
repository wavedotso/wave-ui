"use client";

import type * as React from "react";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";

import { cn } from "./lib/utils";

type FieldsetProps = React.ComponentProps<typeof FieldsetPrimitive.Root>;
type FieldsetLegendProps = React.ComponentProps<
  typeof FieldsetPrimitive.Legend
>;

/**
 * Groups related fields under one legend (an address, a set of choices).
 * `disabled` disables every `Field` inside it.
 */
function Fieldset({ className, ...props }: FieldsetProps) {
  return (
    <FieldsetPrimitive.Root
      data-slot="fieldset"
      className={cn(
        // `min-w-0`: a fieldset is min-content wide by default, which lets
        // long content overflow its container.
        "flex w-full min-w-0 flex-col gap-7 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 *:data-[slot=field-group]:gap-4",
        className,
      )}
      {...props}
    />
  );
}

/** The fieldset's title, announced as its accessible name. */
function FieldsetLegend({ className, ...props }: FieldsetLegendProps) {
  return (
    <FieldsetPrimitive.Legend
      data-slot="fieldset-legend"
      className={cn(
        "mb-3 text-base font-medium data-disabled:opacity-30",
        className,
      )}
      {...props}
    />
  );
}

export { Fieldset, FieldsetLegend };
export type { FieldsetProps, FieldsetLegendProps };
