---
"@waveso/ui": patch
---

More accessibility fixes:

- `ItemGroup` no longer sets `role="list"`. `Item` is frequently rendered as an `<a>`, and a `list` with non-`listitem` children is invalid ARIA; items now keep their natural roles.
- `PaginationEllipsis` announces "More pages" to screen readers (the `sr-only` text was trapped inside an `aria-hidden` container).
- `PaginationPrevious` / `PaginationNext` (via `PaginationLink`) accept a `disabled` prop — it sets `aria-disabled`, removes the link from the tab order, and makes it non-interactive, instead of leaving a "disabled" link keyboard-operable.
- The `Table` scroll container is now keyboard-operable — a focusable, labelled region with a visible focus ring — so keyboard users can scroll wide tables.
