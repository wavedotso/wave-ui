---
"@waveso/ui": minor
---

Input gains a `size` scale — `xs` · `sm` · `default` · `lg` (24 / 32 / 36 / 40px) — sharing the exact tiers and names as Button, so a `sm` input and a `sm` button line up in a row. `inputVariants` is exported for composition, and Input Group inputs accept the size too.

Input now has a subtle hover state (a faint fill), and the native file button is restyled to match the primary Button — filled, rounded, clickable cursor, and the same hover — vertically centred with its label at every size.

**Note:** the default input is now **36px** (was 32px) to pair with the default Button. An existing `<Input>` gets 4px taller — the previous height is `size="sm"`.
