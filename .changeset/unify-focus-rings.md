---
"@waveso/ui": patch
---

Focus rings are now consistent across the library. `Field` controls and `Sidebar` menu buttons/actions use the same `focus-visible:ring-3 ring-focus/50` recipe (no ring offset) as every other control — previously `Field` used a thinner `ring-2` with a `ring-offset-2`, and `Sidebar` used a full-opacity ring.
