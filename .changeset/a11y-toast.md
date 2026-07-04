---
"@waveso/ui": patch
---

`Toast` accessibility: the toast type (success / error / warning / info / loading) is now announced to screen readers via an `sr-only` label rather than conveyed by icon color alone, and `ToastAction` / `ToastClose` show the library's `focus-visible` ring.
