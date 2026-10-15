import type * as React from "react";

/**
 * Combines refs so one element can feed several of them: a component's own
 * ref and the one a consumer passes. Takes object refs, callback refs and
 * `undefined`.
 */
export function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (el: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") ref(el);
      else if (ref && typeof ref === "object") {
        (ref as { current: T | null }).current = el;
      }
    });
  };
}
