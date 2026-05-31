---
"@waveso/ui": patch
---

Replace `transition-all` with explicit per-element transition properties across Button, Badge, Toggle, Switch, Tabs, Accordion, InputOTP, Progress, and the Sidebar rail.

Interactive controls now transition only `color`, `background-color`, `border-color`, and `box-shadow`, so focus-ring and hover feedback still animate but unrelated property changes (e.g. layout shifts, or transitions a consumer adds via `className`) no longer animate unexpectedly. Progress now animates `width`; the Sidebar rail's motion is synced to the panel it borders. This also lets the library's motion recipes (`motion-fade` / `motion-scale` / `motion-rise`) own their `transition` directly, since nothing in the utilities layer clobbers it anymore.
