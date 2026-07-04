# @waveso/ui

## 0.7.7

### Patch Changes

- 75bc91d: - `cn()` (tailwind-merge) now conflict-resolves the library's custom utilities. The mutually-exclusive enter/exit motion recipes (`motion-scale/slide/fade/pop-*`) collapse to the last one applied, so a consumer can override a component's default animation via `className`; `cursor-clickable` joins the built-in `cursor` group. (`motion-color` / `motion-scrim` are deliberately left composable with a recipe.)
  - `Item` and `Select` use the `motion-color` token instead of an ad-hoc `transition-colors` / `duration-200`.
  - Dropped unnecessary `'use client'` from `Label`, `Table`, and the `direction` re-export — they're stateless wrappers / pure re-exports and are now server-renderable.
- 8163b3a: - Added a `--scrim` token (and `bg-scrim` utility) for the modal backdrop dim. `Dialog`, `Drawer`, and `AlertDialog` overlays use `bg-scrim` instead of a hard-coded `bg-black/10`, so the scrim is themeable from one token.
  - `Toggle` no longer silently drops a function-form `className`. Base UI allows `className` to be `(state) => string`; it was being routed through CVA/clsx (which ignores functions) and is now passed through `cn()`, which handles the state-function form.

## 0.7.6

### Patch Changes

- c98386c: Hard-rule cleanup:

  - Added missing `data-slot` attributes: `film-grain` / `film-grain-canvas`, `slider-control`, and `input-group-text`.
  - `Autocomplete` and `Menu` popups now cap at `max-w-(--available-width)` so long content wraps instead of overflowing the viewport (matching `Combobox` / `Select`).
  - Removed all `!important` from components: `Badge` icon sizing uses the `:not([class*='size-'])` escape hatch, `ButtonGroup` corner rounding targets only non-last children (so the last keeps its natural corner), and `Pagination` padding relies on `tailwind-merge`.
  - `FilmGrain` composes classes with `cn()` instead of a hand-rolled `filter().join()`.

## 0.7.5

### Patch Changes

- ba569d5: Respect `prefers-reduced-motion` across the animation surface. When a user prefers reduced motion, the JS-driven animation components now render their final resting state immediately with no animation:

  - `Animate` — `AnimateIn` / `AnimateOnView` appear in their final visible state (no travel/blur/scale/fade); `Pulse` / `Float` render at rest (no continuous transform).
  - `Typewriter` shows the full text at once (no typing, no cursor).
  - `EncryptedText` shows the real text immediately (no scramble).
  - `Count` snaps to the target value (no count-up/down tween).
  - `Masonry` places items in their final positions (no entrance spring).
  - `Toast` stacking no longer slides/scales, and the Input OTP caret stops blinking.

  (Token-driven component motion — dialogs, popovers, menus, etc. — already collapsed under reduced motion via the motion-token system; the `Spinner` is intentionally left spinning as it signals activity.)

## 0.7.4

### Patch Changes

- 2399266: Focus rings are now consistent across the library. `Field` controls and `Sidebar` menu buttons/actions use the same `focus-visible:ring-3 ring-focus/50` recipe (no ring offset) as every other control — previously `Field` used a thinner `ring-2` with a `ring-offset-2`, and `Sidebar` used a full-opacity ring.

## 0.7.3

### Patch Changes

- 9f9705f: More accessibility fixes:

  - `ItemGroup` no longer sets `role="list"`. `Item` is frequently rendered as an `<a>`, and a `list` with non-`listitem` children is invalid ARIA; items now keep their natural roles.
  - `PaginationEllipsis` announces "More pages" to screen readers (the `sr-only` text was trapped inside an `aria-hidden` container).
  - `PaginationPrevious` / `PaginationNext` (via `PaginationLink`) accept a `disabled` prop — it sets `aria-disabled`, removes the link from the tab order, and makes it non-interactive, instead of leaving a "disabled" link keyboard-operable.
  - The `Table` scroll container is now keyboard-operable — a focusable, labelled region with a visible focus ring — so keyboard users can scroll wide tables.

