// Loads the @testing-library/jest-dom matcher type augmentations for vitest's
// `expect` so the `*.test.tsx` files type-check (the runtime extension happens
// in vitest.setup.ts). This file is types-only and is not part of the build.
import "@testing-library/jest-dom/vitest";
