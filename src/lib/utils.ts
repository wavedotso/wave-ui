import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge, taught about the library's custom utilities so they
 * conflict-resolve like built-ins:
 * - the enter/exit motion recipes (`motion-scale/slide/fade/pop-*`) are mutually
 *   exclusive — the last one applied wins (e.g. a consumer overriding a
 *   component's default animation). `motion-color` / `motion-scrim` are left out
 *   on purpose: they compose with an enter recipe on the same element.
 * - `cursor-clickable` joins the built-in `cursor` group.
 */
const twMerge = extendTailwindMerge<"motion-enter">({
  extend: {
    classGroups: {
      "motion-enter": [
        "motion-scale-sm",
        "motion-scale-md",
        "motion-scale-lg",
        "motion-slide-sm",
        "motion-slide-md",
        "motion-slide-lg",
        "motion-fade-sm",
        "motion-fade-md",
        "motion-fade-lg",
        "motion-pop-md",
      ],
      cursor: ["cursor-clickable"],
    },
  },
});

/**
 * `cn()` is the single className helper.
 *
 * It does two things:
 * - Combines conditional class values (via `clsx`).
 * - Dedupes/conflict-resolves Tailwind utilities (via `tailwind-merge`).
 *
 * Why the overloads?
 * - Base UI primitives support `className` as either a string **or** a `(state) => string` function.
 * - DOM elements (`div`, `textarea`, etc.) only accept `className: string`.
 *
 * So `cn()` is overloaded:
 * - If you pass only string/clsx values, it returns a **string**.
 * - If you pass any function-valued input, it returns a **(state) => string** function.
 *
 * Examples:
 * ```ts
 * // DOM element (string only)
 * <div className={cn("p-4", isActive && "bg-muted")} />
 *
 * // Base UI primitive (state function)
 * <SomeBaseUiThing
 *   className={cn(
 *     "px-2",
 *     (s) => s.disabled && "opacity-50",
 *     (s) => s.active && "bg-muted",
 *   )}
 * />
 *
 * // Important: DOM elements only accept string className.
 * // So only pass string/clsx values to `cn()` for DOM elements.
 * ```
 */

type CnValue<State> = ClassValue | ((state: State) => ClassValue);

export function cn(...inputs: ClassValue[]): string;
export function cn<State>(...inputs: CnValue<State>[]): (state: State) => string;
export function cn<State>(...inputs: CnValue<State>[]) {
  const hasFn = inputs.some((v) => typeof v === "function");

  if (!hasFn) {
    return twMerge(clsx(inputs as ClassValue[]));
  }

  return (state: State) => {
    const resolved = inputs.map((v) =>
      typeof v === "function" ? (v as (s: State) => ClassValue)(state) : v,
    );

    return twMerge(clsx(resolved as ClassValue[]));
  };
}
