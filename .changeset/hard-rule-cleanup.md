---
"@waveso/ui": patch
---

Hard-rule cleanup:

- Added missing `data-slot` attributes: `film-grain` / `film-grain-canvas`, `slider-control`, and `input-group-text`.
- `Autocomplete` and `Menu` popups now cap at `max-w-(--available-width)` so long content wraps instead of overflowing the viewport (matching `Combobox` / `Select`).
- Removed all `!important` from components: `Badge` icon sizing uses the `:not([class*='size-'])` escape hatch, `ButtonGroup` corner rounding targets only non-last children (so the last keeps its natural corner), and `Pagination` padding relies on `tailwind-merge`.
- `FilmGrain` composes classes with `cn()` instead of a hand-rolled `filter().join()`.
