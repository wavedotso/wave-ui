---
"@waveso/ui": patch
---

Accessibility improvements:

- Internal icons are now decorative by default (`aria-hidden` / `focusable="false"`), so screen readers no longer announce them; the control that renders an icon carries the accessible name. `Spinner` keeps its `role="status"` / "Loading" announcement (and now emits `data-slot="spinner"`).
- `EncryptedText` exposes its real text to assistive technology via an `sr-only` copy and marks the animated scramble characters `aria-hidden`, instead of an unreliable `aria-label` on a generic span.
- `Label`'s disabled dimming now actually applies — it matched a non-existent `data-disabled="true"`, but Base UI emits a valueless `data-disabled`.
