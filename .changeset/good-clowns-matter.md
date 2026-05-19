---
"@waveso/ui": minor
---

Interactive elements now use a `pointer` cursor by default, via a single `--cursor-clickable` token. Buttons, toggles, menu/select/combobox/autocomplete/context-menu items, accordion & collapsible triggers, tabs, checkbox, switch, and radio all share it.

For native / HIG behavior, set it back in your global CSS. One line flips the whole library with `root { --cursor-clickable: default; }`.

Real <a> links keep their own pointer regardless and disabled controls keep not-allowed.