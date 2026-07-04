---
"@waveso/ui": patch
---

Respect `prefers-reduced-motion` across the animation surface. When a user prefers reduced motion, the JS-driven animation components now render their final resting state immediately with no animation:

- `Animate` — `AnimateIn` / `AnimateOnView` appear in their final visible state (no travel/blur/scale/fade); `Pulse` / `Float` render at rest (no continuous transform).
- `Typewriter` shows the full text at once (no typing, no cursor).
- `EncryptedText` shows the real text immediately (no scramble).
- `Count` snaps to the target value (no count-up/down tween).
- `Masonry` places items in their final positions (no entrance spring).
- `Toast` stacking no longer slides/scales, and the Input OTP caret stops blinking.

(Token-driven component motion — dialogs, popovers, menus, etc. — already collapsed under reduced motion via the motion-token system; the `Spinner` is intentionally left spinning as it signals activity.)
