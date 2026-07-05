import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// React Testing Library unmounts between tests (globals are off).
afterEach(() => {
  cleanup();
});

// jsdom doesn't implement these browser APIs that several components touch
// (useReducedMotion, scroll-into-view effects, layout measurement). Stub them
// so rendering doesn't throw.
if (typeof window !== "undefined") {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
  }

  class ObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }

  window.IntersectionObserver ??=
    ObserverStub as unknown as typeof IntersectionObserver;
  window.ResizeObserver ??= ObserverStub as unknown as typeof ResizeObserver;
}
