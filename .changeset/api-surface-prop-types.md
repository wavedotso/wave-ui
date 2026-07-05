---
"@waveso/ui": minor
---

Public API surface — prop types, CVA variants, and a set of behavior fixes.

**Prop types & variants (additive)**

- Every component now exports its `<Name>Props` type (previously only `Field` and `Kbd` did) — ~268 prop-type exports across 54 files.
- The remaining CVA variant functions are now exported, matching `buttonVariants` / `badgeVariants`: `alertVariants`, `buttonGroupVariants`, `inputGroupButtonVariants`, `itemVariants`, `sidebarMenuButtonVariants`, `tabsListVariants`, `toastViewportVariants`.
- `DrawerViewport` is now exported (recompose `DrawerContent` from parts). `RestoreFocusOnClose` is re-exported from `menu`, `popover`, and `context-menu`.
- `Input` is now typed from the Base UI Input primitive, exposing `onValueChange`, `render`, etc. (the old `React.ComponentProps<'input'>` stripped them).
- `PopoverContent` and `PreviewCardContent` gain a `positionerClassName` escape hatch, matching `TooltipContent`.
- `Button` now emits `data-variant` / `data-size`, matching `Badge` / `ToggleGroupItem`.

**Behavior fixes**

- `AlertDialogAction` now dismisses the dialog on click (it previously rendered a plain button that never closed) — your `onClick` still runs first. This matches the shadcn/Radix contract.
- `Progress` now supports the indeterminate state (`value={null}`) with a pulsing partial fill.
- A standalone `ToggleGroupItem` (used outside a `ToggleGroup`) now respects its own `variant` / `size` instead of always inheriting the group defaults.
- Toast text is now selectable (removed `select-none` from the toast root).
- `Animate`'s `transition` prop is narrowed to `{ duration?, ease? }` — the CSS-transition subset it actually supports — so invalid `motion/react` spring/keyframe configs are a type error instead of silently killing the animation.

**Breaking**

- Removed `showCloseButton` from `DialogFooter`. It placed a dismiss button in the primary-action position and duplicated `DialogContent`'s corner close. Compose an explicit `<DialogClose>` in the footer instead.
