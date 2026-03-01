import { defineConfig } from 'tsup';
import { readdirSync } from 'node:fs';

// Collect all component entry points from src/
const componentEntries = readdirSync('src', { withFileTypes: true })
  .filter((f) => f.isFile() && f.name.endsWith('.tsx') && !f.name.includes('.stories.'))
  .map((f) => `src/${f.name}`);

export default defineConfig({
  entry: [
    ...componentEntries,
    'src/lib/utils.ts',
    'src/hooks/use-mobile.ts',
  ],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
  banner: {
    // Preserve 'use client' for Next.js RSC compatibility.
    // tsup strips module-level directives during bundling — this re-adds it.
    // Every output chunk gets the directive; this is safe and matches
    // what @base-ui/react and other React 19 libraries do.
    js: '"use client";',
  },
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@base-ui/react',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'react-day-picker',
    'embla-carousel-react',
    'react-hook-form',
    'input-otp',
    'motion',
    'usehooks-ts',
  ],
});
