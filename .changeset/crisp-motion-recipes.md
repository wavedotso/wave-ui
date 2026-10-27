---
"@waveso/ui": patch
---

The `motion-scale-*`, `motion-slide-*`, `motion-fade-*` and `motion-pop-md` recipes no longer leave a resting `filter: blur(0.001px)` on the elements they animate. Safari drew that as a visible blur, so dialogs, alert dialogs, popovers, menus, tooltips, selects and anything else using these recipes now rest sharp in Safari. The enter and exit blurs are unchanged.
