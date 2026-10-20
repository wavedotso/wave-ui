import type * as React from "react";

import { cn } from "./lib/utils";

type LabelProps = React.ComponentProps<"label">;

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-snug font-medium select-none [&[for]]:cursor-clickable",
        // Disabled, from whatever already says so: a disabled Base UI wrapper
        // around it (Field, FieldItem, RadioGroup, CheckboxGroup), a disabled
        // control before it (checkbox, radio, switch carry `.peer`), or the
        // control right after it (an input).
        "in-data-disabled:pointer-events-none in-data-disabled:opacity-30",
        "peer-data-disabled:pointer-events-none peer-data-disabled:opacity-30",
        "has-[+:is(:disabled,[data-disabled])]:pointer-events-none has-[+:is(:disabled,[data-disabled])]:opacity-30",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
export type { LabelProps };
