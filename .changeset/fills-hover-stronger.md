---
"@waveso/ui": minor
---

Hover is now the stronger fill: `highlighted` moves from 10% to 15% of the theme's text colour and `neutral` from 15% to 10%, so pointing at something always shows a step more than resting. Hovered and keyboard-highlighted items in menus, lists and tables read clearer; fields, tracks and unchecked checkboxes, radios and switches are a little lighter. Table's footer and Item's `muted` variant now use `neutral` instead of `bg-secondary/50`, so they look the same in every theme (the old fill was five times stronger in Ink than in Paper), and a muted Item that is a link hovers to `highlighted` instead of the solid secondary fill. If you set `bg-neutral` or `bg-highlighted` yourself, they swap strengths with this release.
