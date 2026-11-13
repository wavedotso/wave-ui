---
"@waveso/ui": patch
---

Placeholders in `Input`, `Textarea` and `Select` now use the `muted` text color instead of `subtle`. On the filled fields, `subtle` was too faint in the dark themes, down to 1.4:1 in Ink; `muted` reads clearly in all three themes, and typed text, in `contrast`, still stands out from a placeholder.
