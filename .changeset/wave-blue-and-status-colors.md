---
"@waveso/ui": minor
---

# Wave Blue brand, harmonious status palette, and correct peer dependencies

Finalizes the color system and fixes the package's peer-dependency declarations.

## Brand — Wave Blue (`#0074DE`)

The brand is now **Wave Blue**, a constant cobalt that stays identical in light and dark. It drives `--primary` (and therefore `--focus`, the focus ring) from `--wave-500`, `--info` from `--wave-500` (light) / `--wave-400` (dark), and `--accent` from `--wave-300`. The full `--wave-50…950` ramp is the Wave Blue ramp.

## Status & presence colors

Retuned into a harmonious, Apple-style set — the model is **color in fills, icons and dots; text stays neutral** — with a light *and* a dark value for each, the dark one always slightly brighter (never darker) so it keeps presence on dark surfaces:

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
