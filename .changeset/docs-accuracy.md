---
"@waveso/ui": patch
---

Docs: corrected the CSS setup order in the README — import `tailwindcss` **before** `@waveso/ui/styles.css`, matching the preset's own canonical order (the previous order was reversed). Also removed a stale optional-peer note — Sidebar uses an internal hook and does not require `usehooks-ts`.
