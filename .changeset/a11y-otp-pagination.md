---
"@waveso/ui": patch
---

Minor accessibility refinements:

- **Input OTP** — the decorative separator between groups is now `aria-hidden` instead of carrying `role="separator"`, so screen readers no longer announce a meaningless "separator" between input groups.
- **Pagination** — removed a redundant `role="navigation"` from the `<nav>` (the element already has that role implicitly).
