---
"@waveso/ui": minor
---

Correctness fixes, accessibility fixes, and a few consumer-facing contract changes.

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