---
"@waveso/ui": minor
---

**Breaking:** the `shade` fill is renamed `neutral`, with the same value: 15% of the theme's text colour. It gives a control its body, its look before anything is chosen. Replace `bg-shade` with `bg-neutral` (and `--shade` with `--neutral` if you read the variable). Fields, tracks, unchecked checkboxes and radios, the switch, the slider and the scrollbar thumb use it and look the same. `bg-neutral` is Wave's fill; Tailwind's own `neutral-50` … `neutral-950` greys are a separate palette and keep working.
