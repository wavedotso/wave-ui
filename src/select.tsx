"use client"

import * as React from "react"

import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "./lib/utils"
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, ChevronsUpDownIcon } from "./lib/internal-icons"

export type SelectProps<Value, Multiple extends boolean | undefined = false> =
  SelectPrimitive.Root.Props<Value, Multiple>

export type SelectGroupProps = React.ComponentProps<typeof SelectPrimitive.Group>
export type SelectValueProps = React.ComponentProps<typeof SelectPrimitive.Value>
type SelectTriggerBaseProps = React.ComponentProps<typeof SelectPrimitive.Trigger>
export type SelectPortalProps = React.ComponentProps<typeof SelectPrimitive.Portal>
export type SelectPositionerProps = React.ComponentProps<typeof SelectPrimitive.Positioner>
type SelectPopupProps = React.ComponentProps<typeof SelectPrimitive.Popup>
export type SelectListProps = React.ComponentProps<typeof SelectPrimitive.List>
export type SelectLabelProps = React.ComponentProps<typeof SelectPrimitive.GroupLabel>
export type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item>
export type SelectSeparatorProps = React.ComponentProps<typeof SelectPrimitive.Separator>
export type SelectScrollUpButtonProps = React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>
export type SelectScrollDownButtonProps = React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>

export type SelectTriggerProps = SelectTriggerBaseProps & {
  size?: "sm" | "default"
}

export type SelectContentProps = SelectPopupProps &
  Pick<
    SelectPositionerProps,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >

function Select<Value, Multiple extends boolean | undefined = false>({
  ...props
}: SelectProps<Value, Multiple>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectPortal({ ...props }: SelectPortalProps) {
  return <SelectPrimitive.Portal data-slot="select-portal" {...props} />
}

function SelectPositioner({ className, ...props }: SelectPositionerProps) {
  return (
    <SelectPrimitive.Positioner
      data-slot="select-positioner"
      className={className}
      {...props}
    />
  )
}

function SelectList({ className, ...props }: SelectListProps) {
  return (
    <SelectPrimitive.List
      data-slot="select-list"
      className={className}
      {...props}
    />
  )
}

function SelectGroup({ className, ...props }: SelectGroupProps) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectValueProps) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-edge data-placeholder:text-soft dark:bg-edge/30 dark:hover:bg-edge/50 focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 flex w-fit items-center justify-between gap-1.5 rounded-md border bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap motion-color outline-hidden select-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-sm *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        data-slot="select-icon"
        render={
          <ChevronsUpDownIcon className="text-muted pointer-events-none size-4" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectContentProps) {
  return (
    <SelectPortal>
      <SelectPositioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "motion-pop-md bg-elevated text-contrast ring-contrast/10 relative isolate z-50 max-h-(--available-height) min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md shadow-md ring-1",
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectList>{children}</SelectList>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPositioner>
    </SelectPortal>
  )
}

function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        "text-muted px-1.5 py-1 text-xs",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "data-highlighted:bg-primary data-highlighted:text-white not-data-[variant=destructive]:data-highlighted:**:text-white relative flex w-full cursor-clickable items-center gap-1.5 rounded-sm py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText data-slot="select-item-text" className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span data-slot="select-item-indicator" className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "bg-line pointer-events-none -mx-1 my-1 h-px",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: SelectScrollUpButtonProps) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "bg-elevated top-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: SelectScrollDownButtonProps) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bg-elevated bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectList,
  SelectPortal,
  SelectPositioner,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
