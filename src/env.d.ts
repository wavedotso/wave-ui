// A few components guard dev-only `console.warn` calls behind
// `process.env.NODE_ENV === "development"` (the same pattern React uses): the
// reference is shipped so the consumer's bundler replaces it and dead-code
// eliminates the warning in production builds. We declare only the property we
// read — pulling in `@types/node` would drag Node's globals into a browser
// library's type scope (e.g. re-typing `setTimeout` as `NodeJS.Timeout`).
// This file is types-only and is not part of the build.
declare const process: {
  env: {
    NODE_ENV?: "development" | "production" | "test";
  };
};
