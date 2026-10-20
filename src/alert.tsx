import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils";

const alertVariants = cva(
  "grid gap-0.5 rounded-md border border-edge px-4 py-3 text-start text-sm has-data-[slot=alert-action]:pe-18 has-data-[icon]:grid-cols-[auto_1fr] has-data-[icon]:gap-x-2.5 *:data-[icon]:col-start-1 *:data-[icon]:row-span-2 *:data-[icon]:translate-y-0.5 *:data-[icon]:text-current *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4 w-full relative group/alert",
  {
    variants: {
      // Status lives in the icon and the border, never the text: the
      // title and description stay neutral so they're readable in every
      // theme (colored text on a neutral surface fails contrast).
      variant: {
        default: "bg-surface text-contrast",
        info: "bg-surface text-contrast border-info/30 *:data-[icon]:text-info *:[svg]:text-info",
        success:
          "bg-surface text-contrast border-success/30 *:data-[icon]:text-success *:[svg]:text-success",
        warning:
          "bg-surface text-contrast border-warning/30 *:data-[icon]:text-warning *:[svg]:text-warning",
        destructive:
          "bg-surface text-contrast border-destructive/30 *:data-[icon]:text-destructive *:[svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants>;
type AlertTitleProps = React.ComponentProps<"div">;
type AlertDescriptionProps = React.ComponentProps<"div">;
type AlertActionProps = React.ComponentProps<"div">;

/**
 * A callout for information the reader should notice. It has no live role
 * by default: pass `role="alert"` for an urgent message that appears while
 * someone is using the page (an error after an action), which screen readers
 * announce at once, or `role="status"` for a polite update. A static callout
 * needs neither.
 */
function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "[&_a]:hover:text-contrast font-medium group-has-data-[icon]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted [&_a]:hover:text-contrast group-has-data-[icon]/alert:col-start-2 text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
        className,
      )}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: AlertActionProps) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2.5 end-3", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertAction, alertVariants };
export type {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertActionProps,
};
