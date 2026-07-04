---
"@waveso/ui": patch
---

More accessibility fixes:

- `FormError` uses `role="alert"` so a root-level form error is announced when it appears.
- `Badge` status-variant focus rings are now clearly visible — raised from 20% opacity to match the base ring (WCAG 1.4.11 non-text contrast).
- `ContextMenu` destructive items keep their red icon on focus (it was turning white on the faint destructive highlight), and checkbox/radio items now recolor their indicator on the primary focus background like regular items.
- `SidebarTrigger` exposes `aria-expanded`, so assistive tech announces the sidebar's open/collapsed state.
- Masonry's featured badge uses `role="img"` so its "Featured" label is announced (an `aria-label` on a role-less span is unreliable).
