"use client"

import * as React from "react"

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"

import { cn } from "./lib/utils"

type AutocompleteProps = React.ComponentProps<typeof AutocompletePrimitive.Root>
type AutocompleteInputProps = React.ComponentProps<typeof AutocompletePrimitive.Input>
type AutocompleteTriggerProps = React.ComponentProps<typeof AutocompletePrimitive.Trigger>
type AutocompleteIconProps = React.ComponentProps<typeof AutocompletePrimitive.Icon>
type AutocompleteClearProps = React.ComponentProps<typeof AutocompletePrimitive.Clear>
type AutocompleteValueProps = React.ComponentProps<typeof AutocompletePrimitive.Value>

type AutocompletePortalProps = React.ComponentProps<typeof AutocompletePrimitive.Portal>
type AutocompleteBackdropProps = React.ComponentProps<typeof AutocompletePrimitive.Backdrop>
type AutocompletePositionerProps = React.ComponentProps<typeof AutocompletePrimitive.Positioner>
type AutocompletePopupProps = React.ComponentProps<typeof AutocompletePrimitive.Popup>
type AutocompleteArrowProps = React.ComponentProps<typeof AutocompletePrimitive.Arrow>
type AutocompleteStatusProps = React.ComponentProps<typeof AutocompletePrimitive.Status>
type AutocompleteEmptyProps = React.ComponentProps<typeof AutocompletePrimitive.Empty>

type AutocompleteListProps = React.ComponentProps<typeof AutocompletePrimitive.List>
type AutocompleteRowProps = React.ComponentProps<typeof AutocompletePrimitive.Row>
type AutocompleteItemProps = React.ComponentProps<typeof AutocompletePrimitive.Item>
type AutocompleteSeparatorProps = React.ComponentProps<typeof AutocompletePrimitive.Separator>
type AutocompleteGroupProps = React.ComponentProps<typeof AutocompletePrimitive.Group>
type AutocompleteGroupLabelProps = React.ComponentProps<typeof AutocompletePrimitive.GroupLabel>
type AutocompleteCollectionProps = React.ComponentProps<typeof AutocompletePrimitive.Collection>

type AutocompleteContentProps = AutocompletePopupProps &
  Pick<
    AutocompletePositionerProps,
    "align" | "alignOffset" | "side" | "sideOffset"
  >

function Autocomplete({ ...props }: AutocompleteProps) {
  return <AutocompletePrimitive.Root data-slot="autocomplete" {...props} />
}

function AutocompleteInput({ className, ...props }: AutocompleteInputProps) {
  return (
    <AutocompletePrimitive.Input
      data-slot="autocomplete-input"
      className={cn(
        "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 placeholder:text-muted-foreground h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
        className,
      )}
      {...props}
    />
  )
}

function AutocompleteTrigger({ className, ...props }: AutocompleteTriggerProps) {
  return (
    <AutocompletePrimitive.Trigger
      data-slot="autocomplete-trigger"
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function AutocompleteIcon({ className, ...props }: AutocompleteIconProps) {
  return (
    <AutocompletePrimitive.Icon
      data-slot="autocomplete-icon"
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function AutocompleteClear({ className, ...props }: AutocompleteClearProps) {
  return (
    <AutocompletePrimitive.Clear
      data-slot="autocomplete-clear"
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function AutocompleteValue({ ...props }: AutocompleteValueProps) {
  return (
    <AutocompletePrimitive.Value data-slot="autocomplete-value" {...props} />
  )
}

function AutocompletePortal({ className, ...props }: AutocompletePortalProps) {
  return (
    <AutocompletePrimitive.Portal
      data-slot="autocomplete-portal"
      className={cn(className)}
      {...props}
    />
  )
}

function AutocompleteBackdrop({ className, ...props }: AutocompleteBackdropProps) {
  return (
    <AutocompletePrimitive.Backdrop
      data-slot="autocomplete-backdrop"
      className={cn("fixed inset-0", className)}
      {...props}
    />
  )
}

function AutocompletePositioner({ className, ...props }: AutocompletePositionerProps) {
  return (
    <AutocompletePrimitive.Positioner
      data-slot="autocomplete-positioner"
      className={cn(className)}
      {...props}
    />
  )
}

function AutocompletePopup({ className, ...props }: AutocompletePopupProps) {
  return (
    <AutocompletePrimitive.Popup
      data-slot="autocomplete-popup"
      className={cn(
        "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 group/autocomplete-content relative max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg shadow-md ring-1 duration-100",
        className,
      )}
      {...props}
    />
  )
}

function AutocompleteArrow({ className, ...props }: AutocompleteArrowProps) {
  return (
    <AutocompletePrimitive.Arrow
      data-slot="autocomplete-arrow"
      className={cn("fill-popover", className)}
      {...props}
    />
  )
}

function AutocompleteStatus({ className, ...props }: AutocompleteStatusProps) {
  return (
    <AutocompletePrimitive.Status
      data-slot="autocomplete-status"
      className={cn("text-muted-foreground flex w-full justify-center py-2 text-center text-sm", className)}
      {...props}
    />
  )
}

function AutocompleteEmpty({ className, ...props }: AutocompleteEmptyProps) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn("text-muted-foreground hidden w-full justify-center py-2 text-center text-sm group-data-empty/autocomplete-content:flex", className)}
      {...props}
    />
  )
}

function AutocompleteList({ className, ...props }: AutocompleteListProps) {
  return (
    <AutocompletePrimitive.List
      data-slot="autocomplete-list"
      className={cn("scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0", className)}
      {...props}
    />
  )
}

function AutocompleteRow({ className, ...props }: AutocompleteRowProps) {
  return (
    <AutocompletePrimitive.Row
      data-slot="autocomplete-row"
      className={cn(className)}
      {...props}
    />
  )
}

function AutocompleteItem({ className, ...props }: AutocompleteItemProps) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pl-1.5 pr-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function AutocompleteSeparator({ className, ...props }: AutocompleteSeparatorProps) {
  return (
    <AutocompletePrimitive.Separator
      data-slot="autocomplete-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function AutocompleteGroup({ className, ...props }: AutocompleteGroupProps) {
  return (
    <AutocompletePrimitive.Group
      data-slot="autocomplete-group"
      className={cn("pt-1", className)}
      {...props}
    />
  )
}

function AutocompleteGroupLabel({ className, ...props }: AutocompleteGroupLabelProps) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="autocomplete-group-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function AutocompleteCollection({ ...props }: AutocompleteCollectionProps) {
  return (
    <AutocompletePrimitive.Collection
      data-slot="autocomplete-collection"
      {...props}
    />
  )
}

function AutocompleteContent({
  className,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 6,
  ...props
}: AutocompleteContentProps) {
  return (
    <AutocompletePortal>
      <AutocompletePositioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <AutocompletePopup className={className} {...props} />
      </AutocompletePositioner>
    </AutocompletePortal>
  )
}

export {
  Autocomplete,
  AutocompleteArrow,
  AutocompleteBackdrop,
  AutocompleteClear,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteIcon,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompleteRow,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  AutocompleteValue,
}