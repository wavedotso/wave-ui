---
"@waveso/ui": minor
---

Squircle corners — every rounded corner now renders as an iOS-style continuous superellipse.

A global `corner-shape: squircle` turns every `border-radius` into a squircle (a smoother, friendlier corner than a plain circular arc), and the base radius bumps `0.625rem → 1rem` so shapes keep their intended roundness — a squircle reads tighter than a circular arc at the same radius.

It's **progressive enhancement**: supporting browsers (Chrome 2025+) get squircles; everywhere else (Safari / Firefox pending) falls back cleanly to normal circular rounding, and the radius bump is scoped with `@supports` so those browsers keep the original values — nothing breaks. Pills and circles (`rounded-full`) opt out, so avatars and status dots stay perfectly round.
