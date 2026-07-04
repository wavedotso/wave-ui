---
"@waveso/ui": patch
---

Fix several component bugs:

- **ToggleGroup** now forwards `orientation` to the primitive, so a vertical group responds to Up/Down arrow keys (it was stuck on Left/Right).
- **Textarea** is marked `'use client'`, so it no longer errors when rendered from a React Server Component (it attaches an `onChange`).
- **InfiniteScroll** no longer stalls after the first page when the sentinel stays in view — it re-checks visibility once `isLoading` clears.
- **Count** (`NumberCount`) no longer freezes mid-count when a parent re-renders with inline `easing`/`onComplete`; live `to` changes and `once={false}` now restart the animation as expected.
- **Combobox** — the clear and chip-remove buttons now have accessible names (`aria-label`), and a disabled `<Combobox>` root now disables its input (the wrapper no longer forces `disabled={false}`).
- **GradientRevealText** exposes its text to assistive technology (`role="img"` + `aria-label`) instead of hiding it with `aria-hidden`.
