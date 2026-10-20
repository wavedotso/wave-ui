import type * as React from "react";

import { cn } from "./lib/utils";

type SpinnerProps = React.ComponentProps<"svg">;

/**
 * A circle with a gap, rotating — drawn in `currentColor` so it takes the tone
 * of whatever it sits in, and sized in `em` so it matches the text/icon beside
 * it without a size prop at every call site. The `<svg>` itself is the
 * accessible status (`role="status"` + `aria-label`), so pass `aria-label` to
 * override the announced text.
 */
function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <svg
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      // `em`-sized to match the surrounding text. `motion-spin-sm` is the fast
      // (0.5s) tier — reads as "working". Under reduced motion it keeps spinning
      // (a frozen ring reads as broken) but slows to a calm rate.
      className={cn("size-[1.15em] shrink-0 motion-spin-sm", className)}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        strokeWidth="3"
        className="fill-none stroke-current opacity-20"
      />
      <path
        d="M20 12a8 8 0 0 0-8-8"
        strokeWidth="3"
        strokeLinecap="round"
        className="fill-none stroke-current"
      />
    </svg>
  );
}

export { Spinner };
export type { SpinnerProps };
