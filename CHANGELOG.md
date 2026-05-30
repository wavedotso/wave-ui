# @waveso/ui

## 0.4.0

### Minor Changes

- 306602a: Fixed token where CSS minified blur(0px) is invalid. Import and use src/styles.css for all (storyboard and lib).Token for cursor-clickable wired. Motion recipes for consistent lib transitions. Custom toast namespace tokens.

## 0.3.0

### Minor Changes

- 9ed70d5: Interactive elements now use a `pointer` cursor by default, via a single `--cursor-clickable` token. Buttons, toggles, menu/select/combobox/autocomplete/context-menu items, accordion & collapsible triggers, tabs, checkbox, switch, and radio all share it.

  For native / HIG behavior, set it back in your global CSS. One line flips the whole library with `root { --cursor-clickable: default; }`.

  Real <a> links keep their own pointer regardless and disabled controls keep not-allowed.

## 0.2.0

### Minor Changes

- aab9fa8: Correctness fixes, accessibility fixes, and a few consumer-facing contract changes.

  ### Breaking

  - **Sidebar:** removed the `data-state` attribute — now uses Collapsible's native `data-open`/`data-closed`. Migrate selectors: `[data-state=collapsed]` → `[data-closed]`, `[data-state=expanded]` → `[data-open]`.
  - **Table:** a selected `TableRow` now styles off `aria-selected` instead of `data-state="selected"`. Set `aria-selected="true"` on selected rows.
  - **Accordion:** `[data-slot="accordion-content"]` now targets the inner content region; the outer animated panel is `[data-slot="accordion-panel"]`.
  - **Alert:** the icon layout is triggered by `data-icon` on the icon, not auto-detected. Add `data-icon="inline-start"` to the alert's leading icon.
  - **Tooltip:** `TooltipProvider` no longer forces `delay={0}`; it inherits Base UI's 600ms hover-intent delay. Pass `delay` to customize.

  ### Fixed

  - **Drawer:** swipe-to-dismiss and touch scroll-lock now work (missing `Drawer.Viewport` wrapper).
  - **RSC:** `Badge`, `Breadcrumb`, `ButtonGroup`, `Item` now declare `"use client"` (they use the `useRender` hook and threw in server trees).
  - **Combobox:** dropdown no longer clips long options — grows from trigger width up to available width.
  - **Select:** keyboard-highlighted items now style correctly (uses `data-highlighted`).
  - **Context menu:** submenus position/size consistently with regular menu submenus and merge a passed `className`.
  - Removed dead Radix-style `data-[state=*]` CSS in `tooltip`/`toggle` (toggle now uses `data-pressed`); unified overlay backdrop animations across `dialog`/`alert-dialog`/`drawer`.
  - Corrected the misleading `disablePointerDismissal` JSDoc on `Dialog`.

  ### Added

  - New `data-slot` styling hooks: `context-menu-positioner`, `context-menu-checkbox-item-indicator`, `context-menu-radio-item-indicator`, `tooltip-positioner`, `select-item-text`, `select-item-indicator`, `combobox-item-indicator`, `accordion-panel`, `drawer-drag-handle`.

## 0.1.0

### Minor Changes

- 697a466: New component ActionBar. `finalFocus` stays as the low-level escape hatch, add `restoreFocusOnClose` (`"always" | "keyboard" | "never"`) to MenuContent, ContextMenuContent, and PopoverContent. Add XL size to the the Button component. Re-export `useWatch` from `@waveso/ui/form`. Base UI peer dependency floor raised to 1.4.1. The package is now built with tsdown (Rolldown).

## 0.0.10

### Patch Changes

- 267b9b7: add strokeWidth and baseColor to gradient reveal text

## 0.0.9

### Patch Changes

- f28200a: new components: film grain, animate, typewriter, count, and gradient reveal text

## 0.0.8

### Patch Changes

- 4770b80: film grain component

## 0.0.7

### Patch Changes

- 19e2943: add disablePointerDismissal to dialog, more sizes to alert dialog, base ui 1.3 to fix inert portals, small ui and bug fixes

## 0.0.6

### Patch Changes

- 6aaa452: radius-xs variable, update & fixed bugs in sidebar (sidebargrouplabel bug, y align, consistent paddings & margins, add TooltipProvider, isMobile, and more)
- 9694d4c: hoverable is deprecated, replaced with disableHoverablePopup

## 0.0.5

### Patch Changes

- e1aac99: solve tailwind classes for @source files at library level

## 0.0.4

### Patch Changes

- c24d5e4: cookie persistence, configurable breakpoint, scrollbar-none, configurable shortcut, duplicate flex

## 0.0.3

### Patch Changes

- Add new components toast, drawer, masonry, autocomplete, infinite scroll, combobox, alert, avatar, badge, button, card, checkbox, dialog, input, progress, separator, skeleton, spinner, switch, textarea, label, select, radio, item, field, context menu, alert dialog, context-menu, button group, tooltip, slider, toggle, input group, form, scroll, tabs, popover, aspect ratio, menu, menubar, accordion, radio group, toggle group, preview card, pagination.
