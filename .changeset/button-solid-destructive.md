---
"@waveso/ui": minor
---

**Button** — the colored variants now follow the `primary + neutral + destructive` convention.

- **BREAKING:** the `success` variant is removed. Success is *feedback*, not an *action* — use a Badge, Alert, or Toast instead. Migrate `<Button variant="success">` to `<Button variant="default">` (or a Badge).
- `destructive` is now a **solid** fill (`bg-destructive` + white text) instead of a tonal tint, matching the `default` button. This also drops the variant's `dark:` overrides — the token system handles light/dark on a solid fill.

**Button** — collapsed the size ladder from five sizes to three, on even 8px steps (matching Radix Themes' 1/2/3):

- Text: **`sm` (24px) · `default` (32px) · `lg` (40px)**
- Icon: **`icon-sm` (24px) · `icon` (32px) · `icon-lg` (40px)**

**BREAKING:**

- `xs` and `xl` are removed — use `sm` and `lg`.
- `sm` and `lg` change size: `sm` 28→24, `lg` 36→40.
- `icon-xs` is removed (→ `icon-sm`), and `icon-lg` grows 36→40.

As a result the built-in **Dialog, Drawer, and Sidebar close buttons are now 24px** (were 28px). `InputGroupButton` and `Item` keep their own independent size scales.
