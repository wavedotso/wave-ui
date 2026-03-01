import { cn } from "./lib/utils"
import { LoaderIcon } from "./lib/internal-icons"

type SpinnerProps = React.ComponentProps<"svg">

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <LoaderIcon role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
