# @waveso/ui

## 0.5.0

### Minor Changes

- 650d6cc: A complete, token-driven motion system — and the cleanups behind it.

  Every overlay and interactive control now animates through a small set of CSS recipes instead of ad-hoc `tw-animate-css` classes. They're pure CSS (no JS), driven by Base UI's `data-starting-style` / `data-ending-style` lifecycle, share **one easing curve** (circ-out), and fully collapse under `prefers-reduced-motion`:

  - **`motion-slide`** — flyouts that open from a trigger (tooltip, popover, menu + submenu, select, context-menu + submenu, autocomplete, combobox popup): fade + blur + a directional slide keyed to the trigger's `data-[side]`.
  - **`motion-scale`** — fade + blur + scale. Powers dialog & alert-dialog content (a subtle zoom-in) and the combobox chevron ↔ clear cross-fade.
  - **`motion-fade`** — fade + blur, no movement. A general-purpose "fade in place" for any surface that should carry the blur signature without sliding or scaling. (Available as a utility; not wired to a component by default.)
  - **`motion-scrim`** — opacity only, for full-screen backdrops. Animating blur across the whole viewport janks, so the dim just fades; the frosted-glass look comes from a static `backdrop-filter` faded by this opacity.
  - **`motion-color`** — interaction-state transitions on controls (hover / focus / pressed / checked): color, background, border, ring.

  They read from one set of overridable `:root` tokens — `--duration`, `--ease`, `--blur`, `--scale`, `--offset`, `--stagger` — so you can retune the whole library's feel from your own `:root`. (Small icon targets pin an absolute blur via `--motion-scale-blur`, so they stay crisp no matter how you set the surface `--blur`.)

  ### Behavior changes to know about

  - **Popups animate differently now.** Every flyout uses the recipes above (blur + directional slide / scale / fade) instead of the old zoom-and-slide, and dialogs now zoom in. If you targeted the old `data-open:animate-in` / `zoom-in-95` / `slide-in-from-*` classes, they're gone.
  - **`transition-all` removed library-wide.** Controls transition only the properties that actually change (color, background, border, ring), so unrelated changes — layout, or transitions you add via `className` — no longer animate by accident. `Progress` animates `width`; the `Sidebar` rail is timed to the panel it borders.
  - **`Animate` defaults changed.** `AnimateIn` is snappier (4px / 0.15s); `AnimateOnView` is tuned for scroll reveals (16px / 0.4s). The opt-in `spring` prop keeps its overshoot. Pass props to override.
  - **Disabled `Slider` fixed.** A disabled slider no longer shows a hover ring and now shows `cursor-not-allowed` — it was keyed off `:disabled` on a non-form element, which never matched. The enabled thumb uses the `--cursor-clickable` cursor.
  - **`Select`** — `alignItemWithTrigger` now animates on open like the other modes (the open animation is no longer suppressed).

## 0.4.1

### Patch Changes

- 5df74c3: Replace `transition-all` with explicit per-element transition properties across Button, Badge, Toggle, Switch, Tabs, Accordion, InputOTP, Progress, and the Sidebar rail.

  Interactive controls now transition only `color`, `background-color`, `border-color`, and `box-shadow`, so focus-ring and hover feedback still animate but unrelated property changes (e.g. layout shifts, or transitions a consumer adds via `className`) no longer animate unexpectedly. Progress now animates `width`; the Sidebar rail's motion is synced to the panel it borders. This also lets the library's motion recipes (`motion-fade` / `motion-scale` / `motion-rise`) own their `transition` directly, since nothing in the utilities layer clobbers it anymore.

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
