import { defineConfig } from 'tsdown';

/**
 * Per-file ESM output via Rolldown — transpile, do not bundle.
 *
 * `unbundle` emits every `src/**` module 1:1 to `dist/` with its import
 * graph intact, so the consumer's app bundler does the real bundling /
 * tree-shaking at finer granularity than a prebundle could.
 *
 * Why tsdown over the previous tsup setup:
 * - `"use client"` survives natively (Rolldown tracks directives instead
 *   of stripping them) — no post-build reapplication.
 * - Relative imports are emitted with correct `.js` extensions, so the
 *   output is valid under strict ESM / `node16` resolution, not just
 *   inside bundlers.
 * - dts via Oxc is substantially faster.
 *
 * `exports` generation is intentionally left disabled: the package.json
 * `"./*"` wildcard + `styles.css` map is hand-maintained and must not be
 * overwritten.
 */
export default defineConfig({
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.{test,spec}.{ts,tsx}',
    // Storybook-only docs surface (guides rendered by MDX pages) — never ships.
    '!src/docs/**',
  ],
  format: 'esm',
  platform: 'neutral',
  unbundle: true,
  dts: true,
  // No sourcemaps: `src` is not in the published `files`, so `.js.map` /
  // `.d.ts.map` would point at paths that don't ship — broken dead weight in
  // the tarball. Storybook/Vite build from `src` directly, so dev debugging is
  // unaffected.
  sourcemap: false,
  clean: true,
  // Ship the theme stylesheet alongside the transpiled modules. Running it
  // through tsdown (instead of a trailing `cp` in the build script) means the
  // copy also happens in `--watch`, where `clean: true` would otherwise wipe it.
  copy: [{ from: 'src/styles.css', to: 'dist' }],
  // A library never bundles its deps; every bare import (peer, dev, or
  // otherwise) stays external in both JS and the emitted `.d.ts`. This
  // replaces the old hand-maintained `external` allowlist, which
  // silently bundled any dependency it forgot to list.
  deps: { skipNodeModulesBundle: true },
});