- 47d2771: `Toast` accessibility: the toast type (success / error / warning / info / loading) is now announced to screen readers via an `sr-only` label rather than conveyed by icon color alone, and `ToastAction` / `ToastClose` show the library's `focus-visible` ring.

## 0.7.2

### Patch Changes

- 7d00b18: More accessibility fixes:

  - `FormError` uses `role="alert"` so a root-level form error is announced when it appears.
  - `Badge` status-variant focus rings are now clearly visible — raised from 20% opacity to match the base ring (WCAG 1.4.11 non-text contrast).
  - `ContextMenu` destructive items keep their red icon on focus (it was turning white on the faint destructive highlight), and checkbox/radio items now recolor their indicator on the primary focus background like regular items.
  - `SidebarTrigger` exposes `aria-expanded`, so assistive tech announces the sidebar's open/collapsed state.
  - Masonry's featured badge uses `role="img"` so its "Featured" label is announced (an `aria-label` on a role-less span is unreliable).

- 0a56060: `Slider` accessibility and `controlClassName` fixes:

  - The thumb (the interactive slider control) can now be named for assistive technology. Pass `getThumbAriaLabel(index)` for per-thumb names on range sliders, or a plain `aria-label` — which is now applied to the thumb rather than only the slider group. Previously the thumb's `<input type="range">` had no accessible name.
  - `controlClassName` now works. It was declared but never applied (and leaked onto the root DOM element as an unknown attribute); `className` now styles the root and `controlClassName` styles the control.

## 0.7.1

### Patch Changes

- 9c80534: Accessibility improvements:

  - Internal icons are now decorative by default (`aria-hidden` / `focusable="false"`), so screen readers no longer announce them; the control that renders an icon carries the accessible name. `Spinner` keeps its `role="status"` / "Loading" announcement (and now emits `data-slot="spinner"`).
  - `EncryptedText` exposes its real text to assistive technology via an `sr-only` copy and marks the animated scramble characters `aria-hidden`, instead of an unreliable `aria-label` on a generic span.
  - `Label`'s disabled dimming now actually applies — it matched a non-existent `data-disabled="true"`, but Base UI emits a valueless `data-disabled`.

- c773307: Fix several component bugs:

  - **ToggleGroup** now forwards `orientation` to the primitive, so a vertical group responds to Up/Down arrow keys (it was stuck on Left/Right).
  - **Textarea** is marked `'use client'`, so it no longer errors when rendered from a React Server Component (it attaches an `onChange`).
  - **InfiniteScroll** no longer stalls after the first page when the sentinel stays in view — it re-checks visibility once `isLoading` clears.
  - **Count** (`NumberCount`) no longer freezes mid-count when a parent re-renders with inline `easing`/`onComplete`; live `to` changes and `once={false}` now restart the animation as expected.
  - **Combobox** — the clear and chip-remove buttons now have accessible names (`aria-label`), and a disabled `<Combobox>` root now disables its input (the wrapper no longer forces `disabled={false}`).
  - **GradientRevealText** exposes its text to assistive technology (`role="img"` + `aria-label`) instead of hiding it with `aria-hidden`.

## 0.7.0

### Minor Changes

