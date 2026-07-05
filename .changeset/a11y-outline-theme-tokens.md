---
"@waveso/ui": patch
---

Accessibility and theme-token polish:

- **Focus outlines** — standardized `outline-none` → `outline-hidden` across every interactive component. No change in normal browsing (both render no visible outline), but focus outlines now survive **forced-colors / Windows High Contrast** mode.
- **`dark:` variant** — now applies to the `.dark` element itself (not only its descendants) and uses `:where()`, so dark utilities keep normal specificity and resolve by source order like every other Tailwind utility.
- **Presence tokens** — `--presence-online` / `--presence-away` / `--presence-busy` now alias `--success` / `--warning` / `--destructive` instead of duplicating their values, so overriding a status colour keeps the matching presence dot in sync.
- **Input Group** — the `sm` button size (previously an empty no-op variant) now has real sizing.
