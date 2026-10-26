"use client";

import type * as React from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils";

const fieldVariants = cva("flex w-full gap-3", {
  variants: {
    orientation: {
      vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
      // Label beside the control, as in a settings row. Put a description in
      // `FieldContent` with the label so the row stays two columns.
      horizontal:
        "flex flex-row items-center *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

type FieldProps = React.ComponentProps<typeof FieldPrimitive.Root> &
  VariantProps<typeof fieldVariants>;
type FieldLabelProps = React.ComponentProps<typeof FieldPrimitive.Label>;
type FieldContentProps = React.ComponentProps<"div">;
type FieldDescriptionProps = React.ComponentProps<
  typeof FieldPrimitive.Description
>;
type FieldItemProps = React.ComponentProps<typeof FieldPrimitive.Item>;
type FieldErrorProps = React.ComponentProps<typeof FieldPrimitive.Error>;
type FieldValidityProps = React.ComponentProps<typeof FieldPrimitive.Validity>;

// `ref` matters here for React Hook Form / focus management; it flows
// through to the control via standard prop forwarding (React 19).
type FieldControlProps = React.ComponentProps<typeof FieldPrimitive.Control>;

/**
 * A labelled control with its messages. Below the control, `FieldError`
 * comes first and `FieldDescription` under it, so the hint stays visible
 * while the error is showing. An invalid field doesn't tint its text: the
 * control's danger ring and the error carry the state, and the label
 * stays neutral.
 */
function Field({ className, orientation, ...props }: FieldProps) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      data-orientation={orientation ?? "vertical"}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

// Matches `Label`, so an icon or a required mark lays out the same in both.
function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium select-none [&[for]]:cursor-clickable data-disabled:pointer-events-none data-disabled:opacity-30",
        className,
      )}
      {...props}
    />
  );
}

// No focus ring or disabled look here: FieldControl is a headless slot, and
// the composed control (e.g. `render={<Input/>}`) owns its own states.
function FieldControl({ className, ...props }: FieldControlProps) {
  return (
    <FieldPrimitive.Control
      data-slot="field-control"
      className={className}
      {...props}
    />
  );
}

/**
 * A label and its description stacked together, beside a control. The label
 * row is as tall as the default checkbox, radio and switch (24px), so its
 * text centers on the control.
 */
function FieldContent({ className, ...props }: FieldContentProps) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "flex flex-1 flex-col gap-2 leading-snug [&>[data-slot=field-label]]:min-h-6",
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn(
        "text-muted text-start text-sm leading-normal font-normal",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        "last:mt-0 nth-last-2:-mt-1 group-has-data-horizontal/field:text-balance",
        className,
      )}
      {...props}
    />
  );
}

// `group/field`: hovering the row (its label included) lights the control's
// hover state, as radio's `group-hover/field` expects.
function FieldItem({ className, ...props }: FieldItemProps) {
  return (
    <FieldPrimitive.Item
      data-slot="field-item"
      className={cn("group/field flex items-center gap-2", className)}
      {...props}
    />
  );
}

function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      className={cn("text-danger text-sm font-normal -mb-3", className)}
      {...props}
    />
  );
}

// Base UI's Validity does not accept `className`/`ref` (and we don't need to style it yet), so we export it as-is.
const FieldValidity = FieldPrimitive.Validity;

export {
  Field,
  FieldLabel,
  FieldControl,
  FieldContent,
  FieldDescription,
  FieldItem,
  FieldError,
  FieldValidity,
  FieldPrimitive,
  fieldVariants,
};
export type {
  FieldProps,
  FieldLabelProps,
  FieldContentProps,
  FieldDescriptionProps,
  FieldItemProps,
  FieldErrorProps,
  FieldValidityProps,
  FieldControlProps,
};