- 5a496a7: # Wave Blue brand, harmonious status palette, and correct peer dependencies

  Finalizes the color system and fixes the package's peer-dependency declarations.

  ## Brand — Wave Blue (`#0074DE`)

  The brand is now **Wave Blue**, a constant cobalt that stays identical in light and dark. It drives `--primary` (and therefore `--focus`, the focus ring) from `--wave-500`, `--info` from `--wave-500` (light) / `--wave-400` (dark), and `--accent` from `--wave-300`. The full `--wave-50…950` ramp is the Wave Blue ramp.

  ## Status & presence colors

  Retuned into a harmonious, Apple-style set — the model is **color in fills, icons and dots; text stays neutral** — with a light _and_ a dark value for each, the dark one always slightly brighter (never darker) so it keeps presence on dark surfaces:

  - `--success` — a cool emerald (hue 155), kept off the common Apple/Tailwind green so it reads as Wave's own and stays distinct from the warning yellow.
  - `--warning` — amber, held away from the green.
  - `--destructive` — the most saturated of the set.
  - `--info` — Wave Blue.

  `--presence-online / -away / -busy` mirror these as their own tokens; `--presence-invisible` resolves to `--foundation` so a bordered dot reads as a hollow/ghost ring.

  ## Neutral themes

  The neutral layer is a **3-theme system** — `--graphite-*` (default), `--ink-*` (navy), `--paper-*` (cool light) — feeding a `--ui-*` alias that the `.theme-*` class swaps. This **replaces the single `--ion-*` neutral ramp**; if you referenced those raw values directly, move to the new ramps (or, better, the semantic tokens).

  ## Component borders

  Accordion, Alert Dialog, Card, Dialog, Drawer, and Table borders now reference the semantic border tokens explicitly (`border-edge` / `border-line`) instead of inheriting a default color, so dividers and outlines render consistently across themes.

  ## Dependencies (fixes)

  - `motion`, `react-hook-form`, and `input-otp` are now declared in **`peerDependencies`** (still optional via `peerDependenciesMeta`) — previously they lived only under `peerDependenciesMeta`, so no version range reached consumers.
  - **`tailwindcss` (`^4.0.0`)** is now a declared peer — it is required to process the shipped utility classes.
  - Removed dead optional peers `react-day-picker`, `embla-carousel-react`, and `usehooks-ts`.

## 0.6.0

### Minor Changes

