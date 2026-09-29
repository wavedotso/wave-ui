---
"@waveso/ui": minor
---

Unify the form family on one flat type scale, one size ladder, and a borderless-filled surface. Button, Input, Select, Textarea, Autocomplete, Combobox and Input Group now share the same `xs` · `sm` · `default` · `lg` tiers (heights **24 / 32 / 36 / 44px**) and the same flat font ladder (**12 / 14 / 16 / 18px**), so any control lines up with any other — and with a Button — at the same size.

### ⚠️ Breaking

- **Default controls are 4px taller (32px → 36px).** `Select`, `InputGroup`, and multi-select `Combobox` chips now default to 36px to pair with the default `Button`/`Input`. Existing markup with no `size` grows 4px and may reflow surrounding layout — pass `size="sm"` to keep 32px. (`Input` already made this jump in `0.14.0`.)
- **Desktop default font is now 16px (was 14px).** The responsive `md:text-sm` split is gone — the ladder is flat `12/14/16/18` at every breakpoint. `default` / `sm` / `lg` controls that relied on the 14px desktop step will reflow.
- **`InputGroupButton` sizes changed.** `size` went from `xs | sm | icon-xs | icon-sm` (default `xs`) to `default | icon` (default `default`), and the default `variant` is now the filled `default` (was `ghost`). Migrate: text buttons → `size="default"`, icon buttons → `size="icon"`; add `variant="ghost"` to keep the old transparent look. Inline addon buttons stretch to the field height automatically.
- **`ComboboxInput` and `AutocompleteInput` `size` is now a tier, not a character count.** `size` is `xs | sm | default | lg` (forwarded to the control), so the native HTML `size={n}` character-width attribute no longer applies — a numeric `size` is now a type error. Use CSS width instead.
- **`Select` `size="sm"` was redefined** — 28px → 32px, and it now inherits the `md` corner radius (was `rounded-sm`).

### Added

- **`size` prop across the family** — `Select`, `Textarea`, `Autocomplete`, `InputGroup`, and `Combobox` chips gain the `xs | sm | default | lg` ladder, plus new composable CVA exports: `selectTriggerVariants`, `textareaVariants`, `inputGroupVariants`, `comboboxChipsVariants`. Each control emits a `data-size` attribute as a styling hook.
- **Resizable `Textarea`** — vertical resize is on by default (`resize-y`) with a subtle hover-only corner grip (new `resize-handle` utility). It also resizes when used inside an `InputGroup`.

### Changed

- **Borderless-filled surfaces** — every control moves from a bordered/transparent look to a solid `bg-edge` fill with a transparent border that reveals the focus color on hover. Purely visual; no usage change.
- **Aligned disabled state** — disabled controls are now `opacity-30` (was `50`), with no background tint and no `not-allowed` cursor (`pointer-events-none`), consistent across Button and every field.
- **Button** — default font 14px → 16px (height unchanged at 36px); `lg` grows 40px → 44px with 18px text; `icon-lg` 40px → 44px; `xs` horizontal padding 10px → 8px.
- **Input** — `lg` enlarged to 44px / 16px padding / 18px text; `sm` horizontal padding 10px → 12px.
- **Input Group** — addon padding now scales with the group size and uses logical `ps`/`pe` properties.
