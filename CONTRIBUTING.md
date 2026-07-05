# Contributing to Wave UI

Thanks for your interest in improving `@waveso/ui`. This guide covers the setup, the day-to-day workflow, and the conventions the codebase holds itself to.

## Prerequisites

- **Node** `>=20`
- **npm** (the repo uses `package-lock.json`)

## Setup

```bash
git clone https://github.com/wavedotso/wave-ui
cd wave-ui
npm install
npm run storybook   # http://localhost:6006 — the dev surface
```

## Workflow

Every component lives in `src/<name>.tsx` with a matching `src/<name>.stories.tsx`. Storybook is where you develop and preview across the three themes (Graphite / Ink / Paper) using the toolbar switcher.

1. Make your change in `src/`.
2. Keep the story in sync — **stories are part of the component.** If you add a part, variant, or prop, demo it.
3. Run the checks below.
4. Add a changeset (see Releases) and open a PR.

### Scripts

| Script | What it does |
|---|---|
| `npm run storybook` | Dev surface (port 6006) |
| `npm run lint` | Biome lint + format check |
| `npm run lint:fix` | Apply safe lint fixes |
| `npm run format` | Format with Biome |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the vitest suite |
| `npm run build` | Build the library to `dist/` |
| `npm run check:package` | Validate packaging (`publint` + `attw`) |

CI runs all of these on every PR, so run them locally first.

## Conventions

Formatting and most style rules are **enforced by Biome** (`biome.json`) — run `npm run format` and you don't have to think about it. Beyond that:

- **`data-slot` on every rendered element** — it's the styling-hook contract for consumers.
- **Base UI data attributes** — `data-open` / `data-closed` / `data-popup-open`. Never Radix-style `data-[state=*]`.
- **Composition** — build on `@base-ui/react` primitives; use `cn()` + CVA for styling. Don't invent new class-composition utilities.
- **Per-component entry points, no barrels** — every component is its own subpath import (`@waveso/ui/button`). Never add a root `index.ts`.
- **Named exports only**, grouped at the bottom of each file (`export { … }` then `export type { … }`).
- **`'use client'` only when needed** — stateless wrappers stay server-renderable.
- **Accessible by default** — semantic roles, keyboard support, `prefers-reduced-motion`. New behavior should come with a test that locks in its a11y contract.

## Tests

Focused behavior/a11y tests live in `src/<name>.test.tsx` (vitest + `@testing-library`, jsdom). They're excluded from the build. Assert **contracts** (roles, ARIA, behavior) — never Tailwind class names (jsdom doesn't compute CSS). Query by role and accessible name.

## Releases

The project uses [Changesets](https://github.com/changesets/changesets). After a substantive change:

```bash
npx changeset
```

Pick the bump (patch / minor / major) and write a **consumer-facing** description — it becomes the changelog entry. Commit the generated file with your PR. When merged to `main`, CI versions and publishes to npm automatically. Pure-internal changes (refactors, tests, docs, formatting) don't need a changeset.

## Opening a PR

- Keep PRs focused; avoid unrelated refactors.
- Make sure `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass.
- Fill in the PR template.

Thank you! 👋
