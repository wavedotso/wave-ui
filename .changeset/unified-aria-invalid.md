---
"@waveso/ui": patch
---

**Invalid fields** — unified the `aria-invalid` treatment across every control that has one (Button, Badge, Input, Textarea, Select, Combobox, Autocomplete, Checkbox, Radio, Switch, Toggle, Input OTP, Input Group) to a single `border-destructive` + `ring-destructive/30`, dropping the per-mode `dark:` alpha variants (`border-destructive/50`, `ring-destructive/40`). The invalid state now renders identically across the Graphite, Ink, and Paper themes — the only visible change is a slightly more solid border and marginally softer ring on the dark themes, and it removes every per-mode `dark:` aria-invalid override in the library.
