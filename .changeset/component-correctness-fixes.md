---
"@waveso/ui": minor
---

Component correctness pass — behavioral bug fixes across the library, plus one additive export.

**Fixes**

- **Checkbox** — the `indeterminate` state now renders a minus/dash on a filled box instead of a full check mark.
- **Film Grain** — WebGL opacity was applied twice (container CSS × shader uniform), making the WebGL path ~12× fainter than the 2D fallback; opacity is now owned solely by the container. The Canvas-2D fallback is also reachable when a WebGL context exists but shader/program init fails (previously it fell back only on context-creation failure).
- **Context Menu / Menu** — the submenu-trigger open-state highlight now keys off Base UI's `data-popup-open` (it was dead, keyed off `data-open`).
- **Input Group** — clicking an addon next to an `InputGroupTextarea` now focuses the textarea (the click-to-focus query previously matched `input` only).
- **Input OTP** — invalid styling now applies to the slots when the field is `aria-invalid` (the previous selector could never match).
- **Alert** — a wrapped (non-`<svg>`) `data-icon` element keeps the two-column grid layout, and `AlertDescription` is pinned to column 2, so badge/chip-wrapped icons no longer collapse the layout.
- **Field** — `FieldControl` no longer bakes in its own focus ring (it double-ringed composed controls such as `render={<Input />}`); dead selectors were removed from `FieldDescription`.
- **Encrypted Text** — fixed an SSR hydration mismatch (the scramble no longer calls `Math.random` during render), and reveal mode now honors `flipDelayMs`.
- **Animate** — `AnimateOnView` no longer flashes visible → blank before animating; entrance `will-change` is cleared once the transition finishes, and `AnimateIn`'s animation frame is canceled on unmount.
- **Action Bar** — `saveAll` rejections are handled and surfaced instead of producing an unhandled promise rejection; the jiggle timer and blocked-notice animation frame are cleaned up on unmount; the ⌘S shortcut works with Caps Lock on.
- **Infinite Scroll** — `endMessage` renders above the content when `direction="up"`.
- **Typewriter** — `once={false}` now replays when the element re-enters the viewport.
- **Count** — `DateCount` stops its interval when the countdown completes (it previously ticked forever).
- **Menubar** — fixed a 2px overflow of the documented `sm` button trigger.
- **Toast** — `ToastIcon` no longer throws when given an unknown `type`.
- **Toggle Group** — a consumer-passed `style` prop no longer wipes the internal `--gap` custom property.

**Added**

- **Switch** — sizes are now driven by CVA and `switchVariants` is exported (matching `buttonVariants` / `badgeVariants`). Rendered output is unchanged.
