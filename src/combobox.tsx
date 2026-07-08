"use client";

import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";

import { cn } from "./lib/utils";
import { Button } from "./button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group";
import { ChevronDownIcon, CloseIcon, CheckIcon } from "./lib/internal-icons";

type ComboboxProps = React.ComponentProps<typeof ComboboxPrimitive.Root>;

type ComboboxValueProps = React.ComponentProps<typeof ComboboxPrimitive.Value>;
type ComboboxTriggerProps = React.ComponentProps<
  typeof ComboboxPrimitive.Trigger
>;
type ComboboxClearProps = React.ComponentProps<typeof ComboboxPrimitive.Clear>;
type ComboboxInputBaseProps = React.ComponentProps<
  typeof ComboboxPrimitive.Input
>;

type ComboboxPortalProps = React.ComponentProps<
  typeof ComboboxPrimitive.Portal
>;
type ComboboxPositionerProps = React.ComponentProps<
  typeof ComboboxPrimitive.Positioner
>;
type ComboboxPopupProps = React.ComponentProps<typeof ComboboxPrimitive.Popup>;

type ComboboxListProps = React.ComponentProps<typeof ComboboxPrimitive.List>;
type ComboboxItemProps = React.ComponentProps<typeof ComboboxPrimitive.Item>;
type ComboboxGroupProps = React.ComponentProps<typeof ComboboxPrimitive.Group>;
type ComboboxLabelProps = React.ComponentProps<
  typeof ComboboxPrimitive.GroupLabel
>;
type ComboboxCollectionProps = React.ComponentProps<
  typeof ComboboxPrimitive.Collection
>;
type ComboboxEmptyProps = React.ComponentProps<typeof ComboboxPrimitive.Empty>;
type ComboboxSeparatorProps = React.ComponentProps<
  typeof ComboboxPrimitive.Separator
>;
type ComboboxChipsProps = React.ComponentProps<typeof ComboboxPrimitive.Chips>;
type ComboboxChipBaseProps = React.ComponentProps<
  typeof ComboboxPrimitive.Chip
>;
type ComboboxChipsInputProps = React.ComponentProps<
  typeof ComboboxPrimitive.Input
>;

type ComboboxInputProps = ComboboxInputBaseProps & {
  showTrigger?: boolean;
  showClear?: boolean;
};

type ComboboxChipProps = ComboboxChipBaseProps & {
  showRemove?: boolean;
};

type ComboboxContentProps = ComboboxPopupProps &
  Pick<
    ComboboxPositionerProps,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >;

function Combobox({ ...props }: ComboboxProps) {
  return <ComboboxPrimitive.Root data-slot="combobox" {...props} />;
}

