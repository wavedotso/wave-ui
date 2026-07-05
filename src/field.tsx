"use client";

import type * as React from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";

import { cn } from "./lib/utils";

type FieldProps = React.ComponentProps<typeof FieldPrimitive.Root>;
type FieldLabelProps = React.ComponentProps<typeof FieldPrimitive.Label>;
type FieldDescriptionProps = React.ComponentProps<
  typeof FieldPrimitive.Description
>;
type FieldItemProps = React.ComponentProps<typeof FieldPrimitive.Item>;
type FieldErrorProps = React.ComponentProps<typeof FieldPrimitive.Error>;
type FieldValidityProps = React.ComponentProps<typeof FieldPrimitive.Validity>;

// `ref` matters here for React Hook Form / focus management; it flows
// through to the control via standard prop forwarding (React 19).
type FieldControlProps = React.ComponentProps<typeof FieldPrimitive.Control>;

function Field({ className, ...props }: FieldProps) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cn(
        "grid w-full gap-2 data-[invalid]:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

function FieldControl({ className, ...props }: FieldControlProps) {
  return (
    <FieldPrimitive.Control
      data-slot="field-control"
      className={cn(
        // No focus ring here: FieldControl is a headless slot, and the
        // composed control (e.g. `render={<Input/>}`) owns its own ring.
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
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
        "text-muted text-left text-sm leading-normal font-normal",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

function FieldItem({ className, ...props }: FieldItemProps) {
  return (
    <FieldPrimitive.Item
      data-slot="field-item"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
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
  FieldDescription,
  FieldItem,
  FieldError,
  FieldValidity,
  FieldPrimitive,
};
export type {
  FieldProps,
  FieldLabelProps,
  FieldDescriptionProps,
  FieldItemProps,
  FieldErrorProps,
  FieldValidityProps,
  FieldControlProps,
};
