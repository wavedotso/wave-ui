import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils";

const alertVariants = cva(
  "grid gap-0.5 rounded-md border border-edge px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-data-[icon]:grid-cols-[auto_1fr] has-data-[icon]:gap-x-2 *:data-[icon]:col-start-1 *:data-[icon]:row-span-2 *:data-[icon]:translate-y-0.5 *:data-[icon]:text-current *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4 w-full relative group/alert",
  {
    variants: {
      variant: {
        default: "bg-surface text-contrast",
        destructive:
          "text-destructive bg-surface *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
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

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
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
      className={cn("absolute top-2 right-2", className)}
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
