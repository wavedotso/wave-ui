import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./vitest.setup.ts"],
  },
  // JSX is transformed by Vitest 5's oxc pipeline, which reads the automatic
  // runtime straight from tsconfig's `jsx: "react-jsx"`. (The old
  // `esbuild.jsx` option is ignored under oxc and only emitted a warning.)
});
