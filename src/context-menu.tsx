"use client";

import type * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";

import { ChevronRightIcon, CheckIcon } from "./lib/internal-icons";

import { cn } from "./lib/utils";
import { resolveFinalFocus, type RestoreFocusOnClose } from "./lib/focus";

type ContextMenuProps = React.ComponentProps<typeof ContextMenuPrimitive.Root>;
type ContextMenuPortalProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Portal
>;
type ContextMenuTriggerProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Trigger
>;

type ContextMenuContentProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Popup
> &
  Pick<
    React.ComponentProps<typeof ContextMenuPrimitive.Positioner>,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    /**
     * Focus-restoration policy when the menu closes. Defaults to Base
     * UI's behaviour (restore to the trigger). Use `"keyboard"` when
     * the trigger is hover/focus-within–revealed so a pointer close
     * doesn't keep it pinned visible. See {@link RestoreFocusOnClose}.
     */
    restoreFocusOnClose?: RestoreFocusOnClose;
  };

type ContextMenuGroupProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Group
>;

type ContextMenuLabelProps = React.ComponentProps<
  typeof ContextMenuPrimitive.GroupLabel
> & {
  inset?: boolean;
};

type ContextMenuItemProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Item
> & {
  inset?: boolean;
  /** `danger` turns the item's text and leading icon red. */
  variant?: "default" | "danger";
};

type ContextMenuSubProps = React.ComponentProps<
  typeof ContextMenuPrimitive.SubmenuRoot
>;

type ContextMenuSubTriggerProps = React.ComponentProps<
  typeof ContextMenuPrimitive.SubmenuTrigger
> & {
  inset?: boolean;
};

type ContextMenuCheckboxItemProps = React.ComponentProps<
  typeof ContextMenuPrimitive.CheckboxItem
> & {
  inset?: boolean;
};

type ContextMenuRadioGroupProps = React.ComponentProps<
  typeof ContextMenuPrimitive.RadioGroup
>;

type ContextMenuRadioItemProps = React.ComponentProps<
  typeof ContextMenuPrimitive.RadioItem
> & {
  inset?: boolean;
};

type ContextMenuSeparatorProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Separator
>;

type ContextMenuSubContentProps = React.ComponentProps<
  typeof ContextMenuContent
>;
type ContextMenuShortcutProps = React.ComponentProps<"span">;

function ContextMenu(props: ContextMenuProps) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuPortal(props: ContextMenuPortalProps) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}

function ContextMenuTrigger({ className, ...props }: ContextMenuTriggerProps) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn("select-none", className)}
      {...props}
    />
  );
}

function ContextMenuContent({
  className,
  align = "start",
  alignOffset = 4,
  side = "inline-end",
  sideOffset = 0,
  restoreFocusOnClose,
  finalFocus,
  ...props
}: ContextMenuContentProps) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        data-slot="context-menu-positioner"
        className="isolate z-50 outline-hidden"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(
            // Glass: a translucent fill with the blur on the popup itself (a
            // blur on a ::before layer only half-blurs the page behind it and
            // scrolls away with a long menu's content). Where the browser
            // can't blur, the fill stays at 90% so text stays readable. Items
            // round to the popup's radius minus its padding, so their corners
            // follow the popup's curve.
            "motion-pop-md bg-elevated/80 not-supports-backdrop-filter:bg-elevated/90 text-contrast ring-contrast/10 z-50 max-h-(--available-height) min-w-48 overflow-x-hidden overflow-y-auto rounded-lg p-1.5 shadow-md ring-1 backdrop-blur-xl backdrop-saturate-150 outline-hidden",
            className,
          )}
          finalFocus={resolveFinalFocus(restoreFocusOnClose, finalFocus)}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuGroup(props: ContextMenuGroupProps) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuLabelProps) {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "text-muted px-3 py-2.5 text-xs font-medium data-inset:ps-9.5",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-highlight data-[variant=danger]:text-danger data-[variant=danger]:*:[svg]:text-danger data-[variant=danger]:focus:bg-danger data-[variant=danger]:focus:text-white data-[variant=danger]:focus:**:text-white group/context-menu-item relative flex cursor-clickable items-center gap-2.5 rounded-[calc(var(--radius)+var(--spacing)-var(--spacing)*1.5)] px-3 py-2 text-sm font-medium outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-30 data-inset:ps-9.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuSub(props: ContextMenuSubProps) {
  return (
    <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
  );
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuSubTriggerProps) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-highlight data-popup-open:bg-highlight flex cursor-clickable items-center gap-2.5 rounded-[calc(var(--radius)+var(--spacing)-var(--spacing)*1.5)] px-3 py-2 text-sm font-medium outline-hidden select-none data-inset:ps-9.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto rtl:rotate-180" />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

function ContextMenuSubContent({
  align = "start",
  // -6 cancels the popup's p-1.5 (6px) top padding so the submenu's first
  // item lines up with the parent item row, not the popup container edge.
  alignOffset = -6,
  side = "inline-end",
  sideOffset = 0,
  className,
  ...props
}: ContextMenuSubContentProps) {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      className={cn("w-auto min-w-24", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ContextMenuCheckboxItemProps) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "focus:bg-highlight relative flex cursor-clickable items-center gap-2.5 rounded-[calc(var(--radius)+var(--spacing)-var(--spacing)*1.5)] py-2 pe-8 ps-3 text-sm font-medium outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-30 data-inset:ps-9.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span
        data-slot="context-menu-checkbox-item-indicator"
        className="absolute end-2 pointer-events-none"
      >
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioGroup(props: ContextMenuRadioGroupProps) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ContextMenuRadioItemProps) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      className={cn(
        "focus:bg-highlight relative flex cursor-clickable items-center gap-2.5 rounded-[calc(var(--radius)+var(--spacing)-var(--spacing)*1.5)] py-2 pe-8 ps-3 text-sm font-medium outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-30 data-inset:ps-9.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span
        data-slot="context-menu-radio-item-indicator"
        className="absolute end-2 pointer-events-none"
      >
        <ContextMenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuSeparatorProps) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("bg-contour -mx-1.5 my-1.5 h-px", className)}
      {...props}
    />
  );
}

function ContextMenuShortcut({
  className,
  ...props
}: ContextMenuShortcutProps) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn("text-muted ms-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};

export type {
  ContextMenuProps,
  ContextMenuPortalProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuLabelProps,
  ContextMenuItemProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuSeparatorProps,
  ContextMenuSubContentProps,
  ContextMenuShortcutProps,
  RestoreFocusOnClose,
};
