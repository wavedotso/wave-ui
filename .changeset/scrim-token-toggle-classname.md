---
"@waveso/ui": patch
---

- Added a `--scrim` token (and `bg-scrim` utility) for the modal backdrop dim. `Dialog`, `Drawer`, and `AlertDialog` overlays use `bg-scrim` instead of a hard-coded `bg-black/10`, so the scrim is themeable from one token.
- `Toggle` no longer silently drops a function-form `className`. Base UI allows `className` to be `(state) => string`; it was being routed through CVA/clsx (which ignores functions) and is now passed through `cn()`, which handles the state-function form.
