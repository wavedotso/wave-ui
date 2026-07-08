---
"@waveso/ui": minor
---

Themes reworked into a clean, OS-aware three-theme model.

Wave **follows the OS by default** — a light system gets **Paper**, a dark system gets **Graphite** (the neutral dark theme). **Ink** is an opt-in premium "night" theme.

Pin a theme by putting `.paper`, `.graphite`, or `.ink` on `<html>`; a pinned class always beats the OS. The `dark:` utility variant fires on the dark themes (Graphite, Ink), so it works with any class-based theme toggle.

**Status palettes:** the three status colours now ship as full **50–950 ramps** — success (cool emerald), warning (amber), and destructive (red) — as OKLCH CSS variables (`--success-50` … `--success-950`, and likewise `--warning-*` / `--destructive-*`). They're mode-stable (shared across all three themes) with `500` as the locked semantic value, so you can reach for any shade directly (e.g. `--success-100` for a subtle success surface). The semantic `bg-success` / `text-destructive` / etc. utilities are unchanged, and every ramp is browsable on the **Colors → Palettes** story.

**Breaking:** themes are now selected **by name** — `.paper`, `.graphite`, `.ink` — replacing the old `.theme-paper` / `.theme-graphite` / `.theme-ink` classes and the internal `--ui-*` alias. Each theme is a complete, fixed-appearance look (Paper is light; Graphite and Ink are dark), so drop the `theme-` prefix and the separate `.dark` mode class. With no class, the theme follows the OS (Paper on light, Graphite on dark).
