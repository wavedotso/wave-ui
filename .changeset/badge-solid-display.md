---
"@waveso/ui": minor
---

Badge reworked as a solid, display-first element.

- **Solid status fills.** `success`, `warning`, and `destructive` are now solid colour fills with legible text, replacing the soft tinted look — matching the library's "colour in the fill, not the text" model. (`default` / `secondary` were already solid.)
- **Display, not interactive.** A badge is a label, so it no longer carries hover styling by default (`ghost` and `link` previously hovered on any element). Interactive styling applies only when a badge is rendered as a link (`render={<a … />}`).
- **Icons.** A wrapped/nested icon (not a bare `<svg>` child) is now sized correctly and no longer shrinks. Mark a leading or trailing icon with `data-icon="inline-start"` / `"inline-end"` to tighten that side's padding.
- **Logical padding** (`ps` / `pe`) so leading/trailing spacing follows text direction (RTL-safe).
