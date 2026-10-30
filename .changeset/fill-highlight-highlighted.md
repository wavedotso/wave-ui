---
"@waveso/ui": minor
---

**Breaking:** the `highlight` fill is renamed `highlighted`, with the same value: 10% of the theme's text colour, where attention lands (hovered, keyboard-highlighted and open items). It now reads like the other control states, `neutral` and `selected`, and like Base UI's `data-highlighted`. Replace `bg-highlight` with `bg-highlighted` (and `--highlight` with `--highlighted` if you read the variable).
