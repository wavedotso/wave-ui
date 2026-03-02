import * as React from "react"

import { cn } from "./lib/utils"

// --- Types ---

type AspectRatioProps = React.ComponentProps<"div"> & {
  /** The width-to-height ratio (e.g. 16/9, 4/3, 1) */
  ratio: number
}

// --- Components ---

function AspectRatio({ ratio, className, ...props }: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ "--ratio": ratio } as React.CSSProperties}
      className={cn("relative aspect-(--ratio)", className)}
      {...props}
    />
  )
}

// --- Exports ---

export { AspectRatio }
export type { AspectRatioProps }
