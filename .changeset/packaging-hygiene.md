---
"@waveso/ui": patch
---

Packaging hygiene:

- **Exports resolution** — hoisted `types`/`default` to the top level of the `./*` subpath (out of the `import`-only block) so type resolution is correct across `node16` and `bundler` module resolution. Verified with `publint` and `@arethetypeswrong/cli`.
- **Internal modules are no longer public entry points** — `@waveso/ui/lib/*` and `@waveso/ui/hooks/*` are now blocked in `exports`. They were never meant to be importable (components reference them via relative paths); the old `./*` wildcard exposed them by accident. Use `clsx` + `tailwind-merge` directly instead of `@waveso/ui/lib/utils`.
- **Smaller package** — no longer ships `.js.map` / `.d.ts.map`; they pointed at `src`, which isn't published, so they were broken dead weight (roughly halved the shipped file count).
- **`engines`** — now declares `node >=20`.
- Added `keywords`, `homepage`, and `bugs`, and canonicalized `repository.url` to `git+https`.