function ComboboxValue({ ...props }: ComboboxValueProps) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxTriggerProps) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="text-muted pointer-events-none size-4" />
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxClear({ className, ...props }: ComboboxClearProps) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      aria-label="Clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn("motion-scale-sm", className)}
      {...props}
    >
      <CloseIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxInput({
  className,
  children,
  // No `= false` default: forcing `disabled={false}` onto the rendered input
  // would override the disabled state Base UI computes from a disabled
  // `<Combobox>` root. Leaving it `undefined` lets the root's state win, while
  // an explicit `disabled` prop is still respected.
  disabled,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxInputProps) {
  return (
    <ComboboxPrimitive.InputGroup
      render={<InputGroup className={cn(className)} />}
    >
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {/* Stack the trigger chevron and clear button in one cell so they
         * cross-fade. In single-select mode Base UI mounts the Clear only
         * when a value is *selected* (not while typing), and marks it with
         * a persistent `data-visible` attribute. The chevron keys its
         * fade-out (opacity/blur/scale via `motion-scale-sm`) off that exact
         * attribute, so chevron→clear cross-fades in place. */}
        <div className="relative grid size-6 *:[grid-area:1/1]">
          {showTrigger ? (
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              nativeButton
              render={<ComboboxTrigger />}
              data-slot="input-group-button"
              className={cn(
                "motion-scale-sm data-pressed:bg-transparent",
                "group-has-[[data-slot=combobox-clear][data-visible]]/input-group:pointer-events-none",
                "group-has-[[data-slot=combobox-clear][data-visible]]/input-group:opacity-0",
                "group-has-[[data-slot=combobox-clear][data-visible]]/input-group:[filter:blur(var(--blur-sm))]",
                "group-has-[[data-slot=combobox-clear][data-visible]]/input-group:scale-[var(--scale-sm)]",
              )}
              disabled={disabled}
            />
          ) : null}
          {showClear ? <ComboboxClear disabled={disabled} /> : null}
        </div>
      </InputGroupAddon>
      {children}
    </ComboboxPrimitive.InputGroup>
  );
}

function ComboboxPortal({ ...props }: ComboboxPortalProps) {
  return <ComboboxPrimitive.Portal data-slot="combobox-portal" {...props} />;
}

function ComboboxPositioner({ className, ...props }: ComboboxPositionerProps) {
  return (
    <ComboboxPrimitive.Positioner
      data-slot="combobox-positioner"
      className={className}
      {...props}
    />
  );
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxContentProps) {
  return (
    <ComboboxPortal>
      <ComboboxPositioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            "motion-pop-md bg-elevated text-contrast ring-contrast/10 *:data-[slot=input-group]:bg-edge/30 *:data-[slot=input-group]:border-edge/30 group/combobox-content relative max-h-(--available-height) max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden rounded-md shadow-md ring-1 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:shadow-none",
            className,
          )}
          {...props}
        />
      </ComboboxPositioner>
    </ComboboxPortal>
  );
}

function ComboboxList({ className, ...props }: ComboboxListProps) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxItem({ className, children, ...props }: ComboboxItemProps) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "data-highlighted:bg-primary data-highlighted:text-white not-data-[variant=destructive]:data-highlighted:**:text-white relative flex w-full cursor-clickable items-center gap-2 rounded-sm py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span
            data-slot="combobox-item-indicator"
            className="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
          />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxGroup({ className, ...props }: ComboboxGroupProps) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={className}
      {...props}
    />
  );
}

function ComboboxLabel({ className, ...props }: ComboboxLabelProps) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn("text-muted px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function ComboboxCollection({ ...props }: ComboboxCollectionProps) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  );
}

function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "text-muted hidden w-full justify-center py-2 text-center text-sm group-data-empty/combobox-content:flex",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxSeparator({ className, ...props }: ComboboxSeparatorProps) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("bg-line -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function ComboboxChips({ className, ...props }: ComboboxChipsProps) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "dark:bg-edge/30 border-edge focus-within:border-focus focus-within:ring-focus/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive dark:has-aria-invalid:border-destructive/50 flex min-h-8 flex-wrap items-center gap-1 rounded-md border bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:ring-3 has-aria-invalid:ring-3 has-data-[slot=combobox-chip]:px-1",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxChipProps) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "bg-secondary text-contrast flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0",
        className,
      )}
      {...props}
    >
      {children}
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-sm" />}
          className="-ml-1 opacity-50 hover:opacity-100"
          data-slot="combobox-chip-remove"
          aria-label="Remove"
        >
          <CloseIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({ className, ...props }: ComboboxChipsInputProps) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn("min-w-16 flex-1 outline-hidden", className)}
      {...props}
    />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxClear,
  useComboboxAnchor,
};

export type {
  ComboboxProps,
  ComboboxValueProps,
  ComboboxTriggerProps,
  ComboboxClearProps,
  ComboboxPortalProps,
  ComboboxPositionerProps,
  ComboboxListProps,
  ComboboxItemProps,
  ComboboxGroupProps,
  ComboboxLabelProps,
  ComboboxCollectionProps,
  ComboboxEmptyProps,
  ComboboxSeparatorProps,
  ComboboxChipsProps,
  ComboboxChipsInputProps,
  ComboboxInputProps,
  ComboboxChipProps,
  ComboboxContentProps,
};
