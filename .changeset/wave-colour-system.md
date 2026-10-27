---
"@waveso/ui": minor
---

A new colour system: the Wave Palettes, rebuilt themes and a clearer status model. Several names change, so read the breaking notes before upgrading.

**Breaking**

- `destructive` is now `danger`: the `--danger` token, the `bg-danger` / `text-danger` / `border-danger` utilities, and `variant="danger"` on Button, Badge, Alert, MenuItem, ContextMenuItem, MenubarItem and AlertDialogAction.
- Wave Blue's ramp is now `--wave-blue-*` (was `--wave-*`).
- The `--success-*`, `--warning-*` and `--destructive-*` ramps are removed; the status tokens point at the Wave Palettes. Warning is now orange.
- The form tokens `line`, `edge` and `solid` are replaced by `contour` (hairlines), `highlight` (hover and keyboard focus) and `shade` (field fills and strong borders).
- Graphite, Ink and Paper's neutral ramps are rebuilt, so `--graphite-*`, `--ink-*` and `--paper-*` hold new values. Graphite's page is now `#25262A` with cards on `#2F3036`. Paper is now a warm stone ramp: its page and popups are white, cards and the sidebar sit on `#FCFBFA`, and its borders and fills are warm. Its light steps moved the most (`--paper-200` is now `#D4D0CC`), so read Paper through the theme tokens rather than its ramp.

**New**

- Nine Wave Palettes beside Wave Blue: `--wave-indigo-*`, `--wave-purple-*`, `--wave-pink-*`, `--wave-red-*`, `--wave-orange-*`, `--wave-yellow-*`, `--wave-lime-*`, `--wave-green-*` and `--wave-teal-*`, each 50–950, with Display-P3 versions. Every palette's 500 holds white text.
- `--danger-text`, `--success-text`, `--warning-text` and `--info-text`: the status colour as words and icons, tuned per theme. `text-danger` and the other status text utilities use them automatically; `bg-`, `border-` and `ring-` keep the fill.

**Changed**

- Hovered and keyboard-picked items in Menu, ContextMenu, Select, Combobox, Autocomplete, Sidebar and Item use `highlight` instead of a primary fill. Primary now means chosen: a pressed Toggle, a selected Table row and Pagination's current page.
- A danger menu item keeps a red label at rest and fills solid red with white text while highlighted.
- ContextMenu's popup is glass (a translucent, blurred surface) and mirrors in right-to-left layouts.
- Alerts keep their status colour in the icon only; status Badges carry white text.
- `dark:` variants are gone from every component: the theme tokens adapt on their own.
