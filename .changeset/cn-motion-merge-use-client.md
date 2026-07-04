---
"@waveso/ui": patch
---

- `cn()` (tailwind-merge) now conflict-resolves the library's custom utilities. The mutually-exclusive enter/exit motion recipes (`motion-scale/slide/fade/pop-*`) collapse to the last one applied, so a consumer can override a component's default animation via `className`; `cursor-clickable` joins the built-in `cursor` group. (`motion-color` / `motion-scrim` are deliberately left composable with a recipe.)
- `Item` and `Select` use the `motion-color` token instead of an ad-hoc `transition-colors` / `duration-200`.
- Dropped unnecessary `'use client'` from `Label`, `Table`, and the `direction` re-export — they're stateless wrappers / pure re-exports and are now server-renderable.
