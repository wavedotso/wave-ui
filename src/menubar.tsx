"use client"

import * as React from "react"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"

import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuPortal,
  MenuRadioGroup,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  MenuCheckboxItem,
  MenuRadioItem,
} from "./menu"

import { cn } from "./lib/utils"

type MenubarProps = React.ComponentProps<typeof MenubarPrimitive>
type MenubarMenuProps = React.ComponentProps<typeof Menu>
type MenubarGroupProps = React.ComponentProps<typeof MenuGroup>
type MenubarPortalProps = React.ComponentProps<typeof MenuPortal>
type MenubarTriggerProps = React.ComponentProps<typeof MenuTrigger>
type MenubarContentProps = React.ComponentProps<typeof MenuContent>
type MenubarItemProps = React.ComponentProps<typeof MenuItem>
type MenubarCheckboxItemProps = React.ComponentProps<typeof MenuCheckboxItem>
type MenubarRadioGroupProps = React.ComponentProps<typeof MenuRadioGroup>
type MenubarRadioItemProps = React.ComponentProps<typeof MenuRadioItem>
type MenubarLabelProps = React.ComponentProps<typeof MenuLabel>
type MenubarSeparatorProps = React.ComponentProps<typeof MenuSeparator>
type MenubarShortcutProps = React.ComponentProps<typeof MenuShortcut>
type MenubarSubProps = React.ComponentProps<typeof MenuSub>
type MenubarSubTriggerProps = React.ComponentProps<typeof MenuSubTrigger>
type MenubarSubContentProps = React.ComponentProps<typeof MenuSubContent>

function Menubar({ className, ...props }: MenubarProps) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        "bg-background flex h-8 items-center gap-0.5 rounded-lg border p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function MenubarMenu({ ...props }: MenubarMenuProps) {
  return <Menu data-slot="menubar-menu" {...props} />
}

function MenubarGroup({ ...props }: MenubarGroupProps) {
  return <MenuGroup data-slot="menubar-group" {...props} />
}

function MenubarPortal({ ...props }: MenubarPortalProps) {
  return <MenuPortal data-slot="menubar-portal" {...props} />
}

function MenubarTrigger({ ...props }: MenubarTriggerProps) {
  return <MenuTrigger data-slot="menubar-trigger" {...props} />
}

function MenubarContent({
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  className,
  ...props
}: MenubarContentProps) {
  return (
    <MenuContent
      data-slot="menubar-content"
      className={cn("w-auto", className)}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function MenubarItem({ ...props }: MenubarItemProps) {
  return <MenuItem data-slot="menubar-item" {...props} />
}

function MenubarCheckboxItem({ ...props }: MenubarCheckboxItemProps) {
  return <MenuCheckboxItem data-slot="menubar-checkbox-item" {...props} />
}

function MenubarRadioGroup({ ...props }: MenubarRadioGroupProps) {
  return <MenuRadioGroup data-slot="menubar-radio-group" {...props} />
}

function MenubarRadioItem({ ...props }: MenubarRadioItemProps) {
  return <MenuRadioItem data-slot="menubar-radio-item" {...props} />
}

function MenubarLabel({ ...props }: MenubarLabelProps) {
  return <MenuLabel data-slot="menubar-label" {...props} />
}

function MenubarSeparator({ ...props }: MenubarSeparatorProps) {
  return <MenuSeparator data-slot="menubar-separator" {...props} />
}

function MenubarShortcut({ ...props }: MenubarShortcutProps) {
  return <MenuShortcut data-slot="menubar-shortcut" {...props} />
}

function MenubarSub({ ...props }: MenubarSubProps) {
  return <MenuSub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({ ...props }: MenubarSubTriggerProps) {
  return <MenuSubTrigger data-slot="menubar-sub-trigger" {...props} />
}

function MenubarSubContent({ ...props }: MenubarSubContentProps) {
  return <MenuSubContent data-slot="menubar-sub-content" {...props} />
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