- 089824c: # Design-token overhaul · motion 3-tier · shadows two-dial · Base UI 1.6

  A large, **breaking** pass over the theme layer. Colors are rebuilt on a palette-driven semantic system, radius and motion collapse to 3 tiers, shadows become a two-dial system, the filled Button/Badge is now the default, and `Dialog` gains a built-in close button. Update your token overrides and any direct utility usage with the maps below.

  ***

  ## Color tokens (BREAKING)

  Colors are now driven by two raw ramps — **`--ion-*`** (neutral) and **`--wave-*`** (brand) — feeding a small semantic layer where every token has exactly one job. The new grammar:

  - **Surfaces = elevation:** `foundation` → `surface` → `elevated`, plus `surface-inverse`.
  - **Text = emphasis:** `contrast` (primary) → `muted` (secondary) → `soft` (placeholders / disabled), plus `contrast-inverse`.
  - **Brand:** `primary`, `secondary` (the neutral interaction fill), `accent`.
  - **Structure:** `line` (hairline dividers/borders), `edge` (input / control borders), `solid` (opaque border), `focus` (focus ring).
  - **Status:** `destructive`, `success`, `warning`, **`info`** (new — blue).
  - Unchanged: `chart-1…5`, `presence-*`.

  Three conceptual shifts to know:

  1. **On-color tokens are gone.** `primary-foreground` / `secondary-foreground` / `accent-foreground` no longer exist. Text on a saturated fill is plain `text-white`; text on the neutral `secondary` is `text-contrast`.
  2. **The selection highlight is brand.** Menu, select, combobox, autocomplete, and sidebar highlight the active row with `primary` (brand blue + white text), not a neutral/accent fill.
  3. **The focus ring is brand.** `focus` resolves to `primary`, so focus rings are brand-blue across every control.

  Also: **`sidebar-*` tokens are removed** (folded into the main tokens).

  ### Migration — color tokens

  Applies to utility classes (`bg-`, `text-`, `border-`, `ring-`, …) **and** raw `--color-*` overrides:

  | Old                                                                         | New                       |
  | --------------------------------------------------------------------------- | ------------------------- |
  | `background`                                                                | `foundation`              |
  | `card`, `sidebar`                                                           | `surface`                 |
  | `popover`                                                                   | `elevated`                |
  | `foreground`, `card-foreground`, `popover-foreground`, `sidebar-foreground` | `contrast`                |
  | `muted-foreground`                                                          | `muted`                   |
  | `muted` (fill)                                                              | `secondary`               |
  | `border`, `sidebar-border`                                                  | `line`                    |
  | `input`                                                                     | `edge`                    |
  | `ring`, `sidebar-ring`                                                      | `focus`                   |
  | `primary-foreground`, `sidebar-primary-foreground`                          | removed → `text-white`    |
  | `secondary-foreground`                                                      | removed → `text-contrast` |
  | `accent-foreground`, `sidebar-accent-foreground`                            | removed → `text-white`    |
  | `sidebar-primary`                                                           | `primary`                 |
  | `sidebar-accent` (neutral highlight)                                        | `primary` (selection)     |

  **New tokens:** `soft` (faintest text), `solid` (opaque border), `info` (blue status), `surface-inverse` / `contrast-inverse`, and the raw `--ion-*` / `--wave-*` ramps.

  **Role shuffle to watch:** the old neutral `secondary` brand color is gone — `secondary` is now the neutral interaction fill (old `muted` fill value). The old neutral `accent` hover fill is replaced by `secondary` (neutral hovers) or `primary` (selection); `accent` is now a saturated brand color you can reach for, but it isn't used internally.

  > Only rewrite the **color** utilities. Structural utilities (`border`, `border-2`, `border-t`, `ring-1`, `ring-offset-*`) and the HTML `<input>` element are unaffected.

  ***

  ## Radius — collapsed to 3 tiers (BREAKING)

  | Old                         | New            |
  | --------------------------- | -------------- |
  | `rounded-xs`, `rounded-sm`  | `rounded-sm`   |
  | `rounded-md`, `rounded-lg`  | `rounded-md`   |
  | `rounded-xl`, `rounded-2xl` | `rounded-lg`   |
  | `rounded-4xl` (badge)       | `rounded-full` |
  | `rounded-3xl`               | removed        |

  `rounded-md` corners shift `+2px` (the old 8px `md` and 10px `lg` merge into one 10px default). Synced 1:1 with the motion tiers. `rounded-full` / `rounded-none` are Tailwind built-ins, unchanged.

  ***

  ## Motion — 3-tier scale (BREAKING)

  3 scalable magnitudes × 3 tiers (`sm`/`md`/`lg`) + fixed signatures, applied consistently per surface (`sm` = controls/icons · `md` = popups · `lg` = dialogs/backdrops).

  **Tokens** (if you override motion in your `:root`):

  | Removed      | Replace with                                                            |
  | ------------ | ----------------------------------------------------------------------- |
  | `--duration` | `--duration-sm` · `--duration-md` · `--duration-lg` (150 / 200 / 250ms) |
  | `--blur`     | `--blur-sm` · `--blur-md` · `--blur-lg` (2 / 4 / 8px)                   |
  | `--scale`    | `--scale-sm` · `--scale-md` · `--scale-lg` (.95 / .9 / .85)             |

  `--ease`, `--offset-*`, `--stagger-*` are the fixed/tiered remainder.

  **Recipe classes:** `motion-slide` → `motion-slide-md`, `motion-scale` → `motion-scale-{sm,lg}`, plus a combined **`motion-pop-md`** for popups; `motion-color` (controls) and `motion-scrim` (backdrops) are unchanged. Popups now **slide + zoom** from the trigger (was slide only); dialogs zoom from a deeper `0.85`. Everything still collapses under `prefers-reduced-motion`.

  ***

  ## Shadows — two-dial (BREAKING for overrides)

  The layered `shadow-sm/md/lg` scale is now driven by two tokens — `--shadow-color` (HSL tint, never pure black) and `--shadow-strength` (per-layer alpha). Retint or dim every shadow from one place; both resolve per `:root`/`.dark`.

  ***

  ## Components

  - **`Button` / `Badge`: the filled style is now `default`.** The soft-tinted default is removed and the former `variant="solid"` is renamed to `default`. A `<Button>` / `<Badge>` with **no** `variant` now renders **filled**. Migration: drop `variant="solid"` (it's the default), or set `outline` / `ghost` / `secondary` if you relied on the soft look.
  - **`Dialog` now has a built-in close button** (top-right ✕); `DialogTitle` reserves room for it (`pr-8`) so long titles wrap before the corner.

  ***

  ## Dependencies

  - **`@base-ui/react` peer bumped to `^1.6.0`** (from `^1.5.0`), inheriting upstream fixes for Toast, Combobox, Menu, Drawer, and Slider. Note: Base UI 1.6 removes the `region` role from `Accordion.Root` — a minor DOM/a11y change.

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
