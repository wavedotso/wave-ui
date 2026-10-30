"use client";

import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";

import { cn } from "./lib/utils";
import { resolveFinalFocus, type RestoreFocusOnClose } from "./lib/focus";

import { ChevronRightIcon, CheckIcon } from "./lib/internal-icons";

type MenuProps = React.ComponentProps<typeof MenuPrimitive.Root>;

type MenuPortalProps = React.ComponentProps<typeof MenuPrimitive.Portal>;

type MenuTriggerProps = React.ComponentProps<typeof MenuPrimitive.Trigger>;

type MenuContentProps = React.ComponentProps<typeof MenuPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof MenuPrimitive.Positioner>,
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

type MenuGroupProps = React.ComponentProps<typeof MenuPrimitive.Group>;

type MenuLabelProps = React.ComponentProps<typeof MenuPrimitive.GroupLabel> & {
  inset?: boolean;
};

type MenuItemProps = React.ComponentProps<typeof MenuPrimitive.Item> & {
  inset?: boolean;
  /** `danger` turns the item's text and leading icon red. */
  variant?: "default" | "danger";
};

type MenuSubProps = React.ComponentProps<typeof MenuPrimitive.SubmenuRoot>;

type MenuSubTriggerProps = React.ComponentProps<
  typeof MenuPrimitive.SubmenuTrigger
> & {
  inset?: boolean;
};

type MenuSubContentProps = MenuContentProps;

type MenuCheckboxItemProps = React.ComponentProps<
  typeof MenuPrimitive.CheckboxItem
> & {
  inset?: boolean;
};

type MenuRadioGroupProps = React.ComponentProps<
  typeof MenuPrimitive.RadioGroup
>;

type MenuRadioItemProps = React.ComponentProps<
  typeof MenuPrimitive.RadioItem
> & {
  inset?: boolean;
};

type MenuSeparatorProps = React.ComponentProps<typeof MenuPrimitive.Separator>;

type MenuShortcutProps = React.ComponentProps<"span">;

function Menu(props: MenuProps) {
  return <MenuPrimitive.Root data-slot="menu" {...props} />;
}

function MenuPortal(props: MenuPortalProps) {
  return <MenuPrimitive.Portal data-slot="menu-portal" {...props} />;
}

function MenuTrigger(props: MenuTriggerProps) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />;
}

function MenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  restoreFocusOnClose,
  finalFocus,
  onKeyDown,
  children,
  ...props
}: MenuContentProps) {
  const listRef = React.useRef<HTMLDivElement>(null);
  return (
    <MenuPortal>
      <MenuPrimitive.Positioner
        data-slot="menu-positioner"
        className="isolate z-50"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="menu-content"
          className={cn(
            "motion-pop-md border-edge bg-elevated text-contrast z-50 flex max-h-(--available-height) max-w-(--available-width) w-auto min-w-32 flex-col overflow-hidden rounded-md shadow-md border focus-visible:outline-hidden",
            className,
          )}
          finalFocus={resolveFinalFocus(restoreFocusOnClose, finalFocus)}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            // Opened with the pointer, the popup itself has focus, so the
            // browser's PageUp/PageDown would find nothing to scroll: the list
            // inside it scrolls. Page it by what's in view, less a little
            // overlap, as browsers do.
            const list = listRef.current;
            if (
              list &&
              !event.defaultPrevented &&
              event.target === event.currentTarget &&
              (event.key === "PageDown" || event.key === "PageUp")
            ) {
              event.preventDefault();
              const direction = event.key === "PageDown" ? 1 : -1;
              list.scrollBy({ top: direction * list.clientHeight * 0.875 });
            }
          }}
          {...props}
        >
          {/* The list scrolls, not the popup, so its edges can fade without
              the popup's own background, edge and shadow fading with them. */}
          <div
            ref={listRef}
            data-slot="menu-list"
            className="scroll-fade supports-[animation-timeline:scroll()]:scrollbar-none min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-1"
          >
            {children}
          </div>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPortal>
  );
}

function MenuGroup(props: MenuGroupProps) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />;
}

function MenuLabel({ className, inset, ...props }: MenuLabelProps) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="menu-label"
      data-inset={inset}
      className={cn(
        "text-muted px-1.5 py-1 text-xs font-medium data-inset:pl-7",
        className,
      )}
      {...props}
    />
  );
}

function MenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-highlighted data-[variant=danger]:text-danger data-[variant=danger]:*:[svg]:text-danger data-[variant=danger]:focus:bg-danger data-[variant=danger]:focus:text-white data-[variant=danger]:focus:**:text-white group/menu-item relative flex cursor-clickable items-center gap-1.5 rounded-sm px-1.5 py-1 text-sm focus:outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-30 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function MenuSub(props: MenuSubProps) {
  return <MenuPrimitive.SubmenuRoot data-slot="menu-sub" {...props} />;
}

function MenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuSubTriggerProps) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-highlighted data-popup-open:bg-highlighted flex cursor-clickable items-center gap-1.5 rounded-sm px-1.5 py-1 text-sm focus:outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function MenuSubContent({
  align = "start",
  // -5 cancels the popup's 1px edge and the list's p-1 (4px) top padding,
  // so the submenu's first item lines up with the parent item row, not the
  // popup container edge.
  alignOffset = -5,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: MenuSubContentProps) {
  return (
    <MenuContent
      data-slot="menu-sub-content"
      className={cn("w-auto min-w-24 shadow-md", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function MenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "focus:bg-highlighted relative flex cursor-clickable items-center gap-1.5 rounded-sm py-1 pr-8 pl-1.5 text-sm focus:outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-30 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span
        data-slot="menu-checkbox-item-indicator"
        className="pointer-events-none absolute right-2 flex items-center justify-center"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function MenuRadioGroup(props: MenuRadioGroupProps) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />;
}

function MenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuRadioItemProps) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menu-radio-item"
      data-inset={inset}
      className={cn(
        "focus:bg-highlighted relative flex cursor-clickable items-center gap-1.5 rounded-sm py-1 pr-8 pl-1.5 text-sm focus:outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-30 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span
        data-slot="menu-radio-item-indicator"
        className="pointer-events-none absolute right-2 flex items-center justify-center"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn("bg-line -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function MenuShortcut({ className, ...props }: MenuShortcutProps) {
  return (
    <span
      data-slot="menu-shortcut"
      className={cn("text-muted ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
}

export {
  Menu,
  MenuPortal,
  MenuTrigger,
  MenuContent,
  MenuGroup,
  MenuLabel,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
};

export type {
  MenuProps,
  MenuPortalProps,
  MenuTriggerProps,
  MenuContentProps,
  MenuGroupProps,
  MenuLabelProps,
  MenuItemProps,
  MenuSubProps,
  MenuSubTriggerProps,
  MenuSubContentProps,
  MenuCheckboxItemProps,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuSeparatorProps,
  MenuShortcutProps,
  RestoreFocusOnClose,
};
