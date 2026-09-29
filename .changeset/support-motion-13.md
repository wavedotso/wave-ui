---
"@waveso/ui": patch
---

Widen the optional `motion` peer range to `^12.0.0 || ^13.0.0`. The library only uses motion's stable core APIs (`AnimatePresence`, `motion`, `useReducedMotion`, `useInView`), which are unchanged across both majors, so consumers on Motion 13 no longer get a peer-dependency warning.
