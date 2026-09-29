"use client";

import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";

const inputGroupVariants = cva(
  "bg-edge hover:border-focus has-[[data-slot=input-group-control]:focus-visible]:border-focus has-[[data-slot=input-group-control]:focus-visible]:ring-focus/50 has-[[data-slot][aria-invalid=true]]:ring-destructive/30 has-[[data-slot][aria-invalid=true]]:border-destructive group/input-group relative flex w-full min-w-0 items-center rounded-md border border-transparent motion-color outline-hidden in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:pointer-events-none has-disabled:opacity-30 not-has-disabled:has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-3 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3",
  {
    variants: {
      // Same tiers/names as Input & Button (24/32/36/44). The height lives on this
      // container (the field surface); the stripped inner control tracks it via
      // `group-data-[size=*]/input-group:*` in InputGroupInput — CSS propagation,
      // like ButtonGroup, not a context.
      size: {
        xs: "h-6 rounded-sm",
        sm: "h-8",
        default: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type InputGroupProps = React.ComponentProps<"div"> &
  VariantProps<typeof inputGroupVariants>;

type InputGroupAddonProps = React.ComponentProps<"div"> &
  VariantProps<typeof inputGroupAddonVariants>;

type InputGroupButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "size" | "type"
> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  };

type InputGroupTextProps = React.ComponentProps<"span">;

type InputGroupInputProps = React.ComponentProps<typeof Input>;

type InputGroupTextareaProps = React.ComponentProps<"textarea">;

function InputGroup({
  className,
  size = "default",
  ...props
}: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      data-size={size}
      role="group"
      className={cn(inputGroupVariants({ size }), className)}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "text-muted h-auto gap-2 has-[>button]:gap-[3px] py-2 not-has-[>button]:group-data-[size=xs]/input-group:py-1 not-has-[>button]:group-data-[size=sm]/input-group:py-1.5 not-has-[>button]:group-data-[size=lg]/input-group:py-2.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>svg:not([class*='size-'])]:size-4 flex cursor-text items-center justify-center select-none",
  {
    variants: {
      // Inline/edge padding derives from the group's `data-size` so addon content
      // lines up with a standalone Input at every tier (2 / 3 / 3 / 4 = Input's
      // `px` ladder). Buttons and kbd get a negative pull so their own padding tucks
      // back to the edge.
      align: {
        "inline-start":
          "order-first ps-3 not-has-[>button]:group-data-[size=xs]/input-group:ps-2 not-has-[>button]:group-data-[size=sm]/input-group:ps-3 not-has-[>button]:group-data-[size=lg]/input-group:ps-4 has-[>kbd]:-ms-1 has-[>button]:self-stretch has-[>button]:py-[3px] has-[>button]:ps-[3px] [&>button]:h-full",
        "inline-end":
          "order-last pe-3 not-has-[>button]:group-data-[size=xs]/input-group:pe-2 not-has-[>button]:group-data-[size=sm]/input-group:pe-3 not-has-[>button]:group-data-[size=lg]/input-group:pe-4 has-[>kbd]:-me-1 has-[>button]:self-stretch has-[>button]:py-[3px] has-[>button]:pe-[3px] [&>button]:h-full",
        "block-start":
          "order-first w-full justify-start px-3 group-data-[size=xs]/input-group:px-2 group-data-[size=sm]/input-group:px-3 group-data-[size=lg]/input-group:px-4 pt-3 group-has-[>input]/input-group:pt-3.5 [.border-b]:pb-3.5",
        "block-end":
          "order-last w-full justify-start px-3 group-data-[size=xs]/input-group:px-2 group-data-[size=sm]/input-group:px-3 group-data-[size=lg]/input-group:px-4 pb-3 group-has-[>input]/input-group:pb-3.5 [.border-t]:pt-3.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: InputGroupAddonProps) {
  return (
    // click-to-focus affordance; the click only forwards focus to the
    // keyboard-accessible input, it is not itself a control.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement
          ?.querySelector<HTMLElement>("input, textarea")
          ?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  // Two shapes only — `default` (padded pill) and `icon` (square). There is no
  // tier prop: an inline addon stretches the button to the full field height
  // (`[&>button]:h-full`), so the `h-*` below is just the resting height for
  // block addons and Combobox's fixed cell. Rounding, gap, text and icon size
  // track the group's tier.
  "shadow-none flex items-center gap-1.5 rounded-md text-sm [&>svg:not([class*='size-'])]:size-4 group-data-[size=xs]/input-group:gap-1 group-data-[size=xs]/input-group:rounded-sm group-data-[size=xs]/input-group:text-xs group-data-[size=xs]/input-group:[&>svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      size: {
        default:
          "h-7 px-2 group-data-[size=xs]/input-group:px-1.5 group-data-[size=lg]/input-group:px-2.5",
        icon: "h-6 aspect-square p-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function InputGroupButton({
  className,
  type = "button",
  variant = "default",
  size = "default",
  ...props
}: InputGroupButtonProps) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: InputGroupTextProps) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        "text-muted flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: InputGroupInputProps) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        // `h-full` tracks the group height at every tier; the group is the field
        // surface, so the inner control strips its own border/fill/ring. Padding +
        // font follow the group's `data-size`. The rendered Input is the flat-16
        // `default` tier, so default needs no font override; xs→12, sm→14, lg→18
        // restate their tier. px: xs 8 / sm·default 12 / lg 16.
        "h-full flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 group-data-[size=xs]/input-group:px-2 group-data-[size=xs]/input-group:text-xs group-data-[size=sm]/input-group:px-3 group-data-[size=sm]/input-group:text-sm group-data-[size=lg]/input-group:px-4 group-data-[size=lg]/input-group:text-lg",
        className,
      )}
      {...props}
    />
  );
}

// The group owns the field surface, size and border, so the inner control
// strips its own. It stays vertically resizable (inheriting `resize-y` from the
// base), so the hover grip is functional inside a group too. The `data-slot`
// override lands on the <textarea> so the group's focus/invalid `has-[…]`
// selectors still target it.
function InputGroupTextarea({ className, ...props }: InputGroupTextareaProps) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0",
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  inputGroupVariants,
  inputGroupAddonVariants,
  inputGroupButtonVariants,
};

export type {
  InputGroupProps,
  InputGroupAddonProps,
  InputGroupButtonProps,
  InputGroupTextProps,
  InputGroupInputProps,
  InputGroupTextareaProps,
};
