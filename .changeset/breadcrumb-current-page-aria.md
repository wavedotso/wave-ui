---
"@waveso/ui": patch
---

**Breadcrumb** — the current-page item (`BreadcrumbPage`) no longer carries a contradictory `role="link"` + `aria-disabled="true"` on a non-focusable `<span>`. It's now a plain element with only `aria-current="page"`, matching the W3C breadcrumb pattern, so assistive tech announces it as the current location instead of a disabled link. No visual change.
