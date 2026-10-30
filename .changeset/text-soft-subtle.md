---
"@waveso/ui": minor
---

**Breaking:** the faintest text colour is renamed from `soft` to `subtle`, so the three text colours read strongest to faintest as `contrast`, `muted`, `subtle`. The value is unchanged. Replace `text-soft` with `text-subtle` (and `--soft` with `--subtle` if you read the variable). Placeholders in Input, Textarea and Select use it and look the same.
