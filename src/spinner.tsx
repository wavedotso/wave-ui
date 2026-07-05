import * as React from "react"

import { cn } from "./lib/utils"
import { LoaderIcon } from "./lib/internal-icons"

type SpinnerProps = React.ComponentProps<"svg">

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <LoaderIcon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      // The spinner IS the accessible status, so it opts out of the
      // decorative-by-default aria-hidden that internal icons carry.
      aria-hidden={false}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
