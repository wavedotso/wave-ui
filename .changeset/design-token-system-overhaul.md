---
"@waveso/ui": minor
---

# Design-token overhaul · motion 3-tier · shadows two-dial · Base UI 1.6

A large, **breaking** pass over the theme layer. Colors are rebuilt on a palette-driven semantic system, radius and motion collapse to 3 tiers, shadows become a two-dial system, the filled Button/Badge is now the default, and `Dialog` gains a built-in close button. Update your token overrides and any direct utility usage with the maps below.

---

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

| Old | New |
|---|---|
| `background` | `foundation` |
| `card`, `sidebar` | `surface` |
| `popover` | `elevated` |
| `foreground`, `card-foreground`, `popover-foreground`, `sidebar-foreground` | `contrast` |
| `muted-foreground` | `muted` |
| `muted` (fill) | `secondary` |
| `border`, `sidebar-border` | `line` |
| `input` | `edge` |
| `ring`, `sidebar-ring` | `focus` |
| `primary-foreground`, `sidebar-primary-foreground` | removed → `text-white` |
| `secondary-foreground` | removed → `text-contrast` |
| `accent-foreground`, `sidebar-accent-foreground` | removed → `text-white` |
| `sidebar-primary` | `primary` |
| `sidebar-accent` (neutral highlight) | `primary` (selection) |

**New tokens:** `soft` (faintest text), `solid` (opaque border), `info` (blue status), `surface-inverse` / `contrast-inverse`, and the raw `--ion-*` / `--wave-*` ramps.

**Role shuffle to watch:** the old neutral `secondary` brand color is gone — `secondary` is now the neutral interaction fill (old `muted` fill value). The old neutral `accent` hover fill is replaced by `secondary` (neutral hovers) or `primary` (selection); `accent` is now a saturated brand color you can reach for, but it isn't used internally.

> Only rewrite the **color** utilities. Structural utilities (`border`, `border-2`, `border-t`, `ring-1`, `ring-offset-*`) and the HTML `<input>` element are unaffected.

---

## Radius — collapsed to 3 tiers (BREAKING)

| Old | New |
|---|---|
| `rounded-xs`, `rounded-sm` | `rounded-sm` |
| `rounded-md`, `rounded-lg` | `rounded-md` |
| `rounded-xl`, `rounded-2xl` | `rounded-lg` |
| `rounded-4xl` (badge) | `rounded-full` |
| `rounded-3xl` | removed |

`rounded-md` corners shift `+2px` (the old 8px `md` and 10px `lg` merge into one 10px default). Synced 1:1 with the motion tiers. `rounded-full` / `rounded-none` are Tailwind built-ins, unchanged.

---

## Motion — 3-tier scale (BREAKING)

3 scalable magnitudes × 3 tiers (`sm`/`md`/`lg`) + fixed signatures, applied consistently per surface (`sm` = controls/icons · `md` = popups · `lg` = dialogs/backdrops).

**Tokens** (if you override motion in your `:root`):

| Removed | Replace with |
|---|---|
| `--duration` | `--duration-sm` · `--duration-md` · `--duration-lg` (150 / 200 / 250ms) |
| `--blur` | `--blur-sm` · `--blur-md` · `--blur-lg` (2 / 4 / 8px) |
| `--scale` | `--scale-sm` · `--scale-md` · `--scale-lg` (.95 / .9 / .85) |

`--ease`, `--offset-*`, `--stagger-*` are the fixed/tiered remainder.

**Recipe classes:** `motion-slide` → `motion-slide-md`, `motion-scale` → `motion-scale-{sm,lg}`, plus a combined **`motion-pop-md`** for popups; `motion-color` (controls) and `motion-scrim` (backdrops) are unchanged. Popups now **slide + zoom** from the trigger (was slide only); dialogs zoom from a deeper `0.85`. Everything still collapses under `prefers-reduced-motion`.

---

## Shadows — two-dial (BREAKING for overrides)

The layered `shadow-sm/md/lg` scale is now driven by two tokens — `--shadow-color` (HSL tint, never pure black) and `--shadow-strength` (per-layer alpha). Retint or dim every shadow from one place; both resolve per `:root`/`.dark`.

---

## Components

- **`Button` / `Badge`: the filled style is now `default`.** The soft-tinted default is removed and the former `variant="solid"` is renamed to `default`. A `<Button>` / `<Badge>` with **no** `variant` now renders **filled**. Migration: drop `variant="solid"` (it's the default), or set `outline` / `ghost` / `secondary` if you relied on the soft look.
- **`Dialog` now has a built-in close button** (top-right ✕); `DialogTitle` reserves room for it (`pr-8`) so long titles wrap before the corner.

---

## Dependencies

- **`@base-ui/react` peer bumped to `^1.6.0`** (from `^1.5.0`), inheriting upstream fixes for Toast, Combobox, Menu, Drawer, and Slider. Note: Base UI 1.6 removes the `region` role from `Accordion.Root` — a minor DOM/a11y change.
