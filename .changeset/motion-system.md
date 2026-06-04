---
"@waveso/ui": minor
---

A complete, token-driven motion system — and the cleanups behind it.

Every overlay and interactive control now animates through a small set of CSS recipes instead of ad-hoc `tw-animate-css` classes. They're pure CSS (no JS), driven by Base UI's `data-starting-style` / `data-ending-style` lifecycle, share **one easing curve** (circ-out), and fully collapse under `prefers-reduced-motion`:

- **`motion-slide`** — flyouts that open from a trigger (tooltip, popover, menu + submenu, select, context-menu + submenu, autocomplete, combobox popup): fade + blur + a directional slide keyed to the trigger's `data-[side]`.
- **`motion-scale`** — fade + blur + scale. Powers dialog & alert-dialog content (a subtle zoom-in) and the combobox chevron ↔ clear cross-fade.
- **`motion-fade`** — fade + blur, no movement. A general-purpose "fade in place" for any surface that should carry the blur signature without sliding or scaling. (Available as a utility; not wired to a component by default.)
- **`motion-scrim`** — opacity only, for full-screen backdrops. Animating blur across the whole viewport janks, so the dim just fades; the frosted-glass look comes from a static `backdrop-filter` faded by this opacity.
- **`motion-color`** — interaction-state transitions on controls (hover / focus / pressed / checked): color, background, border, ring.

They read from one set of overridable `:root` tokens — `--duration`, `--ease`, `--blur`, `--scale`, `--offset`, `--stagger` — so you can retune the whole library's feel from your own `:root`. (Small icon targets pin an absolute blur via `--motion-scale-blur`, so they stay crisp no matter how you set the surface `--blur`.)

### Behavior changes to know about

- **Popups animate differently now.** Every flyout uses the recipes above (blur + directional slide / scale / fade) instead of the old zoom-and-slide, and dialogs now zoom in. If you targeted the old `data-open:animate-in` / `zoom-in-95` / `slide-in-from-*` classes, they're gone.
- **`transition-all` removed library-wide.** Controls transition only the properties that actually change (color, background, border, ring), so unrelated changes — layout, or transitions you add via `className` — no longer animate by accident. `Progress` animates `width`; the `Sidebar` rail is timed to the panel it borders.
- **`Animate` defaults changed.** `AnimateIn` is snappier (4px / 0.15s); `AnimateOnView` is tuned for scroll reveals (16px / 0.4s). The opt-in `spring` prop keeps its overshoot. Pass props to override.
- **Disabled `Slider` fixed.** A disabled slider no longer shows a hover ring and now shows `cursor-not-allowed` — it was keyed off `:disabled` on a non-form element, which never matched. The enabled thumb uses the `--cursor-clickable` cursor.
- **`Select`** — `alignItemWithTrigger` now animates on open like the other modes (the open animation is no longer suppressed).
