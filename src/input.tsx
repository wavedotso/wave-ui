import type * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "./lib/utils";

type InputProps = React.ComponentProps<typeof InputPrimitive>;

function Input({ className, type, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "dark:bg-edge/30 border-edge focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-destructive/30 aria-invalid:border-destructive disabled:bg-edge/50 dark:disabled:bg-edge/80 file:text-contrast placeholder:text-soft h-8 w-full min-w-0 rounded-md border bg-transparent px-2.5 py-1 text-base transition-colors outline-hidden file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };
