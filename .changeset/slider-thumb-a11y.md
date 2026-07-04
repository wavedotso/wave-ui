---
"@waveso/ui": patch
---

`Slider` accessibility and `controlClassName` fixes:

- The thumb (the interactive slider control) can now be named for assistive technology. Pass `getThumbAriaLabel(index)` for per-thumb names on range sliders, or a plain `aria-label` — which is now applied to the thumb rather than only the slider group. Previously the thumb's `<input type="range">` had no accessible name.
- `controlClassName` now works. It was declared but never applied (and leaked onto the root DOM element as an unknown attribute); `className` now styles the root and `controlClassName` styles the control.
